$ = (o) => document.querySelector(o);
$All = (o) => document.querySelectorAll(o);
$aEL = (o, e, f, b) => o.addEventListener(e, f, b);
$rEL = (o, e, f) => o.removeEventListener(e, f);
$cE = (tN) => document.createElement(tN);

var nS = 'http://www.w3.org/2000/svg';
$cENS = (tN) => document.createElementNS(nS, tN);

var gameBoard, playerList, currPlayer;

var initDot, finalDot, orient, lineWidth = 6;

var Made = {"lineMade": null, "boxMade": 0, "allLines": false};

window.onload = () => {
    const dotSVG = $(".dotSVG");

    loadGameBoard();
    loadPlayerList();

    $aEL(dotSVG, "pointerover", pointerOver);
    $aEL(dotSVG, "pointerdown", pointerDown);
    $aEL(dotSVG, "pointerup", pointerUp);
}

class Line{
    Line(x1, y1, x2, y2){
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
}

function pointerOver(){
    const target = event.target;
    const doth = $All(".doth");

    if(target.classList.contains("doth")){
        target.classList.remove("invisible");
    }

    if(target.tagName == "svg"){
        for(let o of doth){
            o.classList.add("invisible");
        }
    }
}

function pointerDown(){
  var x = event.offsetX, y = event.offsetY;

    if(x && y){
        initDot = nearestDot(x, y);
        initDot = dotEToJSON(initDot);

        $aEL($(".dotSVG"), "pointermove", linePrev);
    }
}

function pointerUp(){ // apply condition here for 'draw only when this x,y is gap distance away from initDot
  $rEL($(".dotSVG"), "pointermove", linePrev);

  var x = event.offsetX, y = event.offsetY;

    Made = {"lineMade": null, "boxMade": 0, "allLines": false};

    let x_cx = difference(x, initDot.cx);
    let y_cy = difference(y, initDot.cy);

    var prevLines = $All(".prevLine");
    for(let o of prevLines){
        o.remove();
    }

    if((x_cx < (gameBoard.gap - 7)) && (y_cy < (gameBoard.gap - 7))){
        return Made;
    }

    if(initDot && x && y){
        finalDot = nearDot(x, y);
        if(validateLines(finalDot)){
            lineMaker(dotsToLine(initDot, finalDot));
        }
    } else {
        console.log("no x and y");
    }

    return Made;
}

function linePrev(){
  var x = event.offsetX, y = event.offsetY;

    if(initDot){
        var left = initDot.cx - gameBoard.gap;
        var top = initDot.cy - gameBoard.gap;
        var bottom = initDot.cy + gameBoard.gap;
        var right = initDot.cx + gameBoard.gap;

        if(x < left){
            x = left;
        }

        if(x > right){
            x = right;
        }

        if(y < top){
            y = top;
        }

        if(y > bottom){
            y = bottom;
        }

        var pseudoDot = {"cx": x, "cy": y};

        prevLineMaker(dotsToLine(initDot, pseudoDot));
    }
}

function difference(a, b) { return Math.abs(a - b); }

function getValidFinalDots(initDot){
    var left = {"side": "left", "cx": initDot.cx - gameBoard.gap, "cy": initDot.cy};
    var top = {"side": "top", "cx": initDot.cx, "cy": initDot.cy - gameBoard.gap};
    var bottom = {"side": "bottom", "cx": initDot.cx, "cy": initDot.cy + gameBoard.gap};
    var right = {"side": "right", "cx": initDot.cx + gameBoard.gap, "cy": initDot.cy};

    var options = [top, right, bottom, left];
    var validFinalDots = [];
    for(var option of options){
        if(dotExists(option)){
            validFinalDots.push(option);
        }
    }

    return validFinalDots;
}

function nearDot(x, y){
    var validFinalDots = getValidFinalDots(initDot);

    var nearDot = validFinalDots[0];
    for(var dot of validFinalDots){
        let cx = dot.cx;
        let cy = dot.cy;

        let oldcx = nearDot.cx;
        let oldcy = nearDot.cy;

        let x_cx = difference(x, cx);
        let y_cy = difference(y, cy);

        let oldxcx = difference(x, oldcx);
        let oldycy = difference(y, oldcy);

        if((x_cx <= oldxcx) && y_cy <= oldycy){
            nearDot = dot;
        }
    }

    return nearDot;
}

const nearestDot = (x, y) => {
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

function prevLineMaker(line){
    var svg = $(".lineSVG");
    var prevLines = $All(".prevLine");

    for(let o of prevLines){
        o.remove();
    }

    let lineE = getSVGLine("prevLine", line, lineWidth.toString());

    svg.appendChild(lineE);
}

function getSVGLine(theClass, line, strokeWidth){
    let lineE = $cENS("line");

    lineE.setAttribute("class", theClass);

    lineE.setAttribute("x1", line.x1);
    lineE.setAttribute("y1", line.y1);
    lineE.setAttribute("x2", line.x2);
    lineE.setAttribute("y2", line.y2);

    lineE.setAttribute("stroke-width", strokeWidth);

    if(currPlayer.color){
        lineE.setAttribute("stroke", currPlayer.color);
    } else {
        console.log("color not found");
    }

    if(currPlayer.id){
        lineE.setAttribute("byPlayer", currPlayer.id);
    }

    return lineE;
}

function svgResize(){
    const svgList = $All("svg");

    var width = ((gameBoard.col - 1) * gameBoard.gap) + (gameBoard.svgPaddingX * 2);
    var height = ((gameBoard.row - 1) * gameBoard.gap) + (gameBoard.svgPaddingY * 2);

    for (var svg of svgList) {
      svg.style.width = width + "px";
      svg.style.height = height + "px";
    }
}

function gameBoardBuilder() {
    var svg = $(".dotSVG");
    var dots = $All("circle");

    for(let o of dots){
        o.remove();
    }

    if(gameBoard.row >= 2 && gameBoard.col >= 2){
        for(let i = 0;i < gameBoard.row;i++){
            for(let j = 0;j < gameBoard.col;j++){
                var cx = (gameBoard.gap * j + gameBoard.svgPaddingX).toString(10);
                var cy = (gameBoard.gap * i + gameBoard.svgPaddingY).toString(10);

                let dot = $cENS("circle");
                dot.setAttribute("class", "dot");

                dot.setAttribute("r", "7");
                dot.setAttribute("cx", cx);
                dot.setAttribute("cy", cy);

                let doth = $cENS("circle");
                doth.setAttribute("class", "doth invisible");

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

function validateLines(finalDot){
    if(initDot && finalDot.cx >= 0 && finalDot.cy >= 0){
        var deltaX = Math.abs(initDot.cx - finalDot.cx);
        var deltaY = Math.abs(initDot.cy - finalDot.cy);

        if((initDot.cx == finalDot.cx) && (deltaY == gameBoard.gap)){
            return true;
        }else if((initDot.cy == finalDot.cy) && (deltaX == gameBoard.gap)){
            return true;
        }else{
            return false;
        }
    }

    return false;
}

function drawLine(x1, y1, x2, y2){
    lineMaker(new Line(x1, y1, x2, y2));
}

function lineMaker(line){
    const svg = $(".lineSVG");

    var lineE = getSVGLine("line", line, lineWidth.toString());

    if(lineE && !lineExists(lineEToJSON(lineE))){

        svg.appendChild(lineE);


        squareXY(whetherSquare(lineEToJSON(lineE)));

        if(currPlayer.color){
            line.color = currPlayer.color;
        }
        if(currPlayer.id){
            line.playerId = currPlayer.id;
        }

        Made.lineMade = line;
    }

    isEnd();

    initDot = null;
}

const getRectLines = (middle) => {
    if((middle.x1 == middle.x2) && (middle.y1 != middle.y2))
        orient = "vertical"
    else
        orient = "horizontal";

    if(orient == "vertical"){
        var left = {
            "x1": middle.x1 - gameBoard.gap,
            "y1": middle.y1,
            "x2": middle.x2 - gameBoard.gap,
            "y2": middle.y2
        };

        var right = {
            "x1": middle.x1 + gameBoard.gap,
            "y1": middle.y1,
            "x2": middle.x2 + gameBoard.gap,
            "y2": middle.y2
        };

        var leftTop = {
            "x1": middle.x1,
            "y1": middle.y1,
            "x2": middle.x1 - gameBoard.gap,
            "y2": middle.y1
        };

        var leftBottom = {
            "x1": middle.x2,
            "y1": middle.y2,
            "x2": middle.x2 - gameBoard.gap,
            "y2": middle.y2
        };

        var rightTop = {
            "x1": middle.x1,
            "y1": middle.y1,
            "x2": middle.x1 + gameBoard.gap,
            "y2": middle.y1
        };

        var rightBottom = {
            "x1": middle.x2,
            "y1": middle.y2,
            "x2": middle.x2 + gameBoard.gap,
            "y2": middle.y2
        };

        return {
            "orient": "vertical",
            "leftSqr": [left, leftBottom, leftTop, middle],
            "rightSqr": [middle, rightBottom, right, rightTop]
        };

    }else if(orient == "horizontal"){
        var top = {
            "x1": middle.x1,
            "y1": middle.y1 - gameBoard.gap,
            "x2": middle.x2,
            "y2": middle.y2 - gameBoard.gap
        };

        var topRight = {
            "x1": middle.x2,
            "y1": middle.y2,
            "x2": middle.x2,
            "y2": middle.y2 - gameBoard.gap
        };

        var topLeft = {
            "x1": middle.x1,
            "y1": middle.y1,
            "x2": middle.x1,
            "y2": middle.y1 - gameBoard.gap
        };

        var bottomRight = {
            "x1": middle.x2,
            "y1": middle.y2,
            "x2": middle.x2,
            "y2": middle.y2 + gameBoard.gap
        };

        var bottom = {
            "x1": middle.x1,
            "y1": middle.y1 + gameBoard.gap,
            "x2": middle.x2,
            "y2": middle.y2 + gameBoard.gap
        };

        var bottomLeft = {
            "x1": middle.x1,
            "y1": middle.y1,
            "x2": middle.x1,
            "y2": middle.y1 + gameBoard.gap
        };

        return {
            "orient": "horizontal",
            "topSqr": [top, topRight, topLeft, middle],
            "bottomSqr": [middle, bottomRight, bottom, bottomLeft]
        };
    }
}

function lineEToJSON(lineE){
    return {
            "x1": lineE.x1.baseVal.value,
            "y1": lineE.y1.baseVal.value,
            "x2": lineE.x2.baseVal.value,
            "y2": lineE.y2.baseVal.value
        };
}

const lineEsToJSON = () => {
    const linesE = $All("svg line");
    var lines = [];

    for(let lineE of linesE){
        lines.push(lineEToJSON(lineE));
    }

    return lines;
}

function whetherSquare(line){
    var square = getSurroundingLines(line);

    if(square.orient == "horizontal"){
        if(square.top.length == 4){
            Made.boxMade++;
        }
        if(square.bottom.length == 4){
            Made.boxMade++;
        }
    }

    if(square.orient == "vertical"){
        if(square.left.length == 4){
            Made.boxMade++;
        }
        if(square.right.length == 4){
            Made.boxMade++;
        }
    }

    return square;
}

function getSurroundingLines(line){
        var lines = lineEsToJSON();
        var rectLines = getRectLines(line);
        var square = new Object();

        if(orient == "vertical"){
            square.orient = "vertical";
            var leftSquare = [];
            var rightSquare = [];

            square.vline = line;

            for(let l of lines){

                for(let a of rectLines.leftSqr){
                    if(compareLineObj(l, a) && !leftSquare.includes(a))
                        leftSquare.push(a);
                }

                for(let b of rectLines.rightSqr){
                    if(compareLineObj(l, b) && !rightSquare.includes(b))
                        rightSquare.push(b);
                }
            }

                square.left = leftSquare;
                square.right = rightSquare;
        }

        if(orient == "horizontal"){
            square.orient = "horizontal";
            var topSquare = [];
            var bottomSquare = [];

            square.hline = line;

            for(let l of lines){

                for(let a of rectLines.topSqr){
                    if(compareLineObj(l, a) && !topSquare.includes(a))
                        topSquare.push(a);
                }

                for(let b of rectLines.bottomSqr){
                    if(compareLineObj(l, b) && !bottomSquare.includes(b))
                        bottomSquare.push(b);
                }
            }


                square.top = topSquare;
                square.bottom = bottomSquare;
        }

        return square;
}

function squareXY(square){
    var l, xy = new Object();

    if(square.orient == "horizontal"){
        l = square.hline;
        xy.x = Math.min(l.x1, l.x2);
        if(square.top.length == 4){
            xy.y = Math.min(l.y1, l.y2) - gameBoard.gap;

            squareMaker(xy);
        }
        if(square.bottom.length == 4){
            xy.y = Math.min(l.y1, l.y2);

            squareMaker(xy);
        }
    }

    if(square.orient == "vertical"){
        l = square.vline;
        xy.y = Math.min(l.y1, l.y2);
        if(square.left.length == 4){
            xy.x = Math.min(l.x1, l.x2) - gameBoard.gap;

            squareMaker(xy);
        }
        if(square.right.length == 4){
            xy.x = Math.min(l.x1, l.x2);

            squareMaker(xy);
        }
    }
}

function squareMaker(xy){
    const svg = $(".boxSVG");

    if(xy.x && xy.y){
        var squareE = $cENS("rect");
        squareE.setAttribute("class", "winBox");
        squareE.setAttribute("x", xy.x + lineWidth/2);
        squareE.setAttribute("y", xy.y + lineWidth/2);
        squareE.setAttribute("width", gameBoard.gap - lineWidth);
        squareE.setAttribute("height", gameBoard.gap - lineWidth);

        if(currPlayer.color){
            squareE.setAttribute("fill", currPlayer.color);
        }

        if(currPlayer.id){
            squareE.setAttribute("byPlayer", currPlayer.id);
        }

        svg.appendChild(squareE);
    }
    else{
        console.log("no xy");
    }
}

const compareLineObj = (obj1, obj2) => {
    return (
        (
            (obj1.x1 == obj2.x1) &&
            (obj1.y1 == obj2.y1) &&
            (obj1.x2 == obj2.x2) &&
            (obj1.y2 == obj2.y2)
        ) ||
        (
            (obj1.x1 == obj2.x2) &&
            (obj1.y1 == obj2.y2) &&
            (obj1.x2 == obj2.x1) &&
            (obj1.y2 == obj2.y1)
        )
    )
}

function compareDots(dot1, dot2){
    return (
        (dot1.cx == dot2.cx) &&
        (dot1.cy == dot2.cy)
    )
}

function dotExists(dot){
    var dotsE = $All("circle");

    for(var d of dotsE){
        var existingDot = dotEToJSON(d);

        if(compareDots(dot, existingDot)){
            return true;
        }
    }

    return false;
}

const lineExists = (line) => {
    var linesE = lineEsToJSON();

    for(let l of linesE){
        if(compareLineObj(line, l))
            return true;
    }

    return false;
}

function isEnd(){
//    var maxSquares = (gameBoard.row - 1) * (gameBoard.col - 1);
//    var squaresE = $All(".winBox");
//
//    var squaresC = squaresE.length;

//    if(maxSquares == squaresC){
//        Made.allLines = true;
//    }

    if(getAllPossibleLines().length <= 0){Made.allLines = true}
}

function dotEToJSON(dotE){
    return {
        "cx": dotE.cx.baseVal.value,
        "cy": dotE.cy.baseVal.value
    }
}

function getAllPossibleLines(){
    var dotEs = $All(".dot");
    var allPossibleLines = [];

    for(var dotE of dotEs){
        var dot1 = dotEToJSON(dotE);
        var validFinalDots = getValidFinalDots(dot1);

        for(var dot2 of validFinalDots){
            var possibleLine = dotsToLine(dot1, dot2);

            if(!lineExists(possibleLine) && !allPossibleLines.includes(possibleLine)){
                allPossibleLines.push(possibleLine);
            }
        }
    }

    return allPossibleLines;
}

function autoDrawLine(){ console.log(JSON.stringify(currPlayer));
    Made = {"lineMade": null, "boxMade": 0, "allLines": false};

    var dotEs = $All(".dot"), allPossibleLines = getAllPossibleLines(), currSafeMoves = [];

    if(allPossibleLines.length <= 0){
        Made.allLines = true;
        console.log(Made.allLines);
        return Made;
    }

    for(var possibleLine of allPossibleLines){
        if(doesMakesSquare(possibleLine)){
            lineMaker(possibleLine, currPlayer.color);
            return Made;
        }
    }

    for(var possibleLine of allPossibleLines){
        if(isSafeMove(possibleLine)){
            currSafeMoves.push(possibleLine);
        }
    }

    if(currSafeMoves.length > 0){console.log(currSafeMoves.length);
        lineMaker(currSafeMoves[randi(currSafeMoves.length - 1)], currPlayer.color);
    } else {
        lineMaker(allPossibleLines[randi(allPossibleLines.length - 1)], currPlayer.color);
    }
    console.log(JSON.stringify(Made.lineMade));
    return Made;
}

function doesMakesSquare(middleLine){
    var possibleSquare = getSurroundingLines(middleLine);

    if(possibleSquare.orient == "horizontal"){
        if((possibleSquare.top.length == 3) || (possibleSquare.bottom.length == 3)){
            return true;
        }
    } else if(possibleSquare.orient == "vertical"){
        if((possibleSquare.left.length == 3) || (possibleSquare.right.length == 3)){
            return true;
        }
    }

    return false;
}

function isSafeMove(middleLine){
    var possibleSquare = getSurroundingLines(middleLine);

    if(possibleSquare.orient == "horizontal"){
        if(((possibleSquare.top.length == 3) || (possibleSquare.bottom.length == 3)) || ((possibleSquare.top.length != 2) && (possibleSquare.bottom.length != 2))){
            return true;
        }
    } else if(possibleSquare.orient == "vertical"){
        if(((possibleSquare.left.length == 3) || (possibleSquare.right.length == 3)) || ((possibleSquare.left.length != 2) && (possibleSquare.right.length != 2))){
            return true;
        }
    }

    return false;
}

function dotsToLine(dot1, dot2){return {"x1": dot1.cx, "y1": dot1.cy, "x2": dot2.cx, "y2": dot2.cy};}

function resetBoard(){
    var linesE = $All(".line");
    var squaresE = $All(".winBox");

    for(let sE of squaresE){
        sE.remove();
    }

    for(let lE of linesE){
        lE.remove();
    }
}

function randi(upto){
    return Math.floor(Math.random() * upto);
}

function saveGameBoard(){
  localStorage.gameBoard = JSON.stringify(gameBoard);
}

function loadGameBoard(){
  gameBoard = JSON.parse(localStorage.gameBoard);

  gameBoardBuilder();
}

function loadPlayerList(){
  if(localStorage.playerList != undefined){
    playerList = JSON.parse(localStorage.playerList);
  }

  currPlayer = playerList[0];
}
