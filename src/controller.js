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
        res.status(200).send(hashed);
      })
      .catch(() => {
        res.status(400).send();
      });
  },

  findById: function (req, res) {
    const id = req.params.id;

    Shortened.findOne({
      hash: id,
    })
      .exec()
      .then((doc) => {
        if (doc) {
          res.status(200).send(doc.original);
        } else {
          res.status(404).send();
        }
      })
      .catch(() => {
        res.status(500).send();
      });
  },
};
