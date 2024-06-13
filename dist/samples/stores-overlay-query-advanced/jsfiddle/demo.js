let typeSelect;
let tagSelect;
let clauseAnd;
let clauseOr;
let storesOverlay;

// Function to build and set the query
function setQuery() {
  const type = typeSelect.value;
  const tag = tagSelect.value;
  const clauseFunction = clauseAnd.checked
    ? woosmap.map.query.and
    : woosmap.map.query.or;
  let query;

  if (type !== "all" && tag !== "all") {
    query = clauseFunction([
      woosmap.map.query.F("type", type),
      woosmap.map.query.F("tag", tag),
    ]);
  } else if (type !== "all") {
    query = clauseFunction([woosmap.map.query.F("type", type)]);
  } else if (tag !== "all") {
    query = clauseFunction([woosmap.map.query.F("tag", tag)]);
  } else {
    query = clauseFunction([]);
  }

  storesOverlay.setQuery(query.toString());
}

function initMap() {
  const center = { lat: 51.52, lng: -0.13 };
  const icon = {
    url: "https://images.woosmap.com/marker-blue.svg",
    scaledSize: {
      height: 40,
      width: 34,
    },
  };
  const style = {
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
  const map = new woosmap.map.Map(document.getElementById("map"), {
    zoom: 8,
    center: center,
  });

  storesOverlay = new woosmap.map.StoresOverlay(style);
  storesOverlay.setMap(map);
  initUI();
}

function initUI() {
  typeSelect = document.getElementById("type");
  tagSelect = document.getElementById("tag");
  clauseAnd = document.getElementById("clauseAND");
  clauseOr = document.getElementById("clauseOR");
  // Add event listeners to form elements
  typeSelect.addEventListener("change", setQuery);
  tagSelect.addEventListener("change", setQuery);
  clauseAnd.addEventListener("change", setQuery);
  clauseOr.addEventListener("change", setQuery);
}

window.initMap = initMap;
