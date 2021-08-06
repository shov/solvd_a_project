const ValidationError = require(APP_PATH + '/infrastructure/exceptions/ValidationError')
const UnauthorizedError = require(APP_PATH + '/infrastructure/exceptions/UnauthorizedError')
const NotFoundError = require(APP_PATH + '/infrastructure/exceptions/NotFoundError')

class ReminderController {
  '@Inject (app.services.ReminderService)'
  '@Inject (app.services.UserService)'
  /**
   * @param {ReminderService} reminderService
   * @param {UserService} userService
   */
  constructor(reminderService, userService) {
    /**
     * @type {ReminderService}
     * @private
     */
    this._reminderService = reminderService

    /**
     * @type {UserService}
     * @private
     */
    this._userService = userService
  }

  async create(req, res, next) {
    try {
      //TODO validate input
      const {fireTime, message, guestList} = req.body

      const userDto = await this._userService.getById(req.userId)
      if(!userDto) {
        throw new NotFoundError('Cannot find user!')
      }

      const reminderDto = await this._reminderService.create(userDto, {fireTime, message, guestList})

      res.status(201).send(reminderDto.present())
    } catch (e) {
      next(e)
    }
  }

}

module.exports = ReminderController
