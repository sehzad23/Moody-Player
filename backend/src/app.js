// src/app.js

const express = require("express");
const cors = require("cors");
const songrouter = require("../src/routes/song.route");

const app = express();

// ✅ Enable CORS for all routes
app.use(cors());

// Middleware
app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to the Music App API");
});

//routes
app.use("/", songrouter);

module.exports = app;
