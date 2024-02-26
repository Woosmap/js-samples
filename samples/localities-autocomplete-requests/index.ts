// [START woosmap_localities_autocomplete_requests]
const componentsRestriction = [];
const woosmap_key = "woos-48c80350-88aa-333e-835a-07f4b658a9a4";

function displayAddress() {
  const inputElement: HTMLInputElement = document.getElementById(
    "input",
  ) as HTMLInputElement;
  let value = "";
  if (inputElement) {
    value = inputElement.value;
  }

  const results: HTMLElement = document.querySelector(
    ".autocomplete-results",
  ) as HTMLElement;

  const components: string[] = componentsRestriction.map(
    ({ id }) => `country:${id}`,
  );
  const componentsArgs: string = components.join("|");

  autocompleteAddress(value, componentsArgs, woosmap_key).then(
    ({ localities }) => {
      if (results && results.parentElement) {
        results.innerHTML = "";
        results.parentElement.style.display = "none";
      }
      let html = "";
      for (const prediction_id in localities || []) {
        const prediction = localities[prediction_id];
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

        html += `<div class="prediction ${predictionClass}" prediction-id=${prediction_id}>${formatted_name}</div>`;
      }
      if (results && results.parentElement) {
        results.innerHTML = html;
        results.style.display = "block";
        results.parentElement.style.display = "flex";
      }

      const data = results.querySelectorAll(".prediction");

      for (const result of data) {
        if (result && results && results.parentElement) {
          result.addEventListener("click", () => {
            results.style.display = "none";
            if (results.parentElement) {
              results.parentElement.style.display = "none";
            }
            const predictictionVal = result.getAttribute("prediction-id");
            if (predictictionVal) {
              const predictionId = parseInt(predictictionVal, 10);
              const prediction = localities[predictionId];
              const inputElement = document.getElementById(
                "input",
              ) as HTMLInputElement;
              if (inputElement) {
                inputElement.value = prediction.description;
              }
              const selectedElement = document.getElementById(
                "selected-locality",
              ) as HTMLElement;
              if (selectedElement) {
                selectedElement.innerHTML = `<code>${JSON.stringify(prediction, null, 2)}</code>`;
              }
            }
          });
        }
      }
    },
  );
}

function bold_matched_substring(string, matched_substrings) {
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

function initUI() {
  const results = document.querySelector(
    ".autocomplete-results",
  ) as HTMLElement;
  const input = document.querySelector(
    ".autocomplete-input > input",
  ) as HTMLInputElement;

  input?.addEventListener(
    "input",
    debounce(() => {
      const value = input.value;
      value.replace('"', '\\"').replace(/^\s+|\s+$/g, "");
      if (value !== "") {
        displayAddress();
      } else {
        if (results) {
          results.innerHTML = "";
        }
      }
    }, 0),
  );
}
function autocompleteAddress(
  input: string,
  components: string,
  woosmap_key: string,
) {
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
type FuncType = (...args: any[]) => any;

function debounce(func: FuncType, wait: number, immediate?: boolean): FuncType {
  let timeout: NodeJS.Timeout | null;

  return function (this: any, ...args: any[]) {
    const later = () => {
      timeout = null;
      if (!immediate) {
        func.apply(this, args);
      }
    };

    const callNow = immediate && !timeout;

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);

    if (callNow) {
      func.apply(this, args);
    }
  };
}

initUI();

declare global {
  interface Window {
    initUI: () => void;
  }
}
window.initUI = initUI;
// [END woosmap_localities_autocomplete_requests]

export {};
