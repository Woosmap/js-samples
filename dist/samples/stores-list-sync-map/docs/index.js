// [START woosmap_stores_list_sync_map]
let map;
let activeLocation = null;
let storesOverlay;
let storesService;
let localitiesService;
let visibleStores = [];
let allStores = [];
const storesStyle = {
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
const mapOptions = {
  zoom: 5,
  center: {
    lat: 46.5,
    lng: 1.4,
  },
  styles: [{ featureType: "all", stylers: [{ saturation: -100 }] }],
};
const inputElement = document.getElementById("autocomplete-input");
const submitButton = document.getElementById("submit-button");

if (inputElement && submitButton) {
  inputElement.addEventListener("keydown", handleKeyPress);
  submitButton.addEventListener("click", handleGeocodeFromSubmit);
}

function handleKeyPress(event) {
  if (event.key === "Enter") {
    handleGeocode(null);
  }
}

function handleGeocodeFromSubmit() {
  handleGeocode(null);
}

// Function to filter stores based on map bounds
function filterStoresByBounds(stores, bounds) {
  return stores.filter((store) =>
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
  const allStores = [];
  const query = { storesByPage: 300 };

  function getStores(storePage) {
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

function displayListStores(stores) {
  const storeTemplates = stores.map(createStoreTemplate);
  const storeList = document.querySelector(".stores-list");

  if (storeList) {
    storeList.innerHTML = `<p style="padding: 0 0.8rem; font-size: 17px">Results: <strong>${stores.length}</strong> stores in bounds</p>`;
    storeList.innerHTML += storeTemplates.join("");
  }

  addClickListenerToStoreCards(stores);
}

function createStoreTemplate(store, indexStore) {
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

function addClickListenerToStoreCards(stores) {
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

function createLocalitiesRequest(latlng) {
  if (!inputElement) {
    return null;
  }

  if (latlng) {
    return { latLng: latlng };
  }
  return { address: inputElement.value };
}

function handleGeocode(latlng) {
  const localitiesRequest = createLocalitiesRequest(latlng);

  if (localitiesRequest) {
    localitiesService
      .geocode(localitiesRequest)
      .then((localities) => handleGeocodeResults(localities))
      .catch(handleError);
  }
}

function handleGeocodeResults(localities) {
  const location = localities.results[0]?.geometry?.location;

  location && handleSearchResults(location);
}

function handleSearchResults(originalLatLng) {
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

function selectStoreOnList(storeId) {
  const storeList = document.querySelector(".stores-list");

  if (storeList) {
    if (storeId) {
      const storeElement = Array.from(storeList.children).find(
        (child) => child.getAttribute("data-store-id") == storeId,
      );

      if (storeElement) {
        Array.from(storeList.children).forEach((child) =>
          child.classList.remove("active"),
        );
        storeElement.scrollIntoView({ block: "nearest" });
        storeElement.classList.add("active");
      }
    } else {
      Array.from(storeList.children).forEach((child) =>
        child.classList.remove("active"),
      );
    }
  }
}

// Debounce function
function debounce(func, wait) {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

function initMap() {
  map = new window.woosmap.map.Map(document.getElementById("map"), mapOptions);
  storesOverlay = new woosmap.map.StoresOverlay(storesStyle);
  storesOverlay.setMap(map);
  map.addListener(
    "bounds_changed",
    debounce(() => {
      const bounds = map.getBounds();

      visibleStores = filterStoresByBounds(allStores, bounds);
      displayListStores(visibleStores);
    }, 50),
  );
  window.woosmap.map.event.addListener(map, "store_selected", (store) => {
    selectStoreOnList(store.properties.store_id);
  });
  window.woosmap.map.event.addListener(map, "store_unselected", () => {
    selectStoreOnList();
  });
  storesService = new woosmap.map.StoresService();
  localitiesService = new woosmap.map.LocalitiesService();
  getAllStores().then((stores) => {
    allStores = stores;
    displayListStores(stores);
  });
}

function handleError(error) {
  console.error("Error:", error);
}

window.initMap = initMap;
// [END woosmap_stores_list_sync_map]
