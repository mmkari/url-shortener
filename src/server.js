const createApp = require("./app");
const models = require("./models");

const PORT = 80;

const app = createApp();
models.createConnection();

const server = app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});

const closeServer = () => {
  server.close(() => {
    console.log("Closed down server");
  });
};

process.on("SIGINT", closeServer);
process.on("SIGTERM", closeServer);
