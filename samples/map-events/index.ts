// [START woosmap_map_events]
const events: string[] = [
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

function initMap(): void {
  const map = new woosmap.map.Map(
    document.getElementById("map") as HTMLElement,
    {
      center: {
        lat: 51.52,
        lng: -0.13,
      },
      zoom: 10,
    },
  );

  populateEventsTable();
  events.forEach((event: string) => {
    map.addListener(event, () => {
      setupListener(event);
    });
  });
}

function populateEventsTable(): void {
  const eventsTable = document.getElementById("sidebar") as HTMLElement;
  const content: string[] = [];
  events.forEach((event: string) => {
    content.push(`<div class="event" id="${event}">${event}</div>`);
  });
  eventsTable.innerHTML = content.join("");
}

function setupListener(name: string): void {
  const eventRow = document.getElementById(name) as HTMLElement;
  if (eventRow) {
    eventRow.className = "event active";
    setTimeout(() => {
      eventRow.className = "event inactive";
    }, 1000);
  }
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
// [END woosmap_map_events]
export {};
