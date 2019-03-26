const app = (module.exports = require("express")());

const { create, connect, end } = require("../actions").meeting;

// Spawns a Minutes Made meeting
app.post("/create", (req, res) => {
  create(req.body)
    .then(meeting =>
      res.send({
        msg: "Meeting created successfully!",
        meeting: meeting
      })
    )
    .catch(err => {
      res.status(500).send(err.message);
    });
});

// Returns the URL of an existing meeting
app.post("/connect", (req, res) => {
  connect(req.body)
    .then(meeting =>
      res.send({
        meeting_url: meeting.url
      })
    )
    .catch(err => {
      res.status(500).send(err.message);
    });
});

// Sends the shutdown signal to the meeting
app.post("/end", (req, res) => {
  end(req.body)
    .then(() =>
      res.send({
        msg: "Meeting ended succcessfully"
      })
    )
    .catch(err => {
      res.status(500).send(err.message);
    });
});
