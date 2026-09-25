// [START woosmap_infowindow_simple]
// This example displays a marker at the center of London.
// When the user clicks the marker, an info window opens.

async function initMap(): Promise<void> {
  await woosmap.map.importLibrary("maps");
  await woosmap.map.importLibrary("marker");

  // The map, centered at London
  const map = (document.getElementById("map") as woosmap.map.MapElement).innerMap;
  map.moveCamera({
      zoom: 10,
      center: {
        lat: 51.57,
        lng: -0.13,
      },
    });

  const londonInfoWindowHTML =
    "<div class='info-content'>" +
    "<h2>London</h2>" +
    "<div class='london-img'></div>" +
    "<p>London is the capital and largest city of England and the United Kingdom. <a href='https://en.wikipedia.org/wiki/London'>Wikipedia →</a></p>" +
    "</div>";

  const markerContent = document.createElement("img");
  markerContent.src = "https://images.woosmap.com/marker.png";
  markerContent.style.width = "32px";
  markerContent.style.height = "50px";

  const marker = new woosmap.map.marker.AdvancedMarkerElement({
    position: {
      lat: 51.515,
      lng: -0.13,
    },
    content: markerContent,
    gmpClickable: true,
    map,
  });
  const infoWindow = new woosmap.map.InfoWindow({});
  infoWindow.setOffset(new woosmap.map.Point(0, -50));
  infoWindow.setContent(londonInfoWindowHTML);
  infoWindow.open({map, anchor: marker});
  marker.addListener("click", () => {
    infoWindow.open({map, anchor: marker});
  });
}

initMap();
// [END woosmap_infowindow_simple]

export {};
