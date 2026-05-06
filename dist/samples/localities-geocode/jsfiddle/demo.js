// Initialize and add the map
let map;
let marker;
let infoWindow;
let localitiesService;
const request = {};

function initMap() {
  map = new window.woosmap.map.Map(document.getElementById("map"), {
    center: { lat: 51.50940214, lng: -0.133012 },
    zoom: 12,
  });
  infoWindow = new woosmap.map.InfoWindow({});
  localitiesService = new woosmap.map.LocalitiesService();
  map.addListener("click", (e) => {
    handleGeocode(e.latlng);
  });
}

const inputElement = document.getElementById("autocomplete-input");
const clearSearchBtn = document.getElementsByClassName("clear-searchButton")[0];

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

  clearResponse();
  inputElement.focus();
});

function handleGeocode(latlng) {
  if (latlng) {
    request.latLng = latlng;
    delete request.address;
  } else if (inputElement?.value !== "") {
    request.address = inputElement.value;
    delete request.latLng;
  }

  if (request.latLng || request.address) {
    localitiesService
      .geocode(request)
      .then((localities) => displayLocality(localities.results[0]))
      .catch((error) => console.error("Error geocoding localities:", error));
  }
}

function displayLocality(locality) {
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
    renderResponse(locality);
  }
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatNameValue(value) {
  return Array.isArray(value) ? value.join(", ") : value;
}

function renderResponse(locality) {
  const panel = document.getElementById("response-panel");
  const summaryEl = panel?.querySelector(".summary");
  const componentsEl = panel?.querySelector(".address-components");
  const rawEl = document.getElementById("raw-json");

  if (!panel || !summaryEl || !componentsEl || !rawEl) return;

  panel.dataset.empty = "false";

  const summaryRows = [];

  summaryRows.push(
    `<p class='option-detail'><span class='option-detail-label'>Formatted address:</span><span class='bold'>${escapeHtml(locality.formatted_address)}</span></p>`,
  );
  if (locality.types && locality.types.length) {
    summaryRows.push(
      `<p class='option-detail'><span class='option-detail-label'>Types:</span><span class='bold'>${escapeHtml(locality.types.join(", "))}</span></p>`,
    );
  }

  if (locality.public_id) {
    summaryRows.push(
      `<p class='option-detail'><span class='option-detail-label'>Public ID:</span><span class='bold'>${escapeHtml(locality.public_id)}</span></p>`,
    );
  }

  if (typeof locality.distance === "number") {
    summaryRows.push(
      `<p class='option-detail'><span class='option-detail-label'>Distance (m):</span><span class='bold'>${locality.distance}</span></p>`,
    );
  }

  if (locality.geometry) {
    const { geometry } = locality;

    if (geometry.location_type) {
      summaryRows.push(
        `<p class='option-detail'><span class='option-detail-label'>Location type:</span><span class='bold'>${escapeHtml(geometry.location_type)}</span></p>`,
      );
    }

    summaryRows.push(
      `<p class='option-detail'><span class='option-detail-label'>Latitude:</span><span class='bold'>${geometry.location.lat}</span></p>`,
      `<p class='option-detail'><span class='option-detail-label'>Longitude:</span><span class='bold'>${geometry.location.lng}</span></p>`,
    );
    if (geometry.viewport) {
      const { viewport } = geometry;

      summaryRows.push(
        `<p class='option-detail'><span class='option-detail-label'>Viewport NE:</span><span class='bold'>${viewport.northeast.lat}, ${viewport.northeast.lng}</span></p>`,
        `<p class='option-detail'><span class='option-detail-label'>Viewport SW:</span><span class='bold'>${viewport.southwest.lat}, ${viewport.southwest.lng}</span></p>`,
      );
    }
  }

  summaryEl.innerHTML = `<div class='section-title'>Summary</div>${summaryRows.join("")}`;
  if (locality.address_components && locality.address_components.length) {
    const rows = locality.address_components
      .map((compo) => {
        const label = escapeHtml((compo.types[0] ?? "").replace(/_/g, " "));
        const longName = escapeHtml(formatNameValue(compo.long_name));
        return `<p class='option-detail'><span class='option-detail-label'>${label}:</span><span class='bold'>${longName}</span></p>`;
      })
      .join("");

    componentsEl.innerHTML = `<div class='section-title'>Address components</div>${rows}`;
  } else {
    componentsEl.innerHTML = "";
  }

  rawEl.textContent = JSON.stringify(locality, null, 2);
}

const copyBtn = document.getElementById("copy-raw-json");

if (copyBtn) {
  copyBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const rawEl = document.getElementById("raw-json");
    const text = rawEl?.textContent ?? "";

    if (!text) return;

    navigator.clipboard
      .writeText(text)
      .then(() => {
        copyBtn.classList.add("copied");
        window.setTimeout(() => copyBtn.classList.remove("copied"), 1500);
      })
      .catch((err) => console.error("Failed to copy raw JSON:", err));
  });
}

function clearResponse() {
  const panel = document.getElementById("response-panel");

  if (!panel) return;

  panel.dataset.empty = "true";

  const summaryEl = panel.querySelector(".summary");
  const componentsEl = panel.querySelector(".address-components");
  const rawEl = document.getElementById("raw-json");

  if (summaryEl) summaryEl.innerHTML = "";

  if (componentsEl) componentsEl.innerHTML = "";

  if (rawEl) rawEl.textContent = "";
}

window.initMap = initMap;
