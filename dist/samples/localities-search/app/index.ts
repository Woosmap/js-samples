let map: woosmap.map.Map;
let marker: woosmap.map.Marker;
let infoWindow: woosmap.map.InfoWindow;
let localitiesService: woosmap.map.LocalitiesService;
let debouncedLocalitiesSearch: (...args: any[]) => Promise<any>;
let input: string;
let detailsHTML: HTMLElement;
let detailsResultContainer: HTMLElement;

const woosmap_key = import.meta.env.VITE_WOOSMAP_PUBLIC_API_KEY!;

function initMap(): void {
  map = new window.woosmap.map.Map(
    document.getElementById("map") as HTMLElement,
    {
      center: { lat: 51.507445, lng: -0.127765 },
      zoom: 8,
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
    }
  );
  infoWindow = new woosmap.map.InfoWindow({});
  localitiesService = new window.woosmap.map.LocalitiesService();

  debouncedLocalitiesSearch = debouncePromise(fetchLocalitiesSearch, 0);
}

const fetchLocalitiesSearch = async (input: any): Promise<any> => {
  const center = map.getCenter();
  const radius = map.getZoom() > 10 ? (map.getZoom() > 14 ? "1000" : "10000") : "100000";
  try {
    const response = await fetch(
      `
https://api.woosmap.com/localities/search?types=point_of_interest|locality|admin_level|postal_code|address&input=${encodeURIComponent(input)}&location=${center.lat()},${center.lng()}&radius=${radius}&key=${woosmap_key}&components=country%3Agb`
    );
    return await response.json();
  } catch (error) {
    console.error("Error fetching localities:", error);
    throw error;
  }
};

function fillDetailsResult(detailsResult: any) {
  const details: string[] = [];
  detailsHTML.innerHTML = "";
  detailsHTML.style.display = "block";
  if (detailsResult.formatted_address) {
    details.push(
      `<p class='option-detail'><span class='option-detail-label'>Formatted_address:</span><span class='bold'>${detailsResult.formatted_address}</span></p>`
    );
  } else if (detailsResult.name)
    details.push(
      `<p class='option-detail'><span class='option-detail-label'>Name:</span><span class='bold'>${detailsResult.name}</span></p>`
    );
  if (detailsResult.types && detailsResult.types[0]) {
    details.push(
      `<p class='option-detail'><span class='option-detail-label'>Type: </span><span class='bold'>${detailsResult.types[0]}</span></p>`
    );
  }
  if (detailsResult.categories)
    details.push(
      `<p class='option-detail'><span class='option-detail-label'>Categories:</span><span class='bold'>${detailsResult.categories[0]}</span></p>`
    );
  if (detailsResult.geometry) {
    details.push(
      `<div class='option-detail'><div><span class='option-detail-label'>Latitude:</span> <span class='bold'>${detailsResult.geometry.location.lat.toFixed(5).toString()}</span></div><div><span class='option-detail-label'>Longitude: </span><span class='bold'>${detailsResult.geometry.location.lng.toFixed(5).toString()}</span></div></div>`
    );
    if (detailsResult.address_components) {
      const compoHtml = detailsResult.address_components
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
detailsResultContainer = document.querySelector(
  ".detailsResult"
) as HTMLElement;
detailsHTML = document.querySelector(
  ".detailsResult .detailsOptions"
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
        .then((results) => displaySuggestions(results))
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
    .then((response) => displayResult(response.result))
    .catch((error) => console.error("Error getting locality details:", error));
}

function displaySection(section: HTMLElement, mode = "block"): void {
  section.style.display = mode;
}

function displayResult(result: woosmap.map.localities.LocalitiesDetailsResult) {
  fillDetailsResult(result);
  displaySection(detailsResultContainer);
  if (marker) {
    marker.setMap(null);
    infoWindow.close();
  }
  if (result?.geometry) {
    marker = new woosmap.map.Marker({
      position: result.geometry.location,
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
      `<span>${result.formatted_address ?? result.name}</span>`
    );
    infoWindow.open(map, marker);
    map.flyTo({ center: result.geometry.location, zoom: 14 });
  }
}

function displaySuggestions(localitiesPredictions: any) {
  if (inputElement && suggestionsList) {
    suggestionsList.innerHTML = "";
    if (localitiesPredictions.results.length > 0 && input) {
      localitiesPredictions.results.forEach((result) => {
        const li = document.createElement("li");
        const title = document.createElement("div");
        const desc = document.createElement("span");
        title.textContent = result.title ?? "";
        title.className = "localities-search-title";
        desc.textContent = result.description ?? "";
        desc.className = "localities-search-description";
        li.addEventListener("click", () => {
          inputElement.value = result.title ?? "";
          suggestionsList.style.display = "none";
          handleDetails(result.public_id);
        });
        suggestionsList.appendChild(li);
        li.appendChild(title);
        title.appendChild(desc);
        if (result.categories) {
          const category = document.createElement("span");
          category.textContent = result.categories[0];
          category.className = "localities-search-category";
          title.appendChild(category);
        } else {
          const type = document.createElement("span");
          type.textContent = result.types[0];
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


declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;

export {};
