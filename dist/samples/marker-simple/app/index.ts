async function initMap(): Promise<void> {
  await woosmap.map.importLibrary("maps");
  await woosmap.map.importLibrary("marker");

  const center: woosmap.map.LatLngLiteral = { lat: 51.52, lng: -0.13 };

  const map = (document.getElementById("map") as woosmap.map.MapElement)
    .innerMap;
  map.moveCamera({
    zoom: 13,
    center: center,
  });

  const { PinElement } = woosmap.map.marker;
  const pin = new PinElement({
    background: "#5588FF",
    borderColor: "#3D6FE0",
    glyphColor: "#FFFFFF",
  });

  const marker = new woosmap.map.marker.AdvancedMarkerElement({
    position: map.getCenter(),
    content: pin.element,
  });
  marker.setMap(map);
}

initMap();
export {};
