import { createRoot } from "react-dom/client";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
const WOOSMAP_SDK_HOST = "https://sdk.woosmap.com";
// Installs the documented Woosmap loader shim (see docs/docs/loader.md), which
// defines a stub `woosmap.map.importLibrary` that fetches map.js on first call.
// Safe to call more than once: the shim itself no-ops (and warns) past the first.
function installLoaderShim(apiKey) {
  ((g) => {
    let p;
    const w = window,
      d = document;
    const L = "importLibrary",
      CB = "__ib__";
    const E = "The Woosmap Maps JavaScript API";
    const woosmap = w.woosmap || (w.woosmap = {});
    const maps = woosmap.map || (woosmap.map = {});
    const libs = new Set(),
      params = new URLSearchParams();
    const load = () =>
      p ||
      (p = new Promise((res, rej) => {
        const s = d.createElement("script");
        params.set("libraries", [...libs].join(","));
        for (const k in g) params.set(k, g[k]);
        params.set("callback", "woosmap.map." + CB);
        s.src = `${WOOSMAP_SDK_HOST}/map/map.js?` + params;
        maps[CB] = res;
        s.onerror = () => rej(Error(E + " could not load."));
        d.head.append(s);
      }));
    if (maps[L]) {
      console.warn(E + " only loads once. Ignoring:", g);
    } else {
      maps[L] = (name, ...args) =>
        libs.add(name) && load().then(() => maps[L](name, ...args));
    }
  })({ key: apiKey });
}
// Custom hook to load the Woosmap JavaScript API via the loader shim.
function useWoosmap(apiKey) {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    installLoaderShim(apiKey);
    woosmap.map.importLibrary("maps").then(() => setIsLoaded(true));
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
