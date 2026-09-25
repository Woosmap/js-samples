// [START woosmap_event_simple]
async function initMap() {
  await woosmap.map.importLibrary("maps");
  await woosmap.map.importLibrary("marker");

  const position: woosmap.map.LatLngLiteral = {
    lat: 51.50940214,
    lng: -0.133012,
  };
  const map = (document.getElementById("map") as woosmap.map.MapElement)
    .innerMap;
  map.moveCamera({
    zoom: 13,
    center: position,
  });

  const markerContent = document.createElement("img");
  markerContent.src = "https://images.woosmap.com/marker.png";
  markerContent.style.width = "32px";
  markerContent.style.height = "50px";

  const marker = new woosmap.map.marker.AdvancedMarkerElement({
    position: map.getCenter(),
    content: markerContent,
    gmpClickable: true,
  });
  marker.setMap(map);
  map.addListener("click", ({ latlng }) => {
    map.panTo(latlng);
  });
  map.addListener("idle", () => {
    marker.setPosition(map.getCenter());
  });
  marker.addListener("click", () => {
    markerContent.src = "https://images.woosmap.com/icons/pin-green.png";
    markerContent.style.width = "28px";
    markerContent.style.height = "42px";
  });
}

initMap();
// [END woosmap_event_simple]
export {};
