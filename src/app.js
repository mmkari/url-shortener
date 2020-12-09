const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app
  .get("/", (req, res) => {
    res.send("Hello");
  })
  .post("/", (req, res) => {
    console.log("Req body", req.body);
    res.send("Hello POST");
  });

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
