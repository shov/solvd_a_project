const ValidationError = require(APP_PATH + '/infrastructure/exceptions/ValidationError')
const UnauthorizedError = require(APP_PATH + '/infrastructure/exceptions/UnauthorizedError')

class TokenController {
  '@Inject (app.services.TokenService)'
  '@Inject (app.models.UserModel)'
  constructor(tokenService, userModel) {
    /**
     * @type {TokenService}
     * @private
     */
    this._tokenService = tokenService

    /**
     * @type {UserModel}
     * @private
     */
    this._userModel = userModel
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
      const passwordCorrect = this._userModel.checkPassword(id, password)
      if(!passwordCorrect) {
        throw new UnauthorizedError('Invalid credentials')
      }

      //create new token and return it
      const token = await this._tokenService.create({id})

      res.send(201, {
        token
      })
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
