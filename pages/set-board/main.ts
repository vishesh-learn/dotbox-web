window.onload = () => {
  const gameBoardSVG = document.querySelector(".svgC");
  const nextButton = document.querySelector("#nextButton");

  document.querySelector("#homeButton").addEventListener("click", goHome);

  document.querySelector("#backButton")
    .addEventListener("click", () => window.history.back());

  Game.load();

  Game.currentGame.currPage = pages.setBoard;

  setupGameBoard();

  addEventListener("resize", setupGameBoard);

  gameBoardSVG.addEventListener("pointerdown", pointerHandler);
  gameBoardSVG.addEventListener("pointerup",
    () => {
      gameBoardSVG.removeEventListener("pointermove", pointerHandler);
    }
  );

  gameBoardSVG.addEventListener('keydown', keyHandler);

  nextButton.addEventListener("click", goNext);

  keyOnTabIndex();
}

function goHome() {
  window.location.href = pages.index;
}

function goNext() {
  window.location.href = pages.setPlayers;
}

function setupGameBoard() {
  loadingStartUI();

  setTimeout(() => {
    startupVariables();
    GameBoardBuilder();
    optedCnR();

    gameBoardOverFlow();

    loadingEndUI();
  }, 0);
}

function startupVariables() {
  let dotRadius = getDotRadius();

  let boardSize = getComputedSize(document.querySelector(".svgC"));

  let scrollbarSize = getScrollbarSize();

  var drawableWidth = boardSize.width - (dotRadius * 2) - scrollbarSize;

  var drawableHeight = boardSize.height - (dotRadius * 2) - scrollbarSize;

  Game.currentGame.gameBoard.maxCol = length_to_dotCount(drawableWidth);

  if (Game.currentGame.gameBoard.maxCol <= Game.currentGame.gameBoard.minCol) {
    Game.currentGame.gameBoard.maxCol = Game.currentGame.gameBoard.minCol;
  }

  Game.currentGame.gameBoard.maxRow = length_to_dotCount(drawableHeight);

  if (Game.currentGame.gameBoard.maxRow <= Game.currentGame.gameBoard.minRow) {
    Game.currentGame.gameBoard.maxRow = Game.currentGame.gameBoard.minRow;
  }

  let width = dotCount_to_length(Game.currentGame.gameBoard.maxCol);
  let height = dotCount_to_length(Game.currentGame.gameBoard.maxRow);

  document.documentElement.style.setProperty('--svgWidth', `${width}px`);
  document.documentElement.style.setProperty('--svgHeight', `${height}px`);
}

function gameBoardOverFlow() {
  let pageContentSize = getComputedSize(document.querySelector(".page-content"));
  let boardSize = getComputedSize(document.querySelector(".svgC"));

  if (boardSize.width > pageContentSize.width) {
    document.documentElement.style.setProperty('--align-x-board', `flex-start`);
  } else {
    document.documentElement.style.setProperty('--align-x-board', `center`);
  }

  if (boardSize.height > pageContentSize.height) {
    document.documentElement.style.setProperty('--align-y-board', `flex-start`);
  } else {
    document.documentElement.style.setProperty('--align-y-board', `space-evenly`);
  }
}

function svgResize() {
  var gameBoardSVG = document.querySelector(".svgC");
  let dotRadius = getDotRadius();

  var width = ((Game.currentGame.gameBoard.maxCol - 1) * Game.currentGame.gameBoard.gap) + dotRadius;
  var height = ((Game.currentGame.gameBoard.maxRow - 1) * Game.currentGame.gameBoard.gap) + dotRadius;

  (gameBoardSVG as HTMLElement).style.width = width + "px";
  (gameBoardSVG as HTMLElement).style.height = height + "px";
}

function GameBoardBuilder() {
  document.querySelectorAll("circle").forEach(dot => dot.remove());

  let dotRadius = getDotRadius();

  for (let i = 0; i < Game.currentGame.gameBoard.maxRow; i++) {
    for (let j = 0; j < Game.currentGame.gameBoard.maxCol; j++) {
      var x = (Game.currentGame.gameBoard.gap * j + dotRadius).toString(10);
      var y = (Game.currentGame.gameBoard.gap * i + dotRadius).toString(10);

      let dot = document.createElementNS('http://www.w3.org/2000/svg', "circle");
      dot.setAttribute("class", "dot hidden");

      dot.setAttribute("r", "7");
      dot.setAttribute("cx", x);
      dot.setAttribute("cy", y);

      document.querySelector(".svgC svg").appendChild(dot);
    }
  }
}

function pointerHandler(event) {
  var pointX = event.offsetX;
  var pointY = event.offsetY;

  var nearDot = nearestDot(pointX, pointY);

  optedDot(nearDot);

  document.querySelector(".svgC")
    .addEventListener("pointermove", pointerHandler);
}

function keyHandler(event) {
  switch (event.keyCode) {
    case 13:
      dotNavigate(event, "enter");
      break;

    case 37:
      dotNavigate(event, "left");
      break;

    case 38:
      dotNavigate(event, "top");
      break;

    case 39:
      dotNavigate(event, "right");
      break;

    case 40:
      dotNavigate(event, "bottom");
      break;

    default:
      break;
  }
}

function dotNavigate(event, direction) {
  if (!event.target.classList.contains("svgC")) {
    console.log("dotNavigate -> not svgC");

    return false;
  }

  switch (direction) {
    case "top":
      Game.currentGame.gameBoard.row--;
      break;

    case "right":
      Game.currentGame.gameBoard.col++;
      break;

    case "bottom":
      Game.currentGame.gameBoard.row++;
      break;

    case "left":
      Game.currentGame.gameBoard.col--;
      break;

    case "enter":
      goNext();
      break;

    default:
      console.log('dotNavigate -> default direction');
      break;
  }

  optedCnR();
}

function optedDot(dot) {
  if (dot.tagName != "circle") {
    return false;
  }

  var optedX = dot.cx.baseVal.value;
  var optedY = dot.cy.baseVal.value;

  Game.currentGame.gameBoard.col = length_to_dotCount(optedX);
  Game.currentGame.gameBoard.row = length_to_dotCount(optedY);

  optedCnR();
}

function optedCnR() {
  if (Game.currentGame.gameBoard.col > Game.currentGame.gameBoard.maxCol) {
    Game.currentGame.gameBoard.col = Game.currentGame.gameBoard.maxCol;
  } else if (Game.currentGame.gameBoard.col < Game.currentGame.gameBoard.minCol) {
    Game.currentGame.gameBoard.col = Game.currentGame.gameBoard.minCol;
  }

  if (Game.currentGame.gameBoard.row > Game.currentGame.gameBoard.maxRow) {
    Game.currentGame.gameBoard.row = Game.currentGame.gameBoard.maxRow;
  } else if (Game.currentGame.gameBoard.row < Game.currentGame.gameBoard.minRow) {
    Game.currentGame.gameBoard.row = Game.currentGame.gameBoard.minRow;
  }

  var x = dotCount_to_length(Game.currentGame.gameBoard.col);
  var y = dotCount_to_length(Game.currentGame.gameBoard.row);

  optedXnY(x, y);
}

function optedXnY(x, y) {
  var dotEs = document.querySelectorAll(".dot");
  const infoE = document.querySelector("#info");

  if (x && y) {
    infoE.innerHTML = Game.currentGame.gameBoard.col + " x " + Game.currentGame.gameBoard.row;

    for (var dotE of dotEs) {
      let cx = (dotE as SVGCircleElement).cx.baseVal.value;
      let cy = (dotE as SVGCircleElement).cy.baseVal.value;

      if (cx <= x && cy <= y) {
        dotE.classList.remove("hidden");
      }
      else {
        dotE.classList.add("hidden");
      }
    }

    Game.currentGame.save();
  } else {
    console.log("invalid x or y");
  }
}

function nearestDot(x, y) {
  var dotEs = document.querySelectorAll(".dot");

  var nearDot = dotEs[0];

  for (var i = 1; i < dotEs.length; i++) {
    let dotE = dotEs[i];

    let cx = (dotE as SVGCircleElement).cx.baseVal.value;
    let cy = (dotE as SVGCircleElement).cy.baseVal.value;

    let oldcx = (nearDot as SVGCircleElement).cx.baseVal.value;
    let oldcy = (nearDot as SVGCircleElement).cy.baseVal.value;

    let xcx = Math.abs(x - cx);
    let ycy = Math.abs(y - cy);

    let oldxcx = Math.abs(x - oldcx);
    let oldycy = Math.abs(y - oldcy);

    if ((xcx <= oldxcx) && ycy <= oldycy) {
      nearDot = dotE;
    }
  }

  return nearDot;
}

function dotCount_to_length(dotCount) {
  let dotRadius = getDotRadius();

  return (dotCount * Game.currentGame.gameBoard.gap) - Game.currentGame.gameBoard.gap + dotRadius * 2;
}
