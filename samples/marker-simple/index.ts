// [START woosmap_marker_simple]
function initMap(): void {
  const center: woosmap.map.LatLngLiteral = { lat: 51.52, lng: -0.13 };

  const map = new woosmap.map.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 13,
      center: center,
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
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
// [END woosmap_marker_simple]
export {};
