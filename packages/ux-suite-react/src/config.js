import path from 'path'

const context = path.resolve(__dirname, '..')
const config = {
  babel: {
    presets: [require.resolve('@babel/preset-react')]
  },
  output: {
    commonjs: true,
    module: true,
    umd: true
  },
  webpack: {
    resolve: {
      modules: [path.join(context, '..', 'ux-suite-react', 'node_modules')]
    }
  }
}

export default config
