// [START woosmap_directions_advanced]
let map: woosmap.map.Map;
let bounds: woosmap.map.LatLngBounds;
let directionsService: woosmap.map.DirectionsService;
let directionsRequest: woosmap.map.DirectionRequest;
let markersArray: woosmap.map.Marker[] = [];
let waypointsList: HTMLElement;
let originContainer: HTMLElement;
let destinationContainer: HTMLElement;
const waypoints: woosmap.map.DirectionsWayPoint[] = [];
let directionsRenderer: woosmap.map.DirectionsRenderer;
const travelModeIcons = {
  DRIVING: "https://images.woosmap.com/directions/drive_black.png",
  WALKING: "https://images.woosmap.com/directions/walk_black.png",
  CYCLING: "https://images.woosmap.com/directions/bicycle_black.png",
};

function createMarker(
  position: woosmap.map.LatLngLiteral | woosmap.map.LatLng,
  label: string,
  url: string,
): woosmap.map.Marker {
  return new woosmap.map.Marker({
    map,
    position,
    draggable: true,
    icon: {
      url,
      labelOrigin: new woosmap.map.Point(13, 15),
      scaledSize: {
        height: 38,
        width: 26,
      },
    },
    label: {
      text: label,
      color: "white",
    },
  });
}

function clearMarkers(): void {
  for (const marker of markersArray) {
    marker.setMap(null);
  }
  markersArray = [];
}

function displayDirectionsMarkers(): void {
  clearMarkers();
  const originMarker = createMarker(
    directionsRequest.origin,
    "O",
    "https://images.woosmap.com/marker-blue.svg",
  );
  originMarker.addListener("dragend", () => {
    directionsRequest.origin = originMarker.getPosition();
    setLatLngToContainer(originContainer, originMarker.getPosition().toJSON());
    calculateDirections();
  });
  const destinationMarker = createMarker(
    directionsRequest.destination,
    "D",
    "https://images.woosmap.com/marker-red.svg",
  );
  destinationMarker.addListener("dragend", () => {
    directionsRequest.destination = destinationMarker.getPosition();
    setLatLngToContainer(
      destinationContainer,
      destinationMarker.getPosition().toJSON(),
    );
    calculateDirections();
  });
  markersArray.push(originMarker);
  markersArray.push(destinationMarker);
  bounds.extend(directionsRequest.origin as woosmap.map.LatLngLiteral);
  bounds.extend(directionsRequest.destination as woosmap.map.LatLngLiteral);
  waypoints.forEach((waypoint, index) => {
    bounds.extend(waypoint.location as woosmap.map.LatLngLiteral);
    const waypointMarker = createMarker(
      waypoint.location as woosmap.map.LatLngLiteral,
      (index + 1).toString(),
      "https://images.woosmap.com/marker-green.svg",
    );
    waypointMarker.addListener("dragend", () => {
      waypoints[index].location = waypointMarker.getPosition().toJSON();
      waypointsList.querySelectorAll("li")[index].innerHTML =
        `<span>lat: ${waypointMarker.getPosition().lat().toFixed(4)}, lng: ${waypointMarker.getPosition().lng().toFixed(4)}<span>`;
      calculateDirections();
    });
    markersArray.push(waypointMarker);
  });

  map.fitBounds(bounds, { top: 70, bottom: 40, left: 50, right: 50 }, true);
}

function createDefaultRequest(): woosmap.map.DirectionRequest {
  const origin = { lat: 51.6511, lng: -0.1615 };
  const destination = { lat: 51.5146, lng: -0.0212 };
  waypoints.push(
    { location: { lat: 51.4855, lng: -0.3179 } },
    { location: { lat: 51.5074, lng: -0.1278 } },
  );
  setLatLngToContainer(originContainer, origin);
  setLatLngToContainer(destinationContainer, destination);
  for (const waypoint of waypoints) {
    addLatLngToList(
      waypointsList,
      waypoint.location as woosmap.map.LatLngLiteral,
    );
  }

  return {
    origin,
    destination,
    waypoints,
    details: "full",
    provideRouteAlternatives: true,
    travelMode: woosmap.map.TravelMode.DRIVING,
    unitSystem: woosmap.map.UnitSystem.METRIC,
  };
}

function addLatLngToList(
  element: HTMLElement,
  location: woosmap.map.LatLngLiteral,
): void {
  const locationElement = document.createElement("li");
  locationElement.innerHTML = `<span>lat: ${location.lat.toFixed(4)}, lng: ${location.lng.toFixed(4)}<span>`;
  const removeButton = document.createElement("button");
  removeButton.classList.add("clear-searchButton");
  removeButton.innerHTML =
    '<svg class="clear-icon" viewBox="0 0 24 24"><path d="M7.074 5.754a.933.933 0 1 0-1.32 1.317L10.693 12l-4.937 4.929a.931.931 0 1 0 1.319 1.317l4.938-4.93 4.937 4.93a.933.933 0 0 0 1.581-.662.93.93 0 0 0-.262-.655L13.331 12l4.937-4.929a.93.93 0 0 0-.663-1.578.93.93 0 0 0-.656.261l-4.938 4.93z"></path></svg> ';
  removeButton.addEventListener("click", () => {
    element.removeChild(locationElement);
    if (element === waypointsList) {
      waypoints.splice(
        waypoints.findIndex((w) => w.location === location),
        1,
      );
    }
    calculateDirections();
  });
  locationElement.appendChild(removeButton);
  element.appendChild(locationElement);
}

function setLatLngToContainer(
  element: HTMLElement,
  location: woosmap.map.LatLngLiteral,
): void {
  element.innerHTML = `<li><span>lat: ${location.lat.toFixed(4)}, lng: ${location.lng.toFixed(4)}<span></li>`;
}

function createRoutesTable(response: woosmap.map.DirectionResult) {
  const directionTripElements = response.routes.map(
    (route: woosmap.map.DirectionRoute, index: number) => {
      const leg = route.legs[0];
      const distanceTotal = route.legs.reduce(
        (total, leg) => total + leg.distance.value,
        0,
      );
      const durationTotal = route.legs.reduce(
        (total, leg) => total + leg.duration.value,
        0,
      );
      const directionTrip = document.createElement("div");
      directionTrip.className = "directionTrip";
      if (index === 0) {
        directionTrip.classList.add("directionTrip__selected");
      }
      const travelModeIconSrc =
        travelModeIcons[directionsRequest.travelMode as string] ||
        travelModeIcons["DRIVING"];

      directionTrip.innerHTML = `
            <img class="directionTrip__travelModeIcon" src="${travelModeIconSrc}">
            <div class="directionTrip__description">
                <div class="directionTrip__numbers">
                    <div class="directionTrip__duration">${formatTime(durationTotal)}</div>
                    <div class="directionTrip__distance">${formatDistance(distanceTotal)}</div>
                </div>
                <div class="directionTrip__title">through ${route.main_route_name ? route.main_route_name : JSON.stringify(leg.start_location)}</div>
                <div class="directionTrip__summary">${formatTime(durationTotal)} ${directionsRequest.departure_time || directionsRequest.arrival_time ? "with" : "without"} traffic</div>
                <div class="directionTrip__detailsMsg"></div>
            </div>
        `;

      directionTrip.addEventListener("click", () => {
        selectCorrectRoute(index);
        directionsRenderer.setRouteIndex(index);
      });

      return directionTrip;
    },
  );

  function formatDistance(meters: number): string {
    if (meters < 1000) {
      return `${meters} m`;
    } else {
      return `${(meters / 1000).toFixed(2)} km`;
    }
  }

  function formatTime(seconds: number): string {
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) {
      return `${minutes}m`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h${remainingMinutes}m`;
    }
  }
  function selectCorrectRoute(index: number) {
    document
      .querySelectorAll(".directionTrip__selected")
      .forEach((selectedElement) => {
        selectedElement.classList.remove("directionTrip__selected");
      });
    directionTripElements[index].classList.add("directionTrip__selected");
  }

  const tableContainer = document.querySelector(
    ".tableContainer",
  ) as HTMLElement;
  tableContainer.innerHTML = "";
  directionTripElements.forEach((element) =>
    tableContainer.appendChild(element),
  );
  tableContainer.style.display = "block";
}

function displayOrHideError(error: string) {
  const infoMsgElement = document.getElementById("infoMessage") as HTMLElement;
  if (error === "") {
    infoMsgElement.innerText = "Drag markers to update route";
  } else {
    infoMsgElement.innerHTML = error;
    infoMsgElement.style.display = "block";
    const tableContainer = document.querySelector(
      ".tableContainer",
    ) as HTMLElement;
    tableContainer.innerHTML = "";
    tableContainer.style.display = "none";
  }
}

function toggleProgress() {
  (document.querySelector(".linear-progress") as HTMLElement).classList.toggle(
    "hide",
  );
}

function displayDirectionsRoute(response: woosmap.map.DirectionResult) {
  directionsRenderer.setDirections(response);
}

function calculateDirections(): void {
  toggleProgress();

  new Promise((resolve, reject): void => {
    // TODO: the current implementation of `directionsService.route` throws an error when no routes are returned. As a workaround, we employ this Timeout hack.
    const timeoutId = setTimeout(() => {
      reject(new Error("Callback not called within 3 secs"));
    }, 3000);

    directionsService.route(directionsRequest, (response, status) => {
      // If the callback is called, clear the timeout and resolve or reject the Promise
      clearTimeout(timeoutId);
      if (status === "OK" && response && response.routes) {
        resolve(response);
      } else {
        reject(new Error(`Error calculating distances: ${status}`));
      }
    });
  })
    .then((response: unknown) => {
      const directionResult = response as woosmap.map.DirectionResult;
      displayDirectionsMarkers();
      displayDirectionsRoute(directionResult);
      createRoutesTable(directionResult);
      displayOrHideError("");
    })
    .catch((error: Error) => {
      console.error(error);
      displayOrHideError(error.message);
    })
    .finally(() => {
      toggleProgress();
    });
}

function toggleTravelMode(travelMode: HTMLDivElement): void {
  document
    .querySelectorAll(".travelMode")
    .forEach((el) => el.classList.remove("travelMode__selected"));
  travelMode.classList.add("travelMode__selected");
}

function updateTravelModeButtons(): void {
  document.querySelectorAll(".travelMode").forEach((el) =>
    el.addEventListener("click", () => {
      toggleTravelMode(el as HTMLDivElement);
      directionsRequest.travelMode = (el as HTMLDivElement).dataset
        .travelmode as woosmap.map.TravelMode | undefined;
      calculateDirections();
    }),
  );
}

function updateAvoidance(): void {
  document.querySelectorAll(".avoid").forEach((el) =>
    el.addEventListener("click", () => {
      const avoidHighways = document.getElementById(
        "avoidHighways",
      ) as HTMLInputElement;
      const avoidTolls = document.getElementById(
        "avoidTolls",
      ) as HTMLInputElement;
      const avoidFerries = document.getElementById(
        "avoidFerries",
      ) as HTMLInputElement;
      directionsRequest.avoidFerries = avoidFerries.checked;
      directionsRequest.avoidHighways = avoidHighways.checked;
      directionsRequest.avoidTolls = avoidTolls.checked;
      calculateDirections();
    }),
  );
}

function updateOptimizeWaypoint(): void {
  (
    document.querySelector(
      'input[name="optimizeWaypoints"]',
    ) as HTMLInputElement
  ).addEventListener("change", () => {
    directionsRequest.optimizeWaypoints = (
      document.querySelector(
        'input[name="optimizeWaypoints"]',
      ) as HTMLInputElement
    ).checked;
    calculateDirections();
  });
}

function updateDistanceUnit(): void {
  document.querySelectorAll('input[name="distanceUnits"]').forEach((el) => {
    el.addEventListener("change", () => {
      directionsRequest.unitSystem = (el as HTMLInputElement).value as
        | woosmap.map.UnitSystem
        | undefined;
      calculateDirections();
    });
  });
}

function updateAlternatives(): void {
  document.querySelectorAll('input[name="alternatives"]').forEach((el) => {
    el.addEventListener("change", () => {
      if ((el as HTMLInputElement).checked) {
        directionsRequest.provideRouteAlternatives =
          (el as HTMLInputElement).value === "true";
        calculateDirections();
      }
    });
  });
}

function updateMethod(): void {
  document.querySelectorAll('input[name="method"]').forEach((el) => {
    el.addEventListener("change", () => {
      directionsRequest.method = (el as HTMLInputElement).value as
        | "distance"
        | "time"
        | undefined;
      calculateDirections();
    });
  });
}

function updateDetails(): void {
  document.querySelectorAll('input[name="details"]').forEach((el) => {
    el.addEventListener("change", () => {
      directionsRequest.details = (el as HTMLInputElement).value as
        | "none"
        | "full"
        | undefined;
      calculateDirections();
    });
  });
}

function updateLanguage(): void {
  const languageSelect = document.getElementById(
    "language",
  ) as HTMLSelectElement;
  languageSelect.addEventListener("change", () => {
    directionsRequest.language = languageSelect.value;
    calculateDirections();
  });
}

function isValidDate(date: Date): boolean {
  return date.getTime && typeof date.getTime === "function";
}

function updateDepartureTime(): void {
  const departureTimeElement = document.getElementById(
    "departure-time",
  ) as HTMLInputElement;
  const datetimeRadioButton = document.getElementById(
    "datetime",
  ) as HTMLInputElement;

  if (!departureTimeElement) {
    return;
  }
  departureTimeElement.min = new Date().toISOString().slice(0, 16);
  departureTimeElement.disabled = true;
  document.querySelectorAll('input[name="departureTime"]').forEach((el) => {
    el.addEventListener("change", () => {
      const selectedOption = (el as HTMLInputElement).value;
      switch (selectedOption) {
        case "empty":
          delete directionsRequest.departure_time;
          departureTimeElement.disabled = true;
          break;
        case "now":
          directionsRequest.departure_time = "now";
          departureTimeElement.disabled = true;
          break;
        case "datetime":
          if (departureTimeElement.value) {
            const newDate = new Date(departureTimeElement.value);
            directionsRequest.departure_time = isValidDate(newDate)
              ? newDate.getTime().toString()
              : undefined;
          } else {
            directionsRequest.departure_time = undefined;
          }
          departureTimeElement.disabled = false;
          break;
      }
      calculateDirections();
    });
  });

  departureTimeElement.addEventListener("change", () => {
    if (datetimeRadioButton) {
      datetimeRadioButton.checked = true;
    }
    const newDate = new Date(departureTimeElement.value);
    directionsRequest.departure_time = isValidDate(newDate)
      ? newDate.getTime().toString()
      : undefined;
    calculateDirections();
  });
}

function registerAddButton(
  selector: string,
  element: HTMLElement,
  loc: woosmap.map.LatLngLiteral[] | woosmap.map.LatLngLiteral,
): void {
  const button = document.querySelector(selector) as HTMLElement;
  button.addEventListener("click", () => {
    if (button.classList.contains("addLocation__selected")) {
      button.classList.remove("addLocation__selected");
      document.getElementById("map")?.classList.remove("cursor-crosshair");
      woosmap.map.event.clearListeners(map, "click");
      return;
    }
    button.classList.add("addLocation__selected");
    document.getElementById("map")?.classList.add("cursor-crosshair");
    woosmap.map.event.addListenerOnce(map, "click", (e) => {
      document.getElementById("map")?.classList.remove("cursor-crosshair");
      button.classList.remove("addLocation__selected");
      const location = e.latlng;
      if (Array.isArray(loc)) {
        waypoints.push({ location });
        addLatLngToList(element, location);
      } else {
        if (element === originContainer) {
          directionsRequest.origin = location;
        }
        if (element === destinationContainer) {
          directionsRequest.destination = location;
        }
        setLatLngToContainer(element, location);
      }
      calculateDirections();
    });
  });
}

function initUI(): void {
  updateTravelModeButtons();
  updateAvoidance();
  updateDistanceUnit();
  updateMethod();
  updateAlternatives();
  updateDetails();
  updateDepartureTime();
  updateLanguage();
  updateOptimizeWaypoint();
  registerAddButton(
    ".addLocation__destinations",
    destinationContainer,
    directionsRequest.destination as woosmap.map.LatLngLiteral,
  );
  registerAddButton(
    ".addLocation__origins",
    originContainer,
    directionsRequest.origin as woosmap.map.LatLngLiteral,
  );
  registerAddButton(
    ".addLocation__waypoints",
    waypointsList,
    waypoints.map((waypoint) => waypoint.location as woosmap.map.LatLngLiteral),
  );
}

function initMap(): void {
  map = new woosmap.map.Map(document.getElementById("map") as HTMLElement, {
    center: { lat: 51.5074, lng: -0.1478 },
    zoom: 10,
  });
  directionsService = new woosmap.map.DirectionsService();
  directionsRenderer = new woosmap.map.DirectionsRenderer({});
  directionsRenderer.setMap(map);
  bounds = new woosmap.map.LatLngBounds();
  originContainer = document.getElementById("origin") as HTMLElement;
  destinationContainer = document.getElementById("destination") as HTMLElement;
  waypointsList = document.getElementById("waypoints") as HTMLElement;
  directionsRequest = createDefaultRequest();
  initUI();
  calculateDirections();
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
// [END woosmap_directions_advanced]

export {};
