/**
 * @implements {IContainerResolver}
 */
class ContainerResolver extends  require('./contracts/IContainerResolver') {
  constructor(resolver) {
    super()
    /**
     * @type {ContainerResolverInternal}
     * @private
     */
    this._resolver = resolver
  }


  /**
   * @param {...string} deps
   * @return {IContainerResolver}
   */
  dependencies(...deps) {
    this._resolver.dependencies = deps
    return this
  }

  factory() {
    this._resolver.setAsFactory = true
  }

  singleton() {
    this._resolver.singleton = {origin: false}
  }

  value() {
    this._resolver.setByValue = true
  }
}

module.exports = ContainerResolver
