// server.js (root folder)
require("dotenv").config();
const ConnectDB = require("./src/db/db");
const app = require("./src/app");

// Connect MongoDB
ConnectDB();

// Start the server
app.listen(3000, () => {
  console.log("Server is Runnig on Port 3000");
});
