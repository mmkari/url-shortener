const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 80;

const router = require("./router");
require("./models"); // connect to DB

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", router);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
