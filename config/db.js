module.exports = {
  getCreds() {
    return this[process.env.ENV] || this['default']
  },

  testing: {
    client: 'pg',
    connection: {
      host: process.env.TEST_DB_HOST,
      port: process.env.TEST_DB_PORT,
      user: process.env.TEST_DB_USER,
      password: process.env.TEST_DB_PASSWORD,
      database: process.env.TEST_DB_NAME,
      ssl: process.env.TEST_DB_SSL === 'true'
    },
    migrations: {
      tableName: 'migrations'
    },
  },

  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: process.env.DB_SSL === 'true'
    },
    migrations: {
      tableName: 'migrations'
    },
    log: {
      warn(message) {
        app.get('logger').warn(message)
      },
      error(message) {
        app.get('logger').error(message)
      },
      deprecate(message) {
        app.get('logger').warn(message)
      },
      debug(message) {
        app.get('logger').warn(message)
      },
    },
    pool: {
      min: 2,
      max: 100,
      createTimeoutMillis: 3000,
      acquireTimeoutMillis: 30000,
      idleTimeoutMillis: 30000,
      reapIntervalMillis: 1000,
      createRetryIntervalMillis: 100,
      propagateCreateError: false,
    },
  },

  get default() {
    return this.development
  }

}
