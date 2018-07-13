const chalk = require('chalk')
const path = require('path')
const fs = require('fs-extra')
const semver = require('semver')
const spawn = require('cross-spawn')
const hyperquest = require('hyperquest')
const unpack = require('tar-pack').unpack
const gulp = require('gulp')
const tmp = require('tmp')
const gulpReplace = require('gulp-replace')
// const gulpClean = require('gulp-clean')
// const gulpTap = require('gulp-tap')
const execSync = require('child_process').execSync
const validateProjectName = require('validate-npm-package-name')
const Command = require('../command')

// npm package name regex:
// ^(?:@[a-z0-9-~][a-z0-9-._~]*/)?[a-z0-9-~][a-z0-9-._~]*$

function captialize(str) {
  str = str.replace(/[_-]([a-z])/g, function(l) {
    return l[1].toUpperCase()
  })

  return str.charAt(0).toUpperCase() + str.slice(1)
}

class InitCommand extends Command {
  constructor(rawArgv) {
    super(rawArgv)

    this.programName = 'ux init'
    this.usage = `用法: \n  $0 init ${chalk.green(
      '<project-directory>'
    )} [options]`
    this.options = {
      t: {
        alias: 'template',
        type: 'string',
        default: 'component-simple',
        description: '模版类型'
      },
      useNpm: {
        type: 'boolean',
        default: false,
        description: '是否使用 npm'
      }
    }
  }

  async run({ argv }) {
    this.checkNodeVersion()
    this.checkPackageName(argv._[0])
    this.createApp(argv)
  }

  get description() {
    return '新建脚手架'
  }

  async createApp(argv) {
    const name = argv._[0]
    const useNpm = argv.useNpm
    const root = path.resolve(name)
    const appName = path.basename(root)

    this.checkAppName(appName)
    fs.ensureDirSync(name)
    if (!this.isSafeToCreateProjectIn(root, name)) {
      process.exit(1)
    }

    console.log(`Creating a new React app in ${chalk.green(root)}.`)
    console.log()

    const useYarn = useNpm ? false : this.shouldUseYarn()
    // const originalDirectory = process.cwd()
    process.chdir(root)
    if (!useYarn && !this.checkThatNpmCanReadCwd()) {
      process.exit(1)
    }

    if (!semver.satisfies(process.version, '>=6.0.0')) {
      console.log(
        chalk.yellow(
          `You are using Node ${
            process.version
          } so the project will be bootstrapped with an old unsupported version of tools.\n\n` +
            'Please update to Node 6 or higher for a better, fully supported experience.\n'
        )
      )

      process.exit(1)
    }

    if (!useYarn) {
      const npmInfo = this.checkNpmVersion()
      if (!npmInfo.hasMinNpm) {
        if (npmInfo.npmVersion) {
          console.log(
            chalk.yellow(
              `You are using npm ${
                npmInfo.npmVersion
              } so the project will be boostrapped with an old unsupported version of tools.\n\n` +
                'Please update to npm 3 or higher for a better, fully supported experience.\n'
            )
          )
          process.exit(1)
        }
      }
    }

    await this._run(root, appName, argv)
  }

  async _run(root, appName, argv) {
    // const re = await this.getPackage('https://registry.npmjs.org/yargs/-/yargs-3.4.0.tgz', root)
    const result = await this.getPackage(
      `file:ux-template-${argv.template}`,
      root,
      appName
    )

    if (result) {
      console.log('copy ok.')
    }

    return result
  }

  getPackage(installPackage, root, appName) {
    if (installPackage.match(/^.+\.(tgz|tar\.gz)$/)) {
      return this.getTemporaryDirectory()
        .then(obj => {
          let stream
          if (/^http/.test(installPackage)) {
            stream = hyperquest(installPackage)
          } else {
            stream = fs.createReadStream(installPackage)
          }
          return this.extractStream(stream, obj.tmpdir).then(() => obj)
        })
        .then(obj => {
          let packageName = installPackage
          const installPackagePath = path.join(obj.tmpdir)

          gulp
            .src(path.join(installPackagePath, '**', '*'), {
              dot: true
            })
            .pipe(gulpReplace(new RegExp(packageName, 'g'), appName))
            .pipe(gulpReplace(new RegExp('Demo', 'ig'), captialize(appName)))
            .pipe(gulp.dest(root))

          return Promise.resolve(true)
        })
    } else if (installPackage.match(/^file:/)) {
      let packageName = installPackage.match(/^file:(.*)?$/)[1]
      let installPackagePath = packageName

      if (installPackagePath && this.pkgRoot) {
        installPackagePath = path.join(this.pkgRoot, '..', installPackagePath)

        gulp
          .src(path.join(installPackagePath, '**', '*'), { dot: true })
          // .on('data', function (file) {

          //   console.log(file.history[0])

          // })
          .pipe(gulpReplace(new RegExp(packageName, 'g'), appName))
          .pipe(gulpReplace(new RegExp('Demo', 'ig'), captialize(appName)))
          // .pipe(gulpReplace(new RegExp(packageName, 'g'), function(match) {
          //   if (this.file.relative === 'ux.yml') {
          //     return match
          //   }

          //   return appName
          // }))
          .pipe(gulp.dest(root))

        return true
      }
    }
  }

  extractStream(stream, dest) {
    return new Promise((resolve, reject) => {
      stream.pipe(
        unpack(dest, err => {
          if (err) {
            reject(err)
          } else {
            resolve(dest)
          }
        })
      )
    })
  }

  getTemporaryDirectory() {
    return new Promise((resolve, reject) => {
      // Unsafe cleanup lets us recursively delete the directory if it contains
      // contents; by default it only allows removal if it's empty
      tmp.dir({ unsafeCleanup: true }, (err, tmpdir, callback) => {
        if (err) {
          reject(err)
        } else {
          resolve({
            tmpdir: tmpdir,
            cleanup: () => {
              try {
                callback()
              } catch (ignored) {
                // Callback might throw and fail, since it's a temp directory the
                // OS will clean it up eventually...
              }
            }
          })
        }
      })
    })
  }

  shouldUseYarn() {
    try {
      execSync('yarnpkg --version', { stdio: 'ignore' })
      return true
    } catch (e) {
      return false
    }
  }

  checkThatNpmCanReadCwd() {
    const cwd = process.cwd()
    let childOutput = null
    try {
      // Note: intentionally using spawn over exec since
      // the problem doesn't reproduce otherwise.
      // `npm config list` is the only reliable way I could find
      // to reproduce the wrong path. Just printing process.cwd()
      // in a Node process was not enough.
      childOutput = spawn.sync('npm', ['config', 'list']).output.join('')
    } catch (err) {
      // Something went wrong spawning node.
      // Not great, but it means we can't do this check.
      // We might fail later on, but let's continue.
      return true
    }
    if (typeof childOutput !== 'string') {
      return true
    }
    const lines = childOutput.split('\n')
    // `npm config list` output includes the following line:
    // "; cwd = C:\path\to\current\dir" (unquoted)
    // I couldn't find an easier way to get it.
    const prefix = '; cwd = '
    const line = lines.find(line => line.indexOf(prefix) === 0)
    if (typeof line !== 'string') {
      // Fail gracefully. They could remove it.
      return true
    }
    const npmCWD = line.substring(prefix.length)
    if (npmCWD === cwd) {
      return true
    }
    console.error(
      chalk.red(
        'Could not start an npm process in the right directory.\n\n' +
          `The current directory is: ${chalk.bold(cwd)}\n` +
          `However, a newly started npm process runs in: ${chalk.bold(
            npmCWD
          )}\n\n` +
          'This is probably caused by a misconfigured system terminal shell.'
      )
    )
    if (process.platform === 'win32') {
      console.error(
        chalk.red('On Windows, this can usually be fixed by running:\n\n') +
          `  ${chalk.cyan(
            'reg'
          )} delete "HKCU\\Software\\Microsoft\\Command Processor" /v AutoRun /f\n` +
          `  ${chalk.cyan(
            'reg'
          )} delete "HKLM\\Software\\Microsoft\\Command Processor" /v AutoRun /f\n\n` +
          chalk.red('Try to run the above two lines in the terminal.\n') +
          chalk.red(
            'To learn more about this problem, read: https://blogs.msdn.microsoft.com/oldnewthing/20071121-00/?p=24433/'
          )
      )
    }
    return false
  }

  // If project only contains files generated by GH, it’s safe.
  // We also special case IJ-based products .idea because it integrates with CRA:
  // https://github.com/facebookincubator/create-react-app/pull/368#issuecomment-243446094
  isSafeToCreateProjectIn(root, name) {
    const validFiles = [
      '.DS_Store',
      'Thumbs.db',
      '.git',
      '.gitignore',
      '.idea',
      'README.md',
      'LICENSE',
      'web.iml',
      '.hg',
      '.hgignore',
      '.hgcheck',
      '.npmignore',
      'mkdocs.yml',
      'docs',
      '.travis.yml',
      '.gitlab-ci.yml',
      '.gitattributes'
    ]
    console.log()

    const conflicts = fs
      .readdirSync(root)
      .filter(file => !validFiles.includes(file))
    if (conflicts.length < 1) {
      return true
    }

    console.log(
      `The directory ${chalk.green(name)} contains files that could conflict:`
    )
    console.log()
    for (const file of conflicts) {
      console.log(`  ${file}`)
    }
    console.log()
    console.log(
      'Either try using a new directory name, or remove the files listed above.'
    )

    return false
  }

  printValidationResults(results) {
    if (typeof results !== 'undefined') {
      results.forEach(error => {
        console.error(chalk.red(`  *  ${error}`))
      })
    }
  }

  checkAppName(appName) {
    const validationResult = validateProjectName(appName)
    if (!validationResult.validForNewPackages) {
      console.error(
        `Could not create a project called ${chalk.red(
          `"${appName}"`
        )} because of npm naming restrictions:`
      )
      this.printValidationResults(validationResult.errors)
      this.printValidationResults(validationResult.warnings)
      process.exit(1)
    }
  }

  async checkPackageName(packageName) {
    if (typeof packageName === 'undefined') {
      console.error('Please specify the project directory:')
      console.log(
        `  ${chalk.cyan(this.programName)} ${chalk.green(
          '<project-directory>'
        )}`
      )
      console.log()
      console.log('For example:')
      console.log(
        `  ${chalk.cyan(this.programName)} ${chalk.green('my-react-app')}`
      )
      console.log()
      console.log(
        `Run ${chalk.cyan(`${this.programName} --help`)} to see all options.`
      )
      process.exit(1)
    }
  }

  checkNpmVersion() {
    let hasMinNpm = false
    let npmVersion = null
    try {
      npmVersion = execSync('npm --version')
        .toString()
        .trim()
      hasMinNpm = semver.gte(npmVersion, '3.0.0')
    } catch (err) {
      // ignore
    }
    return {
      hasMinNpm: hasMinNpm,
      npmVersion: npmVersion
    }
  }

  checkNodeVersion() {
    const currentNodeVersion = process.versions.node
    const semver = currentNodeVersion.split('.')
    const major = semver[0]

    if (major < 4) {
      console.error(
        chalk.red(
          'You are running Node ' +
            currentNodeVersion +
            '.\n' +
            'Create React App requires Node 4 or higher. \n' +
            'Please update your version of Node.'
        )
      )
      process.exit(1)
    }
  }
}

module.exports = InitCommand
