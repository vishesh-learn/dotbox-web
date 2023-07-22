window.addEventListener("load", () => {
  document.querySelector(".share-button").addEventListener("click", shareApp);

  document.querySelector("#continueButton").addEventListener("click", continueGame);
  document.querySelector("#newGameButton").addEventListener("click", newGame);

  document.querySelector(".privacy-policy-link").addEventListener("click",
    () => window.location.href = `${pages.privacyPolicy}/${pages.indexPage}`
  );

  initHome();

  keyOnTabIndex();
});

function initHome() {
  document.querySelector("#continueButton").disabled = !Boolean(localStorage.currGame);
}

function continueGame() { // todo: go to last visited page
  loadCurrGame();

  window.location.href = `${currGame.currPage ? currGame.currPage : pages.setBoard}/${pages.indexPage}`;
}

function newGame() {
  localStorage.removeItem('currGame');

  loadCurrGame();

  window.location.href = `${pages.setBoard}/${pages.indexPage}`;
}