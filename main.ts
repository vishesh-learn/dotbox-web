window.addEventListener("load", () => {
  document.querySelector("share-button").addEventListener("click", shareApp);

  document.querySelector("#continueButton").addEventListener("click", Game.continue);
  document.querySelector("#newGameButton").addEventListener("click", newGame);
  document.querySelector('#savedGamesButton').addEventListener('click', savedGames);

  initHome();

  tooltip_init();

  keyOnTabIndex();
});

function initHome() {
  Game.load();

  (document.querySelector("#continueButton") as HTMLButtonElement).disabled = !Boolean(Game.currGame);
}

function newGame() {
  console.log('newGame called');

  Game.load();

  new Game().save();

  window.location.href = pages.setBoard;
}

function savedGames() {
  window.location.href = pages.savedGames;
}

function tooltip_init() {
  ElementGuide.data = [
    new ElementGuide("#homeButton", "Return to the main menu"),
    new ElementGuide(".svgC", "Drag between two dots to draw your line!")
  ];

  document.querySelector("#guide")?.addEventListener("click", ElementGuide.nextState);

  const tooltipPlayedKey = "tooltip played once for home";
  if (!localStorage.getItem(tooltipPlayedKey)) {
    ElementGuide.nextState();

    localStorage.setItem(tooltipPlayedKey, 'true');
  }
}
