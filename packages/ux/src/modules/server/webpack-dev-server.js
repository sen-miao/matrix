// 服务器模块
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
// const debug = require('debug')
const merge = require('webpack-merge')
const opn = require('opn')

const { typeOf } = require('../../utils')

const defaultServerConfig = {
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  historyApiFallback: true,
  // hot: true,
  overlay: true,
  publicPath: '/',
  // quiet: true,
  watchOptions: {
    ignored: /node_modules/
  },
  stats: { colors: true },
  compress: true
}

module.exports = (options = {}, cb) => {
  const { webpackConfig, serverConfig, config } = options
  const { url, host, port, ...otherServerConfig } = serverConfig

  if (Array.isArray(webpackConfig.entry)) {
    webpackConfig.entry = [
      `${require.resolve('webpack-dev-server/client')}?${url}`
    ].concat(webpackConfig.entry)
  } else {
    webpackConfig.entry = [
      `${require.resolve('webpack-dev-server/client')}?${url}`,
      webpackConfig.entry
    ]
  }

  const compiler = webpack(webpackConfig)
  const { open } = config
  const webpackDevServerOptions = merge(
    defaultServerConfig,
    otherServerConfig,
    {
      publicPath: webpackConfig.output.publicPath
    }
  )
  const server = new WebpackDevServer(compiler, webpackDevServerOptions)

  server.listen(port, host, err => {
    if (err) return cb(err)
    if (open) {
      // --open
      if (typeOf(open) === 'boolean') opn(url)
      // --open=firefox
      else opn(url, { app: open })
    }
  })
}
