// [START woosmap_stores_overlay_query_advanced]
let typeSelect: HTMLSelectElement;
let tagSelect: HTMLSelectElement;
let clauseAnd: HTMLInputElement;
let clauseOr: HTMLInputElement;
let storesOverlay: woosmap.map.StoresOverlay;

// Function to build and set the query
function setQuery() {
  const type = typeSelect.value;
  const tag = tagSelect.value;
  const clause = clauseAnd.checked
    ? woosmap.map.query.BoolOperators.AND
    : woosmap.map.query.BoolOperators.OR;

  let query: woosmap.map.query.Query;

  if (type !== "all" && tag !== "all") {
    query = new woosmap.map.query.Query(
      [woosmap.map.query.F("type", type), woosmap.map.query.F("tag", tag)],
      clause,
    );
  } else if (type !== "all") {
    query = new woosmap.map.query.Query([woosmap.map.query.F("type", type)]);
  } else if (tag !== "all") {
    query = new woosmap.map.query.Query([woosmap.map.query.F("tag", tag)]);
  } else {
    query = new woosmap.map.query.Query([]);
  }

  storesOverlay.setQuery(query.toString());
}

function initMap(): void {
  const center: woosmap.map.LatLngLiteral = { lat: 51.52, lng: -0.13 };
  const icon: woosmap.map.Icon = {
    url: "https://images.woosmap.com/marker-blue.svg",
    scaledSize: {
      height: 40,
      width: 34,
    },
  };
  const style: woosmap.map.Style = {
    breakPoint: 18,
    rules: [
      {
        type: "bose_store",
        color: "#2d2d2d",
        icon,
      },
      {
        type: "professional_systems",
        color: "#733f00",
        icon,
      },
      {
        type: "bose_excellence_centre",
        color: "#ef8900",
        icon,
      },
      {
        type: "bose_reseller",
        color: "#607c92",
        icon,
      },
      {
        type: "bose_factory_store",
        color: "#607c92",
        icon,
      },
    ],
    default: {
      color: "#2D2D2D",
      size: 11,
      minSize: 3,
      icon,
      selectedIcon: {
        url: "https://images.woosmap.com/marker-red.svg",
        scaledSize: {
          height: 50,
          width: 43,
        },
      },
    },
  };
  const map = new woosmap.map.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 8,
      center: center,
    },
  );

  storesOverlay = new woosmap.map.StoresOverlay(style);
  storesOverlay.setMap(map);
  initUI();
}

function initUI() {
  typeSelect = document.getElementById("type") as HTMLSelectElement;
  tagSelect = document.getElementById("tag") as HTMLSelectElement;
  clauseAnd = document.getElementById("clauseAND") as HTMLInputElement;
  clauseOr = document.getElementById("clauseOR") as HTMLInputElement;

  // Add event listeners to form elements
  typeSelect.addEventListener("change", setQuery);
  tagSelect.addEventListener("change", setQuery);
  clauseAnd.addEventListener("change", setQuery);
  clauseOr.addEventListener("change", setQuery);
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
// [END woosmap_stores_overlay_query_advanced]
export {};
