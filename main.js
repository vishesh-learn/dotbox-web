window.addEventListener("load", () => {
  document.querySelector(".share-button").addEventListener("click", shareApp);

  document.querySelector("#continueButton").addEventListener("click", continueGame);
  document.querySelector("#startButton").addEventListener("click", newGame);

  document.querySelector(".privacy-policy-link").addEventListener("click",
    () => window.location.href = `${pages.privacyPolicy}`
  );

  keyOnTabIndex();
});

function continueGame() {
  loadCurrGame();

  window.location.href = `${pages.play}`;
}

function newGame() {
  localStorage.removeItem('currGame');

  loadCurrGame();

  window.location.href = `${pages.setBoard}`;
}