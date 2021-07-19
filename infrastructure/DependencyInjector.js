const glob = require('glob')
const fs = require('fs')

class DependencyInjector {
  /**
   * @param {Container} container
   */
  constructor(container) {

    /**
     * @type {Container}
     * @private
     */
    this._container = container
  }

  processPath(root, exclude = [], base = null) {

    const candidateList = []
    glob.sync(APP_PATH + root + '/**/*').forEach(filePath => {
      for (let excludedPart of exclude) {
        if (filePath.includes(excludedPart)) {
          return
        }
      }

      const exp = new RegExp(`^${(APP_PATH + root).replace(/\//g, '\\/')}\/(?<reference>[^.]+)\.js$`)
      const matches = filePath.match(exp)
      if (!matches) {
        return
      }

      const dependencies = []
      const content = fs.readFileSync(filePath).toString().trim()
      const depExp = /@Inject\s*\(\s*(?<dep>[a-zA-Z][a-zA-Z0-9_.]+)\s*\).*$/mg
      content.replace(depExp, (_, dep) => {
        dependencies.push(dep.trim())
      })

      const reference = (base ? base + '.' : '') + matches.groups.reference.replace(/\//g, '.')

      candidateList.push({
        filePath,
        reference,
        dependencies
      })
    })

    candidateList.forEach(candidate => {
      const constructor = require(candidate.filePath)
      this._container.register(candidate.reference, constructor)
        .dependencies(...candidate.dependencies)
    })
  }
}

module.exports = DependencyInjector
