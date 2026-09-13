// A small error class that carries an HTTP status code.
// Controllers and services throw this; the error middleware turns it into JSON.

class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isApiError = true;
  }
}

module.exports = ApiError;
