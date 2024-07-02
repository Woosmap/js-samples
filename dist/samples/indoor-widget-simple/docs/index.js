// [START woosmap_indoor_widget_simple]
let map;

function initMap() {
  console.log("init map");
  map = new window.woosmap.map.Map(document.getElementById("map"), {});

  const conf = {
    defaultFloor: 0, //Render map with default floor
    venue: "gdn_doc",
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
    map.fitBounds(
      new woosmap.map.LatLngBounds(
        { lat: 48.88115758013444, lng: 2.3562935123187856 },
        { lat: 48.87945292784522, lng: 2.3539262034398405 },
      ),
    );
    hideLoader();
  });
}

const hideLoader = () => {
  document.querySelector(".progress").remove();
};

window.initMap = initMap;
// [END woosmap_indoor_widget_simple]
