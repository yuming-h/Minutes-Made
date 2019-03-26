const { signup, login } = require("./auth");
const { create, connect, end } = require("./meeting");

module.exports = {
  auth: {
    signup,
    login
  },
  meeting: {
    create,
    connect,
    end
  }
};
