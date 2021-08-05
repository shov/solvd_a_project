require('../bootstrap')
const supertest = require('supertest')
const check = require('check-types')

describe('UserController', () => {
  let request

  /** @type {MigrationManager} */
  let migrationManager

  beforeAll(async () => {
    jest.setTimeout(100000)
    request = supertest(app.get('http'))
    migrationManager = app.get('migrationManager')
  })

  beforeEach(async () => {
    await migrationManager.refresh()
  })

  it('create positive', async () => {
    //Arrange
    const newUser = {
      email: 'test@test.com',
    }
    const expectedStatusCode = 201

    //Act
    const response = await request
      .post('/api/v1/users')
      .send({...newUser, password: 'xxxxxxxxxxxxx',})

    //Assert
    expect(response.statusCode).toBe(expectedStatusCode)
    expect(!!response.body.id).toBe(true)
    expect(!!response.body.token).toBe(true)
    expect({id: response.body.id, token: response.body.token, ...newUser}).toStrictEqual(response.body)
  })

  it('get user negative', async () => {
    //Arrange
    const userId = '12'
    const expectedStatusCode = 401

    //Act
    const response = await request
      .get(`/api/v1/users/${userId}`)
      .send()

    //Assert
    expect(response.statusCode).toBe(expectedStatusCode)
    expect(!!response.body.error).toBe(true)
    expect(!!response.body.error.msg).toBe(true)
  })

  it('login positive', async () => {
    //Arrange
    const email = 'xxx@xxx.xx'
    const password = 'qwertyqwertyStrong11'

    //Act
    const createUserResp = await request
      .post('/api/v1/users')
      .send({email, password})

    const userId = createUserResp.body.id
    expect(!!userId).toBe(true)

    const token = createUserResp.body.token
    expect(!!token).toBe(true)

    expect(check.nonEmptyString(token)).toBe(true)

    const getUserResponse = await request
      .get(`/api/v1/users/${userId}`)
      .set({'Authorization': `Bearer ${token}`})

    //Assert
    expect(getUserResponse.statusCode).toBe(200)
    expect(getUserResponse.body).toStrictEqual({
      id: userId,
      email,
    })
  })
})
