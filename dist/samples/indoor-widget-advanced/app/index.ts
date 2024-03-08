let map: woosmap.map.Map;

function initMap(): void {
  map = new window.woosmap.map.Map(
    document.getElementById("map") as HTMLElement,
    {
      center: { lat: 43.6066, lng: 3.9218 },
      zoom: 5,
    },
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
      hideLoader();
    },
  );
}

const hideLoader = () => {
  (document.querySelector(".progress") as HTMLElement).remove();
};

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;

export {};
