var currPlayer, playerTurnList, initDot, finalDot, orient, made, allPossibleLines = [],
    playerTurnTimeOut, autoDrawLineTimeOut;

class Line {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
}

class Made {
    constructor() {
        this.lineMade = false;
        this.boxMade = 0;
    }
}

window.onload = () => {
    const backButton = $("#backButton");
    made = new Made();

    loadGameAndPlayerList();

    gameBoardBuilder();

    playerTurnTimeOut = setTimeout(playerTurn, 50);

    $aEL($(".playerTurnList"), "transitionend", setupPlayerTurnListUI);

    $aEL(backButton, "click", goBack);
    $aEL($("#replayButton"), "click", () => window.location.reload());
    $aEL($("#newGameButton"), "click", () => window.location.href = `../${pages.setBoard}`);

    footerInfo();

    keyOnTabIndex();
}

function goBack() {
    window.location.href = `../${pages.setPlayers}`;
}

function footerInfo() {
    const rowColInfoHtml = $('.rowAndCol');

    rowColInfoHtml.innerHTML = `Board: ${gameBoard.col} x ${gameBoard.row}`;
}

function linePrev(event) {
    var x = event.offsetX, y = event.offsetY;

    if (initDot) {
        var left = initDot.cx - gameBoard.gap;
        var top = initDot.cy - gameBoard.gap;
        var bottom = initDot.cy + gameBoard.gap;
        var right = initDot.cx + gameBoard.gap;

        if (x < left) {
            x = left;
        }

        if (x > right) {
            x = right;
        }

        if (y < top) {
            y = top;
        }

        if (y > bottom) {
            y = bottom;
        }

        var pseudoDot = { "cx": x, "cy": y };

        prevLineMaker(dotsToLine(initDot, pseudoDot));
    }
}

function getValidFinalDots(initDot) {
    var left = { "side": "left", "cx": initDot.cx - gameBoard.gap, "cy": initDot.cy };
    var top = { "side": "top", "cx": initDot.cx, "cy": initDot.cy - gameBoard.gap };
    var bottom = { "side": "bottom", "cx": initDot.cx, "cy": initDot.cy + gameBoard.gap };
    var right = { "side": "right", "cx": initDot.cx + gameBoard.gap, "cy": initDot.cy };

    var options = [top, right, bottom, left];
    var validFinalDots = [];
    for (var option of options) {
        if (dotExists(option)) {
            validFinalDots.push(option);
        }
    }

    return validFinalDots;
}

function nearDot(x, y) {
    var validFinalDots = getValidFinalDots(initDot);

    var nearDot = validFinalDots[0];
    for (var dot of validFinalDots) {
        let cx = dot.cx;
        let cy = dot.cy;

        let oldcx = nearDot.cx;
        let oldcy = nearDot.cy;

        let x_cx = difference(x, cx);
        let y_cy = difference(y, cy);

        let oldxcx = difference(x, oldcx);
        let oldycy = difference(y, oldcy);

        if ((x_cx <= oldxcx) && y_cy <= oldycy) {
            nearDot = dot;
        }
    }

    return nearDot;
}

const nearestDot = (x, y) => {
    var dotEs = $All(".dot");

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

function prevLineMaker(line) {
    var svg = $(".lineSVG");
    var prevLines = $All(".prevLine");

    for (let o of prevLines) {
        o.remove();
    }

    let lineE = getSVGLine("prevLine", line);

    svg.appendChild(lineE);
}

function svgResize() {
    const svgList = $All(".svgC svg");

    var width = ((gameBoard.col - 1) * gameBoard.gap) + (gameBoard.svgPaddingX * 2);
    var height = ((gameBoard.row - 1) * gameBoard.gap) + (gameBoard.svgPaddingY * 2);

    for (var svg of svgList) {
        svg.style.width = width + "px";
        svg.style.height = height + "px";
    }
}

function validateLines(finalDot) {
    if (initDot && finalDot.cx >= 0 && finalDot.cy >= 0) {
        var deltaX = Math.abs(initDot.cx - finalDot.cx);
        var deltaY = Math.abs(initDot.cy - finalDot.cy);

        if ((initDot.cx == finalDot.cx) && (deltaY == gameBoard.gap)) {
            return true;
        } else if ((initDot.cy == finalDot.cy) && (deltaX == gameBoard.gap)) {
            return true;
        } else {
            return false;
        }
    }

    return false;
}

function lineMaker(line) {
    const svg = $(".lineSVG");

    var lineE = getSVGLine("line", line);

    if (lineE && !lineExists(line, lineEsToJSON())) {

        svg.appendChild(lineE);

        squareXY(whetherSquare(lineEToJSON(lineE)));

        if (currPlayer.color) {
            line.color = currPlayer.color;
        }

        lineMade(line);
    }

    initDot = null;
}

const getRectLines = (middle) => {
    if ((middle.x1 == middle.x2) && (middle.y1 != middle.y2))
        orient = "vertical"
    else
        orient = "horizontal";

    if (orient == "vertical") {
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
            "orient": orient,
            "leftSqr": [left, leftBottom, leftTop, middle],
            "rightSqr": [middle, rightBottom, right, rightTop]
        };

    } else if (orient == "horizontal") {
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
            "orient": orient,
            "topSqr": [top, topRight, topLeft, middle],
            "bottomSqr": [middle, bottomRight, bottom, bottomLeft]
        };
    }
}

function whetherSquare(line) {
    var square = getSurroundingLines(line);

    if (square.orient == "horizontal") {
        if (square.top.length == 4) {
            made.boxMade++;
        }
        if (square.bottom.length == 4) {
            made.boxMade++;
        }
    }

    if (square.orient == "vertical") {
        if (square.left.length == 4) {
            made.boxMade++;
        }
        if (square.right.length == 4) {
            made.boxMade++;
        }
    }

    return square;
}

function getSurroundingLines(line) {
    var lines = lineEsToJSON();
    var rectLines = getRectLines(line);
    var square = new Object();

    if (orient == "vertical") {
        square.orient = "vertical";
        var leftSquare = [];
        var rightSquare = [];

        square.vline = line;

        for (let l of lines) {

            for (let a of rectLines.leftSqr) {
                if (compareLineObj(l, a) && !leftSquare.includes(a))
                    leftSquare.push(a);
            }

            for (let b of rectLines.rightSqr) {
                if (compareLineObj(l, b) && !rightSquare.includes(b))
                    rightSquare.push(b);
            }
        }

        square.left = leftSquare;
        square.right = rightSquare;
    }

    if (orient == "horizontal") {
        square.orient = "horizontal";
        var topSquare = [];
        var bottomSquare = [];

        square.hline = line;

        for (let l of lines) {

            for (let a of rectLines.topSqr) {
                if (compareLineObj(l, a) && !topSquare.includes(a))
                    topSquare.push(a);
            }

            for (let b of rectLines.bottomSqr) {
                if (compareLineObj(l, b) && !bottomSquare.includes(b))
                    bottomSquare.push(b);
            }
        }


        square.top = topSquare;
        square.bottom = bottomSquare;
    }

    return square;
}

function squareXY(square) {
    var l, xy = new Object();

    if (square.orient == "horizontal") {
        l = square.hline;
        xy.x = Math.min(l.x1, l.x2);
        if (square.top.length == 4) {
            xy.y = Math.min(l.y1, l.y2) - gameBoard.gap;

            createSquareUI(xy);
        }
        if (square.bottom.length == 4) {
            xy.y = Math.min(l.y1, l.y2);

            createSquareUI(xy);
        }
    }

    if (square.orient == "vertical") {
        l = square.vline;
        xy.y = Math.min(l.y1, l.y2);
        if (square.left.length == 4) {
            xy.x = Math.min(l.x1, l.x2) - gameBoard.gap;

            createSquareUI(xy);
        }
        if (square.right.length == 4) {
            xy.x = Math.min(l.x1, l.x2);

            createSquareUI(xy);
        }
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

function compareDots(dot1, dot2) {
    return (
        (dot1.cx == dot2.cx) &&
        (dot1.cy == dot2.cy)
    )
}

function dotExists(dot) {
    var dotsE = $All("circle");

    for (var d of dotsE) {
        var existingDot = dotEToJSON(d);

        if (compareDots(dot, existingDot)) {
            return true;
        }
    }

    return false;
}

function lineExists(line, lineList) {

    for (let l of lineList) {
        if (compareLineObj(line, l)) {
            return true;
        }
    }

    return false;
}

function doesMakesSquare(middleLine) {
    var possibleSquare = getSurroundingLines(middleLine);

    if (possibleSquare.orient == "horizontal") {
        if ((possibleSquare.top.length == 3) || (possibleSquare.bottom.length == 3)) {
            return true;
        }
    } else if (possibleSquare.orient == "vertical") {
        if ((possibleSquare.left.length == 3) || (possibleSquare.right.length == 3)) {
            return true;
        }
    }

    return false;
}

function dotsToLine(dot1, dot2) { return { "x1": dot1.cx, "y1": dot1.cy, "x2": dot2.cx, "y2": dot2.cy }; }

function resetBoard() {
    var linesE = $All(".line");
    var squaresE = $All(".winBox");

    for (let sE of squaresE) {
        sE.remove();
    }

    for (let lE of linesE) {
        lE.remove();
    }
}

function randi(upto) {
    return Math.floor(Math.random() * upto);
}

function setupPlayerTurnList() {
    playerTurnList = [];
    var currIndex = currPlayer.id - 1;

    if (currIndex == 0) {
        prevIndex = playerList.length - 1;
    } else {
        prevIndex = currIndex - 1;
    }

    if (currIndex == playerList.length - 1) {
        nextIndex = 0;
        nextIndex2 = 1;
    } else if (currIndex == playerList.length - 2) {
        nextIndex = currIndex + 1;
        nextIndex2 = 0;
    } else {
        nextIndex = currIndex + 1;
        nextIndex2 = currIndex + 2;
    }

    playerTurnList.push(playerList[prevIndex]);
    playerTurnList.push(playerList[currIndex]);
    playerTurnList.push(playerList[nextIndex]);
    playerTurnList.push(playerList[nextIndex2]);
}

function slideLeft() {
    const frame = $(".playerTurnList");

    frame.classList.add("slideLeft");
}

function setupPlayerTurnListUI() {
    const frame = $(".playerTurnList");
    var playerUI;

    frame.innerHTML = "";

    for (let player of playerTurnList) {
        playerUI = createPlayerUI(player);

        frame.append(playerUI);
    }

    frame.classList.remove("slideLeft");

    setCurrPlayerInfo();
}

function setCurrPlayerInfo() {
    const currPlayerIDUI = $(".curr-player-id");
    const currPlayerIDName = $(".curr-player-name");
    const currPlayerScoreUI = $(".curr-player-score");

    currPlayerIDUI.innerText = `ID: ${currPlayer.id}`;
    currPlayerIDName.innerText = `Name: ${Player.getName(currPlayer)}`;
    currPlayerScoreUI.innerText = `Score: ${currPlayer.score}`;
}

function winBoard() {
    $("body").classList.add("pop-up-container");

    setupPlayerRankList();
    setupPlayerRankListUI();
}

function setupPlayerRankList() {
    playerList.sort((a, b) => {
        if (a.score > b.score) {
            return -1;
        }

        if (a.score < b.score) {
            return 1;
        }

        return 0;
    });
}

function setupPlayerRankListUI() {
    const playerRankListUI = $(".playerRankList");
    var playerUI;

    playerRankListUI.innerHTML = "";

    for (let i = 0; i < playerList.length; i++) {
        playerList[i].rank = i + 1;

        playerUI = createRankPlayerUI(playerList[i]);

        playerRankListUI.append(playerUI);
    }
}
