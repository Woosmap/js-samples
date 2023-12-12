// [START woosmap_marker_simple]
function initMap() {
  const center = { lat: 51.52, lng: -0.13 };
  const map = new woosmap.map.Map(document.getElementById("map"), {
    zoom: 13,
    center: center,
  });
  const marker = new woosmap.map.Marker({
    position: map.getCenter(),
    icon: {
      url: "https://images.woosmap.com/dot-marker.png",
      scaledSize: {
        height: 64,
        width: 46,
      },
    },
  });

  marker.setMap(map);
}

window.initMap = initMap;
// [END woosmap_marker_simple]
