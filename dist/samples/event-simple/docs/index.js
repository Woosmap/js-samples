// [START woosmap_event_simple]
async function initMap() {
  await woosmap.map.importLibrary("maps");
  await woosmap.map.importLibrary("marker");

  const position = {
    lat: 51.50940214,
    lng: -0.133012,
  };
  const map = document.getElementById("map").innerMap;

  map.moveCamera({
    zoom: 13,
    center: position,
  });

  const { PinElement } = woosmap.map.marker;
  const pin = new PinElement({
    background: "#5588FF",
    borderColor: "#3D6FE0",
    glyphColor: "#FFFFFF",
  });
  const marker = new woosmap.map.marker.AdvancedMarkerElement({
    position: map.getCenter(),
    content: pin.element,
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
    pin.background = "#00BDA5";
    pin.borderColor = "#004941";
  });
}

initMap();
// [END woosmap_event_simple]
