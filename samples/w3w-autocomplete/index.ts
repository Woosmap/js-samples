// [START woosmap_w3w_autocomplete]
let selectedAddress: HTMLElement | null;
let addressDetailsContainer: HTMLElement;
let addressListContainer: HTMLElement;
let addressList: HTMLElement;
let subBuildingListContainer: HTMLElement;
let subBuildingList: HTMLElement;
let allResultsContainer: HTMLElement;
let resultsContainer: HTMLElement;
let autoSuggestResultsTitle: HTMLElement;
let results: HTMLElement;
let inputElement: HTMLInputElement;
let detailsHTML: HTMLElement;
let clearSearchBtn: HTMLButtonElement;
let map: woosmap.map.Map;
let marker: woosmap.map.Marker;
let debouncedAutosuggestW3W: (
  ...args: any[]
) => Promise<What3WordsSuggestionsResponse>;

const API_KEY = "YOUR_API_KEY"; // Replace YOUR_API_KEY with your actual API key

interface What3WordsSuggestionsResponse {
  suggestions: What3WordsSuggestion[];
}

interface What3WordsSuggestion {
  country: string;
  distanceToFocusKm: number | null;
  language: string;
  nearestPlace: string;
  rank: number;
  words: string;
}

interface What3WordsAddressesResponse {
  results: What3WordsAddress[];
}

interface What3WordsAddress {
  description: string;
  public_id: string;
  status: string | null;
  sub_buildings:
    | {
        description: string;
        public_id: string;
      }[]
    | null;
  types: string[];
}

function convertToAddress(words: string): Promise<What3WordsAddressesResponse> {
  return fetch(
    `https://api.woosmap.com/what3words/convert-to-address?key=${API_KEY}&words=${words}`,
  ).then((response) => response.json());
}

function getLocalitiesDetails(
  publicId: string,
): Promise<woosmap.map.localities.LocalitiesDetailsResponse> {
  return fetch(
    `https://api.woosmap.com/localities/details/?key=${API_KEY}&public_id=${publicId}`,
  ).then((response) => response.json());
}

function autosuggestW3W(input: string): Promise<What3WordsSuggestionsResponse> {
  return fetch(
    `https://api.woosmap.com/what3words/autosuggest?key=${API_KEY}&input=${input}`,
  ).then((response) => response.json());
}

function clearSection(section: HTMLElement): void {
  section.innerHTML = "";
}

function hideSection(section: HTMLElement): void {
  section.style.display = "none";
}

function displaySection(section: HTMLElement, mode = "block"): void {
  section.style.display = mode;
}

function setSelectedAddress(selectedElement: HTMLElement): void {
  if (selectedAddress) {
    selectedAddress.classList.remove("selected");
  }
  selectedAddress = selectedElement;
  selectedAddress.classList.add("selected");
}

function panMap(addressDetail) {
  if (addressDetail.geometry.viewport) {
    const { viewport } = addressDetail.geometry;
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
    map.panTo(addressDetail.geometry.location);
  }
}

function createAddressMarker(addressDetail) {
  if (marker) {
    marker.setMap(null);
  }
  marker = new woosmap.map.Marker({
    position: addressDetail.geometry.location,
    icon: {
      url: "https://www.woosmap.com/images/marker-alt.png",
      scaledSize: {
        height: 59,
        width: 37,
      },
    },
  });
  marker.setMap(map);
  panMap(addressDetail);
}

function fillAddressDetails(
  addressDetails: woosmap.map.localities.LocalitiesDetailsResult,
) {
  const details: string[] = [];
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

function getAddressDetails(target, publicId) {
  setSelectedAddress(target);
  getLocalitiesDetails(publicId)
    .then((detailResponse) => {
      const addressDetails = detailResponse.result;
      if (addressDetails) {
        createAddressMarker(addressDetails);
        fillAddressDetails(addressDetails);
        displaySection(addressDetailsContainer);
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function displaySubBuildings(target: HTMLElement, subBuildings) {
  setSelectedAddress(target);
  hideSection(addressListContainer);
  clearSection(subBuildingList);
  displaySection(subBuildingListContainer);
  displaySection(autoSuggestResultsTitle);
  const addressList = document.createElement("ul");

  subBuildings.forEach((address, index) => {
    const line = document.createElement("li");
    line.className = "address";
    line.addEventListener("click", (event) => {
      getAddressDetails(line, address.public_id);
    });
    line.innerHTML = `<span class='pin'></span><span>${address.description}</span>`;
    addressList.appendChild(line);
  });

  subBuildingList.appendChild(addressList);
}

function backToAddressList() {
  hideSection(autoSuggestResultsTitle);
  hideSection(subBuildingListContainer);
  hideSection(addressDetailsContainer);
  displaySection(addressListContainer);
}

function displayAddressList(addressDetails) {
  backToAddressList();
  const addressListContainer = addressList;
  const newAddressList = document.createElement("ul");
  const fragment = document.createDocumentFragment();

  if (!Array.isArray(addressDetails) || addressDetails.length === 0) {
    const line = document.createElement("li");
    line.className = "not-found";
    line.textContent =
      "what3words address invalid or no street address found within 200m of its location.";
    newAddressList.appendChild(line);
  } else {
    addressDetails.forEach((address, index) => {
      const line = document.createElement("li");
      line.className = "address";
      line.addEventListener("click", (event) => {
        if (address.public_id) {
          getAddressDetails(line, address.public_id);
        } else {
          displaySubBuildings(line, address.sub_buildings);
        }
      });
      line.innerHTML = `<span class='${
        address.public_id ? "pin" : "arrow"
      }'></span><span>${address.description}</span>`;
      fragment.appendChild(line);
    });
  }
  newAddressList.appendChild(fragment);
  addressListContainer.appendChild(newAddressList);
}

function getPossibleAddress(words: string) {
  hideSection(resultsContainer);
  displaySection(addressListContainer);
  hideSection(addressDetailsContainer);
  clearSection(addressList);
  convertToAddress(words)
    .then(({ results }) => {
      if (results) {
        displayAddressList(results);
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function w3wClickCallback(suggestion: What3WordsSuggestion): void {
  (document.querySelector(".words") as HTMLElement).innerHTML =
    suggestion.words;
  (document.querySelector(".nearest") as HTMLElement).innerHTML =
    `Nearest place : ${suggestion.nearestPlace}`;
  (inputElement as HTMLInputElement).value = `///${suggestion.words}`;
  getPossibleAddress(suggestion.words);
}

function displayW3wSuggestion() {
  const value = inputElement.value;
  if (value) {
    displaySection(clearSearchBtn);
  }
  value.replace('"', '\\"').replace(/^\s+|\s+$/g, "");
  hideSection(autoSuggestResultsTitle);
  if ((value.match(/[.]/g) || []).length !== 2) {
    hideSection(resultsContainer);
    hideSection(addressListContainer);
    hideSection(subBuildingListContainer);
    return;
  }

  displaySection(allResultsContainer);
  hideSection(addressListContainer);
  hideSection(subBuildingListContainer);
  hideSection(addressDetailsContainer);

  debouncedAutosuggestW3W(value)
    .then(({ suggestions }) => {
      clearSection(results);
      const list = document.createElement("ul");
      if (suggestions) {
        suggestions.forEach((suggestion) => {
          const item = document.createElement("li");
          item.className = "suggestion";
          item.id = suggestion.rank.toString();
          item.innerHTML = `<div class="words">${suggestion.words}</div><div class="nearest">Nearest place : ${suggestion.nearestPlace}</div>`;
          item.dataset.word = suggestion.words;
          item.onclick = () => {
            w3wClickCallback(suggestion);
          };
          list.appendChild(item);
        });
        results.appendChild(list);
      } else {
        const failed = document.createElement("div");
        failed.innerHTML = "Failed to load suggestions";
        results.appendChild(failed);
      }

      displaySection(resultsContainer, "flex");
    })
    .catch((error) => {
      console.error(error);
    });
}

function initMap() {
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
  debouncedAutosuggestW3W = debouncePromise(autosuggestW3W, 0);
  initUI();
}

function resetUI() {
  hideSection(resultsContainer);
  hideSection(addressListContainer);
  hideSection(subBuildingListContainer);
  hideSection(addressDetailsContainer);
  hideSection(clearSearchBtn);
  hideSection(allResultsContainer);
  clearSection(addressList);
  clearSection(subBuildingList);
  clearSection(detailsHTML);
  inputElement.value = "";
  if (marker) {
    marker.setMap(null);
  }
  inputElement.focus();
}

function initUI() {
  inputElement = document.getElementById(
    "autocomplete-input",
  ) as HTMLInputElement;
  addressDetailsContainer = document.querySelector(
    ".addressDetails",
  ) as HTMLElement;
  addressListContainer = document.querySelector(
    ".address-list-container",
  ) as HTMLElement;
  addressList = document.getElementById("address-suggestions") as HTMLElement;
  subBuildingListContainer = document.getElementById(
    "sub-building-suggestions",
  ) as HTMLElement;
  subBuildingList = document.getElementById(
    "sub-building-suggestions",
  ) as HTMLElement;
  allResultsContainer = document.getElementById(
    "all-results-container",
  ) as HTMLElement;
  resultsContainer = document.querySelector(
    ".autosuggest-results-container",
  ) as HTMLElement;
  autoSuggestResultsTitle = document.querySelector(
    ".sub-building-list-container .autosuggest-results-title",
  ) as HTMLElement;
  detailsHTML = document.querySelector(
    ".addressDetails .options",
  ) as HTMLElement;
  results = document.querySelector(".autosuggest-results") as HTMLElement;
  clearSearchBtn = document.querySelector(
    ".clear-searchButton",
  ) as HTMLButtonElement;

  autoSuggestResultsTitle.addEventListener("click", backToAddressList);
  inputElement.addEventListener("input", displayW3wSuggestion);
  clearSearchBtn.addEventListener("click", resetUI);
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
// [END woosmap_w3w_autocomplete]

export {};
