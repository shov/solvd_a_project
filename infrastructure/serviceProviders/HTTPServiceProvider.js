const fs = require('fs')

/**
 * @extends {BasicServiceProvider}
 */
class HTTPServiceProvider extends require(APP_PATH + '/infrastructure/contracts/BasicServiceProvider') {
  /**
   * @param {IContainer} container
   */
  init(container) {
    // getting routeList
    const routeList = fs.readdirSync(APP_PATH + '/routes')
      .map(fileName => {
        if (!/\.js$/.test(fileName)) {
          return []
        }
        return require(APP_PATH + '/routes/' + fileName)
      }).flat(Infinity)

    container.register('routeList', routeList).value()

    container.register('router', require(APP_PATH + '/infrastructure/Router'))
      .dependencies('container')

    container.register('frontController', require(APP_PATH + '/infrastructure/FrontController'))
      .singleton()

    const frontController = container.get('frontController')

    container.register('http', require('http').createServer(frontController.handle.bind(frontController)))
      .value()
  }

  /**
   * @param {IContainer} container
   */
  boot(container) {
    const routeList = container.get('routeList')
    /** @type {Router} */
    const router = container.get('router')
    router.parse(routeList)

    const frontController = container.get('frontController')
    frontController.setRouter(router)

    /** @type {NodeJS.EventEmitter} */
    const bus = container.get('systemBus')
    const logger = container.get('logger')

    bus.on('app_start', () => {
      //http listen
      container.get('http').listen(process.env.PORT || 8080, process.env.HOST || 'localhost', () => {
        logger.info('Server started. Listening...')
      })
    })
  }
}

module.exports = HTTPServiceProvider
