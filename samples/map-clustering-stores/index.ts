// [START woosmap_map_clustering_stores]
import type * as GeoJSON from "geojson";
import Supercluster from "supercluster";

let map: woosmap.map.Map;
let infoWindow: woosmap.map.InfoWindow;
let index: Supercluster;
let markers: woosmap.map.marker.AdvancedMarkerElement[] = [];
const ICON_URL = "https://images.woosmap.com/dot-green.svg"; //
type ClusterOrPoint = ReturnType<Supercluster["getClusters"]>[number];

const SUPERCLUSTER_OPTIONS: Supercluster.Options<
  Supercluster.AnyProps,
  Supercluster.AnyProps
> = {
  radius: 30,
  extent: 256,
  maxZoom: 15,
  minPoints: 2,
};

async function initMap(): Promise<void> {
  await woosmap.map.importLibrary("maps");
  await woosmap.map.importLibrary("marker");

  infoWindow = new woosmap.map.InfoWindow({});
  map = (document.getElementById("map") as woosmap.map.MapElement).innerMap;
  map.setOptions({
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
    });
    map.moveCamera({
      center: { lat: 53.3485, lng: -6.257 },
      zoom: 12,
    });

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
  feature: ClusterOrPoint,
  latlng: woosmap.map.LatLngLiteral,
): woosmap.map.marker.AdvancedMarkerElement {
  if (!feature.properties.cluster) {
    return createMarker(feature, latlng);
  }
  return createCluster(feature, latlng);
}

function createCluster(
  feature: ClusterOrPoint,
  latlng: woosmap.map.LatLngLiteral,
): woosmap.map.marker.AdvancedMarkerElement {
  const count = feature.properties.point_count;
  const color = count < 5 ? "#0B9D58" : count < 12 ? "#F5B300" : "#DA0A40";

  const size = count < 80 ? 45 : count < 400 ? 55 : 65;

  const svg = window.btoa(`
<svg fill="${color}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
  <circle cx="120" cy="120" opacity=".8" r="70" />
  <circle cx="120" cy="120" opacity=".3" r="80" />
  <circle cx="120" cy="120" opacity=".2" r="110" />
</svg>`);

  const container = document.createElement("div");
  container.style.position = "relative";
  container.style.width = `${size}px`;
  container.style.height = `${size}px`;

  const icon = document.createElement("img");
  icon.src = `data:image/svg+xml;base64,${svg}`;
  icon.style.width = `${size}px`;
  icon.style.height = `${size}px`;
  container.appendChild(icon);

  const labelSpan = document.createElement("span");
  labelSpan.textContent = feature.properties["point_count_abbreviated"];
  labelSpan.style.position = "absolute";
  labelSpan.style.left = "50%";
  labelSpan.style.top = "50%";
  labelSpan.style.transform = "translate(-50%, -50%)";
  labelSpan.style.color = "white";
  labelSpan.style.fontSize = "12px";
  labelSpan.style.fontWeight = "bold";
  container.appendChild(labelSpan);

  const marker = new woosmap.map.marker.AdvancedMarkerElement({
    position: latlng,
    content: container,
    gmpClickable: true,
    map: map,
  });
  marker.addListener("click", () => {
    infoWindow.close();
    const expansionZoom = index.getClusterExpansionZoom(
      feature.properties["cluster_id"],
    );
    map.moveCamera({ center: marker.position!, zoom: expansionZoom });
  });
  return marker;
}

function createMarker(
  feature: ClusterOrPoint,
  latlng: woosmap.map.LatLngLiteral,
): woosmap.map.marker.AdvancedMarkerElement {
  const markerContent = document.createElement("img");
  markerContent.src = ICON_URL;
  markerContent.style.width = "20px";
  markerContent.style.height = "20px";

  const marker = new woosmap.map.marker.AdvancedMarkerElement({
    position: latlng,
    content: markerContent,
    gmpClickable: true,
    map: map,
  });
  marker.addListener("click", () => {
    infoWindow.setContent(`<h3>${feature.properties.name}</h3>`);
    infoWindow.open({map, anchor: marker});
  });
  return marker;
}

function debounce<Args extends unknown[]>(
  callback: (...args: Args) => void,
  timeout: number,
): (...args: Args) => void {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...args);
    }, timeout);
  };
}

initMap();
// [END woosmap_map_clustering_stores]

export {};
