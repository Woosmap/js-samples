const searchOptions = {
  apiOrder: ["store", "localities", "places"],
  debounceTime: 100,
  localities: {
    key: "YOUR_API_KEY",
    fallbackBreakpoint: 0.4,
    params: {
      components: {
        country: ["gb", "fr", "de"],
      },
      language: "en",
      types: ["locality", "postal_code", "address"],
    },
  },
  store: {
    key: "YOUR_API_KEY",
    fallbackBreakpoint: false,
    params: {
      query: "type:bose_store",
    },
  },
  places: {
    key: "YOUR_GOOGLE_API_KEY",
    fallbackBreakpoint: 1,
    minInputLength: 10,
    params: {
      components: {
        country: ["gb", "fr", "de"],
      },
    },
  },
};
let multiSearch;
let inputElement;
let suggestionsList;
let clearSearchBtn;
let map;
let marker;
let infoWindow;

function initSearch() {
  inputElement = document.getElementById("autocomplete-input");
  suggestionsList = document.getElementById("suggestions-list");
  clearSearchBtn = document.getElementsByClassName("clear-searchButton")[0];
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
    }

    if (infoWindow) {
      infoWindow.close();
    }

    inputElement.focus();
  });
  // @ts-ignore
  multiSearch = window.woosmap.multisearch(searchOptions);
}

function initMap() {
  map = new window.woosmap.map.Map(document.getElementById("map"), {
    center: { lat: 51.50940214, lng: -0.133012 },
    zoom: 4,
  });
  infoWindow = new woosmap.map.InfoWindow({});
  initSearch();
}

function handleAutocomplete() {
  if (inputElement && suggestionsList) {
    const input = inputElement.value;

    input.replace('"', '\\"').replace(/^\s+|\s+$/g, "");
    if (input !== "") {
      multiSearch.autocompleteMulti(input).then(
        (results) => displaySuggestions(results),
        (error) => console.error(`Error autocomplete localities: ${error}`),
      );
    } else {
      suggestionsList.style.display = "none";
      clearSearchBtn.style.display = "none";
    }
  }
}

function handleNoResults() {
  const li = document.createElement("li");

  li.innerHTML = "<div class='prediction no-result'>No results found...</div>";
  suggestionsList.appendChild(li);
  suggestionsList.className = "";
  suggestionsList.style.display = "block";
}

function displaySuggestions(results) {
  if (inputElement && suggestionsList) {
    suggestionsList.innerHTML = "";
    if (results.length > 0) {
      results.forEach((result) => {
        const li = document.createElement("li");

        li.className = `${result.api}-api`;
        li.innerHTML = formatPredictionList(result) ?? "";
        li.addEventListener("click", () => {
          inputElement.value = result.description ?? "";
          suggestionsList.style.display = "none";
          multiSearch
            .detailsMulti({ id: result.id, api: result.api })
            .then((details) => {
              displayLocality(details, result.api);
            });
        });
        suggestionsList.appendChild(li);
      });
      suggestionsList.className = results[0].api;
      suggestionsList.style.display = "block";
      clearSearchBtn.style.display = "block";
    } else {
      handleNoResults();
    }
  }
}

function formatPredictionList(result) {
  const predictionClass = "no-viewpoint";
  const formatted_name = result.highlight;
  let html = "";

  html += `<div class="api-icon"></div><div class="prediction ${predictionClass}">${formatted_name}</div>`;
  return html;
}

function createMarker(result) {
  return new woosmap.map.Marker({
    position: result.geometry.location,
    icon: {
      url: "https://images.woosmap.com/marker.png",
      scaledSize: {
        height: 50,
        width: 32,
      },
    },
  });
}

function createInfoWindowHTML(result, apiName) {
  let addressComponentsHTML = "";

  if (result.address_components) {
    result.address_components.forEach((component) => {
      addressComponentsHTML += `<p>${component.long_name} (${component.short_name})</p>`;
    });
  }
  return `<div class="info-content">${apiName ? `<div>api: <strong>${apiName}</strong></div>` : ""}
      ${result.name ? `<p>${result.name}</p>` : ""}
      ${result.formatted_address ? `<p>${result.formatted_address}</p>` : ""}
      ${addressComponentsHTML}</div>`;
}

function displayLocality(result, apiName) {
  if (marker) {
    marker.setMap(null);
  }

  if (infoWindow) {
    infoWindow.close();
  }

  if (result?.geometry) {
    marker = createMarker(result);
    marker.setMap(map);

    const infoWindowHTML = createInfoWindowHTML(result, apiName);

    infoWindow.setOffset(new woosmap.map.Point(0, -50));
    infoWindow.setContent(infoWindowHTML);
    marker.addListener("click", () => {
      infoWindow.open(map, marker.getPosition());
    });
    map.setCenter(result.geometry.location, { top: 150 });
    map.setZoom(14);
    woosmap.map.event.addListenerOnce(map, "idle", () => {
      infoWindow.open(map, marker.position);
    });
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
window.initMap = initMap;
