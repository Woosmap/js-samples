// [START woosmap_indoor_widget_advanced]
let map: woosmap.map.Map;

function initMap(): void {
  map = new window.woosmap.map.Map(
    document.getElementById("map") as HTMLElement,
    { center: { lat: 43.6066, lng: 3.9218 } },
  );

  const conf: woosmap.map.IndoorRendererOptions = {
    centerMap: false,
    defaultFloor: 3, //Render map with default floor
    highlightPOIByRef: "tropiques",
    venue: "wgs_doc",
    responsive: "desktop",
  };

  const widgetConf: woosmap.map.IndoorWidgetOptions = {
    units: "metric", // Define the distance unit for route distance calculation
  };

  const indoorRenderer = new woosmap.map.IndoorWidget(widgetConf, conf);

  indoorRenderer.setMap(map);

  // Indoor event that is triggered when the user click on a POI.
  indoorRenderer.addListener(
    "indoor_feature_selected",
    (feature: woosmap.map.GeoJSONFeature) => {
      console.log("Feature: ", feature);
    },
  );

  // Indoor event that is triggered when the indoor venue is loaded.
  indoorRenderer.addListener(
    "indoor_venue_loaded",
    (venue: woosmap.map.Venue) => {
      console.log("Venue: ", venue);

      map.fitBounds(
        new woosmap.map.LatLngBounds(
          { lat: 48.88115758013444, lng: 2.3562935123187856 },
          { lat: 48.87945292784522, lng: 2.3539262034398405 },
        ),
      );
      hideLoader();
    },
  );
}
const hideLoader = () => {
  const loader = document.querySelector("#loader") as HTMLDivElement;
  const mapContainer = document.querySelector("#map") as HTMLDivElement;
  if (loader) {
    loader.style.display = "none";
  }
  if (mapContainer) {
    mapContainer.style.visibility = "visible";
  }
};

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
// [END woosmap_indoor_widget_advanced]

export {};
