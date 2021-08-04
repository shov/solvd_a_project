'use strict'

/**
 * @class BasicDTO
 */
class BasicDTO {

  present() {
    return Object.keys(this).reduce((acc, propName) => {

      const camelKey = propName.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
      if(['createdAt', 'updatedAt'].includes(camelKey)) {
        return acc
      }

      acc[camelKey] = this[propName]
      return acc
    }, {})
  }

  data() {
    return  Object.keys(this).reduce((acc, propName) => {

      const snakeCase = propName.replace(/([A-Z])/g, (_, c) => '_' + c.toLowerCase())
      acc[snakeCase] = this[propName]
      return acc
    }, {})
  }

  clone(init = {}) {
    const dto = new this.constructor()
    Object.assign(dto, init)
    return dto
  }
}

module.exports = BasicDTO
