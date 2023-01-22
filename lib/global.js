$ = (o) => document.querySelector(o);
$All = (o) => document.querySelectorAll(o);
$aEL = (o, e, f, b) => o.addEventListener(e, f, b);
$rEL = (o, e, f) => o.removeEventListener(e, f);
$cE = (tN) => document.createElement(tN);

var nS = 'http://www.w3.org/2000/svg';
$cENS = (tN) => document.createElementNS(nS, tN);

var gameBoard = {}, playerList = [];

var game = {
  minPlayer: 2,
  maxPlayer: 2
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
    this.id = 1;
    this.name = "";
    this.color = randomColor(playerList);
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