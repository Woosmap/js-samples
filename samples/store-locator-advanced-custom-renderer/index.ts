// [START woosmap_store_locator_advanced_custom_renderer]
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
  initialSearch: {
    text: "Paris",
  },
};

interface StoreProperties {
  name: string;
  store_id: string;
  contact: {
    phone: string;
    website: string;
  };
  address: {
    lines: string;
    zipcode: string;
    city: string;
  };
  weekly_opening: object;
  user_properties: {
    photo: string;
  };
}

interface StoreData {
  properties: StoreProperties;
}

const convertTime = (UNIX_timestamp) => {
  const a = new Date(UNIX_timestamp * 1000);
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
  const time = `${months[a.getMonth()]} ${a.getDate()}, ${a.getFullYear()}`;
  return time;
};

const getPhoto = ({ properties }: StoreData) =>
  `<div id='store-photo' ><img src='${properties.user_properties.photo}'/></div>`;
const getSummaryPhoto = ({ properties }) => {
  const height = properties.distance_text ? "100px" : "80px";
  return `<div id='store-photo-summary' style='background-image:url(${properties.user_properties.photo}); height:${height} !important'></div>`;
};

const getPhone = ({ properties }) =>
  `<li id='store-phone'><div class='marker-image'></div><p>${properties.contact.phone}</p></li>`;

const getWebSite = ({ properties }) => {
  const url = properties.contact.website;
  const hostname = new URL(url).hostname.replace("www.", "");
  return `<li id='store-website'><div class='marker-image'></div><a href='${properties.contact.website}' target='_blank'>${hostname}</a></li>`;
};

const getDistanceAndTime = ({ properties }) => {
  console.log(properties);
  const distanceLabel = properties.distance_text
    ? `${properties.distance_text} ~ ${properties.duration_text}`
    : "";
  return `<p class='summary-distance'>${distanceLabel}</p>`;
};

const getOpeningLabel = ({ properties }) => {
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
};

const getAddress = ({ properties }: StoreData) => {
  const address = `${properties.address.lines}, ${properties.address.zipcode} ${properties.address.city}`;
  return `<li id='store-address'><div class='marker-image'></div><p>${address}</p></li>`;
};

const getSummaryAddress = ({ properties }: StoreData) => {
  const address = `${properties.address.lines}, ${properties.address.zipcode} ${properties.address.city}`;
  return `<p class='summary-address'>${address}</p>`;
};

const getHours = (store: StoreData) =>
  `<li id='store-hours'><div class='marker-image' ></div>${getOpeningLabel(
    store,
  )}</li>`;

const loadWebApp = () => {
  //@ts-ignore
  const webapp = new WebApp("store-locator", "foodmarkets-woos");
  webapp.setFullStoreRenderer((store: StoreData) => {
    const myCustomContent = document.createElement("ul");
    myCustomContent.id = "myCustomContentID";
    const html = [];
    html.push(getPhoto(store) as never);
    html.push(getHours(store) as never);
    html.push(getWebSite(store) as never);
    html.push(getAddress(store) as never);
    html.push(getPhone(store) as never);
    html.push("<li id='store-reviews' ></li>" as never);
    myCustomContent.innerHTML = html.join("");
    return myCustomContent;
  });
  webapp.setSummaryStoreRenderer((store: StoreData) => {
    const mySummaryContent = document.createElement("div");
    mySummaryContent.className = "store-summary";
    const html = [];
    html.push(getSummaryPhoto(store) as never);
    html.push(`<p class='store-name'>${store.properties.name}</p>` as never);
    html.push(
      `<div id='${store.properties.store_id}' class='inline-flex'>reviews...</div>` as never,
    );
    html.push(getSummaryAddress(store) as never);
    html.push(getOpeningLabel(store) as never);
    html.push(getDistanceAndTime(store) as never);
    mySummaryContent.innerHTML = html.join("");
    return mySummaryContent;
  });

  webapp.setConf(configLocator);

  const bodyElement = document.querySelector("body");
  let isMobile = false;
  if (bodyElement && bodyElement.clientWidth) {
    isMobile = bodyElement.clientWidth < 550;
  }
  webapp.render(isMobile);
};

loadWebApp();

declare global {
  interface Window {
    loadWebApp: () => void;
  }
}
window.loadWebApp = loadWebApp;
// [END woosmap_store_locator_advanced_custom_renderer]

export {};
