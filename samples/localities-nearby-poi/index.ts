// [START woosmap_localities_nearby_poi]
const availableCategories = [
  "business",
  "business.cinema",
  "business.theatre",
  "business.nightclub",
  "business.finance",
  "business.finance.bank",
  "business.fuel",
  "business.parking",
  "business.mall",
  "business.food_and_drinks",
  "business.food_and_drinks.bar",
  "business.food_and_drinks.biergarten",
  "business.food_and_drinks.cafe",
  "business.food_and_drinks.fast_food",
  "business.food_and_drinks.pub",
  "business.food_and_drinks.restaurant",
  "business.food_and_drinks.food_court",
  "business.shop",
  "business.shop.mall",
  "business.shop.bakery",
  "business.shop.butcher",
  "business.shop.library",
  "business.shop.grocery",
  "business.shop.sports",
  "business.shop.toys",
  "business.shop.clothes",
  "business.shop.furniture",
  "business.shop.electronics",
  "education",
  "education.school",
  "education.kindergarten",
  "education.university",
  "education.college",
  "education.library",
  "hospitality",
  "hospitality.hotel",
  "hospitality.hostel",
  "hospitality.guest_house",
  "hospitality.bed_and_breakfast",
  "hospitality.motel",
  "medical",
  "medical.hospital",
  "medical.pharmacy",
  "medical.clinic",
  "tourism",
  "tourism.attraction",
  "tourism.attraction.amusement_park",
  "tourism.attraction.zoo",
  "tourism.attraction.aquarium",
  "tourism.monument",
  "tourism.monument.castle",
  "tourism.museum",
  "government",
  "park",
  "place_of_worship",
  "police",
  "post_office",
  "sports",
];
const categories: Set<string> = new Set();
let map: woosmap.map.Map;
let results: HTMLOListElement;
let nearbyCircle: woosmap.map.Circle;
let marker: woosmap.map.Marker;
let localitiesService: woosmap.map.LocalitiesService;
let autocompleteRequest: woosmap.map.localities.LocalitiesAutocompleteRequest;
let nearbyRequest: woosmap.map.localities.LocalitiesNearbyRequest;

const buildTree = (availableCategories: string[]) => {
  const tree = {};
  availableCategories.forEach((category) => {
    const parts = category.split(".");
    let node = tree;
    parts.forEach((part) => {
      node[part] = node[part] || {};
      node = node[part];
    });
  });
  return tree;
};

const createList = (node: any, prefix = "") => {
  const ul = document.createElement("ul");
  for (const key in node) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `category-${fullKey}`;
    checkbox.name = "categories";
    checkbox.classList.add("category");
    checkbox.value = fullKey;

    const label = document.createElement("label");
    label.htmlFor = `category-${fullKey}`;
    label.textContent = key;

    li.appendChild(checkbox);
    li.appendChild(label);

    const children = createList(node[key], fullKey);
    if (children) {
      li.appendChild(children);
    }
    ul.appendChild(li);
  }
  return ul.childElementCount ? ul : null;
};

function initMap() {
  map = new window.woosmap.map.Map(
    document.getElementById("map") as HTMLElement,
    {
      center: { lat: 40.71399, lng: -74.00499 },
      zoom: 14,
      styles: [
        {
          featureType: "point_of_interest",
          elementType: "all",
          stylers: [
            {
              visibility: "on",
            },
          ],
        },
      ],
    },
  );
  localitiesService = new woosmap.map.LocalitiesService();

  autocompleteRequest = {
    input: "",
    types: ["locality", "postal_code"],
  };
  nearbyRequest = {
    types: "point_of_interest",
    location: map.getCenter(),
    radius: 1000,
    categories: "",
    page: 1,
    limit: 10,
  };
  marker = new woosmap.map.Marker({
    position: { lat: 0, lng: 0 },
    icon: {
      url: "https://images.woosmap.com/marker.png",
      scaledSize: {
        height: 50,
        width: 32,
      },
    },
  });

  initUI();
  performNearbyRequest();
}

function buildCategoriesList() {
  const tree = buildTree(availableCategories);
  const list = createList(tree);
  (
    document.querySelector(".categoriesOptions__list") as HTMLDivElement
  ).appendChild(list as HTMLElement);
  document.querySelectorAll(".category").forEach((el) =>
    el.addEventListener("click", (ev) => {
      const inputElement = ev.target as HTMLInputElement;
      const parentLi = inputElement.closest("li");
      const childrenCheckboxes = parentLi
        ? Array.from(parentLi.children)
            .filter((child) => child !== inputElement)
            .flatMap((child) => Array.from(child.querySelectorAll(".category")))
        : [];

      if (inputElement.checked) {
        categories.add(inputElement.value);
        if (childrenCheckboxes.length > 0) {
          childrenCheckboxes.forEach((checkbox) => {
            (checkbox as HTMLInputElement).disabled = true;
          });
        }
      } else {
        categories.delete(inputElement.value);
        if (childrenCheckboxes.length > 0) {
          childrenCheckboxes.forEach((checkbox) => {
            (checkbox as HTMLInputElement).disabled = false;
          });
        }
      }
      performNearbyRequest();
    }),
  );
}

function handleRadius(
  radiusValue: number,
  center?: woosmap.map.LatLng | woosmap.map.LatLngLiteral | null,
) {
  const label = document.getElementById("radius-label");
  if (radiusValue < 1000 && label) {
    label.innerHTML = `${radiusValue}&thinsp;m`;
  } else if (label) {
    label.innerHTML = `${radiusValue / 1000}&thinsp;km`;
  }
  // circle.getBounds() returns wrong LatLngBounds -> const bounds = nearbyCircle.getBounds();
  // TODO fixed circle getBounds
  // used this log scale to compute the zoom level between z18 (radius 10m) and z7 (radius 50km)
  const zoomLevel = Math.round(
    18 - (Math.log(radiusValue / 10) / Math.log(50000 / 10)) * (18 - 7),
  );
  map.flyTo({ center: center || nearbyCircle.getCenter(), zoom: zoomLevel });
  performNearbyRequest();
}

function initUI() {
  results = document.querySelector("#results") as HTMLOListElement;
  buildCategoriesList();
  const debouncedHandleRadius = debounce(handleRadius, 300);

  document.getElementById("radius")?.addEventListener("input", (e) => {
    const radiusValue = parseInt((e.target as HTMLInputElement).value);
    debouncedHandleRadius(radiusValue);
  });
  document.getElementById("page-previous")?.addEventListener("click", previousPage);
  document.getElementById("page-next")?.addEventListener("click", nextPage);
}
function previousPage(){
  let newQuery = true
  if(nearbyRequest.page && nearbyRequest.page > 1) {
    nearbyRequest.page--;
    newQuery=false;
  }
  performNearbyRequest(null, newQuery);
}

function nextPage(){
  let newQuery = true
  if(nearbyRequest.page) {
    nearbyRequest.page++;
    newQuery=false;
  }
  performNearbyRequest(null, newQuery);
}

function performNearbyRequest(
  overrideCenter: woosmap.map.LatLng | null = null,
  newQuery = true,
) {
  const requestCenter = overrideCenter || map.getCenter();
  const radiusElement = document.getElementById("radius") as HTMLInputElement;
  nearbyRequest.location = requestCenter;
  nearbyRequest.radius = radiusElement
    ? parseInt(radiusElement.value)
    : 1000;
  nearbyRequest.categories = "";
  if (categories.size > 0) {
    nearbyRequest.categories = Array.from(categories).join("|");
  }
  if (newQuery) {
    nearbyRequest.page = 1;
  }

  //@ts-ignore
  localitiesService.nearby(nearbyRequest).then((responseJson) => {
    drawNearbyZone(requestCenter, nearbyRequest.radius);
    updateResults(responseJson, requestCenter);
  });
}

function drawNearbyZone(center, radius) {
  if (nearbyCircle) {
    nearbyCircle.setMap(null);
  }
  nearbyCircle = new woosmap.map.Circle({
    map,
    center: center,
    radius: radius,
    strokeColor: "#1165c2",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#3283c5",
    fillOpacity: 0.2,
  });
}

function updatePagination(pagination: woosmap.map.localities.LocalitiesNearbyPagination) {
  if (pagination.next_page) {
    document.getElementById("page-next")?.removeAttribute("disabled");
  } else {
    document.getElementById("page-next")?.setAttribute("disabled", "true");
  }
  if(pagination.previous_page) {
    document.getElementById("page-previous")?.removeAttribute("disabled");
  } else {
    document.getElementById("page-previous")?.setAttribute("disabled", "true");
  }
}

function updateResults(response: woosmap.map.localities.LocalitiesNearbyResponse, center) {
  results.innerHTML = "";

  updatePagination(response.pagination);
  response.results.forEach((result:woosmap.map.localities.LocalitiesNearbyResult) => {
    const distance = measure(
      center.lat(),
      center.lng(),
      result.geometry.location.lat,
      result.geometry.location.lng,
    );
    const resultListItem = document.createElement("li");
    resultListItem.innerHTML = `
        <b>${result.name}</b>
        <i>${result.categories}</i>
        
        <span class="distance">${distance.toFixed(0)}m</span>
    `;
    resultListItem.addEventListener("click", () => {
      map.setCenter({
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
      });

      marker.setPosition({
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
      });
      marker.setMap(map);
    });
    results.appendChild(resultListItem);
  });
}

function measure(lat1, lon1, lat2, lon2) {
  // generally used geo measurement function
  const R = 6378.137; // Radius of earth in KM
  const dLat = (lat2 * Math.PI) / 180 - (lat1 * Math.PI) / 180;
  const dLon = (lon2 * Math.PI) / 180 - (lon1 * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d * 1000; // meters
}

const inputElement = document.getElementById(
  "autocomplete-input",
) as HTMLInputElement;
const suggestionsList = document.getElementById(
  "suggestions-list",
) as HTMLUListElement;
const clearSearchBtn = document.getElementsByClassName(
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

function handleAutocomplete(): void {
  if (inputElement && suggestionsList) {
    autocompleteRequest.input = inputElement.value;
    if (autocompleteRequest.input) {
      localitiesService
        .autocomplete(autocompleteRequest)
        .then((localities) => displaySuggestions(localities))
        .catch((error) =>
          console.error("Error autocomplete localities:", error),
        );
    } else {
      suggestionsList.style.display = "none";
      clearSearchBtn.style.display = "none";
    }
  }
}

function handleDetails(publicId: string) {
  localitiesService
    .getDetails({ publicId })
    .then((locality) => displayLocality(locality.result))
    .catch((error) => console.error("Error getting locality details:", error));
}

function displayLocality(
  locality: woosmap.map.localities.LocalitiesDetailsResult,
) {
  if (locality?.geometry && nearbyRequest.radius) {
    map.setCenter(locality.geometry.location);
    handleRadius(nearbyRequest.radius, locality.geometry.location);
  }
}

function displaySuggestions(
  localitiesPredictions: woosmap.map.localities.LocalitiesAutocompleteResponse,
) {
  if (inputElement && suggestionsList) {
    suggestionsList.innerHTML = "";
    if (localitiesPredictions.localities.length > 0 && autocompleteRequest["input"]) {
      localitiesPredictions.localities.forEach((locality) => {
        const li = document.createElement("li");
        li.textContent = locality.description ?? "";
        li.addEventListener("click", () => {
          inputElement.value = locality.description ?? "";
          suggestionsList.style.display = "none";
          handleDetails(locality.public_id);
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

document.addEventListener("click", (event) => {
  const targetElement = event.target as Element;
  const isClickInsideAutocomplete = targetElement.closest(
    "#autocomplete-container",
  );

  if (!isClickInsideAutocomplete && suggestionsList) {
    suggestionsList.style.display = "none";
  }
});

function debounce(func: (...args: any[]) => void, wait: number) {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
// [END woosmap_localities_nearby_poi]

export {};
