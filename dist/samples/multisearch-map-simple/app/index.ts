const searchOptions = {
  apiOrder: ["localities", "places"],
  debounceTime: 0,
  localities: {
    key: import.meta.env.VITE_WOOSMAP_PUBLIC_API_KEY!,
    params: {
      types: ["locality", "postal_code", "address"],
      language: "en",
    },
  },
  places: {
    key: import.meta.env.VITE_GOOGLE_API_KEY!,
    minInputLength: 5,
  },
};
// The MultiSearch JS API ships no typings: describe the parts this sample uses.
interface MultiSearchPrediction {
  id: string;
  api: string;
  description?: string;
  highlight: string;
}

interface MultiSearch {
  autocompleteMulti(input: string): Promise<MultiSearchPrediction[]>;
  detailsMulti(request: { id: string; api: string }): Promise<unknown>;
}

interface MultiSearchGlobal {
  multisearch(options: object): MultiSearch;
}

let multiSearch: MultiSearch;
let inputElement: HTMLInputElement;
let suggestionsList: HTMLUListElement;
let clearSearchBtn: HTMLButtonElement;
let map: woosmap.map.Map;
let marker: woosmap.map.marker.AdvancedMarkerElement;

function initSearch(): void {
  inputElement = document.getElementById(
    "autocomplete-input",
  ) as HTMLInputElement;
  suggestionsList = document.getElementById(
    "suggestions-list",
  ) as HTMLUListElement;
  clearSearchBtn = document.getElementsByClassName(
    "clear-searchButton",
  )[0] as HTMLButtonElement;
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
    inputElement.focus();
  });

  multiSearch = (woosmap as unknown as MultiSearchGlobal).multisearch(searchOptions);
}

async function initMap(): Promise<void> {
  await woosmap.map.importLibrary("maps");
  await woosmap.map.importLibrary("marker");

  map = (document.getElementById("map") as woosmap.map.MapElement).innerMap;
  map.moveCamera({
      center: { lat: 51.50940214, lng: -0.133012 },
      zoom: 4,
    });
  initSearch();
}

function handleAutocomplete(): void {
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

function handleNoResults(): void {
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
        li.innerHTML = formatPredictionList(result) ?? "";
        li.addEventListener("click", () => {
          inputElement.value = result.description ?? "";
          suggestionsList.style.display = "none";
          multiSearch
            .detailsMulti({ id: result.id, api: result.api })
            .then((details) => {
              displayLocality(details);
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

function formatPredictionList(result): string {
  const predictionClass = "no-viewpoint";
  const formatted_name = result.highlight;
  let html = "";
  html += `<div class="prediction ${predictionClass}">${formatted_name}</div>`;
  return html;
}

function displayLocality(result) {
  if (marker) {
    marker.setMap(null);
  }
  if (result?.geometry) {
    const { PinElement } = woosmap.map.marker;
    const pin = new PinElement({
      background: "#5588FF",
      borderColor: "#3D6FE0",
      glyphColor: "#FFFFFF",
    });

    marker = new woosmap.map.marker.AdvancedMarkerElement({
      position: result.geometry.location,
      content: pin.element,
    });
    marker.setMap(map);
    map.flyTo({ center: result.geometry.location, zoom: 14 });
  }
}

document.addEventListener("click", (event) => {
  const targetElement = event.target as Element;
  const isClickInsideAutocomplete = targetElement.closest(
    "#autocomplete-container",
  );

  if (!isClickInsideAutocomplete && suggestionsList) {
    suggestionsList.style.display = "none";
  }
});

initMap();

export {};
