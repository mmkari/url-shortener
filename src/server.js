const createApp = require("./app");

const PORT = 80;

const app = createApp();

const server = app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
