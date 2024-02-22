// [START woosmap_store_locator_widget_custom_renderer]
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

interface StoreProperties {
  contact: {
    phone: string;
    website: string;
  };
  address: {
    lines: string;
    zipcode: string;
    city: string;
  };
  weekly_opening: [];
}

interface StoreData {
  properties: StoreProperties;
}

function loadWebApp() {
  //@ts-ignore
  const webapp = new WebApp("store-locator", "foodmarkets-woos");
  webapp.setFullStoreRenderer((store) => {
    const myCustomContent = document.createElement("ul");
    myCustomContent.id = "myCustomContentID";
    const html = [];
    html.push(getWebSite(store) as never);
    html.push(getAddress(store) as never);
    html.push(getHours(store) as never);
    html.push(getPhone(store) as never);
    myCustomContent.innerHTML = html.join("");
    return myCustomContent;
  });
  webapp.setSummaryStoreRenderer((store) => {
    const mySummaryContent = document.createElement("div");
    mySummaryContent.className = "store-summary";
    const html = [];
    html.push(`<p class='store-name'>${store.properties.name}</p>` as never);
    html.push(getSummaryAddress(store) as never);
    html.push(getSummaryPhone(store) as never);
    html.push(getOpeningLabel(store) as never);
    html.push(getDistanceAndTime(store) as never);
    mySummaryContent.innerHTML = html.join("");
    return mySummaryContent;
  });

  webapp.setConf(configLocator);
  const bodyElement = document.querySelector("body");
  let isMobile = false;
  if (bodyElement && bodyElement.clientWidth) {
    isMobile = bodyElement.clientWidth < 500;
  }
  webapp.setInitialStateToSelectedStore("markthalrotterdam");
  webapp.render(isMobile);
}

function getPhone({ properties }: StoreData) {
  return `<li id='store-phone'><span class='marker-image'></span><p><a class='text-black' href='tel:${properties.contact.phone}'>${properties.contact.phone}</a></p></li>`;
}

function getWebSite({ properties }: StoreData) {
  return `<li id='store-website'><span class='marker-image'></span><a class='text-black' href='${properties.contact.website}' target='_blank'>More Details</a></li>`;
}

function getDistanceAndTime({ properties }) {
  let distanceLabel = properties.distance_text ? properties.distance_text : "";
  distanceLabel += properties.duration_text
    ? ` (${properties.duration_text})`
    : "";
  return `<p class='summary-distance'>${distanceLabel}</p>`;
}

function getAddress(store: StoreData) {
  const address = `${store.properties.address.lines}, ${store.properties.address.zipcode} ${store.properties.address.city}`;
  return `<li id='store-address'><span class='marker-image'></span><p>${address}</p><p>${getDistanceAndTime(
    store,
  )}</p></li>`;
}

function getSummaryAddress({ properties }: StoreData) {
  const address = `${properties.address.lines}, ${properties.address.zipcode} ${properties.address.city}`;
  return `<p class='summary-address'>${address}</p>`;
}

function getSummaryPhone({ properties }: StoreData) {
  return `<p class='summary-address'>${properties.contact.phone}</p>`;
}

function getFullSchedule({ properties }: StoreData) {
  const weeklyOpening = properties.weekly_opening;
  const dayLabels = {
    1: "Mon",
    2: "Tue",
    3: "Wed",
    4: "Thu",
    5: "Fri",
    6: "Sat",
    7: "Sun",
  };
  let daysHoursHTMLTable = "";
  if (weeklyOpening) {
    for (const day in dayLabels) {
      let daysHours = "";
      if (weeklyOpening[day].hours.length === 0) {
        daysHours = "Closed";
      } else {
        weeklyOpening[day].hours.some((hour) => {
          if (hour && hour["all-day"]) {
            daysHours = "24h/24";
            return true;
          } else if (daysHours.length > 0) {
            daysHours += `, ${hour.start}-${hour.end}`;
          } else {
            daysHours = `${hour.start}-${hour.end}`;
          }
        });
      }
      daysHoursHTMLTable += `<tr><td class='padding-right'>${dayLabels[day]}</td><td>${daysHours}</td></tr>`;
    }
  }
  return `<table class='hours-table'>${daysHoursHTMLTable}</table>`;
}

function getHours(store: StoreData) {
  return `<li id='store-hours'><span class='marker-image'></span>${getFullSchedule(
    store,
  )}</li>`;
}

function getOpeningLabel({ properties }) {
  let openLabel = "";
  if (!properties.open) {
    return "";
  }
  if (properties.open.open_now) {
    openLabel = `Open now until ${properties.open.current_slice.end}`;
  } else {
    openLabel += `Closed until ${convertTime(
      Date.parse(properties.open.next_opening.day) / 1000,
    )} at ${properties.open.next_opening.start}`;
  }
  return `<p class='summary-hours'>${openLabel}</p>`;
}

function convertTime(UNIX_timestamp) {
  const date = new Date(UNIX_timestamp * 1000);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

loadWebApp();

declare global {
  interface Window {
    loadWebApp: () => void;
  }
}
window.loadWebApp = loadWebApp;
// [END woosmap_store_locator_widget_custom_renderer]

export {};
