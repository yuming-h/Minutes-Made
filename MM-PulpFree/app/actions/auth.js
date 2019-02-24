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
  pool.connect((err, client, done) => {
    if (err) {
      console.log("Error connecting to client pool " + err)
      throw Error("Error connecting to client pool " + err)
    }
    //Create user
    const d = new Date()
    const epochSeconds = Math.round(d.getTime() / 1000)
    const dbArr = [body.email, hashedPass, body.country, body.lang, body.firstname, body.lastname, epochSeconds]
    client.query('INSERT INTO users(email, pass, country, lang, firstname, lastname, lastlogin) VALUES($1, $2, $3, $4, $5, $6, $7)', dbArr, (err, res) => {
      done()
      if (err) {
        console.log("Error inserting new user: " + err)
      }
      else {
        console.log(res.rows[0])
        return res.rows[0]
      }
    })
  })
}

module.exports = {
  signup
}