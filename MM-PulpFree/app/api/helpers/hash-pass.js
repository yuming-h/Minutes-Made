const bcrypt = require('bcrypt')
module.exports = {

  friendlyName: 'Hash pass',


  description: 'Hashes and salts a pass with bcrypt, returning the hashed/salted pass',


  inputs: {
    password:{ 
      required: true,
      type: 'string',
      maxLength: 200,
      example: 'passwordlol',
      description: 'The unencrypted password to salt and hash'
    }
  },

  fn: async function (inputs, exits) {
    const saltRounds = 12
    bcrypt.hash(inputs.password, saltRounds, (err, hash) => {
      if (err) {
        return exits.error(err)
      }
      else {
        return exits.success(hash)
      }
    })
  }
};
