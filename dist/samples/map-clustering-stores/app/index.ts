import type * as GeoJSON from "geojson";
import Supercluster from "supercluster";

let map: woosmap.map.Map;
let infoWindow: woosmap.map.InfoWindow;
let index: Supercluster;
let markers: woosmap.map.Marker[] = [];
const ICON_URL = "https://images.woosmap.com/dot-green.svg"; //
const SUPERCLUSTER_OPTIONS: Supercluster.Options<any, any> = {
  radius: 30,
  extent: 256,
  maxZoom: 15,
  minPoints: 2,
};

function initMap(): void {
  infoWindow = new woosmap.map.InfoWindow({});
  map = new window.woosmap.map.Map(
    document.getElementById("map") as HTMLElement,
    {
      center: { lat: 53.3485, lng: -6.257 },
      zoom: 12,
      styles: [
        {
          elementType: "geometry",
          stylers: [{ color: "#f6f6f6" }],
        },
        {
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
        {
          elementType: "labels.text.fill",
          stylers: [{ color: "#616161" }],
        },
        {
          elementType: "labels.text.stroke",
          stylers: [{ color: "#f5f5f5" }],
        },
        {
          featureType: "administrative.land_parcel",
          elementType: "labels.text.fill",
          stylers: [{ color: "#bdbdbd" }],
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#ffffff" }],
        },
        {
          featureType: "road.arterial",
          elementType: "labels.text.fill",
          stylers: [{ color: "#757575" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [{ color: "#dadada" }],
        },
        {
          featureType: "road.highway",
          elementType: "labels.text.fill",
          stylers: [{ color: "#616161" }],
        },
        {
          featureType: "road.local",
          elementType: "labels.text.fill",
          stylers: [{ color: "#9e9e9e" }],
        },
        {
          featureType: "transit.line",
          elementType: "geometry",
          stylers: [{ color: "#e5e5e5" }],
        },
        {
          featureType: "transit.station",
          elementType: "geometry",
          stylers: [{ color: "#eeeeee" }],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#c9c9c9" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [{ color: "#9e9e9e" }],
        },
      ],
    },
  );

  getAllStores().then((stores) => {
    index = new Supercluster(SUPERCLUSTER_OPTIONS).load(stores);
    update();
  });

  manageEvents();
}

function getAllStores(): Promise<woosmap.map.stores.StoreResponse[]> {
  const allStores: woosmap.map.stores.StoreResponse[] = [];
  const query: woosmap.map.stores.StoresSearchRequest = {
    storesByPage: 300,
  };
  const storesService = new woosmap.map.StoresService();

  const getStores = async (
    storePage?: number,
  ): Promise<woosmap.map.stores.StoreResponse[]> => {
    if (storePage) {
      query.page = storePage;
    }
    return storesService
      .search(query)
      .then((response: woosmap.map.stores.StoresSearchResponse) => {
        allStores.push(...response.features);
        if (query.page === response.pagination.pageCount) {
          return allStores;
        }
        return getStores(response.pagination.page + 1);
      })
      .catch((err: Error) => {
        console.error(err);
        throw new Error(`Error getting all stores: ${err.message}`);
      });
  };
  return getStores();
}

function manageEvents(): void {
  map.addListener("dragend", debounce(update, 20));
  map.addListener("zoom_changed", debounce(update, 20));
  window.addEventListener("resize", debounce(update, 100));
}

function update(): void {
  clearMarkers();
  const bounds = map.getBounds();
  const bbox: GeoJSON.BBox = [
    bounds.getSouthWest().lng(),
    bounds.getSouthWest().lat(),
    bounds.getNorthEast().lng(),
    bounds.getNorthEast().lat(),
  ];
  const clusterData = index.getClusters(bbox, map.getZoom());
  for (const feature of clusterData) {
    const latlng = {
      lat: feature.geometry.coordinates[1],
      lng: feature.geometry.coordinates[0],
    };
    markers.push(createClusterIcon(feature, latlng));
  }
}

function clearMarkers(): void {
  for (const marker of markers) {
    marker.setMap(null);
  }
  markers = [];
}

function createClusterIcon(
  feature: any,
  latlng: woosmap.map.LatLngLiteral,
): woosmap.map.Marker {
  if (!feature.properties.cluster) {
    return createMarker(feature, latlng);
  }
  return createCluster(feature, latlng);
}

function createCluster(
  feature: any,
  latlng: woosmap.map.LatLngLiteral,
): woosmap.map.Marker {
  const count = feature.properties.point_count;
  const color = count < 5 ? "#0B9D58" : count < 12 ? "#F5B300" : "#DA0A40";

  const size = count < 80 ? 45 : count < 400 ? 55 : 65;

  const svg = window.btoa(`
<svg fill="${color}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
  <circle cx="120" cy="120" opacity=".8" r="70" />
  <circle cx="120" cy="120" opacity=".3" r="80" />
  <circle cx="120" cy="120" opacity=".2" r="110" />
</svg>`);

  const marker = new window.woosmap.map.Marker({
    label: {
      text: feature.properties["point_count_abbreviated"],
      color: "white",
    },
    position: latlng,
    icon: {
      url: `data:image/svg+xml;base64,${svg}`,
      scaledSize: new window.woosmap.map.Size(size, size),
    },
    map: map,
  });
  marker.addListener("click", (e) => {
    infoWindow.close();
    const expansionZoom = index.getClusterExpansionZoom(
      feature.properties["cluster_id"],
    );
    map.setCenter(marker.getPosition());
    map.setZoom(expansionZoom);
  });
  return marker;
}

function createMarker(
  feature: any,
  latlng: woosmap.map.LatLngLiteral,
): woosmap.map.Marker {
  const marker = new window.woosmap.map.Marker({
    icon: {
      url: ICON_URL,
      scaledSize: {
        height: 20,
        width: 20,
      },
    },
    position: latlng,
    map: map,
  });
  marker.addListener("click", () => {
    infoWindow.setContent(`<h3>${feature.properties.name}</h3>`);
    infoWindow.open(map, marker);
  });
  return marker;
}

function debounce<T extends (...args: any[]) => ReturnType<T>>(
  callback: T,
  timeout: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...args);
    }, timeout);
  };
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;

export {};
