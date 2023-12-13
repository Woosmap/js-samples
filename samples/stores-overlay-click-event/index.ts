// [START woosmap_stores_overlay_click_event]
function initMap(): void {
  const center: woosmap.map.LatLngLiteral = { lat: 51.52, lng: -0.13 };

  const style: woosmap.map.Style = {
    breakPoint: 14,
    rules: [],
    default: {
      color: "#008a2f",
      size: 8,
      minSize: 1,
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
  };

  const map = new woosmap.map.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 13,
      center: center,
    },
  );

  const storesOverlay = new woosmap.map.StoresOverlay(style);
  storesOverlay.setMap(map);

  // [START woosmap_stores_overlay_click_event_listener]
  // Configure the click listener.
  window.woosmap.map.event.addListener(
    map,
    "store_selected",
    (store: woosmap.map.stores.StoreResponse) => {
      const getAddress = (store: woosmap.map.stores.Store): string =>
        `${store.address.lines}, ${store.address.zipcode} ${store.address.city}`;

      const getPhone = (store: woosmap.map.stores.Store): string =>
        `Phone: <a href='${store.contact.phone}'>${store.contact.phone}</a>`;

      function getStoreHTML(store: woosmap.map.stores.Store): string {
        return `<div>
                  <span><strong>${store.name}</strong></span>
                  <p>${getAddress(store)}</p>
                  <span>${getPhone(store)}</span>
                </div>`;
      }

      const infoElement = document.getElementById("info") as HTMLElement;
      infoElement.innerHTML = getStoreHTML(store.properties);
    },
  );
  // [END woosmap_stores_overlay_click_event_listener]
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
// [END woosmap_stores_overlay_click_event]
export {};
