// Initialize and add the map
let map: woosmap.map.Map;

async function initMap(): Promise<void> {
  await woosmap.map.importLibrary("maps");

  // The location of London
  const position: woosmap.map.LatLngLiteral = {
    lat: 51.507,
    lng: -0.1,
  };

  // The map, centered at London
  map = (document.getElementById("map") as woosmap.map.MapElement).innerMap;
  map.moveCamera({
    zoom: 17,
    center: position,
  });

  const toggle = document.getElementById("toggleBuildings") as HTMLInputElement;
  toggle.onchange = function () {
    if (toggle.checked) {
      map.setTilt(60);
    } else {
      map.setTilt(0);
    }
  };
}

initMap();

export {};
