const BasicDAO = require(APP_PATH + '/infrastructure/contracts/BasicDAO')

/**
 * @extends BasicDAO
 */
class ReminderDAO extends BasicDAO {
  '@Inject (dbConnection)'
  '@Inject (app.entities.ReminderDTO)'

  constructor(connection, dto) {
    super(connection, 'reminders', dto)

    /**
     * @const
     * @type {string}
     */
    this.USER_RELATION_TABLE = 'user_reminders'
  }



}

module.exports = ReminderDAO
