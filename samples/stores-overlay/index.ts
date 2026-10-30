// [START woosmap_stores_overlay]
async function initMap(): Promise<void> {
  await woosmap.map.importLibrary("maps");

  const center: woosmap.map.LatLngLiteral = { lat: 51.52, lng: -0.13 };
  // [START woosmap_stores_overlay_style]
  const style: woosmap.map.Style = {
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
  // [END woosmap_stores_overlay_style]

  // [START woosmap_stores_overlay_add_map]
  const map = (document.getElementById("map") as woosmap.map.MapElement).innerMap;
  map.moveCamera({
      zoom: 4,
      center: center,
    });

  const storesOverlay = new woosmap.map.StoresOverlay(style);
  storesOverlay.setMap(map);
  // [END woosmap_stores_overlay_add_map]
}

initMap();
// [END woosmap_stores_overlay]
export {};
