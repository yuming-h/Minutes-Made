const app = (module.exports = require("express")());

//ROUTES
app.use("/auth", require("./auth"));

//CATCH
app.all("*", (req, res) => {
  res.status(404).send({ msg: "Not found" });
});
