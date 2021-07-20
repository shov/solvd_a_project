const expressRouterFactory = require('express').Router

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

    /**
     * @type {Router}
     * @private
     */
    this._expressRouter = expressRouterFactory()

  }

  getExpressRouter() {
    return this._expressRouter
  }

  parse(routeList) {
    const config = this._container.get('config')
    this._routeList = routeList
    this._routeList.forEach(route => {
      this._ensureAllowedMethod(route.method)

      const controller = this._container.get(route.resolver.controller)
      if ('function' !== typeof controller[route.resolver.action]) {
        throw new Error(`No action found for ${route.resolver.controller}`)
      }

      const beforeMiddleware = []
      const afterMiddleware = []

      if(config.http && Array.isArray(config.http.afterMiddleware)) {
        config.http.afterMiddleware.forEach(mName => {
          const middlewareObj = this._container.get(mName)
          afterMiddleware.push(middlewareObj.handle.bind(middlewareObj))
        })
      }

      if(Array.isArray(route.middleware)) {
        route.middleware.forEach(mName => {
          const middlewareObj = this._container.get(mName)
          beforeMiddleware.push(middlewareObj.handle.bind(middlewareObj))
        })
      }

      this._expressRouter[route.method](
        route.path,
        ...beforeMiddleware,
        controller[route.resolver.action].bind(controller),
        ...afterMiddleware
      )
    })
  }

  _ensureAllowedMethod(method) {
    if (!['all', 'use', 'get', 'post', 'put', 'delete', 'options', 'head', 'patch',].includes(method)) {
      throw new TypeError(`Unexpected method ${method}`)
    }
  }

}

module.exports = Router
