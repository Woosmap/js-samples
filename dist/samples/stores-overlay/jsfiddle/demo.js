async function initMap() {
  await woosmap.map.importLibrary("maps");

  const center = { lat: 51.52, lng: -0.13 };
  const style = {
    breakPoint: 14,
    rules: [],
    default: {
      color: "#008a2f",
      size: 8,
      minSize: 1,
      icon: {
        url: "https://images.woosmap.com/starbucks-marker.svg",
        scaledSize: {
          height: 40,
          width: 34,
        },
      },
      selectedIcon: {
        url: "https://images.woosmap.com/starbucks-marker-selected.svg",
        scaledSize: {
          height: 50,
          width: 43,
        },
      },
    },
  };
  const map = document.getElementById("map").innerMap;

  map.moveCamera({
    zoom: 4,
    center: center,
  });

  const storesOverlay = new woosmap.map.StoresOverlay(style);

  storesOverlay.setMap(map);
}

initMap();
