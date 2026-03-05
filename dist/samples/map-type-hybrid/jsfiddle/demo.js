// Initialize and add the map with hybrid (satellite) map type
let map;

function initMap() {
  const position = {
    lat: 48.8584,
    lng: 2.2945,
  };

  // The map, initialized with hybrid satellite view
  map = new woosmap.map.Map(document.getElementById("map"), {
    zoom: 16,
    center: position,
    // @ts-expect-error mapTypeId available since Map JS API v1.33
    mapTypeId: woosmap.map.MapTypeId.HYBRID,
    mapTypeControl: true,
  });
  // Listen for map type changes via the built-in control
  map.addListener("mapTypeId_changed", () => {
    // @ts-expect-error getMapTypeId available since Map JS API v1.33
    console.log("Map type switched to:", map.getMapTypeId());
  });
}

window.initMap = initMap;
