
const searchCityButton= document.querySelector("#citi-button");
const holderCities = document.querySelector("#cities");
const citiesList = document.querySelector("#cities-list");
const currentWeather = document.querySelector("#input-area");
let bodyBox = document.querySelector("#weather-box");
let futureForecast = document.querySelector("#five-forecast");

const cityInput = document.querySelector("#search-city")
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

    citiesList.innerHTML = "";
    let names = getValue();

    for(let city of names){

        let listItem = document.createElement("li");
        listItem.setAttribute("data-city",city.toLowerCase());
        listItem.setAttribute("class", "list-group-item list-group-item-secondary mt-2")
        listItem.textContent = city;
        citiesList.appendChild(listItem);

    }
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
                displayFiveDay(data);
            })
        })
    }


function displayFiveDay(value){

// let forcastContainer = document.createElement("div");
// let titleContainer = document.createElement("h3");
// titleContainer.textContent = "5 Day Forecast";

for(let index = 0; index < 5; index++){
    let weatherCard = document.createElement("div");
    weatherCard.setAttribute("class","card col-2 mt-4 ms-3");
    let cardBody = document.createElement("div");
    cardBody.setAttribute("class","card-body");
    let cardDate = document.createElement("h5");
    cardDate.setAttribute("class", "card-title");
    let cardImg = document.createElement("img");
    cardImg.setAttribute("src", `https://openweathermap.org/img/wn/${value.list[index].weather[0].icon}@2x.png`);
    let tempValue = document.createElement("p");
tempValue.textContent = `Temp: ${value.list[index].main.temp} F°`;
let windValue = document.createElement("p");
windValue .textContent = `Wind: ${value.list[index].wind.speed} MPH`;
let humidityValue = document.createElement("p");
humidityValue.textContent = `Humidity ${value.list[index].main.humidity}`;
cardBody.append(cardDate,cardImg,tempValue,windValue,humidityValue);
weatherCard.appendChild(cardBody);
futureForecast.appendChild(weatherCard);
}
    


// forcastContainer.append(titleContainer, weatherCard);





}
 

function getWeatherApi(city){

    // api contains the city parameter and apik key to access specific weather data
    const apiUrl= `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}&units=imperial`

    fetch(apiUrl)
    .then(function(response){
        console.log(response.status);
        response.json().then(function(data){
        console.log(data);      
        outputCurrentReport(data);
        fiveDayForecast(data);

    })

});
}

// Convert the time that the api gave us to current date format
function convertToDate(seconds){

    // Convert to milliseconds
    let currentDate = dayjs(seconds *1000)
    return currentDate.format("MMMM D, YYYY")

}

function outputCurrentReport(value){

let bodyBox = document.createElement("div");
bodyBox.id ="weather-box";
let headerEl = document.createElement("h1");
headerEl.textContent = `${value.name}- ${convertToDate(value.dt)}`;


let iconImg = document.createElement("img");
iconImg.setAttribute("src", `https://openweathermap.org/img/wn/${value.weather[0].icon}@2x.png`)

let tempValue = document.createElement("p");
tempValue.textContent = `Temperature: ${value.main.temp} F°`;
let windValue = document.createElement("p");
windValue .textContent = `Wind: ${value.wind.speed} MPH`;
let humidityValue = document.createElement("p");
humidityValue.textContent = `Humidity ${value.main.humidity}`


bodyBox.append(headerEl,iconImg,tempValue,windValue,humidityValue);
bodyBox.setAttribute("class", "ms-5 col-8 border border-dark inline")

currentWeather.appendChild(bodyBox);
console.log(value.dt)


}


// function will be run when the search button is clicked

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

    if (futureForecast) {
        futureForecast.innerHTML= "";
    }

    storeValue(cityInput.value);
    getWeatherApi(cityInput.value)
    console.log(cityInput.value);
    cityInput.value ="";
    printCities(); 

}




searchCityButton.addEventListener("click", findForecast);

citiesList.addEventListener("click", function(event){
    const target = event.target;
    if(target.matches("li")){
        let box = document.querySelector("#weather-box");
        let futureForecast = document.querySelector("#five-forecast");
        currentWeather.removeChild(box);
        futureForecast.innerHTML = "";
        console.log(target.dataset.city);
        getWeatherApi(target.dataset.city);
       
    }
});


