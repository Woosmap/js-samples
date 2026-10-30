// [START woosmap_localities_js_widget_custom_desc]
// The Localities JS Widget ships no typings: describe the parts this sample uses.
interface LocalitiesWidget {
  addListener(eventName: string, handler: () => void): void;
  getSelectedSuggestionDetails(): unknown;
}

interface LocalitiesWidgetGlobal {
  localities: {
    Autocomplete: new (inputId: string, options: object) => LocalitiesWidget;
  };
}

function init(): void {
  const responseElement = document.getElementById(
    "response-container",
  ) as HTMLElement;

  const { localities } = woosmap as unknown as LocalitiesWidgetGlobal;
  const localitiesWidget = new localities.Autocomplete(
    "autocomplete-input",
    {
      minLength: 3,
      components: {
        country: ["fr"],
      },
      customDescription:
        'postal_code:"{name} ({postal_town}) - {administrative_area_level_0}"',
    },
  );
  localitiesWidget.addListener("selected_suggestion", () => {
    const selectedLocality = localitiesWidget.getSelectedSuggestionDetails();
    if (responseElement) {
      responseElement.innerHTML = `<code>${JSON.stringify(selectedLocality, null, 2)}</code>`;
      responseElement.style.display = "block";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  init();
});

// [END woosmap_localities_js_widget_custom_desc]

export {};
