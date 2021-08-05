const ValidationError = require(APP_PATH + '/infrastructure/exceptions/ValidationError')
const NotFoundError = require(APP_PATH + '/infrastructure/exceptions/NotFoundError')
const UnauthorizedError = require(APP_PATH + '/infrastructure/exceptions/UnauthorizedError')
const ForbiddenError = require(APP_PATH + '/infrastructure/exceptions/ForbiddenError')

class HTTPErrorHandler {
  async handle(e, req, res, next) {

    app.get('logger').warn(e.message, e.stack)

    let statusCode = 500
    switch (true) {
      case (e instanceof ValidationError): {
        statusCode = 400
        break
      }
      case (e instanceof NotFoundError): {
        statusCode = 404
        break
      }
      case (e instanceof UnauthorizedError): {
        statusCode = 401
        break
      }
      case (e instanceof ForbiddenError): {
        statusCode = 403
        break
      }
    }

    res.status(statusCode).send({
      error: {
        msg: e.message || '?',
      }
    })
  }
}

module.exports = HTTPErrorHandler
