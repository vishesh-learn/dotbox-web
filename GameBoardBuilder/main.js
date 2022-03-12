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
  }
}

window.onload = () => {
  const svg = $("svg"), backButton = $("#backButton");

  gameBoard = new GameBoard();

  startupVariables();

  $aEL(backButton, "click", () => window.location.href = "../index.html")
  $aEL(window, "resize", startupVariables);
  $aEL(svg, "pointerdown", pointHandler);
  $aEL(svg, "pointerup", () => $rEL(window, "pointermove", pointHandler));
}

function pointHandler(){
  var pointX = event.offsetX;
  var pointY = event.offsetY;

  var nearDot = nearestDot(pointX, pointY);

  optedDots(nearDot.cx.baseVal.value, nearDot.cy.baseVal.value);

  $aEL(window, "pointermove", pointHandler);
}

function startupVariables(){
  var cH = parseInt(
    getComputedStyle($(".svgC"), null).getPropertyValue("height")
  ) - (gameBoard.svgPaddingX * 2);

  var cW = parseInt(
    getComputedStyle($(".svgC"), null).getPropertyValue("width")
  ) - (gameBoard.svgPaddingX * 2);

  gameBoard.maxRow = length_to_dotCount(cH, gameBoard.gap);
  gameBoard.maxCol = length_to_dotCount(cW, gameBoard.gap);

  GameBoardBuilder(gameBoard.gap, gameBoard.minRow, gameBoard.minCol, gameBoard.maxRow, gameBoard.maxCol, gameBoard.svgPaddingX, gameBoard.svgPaddingY);
}

function GameBoardBuilder(gap, minRow, minCol, maxRow, maxCol, svgPaddingX, svgPaddingY){

    var svg = $("svg");
    var dots = $All("circle");

    for(let o of dots){
        o.remove();
    }

    if(maxRow >= minRow && maxCol >= minCol){
        for(let i = 0;i < maxRow;i++){
            for(let j = 0;j < maxCol;j++){
                var cx = (gap * j + svgPaddingX).toString(10);
                var cy = (gap * i + svgPaddingY).toString(10);

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

    svgResize(gap, maxRow, maxCol, svgPaddingX, svgPaddingY);
}

function svgResize(gap, maxRow, maxCol, svgPaddingX, svgPaddingY){
    var svg = $("svg");

    var width = ((maxCol - 1) * gap) + (svgPaddingX * 2);
    var height = ((maxRow - 1) * gap) + (svgPaddingY * 2);

    svg.style.width = width + "px";
    svg.style.height = height + "px";
}

function length_to_dotCount(length, gap){
  return (length - length % gap + gap) / gap;
}

function optedDots(x, y){
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
    } else {
        console.log("no x and y");
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
