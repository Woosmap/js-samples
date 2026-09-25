// [START woosmap_marker_label]
async function initMap(): Promise<void> {
  await woosmap.map.importLibrary("maps");
  await woosmap.map.importLibrary("marker");

  const center: woosmap.map.LatLngLiteral = { lat: 51.52, lng: -0.13 };

  function createMarkerContent(label: string): HTMLElement {
    const container = document.createElement("div");
    container.style.position = "relative";
    container.style.width = "26px";
    container.style.height = "38px";

    const icon = document.createElement("img");
    icon.src = "https://images.woosmap.com/marker-red.svg";
    icon.style.width = "26px";
    icon.style.height = "38px";
    container.appendChild(icon);

    const labelSpan = document.createElement("span");
    labelSpan.textContent = label;
    labelSpan.style.position = "absolute";
    labelSpan.style.left = "14px";
    labelSpan.style.top = "15px";
    labelSpan.style.transform = "translate(-50%, -50%)";
    labelSpan.style.color = "white";
    labelSpan.style.fontSize = "12px";
    labelSpan.style.fontWeight = "bold";
    container.appendChild(labelSpan);

    return container;
  }

  const map = (document.getElementById("map") as woosmap.map.MapElement).innerMap;
  map.moveCamera({
      zoom: 10,
      center: center,
    });

  // [START woosmap_marker_label_add_label]
  let labelNumber = 1;
  new woosmap.map.marker.AdvancedMarkerElement({
    position: map.getCenter(),
    content: createMarkerContent(String(labelNumber)),
    map,
  });
  // [END woosmap_marker_label_add_label]

  map.addListener("click", (e) => {
    labelNumber += 1;
    new woosmap.map.marker.AdvancedMarkerElement({
      position: e.latlng,
      content: createMarkerContent(String(labelNumber)),
      map,
    });
  });
}

initMap();
// [END woosmap_marker_label]
export {};
