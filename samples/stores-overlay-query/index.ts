// [START woosmap_stores_overlay_query]
async function initMap(): Promise<void> {
  await woosmap.map.importLibrary("maps");

  const center: woosmap.map.LatLngLiteral = { lat: 51.52, lng: -0.13 };

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

  const map = (document.getElementById("map") as woosmap.map.MapElement).innerMap;
  map.setOptions({
      zoom: 8,
      center: center,
    });

  const storesOverlay = new woosmap.map.StoresOverlay(style);
  storesOverlay.setMap(map);

  // [START woosmap_stores_overlay_query_set_query]
  const toggle = document.getElementById("toggleQuery") as HTMLInputElement;
  toggle.onchange = function () {
    if (toggle.checked) {
      storesOverlay.setQuery('tag:"DT"');
    } else {
      storesOverlay.setQuery(null);
    }
  };
  // [END woosmap_stores_overlay_query_set_query]
}

initMap();
// [END woosmap_stores_overlay_query]
export {};
