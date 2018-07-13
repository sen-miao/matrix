import Command from '../command'
import { getUserConfig } from '../utils'

class BuildCommand extends Command {
  constructor(rawArgv) {
    super(rawArgv)
  }

  async run({ argv }) {
    argv.command = 'build'

    const userConfig = getUserConfig() || {}
    const build = require('../modules/build')
    const suiteConfig = userConfig.suite ? require(userConfig.suite)(argv) : {}

    build(argv, suiteConfig, userConfig)
  }

  get description() {
    return '构建'
  }
}

module.exports = BuildCommand
