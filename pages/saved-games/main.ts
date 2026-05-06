onload = function () {
  document.querySelector("#backButton")
    .addEventListener("click", () => window.history.back());

  document.querySelector("#homeButton")
    .addEventListener("click", () => window.location.href = pages.index);

  setupGamesUI();

  keyOnTabIndex();
}

function updateCountUI() {
  document.querySelector("#info")
    .innerHTML = `${Game.games.length}<br /> game${Game.games.length == 1 ? "" : "s"}`;
}

async function setupGamesUI() {
  loadingStartUI();

  setTimeout(() => {
    const savedGamesUI = document.querySelector(".saved-games");

    savedGamesUI.innerHTML = "";

    Game.load();

    for (let game of Game.games) {
      savedGamesUI.append(game.listItemUI);
    }

    updateCountUI();

    loadingEndUI();
  }, 0);
}