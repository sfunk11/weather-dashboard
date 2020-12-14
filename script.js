dayjs.extend(window.dayjs_plugin_localizedFormat);
 var today = dayjs().format("LL");
       
// for initial Weather data call
var APIKey = "a71ffd832a9960499b2f56bba5c397e5";
var searchCity = "Atlanta";

$(document).ready(function(){
    searchCity = localStorage.getItem("city");
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=" + searchCity +"&appid=" + APIKey;
        getWeather(queryURL);
});

function getWeather(queryURL){
$.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
     coords = response.coord;
     console.log(response);
     console.log(response.coord);
     imgURL = "http://openweathermap.org/img/wn/"+ response.weather[0].icon + "@2x.png";
     currentIconEl = $("<img>").attr("src", imgURL);
     cityNameEl = $("<h2>").html(response.name + " ("+ today + ")");
     tempEl = $("<p>").text("Temperature: "+ Math.round(response.main.temp) + `\xB0 F`);
      humidityEl = $("<p>").text("Humidity: " + response.main.humidity + `%`);
      windspeedEl = $("<p>").text("Wind Speed: "+ response.wind.speed + "MPH");
      uvIndex = $("<p>").html("UV Index: <span class = 'uv'></span>");
      $("#weather-display").empty();
     $("#weather-display").append(cityNameEl, currentIconEl, tempEl, humidityEl, windspeedEl, uvIndex);

// for forecast call and population
      lat = coords.lat;
      lon = coords.lon;
      console.log(lat,lon);
     
     forecastURL = "https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&appid=" + APIKey;
     $.ajax({
         url: forecastURL,
         method: "GET"
       }).then(function(response) {
           $(".uv").text(response.current.uvi);
           if (response.current.uvi < 3){
               $(".uv").addClass("badge-success");
           }else if (response.current.uvi < 6 && response.current.uvi > 3){
            $(".uv").addClass("badge-warning");
           }else if (response.current.uvi >=6){
            $(".uv").addClass("badge-danger"); 
           }
           var forecast = response.daily;

           for(var i=1; i < 6; i++){
            date = new Date(forecast[i].dt * 1000);
            imgURL = "http://openweathermap.org/img/wn/"+ forecast[i].weather[0].icon + "@2x.png";
            dateEl = $("<h6>").text(dayjs(date).format("MM-DD")).attr("class", "card-title");
            iconEl = $("<img>").attr("src", imgURL);
            forecastTempEl = $("<p>").text("Temp: "+ Math.round(forecast[i].temp.day) + `\xB0 F`);
            humidityEl = $("<p>").text("Humidity: " + forecast[i].humidity + `%`);
            forecastid = "#forecast-" + (i);
            $(forecastid).empty();
            $(forecastid).append(dateEl,iconEl,forecastTempEl,humidityEl)
           }
       });
    localStorage.setItem("city", searchCity);
    });
}

    $(".btn").on("click", function(event) {
        // Preventing the button from trying to submit the form
        event.preventDefault();
        $("#weather-display").empty();
         searchCity = $("#search").val().trim();
         var queryURL = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=" + searchCity +"&appid=" + APIKey;
        getWeather(queryURL);
       liTemplate = "<li data-value = '%val' class = 'list-group-item'>%city</li>";
        liTemplate = liTemplate.replace("%city", searchCity).replace("%val", searchCity);
        $("ul").append(liTemplate);
        $("#search").val("");
    })
    $(document).on("click", ".list-group-item", function(){
        console.log(this);
        searchCity = $(this).attr("data-value");
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=" + searchCity +"&appid=" + APIKey;
        getWeather(queryURL);
    });
