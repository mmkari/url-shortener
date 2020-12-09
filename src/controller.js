const hash = require("object-hash");

module.exports = {
  create: function (req, res) {
    const url = req.body.url;
    console.log("CREATING URL from", url);
    const ms = new Date().getTime();
    const hashed = hash(url + ms);
    console.log("hash result:", hashed.substring(0, 16));

    res.send("SHORTENED");
  },

  findById: function (req, res) {
    const id = req.params.id;
    console.log("FINDING original for ID", id);

    res.send("ORIGINAL URL");
  },
};
