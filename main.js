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
    this.id = 0;
    this.name = "";
    this.color = randomColor(playerList);
    this.isAlgo = false;
    this.rank = 0;
    this.score = 0;
    this.avatar = "";
  }
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

    assignID();
    savePlayerList();
  }

  while (playerList.length < Player.minPlayer) {
    playerList.push(new Player());
  }
}

function assignID(){
  for (var player of playerList) {
    player.id = playerList.indexOf(player);
  }
}

function savePlayerList(){
  assignID();
  localStorage.playerList = JSON.stringify(playerList);
}

window.onload = () => {
  document.getElementById("startButton").addEventListener("click", () => window.location.href = "GameBoardBuilder/index.html");
}

//window.onerror = (message, source, lineno, colno, error) => {$("pre").innerHTML = lineno + ": " + message + "\nat col: " + colno;}
