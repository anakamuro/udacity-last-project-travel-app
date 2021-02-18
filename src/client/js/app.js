const username = "akiakiaki";
const weatherbitforecastURL =
  "https://api.weatherbit.io/v2.0/forecast/daily?lat=";
const weatherbitcurrentURL =
  "https://api.weatherbit.io/v2.0/current?lat=";
const weatherbitkey = "fe1ac0ef90ea41da99320ead77e32bda";
const pixabayKey = "15817374-015ecdcbd68299917ebff2ba6";

if (document.querySelector("#btn-add") != null) {
  document.querySelector("#btn-add").addEventListener("click", handleSubmit);
}

async function handleSubmit(e) {
  e.preventDefault();

  // get user input values
  const startCity = document.getElementById("startCity").value;
  const destinationCity = document.getElementById("destinationCity").value;
  const departingDate = document.getElementById("departingDate").value;
  const arrivingDate = document.getElementById("arrivingDate").value;

  if (
    startCity == "" ||
    destinationCity == "" ||
    departingDate == "" ||
    arrivingDate == ""
  ) {
    alert("You need to write the city and date.");
    return;
  }

  let today = new Date();
  let differenceOfTimes = Math.abs(
    new Date(departingDate).getTime() - new Date(today).getTime()
  );
  let countdown = Math.ceil(differenceOfTimes / (1000 * 60 * 60 * 24));

  const latlng = await getGeoData(destinationCity);

  const cityImage = await getPhoto(destinationCity);

  const {temperature, weather_condition}= await getWeatherData(
    latlng.lat,
    latlng.lng,
    departingDate
  );
 
  updateUI(
    startCity,
    destinationCity,
    departingDate,
    arrivingDate,
    countdown,
    cityImage,
    temperature,
    weather_condition
  );
}

async function getGeoData(destinationCity) {
  const response = await fetch(
    `http://api.geonames.org/searchJSON?q=${destinationCity}&maxRows=10&username=${username}`
  );
  try {
    const GeoData = await response.json();
    if (GeoData.totalResultsCount == 0) {
      return { error: "The " + city + " can't be found" };
    }
    const lat = GeoData.geonames[0].lat;
    const lng = GeoData.geonames[0].lng;
    return { lat, lng };
  } catch (e) {
    console.error("error", e);
  }
}

async function getWeatherData(lat, lng, departingDate) {
  const timestampforTripStartDate = Math.floor(
    new Date(departingDate).getTime() / 1000
  );
  const today = new Date();
  const timestampforToday = Math.floor(
    new Date(today).getTime() / 1000
  );

  
  if (timestampforTripStartDate < timestampforToday) {
    let arrivingDate = new Date(arrivingDate);
   
   let response = await fetch(
      weatherbitcurrentURL +
        lat +
        "&lon=" +
        lng +
        "&start_date=" +
        departingDate +
        "&end_date=" +
        arrivingDate +
        "&key=" +
        weatherbitkey
    );
    try {
      const weatherData = await response.json();
      const temperature = weatherData["data"][0]["temp"];
      const weather_condition =
        weatherData["data"]["0"]["weather"]["description"];
      return { temperature, weather_condition };
    } catch (e) {
      console.error("error", e);
    }
  } else {
    let response = await fetch(
      weatherbitforecastURL + lat + "&lon=" + lng + "&key=" + weatherbitkey
    );
    try {
      const weatherData = await response.json();
    
      const temperature = weatherData["data"][0]["temp"];
      const weather_condition =
        weatherData["data"]["0"]["weather"]["description"];
      return { temperature, weather_condition };
    } catch (e) {
      console.error("error", e);
    }
  }
}

async function getPhoto(destinationCity) {
  const response = await fetch(
    `https://pixabay.com/api/?key=${pixabayKey}&q=${destinationCity}&image_type=photo`
  );
  try {
    const imageData = await response.json();
    if (imageData["hits"].length > 0) {
      const cityImage = imageData["hits"][0]["webformatURL"];
      return cityImage;
    }
  } catch (e) {
    console.error("error", e);
  }
}

const updateUI = (
  startCity,
  destinationCity,
  departingDate,
  arrivingDate,
  countdown,
  cityImage,
  weather_condition,
  temperature
) => {
  // update new entry values
  document.getElementById("startCityResult").innerHTML = startCity;
  document.getElementById("destinationCityResult").innerHTML = destinationCity;
  document.getElementById("departingDateResult").innerHTML = departingDate;
  document.getElementById("arrivingDateResult").innerHTML = arrivingDate;
  document.getElementById("countdown").innerHTML = countdown;
  document.getElementById("photo-of-destination").src = cityImage;
  document.getElementById("weather").innerHTML = weather_condition;
  document.getElementById("temperature").innerHTML = temperature;
};

const handleRemove = () => {
  document.getElementById("trip_details_section").innerHTML = "";
};

export { handleSubmit, handleRemove };
