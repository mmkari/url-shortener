const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = require("./router");
require("./models"); // connect to DB

const createApp = () => {
  const app = express();
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use("/", router);

  return app;
};

module.exports = createApp;
