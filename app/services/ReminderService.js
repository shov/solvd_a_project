'use strict'

class ReminderService {
  '@Inject (app.repositories.ReminderDAO)'
  '@Inject (app.repositories.UserDAO)'
  /**
   * @param {ReminderDAO} reminderDAO
   * @param {UserDAO} userDAO
   */
  constructor(reminderDAO, userDAO) {
    /**
     * @type {ReminderDAO}
     * @private
     */
    this._reminderDAO = reminderDAO

    /**
     * @type {UserDAO}
     * @private
     */
    this._userDAO = userDAO
  }

  async create(creatorDto, {fireTime, message, guestList}) {
    return await this._reminderDAO.getConnection().transaction(async transaction => {
      const reminderDto = await this._reminderDAO.create({fireTime, message}, {transaction})
      await this._reminderDAO.setCreator(reminderDto, creatorDto.id, {transaction})
      await this._reminderDAO.addGuests(reminderDto, guestList, {transaction})
      return await this._reminderDAO.find(reminderDto.id)
    })
  }
}

module.exports = ReminderService
