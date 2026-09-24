// [START woosmap_marker_simple]
async function initMap(): Promise<void> {
  await woosmap.map.importLibrary("maps");
  await woosmap.map.importLibrary("marker");

  const center: woosmap.map.LatLngLiteral = { lat: 51.52, lng: -0.13 };

  const map = (document.getElementById("map") as woosmap.map.MapElement)
    .innerMap;
  map.setOptions({
    zoom: 13,
    center: center,
  });

  const markerContent = document.createElement("img");
  markerContent.src = "https://images.woosmap.com/marker.png";
  markerContent.style.width = "32px";
  markerContent.style.height = "50px";

  const marker = new woosmap.map.marker.AdvancedMarkerElement({
    position: map.getCenter(),
    content: markerContent,
  });
  marker.setMap(map);
}

initMap();
// [END woosmap_marker_simple]
export {};
