// [START woosmap_render_shapes_circles]
// Initialize and add the map
let map: woosmap.map.Map;
const data = {
  megacities: [
    {
      latlng: "35.700556,139.715",
      cityname: "Tokyo",
      citizens: 37400000,
    },
    {
      latlng: "23.133333,113.266667",
      cityname: "Guangzhou",
      citizens: 24900000,
    },
    {
      latlng: "37.566535,126.9779692",
      cityname: "Seoul",
      citizens: 24500000,
    },
    {
      latlng: "28.635308,77.22496",
      cityname: "Delhi",
      citizens: 23900000,
    },
    {
      latlng: "19.0176147,72.8561644",
      cityname: "Mumbai",
      citizens: 23300000,
    },
    {
      latlng: "19.4326077,-99.133208",
      cityname: "Mexico City",
      citizens: 22800000,
    },
    {
      latlng: "40.7143528,-74.00597",
      cityname: "New York City",
      citizens: 22200000,
    },
    {
      latlng: "-23.5489433,-46.6388182",
      cityname: "São Paulo",
      citizens: 20800000,
    },
    {
      latlng: "14.5995124,120.9842195",
      cityname: "Manila",
      citizens: 20100000,
    },
    {
      latlng: "31.230393,121.473704",
      cityname: "Shanghai",
      citizens: 18800000,
    },
    {
      latlng: "-6.211544,106.845172",
      cityname: "Jakarta",
      citizens: 18700000,
    },
    {
      latlng: "34.0522342,-118.2436849",
      cityname: "Los Angeles",
      citizens: 17900000,
    },
    {
      latlng: "24.893379,67.02806",
      cityname: "Karachi",
      citizens: 16900000,
    },
    {
      latlng: "34.6937378,135.5021651",
      cityname: "Osaka",
      citizens: 16800000,
    },
    {
      latlng: "22.572646,88.363895",
      cityname: "Kolkata",
      citizens: 16600000,
    },
    {
      latlng: "30.064742,31.249509",
      cityname: "Cairo",
      citizens: 15300000,
    },
    {
      latlng: "-34.6084175,-58.3731613",
      cityname: "Buenos Aires",
      citizens: 14800000,
    },
    {
      latlng: "55.755786,37.617633",
      cityname: "Moscow",
      citizens: 14800000,
    },
    {
      latlng: "23.709921,90.407143",
      cityname: "Dhaka",
      citizens: 14000000,
    },
    {
      latlng: "39.904214,116.407413",
      cityname: "Beijing",
      citizens: 13900000,
    },
    {
      latlng: "35.6961111,51.4230556",
      cityname: "Tehran",
      citizens: 13100000,
    },
    {
      latlng: "41.00527,28.97696",
      cityname: "Istanbul",
      citizens: 13000000,
    },
    {
      latlng: "51.5001524,-0.1262362",
      cityname: "London",
      citizens: 12500000,
    },
    {
      latlng: "-22.9035393,-43.2095869",
      cityname: "Rio de Janeiro",
      citizens: 12500000,
    },
    {
      latlng: "6.4530556,3.3958333",
      cityname: "Lagos",
      citizens: 12100000,
    },
    {
      latlng: "48.856614,2.3522219",
      cityname: "Paris",
      citizens: 11000000,
    },
  ],
};

function initMap() {
  map = new woosmap.map.Map(document.getElementById("map") as HTMLElement, {
    center: {
      lat: 40,
      lng: 0,
    },
    zoom: 2,
  });
  for (const city in data.megacities) {
    const latlng = {
      lat: parseFloat(data.megacities[city].latlng.split(",")[0]),
      lng: parseFloat(data.megacities[city].latlng.split(",")[1]),
    };
    const cityCircle = new woosmap.map.Circle({
      strokeColor: "#b71c1c",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#b71c1c",
      fillOpacity: 0.5,
      map,
      center: latlng,
      radius: Math.sqrt(data.megacities[city].citizens) * 100,
    });
  }
}
window.initMap = initMap;
// [END woosmap_render_shapes_circles]

export {};
