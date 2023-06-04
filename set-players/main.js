var targetPlayerIndex = 0;

window.onload = () => {
  const backButton = document.querySelector("#backButton"), nextButton = document.querySelector("#nextButton");
  $aEL(backButton, "click", () => window.location.href = `../${pages.setBoard}`);
  $aEL(nextButton, "click", () => window.location.href = `../${pages.play}`);
  
  const addPlayerB = document.querySelector(".addb"), playerListUI = document.querySelector(".playerList");
  const colorHueUI = document.querySelector(".color-hue");
  const popUpBgUI = document.querySelector(".pop-up-bg");
  const closePopUPUI = document.querySelector(".close-pop-up");

  loadCurrGame();
  
  playerList();

  setupPlayerListUI();

  $aEL(addPlayerB, "click", addPlayer);

  $aEL(playerListUI, "keypress", goButtonHandler);
  $aEL(playerListUI, "click", colorSelector);
  $aEL(playerListUI, "change", updatePlayer);
  $aEL(playerListUI, "click", removePlayer);
  $aEL(playerListUI, "focusin", scrollAbove);

  $aEL(colorHueUI, "click", selectColor);
  $aEL(popUpBgUI, "click", closePopUP);
  $aEL(closePopUPUI, "click", closePopUP);

  keyOnTabIndex();
}

function closePopUP() {
  document.querySelector("body").classList.remove("pop-up-container");
}

function scrollAbove(event) {
  const target = event.target;

  if (target.className.includes("playerName")) {
    const targetPlayer = target.parentElement;
    const targetPlayerIndex = getIndexOfDom(targetPlayer);

    document.querySelector(".page-content").scrollTop = targetPlayer.clientHeight * (targetPlayerIndex - 2);
  }
}

function goButtonHandler(event) {
  if (event.key === "Enter") {
    console.log(event.target);
    event.target.blur();
  }
}

function addPlayer() {
  if (currGame.playerList.length < currGame.maxPlayer) {
    currGame.playerList.push(new Player());

    saveCurrGame();

    setupPlayerListUI();
  }
}

function updatePlayerCountView() {
  const infoE = document.querySelector("#info");
  var playerCount = currGame.playerList.length;

  infoE.innerHTML = playerCount == 1 ? playerCount + " player" : playerCount + " players";
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
      currGame.playerList[targetPlayerIndex].name = name;
    }

    if (target.className.includes("isAlgo")) {
      var isAlgo = target.checked;
      currGame.playerList[targetPlayerIndex].isAlgo = isAlgo;
    }

    saveCurrGame();
    setupPlayerListUI();
  }
}

function colorSelector(event) {
  const target = event.target,
    colorPrevHTML = document.querySelector(".color-prev");

  if (target.className.includes("avatar")) {
    targetPlayerIndex = getIndexOfDom(target.parentElement);
    document.querySelector("body").classList.add("pop-up-container");
    colorPrevHTML.style.backgroundColor = currGame.playerList[targetPlayerIndex].color;
  }
}

function selectColor(event) {
  const targetColorBallUI = event.target;
  if (targetColorBallUI.className.includes("colorBall")) {

    var color = targetColorBallUI.style.backgroundColor;

    currGame.playerList[targetPlayerIndex].color = color;

    saveCurrGame();
    setupPlayerListUI();

    closePopUP();
  }
}

function removePlayer(event) {
  const target = event.target;

  if (target.className.includes("removePlayerB")) {
    currGame.playerList.splice(getIndexOfDom(target.parentElement), 1);

    saveCurrGame();
    setupPlayerListUI();
  }
}

function getIndexOfDom(childDom) {
  const parentDom = childDom.parentElement;

  return Array.prototype.indexOf.call(parentDom.children, childDom);
}

function setupPlayerListUI() {
  const playerListUI = document.querySelector(".playerList");

  playerListUI.innerHTML = "";

  for (let player of currGame.playerList) {
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
  playerName.placeholder = player.placeholderName;
  playerName.value = player.name;
  playerUI.append(playerName);

  const isAlgo = document.createElement("input");
  isAlgo.classList = "isAlgo button";
  isAlgo.type = "checkbox";
  isAlgo.checked = player.isAlgo;
  let h = hexToHslObject(player.color).h;
  isAlgo.style.filter = `hue-rotate(${h}deg)`;
  playerUI.append(isAlgo);

  const removePlayerB = document.createElement("button");
  removePlayerB.classList = "button removePlayerB";
  removePlayerB.innerHTML = "&#10005;";
  playerUI.append(removePlayerB);

  return playerUI;
}
