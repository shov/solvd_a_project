const BasicDTO = require(APP_PATH + '/infrastructure/contracts/BasicDTO')

class TokenDTO extends BasicDTO {
  id = null
  content = null
  userId = null
  active = null
  createdAt = null
  updatedAt = null
}

module.exports = TokenDTO
