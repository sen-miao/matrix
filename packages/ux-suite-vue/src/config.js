import path from 'path'
import VueLoaderPlugin from 'vue-loader/lib/plugin'

const context = path.resolve(__dirname, '..')
const config = {
  babel: {
    presets: [require.resolve('babel-preset-vue')]
  },
  output: {
    commonjs: true,
    module: true,
    umd: true
  },
  webpack: {
    resolveLoader: {
      modules: [path.join(context, 'node_modules')]
    },
    resolve: {
      modules: [path.join(context, '..', 'ux-suite-vue', 'node_modules')]
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        }
      ]
    },
    plugins: [new VueLoaderPlugin()]
  }
}

export default config
