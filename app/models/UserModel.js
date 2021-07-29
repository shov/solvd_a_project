const ValidationError = require(APP_PATH + '/infrastructure/exceptions/ValidationError')
const crypto = require('crypto')
const {ObjectId} = require("mongodb")

class UserModel {

  constructor(dbAccessor) {
    /**
     * @type {IDBAccessor}
     * @private
     */
    this._dbAccessor = dbAccessor
    this._name = 'users'
    this._hadIntit = false

    this.SALT = 'qwrjognqwojbvnq3-ribn3-9ubheqr-ughqoghnwrobkenboej'
  }

  async init() {
    if (!this._hadIntit) {
      await this._dbAccessor.registerSchema(this._name, ['email'])
      this._hadIntit = true
    }
  }

  async fetchAll() {
    await this.init()
    return await this._dbAccessor.fetchAll(this._name)
  }

  async create({email, password}) {
    await this.init()
    const hash = this._hashPassword(password)
    return await this._dbAccessor.create(this._name, {email, hash})
  }

  /**
   * @param {string} id
   * @param {string} password
   * @return {Promise<boolean>}
   */
  async checkPassword(id, password) {
    await this.init()
    const hash = this._hashPassword(password)
    return await this._dbAccessor.exec(async ({db, client}) => {
      return !!(await db.collection(this._name).findOne({
        _id: ObjectId(id), hash
      }))
    })
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

  _hashPassword(password) {
    const hmac = crypto.createHmac('sha512', this.SALT)
    hmac.update(password)
    return hmac.digest('hex')
  }
}

module.exports = UserModel
