// [START woosmap_add_map]
// Initialize and add the map
let map;

async function initMap() {
  await woosmap.map.importLibrary("maps");

  // [START woosmap_add_map_instantiate_map]
  // The location of London
  const position = {
    lat: 51.50940214,
    lng: -0.133012,
  };

  // The map, centered at London
  map = document.getElementById("map").innerMap;
  map.moveCamera({
    zoom: 13,
    center: position,
  });
  // [END woosmap_add_map_instantiate_map]
}

initMap();
// [END woosmap_add_map]
