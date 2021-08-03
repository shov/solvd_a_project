const BasicDAO = require(APP_PATH + '/infrastructure/contracts/BasicDAO')
const check = require('check-types')

class UserDAO extends BasicDAO {
  '@Inject (dbConnection)'
  '@Inject (app.entities.UserDTO)'

  constructor(connection, dto) {
    super(connection, 'users', dto)
  }

  /**
   * Create new user
   * @param {string} email
   * @param {string} hash
   * @return {Promise<UserDTO>}
   */
  async create({email, hash}) {
    const createdAt = new Date()

    const result = await this._connection
      .table(this.TABLE_NAME)
      .insert({
        email,
        hash,
        created_at: createdAt,
      })
      .returning('id')

    return this.makeDto({id: result[0], hash, email, createdAt})
  }

  /**
   * Fetch all records from table
   * @return {Promise<UserDTO[]>}
   */
  async fetchAll() {
    const result = await this._connection
      .select('*')
      .from(this.TABLE_NAME)

    if (!check.nonEmptyArray(result)) {
      return []
    }

    return result.map(row => this.makeDto(row))
  }

  /**
   * Return user dto for hash and id
   * @param {string} id
   * @param {string} hash
   * @return {Promise<UserDTO|null>}
   */
  async findOneForHash({id, hash}) {
    const result = await this._connection
      .select('*')
      .from(this.TABLE_NAME)
      .where({id, hash})
      .first()

    if(!result) {
      return null
    }

    return this.makeDto(result)
  }
}

module.exports = UserDAO
