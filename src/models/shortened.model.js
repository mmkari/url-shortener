const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let Shortened = new Schema({
  hash: {
    type: String,
  },
  original: {
    type: String,
  },
  createdAt: {
    type: Date,
    expires: 60,
    default: Date.now,
  },
});
module.exports = mongoose.model("Shortened", Shortened);
