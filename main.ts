import { Game } from './common/js/classes.js';
import { pages } from './common/js/variables.js';
import { ElementGuide } from './common/js/tooltip.js';
import { keyOnTabIndex } from './common/js/global.js';
import { shareApp } from './variations/platform-specific-home.js';
import './web-components/share-button/index.js';
import './web-components/tooltip/index.js';

window.addEventListener("load", () => {
  document.querySelector("share-button").addEventListener("click", shareApp);

  document.querySelector("#continueButton").addEventListener("click", Game.continue);
  document.querySelector("#newGameButton").addEventListener("click", newGame);
  document.querySelector('#savedGamesButton').addEventListener('click', savedGames);
  document.querySelector(".close-pop-up").addEventListener("click", savedGames_close);

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
  // const dialog = document.querySelector('.saved-games');
  // const listUI = dialog.querySelector(".games-list");

  // listUI.innerHTML = "";

  // Game.load();

  // Game.games.forEach(game => {
  //   const gameUI = createSavedGameUI(game);

  //   listUI.appendChild(gameUI);
  // });

  window.location.href = pages.savedGames;
}

function savedGames_close() {
  const dialog = document.querySelector('.saved-games');

  (dialog as HTMLDialogElement).close();
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
