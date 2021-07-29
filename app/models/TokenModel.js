class TokenModel {


  constructor(dbAccessor) {
    /**
     * @type {IDBAccessor}
     * @private
     */
    this._dbAccessor = dbAccessor
    this._name = 'tokens'
    this._hadIntit = false
  }

  async init() {
    if (!this._hadIntit) {
      await this._dbAccessor.registerSchema(this._name, ['token'])
      this._hadIntit = true
    }
  }

  async create({token, active}) {
    await this.init()
    return await this._dbAccessor.create(this._name, {token, active})
  }

  async update({token, active}) {
    await this.init()
    await this._dbAccessor.exec(async ({db}) => {
      await db.collection(this._name).update({token}, {$set: {active}})
    })
  }

  async delete(token) {
    await this.init()
    await this._dbAccessor.exec(async ({db}) => {
      await db.collection(this._name).deleteOne({token})
    })
  }

  async get(token) {
    await this.init()
    return await this._dbAccessor.exec(async ({db}) => {
      const src = await db.collection(this._name).findOne({token})
      if (!src) {
        return null
      }

      const dto = {...src, id: src._id.toString()}
      delete dto._id

      return dto
    })
  }
}

module.exports = TokenModel
