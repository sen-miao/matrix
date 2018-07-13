import spawn from 'cross-spawn'
// import pkgDir from 'pkg-dir'

// const context = pkgDir.sync(__dirname)

export default function() {
  spawn(
    'node',
    [
      require.resolve('./mocha'),
      '--opts',
      require.resolve('./mocha.opts'),
      '--file',
      require.resolve('./setup')
    ],
    {
      stdio: 'inherit'
    }
  )
}
