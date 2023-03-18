$ = (o) => document.querySelector(o);
$All = (o) => document.querySelectorAll(o);
$aEL = (o, e, f, b) => o.addEventListener(e, f, b);
$rEL = (o, e, f) => o.removeEventListener(e, f);
$cE = (tN) => document.createElement(tN);

var nS = 'http://www.w3.org/2000/svg';
$cENS = (tN) => document.createElementNS(nS, tN);

const pages = {
  home: "index.html",
  setBoard: "set-board/index.html",
  setPlayers: "set-players/index.html",
  play: "play/index.html",
  privacyPolicy: "privacy-policy/index.html"
};

const onAppStore = {
  packageName : "com.vishesh.dotbox",
  googlePlay: "http://play.google.com/store/apps/details?id="
}

const shareTitle = `DotBox`,
shareText = `Check out DotBox, an amazing dots and boxes gaming application!`,
shareUrl = window.location.href;

const playStoreLink = `${onAppStore.googlePlay}${onAppStore.packageName}`;

var gameBoard = {}, playerList = [];

var game = {
  minPlayer: 2,
  maxPlayer: 3
}

class GameBoard{
  constructor(){
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
  constructor(id = 0, name = '', color = randomColor(), isAlgo = false, rank = 0, score = '', avatar) {
    this.avatar = avatar;
    this.color = color;
    this.id = id;
    this.isAlgo = isAlgo;
    this.name = name;
    this.rank = rank;
    this.score = score;
  }

  static getName(player) {
    return player.name ? player.name : `player${player.id}`;
  }
}

window.addEventListener("load", () => {
  let title = ["DotBox", window.location.hostname].filter(e => e && e != "").join(" - ");

  if (typeof title == "string") {
    $("title").innerText = title;
  }
});

function keyOnTabIndex() {
  document.querySelectorAll("[tabindex]").forEach((tabIndexItem) => {
    tabIndexItem.addEventListener("keypress", event => {
      if (event.keyCode === 13) tabIndexItem.dispatchEvent(new Event("click"));
    });
  });
}

function loadGameAndPlayerList() {
  loadGameBoard();
  
  if(localStorage.playerList != undefined){
    playerList = JSON.parse(localStorage.playerList);
  }

  game.maxPlayer = (gameBoard.row - 1) * (gameBoard.col - 1);

  playerList = playerList.slice(0, game.maxPlayer);

  while (playerList.length < game.minPlayer) {
    playerList.push(new Player());
  }

  playerList = playerList.map(player => {
    return Object.assign(new Player, player);
  });
  
  if ((localStorage.playerList == undefined) && (playerList.length == game.minPlayer)) {
    playerList[game.minPlayer - 1].isAlgo = true;
  }

  savePlayerList();
}

function loadGameBoard(){
   gameBoard = localStorage.gameBoard ? JSON.parse(localStorage.gameBoard) : new GameBoard();
}

function saveGameBoard(){
  localStorage.gameBoard = JSON.stringify(gameBoard);
}

function assignID(){
  for (var player of playerList) {
    player.id = playerList.indexOf(player) + 1;
  }
}

function savePlayerList(){
  assignID();
  localStorage.playerList = JSON.stringify(playerList);
}

function difference(a, b) { return Math.abs(a - b); }

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

//window.onerror = (message, source, lineno, colno, error) => {$("pre").innerHTML = lineno + ": " + message + "\nat col: " + colno;}