const NotFoundError = require(APP_PATH + '/infrastructure/exceptions/NotFoundError')
const ValidationError = require(APP_PATH + '/infrastructure/exceptions/ValidationError')

class UserController {
  '@Inject (app.services.UserService)'
  constructor(userService) {
    /**
     * @type {UserService}
     * @private
     */
    this._userService = userService
  }

  async list(req, res, next) {
    try {
      const userDtoList = await this._userService.listAll()
      res.status(200).send(userDtoList.map(dto => dto.present()))
    } catch (e) {
      next(e)
    }
  }

  async create(req, res, next) {
    try {
      const email = req.body.email
      if (!email || !/^\w+@\w+\.\w+$/.test(email) || !email.length > 500) {
        throw new ValidationError(`Email is not valid`)
      }

      const password = req.body.password
      if (!password || !/^\w{8,30}$/.test(password)) {
        throw new ValidationError(`Password is not valid`)
      }

      const userDto = await this._userService.register({email, password})

      res.status(201).send(userDto.present())

    } catch (e) {
      next(e)
    }
  }


  async getById(req, res, next) {
    try {
      const id = req.params.id

      if (!id || !/\d+/.test(id)) {
        throw new ValidationError(`id is not valid!`)
      }

      const userDto = await this._userService.getById(id)

      res.status(200).send(userDto.present())
    } catch (e) {
      next(e)
    }
  }

  async deleteById(req, res, next) {
    try {
      const id = req.params.id

      if (!id || !/\d+/.test(id)) {
        throw ValidationError(`id is not valid!`)
      }

      await this._userService.deleteById(id)

      res.status(200).send()
    } catch (e) {
      next(e)
    }
  }

  async update(req, res, next) {
    try {
      const id = req.params.id

      if (!id || !/\d+/.test(id)) {
        throw ValidationError(`id is not valid!`)
      }

      const email = req.body.email
      if (!email || !/^\w+@\w+\.\w+$/.test(email) || !email.length > 500) {
        throw new ValidationError(`Email is not valid`)
      }

      await this._userService.update(id, {email})

      res.status(204).send()
    } catch (e) {
      next(e)
    }
  }
}

module.exports = UserController
