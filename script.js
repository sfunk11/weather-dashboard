dayjs.extend(window.dayjs_plugin_localizedFormat);
 var today = dayjs().format("LL");
       

var APIKey = "a71ffd832a9960499b2f56bba5c397e5";
var searchCity = "Atlanta"

var queryURL = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=" + searchCity +"&appid=" + APIKey;


$.ajax({
  url: queryURL,
  method: "GET"
}).then(function(response) {
   cityNameEl = $("<h1>").text(searchCity + " ("+ today + ")" +response.weather.icon);
   tempEl = $("<p>").text("Temperature: "+ response.main.temp + `\xB0 F`);
    humidityEl = $("<p>").text("Humidity: " + response.main.humidity + `%`);
    windspeedEl = $("<p>").text("Wind Speed: "+ response.wind.speed + "MPH");
    uvIndex = $("<p>").html("UV Index: <span 'class = uv'></span>");
    // $(".uv").html HOW TO FIND UV INDEX?
   $("#weather-display").append(cityNameEl, tempEl, humidityEl, windspeedEl, uvIndex);
   })