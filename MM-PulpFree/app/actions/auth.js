const { hashPass } = require("../utils/hashPass");
const { pool } = require("../middleware/db");
const conf = require("../config/config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const axios = require("axios");

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
      epochSeconds
    ];

    // Make the write request to the db writer service
    const res = await axios.post("http://mmkoolaid:5050/users/create", {
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
  let passCorrect;

  try {
    const requestEmail = body.email;

    // Get the password data from the db writer service
    const res = await axios
      .post("http://mmkoolaid:5050/users/password", {
        email: requestEmail
      })
      .catch(error => {
        if (error.response.status == 404) {
          throw new Error("Email not found, please check it or signup at: ");
        } else {
          throw error;
        }
      });

    // Check if the password is correct
    passCorrect = await bcrypt.compare(body.pass, res.data.password);

    if (passCorrect) {
      const d = new Date();
      const epochSeconds = Math.round(d.getTime() / 1000);
      const dbParams = [epochSeconds, body.email];

      await axios.put("http://mmkoolaid:5050/users/login-timestamp", {
        email: body.email,
        timestamp: epochSeconds
      });

      const jwtBody = {
        userId: res.userId
      };
      const jwtOpts = {
        issuer: "Minutes Made",
        algorithm: "HS256",
        expiresIn: "1h"
      };
      // Unfortunately jwt doesn't support async/await so going to try this sync for now.
      return jwt.sign(jwtBody, conf.tokenSecret, jwtOpts);
    }
  } catch (e) {
    console.log(e);
    throw new Error("Error logging in, please try again");
  }
  if (!passCorrect) {
    throw new Error("Password incorrect, please try again");
  }
};

module.exports = {
  signup,
  login
};
