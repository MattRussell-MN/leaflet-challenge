// Creating map object
var myMap = L.map("mapid", {
    center: [36.1627, -86.7816],
    zoom: 3
  });
  
  // Adding tile layer
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);

// api call to get geo json data on earthquakes
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson").then(createMarkers);

// function to create markers
function createMarkers(response) {
    
    // console the response 
    console.log(response.features);
    
    // loop through earthquakes and create markers
    for (var i = 0; i < response.features.length; i++) {

        // conditionals for color of circle based on depth
        var color = "";
        var depth = response.features[i].geometry.coordinates[2];
        if (depth < 10) {
            color = "#e6ffe6";
        }

        else if (depth < 30) {
            color = "#00cc00";
        }

        else if (depth < 50) {
            color = "#ffe4b3";
        }

        else if (depth < 70) {
            color = "#ffa600";
        }

        else if (depth < 90) {
            color = "#ff751a";
        }

        else {
            color = "#e60000";
        }

// Define satellite, grayscale and outdoors layers
  var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "satellite-v9",
    accessToken: API_KEY
  });

  var grayscalemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });

  var outdoorsmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "outdoors-v11",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Satellite Map": satellitemap,
    "Grayscale Map": grayscalemap,
    "Outdoors Map": outdoorsmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
     "Tectonic Plates": tectonicplates,
     "Earthquakes": earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("mapid", {
    center: [
      36.1627, -86.7816
    ],
    zoom: 5,
    layers: [satellitemap, tectonicplates]
  });

        // add circles to the map
        var mag = response.features[i].properties.mag;
        var lat = response.features[i].geometry.coordinates[1];
        var lon = response.features[i].geometry.coordinates[0];
        var place = response.features[i].properties.place;
        
        L.circle([lat, lon], {
            fillOpacity: 0.75,
            color: "black",
            fillColor: color,
            radius: mag * 25000
        }).bindPopup("<h2>" + place + "</h2><h2>Magnitude: " + mag + "</h2>")
            .addTo(myMap);

    }

    // add legend

    function getColor(d) {
        return  d < 10 ? "#e6ffe6":
                d < 30 ? "#00cc00":
                d < 50 ? "#ffe4b3":
                d < 70 ? "#ffa600":
                d < 90 ? "#ff751a":
                        "#e60000"; 
    }
    
    
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function(myMap) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [-10, 10, 30, 50, 70, 90],
            labels = [];

        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i>' + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        
        return div;
    }

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(myMap);
    legend.addTo(myMap);

}
