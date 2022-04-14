$ = (o) => document.querySelector(o);
$All = (o) => document.querySelectorAll(o);
$aEL = (o, e, f) => o.addEventListener(e, f);
$rEL = (o, e, f) => o.removeEventListener(e, f);
$cE = (tN) => document.createElement(tN);

var nS = 'http://www.w3.org/2000/svg';
$cENS = (tN) => document.createElementNS(nS, tN);

class Player {
  static playerList = [];

  constructor() {
    this.id = 0;
    this.name = "";
    this.color = "";
    this.isAlgo = false;
    this.rank = 0;
    this.score = 0;
    this.avatar = "";
  }
}

window.onload = () => {
  const backButton = $("#backButton"), nextButton = $("#nextButton");
  const addPlayerB = $("#addb"), playerListUI = $("#playerList");

  $aEL(backButton, "click", () => window.location.href = "../GameBoardBuilder/index.html");

  $aEL(addPlayerB, "click", addPlayer);

  $aEL(playerListUI, "click", removePlayer);
}

function addPlayer() {
  let player = new Player();
  Player.playerList.push(player);

  setupPlayerListUI();
}

function removePlayer(){
  const target = event.target;
  const players = $All(".player");

  if(target.className.includes("removePlayerB")){

    const targetPlayer = target.parentElement;
    
    for (let i = 0; i < players.length; i++) {
      if(players[i] == targetPlayer){
        Player.playerList.splice(i, 1);
      }
    }

    setupPlayerListUI();
  }
}

function setupPlayerListUI(){
  const playerListUI = $("#playerList");
  var playerUI;

  playerListUI.innerHTML = "";

  for(let player of Player.playerList){
    playerUI = createPlayerUI(player);

    playerListUI.append(playerUI);
  }
}

function createPlayerUI(player){
  const playerUI = document.createElement("div");
  playerUI.classList = "player";

  const avatarUI = document.createElement("button");
  avatarUI.classList = "avatar";
  playerUI.append(avatarUI);

  const playerName = document.createElement("input");
  playerName.classList = "playerName";
  playerName.placeholder = "player name here...";
  playerUI.append(playerName);

  const isAlgo = document.createElement("input");
  isAlgo.classList = "isAlgo";
  isAlgo.type = "checkbox";
  playerUI.append(isAlgo);

  const removePlayerB = document.createElement("button");
  removePlayerB.classList = "removePlayerB";
  playerUI.append(removePlayerB);

  return playerUI;
}
