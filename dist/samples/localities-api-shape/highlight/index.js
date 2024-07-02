const componentsRestriction = { country: [] };
const woosmap_key = "YOUR_API_KEY";
let debouncedAutocomplete;
let inputElement;
let suggestionsList;
let clearSearchBtn;
let map;
let markerAddress;
let detailsHTML;
let addressDetailsContainer;
let hasShape = false;

function initMap() {
  map = new woosmap.map.Map(document.getElementById("map"), {
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

function createShape(result) {
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

function displaySection(section, mode = "block") {
  section.style.display = mode;
}

function fillAddressDetails(addressDetails) {
  const details = [];

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

function init() {
  inputElement = document.getElementById("autocomplete-input");
  suggestionsList = document.getElementById("suggestions-list");
  clearSearchBtn = document.getElementsByClassName("clear-searchButton")[0];
  addressDetailsContainer = document.querySelector(".addressDetails");
  detailsHTML = document.querySelector(".addressDetails .addressOptions");
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

function handleAutocomplete() {
  if (inputElement && suggestionsList) {
    let input = inputElement.value;

    input = input.replace('"', '\\"').replace(/^\s+|\s+$/g, "");

    const componentsArgs = componentsRestriction.country
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

function displaySuggestions(localitiesPredictions) {
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

function formatPredictionList(locality) {
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

function bold_matched_substring(string, matched_substrings) {
  matched_substrings = matched_substrings.reverse();

  for (const substring of matched_substrings) {
    const char = string.substring(
      substring["offset"],
      substring["offset"] + substring["length"],
    );

    string = `${string.substring(0, substring["offset"])}<span class='bold'>${char}</span>${string.substring(substring["offset"] + substring["length"])}`;
  }
  return string;
}

function autocompleteAddress(input, components) {
  const args = {
    key: woosmap_key,
    input,
    no_deprecated_fields: "true",
    types: "locality",
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

function buildQueryString(params) {
  const queryStringParts = [];

  for (const key in params) {
    if (params[key]) {
      const value = params[key];

      queryStringParts.push(
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
      );
    }
  }
  return queryStringParts.join("&");
}

function debouncePromise(fn, delay) {
  let timeoutId = null;
  let latestResolve = null;
  let latestReject = null;

  return function (...args) {
    return new Promise((resolve, reject) => {
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

  countryElements.forEach((countryElement) => {
    countryElement.addEventListener("click", () => {
      toggleCountry(countryElement);
    });
    if (countryElement.classList.contains("active")) {
      const countryCode = countryElement.dataset.countrycode;

      componentsRestriction.country = [
        ...componentsRestriction.country,
        countryCode,
      ];
    }
  });

  const dropdownButtons = document.querySelectorAll(
    ".dropdown .dropdown-button",
  );

  dropdownButtons.forEach((button) =>
    button.addEventListener("click", toggleDropdown),
  );

  // Hide dropdowns when clicking outside
  const dropdowns = document.querySelectorAll(".dropdown");

  document.addEventListener("click", (event) => {
    dropdowns.forEach((dropdown) => {
      if (!dropdown.contains(event.target)) {
        hideDropdown(dropdown);
      }
    });
  });
}

function toggleDropdown(event) {
  event.stopPropagation();

  const dropdown = event.target.closest(".dropdown");

  if (dropdown) {
    if (dropdown.classList.contains("active")) {
      hideDropdown(dropdown);
    } else {
      showDropdown(dropdown);
    }
  }
}

function hideDropdown(dropdown) {
  const dropdownContent = dropdown.querySelector(".dropdown-content");

  dropdownContent?.classList.remove("visible");
  dropdown.classList.remove("active");
}

function showDropdown(dropdown) {
  const dropdownContent = dropdown.querySelector(".dropdown-content");

  dropdownContent?.classList.add("visible");
  dropdown.classList.add("active");
}

function toggleCountry(country) {
  const isActive = country.classList.toggle("active");
  const countryCode = country.dataset.countrycode;

  if (countryCode) {
    if (isActive) {
      componentsRestriction.country = [
        ...componentsRestriction.country,
        countryCode,
      ];
    } else {
      componentsRestriction.country = componentsRestriction.country.filter(
        (code) => code !== countryCode,
      );
    }

    updateCountrySelectorText();
    handleAutocomplete();
  }
}

function updateCountrySelectorText() {
  const dropdownText = document.querySelector(".dropdown-button span");

  if (componentsRestriction.country.length > 0) {
    dropdownText.innerHTML = `Selected countries: <strong>${componentsRestriction.country.join("</strong>, <strong>")}</strong>`;
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

function panMap(addressDetail) {
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

function getLocalitiesDetails(publicId) {
  const args = {
    key: woosmap_key,
    public_id: publicId,
    fields: "shape|geometry",
  };
  return fetch(
    `https://api.woosmap.com/localities/details/?${buildQueryString(args)}`,
  ).then((response) => response.json());
}

window.initMap = initMap;
