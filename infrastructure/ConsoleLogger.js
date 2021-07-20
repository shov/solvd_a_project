const ILogger = require("./contracts/ILogger")

/**
 * @implements {ILogger}
 */
class ConsoleLogger extends ILogger {

  error(...args) {
    console.error(...args)
  }

  info(...args) {
    console.info(...args)
  }

  warn(...args) {
    console.warn(...args)
  }
}

module.exports = ConsoleLogger
