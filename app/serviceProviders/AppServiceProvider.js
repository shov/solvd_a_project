/**
 * @extends {BasicServiceProvider}
 */
class AppServiceProvider extends require(APP_PATH + '/infrastructure/contracts/BasicServiceProvider') {
  /**
   * @param {IContainer} container
   */
  init(container) {
    /** @type {DependencyInjector} */
    const di = container.get('dependencyInjector')
    const config = container.get('config')

    if(config.app && config.app.di) {
      config.app.di.forEach(diSet => {
        di.processPath(diSet.path, diSet.exclude || [], diSet.base || null)
      })
    }
  }

  /**
   * @param {IContainer} container
   */
  boot(container) {

  }
}

module.exports = AppServiceProvider
