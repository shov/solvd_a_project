const ValidationError = require(APP_PATH + '/infrastructure/exceptions/ValidationError')
const NotFoundError = require(APP_PATH + '/infrastructure/exceptions/NotFoundError')

/**
 * @implements {IDBAccessor}
 */
class MemDBAccessor {

  _db = {}

  /**
   * @param {string} name
   * @param {string[]} uniqInx
   * @return {Promise<void>}
   */
  async registerSchema(name, uniqInx) {
    if(this._db[name]) {
      return
    }

    if(uniqInx.includes('id')) {
      throw new Error('No allowed to create unique index for id')
    }

    this._db[name] = {
      storage: {},
      uniqInx: Object.fromEntries(uniqInx.map(idxName => ([idxName, {}]))),
      idSeq: 1,
      get nextId() {
        return this.idSeq++
      }
    }
  }

  async create(name, data) {
    this._makeSureCollection(name)
    const collection = this._db[name]

    Object.keys(collection.uniqInx).forEach(idxName => {
      if(collection.uniqInx[idxName][data[idxName]]) {
        throw new ValidationError(`There is already ${name} record with a such ${idxName}`)
      }
    })

    const newRecord = {
      ...data,
      id: collection.nextId
    }

    collection.storage[newRecord.id] = newRecord
    Object.keys(collection.uniqInx).forEach(idxName => {
      collection.uniqInx[idxName][newRecord[idxName]] = newRecord
    })

    return JSON.parse(JSON.stringify(newRecord))
  }

  async deleteById(name, id) {
    this._makeSureCollection(name)
    const collection = this._db[name]
    const _id = this._cleanId(id)

    if(!collection.storage[_id]) {
      return
    }

    const record = collection.storage[_id]

    Object.keys(collection.uniqInx).forEach(idxName => {
      delete collection.uniqInx[idxName][record[idxName]]
    })
    delete collection.storage[_id]
  }

  async fetchAll(name) {
    this._makeSureCollection(name)
    const collection = this._db[name]
    return Object.values(collection.storage).map(record => JSON.parse(JSON.stringify(record)))
  }

  async getById(name, id) {
    this._makeSureCollection(name)
    const collection = this._db[name]
    const _id = this._cleanId(id)

    if(!collection.storage[_id]) {
      throw new NotFoundError(`There is no ${name} record with id of ${_id}`)
    }

    return JSON.parse(JSON.stringify(collection.storage[_id]))
  }

  async update(name, data) {
    this._makeSureCollection(name)
    const collection = this._db[name]
    const _id = this._cleanId(data.id)

    if(!_id || !collection.storage[_id]) {
      throw new NotFoundError(`There is no ${name} record with id of ${_id}`)
    }

    Object.keys(collection.uniqInx).forEach(idxName => {
      if(collection.uniqInx[idxName][data[idxName]]) {
        throw new ValidationError(`There is already ${name} record with a such ${idxName}`)
      }
    })

    const preparedData = {...data}
    delete preparedData.id
    collection.storage[_id] = {...preparedData}

    return JSON.parse(JSON.stringify(collection.storage[_id]))
  }

  _makeSureCollection(name) {
    if(!this._db[name]) {
      throw new TypeError(`Collection ${name} doesn't exist`)
    }
  }

  _cleanId(id) {
    return Number(id)
  }
}

module.exports = MemDBAccessor
