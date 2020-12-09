module.exports = {
  create: function (req, res) {
    const url = req.body.url;
    console.log("CREATING URL from", url);

    res.send("SHORTENED");
  },

  findById: function (req, res) {
    const id = req.params.id;
    console.log("FINDING original for ID", id);

    res.send("ORIGINAL URL");
  },
};
