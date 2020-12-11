dayjs.extend(window.dayjs_plugin_localizedFormat);
 var today = dayjs().format("LL");
       
// for initial Weather data call
var APIKey = "a71ffd832a9960499b2f56bba5c397e5";
var searchCity = "Atlanta"

var queryURL = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=" + searchCity +"&appid=" + APIKey;


function getWeather(queryURL){
$.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
     coords = response.coord;
     console.log(response.coord);
     cityNameEl = $("<h1>").text(searchCity + " ("+ today + ")" +response.weather.icon);
     tempEl = $("<p>").text("Temperature: "+ response.main.temp + `\xB0 F`);
      humidityEl = $("<p>").text("Humidity: " + response.main.humidity + `%`);
      windspeedEl = $("<p>").text("Wind Speed: "+ response.wind.speed + "MPH");
      uvIndex = $("<p>").html("UV Index: <span class = 'uv'></span>");
      // $(".uv").html HOW TO FIND UV INDEX?
     $("#weather-display").append(cityNameEl, tempEl, humidityEl, windspeedEl, uvIndex);

// for forecast call and population
      lat = coords.lat;
      lon = coords.lon;
      console.log(lat,lon);
     
     forecastURL = "https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&appid=" + APIKey;
     $.ajax({
         url: forecastURL,
         method: "GET"
       }).then(function(response) {
           console.log(response);
           $(".uv").text(response.current.uvi);
           var forecast = response.daily;

           for(var i=1; i < 6; i++){
            date = new Date(forecast[i].dt * 1000);
            dateEl = $("<h5>").text(dayjs(date).format("LL")).attr("class", "card-title");
            iconEl = $("<p>").text(forecast[i].weather.icon);
            forecastTempEl = $("<p>").text("Temp: "+ forecast[i].temp.day + `\xB0 F`);
            humidityEl = $("<p>").text("Humidity: " + forecast[i].humidity + `%`);
            forecastid = "#forecast-" + (i);
            $(forecastid).empty();
            $(forecastid).append(dateEl,iconEl,forecastTempEl,humidityEl)
           }
       });

    });
}

    $(".btn").on("click", function(event) {
        // Preventing the button from trying to submit the form
        event.preventDefault();
        $("#weather-display").empty();
         searchCity = $("#search").val().trim();
         var queryURL = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=" + searchCity +"&appid=" + APIKey;
        getWeather(queryURL);
       liTemplate = "<li class = 'list-group-item'>%city</li>";
        liTemplate = liTemplate.replace("%city", searchCity);
        $("ul").append(liTemplate);
        $("#search").val("");
    })
