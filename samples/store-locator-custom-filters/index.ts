// [START woosmap_store_locator_custom_filters]
const availableServices = [
  { key: "WF", en: "Wireless Hotspot" },
  { key: "CD", en: "Mobile Payment" },
  { key: "DT", en: "Drive-Thru" },
  { key: "DR", en: "Digital Rewards" },
  { key: "hrs24", en: "Open 24 hours per day" },
  { key: "WA", en: "Oven-warmed Food" },
  { key: "LB", en: "LaBoulange" },
  { key: "XO", en: "Mobile Order and Pay" },
  { key: "VS", en: "Verismo" },
  { key: "NB", en: "Nitro Cold Brew" },
  { key: "CL", en: "Starbucks Reserve-Clover Brewed" },
];

const loadWebApp = () => {
  //@ts-ignore
  const webapp = new WebApp(
    "store-locator",
    "woos-48c80350-88aa-333e-835a-07f4b658a9a4",
  );
  let isMobile = false;
  const bodyElement = document.querySelector("body");
  if (bodyElement && bodyElement.clientWidth) {
    isMobile = bodyElement.clientWidth < 500;
  }
  const storeLocatorConfig = {
    maps: {
      provider: "woosmap",
      localities: {
        types: [],
        componentRestrictions: { country: "gb" },
      },
    },
    filters: {
      filters: [
        {
          propertyType: "tag",
          title: {
            en: "Amenities",
          },
          choices: availableServices,
          innerOperator: "or",
        },
        {
          propertyType: "custom",
          title: {
            en: "Country",
          },
          choices: [
            {
              key: 'country:="US"',
              en: "United States",
            },
            {
              key: 'country:="GB"',
              en: "United Kingdom",
            },
            {
              key: 'country:="DE"',
              en: "Germany",
            },
            {
              key: 'country:="FR"',
              en: "France",
            },
          ],
          innerOperator: "or",
        },
      ],
      outerOperator: "and",
    },
    theme: {
      primary_color: "#008248",
    },
    woosmapview: {
      initialCenter: {
        lat: 54,
        lng: -3,
      },
      initialZoom: 7,
      breakPoint: 11,
      style: {
        default: {
          icon: {
            url: "https://demo.woosmap.com/storelocator/images/markers/starbucks-marker.svg",
            scaledSize: {
              height: 47,
              width: 40,
            },
          },
          numberedIcon: {
            url: "https://demo.woosmap.com/storelocator/images/markers/starbucks-marker.svg",
            scaledSize: {
              height: 47,
              width: 40,
            },
          },
          selectedIcon: {
            url: "https://demo.woosmap.com/storelocator/images/markers/starbucks-marker-selected.svg",
            scaledSize: {
              height: 71,
              width: 61,
            },
          },
        },
      },
      tileStyle: {
        color: "#008248",
        size: 15,
        minSize: 6,
      },
    },
  };
  webapp.setConf(storeLocatorConfig);
  webapp.setFilterPanelRenderer((title, children) => {
    const div = document.createElement("div");
    div.className = "filters-list";
    div.innerHTML = `<div class='filter-group'>${title}</div>`;
    children.forEach((item) => div.appendChild(item));
    return div;
  });
  webapp.setFilterRenderer((key, label, selected) => {
    const div = document.createElement("div");
    const className = key.startsWith("country")
      ? `${key.split("=").pop().replace(/[",]+/g, "")} country`
      : key;
    div.className = selected ? "active" : "";
    div.innerHTML = `<button><div class='icon-service icon-${className}'></div><div class='flex-grow'>${label}</div><div class='active-icon-wrapper'></div></button>`;
    return div;
  });

  webapp.render(isMobile);
};
loadWebApp();

declare global {
  interface Window {
    loadWebApp: () => void;
  }
}
window.loadWebApp = loadWebApp;
// [END woosmap_store_locator_custom_filters]

export {};
