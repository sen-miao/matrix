import del from 'del'

import Command from '../command'

class BuildCommand extends Command {
  constructor(rawArgv) {
    super(rawArgv)
  }

  async run({ argv }) {
    argv.command = 'clean'

    const context = process.cwd()

    del([`${context}/umd`, `${context}/lib`, `${context}/es`]).then(paths => {
      console.log(['Deleted files and folders:'].concat(paths).join('\n'))
    })
  }

  get description() {
    return '删除构建、缓存目录'
  }
}

module.exports = BuildCommand
