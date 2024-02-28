// [START woosmap_localities_api_autocomplete_advanced]
const componentsRestriction = [];
const woosmap_key = "YOUR_API_KEY";
let debouncedAutocomplete;
const inputElement = document.getElementById("autocomplete-input");
const suggestionsList = document.getElementById("suggestions-list");
const clearSearchBtn = document.getElementsByClassName("clear-searchButton")[0];
const responseElement = document.getElementById("response-container");

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
    responseElement.innerHTML = "";
    inputElement.focus();
  });
  debouncedAutocomplete = debouncePromise(autocompleteAddress, 0);
}

function handleAutocomplete() {
  if (inputElement && suggestionsList) {
    const input = inputElement.value;

    input.replace('"', '\\"').replace(/^\s+|\s+$/g, "");

    const components = componentsRestriction.map(({ id }) => `country:${id}`);
    const componentsArgs = components.join("|");

    if (input !== "") {
      debouncedAutocomplete(input, componentsArgs, woosmap_key)
        .then(({ localities }) => displaySuggestions(localities))
        .catch((error) =>
          console.error("Error autocomplete localities:", error),
        );
    }
  }
}

function displaySuggestions(localitiesPredictions) {
  if (inputElement && suggestionsList) {
    suggestionsList.innerHTML = "";
    if (localitiesPredictions.length > 0) {
      localitiesPredictions.forEach((locality) => {
        let _a;
        const li = document.createElement("li");

        li.innerHTML =
          (_a = formatPredictionList(locality)) !== null && _a !== void 0
            ? _a
            : "";
        li.addEventListener("click", () => {
          let _a;

          inputElement.value =
            (_a = locality.description) !== null && _a !== void 0 ? _a : "";
          suggestionsList.style.display = "none";
          displayLocalitiesResponse(locality);
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

function displayLocalitiesResponse(selectedLocality) {
  if (responseElement) {
    responseElement.innerHTML = `<code>${JSON.stringify(selectedLocality, null, 2)}</code>`;
  }
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

function autocompleteAddress(input, components, woosmap_key) {
  const args = {
    key: woosmap_key,
    input,
    types: "locality|postal_code|address",
    components: "country:fr|country:gb|country:it|country:es|country:de",
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

init();
window.init = init;
// [END woosmap_localities_api_autocomplete_advanced]
