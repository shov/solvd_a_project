const fs = require('fs')

/**
 * @extends {BasicServiceProvider}
 */
class SystemServiceProvider extends require(APP_PATH + '/infrastructure/contracts/BasicServiceProvider') {
  /**
   * @param {IContainer} container
   */
  init(container) {
    // config
    const config = {}
    container.register('config', config).value()

    fs.readdirSync(APP_PATH + '/config')
      .forEach(fileName => {
        if (!/\.js$/.test(fileName)) {
          return []
        }
        const configKey = fileName.replace(/^(.*)?\/(\w+)\.js$/g, '$2').replace(/\.js/, '')

        config[configKey] = require(APP_PATH + '/config/' + fileName)
      })

    // system bus
    const bus = new (require('events')).EventEmitter()
    container.register('systemBus', bus).value()
    bus.setMaxListeners(300) // up to you

    // DB
    container.register('mongoDBAccessor', require(APP_PATH + '/infrastructure/MongoDBAccessor'))
      .dependencies('config')
      .singleton()

    container.bind('dbAccessor', 'mongoDBAccessor')

    container.register('dependencyInjector', require(APP_PATH + '/infrastructure/DependencyInjector'))
      .dependencies('container')
      .singleton()


    // APP service providers
    bus.on('app_kick_user_providers_init', () => {
      if (config.app && config.app.providers) {
        config.app.providers.forEach(appProvider => {
          appProvider.init(container)
        })
      }
    })
  }

  /**
   * @param {IContainer} container
   */
  boot(container) {
    container.get('router').set('default', container.get('router').get('get **404'))

    const bus = container.get('systemBus')

    // APP service providers
    bus.on('app_kick_user_providers_boot', () => {
      const config = container.get('config')
      if (config.app && config.app.providers) {
        config.app.providers.forEach(appProvider => {
          appProvider.boot(container)
        })
      }
    })
  }
}

module.exports = SystemServiceProvider
