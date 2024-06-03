// [START woosmap_react_map_with_localities]
import { createRoot } from "react-dom/client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

// Define the types for the position and the Woosmap object
type Position = { lat: number; lng: number };
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

function APIProvider({ apiKey, children }: APIProviderProps) {
  const isLoaded = useWoosmap(apiKey);

  if (!isLoaded) {
    return null;
  }

  return <MapContext.Provider value={woosmap}>{children}</MapContext.Provider>;
}

interface MapProps extends woosmap.map.MapOptions {
  children: React.ReactNode;
}

function Map({ center, zoom, children }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const woosmap = useContext(MapContext);
  const [mapInstance, setMapInstance] = useState<any>(null);

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
}

function Marker({ position }: woosmap.map.MarkerOptions) {
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
}

function App() {
  const position: Position = { lat: 61.2176, lng: -149.8997 };

  return (
    <APIProvider apiKey={"YOUR_API_KEY"}>
      <Map center={position} zoom={10}>
        <Marker position={position} />
      </Map>
    </APIProvider>
  );
}

window.addEventListener("DOMContentLoaded", () => {
  const root = createRoot(document.getElementById("root")!);
  root.render(<App />);
});

// [END woosmap_react_map_with_localities]
let PRESERVE_COMMENT_ABOVE; // force tsc to maintain the comment above eslint-disable-line

export {};
