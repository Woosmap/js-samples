// [START woosmap_indoor_navigation_widget]
let map: woosmap.map.Map;
let indoorRenderer: woosmap.map.IndoorRenderer;
let indoorNavigation: woosmap.map.NavigationWidget;
let indoorService: woosmap.map.IndoorService;
let venue: string;

async function initMap(): Promise<void> {
  await woosmap.map.importLibrary("maps");

  venue = "gdn_doc";
  map = (document.getElementById("map") as woosmap.map.MapElement).innerMap;
  map.setOptions({ visualRefresh: true, center: { lat: 43.6066, lng: 3.9218 } });

  const conf: woosmap.map.IndoorRendererOptions = {
    venue: venue,
    responsive: "desktop",
  };

  indoorRenderer = new woosmap.map.IndoorRenderer(conf);

  indoorRenderer.setMap(map);

  // Indoor event that is triggered when the indoor venue is loaded.
  indoorRenderer.addListener("indoor_venue_loaded", (venue) => {
    indoorService = new woosmap.map.IndoorService();

    const request: woosmap.map.IndoorDirectionRequest = {
      venueId: "gdn_doc",
      origin: new woosmap.map.LatLng(48.8801287, 2.3548678),
      originLevel: 0,
      destination: new woosmap.map.LatLng(48.8799341, 2.3563779),
      destinationLevel: 0,
      units: "metric",
      originId: null,
      destinationId: null,
    };
    indoorService.directions(request, (response) => {
      if (response) {
        indoorRenderer.setDirections(response);
        indoorNavigation = new woosmap.map.NavigationWidget(
          indoorRenderer,
          exitNavigation,
        );
        indoorNavigation.setMap(map);
        hideLoader();
      }
    });
  });
}

const exitNavigation = () => {
  indoorNavigation.setMap(null);
  indoorRenderer.setDirections(null);
};

const hideLoader = () => {
  (document.querySelector(".progress") as HTMLElement).remove();
};

initMap();
// [END woosmap_indoor_navigation_widget]

export {};
