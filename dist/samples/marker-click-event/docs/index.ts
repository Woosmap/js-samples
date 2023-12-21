// [START woosmap_marker_click_event]
const markers: woosmap.map.Marker[] = [];
let markerSelected: woosmap.map.Marker;
const data = {
  megaCities: [
    {
      latlng: "35.700556,139.715",
      cityName: "Tokyo",
      citizens: "37,400,000",
    },
    {
      latlng: "23.133333,113.266667",
      cityName: "Guangzhou",
      citizens: "24,900,000",
    },
    {
      latlng: "37.566535,126.9779692",
      cityName: "Seoul",
      citizens: "24,500,000",
    },
    {
      latlng: "28.635308,77.22496",
      cityName: "Delhi",
      citizens: "23,900,000",
    },
    {
      latlng: "19.0176147,72.8561644",
      cityName: "Mumbai",
      citizens: "23,300,000",
    },
    {
      latlng: "19.4326077,-99.133208",
      cityName: "Mexico City",
      citizens: "22,800,000",
    },
    {
      latlng: "40.7143528,-74.00597",
      cityName: "New York City",
      citizens: "22,200,000",
    },
    {
      latlng: "-23.5489433,-46.6388182",
      cityName: "São Paulo",
      citizens: "20,800,000",
    },
    {
      latlng: "14.5995124,120.9842195",
      cityName: "Manila",
      citizens: "20,100,000",
    },
    {
      latlng: "31.230393,121.473704",
      cityName: "Shanghai",
      citizens: "18,800,000",
    },
    {
      latlng: "-6.211544,106.845172",
      cityName: "Jakarta",
      citizens: "18,700,000",
    },
    {
      latlng: "34.0522342,-118.2436849",
      cityName: "Los Angeles",
      citizens: "17,900,000",
    },
    {
      latlng: "24.893379,67.02806",
      cityName: "Karachi",
      citizens: "16,900,000",
    },
    {
      latlng: "34.6937378,135.5021651",
      cityName: "Osaka",
      citizens: "16,800,000",
    },
    {
      latlng: "22.572646,88.363895",
      cityName: "Kolkata",
      citizens: "16,600,000",
    },
    {
      latlng: "30.064742,31.249509",
      cityName: "Cairo",
      citizens: "15,300,000",
    },
    {
      latlng: "-34.6084175,-58.3731613",
      cityName: "Buenos Aires",
      citizens: "14,800,000",
    },
    {
      latlng: "55.755786,37.617633",
      cityName: "Moscow",
      citizens: "14,800,000",
    },
    {
      latlng: "23.709921,90.407143",
      cityName: "Dhaka",
      citizens: "14,000,000",
    },
    {
      latlng: "39.904214,116.407413",
      cityName: "Beijing",
      citizens: "13,900,000",
    },
    {
      latlng: "35.6961111,51.4230556",
      cityName: "Tehran",
      citizens: "13,100,000",
    },
    {
      latlng: "41.00527,28.97696",
      cityName: "Istanbul",
      citizens: "13,000,000",
    },
    {
      latlng: "51.5001524,-0.1262362",
      cityName: "London",
      citizens: "12,500,000",
    },
    {
      latlng: "-22.9035393,-43.2095869",
      cityName: "Rio de Janeiro",
      citizens: "12,500,000",
    },
    {
      latlng: "6.4530556,3.3958333",
      cityName: "Lagos",
      citizens: "12,100,000",
    },
    {
      latlng: "48.856614,2.3522219",
      cityName: "Paris",
      citizens: "11,000,000",
    },
  ],
};

function initMap(): void {
  const center: woosmap.map.LatLngLiteral = { lat: 40.0, lng: 0.0 };

  const iconCity: woosmap.map.Icon = {
    url: "https://images.woosmap.com/icons/pin-red.png",
    scaledSize: { height: 38, width: 26 },
  };

  const iconSelectedCity: woosmap.map.Icon = {
    url: "https://images.woosmap.com/icons/pin-green.png",
    scaledSize: { height: 38, width: 26 },
  };

  const map = new woosmap.map.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 0,
      center: center,
    },
  );

  data.megaCities.forEach((cityData) => {
    const latlng = {
      lat: parseFloat(cityData.latlng.split(",")[0]),
      lng: parseFloat(cityData.latlng.split(",")[1]),
    };

    const markerCity = new woosmap.map.Marker({
      position: latlng,
      icon: iconCity,
    });

    markerCity.setMap(map);
    markerCity.addListener("click", () =>
      handleMarkerClick(markerCity, cityData),
    );

    markers.push(markerCity);
  });

  const handleMarkerClick = (
    marker: woosmap.map.Marker,
    cityData: Record<string, string>,
  ) => {
    if (markerSelected) {
      markerSelected.setIcon(iconCity);
    }

    markerSelected = marker;
    marker.setIcon(iconSelectedCity);

    const infoElement = document.getElementById("info") as HTMLElement;
    infoElement.innerHTML = `<strong>${cityData.cityName}</strong><span>: ${cityData.citizens}</span>`;
  };
}
declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
// [END woosmap_marker_click_event]
export {};
