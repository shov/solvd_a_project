const jwt = require('jsonwebtoken')

class TokenService {
  '@Inject (app.repositories.TokenDAO)'
  '@Inject (config)'
  '@Inject (logger)'
  constructor(tokenDAO, config, logger) {
    /**
     * @type {TokenDAO}
     * @private
     */
    this._tokenDAO = tokenDAO

    /**
     * @type {ILogger}
     * @private
     */
    this._logger = logger

    this.EXPIRATION_TERM = (config.auth.expirationTerm) || (1000 * 60)

    this.SIGN = 'krov'
  }

  /**
   * @param {UserDTO} user
   * @return {Promise<TokenDTO>}
   */
  async create(user) {
    const payload = {
      sub: user.id,
      iat: Date.now(),
      exp: Date.now() + this.EXPIRATION_TERM,
    }

    //create jwt
    const content = jwt.sign(payload, this.SIGN)


    //save token to DB & return
    return await this._tokenDAO.create({content, active: true, userId: user.id})
  }

  /**
   * @param {string} tokenContent
   * @return {Promise<boolean|{sub: string}>}
   */
  async verify(tokenContent) {
    let payload = false
    try {
      payload = jwt.verify(tokenContent, this.SIGN, {ignoreExpiration: true})
    } catch (e) {
      return payload
    }

    //get from DB, make sure it's active
    const tokenDTO = await this._tokenDAO.getByToken(tokenContent)

    if (!tokenDTO) {
      return false
    }

    if (!tokenDTO.active) {
      return false
    }

    //if expired then update in DB set inactive
    if (Date.now() > payload.exp) {
      tokenDTO.active = false
      this._tokenDAO.update(tokenDTO).catch(e => {
        this._logger.error(`Cannot update token ${tokenContent}`)
      })
      return false
    }

    return payload
  }

  async delete(tokenContent) {
    await this._tokenDAO.deleteByToken(tokenContent)
  }
}

module.exports = TokenService
