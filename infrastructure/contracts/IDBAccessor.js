/**
 * @interface IDBAccessor
 */
class IDBAccessor {

  async registerSchema(name, uniqInx) {
    throw new Error('Implement it!')
  }

  async fetchAll(name) {
    throw new Error('Implement it!')
  }

  async getById(name, id) {
    throw new Error('Implement it!')
  }

  async create(name, data) {
    throw new Error('Implement it!')
  }

  async deleteById(name, id) {
    throw new Error('Implement it!')
  }

  async update(name, data) {
    throw new Error('Implement it!')
  }

  async truncate(name) {
    throw new Error('Implement it!')
  }

  async exec(action) {
    throw new Error('Implement it!')
  }
}

module.exports = IDBAccessor
