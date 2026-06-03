const openWeatherMapKey = "723abb7941260adc84c92a1f526bdabb";
let map;
let styleSelect;
let layerSelect;
let opacityInput;
let opacityDisplay;
const centerLatLng = {
  lat: 45.126643,
  lng: 6.073999,
};

function initMap() {
  map = new window.woosmap.map.Map(document.getElementById("map"), {
    zoom: 15.64,
    center: centerLatLng,
    mapTypeControl: true,
    styles: STYLE_PRESETS.lightgrey,
  });
  styleSelect = document.getElementById("woosmap-style-select");
  layerSelect = document.getElementById("layer-provider-select");
  opacityInput = document.getElementById("opacity-value-input");
  opacityDisplay = document.getElementById("opacity-value-display");
  updateOpacityDisplay();
  applyLayer(layerSelect.value, readOpacity());
  styleSelect.addEventListener("change", onStyleChange);
  layerSelect.addEventListener("change", onLayerChange);
  opacityInput.addEventListener("input", updateOpacityDisplay);
  opacityInput.addEventListener("change", onOpacityChange);
}

function updateOpacityDisplay() {
  const opacity = parseFloat(opacityInput.value);

  opacityDisplay.textContent = `${Math.round(opacity * 100)}%`;
}

function readOpacity() {
  const opacity = parseFloat(opacityInput.value);
  return isNaN(opacity) ? 1 : opacity;
}

function onStyleChange() {
  applyStyle(styleSelect.value);
  // Recreating the map wipes overlays — reapply the current layer.
  applyLayer(layerSelect.value, readOpacity());
}

function onLayerChange() {
  const view = LAYER_VIEWS[layerSelect.value];

  if (view) {
    map.flyTo(view);
  }

  applyLayer(layerSelect.value, readOpacity());
}

function onOpacityChange() {
  applyLayer(layerSelect.value, readOpacity());
}

function applyStyle(name) {
  const styles = STYLE_PRESETS[name] ?? [];

  map = new window.woosmap.map.Map(document.getElementById("map"), {
    zoom: map.getZoom(),
    center: map.getCenter(),
    mapTypeControl: true,
    styles,
  });
}

function applyLayer(provider, opacity) {
  map.overlayMapTypes.clear();

  const config = LAYER_CONFIGS[provider];

  if (!config) {
    return;
  }

  map.overlayMapTypes.insertAt(
    0,
    new woosmap.map.ImageMapType({
      ...config,
      tileSize: new woosmap.map.Size(256, 256),
      opacity,
    }),
  );
}

const nightStyles = [
  {
    elementType: "geometry",
    stylers: [{ color: "#242f3e" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#242f3e" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#326030" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#C38B5F" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];
const retroStyles = [
  {
    elementType: "geometry",
    stylers: [{ color: "#ebe3cd" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#523735" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#f5f1e6" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{ color: "#c9b2a6" }],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "geometry.stroke",
    stylers: [{ color: "#dcd2be" }],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [{ color: "#ae9e90" }],
  },
  {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [{ color: "#dfd2ae" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#dfd2ae" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#93817c" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#738E00" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#447530" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#f5f1e6" }],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{ color: "#fdfcf8" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#f8c967" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#e9bc62" }],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry",
    stylers: [{ color: "#e98d58" }],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry.stroke",
    stylers: [{ color: "#db8555" }],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [{ color: "#806b63" }],
  },
  {
    featureType: "road.local",
    elementType: "geometry.fill",
    stylers: [{ color: "#F5F1E6" }],
  },
  {
    featureType: "transit.line",
    elementType: "geometry",
    stylers: [{ color: "#dfd2ae" }],
  },
  {
    featureType: "transit.line",
    elementType: "labels.text.fill",
    stylers: [{ color: "#8f7d77" }],
  },
  {
    featureType: "transit.line",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#ebe3cd" }],
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [{ color: "#dfd2ae" }],
  },
  {
    featureType: "water",
    elementType: "geometry.fill",
    stylers: [{ color: "#b9d3c2" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#92998d" }],
  },
];
const lightgreyStyles = [
  {
    elementType: "geometry",
    stylers: [{ color: "#f6f6f6" }],
  },
  {
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#616161" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#f5f5f5" }],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [{ color: "#bdbdbd" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "road.arterial",
    elementType: "labels.text.fill",
    stylers: [{ color: "#757575" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#dadada" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#616161" }],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9e9e9e" }],
  },
  {
    featureType: "transit.line",
    elementType: "geometry",
    stylers: [{ color: "#e5e5e5" }],
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [{ color: "#eeeeee" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#c9c9c9" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9e9e9e" }],
  },
];
const STYLE_PRESETS = {
  retro: retroStyles,
  lightgrey: lightgreyStyles,
  night: nightStyles,
};
const LAYER_CONFIGS = {
  pistes: {
    url: "https://tiles.opensnowmap.org/pistes/{z}/{x}/{y}.png",
    name: "OpenSnowMap",
    maxZoom: 19,
  },
  temperature: {
    url: `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}?appid=${openWeatherMapKey}`,
    name: "Temperature",
    maxZoom: 19,
  },
  precipitation: {
    url: `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}?appid=${openWeatherMapKey}`,
    name: "Precipitation",
    maxZoom: 19,
  },
};
const US_VIEW = {
  center: { lat: 39.8283, lng: -98.5795 },
  zoom: 4,
};
const LAYER_VIEWS = {
  pistes: { center: { lat: 45.126643, lng: 6.073999 }, zoom: 15.64 },
  temperature: US_VIEW,
  precipitation: US_VIEW,
};

window.initMap = initMap;
