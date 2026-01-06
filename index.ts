const woosmap_key = import.meta.env.VITE_WOOSMAP_PUBLIC_API_KEY!;
let debouncedAutocomplete: DebouncePromiseFunction<
  woosmap.map.stores.StoresAutocompleteResponse,
  [input: string]
>;
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

  debouncedAutocomplete = debouncePromise(autocompleteStores, 0);
}

function handleAutocomplete(): void {
  if (inputElement && suggestionsList) {
    const input = inputElement.value;
    input.replace('"', '\\"').replace(/^\s+|\s+$/g, "");
    if (input !== "") {
      debouncedAutocomplete(input)
        .then((storePredictions) => displaySuggestions(storePredictions))
        .catch((error) => console.error("Error autocomplete stores:", error));
    } else {
      suggestionsList.style.display = "none";
      clearSearchBtn.style.display = "none";
    }
  }
}

function displaySuggestions({
  predictions,
}: woosmap.map.stores.StoresAutocompleteResponse) {
  if (inputElement && suggestionsList) {
    suggestionsList.innerHTML = "";
    if (predictions.length > 0) {
      predictions.forEach((prediction) => {
        const li = document.createElement("li");
        li.innerHTML = formatPredictionList(prediction) ?? "";
        li.addEventListener("click", () => {
          inputElement.value = prediction.name ?? "";
          requestDetailsStore(prediction.store_id);
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
  prediction: woosmap.map.stores.StorePrediction,
): string {
  const predictionClass = "no-viewpoint";
  let html = "";
  html += `<div class="prediction ${predictionClass}">${prediction.highlighted}</div>`;
  return html;
}

function displayStoresResponse(
  storePrediction: woosmap.map.stores.StorePrediction,
) {
  if (responseElement) {
    responseElement.innerHTML = `<code>${JSON.stringify(storePrediction, null, 2)}</code>`;
    responseElement.style.display = "block";
  }
}

function requestDetailsStore(store_id: string) {
  fetch(`https://api.woosmap.com/stores/${store_id}?key=${woosmap_key}`)
    .then((response) => response.json())
    .then((storePrediction) => displayStoresResponse(storePrediction))
    .catch((error) => console.error("Error request details store:", error));
}

function autocompleteStores(
  input: string,
): Promise<woosmap.map.stores.StoresAutocompleteResponse> {
  const args = {
    key: woosmap_key,
    query: `localized:${input}`,
  };

  return fetch(
    `https://api.woosmap.com/stores/autocomplete/?${buildQueryString(args)}`,
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
