window.onload = () => {
    document.querySelector("#homeButton").addEventListener("click", goHome);

    made = new Made();

    loadCurrGame();

    currGame.currPage = pages.play;

    gameBoardBuilder();

    getAllPossibleLines();

    refreshGameLines();

    getPendingPossiblelines();

    playerTurn();

    updateLinesUI();

    setCurrPlayerInfo();

    $aEL(document.querySelector(".playerTurnList"), "transitionend", setupPlayerTurnListUI);

    $aEL(document.querySelector("#replayButton"), "click", replay);

    $aEL(document.querySelector("#newGameButton"), "click",
        () => window.location.href = `../${pages.setBoard}/${pages.indexPage}`);

    footerInfo();

    keyOnTabIndex();
}

function refreshGameLines() {
    currGame.lines = currGame.lines.filter(line => {
        let playerExists = currGame.playerList.some(player => player.id == line.byPlayerID);

        let isNotPossibleLine = lineNotExists(line, allPossibleLines);

        return playerExists && !isNotPossibleLine;
    });

    saveCurrGame();
}

function replay() {
    resetGame();
    window.location.reload();
}

function goHome() {
    window.location.href = `../${pages.indexPage}`;
}

function footerInfo() {
    const rowColInfoHtml = document.querySelector('.rowAndCol');

    rowColInfoHtml.innerHTML = `Board: ${currGame.gameBoard.col} x ${currGame.gameBoard.row}`;
}

function linePrev(event) {
    var x = event.offsetX, y = event.offsetY;

    if (initDot) {
        var left = initDot.x - currGame.gameBoard.gap;
        var top = initDot.y - currGame.gameBoard.gap;
        var bottom = initDot.y + currGame.gameBoard.gap;
        var right = initDot.x + currGame.gameBoard.gap;

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
        initDot.y - currGame.gameBoard.gap,
        'top'
    );

    var right = new Dot(
        initDot.x + currGame.gameBoard.gap,
        initDot.y,
        "right",
    );

    var bottom = new Dot(
        initDot.x,
        initDot.y + currGame.gameBoard.gap,
        "bottom",
    );

    var left = new Dot(
        initDot.x - currGame.gameBoard.gap,
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

function prevLineMaker(line) {
    removePrevLines();

    line.byPlayerID = currPlayer.id;
    line.prev = true;
    document.querySelector(".lineSVG").appendChild(getSVGLine(line));
}

function svgResize() {
    const svgList = document.querySelectorAll(".svgC svg");

    var width = ((currGame.gameBoard.col - 1) * currGame.gameBoard.gap) + (currGame.gameBoard.svgPaddingX * 2);
    var height = ((currGame.gameBoard.row - 1) * currGame.gameBoard.gap) + (currGame.gameBoard.svgPaddingY * 2);

    svgList.forEach(svg => {
        svg.style.width = `${width}px`;
        svg.style.height = `${height}px`;
    });
}

function addLine(line) {
    if (line && lineNotExists(line, currGame.lines)) {
        currGame.lines.push(line);

        updateLinesUI();
    } else {
        console.log('line exists');
    }

    initDot = undefined;
}

function updateLinesUI() {
    const lineSVG = document.querySelector(".lineSVG");

    currGame.playerList.forEach(player => {
        player.score = 0;
    });

    currGame.lines.forEach(line => {
        let DOMLines = lineEsToJSON();

        if (lineNotExists(line, DOMLines)) {
            lineSVG.appendChild(getSVGLine(line));

            makeBox(getSurroundingLines(line), line);

            lineMade(line);
        }
    });

    updateBoxesUI(boxes);
}

function updateBoxesUI(boxes) {
    currGame.playerList.forEach(player => {
        player.score = boxes.filter(box => box.byLine.byPlayer == player).length;
    });

    setCurrPlayerInfo();
}

function getBoxMakingLines(line) {
    if (line.orient == "vertical") {
        var left = new Line(
            line.x1 - currGame.gameBoard.gap,
            line.y1,
            line.x2 - currGame.gameBoard.gap,
            line.y2
        );

        var right = new Line(
            line.x1 + currGame.gameBoard.gap,
            line.y1,
            line.x2 + currGame.gameBoard.gap,
            line.y2
        );

        var leftTop = new Line(
            line.x1,
            line.y1,
            line.x1 - currGame.gameBoard.gap,
            line.y1
        );

        var leftBottom = new Line(
            line.x2,
            line.y2,
            line.x2 - currGame.gameBoard.gap,
            line.y2
        );

        var rightTop = new Line(
            line.x1,
            line.y1,
            line.x1 + currGame.gameBoard.gap,
            line.y1
        );

        var rightBottom = new Line(
            line.x2,
            line.y2,
            line.x2 + currGame.gameBoard.gap,
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
            line.y1 - currGame.gameBoard.gap,
            line.x2,
            line.y2 - currGame.gameBoard.gap
        );

        var topRight = new Line(
            line.x2,
            line.y2,
            line.x2,
            line.y2 - currGame.gameBoard.gap
        );

        var topLeft = new Line(
            line.x1,
            line.y1,
            line.x1,
            line.y1 - currGame.gameBoard.gap
        );

        var bottomRight = new Line(
            line.x2,
            line.y2,
            line.x2,
            line.y2 + currGame.gameBoard.gap
        );

        var bottom = new Line(
            line.x1,
            line.y1 + currGame.gameBoard.gap,
            line.x2,
            line.y2 + currGame.gameBoard.gap
        );

        var bottomLeft = new Line(
            line.x1,
            line.y1,
            line.x1,
            line.y1 + currGame.gameBoard.gap
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
    var existingLineList = lineEsToJSON();
    var boxMakingLines = getBoxMakingLines(line);
    var square = new Object();

    if (line.orient == "vertical") {
        square.orient = "vertical";
        var leftSquare = [];
        var rightSquare = [];

        square.vline = line;
        existingLineList.forEach(existingLine => {
            boxMakingLines.leftBoxMakingLines.forEach(boxMakingLine => {
                if (compareLineObj(existingLine, boxMakingLine) && !leftSquare.includes(boxMakingLine))
                    leftSquare.push(boxMakingLine);
            });

            boxMakingLines.rightBoxMakingLines.forEach(boxMakingLine => {
                if (compareLineObj(existingLine, boxMakingLine) && !rightSquare.includes(boxMakingLine))
                    rightSquare.push(boxMakingLine);
            });
        });

        square.left = leftSquare;
        square.right = rightSquare;
    }

    if (line.orient == "horizontal") {
        square.orient = "horizontal";
        var topSquare = [];
        var bottomSquare = [];

        square.hline = line;

        existingLineList.forEach(existingLine => {
            boxMakingLines.topBoxMakingLines.forEach(boxMakingLine => {
                if (compareLineObj(existingLine, boxMakingLine) && !topSquare.includes(boxMakingLine))
                    topSquare.push(boxMakingLine);
            });

            boxMakingLines.bottomBoxMakingLines.forEach(boxMakingLine => {
                if (compareLineObj(existingLine, boxMakingLine) && !bottomSquare.includes(boxMakingLine))
                    bottomSquare.push(boxMakingLine);
            });
        });

        square.top = topSquare;
        square.bottom = bottomSquare;
    }

    return square;
}

function makeBox(square, line) {
    var x, y, currBoxes = [];

    if (square.orient == "horizontal") {
        x = Math.min(square.hline.x1, square.hline.x2);
        if (square.top.length == 4) {
            y = Math.min(square.hline.y1, square.hline.y2) - currGame.gameBoard.gap;

            currBoxes.push(new Box(x, y, line));
        }
        if (square.bottom.length == 4) {
            y = Math.min(square.hline.y1, square.hline.y2);

            currBoxes.push(new Box(x, y, line));
        }
    }

    if (square.orient == "vertical") {
        y = Math.min(square.vline.y1, square.vline.y2);
        if (square.left.length == 4) {
            x = Math.min(square.vline.x1, square.vline.x2) - currGame.gameBoard.gap;

            currBoxes.push(new Box(x, y, line));
        }
        if (square.right.length == 4) {
            x = Math.min(square.vline.x1, square.vline.x2);

            currBoxes.push(new Box(x, y, line));
        }
    }

    currBoxes.forEach(addBox);
}

function addBox(box) {
    if (boxNotExists(box, boxes)) {
        boxes.push(box);
        let squareE = createSquareUI(box);
        document.querySelector('.boxG').appendChild(squareE);
        boxMade(box);
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
    );
}

function compareDots(dot1, dot2) {
    return (dot1.x == dot2.x) && (dot1.y == dot2.y);
}

function dotExists(dot) {
    var dotsE = document.querySelectorAll("circle"), existingDot;

    for (const existingDotUI of dotsE) {
        existingDot = new Dot(
            existingDotUI.cx.baseVal.value,
            existingDotUI.cy.baseVal.value
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

function boxNotExists(box, boxList) {
    for (let listBox of boxList) {
        if (compareBoxObj(box, listBox)) {
            return false;
        }
    }

    return true;
}

function compareBoxObj(box1, box2) {
    return (box1.x == box2.x) && (box1.y == box2.y);
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

function resetBoardUI() {
    var linesE = document.querySelectorAll(".line");
    var squaresE = document.querySelectorAll(".winBox");

    [...squaresE, ...linesE].forEach(element => element.remove());
}

function setupPlayerTurnList() {
    playerTurnList = [];
    var currIndex = currPlayer.id - 1;

    prevIndex = currIndex === 0 ? currGame.playerList.length - 1 : currIndex - 1;

    if (currIndex === currGame.playerList.length - 1) {
        nextIndex = 0;
    } else {
        nextIndex = currIndex + 1;
    }

    if (nextIndex === currGame.playerList.length - 1) {
        nextIndex2 = 0;
    } else {
        nextIndex2 = nextIndex + 1;
    }

    playerTurnList.push(
        currGame.playerList[prevIndex],
        currGame.playerList[currIndex],
        currGame.playerList[nextIndex],
        currGame.playerList[nextIndex2]
    );
}

function slideLeft() {
    const frame = document.querySelector(".playerTurnList");

    frame.classList.add("slideLeft");
}

function setupPlayerTurnListUI() {
    const frame = document.querySelector(".playerTurnList");
    var playerUI;

    frame.innerHTML = "";
    playerTurnList.forEach(player => {
        playerUI = createPlayerUI(player);

        frame.append(playerUI);
    });

    frame.classList.remove("slideLeft");

    setCurrPlayerInfo();
}

function setCurrPlayerInfo() {
    document.querySelector(".curr-player-id").innerText = `ID: ${currPlayer.id}`;
    document.querySelector(".curr-player-name").innerText = `Name: ${currPlayer.placeholderName}`;
    document.querySelector(".curr-player-score").innerText = `Score: ${currPlayer.score}`;
}

function winBoard() {
    updateBoxesUI(boxes);

    document.querySelector("body").classList.add("pop-up-container");

    sortPlayerByScore();
    setupPlayerRankList();
}

function sortPlayerByScore() {
    currGame.playerList.sort((a, b) => b.score - a.score);
}

function setupPlayerRankList() {
    const playerRankListUI = document.querySelector(".playerRankList");

    playerRankListUI.innerHTML = "";
    var rank = 1;
    currGame.playerList.forEach((player, i, playerList) => {
        if (i > 0) {
            let prevPlayer = playerList[i - 1];

            if (prevPlayer.score > player.score) {
                rank++;
            }
        }

        player.rank = rank;

        playerRankListUI.append(createRankPlayerUI(player));
    });
}
