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

    return this
  }

  boot() {

    this._router.set('default', this._router.resolve('get **404'))

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
  }
}

module.exports = App
