async function initMap() {
  await woosmap.map.importLibrary("maps");
  await woosmap.map.importLibrary("marker");

  function createMarkerContent(data) {
    const div = document.createElement("div");

    // [START woosmap_marker_html_css]
    div.className = "popover";
    div.innerHTML = `<div class="popover-content">
                      <span class="icon">️</span>
                      <span class="price">${data.price}</span>
                    </div>
                     <div class="popover-arrow-shadow"></div>
                     <div class="popover-arrow"></div>`;
    return div;
  }

  const center = { lat: 51.5074, lng: -0.1278 };
  const map = document.getElementById("map").innerMap;

  map.moveCamera({
    zoom: 13,
    center: center,
  });

  const markersData = [
    { price: "100 €" },
    { price: "200 €" },
    { price: "300 €" },
    { price: "400 €" },
    { price: "500 €" },
  ];
  const positions = [
    { lat: 51.5074, lng: -0.1278 },
    { lat: 51.5174, lng: -0.1378 },
    { lat: 51.4974, lng: -0.1178 },
    { lat: 51.5074, lng: -0.1478 },
    { lat: 51.5074, lng: -0.1078 },
  ];
  const markers = [];

  markersData.forEach((data, index) => {
    const content = createMarkerContent(data);
    const marker = new woosmap.map.marker.AdvancedMarkerElement({
      position: positions[index],
      map: map,
      content,
      gmpClickable: true,
    });

    marker.addListener("click", () => {
      markers.forEach((m) => {
        m.content.classList.remove("active");
      });
      content.classList.add("active");
    });
    markers.push(marker);
  });
}

initMap();
// [END woosmap_marker_html_css]
