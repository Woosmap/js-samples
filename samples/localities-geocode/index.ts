// [START woosmap_localities_geocode]
// Initialize and add the map
import LocalitiesGeocodeRequest = woosmap.map.localities.LocalitiesGeocodeRequest;

let map: woosmap.map.Map;
let marker: woosmap.map.Marker;
let infoWindow: woosmap.map.InfoWindow;
let pr_marker: woosmap.map.Marker;
let pr_infoWindow: HTMLElement | null;
let PR_NUMBER = "1216"
let localitiesService: woosmap.map.LocalitiesService;
const request: woosmap.map.localities.LocalitiesGeocodeRequest = {};

function initMap() {
  map = new window.woosmap.map.Map(
    document.getElementById("map") as HTMLElement,
    {
      center: { lat: 43.77751768293183, lng: 11.2553439740075 },
      zoom: 12,
    },
  );
  infoWindow = new woosmap.map.InfoWindow({});
  pr_infoWindow = document.getElementById("instructions")
  localitiesService = new woosmap.map.LocalitiesService();
  map.addListener("click", (e) => {
    handleGeocode(e.latlng);
  });
}

const inputElement = document.getElementById(
  "autocomplete-input",
) as HTMLInputElement;
const clearSearchBtn = document.getElementsByClassName(
  "clear-searchButton",
)[0] as HTMLButtonElement;

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
  if (pr_marker) {
    pr_marker.setMap(null);
  }
  inputElement.focus();
});

function buildQueryString(params: object) {
  const queryStringParts = [];

  for (const key in params) {
    if (params[key]) {
      const value = params[key];
      queryStringParts.push(
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}` as never,
      );
    }
  }
  return queryStringParts.join("&");
}

const pr_reverse_geocode = async (latLng:woosmap.map.LatLngLiteral|woosmap.map.LatLng): Promise<any> => {
  let params = {
    "latlng": `${latLng.lat},${latLng.lng}`,
    "key": "woos-b2f35903-92d8-3a95-9b35-dd503c752a51"
  }
  if(request.components) {
    params["components"] = (request.components.country as string[])
        .map((country) => `country:${country}`)
        .join("|");
  }

  try {
    const response = await fetch(
      `
https://develop-api.woosmap.com/${PR_NUMBER}/localities/geocode?${buildQueryString(params)}`
    );
    return await response.json();
  } catch (error) {
    console.error("Error fetching PR:", error);
    throw error;
  }
};

function handleGeocode(latlng: woosmap.map.LatLngLiteral | null) {
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
    if (request.latLng) {
      pr_reverse_geocode(request.latLng).then((localities) => displayPRLocality(localities.results[0]))
      .catch((error) => console.error("Error geocoding localities:", error));
    }
  }
}

function displayLocality(
  locality: woosmap.map.localities.LocalitiesGeocodeResult | null,
) {
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
    if (map.getZoom() < 14) {
      map.setZoom(14);
    }
  }
}

function displayPRLocality(
  locality: woosmap.map.localities.LocalitiesGeocodeResult | null,
) {
  if (pr_marker) {
    pr_marker.setMap(null);
  }

  if (locality?.geometry) {
    pr_marker = new woosmap.map.Marker({
      position: locality.geometry.location,
      icon: {
        url: "https://images.woosmap.com/marker-red.png",
        scaledSize: {
          height: 50,
          width: 32,
        },
      },
    });
    pr_marker.setMap(map);
    if (pr_infoWindow) {
      pr_infoWindow.textContent = `[PR says] ${locality.formatted_address} (red marker)`;
    }

  }
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
// [END woosmap_localities_geocode]

export {};
