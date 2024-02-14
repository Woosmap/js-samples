// [START woosmap_distance_isochrone]
let map: woosmap.map.Map;
let methodSelect, modeSelect: HTMLSelectElement;
let distanceInput: HTMLInputElement;
let marker: woosmap.map.Marker;
let polyline: woosmap.map.Polyline;
let distanceService: woosmap.map.DistanceService;

const markerIcon: woosmap.map.Icon = {
  url: "https://images.woosmap.com/icons/pin-red.png",
  scaledSize: {
    height: 38,
    width: 26,
  },
};
const centerLatLng: woosmap.map.LatLngLiteral = {
  lat: 51.5,
  lng: -0.234,
};
function createMarker(
  position: woosmap.map.LatLngLiteral,
  icon: woosmap.map.Icon,
  map: woosmap.map.Map,
) {
  const marker = new window.woosmap.map.Marker({
    position,
    icon,
  });
  marker.setMap(map);
  return marker;
}

function initMap() {
  map = new window.woosmap.map.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 9,
      center: centerLatLng,
    },
  );
  distanceService = new woosmap.map.DistanceService();
  marker = createMarker(centerLatLng, markerIcon, map);
  map.addListener("click", (e) => {
    marker.setMap(null);
    marker = createMarker(e.latlng, markerIcon, map);
    computeIsochrone(e.latlng);
  });
  const onChangeHandler = () => {
    computeIsochrone(marker.getPosition().toJSON());
  };
  methodSelect = document.getElementById(
    "isochrone-method-select",
  ) as HTMLSelectElement;
  modeSelect = document.getElementById(
    "isochrone-mode-select",
  ) as HTMLSelectElement;
  distanceInput = document.getElementById(
    "isochrone-distance-input",
  ) as HTMLInputElement;
  methodSelect.addEventListener("change", onChangeHandler);
  modeSelect.addEventListener("change", onChangeHandler);
  distanceInput.addEventListener("change", onChangeHandler);
  computeIsochrone(centerLatLng);
}

function computeIsochrone(origin: woosmap.map.LatLngLiteral) {
  if (
    parseInt(distanceInput.value) > 120 ||
    parseInt(distanceInput.value) <= 0
  ) {
    alert("Value should be between 1 and 120");
    return;
  }
  const isochroneRequest: woosmap.map.distance.DistanceIsochroneRequest = {
    origin,
    method: methodSelect.value,
    travelMode: modeSelect.value,
    value: parseInt(distanceInput.value),
  };

  distanceService
    .getDistanceIsochrone(isochroneRequest)
    .then(displayIsochrone)
    .catch((error) => {
      console.error(error);
    });
}

function displayIsochrone(
  isochrone: woosmap.map.distance.DistanceIsochroneResponse,
) {
  if (polyline) {
    polyline.setMap(null);
  }
  polyline = new woosmap.map.Polyline({
    path: isochrone.isoline.path || null,
    strokeColor: "#b71c1c",
    strokeOpacity: 0.8,
    strokeWeight: 4,
  });
  polyline.setMap(map);
  fitToCoordinates(isochrone.isoline.path || null);
}

function fitToCoordinates(coordinates: woosmap.map.LatLng[] | null) {
  const bounds = new woosmap.map.LatLngBounds();
  if (coordinates) {
    for (const latlng of coordinates) {
      bounds.extend(latlng);
    }
    map.fitBounds(bounds);
  }
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
// [END woosmap_distance_isochrone]

export {};
