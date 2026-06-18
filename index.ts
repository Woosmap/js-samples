let map: woosmap.map.Map;
let bounds: woosmap.map.LatLngBounds;
let distanceService: woosmap.map.DistanceService;
let distanceRequest: woosmap.map.distance.DistanceMatrixRequest;
const markersArray: woosmap.map.Marker[] = [];

function createMarker(
  position: woosmap.map.LatLng,
  label: string,
  url: string,
): woosmap.map.Marker {
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
}

function fitBoundsToMatrix(
  origins: woosmap.map.LatLng[] | woosmap.map.LatLngLiteral[],
  destinations: woosmap.map.LatLng[] | woosmap.map.LatLngLiteral[],
): void {
  origins.forEach((origin) => {
    bounds.extend(origin);
    markersArray.push(
      createMarker(origin, "O", "https://images.woosmap.com/marker-blue.svg"),
    );
  });

  destinations.forEach((destination) => {
    bounds.extend(destination);
    markersArray.push(
      createMarker(
        destination,
        "D",
        "https://images.woosmap.com/marker-red.svg",
      ),
    );
  });

  map.fitBounds(bounds, { top: 70, bottom: 40, left: 50, right: 50 }, true);
}

function createRequest(): woosmap.map.distance.DistanceMatrixRequest {
  const origin1: woosmap.map.LatLngLiteral = { lat: 45.4642, lng: 9.19 };
  const origin2: woosmap.map.LatLngLiteral = { lat: 45.75, lng: 4.85 };
  const destinationA: woosmap.map.LatLngLiteral = { lat: 42.6976, lng: 9.45 };
  const destinationB: woosmap.map.LatLngLiteral = {
    lat: 41.9028,
    lng: 12.4964,
  };

  return {
    origins: [origin1, origin2],
    destinations: [destinationA, destinationB],
    travelMode: woosmap.map.TravelMode.DRIVING,
    unitSystem: woosmap.map.UnitSystem.METRIC,
    avoidHighways: false,
    avoidTolls: false,
  };
}

function handleResponse(
  response: woosmap.map.distance.DistanceMatrixResponse,
): void {
  const responseElement = document.getElementById("response");
  if (responseElement) {
    responseElement.innerText = JSON.stringify(response, null, 2);
    fitBoundsToMatrix(distanceRequest.origins, distanceRequest.destinations);
  }
}

function calculateDistances(): void {
  distanceRequest = createRequest();
  const requestElement = document.getElementById("request");
  if (requestElement) {
    requestElement.innerText = JSON.stringify(distanceRequest, null, 2);
    distanceService.getDistanceMatrix(distanceRequest).then(handleResponse);
  }
}

function initMap(): void {
  map = new woosmap.map.Map(document.getElementById("map") as HTMLElement, {
    center: { lat: 45.53, lng: 2.4 },
    zoom: 10,
  });
  distanceService = new woosmap.map.DistanceService();
  bounds = new woosmap.map.LatLngBounds();
  calculateDistances();
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;

export {};
