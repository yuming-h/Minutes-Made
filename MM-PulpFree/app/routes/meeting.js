const app = (module.exports = require("express")());

const { schedule, start, connect, finish, end } = require("../actions").meeting;

// Creates a Minutes Made meeting
app.post("/schedule", (req, res) => {
  schedule(req.body)
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

// Starts a Minutes Made meeting
app.post("/start", (req, res) => {
  start(req.body)
    .then(meeting =>
      res.send({
        msg: "Meeting started successfully!",
        meeting: meeting
      })
    )
    .catch(err => {
      res.status(500).send(err.message);
    });
});

// Returns the URL of an existing meeting
app.get("/connect", (req, res) => {
  connect(req.body)
    .then(meeting =>
      res.send({
        meetingUrl: meeting.meetingUrl
      })
    )
    .catch(err => {
      res.status(500).send(err.message);
    });
});

// Sends the shutdown signal to the meeting
app.post("/finish", (req, res) => {
  finish(req.body)
    .then(() =>
      res.send({
        msg: "Meeting finished succcessfully"
      })
    )
    .catch(err => {
      res.status(500).send(err.message);
    });
});

// Deletes the 404 container for a meeting
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
