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

const Marker: React.FC<woosmap.map.MarkerOptions> = ({ position }) => {
  const woosmap = useContext(MapContext);
  const mapInstance = useContext(MapInstanceContext);
  const [marker, setMarker] = useState<woosmap.map.Marker>(null);

  useEffect(() => {
    if (marker) {
      marker.setMap(null);
      setMarker(null);
    }
    if (mapInstance && position) {
      const localityMarker = new woosmap.map.Marker({
        position,
        icon: {
          url: "https://images.woosmap.com/marker.png",
          scaledSize: {
            height: 50,
            width: 32,
          },
        },
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

const LocalitiesAutocomplete: React.FC<LocalitiesAutocompleteProps> = ({
  onLocalitySelect,
}) => {
  const woosmap = useContext(MapContext);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const localitiesService = useRef(null);

  useEffect(() => {
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
    setInputValue(localityDetails.formatted_address);
  };

  const handleClearSearch = () => {
    setInputValue("");
    setSuggestions([]);
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
        placeholder="Search for a place"
      />
      <button onClick={handleClearSearch} className="clear-searchButton">
        Clear
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
    useState<woosmap.map.LatLngLiteral>(null);

  const handleLocalitySelect = (
    localityDetails: woosmap.map.localities.LocalitiesDetailsResponse,
  ) => {
    if (localityDetails.result.geometry?.location) {
      setSelectedLocality(localityDetails.result.geometry.location);
    }
  };

  return (
    <APIProvider apiKey={"YOUR_API_KEY"}>
      <WoosmapMap center={initialPosition} zoom={4}>
        <Marker position={selectedLocality} />
      </WoosmapMap>
      <LocalitiesAutocomplete onLocalitySelect={handleLocalitySelect} />
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
