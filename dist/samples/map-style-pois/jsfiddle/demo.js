async function initMap() {
  await woosmap.map.importLibrary("maps");

  const position = {
    lat: 51.50393576678564,
    lng: -0.12263034354122525,
  };
  const map = document.getElementById("map").innerMap;

  map.setOptions({
    styles: [
      {
        featureType: "point_of_interest",
        elementType: "all",
        stylers: [
          {
            visibility: "on",
          },
        ],
      },
    ],
  });
  map.moveCamera({
    zoom: 16,
    center: position,
  });
}

initMap();
