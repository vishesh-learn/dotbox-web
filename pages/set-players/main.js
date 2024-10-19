var targetPlayerIndex = 0;

window.onload = function () {
  document.querySelector("#backButton")
    .addEventListener("click", () => window.location.href = `../${pages.setBoard}/${pages.indexPage}`);

  document.querySelector("#nextButton")
    .addEventListener("click", () => window.location.href = `../${pages.play}/${pages.indexPage}`);

  document.querySelector("#homeButton").addEventListener("click", goHome);

  createColorBalls();

  loadCurrGame();

  currGame.currPage = pages.setPlayers;

  saveCurrGame();

  setupPlayersUI();

  document.querySelector(".addb").addEventListener("click", addPlayer);

  const playersUI = document.querySelector(".players");

  playersUI.addEventListener("keypress", goButtonHandler);
  playersUI.addEventListener("click", colorSelector);
  playersUI.addEventListener("change", updatePlayer);
  playersUI.addEventListener("click", removePlayer);
  playersUI.addEventListener("focusin", scrollAbove);

  document.querySelector(".color-hue").addEventListener("click", selectColor);
  document.querySelector(".close-pop-up").addEventListener("click", closePopUP);

  document.querySelector('#colorSlider').addEventListener('input', colorRange_Input);

  keyOnTabIndex();
}

function playerUILoaded() {
  tooltip_init();
}

function tooltip_init() {
  ElementGuide.data = [
    new ElementGuide(".avatar", "Player Color", "Choose your player color!"),
    new ElementGuide(".playerName", "Player Name", "Type your name"),
    new ElementGuide(".isAlgo", "Autoplayer", "Enable Autoplayer (Let the robot play!)"),
    new ElementGuide(".removePlayerB", "Remove Player", "Remove this player"),
    new ElementGuide(".addb", "Add Player", "Add a new player to the game!"),
  ];

  document.querySelector("#guide").addEventListener("click", ElementGuide.nextState);

  document.querySelector(".page-bg").addEventListener("click", ElementGuide.nextState);
}

function goHome() {
  window.location.href = `../../${pages.indexPage}`;
}

function scrollAbove(event) {
  const target = event.target;

  if (target.className.includes("playerName")) {
    const targetPlayer = target.parentElement;
    const targetPlayerIndex = getIndexOfDom(targetPlayer);

    document.querySelector(".page-content")
      .scrollTop = targetPlayer.clientHeight * (targetPlayerIndex - 2);
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

    setupPlayersUI();
  }
}

function updatePlayerCountView() {
  document.querySelector("#info")
    .innerHTML = `${currGame.players.length}<br /> ${currGame.players.length == 1 ? "player" : "players"}`;
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
    setupPlayersUI();
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
    document.querySelector(".set-color").showModal();

    let color = currGame.players[targetPlayerIndex].color;

    document.documentElement.style.setProperty('--currentPlayerColor', color);

    setupColorRange(toHslObject(color).h);
  }
}

function closePopUP() {
  document.querySelector(".set-color").close();

  document.querySelector("body").classList.remove("pop-up-container");
}

function setupColorRange(h = 0) {
  const colorSlider = document.querySelector('#colorSlider');

  let min = h - 18, max = h + 18;

  colorSlider.min = min >= 0 ? min : 0;

  colorSlider.max = max < 360 ? max : 360;

  let minHex = hueToHex(colorSlider.min);
  let maxHex = hueToHex(colorSlider.max);

  document.documentElement.style.setProperty('--colorSliderMinHex', minHex);
  document.documentElement.style.setProperty('--colorSliderMaxHex', maxHex);

  colorSlider.value = h;
}

function colorRange_Input(event) {
  let hex = hueToHex(event.target.value);

  currGame.players[targetPlayerIndex].color = hex;

  document.documentElement.style.setProperty('--currentPlayerColor', hex);

  saveCurrGame();
  setupPlayersUI();
}

function selectColor(event) {
  if (event.target.className.includes("colorBall")) {

    var color = event.target.style.backgroundColor;

    currGame.players[targetPlayerIndex].color = color;

    document.documentElement.style.setProperty('--currentPlayerColor', color);

    setupColorRange(toHslObject(color).h);

    saveCurrGame();
    setupPlayersUI();
  }
}

function removePlayer(event) {
  const target = event.target;

  if (target.className.includes("removePlayerB")) {
    currGame.players.splice(getIndexOfDom(target.parentElement), 1);

    saveCurrGame();
    setupPlayersUI();
  }
}

function getIndexOfDom(childDom) {
  const parentDom = childDom.parentElement;

  return Array.prototype.indexOf.call(parentDom.children, childDom);
}

async function setupPlayersUI() {
  loadingStartUI();

  setTimeout(() => {
    const playersUI = document.querySelector(".players");

    playersUI.innerHTML = "";

    for (let player of currGame.players) {
      playersUI.append(createPlayerUI(player));
    }

    updatePlayerCountView();

    loadingEndUI();

    playerUILoaded();
  }, 0);
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

  playerUI.append(isAlgo);

  const removePlayerB = document.createElement("button");
  removePlayerB.classList = "button removePlayerB";
  removePlayerB.innerHTML = "&#10005;";
  playerUI.append(removePlayerB);

  return playerUI;
}
