const fs = require('fs')

class App {
  _routeList
  _router
  _http

  /**
   * @type {FrontController}
   * @private
   */
  _frontController

  _container = {}

  /**
   * @param {ILogger} logger
   */
  constructor(logger) {
    /**
     * @type {ILogger}
     * @private
     */
    this._logger = logger
  }

  init() {
    const self = this
    global.app = {
      get (reference) {
        return self.get(reference)
      }
    }

    // getting routeList
    this._routeList = fs.readdirSync(APP_PATH + '/routes')
      .map(fileName => {
        if (!/\.js$/.test(fileName)) {
          return []
        }
        return require(APP_PATH + '/routes/' + fileName)
      }).flat(Infinity)

    // router
    this._router = new (require(APP_PATH + '/infrastructure/Router'))(this._routeList)

    // front controller
    this._frontController = new (require(APP_PATH + '/infrastructure/FrontController'))(this._router)

    //ioc
    this._container['dbAccessor'] = new (require(APP_PATH + '/infrastructure/FSDBAccessor'))()
    this._container['UserModel'] = new (require(APP_PATH + '/models/UserModel'))(app.get('dbAccessor'))
    return this
  }

  boot() {

    this._router.set('default', this._router.get('get **404'))

    //init models
    this._container['UserModel'].init()

    // set handler of http for server
    this._http = require('http').createServer(this._frontController.handle.bind(this._frontController))
    return this
  }

  start() {
    //http listen
    this._http.listen(process.env.PORT || 8080, process.env.HOST || 'localhost', () => {
      this._logger.info('Server started. Listening...')
    })
  }

  get(reference) {
    if('logger' === reference) {
      return this._logger
    }

    return this._container[reference] || undefined
  }
}

module.exports = App
