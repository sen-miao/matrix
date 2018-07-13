const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const pkgDir = require('pkg-dir')

const pkg = require(path.resolve('package.json'))
const dist = path.resolve('demo/dist')
// const { directoryExists } = require('../../utils')
const context = pkgDir.sync(__dirname)

const config = {
  devtool: 'cheap-module-source-map',
  mode: 'development',
  entry: [path.resolve('demo/src/index.js')],
  output: {
    filename: 'demo.js',
    path: dist,
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        options: {
          babelrc: false,
          cacheDirectory: false,
          presets: [require.resolve('@babel/preset-env')],
          plugins: [
            // require.resolve('@babel/plugin-proposal-export-namespace-from'),
            // require.resolve('@babel/plugin-proposal-export-default-from')
          ]
        }
      },
      {
        test: /\.(gif|png|webp)$/,
        loader: 'url-loader'
      },
      {
        test: /\.svg?$/,
        loader: 'url-loader'
      },
      {
        test: /\.jpe?g$/,
        loader: 'url-loader'
      },
      {
        test: /\.(eot|otf|ttf|woff|woff2)?$/,
        loader: 'url-loader'
      },
      {
        test: /\.(mp4|ogg|webm)$/,
        loader: 'url-loader'
      },
      {
        test: /\.(wav|mp3|m4a|aac|oga)$/,
        loader: 'url-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      mountId: 'demo',
      template: path.join('demo/public/index.html'),
      inject: true,
      title: `${pkg.name} ${pkg.version} Demo`
    })
  ],
  resolveLoader: {
    modules: ['node_modules', path.join(context, 'node_modules')]
  },
  resolve: {
    modules: ['node_modules', path.join(context, 'node_modules')]
  }
  // externals: {
  //   react: 'React',
  //   'react-dom': 'ReactDOM'
  // }
}

// if (directoryExists('demo/public')) {
//   config.plugins.copy = [{ from: path.resolve('demo/public'), to: dist }]
// }

module.exports = config
