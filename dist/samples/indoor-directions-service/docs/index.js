// [START woosmap_indoor_directions_service]
let map;
let indoorDirectionsRequest;
let indoorRenderer;
let venue;

function initMap() {
  venue = "gdn_doc";
  map = new window.woosmap.map.Map(document.getElementById("map"), {
    center: { lat: 43.6066, lng: 3.9218 },
    zoom: 19.5,
  });
  indoorRenderer = new woosmap.map.IndoorRenderer({
    venue: venue,
  });

  const indoorService = new window.woosmap.map.IndoorService();

  // Indoor event that is triggered when the indoor venue is loaded.
  indoorRenderer.addListener("indoor_venue_loaded", (venue) => {
    let _a;

    console.log(venue);
    if (indoorRenderer !== null && indoorRenderer.getVenue() !== null) {
      indoorDirectionsRequest = {
        venueId:
          ((_a = indoorRenderer.getVenue()) === null || _a === void 0
            ? void 0
            : _a.venue_id) || "gdn_doc",
        origin: new woosmap.map.LatLng(48.8801287, 2.3548678),
        originLevel: 0,
        destination: new woosmap.map.LatLng(48.8799341, 2.3563779),
        destinationLevel: 0,
        language: "en",
        units: "metric",
        originId: null,
        destinationId: null,
      };
      indoorService.directions(indoorDirectionsRequest, (result) => {
        indoorRenderer.setDirections(result);
        hideLoader();
      });
    }
  });
  indoorRenderer.setMap(map);
}

const hideLoader = () => {
  document.querySelector(".progress").remove();
};

window.initMap = initMap;
// [END woosmap_indoor_directions_service]
