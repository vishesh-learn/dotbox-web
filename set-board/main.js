window.onload = () => {
  const gameBoardSVG = document.querySelector(".svgC svg"), backButton = document.querySelector("#backButton"), nextButton = document.querySelector("#nextButton");
  
  $aEL(backButton, "click", () => window.location.href = `../${pages.home}`);

  loadCurrGame();
  setupGameBoard();

  $aEL(window, "resize", setupGameBoard);
  $aEL(gameBoardSVG, "pointerdown", pointHandler);
  $aEL(gameBoardSVG, "pointerup", () => $rEL(gameBoardSVG, "pointermove", pointHandler));

  $aEL(nextButton, "click", () => window.location.href = `../${pages.setPlayers}`);

  keyOnTabIndex();
}

function setupGameBoard(){
  startupVariables();
  GameBoardBuilder();
  optedCnR();
}

function startupVariables(){
  var cH = parseInt(
    getComputedStyle(document.querySelector(".svgC"), null).getPropertyValue("height")
  ) - (currGame.gameBoard.svgPaddingX * 2);

  var cW = parseInt(
    getComputedStyle(document.querySelector(".svgC"), null).getPropertyValue("width")
  ) - (currGame.gameBoard.svgPaddingX * 2);

  currGame.gameBoard.maxRow = length_to_dotCount(cH);

  currGame.gameBoard.maxCol = length_to_dotCount(cW);
}

function GameBoardBuilder(){
    document.querySelectorAll("circle").forEach(dot => dot.remove());

    if(currGame.gameBoard.maxRow >= currGame.gameBoard.minRow && currGame.gameBoard.maxCol >= currGame.gameBoard.minCol){
        for(let i = 0;i < currGame.gameBoard.maxRow;i++){
            for(let j = 0;j < currGame.gameBoard.maxCol;j++){
                var x = (currGame.gameBoard.gap * j + currGame.gameBoard.svgPaddingX).toString(10);
                var y = (currGame.gameBoard.gap * i + currGame.gameBoard.svgPaddingY).toString(10);

                let dot = document.createElementNS('http://www.w3.org/2000/svg', "circle");
                dot.setAttribute("class", "dot hidden");

                dot.setAttribute("r", "7");
                dot.setAttribute("cx", x);
                dot.setAttribute("cy", y);

                document.querySelector(".svgC svg").appendChild(dot);
            }
        }
    }

    svgResize();
}

function svgResize(){
    var gameBoardSVG = document.querySelector(".svgC svg");

    var width = ((currGame.gameBoard.maxCol - 1) * currGame.gameBoard.gap) + (currGame.gameBoard.svgPaddingX * 2);
    var height = ((currGame.gameBoard.maxRow - 1) * currGame.gameBoard.gap) + (currGame.gameBoard.svgPaddingY * 2);

    gameBoardSVG.style.width = width + "px";
    gameBoardSVG.style.height = height + "px";
}

function pointHandler(event){
  var gameBoardSVG = document.querySelector(".svgC svg");

  var pointX = event.offsetX;
  var pointY = event.offsetY;

  var nearDot = nearestDot(pointX, pointY);

  var optedX = nearDot.cx.baseVal.value;
  var optedY = nearDot.cy.baseVal.value;

  currGame.gameBoard.col = length_to_dotCount(optedX, currGame.gameBoard.gap);
  currGame.gameBoard.row = length_to_dotCount(optedY, currGame.gameBoard.gap);

  resetGame(); //replace this with a filter instead of reset as done with player list change

  optedCnR();

  $aEL(gameBoardSVG, "pointermove", pointHandler);
}

function length_to_dotCount(length){
  //values of 'length % currGame.gameBoard.gap' and 'svgPadding' are equal
  return (length - length % currGame.gameBoard.gap + currGame.gameBoard.gap) / currGame.gameBoard.gap;
}

function dotCount_to_length(dotCount, svgPadding){
  return (dotCount * currGame.gameBoard.gap) - currGame.gameBoard.gap + svgPadding;
}

function optedCnR(){
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

  var x = dotCount_to_length(currGame.gameBoard.col, currGame.gameBoard.svgPaddingX);
  var y = dotCount_to_length(currGame.gameBoard.row, currGame.gameBoard.svgPaddingY);

  optedXnY(x, y);
}

function optedXnY(x, y){
    var dotEs = document.querySelectorAll(".dot");
    const infoE = document.querySelector("#info");

    if(x && y){
      infoE.innerHTML = currGame.gameBoard.col + " x " + currGame.gameBoard.row;

        for(var dotE of dotEs){
            let cx = dotE.cx.baseVal.value;
            let cy = dotE.cy.baseVal.value;

            if(cx <= x && cy <= y){
                dotE.classList.remove("hidden");
            }
            else{
                dotE.classList.add("hidden");
            }
        }

        saveCurrGame();
    } else {
        console.log("invalid x or y");
    }
}

function nearestDot(x, y){
    var dotEs = document.querySelectorAll(".dot");

    var nearDot = dotEs[0];

    for(var i = 1; i < dotEs.length; i++){
        let dotE = dotEs[i];

        let cx = dotE.cx.baseVal.value;
        let cy = dotE.cy.baseVal.value;

        let oldcx = nearDot.cx.baseVal.value;
        let oldcy = nearDot.cy.baseVal.value;

        let xcx = difference(x, cx);
        let ycy = difference(y, cy);

        let oldxcx = difference(x, oldcx);
        let oldycy = difference(y, oldcy);

        if((xcx <= oldxcx) && ycy <= oldycy){
            nearDot = dotE;
        }
    }

    return nearDot;
}

function difference(a, b) { return Math.abs(a - b); }
