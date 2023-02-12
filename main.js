window.addEventListener("load", () => {
  document.querySelector(".share-button").addEventListener("click", shareApp);

  document.querySelector("#startButton").addEventListener("click",
    () => window.location.href = `${pages.setBoard}`
  );

  document.querySelector(".privacy-policy-link").addEventListener("click",
    () => window.location.href = `${pages.privacyPolicy}`
  );

  keyOnTabIndex();
});