'use strict'

const app = require('./bootstrap')

app.init().boot()

/**
 * @type {MigrationManager}
 */
const migrationManager = app.get('migrationManager')

const knexConfig = migrationManager.getMigrationConfig()

module.exports = knexConfig
