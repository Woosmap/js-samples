let map: woosmap.map.Map;
let fromSelect: HTMLSelectElement;
let toSelect: HTMLSelectElement;

function initMap(): void {
  const directionsService = new woosmap.map.DirectionsService();
  const directionsRenderer = new woosmap.map.DirectionsRenderer({});
  map = new woosmap.map.Map(document.getElementById("map") as HTMLElement, {
    zoom: 7,
    center: {
      lat: 43.5,
      lng: 2.4,
    },
  });
  directionsRenderer.setMap(map);

  const onChangeHandler = (): void => {
    calculateAndDisplayRoute(directionsService, directionsRenderer);
  };
  fromSelect = document.getElementById("from") as HTMLSelectElement;
  toSelect = document.getElementById("to") as HTMLSelectElement;
  fromSelect.addEventListener("change", onChangeHandler);
  toSelect.addEventListener("change", onChangeHandler);
  calculateAndDisplayRoute(directionsService, directionsRenderer);
}

function calculateAndDisplayRoute(
  directionsService: woosmap.map.DirectionsService,
  directionsRenderer: woosmap.map.DirectionsRenderer,
): void {
  const displayMetadataRoute = (route: woosmap.map.DirectionRoute): void => {
    if (route) {
      (document.getElementById("distance") as HTMLElement).innerText =
        route.legs[0].distance.text;
      (document.getElementById("duration") as HTMLElement).innerText =
        route.legs[0].duration.text;
    }
  };
  directionsService.route(
    {
      origin: getSelectedLatLng(fromSelect),
      destination: getSelectedLatLng(toSelect),
      provideRouteAlternatives: true,
    },
    (response: woosmap.map.DirectionResult, status: string) => {
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

function getSelectedLatLng(
  selectElement: HTMLSelectElement,
): woosmap.map.LatLngLiteral {
  return {
    lat: parseFloat(
      selectElement.options[selectElement.selectedIndex]?.getAttribute(
        "data-lat",
      ) as string,
    ),
    lng: parseFloat(
      selectElement.options[selectElement.selectedIndex]?.getAttribute(
        "data-lng",
      ) as string,
    ),
  };
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;

export {};
