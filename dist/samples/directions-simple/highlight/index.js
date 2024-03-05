let map;
let fromSelect;
let toSelect;

function initMap() {
  const directionsService = new woosmap.map.DirectionsService();
  const directionsRenderer = new woosmap.map.DirectionsRenderer({});

  map = new woosmap.map.Map(document.getElementById("map"), {
    zoom: 7,
    center: {
      lat: 43.5,
      lng: 2.4,
    },
  });
  directionsRenderer.setMap(map);

  const onChangeHandler = () => {
    calculateAndDisplayRoute(directionsService, directionsRenderer);
  };

  fromSelect = document.getElementById("from");
  toSelect = document.getElementById("to");
  fromSelect.addEventListener("change", onChangeHandler);
  toSelect.addEventListener("change", onChangeHandler);
  calculateAndDisplayRoute(directionsService, directionsRenderer);
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  const displayMetadataRoute = (route) => {
    if (route) {
      document.getElementById("distance").innerText =
        route.legs[0].distance.text;
      document.getElementById("duration").innerText =
        route.legs[0].duration.text;
    }
  };

  directionsService.route(
    {
      origin: getSelectedLatLng(fromSelect),
      destination: getSelectedLatLng(toSelect),
      provideRouteAlternatives: true,
    },
    (response, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(response);
        displayMetadataRoute(response.routes[0]);
        directionsRenderer.addListener("routeIndex_changed", () => {
          displayMetadataRoute(
            response.routes[directionsRenderer.get("routeIndex")],
          );
        });
      } else {
        window.alert(`Directions request failed due to ${status}`);
      }
    },
  );
}

function getSelectedLatLng(selectElement) {
  let _a, _b;
  return {
    lat: parseFloat(
      (_a = selectElement.options[selectElement.selectedIndex]) === null ||
        _a === void 0
        ? void 0
        : _a.getAttribute("data-lat"),
    ),
    lng: parseFloat(
      (_b = selectElement.options[selectElement.selectedIndex]) === null ||
        _b === void 0
        ? void 0
        : _b.getAttribute("data-lng"),
    ),
  };
}

window.initMap = initMap;
