const fs = require('fs')

/**
 * @extends {BasicServiceProvider}
 */
class DataBaseServiceProvider extends require(APP_PATH + '/infrastructure/contracts/BasicServiceProvider') {
  /**
   * @param {IContainer} container
   */
  init(container) {
    container.register('mongoDBAccessor', require(APP_PATH + '/infrastructure/MongoDBAccessor'))
      .dependencies('config')
      .singleton()

    container.bind('dbAccessor', 'mongoDBAccessor')
  }

  /**
   * @param {IContainer} container
   */
  boot(container) {

  }
}

module.exports = DataBaseServiceProvider
