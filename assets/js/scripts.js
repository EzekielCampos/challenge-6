
const searchCityButton= document.querySelector("#citi-button");
const holderCities = document.querySelector("#cities");
const citiesList = document.querySelector("#cities-list");
const currentWeather = document.querySelector("#input-area");

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
        listItem.id = city.toLowerCase();
        listItem.setAttribute("class", "list-group-item list-group-item-secondary mt-2")
        listItem.textContent = city;
        citiesList.appendChild(listItem);

    }

}

function getWeatherApi(city){

    const apiUrl= `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}&units=imperial`

    fetch(apiUrl)
    .then(function(response){
        console.log(response.status);
        response.json().then(function(data){
        console.log(data);
        outputCurrentReport(data);

    })

});
}

function outputCurrentReport(value){

let bodyBox = document.createElement("div");
bodyBox.setAttribute("class", "col 3 w-25 justify-content-center border border-dark ms-5")
let headerEl = document.createElement("h1");
let iconImg = document.createElement("img");
iconImg.setAttribute("src", `https://openweathermap.org/img/wn/${value.weather[0].icon}@2x.png`)

headerEl.textContent = `${value.name}`;

bodyBox.appendChild(headerEl);
bodyBox.appendChild(iconImg);
currentWeather.appendChild(bodyBox);




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

    storeValue(cityInput.value);
    getWeatherApi(cityInput.value)
    console.log(cityInput.value);
    cityInput.value ="";
    printCities(); 

}





printCities();


searchCityButton.addEventListener("click", findForecast);