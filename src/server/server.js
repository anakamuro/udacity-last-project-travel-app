const express = require("express");
const app = express();
// Require Express to run server and routes

// Start up an instance of app
const bodyParser = require("body-parser");
const favicon = require("serve-favicon");
/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require("cors");
const { response } = require("express");
app.use(cors());
// Initialize the main project folder
app.use(express.static("./dist"));

// Setup Server
const PORT = 8085;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

const tripData = {};

app.get("/", function (req, res) {
  res.sendFile("./dist/index.html", { root: __dirname });
});

module.exports = app;