function initMap() {
  const position = {
    lat: 51.50940214,
    lng: -0.133012,
  };
  const map = new woosmap.map.Map(document.getElementById("map"), {
    zoom: 13,
    center: position,
  });
  const marker = new woosmap.map.Marker({
    position: map.getCenter(),
    icon: {
      url: "https://images.woosmap.com/icons/pin-blue.png",
      scaledSize: {
        height: 42,
        width: 28,
      },
    },
  });

  marker.setMap(map);
  map.addListener("click", ({ latlng }) => {
    map.panTo(latlng);
  });
  map.addListener("idle", () => {
    marker.setPosition(map.getCenter());
  });
  marker.addListener("click", () => {
    marker.setIcon({
      url: "https://images.woosmap.com/icons/pin-green.png",
      scaledSize: {
        height: 42,
        width: 28,
      },
    });
  });
}

window.initMap = initMap;
