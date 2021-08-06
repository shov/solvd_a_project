require('../bootstrap')
const supertest = require('supertest')
const check = require('check-types')

describe('ReminderController', () => {
  let request

  /** @type {UserService} */
  let userService

  /** @type {MigrationManager} */
  let migrationManager

  beforeAll(async () => {
    jest.setTimeout(100000)
    request = supertest(app.get('http'))
    migrationManager = app.get('migrationManager')

    userService = app.get('app.services.UserService')
  })

  beforeEach(async () => {
    await migrationManager.refresh()
  })

  it('Create new reminder', async () => {
    //Arrange

    const email = 'dimka@nevidimka.net'
    const password = 'qweqweqwe123'

    const {userDto, tokenDto} = await userService.register({email, password})

    const fireTime = new Date(Date.now() + 30_000).toISOString()
    const message = null
    const guestList = []


    let expectedResponseBody = {
      "id": null,//?
      fireTime,
      message,
      guestList
    }

    //Act
    const response = await request.post('/api/v1/reminders')
      .set({'Authorization': tokenDto.content})
      .send({
        fireTime, message, guestList
      })

    //Assert
    expect(check.nonEmptyArray(response.body.reminders)).toBe(true)
    expect(response.body.reminders.length).toBe(1)
    expect(!!response.body.reminders[0].id).toBe(true)
    expect(response.body.reminders[0]).toStrictEqual({...expectedResponseBody, id: response.body.reminders[0].id})
  })
})
