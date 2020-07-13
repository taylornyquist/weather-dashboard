// Define global variables
var savedLocationsArray = JSON.parse(localStorage.getItem("searched-cities"));
var currentLocation;
var city = ["nashville"]

var initialize = function () {

    // grab previous locations from local storage
    // savedLocationsArray = JSON.parse(localStorage.getItem("searched-cities"));
    // console.log(savedLocationsArray);

    if (savedLocationsArray) {
        getCurrent(savedLocationsArray[savedLocationsArray.length - 1])
        showPrevious();

    } else {
        getCurrent("Nashville");
        // currentLocation = "Nashville";

    }

    // if (savedLocationsArray) {

    //     // get the last city searched for and display it
    //     // currentLocation = savedLocationsArray[savedLocationsArray.length - 1];

    //     // send to showPrevious function
    //     // showPrevious();
    //     // getCurrent(currentLocation)
    // }




};

// Create an On Click for the search icon 
// stores city name to local storage
// recalls city names upon page load/refresh
// populates left hand column with loaded city names from local storage
// previous cities are clickable and can be reloaded from sidebar

// fetches API URL from open weather
// populates current weather
// populates five day forecast
// changes UV Index background color based on value

// optional:
// get current location from users browswer automatically
// make a last updated time stamp


var loadLocations = function () {

    // prevent default behavior of page refresh
    event.preventDefault();

    // clear previous forecast
    clear();

    // get the value of the input field
    var cityLocation = $("#search-input").val().trim();
    cityLocation = cityLocation.toLowerCase();
    cityLocation = cityLocation[0].toUpperCase() + cityLocation.substring(1);

    // clear the search field value
    $("#search-input").val("");

    // // send location variable to the saveLocation function
    // saveLocation(location);

    // send location variable to the getCurrent function
    getCurrent(cityLocation);

    // if location wasn't empty
    // if (location !== "") {
    //     // clear previous forecast
    //     clear();
    //     currentLocation = location;
    //     saveLocation (location);
    //     // clear the search field value
    //     $("#search-input").val("");
    //     getCurrent (location);
    // }
};

// saveLoction function stores searched locations in localStorage
var saveLocation = function (cityLocation) {
    // console.log(cityLocation);

    // add location to the saved locations array
    if (savedLocationsArray === null) {
        savedLocationsArray = [cityLocation];
    } else if (savedLocationsArray.indexOf(cityLocation) === -1) {
        savedLocationsArray.push(cityLocation);
    }

    // save the new array to localStorage
    localStorage.setItem("searched-cities", JSON.stringify(savedLocationsArray));
    console.log(savedLocationsArray);
    showPrevious();



};

// function showPrevious shows the previously searched locations pulled from local storage
var showPrevious = function () {

    if (savedLocationsArray) {

        $("#prev-searches").empty();
        var btns = $("<div>").attr("class", "list-group");
        for (var i = 0; i < savedLocationsArray.length; i++) {
            var locationBtn = $("<button>").attr("class", "loc-btn list-group-item list-group-item-action list-group-item-primary").text(savedLocationsArray[i]);
            btns.prepend(locationBtn);
        }

        $("#prev-searches").append(btns);

    }
};

function getCurrent(cityLocation) {
    fetch(
        "https://api.openweathermap.org/data/2.5/weather?q=" + cityLocation + "&appid=1a779978d53b819f8904840069dffbb8&units=imperial"
    )

        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            console.log(response);

            if (response.cod != "200") {
                alert("Invalid Location, Please Select a Valid Location");
                return;
            }

            // if search city is valid, send location variable to the saveLocation function
            saveLocation(cityLocation);

            // create the card
            var currentCard = $("<div>").attr("class", "card bg-light current-card");
            $("#current-forecast").append(currentCard);

            // add location to card header
            var currentCardHeader = $("<div>").attr("class", "card-header").text("Current Weather For: " + response.name);
            currentCard.append(currentCardHeader);

            var cardRow = $("<div>").attr("class", "row no-gutters");
            currentCard.append(cardRow);

            // get icon for weather conditions
            var iconURL = "https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png";

            var imgDiv = $("<div>").attr("class", "col-md-4").append($("<img>").attr("src", iconURL).attr("class", "card-img"));
            cardRow.append(imgDiv);

            var textDiv = $("<div>").attr("class", "col-md-8");
            var cardBody = $("<div>").attr("class", "card-body");
            textDiv.append(cardBody);

            // display city name
            cardBody.append($("<h3>").attr("class", "card-title").text(response.name));

            // display last updated
            var currentDate = moment(response.dt, "X").format("dddd, MMMM Do YYYY, h:mm a");
            // console.log(currentDate);
            cardBody.append($("<p>").attr("class", "card-text").append($("<small>").attr("class", "text-muted").text("Last Updated: " + currentDate)));

            // display Temperature
            cardBody.append($("<p>").attr("class", "card-text").html("Temperature: " + response.main.temp + " &#8457;"));

            // display Humidity
            cardBody.append($("<p>").attr("class", "card-text").text("Humidity: " + response.main.humidity + "%"));

            // display Wind Speed
            cardBody.append($("<p>").attr("class", "card-text").text("Wind Speed: " + response.wind.speed + " MPH"));

            // UV index
            fetch(
                "https://api.openweathermap.org/data/2.5/uvi?appid=1a779978d53b819f8904840069dffbb8&lat=" + response.coord.lat + "&lon=" + response.coord.lon
            )

                .then(function (uvresponse) {
                    return uvresponse.json();
                })
                .then(function (uvresponse) {
                    console.log(uvresponse);

                    var uvIndex = uvresponse.value;

                    var displayUV = $("<p>").attr("class", "card-text").text("UV Index: ");
                    var displaySpan = $("<span>").attr("class", "uv-index").text(uvIndex);

                    if (uvIndex <= 3) {
                        displaySpan.addClass("green");
                    }
                    else if (uvIndex <= 6) {
                        displaySpan.addClass("yellow");
                    }
                    else if (uvIndex <= 8) {
                        displaySpan.addClass("orange");
                    }
                    else {
                        displaySpan.addClass("red");
                    }

                    displayUV.append(displaySpan);
                    cardBody.append(displayUV);
                });

            cardRow.append(textDiv);

        });

    getForecast(cityLocation);
};

function getForecast(cityLocation) {

    fetch(
        "https://api.openweathermap.org/data/2.5/forecast?q=" + cityLocation + "&appid=1a779978d53b819f8904840069dffbb8&units=imperial"
    )

        .then(function (forecastResponse) {
            return forecastResponse.json();
        })
        .then(function (forecastResponse) {
            console.log(forecastResponse);

            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                 // create the column
            var forecastCol = $("<div>").attr("class", "one-fifth");
            $("#five-day-forecast").append(forecastCol);

            // create the card
            var forecastCard = $("<div>").attr("class", "card text-white bg-primary justify-content-around");
            forecastCol.append(forecastCard);

            // create the forecast date header
            var forecastHeader = $("<div>").attr("class", "card-header").text(moment(forecastResponse.list[5].dt, "X").format ("MMM Do"));
            forecastCard.append(forecastHeader);

            // create the forecast icon
            var forecastIcon = $("<img>").attr("class", "card-img-top").attr("src", "https://openweathermap.org/img/wn/" + forecastResponse.list[5].weather[0].icon + "@2x.png");
            forecastCard.append(forecastIcon);

            // create the forecast card body
            var forecastBody = $("<div>").attr("class", "card-body");
            forecastCard.append(forecastBody);

            // populate the forecast card body with temp and humidity
            forecastBody.append($("<p>").attr("class", "card-text").html("Temp: " + forecastResponse.list[5].main.temp + " &#8457;"));
            forecastBody.append($("<p>").attr("class", "card-text").text("Humidity: " + forecastResponse.list[5].main.humidity + "%"));

                
            }

           
        });
};

// forecast cards:  date > icon > Temp: 58.12 Deg F > Humidity: 70%
// index for 3pm: 5, 13, 21, 29, 37


function clear() {
    // clear all of the previous weather
    $("#current-forecast").empty();
    $("#five-day-forecast").empty();
};




// on click if you hit the search button icon
$("#search-btn").on("click", loadLocations);

// on keyup if you hit the enter key after typing city name
$("#search-input").on("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        document.getElementById("search-btn").click();
    }
});

// on click for previously saved locations
$(document).on("click", ".loc-btn", function () {
    cityLocation = $(this)[0].innerHTML;
    clear();
    showPrevious();
    getCurrent(cityLocation);
});

initialize();