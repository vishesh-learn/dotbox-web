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
  shareText = `Check out DotBox, an amazing dots and boxes gaming application!`,
  shareUrl = window.location.href;

const playStoreLink = `${onAppStore.googlePlay}${onAppStore.packageName}`;

var currGame = {};

class Game {
  constructor() {
    this.dateTime = new Date(),
    this.gameBoard = new GameBoard(),
    this.minPlayer = 2,
    this.maxPlayer = (this.gameBoard.row - 1) * (this.gameBoard.col - 1),
    this.playerList = playerList(this.minPlayer, this.maxPlayer),
    this.lines = [];
    this.currPage = "";
  }
}

class GameBoard {
  constructor() {
    this.gap = 50;
    this.minRow = 3;
    this.minCol = 3;
    this.maxRow = this.minRow;
    this.maxCol = this.minCol;
    this.svgPaddingX = 30;
    this.svgPaddingY = 30;
    this.row = this.minRow;
    this.col = this.minCol;
    this.x = 130;
  }
}

class Player {
  constructor(playerList = [], id = 0, name = '', color = null, isAlgo = false, rank = 0, score = 0, avatar = null) {
    this.avatar = avatar;
    this.color = color || newColor(playerList.map(player => player.color));
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
    return currGame.playerList.find(player => player.id == this.byPlayerID);
  }
}

window.addEventListener("load", () => {
  let title = ["DotBox", window.location.hostname].filter(e => e && e != "").join(" - ");

  if (typeof title == "string") {
    document.querySelector("title").innerText = title;
  }
});

function keyOnTabIndex() {
  document.querySelectorAll("[tabindex]").forEach((tabIndexItem) => {
    tabIndexItem.addEventListener("keypress", event => {
      if (event.keyCode === 13) tabIndexItem.dispatchEvent(new Event("click"));
    });
  });
}

function resetGame() {
  currGame.lines = [];

  saveCurrGame();
}

function saveCurrGame() {
  currGame.playerList.forEach(assignID);

  localStorage.currGame = JSON.stringify(currGame);
}

function loadCurrGame() {
  currGame = localStorage.currGame ? JSON.parse(localStorage.currGame) : new Game();

  currGame = Object.assign(new Game, currGame);

  currGame.gameBoard = Object.assign(new GameBoard, currGame.gameBoard);

  currGame.playerList = playerList(currGame.minPlayer, currGame.maxPlayer, currGame.playerList);

  currGame.lines = currGame.lines.map(line => {
    return Object.assign(new Line, line);
  });
}

function playerList(minPlayer = 2, maxPlayer = 3, playerList = []) {
  while (playerList.length < minPlayer) {
    playerList.push(new Player(playerList));
  }

  playerList = playerList.slice(0, maxPlayer);

  playerList = playerList.map(player => {
    return Object.assign(new Player, player);
  });

  playerList.forEach(assignID);

  return playerList;
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

//window.onerror = (message, source, lineno, colno, error) => {document.querySelector("pre").innerHTML = lineno + ": " + message + "\nat col: " + colno;}