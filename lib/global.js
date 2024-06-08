$aEL = (o, e, f, b) => o.addEventListener(e, f, b);
$rEL = (o, e, f) => o.removeEventListener(e, f);

const pages = {
  indexPage: "index.html",
  setBoard: "set-board",
  setPlayers: "set-players",
  play: "play",
  privacyPolicy: "privacy-policy"
};

const onAppStore = {
  packageName: "com.vishesh.dotbox",
  googlePlay: "http://play.google.com/store/apps/details?id="
}

const shareTitle = `DotBox`,
  shareText = "Check out 'DotBox', an amazing dots and boxes gaming application!",
  shareUrl = window.location.href;

const playStoreLink = `${onAppStore.googlePlay}${onAppStore.packageName}`;

var currGame = {};

class Game {
  constructor() {
    this.dateTime = new Date(),
      this.gameBoard = gameBoard(),
      this.minPlayer = 2,
      this.players = players(this.minPlayer, this.maxPlayer),
      this.lines = [],
      this.currPage = ""
  }

  get maxPlayer() {
    if (typeof this.gameBoard?.row == 'number' && typeof this.gameBoard?.col == 'number') {
      return (this.gameBoard.row - 1) * (this.gameBoard.col - 1);
    } else {
      return this.minPlayer;
    }
  }
}

class GameBoard {
  constructor() {
    this.gap = 50;
    this.minRow = 3;
    this.minCol = 3;
    this.maxRow = this.minRow;
    this.maxCol = this.minCol;
    this.row = this.minRow;
    this.col = this.minCol;
    this.x = 130;
  }
}

class Player {
  constructor(players = [], id = 0, name = '', color = null, isAlgo = false, rank = 0, score = 0, avatar = null) {
    this.avatar = avatar;
    this.color = color || newColor(players.map(player => player.color));
    this.id = id;
    this.isAlgo = isAlgo;
    this.name = name;
    this.rank = rank;
    this.score = score;
  }

  get placeholderName() {
    return this.name || `player${this.id}`;
  }
}

class Dot {
  constructor(x, y, side) {
    this.x = x;
    this.y = y;
    this.side = side;
  }
}

class Line {
  constructor(x1, y1, x2, y2, byPlayerID, prev = false) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.byPlayerID = byPlayerID;
    this.prev = prev;
  }

  get orient() {
    return (this.x1 == this.x2) && (this.y1 != this.y2)
      ? 'vertical' : 'horizontal';
  }

  get byPlayer() {
    return currGame.players.find(player => player.id == this.byPlayerID);
  }

  //include comparison method to compare parameter/argument with this object.
}

window.addEventListener("load", () => {
  const title = document.querySelector("title");

  let titleText = [title.innerText, window.location.hostname].filter(e => e && e != "").join(" - ");

  if (typeof titleText == "string") {
    title.innerText = titleText;
  }

  updateVersionUI();
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
  return Number(
    getComputedStyle(document.documentElement)
      .getPropertyValue('--dotRadius').trim().replace(/\D/g, '')
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