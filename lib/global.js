$ = (o) => document.querySelector(o);
$All = (o) => document.querySelectorAll(o);
$aEL = (o, e, f, b) => o.addEventListener(e, f, b);
$rEL = (o, e, f) => o.removeEventListener(e, f);
$cE = (tN) => document.createElement(tN);
$cENS = (tN) => document.createElementNS('http://www.w3.org/2000/svg', tN);

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

var game = {
  minPlayer: 2,
  maxPlayer: 3,
  gameBoard: {},
  playerList: []
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
  constructor(id = 0, name = '', color = randomColor(), isAlgo = false, rank = 0, score = 0, avatar) {
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
    game.playerList = JSON.parse(localStorage.playerList);
  }

  game.maxPlayer = (game.gameBoard.row - 1) * (game.gameBoard.col - 1);

  game.playerList = game.playerList.slice(0, game.maxPlayer);
  
  while (game.playerList.length < game.minPlayer) {
    game.playerList.push(new Player());
  }
  
  game.playerList = game.playerList.map(player => {
    return Object.assign(new Player, player);
  });
  
  if ((localStorage.playerList == undefined) && (game.playerList.length == game.minPlayer)) {
    game.playerList[game.minPlayer - 1].isAlgo = true;
  }

  savePlayerList();
}

function loadGameBoard(){
   game.gameBoard = localStorage.gameBoard ? JSON.parse(localStorage.gameBoard) : new GameBoard();
}

function saveGameBoard(){
  localStorage.gameBoard = JSON.stringify(game.gameBoard);
}

function assignID(){
  for (var player of game.playerList) {
    player.id = game.playerList.indexOf(player) + 1;
  }
}

function savePlayerList(){
  assignID();
  localStorage.playerList = JSON.stringify(game.playerList);
}

function difference(a, b) { return Math.abs(a - b); }

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//window.onerror = (message, source, lineno, colno, error) => {$("pre").innerHTML = lineno + ": " + message + "\nat col: " + colno;}