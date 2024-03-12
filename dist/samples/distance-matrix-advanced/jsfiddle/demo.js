let map;
let bounds;
let distanceService;
let distanceRequest;
let markersArray = [];
let originsList;
let destinationsList;
const origins = [];
const destinations = [];
let line = null;

function createMarker(position, label, url) {
  return new woosmap.map.Marker({
    map,
    position,
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

function displayMatrixMarkers(origins, destinations) {
  clearMarkers();
  origins.forEach((origin, index) => {
    bounds.extend(origin);
    markersArray.push(
      createMarker(
        origin,
        (index + 1).toString(),
        "https://images.woosmap.com/marker-blue.svg",
      ),
    );
  });
  destinations.forEach((destination, index) => {
    bounds.extend(destination);
    markersArray.push(
      createMarker(
        destination,
        (index + 1).toString(),
        "https://images.woosmap.com/marker-red.svg",
      ),
    );
  });
  map.fitBounds(bounds, { top: 70, bottom: 40, left: 50, right: 50 }, true);
}

function createDefaultRequest() {
  origins.push({ lat: 51.6511, lng: -0.1615 }, { lat: 51.4269, lng: -0.0955 });
  destinations.push(
    { lat: 51.4855, lng: -0.3179 },
    { lat: 51.5146, lng: -0.0212 },
  );

  for (const origin of origins) {
    addLatLngToList(originsList, origin);
  }

  for (const destination of destinations) {
    addLatLngToList(destinationsList, destination);
  }
  return {
    origins,
    destinations,
    travelMode: woosmap.map.TravelMode.DRIVING,
    unitSystem: woosmap.map.UnitSystem.METRIC,
    avoidHighways: false,
    avoidTolls: false,
    elements: "duration_distance",
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
    if (element === originsList) {
      origins.splice(origins.indexOf(location), 1);
    } else {
      destinations.splice(destinations.indexOf(location), 1);
    }

    calculateDistances();
  });
  locationElement.appendChild(removeButton);
  element.appendChild(locationElement);
}

function handleResponse(response) {
  displayMatrixMarkers(distanceRequest.origins, distanceRequest.destinations);
  createTable(response);
  displayOrHideError("");
  toggleProgress();
}

function createTable(response) {
  let table =
    "<table><thead><tr><th>From</th><th>To</th><th>Time</th><th>Distance</th></tr></thead><tbody>";

  response.rows.forEach((row, fromIndex) => {
    row.elements.forEach((element, toIndex) => {
      if (element.status === "OK") {
        const time = element.duration ? element.duration.text : "N/A";
        const start = `${origins[fromIndex].lat},${origins[fromIndex].lng}`;
        const end = `${destinations[toIndex].lat},${destinations[toIndex].lng}`;
        const distance = element.distance ? element.distance.text : "N/A";

        table += `<tr data-start=${start} data-end=${end}><td><span>${fromIndex + 1}</span></td><td><span>${toIndex + 1}</span></td><td>${time}</td><td>${distance}</td></tr>`;
      }
    });
  });
  table += "</tbody></table>";

  const tableContainer = document.querySelector(".tableContainer");

  tableContainer.innerHTML = table;
  tableContainer.style.display = "block";
  registerLineHighlight(tableContainer);
}

function registerLineHighlight(tableContainer) {
  const tableRows = tableContainer.querySelectorAll("tr");

  tableRows.forEach((row) => {
    row.addEventListener("mouseover", () => {
      let _a, _b;
      const start =
        (_a = row.dataset.start) === null || _a === void 0
          ? void 0
          : _a.split(",").map(Number);
      const end =
        (_b = row.dataset.end) === null || _b === void 0
          ? void 0
          : _b.split(",").map(Number);

      if (line) {
        line.setMap(null);
      }

      if (!start || !end) {
        return;
      }

      line = new woosmap.map.Polyline({
        path: [
          { lat: start[0], lng: start[1] },
          { lat: end[0], lng: end[1] },
        ],
        geodesic: true,
        strokeColor: "#252525",
        strokeOpacity: 1.0,
        strokeWeight: 2,
      });
      line.setMap(map);
    });
    row.addEventListener("mouseout", () => {
      if (line) {
        line.setMap(null);
        line = null;
      }
    });
  });
}

function displayOrHideError(error) {
  const errorElement = document.getElementById("errorMessage");

  if (error === "") {
    errorElement.style.display = "none";
  } else {
    errorElement.innerHTML = error;
    errorElement.style.display = "block";

    const tableContainer = document.querySelector(".tableContainer");

    tableContainer.innerHTML = "";
    tableContainer.style.display = "none";
  }
}

function toggleProgress() {
  document.querySelector(".linear-progress").classList.toggle("hide");
}

function calculateDistances() {
  toggleProgress();
  distanceService
    .getDistanceMatrix(distanceRequest)
    .then(handleResponse)
    .catch((error) => {
      console.error("Error calculating distances:", error);
      displayOrHideError(error);
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
      distanceRequest.travelMode = el.dataset.travelmode;
      calculateDistances();
    }),
  );
}

function updateAvoidance() {
  document.querySelectorAll(".avoid").forEach((el) =>
    el.addEventListener("click", () => {
      const avoidHighways = document.getElementById("avoidHighways");
      const avoidTolls = document.getElementById("avoidTolls");
      const avoidFerries = document.getElementById("avoidFerries");

      distanceRequest.avoidHighways = avoidHighways.checked;
      distanceRequest.avoidTolls = avoidTolls.checked;
      distanceRequest.avoidFerries = avoidFerries.checked;
      calculateDistances();
    }),
  );
}

function updateDistanceUnit() {
  document.querySelectorAll('input[name="distanceUnits"]').forEach((el) => {
    el.addEventListener("change", () => {
      distanceRequest.unitSystem = el.value;
      calculateDistances();
    });
  });
}

function updateMethod() {
  document.querySelectorAll('input[name="method"]').forEach((el) => {
    el.addEventListener("change", () => {
      distanceRequest.method = el.value;
      calculateDistances();
    });
  });
}

function updateElements() {
  document.querySelectorAll('input[name="elements"]').forEach((el) => {
    el.addEventListener("change", () => {
      distanceRequest.elements = el.value;
      calculateDistances();
    });
  });
}

function updateLanguage() {
  const languageSelect = document.getElementById("language");

  languageSelect.addEventListener("change", () => {
    distanceRequest.language = languageSelect.value;
    calculateDistances();
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

  departureTimeElement.disabled = true;
  document.querySelectorAll('input[name="departureTime"]').forEach((el) => {
    el.addEventListener("change", () => {
      const selectedOption = el.value;

      switch (selectedOption) {
        case "empty":
          delete distanceRequest.departureTime;
          departureTimeElement.disabled = true;
          break;
        case "now":
          distanceRequest.departureTime = "now";
          departureTimeElement.disabled = true;
          break;
        case "datetime":
          if (departureTimeElement.value) {
            const newDate = new Date(departureTimeElement.value);

            distanceRequest.departureTime = isValidDate(newDate)
              ? newDate
              : undefined;
          } else {
            distanceRequest.departureTime = undefined;
          }

          departureTimeElement.disabled = false;
          break;
      }

      calculateDistances();
    });
  });
  departureTimeElement.addEventListener("change", () => {
    if (datetimeRadioButton) {
      datetimeRadioButton.checked = true;
    }

    const newDate = new Date(departureTimeElement.value);

    distanceRequest.departureTime = isValidDate(newDate) ? newDate : undefined;
    calculateDistances();
  });
}

function registerAddButton(selector, list, locations) {
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

      locations.push(location);
      addLatLngToList(list, location);
      calculateDistances();
    });
  });
}

function initUI() {
  updateTravelModeButtons();
  updateAvoidance();
  updateDistanceUnit();
  updateMethod();
  updateElements();
  updateDepartureTime();
  updateLanguage();
  originsList = document.getElementById("origins");
  destinationsList = document.getElementById("destinations");
  registerAddButton(
    ".addLocation__destinations",
    destinationsList,
    destinations,
  );
  registerAddButton(".addLocation__origins", originsList, origins);
}

function initMap() {
  map = new woosmap.map.Map(document.getElementById("map"), {
    center: { lat: 51.4855, lng: -0.3179 },
    zoom: 6,
  });
  distanceService = new woosmap.map.DistanceService();
  bounds = new woosmap.map.LatLngBounds();
  initUI();
  distanceRequest = createDefaultRequest();
  calculateDistances();
}

window.initMap = initMap;
