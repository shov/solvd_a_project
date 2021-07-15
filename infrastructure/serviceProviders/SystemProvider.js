const fs = require('fs')

/**
 * @extends {BasicServiceProvider}
 */
class SystemProvider extends require(APP_PATH + '/infrastructure/contracts/BasicServiceProvider') {
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
      .dependencies('routeList')

    container.register('frontController', require(APP_PATH + '/infrastructure/FrontController'))
      .dependencies('router')
      .singleton()

    container.register('mongoDBAccessor', require(APP_PATH + '/infrastructure/MongoDBAccessor'))
      .dependencies('config')
      .singleton()

    container.bind('dbAccessor', 'mongoDBAccessor')

    container.register('mongoDBAccessor', require(APP_PATH + '/infrastructure/MongoDBAccessor'))
      .dependencies('config')
      .singleton()

    //ioc
    // this._container['dbAccessor'] = new (require(APP_PATH + '/infrastructure/MongoDBAccessor'))(app.get('config'))
    // this._container['UserModel'] = new (require(APP_PATH + '/app/models/UserModel'))(app.get('dbAccessor'))

    const frontController = container.get('frontController')
    container.register('http', require('http').createServer(frontController.handle.bind(frontController)))
      .value()
  }

  /**
   * @param {IContainer} container
   */
  boot(container) {
    container.get('router').set('default', this._router.get('get **404'))
  }
}

module.exports = SystemProvider
