//create a basemap
var basemap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

//create map object to hold visualizations
var myMap = L.map("map",{
    center: [
      37.09, -95.71
    ],
    zoom: 5
});

//add basemap layer to map object
basemap.addTo(myMap);

//store API endpoint and queryURL
var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//Perform a GET request to the query URL
d3.json(queryURL).then(function (data) {
    //create function to style markers using earthquake depth as color variable and earthquake magnitude as the size variable
    function markerStyle(feature){
        return{
            opacity: 1,
            fillOpacity: 1,
            fillColor: markerColour(feature.geometry.coordinates[2]),
            color: "white",
            radius: markerSize(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }
    
    //create function to determine markerColour
    function markerColour(depth){
        switch (true){
            case depth >90:
                return "tomato";
            case depth > 70:
                return "darksalmon";
            case depth > 50:
                return "orange";
            case depth > 30:
                return "yellow";
            case depth > 10:
                return "greenyellow";
            default:
                return "yellowgreen";
        };
    }
    
    //create function to determine markerSize
    function markerSize(mag){
        if (mag === 0) {
      return 1;
    }
    return mag * 4;
  }
    
    //add GeoJSON layer
    L.geoJSON(data, {
    // We turn each feature into a circleMarker on the map.
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    // We set the style for each circleMarker using our styleInfo function.
    style: markerStyle,
    // We create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        "Magnitude: "
        + feature.properties.mag
        + "<br>Depth: "
        + feature.geometry.coordinates[2]
        + "<br>Location: "
        + feature.properties.place
      );
    }
  }).addTo(myMap);

// Set up the legend.
var legend = L.control({ position: "bottomright" });
legend.onAdd = function () {
  var div = L.DomUtil.create("div", "legend info");
  div.innerHTML += '<h1></h1>';

  var grades = [0, 10, 30, 50, 70, 90];
  var colors = [
    "yellowgreen",
    "greenyellow",
    "yellow",
    "orange",
    "darksalmon",
    "tomato"
  ];

  // Loop through the intervals to generate a label with a colored square for each interval
  for (var i = 0; i < grades.length; i++) {
    var label = i === 0 ? grades[i] + '+' : grades[i] + '-' + (grades[i + 1] - 1);
    div.innerHTML +=
      '<div class="legend-item">' +
      '<span class="color-square" style="background-color: ' + colors[i] + '"></span>' +
      '<span class="legend-label">' + label + '</span>' +
      '</div>';
  }

  return div;
};

// Adding the legend to the map
legend.addTo(myMap);
});
    
                