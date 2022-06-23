const weekday = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let lat;
let lon;
const APIKey = "686b6c2955f4cf716d487e970ca118a2";
const body = document.body;
const city = document.querySelector("#city");
const date = document.querySelector("#date");
const temp = document.querySelector("#temp");
const tempminmax = document.querySelector("#tempminmax");
const description = document.querySelector("#description");
const forecastday = document.querySelectorAll(".forecastday");
const forecastdescription = document.querySelectorAll(".forecastdescription");
const forecasttempminmax = document.querySelectorAll(".forecasttempminmax");
const forecasticon = document.querySelectorAll(".forecasticon");
const refresh = document.querySelector("#refresh");
const form = document.querySelector("form");
const search = document.querySelector("#search");
const searchfield = document.querySelector("#searchfield");
const cancel = document.querySelector("#cancel");
const errormessage = document.querySelector("#errormessage");
const suggestion = document.querySelector("#suggestion");
const suggestionList = document.getElementsByTagName("li");
const span = document.getElementsByTagName("span");

function getName(target, name) {
  target.innerText = name;
}

function getDate(target, date) {
  target.innerText = new Date(date * 1000).toLocaleString([], {
    dateStyle: "full",
  });
}

function getDescription(target, day) {
  target.innerText = day.weather[0].description;
}

function getIcon(target, day) {
  target.style.backgroundImage = `url("http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png")`;
}

function getTemp(target, temperature) {
  target.innerText = Math.round(temperature - 273) + "°C";
}

function getTempMinMax(target, temperature) {
  target.innerText =
    Math.round(temperature.temp_min - 273) +
    "°C - " +
    Math.round(temperature.temp_max - 273) +
    "°C";
}

function getDay(target, day) {
  target.innerText = weekday[new Date(day.dt * 1000).getDay()];
}

function getForecastTempMinMax(target, temperature, key1, key2) {
  const arr = [];
  for (let i = 0, k = key1; i <= 8, k <= key2; i++, k++) {
    arr[i] = temperature.list[k].main.temp;
  }
  target.innerText =
    Math.round(Math.min(...arr) - 273) +
    "°C - " +
    Math.round(Math.max(...arr) - 273) +
    "°C";
}

function changeBG(day) {
  switch (day.weather[0].main) {
    default:
      body.style.backgroundImage =
        "linear-gradient(rgb(34, 93, 160), rgb(90, 170, 245))";
    case "Clear":
      body.style.backgroundImage =
        "url('https://c1.wallpaperflare.com/preview/24/65/246/sky-cloud-solo-only.jpg')";
      break;
    case "Clouds":
      body.style.backgroundImage =
        "url('https://c1.wallpaperflare.com/preview/677/362/336/cloud-of-bunch-of-blue-sky-weather.jpg')";
      break;
    case "Rain":
      body.style.backgroundImage =
        "url('https://wallpaperfordesktop.com/wp-content/uploads/2021/09/Rain-Background-Wallpaper-1024x576.jpg')";
      break;
    case "Drizzle":
      body.style.backgroundImage =
        "url('https://wallpaperfordesktop.com/wp-content/uploads/2021/09/Rain-Background-Photos-1024x576.jpg')";
      break;
    case "Fog":
      body.style.backgroundImage =
        "url('https://wallpapershome.com/images/pages/pic_h/12603.jpg')";
      break;
    case "Thunderstorm":
      body.style.backgroundImage =
        "url('https://images.wallpaperscraft.com/image/single/lightning_night_horizon_121845_1920x1080.jpg')";
      break;
    case "Snow":
      body.style.backgroundImage =
        "url('https://www.pixelstalk.net/wp-content/uploads/2015/01/Snow-winter-landscape-wallpaper-widescreen.jpg')";
      break;
  }
}

function clearErrorMessage() {
  errormessage.style.height = "0";
  errormessage.style.opacity = "0";
}

async function currentWeather() {
  const callAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}`;
  const response = await fetch(callAPI);
  const data = await response.json();
  console.log(data);
  getName(city, data.name);
  getDate(date, data.dt);
  getDescription(description, data);
  getIcon(description, data);
  getTemp(temp, data.main.temp);
  getTempMinMax(tempminmax, data.main);
  changeBG(data);
}

async function weatherForecast() {
  const callForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`;
  const response = await fetch(callForecast);
  const data = await response.json();
  console.log(data);
  for (let i = 0; i < forecasticon.length; i++) {
    getDay(forecastday[i], data.list[(i + 1) * 7 + i]);
    getIcon(forecasticon[i], data.list[(i + 1) * 7 + i]);
    getDescription(forecastdescription[i], data.list[(i + 1) * 7 + i]);
    getForecastTempMinMax(forecasttempminmax[i], data, i * 8, (i + 1) * 7 + i);
  }
}

async function searchWithCity() {
  // const callCity = `https://api.openweathermap.org/geo/1.0/direct?q=${searchfield.value}&appid=${APIKey}`;
  const callCity = `https://api.openweathermap.org/data/2.5/weather?q=${searchfield.value}&appid=${APIKey}`;
  const response = await fetch(callCity);
  const data = await response.json();
  try {
    console.log(data);
    lat = data.coord.lat;
    lon = data.coord.lon;
    currentWeather();
    weatherForecast();
    clearErrorMessage();
  } catch {
    if (data.cod !== "400") {
      errormessage.style.height = "30px";
      errormessage.innerText = "CITY NOT FOUND 😞";
      errormessage.style.opacity = "1";
    }
  }
}

async function searchSuggestion() {
  const response = await fetch("./city.list.json");
  const data = await response.json();
  searchfield.addEventListener("input", () => {
    currentFocus = -1;
    suggestion.style.display = "block";
    suggestion.innerHTML = "";
    clearErrorMessage();

    const re = new RegExp("^" + searchfield.value, "i");
    function check(text) {
      return text.match(re);
    }
    const listContent = data.filter(check);
    console.log(listContent);

    for (let i = 0; i < 10; i++) {
      if (searchfield.value.length === 0) {
        suggestion.innerHTML === "";
      } else {
        suggestion.innerHTML +=
          "<li>" +
          "<span>" +
          listContent[i].slice(0, searchfield.value.length) +
          "</span>" +
          listContent[i].slice(searchfield.value.length) +
          "</li>";
      }
    }
  });
}

window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      lat = position.coords.latitude;
      lon = position.coords.longitude;
      currentWeather();
      weatherForecast();
      searchSuggestion();
    });
  } else {
    alert("Enable geolocation!!!");
  }
});

form.addEventListener("submit", (event) => {
  suggestion.style.display = "none";
  event.preventDefault();
  searchWithCity();
  form.reset();
});

cancel.addEventListener("click", () => {
  if (searchfield.value) {
    searchfield.value = "";
    suggestion.style.display = "none";
  } else {
    searchfield.style.width = "0";
    searchfield.style.visibility = "hidden";
    cancel.style.visibility = "hidden";
    clearErrorMessage();
  }
  currentFocus = -1;
});

search.addEventListener("click", (event) => {
  searchfield.style.width = "400px";
  searchfield.style.visibility = "visible";
  cancel.style.visibility = "visible";
});

searchfield.addEventListener("focus", () => {
  clearErrorMessage();
});

refresh.addEventListener("click", () => {
  window.location.reload();
});

suggestion.addEventListener("click", (event) => {
  searchfield.value = event.target.textContent;
  searchfield.focus();
  suggestion.style.display = "none";
});

let currentFocus = -1;
searchfield.addEventListener("keydown", (event) => {
  if (
    event.key === "ArrowDown" &&
    currentFocus < 9 &&
    searchfield.value.length > 0
  ) {
    currentFocus++;
    searchfield.value = suggestionList[currentFocus].innerText;
    suggestionList[currentFocus].classList.add("focus");
    suggestionList[currentFocus - 1].classList.remove("focus");
    console.log(currentFocus);
  } else if (
    event.key === "ArrowUp" &&
    currentFocus > 0 &&
    searchfield.value.length > 0
  ) {
    currentFocus--;
    searchfield.value = suggestionList[currentFocus].innerText;
    suggestionList[currentFocus].classList.add("focus");
    suggestionList[currentFocus + 1].classList.remove("focus");
    console.log(currentFocus);
  } else if (
    event.key === "ArrowUp" &&
    currentFocus === 0 &&
    searchfield.value.length > 0
  ) {
    currentFocus--;
    suggestionList[currentFocus + 1].classList.remove("focus");
    searchfield.value = span[0].innerText;
    console.log(currentFocus);
  } else if (event.key === "Enter") {
    searchfield.value = suggestionList[currentFocus].innerText;
  }
});
