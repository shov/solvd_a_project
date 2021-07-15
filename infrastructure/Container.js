const ContainerResolver = require('./ContainerResolver')

/**
 * @typedef {{
 *   value: *|any,
 *   singleton: {
 *     origin: function|null
 *   }|boolean,
 *   setByValue: boolean,
 *   setAsFactory: boolean,
 *   dependencies: string[],
 *   binding: boolean,
 * }} ContainerResolverInternal
 */

/**
 * @implements {IContainer}
 */
class Container extends require('./contracts/IContainer') {
  constructor() {
    super()

    /**
     * @type {{[string]: ContainerResolverInternal}}
     * @private
     */
    this._resolvers = {}
  }

  /**
   * @param {string} key
   * @param {any|*} value
   * @return {IContainerResolver}
   */
  register(key, value) {
    this._resolvers[key] = {
      value,
      singleton: false,
      setByValue: false,
      setAsFactory: false,
      binding: false,
      dependencies: [],
    }

    return new ContainerResolver(this._resolvers[key])
  }

  /**
   * @param {string} key
   * @return {any|*}
   */
  get(key) {
    if (!this._resolvers[key]) {
      throw new Error(`Unknown key ${key}`)
    }

    const resolver = this._resolvers[key]

    //singleton
    if (resolver.singleton) {
      if (!resolver.origin) {
        resolver.origin = resolver.value
        resolver.value = new resolver.origin(...resolver.dependencies)
      }
      return resolver.value
    }

    //byVal
    if(resolver.setByValue) {
      return resolver.value
    }

    //factory
    if(resolver.setAsFactory) {
      return  resolver.value(...resolver.dependencies)
    }

    if(resolver.binding) {
      return this.get(resolver.value)
    }

    return new resolver.value(...resolver.dependencies)
  }

  /**
   * @param {string} key
   * @param {string} destKey
   */
  bind(key, destKey) {
    this._resolvers[key] = {
      destKey,
      singleton: false,
      setByValue: false,
      setAsFactory: false,
      binding: true,
      dependencies: [],
    }
  }
}

module.exports = Container
