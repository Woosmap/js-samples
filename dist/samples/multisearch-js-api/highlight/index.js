const searchOptions = {
  apiOrder: ["localities", "places"],
  debounceTime: 0,
  localities: {
    key: "YOUR_API_KEY",
    fallbackBreakpoint: 0.5,
    params: {
      types: ["locality", "postal_code", "address"],
    },
  },
  places: {
    key: "YOUR_GOOGLE_API_KEY",
    params: {
      types: ["address"],
    },
    minInputLength: 6,
  },
};
let multiSearch;
let inputElement;
let suggestionsList;
let clearSearchBtn;
let responseElement;

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
    responseElement.style.display = "none";
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
          let _a;

          inputElement.value =
            (_a = result.description) !== null && _a !== void 0 ? _a : "";
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

function displayMultiSearchResponse(selectedResult) {
  if (responseElement) {
    responseElement.innerHTML = `<code>${JSON.stringify(selectedResult, null, 2)}</code>`;
    responseElement.style.display = "block";
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
document.addEventListener("DOMContentLoaded", () => {
  inputElement = document.getElementById("autocomplete-input");
  suggestionsList = document.getElementById("suggestions-list");
  clearSearchBtn = document.getElementsByClassName("clear-searchButton")[0];
  responseElement = document.getElementById("response-container");
  init();
});
