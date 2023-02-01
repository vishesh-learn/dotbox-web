$ = (o) => document.querySelector(o);
$All = (o) => document.querySelectorAll(o);
$aEL = (o, e, f, b) => o.addEventListener(e, f, b);
$rEL = (o, e, f) => o.removeEventListener(e, f);
$cE = (tN) => document.createElement(tN);

var nS = 'http://www.w3.org/2000/svg';
$cENS = (tN) => document.createElementNS(nS, tN);

const pages = {
  home: "/",
  setBoard: "set-board",
  setPlayers: "set-players",
  play: "play",
  privacyPolicy: "privacy-policy"
};

const onAppStore = {
  packageName : "com.vishesh.dotbox",
  googlePlay: "http://play.google.com/store/apps/details?id="
}

const playStoreLink = `${onAppStore.googlePlay}${onAppStore.packageName}`;

console.log(playStoreLink);

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
    this.color = `hsl(${this.hue}, 70%, 70%)`;
    this.isAlgo = false;
    this.rank = 0;
    this.score = 0;
    this.avatar = "";
  }

  static getName(player) {
    return player.name ? player.name : `player${player.id}`;
  }
}

// window.onload => {
//   console.log(window);
// }

function setTabIndex() {
  document.querySelectorAll(".tab-index").forEach((tabIndexItem, index) => {
    tabIndexItem.tabIndex = index;

    tabIndexItem.addEventListener("keypress", event => {
      if (event.keyCode === 13) {
        tabIndexItem.dispatchEvent(new Event("click"));
      }
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