const knex = require('knex')

/**
 * @extends {BasicServiceProvider}
 */
class DataBaseServiceProvider extends require(APP_PATH + '/infrastructure/contracts/BasicServiceProvider') {
  /**
   * @param {IContainer} container
   */
  init(container) {
    container.register('dbConnectionProvider',
      /** @class DBConnectionProvider */
      {
        _mainConnection: null,
        _creds: null,

        getConnection() {
          if (this._mainConnection) {
            return this._mainConnection
          }

          if (!this._creds) {
            this._fillCreds()
          }

          this._mainConnection = knex(this._creds)
          return this._mainConnection
        },

        getConnectionConfig() {
          if (this._creds) {
            return this._creds
          }

          this._fillCreds()
          return this._creds
        },

        _fillCreds() {
          const config = container.get('config')
          if (!config || !config.db) {
            throw new Error('Cannot find db config!')
          }

          const creds = config.db.getCreds()
          if (!creds) {
            throw new Error('Cannot get creds from db config!')
          }

          this._creds = creds
        }
      }).value()

    container.register('dbConnection', () => {
      return container.get('dbConnectionProvider').getConnection()
    }).factory()

    container.register('migrationsManager', require(APP_PATH + '/infrastructure/MigrationsManager'))
      .dependencies('logger', 'config', 'dbConnectionProvider')
  }

  /**
   * @param {IContainer} container
   */
  boot(container) {

  }
}

module.exports = DataBaseServiceProvider
