import Command from '../command'
import { getUserConfig } from '../utils'

export default class extends Command {
  constructor(rawArgv) {
    super(rawArgv)

    this.usage = `用法: \n  $0 start`
  }

  async run({ argv }) {
    argv.command = 'start'

    const userConfig = getUserConfig() || {}
    const server = require('../modules/server')
    const suiteConfig = userConfig.suite ? require(userConfig.suite)(argv) : {}

    server(argv, suiteConfig, userConfig)
  }

  get description() {
    return '打开本地开发服务器'
  }
}
