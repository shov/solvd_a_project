const ValidationError = require(APP_PATH + '/infrastructure/exceptions/ValidationError')
const UnauthorizedError = require(APP_PATH + '/infrastructure/exceptions/UnauthorizedError')

class TokenController {
  '@Inject (app.services.TokenService)'
  '@Inject (app.services.UserService)'
  /**
   * @param {TokenService} tokenService
   * @param {UserService} userService
   */
  constructor(tokenService, userService) {
    /**
     * @type {TokenService}
     * @private
     */
    this._tokenService = tokenService

    /**
     * @type {UserService}
     * @private
     */
    this._userService = userService
  }

  async create(req, res, next) {
    try {
      const id = req.params.userId

      if (!id || !/\w+/.test(id)) {
        throw new ValidationError(`id is not valid!`)
      }

      const password = req.body.password
      if (!password || !/^\w{8,30}$/.test(password)) {
        throw new ValidationError(`Password is not valid`)
      }

      //check
      const userDto = await this._userService.checkPassword(id, password)
      if(!userDto) {
        throw new UnauthorizedError('Invalid credentials')
      }

      //create new token and return it
      const tokenDto = await this._tokenService.create(userDto)

      res.status(201).send({token: tokenDto.content})
    } catch (e) {
      next(e)
    }
  }

  async delete(req, res, next) {
    try {
      const token = req.params.token

      if (!token) {
        throw new ValidationError(`token is not valid!`)
      }

      //remove token (set as inactive)
      await this._tokenService.delete(token)

      res.send(200)
    } catch (e) {
      next(e)
    }
  }


}

module.exports = TokenController
