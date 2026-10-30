// [START woosmap_vector_map]
// Initialize and add the map
let map;

async function initMap() {
  await woosmap.map.importLibrary("maps");

  // [START woosmap_vector_map_instantiate_map]
  // The location of London
  const position = {
    lat: 51.507,
    lng: -0.1,
  };

  // The map, centered at London
  map = document.getElementById("map").innerMap;
  map.moveCamera({
    zoom: 17,
    center: position,
  });

  // [END woosmap_vector_map_instantiate_map]
  // [START woosmap_vector_tilt]
  const toggle = document.getElementById("toggleBuildings");

  toggle.onchange = function () {
    if (toggle.checked) {
      map.setTilt(60);
    } else {
      map.setTilt(0);
    }
  };
  // [END woosmap_vector_tilt]
}

initMap();
// [END woosmap_vector_map]
