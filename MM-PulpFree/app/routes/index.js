const app = (module.exports = require("express")());

//ROUTES
app.use("/auth", require("./auth"));
app.use("/meeting", require("./meeting"));
app.use("/users", require("./user"));

//CATCH
app.all("*", (req, res) => {
  res.status(404).send({ msg: "Not found" });
});
