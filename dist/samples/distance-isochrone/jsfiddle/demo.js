let map;
let methodSelect, modeSelect;
let distanceInput;
let marker;
let polyline;
let distanceService;
const markerIcon = {
  url: "https://images.woosmap.com/icons/pin-red.png",
  scaledSize: {
    height: 38,
    width: 26,
  },
};
const centerLatLng = {
  lat: 51.5,
  lng: -0.234,
};

function createMarker(position, icon, map) {
  const marker = new window.woosmap.map.Marker({
    position,
    icon,
  });

  marker.setMap(map);
  return marker;
}

function initMap() {
  map = new window.woosmap.map.Map(document.getElementById("map"), {
    zoom: 9,
    center: centerLatLng,
  });
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

  methodSelect = document.getElementById("isochrone-method-select");
  modeSelect = document.getElementById("isochrone-mode-select");
  distanceInput = document.getElementById("isochrone-distance-input");
  methodSelect.addEventListener("change", onChangeHandler);
  modeSelect.addEventListener("change", onChangeHandler);
  distanceInput.addEventListener("change", onChangeHandler);
  computeIsochrone(centerLatLng);
}

function computeIsochrone(origin) {
  if (
    parseInt(distanceInput.value) > 120 ||
    parseInt(distanceInput.value) <= 0
  ) {
    alert("Value should be between 1 and 120");
    return;
  }

  const isochroneRequest = {
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

function displayIsochrone(isochrone) {
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

function fitToCoordinates(coordinates) {
  const bounds = new woosmap.map.LatLngBounds();

  if (coordinates) {
    for (const latlng of coordinates) {
      bounds.extend(latlng);
    }

    map.fitBounds(bounds);
  }
}

window.initMap = initMap;
