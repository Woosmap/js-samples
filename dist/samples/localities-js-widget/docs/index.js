function init() {
  const responseElement = document.getElementById("response-container");
  const { localities } = woosmap;
  const localitiesWidget = new localities.Autocomplete(
    "autocomplete-input",
    {},
  );

  localitiesWidget.addListener("selected_suggestion", () => {
    // [START woosmap_localities_js_widget]
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
// [END woosmap_localities_js_widget]
