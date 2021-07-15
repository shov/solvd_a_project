require('../bootstrap')
const supertest = require('supertest')

describe('UserController', () => {
  let request

  /** @type {UserModel} */
  let user

  beforeAll(async () => {
    request = supertest(app.get('http'))
    user = app.get("UserModel")
  })

  beforeEach(async () => {
    await user.removeAll()
  })

  it('create positive', async () => {
    //Arrange
    const newUser = {
      email: 'test@test.com'
    }
    const expectedStatusCode = 201

    //Act
    const response = await request
      .post('/api/v1/users')
      .send(newUser)

    //Assert
    expect(response.statusCode).toBe(expectedStatusCode)
    expect(!!response.body.id).toBe(true)
    expect({id: response.body.id, ...newUser}).toStrictEqual(response.body)
  })
})
