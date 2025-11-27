const storeLocatorConfig = {
  theme: {
    primary_color: "#00754a",
  },
  maps: {
    provider: "baidu",
    apiKey: "oUQDfIp2b7qNxIuSaghaeip7",
  },
  woosmapView: {
    baiduMapStyle: {
      style: "light",
      // style: "dark"
      // style: "grassgreen"
      // style: 'midnight',
      // style: 'pink',
      // style: 'bluish',
      // style: "hardedge"
    },
    initialCenter: {
      lat: 31.230780461545375,
      lng: 121.36283503342771,
    },
    initialZoom: 13,
    breakPoint: 14,
    tileStyle: {
      color: "#00754a",
      size: 13,
      minSize: 6,
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

function isMobileDevice(): boolean {
  return window.innerWidth < 500;
}

function initStoreLocator(): void {
  const webapp = new window.WebApp("map", import.meta.env.VITE_WOOSMAP_PUBLIC_API_KEY!);
  webapp.setConf(storeLocatorConfig);
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
