const ErrorCodes = {
  //Auth ERRORS (1000 - 1999):
  AUTH: {
    EMAIL_NOT_FOUND: 1000,
    PASSWORD_INCORRECT: 1001
  },
  // User ERRORS (2000 - 2999):
  USER: {
    NOT_FOUND: 2000
  }
};

module.exports = ErrorCodes;
