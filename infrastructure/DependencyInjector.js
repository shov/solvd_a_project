const glob = require('glob')
const fs = require('fs')

class DependencyInjector {
  constructor(container) {
  }

  parsePath(root, excludes = [], base = null) {

    const candidates = []
    glob.sync(APP_PATH + root + '/**/*').forEach(filePath => {
      for(let excludedPart of excludes) {
        if(filePath.includes(excludedPart)) {
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
      const depExp = /@Inject\s*\(\s*(?<dep>[^\s].+)\s*\).*$/mg
      content.replace(depExp, (_, dep) => {
        dependencies.push(dep.trim())
      })

      const reference = (base ? base + '.' : '') + matches.groups.reference.replace(/\//g, '.')

      candidates.push({
        filePath,
        reference,
        dependencies
      })
    })
  }
}

module.exports = DependencyInjector
