// [START woosmap_render_shapes_data_events]
// Initialize and add the map
let map;
const events = [
  "click",
  "mousedown",
  "dbclick",
  "mouseup",
  "mousemove",
  "mouseenter",
  "mouseout",
  "mouseover",
  "rightclick",
];

function populateTable() {
  const eventsTable = document.getElementById("sidebar");
  let content = "";

  for (let i = 0; i < events.length; i++) {
    content += `<div class="event" id="${events[i]}">${events[i]}</div>`;
  }

  if (eventsTable) {
    eventsTable.innerHTML = content;
  }
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

function initMap() {
  map = new window.woosmap.map.Map(document.getElementById("map"), {
    center: { lat: 29.65, lng: -97.74 },
    zoom: 6,
  });

  //Outter Shape of Polygon
  const outerShape = [
    { lat: 28.59, lng: -100.65 },
    { lat: 28.59, lng: -96.08 },
    { lat: 31.33, lng: -96.08 },
    { lat: 31.33, lng: -100.65 },
    { lat: 28.59, lng: -100.65 },
  ];
  //The Polygon Hole
  const innerShape = [
    { lat: 29.07, lng: -98.81 },
    { lat: 29.07, lng: -96.63 },
    { lat: 30.16, lng: -96.63 },
    { lat: 30.16, lng: -98.81 },
    { lat: 29.07, lng: -98.81 },
  ];

  map.data.add({
    geometry: new woosmap.map.Data.Polygon([outerShape, innerShape]),
  });
  populateTable();

  for (let i = 0; i < events.length; i++) {
    const eventName = events[i];

    map.data.addListener(eventName, (event) => {
      setupListener(eventName);
      console.log(event.feature);
    });
  }
}

window.initMap = initMap;
// [END woosmap_render_shapes_data_events]
