import { createRoot } from "react-dom/client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

// The shim reads and writes `window.woosmap` before the API is loaded.
type LoaderWindow = {
  woosmap?: {
    map?: Record<string, (name: string, ...args: unknown[]) => unknown>;
  };
};

const WOOSMAP_SDK_HOST = "https://sdk.woosmap.com";

// Installs the documented Woosmap loader shim (see docs/docs/loader.md), which
// defines a stub `woosmap.map.importLibrary` that fetches map.js on first call.
// Safe to call more than once: the shim itself no-ops (and warns) past the first.
function installLoaderShim(apiKey: string): void {
  ((g) => {
    let p;
    const w = window as unknown as LoaderWindow,
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
      maps[L] = (name: string, ...args: unknown[]) =>
        libs.add(name) && load().then(() => maps[L](name, ...args));
    }
  })({ key: apiKey });
}

// Custom hook to load the Woosmap JavaScript API via the loader shim.
function useWoosmap(apiKey: string) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    installLoaderShim(apiKey);
    Promise.all([
      woosmap.map.importLibrary("maps"),
      woosmap.map.importLibrary("marker"),
    ]).then(() => setIsLoaded(true));
  }, [apiKey]);

  return isLoaded;
}

// Contexts for Woosmap and the map instance
const MapContext = createContext<typeof woosmap | null>(null);
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

// This component creates a Woosmap marker to display the selected locality and flyTo it
const Marker: React.FC<woosmap.map.marker.AdvancedMarkerElementOptions> = ({
  position,
}) => {
  const woosmap = useContext(MapContext);
  const mapInstance = useContext(MapInstanceContext);
  const [marker, setMarker] =
    useState<woosmap.map.marker.AdvancedMarkerElement>(null);

  useEffect(() => {
    if (marker) {
      marker.setMap(null);
      setMarker(null);
    }
    if (mapInstance && position) {
      const { PinElement } = woosmap.map.marker;
      const pin = new PinElement({
        background: "#5588FF",
        borderColor: "#3D6FE0",
        glyphColor: "#FFFFFF",
      });

      const localityMarker = new woosmap.map.marker.AdvancedMarkerElement({
        position,
        content: pin.element,
      });
      localityMarker.setMap(mapInstance);
      setMarker(localityMarker);
      mapInstance.flyTo({ center: position, zoom: 8 });
    }
  }, [woosmap, position, mapInstance]);

  return null;
};

interface LocalitiesAutocompleteProps {
  onLocalitySelect: (
    localityDetails: woosmap.map.localities.LocalitiesDetailsResult,
  ) => void;
}

// This component creates an input field for searching localities and displays suggestions
const LocalitiesAutocomplete: React.FC<LocalitiesAutocompleteProps> = ({
  onLocalitySelect,
}) => {
  const woosmap = useContext(MapContext);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] =
    useState<woosmap.map.localities.LocalitiesAutocompleteResponse>([]);
  const localitiesService = useRef(null);

  const [shouldFetchSuggestions, setShouldFetchSuggestions] = useState(true);

  useEffect(() => {
    if (!shouldFetchSuggestions) {
      setShouldFetchSuggestions(true);
      return;
    }

    localitiesService.current = new woosmap.map.LocalitiesService();

    const fetchSuggestions = async () => {
      if (inputValue && inputValue.length > 0) {
        const suggestions: woosmap.map.localities.LocalitiesAutocompleteResponse =
          await localitiesService.current.autocomplete({
            input: inputValue,
            types: ["locality", "address", "postal_code"],
          });
        setSuggestions(suggestions.localities || []);
      } else {
        setSuggestions([]);
      }
    };
    fetchSuggestions();
  }, [woosmap, inputValue]);

  const handleSuggestionClick = async (
    suggestion: woosmap.map.localities.LocalitiesPredictions,
  ) => {
    const localityDetails = await localitiesService.current.getDetails({
      publicId: suggestion.public_id,
    });
    onLocalitySelect(localityDetails);
    setShouldFetchSuggestions(false);
    setInputValue(suggestion.description);
    setSuggestions([]);
  };

  const handleClearSearch = () => {
    setInputValue("");
    setSuggestions([]);
    onLocalitySelect(null); // Add this line
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && suggestions.length > 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[0]);
    }
  };

  return (
    <div id="autocomplete-container">
      <svg className="search-icon" viewBox="0 0 16 16">
        <path
          d="M3.617 7.083a4.338 4.338 0 1 1 8.676 0 4.338 4.338 0 0 1-8.676 0m4.338-5.838a5.838 5.838 0 1 0 2.162 11.262l2.278 2.279a1 1 0 0 0 1.415-1.414l-1.95-1.95A5.838 5.838 0 0 0 7.955 1.245"
          fill-rule="evenodd"
          clip-rule="evenodd"
        ></path>
      </svg>
      <input
        id="autocomplete-input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search for a locality"
      />
      <button
        onClick={handleClearSearch}
        className="clear-searchButton"
        type="button"
        style={{ display: inputValue ? "block" : "none" }}
      >
        <svg className="clear-icon" viewBox="0 0 24 24">
          <path d="M7.074 5.754a.933.933 0 1 0-1.32 1.317L10.693 12l-4.937 4.929a.931.931 0 1 0 1.319 1.317l4.938-4.93 4.937 4.93a.933.933 0 0 0 1.581-.662.93.93 0 0 0-.262-.655L13.331 12l4.937-4.929a.93.93 0 0 0-.663-1.578.93.93 0 0 0-.656.261l-4.938 4.93z"></path>
        </svg>
      </button>
      {suggestions.length > 0 && (
        <ul id="suggestions-list" className="visible">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.publicId}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const App: React.VFC = () => {
  const initialPosition: woosmap.map.LatLngLiteral = {
    lat: 50.2176,
    lng: -0.8997,
  };
  const [selectedLocality, setSelectedLocality] =
    useState<woosmap.map.LatLngLiteral | null>(null);

  const handleLocalitySelect = (
    localityDetails: woosmap.map.localities.LocalitiesDetailsResponse,
  ) => {
    if (localityDetails) {
      setSelectedLocality(localityDetails.result.geometry?.location);
    } else {
      setSelectedLocality(null);
    }
  };

  return (
    <WoosmapAPIProvider apiKey={"YOUR_API_KEY"}>
      <WoosmapMap center={initialPosition} zoom={4}>
        <Marker position={selectedLocality} />
      </WoosmapMap>
      <LocalitiesAutocomplete onLocalitySelect={handleLocalitySelect} />
    </WoosmapAPIProvider>
  );
};

window.addEventListener("DOMContentLoaded", () => {
  const root = createRoot(document.getElementById("root")!);
  root.render(<App />);
});


export {};
