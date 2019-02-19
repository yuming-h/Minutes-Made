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


  exits: {
    success: {
      description: 'All done.',
    },
    hashError: {
      description: 'There was an error hashing the password',
    }
  },

  fn: async function (inputs) {
    const saltRounds = 12
    bcrypt.hash(inputs.password, saltRounds).then((err, hash) => {
      if (err) {
        return exits.hashError(err)
      }
      else {
        return exits.success(hash)
      }
    })
  }
};
