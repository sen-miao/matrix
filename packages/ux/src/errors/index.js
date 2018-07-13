// @flow
/**
 * An error related to user input or configuration, or anything else the user is
 * responsible for and can fix.
 */
exports.UserError = class UserError extends Error {
  constructor(message) {
    super(message)
    // Make instanceof UserError work in ES5
    // $FlowFixMe
    this.constructor = UserError
    // $FlowFixMe
    this.__proto__ = UserError.prototype // eslint-disable-line no-proto
  }
}

exports.KarmaExitCodeError = class KarmaExitCodeError {
  constructor(exitCode) {
    this.exitCode = exitCode
  }
}

exports.ConfigValidationError = class ConfigValidationError {
  constructor(report) {
    this.report = report
  }
}
