const app = (module.exports = require("express")());

const { signup, login } = require("../actions").auth;

//Signs a user up, creating an entry into our postgres db
app.post("/signup", (req, res) => {
  signup(req.body)
    .then(() =>
      res.send({
        msg: "User created successfully!"
      })
    )
    .catch(err => {
      res.status(500).send(err.message);
    });
});

//Authenticates the login credentials and returns a jwt that the client should save in local storage
app.post("/login", (req, res) => {
  login(req.body)
    .then(jwt =>
      res.send({
        jwt
      })
    )
    .catch(err => {
      if (err instanceof KnownError) {
        res.status(401).send(err.message);
      }
      res.status(500).send(err.message);
    });
});
