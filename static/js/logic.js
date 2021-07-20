// Creating map object
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
});

// Adding tile layer to the map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);

// Store API query variables
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Define a markerSize function that will give each earthquake marker a different size based on depth
function markerSize(depth) {
    return depth;
}

//create an array that holds the coordinates
var coordArray = [];

// Grab the data with d3
d3.json(url, function(response) {
    console.log(response);
 
    //create loop to pull the data from the geojson
    for (var i = 0; i < response.length; i++){
        var color = "";
        var coords = response[i].features.geometry;
        if (coords.coordinates[2] > 90){
            color = "red";
        }
        else if (coords.coordinates[2] > 70){
            color="DarkOrange";
        }
        else if (coords.coordinates[2] > 50){
            color="Orange";
        }
        else if (coords.coordinates[2] > 30){
            color="Gold";
        }
        else if (coords.coordinates[2] > 10){
            color="GreenYellow";
        }
        else {
            color="Chartreuse";
        }
        // Add circles to map
        L.circle([coords.coordinates[1], coords.coordinates[0]], {
            fillOpacity: 0.75,
            color: "white",
            fillColor: color,
            // Adjust radius
            radius: markerSize(coords.coordinates[2])
        }).bindPopup("<h3> Magnitude: " + coords.coordinates[2] + "</h3>").addTo(myMap);
    }
});