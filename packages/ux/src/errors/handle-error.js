const { ConfigValidationError, KarmaExitCodeError, UserError } = require('.')

module.exports = error => {
  if (error instanceof UserError) {
    console.error(red(error.message))
  } else if (error instanceof ConfigValidationError) {
    error.report.log()
  } else if (error instanceof KarmaExitCodeError) {
    console.error(red(`Karma exit code was ${error.exitCode}`))
  } else {
    console.error(red(`Error running command: ${error.message}`))
    if (error.stack) {
      console.error(error.stack)
    }
  }
  process.exit(1)
}
