let map: woosmap.map.Map;

async function initMap() {
  await woosmap.map.importLibrary("maps");

  map = (document.getElementById("map") as woosmap.map.MapElement).innerMap;
  map.moveCamera({
      center: { lat: 43.6066, lng: 3.9218 },
      zoom: 19.5,
    });

  const indoorRenderer = new woosmap.map.IndoorRenderer({
    venue: "wgs_doc",
    defaultFloor: 3,
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

initMap();

export {};
