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

  _sysProviders = []

  /**
   * @param {ILogger} logger
   */
  constructor(logger) {
    /**
     * @type {ILogger}
     * @private
     */
    this._logger = logger

    /**
     * @type {IContainer}
     * @private
     */
    this._container = new (require(APP_PATH + '/infrastructure/Container'))()
    this._container.register('logger', logger).value()
  }

  init() {
    const self = this
    global.app = {
      get(reference) {
        return self.get(reference)
      }
    }

    //config
    this._config = {}
    this._container.register('config', this._config).value()

    fs.readdirSync(APP_PATH + '/config')
      .forEach(fileName => {
        if (!/\.js$/.test(fileName)) {
          return []
        }
        this._config[fileName.replace(/^(.*)?\/(\w+)\.js$/g, '$2').replace(/\.js/, '')] = require(APP_PATH + '/config/' + fileName)
      })

    //system providers
    fs.readdirSync(APP_PATH + '/infrastructure/serviceProviders')
      .forEach(fileName => {
        if (!/\.js$/.test(fileName)) {
          return []
        }
        this._sysProviders.push(new (require(APP_PATH + '/config/' + fileName))())
      })

    //Init sys providers
    this._sysProviders.forEach(provider => {
      provider.init(this._container)
    })

    return this
  }

  boot() {
    //Boot sys providers
    this._sysProviders.forEach(provider => {
      provider.boot(this._container)
    })

    return this
  }

  start() {
    //http listen
    this._container.get('http').listen(process.env.PORT || 8080, process.env.HOST || 'localhost', () => {
      this._logger.info('Server started. Listening...')
    })
  }

  get(reference) {
    return this._container.get(reference) || undefined
  }
}

module.exports = App
