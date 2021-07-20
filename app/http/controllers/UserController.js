const NotFoundError = require(APP_PATH + '/infrastructure/exceptions/NotFoundError')
const ValidationError = require(APP_PATH + '/infrastructure/exceptions/ValidationError')

class UserController {
  '@Inject (app.models.UserModel)'
  constructor(userModel) {
    /**
     * @type {UserModel}
     * @private
     */
    this._userModel = userModel
  }

  async list(req, res, next) {
    try {
      const userList = await this._userModel.fetchAll()

      res.writeHead(200, {'Content-type': 'application/json'})
      res.end(JSON.stringify({
        users: userList.map(u => ({id: u.id, email: u.email}))
      }))
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

      const user = await this._userModel.create({email, password})

      res.writeHead(201, {'Content-type': 'application/json'})
      res.end(JSON.stringify({
        id: user.id,
        email: user.email,
      }))
    } catch (e) {
      next(e)
    }
  }

  async getById(req, res, next) {
    try {
      const id = req.params.id

      if (!id || !/\w+/.test(id)) {
        throw new ValidationError(`id is not valid!`)
      }

      const user = await this._userModel.getById(id)

      res.writeHead(200, {'Content-type': 'application/json'})
      res.end(JSON.stringify({
        id: user.id,
        email: user.email,
      }))
    } catch (e) {
      next(e)
    }
  }

  async deleteById(req, res, next) {
    try {
      const id = req.params.id

      if (!id || !/\w+/.test(id)) {
        throw ValidationError(`id is not valid!`)
      }

      const user = await this._userModel.deleteById(id)

      res.writeHead(200, {'Content-type': 'application/json'})
      res.end()
    } catch (e) {
      next(e)
    }
  }

  async update(req, res, next) {
    try {
      const id = req.params.id

      if (!id || !/\w+/.test(id)) {
        throw ValidationError(`id is not valid!`)
      }

      const email = req.body.email
      if (!email || !/^\w+@\w+\.\w+$/.test(email) || !email.length > 500) {
        throw new ValidationError(`Email is not valid`)
      }

      await this._userModel.update(id, {email})

      res.writeHead(204, {'Content-type': 'application/json'})
      res.end()
    } catch (e) {
      next(e)
    }
  }
}

module.exports = UserController
