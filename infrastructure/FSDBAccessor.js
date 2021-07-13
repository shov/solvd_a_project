const ValidationError = require(APP_PATH + '/infrastructure/exceptions/ValidationError')
const NotFoundError = require(APP_PATH + '/infrastructure/exceptions/NotFoundError')
const fs = require('fs')


/**
 * @implements {IDBAccessor}
 */
class FSDBAccessor {

  _db = {}

  _dataPath(name) {
    return `${APP_PATH}${process.env.FS_DB}/${name}.json`
  }

  //dump to fs
  async dump(name) {
    this._makeSureCollection(name)
    await fs.promises.writeFile(this._dataPath(name), JSON.stringify({
      storage: this._db[name].storage,
      uniqInx: Object.keys(this._db[name].uniqInx),
      idSeq: this._db[name].idSeq,
    }))
  }

  /**
   * @param {string} name
   * @return {Promise<boolean|number>}
   */
  async fresh(name) {

    try {
      const result = await fs.promises.access(this._dataPath(name), fs.constants.F_OK)
      app.get('logger').info(result)
    } catch (e) {
      return false
    }

    const content = (await fs.promises.readFile(this._dataPath(name))).toString().trim()
    const loaded = JSON.parse(content)

    this._db[name] = {
      storage: loaded.storage,
      uniqInx: Object.fromEntries(loaded.uniqInx.map(idxName => ([idxName, {}]))),
      idSeq: loaded.idSeq,
      get nextId() {
        return this.idSeq++
      }
    }

    Object.values(this._db[name].storage).forEach(record => {
      loaded.uniqInx.forEach(idxName => {
        this._db[name].uniqInx[idxName][record[idxName]] = record
      })
    })

    return true
  }

  /**
   * read fs
   * @param {string} name
   * @param {string[]} uniqInx
   * @return {Promise<void>}
   */
  async registerSchema(name, uniqInx) {
    if (this._db[name]) {
      return
    }

    if (uniqInx.includes('id')) {
      throw new Error('No allowed to create unique index for id')
    }


    //try load from fs
    const loaded = await this.fresh(name)

    if (loaded) {
      return
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
    await this.fresh(name)
    const collection = this._db[name]

    Object.keys(collection.uniqInx).forEach(idxName => {
      if (collection.uniqInx[idxName][data[idxName]]) {
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

    this.dump(name).catch(e => {
      app.get('logger').error(e.message, e.stack)
    })

    return JSON.parse(JSON.stringify(newRecord))
  }

  async deleteById(name, id) {
    this._makeSureCollection(name)
    const collection = this._db[name]
    const _id = this._cleanId(id)
    await this.fresh(name)

    if (!collection.storage[_id]) {
      return
    }

    const record = collection.storage[_id]

    Object.keys(collection.uniqInx).forEach(idxName => {
      delete collection.uniqInx[idxName][record[idxName]]
    })
    delete collection.storage[_id]

    this.dump(name).catch(e => {
      app.get('logger').error(e.message, e.stack)
    })
  }

  async fetchAll(name) {
    this._makeSureCollection(name)
    const collection = this._db[name]
    await this.fresh(name)

    return Object.values(collection.storage).map(record => JSON.parse(JSON.stringify(record)))
  }

  async getById(name, id) {
    this._makeSureCollection(name)
    const collection = this._db[name]
    const _id = this._cleanId(id)
    await this.fresh(name)

    if (!collection.storage[_id]) {
      throw new NotFoundError(`There is no ${name} record with id of ${_id}`)
    }

    return JSON.parse(JSON.stringify(collection.storage[_id]))
  }

  async update(name, data) {
    this._makeSureCollection(name)
    const collection = this._db[name]
    const _id = this._cleanId(data.id)
    await this.fresh(name)

    if (!_id || !collection.storage[_id]) {
      throw new NotFoundError(`There is no ${name} record with id of ${_id}`)
    }

    Object.keys(collection.uniqInx).forEach(idxName => {
      if (collection.uniqInx[idxName][data[idxName]]) {
        throw new ValidationError(`There is already ${name} record with a such ${idxName}`)
      }
    })

    const preparedData = {...data}
    delete preparedData.id
    collection.storage[_id] = {...preparedData}

    this.dump(name).catch(e => {
      app.get('logger').error(e.message, e.stack)
    })

    return JSON.parse(JSON.stringify(collection.storage[_id]))
  }

  _makeSureCollection(name) {
    if (!this._db[name]) {
      throw new TypeError(`Collection ${name} doesn't exist`)
    }
  }

  _cleanId(id) {
    return Number(id)
  }
}

module.exports = FSDBAccessor
