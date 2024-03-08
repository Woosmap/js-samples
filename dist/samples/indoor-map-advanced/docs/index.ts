// [START woosmap_indoor_map_advanced]
let map: woosmap.map.Map;

function initMap() {
  map = new window.woosmap.map.Map(
    document.getElementById("map") as HTMLElement,
    {
      center: { lat: 43.6066, lng: 3.9218 },
      zoom: 19.5,
    },
  );

  const indoorRenderer = new woosmap.map.IndoorRenderer({
    venue: "wgs_doc",
    defaultFloor: 3,
    highlightPOIByRef: "tropiques",
    useInfoWindow: true,
  });

  // Indoor event that is triggered when the indoor venue is loaded.
  indoorRenderer.addListener(
    "indoor_venue_loaded",
    (venue: woosmap.map.Venue) => {
      console.log(venue);
      hideLoader();
    },
  );
  indoorRenderer.setMap(map);
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
// [END woosmap_indoor_map_advanced]

export {};
