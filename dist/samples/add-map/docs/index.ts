// [START woosmap_add_map]
// Initialize and add the map
let map: woosmap.map.Map;
function initMap(): void {
  // [START woosmap_add_map_instantiate_map]
  // The location of London
  const position: woosmap.map.LatLngLiteral = {
    lat: 51.50940214,
    lng: -0.133012,
  };

  // The map, centered at London
  map = new woosmap.map.Map(document.getElementById("map") as HTMLElement, {
    zoom: 13,
    center: position,
  });
  // [END woosmap_add_map_instantiate_map]
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
// [END woosmap_add_map]

export {};
