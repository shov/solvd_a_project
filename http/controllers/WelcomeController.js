const UserModel = require(APP_PATH + '/models/UserModel')

class WelcomeController {
  static async home(req, res) {
    let pageContent = await require('fs').promises.readFile(APP_PATH + '/views/index.html')
    pageContent = pageContent.toString().trim()

    const userId = req.urlInfo.searchParams.get('user') || '0'
    const user = new UserModel().getById(userId)

    //template

    const readyContent = pageContent.replace(/%([a-zA-Z]+)%/g, (_, sub) => user[sub])

    res.writeHead(200)
    res.end(readyContent)
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
