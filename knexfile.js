'use strict'

const app = require('./bootstrap')

app.init().boot()

/**
 * @type {MigrationsManager}
 */
const migrationsManager = app.get('migrationsManager')

const knexConfig = migrationsManager.getMigrationConfig()

module.exports = knexConfig
