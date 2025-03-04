let map;
let marker;
let infoWindow;
let localitiesService;
let debouncedLocalitiesSearch;
let input;
let detailsHTML;
let detailsResultContainer;
const woosmap_key = "YOUR_API_KEY";
const componentsRestriction = { country: [] };

function initMap() {
  map = new window.woosmap.map.Map(document.getElementById("map"), {
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
  });
  infoWindow = new woosmap.map.InfoWindow({});
  localitiesService = new window.woosmap.map.LocalitiesService();
  debouncedLocalitiesSearch = debouncePromise(fetchLocalitiesSearch, 0);
  manageCountrySelector();
}

const fetchLocalitiesSearch = async (input) => {
  const center = map.getCenter();
  const radius =
    map.getZoom() > 10 ? (map.getZoom() > 14 ? "1000" : "10000") : "100000";
  const componentsArgs = componentsRestriction.country
    .map((country) => `country:${country}`)
    .join("|");

  try {
    const response = await fetch(`
https://api.woosmap.com/localities/search?types=point_of_interest|locality|admin_level|postal_code|address&input=${encodeURIComponent(input)}&location=${center.lat()},${center.lng()}&radius=${radius}&key=${woosmap_key}&components=${componentsArgs}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching localities:", error);
    throw error;
  }
};

function fillDetailsResult(detailsResult) {
  const details = [];

  detailsHTML.innerHTML = "";
  detailsHTML.style.display = "block";
  if (detailsResult.formatted_address) {
    details.push(
      `<p class='option-detail'><span class='option-detail-label'>Formatted_address:</span><span class='bold'>${detailsResult.formatted_address}</span></p>`,
    );
  } else if (detailsResult.name)
    details.push(
      `<p class='option-detail'><span class='option-detail-label'>Name:</span><span class='bold'>${detailsResult.name}</span></p>`,
    );

  if (detailsResult.types && detailsResult.types[0]) {
    details.push(
      `<p class='option-detail'><span class='option-detail-label'>Type: </span><span class='bold'>${detailsResult.types[0]}</span></p>`,
    );
  }

  if (detailsResult.categories)
    details.push(
      `<p class='option-detail'><span class='option-detail-label'>Categories:</span><span class='bold'>${detailsResult.categories[0]}</span></p>`,
    );

  if (detailsResult.geometry) {
    details.push(
      `<div class='option-detail'><div><span class='option-detail-label'>Latitude:</span> <span class='bold'>${detailsResult.geometry.location.lat.toFixed(5).toString()}</span></div><div><span class='option-detail-label'>Longitude: </span><span class='bold'>${detailsResult.geometry.location.lng.toFixed(5).toString()}</span></div></div>`,
    );
    if (detailsResult.address_components) {
      const compoHtml = detailsResult.address_components
        .map(
          (compo) =>
            `<p class='option-detail'><span class='option-detail-label'>${compo.types.find((item) => item.includes("division")) || compo.types[0]}:</span> <span class='bold'>${compo.long_name}</span></p>`,
        )
        .join("");

      details.push(
        `<div class='address-components'><div class='title'>Address components</div><div>${compoHtml}</div>`,
      );
    }
  }

  detailsHTML.innerHTML = details.join("");
}

const inputElement = document.getElementById("autocomplete-input");
const suggestionsList = document.getElementById("suggestions-list");
const clearSearchBtn = document.getElementsByClassName("clear-searchButton")[0];

detailsResultContainer = document.querySelector(".detailsResult");
detailsHTML = document.querySelector(".detailsResult .detailsOptions");
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

function handleAutocomplete() {
  if (inputElement && suggestionsList) {
    input = inputElement.value;
    if (input) {
      debouncedLocalitiesSearch(input)
        .then((results) => displaySuggestions(results))
        .catch((error) =>
          console.error("Error autocomplete localities:", error),
        );
    } else {
      suggestionsList.style.display = "none";
      clearSearchBtn.style.display = "none";
    }
  }
}

function handleDetails(publicId) {
  localitiesService
    .getDetails({ publicId })
    .then((response) => displayResult(response.result))
    .catch((error) => console.error("Error getting locality details:", error));
}

function displaySection(section, mode = "block") {
  section.style.display = mode;
}

function displayResult(result) {
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
      `<span>${result.formatted_address ?? result.name}</span>`,
    );
    infoWindow.open(map, marker);
    map.flyTo({ center: result.geometry.location, zoom: 14 });
  }
}

function displaySuggestions(localitiesPredictions) {
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
  const targetElement = event.target;
  const isClickInsideAutocomplete = targetElement.closest(
    "#autocomplete-container",
  );

  if (!isClickInsideAutocomplete && suggestionsList) {
    suggestionsList.style.display = "none";
  }
});

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

window.initMap = initMap;

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
  const inputPlaceholder = document.querySelector("#autocomplete-input");

  if (componentsRestriction.country.length > 0) {
    inputElement.readOnly = false;
    dropdownText.innerHTML = `Selected countries: <strong>${componentsRestriction.country.join("</strong>, <strong>")}</strong>`;
    inputPlaceholder.placeholder = `Search for a place in ${componentsRestriction.country.join(" or ")}...`;
  } else {
    dropdownText.textContent = "Select countries";
    inputElement.readOnly = true;
    inputPlaceholder.placeholder = "Select at least one country to proceed.";
  }
}
