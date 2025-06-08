// Create the 'basemap' tile layer that will be the background of our map.

let satellite = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
  maxZoom: 18,
  minZoom: 2
});
let basemap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
  maxZoom: 18,
  minZoom: 2
});

// OPTIONAL: Step 2
// Create the 'street' tile layer as a second background of the map
let street = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
  maxZoom: 18,
  minZoom: 2
});

// Create the map object with center and zoom options.
let map = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5,
  layers: [basemap]
});

// Then add the 'basemap' tile layer to the map.
basemap.addTo(map);

// OPTIONAL: Step 2
// Create the layer groups, base maps, and overlays for our two sets of data, earthquakes and tectonic_plates.
// Add a control to the map that will allow the user to change which layers are visible.
let baseMaps = {
  "Street": street,
  "Satellite": satellite
};

L.control.layers(baseMaps).addTo(map);






// Make a request that retrieves the earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {

  // This function returns the style data for each of the earthquakes we plot on
  // the map. Pass the magnitude and depth of the earthquake into two separate functions
  // to calculate the color and radius.
  function styleInfo(feature) { 
    return {
      opacity: 1,
      fillOpacity: 0.8,
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };

  }
  

  // This function determines the color of the marker based on the depth of the earthquake.
  function getColor(depth) {    
    if (depth < 10) {
      return "#00FF00"; // Green for shallow depth
    } else if (depth < 30) {
      return "#FFFF00"; // Yellow for moderate depth
    } else if (depth < 50) {
      return "#FFA500"; // Orange for deeper depth
    } else if (depth < 70) {
      return "#FF4500"; // Red-Orange for deep depth
    } else {
      return "#FF0000"; // Red for very deep depth
    }  

  }

  // This function determines the radius of the earthquake marker based on its magnitude.
  function getRadius(magnitude) { 
    if (magnitude === 0) {
      return 1;   
    }
    return magnitude * 4; // Scale the radius by a factor of 4

  }

  // Add a GeoJSON layer to the map once the file is loaded.
  L.geoJson(data, {
    // Turn each feature into a circleMarker on the map.
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    // Set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
    // Create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
    onEachFeature: function (feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "<br>Depth: " + feature.geometry.coordinates[2] + " km");
      
    }
  // OPTIONAL: Step 2
  // Add the data to the earthquake layer instead of directly to the map.
  }).addTo(map);

  // Create a legend control object.
  let legend = L.control({
    position: "bottomright"
  });

  // Then add all the details for the legend
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");

    // Initialize depth intervals and colors for the legend
    let depthIntervals = [0, 10, 30, 50, 70];
    let colors = ["#00FF00", "#FFFF00", "#FFA500", "#FF4500", "#FF0000"];
    let labels = [];  

    // Loop through our depth intervals to generate a label with a colored square for each interval.
    for (let i = 0; i < depthIntervals.length; i++) {
      labels.push(
        '<i style="background:' + colors[i] + '"></i> ' +
        depthIntervals[i] + (depthIntervals[i + 1] ? '&ndash;' + depthIntervals[i + 1] + ' km' : '+ km')
      );
    }

    div.innerHTML = labels.join('<br>');
    return div;
  };

  // Finally, add the legend to the map.
  legend.addTo(map);

  // OPTIONAL: Step 2
  // Make a request to get our Tectonic Plate geoJSON data.
  d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function (plate_data) {
    // Save the geoJSON data, along with style information, to the tectonic_plates layer.
    let tectonic_plates = L.geoJson(plate_data, {
      style: {
        color: "#FF0000",
        weight: 2
      }
    });

    // Then add the tectonic_plates layer to the map.
    tectonic_plates.addTo(map);

  });
});


d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson").then(function (data) {
  // Process the data for the 2.5+ magnitude earthquakes
  L.geoJson(data, {
    // Turn each feature into a circleMarker on the map.
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    // Set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
    // Create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
    onEachFeature: function (feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  }).addTo(map);
});