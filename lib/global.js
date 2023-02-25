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
  constructor() {
    this.id = 0;
    this.name = "";
    this.hue = randomHue(playerList);
    this.isAlgo = false;
    this.rank = 0;
    this.score = 0;
    this.avatar = "";
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

function loadGameBoard(){
   gameBoard = localStorage.gameBoard ? JSON.parse(localStorage.gameBoard) : new GameBoard();
}

function saveGameBoard(){
  localStorage.gameBoard = JSON.stringify(gameBoard);
}

function loadPlayerList(){
  if(localStorage.playerList != undefined){
    playerList = JSON.parse(localStorage.playerList);
  }

  while (playerList.length < game.minPlayer) {
    playerList.push(new Player());
  }

  playerList.forEach((player, i) => {
    if (player.hue == undefined) {
      playerList[i].hue = randomHue(playerList);
    }
  })
  
  if ((localStorage.playerList == undefined) && (playerList.length == game.minPlayer)) {
    playerList[game.minPlayer - 1].isAlgo = true;
  }

  savePlayerList();
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

//window.onerror = (message, source, lineno, colno, error) => {$("pre").innerHTML = lineno + ": " + message + "\nat col: " + colno;}