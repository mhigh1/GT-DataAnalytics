// Color Key
const colors = [
  "#a3f600",
  "#dcf400",
  "#f7db11",
  "#fdb72a",
  "#fca35d",
  "#ff5f65"
];

// geoJSON data URL
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Map creation function
const createMap = function(quakeLayer) {

  // Create the tile layers that will be the background(s) of our map
  const lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  });

  const darkMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/dark-v10",
    accessToken: API_KEY
  });

  const satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
  });

  const outdoorsMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/outdoors-v11",
    accessToken: API_KEY
  });
  
    // Create a baseMaps object to hold the base map layers
    const baseMaps = {
      "Default": lightMap,
      "Dark": darkMap,
      "Outdoors": outdoorsMap,
      "Satellite": satelliteMap
    };

    // Create overlayMaps object to hodl the overlay layers
    const overlayMaps = {
      Earthquakes: quakeLayer
    };
  
    // Create the map object with options
    const myMap = L.map("map", {
      center: [39.833332, -98.583336],
      zoom: 5,
      layers: [lightMap, quakeLayer]
    });
  
    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);

    // Map Legend
    const legend = L.control({position: "bottomright"});
    legend.onAdd = function() {
      const div =  L.DomUtil.create("div", "legend");
      const scale = ["<10","10-30","30-50","50-70","70-90","90+"];

      for (let i = 0; i < scale.length; i++) {
        div.innerHTML += createLegendItem(colors[i], scale[i]);
      }
      
      return div;
    }

    legend.addTo(myMap);
};

// Marker creation function
const createMarkers = function(data) {

  const earthQuakes = L.geoJSON(data, {
    pointToLayer: function(feature, latlng) {
      let options = {
        radius: feature.properties.mag * 5,
        fillColor: markerColor(feature.geometry.coordinates[2], colors),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }
      return L.circleMarker(latlng, options);
    },
    onEachFeature: function(feature, layer) {
      layer.bindPopup(markerPopup(feature));
    }
  });
  
  createMap(earthQuakes);
};

// Helper Functions
// markerColor chooser based on depth
const markerColor = function(depth, colors) {
  if (depth <= 10) {
    return colors[0]
  } 
  else if (depth > 10 && depth <= 30) {
    return colors[1]
  }
  else if (depth > 30 && depth <= 50) {
    return colors[2]
  }
  else if (depth > 50 && depth <= 70) {
    return colors[3]
  }
  else if (depth > 70 && depth <= 90) {
    return colors[4]
  }
  else if (depth > 90) {
    return colors[5]
  }
}

// Function to create marker popup HTML
const markerPopup = function(feature) {

  const magnitude = feature.properties.mag;
  const depth = feature.geometry.coordinates[2];
  let dateTime = "Not Available";

  if(feature.properties.time) {
    dateTime = new Date(feature.properties.time).toISOString();
  }

  return `
    <div>
      <div class="popup-item">
        <div class="label-container">Magnitude</div>
        <div class="splitter">:</div>
        <div class="value-wrapper">${magnitude}</div>
      </div>
      <div class="popup-item">
        <div class="label-container">Depth</div>
        <div class="splitter">:</div>
        <div class="value-wrapper">${depth}</div>
      </div>
      <div class="popup-item">
        <div class="label-container">Time</div>
        <div class="splitter">:</div>
        <div class="value-wrapper">${dateTime}</div>
      </div>
    </div>
  `;
}

// Function to create legend item HTML
const createLegendItem = function(color, label) {
  return `<div class="legend-item"><i class="legend-item-icon" style="background: ${color};"></i><div class="legend-item-label">${label}</div></div>`
}

// RUNTIME
// Perform an API call to the API to get information. Call createMarkers when complete
d3.json(url, createMarkers);
