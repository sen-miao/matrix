const config = require('./config')

module.exports = () => {
  // if (argv.hmr !== false && argv.hmre !== false) {
  //   config.babel.presets.push(require.resolve('./react-hmre-preset'))
  // }

  return config
}
