let tripData = {};



if(document.querySelector("#btn-add") != null){
    document.querySelector("#btn-add").addEventListener("click", handleSubmit);
  }

async function handleSubmit(e) {
  e.preventDefault();

  // get user input values
  tripData["startCity"] = document.getElementById("startCity").value;
  tripData["destinationCity"] = document.getElementById("destinationCity").value;
  tripData["departingDate"] = document.getElementById("departingDate").value;
  tripData["arrivingDate"] = document.getElementById("arrivingDate").value;
  //tripData["cityImage"] = document.getElementById("photo-of-destination").value;
 // tripData["countdown"] = document.getElementById("count-down").value;
  //tripData["temperature"] = document.getElementById("temperature").value;
  //tripData["weather_condition"] = document.getElementById("weather").value;
  
  console.log("Button has been clicked");
  if (
    tripData["startCity"] == "" ||
    tripData["destinationCity"] == "" ||
    tripData["departingDate"] == "" ||
    tripData["arrivingDate"] == "" 
    //tripData["cityImage"] == "" ||
    //tripData["countdown"] == "" ||
    //tripData["temperature"] == "" ||
    //tripData["weather_condition"] == ""
    


  ) {
    alert("You need to write the city and date.");
    return;
  }

  let today = new Date();
  let differenceOfTimes = Math.abs(
    new Date(tripData["departing-date"]).getTime() - new Date(today).getTime()
  );
  let countdown = Math.ceil(differenceOfTimes / (1000 * 60 * 60 * 24));
  tripData["countdown"] = countdown;

  console.log(tripData)

  try {
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
  const response = await fetch('http://localhost:8085/postData', {
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
  const request = await fetch("http://localhost:8085/all");
try {
  const allData = await request.json()
    
  // update new entry values
  document.getElementById('startCity').innerHTML = allData.startCity; 
  document.getElementById('destinationCity').innerHTML = allData.destinationCity;
  document.getElementById('departingDate').innerHTML = allData.departingDate;
  document.getElementById('arrivingDate').innerHTML = allData.arrivingDate;
  document.getElementById('countdown').innerHTML = allData.countdown;
  document.getElementById('photo-of-destination').innerHTML = allData.cityImage;
  document.getElementById('weather').innerHTML = allData.weather_condition;
  document.getElementById('temperature').innerHTML = allData.temperature;
}
catch (error) {
  console.log("error", error);
}
};




const handleRemove = () => {
    document.getElementById("trip_details_section").innerHTML = "";
    tripData = {};
  };
  

export { handleSubmit, handleRemove };