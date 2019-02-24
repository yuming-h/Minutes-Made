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
  const hashedPass = await hashPass(body.pass)

  //Get db client from client pool
  const client = await pool.connect()
  try {
    //Create user
    const d = new Date()
    const epochSeconds = Math.round(d.getTime() / 1000)
    const dbArr = [body.email, hashedPass, body.country, body.lang, body.firstname, body.lastname, epochSeconds]
    const res = await client.query('INSERT INTO users(email, pass, country, lang, firstname, lastname, lastlogin) VALUES($1, $2, $3, $4, $5, $6, $7)', dbArr)
    return (JSON.stringify(res))
  } finally {
    client.release()
  }
}



module.exports = {
  signup
}
