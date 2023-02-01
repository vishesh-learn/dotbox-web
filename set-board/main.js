window.onload = () => {
  const gameBoardSVG = $(".svgC svg"), backButton = $("#backButton"), nextButton = $("#nextButton");

  setupGameBoard();

  $aEL(backButton, "click", () => window.location.href = "../");
  $aEL(window, "resize", setupGameBoard);
  $aEL(gameBoardSVG, "pointerdown", pointHandler);
  $aEL(gameBoardSVG, "pointerup", () => $rEL(gameBoardSVG, "pointermove", pointHandler));

  $aEL(nextButton, "click", () => window.location.href = `../${pages.setPlayers}`);

  setTabIndex();
}

function setupGameBoard(){
  loadGameBoard();
  startupVariables();
  GameBoardBuilder();
  optedCnR();
}

function startupVariables(){
  var cH = parseInt(
    getComputedStyle($(".svgC"), null).getPropertyValue("height")
  ) - (gameBoard.svgPaddingX * 2);

  var cW = parseInt(
    getComputedStyle($(".svgC"), null).getPropertyValue("width")
  ) - (gameBoard.svgPaddingX * 2);

  gameBoard.maxRow = length_to_dotCount(cH);

  gameBoard.maxCol = length_to_dotCount(cW);
}

function GameBoardBuilder(){
    var gameBoardSVG = $(".svgC svg");
    var dots = $All("circle");

    for(let o of dots){
        o.remove();
    }

    if(gameBoard.maxRow >= gameBoard.minRow && gameBoard.maxCol >= gameBoard.minCol){
        for(let i = 0;i < gameBoard.maxRow;i++){
            for(let j = 0;j < gameBoard.maxCol;j++){
                var cx = (gameBoard.gap * j + gameBoard.svgPaddingX).toString(10);
                var cy = (gameBoard.gap * i + gameBoard.svgPaddingY).toString(10);

                let dot = $cENS("circle");
                dot.setAttribute("class", "dot hidden");

                dot.setAttribute("r", "7");
                dot.setAttribute("cx", cx);
                dot.setAttribute("cy", cy);

                gameBoardSVG.appendChild(dot);
            }
        }
    }

    svgResize();
}

function svgResize(){
    var gameBoardSVG = $(".svgC svg");

    var width = ((gameBoard.maxCol - 1) * gameBoard.gap) + (gameBoard.svgPaddingX * 2);
    var height = ((gameBoard.maxRow - 1) * gameBoard.gap) + (gameBoard.svgPaddingY * 2);

    gameBoardSVG.style.width = width + "px";
    gameBoardSVG.style.height = height + "px";
}

function pointHandler(){
  var gameBoardSVG = $(".svgC svg");

  var pointX = event.offsetX;
  var pointY = event.offsetY;

  var nearDot = nearestDot(pointX, pointY);

  var optedX = nearDot.cx.baseVal.value;
  var optedY = nearDot.cy.baseVal.value;

  gameBoard.col = length_to_dotCount(optedX, gameBoard.gap);
  gameBoard.row = length_to_dotCount(optedY, gameBoard.gap);

  optedCnR();

  $aEL(gameBoardSVG, "pointermove", pointHandler);
}

function length_to_dotCount(length){
  //values of 'length % gameBoard.gap' and 'svgPadding' are equal
  return (length - length % gameBoard.gap + gameBoard.gap) / gameBoard.gap;
}

function dotCount_to_length(dotCount, svgPadding){
  return (dotCount * gameBoard.gap) - gameBoard.gap + svgPadding;
}

function optedCnR(){
  if (gameBoard.col > gameBoard.maxCol) {
    gameBoard.col = gameBoard.maxCol;
  } else if (gameBoard.col < gameBoard.minCol) {
    gameBoard.col = gameBoard.minCol;
  }

  if (gameBoard.row > gameBoard.maxRow) {
    gameBoard.row = gameBoard.maxRow;
  } else if (gameBoard.row < gameBoard.minRow) {
    gameBoard.row = gameBoard.minRow;
  }

  var x = dotCount_to_length(gameBoard.col, gameBoard.svgPaddingX);
  var y = dotCount_to_length(gameBoard.row, gameBoard.svgPaddingY);
  optedXnY(x, y);
}

function optedXnY(x, y){
    var dotEs = $All(".dot");
    const infoE = $("#info");

    if(x && y){
      infoE.innerHTML = gameBoard.col + " x " + gameBoard.row;

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

        saveGameBoard(gameBoard);
    } else {
        console.log("invalid x or y");
    }
}

function nearestDot(x, y){
    var dotEs = $All(".dot");

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
