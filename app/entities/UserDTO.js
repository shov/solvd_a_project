const BasicDTO = require(APP_PATH + '/infrastructure/contracts/BasicDTO')

/**
 * @extends BasicDTO
 */
class UserDTO extends BasicDTO {
  id = null
  email = null
  hash = null
  createdAt = null
  updatedAt = null


  present() {
    const presentation = super.present()
    delete presentation.hash
    return presentation
  }
}

module.exports = UserDTO
