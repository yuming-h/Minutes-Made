const app = module.exports = require('express')();

const { signup } = require('../actions').auth

app.post('/signup', (req, res) => {
  signup(req.body)
    .then(() => res.send({
      msg: "User created successfully!"
    })
    )
    .catch((err) => {
      res.status(400).send(err)
    })
})
