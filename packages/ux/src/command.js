import path from 'path'

import CommandBin from './modules/common-bin/command'
import chalk from 'chalk'

export default class Command extends CommandBin {
  constructor(rawArgv) {
    super(rawArgv)

    this.usage = `用法: $0 ${chalk.green('<command>')} [options]`
    this.pkgRoot = path.resolve(__dirname, '..')
    this.yargs.epilogue('版权所有 ©2018 Copoch')
  }

  async run({ argv }) {
    argv.command = 'base'

    this.showHelp()

    return 'must override the implementation'
  }

  get description() {
    return 'must override the implementation'
  }
}
