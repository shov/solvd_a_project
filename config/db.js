module.exports = {
  getCreds() {
    return this[process.env.ENV] || this['default']
  },

  testing: {
    uri: process.env.TEST_MONGO_DB_URI,
    dbName: process.env.TEST_MONGO_DB_NAME,
  },

  development: {
    uri: process.env.MONGO_DB_URI,
    dbName: process.env.MONGO_DB_NAME,
  },

  get default() {
    return this.development
  }

}
