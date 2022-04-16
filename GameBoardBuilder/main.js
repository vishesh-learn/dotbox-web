$ = (o) => document.querySelector(o);
$All = (o) => document.querySelectorAll(o);
$aEL = (o, e, f) => o.addEventListener(e, f);
$rEL = (o, e, f) => o.removeEventListener(e, f);
$cE = (tN) => document.createElement(tN);

var nS = 'http://www.w3.org/2000/svg';
$cENS = (tN) => document.createElementNS(nS, tN);

var gameBoard;

class GameBoard{
  constructor(){
    this.gap = 50;
    this.minRow = 3;
    this.minCol = 3;
    this.maxRow = this.minRow;
    this.maxCol = this.minCol;
    this.svgPaddingX = 30;
    this.svgPaddingY = 30;
    this.row = this.minRow;
    this.col = this.minCol;
    this.x = 130;
  }
}

window.onload = () => {
  const svg = $("svg"), backButton = $("#backButton"), nextButton = $("#nextButton");

  gameBoard = new GameBoard();

  startupVariables();

  GameBoardBuilder();

  loadGameBoard();

  $aEL(backButton, "click", () => window.location.href = "../index.html")
  $aEL(window, "resize", startupVariables);
  $aEL(svg, "pointerdown", pointHandler);
  $aEL(svg, "pointerup", () => $rEL(svg, "pointermove", pointHandler));

  $aEL(nextButton, "click", () => window.location.href = "../PlayerSetup/index.html")
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
    var svg = $("svg");
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

                let doth = $cENS("circle");
                doth.setAttribute("class", "doth");

                doth.setAttribute("r", "9");
                doth.setAttribute("cx", cx);
                doth.setAttribute("cy", cy);

                svg.appendChild(doth);
                svg.appendChild(dot);
            }
        }
    }

    svgResize();
}

function svgResize(){
    var svg = $("svg");

    var width = ((gameBoard.maxCol - 1) * gameBoard.gap) + (gameBoard.svgPaddingX * 2);
    var height = ((gameBoard.maxRow - 1) * gameBoard.gap) + (gameBoard.svgPaddingY * 2);

    svg.style.width = width + "px";
    svg.style.height = height + "px";
}

function pointHandler(){
  var svg = $("svg");

  var pointX = event.offsetX;
  var pointY = event.offsetY;

  var nearDot = nearestDot(pointX, pointY);

  optedXnY(nearDot.cx.baseVal.value, nearDot.cy.baseVal.value);

  $aEL(svg, "pointermove", pointHandler);
}

function length_to_dotCount(length){
  //values of 'length % gameBoard.gap' and 'svgPadding' are equal
  return (length - length % gameBoard.gap + gameBoard.gap) / gameBoard.gap;
}

function dotCount_to_length(dotCount, svgPadding){
  return (dotCount * gameBoard.gap) - gameBoard.gap + svgPadding;
}

function optedCnR(){
  var x = dotCount_to_length(gameBoard.col, gameBoard.svgPaddingX);
  var y = dotCount_to_length(gameBoard.row, gameBoard.svgPaddingY);
  optedXnY(x, y);
}

function optedXnY(x, y){
    var dotEs = $All(".dot");
    const rowAndColInfoE = $("#rowAndColInfo");

    if(x && y){
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

        gameBoard.col = length_to_dotCount(x, gameBoard.gap);
        gameBoard.row = length_to_dotCount(y, gameBoard.gap);

        rowAndColInfoE.innerHTML = gameBoard.col + " x " + gameBoard.row;

        saveGameBoard(gameBoard);
    } else {
        console.log("invalid x or y");
    }
}

function saveGameBoard(){
  localStorage.gameBoard = JSON.stringify(gameBoard);
}

function loadGameBoard(){
  gameBoard = JSON.parse(localStorage.gameBoard);
  optedCnR();
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
