const geoNamesURL = "http://api.geonames.org/searchJSON?q=";
const username = "akiakiaki";
const darkSkyURL = "https://api.darksky.net/forecast/";
const darkSkyKey = "8e4bdd3f43bdcb3bfede76e626ebb13f";
const pixabayURL = "https://pixabay.com/api/?key=";
const pixabayAPI = "15817374-015ecdcbd68299917ebff2ba6";

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
app.get("/all", getInfo);

function getInfo(req, res) {
  res.send(tripData);
}

app.post("/postData", function (req, res) {
  const requestBody = req.body;

  tripData.Scity = requestBody.Scity;
  tripData.Dcity = requestBody.Dcity;
  tripData.Ddate = requestBody.Ddate;
  tripData.Adate = requestBody.Adate;
  tripData.countdown = requestBody.countdown;
  tripData.cityImage = requestBody.cityImage;
  tripData.weather_condition = requestBody.weather_condition;
  tripData.temperature = requestBody.temperature;

  res.send(tripData);
});

app.post("http://www.localhost:8085/getGeoData", function (req, res) {
  async function getGeoData(destinationCity) {
    const response = await fetch(
      `http://api.geonames.org/searchJSON?q=${req.body["destinationCity"]}&maxRows=10&username=${username}`
    );
    try {
      const GeoData = await response.json();
      if(GeoData.totalResultsCount == 0) {
        return { error: "The "+ city +" can't be found" };
    }
    console.log(GeoData);
      return GeoData;
     
    } catch (e) {
      console.log("error", e);
    }
  }
});

app.post("http://www.localhost:8085/getWeatherData", function (req, res) {
async function getWeatherData(toLat, toLng, arrivingDate) {
  const response = await fetch(
    `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${darkSkyKey}/${req.body["toLat"]},${req.body["toLng"]},${parseInt(
      new Date(arrivingDate).getTime() / 1000
    )}`
  );
  try {
    const weatherData = await response.json();
    console.log(weatherData);
    return weatherData;
  } catch (e) {
    console.log("error", e);
  }
}
});

app.post("http://www.localhost:8085/getPhoto", function (req, res) {
 async function getPhoto(DcityPhoto) {
  const response = await fetch(
    `https://pixabay.com/api/?key=${pixabayAPI}&q=${req.body["DcityPhoto"]}&image_type=photo=true`
  );
  try {
    const imageData = await response.json();
    console.log(imageData);
    return imageData;
  } catch (e) {
    console.log("error", e);
  }
}
});

module.exports = app;