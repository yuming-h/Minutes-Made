const { hashPass } = require("../utils/hashPass");
const conf = require("../config/config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const axios = require("axios");
const ErrorCodes = require("../error/ErrorCodes");
const KnownError = require("../error/KnownError");

/**
 * Signs a user up.  Will add email confirmation later.
 * body: {
 *  pass: String
 *  email: String
 *  country: String
 *  lang: String
 *  firstname: String
 *  lastname: String
 * }
 * @param Object body
 */
const signup = async body => {
  // Create the user data
  try {
    const hashedPass = await hashPass(body.pass);
    const d = new Date();
    const epochSeconds = Math.round(d.getTime() / 1000);
    const dbArr = [
      body.email,
      hashedPass,
      body.country,
      body.lang,
      body.firstname,
      body.lastname,
      epochSeconds,
      epochSeconds
    ];

    // Make the write request to the db writer service
    const res = await axios.post(conf.koolaidDomain + "/users/create", {
      user: dbArr
    });
    console.log("Created user with id " + res.data.userId);
    return res;
  } catch (e) {
    console.log(e);
    throw new Error("Error creating account, please try again.");
  }
};

/**
 * Logs a user in and returns their JWT if successful.
 * body: {
 *  email: String
 *  pass: String
 * }
 * @param Object body
 */
const login = async body => {
  try {
    const requestEmail = body.email;

    // Get the password data from the db writer service
    const res = await axios
      .post(conf.koolaidDomain + "/users/password", {
        email: requestEmail
      })
      //Catch missing emails and throw a KnownError which will be caught and returned to user.
      .catch(err => {
        if (err.response && err.response.status == 404) {
          throw new KnownError(
            "Email not found, please check it or signup at: ",
            ErrorCodes.AUTH.EMAIL_NOT_FOUND
          );
        } else {
          throw err;
        }
      });

    // Check if the password is correct
    const passCorrect = await bcrypt.compare(body.pass, res.data.password);

    //Catch incorrect passwords and throw a KnownError which will be caught and returned to user.
    if (!passCorrect) {
      throw new KnownError(
        "Password incorrect, please try again",
        ErrorCodes.AUTH.PASSWORD_INCORRECT
      );
    } else {
      const d = new Date();
      const epochSeconds = Math.round(d.getTime() / 1000);

      await axios.put(conf.koolaidDomain + "/users/login-timestamp", {
        email: body.email,
        timestamp: epochSeconds
      });

      const jwtBody = {
        userId: res.data.userId
      };
      const jwtOpts = {
        issuer: "Minutes Made",
        algorithm: "HS256",
        expiresIn: "7d"
      };
      // Unfortunately jwt doesn't support async/await so going to try this sync for now.
      return jwt.sign(jwtBody, conf.tokenSecret, jwtOpts);
    }
  } catch (e) {
    //Throws expected errors while throwing the generic for others.
    if (e instanceof KnownError) {
      throw e;
    }
    console.log(e);
    throw new Error("Error logging in, please try again");
  }
};

module.exports = {
  signup,
  login
};
