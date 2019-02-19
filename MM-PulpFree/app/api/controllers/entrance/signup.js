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
      description: 'The email address for the account',
      extendedDescription: 'Must be a valid email address',
    },

    password: {
      required: true,
      type: 'string',
      maxLength: 200,
      example: 'passwordlol',
      description: 'The unencrypted password to use for the new account.'
    },

    firstname: {
      required: true,
      type: 'string',
      example: 'Steve',
      description: 'The user\'s full name'
    },

    lastname: {
      required: true,
      type: 'string',
      example: 'Steve',
      description: 'The user\'s last name'
    },

    language: {
      required: true,
      type: 'string',
      example: 'en',
      description: 'ISO-361 language code'
    },

    country: {
      required: true,
      type: 'string',
      example: 'us',
      description: 'ISO-3166 alpha-2 country code'
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
    User.create({
      email: lcEmailAddress,
      pass: await sails.helpers.hashPass(input.password),
      firstname: inputs.firstname,
      lastname: inputs.lastname,
      country: inputs.country,
      lang: inputs.language
    })
    .intercept('E_UNIQUE', 'emailAlreadyInUse')
  }
};

