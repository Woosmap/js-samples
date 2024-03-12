// [START woosmap_localities_api_details_postalcodes]
const woosmap_key = "YOUR_API_KEY";
const countryRestrictions = ["GB", "JE", "IM", "GG"];
const types = ["postal_code"];
let map: woosmap.map.Map;
let debouncedAutocomplete: (
  ...args: any[]
) => Promise<woosmap.map.localities.LocalitiesAutocompleteResponse>;
let inputElement: HTMLInputElement;
let suggestionsList: HTMLUListElement;
let clearSearchBtn: HTMLButtonElement;
let markerAddress: woosmap.map.Marker;

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
    inputElement.focus();
    markerAddress.setMap(null);
  });

  debouncedAutocomplete = debouncePromise(autocompleteAddress, 0);
}

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
}

function handleAutocomplete(): void {
  if (inputElement && suggestionsList) {
    const input = inputElement.value;
    input.replace('"', '\\"').replace(/^\s+|\s+$/g, "");

    if (input !== "") {
      debouncedAutocomplete(input)
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

function formatPredictionList(
  locality: woosmap.map.localities.LocalitiesPredictions,
): string {
  const formattedName =
    locality.matched_substrings && locality.matched_substrings.description
      ? bold_matched_substring(
          locality.description as string,
          locality.matched_substrings.description,
        )
      : locality.description;

  const addresses = locality.has_addresses
    ? `<span class='light'>- view addresses</span>`
    : "";
  const predictionClass = locality.has_addresses
    ? `prediction-expandable`
    : "no-viewpoint";

  return `<div class="prediction ${predictionClass}">${formattedName} ${addresses}</div>`;
}

function bold_matched_substring(
  string: string,
  matched_substrings: woosmap.map.AutocompleteMatchedSubstring[],
) {
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
): Promise<woosmap.map.localities.LocalitiesAutocompleteResponse> {
  const args = {
    key: woosmap_key,
    input,
  };
  args["components"] = countryRestrictions
    .map((country) => `country:${country}`)
    .join("|");
  args["types"] = types.join("|");
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
        url: "https://images.woosmap.com/marker.png",
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

function requestDetailsAddress(public_id: string) {
  getLocalitiesDetails(public_id).then(
    (addressDetails: woosmap.map.localities.LocalitiesDetailsResponse) => {
      if (addressDetails.result["addresses"]) {
        populateAddressList(addressDetails.result["addresses"]);
      }
      if (addressDetails) {
        createAddressMarker(addressDetails.result);
      }
    },
  );
}

function populateAddressList(addresses) {
  if (inputElement && suggestionsList) {
    suggestionsList.innerHTML = "";
    if (addresses["list"].length > 0) {
      addresses["list"].forEach((address) => {
        const li = document.createElement("li");
        li.innerHTML = formatPredictionList(address) ?? "";
        li.addEventListener("click", () => {
          inputElement.value = address.description ?? "";
          requestDetailsAddress(address.public_id);
        });
        suggestionsList.appendChild(li);
      });
      suggestionsList.style.display = "block";
      clearSearchBtn.style.display = "block";
    }
  }
}

function getLocalitiesDetails(
  publicId: string,
): Promise<woosmap.map.localities.LocalitiesDetailsResponse> {
  const args = {
    public_id: publicId,
    key: woosmap_key,
  };
  return fetch(
    `https://api.woosmap.com/localities/details/?${buildQueryString(args)}`,
  ).then((response) => response.json());
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
  init();
});

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
// [END woosmap_localities_api_details_postalcodes]

export {};
