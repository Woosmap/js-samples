// [START woosmap_event_simple]
function initMap() {
  const position: woosmap.map.LatLngLiteral = {
    lat: 51.50940214,
    lng: -0.133012,
  };
  const map = new woosmap.map.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 13,
      center: position,
    },
  );
  const marker = new woosmap.map.Marker({
    position: map.getCenter(),
    icon: {
      url: "https://images.woosmap.com/marker.png",
      scaledSize: {
        height: 50,
        width: 32,
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

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
// [END woosmap_event_simple]
export {};
