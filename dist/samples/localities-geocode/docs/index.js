// [START woosmap_localities_geocode]
// Initialize and add the map
let map;
let marker;
let infoWindow;
let localitiesService;
const request = {};

function initMap() {
  map = new window.woosmap.map.Map(document.getElementById("map"), {
    center: { lat: 51.50940214, lng: -0.133012 },
    zoom: 12,
  });
  infoWindow = new woosmap.map.InfoWindow({});
  localitiesService = new woosmap.map.LocalitiesService();
  map.addListener("click", (e) => {
    handleGeocode(e.latlng);
  });
}

const inputElement = document.getElementById("autocomplete-input");
const clearSearchBtn = document.getElementsByClassName("clear-searchButton")[0];

if (inputElement) {
  inputElement.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      handleGeocode(null);
    }
  });
  inputElement.addEventListener("input", () => {
    if (inputElement.value !== "") {
      clearSearchBtn.style.display = "block";
    } else {
      clearSearchBtn.style.display = "none";
    }
  });
}

clearSearchBtn.addEventListener("click", () => {
  inputElement.value = "";
  clearSearchBtn.style.display = "none";
  if (marker) {
    marker.setMap(null);
    infoWindow.close();
  }

  inputElement.focus();
});

function handleGeocode(latlng) {
  if (latlng) {
    request.latLng = latlng;
    delete request.address;
  } else if (inputElement?.value !== "") {
    request.address = inputElement.value;
    delete request.latLng;
  }

  if (request.latLng || request.address) {
    localitiesService
      .geocode(request)
      .then((localities) => displayLocality(localities.results[0]))
      .catch((error) => console.error("Error geocoding localities:", error));
  }
}

function displayLocality(locality) {
  if (marker) {
    marker.setMap(null);
    infoWindow.close();
  }

  if (locality?.geometry) {
    marker = new woosmap.map.Marker({
      position: locality.geometry.location,
      icon: {
        url: "https://images.woosmap.com/marker.png",
        scaledSize: {
          height: 50,
          width: 32,
        },
      },
    });
    marker.setMap(map);
    infoWindow.setContent(`<span>${locality.formatted_address}</span>`);
    infoWindow.open(map, marker);
    map.setCenter(locality.geometry.location);
    map.setZoom(14);
  }
}

window.initMap = initMap;
// [END woosmap_localities_geocode]
