// [START woosmap_render_shapes_data]
// Initialize and add the map
let map: woosmap.map.Map;

const pubsData = {
  pubs: [
    {
      coordinates: [-6.25886, 53.33972],
      properties: {
        review: "Smallest Pub In Ireland",
        name: "Dawson Lounge",
      },
    },
    {
      coordinates: [-6.23036, 53.329],
      properties: {
        review: "Rugger Bar, but not bad",
        name: "Paddy Cullens",
      },
    },
    {
      coordinates: [-6.23048, 53.32905],
      properties: {
        review: "Can't Remember. Possibly Drunk",
        name: "Crowes Pub",
      },
    },
    {
      coordinates: [-6.24527, 53.33387],
      properties: {
        review: "Decent Boozer. On the Lansdowne route.",
        name: "The Wellington",
      },
    },
    {
      coordinates: [-6.24303, 53.33332],
      properties: {
        review: "Cock Pub. Think its closed.",
        name: "Searsons",
      },
    },
    {
      coordinates: [-6.24276, 53.33788],
      properties: {
        review:
          "Good Pub for pre Ireland match drinks. Always a decent crowd and sometimes free nibbles",
        name: "Scruffy Murphys",
      },
    },
    {
      coordinates: [-6.24317, 53.33837],
      properties: {
        review: "Quiet Pub, nice feel to it.",
        name: "Oil Can Harrys",
      },
    },
    {
      coordinates: [-6.2491, 53.34418],
      properties: {
        review: "Near Pearse St Dart station. Not mad about it.",
        name: "The Lombard",
      },
    },
    {
      coordinates: [-6.25551, 53.34688],
      properties: {
        review: "Auld farts pub. Usually a good crowd",
        name: "Mulligans",
      },
    },
    {
      coordinates: [-6.25589, 53.34741],
      properties: {
        review: "Meh... More of a restaurant bar",
        name: "White Horse",
      },
    },
    {
      coordinates: [-6.27575, 53.34511],
      properties: {
        review:
          "Went in here for a relief pint after the horrifying experience that was The Brazen Head. FUCK YOU AMERICANS",
        name: "O'Sheas The Merchant",
      },
    },
    {
      coordinates: [-6.25753, 53.34568],
      properties: {
        review: "Cunt Pub Cunt Pub Cunt Pub",
        name: "Doyles",
      },
    },
    {
      coordinates: [-6.26441, 53.33164],
      properties: {
        review: "Decent Bar. Pitchers of Buckfast. Ouch",
        name: "George Bernard Shaw",
      },
    },
    {
      coordinates: [-6.25914, 53.34685],
      properties: {
        review: "Da Mhamais hangout",
        name: "Fitzgeralds",
      },
    },
    {
      coordinates: [-6.26346, 53.34583],
      properties: {
        review: "Good Pub. Sometimes have blues lads upstairs",
        name: "Ha'penny Bridge Inn",
      },
    },
    {
      coordinates: [-6.25088, 53.35004],
      properties: {
        review: "Decent Pub. Think its been renamed.",
        name: "Kates Cottage",
      },
    },
    {
      coordinates: [-6.26064, 53.34385],
      properties: {
        review: "Bit of a tourist pub. But not the worst",
        name: "O'Neills",
      },
    },
    {
      coordinates: [-6.25395, 53.33814],
      properties: {
        review: "Good Pub. Proper bar and good night life in the lounge",
        name: "O'Donoghues",
      },
    },
    {
      coordinates: [-6.3168, 53.34029],
      properties: {
        review: "Supersaints Pub. nuff said",
        name: "McDowells",
      },
    },
    {
      coordinates: [-6.32089, 53.33965],
      properties: {
        review: "Good banter after a game",
        name: "Black Lion",
      },
    },
    {
      coordinates: [-6.24896, 53.33687],
      properties: {
        review: "Decent Boozer. A bit isolated",
        name: "Larry Murphys",
      },
    },
    {
      coordinates: [-6.26059, 53.33057],
      properties: {
        review: "Great place to sit on the canal with a pint on a warm day",
        name: "The Barge",
      },
    },
    {
      coordinates: [-6.25564, 53.36753],
      properties: {
        review: "Berties local ;-)",
        name: "Fagans",
      },
    },
    {
      coordinates: [-6.31509, 53.3402],
      properties: {
        review: "Real nice pub. laptop for a jukebox...",
        name: "Taveys",
      },
    },
    {
      coordinates: [-6.33976, 53.34227],
      properties: {
        review: "Has been done up to look like faux Irish pub. tut tut",
        name: "The Laurence",
      },
    },
    {
      coordinates: [-6.26794, 53.3449],
      properties: {
        review: "Czech Beer and Disco Bar...",
        name: "The Czech Inn",
      },
    },
    {
      coordinates: [-6.26767, 53.34479],
      properties: {
        review: "Samba lessons downstairs. WTF",
        name: "Turks Head",
      },
    },
  ],
};

function initMap() {
  map = new window.woosmap.map.Map(
    document.getElementById("map") as HTMLElement,
    {
      center: { lat: 53.3430183, lng: -6.25321 },
      zoom: 14,
    },
  );

  pubsData.pubs.forEach((pub) => {
    map.data.add({
      geometry: new window.woosmap.map.Data.Point({
        lat: pub.coordinates[1],
        lng: pub.coordinates[0],
      }),
      properties: { name: pub.properties.name },
    });
  });

  map.data.setStyle((feature) => {
    let iconPint =
      "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzRweCIgaGVpZ2h0PSIzNHB4IiB2aWV3Qm94PSIwIDAgMzQgMzQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+T3ZhbDwvdGl0bGU+CiAgICA8ZGVmcz4KICAgICAgICA8Y2lyY2xlIGlkPSJwYXRoLTEiIGN4PSIxNyIgY3k9IjE1IiByPSIxMyI+PC9jaXJjbGU+CiAgICAgICAgPGZpbHRlciB4PSItMjYuOSUiIHk9Ii0xOS4yJSIgd2lkdGg9IjE1My44JSIgaGVpZ2h0PSIxNTMuOCUiIGZpbHRlclVuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgaWQ9ImZpbHRlci0yIj4KICAgICAgICAgICAgPGZlT2Zmc2V0IGR4PSIwIiBkeT0iMiIgaW49IlNvdXJjZUFscGhhIiByZXN1bHQ9InNoYWRvd09mZnNldE91dGVyMSI+PC9mZU9mZnNldD4KICAgICAgICAgICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMiIgaW49InNoYWRvd09mZnNldE91dGVyMSIgcmVzdWx0PSJzaGFkb3dCbHVyT3V0ZXIxIj48L2ZlR2F1c3NpYW5CbHVyPgogICAgICAgICAgICA8ZmVDb21wb3NpdGUgaW49InNoYWRvd0JsdXJPdXRlcjEiIGluMj0iU291cmNlQWxwaGEiIG9wZXJhdG9yPSJvdXQiIHJlc3VsdD0ic2hhZG93Qmx1ck91dGVyMSI+PC9mZUNvbXBvc2l0ZT4KICAgICAgICAgICAgPGZlQ29sb3JNYXRyaXggdmFsdWVzPSIwIDAgMCAwIDAgICAwIDAgMCAwIDAgICAwIDAgMCAwIDAgIDAgMCAwIDAuNSAwIiB0eXBlPSJtYXRyaXgiIGluPSJzaGFkb3dCbHVyT3V0ZXIxIj48L2ZlQ29sb3JNYXRyaXg+CiAgICAgICAgPC9maWx0ZXI+CiAgICA8L2RlZnM+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iT3ZhbCI+CiAgICAgICAgICAgIDx1c2UgZmlsbD0iYmxhY2siIGZpbGwtb3BhY2l0eT0iMSIgZmlsdGVyPSJ1cmwoI2ZpbHRlci0yKSIgeGxpbms6aHJlZj0iI3BhdGgtMSI+PC91c2U+CiAgICAgICAgICAgIDxjaXJjbGUgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lam9pbj0ic3F1YXJlIiBmaWxsPSIjRTJCOTY3IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGN4PSIxNyIgY3k9IjE1IiByPSIxMS41Ij48L2NpcmNsZT4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==";
    if (feature.getProperty("highlighted")) {
      iconPint =
        "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzRweCIgaGVpZ2h0PSIzNHB4IiB2aWV3Qm94PSIwIDAgMzQgMzQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+T3ZhbDwvdGl0bGU+CiAgICA8ZGVmcz4KICAgICAgICA8Y2lyY2xlIGlkPSJwYXRoLTEiIGN4PSIxNyIgY3k9IjE1IiByPSIxMyI+PC9jaXJjbGU+CiAgICAgICAgPGZpbHRlciB4PSItMjYuOSUiIHk9Ii0xOS4yJSIgd2lkdGg9IjE1My44JSIgaGVpZ2h0PSIxNTMuOCUiIGZpbHRlclVuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgaWQ9ImZpbHRlci0yIj4KICAgICAgICAgICAgPGZlT2Zmc2V0IGR4PSIwIiBkeT0iMiIgaW49IlNvdXJjZUFscGhhIiByZXN1bHQ9InNoYWRvd09mZnNldE91dGVyMSI+PC9mZU9mZnNldD4KICAgICAgICAgICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMiIgaW49InNoYWRvd09mZnNldE91dGVyMSIgcmVzdWx0PSJzaGFkb3dCbHVyT3V0ZXIxIj48L2ZlR2F1c3NpYW5CbHVyPgogICAgICAgICAgICA8ZmVDb21wb3NpdGUgaW49InNoYWRvd0JsdXJPdXRlcjEiIGluMj0iU291cmNlQWxwaGEiIG9wZXJhdG9yPSJvdXQiIHJlc3VsdD0ic2hhZG93Qmx1ck91dGVyMSI+PC9mZUNvbXBvc2l0ZT4KICAgICAgICAgICAgPGZlQ29sb3JNYXRyaXggdmFsdWVzPSIwIDAgMCAwIDAgICAwIDAgMCAwIDAgICAwIDAgMCAwIDAgIDAgMCAwIDAuNSAwIiB0eXBlPSJtYXRyaXgiIGluPSJzaGFkb3dCbHVyT3V0ZXIxIj48L2ZlQ29sb3JNYXRyaXg+CiAgICAgICAgPC9maWx0ZXI+CiAgICA8L2RlZnM+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iT3ZhbCI+CiAgICAgICAgICAgIDx1c2UgZmlsbD0iYmxhY2siIGZpbGwtb3BhY2l0eT0iMSIgZmlsdGVyPSJ1cmwoI2ZpbHRlci0yKSIgeGxpbms6aHJlZj0iI3BhdGgtMSI+PC91c2U+CiAgICAgICAgICAgIDxjaXJjbGUgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lam9pbj0ic3F1YXJlIiBmaWxsPSIjNjI2MjYyIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGN4PSIxNyIgY3k9IjE1IiByPSIxMS41Ij48L2NpcmNsZT4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==";
    }
    return {
      icon: iconPint,
    };
  });

  let highlightedFeatureId;
  map.data.addListener("click", (event) => {
    if (highlightedFeatureId) {
      const highlightedFeature = map.data.getFeatureById(highlightedFeatureId);
      if (highlightedFeature) {
        highlightedFeature.setProperty("highlighted", false);
      }
    }
    const infoElement = document.getElementById("info");
    if (infoElement) {
      infoElement.innerHTML = `<strong>${event.feature.getProperty(
        "name",
      )}</strong>`;
    }
    event.feature.setProperty("highlighted", true);
    highlightedFeatureId = event.feature.id;
  });
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
// [END woosmap_render_shapes_data]

export {};
