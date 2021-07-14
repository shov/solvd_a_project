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
      const depExp = /@Inject\s+(?<deps>[^\s].+)$/m
      const depMatches = content.match(depExp)
      if (depMatches) {
        depMatches.groups.deps.split(/\s+/).map(r => r.trim()).forEach(r => dependencies.push(r))
      }

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
