'use strict'

const knex = require('knex')

/**
 * Handle migrations jobs
 */
class MigrationsManager {
  /**
   * @param {ILogger} logger
   * @param {{}} config
   * @param {DBConnectionProvider} dbConnectionProvider
   */
  constructor(logger, config, dbConnectionProvider) {

    /**
     * @type {ILogger}
     * @private
     */
    this._logger = logger

    const creds = dbConnectionProvider.getConnectionConfig()

    if(!creds.migrations) {
      creds.migrations = {}
    }

    if(!creds.migrations.tableName) {
      creds.migrations.tableName = 'migrations'
    }

    if(!creds.migrations.directory) {
      creds.migrations.directory = APP_PATH + '/database/migrations'
    }

    /**
     * {{}}
     * @private
     */
    this._migrationsConfig = creds

    /**
     * It's updated with defaults if config creds contain no everything
     * @type {QueryInterface}
     * @private
     */
    this._dbConnection = knex(creds)
  }

  /**
   * @return {{}}
   */
  getMigrationConfig() {
    return this._migrationsConfig
  }

  /**
   * Refresh migrations
   * @return {Promise<void>}
   */
  async refresh () {
    if(process.env.ENV !== 'testing') {
      throw new Error(`Refreshing is for testing now!`)
    }

    await this._dbConnection.migrate.rollback(null, true)

    await this._dbConnection.migrate.latest()
  }
}

module.exports = MigrationsManager
