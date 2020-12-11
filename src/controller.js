const hash = require("object-hash");
let Shortened = require("./models/shortened.model");
const URL_BASE = "http://localhost";

const INVALID_CHARACTERS_REGEXP = /[ "<>\^`{|}]/;
const isUrlInvalid = (url) =>
  ((url || "").match(INVALID_CHARACTERS_REGEXP) || []).length;

module.exports = {
  create: function (req, res) {
    try {
      const url = req.body.url;

      // validation
      // 1. must have url param
      // 2. url cannot contain invalid characters
      if (!url || isUrlInvalid(url)) {
        return res.status(400).send(); // RETURN early with 400
      }

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
          res.status(200).send(`${URL_BASE}/${hashed}`);
        })
        .catch(() => {
          res.status(500).send();
        });
    } catch (error) {
      console.log("ERROR IN POST CONTROLLER:", error);
    }
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
      .catch((err) => {
        res.status(500).send();
      });
  },
};
