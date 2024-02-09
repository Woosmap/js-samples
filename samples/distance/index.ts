// [START woosmap_distance]
// Initialize and add the map
let map: woosmap.map.Map;
let distanceService: woosmap.map.DistanceService;
let bounds: woosmap.map.LatLngBounds;
let distanceRequest;
const markersArray = [];

const createMarker = (position, label, url) => {
  return new woosmap.map.Marker({
    map,
    position,
    icon: {
      url,
      labelOrigin: new woosmap.map.Point(14, 15),
      scaledSize: {
        height: 38,
        width: 26,
      },
    },
    label: {
      text: label,
      color: "white",
    },
  });
};

const fitBoundsToMatrix = (origins, destinations) => {
  origins.forEach((origin) => {
    bounds.extend(origin);
    markersArray.push(
      createMarker(
        origin,
        "O",
        "https://images.woosmap.com/marker-blue.svg",
      ) as never,
    );
  });

  destinations.forEach((destination) => {
    bounds.extend(destination);
    markersArray.push(
      createMarker(
        destination,
        "D",
        "https://images.woosmap.com/marker-red.svg",
      ) as never,
    );
  });

  map.fitBounds(bounds, { top: 70, bottom: 40, left: 50, right: 50 }, true);
};

const createRequest = () => {
  const origin1 = { lat: 45.4642, lng: 9.19 };
  const origin2 = { lat: 45.75, lng: 4.85 };
  const destinationA = { lat: 42.6976, lng: 9.45 };
  const destinationB = { lat: 41.9028, lng: 12.4964 };

  return {
    origins: [origin1, origin2],
    destinations: [destinationA, destinationB],
    travelMode: woosmap.map.TravelMode.DRIVING,
    unitSystem: woosmap.map.UnitSystem.METRIC,
    avoidHighways: false,
    avoidTolls: false,
  };
};
const handleResponse = (response) => {
  const responseElement = document.getElementById("response");
  if (responseElement) {
    responseElement.innerText = JSON.stringify(response, null, 2);
    fitBoundsToMatrix(distanceRequest.origins, distanceRequest.destinations);
  }
};

const calculateDistances = () => {
  distanceRequest = createRequest();
  const requestElement = document.getElementById("request");
  if (requestElement) {
    requestElement.innerText = JSON.stringify(distanceRequest, null, 2);
    distanceService.getDistanceMatrix(distanceRequest).then(handleResponse);
  }
};

const initMap = () => {
  map = new woosmap.map.Map(document.getElementById("map") as HTMLElement, {
    center: { lat: 45.53, lng: 2.4 },
    zoom: 10,
  });
  distanceService = new woosmap.map.DistanceService();
  bounds = new woosmap.map.LatLngBounds();
  calculateDistances();
};

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
// [END woosmap_distance]

export {};
