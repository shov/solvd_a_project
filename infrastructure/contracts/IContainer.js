/**
 * @interface IContainer
 */
class IContainer {
  /**
   * @param {string} key
   * @return {IContainerResolver}
   */
  register(key, value) {

  }

  /**
   * @param {string} key
   * @return {any|*}
   */
  get(key) {

  }

  /**
   * @param {string} key
   * @param {string} destKey
   */
  bind(key, destKey) {

  }
}

module.exports = IContainer
