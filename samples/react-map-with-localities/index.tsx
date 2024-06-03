// [START woosmap_react_map_with_localities]
import { createRoot } from "react-dom/client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

// Define the types for the Woosmap object
declare const woosmap: any;

// Custom hook to load the Woosmap JavaScript API
function useWoosmap(apiKey: string) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://sdk.woosmap.com/map/map.js?key=${apiKey}`;
    script.onload = () => setIsLoaded(true);
    document.body.appendChild(script);
  }, [apiKey]);

  return isLoaded;
}

const MapContext = createContext<any>(null);
const MapInstanceContext = createContext<woosmap.map.Map | null>(null);

interface APIProviderProps {
  apiKey: string;
  children: React.ReactNode;
}

const APIProvider: React.FC<APIProviderProps> = ({ apiKey, children }) => {
  const isLoaded = useWoosmap(apiKey);

  if (!isLoaded) {
    return null;
  }

  return <MapContext.Provider value={woosmap}>{children}</MapContext.Provider>;
};

interface MapProps extends woosmap.map.MapOptions {
  children: React.ReactNode;
}

const WoosmapMap: React.FC<MapProps> = ({ center, zoom, children }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const woosmap = useContext(MapContext);
  const [mapInstance, setMapInstance] = useState<woosmap.map.Map>(null);

  useEffect(() => {
    if (mapRef.current) {
      const map = new woosmap.map.Map(mapRef.current, {
        zoom,
        center,
      });
      setMapInstance(map);
    }
  }, [woosmap, zoom, center]);

  return (
    <MapInstanceContext.Provider value={mapInstance}>
      <div ref={mapRef} style={{ width: "100%", height: "100vh" }}>
        {children}
      </div>
    </MapInstanceContext.Provider>
  );
};

const Marker: React.FC<woosmap.map.MarkerOptions> = ({ position }) => {
  const woosmap = useContext(MapContext);
  const mapInstance = useContext(MapInstanceContext);

  useEffect(() => {
    if (mapInstance) {
      const marker = new woosmap.map.Marker({
        position,
        icon: {
          url: "https://images.woosmap.com/marker.png",
          scaledSize: {
            height: 50,
            width: 32,
          },
        },
      });
      marker.setMap(mapInstance);
    }
  }, [woosmap, position, mapInstance]);

  return null;
};

const App: React.VFC = () => {
  const position: woosmap.map.LatLngLiteral = { lat: 61.2176, lng: -149.8997 };

  return (
    <APIProvider apiKey={"YOUR_API_KEY"}>
      <WoosmapMap center={position} zoom={10}>
        <Marker position={position} />
      </WoosmapMap>
    </APIProvider>
  );
};

window.addEventListener("DOMContentLoaded", () => {
  const root = createRoot(document.getElementById("root")!);
  root.render(<App />);
});

// [END woosmap_react_map_with_localities]
let PRESERVE_COMMENT_ABOVE; // force tsc to maintain the comment above eslint-disable-line

export {};
