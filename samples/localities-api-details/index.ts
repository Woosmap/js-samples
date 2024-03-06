// [START woosmap_localities_details]
let componentsRestriction: CountryComponent[];
const woosmap_key = "YOUR_API_KEY";
let debouncedAutocomplete: (
  ...args: any[]
) => Promise<woosmap.map.localities.LocalitiesAutocompleteResponse>;
let inputElement, geometry: HTMLInputElement;
let suggestionsList: HTMLUListElement;
let clearSearchBtn: HTMLButtonElement;
let multiSelect, countries, overlayCb: HTMLDivElement;
let map: woosmap.map.Map;
let detailsPublicId: string;
let markerAddress: woosmap.map.Marker;
let detailsHTML, addressDetailsContainer: HTMLElement;
let componentExpanded = false;

interface CountryComponent {
  id: string | undefined;
  text: string | undefined;
}

export const isoCountries = [
  { id: "FR", text: "France" },
  { id: "GB", text: "United Kingdom" },
];
function initMap(): void {
  // [START woosmap_add_map_instantiate_map]
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
  // [END woosmap_add_map_instantiate_map]
}
function resetMap() {
  map.setCenter({
    lat: 48.8534,
    lng: 2.3488,
  });
  map.setZoom(5);
}
function createAddressMarker(
  addressDetail: woosmap.map.localities.LocalitiesDetailsResult,
) {
  if (markerAddress) {
    markerAddress.setMap(null);
  }
  if (addressDetail && addressDetail.geometry) {
    markerAddress = new woosmap.map.Marker({
      position: addressDetail.geometry.location,
      icon: {
        url: "https://www.woosmap.com/images/marker-alt.png",
        scaledSize: {
          height: 59,
          width: 37,
        },
      },
    });
    markerAddress.setMap(map);
    panMap(addressDetail);
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
    geometry.checked = false;
    markerAddress.setMap(null);
    resetMap();
    detailsPublicId = "";
  });

  debouncedAutocomplete = debouncePromise(autocompleteAddress, 0);
}

function handleAutocomplete(): void {
  if (inputElement && suggestionsList) {
    const input = inputElement.value;
    input.replace('"', '\\"').replace(/^\s+|\s+$/g, "");
    const components: string[] = componentsRestriction.map(
      ({ id }) => `country:${id}`,
    );
    const componentsArgs: string = components.join("|");
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
  woosmap_key: string,
): Promise<woosmap.map.localities.LocalitiesAutocompleteResponse> {
  const args = {
    key: woosmap_key,
    input,
    no_deprecated_fields: "true",
    types: "address",
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
function populateCountries() {
  const countryList = isoCountries.map(
    ({ id, text }) =>
      `<div class="country" data-countrycode="${id}" data-countrytext="${text}"><span class="flag-icon flag-icon-${id.toLowerCase()}"></span><span class="flag-text">${text}</span><div class='active-icon-wrapper'></div></div>`,
  );
  countries.innerHTML = countryList.join("");
  countries.insertAdjacentHTML(
    "beforeend",
    "<button id='btnRestrict'>Apply restrictions</button>",
  );
  const $btnRestrictElement = document.querySelector("#btnRestrict");
  if ($btnRestrictElement) {
    $btnRestrictElement.addEventListener("click", (e) => {
      hideCountriesList();
      handleAutocomplete();
    });
  }

  document.querySelectorAll(".country").forEach((country) => {
    country.addEventListener("click", (e) => {
      toggleCountry(country);
    });
  });
  const $countryElement = document.querySelector(".country");
  if ($countryElement) {
    toggleCountry($countryElement);
  }
}
function toggleCountry(country: Element) {
  country.classList.toggle("active");
  componentsRestriction = [];
  document
    .querySelectorAll(".country.active")
    .forEach(
      (element: Element, index: number, nodeList: NodeListOf<Element>) => {
        const dataset = (element as HTMLElement).dataset;
        if (dataset) {
          componentsRestriction.push({
            id: dataset.countrycode,
            text: dataset.countrytext,
          });
        }
      },
    );
  const activeCountryList = componentsRestriction.map(
    ({ id, text }) =>
      `<div class="country"><span class="flag-icon flag-icon-${id && id.toLowerCase()}"></span><span class="flag-text">${text}</span></div>`,
  );
  const $activeRestrictionsElement = document.querySelector(
    "#active-restrictions",
  );
  if ($activeRestrictionsElement) {
    $activeRestrictionsElement.innerHTML =
      activeCountryList.length > 0
        ? activeCountryList.join("")
        : "no active restricions...";
  }
}
function showCountriesList() {
  countries.style.display = "flex";
  overlayCb.style.display = "block";
  componentExpanded = true;
}
function hideCountriesList() {
  countries.style.display = "none";
  overlayCb.style.display = "none";
  componentExpanded = false;
}
function requestDetailsAddress(public_id) {
  detailsPublicId = public_id;
  const fields = [
    ...(document.querySelectorAll(
      'input[name="fields"]:checked',
    ) as NodeListOf<Element>),
  ].map((e) => e["value"]);
  getLocalitiesDetails(public_id, fields.join("|"), woosmap_key).then(
    (addressDetails: woosmap.map.localities.LocalitiesDetailsResponse) => {
      fillAddressDetails(addressDetails.result);
      displaySection(addressDetailsContainer);
      if (addressDetails) {
        createAddressMarker(addressDetails.result);
      }
    },
  );
}
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
    map.fitBounds(bounds);
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
// [START woosmap_w3w_autocomplete_localities_details_promise]
function getLocalitiesDetails(
  publicId: string,
  fields: string,
  woosmap_key: string,
): Promise<woosmap.map.localities.LocalitiesDetailsResponse> {
  const args = {
    key: woosmap_key,
    public_id: publicId,
  };

  if (fields) {
    args["fields"] = fields;
  }
  return fetch(
    `https://api.woosmap.com/localities/details/?${buildQueryString(args)}`,
  ).then((response) => response.json());
}
// [END woosmap_w3w_autocomplete_localities_details_promise]

document.addEventListener("DOMContentLoaded", () => {
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

  multiSelect = document.querySelector(".multiselect") as HTMLDivElement;
  countries = document.getElementById("countries") as HTMLDivElement;
  overlayCb = document.getElementById("bgOverlay") as HTMLDivElement;
  geometry = document.querySelector("input[name='fields']") as HTMLInputElement;
  detailsHTML = document.querySelector(
    ".addressDetails .addressOptions",
  ) as HTMLElement;
  init();
  populateCountries();
  multiSelect.addEventListener(
    "click",
    (e) => {
      if (!componentExpanded) {
        showCountriesList();
      } else {
        hideCountriesList();
      }
      e.stopPropagation();
    },
    true,
  );
  geometry.addEventListener("click", (e) => {
    if (detailsPublicId) {
      requestDetailsAddress(detailsPublicId);
    }
  });
});
declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;

// [END woosmap_localities_details]

export {};
