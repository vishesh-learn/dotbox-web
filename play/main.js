var currPlayer, playerTurnList, initDot, finalDot, orient, made, allPossibleLines = [], pendingPossiblelines = [];

class Dot {
    constructor(x, y, side) {
        this.x = x;
        this.y = y;
        this.side = side;
    }
}

class Line {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    get orient() {
        return (this.x1 == this.x2) && (this.y1 != this.y2)
            ? 'vertical' : 'horizontal';
    }
}

class Box {
    constructor(x, y) {
        this.x = x,
            this.y = y
    }
}

class Made {
    constructor() {
        this.lineMade = false;
        this.boxMade = 0;
    }
}

window.onload = () => {
    made = new Made();

    loadGameAndPlayerList();

    gameBoardBuilder();

    getAllPossibleLines();

    getPendingPossiblelines()

    requestAnimationFrame(playerTurn);

    $aEL($(".playerTurnList"), "transitionend", setupPlayerTurnListUI);

    $aEL($("#backButton"), "click", goBack);

    $aEL($("#replayButton"), "click",
        () => window.location.reload());

    $aEL($("#newGameButton"), "click",
        () => window.location.href = `../${pages.setBoard}`);

    footerInfo();

    keyOnTabIndex();
}

function goBack() {
    window.location.href = `../${pages.setPlayers}`;
}

function footerInfo() {
    const rowColInfoHtml = $('.rowAndCol');

    rowColInfoHtml.innerHTML = `Board: ${game.gameBoard.col} x ${game.gameBoard.row}`;
}

function linePrev(event) {
    var x = event.offsetX, y = event.offsetY;

    if (initDot) {
        var left = initDot.x - game.gameBoard.gap;
        var top = initDot.y - game.gameBoard.gap;
        var bottom = initDot.y + game.gameBoard.gap;
        var right = initDot.x + game.gameBoard.gap;

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

        var pseudoDot = new Dot(x, y);

        prevLineMaker(
            new Line(
                initDot.x, initDot.y, pseudoDot.x, pseudoDot.y
            )
        );
    }
}

function getSurroundingDots(initDot) {
    var top = new Dot(
        initDot.x,
        initDot.y - game.gameBoard.gap,
        'top'
    );

    var right = new Dot(
        initDot.x + game.gameBoard.gap,
        initDot.y,
        "right",
    );

    var bottom = new Dot(
        initDot.x,
        initDot.y + game.gameBoard.gap,
        "bottom",
    );

    var left = new Dot(
        initDot.x - game.gameBoard.gap,
        initDot.y,
        'left',
    );

    var options = [top, right, bottom, left].filter(dotExists);

    return options;
}

function nearDot(x, y) {
    var validFinalDots = getSurroundingDots(initDot);
    
    var nearDot = validFinalDots[0];
    for (var dot of validFinalDots) {
        let cx = dot.x;
        let cy = dot.y;

        let oldcx = nearDot.x;
        let oldcy = nearDot.y;

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

    var width = ((game.gameBoard.col - 1) * game.gameBoard.gap) + (game.gameBoard.svgPaddingX * 2);
    var height = ((game.gameBoard.row - 1) * game.gameBoard.gap) + (game.gameBoard.svgPaddingY * 2);

    for (var svg of svgList) {
        svg.style.width = width + "px";
        svg.style.height = height + "px";
    }
}

function lineMaker(line) {
    const svg = $(".lineSVG");

    var lineE = getSVGLine("line", line);

    if (lineE && lineNotExists(line, lineEsToJSON())) {
        svg.appendChild(lineE);

        makeBox(getSurroundingLines(line));

        lineMade(line);
    }

    initDot = undefined;
}

function getBoxMakingLines(line) {
    if (line.orient == "vertical") {
        var left = new Line(
            line.x1 - game.gameBoard.gap,
            line.y1,
            line.x2 - game.gameBoard.gap,
            line.y2
        );

        var right = new Line(
            line.x1 + game.gameBoard.gap,
            line.y1,
            line.x2 + game.gameBoard.gap,
            line.y2
        );

        var leftTop = new Line(
            line.x1,
            line.y1,
            line.x1 - game.gameBoard.gap,
            line.y1
        );

        var leftBottom = new Line(
            line.x2,
            line.y2,
            line.x2 - game.gameBoard.gap,
            line.y2
        );

        var rightTop = new Line(
            line.x1,
            line.y1,
            line.x1 + game.gameBoard.gap,
            line.y1
        );

        var rightBottom = new Line(
            line.x2,
            line.y2,
            line.x2 + game.gameBoard.gap,
            line.y2
        );

        return {
            'line': line,
            "orient": line.orient,
            "leftBoxMakingLines": [left, leftBottom, leftTop, line],
            "rightBoxMakingLines": [line, rightBottom, right, rightTop]
        };

    } else if (line.orient == "horizontal") {
        var top = new Line(
            line.x1,
            line.y1 - game.gameBoard.gap,
            line.x2,
            line.y2 - game.gameBoard.gap
        );

        var topRight = new Line(
            line.x2,
            line.y2,
            line.x2,
            line.y2 - game.gameBoard.gap
        );

        var topLeft = new Line(
            line.x1,
            line.y1,
            line.x1,
            line.y1 - game.gameBoard.gap
        );

        var bottomRight = new Line(
            line.x2,
            line.y2,
            line.x2,
            line.y2 + game.gameBoard.gap
        );

        var bottom = new Line(
            line.x1,
            line.y1 + game.gameBoard.gap,
            line.x2,
            line.y2 + game.gameBoard.gap
        );

        var bottomLeft = new Line(
            line.x1,
            line.y1,
            line.x1,
            line.y1 + game.gameBoard.gap
        );

        return {
            'line': line,
            "orient": line.orient,
            "topBoxMakingLines": [top, topRight, topLeft, line],
            "bottomBoxMakingLines": [line, bottomRight, bottom, bottomLeft]
        };
    }
}

function getSurroundingLines(line) {
    var lines = lineEsToJSON();
    var boxMakingLines = getBoxMakingLines(line);
    var square = new Object();

    if (line.orient == "vertical") {
        square.orient = "vertical";
        var leftSquare = [];
        var rightSquare = [];

        square.vline = line;

        for (let l of lines) {

            for (let a of boxMakingLines.leftBoxMakingLines) {
                if (compareLineObj(l, a) && !leftSquare.includes(a))
                    leftSquare.push(a);
            }

            for (let b of boxMakingLines.rightBoxMakingLines) {
                if (compareLineObj(l, b) && !rightSquare.includes(b))
                    rightSquare.push(b);
            }
        }

        square.left = leftSquare;
        square.right = rightSquare;
    }

    if (line.orient == "horizontal") {
        square.orient = "horizontal";
        var topSquare = [];
        var bottomSquare = [];

        square.hline = line;

        for (let l of lines) {

            for (let a of boxMakingLines.topBoxMakingLines) {
                if (compareLineObj(l, a) && !topSquare.includes(a))
                    topSquare.push(a);
            }

            for (let b of boxMakingLines.bottomBoxMakingLines) {
                if (compareLineObj(l, b) && !bottomSquare.includes(b))
                    bottomSquare.push(b);
            }
        }

        square.top = topSquare;
        square.bottom = bottomSquare;
    }

    return square;
}

function makeBox(square) {
    var x, y, boxes = [];

    if (square.orient == "horizontal") {
        x = Math.min(square.hline.x1, square.hline.x2);
        if (square.top.length == 4) {
            y = Math.min(square.hline.y1, square.hline.y2) - game.gameBoard.gap;

            boxes.push(new Box(x, y));
        }
        if (square.bottom.length == 4) {
            y = Math.min(square.hline.y1, square.hline.y2);

            boxes.push(new Box(x, y));
        }
    }

    if (square.orient == "vertical") {
        y = Math.min(square.vline.y1, square.vline.y2);
        if (square.left.length == 4) {
            x = Math.min(square.vline.x1, square.vline.x2) - game.gameBoard.gap;

            boxes.push(new Box(x, y));
        }
        if (square.right.length == 4) {
            x = Math.min(square.vline.x1, square.vline.x2);

            boxes.push(new Box(x, y));
        }
    }

    let squareE;
    boxes.forEach(box => {
        squareE = createSquareUI(box);
        $('.boxG').appendChild(squareE);
        boxMade(box);
    });
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
        (dot1.x == dot2.x) &&
        (dot1.y == dot2.y)
    )
}

function dotExists(dot) {
    var dotsE = $All("circle");

    for (var d of dotsE) {
        var existingDot = new Dot(
            d.cx.baseVal.value,
            d.cy.baseVal.value
        );

        if (compareDots(dot, existingDot)) {
            return true;
        }
    }

    return false;
}

function lineNotExists(line, linelist) {

    for (let listLine of linelist) {
        if (compareLineObj(line, listLine)) {
            return false;
        }
    }

    return true;
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
        prevIndex = game.playerList.length - 1;
    } else {
        prevIndex = currIndex - 1;
    }

    if (currIndex == game.playerList.length - 1) {
        nextIndex = 0;
        nextIndex2 = 1;
    } else if (currIndex == game.playerList.length - 2) {
        nextIndex = currIndex + 1;
        nextIndex2 = 0;
    } else {
        nextIndex = currIndex + 1;
        nextIndex2 = currIndex + 2;
    }

    playerTurnList.push(game.playerList[prevIndex]);
    playerTurnList.push(game.playerList[currIndex]);
    playerTurnList.push(game.playerList[nextIndex]);
    playerTurnList.push(game.playerList[nextIndex2]);
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
    $(".curr-player-id").innerText = `ID: ${currPlayer.id}`;
    $(".curr-player-name").innerText = `Name: ${Player.getName(currPlayer)}`;
    $(".curr-player-score").innerText = `Score: ${currPlayer.score}`;
}

function winBoard() {
    $("body").classList.add("pop-up-container");

    sortPlayerByScore();
    setupPlayerRankList();
}

function sortPlayerByScore() {
    game.playerList.sort((a, b) => b.score - a.score);
}

function setupPlayerRankList() {
    const playerRankListUI = $(".playerRankList");

    playerRankListUI.innerHTML = "";
    var rank = 1;
    game.playerList.forEach((player, i, playerList) => {
        if (i > 0) {
            let prevPlayer = playerList[i - 1];

            console.log(prevPlayer, player);

            if (prevPlayer.score > player.score) {
                rank++;
            }
        }

        player.rank = rank;

        playerRankListUI.append(createRankPlayerUI(player));
    });
}
