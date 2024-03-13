function init() {
  const responseElement = document.getElementById("response-container");
  //@ts-ignore
  const localitiesWidget = new window.woosmap.localities.Autocomplete(
    "autocomplete-input",
    {},
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
