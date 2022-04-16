$ = (o) => document.querySelector(o);
$All = (o) => document.querySelectorAll(o);
$aEL = (o, e, f) => o.addEventListener(e, f);
$rEL = (o, e, f) => o.removeEventListener(e, f);
$cE = (tN) => document.createElement(tN);

var nS = 'http://www.w3.org/2000/svg';
$cENS = (tN) => document.createElementNS(nS, tN);

class Player {
  static playerList = [];
  static minPlayer = 2;

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

  setupPlayerListUI();

  $aEL(backButton, "click", () => window.location.href = "../GameBoardBuilder/index.html");

  $aEL(addPlayerB, "click", addPlayer);
  $aEL(playerListUI, "input", updatePlayer);
  $aEL(playerListUI, "click", removePlayer);
}

function addPlayer() {
  const playerListUI = $("#playerList"),
        player = new Player();
        playerUI = createPlayerUI(player);

  playerListUI.append(playerUI);

  Player.playerList.push(player);

  savePlayerList();
}

function updatePlayer(){
  const target = event.target;

  if(target.className.includes("playerName")){
    var name = target.value;
    const targetPlayer = target.parentElement;
    const targetPlayerIndex = getIndexOfDom(targetPlayer);

    Player.playerList[targetPlayerIndex].name = name;
  }

  if (target.className.includes("isAlgo")) {
    var isAlgo = target.checked;
    const targetPlayer = target.parentElement;
    const targetPlayerIndex = getIndexOfDom(targetPlayer);

    Player.playerList[targetPlayerIndex].isAlgo = isAlgo;
  }

  savePlayerList();
}

function removePlayer(){
  const target = event.target;

  if(target.className.includes("removePlayerB")){
    const targetPlayer = target.parentElement;
    const targetPlayerIndex = getIndexOfDom(targetPlayer);

    Player.playerList.splice(targetPlayerIndex, 1);

    targetPlayer.remove();

    savePlayerList();
  }
}

function getIndexOfDom(childDom){
  const parentDom = childDom.parentElement;

  return Array.prototype.indexOf.call(parentDom.children, childDom);
}

function setupPlayerListUI(){
  loadPlayerList();

  while (Player.playerList.length < Player.minPlayer) {
    Player.playerList.push(new Player());
  }

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
  playerName.value = player.name;
  playerUI.append(playerName);

  const isAlgo = document.createElement("input");
  isAlgo.classList = "isAlgo";
  isAlgo.type = "checkbox";
  isAlgo.checked = player.isAlgo;
  playerUI.append(isAlgo);

  const removePlayerB = document.createElement("button");
  removePlayerB.classList = "removePlayerB";
  playerUI.append(removePlayerB);

  return playerUI;
}

function savePlayerList(){
  localStorage.playerList = JSON.stringify(Player.playerList);
}

function loadPlayerList(){
  if(localStorage.playerList != undefined){
    Player.playerList = JSON.parse(localStorage.playerList);
  }
}
