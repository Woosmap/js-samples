// [START woosmap_stores_list_sync_map]
let map: woosmap.map.Map;
let activeLocation: woosmap.map.Marker | null = null;
let storesOverlay: woosmap.map.StoresOverlay;
let storesService: woosmap.map.StoresService;
let localitiesService: woosmap.map.LocalitiesService;
let visibleStores: woosmap.map.stores.StoreResponse[] = [];
let allStores: woosmap.map.stores.StoreResponse[] = [];

const storesStyle: woosmap.map.Style = {
  breakPoint: 14,
  rules: [],
  default: {
    color: "#55baa6",
    size: 10,
    minSize: 3,
    icon: {
      url: "https://images.woosmap.com/marker-green.svg",
    },
    selectedIcon: {
      url: "https://images.woosmap.com/marker-red.svg",
    },
  },
};

const mapOptions: woosmap.map.MapOptions = {
  zoom: 5,
  center: {
    lat: 46.5,
    lng: 1.4,
  },
  styles: [{ featureType: "all", stylers: [{ saturation: -100 }] }],
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

// Function to filter stores based on map bounds
function filterStoresByBounds(
  stores: woosmap.map.stores.StoreResponse[],
  bounds: woosmap.map.LatLngBounds | null,
): woosmap.map.stores.StoreResponse[] {
  return stores.filter((store: woosmap.map.stores.StoreResponse) =>
    bounds
      ? bounds.contains({
          lat: store.geometry.coordinates[1],
          lng: store.geometry.coordinates[0],
        })
      : false,
  );
}

// Function to get all Stores recursively using query.page parameter
function getAllStores() {
  const allStores: woosmap.map.stores.StoreResponse[] = [];
  const query: woosmap.map.stores.StoresSearchRequest = { storesByPage: 300 };
  function getStores(storePage?: number) {
    if (storePage) {
      query.page = storePage;
    }
    return storesService
      .search(query)
      .then((response) => {
        allStores.push(...response.features);
        if (query.page === response.pagination.pageCount) {
          return allStores;
        }
        return getStores(response.pagination.page + 1);
      })
      .catch((err) => {
        console.error(err);
        throw new Error("Error getting all stores");
      });
  }

  return getStores();
}

function displayListStores(stores: woosmap.map.stores.StoreResponse[]) {
  const storeTemplates = stores.map(createStoreTemplate);
  const storeList = document.querySelector(".stores-list");
  if (storeList) {
    storeList.innerHTML = `<p style="padding: 0 0.8rem; font-size: 17px">Results: <strong>${stores.length}</strong> stores in bounds</p>`;
    storeList.innerHTML += storeTemplates.join("");
  }
  addClickListenerToStoreCards(stores);
}

function createStoreTemplate(
  store: woosmap.map.stores.StoreResponse,
  indexStore: number,
) {
  const { name, address, contact } = store.properties;
  const phoneHtml = contact.phone
    ? `<div class='store-contact'><a href='tel:${contact.phone}'>${contact.phone}</a></div>`
    : "";
  const websiteHtml = contact.website
    ? `<div class='store-website'><a href='${contact.website}' target="_blank">go to website</a></div>`
    : "";

  return `
    <div class='controls summary-store-card' data-index=${indexStore} data-store-id="${store.properties.store_id}">
      <div>
        <div><strong>${name}</strong></div>
        <div>
          <div class='store-address'>${
            (address && address.lines && address.lines.join(", ")) ||
            "Address not available"
          }</div>
          ${phoneHtml}
          ${websiteHtml}
        </div>
      </div>
    </div>`;
}

function addClickListenerToStoreCards(
  stores: woosmap.map.stores.StoreResponse[],
) {
  document.querySelectorAll(".summary-store-card").forEach((storeCard) => {
    storeCard.addEventListener("click", () => {
      storesOverlay.setSelection(stores[storeCard["dataset"].index]);
      const storeList = document.querySelector(".stores-list");
      if (storeList) {
        Array.from(storeList.children).forEach((child) =>
          child.classList.remove("active"),
        );
        storeCard.classList.add("active");
      }
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
  location && handleSearchResults(location);
}

function handleSearchResults(originalLatLng: woosmap.map.LatLngLiteral) {
  if (activeLocation) {
    activeLocation.setMap(null);
  }

  if (originalLatLng) {
    activeLocation = new woosmap.map.Marker({
      position: originalLatLng,
      icon: {
        url: "https://images.woosmap.com/marker.png",
        scaledSize: {
          height: 50,
          width: 32,
        },
      },
    });
    activeLocation.setMap(map);
    map.setCenter(originalLatLng);
    map.setZoom(8);
  }
}

function selectStoreOnList(storeId: string) {
  const storeList = document.querySelector(".stores-list");
  if (storeList) {
    const storeElement = Array.from(storeList.children).find(
      (child) => child.getAttribute("data-store-id") == storeId,
    );
    if (storeElement) {
      Array.from(storeList.children).forEach((child) =>
        child.classList.remove("active"),
      );
      storeElement.scrollIntoView();
      storeElement.classList.add("active");
    }
  }
}
function initMap() {
  map = new window.woosmap.map.Map(
    document.getElementById("map") as HTMLElement,
    mapOptions,
  );
  storesOverlay = new woosmap.map.StoresOverlay(storesStyle);
  storesOverlay.setMap(map);
  map.addListener("bounds_changed", () => {
    const bounds = map.getBounds();
    visibleStores = filterStoresByBounds(allStores, bounds);
    displayListStores(visibleStores);
  });
  window.woosmap.map.event.addListener(
    map,
    "store_selected",
    (store: woosmap.map.stores.StoreResponse) => {
      selectStoreOnList(store.properties.store_id);
    },
  );

  storesService = new woosmap.map.StoresService();
  localitiesService = new woosmap.map.LocalitiesService();

  getAllStores().then((stores: woosmap.map.stores.StoreResponse[]) => {
    allStores = stores;
    displayListStores(stores);
  });
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
// [END woosmap_stores_list_sync_map]

export {};
