window.addEventListener("load", () => {
  document.querySelector("share-button").addEventListener("click", shareApp);

  document.querySelector("#continueButton").addEventListener("click", Game.continue);
  document.querySelector("#newGameButton").addEventListener("click", newGame);
  document.querySelector('#savedGamesButton').addEventListener('click', savedGames);

  initHome();

  home_tooltip_init();

  keyOnTabIndex();
});

function shareApp() {
  if (typeof Android !== "undefined") {
    Android.shareApp(shareTitle, shareText);

    return;
  }

  if (navigator.share) {
    navigator.share({
      title: shareTitle,
      text: shareText,
      url: shareUrl
    });
  }
  else {
    window.open(shareUrl);
  }
}

function initHome() {
  Game.load();

  (document.querySelector("#continueButton") as HTMLButtonElement).disabled = !Boolean(Game.currentGame);
  (document.querySelector("#savedGamesButton") as HTMLButtonElement).disabled = !Boolean(Game.games?.length);
}

function newGame() {
  new Game().save();

  window.location.href = pages.setBoard;
}

function savedGames() {
  window.location.href = pages.savedGames;
}

function home_tooltip_init() {
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
