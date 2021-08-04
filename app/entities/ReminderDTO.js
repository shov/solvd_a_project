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

  createdAt = null
  updatedAt = null
}

module.exports = ReminderDTO
