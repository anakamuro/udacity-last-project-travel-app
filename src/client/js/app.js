const geoNamesURL = "http://api.geonames.org/searchJSON?q=";
const username = "akiakiaki";
const weatherbitforecastURL =
  "https://api.weatherbit.io/v2.0/forecast/daily?lat=";
const weatherbithistoryURL =
  "https://api.weatherbit.io/v2.0/history/daily?lat=";
const weatherbitkey = "fe1ac0ef90ea41da99320ead77e32bda";
const pixabayURL = "https://pixabay.com/api/?key=";
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

  console.log("Button has been clicked");

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
  console.log(latlng);

  const cityImage = await getPhoto(destinationCity);
  console.log(cityImage);

  const temperature = await getWeatherData(
    latlng.lat,
    latlng.lng,
    latlng.arrivingDate
  ).temperature;
  const weather_condition = await getWeatherData(
    latlng.lat,
    latlng.lng,
    latlng.arrivingDate
  ).weather_condition;
  console.log(temperature, weather_condition);
  updateUI(
    startcCity,
    destinationCity,
    departingDate,
    arrivingDate,
    countdown,
    cityImage,
    temperature,
    weather_condition
  );
  /*try {
    await postData('http://localhost:8085/tripData', 
    { cityImage, Dcity, Ddate, Scity, Adate, temperature, weather_condition, countdown })
     await getData('http://localhost:8085/getGeoData')
      await getData('http://localhost:8085/getWeatherData') 
      await getData('http://localhost:8085/getPhoto') 
      const allData = await getData('http://localhost:8085/all'); 
      console.log(allData); 
      updateUI(allData)

    // Fetching geo stats of destination place.
    await getGeoData(tripData["Dcity"])
      .then((GeoData) => {
        //Assigning the fetched value from JSON toInfo
        
        const toLat = GeoData.geonames[0].lat;
        const toLng = GeoData.geonames[0].lng;
 
        //Getting Weather details
        return getWeatherData(toLat, toLng, tripData["Adate"]) 
      })
      .then((weatherData) => {
        //Storing the weather details
        tripData["temperature"] = weatherData["currently"]["temperature"];
        tripData["weather_condition"] = weatherData["hourly"]["summary"];

        //Calling Pixabay API to fetch the first img of the city
        return getPhoto(tripData["Dcity"]) 
      })
      .then((imageData) => {
        console.log(imageData);
        if (imageData["hits"].length > 0) {
          tripData["cityImage"] = imageData["hits"][0]["webformatURL"];
        }
        //Sending data to server to store the details.
        return tripData || postData(tripData);
      })
      .then((allData) => {
        updateUI(allData);
      });
  } catch (e) {
    console.log("error", e);
  }  */
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
    console.log(GeoData);
    const lat = GeoData.geonames[0].lat;
    const lng = GeoData.geonames[0].lng;
    return { lat, lng };
  } catch (e) {
    console.log("error", e);
  }
}

async function getWeatherData(lat, lng, arrivingDate) {
  // Getting the timestamp for the current date and traveling date for upcoming processing.
  const timestamp_trip_date = Math.floor(
    new Date(arrivingDate).getTime() / 1000
  );
  const todayDate = new Date();
  const timestamp_today = Math.floor(
    new Date(
      todayDate.getFullYear() +
        "-" +
        todayDate.getMonth() +
        "-" +
        todayDate.getDate()
    ).getTime() / 1000
  );

  let response;
  // Check if the date is gone and call the appropriate endpoint.
  if (timestamp_trip_date < timestamp_today) {
    let next_date = new Date(arrivingdate);
    next_date.setDate(next_date.getDate() + 1);
    response = await fetch(
      weatherbithistoryURL +
        lat +
        "&lon=" +
        lng +
        "&start_date=" +
        arrivingDate +
        "&end_date=" +
        next_date +
        "&key=" +
        weatherbitkey
    );
  } else {
    response = await fetch(
      weatherbitforecastURL + lat + "&lon=" + lng + "&key=" + weatherbitkey
    );
  }

  try {
    const weatherData = await response.json();
    console.log(weatherData);

    const temperature = weatherData["data"][0]["temp"];
    const weather_condition =
      weatherData["data"]["0"]["weather"]["description"];
    return { temperature, weather_condition };
  } catch (e) {
    console.log("error", e);
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
    console.log("error", e);
  }
}

export const getData = async (url) => {
  const response = await fetch(url || "");
  if (response.status === 404) {
    alert("Error");
  }
  try {
    const data = response.json();
    return data;
  } catch (err) {
    alert(err);
  }
};

async function postData(tripData) {
  const response = await fetch("http://localhost:8085/postData", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tripData),
  });

  try {
    return await response.json();
  } catch (e) {
    console.log("error", e);
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
  tripData = {};
};

export { handleSubmit, handleRemove };
