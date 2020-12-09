const mongoose = require("mongoose");
const URI = require("../config/db");

mongoose
  .connect(process.env.MONGODB_URI || URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => handleError(error));

// Log any errors after initial connection
mongoose.connection.on("error", (error) => {
  console.log("Database connection error:", error);
});

// Log when connected to DB
mongoose.connection.once("open", () => {
  console.log("Connected to Database");
});
