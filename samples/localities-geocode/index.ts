// [START woosmap_localities_geocode]
// Initialize and add the map
import LocalitiesGeocodeRequest = woosmap.map.localities.LocalitiesGeocodeRequest;

let map: woosmap.map.Map;
let marker: woosmap.map.Marker;
let infoWindow: woosmap.map.InfoWindow;
let pr_marker: woosmap.map.Marker;
let pr_infoWindow: HTMLElement | null;
let localitiesService: woosmap.map.LocalitiesService;
const request: woosmap.map.localities.LocalitiesGeocodeRequest = {};
const componentsRestriction: woosmap.map.localities.LocalitiesComponentRestrictions =
  { country: [] };

function initMap() {
  map = new window.woosmap.map.Map(
    document.getElementById("map") as HTMLElement,
    {
      center: { lat: 43.77751768293183, lng: 11.2553439740075 },
      zoom: 12,
    },
  );
  infoWindow = new woosmap.map.InfoWindow({});
  pr_infoWindow = document.getElementById("instructions")
  localitiesService = new woosmap.map.LocalitiesService();
  map.addListener("click", (e) => {
    handleGeocode(e.latlng);
  });
  manageCountrySelector();
}

const inputElement = document.getElementById(
  "autocomplete-input",
) as HTMLInputElement;
const clearSearchBtn = document.getElementsByClassName(
  "clear-searchButton",
)[0] as HTMLButtonElement;

if (inputElement) {
  inputElement.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      handleGeocode(null);
    }
  });
  inputElement.addEventListener("input", () => {
    if (inputElement.value !== "") {
      clearSearchBtn.style.display = "block";
    } else {
      clearSearchBtn.style.display = "none";
    }
  });
}
clearSearchBtn.addEventListener("click", () => {
  inputElement.value = "";
  clearSearchBtn.style.display = "none";
  if (marker) {
    marker.setMap(null);
    infoWindow.close();
  }
  if (pr_marker) {
    pr_marker.setMap(null);
  }
  inputElement.focus();
});

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
function getSecondaryUrl():string {
  let secondary_target = document.getElementById("secondary-target") as HTMLInputElement
  if (secondary_target && secondary_target.value) {
    return `https://develop-api.woosmap.com/${secondary_target.value}`
  }
  return "https://develop-api.woosmap.com"
}

const pr_reverse_geocode = async (request:LocalitiesGeocodeRequest): Promise<any> => {
  let params = {
    "key": "woos-b2f35903-92d8-3a95-9b35-dd503c752a51"
  }
  if (request.latLng) {
      params["latlng"] = `${request.latLng.lat},${request.latLng.lng}`;
  }
  if (request.address) {
      params["address"] = request.address;
  }
  if(request.components) {
    params["components"] = (request.components.country as string[])
      .map((country) => `country:${country}`)
      .join("|");
  }
  let list_sub_buildings: HTMLInputElement= document.getElementById("list-sub-buildings") as HTMLInputElement;
  if (list_sub_buildings && list_sub_buildings.checked) {
    console.log("list sub buildings")
    params["list_sub_buildings"] = "1";
  }
  try {
    const response = await fetch(
      `${getSecondaryUrl()}/localities/geocode?${buildQueryString(params)}`
    );
    return await response.json();
  } catch (error) {
    console.error("Error fetching PR:", error);
    throw error;
  }
};

function handleGeocode(latlng: woosmap.map.LatLngLiteral | null) {
  if (latlng) {
    request.latLng = latlng;
    delete request.address;
  } else if (inputElement?.value !== "") {
    request.address = inputElement.value;
    delete request.latLng;
  }
  request.components = componentsRestriction

  if (request.latLng || request.address) {
    localitiesService
      .geocode(request)
      .then((localities) => displayLocality(localities.results[0]))
      .catch((error) => console.error("Error geocoding localities:", error));
    pr_reverse_geocode(request).then((localities:woosmap.map.localities.LocalitiesGeocodeResponse) => displayPRLocality(localities.results[0]))
      .catch((error) => console.error("Error geocoding localities:", error));

  }
}

function displayLocality(
  locality: woosmap.map.localities.LocalitiesGeocodeResult | null,
) {
  if (marker) {
    marker.setMap(null);
    infoWindow.close();
  }

  if (locality?.geometry) {
    marker = new woosmap.map.Marker({
      position: locality.geometry.location,
      icon: {
        url: "https://images.woosmap.com/marker.png",
        scaledSize: {
          height: 50,
          width: 32,
        },
      },
    });
    marker.setMap(map);
    infoWindow.setContent(`<span>${locality.formatted_address}</span>`);
    infoWindow.open(map, marker);
    map.setCenter(locality.geometry.location);
    if (map.getZoom() < 14) {
      map.setZoom(14);
    }
  }
}

function displayPRLocality(
  locality: woosmap.map.localities.LocalitiesGeocodeResult | null,
) {
  if (pr_marker) {
    pr_marker.setMap(null);
  }

  if (locality?.geometry) {
    pr_marker = new woosmap.map.Marker({
      position: locality.geometry.location,
      icon: {
        url: "https://images.woosmap.com/marker-red.png",
        scaledSize: {
          height: 50,
          width: 32,
        },
      },
    });
    pr_marker.setMap(map);
    if (pr_infoWindow) {
      pr_infoWindow.textContent = `[PR says] ${locality.formatted_address} (red marker)`;
    }

  }
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
// [END woosmap_localities_geocode]

function manageCountrySelector() {
  const countryElements = document.querySelectorAll(".country");
  countryElements.forEach((countryElement: Element) => {
    countryElement.addEventListener("click", () => {
      toggleCountry(countryElement);
    });
    if (countryElement.classList.contains("active")) {
      const countryCode = (countryElement as HTMLElement).dataset
        .countrycode as string;
      componentsRestriction.country = [
        ...(componentsRestriction.country as string[]),
        countryCode,
      ];
    }
  });

  const dropdownButtons = document.querySelectorAll(
    ".dropdown .dropdown-button",
  );
  dropdownButtons.forEach((button: Element) =>
    button.addEventListener("click", toggleDropdown),
  );

  // Hide dropdowns when clicking outside
  const dropdowns = document.querySelectorAll(".dropdown");
  document.addEventListener("click", (event: Event) => {
    dropdowns.forEach((dropdown: Element) => {
      if (!dropdown.contains(event.target as Node)) {
        hideDropdown(dropdown);
      }
    });
  });
}

function toggleDropdown(event: Event) {
  event.stopPropagation();
  const dropdown = (event.target as Element).closest(".dropdown");
  if (dropdown) {
    if (dropdown.classList.contains("active")) {
      hideDropdown(dropdown);
    } else {
      showDropdown(dropdown);
    }
  }
}

function hideDropdown(dropdown: Element) {
  const dropdownContent = dropdown.querySelector(
    ".dropdown-content",
  ) as HTMLElement;
  dropdownContent?.classList.remove("visible");
  dropdown.classList.remove("active");
}

function showDropdown(dropdown: Element) {
  const dropdownContent = dropdown.querySelector(
    ".dropdown-content",
  ) as HTMLElement;
  dropdownContent?.classList.add("visible");
  dropdown.classList.add("active");
}

function toggleCountry(country: Element) {
  const isActive = country.classList.toggle("active");
  const countryCode = (country as HTMLElement).dataset.countrycode;

  if (countryCode) {
    if (isActive) {
      componentsRestriction.country = [
        ...(componentsRestriction.country as string[]),
        countryCode,
      ];
    } else {
      componentsRestriction.country = (
        componentsRestriction.country as string[]
      ).filter((code) => code !== countryCode);
    }
    updateCountrySelectorText();
  }
}

function updateCountrySelectorText() {
  const dropdownText = document.querySelector(
    ".dropdown-button span",
  ) as HTMLElement;
  const inputPlaceholder = document.querySelector("#autocomplete-input") as HTMLInputElement;
  if (componentsRestriction.country.length > 0) {
    inputElement.readOnly = false;
    dropdownText.innerHTML = `Selected countries: <strong>${(componentsRestriction.country as string[]).join("</strong>, <strong>")}</strong>`;
    inputPlaceholder.placeholder = `Search for a place in ${(componentsRestriction.country as string[]).join(" or ")}...`
  } else {
    dropdownText.textContent = "Select countries";
    inputElement.readOnly = true;
    inputPlaceholder.placeholder = "Select at least one country to proceed."
  }
}

export {};
