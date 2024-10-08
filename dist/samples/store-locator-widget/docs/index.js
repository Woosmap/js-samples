// [START woosmap_store_locator_widget]
const storeLocatorConfig = {
  theme: {
    primary_color: "#000",
  },
  datasource: {
    max_responses: 5,
    max_distance: 50000,
  },
  internationalization: {
    lang: "en",
    unitSystem: 0,
    customTranslations: {
      en: {
        storeview: {
          visitStorePage: "Visit Store Page",
        },
      },
    },
  },
  maps: {
    provider: "woosmap",
    localities: {
      types: [],
    },
    w3w: true,
  },
  woosmapview: {
    initialCenter: {
      lat: 48.967529,
      lng: 2.368438,
    },
    initialZoom: 6,
    tileStyle: {
      color: "#2d2d2d",
      size: 11,
      minSize: 5,
      typeRules: [
        {
          type: "bose_store",
          color: "#2d2d2d",
          zIndex: 10,
        },
        {
          type: "professional_systems",
          color: "#733f00",
          zIndex: 1,
        },
        {
          type: "bose_excellence_centre",
          color: "#ef8900",
          zIndex: 8,
        },
        {
          type: "bose_reseller",
          color: "#607c92",
          zIndex: 5,
        },
        {
          type: "bose_factory_store",
          color: "#607c92",
          zIndex: 6,
        },
      ],
    },
    baseMapStyle: [
      {
        featureType: "water",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#d3d3d3",
          },
        ],
      },
      {
        featureType: "transit",
        elementType: "all",
        stylers: [
          {
            saturation: -100,
          },
          {
            visibility: "simplified",
          },
        ],
      },
      {
        featureType: "transit.station",
        elementType: "all",
        stylers: [
          {
            visibility: "on",
          },
        ],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [
          {
            visibility: "on",
          },
          {
            color: "#b3b3b3",
          },
        ],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#ffffff",
          },
        ],
      },
      {
        featureType: "road.local",
        elementType: "geometry.fill",
        stylers: [
          {
            visibility: "on",
          },
          {
            color: "#ffffff",
          },
          {
            weight: 1.8,
          },
        ],
      },
      {
        featureType: "road.local",
        elementType: "geometry.stroke",
        stylers: [
          {
            color: "#d7d7d7",
          },
        ],
      },
      {
        featureType: "poi",
        elementType: "geometry.fill",
        stylers: [
          {
            visibility: "on",
          },
          {
            color: "#ebebeb",
          },
        ],
      },
      {
        featureType: "administrative",
        elementType: "geometry",
        stylers: [
          {
            color: "#a7a7a7",
          },
        ],
      },
      {
        featureType: "road.arterial",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#ffffff",
          },
        ],
      },
      {
        featureType: "road.arterial",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#ffffff",
          },
        ],
      },
      {
        featureType: "landscape",
        elementType: "geometry.fill",
        stylers: [
          {
            visibility: "on",
          },
          {
            color: "#efefef",
          },
        ],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#696969",
          },
        ],
      },
      {
        featureType: "administrative",
        elementType: "labels.text.fill",
        stylers: [
          {
            visibility: "on",
          },
          {
            color: "#737373",
          },
        ],
      },
      {
        featureType: "poi",
        elementType: "labels.icon",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "road.arterial",
        elementType: "geometry.stroke",
        stylers: [
          {
            color: "#d6d6d6",
          },
        ],
      },
      {
        featureType: "road",
        elementType: "labels.icon",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {},
      {
        featureType: "poi",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#dadada",
          },
        ],
      },
    ],
    breakPoint: 10,
    style: {
      rules: [
        {
          type: "bose_store",
          icon: {
            url: "https://webapp-conf.woosmap.com/woos-0c78592f-13ea-362b-aa07-ba4ba9ea3dae/default.svg",
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
            url: "https://webapp-conf.woosmap.com/woos-0c78592f-13ea-362b-aa07-ba4ba9ea3dae/selected.svg",
            scaledSize: {
              width: 32,
              height: 32,
            },
            anchor: {
              x: 21,
              y: 21,
            },
          },
          numberedIcon: {
            url: "https://webapp-conf.woosmap.com/woos-0c78592f-13ea-362b-aa07-ba4ba9ea3dae/default.svg",
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
        {
          type: "bose_reseller",
          icon: {
            url: "https://webapp-conf.woosmap.com/woos-0c78592f-13ea-362b-aa07-ba4ba9ea3dae/default_reseller.svg",
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
            url: "https://webapp-conf.woosmap.com/woos-0c78592f-13ea-362b-aa07-ba4ba9ea3dae/selected.svg",
            scaledSize: {
              width: 32,
              height: 32,
            },
            anchor: {
              x: 21,
              y: 21,
            },
          },
          numberedIcon: {
            url: "https://webapp-conf.woosmap.com/woos-0c78592f-13ea-362b-aa07-ba4ba9ea3dae/default_reseller.svg",
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
        {
          type: "professional_systems",
          icon: {
            url: "https://webapp-conf.woosmap.com/woos-0c78592f-13ea-362b-aa07-ba4ba9ea3dae/default_professional.svg",
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
            url: "https://webapp-conf.woosmap.com/woos-0c78592f-13ea-362b-aa07-ba4ba9ea3dae/selected.svg",
            scaledSize: {
              width: 32,
              height: 32,
            },
            anchor: {
              x: 21,
              y: 21,
            },
          },
          numberedIcon: {
            url: "https://webapp-conf.woosmap.com/woos-0c78592f-13ea-362b-aa07-ba4ba9ea3dae/default_professional.svg",
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
        {
          type: "bose_excellence_centre",
          icon: {
            url: "https://webapp-conf.woosmap.com/woos-0c78592f-13ea-362b-aa07-ba4ba9ea3dae/default_excellence.svg",
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
            url: "https://webapp-conf.woosmap.com/woos-0c78592f-13ea-362b-aa07-ba4ba9ea3dae/selected.svg",
            scaledSize: {
              width: 32,
              height: 32,
            },
            anchor: {
              x: 21,
              y: 21,
            },
          },
          numberedIcon: {
            url: "https://webapp-conf.woosmap.com/woos-0c78592f-13ea-362b-aa07-ba4ba9ea3dae/default_excellence.svg",
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
        {
          type: "bose_factory_store",
          icon: {
            url: "https://webapp-conf.woosmap.com/woos-0c78592f-13ea-362b-aa07-ba4ba9ea3dae/default_factory.svg",
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
            url: "https://webapp-conf.woosmap.com/woos-0c78592f-13ea-362b-aa07-ba4ba9ea3dae/selected.svg",
            scaledSize: {
              width: 32,
              height: 32,
            },
            anchor: {
              x: 21,
              y: 21,
            },
          },
          numberedIcon: {
            url: "https://webapp-conf.woosmap.com/woos-0c78592f-13ea-362b-aa07-ba4ba9ea3dae/default_factory.svg",
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
      ],
      default: {
        icon: {
          url: "https://webapp-conf.woosmap.com/woos-0c78592f-13ea-362b-aa07-ba4ba9ea3dae/default.svg",
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
          url: "https://webapp-conf.woosmap.com/woos-0c78592f-13ea-362b-aa07-ba4ba9ea3dae/selected.svg",
          scaledSize: {
            width: 32,
            height: 32,
          },
          anchor: {
            x: 21,
            y: 21,
          },
        },
        numberedIcon: {
          url: "https://webapp-conf.woosmap.com/woos-0c78592f-13ea-362b-aa07-ba4ba9ea3dae/default.svg",
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
  filters: {
    filters: [
      {
        propertyType: "type",
        title: {
          en: "Store Type",
        },
        choices: [
          {
            key: "bose_store",
            en: "Bose Store",
          },
          {
            key: "bose_reseller",
            en: "Reseller",
          },
          {
            key: "professional_systems",
            en: "Professional Systems",
          },
          {
            key: "aviation",
            en: "Aviation",
          },
          {
            key: "bose_factory_store",
            en: "Factory Store",
          },
          {
            key: "bose_music_partners",
            en: "Music Partners",
          },
          {
            key: "bose_excellence_centre",
            en: "Excellence Centre",
          },
          {
            key: "bose_shop-in-shop",
            en: "Shop In Shop",
          },
        ],
        innerOperator: "and",
      },
      {
        propertyType: "tag",
        title: {
          en: "Services",
        },
        choices: [
          {
            key: "wheelchair_access",
            en: "Wheelchair Access",
          },
          {
            key: "in-store_wi-fi",
            en: "Wi-Fi",
          },
          {
            key: "parking",
            en: "Parking",
          },
          {
            key: "schedule_a_demo",
            en: "Demo",
          },
          {
            key: "reserve_and_collect",
            en: "Reserve & Collect",
          },
          {
            key: "delivery_and_installation_service",
            en: "Delivery & Installation",
          },
          {
            key: "customised_solutions",
            en: "Customised Solutions",
          },
          {
            key: "financing",
            en: "Financing",
          },
          {
            key: "repair_service",
            en: "Repair Service",
          },
        ],
        innerOperator: "and",
      },
    ],
    outerOperator: "and",
  },
};

function isMobileDevice() {
  return window.innerWidth < 500;
}

function initStoreLocator() {
  const webapp = new window.WebApp("map", "YOUR_API_KEY");

  webapp.setConf(storeLocatorConfig);
  webapp.render(isMobileDevice());
}

initStoreLocator();
// [END woosmap_store_locator_widget]
