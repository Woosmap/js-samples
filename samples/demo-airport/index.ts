// [START woosmap_demo_airport]
const componentsRestriction: woosmap.map.localities.LocalitiesComponentRestrictions =
  { country: [] };
let parkingRef = "";
let gateRef = "";
let parkingName = "";
let gateName = "";
let startingPoint: woosmap.map.LatLngLiteral | undefined | null;
const woosmap_key = "YOUR_API_KEY";
let debouncedAutocomplete: (
  ...args: any[]
) => Promise<woosmap.map.localities.LocalitiesAutocompleteResponse>;
let inputElement: HTMLInputElement;
let suggestionsList: HTMLUListElement;
let clearSearchBtn: HTMLButtonElement;
let map: woosmap.map.Map;
let markerAddress: woosmap.map.Marker;
let detailsHTML: HTMLElement;
let routeDetailsContainer: HTMLElement;
let directionsRenderer: woosmap.map.DirectionsRenderer;
let directionsService: woosmap.map.DirectionsService;
let indoorRenderer: woosmap.map.IndoorRenderer;
let indoorService: woosmap.map.IndoorService;
let transitService: woosmap.map.TransitService;
let transitRenderer: woosmap.map.TransitRenderer;

function initMap(): void {
  map = new woosmap.map.Map(document.getElementById("map") as HTMLElement, {
    center: {
      lat: 48.8534,
      lng: 2.3488,
    },
    disableDefaultUI: true,
    gestureHandling: "greedy",
    zoom: 5,
    styles: [
      {
        featureType: "poi",
        stylers: [{ visibility: "off" }],
      },
    ],
  });
  init();

  manageSelector();

  directionsRenderer = new woosmap.map.DirectionsRenderer();
  directionsService = new woosmap.map.DirectionsService();

  transitRenderer = new woosmap.map.TransitRenderer();
  transitService = new woosmap.map.TransitService();


  transitRenderer.setMap(map);

  indoorMap();
}

function indoorMap() {

  const originIcon = {
    url: ``,
    scaledSize: {
      height: 1,
      width: 1,
    }
  };
  const directionsIcons = {
    //destinationIcon: destinationIcon,
    originIcon: originIcon,
  };

  const conf = {
    defaultFloor: 0,
    venue: "2g_leo",
    directionsIcons: directionsIcons
  };

  indoorRenderer = new woosmap.map.IndoorRenderer(conf);
  indoorService = new woosmap.map.IndoorService();

  indoorRenderer.setMap(map);
}

function createAddressMarker(
  addressDetail: woosmap.map.localities.LocalitiesDetailsResult
) {
  if (markerAddress) {
    markerAddress.setMap(null);
  }
  if (addressDetail && addressDetail.geometry) {
    markerAddress = new woosmap.map.Marker({
      position: addressDetail.geometry.location,
      icon: {
        url: "https://images.woosmap.com/marker.png",
        scaledSize: {
          height: 59,
          width: 37,
        },
      },
    });
    markerAddress.setMap(map);
    panMap(addressDetail);
  }
}

function init(): void {
  inputElement = document.getElementById(
    "autocomplete-input"
  ) as HTMLInputElement;
  suggestionsList = document.getElementById(
    "suggestions-list"
  ) as HTMLUListElement;
  clearSearchBtn = document.getElementsByClassName(
    "clear-searchButton"
  )[0] as HTMLButtonElement;
  routeDetailsContainer = document.querySelector(
    ".routeDetails"
  ) as HTMLElement;
  detailsHTML = document.querySelector(
    ".routeDetails .routeOptions"
  ) as HTMLElement;
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
    detailsHTML.style.display = "none";
    inputElement.focus();
    markerAddress.setMap(null);
  });

  debouncedAutocomplete = debouncePromise(autocompleteAddress, 0);
}

function handleAutocomplete(): void {
  if (inputElement && suggestionsList) {
    let input = inputElement.value;
    input = input.replace('"', '\\"').replace(/^\s+|\s+$/g, "");
    const componentsArgs: string = (componentsRestriction.country as string[])
      .map((country) => `country:${country}`)
      .join("|");
    if (input !== "") {
      debouncedAutocomplete(input, componentsArgs, woosmap_key)
        .then(({ localities }) => displaySuggestions(localities))
        .catch((error) =>
          console.error("Error autocomplete localities:", error)
        );
    } else {
      suggestionsList.style.display = "none";
      clearSearchBtn.style.display = "none";
    }
  }
}

function displaySuggestions(
  localitiesPredictions: woosmap.map.localities.LocalitiesPredictions[]
) {
  if (inputElement && suggestionsList) {
    suggestionsList.innerHTML = "";
    if (localitiesPredictions.length > 0) {
      localitiesPredictions.forEach((locality) => {
        const li = document.createElement("li");
        li.innerHTML = formatPredictionList(locality) ?? "";
        li.addEventListener("click", () => {
          inputElement.value = locality.description ?? "";
          requestDetailsAddress(locality.public_id);
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
      matched_substrings.description
    );
  } else {
    formatted_name = prediction["description"];
  }

  let html = "";
  html += `<div class="prediction ${predictionClass}">${formatted_name}</div>`;

  return html;
}

function bold_matched_substring(string: string, matched_substrings: string[]) {
  matched_substrings = matched_substrings.reverse();
  for (const substring of matched_substrings) {
    const char = string.substring(
      substring["offset"],
      substring["offset"] + substring["length"]
    );
    string = `${string.substring(
      0,
      substring["offset"]
    )}<span class='bold'>${char}</span>${string.substring(
      substring["offset"] + substring["length"]
    )}`;
  }
  return string;
}

function autocompleteAddress(
  input: string,
  components: string
): Promise<woosmap.map.localities.LocalitiesAutocompleteResponse> {
  const args = {
    key: woosmap_key,
    input,
    no_deprecated_fields: "true",
    types: "locality|address",
    components,
  };
  if (components !== "") {
    if (args["components"]) {
      args["components"] = components;
    }
  }
  return fetch(
    `https://api.woosmap.com/localities/autocomplete/?${buildQueryString(args)}`
  ).then((response) => response.json());
}

function buildQueryString(params: object) {
  const queryStringParts = [];

  for (const key in params) {
    if (params[key]) {
      const value = params[key];
      queryStringParts.push(
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}` as never
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
  delay: number
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

function manageSelector() {
  const parkingElements = document.querySelectorAll(".parking");
  parkingElements.forEach((parkingElement: Element) => {
    parkingElement.addEventListener("click", () => {
      console.log("event click: ", parkingElement);
      parkingElements.forEach((parkingElement: Element) => {
        parkingElement.classList.remove("active");
      });
      toggleParking(parkingElement);
      calculateRoute();
      hideDropdowns();
    });
  });

  const gateElements = document.querySelectorAll(".gate");
  gateElements.forEach((gateElement: Element) => {
    gateElement.addEventListener("click", () => {
      console.log("event click: ", gateElement);
      gateElements.forEach((gateElement: Element) => {
        gateElement.classList.remove("active");
      });
      toggleGate(gateElement);
      calculateRoute();
      hideDropdowns();
    });
  });

  const dropdownButtons = document.querySelectorAll(
    ".dropdown .dropdown-button"
  );
  dropdownButtons.forEach((button: Element) =>
    button.addEventListener("click", toggleDropdown)
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
    ".dropdown-content"
  ) as HTMLElement;
  dropdownContent?.classList.remove("visible");
  dropdown.classList.remove("active");
}

function hideDropdowns() {
  const dropdowns = document.querySelectorAll(".dropdown");
  document.addEventListener("click", (event: Event) => {
    dropdowns.forEach((dropdown: Element) => {
      if (!dropdown.contains(event.target as Node)) {
        hideDropdown(dropdown);
      }
    });
  });
}

function showDropdown(dropdown: Element) {
  const dropdownContent = dropdown.querySelector(
    ".dropdown-content"
  ) as HTMLElement;
  dropdownContent?.classList.add("visible");
  dropdown.classList.add("active");
}

function toggleParking(parking: Element) {
  const isActive = parking.classList.toggle("active");
  const parkingref = (parking as HTMLElement).dataset.parkingref;
  const parkingname = (parking as HTMLElement).dataset.parkingname;

  if (parkingref && parkingname) {
    if (isActive) {
      parkingRef = parkingref;
      parkingName = parkingname;
    } else {
      parkingRef = "";
      parkingName = "";
    }
    updateSelectorText();
    handleAutocomplete();
  }
}

function toggleGate(gate: Element) {
  const isActive = gate.classList.toggle("active");
  const gateref = (gate as HTMLElement).dataset.gateref;
  const gatename = (gate as HTMLElement).dataset.gatename;

  if (gateref && gatename) {
    if (isActive) {
      gateRef = gateref;
      gateName = gatename;
    } else {
      gateRef = "";
      gateName = "";
    }
    updateSelectorText();
    handleAutocomplete();
  }
}

function updateSelectorText() {

  const parkingDropdownText = document.getElementById(
    "parkingDropdownButton"
  ) as HTMLElement;
  if (parkingName) {
    parkingDropdownText.textContent = parkingName;
  } else {
    parkingDropdownText.textContent = "Choisissez un parking";
  }

  const gateDropdownText = document.getElementById(
    "gateDropdownButton"
  ) as HTMLElement;
  if (gateName) {
    gateDropdownText.textContent = gateName;
  } else {
    gateDropdownText.textContent = "Choisissez une porte";
  }
}

function requestDetailsAddress(public_id: string) {
  getLocalitiesDetails(public_id).then(
    (addressDetails: woosmap.map.localities.LocalitiesDetailsResponse) => {
      displaySection(routeDetailsContainer);
      if (addressDetails) {
        createAddressMarker(addressDetails.result);
        startingPoint = addressDetails.result.geometry?.location;
        calculateRoute();
      }
    }
  );
}

function displaySection(section: HTMLElement, mode = "block"): void {
  section.style.display = mode;
}

function calculateRoute() {
  if (startingPoint && parkingRef && gateRef) {

    
    const parkingLocation = { lat: 49.0058196, lng: 2.6040213 };
    const dropingLocation = { lat: 49.0059366, lng: 2.6031107 };
    const transitLocation = { lat: 49.0056312, lng: 2.6029861 };
    let waypoint = parkingLocation;

    let outdoorDuration = 0;
    let indoorDuration = 0;

    if(parkingRef != "nv")
    {
      if(parkingRef != "p1")
        {
          waypoint = dropingLocation;
        }
      transitRenderer.setMap(null);
      const directionsRequest = {
        origin: startingPoint,
        destination: waypoint,
        provideRouteAlternatives: false,
        travelMode: woosmap.map.TravelMode.DRIVING,
      };

      directionsService.route(directionsRequest, (result, status) => {
        if (status === "OK") {
          outdoorDuration = result.routes[0].legs[0].duration.value;
          directionsRenderer.setDirections(result);
          directionsRenderer.setMap(map);
          fillRouteDetails(outdoorDuration, indoorDuration);
        } else {
          console.log("Directions request failed with status :" + status);
        }
      });
    }
    else{
      waypoint = transitLocation;
      directionsRenderer.setMap(null);
      const transitRouteRequest = {
        origin: startingPoint,
        destination: waypoint
      }
      transitService.route(transitRouteRequest).then((response) => {
              outdoorDuration = response.routes[0].duration;
              transitRenderer.setRoutes(response.routes);
              transitRenderer.setMap(map);
              fillRouteDetails(outdoorDuration, indoorDuration);
          }).catch((error) => {
            console.error("Error calculating transit route:", error);
          });
    }

    const origin = new woosmap.map.LatLng(waypoint.lat, waypoint.lng);
    console.log("DEBUG", origin);

    indoorService.directions(
      {
        venueId: "2g_leo",
        originId: "ref:" + parkingRef,
        destinationId: "ref:" + gateRef,
        units: "metric",
      },
      (result) => {
        indoorDuration = result.routes[0].legs[0].duration.value;
        indoorRenderer.setDirections(result);
        fillRouteDetails(outdoorDuration, indoorDuration);
      }
    );
    fillRouteDetails(outdoorDuration, indoorDuration);
  }
}

function panMap(addressDetail: woosmap.map.localities.LocalitiesDetailsResult) {
  let geometry;
  if (addressDetail && addressDetail.geometry) {
    geometry = addressDetail.geometry;
  }
  if (
    addressDetail &&
    addressDetail.geometry &&
    addressDetail.geometry.viewport
  ) {
    const { viewport } = geometry;
    const bounds = {
      east: viewport.northeast.lng,
      south: viewport.southwest.lat,
      north: viewport.northeast.lat,
      west: viewport.southwest.lng,
    };
    map.fitBounds(bounds);
    map.panTo(addressDetail.geometry.location);
  } else {
    let zoom = 17;
    if (addressDetail.types[0] === "address") {
      zoom = 18;
    }
    map.setZoom(zoom);
    map.panTo(geometry.location);
  }
}

function fillRouteDetails(outdoorDuration: number, indoorDuration: number) {
  const details: string[] = [];
  detailsHTML.innerHTML = "";
  detailsHTML.style.display = "block";

  const durationText = Math.trunc((outdoorDuration + indoorDuration)/3600) + " h " + Math.round((outdoorDuration + indoorDuration - Math.trunc((outdoorDuration + indoorDuration)/3600)*3600)/60) + " min"
  const durationOutdoorText = Math.trunc(outdoorDuration/3600) + " h " + Math.round((outdoorDuration - Math.trunc(outdoorDuration/3600)*3600)/60) + " min"
  const durationIndoorText = Math.trunc(indoorDuration/3600) + " h " + Math.round((indoorDuration - Math.trunc(indoorDuration/3600)*3600)/60) + " min"

  if (true) {
    details.push(
      `<p class='option-detail'><span class='option-detail-label'>Temps de trajet : </span><span class='bold'>${durationText}</span></p>`,
    );
  }
  if (true) {
    details.push(
      `<p class='option-detail'><span class='option-detail-label'>Outdoor : </span><span class='bold'>${durationOutdoorText}</span></p>`,
    );
    details.push(
      `<p class='option-detail'><span class='option-detail-label'>Indoor : </span><span class='bold'>${durationIndoorText}</span></p>`,
    );
  }
  detailsHTML.innerHTML = details.join("");
}

function getLocalitiesDetails(
  publicId: string
): Promise<woosmap.map.localities.LocalitiesDetailsResponse> {
  const args = {
    key: woosmap_key,
    public_id: publicId,
  };
  return fetch(
    `https://api.woosmap.com/localities/details/?${buildQueryString(args)}`
  ).then((response) => response.json());
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;

// [END woosmap_demo_airport]

export {};
