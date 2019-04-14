const app = (module.exports = require("express")());

const KnownError = require("../error/KnownError");
const { meetings } = require("../actions").user;

app.get("/:userId/meetings", (req, res) => {
  meetings(req.params)
    .then(meetingMetas => {
      res.send({
        meetingMetas
      });
    })
    .catch(err => {
      if (err instanceof KnownError) {
        res.status(401).send(err.message);
      }
      res.status(500).send(err.message); // TODO do not expose stack trace
    });
});
