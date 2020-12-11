const mongoose = require("mongoose");
const URI = require("../config/db");

const MONGODB_URI = process.env.MONGODB_URI || URI;
const CONNECTION_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

const createConnection = async () => {
  // if no existing connection...
  if (mongoose.connection.readyState === 0) {
    // create connection
    await mongoose.connect(MONGODB_URI, CONNECTION_OPTIONS);
  }
};

const closeConnection = async () => {
  // need to clear models, otherwise get error from "mocha --watch" overwriting models
  mongoose.models = {};
  mongoose.modelSchemas = {};
  await dropDatabase();
  // disconnect if connected
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};

const dropDatabase = async () => {
  // clear database content between tests
  if (mongoose.connection && mongoose.connection.db) {
    await mongoose.connection.dropDatabase();
  }
};

// Log any errors after initial connection
mongoose.connection.on("error", (error) => {
  console.log("Database connection error:", error);
});

// Log when connected to DB
mongoose.connection.once("open", () => {
  console.log("Connected to Database");
});

module.exports = { createConnection, closeConnection, dropDatabase };
