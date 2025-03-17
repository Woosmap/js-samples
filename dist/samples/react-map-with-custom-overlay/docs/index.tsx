// [START woosmap_react_map_with_custom_overlay]
import { createRoot } from "react-dom/client";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

// Define the types for the global Woosmap object
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

// Contexts for Woosmap and the map instance
const MapContext = createContext<any>(null);
const MapInstanceContext = createContext<woosmap.map.Map | null>(null);

interface WoosmapAPIProviderProps {
  apiKey: string;
  children: React.ReactNode;
}

// This component uses the useWoosmap hook to load the Woosmap API and provides it through context.
const WoosmapAPIProvider: React.FC<WoosmapAPIProviderProps> = ({
  apiKey,
  children,
}) => {
  const isLoaded = useWoosmap(apiKey);

  if (!isLoaded) {
    return null;
  }

  return <MapContext.Provider value={woosmap}>{children}</MapContext.Provider>;
};

interface MapProps extends woosmap.map.MapOptions {
  children: React.ReactNode;
}

// This component creates a Woosmap map and provides it through context used by the <Marker/>
const WoosmapMap: React.FC<MapProps> = ({ center, zoom, children }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const woosmap = useContext(MapContext);
  const [mapInstance, setMapInstance] = useState<woosmap.map.Map>(null);

  useEffect(() => {
    if (mapRef.current && !mapInstance) {
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

// Custom SVG components
const Icon1: React.FC = () => (
  <svg
    fill="#FFF"
    height="24"
    viewBox="0 -960 960 960"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="m280-80v-366q-51-14-85.5-56t-34.5-98v-280h80v280h40v-280h80v280h40v-280h80v280q0 56-34.5 98t-85.5 56v366zm400 0v-320h-120v-280q0-83 58.5-141.5t141.5-58.5v800z" />
  </svg>
);

const Icon2: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 -960 960 960"
    width="24px"
    fill="#FFF"
  >
    <path d="M120-360q-33 0-56.5-23.5T40-440v-360q0-33 23.5-56.5T120-880h720q33 0 56.5 23.5T920-800v360q0 33-23.5 56.5T840-360H120Zm0-440v360h720v-360H120Zm3 580-3-60 719-38 3 60-719 38Zm-3 99v-60h720v60H120Zm290-379q74 0 142.5-26T672-606q6 42 44 64t84 22v-200q-46 0-84 22.5T672-632q-53-52-120.5-80T410-740q-79 0-152 27.5T140-620q45 65 118 92.5T410-500ZM120-800v360-360Z" />
  </svg>
);

const Icon3: React.FC = () => (
  <svg
    fill="#FFF"
    height="24"
    viewBox="0 -960 960 960"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="m160-120q-33 0-56.5-23.5t-23.5-56.5v-120h800v120q0 33-23.5 56.5t-56.5 23.5zm0-120v40h640v-40zm320-180q-36 0-57 20t-77 20q-56 0-76-20t-56-20q-36 0-57 20t-77 20v-80q36 0 57-20t77-20q56 0 76 20t56 20q36 0 57-20t77-20q56 0 77 20t57 20q36 0 56-20t76-20q56 0 79 20t55 20v80q-56 0-75-20t-55-20q-36 0-58 20t-78 20q-56 0-77-20t-57-20zm-400-140v-40q0-115 108.5-177.5t291.5-62.5q183 0 291.5 62.5t108.5 177.5v40zm400-200q-124 0-207.5 31t-106.5 89h628q-23-58-106.5-89t-207.5-31z" />
  </svg>
);

// CustomMarker component
const CustomMarker: React.FC<{ icon: React.ReactNode }> = ({ icon }) => {
  return <div className="custom-marker">{icon}</div>;
};

// Marker component
const Marker: React.FC<{
  position: woosmap.map.LatLngLiteral;
  icon: React.ReactNode;
}> = ({ position, icon }) => {
  const woosmap = useContext(MapContext);
  const mapInstance = useContext(MapInstanceContext);
  const [overlay, setOverlay] = useState<any>(null);

  useEffect(() => {
    if (!woosmap || !mapInstance || !position) return;

    class CustomOverlay extends woosmap.map.OverlayView {
      private position: woosmap.map.LatLngLiteral;
      private containerDiv: HTMLDivElement;
      private icon: React.ReactNode;

      constructor(position: woosmap.map.LatLngLiteral, icon: React.ReactNode) {
        super();
        this.position = position;
        this.containerDiv = document.createElement("div");
        this.containerDiv.className = "custom-marker-container";
        this.icon = icon;
      }

      onAdd() {
        const root = createRoot(this.containerDiv);
        root.render(this.icon);
        const panes = this.getPanes();
        panes.floatPane.appendChild(this.containerDiv);
        this.addEventListener("click", () => {
          alert("Marker clicked!");
        });
      }

      draw() {
        console.log("draw");
        const projection = this.getProjection();
        const point = projection.fromLatLngToDivPixel(this.position);
        if (point) {
          console.log("width", this.containerDiv.offsetWidth);
          // Offset should depend on the style of your icon  - here it is positioned at the middle
          const offsetWidth = this.containerDiv.offsetWidth / 2; // 50% of div width
          const offsetHeight = this.containerDiv.offsetHeight / 2; // 50% of div height
          this.containerDiv.style.left = `${point.x - offsetWidth}px`;
          this.containerDiv.style.top = `${point.y - offsetHeight}px`;
          console.log("left", this.containerDiv.style.left);
        }
      }

      onRemove() {
        if (this.containerDiv.parentNode) {
          this.containerDiv.parentNode.removeChild(this.containerDiv);
        }
      }

      addEventListener(eventName: string, callback: () => void): void {
        if (this.containerDiv) {
          this.containerDiv.addEventListener(eventName, callback);
        }
      }
    }

    if (overlay) {
      overlay.setMap(null);
      setOverlay(null);
    }

    const customOverlay = new CustomOverlay(
      position,
      <CustomMarker icon={icon} />,
    );
    customOverlay.setMap(mapInstance);
    setOverlay(customOverlay);
  }, [woosmap, position, mapInstance]);

  return null;
};

const App: React.VFC = () => {
  const initialPosition: woosmap.map.LatLngLiteral = {
    lat: 51.5,
    lng: -0.118,
  };

  const positions: woosmap.map.LatLngLiteral[] = [
    { lat: 51.5074, lng: -0.1278 },
    { lat: 51.4974, lng: -0.1178 },
    { lat: 51.5074, lng: -0.1078 },
  ];

  const icons = [<Icon1 />, <Icon2 />, <Icon3 />];

  return (
    <WoosmapAPIProvider apiKey={"YOUR_API_KEY"}>
      <WoosmapMap center={initialPosition} zoom={14}>
        {positions.map((position, index) => (
          <Marker key={index} position={position} icon={icons[index]} />
        ))}
      </WoosmapMap>
    </WoosmapAPIProvider>
  );
};

window.addEventListener("DOMContentLoaded", () => {
  const root = createRoot(document.getElementById("root")!);
  root.render(<App />);
});

// [END woosmap_react_map_with_custom_overlay]

export {};
