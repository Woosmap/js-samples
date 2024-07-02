let map;
let bounds;
let directionsService;
let directionsRequest;
let markersArray = [];
let waypointsList;
let originContainer;
let destinationContainer;
const waypoints = [];
let directionsRenderer;
const travelModeIcons = {
  DRIVING: "https://images.woosmap.com/directions/drive_black.png",
  WALKING: "https://images.woosmap.com/directions/walk_black.png",
  CYCLING: "https://images.woosmap.com/directions/bicycle_black.png",
};

function createMarker(position, label, url) {
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

function clearMarkers() {
  for (const marker of markersArray) {
    marker.setMap(null);
  }

  markersArray = [];
}

function displayDirectionsMarkers() {
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
  bounds.extend(directionsRequest.origin);
  bounds.extend(directionsRequest.destination);
  waypoints.forEach((waypoint, index) => {
    bounds.extend(waypoint.location);

    const waypointMarker = createMarker(
      waypoint.location,
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

function createDefaultRequest() {
  const origin = { lat: 51.6511, lng: -0.1615 };
  const destination = { lat: 51.5146, lng: -0.0212 };

  waypoints.push(
    { location: { lat: 51.4855, lng: -0.3179 } },
    { location: { lat: 51.5074, lng: -0.1278 } },
  );
  setLatLngToContainer(originContainer, origin);
  setLatLngToContainer(destinationContainer, destination);

  for (const waypoint of waypoints) {
    addLatLngToList(waypointsList, waypoint.location);
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

function addLatLngToList(element, location) {
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

function setLatLngToContainer(element, location) {
  element.innerHTML = `<li><span>lat: ${location.lat.toFixed(4)}, lng: ${location.lng.toFixed(4)}<span></li>`;
}

function createRoutesTable(response) {
  const directionTripElements = response.routes.map((route, index) => {
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
      travelModeIcons[directionsRequest.travelMode] ||
      travelModeIcons["DRIVING"];

    directionTrip.innerHTML = `
            <img class="directionTrip__travelModeIcon" src="${travelModeIconSrc}">
            <div class="directionTrip__description">
                <div class="directionTrip__numbers">
                    <div class="directionTrip__duration">${formatTime(durationTotal)}</div>
                    <div class="directionTrip__distance">${formatDistance(distanceTotal)}</div>
                </div>
                <div class="directionTrip__title">through ${leg.start_address ? leg.start_address : JSON.stringify(leg.start_location)}</div>
                <div class="directionTrip__summary">${formatTime(durationTotal)} ${directionsRequest.departure_time || directionsRequest.arrival_time ? "with" : "without"} traffic</div>
                <div class="directionTrip__detailsMsg"></div>
            </div>
        `;
    directionTrip.addEventListener("click", () => {
      selectCorrectRoute(index);
      directionsRenderer.setRouteIndex(index);
    });
    return directionTrip;
  });

  function formatDistance(meters) {
    if (meters < 1000) {
      return `${meters} m`;
    } else {
      return `${(meters / 1000).toFixed(2)} km`;
    }
  }

  function formatTime(seconds) {
    const minutes = Math.round(seconds / 60);

    if (minutes < 60) {
      return `${minutes}m`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h${remainingMinutes}m`;
    }
  }

  function selectCorrectRoute(index) {
    document
      .querySelectorAll(".directionTrip__selected")
      .forEach((selectedElement) => {
        selectedElement.classList.remove("directionTrip__selected");
      });
    directionTripElements[index].classList.add("directionTrip__selected");
  }

  const tableContainer = document.querySelector(".tableContainer");

  tableContainer.innerHTML = "";
  directionTripElements.forEach((element) =>
    tableContainer.appendChild(element),
  );
  tableContainer.style.display = "block";
}

function displayOrHideError(error) {
  const infoMsgElement = document.getElementById("infoMessage");

  if (error === "") {
    infoMsgElement.innerText = "Drag markers to update route";
  } else {
    infoMsgElement.innerHTML = error;
    infoMsgElement.style.display = "block";

    const tableContainer = document.querySelector(".tableContainer");

    tableContainer.innerHTML = "";
    tableContainer.style.display = "none";
  }
}

function toggleProgress() {
  document.querySelector(".linear-progress").classList.toggle("hide");
}

function displayDirectionsRoute(response) {
  directionsRenderer.setDirections(response);
}

function calculateDirections() {
  toggleProgress();
  new Promise((resolve, reject) => {
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
    .then((response) => {
      const directionResult = response;

      displayDirectionsMarkers();
      displayDirectionsRoute(directionResult);
      createRoutesTable(directionResult);
      displayOrHideError("");
    })
    .catch((error) => {
      console.error(error);
      displayOrHideError(error.message);
    })
    .finally(() => {
      toggleProgress();
    });
}

function toggleTravelMode(travelMode) {
  document
    .querySelectorAll(".travelMode")
    .forEach((el) => el.classList.remove("travelMode__selected"));
  travelMode.classList.add("travelMode__selected");
}

function updateTravelModeButtons() {
  document.querySelectorAll(".travelMode").forEach((el) =>
    el.addEventListener("click", () => {
      toggleTravelMode(el);
      directionsRequest.travelMode = el.dataset.travelmode;
      calculateDirections();
    }),
  );
}

function updateAvoidance() {
  document.querySelectorAll(".avoid").forEach((el) =>
    el.addEventListener("click", () => {
      const avoidHighways = document.getElementById("avoidHighways");
      const avoidTolls = document.getElementById("avoidTolls");
      const avoidFerries = document.getElementById("avoidFerries");

      directionsRequest.avoidFerries = avoidFerries.checked;
      directionsRequest.avoidHighways = avoidHighways.checked;
      directionsRequest.avoidTolls = avoidTolls.checked;
      calculateDirections();
    }),
  );
}

function updateOptimizeWaypoint() {
  document
    .querySelector('input[name="optimizeWaypoints"]')
    .addEventListener("change", () => {
      directionsRequest.optimizeWaypoints = document.querySelector(
        'input[name="optimizeWaypoints"]',
      ).checked;
      calculateDirections();
    });
}

function updateDistanceUnit() {
  document.querySelectorAll('input[name="distanceUnits"]').forEach((el) => {
    el.addEventListener("change", () => {
      directionsRequest.unitSystem = el.value;
      calculateDirections();
    });
  });
}

function updateAlternatives() {
  document.querySelectorAll('input[name="alternatives"]').forEach((el) => {
    el.addEventListener("change", () => {
      if (el.checked) {
        directionsRequest.provideRouteAlternatives = el.value === "true";
        calculateDirections();
      }
    });
  });
}

function updateMethod() {
  document.querySelectorAll('input[name="method"]').forEach((el) => {
    el.addEventListener("change", () => {
      directionsRequest.method = el.value;
      calculateDirections();
    });
  });
}

function updateDetails() {
  document.querySelectorAll('input[name="details"]').forEach((el) => {
    el.addEventListener("change", () => {
      directionsRequest.details = el.value;
      calculateDirections();
    });
  });
}

function updateLanguage() {
  const languageSelect = document.getElementById("language");

  languageSelect.addEventListener("change", () => {
    directionsRequest.language = languageSelect.value;
    calculateDirections();
  });
}

function isValidDate(date) {
  return date.getTime && typeof date.getTime === "function";
}

function updateDepartureTime() {
  const departureTimeElement = document.getElementById("departure-time");
  const datetimeRadioButton = document.getElementById("datetime");

  if (!departureTimeElement) {
    return;
  }

  departureTimeElement.min = new Date().toISOString().slice(0, 16);
  departureTimeElement.disabled = true;
  document.querySelectorAll('input[name="departureTime"]').forEach((el) => {
    el.addEventListener("change", () => {
      const selectedOption = el.value;

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

function registerAddButton(selector, element, loc) {
  const button = document.querySelector(selector);

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

function initUI() {
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
    directionsRequest.destination,
  );
  registerAddButton(
    ".addLocation__origins",
    originContainer,
    directionsRequest.origin,
  );
  registerAddButton(
    ".addLocation__waypoints",
    waypointsList,
    waypoints.map((waypoint) => waypoint.location),
  );
}

function initMap() {
  map = new woosmap.map.Map(document.getElementById("map"), {
    center: { lat: 51.5074, lng: -0.1478 },
    zoom: 10,
  });
  directionsService = new woosmap.map.DirectionsService();
  directionsRenderer = new woosmap.map.DirectionsRenderer({});
  directionsRenderer.setMap(map);
  bounds = new woosmap.map.LatLngBounds();
  originContainer = document.getElementById("origin");
  destinationContainer = document.getElementById("destination");
  waypointsList = document.getElementById("waypoints");
  directionsRequest = createDefaultRequest();
  initUI();
  calculateDirections();
}

window.initMap = initMap;
