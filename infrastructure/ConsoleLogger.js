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
}

module.exports = ConsoleLogger
