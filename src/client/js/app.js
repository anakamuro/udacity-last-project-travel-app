let tripData = {};

const geoNamesURL = "http://api.geonames.org/searchJSON?q=";
const username = "ashishtestapi";
const darkSkyURL = "https://api.darksky.net/forecast/";
const darkSkyKey = "a599eb4bfcda9ef2f5173080541a04a4";
const pixabayURL = "https://pixabay.com/api/?key=";
const pixabayAPI = "15817374-015ecdcbd68299917ebff2ba6";

document.querySelector("#btn-add").addEventListener("click", handleSubmit);

async function handleSubmit(e) {
  e.preventDefault();
  // get user input values
  tripData["Scity"] = document.getElementById("start-city").value;
  tripData["Dcity"] = document.getElementById("destination-city").value;
  tripData["Ddate"] = document.getElementById("Ddate").value;
  tripData["Adate"] = document.getElementById("Adate").value;
  console.log("Button has been clicked");
  if (
    tripData["Scity"] == "" ||
    tripData["Dcity"] == "" ||
    tripData["Ddate"] == "" ||
    tripData["Adate"] == ""
  ) {
    alert("You need to write the city and date.");
    return;
  }

  let today = new Date();
  let differenceOfTimes = Math.abs(
    new Date(Ddate).getTime() - new Date(today).getTime
  );
  let countdown = Math.ceil(differenceOfTimes / (1000 * 60 * 60 * 24));
  tripData["countdown"] = countdown;

  try {
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

async function getGeoData(Dcity) {
  const response = await fetch(
    `http://api.geonames.org/searchJSON?q=${Dcity}&maxRows=10&username=${username}`
  );
  try {
    const GeoData = await response.json();
    return GeoData;
    console.log(GeoData);
  } catch (e) {
    console.log("error", e);
  }
}

async function getWeatherData(toLat, toLng, Adate) {
  const response = await fetch(
    `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${darkSkyKey}/${toLat},${toLng},${parseInt(
      new Date(Adate).getTime() / 1000
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

async function getPhoto(DcityPhoto) {
  const response = await fetch(
    `https://pixabay.com/api/?key=${pixabayAPI}&q=${DcityPhoto}&image_type=photo=true`
  );
  try {
    const imageData = await response.json();
    console.log(imageData);
    return imageData;
  } catch (e) {
    console.log("error", e);
  }
}

async function postData(tripData) {
  const response = await fetch("/postData", {
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

const updateUI = async () => {
  const request = await fetch("/all");
  try {
    const allData = await request.json();
    const {
      cityImage,
      Dcity,
      Ddate,
      Scity,
      temperature,
      weather_condition,
      countdown,
    } = allData || {};
    // update new entry values
    document.getElementById("trip_details_section").innerHTML = `
    <div id="trip_details">
    <div id="dest_photo">
      <img id="photo-of-destination" src="${cityImage}" alt="destination image">
    </div>
    <div id="main_details">
      <div id="trip-from">Your trip starts from: <span class="dynamic_content" id="trip-from">${Scity}</span></div>
      <div id="destination-info">Your trip destination: <span class="dynamic_content" id="destination">${Dcity}</span></div>
      <div id="departure-date">Day your trip starts at: <span class="dynamic_content" id="departing_date">${Ddate}</span>
      </div>
      <div id="arriving-date">Day you arrive at: <span class="dynamic_content" id="arriving_date">${Scity}</span></div>
      <div id="count-down">Days to go <span class="dynamic_content" id="number_of_days">${countdown}</span>
      </div>
      <div id="weather-info">Expect weather to be <span class="dynamic_content" id="temperature"> ${temperature}&#8451;</span> ,
        mostly
        <span class="dynamic_content" id="weather">${weather_condition}</span>.</div>
      <div>
        <button class="button_style" id="remove_trip" >Remove</button>
      </div>
    </div>
  </div>
    `;
  } catch (error) {
    console.log("error", error);
  }
};



const handleRemove = () => {
    document.getElementById("trip_details_section").innerHTML = "";
    tripData = {};
  };
  

export { handleSubmit, handleRemove };