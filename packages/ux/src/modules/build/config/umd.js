import path from 'path'
// import HtmlWebpackPlugin from 'html-webpack-plugin'
import CompressionPlugin from 'compression-webpack-plugin'
import pkgDir from 'pkg-dir'

const pkg = require(path.resolve('package.json'))
const dist = path.resolve('umd')
const context = pkgDir.sync(__dirname)
const config = {
  devtool: 'cheap-module-source-map',
  mode: 'development',
  entry: [path.resolve('src/index.js')],
  output: {
    filename: `${pkg.name}.js`,
    path: dist,
    publicPath: '/',
    libraryTarget: 'umd',
    library: pkg.name
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        options: {
          babelrc: false,
          cacheDirectory: false,
          presets: [require.resolve('@babel/preset-env')]
          // plugins: [
          //   // require.resolve('@babel/plugin-proposal-export-default-from')
          // ]
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
    // new HtmlWebpackPlugin({
    //   mountId: 'demo',
    //   template: path.join('demo/public/index.html'),
    //   inject: true,
    //   title: `${pkg.name} ${pkg.version} Demo`
    // }),
    new CompressionPlugin()
  ],
  resolveLoader: {
    modules: ['node_modules', path.join(context, 'node_modules')]
  },
  resolve: {
    modules: ['node_modules', path.join(context, 'node_modules')]
  }
}

export default config
