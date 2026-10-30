function init() {
  const responseElement = document.getElementById("response-container");
  const { localities } = woosmap;
  const localitiesWidget = new localities.Autocomplete("autocomplete-input", {
    minLength: 3,
    // [START woosmap_localities_js_widget_custom_desc]
    components: {
      country: ["fr"],
    },
    customDescription:
      'postal_code:"{name} ({postal_town}) - {administrative_area_level_0}"',
  });

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
