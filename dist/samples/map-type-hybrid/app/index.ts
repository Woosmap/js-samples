// Initialize and add the map with hybrid (satellite) map type
let map: woosmap.map.Map;

function initMap(): void {
  const position: woosmap.map.LatLngLiteral = {
    lat: 48.8584,
    lng: 2.2945,
  };

  // The map, initialized with hybrid satellite view
  // @ts-ignore - mapTypeId available since Map JS API v1.33
  map = new woosmap.map.Map(document.getElementById("map") as HTMLElement, {
    zoom: 16,
    center: position,
    mapTypeId: woosmap.map.MapTypeId.HYBRID,
  });

  // Listen for map type changes via the built-in control
  map.addListener("mapTypeId_changed", () => {
    // @ts-ignore - getMapTypeId available since Map JS API v1.33
    console.log("Map type switched to:", map.getMapTypeId());
  });
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;

export {};
