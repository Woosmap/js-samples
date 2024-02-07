// [START woosmap_render_shapes_geojson]
// Initialize and add the map
let map: woosmap.map.Map;

function initMap() {
  map = new window.woosmap.map.Map(
    document.getElementById("map") as HTMLElement,
    {
      center: { lat: 53.51, lng: 8.15 },
      zoom: 4,
    },
  );

  map.data.loadGeoJson(
    "https://demo.woosmap.com/misc/data/europe.geojson.json",
  );
  const defaultStyle = {
    fillColor: "#FFAB00",
    strokeWeight: 2,
  };

  map.data.setStyle((feature) => {
    let color = defaultStyle.fillColor;
    if (feature.getProperty("highlighted")) {
      color = "#C51162";
    }
    return {
      fillColor: color,
      strokeColor: color,
      strokeOpacity: 1,
      strokeWeight: defaultStyle.strokeWeight,
    };
  });

  let highlightedFeatureId;
  if (map && map.data) {
    map.data.addListener("click", (event) => {
      if (highlightedFeatureId) {
        const highlightedFeature =
          map.data.getFeatureById(highlightedFeatureId);
        if (highlightedFeature) {
          highlightedFeature.setProperty("highlighted", false);
        }
      }
      event.feature.setProperty("highlighted", true);
      highlightedFeatureId = event.feature.getId();
    });
  }
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
// [END woosmap_render_shapes_geojson]

export {};
