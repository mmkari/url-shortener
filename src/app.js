const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = require("./router");

const createApp = () => {
  const app = express();
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use("/", router);

  return app;
};

module.exports = createApp;
