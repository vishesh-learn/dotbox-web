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

  createColorBalls();

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

  document.querySelector('#colorSlider').addEventListener('input', colorRange_Input);

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

function createColorBalls() {
  const colorHueHtml = document.querySelector('.color-hue');

  let colorBall;
  for (let i = 0; i < 18; i++) {
    colorBall = document.createElement('button');
    colorBall.classList = "button avatar colorBall";
    colorBall.style.backgroundColor = hueToHex(i * 20);

    colorHueHtml.append(colorBall);
  }
}

function colorSelector(event) {
  if (event.target.className.includes("avatar")) {
    targetPlayerIndex = getIndexOfDom(event.target.parentElement);

    document.querySelector("body").classList.add("pop-up-container");

    let color = currGame.players[targetPlayerIndex].color;

    document.querySelector(".color-prev").style.backgroundColor = color;

    setupColorRange(toHslObject(color).h);
  }
}

function setupColorRange(h = 0) {
  const colorSlider = document.querySelector('#colorSlider');

  let min = h - 18, max = h + 18;

  colorSlider.min = min >= 0 ? min : 0;

  colorSlider.max = max < 360 ? max : 360;

  colorSlider.value = h;
}

function colorRange_Input(event) {
  let hex = hueToHex(event.target.value);

  currGame.players[targetPlayerIndex].color = hex;

  document.querySelector(".color-prev").style.backgroundColor = hex;

  saveCurrGame();
  setupplayersUI();
}

function selectColor(event) {
  if (event.target.className.includes("colorBall")) {

    var color = event.target.style.backgroundColor;

    currGame.players[targetPlayerIndex].color = color;

    document.querySelector(".color-prev").style.backgroundColor = color;

    setupColorRange(toHslObject(color).h);

    saveCurrGame();
    setupplayersUI();
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
  let h = toHslObject(player.color).h;
  isAlgo.style.filter = `hue-rotate(${h}deg)`;
  playerUI.append(isAlgo);

  const removePlayerB = document.createElement("button");
  removePlayerB.classList = "button removePlayerB";
  removePlayerB.innerHTML = "&#10005;";
  playerUI.append(removePlayerB);

  return playerUI;
}
