// [START woosmap_localities_nearby_poi]
// Initialize and add the map
const woosmap_key = "YOUR_API_KEY";
const categories: Set<string> = new Set();
let map: woosmap.map.Map;
let results: HTMLOListElement;
let nearbyCircle: woosmap.map.Circle;
let marker: woosmap.map.Marker;
let localitiesService: woosmap.map.LocalitiesService;
let request: woosmap.map.localities.LocalitiesAutocompleteRequest;
const nearbyParameters={
    types: "point_of_interest",
    location: "40.71399,-74.00499",
    radius: 1000,
    categories: "",
    page_number: 1,
    page_size: 10
  };
let debouncedLocalitiesAutocomplete: (
  ...args: any[]
) => Promise<woosmap.map.localities.LocalitiesAutocompleteResponse>;
let debouncedNearby: (...args: any[]) => Promise<any>;

function initMap() {
  map = new window.woosmap.map.Map(
    document.getElementById("map") as HTMLElement,
    {
      center: { lat: 40.71399, lng: -74.00499 },
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
    types: ["locality", "postal_code"],
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

  document.getElementById("page-previous")?.addEventListener("click", () => {
    nearbyParameters.page_number--;
    performNearbyRequest(null, false);
  });

  document.getElementById("page-next")?.addEventListener("click", () => {
    nearbyParameters.page_number++;
    performNearbyRequest(null,false);
  });

}

function performNearbyRequest(
  overrideCenter: woosmap.map.LatLng | null = null,
  newQuery:boolean=true
) {
  const requestCenter = overrideCenter ? overrideCenter : map.getCenter();
  const radiusElement = document.getElementById("radius") as HTMLInputElement;
  nearbyParameters.location = `${requestCenter.lat()},${requestCenter.lng()}`;
  nearbyParameters.radius = radiusElement ? parseInt(radiusElement.value) : 1000;
  nearbyParameters.categories = "";
  if (categories.size > 0) {
    nearbyParameters.categories = Array.from(categories).join("|");
  }
  if(newQuery){
    nearbyParameters.page_number=1
  }

  debouncedNearby(
    `//api.woosmap.com/localities/nearby?key=${woosmap_key}&${buildQueryString(nearbyParameters)}`
  )
    .then((response) => {
      if (response.status == 200) {
        return response.json();
      }
    })
    .then((responseJson) => {
      drawNearbyZone(requestCenter, nearbyParameters.radius);
      updateResults(responseJson, requestCenter);
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

function updatePagination(hasNextPage:boolean){
  if(hasNextPage){
    document.getElementById("page-next")?.removeAttribute("disabled")
  }
  else{
    document.getElementById("page-next")?.setAttribute("disabled", "true")
  }
  if(nearbyParameters.page_number > 1){
    document.getElementById("page-previous")?.removeAttribute("disabled")
  }
  else{
    document.getElementById("page-previous")?.setAttribute("disabled", "true")
  }

}

function updateResults(response, center) {
  results.innerHTML = "";

  updatePagination(response["pagination"]["has_next_page"])
  response["results"].forEach((result) => {
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
        
        <span class="distance">${distance.toFixed(0)}m</span>
    `;
    resultListItem.addEventListener("click", () => {
      if (result.geometry.viewport) {
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

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
// [END woosmap_localities_nearby_poi]

export {};
