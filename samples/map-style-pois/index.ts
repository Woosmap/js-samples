// [START woosmap_map_style_pois]
function initMap(): void {
  const position: woosmap.map.LatLngLiteral = {
    lat: 51.50393576678564,
    lng: -0.12263034354122525,
  };

  const map = new woosmap.map.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 16,
      center: position,
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
    },
  );
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
// [END woosmap_map_style_pois]

export {};
