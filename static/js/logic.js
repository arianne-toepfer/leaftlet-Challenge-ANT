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

// Grab the data with d3
d3.json(url, function(data) {
    console.log(data);
 
    //Define features
    function CreateFeatures(magData) {
        return {color: colorCoord(magData.geometry.coordinates[2]), 
            radius: markerSize(magData.properties.mag)
        }
    }

    //Define Lat/Long
    // Initialize an array to hold coordinates
    var coord = [];

    // Loop through the stations array
    for (var index = 0; index < data.length; index++) {
        var dataSpot = data[index];
        var coordPair = ([dataSpot.geometry.coordinates[1], dataSpot.geometry.coordinates[0]])

        // Add to array
        coordPair.push(coord);
    };

    //create conditionals based on magnitude    
    function colorCoord(magData) {    
        var color = "";
        if (magData > 90){
            color = "red";
        }
        else if (magData > 70){
            color="DarkOrange";
        }
        else if (magData > 50){
            color="Orange";
        }
        else if (magData > 30){
            color="Gold";
        }
        else if (magData > 10){
            color="GreenYellow";
        }
        else {
            color="Chartreuse";
        }
    }
    // Define a markerSize function that will give each earthquake marker a different size based on depth
    function markerSize(magData) {
    return magData;
    }

    // Add circles to map
    var magLayer = L.geoJson(magData, {
        style: CreateFeatures,
        pointToLayer: function(feature, coord) {
            return new L.CircleMarker(coord);
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h3> Magnitude: " + feature.properties.mag + "</h3>")
        }
    })
    
});
myMap.addlayer(magLayer);

// Set up the legend
var legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");
  var limits = [90,70,50,30,10,-10];
  var colors = ["red", "DarkOrange", "Orange", "Gold", "GreenYellow", "Chartreuse"];
  var labels = [];

  // Add min & max
  var legendInfo = "<h3>Magnitude</h3>" +
        "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
    "</div>";

  div.innerHTML = legendInfo;

  limits.forEach(function(limit, index) {
    labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
  });

  div.innerHTML += "<ul>" + labels.join("") + "</ul>";
  return div;
};

// Adding legend to the map
legend.addTo(myMap);
