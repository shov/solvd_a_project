const BasicDAO = require(APP_PATH + '/infrastructure/contracts/BasicDAO')
const check = require('check-types')

/**
 * @extends BasicDAO
 */
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
   * @param {null|Transaction} transaction
   * @return {Promise<UserDTO>}
   */
  async create({email, hash}, {transaction = null} = {}) {
    const createdAt = new Date()

    const query = this._connection
      .table(this.TABLE_NAME)
      .insert({
        email,
        hash,
        created_at: createdAt,
      })
      .returning('id')

    if(transaction) {
      query.transacting(transaction)
    }

    const result = await query

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

  /**
   * Return user dto
   * @param {string} id
   * @return {Promise<UserDTO|null>}
   */
  async find(id) {
    const result = await this._connection
      .select('*')
      .from(this.TABLE_NAME)
      .where({id})
      .first()

    if(!result) {
      return null
    }

    return this.makeDto(result)
  }

  /**
   * Delete by id
   * @param {string|number} id
   * @return {Promise<void>}
   */
  async delete(id) {
    await this._connection
      .table(this.TABLE_NAME)
      .delete()
      .where({id})
  }

  /**
   * Update
   * @param {UserDTO} userDto
   * @return {Promise<UserDTO>}
   */
  async update(userDto) {
    if(!userDto.id) {
      throw new TypeError('Cannot update user without id')
    }

    const existing = await this.find(userDto.id)
    if(!existing) {
      throw new Error(`Cannot update user ${userDto.id}, doesn't exist!`)
    }

    const updatedAt = new Date()

    const toSaveData = {...existing.data(), ...userDto.data(), updated_at: updatedAt}

    await this._connection
      .table(this.TABLE_NAME)
      .update(toSaveData)
      .where({id: existing.id})

    return this.makeDto({...existing.present(), ...userDto.present(), updatedAt})
  }
}

module.exports = UserDAO
