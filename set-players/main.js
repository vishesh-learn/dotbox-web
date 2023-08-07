var targetPlayerIndex = 0;

window.onload = () => {
  const backButton = document.querySelector("#backButton"), nextButton = document.querySelector("#nextButton");
  $aEL(backButton, "click", () => window.location.href = `../${pages.setBoard}/${pages.indexPage}`);
  $aEL(nextButton, "click", () => window.location.href = `../${pages.play}/${pages.indexPage}`);
  
  const addPlayerB = document.querySelector(".addb"), playersUI = document.querySelector(".players");
  const colorHueUI = document.querySelector(".color-hue");
  const popUpBgUI = document.querySelector(".pop-up-bg");
  const closePopUPUI = document.querySelector(".close-pop-up");

  document.querySelector("#homeButton").addEventListener("click", goHome);

  loadCurrGame();

  currGame.currPage = pages.setPlayers;

  saveCurrGame();

  setupplayersUI();

  $aEL(addPlayerB, "click", addPlayer);

  $aEL(playersUI, "keypress", goButtonHandler);
  $aEL(playersUI, "click", colorSelector);
  $aEL(playersUI, "change", updatePlayer);
  $aEL(playersUI, "click", removePlayer);
  $aEL(playersUI, "focusin", scrollAbove);

  $aEL(colorHueUI, "click", selectColor);
  $aEL(popUpBgUI, "click", closePopUP);
  $aEL(closePopUPUI, "click", closePopUP);

  keyOnTabIndex();
}

function goHome() {
    window.location.href = `../${pages.indexPage}`;
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
  if (currGame.players.length < currGame.maxPlayer) {
    currGame.players.push(new Player());

    saveCurrGame();

    setupplayersUI();
  }
}

function updatePlayerCountView() {
  const infoE = document.querySelector("#info");
  var playerCount = currGame.players.length;

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
      currGame.players[targetPlayerIndex].name = name;
    }

    if (target.className.includes("isAlgo")) {
      var isAlgo = target.checked;
      currGame.players[targetPlayerIndex].isAlgo = isAlgo;
    }

    saveCurrGame();
    setupplayersUI();
  }
}

function colorSelector(event) {
  const target = event.target,
    colorPrevHTML = document.querySelector(".color-prev");

  if (target.className.includes("avatar")) {
    targetPlayerIndex = getIndexOfDom(target.parentElement);
    document.querySelector("body").classList.add("pop-up-container");
    colorPrevHTML.style.backgroundColor = currGame.players[targetPlayerIndex].color;
  }
}

function selectColor(event) {
  const targetColorBallUI = event.target;
  if (targetColorBallUI.className.includes("colorBall")) {

    var color = targetColorBallUI.style.backgroundColor;

    currGame.players[targetPlayerIndex].color = color;

    saveCurrGame();
    setupplayersUI();

    closePopUP();
  }
}

function removePlayer(event) {
  const target = event.target;

  if (target.className.includes("removePlayerB")) {
    currGame.players.splice(getIndexOfDom(target.parentElement), 1);

    saveCurrGame();
    setupplayersUI();
  }
}

function getIndexOfDom(childDom) {
  const parentDom = childDom.parentElement;

  return Array.prototype.indexOf.call(parentDom.children, childDom);
}

function setupplayersUI() {
  const playersUI = document.querySelector(".players");

  playersUI.innerHTML = "";

  for (let player of currGame.players) {
    playersUI.append(createPlayerUI(player));
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
