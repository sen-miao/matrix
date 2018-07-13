import Chalk from 'chalk'

import Command from '../command'
import { getUserConfig } from '../utils'

class PublishCommand extends Command {
  constructor(rawArgv) {
    super(rawArgv)
  }

  async run({ argv }) {
    argv.command = 'lint'

    const userConfig = getUserConfig()
    const build = require('../modules/lint')
    const suiteConfig = require(userConfig.suite)(argv)

    build(argv, suiteConfig, userConfig)
  }

  get description() {
    return '检查代码规范'
  }
}

module.exports = PublishCommand
