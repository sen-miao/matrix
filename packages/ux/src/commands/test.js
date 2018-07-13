const Command = require('../command')

class TestCommand extends Command {
  constructor(rawArgv) {
    super(rawArgv)
  }

  async run({ argv }) {
    argv.command = 'test'

    const test = await import('../modules/test')

    test()
  }

  get description() {
    return '单元测试'
  }
}

module.exports = TestCommand
