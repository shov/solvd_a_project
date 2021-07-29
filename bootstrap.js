//path
const nodePath = require('path')
global.APP_PATH = nodePath.resolve(__dirname)

//Logger
/** @type {ILogger} */
const logger = new (require(APP_PATH + '/infrastructure/Logger'))()

//env
require('dotenv').config({path: APP_PATH + '/.env'})


/** @type {App} */
const app = new (require(APP_PATH + '/infrastructure/App'))(logger)

module.exports = app
