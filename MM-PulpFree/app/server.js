const express = require("express");
const app = express();
const routes = require("./routes");
require("./middleware/passport");

app.use(express.json());

app.use(routes);

app.listen(8080, "0.0.0.0", () => {
  console.log(`App running at http://0.0.0.0:8080`);
});
