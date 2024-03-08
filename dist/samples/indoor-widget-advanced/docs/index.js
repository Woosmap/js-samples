// [START woosmap_indoor_widget_advanced]
let map;

function initMap() {
  map = new window.woosmap.map.Map(document.getElementById("map"), {
    center: { lat: 43.6066, lng: 3.9218 },
    zoom: 5,
  });

  const conf = {
    centerMap: false,
    defaultFloor: 3, //Render map with default floor
    highlightPOIByRef: "tropiques",
    venue: "wgs_doc",
    responsive: "desktop",
  };
  const widgetConf = {
    units: "metric", // Define the distance unit for route distance calculation
  };
  const indoorRenderer = new woosmap.map.IndoorWidget(widgetConf, conf);

  indoorRenderer.setMap(map);
  // Indoor event that is triggered when the user click on a POI.
  indoorRenderer.addListener("indoor_feature_selected", (feature) => {
    console.log("Feature: ", feature);
  });
  // Indoor event that is triggered when the indoor venue is loaded.
  indoorRenderer.addListener("indoor_venue_loaded", (venue) => {
    console.log("Venue: ", venue);
    hideLoader();
  });
}

const hideLoader = () => {
  document.querySelector(".progress").remove();
};

window.initMap = initMap;
// [END woosmap_indoor_widget_advanced]
