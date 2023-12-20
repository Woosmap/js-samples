// [START woosmap_stores_overlay_query]
function initMap() {
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
  const map = new woosmap.map.Map(document.getElementById("map"), {
    zoom: 8,
    center: center,
  });
  const storesOverlay = new woosmap.map.StoresOverlay(style);

  storesOverlay.setMap(map);

  // [START woosmap_stores_overlay_query_set_query]
  const toggle = document.getElementById("toggleQuery");

  toggle.onchange = function () {
    if (toggle.checked) {
      storesOverlay.setQuery('tag:"DT"');
    } else {
      storesOverlay.setQuery(null);
    }
  };
  // [END woosmap_stores_overlay_query_set_query]
}

window.initMap = initMap;
// [END woosmap_stores_overlay_query]
