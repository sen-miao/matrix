import Chalk from 'chalk'

import Command from '../command'
// import { getUserConfig } from '../utils'

class PublishCommand extends Command {
  constructor(rawArgv) {
    super(rawArgv)
  }

  async run({ argv }) {
    argv.command = 'publish'

    console.log(Chalk.yellow('not implement command'))
    // const userConfig = getUserConfig()
    // const build = require('../modules/publish')
    // const suiteConfig = require(userConfig.suite)(argv)

    // build(argv, suiteConfig, userConfig)
  }

  get description() {
    return '发布'
  }
}

module.exports = PublishCommand
