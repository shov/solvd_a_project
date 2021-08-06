const BasicDTO = require(APP_PATH + '/infrastructure/contracts/BasicDTO')

/**
 * @extends BasicDTO
 */
class ReminderDTO extends BasicDTO {
  id = null

  /** @type {null|string} */
  message = null

  /** @type {null|Date} */
  fireTime = null

  /** @type {null|{}} */
  repeatRule = null

  /**
   * @type {null|{id, email, role}[]}
   */
  userList = null

  createdAt = null
  updatedAt = null

  present() {
    const presentation = super.present()
    presentation.gustList = presentation.userList.map(g => g.email)
    delete presentation.userList
    delete presentation.repeatRule
    return presentation
  }
}

module.exports = ReminderDTO
