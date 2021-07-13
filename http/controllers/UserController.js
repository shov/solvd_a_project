const NotFoundError = require(APP_PATH + '/infrastructure/exceptions/NotFoundError')
const ValidationError = require(APP_PATH + '/infrastructure/exceptions/ValidationError')

class UserController {
  static async list(req, res) {
    await UserController._wrapHandler(req, res, async () => {
      /** @type {UserModel} */
      const userModel = app.get('UserModel')

      const userList = await userModel.fetchAll()

      res.writeHead(200, {'Content-type': 'application/json'})
      res.end(JSON.stringify({
        users: userList.map(u => ({id: u.id}))
      }))
    })
  }

  static async create(req, res) {
    await UserController._wrapHandler(req, res, async () => {
      /** @type {UserModel} */
      const userModel = app.get('UserModel')

      const email = req.body.email
      if(!email || !/^\w+@\w+\.\w+$/.test(email) || !email.length > 500) {
        throw new ValidationError(`Email is not valid`)
      }

      const user = await userModel.create({email})

      res.writeHead(201, {'Content-type': 'application/json'})
      res.end(JSON.stringify({
        id: user.id,
        email: user.email,
      }))
    })
  }

  static async getById(req, res) {
    await UserController._wrapHandler(req, res, async () => {
      /** @type {UserModel} */
      const userModel = app.get('UserModel')

      const id = req.params.id

      if(!id || !/\w+/.test(id)) {
        throw new ValidationError(`id is not valid!`)
      }

      const user = await userModel.getById(id)

      res.writeHead(200, {'Content-type': 'application/json'})
      res.end(JSON.stringify({
        id: user.id,
        email: user.email,
      }))
    })
  }

  static async deleteById(req, res) {
    await UserController._wrapHandler(req, res, async () => {
      /** @type {UserModel} */
      const userModel = app.get('UserModel')

      const id = req.params.id

      if(!id || !/\w+/.test(id)) {
        throw ValidationError(`id is not valid!`)
      }

      const user = await userModel.deleteById(id)

      res.writeHead(200, {'Content-type': 'application/json'})
      res.end()
    })
  }

  static async update(req, res) {
    await UserController._wrapHandler(req, res, async () => {
      /** @type {UserModel} */
      const userModel = app.get('UserModel')

      const id = req.params.id

      if(!id || !/\w+/.test(id)) {
        throw ValidationError(`id is not valid!`)
      }

      const email = req.body.email
      if(!email || !/^\w+@\w+\.\w+$/.test(email) || !email.length > 500) {
        throw new ValidationError(`Email is not valid`)
      }

      await userModel.update(id, {email})

      res.writeHead(204, {'Content-type': 'application/json'})
      res.end()
    })
  }

  static async _wrapHandler(req, res, action) {
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
