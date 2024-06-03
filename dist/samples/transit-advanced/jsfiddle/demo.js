let map;
let transitService;
let transitRequest;
let markersArray = [];
let originContainer;
let destinationContainer;
let transitRenderer;

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

function displayTransitMarkers() {
  clearMarkers();

  const originMarker = createMarker(
    transitRequest.origin,
    "O",
    "https://images.woosmap.com/marker-blue.svg",
  );

  originMarker.addListener("dragend", () => {
    transitRequest.origin = originMarker.getPosition();
    setLatLngToContainer(originContainer, originMarker.getPosition().toJSON());
    calculateTransit();
  });

  const destinationMarker = createMarker(
    transitRequest.destination,
    "D",
    "https://images.woosmap.com/marker-red.svg",
  );

  destinationMarker.addListener("dragend", () => {
    transitRequest.destination = destinationMarker.getPosition();
    setLatLngToContainer(
      destinationContainer,
      destinationMarker.getPosition().toJSON(),
    );
    calculateTransit();
  });
  markersArray.push(originMarker);
  markersArray.push(destinationMarker);
}

function createDefaultRequest() {
  const origin = { lat: 51.6511, lng: -0.1615 };
  const destination = { lat: 51.5146, lng: -0.0212 };

  setLatLngToContainer(originContainer, origin);
  setLatLngToContainer(destinationContainer, destination);
  return {
    origin,
    destination,
  };
}

function setLatLngToContainer(element, location) {
  element.innerHTML = `<li><span>lat: ${location.lat.toFixed(4)}, lng: ${location.lng.toFixed(4)}<span></li>`;
}

function createRoutesTable(response) {
  const directionTripElements = response.routes.map((route, index) => {
    let _a;
    const leg = route.legs[0];
    const directionTrip = document.createElement("div");

    directionTrip.className = "directionTrip";
    if (index === 0) {
      directionTrip.classList.add("directionTrip__selected");
    }

    const startName =
      ((_a = route.legs.find(
        (leg) => leg.start_location && leg.start_location.name !== null,
      )) === null || _a === void 0
        ? void 0
        : _a.start_location.name) || "Walking";
    const travelModeIconSrc =
      startName === "Walking"
        ? "https://images.woosmap.com/directions/walk_black.png"
        : "https://images.woosmap.com/directions/transit_black.png";

    directionTrip.innerHTML = `
            <img class="directionTrip__travelModeIcon" src="${travelModeIconSrc}">
            <div class="directionTrip__description">
                <div class="directionTrip__numbers">
                    <div class="directionTrip__duration">${formatTime(leg.duration)}</div>
                    <div class="directionTrip__distance">${formatDistance(leg.distance)}</div>
                </div>
                <div class="directionTrip__title">through ${startName}</div>
                <div class="directionTrip__summary">${formatTime(leg.duration)}</div>
                <div class="directionTrip__detailsMsg"></div>
            </div>
        `;
    directionTrip.addEventListener("click", () => {
      selectCorrectRoute(index);
      transitRenderer.setRouteIndex(index);
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

function displayTransitRoute(routes) {
  transitRenderer.setRoutes(routes);
}

function calculateTransit() {
  toggleProgress();
  transitService
    .route(transitRequest)
    .then(handleResponse)
    .catch((error) => {
      console.error("Error calculating transit route:", error);
      displayOrHideError(error);
      toggleProgress();
    });
}

function handleResponse(response) {
  displayTransitRoute(response.routes);
  displayTransitMarkers();
  createRoutesTable(response);
  displayOrHideError("");
  toggleProgress();
}

function isValidDate(date) {
  return date.getTime && typeof date.getTime === "function";
}

function updateTime(timeType) {
  const timeElement = document.getElementById(`${timeType}-time`);
  const datetimeRadioButton = document.getElementById("datetime");
  const otherTimeType =
    timeType === "departureTime" ? "arrivalTime" : "departureTime";
  const otherTimeElement = document.getElementById(`${otherTimeType}-time`);

  if (!timeElement || !otherTimeElement) {
    return;
  }

  timeElement.min = new Date().toISOString().slice(0, 16);
  timeElement.disabled = true;
  document.querySelectorAll(`input[name="${timeType}"]`).forEach((el) => {
    el.addEventListener("change", () => {
      const selectedOption = el.value;

      switch (selectedOption) {
        case "empty":
          delete transitRequest[timeType];
          timeElement.disabled = true;
          break;
        case "now":
        case "datetime":
          delete transitRequest[otherTimeType];
          document.querySelector(
            `input[name="${otherTimeType}"][value="empty"]`,
          ).checked = true;
          otherTimeElement.value = "";
          otherTimeElement.disabled = true;
          if (timeElement.value) {
            const newDate = new Date(timeElement.value);

            transitRequest[timeType] = isValidDate(newDate)
              ? newDate.getTime().toString()
              : undefined;
          } else {
            transitRequest[timeType] = undefined;
          }

          timeElement.disabled = false;
          break;
      }

      calculateTransit();
    });
  });
  timeElement.addEventListener("change", () => {
    if (datetimeRadioButton) {
      datetimeRadioButton.checked = true;
    }

    const newDate = new Date(timeElement.value);

    transitRequest[timeType] = isValidDate(newDate)
      ? newDate.getTime().toString()
      : undefined;
    calculateTransit();
  });
}

function registerAddButton(selector, element, loc) {
  const button = document.querySelector(selector);

  button.addEventListener("click", () => {
    let _a, _b;

    if (button.classList.contains("addLocation__selected")) {
      button.classList.remove("addLocation__selected");
      (_a = document.getElementById("map")) === null || _a === void 0
        ? void 0
        : _a.classList.remove("cursor-crosshair");
      woosmap.map.event.clearListeners(map, "click");
      return;
    }

    button.classList.add("addLocation__selected");
    (_b = document.getElementById("map")) === null || _b === void 0
      ? void 0
      : _b.classList.add("cursor-crosshair");
    woosmap.map.event.addListenerOnce(map, "click", (e) => {
      let _a;

      (_a = document.getElementById("map")) === null || _a === void 0
        ? void 0
        : _a.classList.remove("cursor-crosshair");
      button.classList.remove("addLocation__selected");

      const location = e.latlng;

      if (element === originContainer) {
        transitRequest.origin = location;
      }

      if (element === destinationContainer) {
        transitRequest.destination = location;
      }

      setLatLngToContainer(element, location);
      calculateTransit();
    });
  });
}

const includedModes = [];
const excludedModes = [];
const modes = {
  train: [
    "highSpeedTrain",
    "intercityTrain",
    "interRegionalTrain",
    "regionalTrain",
    "cityTrain",
    "subway",
    "lightRail",
    "monorail",
    "inclined",
  ],
  bus: ["bus", "privateBus", "busRapid"],
  ferry: ["ferry"],
  aerial: ["aerial", "flight", "spaceship"],
};

function updateTransitOptions() {
  const checkboxes = document.querySelectorAll('.modesChk[type="checkbox"]');
  const includeRadio = document.querySelector("#includeModes");
  const excludeRadio = document.querySelector("#excludeModes");

  function updateMode() {
    includedModes.length = 0;
    excludedModes.length = 0;
    Object.keys(modes).forEach((mode) => {
      const checkbox = document.querySelector(
        `#mode${mode.charAt(0).toUpperCase() + mode.slice(1)}`,
      );

      if (checkbox.checked) {
        modes[mode].forEach((subMode) => {
          if (includeRadio.checked) {
            includedModes.push(subMode);
          } else if (excludeRadio.checked) {
            excludedModes.push("-" + subMode);
          }
        });
      }
    });
    if (includedModes.length === 0 && excludedModes.length === 0) {
      delete transitRequest.modes;
    } else {
      transitRequest.modes = includeRadio.checked
        ? includedModes
        : excludedModes;
    }

    calculateTransit();
  }

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", updateMode);
  });
  includeRadio.addEventListener("change", updateMode);
  excludeRadio.addEventListener("change", updateMode);
}

function initUI() {
  updateTime("departureTime");
  updateTime("arrivalTime");
  updateTransitOptions();
  registerAddButton(
    ".addLocation__destinations",
    destinationContainer,
    transitRequest.destination,
  );
  registerAddButton(
    ".addLocation__origins",
    originContainer,
    transitRequest.origin,
  );
}

function initMap() {
  map = new woosmap.map.Map(document.getElementById("map"), {
    center: { lat: 51.5074, lng: -0.1478 },
    zoom: 10,
  });
  transitService = new woosmap.map.TransitService();
  transitRenderer = new woosmap.map.TransitRenderer({});
  transitRenderer.setMap(map);
  originContainer = document.getElementById("origin");
  destinationContainer = document.getElementById("destination");
  transitRequest = createDefaultRequest();
  initUI();
  calculateTransit();
}

window.initMap = initMap;
