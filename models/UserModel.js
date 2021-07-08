class UserModel {
  getById(id) {
    return {
      '42': {
        name: 'Alexandr',
        family: 'Shevchenko',
      }
    }[id]
  }
}

module.exports = UserModel
