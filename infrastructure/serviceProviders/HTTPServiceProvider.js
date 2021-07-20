const fs = require('fs')
const expressFrontControllerFactory = require('express')
const bodyParser = require('body-parser')

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

    const expressFrontController = expressFrontControllerFactory()
    expressFrontController.use(bodyParser.json({limit: '2mb'}))

    container.register('expressFrontController', expressFrontController).value()

    container.register('http', require('http').createServer(expressFrontController))
      .value()

    container.register('httpErrorHandler', require(APP_PATH + '/infrastructure/HTTPErrorHandler'))
      .singleton()
  }

  /**
   * @param {IContainer} container
   */
  boot(container) {
    const routeList = container.get('routeList')
    /** @type {Router} */
    const router = container.get('router')
    router.parse(routeList)

    const expressFrontController = container.get('expressFrontController')
    expressFrontController.use(router.getExpressRouter())

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
