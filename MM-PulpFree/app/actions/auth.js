const { hashPass } = require('../utils/hashPass')
const { pool } = require('../middleware/db')

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

const signup = async (body) => {
  //Get db client from client pool
  const client = await pool.connect()
  try {
    const hashedPass = await hashPass(body.pass)
    //Create user
    const d = new Date()
    const epochSeconds = Math.round(d.getTime() / 1000)
    const dbArr = [body.email, hashedPass, body.country, body.lang, body.firstname, body.lastname, epochSeconds]
    const res = await client.query('INSERT INTO users(email, password, country, lang, firstname, lastname, lastlogin) VALUES($1, $2, $3, $4, $5, $6, $7)', dbArr)
    return (JSON.stringify(res))
  } catch(e) {
    //For now we will just log errors to the server's console.
    console.log(e)
    throw new Error("Error creating account, please try again.")
  } finally {
    client.release()
  }
}

/**
 * Logs a user in and returns their JWT if successful.
 * body: {
 *  email: String
 *  pass: String
 * }
 * @param Object body
 */
const login = async (body) => {
  //Get hashed pass from db
  const client = await pool.connect()
  try {
    const email = [body.email]
    const res = await client.query('SELECT "password", email FROM users WHERE email = $1', email)
    const passMatch = await bcrypt.compare(body.pass, res.password);
    if (passMatch) {
      const epochSeconds = Math.round(d.getTime() / 1000)
      const dbParams = [epochSeconds, body.email]
      await client.query('UPDATE users SET lastlogin = $1 WHERE email = $2', dbParams)
    }
    return false
  } catch(e) {
    console.log(e)
    throw new Error("Error logging in, please try again")
  } finally {
    client.release()
  }
}



module.exports = {
  signup,
  login
}
