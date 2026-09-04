// Initialize and add the map
let map: woosmap.map.Map;

function initMap(): void {
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
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;

export {};
