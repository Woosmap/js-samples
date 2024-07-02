// [START woosmap_geolocation_nearby_stores]
const woosmap_key = "YOUR_API_KEY";
let placeholder;
const radiusMeters = 50000;

function distance(dist) {
  if (dist > 1000) {
    return `${Math.round(dist / 100) / 10} km`;
  }
  return `${Math.round(dist)} m`;
}

function renderHTML(properties) {
  let content = `<b>${properties.name}</b><br/>`;

  if (properties.address.lines.hasOwnProperty.call(0)) {
    content += `${properties.address.lines[0]}<br/>`;
  }

  content += `${properties.address.city}<br>`;
  content += `at <b>${distance(properties.distance)}</b><br/>`;
  return content;
}

function displayNearestStore(stores) {
  if (stores && stores.features && stores.features.length > 0) {
    const store = stores.features[0];
    const properties = store.properties;

    if (placeholder) {
      placeholder.innerHTML = renderHTML(properties);
    }
  } else {
    placeholder.innerHTML = "<p>No Stores returned... (insufficient accuracy)";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  placeholder = document.getElementById("recommendation-placeholder");
  fetchNearbyStores();
});

function fetchNearbyStores() {
  fetch(
    `https://api.woosmap.com/geolocation/stores/?key=${woosmap_key}&radius=${radiusMeters}`,
  )
    .then((result) => {
      return result.json();
    })
    .then(({ stores }) => {
      displayNearestStore(stores);
    });
}
// [END woosmap_geolocation_nearby_stores]
