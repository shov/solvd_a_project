const {MongoClient, ObjectId} = require('mongodb')
const NotFoundError = require(APP_PATH + '/infrastructure/exceptions/NotFoundError')

/**
 * @implements {IDBAccessor}
 */
class MongoDBAccessor {

  constructor(config) {
    this._client = new MongoClient(config.db.getCreds().uri, {useNewUrlParser: true, useUnifiedTopology: true})
    this._dbName = config.db.getCreds().dbName
  }

  async registerSchema(name, uniqInx) {
    await this._exec(async () => {
      const db = this._client.db(this._dbName)
      for(let indexName of uniqInx) {
        await db.collection(name).createIndex({[indexName]: 1}, {unique: true})
      }
    })
  }

  async create(name, data) {
    return await this._exec(async () => {
      const db = this._client.db(this._dbName)
      const body = {...data}
      delete body.id
      const result = await db.collection(name).insertOne(body)
      return {...body, id: result.insertedId.toString()}
    })
  }

  async deleteById(name, id) {
    await this._exec(async () => {
      const db = this._client.db(this._dbName)
      const _id = ObjectId(id)
      await db.collection(name).deleteOne({_id})
    })
  }

  async fetchAll(name) {
    return await this._exec(async () => {
      const db = this._client.db(this._dbName)
      const result = await db.collection(name).find({}).toArray()

      return result.map(srcRec => {
        const record = {...srcRec}
        record.id = record._id.toString()
        delete record._id
        return record
      })
    })
  }

  async getById(name, id) {
    return await this._exec(async () => {
      const db = this._client.db(this._dbName)
      const _id = ObjectId(id)
      const result = await db.collection(name).findOne({_id})
      if(!result) {
        throw new NotFoundError(`${name} record not found for id ${id}`)
      }

      delete result._id
      return {...result, id}
    })
  }

  async update(name, data) {
    return await this._exec(async () => {
      const db = this._client.db(this._dbName)
      if(!data.id) {
        throw new TypeError('To update you must set id')
      }

      const _id = ObjectId(data.id)
      const body = [data].map(({_id, ...d}) => ({...d}))[0]

      await db.collection(name).updateOne({_id}, {$set: body})

      return {id: data.id, ...body}
    })
  }

  async _exec(action) {
    //open
    await this._client.connect()

    const result = await Promise.resolve(action())

    //close
    this._client.close().catch(e => {
      app.get('logger').error(e.message || e)
    })

    return result
  }

  async truncate(name) {
    await this._exec(async () => {
      const db = this._client.db(this._dbName)
      await db.collection(name).deleteMany({})
    })
  }
}

module.exports = MongoDBAccessor
