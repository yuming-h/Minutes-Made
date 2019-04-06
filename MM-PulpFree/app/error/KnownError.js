/**
 * An error with a message and code that is known.  Normally thrown when we expect and catch an incorrect user input.
 * Ex: We throw a KnownError when a user tries to login with an email that doesn't exist.
 */
class KnownError extends Error {
  constructor(message, code) {
    super(message);
    //Ensure name of this error is same as className
    this.name = this.constructor.name;
    this.code = code;
    //Removes constructor invocation from stack trace. Not required but makes it nicer.
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = KnownError;
