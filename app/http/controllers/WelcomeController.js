const UserModel = require(APP_PATH + '/app/models/UserModel')

class WelcomeController {
  static async home(req, res) {

    res.writeHead(200, {'Content-type': 'text/html'})
    res.end('<strong>Welcome</strong>')
  }

  static notFound(req, res) {
    res.writeHead(404)
    res.end(`
<html>
  <body style="background: red; color: white">
      <h1 style="text-align: center">NOT FOUND</h1>
  </body>
</html>
    `)
  }
}

module.exports = WelcomeController
