'use strict'

const fs = require('fs')
if (!fs.existsSync(APP_PATH + '/logs')) {
  fs.mkdirSync(APP_PATH + '/logs')
}

const {createLogger, format, transports} = require('winston')
require('winston-daily-rotate-file')

const config = options => {
  return Object.keys(options).reduce((result, key) => {
    result[key] = options[key]
    return result
  }, {
    filename: APP_PATH + '/logs/default-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
  })
}


class Logger {
  constructor(mode = `${process.env.ENV || Logger.MODE.DEFAULT}_`) {
    this._winstonLogger = createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.json()
      ),
      transports: [
        new transports.Console({format: format.simple()}),
        new (transports.DailyRotateFile)(config({filename: APP_PATH + `/logs/${mode}default-%DATE%.log`})),
        new (transports.DailyRotateFile)(config({filename: APP_PATH + `/logs/${mode}warn-%DATE%.log`, level: 'warn'})),
        new (transports.DailyRotateFile)(config({
          filename: APP_PATH + `/logs/${mode}error-%DATE%.log`,
          level: 'error'
        })),
      ],
      exitOnError: false
    })
  }

  info(...message) {
    this._winstonLogger.log({
      level: 'info',
      message
    })
  }

  log(...message) {
    this.info(...message)
  }

  warn(...message) {
    this._winstonLogger.log({
      level: 'warn',
      message
    })
  }

  error(...message) {
    this._winstonLogger.log({
      level: 'error',
      message
    })
  }

}

Logger.MODE = {
  DEFAULT: 'no_env'
}

module.exports = Logger
