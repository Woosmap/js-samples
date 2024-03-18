// [START woosmap_multisearch_address_form_autofill]
const searchOptions = {
  apiOrder: ["localities", "places"],
  debounceTime: 0,
  localities: {
    key: "YOUR_API_KEY",
    fallbackBreakpoint: 0.4,
    params: {
      components: {
        country: ["gb"],
      },
      language: "en",
      types: ["address"],
    },
  },
  places: {
    key: "YOUR_GOOGLE_API_KEY",
    params: {
      types: ["address"],
      components: {
        country: ["gb"],
      },
      language: "en",
    },
  },
};
let multiSearch;
let inputElement;
let suggestionsList;
let clearSearchBtn;
let address2Field;
let postalField;
let localityField;
let stateField;
let countryField;

function init() {
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
    address2Field.value = "";
    postalField.value = "";
    localityField.value = "";
    stateField.value = "";
    countryField.value = "";
    inputElement.focus();
  });
  // @ts-ignore
  multiSearch = window.woosmap.multisearch(searchOptions);
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
        let _a;
        const li = document.createElement("li");

        li.innerHTML =
          (_a = formatPredictionList(result)) !== null && _a !== void 0
            ? _a
            : "";
        li.addEventListener("click", () => {
          suggestionsList.style.display = "none";
          multiSearch
            .detailsMulti({ id: result.id, api: result.api })
            .then((details) => {
              displayMultiSearchResponse(details);
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

  html += `<div class="prediction ${predictionClass}">${formatted_name}</div>`;
  return html;
}

// [START woosmap_multisearch_address_form_autofill_display]
function displayMultiSearchResponse(result) {
  let shippingAddress = "";
  let shippingAddress2 = "";
  let postcode = "";

  for (const component of result.item.address_components) {
    const componentType = component.types[0];

    switch (componentType) {
      case "street_number": {
        shippingAddress = `${component.long_name} ${shippingAddress}`;
        break;
      }

      case "route": {
        shippingAddress += component.short_name;
        break;
      }

      case "postal_code": {
        postcode = `${component.long_name}${postcode}`;
        break;
      }

      case "postal_code_suffix": {
        postcode = `${postcode}-${component.long_name}`;
        break;
      }
      case "locality":
        localityField.value = component.long_name;
        break;
      case "state": {
        stateField.value = component.long_name;
        break;
      }

      case "administrative_area_level_1": {
        stateField.value = component.long_name;
        break;
      }

      case "country": {
        countryField.value = component.long_name;
        break;
      }

      case "premise": {
        shippingAddress2 = component.long_name;
        break;
      }
      default:
        break;
    }
  }

  if (postcode) {
    postalField.value = postcode;
  }

  if (shippingAddress) {
    inputElement.value = shippingAddress;
  }

  if (shippingAddress2) {
    address2Field.value = shippingAddress2;
  }
}

// [END woosmap_multisearch_address_form_autofill_display]
document.addEventListener("click", (event) => {
  const targetElement = event.target;
  const isClickInsideAutocomplete = targetElement.closest(
    "#autocomplete-container",
  );

  if (!isClickInsideAutocomplete && suggestionsList) {
    suggestionsList.style.display = "none";
  }
});
document.addEventListener("DOMContentLoaded", () => {
  inputElement = document.getElementById("autocomplete-input");
  suggestionsList = document.getElementById("suggestions-list");
  clearSearchBtn = document.getElementsByClassName("clear-searchButton")[0];
  address2Field = document.querySelector("#address2");
  postalField = document.querySelector("#postcode");
  localityField = document.querySelector("#locality");
  stateField = document.querySelector("#state");
  countryField = document.querySelector("#country");
  init();
});
// [END woosmap_multisearch_address_form_autofill]
