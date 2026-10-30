// [START woosmap_map_events]
const events = [
  "bounds_changed",
  "center_changed",
  "click",
  "dblclick",
  "drag",
  "dragend",
  "dragstart",
  "idle",
  "mousemove",
  "mouseout",
  "mouseover",
  "rightclick",
  "zoom_changed",
];

async function initMap() {
  await woosmap.map.importLibrary("maps");

  const map = document.getElementById("map").innerMap;

  map.moveCamera({
    center: {
      lat: 51.52,
      lng: -0.13,
    },
    zoom: 10,
  });
  populateEventsTable();
  events.forEach((event) => {
    map.addListener(event, () => {
      setupListener(event);
    });
  });
}

function populateEventsTable() {
  const eventsTable = document.getElementById("sidebar");
  const content = [];

  events.forEach((event) => {
    content.push(`<div class="event" id="${event}">${event}</div>`);
  });
  eventsTable.innerHTML = content.join("");
}

function setupListener(name) {
  const eventRow = document.getElementById(name);

  if (eventRow) {
    eventRow.className = "event active";
    setTimeout(() => {
      eventRow.className = "event inactive";
    }, 1000);
  }
}

initMap();
// [END woosmap_map_events]
