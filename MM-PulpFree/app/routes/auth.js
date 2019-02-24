const app = module.exports = require('express')();

const {signup} = require('../actions').auth

app.post('/signup', (req, res) => {
  signup(req.body)
    .then((user) => res.send({
        user
      })
    )
    .catch((err) => {
      console.log(err.stack)
      res.status(400).send({msg: "Signup failed", err: err.message})
    })
})