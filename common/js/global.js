addEventListener("load", () => {
  const title = document.querySelector("title");

  let titleText = [title.innerText, window.location.hostname].filter(e => e && e != "").join(" - ");

  if (typeof titleText == "string") {
    title.innerText = titleText;
  }

  updateVersionUI();

  addEventListener("resize", ElementGuide.refreshState);
});

function keyOnTabIndex() {
  document.querySelectorAll("[tabindex]").forEach(keyOnElement);
}

function keyOnElement(element) {
  element.addEventListener("keypress", event => {
    if (event.keyCode === 13) {
      console.log("clicking", element);
      
      if (element.click) {
        element.click();
      } else {
        element.dispatchEvent(new Event("click"));
      }
    }
  });
}

function resetGame() {
  currGame.lines = [];

  saveCurrGame();
}

function saveCurrGame() {
  currGame.players.forEach(assignID);

  localStorage.currGame = JSON.stringify(currGame);
}

function loadCurrGame() {
  currGame = localStorage.currGame ? JSON.parse(localStorage.currGame) : new Game();

  currGame = Object.assign(new Game, currGame);

  currGame.gameBoard = gameBoard(currGame.gameBoard);

  currGame.players = players(currGame.minPlayer, currGame.maxPlayer, currGame.players);

  currGame.lines = currGame.lines.map(line => {
    return Object.assign(new Line, line);
  });
}

function gameBoard(gameBoard) {
  gameBoard = Object.assign(new GameBoard, gameBoard);

  if (gameBoard.maxRow < gameBoard.minRow) {
    gameBoard.maxRow = gameBoard.minRow;
  }

  if (gameBoard.maxCol < gameBoard.minCol) {
    gameBoard.maxCol = gameBoard.minCol;
  }

  if (gameBoard.row < gameBoard.minRow) {
    gameBoard.row = gameBoard.minRow;
  }

  if (gameBoard.col < gameBoard.minCol) {
    gameBoard.col = gameBoard.minCol;
  }

  return gameBoard;
}

function players(minPlayer = 2, maxPlayer = 3, players = []) {
  if (maxPlayer < minPlayer) {
    maxPlayer = minPlayer;
  }

  while (players.length < minPlayer) {
    players.push(new Player(players));
  }

  players = players.slice(0, maxPlayer);

  players = players.map(player => {
    return Object.assign(new Player, player);
  });

  players.forEach(assignID);

  return players;
}

function assignID(player, index, array) {
  array[index].id = index + 1;
}

function difference(a, b) { return Math.abs(a - b); }

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function setVersion(versionName) {
  localStorage.setItem('versionName', versionName);

  updateVersionUI();
}

function updateVersionUI() {
  const versionUI = document.querySelector('.version');
  const versionSeparatorUI = document.querySelector('.versionSeparator');

  if (!versionUI) {
    return false;
  }

  let versionName = localStorage.getItem('versionName');

  if (versionName) {
    versionUI.innerHTML = `v${versionName}`;

    versionUI.classList.remove('displayNone');

    if (versionSeparatorUI) {
      versionSeparatorUI.classList.remove('displayNone');
    }
  } else {
    console.log('versionName not found in local storage');

    versionUI.classList.add('displayNone');

    if (versionSeparatorUI) {
      versionSeparatorUI.classList.add('displayNone');
    }
  }
}

function getDotRadius() {
  let dotRadius = Number(
    getComputedStyle(document.documentElement)
      .getPropertyValue('--dotRadius').trim().replace(/\D/g, '')
  ) || 0;

  const accountForIncreasingOutlineOffset = 1;

  const totalRadius = dotRadius + accountForIncreasingOutlineOffset;

  return totalRadius;
}

function getScrollbarSize() {
  return Number(
    getComputedStyle(document.documentElement)
      .getPropertyValue('--scrollbarSize').trim().replace(/\D/g, '')
  ) || 0;
}

function getComputedSize(element) {

  let widthValue = getComputedStyle(element, null)
    .getPropertyValue("width");

  let width = Number(widthValue.match(/^\d+/)?.[0] || 0);

  let heightValue = getComputedStyle(element, null)
    .getPropertyValue("height");

  let height = Number(heightValue.match(/^\d+/)?.[0] || 0);

  return { width, height };
}

function loadingStartUI() {
  document.querySelector("body").classList.add("loading-container");
}

function loadingEndUI() {
  document.querySelector("body").classList.remove("loading-container");
}

// window.onerror = (message, source, lineno, colno, error) => {
//   document.querySelector("pre").innerHTML = lineno + ": " + message + "\nat col: " + colno;
// }