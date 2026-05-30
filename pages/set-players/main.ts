var targetPlayerIndex = 0;

onload = function () {
  document.querySelector("#backButton")
    .addEventListener("click", () => window.history.back());

  document.querySelector("#nextButton")
    .addEventListener("click", () => window.location.href = pages.play);

  document.querySelector("#homeButton").addEventListener("click", goHome);

  const playersUI = document.querySelector(".players");
  playersUI.addEventListener("keypress", goButtonHandler);
  playersUI.addEventListener("click", colorSelector);
  playersUI.addEventListener("change", updatePlayer);
  playersUI.addEventListener("click", removePlayer);
  playersUI.addEventListener("focusin", scrollAbove);

  document.querySelector(".color-hue").addEventListener("click", selectColor);
  document.querySelector(".close-pop-up").addEventListener("click", closePopUP);

  document.querySelector('#colorSlider').addEventListener('input', colorRange_Input);

  playerColorEditor_init();

  setCurrentPageInCurrentGame();

  document.querySelector(".addb").addEventListener("click", addPlayer);

  setupPlayersUI();

  keyOnTabIndex();
}

function setCurrentPageInCurrentGame() {
  Game.load();

  Game.currentGame.currPage = "setPlayers";

  Game.currentGame.save();
}

function playerColorEditor_init() {
  createColorBalls();
}

function playerUILoaded() {
  setPlayer_tooltip_init();
}

function setPlayer_tooltip_init() {
  ElementGuide.data = [
    new ElementGuide(".avatar", "Player Color", "Choose your player color!"),
    new ElementGuide(".playerName", "Player Name", "Type your name"),
    new ElementGuide(".isAlgo", "Autoplayer", "Enable Autoplayer (Let the robot play!)"),
    new ElementGuide(".removePlayerB", "Remove Player", "Remove this player"),
    new ElementGuide(".addb", "Add Player", "Add a new player to the game!"),
  ];

  document.querySelector("#guide").addEventListener("click", ElementGuide.nextState);

  document.querySelector(".page-bg").addEventListener("click", ElementGuide.nextState);

  const tooltipPlayedKey = "tooltip played once for player selector";
  if (!localStorage.getItem(tooltipPlayedKey)) {
    ElementGuide.nextState();

    localStorage.setItem(tooltipPlayedKey, 'true');
  }
}

function goHome() {
  window.location.href = pages.index;
}

function scrollAbove(event) {
  const target = event.target;

  const playerElements = document.querySelectorAll(".player");

  if (target.className.includes("playerName")) {
    const targetPlayer = target.parentElement;
    const targetPlayerIndex = Array.from(playerElements).indexOf(targetPlayer);

    document.querySelector(".page-content")
      .scrollTop = targetPlayer.clientHeight * (targetPlayerIndex - 2);
  }
}

function goButtonHandler(event) {
  if (event.keyCode === 13 && event.target.type === "text") {
    console.log("blur", event.target);

    event.target.blur();
  }
}

function updatePlayerCountView() {
  document.querySelector("#info")
    .innerHTML = `${Game.currentGame.players.length}<br /> ${Game.currentGame.players.length == 1 ? "player" : "players"}`;
}

function updatePlayer(event) {
  const target = event.target;
  const playerElements = document.querySelectorAll(".player");

  if (target.className.includes("playerName") || target.className.includes("isAlgo")) {
    const targetPlayerIndex = Array.from(playerElements).indexOf(target.parentElement);

    if (target.className.includes("playerName")) {
      var name = target.value;

      Game.currentGame.players[targetPlayerIndex].name = name;
    }

    if (target.className.includes("isAlgo")) {
      var isAlgo = target.checked;

      Game.currentGame.players[targetPlayerIndex].isAlgo = isAlgo;
    }

    Game.currentGame.save();
  }
}

function createColorBalls() {
  const colorHueHtml = document.querySelector('.color-hue');

  let colorBall;
  for (let i = 0; i < 18; i++) {
    colorBall = document.createElement('button');
    colorBall.classList = "button avatar colorBall";

    const color = hueToHex(i * 20 + 10);

    colorBall.dataset.color = color;

    colorBall.style.background = toRadialGradientCSSValue(color) || color;

    colorHueHtml.append(colorBall);
  }
}

function colorSelector(event) {
  const playerElements = document.querySelectorAll(".player");

  if (event.target.className.includes("avatar")) {
    targetPlayerIndex = Array.from(playerElements).indexOf(event.target.parentElement);

    document.querySelector("body").classList.add("pop-up-container");
    (document.querySelector(".set-color") as HTMLDialogElement).showModal();

    let color = Game.currentGame.players[targetPlayerIndex].color;

    document.documentElement.style.setProperty('--currentPlayerColor', toRadialGradientCSSValue(color) || color);

    setupColorRange(toHslObject(color).h);
  }
}

function closePopUP() {
  (document.querySelector(".set-color") as HTMLDialogElement).close();

  document.querySelector("body").classList.remove("pop-up-container");
}

function setupColorRange(h = 0) {
  const colorSlider = document.querySelector('#colorSlider') as HTMLInputElement;

  let min = h - 10, max = h + 10;

  colorSlider.min = String(min >= 0 ? min : 0);

  colorSlider.max = String(max < 360 ? max : 360);

  let minHex = hueToHex(colorSlider.min);
  let maxHex = hueToHex(colorSlider.max);

  document.documentElement.style.setProperty('--colorSliderMinHex', minHex);
  document.documentElement.style.setProperty('--colorSliderMaxHex', maxHex);

  colorSlider.value = String(h);
}

function colorRange_Input(event) {
  let hex = hueToHex(event.target.value);

  Game.currentGame.players[targetPlayerIndex].color = hex;

  document.documentElement.style.setProperty('--currentPlayerColor', toRadialGradientCSSValue(hex));

  Game.currentGame.save();

  const playerElements = document.querySelectorAll(".player");
  const targetPlayer = playerElements[targetPlayerIndex];

  (targetPlayer.querySelector(".avatar") as HTMLElement).style.backgroundColor = hex;
}

function selectColor(event) {
  const playerElements = document.querySelectorAll(".player");
  const targetPlayer = playerElements[targetPlayerIndex];

  if (event.target.className.includes("colorBall")) {
    console.log(event.target);
    var color = event.target.dataset.color;

    Game.currentGame.players[targetPlayerIndex].color = color;

    document.documentElement.style.setProperty('--currentPlayerColor', toRadialGradientCSSValue(color));

    setupColorRange(toHslObject(color).h);

    Game.currentGame.save();

    (targetPlayer.querySelector(".avatar") as HTMLElement).style.background = toRadialGradientCSSValue(color);
  }
}

function removePlayer(event) {
  const target = event.target;
  const targetPlayer = target.parentElement;

  const playerElements = document.querySelectorAll(".player");

  if (target.className.includes("removePlayerB")) {
    const targetPlayerIndex = Array.from(playerElements).indexOf(targetPlayer);

    Game.currentGame.players.splice(targetPlayerIndex, 1);

    Game.currentGame.save();

    targetPlayer.remove();
  }
}

async function setupPlayersUI() {
  loadingStartUI();

  setTimeout(() => {
    const playersUI = document.querySelector(".players");

    playersUI.innerHTML = "";

    for (let player of Game.currentGame.players) {
      playersUI.append(createPlayer_listItemUI(player));
    }

    updatePlayerCountView();

    loadingEndUI();

    playerUILoaded();
  }, 0);
}

function addPlayer() {
  if (Game.currentGame.players.length < Game.currentGame.maxPlayer) {
    const player = new Player();

    player.id = Game.currentGame.players.length + 1;

    Game.currentGame.players.push(player);

    Game.currentGame.save();

    const playersUI = document.querySelector(".players");
    playersUI.append(createPlayer_listItemUI(player));

    updatePlayerCountView();
  }
}

function createPlayer_listItemUI(player) {
  const playerUI = document.createElement("div");
  playerUI.classList = "player";

  const avatarUI = document.createElement("button");
  avatarUI.classList = "avatar button";
  avatarUI.style.background = toRadialGradientCSSValue(player.color) || player.color;
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
  keyOnElement(isAlgo);

  playerUI.append(isAlgo);

  const removePlayerB = document.createElement("button");
  removePlayerB.classList = "button removePlayerB";
  removePlayerB.innerHTML = "&#10005;";
  playerUI.append(removePlayerB);

  return playerUI;
}