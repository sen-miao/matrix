import path from 'path'
import fs from 'fs'

import webpack from 'webpack'
// import merge from 'webpack-merge'
import spawn from 'cross-spawn'
import ora from 'ora'

import config from './config/umd'
import processBabelConfig from '../config/babel'
import processWebapckConfig from '../config/webpack'
import { deepMerge } from '../../utils'

export default function(argv, suiteConfig = {}, userConfig = {}) {
  const {
    babel: suiteBabelConfig = {},
    output: suiteOutputConfig = {},
    webpack: suiteWebpackConfig = {}
  } = deepMerge(suiteConfig || {}, userConfig || {})

  if (
    !suiteOutputConfig.umd &&
    !suiteOutputConfig.module &&
    !suiteOutputConfig.commonjs
  ) {
    console.log('One of the { module、commonjs、umd } in output must be true')
    return
  }

  let webpackConfig = processWebapckConfig(config, suiteWebpackConfig)

  webpackConfig = processBabelConfig(webpackConfig, suiteBabelConfig)

  if (suiteOutputConfig.umd) {
    const compiler = webpack(webpackConfig)

    compiler.run(err => {
      if (err) {
        throw err
      }

      return
    })
  }

  compile(suiteOutputConfig, suiteBabelConfig, () => {})
}

function runBabel(name, { outDir, src, config }, cb) {
  const configPath = path.join(__dirname, 'config', `${name}.babelrc`)

  fs.writeFile(configPath, JSON.stringify(config, null, 2), err => {
    if (err) return cb(err)

    const args = [
      src,
      '--out-dir',
      outDir,
      '--quiet',
      '--copy-files',
      '--config-file',
      configPath
    ]
    const spinner = ora(`Creating ${name} build\n`).start()
    const babelProcess = spawn(
      'node',
      [require.resolve('@babel/cli/bin/babel')].concat(args),
      {
        stdio: 'inherit'
      }
    )

    babelProcess.on('exit', code => {
      let babelError

      if (code !== 0) {
        spinner.fail()
        babelError = new Error('Babel transpilation failed')
      } else {
        spinner.succeed()
      }

      fs.unlink(configPath, unlinkError => {
        cb(babelError || unlinkError)
      })
    })
  })
}

function compile(suiteOutputConfig, suiteBabelConfig, cb) {
  const src = path.resolve('src')

  if (suiteOutputConfig.module) {
    const babelrc = require(path.join(__dirname, 'config', 'module.js'))

    if (!babelrc.presets) {
      babelrc.presets = []
    }

    if (!babelrc.plugins) {
      babelrc.plugins = []
    }

    runBabel(
      'module',
      {
        src,
        config: {
          presets: babelrc.presets.concat(suiteBabelConfig.presets || []),
          plugins: babelrc.plugins.concat(suiteBabelConfig.plugins || [])
        },
        outDir: path.resolve('es')
      },
      cb
    )
  }

  if (suiteOutputConfig.commonjs) {
    const babelrc = require(path.join(__dirname, 'config', 'lib.js'))

    if (!babelrc.presets) {
      babelrc.presets = []
    }

    if (!babelrc.plugins) {
      babelrc.plugins = []
    }

    runBabel(
      'commonjs',
      {
        src,
        config: {
          presets: babelrc.presets.concat(suiteBabelConfig.presets || []),
          plugins: babelrc.plugins.concat(suiteBabelConfig.plugins || [])
        },
        outDir: path.resolve('lib')
      },
      cb
    )
  }
}
