// [START woosmap_stores_search]
// Initialize and add the map
let map: woosmap.map.Map;
let activeLocation, storesOverlay;
const gestureMode: woosmap.map.GestureHandlingMode = "greedy";
let storesService: woosmap.map.StoresService;
let localitiesService: woosmap.map.LocalitiesService;
const storesStyle = {
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

const mapOptions = {
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

const inputElement = document.getElementById("autocomplete-input");
const submitButton = document.getElementById("submit-button");

if (inputElement && submitButton) {
  inputElement.addEventListener("keydown", handleKeyPress);
  submitButton.addEventListener("click", handleGeocodeFromSubmit);
}

function handleKeyPress(e) {
  if (e.keyCode === 13) {
    handleGeocode(null);
  }
}

function handleGeocodeFromSubmit() {
  handleGeocode(null);
}

function displayListStores(stores) {
  const storeTemplates = stores.map(createStoreTemplate);
  const storeList = document.querySelector(".stores-list");
  if (storeList) {
    storeList.innerHTML = storeTemplates.join("");
  }
  addClickListenerToStoreCards(stores);
}

function createStoreTemplate(store, indexStore) {
  const { name, address, contact, distance } = store.properties;
  const phoneHtml = contact.phone
    ? `<div class='store-contact'><a href='tel:${contact.phone}'>${contact.phone}</a></div>`
    : "";
  const distanceHtml = distance
    ? `<div class='store-distance'>${distance}</div>`
    : "";

  return `
    <div class='controls summary-store-card' data-index=${indexStore}>
      <div>
        <div><strong>${name} - ${address.city}</strong></div>
        <div>
          <div class='store-address'>${address.lines.join(", ")}</div>
          ${phoneHtml}
          ${distanceHtml}
        </div>
      </div>
      <div class='store-photo'><img src='https://demo.woosmap.com/storelocator/images/default.svg'/></div>
    </div>`;
}

function addClickListenerToStoreCards(stores) {
  document.querySelectorAll(".summary-store-card").forEach((storeCard) => {
    storeCard.addEventListener("click", () => {
      console.log(stores[storeCard["dataset"].index]);
    });
  });
}
function createLocalitiesRequest(latlng) {
  if (inputElement) {
    return latlng ? { latLng: latlng } : { address: inputElement["value"] };
  }
}
function handleGeocode(latlng) {
  const localitiesRequest = createLocalitiesRequest(latlng);

  if (localitiesRequest) {
    localitiesService
      .geocode(localitiesRequest)
      .then((localities) => handleGeocodeResults(localities, latlng))
      .catch(handleError);
  }
}

function handleGeocodeResults(localities, latlng) {
  const location = localities.results[0]?.geometry.location;
  location && handleStoresSearch(location, latlng);
}

function handleStoresSearch(latlng, originalLatLng) {
  console.log(originalLatLng);
  const searchRequest = {
    storesByPage: 15,
    latLng: latlng,
  };

  storesService
    .search(searchRequest)
    .then((stores) => handleSearchResults(stores, latlng))
    .catch(handleError);
}

function handleSearchResults(stores, originalLatLng) {
  if (stores.features.length > 0) {
    displayListStores(stores.features);
    displayStoresAndLocation(stores.features, originalLatLng);
    clearAndAddGeoJsonToMap(stores);
  }
}

function clearAndAddGeoJsonToMap(stores) {
  map.data.forEach((feature) => map.data.remove(feature));
  map.data.addGeoJson(stores);
}

function calculateLatLngBounds(stores) {
  const bounds = new woosmap.map.LatLngBounds();
  stores.forEach((store) => {
    bounds.extend(
      new woosmap.map.LatLng(
        store.geometry.coordinates[1],
        store.geometry.coordinates[0],
      ),
    );
  });
  return bounds;
}

function displayStoresAndLocation(stores, latlng) {
  if (activeLocation) {
    activeLocation.setMap(null);
  }

  if (stores && latlng) {
    activeLocation = new woosmap.map.Marker({
      position: latlng,
      icon: {
        url: "https://images.woosmap.com/dot-marker.png",
        scaledSize: { height: 64, width: 46 },
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

  map.data.setStyle((feature) => {
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

function handleError(error) {
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
