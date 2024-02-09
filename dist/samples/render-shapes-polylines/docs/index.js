// [START woosmap_render_shapes_polylines]
// Initialize and add the map
let map;

function initMap() {
  map = new window.woosmap.map.Map(document.getElementById("map"), {
    center: { lat: 51.505, lng: -0.118 },
    zoom: 15,
  });

  //Polyline Shape
  const polylinePath = [
    { lng: -0.12638568878173828, lat: 51.50099581189912 },
    { lng: -0.12201905250549315, lat: 51.500832183172456 },
    { lng: -0.11891841888427736, lat: 51.50078877137083 },
    { lng: -0.11869311332702637, lat: 51.500832183172456 },
    { lng: -0.11754512786865233, lat: 51.500752038275635 },
    { lng: -0.11698186397552489, lat: 51.50050158456475 },
    { lng: -0.11669218540191649, lat: 51.50048488760175 },
    { lng: -0.11619329452514648, lat: 51.500688590132405 },
    { lng: -0.11590898036956787, lat: 51.50086557683785 },
    { lng: -0.1160377264022827, lat: 51.50112270724184 },
    { lng: -0.11700868606567383, lat: 51.50142992608211 },
    { lng: -0.11710524559020995, lat: 51.50164364231471 },
    { lng: -0.1157534122467041, lat: 51.50321309019227 },
    { lng: -0.11474490165710448, lat: 51.50420148069069 },
    { lng: -0.11411190032958984, lat: 51.50454874793857 },
    { lng: -0.11415, lat: 51.50545363381515 },
    { lng: -0.11816740036010741, lat: 51.50991769706187 },
  ];
  //Polyline Object with Path as an Array of LatLng
  const polyline = new woosmap.map.Polyline({
    path: polylinePath,
    strokeColor: "#b71c1c",
    strokeOpacity: 0.8,
    strokeWeight: 4,
  });

  polyline.setMap(map);
}

window.initMap = initMap;
// [END woosmap_render_shapes_polylines]
