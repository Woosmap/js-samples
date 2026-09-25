// [START woosmap_distance_isochrone]
let map: woosmap.map.Map;
let methodSelect, modeSelect: HTMLSelectElement;
let distanceInput: HTMLInputElement;
let marker: woosmap.map.marker.AdvancedMarkerElement;
let polyline: woosmap.map.Polyline;
let distanceService: woosmap.map.DistanceService;

const centerLatLng: woosmap.map.LatLngLiteral = {
  lat: 51.5,
  lng: -0.234,
};
function createMarkerContent(): HTMLImageElement {
  const img = document.createElement("img");
  img.src = "https://images.woosmap.com/icons/pin-red.png";
  img.style.width = "26px";
  img.style.height = "38px";
  return img;
}
function createMarker(
  position: woosmap.map.LatLngLiteral,
  map: woosmap.map.Map,
) {
  const marker = new woosmap.map.marker.AdvancedMarkerElement({
    position,
    content: createMarkerContent(),
  });
  marker.setMap(map);
  return marker;
}

async function initMap() {
  await woosmap.map.importLibrary("maps");
  await woosmap.map.importLibrary("marker");

  map = (document.getElementById("map") as woosmap.map.MapElement).innerMap;
  map.moveCamera({
    zoom: 9,
    center: centerLatLng,
  });
  distanceService = new woosmap.map.DistanceService();
  marker = createMarker(centerLatLng, map);
  map.addListener("click", (e) => {
    marker.setMap(null);
    marker = createMarker(e.latlng, map);
    computeIsochrone(e.latlng);
  });
  const onChangeHandler = () => {
    computeIsochrone(marker.position!.toJSON());
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

function computeIsochrone(
  origin: woosmap.map.LatLng | woosmap.map.LatLngLiteral,
) {
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

function fitToCoordinates(
  coordinates: woosmap.map.LatLng[] | woosmap.map.LatLngLiteral[] | null,
) {
  const bounds = new woosmap.map.LatLngBounds();
  if (coordinates) {
    for (const latlng of coordinates) {
      bounds.extend(latlng);
    }
    map.fitBounds(bounds);
  }
}

initMap();
// [END woosmap_distance_isochrone]

export {};
