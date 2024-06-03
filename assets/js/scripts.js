// This is the search button that will be used
const searchCityButton= document.querySelector("#citi-button");
const holderCities = document.querySelector("#cities");
// This area will hold all the cities listed
const citiesList = document.querySelector("#cities-list");
// This element will hold the search form and the current date weather in a row
const currentWeather = document.querySelector("#input-area");
// This will hold the future forecast that will be displayed
let futureForecast = document.querySelector("#five-forecast");
// This contains the users input value
const cityInput = document.querySelector("#search-city")

// Api key to be used to make a request
const APIkey = "a982c70229a3cc2a4eb22edd33dd6ff6";

// Stores the city name in the local storage
function storeValue(value){
    
// First gets the array of cities
let cityArray = getValue();
// Pushes the parameter into the array
cityArray.push(value);
// Updates the item in local storage
localStorage.setItem("city", JSON.stringify(cityArray));

}

// Returns the current array of citi names held in local storage
function getValue(){

    let cityArray = []
const holder = JSON.parse(localStorage.getItem("city"));
if(holder){
    cityArray = holder;
}
return cityArray;

}

function printCities(){

    // This will clear the list to be updated
    citiesList.innerHTML = "";
    // This will return the array of city names that have been searched
    let names = getValue();

    for(let city of names){

        let listItem = document.createElement("li");
        listItem.setAttribute("data-city",city.toLowerCase());
        // This styling will be used to display the list in boxes
        listItem.setAttribute("class", "list-group-item list-group-item-secondary mt-2")
        listItem.textContent = city;
        citiesList.appendChild(listItem);

    }
    // This will add a little separator between the search bar and the list of cities
    holderCities.setAttribute("style", "border-top: 2px solid #000;")

}


function fiveDayForecast(city){

    // Url to get the five day forcast taking latitude and longitude as query parameters
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${city.coord.lat}&lon=${city.coord.lon}&appid=${APIkey}&units=imperial`;
    fetch(apiUrl)
        .then(function(response){
            console.log(`five day ${response.status}`);
            response.json().then(function(data){
                console.log(data);
                // This will take the data from the api and display the five day future forecast
                displayFiveDay(data);
            })
        })
    }


function displayFiveDay(value){

// let titleContainer = document.createElement("h5");
// titleContainer.textContent = "5 Day Forecast";

// This varible will be the actual index to transverse the next date
let dayIndex = 0;
// This index will only represent the five iterations needed to create the weather cards
for(let index = 0; index < 5; index++){
    // This element will hold the card that will be appended to the main page
    let weatherCard = document.createElement("div");
    weatherCard.setAttribute("class","card col-2 h-100 mt-4 ms-3");
    // This element will hold all the content that will be included in the card
    let cardBody = document.createElement("div");
    cardBody.setAttribute("class","card-body");
    let cardDate = document.createElement("h5");
    cardDate.setAttribute("class", "card-title");
    // Take the seconds from the object and convert it to the actual date
    let date = convertToDate(value.list[dayIndex].dt);
    cardDate.textContent = date;
    let cardImg = document.createElement("img");
    // This element will be the image of the weather for that day
    cardImg.setAttribute("src", `https://openweathermap.org/img/wn/${value.list[dayIndex].weather[0].icon}@2x.png`);
    let tempValue = document.createElement("p");
    // This will display the temperature by transversing the object that was returned by the api
tempValue.textContent = `Temp: ${value.list[dayIndex].main.temp}°F`;
let windValue = document.createElement("p");
    // This will display the wind speed by transversing the object that was returned by the api
windValue .textContent = `Wind: ${value.list[dayIndex].wind.speed}MPH`;
let humidityValue = document.createElement("p");
    // This will display the humidity by transversing the object that was returned by the api
humidityValue.textContent = `Humidity: ${value.list[dayIndex].main.humidity}%`;

cardBody.append(cardDate,cardImg,tempValue,windValue,humidityValue);
weatherCard.appendChild(cardBody);
futureForecast.appendChild(weatherCard);
  // increase the index by eight to go to the next day because each array values is a three hour interval
  dayIndex+= 8;
}
    

}
 

function getWeatherApi(city){

    // api contains the city parameter and apik key to access specific weather data
    const apiUrl= `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}&units=imperial`

    fetch(apiUrl)
    .then(function(response){
        if(response.status === 404){
          //Give an alert to user so that it knows that it is an invalid argument
          alert("Invalid argument. Try again!");
          let removeInvalid = getValue();
          //If the city does not exist then it will be removed from the city array
          removeInvalid.pop();
          //Update the list in local storage
          localStorage.setItem("city", JSON.stringify(removeInvalid));
          //Redisplay the cities so that it will not include the invalid input
          printCities();
          return;
        }
        response.json().then(function(data){
        console.log(data);   
        //The user will input a city name and the current and future forecast will be rendered   
        outputCurrentReport(data);
        fiveDayForecast(data);
    })

});
}

// Convert the time that the api gave us to current date format
function convertToDate(seconds){

    // Convert to parameter value to milliseconds
    let currentDate = dayjs(seconds * 1000);
    // Format the seconds in the correct date sequence
    return currentDate.format("MMMM D, YYYY");

}

function outputCurrentReport(value){

//This element will hold the city's current weather forecast
let bodyBox = document.createElement("div");
bodyBox.id ="weather-box";
let headerEl = document.createElement("h1");
// contains the city name and current date that of weather forecast
headerEl.textContent = `${value.name}- ${convertToDate(value.dt)}`;

let iconImg = document.createElement("img");
// Url accesses specific weather icon image to be displayed for that date
iconImg.setAttribute("src", `https://openweathermap.org/img/wn/${value.weather[0].icon}@2x.png`)

let tempValue = document.createElement("p");
// This will display the temperature by transversing the object that was returned by the api
tempValue.textContent = `Temperature: ${value.main.temp} °F`;
let windValue = document.createElement("p");
// This will display the wind speed by transversing the object that was returned by the api
windValue .textContent = `Wind: ${value.wind.speed} MPH`;
let humidityValue = document.createElement("p");
// This will display the humidity by transversing the object that was returned by the api
humidityValue.textContent = `Humidity ${value.main.humidity}%`

// Append all the weather information to the body box
bodyBox.append(headerEl,iconImg,tempValue,windValue,humidityValue);
// This will allow it to display side by side the search form
bodyBox.setAttribute("class", "ms-5 col-8 border border-dark inline")

currentWeather.appendChild(bodyBox);

}

// Function will be run when the search button is clicked

function findForecast(event){
    event.preventDefault()

    // Checks to see if the input is empty
    if(!cityInput.value){
        alert("Invalid argument.Try again")
        return;
    }

    // Checks for repeated values
    if(getValue().includes(cityInput.value)){
        alert("Repeated value. Enter a new one")
        cityInput.value ="";
        return;
    }
     
    // If a weather box already exist then it will be cleared before the new city search
    let box = document.querySelector("#weather-box");
    if(box){
        currentWeather.removeChild(box);
    }

    
    let futureForecast = document.querySelector("#five-forecast");

    //Checks to see if the future forecast is already displayed
    if (futureForecast) {
        // If a previous city is displayed it will clear it for the next city
        futureForecast.innerHTML= "";
    }

    // Stores the input value to local storage
    storeValue(cityInput.value);
    // From the input it will make a request to an api and display all the weather info for that city
    getWeatherApi(cityInput.value)
    console.log(cityInput.value);
    // Clears the input bar
    cityInput.value ="";
    // Displays all searched cities
    printCities(); 

}

function displayPreviousCity(event){
    const target = event.target;
    // If the target matches a list item then it will clear the forecast display and city that was clicked on one
    if(target.matches("li")){
        // Finds the box displaying the current weather 
        let box = document.querySelector("#weather-box");
        // Finds the element holding all the future forecast
        let futureForecast = document.querySelector("#five-forecast");
        // Clears all weather display
        currentWeather.removeChild(box);
        futureForecast.innerHTML = "";
        console.log(target.dataset.city);
        // Gets the city name from dataset attribute and makes an api call to display that city's weather information
        getWeatherApi(target.dataset.city);
       
    }
}




searchCityButton.addEventListener("click", findForecast);

citiesList.addEventListener("click", displayPreviousCity);
   


