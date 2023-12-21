// [START woosmap_stores_overlay]
function initMap(): void {
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
  const map = new woosmap.map.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 4,
      center: center,
    },
  );

  const storesOverlay = new woosmap.map.StoresOverlay(style);
  storesOverlay.setMap(map);
  // [END woosmap_stores_overlay_add_map]
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
// [END woosmap_stores_overlay]
export {};
