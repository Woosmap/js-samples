function initMap() {
  const position = {
    lat: 51.50393576678564,
    lng: -0.12263034354122525,
  };
  const map = new woosmap.map.Map(document.getElementById("map"), {
    zoom: 16,
    center: position,
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
}

window.initMap = initMap;
