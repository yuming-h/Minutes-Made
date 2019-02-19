/**
 * SignupController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
  friendlyName: 'Signup',

  description: 'Sign up for a new user account.',

  extendedDescription: 'Creates an entry into our db.  Will add email verification later.',

  inputs: {
    emailAddress: {
      required: true,
      type: 'string',
      isEmail: true,
      description: 'The email address for the account'
      extendedDescription: 'Must be a valid email address',
    },

    password: {
      required: true,
      type: 'string',
      maxLength: 200,
      example: 'passwordlol',
      description: 'The unencrypted password to use for the new account.'
    },

    firstName: {
      required: true,
      type: 'string',
      example: 'Steve',
      description: 'The user\'s full name'
    },

    lastName: {
      required: true,
      type: 'string',
      example: 'Steve',
      description: 'The user\'s last name'
    },
  },

  exits: {

    success: {
      description: 'New user account was created successfully.'
    },

    invalid: {
      responseType: 'badRequest',
      description: 'The provided fullName, password and/or email address are invalid.',
      extendedDescription: 'If this request was sent from a graphical user interface, the request '+
      'parameters should have been validated/coerced _before_ they were sent.'
    },

    emailAlreadyInUse: {
      statusCode: 409,
      description: 'The provided email address is already in use.',
    },
  },

  fn: async (inputs) =>  {
    
  }
};

