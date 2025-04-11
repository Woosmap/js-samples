// [START woosmap_localities_search_autocomplete]
let map: woosmap.map.Map;
let marker: woosmap.map.Marker;
let infoWindow: woosmap.map.InfoWindow;
let localitiesService: woosmap.map.LocalitiesService;
let debouncedLocalitiesSearch: (...args: any[]) => Promise<any>;
let debouncedLocalitiesAutocomplete: (...args: any[]) => Promise<any>;
let request: woosmap.map.localities.LocalitiesAutocompleteRequest;
let input: string;
let detailsHTML: HTMLElement;
let detailsResultContainer: HTMLElement;


const woosmap_key = "YOUR_API_KEY";
const componentsRestriction: woosmap.map.localities.LocalitiesComponentRestrictions =
  { country: [] };

function initMap(): void {
  map = new window.woosmap.map.Map(
    document.getElementById("map") as HTMLElement,
    {
      center: { lat: 47, lng:7.5 },
      zoom: 5,
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

  request = {
    input: "",
    types: ["address"],
    location: { lat: 47, lng:7.5 },
    components: componentsRestriction
  };

  debouncedLocalitiesSearch = debouncePromise(localitiesService.search, 0);
  debouncedLocalitiesAutocomplete = debouncePromise(localitiesService.autocomplete, 0);
  manageCountrySelector();
}



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
      request.input = inputElement.value;
      const center = map.getCenter();
      const radius = map.getZoom() > 10 ? (map.getZoom() > 14 ? "1000" : "10000") : "100000";
      request.location = center;
      const searchRequest = { radius: radius, ...request};
      searchRequest.types = ['point_of_interest', 'locality', 'postal_code', 'admin_level', 'country'];
      if (request.input) {
      Promise.all([
        debouncedLocalitiesAutocomplete(request),
        debouncedLocalitiesSearch(searchRequest),
      ]).then(([autocompleteResults, searchResults]) => {
          const combinedResults = {autocompleteResults: autocompleteResults, searchResults: searchResults};
          console.log(combinedResults)
          displaySuggestions(combinedResults);
        })
        .catch((error) => {
          console.error("Error autocomplete/search localities:", error);
        });
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

function displaySuggestions(combinedResults: any) {
  if (inputElement && suggestionsList) {
    suggestionsList.innerHTML = "";
    if ((combinedResults.searchResults.results.length > 0 || combinedResults.autocompleteResults.localities.length > 0) && request.input) {
      combinedResults.searchResults.results.forEach((result) => {
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
      if (combinedResults.autocompleteResults.localities.length > 0) {
        combinedResults.autocompleteResults.localities.forEach((result) => {
          const li = document.createElement("li");
          const title = document.createElement("div");
          const desc = document.createElement("span");
          title.textContent = result.description ?? "";
          title.className = "localities-search-title";
          li.addEventListener("click", () => {
            inputElement.value = result.description ?? "";
            suggestionsList.style.display = "none";
            handleDetails(result.public_id);
          });
          suggestionsList.appendChild(li);
          li.appendChild(title);
          title.appendChild(desc);
          const type = document.createElement("span");
          type.textContent = result.types[0];
          type.className = "localities-search-type";
          title.appendChild(type);
        });
      }
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

// [START woosmap_localities_search_autocomplete_debounce_promise]
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

// [END woosmap_localities_search_autocomplete_debounce_promise] */
PRESERVE_COMMENT_ABOVE; // force tsc to maintain the comment above eslint-disable-line

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
// [END woosmap_localities_search_autocomplete]

function manageCountrySelector() {
  const countryElements = document.querySelectorAll(".country");
  countryElements.forEach((countryElement: Element) => {
    countryElement.addEventListener("click", () => {
      toggleCountry(countryElement);
    });
    if (countryElement.classList.contains("active")) {
      const countryCode = (countryElement as HTMLElement).dataset
        .countrycode as string;
      componentsRestriction.country = [
        ...(componentsRestriction.country as string[]),
        countryCode,
      ];
    }
  });

  const dropdownButtons = document.querySelectorAll(
    ".dropdown .dropdown-button",
  );
  dropdownButtons.forEach((button: Element) =>
    button.addEventListener("click", toggleDropdown),
  );

  // Hide dropdowns when clicking outside
  const dropdowns = document.querySelectorAll(".dropdown");
  document.addEventListener("click", (event: Event) => {
    dropdowns.forEach((dropdown: Element) => {
      if (!dropdown.contains(event.target as Node)) {
        hideDropdown(dropdown);
      }
    });
  });
}

function toggleDropdown(event: Event) {
  event.stopPropagation();
  const dropdown = (event.target as Element).closest(".dropdown");
  if (dropdown) {
    if (dropdown.classList.contains("active")) {
      hideDropdown(dropdown);
    } else {
      showDropdown(dropdown);
    }
  }
}

function hideDropdown(dropdown: Element) {
  const dropdownContent = dropdown.querySelector(
    ".dropdown-content",
  ) as HTMLElement;
  dropdownContent?.classList.remove("visible");
  dropdown.classList.remove("active");
}

function showDropdown(dropdown: Element) {
  const dropdownContent = dropdown.querySelector(
    ".dropdown-content",
  ) as HTMLElement;
  dropdownContent?.classList.add("visible");
  dropdown.classList.add("active");
}

function toggleCountry(country: Element) {
  const isActive = country.classList.toggle("active");
  const countryCode = (country as HTMLElement).dataset.countrycode;

  if (countryCode) {
    if (isActive) {
      componentsRestriction.country = [
        ...(componentsRestriction.country as string[]),
        countryCode,
      ];
    } else {
      componentsRestriction.country = (
        componentsRestriction.country as string[]
      ).filter((code) => code !== countryCode);
    }
    updateCountrySelectorText();
    handleAutocomplete();
  }
}

function updateCountrySelectorText() {
  const dropdownText = document.querySelector(
    ".dropdown-button span",
  ) as HTMLElement;
  const inputPlaceholder = document.querySelector("#autocomplete-input") as HTMLInputElement;
  if (componentsRestriction.country.length == 0) {
    dropdownText.textContent = "Select countries";
    inputElement.readOnly = true;
    inputPlaceholder.placeholder = "Select at least one country to proceed."
  }
}

export {};
