$ = (o) => document.querySelector(o);
$All = (o) => document.querySelectorAll(o);
$aEL = (o, e, f) => o.addEventListener(e, f);
$rEL = (o, e, f) => o.removeEventListener(e, f);
$cE = (tN) => document.createElement(tN);

var nS = 'http://www.w3.org/2000/svg';
$cENS = (tN) => document.createElementNS(nS, tN);

const diff = 50;

var initDot, finalDot, row = 2, col = 2, orient, currPlayer, playerC, players = [];

//window.onerror = (message, source, lineno, colno, error) => {$("pre").innerHTML = lineno + ": " + message + "\nat col: " + colno;}

class Player{
    constructor(color, name){
        this.id = getNewID();
        this.count = 0;
        this.color = color;
        this.name = name;
    }
}

window.onload = () => {
    dotMaker();
    $aEL($(".rowCol"), "change", dotMaker);
    $aEL($(".rowCol"), "input", dotMaker);

    $aEL($("svg"), "mousedown", alertBox);

    $aEL($(".startB"), "click", playersAdd);
    $aEL($(".pc"), "input", playerChange);
    $aEL($(".startG"), "click", startGame);
}

function dotMaker(){
    var svg = $("svg"), rowE = $(".row"), colE = $(".col"), dots = $All("circle");

    for(let o of dots){
        o.remove();
    }

    validateDots();

    var row = parseInt(rowE.value);
    var col = parseInt(colE.value);

    if(row >= 2 && col >= 2){
        for(let i = 0;i < row;i++){
            for(let j = 0;j < col;j++){
                var cx = (diff * j + 20).toString(10);
                var cy = (diff * i + 20).toString(10);

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

const alertBox = () => {
    $(".alert").classList.remove("hidden");
}

const startGame = () => {
    const svg = $("svg");

    $(".playersc").classList.add("gone");

    $(".alert").classList.add("hidden");
    $rEL($("svg"), "mousedown", alertBox);
    $rEL($(".startB"), "click", playersAdd);

    for(let o of $All(".config input"))
        o.disabled = "true";

    row = $(".row").value;
    col = $(".col").value;

    $aEL(svg, "mouseover", () => {
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
    });

    $aEL(svg, "mousedown", () => {
        var o = event.target;
        if(o.tagName == "circle")
            initDot = {"cx": event.target.cx.baseVal.value, "cy": event.target.cy.baseVal.value};

            $aEL($("svg"), "mousemove", linePrev);
    });

    $aEL(svg, "mouseup", () => {
        $rEL($("svg"), "mousemove", linePrev);

        var prevLines = $All(".prevLine");
        for(let o of prevLines){
            o.remove();
        }

        if(event.target.tagName == "circle"){
            finalDot = {"cx": event.target.cx.baseVal.value, "cy": event.target.cy.baseVal.value};

            if(validateLines(finalDot)){
                lineMaker(finalDot);
            }
        }
        else{
            initDot = null;
        }
    });

    playerData();
    playerTurn();
}

const linePrev = () => {
    /*console.clear();
    console.log(event);*/

    if(initDot){
        var cx = event.offsetX;
        var cy = event.offsetY;

        var pseudoDot = {"cx": cx, "cy": cy};
        /*console.log(initDot);
        console.log(pseudoDot);*/

        prevLineMaker(pseudoDot);
    }
}

const prevLineMaker = (pseudoDot) => {
    var svg = $("svg");

    var prevLines = $All(".prevLine");

    for(let o of prevLines){
        o.remove();
    }

    let line = $cENS("line");
        line.setAttribute("x1", initDot.cx);
        line.setAttribute("y1", initDot.cy);
        line.setAttribute("x2", pseudoDot.cx);
        line.setAttribute("y2", pseudoDot.cy);

        line.setAttribute("stroke-width", "3");
        line.setAttribute("stroke", "black");
        line.setAttribute("class", "prevLine");

    svg.appendChild(line);

    dotMaker();
}

const validateDots = () => {
    var rowE = $(".row");
    var colE = $(".col");

    var cH = parseInt(
        getComputedStyle($(".svgC"), null).getPropertyValue("height")
        ) - 30;
    var cW = parseInt(
        getComputedStyle($(".svgC"), null).getPropertyValue("width")
        ) - 30;

    var maxRow = (cH - cH % diff + diff) / diff;
    var maxCol = (cW - cW % diff + diff) / diff;
    //console.log([cW, maxCol]);

    if(rowE.value < 2)
        rowE.value = 2;

    if(colE.value < 2)
        colE.value = 2;

    if(rowE.value > maxRow)
        rowE.value = maxRow;

    if(colE.value > maxCol)
        colE.value = maxCol;
}

const svgResize = () => {
    var svg = $("svg");
    var row = parseInt($(".row").value);
    var col = parseInt($(".col").value);

    var width = ((col - 1) * diff) + 40;
    var height = ((row - 1) * diff) + 40;

    svg.style.width = width + "px";
    svg.style.height = height + "px";
}

const validateLines = (finalDot) => {
    if(initDot){
        var deltaX = Math.abs(initDot.cx - finalDot.cx);
        var deltaY = Math.abs(initDot.cy - finalDot.cy);

        /*console.log(deltaX + " , " + deltaY);*/
        //console.log(initDot);console.log(finalDot);

        if((initDot.cx == finalDot.cx) && (deltaY == diff)){
            return true;
        }else if((initDot.cy == finalDot.cy) && (deltaX == diff)){
            return true;
        }else{
            return false;
        }
    }
}

const lineMaker = (finalDot) => {//console.clear();
    const svg = $("svg");
    let lineE = $cENS("line");
    let success = false;

    lineE.setAttribute("x1", initDot.cx);
    lineE.setAttribute("y1", initDot.cy);
    lineE.setAttribute("x2", finalDot.cx);
    lineE.setAttribute("y2", finalDot.cy);

    lineE.setAttribute("stroke-width", "3");
    lineE.setAttribute("stroke", "black");

    lineE.setAttribute("byPlayer", currPlayer.id);

    if(lineE && !lineExists(lineE)){
        svg.appendChild(lineE);
        //console.log(line.tagName);
        var wS = wetherSquare(lineE);

        dotMaker();

        if(!wS){
            playerTurn();
        }

        success = true;
    }

    initDot = null;

    return success;
}

const getRectLines = (line) => {
    var middle = lineEToJSON(line);

    if((middle.x1 == middle.x2) && (middle.y1 != middle.y2))
        orient = "vertical"
    else
        orient = "horizontal";

    if(orient == "vertical"){
        var left = {
            "x1": middle.x1 - diff,
            "y1": middle.y1,
            "x2": middle.x2 - diff,
            "y2": middle.y2
        };

        var right = {
            "x1": middle.x1 + diff,
            "y1": middle.y1,
            "x2": middle.x2 + diff,
            "y2": middle.y2
        };

        var leftTop = {
            "x1": middle.x1,
            "y1": middle.y1,
            "x2": middle.x1 - diff,
            "y2": middle.y1
        };

        var leftBottom = {
            "x1": middle.x2,
            "y1": middle.y2,
            "x2": middle.x2 - diff,
            "y2": middle.y2
        };

        var rightTop = {
            "x1": middle.x1,
            "y1": middle.y1,
            "x2": middle.x1 + diff,
            "y2": middle.y1
        };

        var rightBottom = {
            "x1": middle.x2,
            "y1": middle.y2,
            "x2": middle.x2 + diff,
            "y2": middle.y2
        };

        return {
            "leftSqr": [left, leftBottom, leftTop, middle],
            "rightSqr": [middle, rightBottom, right, rightTop]
        };

    }else if(orient == "horizontal"){
        var top = {
            "x1": middle.x1,
            "y1": middle.y1 - diff,
            "x2": middle.x2,
            "y2": middle.y2 - diff
        };

        var topRight = {
            "x1": middle.x2,
            "y1": middle.y2,
            "x2": middle.x2,
            "y2": middle.y2 - diff
        };

        var topLeft = {
            "x1": middle.x1,
            "y1": middle.y1,
            "x2": middle.x1,
            "y2": middle.y1 - diff
        };

        var bottomRight = {
            "x1": middle.x2,
            "y1": middle.y2,
            "x2": middle.x2,
            "y2": middle.y2 + diff
        };

        var bottom = {
            "x1": middle.x1,
            "y1": middle.y1 + diff,
            "x2": middle.x2,
            "y2": middle.y2 + diff
        };

        var bottomLeft = {
            "x1": middle.x1,
            "y1": middle.y1,
            "x2": middle.x1,
            "y2": middle.y1 + diff
        };

        return {
            "topSqr": [top, topRight, topLeft, middle],
            "bottomSqr": [middle, bottomRight, bottom, bottomLeft]
        };
    }
}

const lineEToJSON = (lineE) => {
    return {
            "x1": lineE.x1.baseVal.value,
            "y1": lineE.y1.baseVal.value,
            "x2": lineE.x2.baseVal.value,
            "y2": lineE.y2.baseVal.value,
        };
}

const lineEsToJSON = () => {
    const linesE = $All("svg line");
    var lines = [];

    for(let o of linesE){
        lines.push(lineEToJSON(o));
    }

    return lines;
}

const wetherSquare = (lineE) => {
    var success = false;

    if(lineE.tagName == "line"){
        var linesE = lineEsToJSON();
        var rectLines = getRectLines(lineE);
        var square = new Object();

        if(orient == "vertical"){
            var leftSquare = [];
            var rightSquare = [];

            square.vline = lineE;

            for(let l of linesE){

                for(let a of rectLines.leftSqr){
                    if(compareLineObj(l, a) && !leftSquare.includes(a))
                        leftSquare.push(a);
                }

                for(let b of rectLines.rightSqr){
                    if(compareLineObj(l, b) && !rightSquare.includes(b))
                        rightSquare.push(b);
                }
            }

            if(leftSquare.length == 4){
                square.left = leftSquare;
                success = true;
            }
            if(rightSquare.length == 4){
                square.right = rightSquare;
                success = true;
            }
        }

        if(orient == "horizontal"){
            var topSquare = [];
            var bottomSquare = [];

            square.hline = lineE;

            for(let l of linesE){

                for(let a of rectLines.topSqr){
                    if(compareLineObj(l, a) && !topSquare.includes(a))
                        topSquare.push(a);
                }

                for(let b of rectLines.bottomSqr){
                    if(compareLineObj(l, b) && !bottomSquare.includes(b))
                        bottomSquare.push(b);
                }
            }

            if(topSquare.length == 4){
                square.top = topSquare;
                success = true;
            }
            if(bottomSquare.length == 4){
                square.bottom = bottomSquare;
                success = true;
            }
        }
        squareXY(square);
    }

    return success;
}

const squareXY = (square) => {
    var l, xy = new Object();
    var success;

    if(square.hline){
        l = lineEToJSON(square.hline);
        xy.x = Math.min(l.x1, l.x2);
        if(square.top){
            xy.y = Math.min(l.y1, l.y2) - diff;

            success = squareMaker(xy);
        }
        if(square.bottom){
            xy.y = Math.min(l.y1, l.y2);

            success = squareMaker(xy);
        }
    }

    if(square.vline){
        l = lineEToJSON(square.vline);
        xy.y = Math.min(l.y1, l.y2);
        if(square.left){
            xy.x = Math.min(l.x1, l.x2) - diff;

            success = squareMaker(xy);
        }
        if(square.right){
            xy.x = Math.min(l.x1, l.x2);

            success = squareMaker(xy);
        }

        return true;
    }

    return success;
}

const squareMaker = (xy) =>{
    const svg = $("svg");

    if(xy.x && xy.y){
        var squareE = $cENS("rect");
        squareE.setAttribute("class", "winBox");
        squareE.setAttribute("x", xy.x + 1);
        squareE.setAttribute("y", xy.y + 1);
        squareE.setAttribute("width", diff - 2);
        squareE.setAttribute("height", diff - 2);
        squareE.setAttribute("fill", currPlayer.color);

        squareE.setAttribute("byPlayer", currPlayer.id);

        svg.appendChild(squareE);

        currPlayer.count++;
        isEnd();

        return true;
    }
    else{
        console.log("no xy");
        return false;
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

const lineExists = (lineE) => {
    var line = lineEToJSON(lineE);
    var linesE = lineEsToJSON();

    for(let l of linesE){
        if(compareLineObj(line, l))
            return true;
    }

    return false;
}

const playersAdd = () => {
    $(".playersc").classList.remove("gone");
    const playersE = $(".players");

    playersE.innerHTML = "";

    playerC = $(".pc").value;

    for(i=0;i < playerC;i++){
        playerAdd();
    }
}

const playerAdd = () => {
    const playersE = $(".players");

    var playerE = $cE("div");
    playerE.classList = "player";

    var color = randomColor();

    var icolor = $cE("input");
    icolor.type = "color";
    icolor.value = color;
    icolor.classList = "icolor";

    var iname = $cE("input");
    iname.placeholder = "Enter your name";
    iname.classList = "iname";

    playerE.appendChild(icolor);
    playerE.appendChild(iname);

    playersE.appendChild(playerE);
}

const playerChange = () => {
    if($(".pc").value < 2)
        $(".pc").value = 2;

    var playerC = parseInt($(".pc").value);
    var playerE = $All(".player");
    var a = playerE.length;

    if(playerC < a){
        let delta = a - playerC;

        for(i=0;i < delta;i++){
            playerE = $All(".player");

            playerE[playerE.length - 1].remove();
        }
    }

    if(playerC > a){
        let delta = playerC - a;

        for(i=0;i < delta;i++){
            playerAdd();
        }
    }
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function randomColor() {
    var colors = [];

    for(var o of players){
        colors.push(o.color);
    }

    for(let i=0; i< 10;i++){
        var h = getRndInteger(0, 359);
        let rgb = hsl_to_rgb(h, 50, 50);
        var color = rgb_to_hex(rgb);

        if(!(color in colors)){
            break;
        }
    }

    return color;
}

const getNewID = () => {
    var IDs = [];

    for(var o of players){
        IDs.push(o.id);
    }

    if(players.length == 0){
        return 0;
    }

    for(id=0;id <= 100;id++){
        let exists = IDs.includes(id);
        if(!exists){
            return id;
        }
    }
}

const playerTurn = () => {
    players.sort((a, b) => a.id - b.id);

    if(!currPlayer){
        currPlayer = players[0];
    }
    else{
        let i = players.indexOf(currPlayer);
        if(i == players.length - 1){
            currPlayer = players[0];
        }
        else{
            currPlayer = players[i + 1];
        }
    }

    if(currPlayer.name){
        $(".turnInfo").innerHTML = currPlayer.name + "'s" + " turn";
    }
    else{
        $(".turnInfo").innerHTML = "Player id: " + currPlayer.id + "'s" + " turn";
    }
}

const playerData = () => {
    var playerEs = $All(".player");
    var icolorES = $All(".icolor");
    var inameEs = $All(".iname");

    for(var i=0;i< playerEs.length;i++){
        var color = icolorES[i].value;
        var name = inameEs[i].value;

        let player = new Player(color, name);

        players.push(player);
    }
}

const isEnd = () => {
    var maxSquares = (row - 1) * (col - 1);
    var squaresE = $All(".winBox");
    const winnersE = $(".winners");
    var squaresC = squaresE.length;
    var lastWinner, winners = [];

    if(maxSquares == squaresC){
        players.sort((a, b) => a.count - b.count);

        lastWinner = players[players.length - 1];

        for(var o of players){
            if(lastWinner.count == o.count){
                winners.push(o);
            }
        }

        winnersE.classList.remove("gone");
        winnersE.innerHTML = winners;
    }
}

function hsl_to_rgb(h, s, l){
	var s = s / 100;
	var l = l / 100;

	s = s.toFixed(2);
	l = l.toFixed(2);

	let c = (1 - Math.abs(2 * l - 1)) * s,
		x = c * (1 - Math.abs((h / 60) % 2 - 1)),
		m = l - c/2,
		r = 0,
		g = 0,
		b = 0;

	if (0 <= h && h < 60) {
		r = c; g = x; b = 0;
	} else if (60 <= h && h < 120) {
		r = x; g = c; b = 0;
	} else if (120 <= h && h < 180) {
		r = 0; g = c; b = x;
	} else if (180 <= h && h < 240) {
		r = 0; g = x; b = c;
	} else if (240 <= h && h < 300) {
		r = x; g = 0; b = c;
	} else if (300 <= h && h < 360) {
		r = c; g = 0; b = x;
	}

	r = Math.round((r + m) * 255);
	g = Math.round((g + m) * 255);
	b = Math.round((b + m) * 255);

	return {r: r, g:g, b:b}
}

function rgb_to_hex(rgb){
	let hr = rgb.r.toString(16);
	let hg = rgb.g.toString(16);
	let hb = rgb.b.toString(16);

	if(hr == "0")
		hr = "00";
	if(hg == "0")
		hg = "00";
	if(hb == "0")
		hb = "00";

	return "#"+hr+hg+hb;
}
