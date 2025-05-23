// [START woosmap_marker_html_css]
interface MarkerData {
  price: string;
}

function initMap(): void {
  class HTMLMapMarker extends woosmap.map.OverlayView {
    private readonly latlng: woosmap.map.LatLng;
    private readonly html: string;
    public div: HTMLDivElement | null = null;

    constructor({ latlng, map, data }) {
      super();
      this.latlng = latlng;
      this.html = `<div class="popover-content">
                      <span class="icon">️</span>
                      <span class="price">${data.price}</span>
                    </div>
                     <div class="popover-arrow-shadow"></div>
                     <div class="popover-arrow"></div>`;
      this.setMap(map);
    }

    private createDiv(): void {
      this.div = document.createElement("div");
      this.div.style.position = "absolute";
      this.div.className = "popover";
      if (this.html) {
        this.div.innerHTML = this.html;
      }
      woosmap.map.event.addDomListener(this.div, "click", () => {
        woosmap.map.event.trigger(this, "click");
      });
    }

    private appendDivToOverlay(): void {
      const panes = this.getPanes();
      if (panes && this.div) {
        panes.floatPane.appendChild(this.div);
      }
    }

    private positionDiv(): void {
      const point = this.getProjection()?.fromLatLngToDivPixel(this.latlng);
      if (point && this.div) {
        // Offset should depend on the style of your popover
        const offsetWidth = this.div.offsetWidth / 2; // 50% of div width
        const offsetHeight = this.div.offsetHeight + 6; // Full height of div plus the arrow height
        // @ts-ignore
        this.div.style.left = `${point.x - offsetWidth}px`;
        // @ts-ignore
        this.div.style.top = `${point.y - offsetHeight}px`;
      }
    }

    draw(): void {
      this.positionDiv();
    }

    onAdd(): void {
      if (!this.div) {
        this.createDiv();
        this.appendDivToOverlay();
      }
    }

    onRemove(): void {
      if (this.div && this.div.parentNode) {
        this.div.parentNode.removeChild(this.div);
        this.div = null;
      }
    }

    getPosition(): woosmap.map.LatLng {
      return this.latlng;
    }

    addEventListener(eventName: string, callback: () => void): void {
      if (this.div) {
        this.div.addEventListener(eventName, callback);
      }
    }
  }

  const center: woosmap.map.LatLngLiteral = { lat: 51.5074, lng: -0.1278 };

  const map = new woosmap.map.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 13,
      center: center,
    },
  );

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

  const markers: HTMLMapMarker[] = [];

  markersData.forEach((data, index) => {
    const marker = new HTMLMapMarker({
      latlng: new woosmap.map.LatLng(
        positions[index].lat,
        positions[index].lng,
      ),
      map: map,
      data: data,
    });

    marker.addEventListener("click", () => {
      markers.forEach((m) => {
        if (m.div) {
          m.div.classList.remove("active");
        }
      });
      if (marker.div) {
        marker.div.classList.add("active");
      }
    });

    markers.push(marker);
  });
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
// [END woosmap_marker_html_css]
export {};
