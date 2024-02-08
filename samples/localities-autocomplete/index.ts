// [START woosmap_localities_autocomplete]
// Initialize and add the map
let map: woosmap.map.Map;
let marker: woosmap.map.Marker;
let infoWindow: woosmap.map.InfoWindow;
let localitiesService: woosmap.map.LocalitiesService;
let request, debouncedLocalitiesAutocomplete;
function initMap() {
  map = new window.woosmap.map.Map(
    document.getElementById("map") as HTMLElement,
    {
      center: { lat: 51.50940214, lng: -0.133012 },
      zoom: 4,
    },
  );
  infoWindow = new woosmap.map.InfoWindow({});
  localitiesService = new window.woosmap.map.LocalitiesService();

  request = {
    types: ["locality", "address", "postal_cde"],
  };

  debouncedLocalitiesAutocomplete = debouncePromise(
    localitiesService.autocomplete,
    0,
  );
}

const inputElement = document.getElementById("autocomplete-input");
const suggestionsList = document.getElementById("suggestions-list");
if (inputElement && suggestionsList) {
  inputElement.addEventListener("input", handleAutocomplete);
  inputElement.addEventListener("keydown", (event) => {
    if (event.keyCode === 13) {
      const firstLi = suggestionsList.querySelector("li");
      if (firstLi) {
        firstLi.click();
      }
    }
  });
}

function handleAutocomplete() {
  if (inputElement && suggestionsList) {
    request["input"] = inputElement["value"];
    if (request["input"]) {
      debouncedLocalitiesAutocomplete(request)
        .then((localities) => displaySuggestions(localities))
        .catch((error) =>
          console.error("Error autocomplete localities:", error),
        );
    } else {
      suggestionsList.style.display = "none";
    }
  }
}

function handleDetails(publicId) {
  localitiesService
    .getDetails({ publicId })
    .then((locality) => displayLocality(locality["result"]))
    .catch((error) => console.error("Error getting locality details:", error));
}

function displayLocality(locality) {
  if (marker) {
    marker.setMap(null);
    infoWindow.close();
  }
  marker = new woosmap.map.Marker({
    position: locality.geometry.location,
    icon: {
      url: "https://images.woosmap.com/dot-marker.png",
      scaledSize: {
        height: 64,
        width: 46,
      },
    },
  });
  marker.setMap(map);
  infoWindow.setContent(`<span>${locality.formatted_address}</span>`);
  infoWindow.open(map, marker);
  map.flyTo({ center: locality.geometry.location, zoom: 14 });
}

function displaySuggestions(localitiesPredictions) {
  if (inputElement && suggestionsList) {
    suggestionsList.innerHTML = "";
    if (localitiesPredictions.localities.length > 0 && request["input"]) {
      localitiesPredictions.localities.forEach((locality) => {
        const li = document.createElement("li");
        li.textContent = locality.description;
        li.addEventListener("click", () => {
          inputElement["value"] = locality.description;
          suggestionsList.style.display = "none";
          handleDetails(locality.public_id);
        });
        suggestionsList.appendChild(li);
      });
      suggestionsList.style.display = "block";
    } else {
      suggestionsList.style.display = "none";
    }
  }
}

document.addEventListener("click", (e) => {
  if (
    e &&
    e.target &&
    !e.target["closest"]("#autocomplete-container") &&
    suggestionsList
  ) {
    suggestionsList.style.display = "none";
  }
});

function debouncePromise(fn, delay) {
  let timeoutId;
  let latestResolve;
  let latestReject;
  return function (...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    return new Promise((resolve, reject) => {
      latestResolve = resolve;
      latestReject = reject;
      timeoutId = setTimeout(() => {
        fn(...args)
          .then((result) => {
            if (latestResolve === resolve && latestReject === reject) {
              resolve(result);
            }
          })
          .catch((error) => {
            if (latestResolve === resolve && latestReject === reject) {
              reject(error);
            }
          });
      }, delay);
    });
  };
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
// [END woosmap_localities_autocomplete]

export {};
