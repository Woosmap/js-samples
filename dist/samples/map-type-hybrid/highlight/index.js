// Initialize and add the map with hybrid (satellite) map type
let map;

async function initMap() {
  await woosmap.map.importLibrary("maps");

  const position = {
    lat: 48.8584,
    lng: 2.2945,
  };

  // The map, initialized with hybrid satellite view
  map = document.getElementById("map").innerMap;
  map.setOptions({
    mapTypeId: woosmap.map.MapTypeId.HYBRID,
    mapTypeControl: true,
  });
  map.moveCamera({
    zoom: 16,
    center: position,
  });
  // Listen for map type changes via the built-in control
  map.addListener("mapTypeId_changed", () => {
    console.log("Map type switched to:", map.getMapTypeId());
  });
}

initMap();
