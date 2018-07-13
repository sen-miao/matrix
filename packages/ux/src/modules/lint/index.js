import spawn from 'cross-spawn'
import path from 'path'

export default function() {
  spawn(
    'node',
    [
      require.resolve('eslint/bin/eslint'),
      '--config',
      path.join(__dirname, '.eslintrc.yml'),
      // '--ignore-path',
      // path.join(__dirname, '.eslintignore'),
      '.'
      // 'src/**',
      // 'test/**'
    ],
    {
      stdio: 'inherit'
    }
  )
}
