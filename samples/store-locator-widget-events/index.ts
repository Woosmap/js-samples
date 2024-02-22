// [START woosmap_store_locator_widget_events]
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
    primary_color: "#e31a1c",
  },
  woosmapview: {
    initialZoom: 4,
    breakPoint: 3,
    baseMapStyle: [
      {
        featureType: "poi.business",
        elementType: "labels",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "administrative",
        elementType: "all",
        stylers: [
          {
            visibility: "on",
          },
          {
            lightness: 33,
          },
        ],
      },
      {
        featureType: "landscape",
        stylers: [
          {
            hue: "#FFBB00",
          },
          {
            saturation: 43.400000000000006,
          },
          {
            lightness: 37.599999999999994,
          },
          {
            gamma: 1,
          },
        ],
      },
      {
        featureType: "road.highway",
        stylers: [
          {
            hue: "#FFC200",
          },
          {
            saturation: -61.8,
          },
          {
            lightness: 45.599999999999994,
          },
          {
            gamma: 1,
          },
        ],
      },
      {
        featureType: "road.arterial",
        stylers: [
          {
            hue: "#FF0300",
          },
          {
            saturation: -100,
          },
          {
            lightness: 51.19999999999999,
          },
          {
            gamma: 1,
          },
        ],
      },
      {
        featureType: "road.local",
        stylers: [
          {
            hue: "#FF0300",
          },
          {
            saturation: -100,
          },
          {
            lightness: 52,
          },
          {
            gamma: 1,
          },
        ],
      },
      {
        featureType: "water",
        stylers: [
          {
            hue: "#0078FF",
          },
          {
            saturation: -13.200000000000003,
          },
          {
            lightness: 2.4000000000000057,
          },
          {
            gamma: 1,
          },
        ],
      },
      {
        featureType: "poi",
        stylers: [
          {
            hue: "#00FF6A",
          },
          {
            saturation: -1.0989010989011234,
          },
          {
            lightness: 11.200000000000017,
          },
          {
            gamma: 1,
          },
        ],
      },
    ],
    tileStyle: {
      color: "#e31a1c",
      size: 13,
      minSize: 5,
    },
    style: {
      default: {
        icon: {
          url: "https://s3.eu-central-1.amazonaws.com/webapp-conf.woosmap.com/foodmarkets-woos/default.svg",
          scaledSize: {
            width: 24,
            height: 24,
          },
          anchor: {
            x: 16,
            y: 16,
          },
        },
        selectedIcon: {
          url: "https://s3.eu-central-1.amazonaws.com/webapp-conf.woosmap.com/foodmarkets-woos/selected.svg",
          scaledSize: {
            width: 32,
            height: 32,
          },
          anchor: {
            x: 21,
            y: 21,
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

const populateTable = () => {
  const eventsTable = document.getElementById("sidebar");
  let content = "";
  for (let i = 0; i < events.length; i++) {
    content += `<div class="event" id="${events[i]}">${events[i]}</div>`;
  }
  if (eventsTable) {
    eventsTable.innerHTML = content;
  }
};

const setupListener = (name) => {
  const eventRow = document.getElementById(name);
  if (eventRow) {
    eventRow.className = "event active";
    window.setTimeout(() => {
      eventRow.className = "event inactive";
    }, 1000);
  }
};

const loadStoreLocator = () => {
  //@ts-ignore
  const webapp = new WebApp("store-locator", "foodmarkets-woos");

  const bodyElement = document.querySelector("body");
  let isMobile = false;
  if (bodyElement && bodyElement.clientWidth) {
    isMobile = bodyElement.clientWidth < 550;
  }
  populateTable();
  webapp.listenOn(webapp.HANDLED_EVENT.SELECT_STORE, (storeId) => {
    console.log(storeId);
    setupListener("SELECT_STORE");
  });
  webapp.listenOn(webapp.HANDLED_EVENT.PHONE_CLICK, (storeId, phone) => {
    console.log(storeId);
    console.log(phone);
    setupListener("PHONE_CLICK");
  });
  webapp.listenOn(webapp.HANDLED_EVENT.EMAIL_CLICK, (storeId, email) => {
    console.log(storeId);
    console.log(email);
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
      console.log(storeId);
      console.log(start);
      console.log(end);
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
  webapp.render(isMobile);
};

loadStoreLocator();

declare global {
  interface Window {
    loadStoreLocator: () => void;
  }
}
window.loadStoreLocator = loadStoreLocator;
// [END woosmap_store_locator_widget_events]

export {};
