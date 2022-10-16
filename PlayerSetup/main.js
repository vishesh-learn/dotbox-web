//maxPlayers = (gameBoard.row - 1) * (gameBoard.col - 1);

window.onload = () => {
  const backButton = $("#backButton"), nextButton = $("#nextButton");
  const addPlayerB = $("#addb"), playerListUI = $("#playerList");

  setupPlayerListUI();

  $aEL(backButton, "click", () => window.location.href = "../GameBoardBuilder/index.html");

  $aEL(addPlayerB, "click", addPlayer);
  $aEL(playerListUI, "input", updatePlayer);
  $aEL(playerListUI, "keypress", goButtonHandler);
  $aEL(playerListUI, "click", removePlayer);
  $aEL(playerListUI, "focusin", scrollAbove);

  $aEL(nextButton, "click", () => window.location.href = "../Game/index.html")
}

function scrollAbove() {
  const target = event.target;

  if(target.className.includes("playerName")){
    const targetPlayer = target.parentElement;
    const targetPlayerIndex = getIndexOfDom(targetPlayer);

    $("#content").scrollTop = targetPlayer.clientHeight * (targetPlayerIndex - 2);
  }
}

function goButtonHandler() {
  if (event.key === "Enter") {
    console.log(event.target);
    event.target.blur();
  }
}

function addPlayer() {
  const playerListUI = $("#playerList"),
        player = new Player();
        playerUI = createPlayerUI(player);

  playerListUI.append(playerUI);

  playerList.push(player);

  updatePlayerCountView();

  savePlayerList();
}

function updatePlayerCountView(){
  const infoE = $("#info");
  var playerCount = playerList.length;

  infoE.innerHTML = playerCount == 1 ? playerCount + " player" : playerCount + " players";
}

function updatePlayer(){
  const target = event.target;

  if(target.className.includes("playerName")){
    var name = target.value;
    const targetPlayer = target.parentElement;
    const targetPlayerIndex = getIndexOfDom(targetPlayer);

    playerList[targetPlayerIndex].name = name;
  }

  if (target.className.includes("isAlgo")) {
    var isAlgo = target.checked;
    const targetPlayer = target.parentElement;
    const targetPlayerIndex = getIndexOfDom(targetPlayer);

    playerList[targetPlayerIndex].isAlgo = isAlgo;
  }

  savePlayerList();
}

function removePlayer(){
  const target = event.target;

  if(target.className.includes("removePlayerB")){
    const targetPlayer = target.parentElement;
    const targetPlayerIndex = getIndexOfDom(targetPlayer);

    playerList.splice(targetPlayerIndex, 1);

    targetPlayer.remove();

    updatePlayerCountView();

    savePlayerList();
  }
}

function getIndexOfDom(childDom){
  const parentDom = childDom.parentElement;

  return Array.prototype.indexOf.call(parentDom.children, childDom);
}

function setupPlayerListUI(){
  loadPlayerList();

  const playerListUI = $("#playerList");

  playerListUI.innerHTML = "";

  for(let player of playerList){
    playerListUI.append(createPlayerUI(player));
  }

  updatePlayerCountView();
}

function createPlayerUI(player){
  const playerUI = document.createElement("div");
  playerUI.classList = "player";

  const avatarUI = document.createElement("button");
  avatarUI.classList = "avatar";
  avatarUI.style.backgroundColor = player.color;
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
  removePlayerB.classList = "button removePlayerB";
  removePlayerB.innerHTML = "&#10005;";
  playerUI.append(removePlayerB);

  return playerUI;
}
