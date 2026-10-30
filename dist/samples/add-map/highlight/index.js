// Initialize and add the map
let map;

async function initMap() {
  await woosmap.map.importLibrary("maps");

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
}

initMap();
