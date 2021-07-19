class Router {
  _handlers = {}
  /**
   * @type {{method: string, path: string, resolver: {controller: string, action: string}}[]}
   * @private
   */
  _routeList = {}

  /**
   * @param  {Container} container
   */
  constructor(container) {
    /**
     * @type {Container}
     * @private
     */
    this._container = container


  }

  parse(routeList) {
    this._routeList = routeList
    this._routeList.forEach(route => {
      const sign = this.makeSign(route.method, route.path)

      const controller = this._container.get(route.resolver.controller)
      if ('function' !== typeof controller[route.resolver.action]) {
        throw new Error(`No action found for ${route.resolver.controller}`)
      }

      this._handlers[sign] = controller[route.resolver.action].bind(controller)
    })
  }

  /**
   *
   * @param {string} sing
   * @param {{}} req
   * @return {function|null}
   */
  resolve(sing, req = {}) {
    if (sing.includes('/:')) {
      return this._handlers['default']
    }

    return this._handlers[sing] || this._resolveWithParams(sing, req) || null
  }

  makeSign(method, path) {
    return `${method.toLowerCase()} ${path}`
  }

  set(sign, handler) {
    this._handlers[sign] = handler
  }

  get(sign) {
    return this._handlers[sign] || null
  }

  /**
   * @param {string} sign
   * @param {{}} req
   * @private
   */
  _resolveWithParams(sign, req) {
    //'get /api/v1/users/4545sdg5t2g2'
    //'get /api/v1/users/:id'
    const paramHandlers = Object.entries(this._handlers)
      .filter(([sign, _]) => sign.includes('/:'))

      for (let [patternSign, handler] of paramHandlers) {
      const regExp = new RegExp(`^${patternSign.replace(/\//g, '\/').replace(/\/:(\w+)/, (_, sub) => {
        return `\/(?<${sub}>\\w+)`
      })}\/?$`)

      const matches = sign.match(regExp)

      if (!matches) {
        continue
      }

      req.params = matches.groups
      return handler
    }

    return null
  }

}

module.exports = Router
