import path from 'path'
import util from 'util'

import _ from 'lodash'
import yaml from 'js-yaml'
import fs from 'fs-extra'

export function deepMerge(target, ...sources) {
  return _.mergeWith(target, ...sources)
}

export function getUserConfig() {
  var config

  try {
    config = yaml.safeLoad(
      fs.readFileSync(path.join(process.cwd(), 'ux.yml'), 'utf8')
    )
  } catch (e) {
    // console.log(e)
  }

  return config
}

/**
 * Check if a directory exists.
 */
exports.directoryExists = dir => {
  try {
    return fs.statSync(dir).isDirectory()
  } catch (e) {
    return false
  }
}

exports.typeOf = o => {
  if (Number.isNaN(o)) return 'nan'
  return Object.prototype.toString
    .call(o)
    .slice(8, -1)
    .toLowerCase()
}

/**
 * Clear console scrollback.
 */
exports.clearConsole = function clearConsole() {
  // Hack for testing
  if (process.env.UX_TEST) return
  // This will completely wipe scrollback in cmd.exe on Windows - use cmd.exe's
  // `start` command to launch nwb's dev server in a new prompt if you don't
  // want to lose it.
  process.stdout.write(
    process.platform === 'win32' ? '\x1Bc' : '\x1B[2J\x1B[3J\x1B[H'
  )
}

exports.pluralise = function pluralise(count, suffixes = ',s') {
  return suffixes.split(',')[count === 1 ? 0 : 1]
}

/**
 * Get a list of nwb plugin names passed as arguments.
 */
exports.getArgsPlugins = function getArgsPlugins(
  args
  // : {
  //   // comma-separated list of nwb plugin names
  //   plugins,
  //   // Comma-separated list of nwb plugin names (allowing for typos)
  //   plugin
  // }
) {
  let plugins = args.plugins || args.plugin
  if (!plugins) return []
  return plugins.split(',').map(name => name.replace(/^(nwb-)?/, 'nwb-'))
}

/**
 * @param {Array<string>} strings
 */
exports.unique = function unique(strings) {
  // eslint-disable-next-line
  return Object.keys(strings.reduce((o, s) => ((o[s] = true), o), {}))
}

/**
 * Log objects in their entirety so we can see everything in debug output.
 */
exports.deepToString = function deepToString(object) {
  return util.inspect(object, { colors: true, depth: null })
}

/**
 * Better typeof.
 */
exports.typeOf = function typeOf(o) {
  if (Number.isNaN(o)) return 'nan'
  return Object.prototype.toString
    .call(o)
    .slice(8, -1)
    .toLowerCase()
}
