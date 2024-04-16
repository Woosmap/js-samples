// [START woosmap_localities_geocode]
// Initialize and add the map
let map: woosmap.map.Map;
const categories: Set<string> = new Set();
let results: HTMLOListElement;
let nearbyCircle: woosmap.map.Circle;
let marker: woosmap.map.Marker;
let localitiesService: woosmap.map.LocalitiesService;
let request: woosmap.map.localities.LocalitiesAutocompleteRequest;
let debouncedLocalitiesAutocomplete: (...args: any[]) => Promise<any>;
let debouncedNearby: (...args: any[]) => Promise<any>;

function initMap() {
  map = new window.woosmap.map.Map(
    document.getElementById("map") as HTMLElement,
    {
      center: { lat: 44.2601861, lng: -72.5775098 },
      zoom: 15,
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
    },
  );
  localitiesService = new window.woosmap.map.LocalitiesService();

  request = {
    input: "",
    types: ["locality", "address", "postal_code"],
  };

  debouncedLocalitiesAutocomplete = debouncePromise(
    localitiesService.autocomplete,
    0,
  );
  debouncedNearby = debouncePromise(fetch, 500);

  marker = new woosmap.map.Marker({
    position: { lat: 0, lng: 0 },
    icon: {
      url: "https://images.woosmap.com/marker.png",
      scaledSize: {
        height: 50,
        width: 32,
      },
    },
  });

  initUI();
  performNearbyRequest();
}

function initUI() {
  results = document.querySelector("#results") as HTMLOListElement;
  document.querySelectorAll(".category").forEach((el) =>
    el.addEventListener("click", (ev) => {
      const inputElement = ev.target as HTMLInputElement;
      if (inputElement.checked) {
        categories.add(inputElement.value);
      } else {
        categories.delete(inputElement.value);
      }
      performNearbyRequest();
    }),
  );

  document.getElementById("radius")?.addEventListener("input", (e) => {
    const value = parseInt((e.target as HTMLInputElement).value);
    const label = document.getElementById("radius-label");
    if (value < 1000 && label) {
      label.innerHTML = `${value}&thinsp;m`;
    } else if (label) {
      label.innerHTML = `${value / 1000}&thinsp;km`;
    }
    performNearbyRequest();
  });
}

function performNearbyRequest(
  overrideCenter: woosmap.map.LatLng | null = null,
) {
  const requestCenter = overrideCenter ? overrideCenter : map.getCenter();
  const location = `${requestCenter.lat()},${requestCenter.lng()}`;
  const radiusElement = document.getElementById("radius") as HTMLInputElement;
  const radius = radiusElement ? parseInt(radiusElement.value) : 1000;
  let selectedCategories = "";
  if (categories.size > 0) {
    selectedCategories = Array.from(categories).join("|");
  }

  debouncedNearby(
    `//develop-api.woosmap.com/1042/localities/nearby?key=woos-42d7e4d5-41c5-376c-835f-94408ca02a53&types=point_of_interest&location=${location}&radius=${radius}&categories=${selectedCategories}&page_size=10`,
    {
      headers: { Referer: "http://localhost" },
    },
  )
    .then((response) => {
      if (response.status == 200) {
        return response.json();
      }
    })
    .then((responseJson) => {
      drawNearbyZone(requestCenter, radius);
      updateResults(responseJson, requestCenter, radius);
    });
}

function drawNearbyZone(center, radius) {
  if (nearbyCircle) {
    nearbyCircle.setMap(null);
  }
  nearbyCircle = new woosmap.map.Circle({
    map,
    center: center,
    radius: radius,
    strokeColor: "#1165c2",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#3283c5",
    fillOpacity: 0.2,
  });
}

function updateResults(response, center, radius) {
  results.innerHTML = "";
  response["results"].forEach((result) => {
    let addr = "";
    if (result.formatted_address) {
      addr = `<address>${result.formatted_address}</address>`;
    }
    const distance = measure(
      center.lat(),
      center.lng(),
      result.geometry.location.lat,
      result.geometry.location.lng,
    );
    const resultListItem = document.createElement("li");
    resultListItem.innerHTML = `
        <b>${result.name}</b>
        <i>${result.categories}</i>
        ${addr}

        <span class="distance">${distance.toFixed(0)}m</span>
    `;
    resultListItem.addEventListener("click", () => {
      if (result.geometry.viewport) {
        console.log(result);
        map.fitBounds({
          north: result.geometry.viewport.northeast.lat,
          east: result.geometry.viewport.northeast.lng,
          south: result.geometry.viewport.southwest.lat,
          west: result.geometry.viewport.southwest.lng,
        });
      } else {
        map.setCenter({
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
        });
        map.setZoom(18);
      }

      marker.setPosition({
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
      });
      marker.setMap(map);
    });
    results.appendChild(resultListItem);
  });
}

function measure(lat1, lon1, lat2, lon2) {
  // generally used geo measurement function
  const R = 6378.137; // Radius of earth in KM
  const dLat = (lat2 * Math.PI) / 180 - (lat1 * Math.PI) / 180;
  const dLon = (lon2 * Math.PI) / 180 - (lon1 * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d * 1000; // meters
}

const inputElement = document.getElementById(
  "autocomplete-input",
) as HTMLInputElement;
const suggestionsList = document.getElementById(
  "suggestions-list",
) as HTMLUListElement;
const clearSearchBtn = document.getElementsByClassName(
  "clear-searchButton",
)[0] as HTMLButtonElement;
if (inputElement && suggestionsList) {
  inputElement.addEventListener("input", handleAutocomplete);
  inputElement.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const firstLi = suggestionsList.querySelector("li");
      if (firstLi) {
        firstLi.click();
      }
    }
  });
}
clearSearchBtn.addEventListener("click", () => {
  inputElement.value = "";
  suggestionsList.style.display = "none";
  clearSearchBtn.style.display = "none";
  if (marker) {
    marker.setMap(null);
    //infoWindow.close();
  }
  inputElement.focus();
});

function handleAutocomplete(): void {
  if (inputElement && suggestionsList) {
    request.input = inputElement.value;
    if (request.input) {
      debouncedLocalitiesAutocomplete(request)
        .then((localities) => displaySuggestions(localities))
        .catch((error) =>
          console.error("Error autocomplete localities:", error),
        );
    } else {
      suggestionsList.style.display = "none";
      clearSearchBtn.style.display = "none";
    }
  }
}

function handleDetails(publicId: string) {
  localitiesService
    .getDetails({ publicId })
    .then((locality) => displayLocality(locality.result))
    .catch((error) => console.error("Error getting locality details:", error));
}

function displayLocality(
  locality: woosmap.map.localities.LocalitiesDetailsResult,
) {
  if (locality?.geometry) {
    map.flyTo({ center: locality.geometry.location, zoom: 14, duration: 3 });
    performNearbyRequest(new woosmap.map.LatLng(locality.geometry.location));
  }
}

function displaySuggestions(
  localitiesPredictions: woosmap.map.localities.LocalitiesAutocompleteResponse,
) {
  if (inputElement && suggestionsList) {
    suggestionsList.innerHTML = "";
    if (localitiesPredictions.localities.length > 0 && request["input"]) {
      localitiesPredictions.localities.forEach((locality) => {
        const li = document.createElement("li");
        li.textContent = locality.description ?? "";
        li.addEventListener("click", () => {
          inputElement.value = locality.description ?? "";
          suggestionsList.style.display = "none";
          handleDetails(locality.public_id);
        });
        suggestionsList.appendChild(li);
      });
      suggestionsList.style.display = "block";
      clearSearchBtn.style.display = "block";
    } else {
      suggestionsList.style.display = "none";
    }
  }
}

document.addEventListener("click", (event) => {
  const targetElement = event.target as Element;
  const isClickInsideAutocomplete = targetElement.closest(
    "#autocomplete-container",
  );

  if (!isClickInsideAutocomplete && suggestionsList) {
    suggestionsList.style.display = "none";
  }
});

// [START woosmap_localities_autocomplete_debounce_promise]
let PRESERVE_COMMENT_ABOVE; // force tsc to maintain the comment above eslint-disable-line

type DebouncePromiseFunction<T, Args extends any[]> = (
  ...args: Args
) => Promise<T>;

function debouncePromise<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  delay: number,
): DebouncePromiseFunction<T, Args> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let latestResolve: ((value: T | PromiseLike<T>) => void) | null = null;
  let latestReject: ((reason?: any) => void) | null = null;

  return function (...args: Args): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
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

// [END woosmap_localities_autocomplete_debounce_promise] */
PRESERVE_COMMENT_ABOVE; // force tsc to maintain the comment above eslint-disable-line

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
// [END woosmap_localities_geocode]

export {};
