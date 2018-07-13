import path from 'path'

import Command from './command'

export default class EntryCommand extends Command {
  constructor(rawArgv) {
    super(rawArgv)

    this.load(path.join(__dirname, 'commands'))
  }

  get description() {
    return '工程化链路'
  }
}
