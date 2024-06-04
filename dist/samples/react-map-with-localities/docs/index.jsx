// [START woosmap_react_map_with_localities]
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

// Contexts for Woosmap and the map instance
const MapContext = createContext(null);
const MapInstanceContext = createContext(null);

// This component uses the useWoosmap hook to load the Woosmap API and provides it through context.
const WoosmapAPIProvider = ({ apiKey, children }) => {
  const isLoaded = useWoosmap(apiKey);

  if (!isLoaded) {
    return null;
  }
  return <MapContext.Provider value={woosmap}>{children}</MapContext.Provider>;
};

// This component creates a Woosmap map and provides it through context used by the <Marker/>
const WoosmapMap = ({ center, zoom, children }) => {
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
  return (
    <MapInstanceContext.Provider value={mapInstance}>
      <div ref={mapRef} style={{ width: "100%", height: "100vh" }}>
        {children}
      </div>
    </MapInstanceContext.Provider>
  );
};

// This component creates a Woosmap marker to display the selected locality and flyTo it
const Marker = ({ position }) => {
  const woosmap = useContext(MapContext);
  const mapInstance = useContext(MapInstanceContext);
  const [marker, setMarker] = useState(null);

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

// This component creates an input field for searching localities and displays suggestions
const LocalitiesAutocomplete = ({ onLocalitySelect }) => {
  const woosmap = useContext(MapContext);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
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
        const suggestions = await localitiesService.current.autocomplete({
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

  const handleSuggestionClick = async (suggestion) => {
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

const App = () => {
  const initialPosition = {
    lat: 50.2176,
    lng: -0.8997,
  };
  const [selectedLocality, setSelectedLocality] = useState(null);

  const handleLocalitySelect = (localityDetails) => {
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
  const root = createRoot(document.getElementById("root"));

  root.render(<App />);
});
// [END woosmap_react_map_with_localities]
