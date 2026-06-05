const componentsRestriction = [];
const woosmap_key = import.meta.env.VITE_WOOSMAP_PUBLIC_API_KEY!;
let debouncedAutocomplete: (
  ...args: any[]
) => Promise<woosmap.map.localities.LocalitiesAutocompleteResponse>;
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

function autocompleteAddress(
  input: string,
  components: string,
  woosmap_key: string,
): Promise<woosmap.map.localities.LocalitiesAutocompleteResponse> {
  const args = {
    key: woosmap_key,
    input,
    types: "locality|postal_code",
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


export {};
