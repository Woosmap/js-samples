// [START woosmap_draw_shapes_events]
// Initialize and add the map
let map: woosmap.map.Map;
const events = [
  "draw.create",
  "draw.delete",
  "draw.modechange",
  "draw.selectionchange",
  "draw.update",
  "draw.combine",
  "draw.uncombine",
];

const data: woosmap.map.GeoJSONFeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      id: "c40c2c23ce0c89dbc445b4dcc5913754",
      type: "Feature",
      properties: {},
      geometry: {
        coordinates: [
          [
            [-98.73532642865247, 30.126769329207107],
            [-99.58823422826457, 29.363810063756134],
            [-97.94703285628337, 28.640467970538566],
            [-96.84859099314622, 28.41338984007197],
            [-96.04737457532838, 28.867055658752506],
            [-95.37538661199761, 29.330016761277975],
            [-94.54832450328229, 29.846944934629335],
            [-94.9230870212941, 30.750699730175043],
            [-97.93411001083463, 30.950398105638087],
            [-98.73532642865247, 30.126769329207107],
          ],
        ],
        type: "Polygon",
      },
    },
    {
      id: "56cc82cc895f6cb52d87f75a7e94a904",
      type: "Feature",
      properties: {},
      geometry: {
        coordinates: [
          [
            [-98.27139781722337, 33.638565671747955],
            [-98.25118921584728, 32.02551092926721],
            [-95.62407103697022, 32.05977071105772],
            [-95.62407103697022, 33.65538867007554],
            [-98.27139781722337, 33.638565671747955],
          ],
        ],
        type: "Polygon",
      },
    },
  ],
};

function populateTable() {
  const eventsTable = document.getElementById("events");
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
  map = new window.woosmap.map.Map(
    document.getElementById("map") as HTMLElement,
    {
      center: { lat: 31.54350013250679, lng: -97.13238669872247 },
      zoom: 6.5,
    },
  );

  const draw = new window.woosmap.map.Drawing({});
  draw.addControl(map);

  window.woosmap.map.event.addListenerOnce(map, "idle", () => {
    draw.add(data);
  });

  populateTable();

  for (let i = 0; i < events.length; i++) {
    const eventName = events[i] as MapboxDraw.DrawEventType;
    draw.addListener(eventName, () => {
      setupListener(eventName);
    });
  }
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
// [END woosmap_draw_shapes_events]

export {};
