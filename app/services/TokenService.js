const jwt = require('jsonwebtoken')

class TokenService {
  '@Inject (app.models.TokenModel)'
  '@Inject (config)'
  '@Inject (logger)'
  constructor(tokenModel, config, logger) {
    /**
     * @type {TokenModel}
     * @private
     */
    this._tokenModel = tokenModel

    /**
     * @type {ILogger}
     * @private
     */
    this._logger = logger

    this.EXPIRATION_TERM = (config.auth.expirationTerm) || (1000 * 60)

    this.SIGN = 'krov'
  }

  /**
   * @param {{id: string}} user
   * @return {Promise<string>}
   */
  async create(user) {
    const payload = {
      sub: user.id,
      iat: Date.now(),
      exp: Date.now() + this.EXPIRATION_TERM,
    }

    //create jwt
    const token = jwt.sign(payload, this.SIGN)


    //save token to DB
    this._tokenModel.create({token, active: true}).catch(e => {
      this._logger.error(`Cannot persist token ${token}`)
    })

    //return token
    return token
  }

  /**
   * @param {string} token
   * @return {Promise<boolean|{sub: string}>}
   */
  async verify(token) {
    let payload = false
    try {
      payload = jwt.verify(token, this.SIGN, {ignoreExpiration: true})
    } catch (e) {
      return payload
    }

    //get from DB, make sure it's active
    const tokenDTO = await this._tokenModel.get(token)

    if (!tokenDTO) {
      return false
    }

    if (!tokenDTO.active) {
      return false
    }

    //if expired then update in DB set inactive
    if (Date.now() > payload.exp) {
      tokenDTO.active = false
      this._tokenModel.update(tokenDTO).catch(e => {
        this._logger.error(`Cannot update token ${token}`)
      })
      return false
    }

    return payload
  }

  async delete(token) {
    await this._tokenModel.delete(token)
  }
}

module.exports = TokenService
