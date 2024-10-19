window.addEventListener("load", () => {
  document.querySelector("share-button").addEventListener("click", shareApp);

  document.querySelector("#continueButton").addEventListener("click", continueGame);
  document.querySelector("#newGameButton").addEventListener("click", newGame);

  document.querySelector(".privacy-policy-link").addEventListener("click",
    () => window.location.href = `${pages.privacyPolicy}/${pages.indexPage}`
  );

  initHome();

  tooltip_init();

  keyOnTabIndex();
});

function initHome() {
  document.querySelector("#continueButton").disabled = !Boolean(localStorage.currGame);
}

function continueGame() { // todo: go to last visited page
  loadCurrGame();

  window.location.href = `pages/${currGame.currPage ? currGame.currPage : pages.setBoard}/${pages.indexPage}`;
}

function newGame() {
  localStorage.removeItem('currGame');

  loadCurrGame();

  window.location.href = `pages/${pages.setBoard}/${pages.indexPage}`;
}

function tooltip_init() {
    ElementGuide.data = [
        new ElementGuide("#homeButton", "Return to the main menu"),
        new ElementGuide(".svgC", "Drag between two dots to draw your line!")
    ];

    document.querySelector("#guide")?.addEventListener("click", ElementGuide.nextState);
}