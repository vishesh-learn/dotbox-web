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
  static playerList = [];
  static minPlayer = 2;

  constructor() {
    this.id = 0;
    this.name = "";
    this.color = randomColor(Player.playerList);
    this.isAlgo = false;
    this.rank = 0;
    this.score = 0;
    this.avatar = "";
  }
}

function loadPlayerList(){
  if(localStorage.playerList != undefined){
    Player.playerList = JSON.parse(localStorage.playerList);

    assignID();
    savePlayerList();
  }

  while (Player.playerList.length < Player.minPlayer) {
    Player.playerList.push(new Player());
  }
}

function assignID(){
  for (var player of Player.playerList) {
    player.id = Player.playerList.indexOf(player);
  }
}

function savePlayerList(){
  assignID();
  localStorage.playerList = JSON.stringify(Player.playerList);
}

window.onload = () => {
  document.getElementById("startButton").addEventListener("click", () => window.location.href = "GameBoardBuilder/index.html");
}
