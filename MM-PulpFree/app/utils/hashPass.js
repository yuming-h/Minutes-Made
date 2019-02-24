const bcrypt = require('bcrypt')

const hashPass = async (pass) => {
  const saltRounds = 12
  return await bcrypt.hash(pass, saltRounds)
}

module.exports = {
  hashPass
}
