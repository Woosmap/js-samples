// [START woosmap_marker_html_css]
interface MarkerData {
  price: string;
}

async function initMap(): Promise<void> {
  await woosmap.map.importLibrary("maps");
  await woosmap.map.importLibrary("marker");

  // Marker content added imperatively (via `map:`/`.setMap()`) is appended
  // into the map's marker pane, which lives inside <wmp-map>'s shadow root.
  // Page CSS (style.css) can't reach it there, so the popover's styles ship
  // inline alongside the content, same as maps-js's own advanced-marker
  // reference example.
  const POPOVER_CSS = `
    .popover {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      pointer-events: auto;
      cursor: pointer;
    }
    .popover .popover-content {
      display: flex;
      align-items: center;
      background-color: #FFF;
      color: #1D1D1D;
      padding: 6px 8px;
      border-radius: 20px;
      font-family: Roboto, Arial, sans-serif;
      font-size: 15px;
      font-weight: 500;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      z-index: 1;
    }
    .popover .popover-content .icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background-color: #f50057;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      margin-right: 6px;
      background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAtOTYwIDk2MCA5NjAiIHdpZHRoPSIyNHB4IiBmaWxsPSIjRkZGRkZGIj48cGF0aCBkPSJNNDAtMjAwdi02MDBoODB2NDAwaDMyMHYtMzIwaDMyMHE2NiAwIDExMyA0N3Q0NyAxMTN2MzYwaC04MHYtMTIwSDEyMHYxMjBINDBabTI0MC0yNDBxLTUwIDAtODUtMzV0LTM1LTg1cTAtNTAgMzUtODV0ODUtMzVxNTAgMCA4NSAzNXQzNSA4NXEwIDUwLTM1IDg1dC04NSAzNVoiLz48L3N2Zz4=");
      background-repeat: no-repeat;
      background-size: 16px 16px;
      background-position: center;
    }
    .popover .popover-content .price {
      white-space: nowrap;
    }
    .popover .popover-arrow-shadow {
      position: absolute;
      bottom: -7px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 7px solid transparent;
      border-right: 7px solid transparent;
      border-top: 7px solid rgba(0, 0, 0, 0.2);
      filter: blur(2px);
      z-index: 0;
    }
    .popover .popover-arrow {
      position: absolute;
      bottom: -6px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 6px solid #FFF;
      z-index: 1;
    }
    .popover.active .popover-content {
      background-color: #f50057;
      color: #FFFFFF;
    }
    .popover.active .popover-content .icon {
      background-color: #FFFFFF;
      background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAtOTYwIDk2MCA5NjAiIHdpZHRoPSIyNHB4IiBmaWxsPSIjZjUwMDU3Ij48cGF0aCBkPSJNNDAtMjAwdi02MDBoODB2NDAwaDMyMHYtMzIwaDMyMHE2NiAwIDExMyA0N3Q0NyAxMTN2MzYwaC04MHYtMTIwSDEyMHYxMjBINDBabTI0MC0yNDBxLTUwIDAtODUtMzV0LTM1LTg1cTAtNTAgMzUtODV0ODUtMzVxNTAgMCA4NSAzNXQzNSA4NXEwIDUwLTM1IDg1dC04NSAzNVoiLz48L3N2Zz4=");
    }
    .popover.active .popover-arrow {
      border-top: 6px solid #f50057;
    }
  `;

  function createMarkerContent(data: MarkerData): HTMLDivElement {
    const div = document.createElement("div");
    div.className = "popover";
    div.innerHTML = `<style>${POPOVER_CSS}</style>
                    <div class="popover-content">
                      <span class="icon">️</span>
                      <span class="price">${data.price}</span>
                    </div>
                     <div class="popover-arrow-shadow"></div>
                     <div class="popover-arrow"></div>`;
    return div;
  }

  const center: woosmap.map.LatLngLiteral = { lat: 51.5074, lng: -0.1278 };

  const map = (document.getElementById("map") as woosmap.map.MapElement).innerMap;
  map.setOptions({
      zoom: 13,
      center: center,
    });

  const markersData: MarkerData[] = [
    { price: "100 €" },
    { price: "200 €" },
    { price: "300 €" },
    { price: "400 €" },
    { price: "500 €" },
  ];

  const positions: woosmap.map.LatLngLiteral[] = [
    { lat: 51.5074, lng: -0.1278 },
    { lat: 51.5174, lng: -0.1378 },
    { lat: 51.4974, lng: -0.1178 },
    { lat: 51.5074, lng: -0.1478 },
    { lat: 51.5074, lng: -0.1078 },
  ];

  const markers: woosmap.map.marker.AdvancedMarkerElement[] = [];

  markersData.forEach((data, index) => {
    const content = createMarkerContent(data);
    const marker = new woosmap.map.marker.AdvancedMarkerElement({
      position: positions[index],
      map: map,
      content,
      gmpClickable: true,
    });

    marker.addListener("click", () => {
      markers.forEach((m) => {
        (m.content as HTMLDivElement).classList.remove("active");
      });
      content.classList.add("active");
    });

    markers.push(marker);
  });
}

initMap();
// [END woosmap_marker_html_css]
export {};
