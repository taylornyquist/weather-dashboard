// Define global variables
var savedLocationsArray = [];
var currentLocation;

var initialize = function () {

    // grab previous locations from local storage
    savedLocationsArray = JSON.parse(localStorage.getItem("searched-cities"));
    // console.log(savedLocationsArray);

    if (savedLocationsArray) {
        showPrevious();

    } else {
        currentLocation = "Nashville";

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

    // get the value of the input field
    var location = $("#search-input").val().trim();
    // console.log(location);

    // clear the search field value
    $("#search-input").val("");

    // send location variable to the saveLocation function
    saveLocation(location);

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
var saveLocation = function (location) {
    // console.log(location);

    // add location to the saved locations array
    if (savedLocationsArray === null) {
        savedLocationsArray = [location];
    } else if (savedLocationsArray.indexOf(location) === -1) {
        savedLocationsArray.push(location);
    }
    // save the new array to localStorage
    // savedLocationsArray.push(location);
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
            var locationBtn = $("<a>").attr("href", "#").attr("id", "loc-btn").text(savedLocationsArray[i]);
            locationBtn.attr("class", "list-group-item list-group-item-action list-group-item-primary");
            btns.prepend(locationBtn);
        }

        $("#prev-searches").append(btns);

    }
};





$("#search-btn").on("click", loadLocations);

initialize();