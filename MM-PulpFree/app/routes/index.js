const app = (module.exports = require("express")());
const passport = require("passport");

//ROUTES
app.use("/auth", require("./auth"));
app.use(
  "/meeting",
  passport.authenticate("jwt", { session: false }),
  require("./meeting")
);
app.use(
  "/users",
  passport.authenticate("jwt", { session: false }),
  require("./user")
);

//CATCH
app.all("*", (req, res) => {
  res.status(404).send({ msg: "Not found" });
});
