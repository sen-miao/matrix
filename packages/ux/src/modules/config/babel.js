// import merge from 'webpack-merge'

export default function processBabelConfig(webpackConfig, suiteBabelConfig) {
  if (suiteBabelConfig) {
    const babelRuleIndex = webpackConfig.module.rules.findIndex(
      item => item.loader === 'babel-loader'
    )

    if (babelRuleIndex !== -1) {
      const babelRule = webpackConfig.module.rules[babelRuleIndex]

      Object.keys(suiteBabelConfig).forEach(key => {
        if (Array.isArray(suiteBabelConfig[key])) {
          babelRule.options[key] = babelRule.options[key].concat(
            suiteBabelConfig[key]
          )
        } else {
          babelRule.options[key] = suiteBabelConfig[key]
        }
      })

      webpackConfig.module.rules[babelRuleIndex] = babelRule
    }
  }

  return webpackConfig
}
