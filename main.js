window.addEventListener("load", () => {
  document.querySelector("share-button").addEventListener("click", shareApp);

  document.querySelector("#continueButton").addEventListener("click", continueGame);
  document.querySelector("#newGameButton").addEventListener("click", newGame);
  document.querySelector('#savedGamesButton').addEventListener('click', savedGames);

  initHome();

  tooltip_init();

  keyOnTabIndex();
});

function initHome() {
  Game.load();

  document.querySelector("#continueButton").disabled = !Boolean(Game.currGame);
}

function continueGame() {
  Game.load();

  window.location.href = `pages/${Game.currGame.currPage ?
    Game.currGame.currPage : pages.setBoard}/${pages.indexPage}`;
}

function newGame() {
  console.log('newGame called');

  Game.load();

  new Game().save();

  window.location.href = `pages/${pages.setBoard}/${pages.indexPage}`;
}

function savedGames() {
  const dialog = document.querySelector('.saved-games');
  const listUI = dialog.querySelector(".games-list");

  Game.load();

  Game.games.forEach(game => {
    const gameUI = createSavedGameUI(game);

    listUI.appendChild(gameUI);
  });

  dialog.showModal();
}

function createSavedGameUI(game) {
  const gameUI = document.createElement("div");
  gameUI.classList = "saved-game";

  const nameUI = document.createElement("div");
  nameUI.classList = "name date";
  nameUI.innerHTML = formatDateTimeWithRelativeEn(game.meta_updatedAt);
  gameUI.append(nameUI);

  gameUI.addEventListener('click', () => {
    game.save();

    continueGame();
  });

  return gameUI;
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

    localStorage.setItem(tooltipPlayedKey, true);
  }
}