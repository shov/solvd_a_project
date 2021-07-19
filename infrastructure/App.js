
class App {
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
    this._container.register('container', this._container).value()
    this._container.register('logger', logger).value()
  }

  init() {
    const self = this
    global.app = {
      get(reference) {
        return self.get(reference)
      }
    }

    //system providers
    this._sysProviders.push(new (require(APP_PATH + '/infrastructure/serviceProviders/SystemServiceProvider'))())
    this._sysProviders.push(new (require(APP_PATH + '/infrastructure/serviceProviders/DataBaseServiceProvider'))())
    this._sysProviders.push(new (require(APP_PATH + '/infrastructure/serviceProviders/HTTPServiceProvider'))())

    //Init sys providers
    this._sysProviders.forEach(provider => {
      provider.init(this._container)
    })
    this._container.get('systemBus').emit('app_kick_user_providers_init')

    return this
  }

  boot() {
    //Boot sys providers
    this._sysProviders.forEach(provider => {
      provider.boot(this._container)
    })
    this._container.get('systemBus').emit('app_kick_user_providers_boot')

    return this
  }

  start() {
    this._container.get('systemBus').emit('app_start')
  }

  get(reference) {
    return this._container.get(reference) || undefined
  }
}

module.exports = App
