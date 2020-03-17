/* eslint-disable */

const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoiY24tOTAiLCJhIjoiY2s3dzNjdzZvMDA1aDNwbnpqeWI1ZnZycyJ9.A4WUAgBYykiC4c8oo1TWmg';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/cn-90/ck7w3xvkc0ee51io8w7jn1mw2',
  scrollZoom: false

  // center: [-118.113491, 34.111745],
  // zoom: 10,
  // interactive: false
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(location => {
  // Create Marker for each location
  const el = document.createElement('div');
  el.className = 'marker';

  // Add Marker
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom'
  })
    .setLngLat(location.coordinates)
    .addTo(map);

  // Add popup
  new mapboxgl.Popup({
    offset: 30
  })
    .setLngLat(location.coordinates)
    .setHTML(`<p>Day ${location.day}: ${location.description}</p>`)
    .addTo(map);

  // extends map bound to include current location
  bounds.extend(location.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100
  }
});
