// [START woosmap_geolocation_api]
let map;
const woosmap_key = "YOUR_API_KEY";

function initMap() {
  fetch(`https://api.woosmap.com/geolocation/position/?key=${woosmap_key}`)
    .then((result) => {
      return result.json();
    })
    .then((position) => {
      renderUserLocationOnMap(position);
      displayGeolocationResponse(position);
    });
}

function renderUserLocationOnMap({ latitude, accuracy, longitude, viewport }) {
  const userPosition = {
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

  map = new woosmap.map.Map(document.getElementById("map"), {
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
    plotBoundary(bounds);
  }

  const marker = new woosmap.map.Marker({
    position: userPosition,
    icon: {
      url: "https://images.woosmap.com/user-position-small.png",
    },
  });

  marker.setMap(map);
}

function displayGeolocationResponse(position) {
  const html = [];

  html.push(syntaxHighlight(position));

  const $infoContainer = document.getElementById("response");

  if ($infoContainer) {
    $infoContainer.innerHTML = html.join("");
    $infoContainer.style.display = "block";
  }
}

function syntaxHighlight(json) {
  if (typeof json != "string") {
    json = JSON.stringify(json, undefined, 2);
  }

  json = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\\-]?\d+)?)/g,
    (match) => {
      let cls = "number";

      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "key";
        } else {
          cls = "string";
        }
      } else if (/true|false/.test(match)) {
        cls = "boolean";
      } else if (/null/.test(match)) {
        cls = "null";
      }
      return '<span class="' + cls + '">' + match + "</span>";
    },
  );
}

function plotBoundary(bounds) {
  const rectangle = new woosmap.map.Rectangle({
    bounds,
    strokeColor: "#b71c1c",
    strokeOpacity: 0.5,
    strokeWeight: 2,
    fillColor: "#b71c1c",
    fillOpacity: 0.2,
  });

  rectangle.setMap(map);
}

window.initMap = initMap;
// [END woosmap_geolocation_api]
