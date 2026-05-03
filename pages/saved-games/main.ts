import { Game } from '../../common/js/classes.js';
import { pages } from '../../common/js/variables.js';
import { keyOnTabIndex, loadingStartUI, loadingEndUI } from '../../common/js/global.js';
import { ElementGuide } from '../../common/js/tooltip.js';
import { hueToHex, toHslObject, toRadialGradientCSSValue } from '../../common/js/color.js';

var targetPlayerIndex = 0;

onload = function () {
  document.querySelector("#backButton")
    .addEventListener("click", () => window.history.back());

  document.querySelector("#homeButton")
    .addEventListener("click", () => window.location.href = pages.index);

  setupGamesUI();

  keyOnTabIndex();
}

function gamesUILoaded() {
  // tooltip_init();
}

// function tooltip_init() {
//   ElementGuide.data = [
//     new ElementGuide(".avatar", "Player Color", "Choose your player color!"),
//     new ElementGuide(".playerName", "Player Name", "Type your name"),
//     new ElementGuide(".isAlgo", "Autoplayer", "Enable Autoplayer (Let the robot play!)"),
//     new ElementGuide(".removePlayerB", "Remove Player", "Remove this player"),
//     new ElementGuide(".addb", "Add Player", "Add a new player to the game!"),
//   ];

//   document.querySelector("#guide").addEventListener("click", ElementGuide.nextState);

//   document.querySelector(".page-bg").addEventListener("click", ElementGuide.nextState);

//   const tooltipPlayedKey = "tooltip played once for saved games";
//   if (!localStorage.getItem(tooltipPlayedKey)) {
//     ElementGuide.nextState();

//     localStorage.setItem(tooltipPlayedKey, 'true');
//   }
// }

function updatePlayerCountView() {
  document.querySelector("#info")
    .innerHTML = `${Game.games.length}<br /> game${Game.games.length == 1 ? "" : "s"}`;
}

async function setupGamesUI() {
  loadingStartUI();

  setTimeout(() => {
    const savedGamesUI = document.querySelector(".saved-games");

    savedGamesUI.innerHTML = "";

    Game.load();

    for (let game of Game.games) {
      savedGamesUI.append(game.listItemUI);
    }

    updatePlayerCountView();

    loadingEndUI();

    gamesUILoaded();
  }, 0);
}

function createPlayerUI(player) {
  const playerUI = document.createElement("div");
  playerUI.classList = "player";

  const avatarUI = document.createElement("button");
  avatarUI.classList = "avatar button";
  avatarUI.style.background = toRadialGradientCSSValue(player.color) || player.color;
  playerUI.append(avatarUI);

  const playerName = document.createElement("input");
  playerName.classList = "playerName";
  playerName.maxLength = 30;
  playerName.placeholder = player.placeholderName;
  playerName.value = player.name;
  playerUI.append(playerName);

  const isAlgo = document.createElement("input");
  isAlgo.classList = "isAlgo button";
  isAlgo.type = "checkbox";
  isAlgo.checked = player.isAlgo;
  keyOnElement(isAlgo);

  playerUI.append(isAlgo);

  const removePlayerB = document.createElement("button");
  removePlayerB.classList = "button removePlayerB";
  removePlayerB.innerHTML = "&#10005;";
  playerUI.append(removePlayerB);

  return playerUI;
}

function keyOnElement(element) {
  element.addEventListener("keypress", event => {
    if (event.keyCode === 13) {
      if (element.click) {
        element.click();
      } else {
        element.dispatchEvent(new Event("click"));
      }
    }
  });
}
