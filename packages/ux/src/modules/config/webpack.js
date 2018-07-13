import merge from 'webpack-merge'

export default function processWebpackConfig(
  webpackConfig,
  suiteWebpackConfig
) {
  if (!suiteWebpackConfig) {
    return webpackConfig
  }

  return merge(webpackConfig, suiteWebpackConfig)
}
