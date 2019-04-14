const { signup, login } = require("./auth");
const { schedule, start, connect, finish, end } = require("./meeting");
const { meetings } = require("./user");

module.exports = {
  auth: {
    signup,
    login
  },
  meeting: {
    schedule,
    start,
    connect,
    finish,
    end
  },
  user: {
    meetings
  }
};
