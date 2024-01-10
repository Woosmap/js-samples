// This example displays a marker at the center of London.
// When the user clicks the marker, an info window opens.

function initMap(): void {
  // The map, centered at London
  const map = new woosmap.map.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 10,
      center: {
        lat: 51.57,
        lng: -0.13,
      },
    },
  );

  const londonInfoWindowHTML =
    "<div class='info-content'>" +
    "<h2>London</h2>" +
    "<div class='london-img'></div>" +
    "<p>London is the capital and largest city of England and the United Kingdom. <a href='https://en.wikipedia.org/wiki/London'>Wikipedia →</a></p>" +
    "</div>";

  const marker = new window.woosmap.map.Marker({
    position: {
      lat: 51.515,
      lng: -0.13,
    },
    icon: {
      url: "https://images.woosmap.com/dot-marker.png",
      scaledSize: {
        height: 50,
        width: 36,
      },
    },
    map,
  });
  const infoWindow = new woosmap.map.InfoWindow({});
  infoWindow.setOffset(new woosmap.map.Point(0, -50));
  infoWindow.setContent(londonInfoWindowHTML);
  infoWindow.open(map, marker.position);
  marker.addListener("click", () => {
    infoWindow.open(map, marker.getPosition());
  });
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
// [END  woosmap_infowindow_simple]

export {};
