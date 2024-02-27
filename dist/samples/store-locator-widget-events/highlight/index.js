const configLocator = {
  maps: {
    provider: "woosmap",
    localities: {
      types: [],
    },
  },
  datasource: {
    max_responses: 5,
    max_distance: 0,
  },
  theme: {
    primary_color: "#00754a",
  },
  woosmapview: {
    initialCenter: {
      lat: 51.50940214,
      lng: -0.133012,
    },
    initialZoom: 15,
    breakPoint: 16,
    tileStyle: {
      color: "#00754a",
      size: 13,
      minSize: 5,
    },
    style: {
      default: {
        icon: {
          url: "https://images.woosmap.com/starbucks-marker.svg",
          scaledSize: {
            height: 40,
            width: 34,
          },
        },
        selectedIcon: {
          url: "https://images.woosmap.com/starbucks-marker-selected.svg",
          scaledSize: {
            height: 50,
            width: 43,
          },
        },
      },
    },
  },
};
const events = [
  "AUTOCOMPLETE",
  "EMAIL_CLICK",
  "FAVORITED",
  "GEOCODE",
  "GET_DIRECTIONS",
  "LOCATION_SELECTED",
  "PHONE_CLICK",
  "SELECT_DIRECTION",
  "SELECT_STORE",
];

function populateTable() {
  const eventsTable = document.getElementById("sidebar");

  eventsTable.innerHTML = events
    .map((event) => `<div class="event" id="${event}">${event}</div>`)
    .join("");
}

function setupListener(name) {
  const eventRow = document.getElementById(name);

  eventRow.classList.remove("inactive");
  eventRow.classList.add("event", "active");
  window.setTimeout(() => {
    eventRow.classList.remove("active");
    eventRow.classList.add("inactive");
  }, 1000);
}

function isMobileDevice() {
  return window.innerWidth < 500;
}

function initStoreLocator() {
  const webapp = new window.WebApp("map", "YOUR_API_KEY");

  populateTable();
  webapp.listenOn(webapp.HANDLED_EVENT.SELECT_STORE, (storeId) => {
    console.log(storeId);
    setupListener("SELECT_STORE");
  });
  webapp.listenOn(webapp.HANDLED_EVENT.PHONE_CLICK, (storeId, phone) => {
    console.log(storeId, phone);
    setupListener("PHONE_CLICK");
  });
  webapp.listenOn(webapp.HANDLED_EVENT.EMAIL_CLICK, (storeId, email) => {
    console.log(storeId, email);
    setupListener("EMAIL_CLICK");
  });
  webapp.listenOn(webapp.HANDLED_EVENT.LOCATION_SELECTED, (location) => {
    console.log(location);
    setupListener("LOCATION_SELECTED");
  });
  webapp.listenOn(webapp.HANDLED_EVENT.GEOCODE, (query) => {
    console.log(query);
    setupListener("GEOCODE");
  });
  webapp.listenOn(webapp.HANDLED_EVENT.AUTOCOMPLETE, (query) => {
    console.log(query);
    setupListener("AUTOCOMPLETE");
  });
  webapp.listenOn(
    webapp.HANDLED_EVENT.GET_DIRECTIONS,
    (storeId, start, end) => {
      console.log(storeId, start, end);
      setupListener("GET_DIRECTIONS");
    },
  );
  webapp.listenOn(webapp.HANDLED_EVENT.SELECT_DIRECTION, (storeId) => {
    console.log(storeId);
    setupListener("SELECT_DIRECTION");
  });
  webapp.listenOn(webapp.HANDLED_EVENT.FAVORITED, (storeId) => {
    console.log(storeId);
    setupListener("FAVORITED");
  });
  webapp.setConf(configLocator);
  webapp.render(isMobileDevice());
}

initStoreLocator();
