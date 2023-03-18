var targetPlayerIndex = 0;

window.onload = () => {
  const backButton = $("#backButton"), nextButton = $("#nextButton");
  const addPlayerB = $(".addb"), playerListUI = $(".playerList");
  const colorHueUI = $(".color-hue");
  const popUpBgUI = $(".pop-up-bg");
  const closePopUPUI = $(".close-pop-up");

  loadGameAndPlayerList();

  setupPlayerListUI();

  $aEL(backButton, "click", () => window.location.href = `../${pages.setBoard}`);

  $aEL(addPlayerB, "click", addPlayer);

  $aEL(playerListUI, "keypress", goButtonHandler);
  $aEL(playerListUI, "click", colorSelector);
  $aEL(playerListUI, "change", updatePlayer);
  $aEL(playerListUI, "click", removePlayer);
  $aEL(playerListUI, "focusin", scrollAbove);

  $aEL(colorHueUI, "click", selectColor);
  $aEL(popUpBgUI, "click", closePopUP);
  $aEL(closePopUPUI, "click", closePopUP);

  $aEL(nextButton, "click", () => window.location.href = `../${pages.play}`);

  keyOnTabIndex();
}

function closePopUP() {
  $("body").classList.remove("pop-up-container");
}

function scrollAbove(event) {
  const target = event.target;

  if (target.className.includes("playerName")) {
    const targetPlayer = target.parentElement;
    const targetPlayerIndex = getIndexOfDom(targetPlayer);

    $(".page-content").scrollTop = targetPlayer.clientHeight * (targetPlayerIndex - 2);
  }
}

function goButtonHandler(event) {
  if (event.key === "Enter") {
    console.log(event.target);
    event.target.blur();
  }
}

function addPlayer() {
  if (playerList.length < game.maxPlayer) {
    playerList.push(new Player());

    savePlayerList();

    setupPlayerListUI();
  }
}

function updatePlayerCountView() {
  const infoE = $("#info");
  var playerCount = playerList.length;

  infoE.innerHTML = playerCount == 1 ? playerCount + " player" : playerCount + " players";

  assignID();
}

function updatePlayer(event) {
  const target = event.target;

  if (
    target.className.includes("playerName")
    || target.className.includes("isAlgo")
  ) {
    const targetPlayerIndex = getIndexOfDom(target.parentElement);

    if (target.className.includes("playerName")) {
      var name = target.value;
      playerList[targetPlayerIndex].name = name;
    }

    if (target.className.includes("isAlgo")) {
      var isAlgo = target.checked;
      playerList[targetPlayerIndex].isAlgo = isAlgo;
    }

    savePlayerList();
    setupPlayerListUI();
  }
}

function colorSelector(event) {
  const target = event.target,
    colorPrevHTML = document.querySelector(".color-prev");

  if (target.className.includes("avatar")) {
    targetPlayerIndex = getIndexOfDom(target.parentElement);
    $("body").classList.add("pop-up-container");
    colorPrevHTML.style.backgroundColor = playerList[targetPlayerIndex].color;
  }
}

function selectColor(event) {
  const targetColorBallUI = event.target;
  if (targetColorBallUI.className.includes("colorBall")) {

    var color = targetColorBallUI.style.backgroundColor;

    playerList[targetPlayerIndex].color = color;

    savePlayerList();
    setupPlayerListUI();

    closePopUP();
  }
}

function removePlayer(event) {
  const target = event.target;

  if (target.className.includes("removePlayerB")) {
    playerList.splice(getIndexOfDom(target.parentElement), 1);

    savePlayerList();
    setupPlayerListUI();
  }
}

function getIndexOfDom(childDom) {
  const parentDom = childDom.parentElement;

  return Array.prototype.indexOf.call(parentDom.children, childDom);
}

function setupPlayerListUI() {
  const playerListUI = $(".playerList");

  playerListUI.innerHTML = "";

  for (let player of playerList) {
    playerListUI.append(createPlayerUI(player));
  }

  updatePlayerCountView();
}

function createPlayerUI(player) {
  const playerUI = document.createElement("div");
  playerUI.classList = "player";

  const avatarUI = document.createElement("button");
  avatarUI.classList = "avatar button";
  avatarUI.style.backgroundColor = player.color;
  playerUI.append(avatarUI);

  const playerName = document.createElement("input");
  playerName.classList = "playerName";
  playerName.maxLength = 30;
  playerName.placeholder = `player${player.id}`;
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
