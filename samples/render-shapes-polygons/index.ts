// [START woosmap_render_shapes_polygons]
// Initialize and add the map
let map: woosmap.map.Map;

function initMap() {
  // [START woosmap_add_map_instantiate_map]
  map = new window.woosmap.map.Map(
    document.getElementById("map") as HTMLElement,
    {
      center: { lat: 29.65, lng: -97.74 },
      zoom: 6,
    },
  );
  // [END woosmap_add_map_instantiate_map]
  //Outter Shape of Polygon
  const outerShape = [
    { lat: 28.59, lng: -100.65 },
    { lat: 28.59, lng: -96.08 },
    { lat: 31.33, lng: -96.08 },
    { lat: 31.33, lng: -100.65 },
    { lat: 28.59, lng: -100.65 },
  ];
  //The Polygon Hole
  const innerShape = [
    { lat: 29.07, lng: -98.81 },
    { lat: 29.07, lng: -96.63 },
    { lat: 30.16, lng: -96.63 },
    { lat: 30.16, lng: -98.81 },
    { lat: 29.07, lng: -98.81 },
  ];
  //Polygon Object with Paths as an Array of LatLnf Array
  const polygon = new woosmap.map.Polygon({
    paths: [outerShape, innerShape],
    strokeColor: "#b71c1c",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#b71c1c",
    fillOpacity: 0.5,
  });
  polygon.setMap(map);
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
// [END woosmap_render_shapes_polygons]

export {};
