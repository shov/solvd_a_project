'use strict'
const crypto = require('crypto')
const check = require('check-types')
const ValidationError = require(APP_PATH + '/infrastructure/exceptions/ValidationError')

class UserService {
  '@Inject (app.repositories.UserDAO)'

  /**
   * @param {UserDAO} userDAO
   */
  constructor(userDAO) {
    /**
     * @type {UserDAO}
     * @private
     */
    this._userDAO = userDAO

    /**
     * @type {string}
     * @private
     */
    this._SALT = 'lwrjngpq0298gh-a9w8rubpviau34g;9WBRGU$AIWRJGHBI3VBWPGJGH'
  }

  /**
   * register new user
   * @param {string} email
   * @param {string} password
   * @return {Promise<UserDTO>}
   */
  async register({email, password}) {
    try {
      const hash = this._hashPassword(password)
      return await this._userDAO.create({email, hash})
    } catch (e) {
      if (check.nonEmptyString(e.message) && e.message.include('duplicate')) {
        throw  new ValidationError('Email duplication!')
      }

      throw e
    }
  }

  /**
   * List all from DB
   * @return {Promise<UserDTO[]>}
   */
  async listAll() {
    return await this._userDAO.fetchAll()
  }

  /**
   * Return user if the creds are valid and one exists
   * @param {string} id
   * @param {string} password
   * @return {Promise<UserDTO|null>}
   */
  async checkPassword(id, password) {
    const hash = this._hashPassword(password)
    return await this._userDAO.findOneForHash({id, hash})
  }

  _hashPassword(password) {
    const hmac = crypto.createHmac('sha512', this._SALT)
    hmac.update(password)
    return hmac.digest('hex')
  }
}

module.exports = UserService
