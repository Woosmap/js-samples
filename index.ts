let map: woosmap.map.Map;
let bounds: woosmap.map.LatLngBounds;
let distanceService: woosmap.map.DistanceService;
let distanceRequest: woosmap.map.distance.DistanceMatrixRequest;
let markersArray: woosmap.map.Marker[] = [];
let originsList: HTMLElement;
let destinationsList: HTMLElement;
const origins: woosmap.map.LatLngLiteral[] = [];
const destinations: woosmap.map.LatLngLiteral[] = [];
let line: woosmap.map.Polyline | null = null;

function createMarker(
  position: woosmap.map.LatLngLiteral,
  label: string,
  url: string,
): woosmap.map.Marker {
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

function clearMarkers(): void {
  for (const marker of markersArray) {
    marker.setMap(null);
  }
  markersArray = [];
}

function displayMatrixMarkers(
  origins: woosmap.map.LatLngLiteral[],
  destinations: woosmap.map.LatLngLiteral[],
): void {
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

function createDefaultRequest(): woosmap.map.distance.DistanceMatrixRequest {
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

function handleResponse(
  response: woosmap.map.distance.DistanceMatrixResponse,
): void {
  displayMatrixMarkers(
    distanceRequest.origins as woosmap.map.LatLngLiteral[],
    distanceRequest.destinations as woosmap.map.LatLngLiteral[],
  );
  createTable(response);
  displayOrHideError("");
  toggleProgress();
}

function createTable(response: woosmap.map.distance.DistanceMatrixResponse) {
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

  const tableContainer = document.querySelector(
    ".tableContainer",
  ) as HTMLElement;
  tableContainer.innerHTML = table;
  tableContainer.style.display = "block";
  registerLineHighlight(tableContainer);
}

function registerLineHighlight(tableContainer: HTMLElement) {
  const tableRows = tableContainer.querySelectorAll("tr");
  tableRows.forEach((row) => {
    row.addEventListener("mouseover", () => {
      const start = row.dataset.start?.split(",").map(Number);
      const end = row.dataset.end?.split(",").map(Number);
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

function displayOrHideError(error: string) {
  const errorElement = document.getElementById("errorMessage") as HTMLElement;
  if (error === "") {
    errorElement.style.display = "none";
  } else {
    errorElement.innerHTML = error;
    errorElement.style.display = "block";
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

function calculateDistances(): void {
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
      distanceRequest.travelMode = (el as HTMLDivElement).dataset.travelmode as
        | woosmap.map.TravelMode
        | undefined;
      calculateDistances();
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
      distanceRequest.avoidHighways = avoidHighways.checked;
      distanceRequest.avoidTolls = avoidTolls.checked;
      distanceRequest.avoidFerries = avoidFerries.checked;
      calculateDistances();
    }),
  );
}

function updateDistanceUnit(): void {
  document.querySelectorAll('input[name="distanceUnits"]').forEach((el) => {
    el.addEventListener("change", () => {
      distanceRequest.unitSystem = (el as HTMLInputElement).value as
        | woosmap.map.UnitSystem
        | undefined;
      calculateDistances();
    });
  });
}

function updateMethod(): void {
  document.querySelectorAll('input[name="method"]').forEach((el) => {
    el.addEventListener("change", () => {
      distanceRequest.method = (el as HTMLInputElement).value as
        | "distance"
        | "time"
        | undefined;
      calculateDistances();
    });
  });
}

function updateElements(): void {
  document.querySelectorAll('input[name="elements"]').forEach((el) => {
    el.addEventListener("change", () => {
      distanceRequest.elements = (el as HTMLInputElement).value as
        | "duration_distance"
        | "distance"
        | "duration"
        | undefined;
      calculateDistances();
    });
  });
}

function updateLanguage(): void {
  const languageSelect = document.getElementById(
    "language",
  ) as HTMLSelectElement;
  languageSelect.addEventListener("change", () => {
    distanceRequest.language = languageSelect.value as string;
    calculateDistances();
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
  departureTimeElement.disabled = true;
  document.querySelectorAll('input[name="departureTime"]').forEach((el) => {
    el.addEventListener("change", () => {
      const selectedOption = (el as HTMLInputElement).value;
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
    distanceRequest.departureTime = isValidDate(newDate)
      ? Math.floor(newDate.getTime() / 1000).toString()
      : undefined;
    calculateDistances();
  });
}

function registerAddButton(
  selector: string,
  list: HTMLElement,
  locations: woosmap.map.LatLngLiteral[],
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
      locations.push(location);
      addLatLngToList(list, location);
      calculateDistances();
    });
  });
}

function initUI(): void {
  updateTravelModeButtons();
  updateAvoidance();
  updateDistanceUnit();
  updateMethod();
  updateElements();
  updateDepartureTime();
  updateLanguage();
  originsList = document.getElementById("origins") as HTMLElement;
  destinationsList = document.getElementById("destinations") as HTMLElement;
  registerAddButton(
    ".addLocation__destinations",
    destinationsList,
    destinations,
  );
  registerAddButton(".addLocation__origins", originsList, origins);
}

function initMap(): void {
  map = new woosmap.map.Map(document.getElementById("map") as HTMLElement, {
    center: { lat: 51.4855, lng: -0.3179 },
    zoom: 6,
  });
  distanceService = new woosmap.map.DistanceService();
  bounds = new woosmap.map.LatLngBounds();
  initUI();
  distanceRequest = createDefaultRequest();
  calculateDistances();
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;

export {};
