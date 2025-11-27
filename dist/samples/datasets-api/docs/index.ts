// [START woosmap_datasets_api]
// Initialize and add the map
let map: woosmap.map.Map;
let drawTools: woosmap.map.Drawing;
let datasetsOverlay: woosmap.map.DatasetsOverlay;
let datasetsService: woosmap.map.DatasetsService;
let localitiesService: woosmap.map.LocalitiesService;
let request: woosmap.map.localities.LocalitiesAutocompleteRequest;
let inputElement: HTMLInputElement;
let suggestionsList: HTMLUListElement;
let clearSearchBtn: HTMLButtonElement;
let datasetSelect: HTMLSelectElement;
let operatorSelect: HTMLSelectElement;
let debouncedLocalitiesAutocomplete: (...args: any[]) => Promise<any>;
let results: HTMLOListElement;
let resetButton: HTMLButtonElement;

const datasetId = "fd2732a6-714d-4894-98ef-c0c7744a399c"; //US - Seismic Hazard Map

function initMap(): void {
  // [START woosmap_datasets_api_instantiate_map]

  map = new woosmap.map.Map(document.getElementById("map") as HTMLElement, {
    gestureHandling: "auto",
    defaultStyle: "streets",
  });
  map.fitBounds({
    east: -66.93457,
    north: 49.384358,
    south: 24.396308,
    west: -125.00165,
  });
  initDrawing();
  initServices();
  initUIElements();
  manageFiltersElements();
  // [END woosmap_datasets_api_instantiate_map]
}
function initServices(): void {
  datasetsOverlay = new woosmap.map.DatasetsOverlay(datasetId);
  datasetsService = new woosmap.map.DatasetsService(datasetId);
  datasetsOverlay.setMap(map);

  localitiesService = new window.woosmap.map.LocalitiesService();
  request = {
    input: "",
    types: ["locality", "address", "postal_code"],
  };
  debouncedLocalitiesAutocomplete = debouncePromise(
    localitiesService.autocomplete,
    0,
  );
  initAutoComplete();
}
function initDrawing(): void {
  drawTools = new woosmap.map.Drawing({
    controls: {
      combine_features: false,
      uncombine_features: false,
    },
  });
  drawTools.addControl(map);
  drawTools.addListener("draw.create", async (ev) => {
    const collection = drawTools.getAll();
    if (collection.features.length > 1) {
      for (const feature of collection.features.slice(0, -1)) {
        if (feature && feature.id) {
          drawTools.delete(feature.id.toString());
        }
      }
    }
    await intersectCb(drawTools.getAll());
  });
  drawTools.addListener("draw.delete", () => {
    map.data.forEach((feature) => {
      map.data.remove(feature);
    });
    results.innerHTML = "";
  });
  drawTools.addListener("draw.update", async (ev) => {
    await intersectCb(ev);
  });
}
function initAutoComplete(): void {
  inputElement = document.getElementById(
    "autocomplete-input",
  ) as HTMLInputElement;
  suggestionsList = document.getElementById(
    "suggestions-list",
  ) as HTMLUListElement;
  clearSearchBtn = document.getElementsByClassName(
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
    results.innerHTML = "";
    inputElement.focus();
  });
}
function initUIElements(): void {
  results = document.querySelector("#results") as HTMLOListElement;
  resetButton = document.getElementById("btnReset") as HTMLButtonElement;
  resetButton.onclick = function () {
    resetElements();
  };
}
function resetElements(): void {
  datasetsOverlay.setMap(null);
  datasetsOverlay = new woosmap.map.DatasetsOverlay(datasetId);
  datasetsService = new woosmap.map.DatasetsService(datasetId);
  datasetsOverlay.setMap(map);
  map.flyTo({ center: { lat: 38, lng: -99 } });
  datasetSelect.selectedIndex = 2;
  operatorSelect.selectedIndex = 0;
  drawTools.deleteAll();
  map.data.forEach((feature) => {
    map.data.remove(feature);
  });
  inputElement.value = "";
  suggestionsList.style.display = "none";
  clearSearchBtn.style.display = "none";
  results.innerHTML = "";
}
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
    map.flyTo({ center: locality.geometry.location });

    const feature: woosmap.map.GeoJSONFeature = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [
          locality.geometry.location.lng,
          locality.geometry.location.lat,
        ],
      },
      properties: {},
    };
    drawTools.add(feature);

    intersectCb({
      features: [feature],
    });
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
function manageFiltersElements() {
  datasetSelect = document.getElementById("dataset") as HTMLSelectElement;
  operatorSelect = document.getElementById("operator") as HTMLSelectElement;
  datasetSelect.addEventListener("change", (event) => {
    const selectElement = event.target as HTMLSelectElement;
    updateDataset(selectElement.value);
  });
  operatorSelect.addEventListener("change", async (ev) => {
    const collection = drawTools.getAll();
    await intersectCb(collection);
  });
}
async function updateDataset(datasetId: string) {
  datasetsOverlay.setMap(null);
  datasetsOverlay = new woosmap.map.DatasetsOverlay(datasetId);
  datasetsService = new woosmap.map.DatasetsService(datasetId);
  datasetsOverlay.setMap(map);
  const collection = drawTools.getAll();
  await intersectCb(collection);
}
async function intersectCb(ev) {
  async function applyOperator(geometry, operator) {
    let response;

    switch (operator) {
      case "intersects":
        response = await datasetsService.intersects({ geometry });
        break;
      case "within":
        response = await datasetsService.within({ geometry });
        break;
      case "contains":
        response = await datasetsService.contains({ geometry });
        break;
    }

    return response;
  }

  await applyOperator(ev.features[0].geometry, operatorSelect.value)
    .then((response) => {
      const features = [];
      bindResultsToPanel(response.features);
      map.data.forEach((feature) => {
        map.data.remove(feature);
      });
      for (const feature of response.features) {
        // @ts-ignore TypeDef to be updated
        features.push({
          type: "Feature",
          geometry: feature.geometry,
        });
      }

      map.data.addGeoJson({
        type: "FeatureCollection",
        features: features,
      });
    })
    .catch((error) => {
      results.innerHTML = error;
      results.classList.add("error");
    });
}
function bindResultsToPanel(features: woosmap.map.GeoJSONFeature[]) {
  results.innerHTML = "";
  if (features.length > 0) {
    features.map((feature) => {
      const attributes = feature["attributes"];
      const resultListItem = document.createElement("table");
      results.classList.remove("error");
      resultListItem.classList.add("result");
      Object.keys(attributes).map((key) => {
        if (attributes[key]) {
          resultListItem.innerHTML =
            resultListItem.innerHTML +
            `<tr><td><b>${key} </b></td><td>${attributes[key]}</td></tr>`;
        }
      }),
        results.appendChild(resultListItem);
    });
  } else {
    results.innerHTML = "No results found";
    results.classList.add("error");
  }
}
// [START woosmap_localities_autocomplete_debounce_promise]

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

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
// [END woosmap_datasets_api]

export {};
