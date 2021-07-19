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

  async list(req, res) {
    await this._wrapHandler(req, res, async () => {
      const userList = await this._userModel.fetchAll()

      res.writeHead(200, {'Content-type': 'application/json'})
      res.end(JSON.stringify({
        users: userList.map(u => ({id: u.id, email: u.email}))
      }))
    })
  }

  async create(req, res) {
    await this._wrapHandler(req, res, async () => {
      const email = req.body.email
      if(!email || !/^\w+@\w+\.\w+$/.test(email) || !email.length > 500) {
        throw new ValidationError(`Email is not valid`)
      }

      const user = await this._userModel.create({email})

      res.writeHead(201, {'Content-type': 'application/json'})
      res.end(JSON.stringify({
        id: user.id,
        email: user.email,
      }))
    })
  }

  async getById(req, res) {
    await this._wrapHandler(req, res, async () => {
      const id = req.params.id

      if(!id || !/\w+/.test(id)) {
        throw new ValidationError(`id is not valid!`)
      }

      const user = await this._userModel.getById(id)

      res.writeHead(200, {'Content-type': 'application/json'})
      res.end(JSON.stringify({
        id: user.id,
        email: user.email,
      }))
    })
  }

  async deleteById(req, res) {
    await this._wrapHandler(req, res, async () => {
      const id = req.params.id

      if(!id || !/\w+/.test(id)) {
        throw ValidationError(`id is not valid!`)
      }

      const user = await this._userModel.deleteById(id)

      res.writeHead(200, {'Content-type': 'application/json'})
      res.end()
    })
  }

  async update(req, res) {
    await this._wrapHandler(req, res, async () => {
      const id = req.params.id

      if(!id || !/\w+/.test(id)) {
        throw ValidationError(`id is not valid!`)
      }

      const email = req.body.email
      if(!email || !/^\w+@\w+\.\w+$/.test(email) || !email.length > 500) {
        throw new ValidationError(`Email is not valid`)
      }

      await this._userModel.update(id, {email})

      res.writeHead(204, {'Content-type': 'application/json'})
      res.end()
    })
  }

  async _wrapHandler(req, res, action) {
    try {
      const result = action()
      if (result instanceof Promise) {
        await result
      }
    } catch (e) {
      app.get('logger').error(e.message, e.stack)

      if (e instanceof ValidationError) {
        res.writeHead(400, {'Content-type': 'application/json'})
        res.end(JSON.stringify({
          error: {
            msg: 'Validation error: ' + e.message || '?',
          }
        }))
        return
      }

      if (e instanceof NotFoundError) {
        res.writeHead(404, {'Content-type': 'application/json'})
        res.end(JSON.stringify({
          error: {
            msg: 'NotFound error: ' + e.message || '?',
          }
        }))
        return
      }

      res.writeHead(500, {'Content-type': 'application/json'})
      res.end(JSON.stringify({
        error: {
          msg: 'Unknown error: ' + e.message || '?',
        }
      }))
    }
  }
}

module.exports = UserController
