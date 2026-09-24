// [START woosmap_add_map]
// Initialize and add the map
let map: woosmap.map.Map;

async function initMap(): Promise<void> {
  await woosmap.map.importLibrary("maps");

  // [START woosmap_add_map_instantiate_map]
  // The location of London
  const position: woosmap.map.LatLngLiteral = {
    lat: 51.50940214,
    lng: -0.133012,
  };

  // The map, centered at London
  map = (document.getElementById("map") as woosmap.map.MapElement).innerMap;
  map.setOptions({
    zoom: 13,
    center: position,
  });
  // [END woosmap_add_map_instantiate_map]
}

initMap();
// [END woosmap_add_map]

export {};
