function init() {
  const responseElement = document.getElementById("response-container");
  // @ts-ignore
  const localitiesWidget = new window.woosmap.localities.Autocomplete(
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
