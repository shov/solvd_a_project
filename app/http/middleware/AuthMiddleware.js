const UnauthorizedError = require(APP_PATH + '/infrastructure/exceptions/UnauthorizedError')

class AuthMiddleware {
  '@Inject (app.services.TokenService)'
  constructor(tokenService) {
    /**
     * @type {TokenService}
     * @private
     */
    this._tokenService = tokenService
  }

  async handle(req, res, next) {

    const token = (req.headers.authorization || '').replace(/^Bearer\s(.*)$/, '$1')
    if(!token) {
      next(new UnauthorizedError(`Token's invalid`))
      return
    }

    const payload = await this._tokenService.verify(token)

    if(!payload) {
      next(new UnauthorizedError(`Token's invalid`))
      return
    }

    req.userId = payload.sub
    next()
  }
}

module.exports = AuthMiddleware
