const componentsRestriction: woosmap.map.localities.LocalitiesComponentRestrictions =
  { country: [] };
const woosmap_key = import.meta.env.VITE_WOOSMAP_PUBLIC_API_KEY!;
let debouncedAutocomplete: (
  ...args: any[]
) => Promise<woosmap.map.localities.LocalitiesAutocompleteResponse>;
let inputElement: HTMLInputElement;
let suggestionsList: HTMLUListElement;
let clearSearchBtn: HTMLButtonElement;
let map: woosmap.map.Map;
let markerAddress: woosmap.map.Marker;
let detailsHTML: HTMLElement;
let addressDetailsContainer: HTMLElement;
let hasShape = false;

function initMap(): void {
  map = new woosmap.map.Map(document.getElementById("map") as HTMLElement, {
    center: {
      lat: 48.8534,
      lng: 2.3488,
    },
    disableDefaultUI: true,
    gestureHandling: "greedy",
    zoom: 5,
    styles: [
      {
        featureType: "poi",
        stylers: [{ visibility: "off" }],
      },
    ],
  });
  init();
  manageCountrySelector();
}

function createShape(result: woosmap.map.localities.LocalitiesDetailsResult) {
  // @ts-ignore TypeDef to be updated
  if (result?.geometry?.shape) {
    hasShape = true;
    // @ts-ignore TypeDef to be updated
    map.data.addGeoJson({ type: "Feature", geometry: result.geometry.shape });
    if (result.geometry.viewport) {
      const bounds = {
        east: result.geometry.viewport.northeast.lng,
        south: result.geometry.viewport.southwest.lat,
        north: result.geometry.viewport.northeast.lat,
        west: result.geometry.viewport.southwest.lng,
      };
      map.fitBounds(bounds, { top: 60, left: 60, bottom: 60, right: 60 });
    }
  }
}

function createAddressMarker(addressDetail) {
  if (markerAddress) {
    markerAddress.setMap(null);
  }
  if (addressDetail?.geometry) {
    const position = addressDetail.geometry.location;
    markerAddress = new woosmap.map.Marker({
      position: position,
      icon: {
        url: "https://images.woosmap.com/marker.png",
        scaledSize: {
          height: 59,
          width: 37,
        },
      },
    });
    markerAddress.setMap(map);

    // Pan the map to the marker's location
    if (!hasShape) {
      panMap(addressDetail);
    } else {
      hasShape = false;
    }
  }
}

function displaySection(section: HTMLElement, mode = "block"): void {
  section.style.display = mode;
}

function fillAddressDetails(
  addressDetails: woosmap.map.localities.LocalitiesDetailsResult,
) {
  const details: string[] = [];
  detailsHTML.innerHTML = "";
  detailsHTML.style.display = "block";
  if (addressDetails.formatted_address) {
    details.push(
      `<p class='option-detail'><span class='option-detail-label'>Formatted_address :</span><span class='bold'>${addressDetails.formatted_address}</span></p>`,
    );
  }
  if (addressDetails.types && addressDetails.types[0]) {
    details.push(
      `<p class='option-detail'><span class='option-detail-label'>Type : </span><span class='bold'>${addressDetails.types[0].replace("_", " ")}</span></p>`,
    );
  }
  if (addressDetails.geometry) {
    const location_type_string = addressDetails.geometry.accuracy;
    if (location_type_string) {
      details.push(
        `<div class='option-detail'><div><span class='option-detail-label'>Location type :</span><span class='bold'>${location_type_string
          .replace("_", " ")
          .toLowerCase()}</span></div></div>`,
      );
    }
    details.push(
      `<div class='option-detail'><div><span class='option-detail-label'>Latitude :</span> <span class='bold'>${addressDetails.geometry.location.lat.toString()}</span></div><div><span class='option-detail-label'>Longitude : </span><span class='bold'>${addressDetails.geometry.location.lng.toString()}</span></div></div>`,
    );
    if (addressDetails.address_components) {
      const compoHtml = addressDetails.address_components
        .map(
          (compo) =>
            `<p class='option-detail'><span class='option-detail-label'>${compo.types[0]}:</span> <span class='bold'>${compo.long_name}</span></p>`,
        )
        .join("");
      details.push(
        `<div class='address-components'><div class='title'>Address components</div><div>${compoHtml}</div>`,
      );
    }
  }
  detailsHTML.innerHTML = details.join("");
}

function init(): void {
  inputElement = document.getElementById(
    "autocomplete-input",
  ) as HTMLInputElement;
  suggestionsList = document.getElementById(
    "suggestions-list",
  ) as HTMLUListElement;
  clearSearchBtn = document.getElementsByClassName(
    "clear-searchButton",
  )[0] as HTMLButtonElement;
  addressDetailsContainer = document.querySelector(
    ".addressDetails",
  ) as HTMLElement;
  detailsHTML = document.querySelector(
    ".addressDetails .addressOptions",
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
    detailsHTML.style.display = "none";
    inputElement.focus();
    markerAddress.setMap(null);
  });

  debouncedAutocomplete = debouncePromise(autocompleteAddress, 0);
}

function handleAutocomplete(): void {
  if (inputElement && suggestionsList) {
    let input = inputElement.value;
    input = input.replace('"', '\\"').replace(/^\s+|\s+$/g, "");
    const componentsArgs: string = (componentsRestriction.country as string[])
      .map((country) => `country:${country}`)
      .join("|");
    if (input !== "") {
      debouncedAutocomplete(input, componentsArgs, woosmap_key)
        .then(({ localities }) => displaySuggestions(localities))
        .catch((error) =>
          console.error("Error autocomplete localities:", error),
        );
    } else {
      suggestionsList.style.display = "none";
      clearSearchBtn.style.display = "none";
    }
  }
}

function displaySuggestions(
  localitiesPredictions: woosmap.map.localities.LocalitiesPredictions[],
) {
  if (inputElement && suggestionsList) {
    suggestionsList.innerHTML = "";
    if (localitiesPredictions.length > 0) {
      localitiesPredictions.forEach((locality) => {
        const li = document.createElement("li");
        li.innerHTML = formatPredictionList(locality) ?? "";
        li.addEventListener("click", () => {
          inputElement.value = locality.description ?? "";
          requestDetailsAddress(locality.public_id);
          suggestionsList.style.display = "none";
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

function formatPredictionList(locality): string {
  const prediction = locality;
  const predictionClass = "no-viewpoint";
  const matched_substrings = prediction.matched_substrings;
  let formatted_name = "";
  if (
    prediction.matched_substrings &&
    prediction.matched_substrings.description
  ) {
    formatted_name = bold_matched_substring(
      prediction["description"],
      matched_substrings.description,
    );
  } else {
    formatted_name = prediction["description"];
  }

  let html = "";
  html += `<div class="prediction ${predictionClass}">${formatted_name}</div>`;

  return html;
}

function bold_matched_substring(string: string, matched_substrings: string[]) {
  matched_substrings = matched_substrings.reverse();
  for (const substring of matched_substrings) {
    const char = string.substring(
      substring["offset"],
      substring["offset"] + substring["length"],
    );
    string = `${string.substring(
      0,
      substring["offset"],
    )}<span class='bold'>${char}</span>${string.substring(
      substring["offset"] + substring["length"],
    )}`;
  }
  return string;
}

function autocompleteAddress(
  input: string,
  components: string,
): Promise<woosmap.map.localities.LocalitiesAutocompleteResponse> {
  const args = {
    key: woosmap_key,
    input,
    no_deprecated_fields: "true",
    types: "locality|admin_level|country|postal_code",
    components,
  };
  if (components !== "") {
    if (args["components"]) {
      args["components"] = components;
    }
  }
  return fetch(
    `https://api.woosmap.com/localities/autocomplete/?${buildQueryString(args)}`,
  ).then((response) => response.json());
}

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
  if (componentsRestriction.country.length > 0) {
    dropdownText.innerHTML = `Selected countries: <strong>${(componentsRestriction.country as string[]).join("</strong>, <strong>")}</strong>`;
  } else {
    dropdownText.textContent = "Select countries";
  }
}

const requestDetailsAddress = (public_id) => {
  getLocalitiesDetails(public_id).then((addressDetails) => {
    if (addressDetails) {
      fillAddressDetails(addressDetails.result);
      displaySection(addressDetailsContainer);
      createShape(addressDetails.result);
      createAddressMarker(addressDetails.result);
    }
  });
};

function panMap(addressDetail: woosmap.map.localities.LocalitiesDetailsResult) {
  let geometry;
  if (addressDetail && addressDetail.geometry) {
    geometry = addressDetail.geometry;
  }
  if (
    addressDetail &&
    addressDetail.geometry &&
    addressDetail.geometry.viewport
  ) {
    const { viewport } = geometry;
    const bounds = {
      east: viewport.northeast.lng,
      south: viewport.southwest.lat,
      north: viewport.northeast.lat,
      west: viewport.southwest.lng,
    };
    map.fitBounds(bounds, { top: 100, left: 100, bottom: 100, right: 100 });
    map.panTo(addressDetail.geometry.location);
  } else {
    let zoom = 17;
    if (addressDetail.types[0] === "address") {
      zoom = 18;
    }
    map.setZoom(zoom);
    map.panTo(geometry.location);
  }
}

function getLocalitiesDetails(
  publicId: string,
): Promise<woosmap.map.localities.LocalitiesDetailsResponse> {
  const args = {
    key: woosmap_key,
    public_id: publicId,
    fields: "shape|geometry",
  };
  return fetch(
    `https://api.woosmap.com/localities/details/?${buildQueryString(args)}`,
  ).then((response) => response.json());
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;


export {};
