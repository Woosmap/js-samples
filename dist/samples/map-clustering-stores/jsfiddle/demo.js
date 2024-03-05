let __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P((resolve) => {
            resolve(value);
          });
    }
    return new (P || (P = Promise))((resolve, reject) => {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }

      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }

      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }

      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
import Supercluster from "supercluster";
let map;
let infoWindow;
let index;
let markers = [];
const ICON_URL = "https://images.woosmap.com/dot-green.svg"; //
const SUPERCLUSTER_OPTIONS = {
  radius: 30,
  extent: 256,
  maxZoom: 15,
  minPoints: 2,
};

function initMap() {
  infoWindow = new woosmap.map.InfoWindow({});
  map = new window.woosmap.map.Map(document.getElementById("map"), {
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
  });
  getAllStores().then((stores) => {
    index = new Supercluster(SUPERCLUSTER_OPTIONS).load(stores);
    update();
  });
  manageEvents();
}

function getAllStores() {
  const allStores = [];
  const query = {
    storesByPage: 300,
  };
  const storesService = new woosmap.map.StoresService();
  const getStores = (storePage) =>
    __awaiter(this, void 0, void 0, function* () {
      if (storePage) {
        query.page = storePage;
      }
      return storesService
        .search(query)
        .then((response) => {
          allStores.push(...response.features);
          if (query.page === response.pagination.pageCount) {
            return allStores;
          }
          return getStores(response.pagination.page + 1);
        })
        .catch((err) => {
          console.error(err);
          throw new Error(`Error getting all stores: ${err.message}`);
        });
    });
  return getStores();
}

function manageEvents() {
  map.addListener("dragend", debounce(update, 20));
  map.addListener("zoom_changed", debounce(update, 20));
  window.addEventListener("resize", debounce(update, 100));
}

function update() {
  clearMarkers();

  const bounds = map.getBounds();
  const bbox = [
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

function clearMarkers() {
  for (const marker of markers) {
    marker.setMap(null);
  }

  markers = [];
}

function createClusterIcon(feature, latlng) {
  if (!feature.properties.cluster) {
    return createMarker(feature, latlng);
  }
  return createCluster(feature, latlng);
}

function createCluster(feature, latlng) {
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

function createMarker(feature, latlng) {
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

function debounce(callback, timeout) {
  let timer;

  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...args);
    }, timeout);
  };
}

window.initMap = initMap;
