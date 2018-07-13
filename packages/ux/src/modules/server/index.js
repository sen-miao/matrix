// import path from 'path'
// import merge from 'webpack-merge'

// import build from '../build'
import config from './config'
import webpackDevServer from './webpack-dev-server'
import processBabelConfig from '../config/babel'
import processWebapckConfig from '../config/webpack'
import { deepMerge } from '../../utils'

export default async (argv, suiteConfig = {}, userConfig = {}) => {
  const {
    babel: suiteBabelConfig,
    // npm: suiteNpmConfig,
    webpack: suiteWebpackConfig
  } = deepMerge(suiteConfig || {}, userConfig || {})
  let webpackConfig = processWebapckConfig(config, suiteWebpackConfig)

  webpackConfig = processBabelConfig(webpackConfig, suiteBabelConfig)

  const serverConfig = {
    url: 'http://localhost:9999/',
    host: 'localhost',
    port: 9999
  }

  webpackDevServer({
    webpackConfig,
    serverConfig,
    config: {
      open: true
    }
  })
}
