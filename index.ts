function initMap(): void {
  const center: woosmap.map.LatLngLiteral = { lat: 51.52, lng: -0.13 };

  const iconMarker: woosmap.map.Icon = {
    labelOrigin: new window.woosmap.map.Point(14, 15),
    url: "https://images.woosmap.com/marker-red.svg",
  };

  const map = new woosmap.map.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 10,
      center: center,
    },
  );

  let labelNumber = 1;
  new window.woosmap.map.Marker({
    position: map.getCenter(),
    icon: iconMarker,
    label: {
      text: String(labelNumber),
      color: "white",
    },
    map,
  });

  map.addListener("click", (e) => {
    labelNumber += 1;
    new window.woosmap.map.Marker({
      position: e.latlng,
      icon: iconMarker,
      label: {
        text: String(labelNumber),
        color: "white",
      },
      map,
    });
  });
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
export {};
