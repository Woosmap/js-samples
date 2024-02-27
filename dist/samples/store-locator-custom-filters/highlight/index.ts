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

function isMobileDevice(): boolean {
  return window.innerWidth < 500;
}

function createDiv(className = "", innerHTML = ""): HTMLDivElement {
  const div = document.createElement("div");
  div.className = className;
  div.innerHTML = innerHTML;
  return div;
}

function filterPanelRenderer(
  title: string,
  children: HTMLElement[],
): HTMLDivElement {
  const div = createDiv(
    "filters-list",
    `<div class='filter-group'>${title}</div>`,
  );
  children.forEach((item: HTMLElement) => {
    div.appendChild(item);
  });
  return div;
}

function filterRenderer(
  key: string,
  label: string,
  selected: boolean,
): HTMLDivElement {
  const className = key.startsWith("country")
    ? `${key.split("=").pop()?.replace(/[",]+/g, "")} country`
    : key;
  return createDiv(
    selected ? "active" : "",
    `<button><div class='icon-service icon-${className}'></div><div class='flex-grow'>${label}</div><div class='active-icon-wrapper'></div></button>`,
  );
}

function initStoreLocator(): void {
  const webapp = new window.WebApp("map", "YOUR_API_KEY");

  webapp.setConf(storeLocatorConfig);
  webapp.setFilterPanelRenderer(filterPanelRenderer);
  webapp.setFilterRenderer(filterRenderer);

  webapp.render(isMobileDevice());
}

initStoreLocator();

declare global {
  // currently, the WebApp typings are not exported, so we use `any` here
  interface Window {
    WebApp: new (elementId: string, projectKey: string) => any;
  }
}

export {};
