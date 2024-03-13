// [START woosmap_localities_js_api]
const customDescription =
  'postal_code:"{name} ({postal_town}) - {administrative_area_level_0}"';
let localitiesAutocompleteService;
let inputElement: HTMLInputElement;
let suggestionsList: HTMLUListElement;
let clearSearchBtn: HTMLButtonElement;
let responseElement: HTMLElement;

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
    responseElement.style.display = "none";
    inputElement.focus();
  });

  localitiesAutocompleteService =
    new window.woosmap.localities.AutocompleteService("YOUR_API_KEY");
}

function handleAutocomplete(): void {
  if (inputElement && suggestionsList) {
    const input = inputElement.value;
    input.replace('"', '\\"').replace(/^\s+|\s+$/g, "");
    if (input !== "") {
      localitiesAutocompleteService.autocomplete(
        { input, custom_description: customDescription },
        displaySuggestions,
        (errorCode: number, errorText: string) => {
          console.error(
            `Error autocomplete localities: ${errorCode}:${errorText}`,
          );
        },
        0,
      );
    } else {
      suggestionsList.style.display = "none";
      clearSearchBtn.style.display = "none";
    }
  }
}

function displaySuggestions({
  localities,
}: woosmap.map.localities.LocalitiesAutocompleteResponse) {
  console.log(localities)
  if (inputElement && suggestionsList) {
    suggestionsList.innerHTML = "";
    if (localities.length > 0) {
      localities.forEach((locality) => {
        const li = document.createElement("li");
        li.innerHTML = formatPredictionList(locality) ?? "";
        li.addEventListener("click", () => {
          inputElement.value = locality.description ?? "";
          suggestionsList.style.display = "none";
          localitiesAutocompleteService.getDetails(
            locality.public_id,
            displayLocalitiesResponse,
          );
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

function displayLocalitiesResponse(
  selectedLocality: woosmap.map.localities.LocalitiesPredictions,
) {
  if (responseElement) {
    responseElement.innerHTML = `<code>${JSON.stringify(selectedLocality, null, 2)}</code>`;
    responseElement.style.display = "block";
  }
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
  responseElement = document.getElementById(
    "response-container",
  ) as HTMLElement;
  init();
});

declare global {
  interface Window {
    // currently, the localities JS API typings are not exported, so we use `any` here
    woosmap: {
      localities: {
        AutocompleteService: new (key: string) => any;
      };
    };
  }
}
// [END woosmap_localities_js_api

export {};
