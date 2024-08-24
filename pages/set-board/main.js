window.onload = () => {
  const gameBoardSVG = document.querySelector(".svgC svg")
  const nextButton = document.querySelector("#nextButton");

  document.querySelector("#homeButton").addEventListener("click", goHome);

  document.querySelector("#backButton").addEventListener("click", goBack);

  loadCurrGame();

  currGame.currPage = pages.setBoard;

  setupGameBoard();

  addEventListener("resize", setupGameBoard);

  gameBoardSVG.addEventListener("pointerdown", pointerHandler);
  gameBoardSVG.addEventListener("pointerup",
    () => gameBoardSVG.removeEventListener("pointermove", pointerHandler)
  );

  gameBoardSVG.addEventListener('keypress', keyHandler);

  $aEL(nextButton, "click", () => window.location.href = `../${pages.setPlayers}/${pages.indexPage}`);

  keyOnTabIndex();
}

function goHome() {
  window.location.href = `../../${pages.indexPage}`;
}

function goBack() {
  window.location.href = `../../${pages.indexPage}`;
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

  console.log(boardSize);

  let scrollbarSize = getScrollbarSize();

  var drawableWidth = boardSize.width - (dotRadius * 2) - scrollbarSize;

  var drawableHeight = boardSize.height - (dotRadius * 2) - scrollbarSize;

  currGame.gameBoard.maxCol = length_to_dotCount(drawableWidth);

  if (currGame.gameBoard.maxCol <= currGame.gameBoard.minCol) {
    currGame.gameBoard.maxCol = currGame.gameBoard.minCol;
  }

  currGame.gameBoard.maxRow = length_to_dotCount(drawableHeight);

  if (currGame.gameBoard.maxRow <= currGame.gameBoard.minRow) {
    currGame.gameBoard.maxRow = currGame.gameBoard.minRow;
  }

  let width = dotCount_to_length(currGame.gameBoard.maxCol);
  let height = dotCount_to_length(currGame.gameBoard.maxRow);

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

  var width = ((currGame.gameBoard.maxCol - 1) * currGame.gameBoard.gap) + dotRadius;
  var height = ((currGame.gameBoard.maxRow - 1) * currGame.gameBoard.gap) + dotRadius;

  gameBoardSVG.style.width = width + "px";
  gameBoardSVG.style.height = height + "px";
}

function GameBoardBuilder() {
  document.querySelectorAll("circle").forEach(dot => dot.remove());

  let dotRadius = getDotRadius();

  for (let i = 0; i < currGame.gameBoard.maxRow; i++) {
    for (let j = 0; j < currGame.gameBoard.maxCol; j++) {
      var x = (currGame.gameBoard.gap * j + dotRadius).toString(10);
      var y = (currGame.gameBoard.gap * i + dotRadius).toString(10);

      let dot = document.createElementNS('http://www.w3.org/2000/svg', "circle");
      dot.setAttribute("class", "dot hidden");

      dot.setAttribute("r", "7");
      dot.setAttribute("cx", x);
      dot.setAttribute("cy", y);

      dot.setAttribute('tabindex', 0);

      document.querySelector(".svgC svg").appendChild(dot);
    }
  }
}

function pointerHandler(event) {
  var pointX = event.offsetX;
  var pointY = event.offsetY;

  var nearDot = nearestDot(pointX, pointY);

  optedDot(nearDot);

  document.querySelector(".svgC svg")
    .addEventListener("pointermove", pointerHandler);
}

function keyHandler(event) {
  if (event.keyCode === 13) {
    optedDot(event.target);
  }
  //more functions on different key codes...
}

function optedDot(dot) {
  if (dot.tagName != "circle") {
    return false;
  }

  var optedX = dot.cx.baseVal.value;
  var optedY = dot.cy.baseVal.value;

  currGame.gameBoard.col = length_to_dotCount(optedX, currGame.gameBoard.gap);
  currGame.gameBoard.row = length_to_dotCount(optedY, currGame.gameBoard.gap);

  optedCnR();
}

function optedCnR() {
  if (currGame.gameBoard.col > currGame.gameBoard.maxCol) {
    currGame.gameBoard.col = currGame.gameBoard.maxCol;
  } else if (currGame.gameBoard.col < currGame.gameBoard.minCol) {
    currGame.gameBoard.col = currGame.gameBoard.minCol;
  }

  if (currGame.gameBoard.row > currGame.gameBoard.maxRow) {
    currGame.gameBoard.row = currGame.gameBoard.maxRow;
  } else if (currGame.gameBoard.row < currGame.gameBoard.minRow) {
    currGame.gameBoard.row = currGame.gameBoard.minRow;
  }

  var x = dotCount_to_length(currGame.gameBoard.col);
  var y = dotCount_to_length(currGame.gameBoard.row);

  optedXnY(x, y);
}

function optedXnY(x, y) {
  var dotEs = document.querySelectorAll(".dot");
  const infoE = document.querySelector("#info");

  if (x && y) {
    infoE.innerHTML = currGame.gameBoard.col + " x " + currGame.gameBoard.row;

    for (var dotE of dotEs) {
      let cx = dotE.cx.baseVal.value;
      let cy = dotE.cy.baseVal.value;

      if (cx <= x && cy <= y) {
        dotE.classList.remove("hidden");
      }
      else {
        dotE.classList.add("hidden");
      }
    }

    saveCurrGame();
  } else {
    console.log("invalid x or y");
  }
}

function nearestDot(x, y) {
  var dotEs = document.querySelectorAll(".dot");

  var nearDot = dotEs[0];

  for (var i = 1; i < dotEs.length; i++) {
    let dotE = dotEs[i];

    let cx = dotE.cx.baseVal.value;
    let cy = dotE.cy.baseVal.value;

    let oldcx = nearDot.cx.baseVal.value;
    let oldcy = nearDot.cy.baseVal.value;

    let xcx = difference(x, cx);
    let ycy = difference(y, cy);

    let oldxcx = difference(x, oldcx);
    let oldycy = difference(y, oldcy);

    if ((xcx <= oldxcx) && ycy <= oldycy) {
      nearDot = dotE;
    }
  }

  return nearDot;
}

function length_to_dotCount(length) {
  return (length - length % currGame.gameBoard.gap + currGame.gameBoard.gap) / currGame.gameBoard.gap;
}

function dotCount_to_length(dotCount) {
  let dotRadius = getDotRadius();

  return (dotCount * currGame.gameBoard.gap) - currGame.gameBoard.gap + dotRadius * 2;
}

function difference(a, b) { return Math.abs(a - b); }
