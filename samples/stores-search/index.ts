// [START woosmap_stores_search]
let map: woosmap.map.Map;
let activeLocation: woosmap.map.Marker | null = null;
let storesOverlay: woosmap.map.StoresOverlay;
const gestureMode: woosmap.map.GestureHandlingMode = "greedy";
let storesService: woosmap.map.StoresService;
let localitiesService: woosmap.map.LocalitiesService;

const storesStyle: woosmap.map.Style = {
  breakPoint: 21,
  rules: [],
  default: {
    color: "#008a2f",
    size: 8,
    minSize: 1,
    icon: {
      url: "https://images.woosmap.com/starbucks-marker.svg",
      scaledSize: {
        height: 40,
        width: 34,
      },
    },
    selectedIcon: {
      url: "https://images.woosmap.com/starbucks-marker-selected.svg",
      scaledSize: {
        height: 50,
        width: 43,
      },
    },
  },
};

const mapOptions: woosmap.map.MapOptions = {
  center: { lat: 51.50940214, lng: -0.133012 },
  zoom: 12,
  styles: [
    {
      featureType: "poi.business",
      elementType: "labels",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
  ],
  gestureHandling: gestureMode,
};

const inputElement = document.getElementById(
  "autocomplete-input",
) as HTMLInputElement;
const submitButton = document.getElementById(
  "submit-button",
) as HTMLButtonElement;

if (inputElement && submitButton) {
  inputElement.addEventListener("keydown", handleKeyPress);
  submitButton.addEventListener("click", handleGeocodeFromSubmit);
}

function handleKeyPress(event: KeyboardEvent) {
  if (event.key === "Enter") {
    handleGeocode(null);
  }
}

function handleGeocodeFromSubmit() {
  handleGeocode(null);
}

function displayListStores(stores: woosmap.map.stores.StoreResponse[]) {
  const storeTemplates = stores.map(createStoreTemplate);
  const storeList = document.querySelector(".stores-list");
  if (storeList) {
    storeList.innerHTML = storeTemplates.join("");
  }
  addClickListenerToStoreCards(stores);
}

function createStoreTemplate(
  store: woosmap.map.stores.StoreResponse,
  indexStore: number,
) {
  const { name, address, contact, distance } = store.properties;
  const phoneHtml = contact.phone
    ? `<div class='store-contact'><a href='tel:${contact.phone}'>${contact.phone}</a></div>`
    : "";
  const distanceHtml = distance
    ? `<div class='store-distance'>${distance}</div>`
    : "";
  const websiteHtml = contact.website
    ? `<div class='store-website'><a href='${contact.website}' target="_blank">go to website</a></div>`
    : "";

  return `
    <div class='controls summary-store-card' data-index=${indexStore}>
      <div>
        <div><strong>${name} - ${address.city}</strong></div>
        <div>
          <div class='store-address'>${
            (address && address.lines && address.lines.join(", ")) ||
            "Address not available"
          }</div>
          ${phoneHtml}
          ${websiteHtml}
          ${distanceHtml}
        </div>
      </div>
    </div>`;
}

function addClickListenerToStoreCards(
  stores: woosmap.map.stores.StoreResponse[],
) {
  document.querySelectorAll(".summary-store-card").forEach((storeCard) => {
    storeCard.addEventListener("click", () => {
      console.log(stores[storeCard["dataset"].index]);
    });
  });
}

function createLocalitiesRequest(
  latlng: woosmap.map.LatLng | null,
): woosmap.map.localities.LocalitiesGeocodeRequest | null {
  return inputElement
    ? latlng
      ? { latLng: latlng }
      : { address: inputElement.value }
    : null;
}

function handleGeocode(latlng: woosmap.map.LatLng | null) {
  const localitiesRequest = createLocalitiesRequest(latlng);

  if (localitiesRequest) {
    localitiesService
      .geocode(localitiesRequest)
      .then((localities) => handleGeocodeResults(localities))
      .catch(handleError);
  }
}

function handleGeocodeResults(
  localities: woosmap.map.localities.LocalitiesGeocodeResponse,
) {
  const location = localities.results[0]?.geometry?.location;
  location && handleStoresSearch(location);
}

function handleStoresSearch(latlng: woosmap.map.LatLngLiteral) {
  const searchRequest = {
    storesByPage: 15,
    latLng: latlng,
  };

  storesService
    .search(searchRequest)
    .then((stores) => handleSearchResults(stores, latlng))
    .catch(handleError);
}

function handleSearchResults(
  stores: woosmap.map.stores.StoresSearchResponse,
  originalLatLng: woosmap.map.LatLngLiteral,
) {
  if (stores.features.length > 0) {
    displayListStores(stores.features);
    displayStoresAndLocation(stores.features, originalLatLng);
    clearAndAddGeoJsonToMap(stores);
  }
}

function clearAndAddGeoJsonToMap(
  stores: woosmap.map.stores.StoresSearchResponse,
) {
  map.data.forEach((feature) => map.data.remove(feature));
  map.data.addGeoJson(stores);
}

function calculateLatLngBounds(
  stores: woosmap.map.stores.StoreResponse[],
): woosmap.map.LatLngBounds {
  const bounds = new woosmap.map.LatLngBounds();
  stores.forEach((store: woosmap.map.stores.StoreResponse) => {
    bounds.extend(
      new woosmap.map.LatLng(
        store.geometry.coordinates[1],
        store.geometry.coordinates[0],
      ),
    );
  });
  return bounds;
}

function displayStoresAndLocation(
  stores: woosmap.map.stores.StoreResponse[],
  latlng: woosmap.map.LatLngLiteral,
) {
  if (activeLocation) {
    activeLocation.setMap(null);
  }

  if (stores && latlng) {
    activeLocation = new woosmap.map.Marker({
      position: latlng,
      icon: {
        url: "https://images.woosmap.com/marker.png",
        scaledSize: {
          height: 50,
          width: 32,
        },
      },
    });

    const bounds = calculateLatLngBounds(stores);
    bounds.extend(latlng);
    activeLocation.setMap(map);
    map.fitBounds(bounds, {}, true);
  }
}

function initMap() {
  map = new window.woosmap.map.Map(
    document.getElementById("map") as HTMLElement,
    mapOptions,
  );
  storesOverlay = new woosmap.map.StoresOverlay(storesStyle);
  storesOverlay.setMap(map);

  map.data.setStyle((feature: woosmap.map.data.Feature) => {
    const iconPint = feature.getProperty("highlighted")
      ? "https://images.woosmap.com/starbucks-marker-selected.svg"
      : "https://images.woosmap.com/starbucks-marker.svg";
    return { icon: iconPint };
  });

  map.addListener("click", (e) => {
    e.latlng && handleGeocode(e.latlng);
  });

  storesService = new woosmap.map.StoresService();
  localitiesService = new woosmap.map.LocalitiesService();
}

function handleError(error: woosmap.map.errors.APIError) {
  console.error("Error:", error);
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
// [END woosmap_stores_search]

export {};
