const { hashPass } = require("../utils/hashPass");
const { pool } = require("../middleware/db");
const conf = require("../config/config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const axios = require('axios');

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
  axios.post('http://mmkoolaid:5050/users/create', {user: dbArr})
    .then(response => {
      console.log(response.data.url);
      console.log(response.data.explanation);
      return response, null;
    })
    .catch(error => {
      console.log(error);
      throw new Error("Error creating account, please try again.");
    });
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
  let emailCorrect;
  //Get hashed pass from db
  const client = await pool.connect();
  try {
    const email = [body.email];
    const res = await client.query(
      'SELECT "password", email, userid FROM users WHERE email = $1',
      email
    );
    //Ensure we get exactly 1 row back
    if (res.rows.length === 1) {
      emailCorrect = true;
      passCorrect = await bcrypt.compare(body.pass, res.rows.pop().password);
    } else {
      emailCorrect = false;
      passCorrect = false;
    }
    if (passCorrect) {
      const d = new Date();
      const epochSeconds = Math.round(d.getTime() / 1000);
      const dbParams = [epochSeconds, body.email];
      await client.query(
        "UPDATE users SET lastlogin = $1 WHERE email = $2",
        dbParams
      );
      const jwtBody = {
        userId: res.userId
      };
      const jwtOpts = {
        issuer: "Minutes Made",
        algorithm: "HS256",
        expiresIn: "1h"
      };
      //Unfortunately jwt doesn't support async/await so going to try this sync for now.
      return jwt.sign(jwtBody, conf.tokenSecret, jwtOpts);
    }
  } catch (e) {
    console.log(e);
    throw new Error("Error logging in, please try again");
  } finally {
    client.release();
  }
  if (!emailCorrect) {
    //TODO: When we have a website fill in this error message as it will be passed back to the user
    throw new Error("Email not found, please check it or signup at: ");
  }
  if (!passCorrect) {
    throw new Error("Password incorrect, please try again");
  }
};

module.exports = {
  signup,
  login
};
