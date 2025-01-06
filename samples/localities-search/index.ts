// [START woosmap_localities_search]
let map: woosmap.map.Map;
let marker: woosmap.map.Marker;
let infoWindow: woosmap.map.InfoWindow;
let localitiesService: woosmap.map.LocalitiesService;
let debouncedLocalitiesSearch: (...args: any[]) => Promise<any>;
let input: string;
let detailsHTML: HTMLElement;
let addressDetailsContainer: HTMLElement;

// @ts-nocheck
function initMap(): void {
  map = new window.woosmap.map.Map(
    document.getElementById("map") as HTMLElement,
    {
      center: { lat: 51.507445, lng: -0.127765 },
      zoom: 8,
    }
  );
  infoWindow = new woosmap.map.InfoWindow({});
  localitiesService = new window.woosmap.map.LocalitiesService();

  debouncedLocalitiesSearch = debouncePromise(fetchLocalitiesSearch, 0);
}

const fetchLocalitiesSearch = async (input: any): Promise<any> => {
  const center = map.getCenter();
  const radius = (map.getZoom() > 10) ? "10000" : "100000"
  try {
    const response = await fetch(
      `
https://api.woosmap.com/localities/search?types=point_of_interest|locality|admin_level|postal_code|address&input=${encodeURIComponent(input)}&location=${center.lat()},${center.lng()}&radius=100000&key=woos-f3399eaa-1f01-33cd-a0db-ce1e23b7320d&components=country%3Agb`
    );
    return await response.json();
  } catch (error) {
    console.error("Error fetching localities:", error);
    throw error;
  }
};

function fillAddressDetails(
  addressDetails: woosmap.map.localities.LocalitiesDetailsResult
) {
  const details: string[] = [];
  detailsHTML.innerHTML = "";
  detailsHTML.style.display = "block";
  if (addressDetails.formatted_address) {
    details.push(
      `<p class='option-detail'><span class='option-detail-label'>Formatted_address:</span><span class='bold'>${addressDetails.formatted_address}</span></p>`
    );
  } else if (addressDetails.name)
    details.push(
      `<p class='option-detail'><span class='option-detail-label'>Name:</span><span class='bold'>${addressDetails.name}</span></p>`
    );
  if (addressDetails.types && addressDetails.types[0]) {
    details.push(
      `<p class='option-detail'><span class='option-detail-label'>Type: </span><span class='bold'>${addressDetails.types[0]}</span></p>`
    );
  }
  if (addressDetails.categories)
    details.push(
      `<p class='option-detail'><span class='option-detail-label'>Categories:</span><span class='bold'>${addressDetails.categories[0]}</span></p>`
    );
  if (addressDetails.geometry) {
    details.push(
      `<div class='option-detail'><div><span class='option-detail-label'>Latitude:</span> <span class='bold'>${addressDetails.geometry.location.lat.toString()}</span></div><div><span class='option-detail-label'>Longitude: </span><span class='bold'>${addressDetails.geometry.location.lng.toString()}</span></div></div>`
    );
    if (addressDetails.address_components) {
      const compoHtml = addressDetails.address_components
        .map(
          (compo) =>
            `<p class='option-detail'><span class='option-detail-label'>${compo.types.find((item) => item.includes("division")) || compo.types[0]}:</span> <span class='bold'>${compo.long_name}</span></p>`
        )
        .join("");
      details.push(
        `<div class='address-components'><div class='title'>Address components</div><div>${compoHtml}</div>`
      );
    }
  }
  detailsHTML.innerHTML = details.join("");
}

const inputElement = document.getElementById(
  "autocomplete-input"
) as HTMLInputElement;
const suggestionsList = document.getElementById(
  "suggestions-list"
) as HTMLUListElement;
const clearSearchBtn = document.getElementsByClassName(
  "clear-searchButton"
)[0] as HTMLButtonElement;
addressDetailsContainer = document.querySelector(
  ".addressDetails"
) as HTMLElement;
detailsHTML = document.querySelector(
  ".addressDetails .addressOptions"
) as HTMLElement;
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
    infoWindow.close();
  }
  inputElement.focus();
});

function handleAutocomplete(): void {
  if (inputElement && suggestionsList) {
    input = inputElement.value;
    if (input) {
      debouncedLocalitiesSearch(input)
        .then((localities) => displaySuggestions(localities))
        .catch((error) =>
          console.error("Error autocomplete localities:", error)
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

function displaySection(section: HTMLElement, mode = "block"): void {
  section.style.display = mode;
}

function displayLocality(
  locality: woosmap.map.localities.LocalitiesDetailsResult
) {
  fillAddressDetails(locality);
  displaySection(addressDetailsContainer);
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
    infoWindow.setContent(
      `<span>${locality.formatted_address ?? locality.name}</span>`
    );
    infoWindow.open(map, marker);
    map.flyTo({ center: locality.geometry.location, zoom: 14 });
  }
}

function displaySuggestions(localitiesPredictions: any) {
  console.log("localitiesPredictions: ", localitiesPredictions);
  if (inputElement && suggestionsList) {
    suggestionsList.innerHTML = "";
    if (localitiesPredictions.results.length > 0 && input) {
      localitiesPredictions.results.forEach((locality) => {
        const li = document.createElement("li");
        const title = document.createElement("div");
        const desc = document.createElement("span");
        title.textContent = locality.title ?? "";
        title.className = "localities-search-title";
        desc.textContent = locality.description ?? "";
        desc.className = "localities-search-description";
        li.addEventListener("click", () => {
          inputElement.value = locality.title ?? "";
          suggestionsList.style.display = "none";
          handleDetails(locality.public_id);
        });
        suggestionsList.appendChild(li);
        li.appendChild(title);
        title.appendChild(desc);
        if (locality.categories) {
          const category = document.createElement("span");
          category.textContent = locality.categories[0];
          category.className = "localities-search-category";
          title.appendChild(category);
        } else {
          const type = document.createElement("span");
          type.textContent = locality.types[0];
          type.className = "localities-search-type";
          title.appendChild(type);
        }
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
    "#autocomplete-container"
  );

  if (!isClickInsideAutocomplete && suggestionsList) {
    suggestionsList.style.display = "none";
  }
});

// [START woosmap_localities_search_debounce_promise]
let PRESERVE_COMMENT_ABOVE; // force tsc to maintain the comment above eslint-disable-line

type DebouncePromiseFunction<T, Args extends any[]> = (
  ...args: Args
) => Promise<T>;

function debouncePromise<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  delay: number
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

// [END woosmap_localities_search_debounce_promise] */
PRESERVE_COMMENT_ABOVE; // force tsc to maintain the comment above eslint-disable-line

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
// [END woosmap_localities_search]

export {};
