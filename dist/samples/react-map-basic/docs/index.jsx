// [START woosmap_react_map_basic]
import { createRoot } from "react-dom/client";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

// Custom hook to load the Woosmap JavaScript API
// This hook creates a script tag with the Woosmap map.js URL and appends it to the body of the document.
// It sets the state to true when the script loads.
function useWoosmap(apiKey) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");

    script.src = `https://sdk.woosmap.com/map/map.js?key=${apiKey}`;
    script.onload = () => setIsLoaded(true);
    document.body.appendChild(script);
  }, [apiKey]);
  return isLoaded;
}

// Contexts for Woosmap library
const MapContext = createContext(null);

// This component uses the useWoosmap hook to load the Woosmap API and provides it through context.
const WoosmapAPIProvider = ({ apiKey, children }) => {
  const isLoaded = useWoosmap(apiKey);

  if (!isLoaded) {
    return null;
  }
  return <MapContext.Provider value={woosmap}>{children}</MapContext.Provider>;
};

// This component creates a Woosmap map and provides it through context used by the <Marker/>
const WoosmapMap = ({ center, zoom }) => {
  const mapRef = useRef(null);
  const woosmap = useContext(MapContext);
  const [mapInstance, setMapInstance] = useState(null);

  useEffect(() => {
    if (mapRef.current && !mapInstance) {
      const map = new woosmap.map.Map(mapRef.current, {
        zoom,
        center,
      });

      setMapInstance(map);
    }
  }, [woosmap, zoom, center]);
  return <div ref={mapRef} style={{ width: "100%", height: "100vh" }}></div>;
};

const App = () => {
  const initialPosition = {
    lat: 50.2176,
    lng: -0.8997,
  };
  return (
    <WoosmapAPIProvider apiKey={"YOUR_API_KEY"}>
      <WoosmapMap center={initialPosition} zoom={4}></WoosmapMap>
    </WoosmapAPIProvider>
  );
};

window.addEventListener("DOMContentLoaded", () => {
  const root = createRoot(document.getElementById("root"));

  root.render(<App />);
});
// [END woosmap_react_map_basic]
