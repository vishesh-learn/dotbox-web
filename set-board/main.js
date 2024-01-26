window.onload = () => {
  const gameBoardSVG = document.querySelector(".svgC svg")
  const nextButton = document.querySelector("#nextButton");

  document.querySelector("#homeButton").addEventListener("click", goHome);

  document.querySelector("#backButton").addEventListener("click", goBack);

  loadCurrGame();

  currGame.currPage = pages.setBoard;

  setupGameBoard();

  addEventListener("resize", setupGameBoard);
  
  $aEL(gameBoardSVG, "pointerdown", pointHandler);
  $aEL(gameBoardSVG, "pointerup", () => $rEL(gameBoardSVG, "pointermove", pointHandler));

  $aEL(nextButton, "click", () => window.location.href = `../${pages.setPlayers}/${pages.indexPage}`);

  keyOnTabIndex();
}

function goHome() {
  window.location.href = `../${pages.indexPage}`;
}

function goBack() {
  window.location.href = `../${pages.indexPage}`;
}

function setupGameBoard() {
  startupVariables();
  GameBoardBuilder();
  optedCnR();
}

function startupVariables() {
  let dotRadius = getDotRadius();

  //console.log('dotRadius', dotRadius);

  let boardSize = getComputedSize(document.querySelector(".svgC"));

  console.log('boardSize', boardSize);

  let scrollbarSize = getScrollbarSize();

  console.log('scrollbarSize', scrollbarSize);

  var drawableWidth = boardSize.width - (dotRadius * 2) - scrollbarSize;

  var drawableHeight = boardSize.height - (dotRadius * 2) - scrollbarSize;

  currGame.gameBoard.maxCol = length_to_dotCount(drawableWidth);

  currGame.gameBoard.maxRow = length_to_dotCount(drawableHeight);
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

  if (currGame.gameBoard.maxRow >= currGame.gameBoard.minRow && currGame.gameBoard.maxCol >= currGame.gameBoard.minCol) {
    for (let i = 0; i < currGame.gameBoard.maxRow; i++) {
      for (let j = 0; j < currGame.gameBoard.maxCol; j++) {
        var x = (currGame.gameBoard.gap * j + dotRadius).toString(10);
        var y = (currGame.gameBoard.gap * i + dotRadius).toString(10);

        let dot = document.createElementNS('http://www.w3.org/2000/svg', "circle");
        dot.setAttribute("class", "dot hidden");

        dot.setAttribute("r", "7");
        dot.setAttribute("cx", x);
        dot.setAttribute("cy", y);

        document.querySelector(".svgC svg").appendChild(dot);
      }
    }
  }

  //svgResize();
}

function pointHandler(event) {
  var gameBoardSVG = document.querySelector(".svgC svg");

  var pointX = event.offsetX;
  var pointY = event.offsetY;

  var nearDot = nearestDot(pointX, pointY);

  var optedX = nearDot.cx.baseVal.value;
  var optedY = nearDot.cy.baseVal.value;

  currGame.gameBoard.col = length_to_dotCount(optedX, currGame.gameBoard.gap);
  currGame.gameBoard.row = length_to_dotCount(optedY, currGame.gameBoard.gap);

  optedCnR();

  $aEL(gameBoardSVG, "pointermove", pointHandler);
}

function length_to_dotCount(length) {
  return (length - length % currGame.gameBoard.gap + currGame.gameBoard.gap) / currGame.gameBoard.gap;
}

function dotCount_to_length(dotCount) {
  let dotRadius = getDotRadius();

  return (dotCount * currGame.gameBoard.gap) - currGame.gameBoard.gap + dotRadius * 2;
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

function difference(a, b) { return Math.abs(a - b); }
