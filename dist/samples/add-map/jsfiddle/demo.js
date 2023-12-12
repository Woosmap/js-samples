// Initialize and add the map
let map;

function initMap() {
  // The location of London
  const position = {
    lat: 51.50940214,
    lng: -0.133012,
  };

  // The map, centered at London
  map = new woosmap.map.Map(document.getElementById("map"), {
    zoom: 13,
    center: position,
  });
}

window.initMap = initMap;
