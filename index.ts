async function initMap(): Promise<void> {
  await woosmap.map.importLibrary("maps");

  const position: woosmap.map.LatLngLiteral = {
    lat: 51.50393576678564,
    lng: -0.12263034354122525,
  };

  const map = (document.getElementById("map") as woosmap.map.MapElement).innerMap;
  map.setOptions({
      styles: [
        {
        "featureType": "point_of_interest",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    }
    ],
    });
    map.moveCamera({
      zoom: 16,
      center: position,
    });
}

initMap();

export {};
