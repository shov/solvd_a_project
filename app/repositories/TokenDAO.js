const BasicDAO = require(APP_PATH + '/infrastructure/contracts/BasicDAO')

/**
 * @extends BasicDAO
 */
class TokenDAO extends BasicDAO {
  '@Inject (dbConnection)'
  '@Inject (app.entities.UserDTO)'

  constructor(connection, dto) {
    super(connection, 'tokens', dto)
  }

  /**
   * Create new token
   * @param {string} content
   * @param {boolean} active
   * @param {number|string|null} userId
   * @param {null|Transaction} transaction
   * @return {Promise<TokenDTO>}
   */
  async create({content, active = true, userId}, {transaction = null} = {}) {
    const createdAt = new Date()

    const query = this._connection
      .table(this.TABLE_NAME)
      .insert({
        content,
        active,
        user_id: userId,
        created_at: createdAt,
      })
      .returning('id')

    if(transaction) {
      query.transacting(transaction)
    }

    const result = await query

    return this.makeDto({id: result[0], content, active, userId, createdAt})
  }

  /**
   * Get token by content
   * @param {string} tokenContent
   * @return {Promise<null|TokenDTO>}
   */
  async getByToken(tokenContent) {
    const result = await this._connection
      .select('*')
      .from(this.TABLE_NAME)
      .where({content: tokenContent})
      .first()

    if(!result) {
      return null
    }

    return this.makeDto(result)
  }

  async update(tokenDTO) {
    const existing = await this.getByToken(tokenDTO.content)
    if(!existing) {
      throw new Error(`Cannot update token ${tokenDTO.content}, doesn't exist!`)
    }

    const updatedAt = new Date()

    const toSaveData = {...existing.data(), ...tokenDTO.data(), updated_at: updatedAt}

    await this._connection
      .table(this.TABLE_NAME)
      .update(toSaveData)
      .where({id: existing.id})

    return this.makeDto({...existing.present(), ...tokenDTO.present(), updatedAt})
  }

  /**
   * Deactivate record by token content
   * @param tokenContent
   * @return {Promise<void>}
   */
  async deactivateByToken(tokenContent) {
    await this._connection.table(this.TABLE_NAME)
      .update({active: false})
      .where({content: tokenContent})
  }
}

module.exports = TokenDAO
