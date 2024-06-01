

const searchCityButton= document.querySelector("#citi-button");
const listCities = document.querySelector("#cities");
const cityInput = document.querySelector("#search-city")


function storeValue(value){

let cityArray = getValue();

cityArray.push(value);

localStorage.setItem("city", JSON.stringify(cityArray));


}

function getValue(){

    let cityArray = []
const holder = JSON.parse(localStorage.getItem("city"));
if(holder){
    cityArray = holder;
}
return cityArray;

}


function findForecast(event){
    event.preventDefault()

    storeValue(cityInput.value);
    console.log(cityInput.value);
    cityInput.value ="";

}













searchCityButton.addEventListener("click", findForecast);