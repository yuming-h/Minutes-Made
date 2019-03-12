const bcrypt = require("bcrypt");

/**
 * Returns the hashed password async.
 * @param String pass
 */
const hashPass = async pass => {
  const saltRounds = 12;
  return await bcrypt.hash(pass, saltRounds);
};

module.exports = {
  hashPass
};
