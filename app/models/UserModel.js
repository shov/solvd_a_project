const ValidationError = require(APP_PATH + '/infrastructure/exceptions/ValidationError')

class UserModel {
  '@Inject (dbAccessor)'
  constructor(dbAccessor) {
    /**
     * @type {IDBAccessor}
     * @private
     */
    this._dbAccessor = dbAccessor
    this._name = 'users'
    this._hadIntit = false
  }

  async init() {
    if(!this._hadIntit) {
      await this._dbAccessor.registerSchema(this._name, ['email'])
      this._hadIntit = true
    }
  }

  async fetchAll() {
    await this.init()
    return await this._dbAccessor.fetchAll(this._name)
  }

  async create({email}) {
    await this.init()
    return  await this._dbAccessor.create(this._name, {email})
  }

  async getById(id) {
    await this.init()
    return await this._dbAccessor.getById(this._name, id)
  }

  async deleteById(id) {
    await this.init()
    return await this._dbAccessor.deleteById(this._name, id)
  }

  async update(id, {email}) {
    await this.init()
    return await this._dbAccessor.update(this._name, {id, email})
  }

  async removeAll() {
    await this.init()
    return await this._dbAccessor.truncate(this._name)
  }

}

module.exports = UserModel
