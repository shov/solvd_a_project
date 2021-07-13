const ValidationError = require(APP_PATH + '/infrastructure/exceptions/ValidationError')

class UserModel {
  /**
   * @param {IDBAccessor} dbAccessor
   */
  constructor(dbAccessor) {
    this._dbAccessor = dbAccessor
    this._name = 'users'
  }

  async init() {
    await this._dbAccessor.registerSchema(this._name, ['email'])
  }

  async fetchAll() {
    return await this._dbAccessor.fetchAll(this._name)
  }

  async create({email}) {
    return  await this._dbAccessor.create(this._name, {email})
  }

  async getById(id) {
    return await this._dbAccessor.getById(this._name, id)
  }

  async deleteById(id) {
    return await this._dbAccessor.deleteById(this._name, id)
  }

  async update(id, {email}) {
    return await this._dbAccessor.update(this._name, {id, email})
  }

}

module.exports = UserModel
