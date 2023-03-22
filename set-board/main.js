window.onload = () => {
  const gameBoardSVG = $(".svgC svg"), backButton = $("#backButton"), nextButton = $("#nextButton");
  
  $aEL(backButton, "click", () => window.location.href = `../${pages.home}`);

  setupGameBoard();
  $aEL(window, "resize", setupGameBoard);
  
  $aEL(gameBoardSVG, "pointerdown", pointHandler);
  $aEL(gameBoardSVG, "pointerup", () => $rEL(gameBoardSVG, "pointermove", pointHandler));

  $aEL(nextButton, "click", () => window.location.href = `../${pages.setPlayers}`);

  keyOnTabIndex();
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
  ) - (game.gameBoard.svgPaddingX * 2);

  var cW = parseInt(
    getComputedStyle($(".svgC"), null).getPropertyValue("width")
  ) - (game.gameBoard.svgPaddingX * 2);

  game.gameBoard.maxRow = length_to_dotCount(cH);

  game.gameBoard.maxCol = length_to_dotCount(cW);
}

function GameBoardBuilder(){
    var gameBoardSVG = $(".svgC svg");
    var dots = $All("circle");

    for(let o of dots){
        o.remove();
    }

    if(game.gameBoard.maxRow >= game.gameBoard.minRow && game.gameBoard.maxCol >= game.gameBoard.minCol){
        for(let i = 0;i < game.gameBoard.maxRow;i++){
            for(let j = 0;j < game.gameBoard.maxCol;j++){
                var cx = (game.gameBoard.gap * j + game.gameBoard.svgPaddingX).toString(10);
                var cy = (game.gameBoard.gap * i + game.gameBoard.svgPaddingY).toString(10);

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

    var width = ((game.gameBoard.maxCol - 1) * game.gameBoard.gap) + (game.gameBoard.svgPaddingX * 2);
    var height = ((game.gameBoard.maxRow - 1) * game.gameBoard.gap) + (game.gameBoard.svgPaddingY * 2);

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

  game.gameBoard.col = length_to_dotCount(optedX, game.gameBoard.gap);
  game.gameBoard.row = length_to_dotCount(optedY, game.gameBoard.gap);

  optedCnR();

  $aEL(gameBoardSVG, "pointermove", pointHandler);
}

function length_to_dotCount(length){
  //values of 'length % game.gameBoard.gap' and 'svgPadding' are equal
  return (length - length % game.gameBoard.gap + game.gameBoard.gap) / game.gameBoard.gap;
}

function dotCount_to_length(dotCount, svgPadding){
  return (dotCount * game.gameBoard.gap) - game.gameBoard.gap + svgPadding;
}

function optedCnR(){
  if (game.gameBoard.col > game.gameBoard.maxCol) {
    game.gameBoard.col = game.gameBoard.maxCol;
  } else if (game.gameBoard.col < game.gameBoard.minCol) {
    game.gameBoard.col = game.gameBoard.minCol;
  }

  if (game.gameBoard.row > game.gameBoard.maxRow) {
    game.gameBoard.row = game.gameBoard.maxRow;
  } else if (game.gameBoard.row < game.gameBoard.minRow) {
    game.gameBoard.row = game.gameBoard.minRow;
  }

  var x = dotCount_to_length(game.gameBoard.col, game.gameBoard.svgPaddingX);
  var y = dotCount_to_length(game.gameBoard.row, game.gameBoard.svgPaddingY);
  optedXnY(x, y);
}

function optedXnY(x, y){
    var dotEs = $All(".dot");
    const infoE = $("#info");

    if(x && y){
      infoE.innerHTML = game.gameBoard.col + " x " + game.gameBoard.row;

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

        saveGameBoard(game.gameBoard);
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
