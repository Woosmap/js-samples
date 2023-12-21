// [START woosmap_vector_map]
// Initialize and add the map
let map: woosmap.map.Map;

function initMap(): void {
  // [START woosmap_vector_map_instantiate_map]
  // The location of London
  const position: woosmap.map.LatLngLiteral = {
    lat: 51.507,
    lng: -0.1,
  };

  // The map, centered at London
  map = new woosmap.map.Map(document.getElementById("map") as HTMLElement, {
    zoom: 17,
    center: position,
  });
  // [END woosmap_vector_map_instantiate_map]

  // [START woosmap_vector_tilt]
  const toggle = document.getElementById("toggleBuildings") as HTMLInputElement;
  toggle.onchange = function () {
    if (toggle.checked) {
      map.setTilt(60);
    } else {
      map.setTilt(0);
    }
  };
  // [END woosmap_vector_tilt]
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
// [END woosmap_vector_map]

export {};
