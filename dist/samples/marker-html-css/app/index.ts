interface MarkerData {
  price: string;
}

async function initMap(): Promise<void> {
  await woosmap.map.importLibrary("maps");
  await woosmap.map.importLibrary("marker");

  function createMarkerContent(data: MarkerData): HTMLDivElement {
    const div = document.createElement("div");
    div.className = "popover";
    div.innerHTML = `<div class="popover-content">
                      <span class="icon">️</span>
                      <span class="price">${data.price}</span>
                    </div>
                     <div class="popover-arrow-shadow"></div>
                     <div class="popover-arrow"></div>`;
    return div;
  }

  const center: woosmap.map.LatLngLiteral = { lat: 51.5074, lng: -0.1278 };

  const map = (document.getElementById("map") as woosmap.map.MapElement).innerMap;
  map.moveCamera({
      zoom: 13,
      center: center,
    });

  const markersData: MarkerData[] = [
    { price: "100 €" },
    { price: "200 €" },
    { price: "300 €" },
    { price: "400 €" },
    { price: "500 €" },
  ];

  const positions: woosmap.map.LatLngLiteral[] = [
    { lat: 51.5074, lng: -0.1278 },
    { lat: 51.5174, lng: -0.1378 },
    { lat: 51.4974, lng: -0.1178 },
    { lat: 51.5074, lng: -0.1478 },
    { lat: 51.5074, lng: -0.1078 },
  ];

  const markers: woosmap.map.marker.AdvancedMarkerElement[] = [];

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
        (m.content as HTMLDivElement).classList.remove("active");
      });
      content.classList.add("active");
    });

    markers.push(marker);
  });
}

initMap();
export {};
