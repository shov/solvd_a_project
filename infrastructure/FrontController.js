class FrontController {
  /**
   * @param {Router} router
   */
  constructor(router) {
    /**
     * @type {Router}
     * @private
     */
    this._router = router
  }

  async handle(req, res) {
    const urlInfo = new (require('url')).URL(req.url, `http://${req.headers.host}`)
    const sign = this._router.makeSign(req.method, urlInfo.pathname)

    req.params = {}

    let handler = this._router.resolve(sign, req) || this._router.resolve('default')
    if('function' !== typeof handler) {
      res.writeHead(404)
      res.end('NOT FOUND')
      return
    }

    let data = ''
    await new Promise(((resolve, reject) => {
      req.on('data', chunk => {
        data += chunk.toString()
      })

      req.on('end', () => {
        resolve()
      })
    }))

    try {
      req.body = data.length > 0 ? JSON.parse(data) : undefined
    } catch (e) {
      app.get('logger').error(e.message)
      handler = this._router.resolve('default')
    }

    req.urlInfo = urlInfo
    const result = handler(req, res)
    if(result instanceof Promise) {
      await result
    }
  }
}

module.exports = FrontController
