// [START woosmap_map_type_hybrid]
// Initialize and add the map with hybrid (satellite) map type
let map: woosmap.map.Map;

async function initMap(): Promise<void> {
  await woosmap.map.importLibrary("maps");

  const position: woosmap.map.LatLngLiteral = {
    lat: 48.8584,
    lng: 2.2945,
  };

  // The map, initialized with hybrid satellite view
  map = (document.getElementById("map") as woosmap.map.MapElement).innerMap;
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
// [END woosmap_map_type_hybrid]

export {};
