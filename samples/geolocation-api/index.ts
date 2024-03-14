// [START woosmap_geolocation_api]
let map: woosmap.map.Map;
const woosmap_key = "YOUR_API_KEY";

interface GeoLocationResponse {
  accuracy: number;
  continent: string;
  country_code: string;
  country_name: string;
  latitude: number;
  longitude: number;
  postal_code: string;
  region_state: string;
  timezone: string;
  viewport: Bounds;
  city: string;
}
interface Bounds {
  northeast: woosmap.map.LatLngLiteral;
  southwest: woosmap.map.LatLngLiteral;
}

function initMap(): void {
  fetch(`https://api.woosmap.com/geolocation/position/?key=${woosmap_key}`)
    .then((result) => {
      return result.json();
    })
    .then((position: GeoLocationResponse) => {
      renderUserLocationOnMap(position);
      displayUserData(position);
    });
}
function renderUserLocationOnMap({ latitude, accuracy, longitude, viewport }) {
  const userPosition: woosmap.map.LatLngLiteral = {
    lat: latitude,
    lng: longitude,
  };
  let zoom = 12;
  if (accuracy > 200) {
    zoom = 4;
  } else if (accuracy > 50) {
    zoom = 5;
  } else if (accuracy > 25) {
    zoom = 8;
  } else if (accuracy > 10) {
    zoom = 9;
  } else if (accuracy > 5) {
    zoom = 10;
  } else if (accuracy > 1) {
    zoom = 11;
  }
  map = new woosmap.map.Map(document.getElementById("map") as HTMLElement, {
    center: userPosition,
    zoom,
  });
  if (viewport) {
    const bounds = {
      east: viewport.northeast.lng,
      south: viewport.southwest.lat,
      north: viewport.northeast.lat,
      west: viewport.southwest.lng,
    };
    map.fitBounds(bounds);
  }

  const marker = new woosmap.map.Marker({
    position: userPosition,
    icon: {
      url: "https://images.woosmap.com/user-position-small.png",
    },
  });
  marker.setMap(map);
}
function displayUserData(position: GeoLocationResponse) {
  const html: string[] = [];
  if (position.latitude) {
    html.push(
      `<p><span class="geolocsuccess">Device Location</span></p><p>Latitude: <strong>${position.latitude}</strong></p><p>Longitude: <strong>${position.longitude}</strong></p><p>Accuracy: <strong>${position.accuracy}km</strong></p>`,
    );
  }
  if (position.city) {
    html.push(`<p>City : <strong>${position.city}</strong></p>`);
  }
  if (position.region_state) {
    html.push(`<p>Region : <strong>${position.region_state}</strong></p>`);
  }
  if (position.country_name) {
    html.push(`<p>Country : <strong>${position.country_name}</strong></p>`);
  }

  if (position.continent) {
    html.push(`<p>Continent : <strong>${position.continent}</strong></p><br/>`);
  }
  const $infoContainer = document.getElementById("info") as HTMLElement;
  if ($infoContainer) {
    $infoContainer.innerHTML = html.join("");
    $infoContainer.style.display = "block";
  }
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
// [END woosmap_geolocation_api]

export {};
