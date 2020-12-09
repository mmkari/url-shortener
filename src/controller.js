const hash = require("object-hash");
let Shortened = require("./models/shortened.model");

module.exports = {
  create: function (req, res) {
    const url = req.body.url;
    const ms = new Date().getTime();
    const hashed = hash(url + ms).substring(0, 16);

    const input = {
      hash: hashed,
      original: url,
    };

    let shortened = new Shortened(input);
    shortened
      .save()
      .then((shortened) => {
        res.status(200).json(shortened);
      })
      .catch((err) => {
        res.status(400).send("url shortening failed");
      });
  },

  findById: function (req, res) {
    const id = req.params.id;
    console.log("FINDING original for ID", id);

    res.send("ORIGINAL URL");
  },
};
