window.addEventListener("load", () => {
  const title = document.querySelector("title");

  let titleText = [title.innerText, window.location.hostname].filter(e => e && e != "").join(" - ");

  if (typeof titleText == "string") {
    title.innerText = titleText;
  }

  updateVersionUI();

  // testing guide feature
  // let a = new ElementGuide(document.querySelector("#guide"));
  // a.activate();
});

function keyOnTabIndex() {
  document.querySelectorAll("[tabindex]").forEach((tabIndexItem) => {
    tabIndexItem.addEventListener("keypress", event => {
      if (event.keyCode === 13) {
        tabIndexItem.dispatchEvent(new Event("click"));
      }
    });
  });
}

function highlightElement(element) {
  const container = document.querySelector("body");
  container.classList.add("highlight");

  let reachedElement = false;

  while (!reachedElement) {
    const parent = element.closest(".highlight > *");
    parent.classList.add("highlight");

    reachedElement = parent == element;
  }
}

function removeHighlight() {
  const elements = document.querySelectorAll(".highlight");

  elements.forEach(element => element.classList.remove("highlight"));
}

function elementTooltip(element) { // make this a web component or a class
  const container = document.querySelector("body");

  const containerBoundingClientRect = container.getBoundingClientRect();
  const elementBoundingClientRect = element.getBoundingClientRect();

  const tooltipWidth = 200;
  const tooltipHeight = 100;
  const gap = 5;

  const tooltip = document.createElement("div");
  tooltip.classList = "tooltip highlight highlight-container";
  Object.assign(tooltip.style, {
    width: `${tooltipWidth}px`,
    height: `${tooltipHeight}px`
  });

  const cornerDot_TopLeft = document.createElement("div");
  cornerDot_TopLeft.classList = "corner-dots top left";
  tooltip.append(cornerDot_TopLeft);

  const cornerDot_TopRight = document.createElement("div");
  cornerDot_TopRight.classList = "corner-dots top right";
  tooltip.append(cornerDot_TopRight);

  const cornerDot_BottomLeft = document.createElement("div");
  cornerDot_BottomLeft.classList = "corner-dots bottom left";
  tooltip.append(cornerDot_BottomLeft);

  const cornerDot_BottomRight = document.createElement("div");
  cornerDot_BottomRight.classList = "corner-dots bottom right";
  tooltip.append(cornerDot_BottomRight);

  const connectorContainer = document.createElement("div");
  connectorContainer.classList = "connector-container";

  const connector = document.createElement("div");
  connector.classList = "connector";

  connectorContainer.append(connector);

  const isSpaceOnTop = elementBoundingClientRect.top - tooltipHeight - gap > containerBoundingClientRect.top;
  const isSpaceOnBottom = elementBoundingClientRect.bottom + tooltipHeight + gap < containerBoundingClientRect.height;

  if (isSpaceOnTop) {
    tooltip.style.top = `${elementBoundingClientRect.top - tooltipHeight - gap}px`;

    connectorContainer.classList.add("bottom");
  } else if (isSpaceOnBottom) {
    tooltip.style.top = `${elementBoundingClientRect.bottom + gap}px`;

    connectorContainer.classList.add("top");
  } else {
    tooltip.style.top = `${(elementBoundingClientRect.top
      + Math.round(elementBoundingClientRect.height / 2))
      - Math.round(tooltipHeight / 2)}px`;

    connectorContainer.classList.add("middle");
  }

  const isSpaceOnRight = elementBoundingClientRect.right + tooltipWidth + gap < containerBoundingClientRect.width;
  const isSpaceOnLeft = elementBoundingClientRect.left - tooltipWidth - gap > containerBoundingClientRect.left;

  if (isSpaceOnRight) {
    tooltip.style.left = `${elementBoundingClientRect.right + gap}px`;

    connectorContainer.classList.add("left");
  } else if (isSpaceOnLeft) {
    tooltip.style.left = `${elementBoundingClientRect.left - tooltipWidth - gap}px`;

    connectorContainer.classList.add("right");
  } else {
    tooltip.style.left = `${(elementBoundingClientRect.left
      + Math.round(elementBoundingClientRect.width / 2))
      - Math.round(tooltipWidth / 2)}px`;

    connectorContainer.classList.add("center");
  }

  console.log({ elementBoundingClientRect });
  console.log({ isSpaceOnTop, isSpaceOnRight, isSpaceOnBottom, isSpaceOnLeft });

  tooltip.append(connectorContainer);

  container.append(tooltip);
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

function getScrollbarSize() {
  return Number(
    getComputedStyle(document.documentElement)
      .getPropertyValue('--scrollbarSize').trim().replace(/\D/g, '')
  ) || 0;
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