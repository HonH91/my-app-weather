function currentDate(date) {
  let hours = date.getHours();

  if (hours < 10) {
    hours = `0${hours}`;
  }

  let min = date.getMinutes();

  if (min < 10) {
    min = `0${min}`;
  }

  let currentDay = date.getDay();

  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  let day = days[currentDay];

  return `${day} ${hours}:${min}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
                    <div class="col-2">
                        <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
                        <img src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon
        }@2x.png" alt="" width="42" />
                        <div class="forecastTemperatures">
                            <span class="forecastTemperatureMax"> ${Math.round(
          forecastDay.temp.max
        )}° </span>
                            <span class="forecastTemperatureMin"> ${Math.round(
          forecastDay.temp.min
        )}° </span>
                        </div>
                    </div>
  `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
  console.log(forecastHTML);
}

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "c95d60a1e3adbeb286133f1ebebc2579";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}


let dateElement = document.querySelector("#date");

let currentTime = new Date();

dateElement.innerHTML = currentDate(currentTime);

let searchForm = document.querySelector("#search-form");

searchForm.addEventListener("submit", handleSubmit);

//

function showWeather(response) {
  console.log(response.data);
  let iconElement = document.querySelector("#icon");
  celcTemp = response.data.main.temp;

  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#temperature").innerHTML = Math.round(celcTemp);
  document.querySelector("#weatherDesc").innerHTML = response.data.weather[0].description;
  document.querySelector("#feelsLike").innerHTML = response.data.main.feels_like;
  document.querySelector("#wind").innerHTML = response.data.wind.speed;
  document.querySelector("#visibility").innerHTML = response.data.visibility;
  document.querySelector("#pressure").innerHTML = response.data.main.pressure;

  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
  iconElement.setAttribute("class", "float-left");

  document.querySelector("#sunrise").innerHTML = formateDate(response.data.sys.sunrise * 1000);
  document.querySelector("#sunset").innerHTML = formateDate(response.data.sys.sunset * 1000);

  getForecast(response.data.coord);
}

function formateDate(timeStamp) {
  let date = new Date(timeStamp);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  return hours + ":" + minutes;
}

function displayImperialTemp(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  metricLink.classList.remove("active");
  imperialLink.classList.add("active");
  let imperialTemperature = (celcTemp * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(imperialTemperature);
}

function displayMetricTemp(event) {
  event.preventDefault();
  metricLink.classList.add("active");
  imperialLink.classList.remove("active");
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celcTemp);
}

let imperialLink = document.querySelector("#fLink");
imperialLink.addEventListener("click", displayImperialTemp);

let metricLink = document.querySelector("#cLink");
metricLink.addEventListener("click", displayMetricTemp);

let celcTemp = null;


function findCity(city) {
  let apiKey = "c95d60a1e3adbeb286133f1ebebc2579";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeather);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  findCity(city);
}
