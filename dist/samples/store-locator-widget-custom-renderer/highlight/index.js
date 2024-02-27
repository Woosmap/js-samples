const configLocator = {
  maps: {
    provider: "woosmap",
    localities: {
      types: [],
    },
  },
  datasource: {
    max_responses: 5,
    max_distance: 0,
  },
  theme: {
    primary_color: "#00754a",
  },
  woosmapview: {
    initialZoom: 15,
    breakPoint: 16,
    tileStyle: {
      color: "#00754a",
      size: 13,
      minSize: 5,
    },
    style: {
      default: {
        icon: {
          url: "https://images.woosmap.com/starbucks-marker.svg",
          scaledSize: {
            height: 40,
            width: 34,
          },
        },
        selectedIcon: {
          url: "https://images.woosmap.com/starbucks-marker-selected.svg",
          scaledSize: {
            height: 50,
            width: 43,
          },
        },
      },
    },
  },
};

function getPhone({ properties }) {
  let _a;
  const phone =
    (_a = properties.contact) === null || _a === void 0 ? void 0 : _a.phone;
  return phone
    ? `<li id='store-phone'><span class='marker-image'></span><p><a class='text-black' href='tel:${phone}'>${phone}</a></p></li>`
    : "";
}

function getWebSite({ properties }) {
  let _a;
  const website =
    (_a = properties.contact) === null || _a === void 0 ? void 0 : _a.website;
  return website
    ? `<li id='store-website'><span class='marker-image'></span><a class='text-black' href='${website}' target='_blank'>More Details</a></li>`
    : "";
}

function getDistanceAndTime({ properties }) {
  const distanceLabel =
    (properties.distance_text || "") +
    (properties.duration_text ? ` (${properties.duration_text})` : "");
  return `<p class='summary-distance'>${distanceLabel}</p>`;
}

function formatAddress(properties) {
  return properties && properties.address
    ? `${properties.address.lines || ""}, ${properties.address.zipcode || ""} ${properties.address.city || ""}`
    : "";
}

function getAddress({ properties }) {
  const address = formatAddress(properties);
  return `
    <li id='store-address'>
      <span class='marker-image'></span>
      <div>
        <p>${address}</p>
        <p>${getDistanceAndTime({ properties })}</p>
      </div>
    </li>`;
}

function getSummaryAddress({ properties }) {
  const address = formatAddress(properties);
  return `<p class='summary-address'>${address}</p>`;
}

function getSummaryPhone({ properties }) {
  const phone =
    properties && properties.contact ? properties.contact.phone || "" : "";
  return `<p class='summary-address'>${phone}</p>`;
}

function getFullSchedule({ properties }) {
  const weeklyOpening = properties.weekly_opening;
  const dayLabels = {
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
    7: "Sunday",
  };

  if (!weeklyOpening) {
    return "";
  }

  const daysHoursHTMLTable = Object.keys(dayLabels)
    .map((day) => {
      let _a;
      const hours =
        ((_a = weeklyOpening[day]) === null || _a === void 0
          ? void 0
          : _a.hours) || [];
      let daysHours = "";

      if (hours.length === 0) {
        daysHours = "Closed";
      } else {
        const hoursStrings = hours.map((hour) => {
          if (hour["all-day"]) {
            return "24h/24";
          }
          return `${hour.start}-${hour.end}`;
        });

        daysHours = hoursStrings.join(", ");
      }
      return `<li><span class='day'>${dayLabels[day]}</span><span class="hours">${daysHours}</span></li>`;
    })
    .join("");
  return `<ul class='store-opening-hours-list'>${daysHoursHTMLTable}</ul>`;
}

function getHours(store) {
  return `<li id='store-hours'><span class='marker-image'></span>${getFullSchedule(store)}</li>`;
}

function getOpeningLabel({ properties }) {
  let _a, _b, _c;

  if (!properties.open) {
    return "";
  }

  let openLabel;

  if (properties.open.open_now) {
    openLabel = `Open now until ${(_a = properties.open.current_slice) === null || _a === void 0 ? void 0 : _a.end}`;
  } else {
    // @ts-ignore - TODO next_opening is wrongly spelled `nextOpening` in @types/woosmap.map
    openLabel = `Closed until ${convertTime(Date.parse(((_b = properties.open.next_opening) === null || _b === void 0 ? void 0 : _b.day) || "") / 1000)} at ${(_c = properties.open.next_opening) === null || _c === void 0 ? void 0 : _c.start}`;
  }
  return `<p class='summary-hours'>${openLabel}</p>`;
}

function convertTime(UNIX_timestamp) {
  const date = new Date(UNIX_timestamp * 1000);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function createDetailedStoreCard(store) {
  const myCustomContent = document.createElement("ul");

  myCustomContent.id = "myCustomContentID";
  myCustomContent.innerHTML = [
    getWebSite(store),
    getAddress(store),
    getHours(store),
    getPhone(store),
  ].join("");
  return myCustomContent;
}

function createSummaryStoreCard(store) {
  const mySummaryContent = document.createElement("div");

  mySummaryContent.className = "store-summary";
  mySummaryContent.innerHTML = [
    `<p class='store-name'>${store.properties.name}</p>`,
    getSummaryAddress(store),
    getSummaryPhone(store),
    getOpeningLabel(store),
    getDistanceAndTime(store),
  ].join("");
  return mySummaryContent;
}

function isMobileDevice() {
  return window.innerWidth < 500;
}

function initStoreLocator() {
  const webapp = new window.WebApp("map", "YOUR_API_KEY");

  webapp.setFullStoreRenderer(createDetailedStoreCard);
  webapp.setSummaryStoreRenderer(createSummaryStoreCard);
  webapp.setConf(configLocator);
  webapp.setInitialStateToSelectedStore("12003");
  webapp.render(isMobileDevice());
}

initStoreLocator();
