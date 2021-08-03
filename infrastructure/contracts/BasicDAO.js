'use strict'


class BasicDAO {
  constructor(connection, tableName, dto) {
    /**
     * @type {QueryInterface}
     * @private
     */
    this._connection = connection

    /**
     * @type {BasicDTO}
     * @private
     */
    this._dto = dto

    /**
     * @const
     * @type {string}
     */
    this.TABLE_NAME = tableName
  }

  getConnection() {
    return this._connection
  }

  makeDto(init = {}) {
    return this._dto.clone(init)
  }
}

module.exports = BasicDAO
