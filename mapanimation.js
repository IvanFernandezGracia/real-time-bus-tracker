// This array contains the coordinates for all bus stops between MIT and Harvard
const busStops = [
  [-71.093729, 42.359244],
  [-71.094915, 42.360175],
  [-71.0958, 42.360698],
  [-71.099558, 42.362953],
  [-71.103476, 42.365248],
  [-71.106067, 42.366806],
  [-71.108717, 42.368355],
  [-71.110799, 42.369192],
  [-71.113095, 42.370218],
  [-71.115476, 42.372085],
  [-71.117585, 42.373016],
  [-71.118625, 42.374863],
];

// TODO: add your own access token
mapboxgl.accessToken =
  "pk.eyJ1IjoiaXZhbmZlcm5hbmRlIiwiYSI6ImNrdGw0cjM5ZTFzY3gycHFmYnVwZ3RkYmEifQ.XHwaTGqsELi9_pGu7Kaj5Q";

// This is the map instance
let map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/satellite-v9",
  center: [-71.104081, 42.365554],
  zoom: 14,
});

// TODO: add a marker to the map at the first coordinates in the array busStops. The marker variable should be named "marker"
const marker = new mapboxgl.Marker().setLngLat(busStops[0]).addTo(map);

// counter here represents the index of the current bus stop
let counter = 0;
function move() {
  // TODO: move the marker on the map every 1000ms. Use the function marker.setLngLat() to update the marker coordinates
  // Use counter to access bus stops in the array busStops
  // Make sure you call move() after you increment the counter.
  if (counter===0){updateRoute()}
  setTimeout(function () {
    marker.setLngLat(busStops[counter]);
    counter = counter + 1;
    console.log(counter);
    move();
  }, 1000);
}

// Do not edit code past this point
if (typeof module !== "undefined") {
  module.exports = { move };
}
/*Agregar la API Map Matching*/

// Use the coordinates you drew to make the Map Matching API request
function updateRoute() {
  // Set the profile
  const profile = "driving";
  const coords = busStops //data.features[lastFeature].geometry.coordinates;
  // Format the coordinates
  const newCoords = coords.join(";");
  // Set the radius for each coordinate pair to 25 meters
  const radius = coords.map(() => 25);
  console.log(coords)
  console.log(newCoords)
  console.log(radius)
  getMatch(newCoords, radius, profile);
}

// Make a Map Matching request
async function getMatch(coordinates, radius, profile) {
  // Separate the radiuses with semicolons
  const radiuses = radius.join(";");
  // Create the query
  const query = await fetch(
    `https://api.mapbox.com/matching/v5/mapbox/${profile}/${coordinates}?geometries=geojson&radiuses=${radiuses}&steps=true&access_token=${mapboxgl.accessToken}`,
    { method: "GET" }
  );
  const { code, message, matchings } = await query.json();
  // Handle errors
  if (code !== "Ok") {
    alert(
      `${code} - ${message}.\n\nFor more information: https://docs.mapbox.com/api/navigation/map-matching/#map-matching-api-errors`
    );
    return;
  }
  // Get the coordinates from the response
  const coords = matchings[0].geometry;
  console.log(coords);
  // Code from the next step will go here
}


/* Draw the Map Matching route*/

// Draw the Map Matching route as a new layer on the map
function addRoute(coords) {
  // If a route is already loaded, remove it
  if (map.getSource('route')) {
    map.removeLayer('route');
    map.removeSource('route');
  } else {
    // Add a new layer to the map
    map.addLayer({
      id: 'route',
      type: 'line',
      source: {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: coords
        }
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#FF0000',
        'line-width': 8,
        'line-opacity': 0.8
      }
    });
  }
}
// Make a Map Matching request
async function getMatch(coordinates, radius, profile) {
  // Separate the radiuses with semicolons
  const radiuses = radius.join(';');
  // Create the query
  const query = await fetch(
    `https://api.mapbox.com/matching/v5/mapbox/${profile}/${coordinates}?geometries=geojson&radiuses=${radiuses}&steps=true&access_token=${mapboxgl.accessToken}`,
    { method: 'GET' }
  );
  const { code, message, matchings } = await query.json();
  // Handle errors
  if (code !== 'Ok') {
    alert(
      `${code} - ${message}.\n\nFor more information: https://docs.mapbox.com/api/navigation/map-matching/#map-matching-api-errors`
    );
    return;
  }
  // Get the coordinates from the response
  const coords = matchings[0].geometry;
  // Draw the route on the map
  addRoute(coords);
    // Draw the route on the map

}
