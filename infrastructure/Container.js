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
   * @param {string[]} resolvingStack
   * @return {any|*}
   */
  get(key, {resolvingStack = []} = {}) {
    if (!this._resolvers[key]) {
      throw new Error(
        `Cannot resolve ${resolvingStack.join(' > ')}${resolvingStack.length ? ' > ' : ''}${key}`
      )
    }

    const resolver = this._resolvers[key]
    let resolvedDeps = []
    if(resolver.dependencies && resolver.dependencies.length > 0) {
      resolvedDeps = this._resolveNested([...resolvingStack, key], resolver.dependencies)
    }

    //singleton
    if (resolver.singleton) {
      if (!resolver.singleton.origin) {
        resolver.singleton.origin = resolver.value
        resolver.value = new resolver.singleton.origin(...resolvedDeps)
      }
      return resolver.value
    }

    //byVal
    if (resolver.setByValue) {
      return resolver.value
    }

    //factory
    if (resolver.setAsFactory) {
      return resolver.value(...resolvedDeps)
    }

    if (resolver.binding) {
      return this.get(resolver.value, {resolvingStack: [...resolvingStack, key]})
    }

    return new resolver.value(...resolvedDeps)
  }

  /**
   * @param {string} key
   * @param {string} destKey
   */
  bind(key, destKey) {
    this._resolvers[key] = {
      value: destKey,
      singleton: false,
      setByValue: false,
      setAsFactory: false,
      binding: true,
      dependencies: [],
    }
  }

  _resolveNested(resolvingStack, deps) {
    return deps.map(key => {
      return this.get(key, {resolvingStack})
    })
  }
}

module.exports = Container
