// [START woosmap_marker_label]
function initMap() {
  const center = { lat: 51.52, lng: -0.13 };
  const iconMarker = {
    labelOrigin: new window.woosmap.map.Point(14, 15),
    url: "https://images.woosmap.com/marker-red.svg",
  };
  const map = new woosmap.map.Map(document.getElementById("map"), {
    zoom: 10,
    center: center,
  });
  // [START woosmap_marker_label_add_label]
  let labelNumber = 1;

  new window.woosmap.map.Marker({
    position: map.getCenter(),
    icon: iconMarker,
    label: {
      text: String(labelNumber),
      color: "white",
    },
    map,
  });
  // [END woosmap_marker_label_add_label]
  map.addListener("click", (e) => {
    labelNumber += 1;
    new window.woosmap.map.Marker({
      position: e.latlng,
      icon: iconMarker,
      label: {
        text: String(labelNumber),
        color: "white",
      },
      map,
    });
  });
}

window.initMap = initMap;
// [END woosmap_marker_label]
