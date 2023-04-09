//Creating the map object
var myMap = L.map("map", {
  center: [25, 35.7935],
  zoom: 2.5
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Use this link to get the GeoJSON data.
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

function markerSize(magnitude) {return magnitude * 3;}

// Marker color based on the earthquake depth
function markerColor(depth) {
    if (depth < 10) {
        return "#00FF00"; // green
      } else if (depth < 30) {
        return "#FFFF00"; // yellow
      } else if (depth < 50) {
        return "#FFA500"; // orange
      } else {
        return "#ffc0cb"; //Pink
  }
}

// Getting our GeoJSON data
d3.json(link).then(function(data) {
  // Creating a GeoJSON layer with the retrieved data
  L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.5
      }).bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
        "</h3><p>Magnitude: " + feature.properties.mag + "<br>Depth: " +
        feature.geometry.coordinates[2] + "</p>");
    }
  }).addTo(myMap);
  
  // Create a legend for the map
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "info legend");
    var grades = [-10, 10, 30, 50];
    var labels = ["<strong>Depth</strong><br>"];
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        labels.push(
          '<i style="background:' + markerColor(grades[i] + 1) + '"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+')
        );
    }
    div.innerHTML = labels.join("");
    return div;
  };
  legend.addTo(myMap);
});


  