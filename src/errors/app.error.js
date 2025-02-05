export class AppError extends Error {
  _status
  _rootCause
  _details
  _logMessage

  constructor(error, options) {
    super(error.message, options)
    this.name = this.constructor.name
  }

  static from(error, status) {
    const appError = new AppError(error)
    appError._status = status
    Error.captureStackTrace(appError, this.from)
    return appError
  }

  getRootCause() {
    if (this._rootCause) {
      return this._rootCause instanceof AppError ? this.rootCause.getRootCause() : this.rootCause
    }
    return null
  }

  // Wrapper (Design Pattern)
  wrap(rootCause) {
    const appError = AppError.from(this, this._status)
    appError._rootCause = rootCause
    return appError
  }

  withDetail(key, value) {
    if (!this._details) this._details = {}
    this._details[key] = value
    return this
  }

  withLog(logMessage) {
    this._logMessage = logMessage
    return this
  }

  withMessage(message) {
    super.message = message
    return this
  }

  toJSON(isProduction = true) {
    const rootCause = this.getRootCause()
    return isProduction
      ? {
          status: this._status,
          code: this._code,
          message: this.message,
          details: this._details
        }
      : {
          status: this._status,
          code: this._code,
          message: this.message,
          rootCause: rootCause ? rootCause.message : this.message,
          details: this._details,
          logMessage: this._logMessage
        }
  }

  getStatus() {
    return this._status
  }
}
