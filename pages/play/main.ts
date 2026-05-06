var boxes: any[] = [];
var playerTurnList: any[] = [];

window.onload = () => {
    document.querySelector("#homeButton").addEventListener("click", goHome);

    Game.load();

    footerInfo();

    Game.currGame.currPage = pages.play;

    gameBoardBuilder();

    getAllPossibleLines();

    refreshGameLines();

    getPendingPossiblelines();

    loadingStartUI();

    setTimeout(() => {
        updateLinesUI();

        loadingEndUI();

        playerTurn(true);

        setCurrPlayerInfo();

        tooltip_init();
    }, 0);

    document.querySelector(".playerTurnList").addEventListener("transitionend", setupPlayerTurnListUI);

    document.querySelector("#replayButton").addEventListener("click", replay);

    document.querySelector("#newGameButton").addEventListener("click", newGame);

    document.querySelector(".button.home").addEventListener("click", goHome);

    keyOnTabIndex();

    gameBoardOverFlow();
    addEventListener("resize", gameBoardOverFlow);
}

function tooltip_init() {
    ElementGuide.data = [
        new ElementGuide(".svgC", "Drag between two dots to draw your line!"),
        new ElementGuide("#homeButton", "Return to the main menu")
    ];

    document.querySelector("#guide")?.addEventListener("click", ElementGuide.nextState);

    const tooltipPlayedKey = "tooltip played once for play page";
    if (!localStorage.getItem(tooltipPlayedKey)) {
        ElementGuide.nextState();

        localStorage.setItem(tooltipPlayedKey, 'true');
    }
}

function gameBoardOverFlow() {
    let pageContentSize = getComputedSize(document.querySelector(".page-content"));
    let boardSize = getComputedSize(document.querySelector(".svgC"));

    if (boardSize.width > pageContentSize.width) {
        document.documentElement.style.setProperty('--align-x-board', `flex-start`);
    } else {
        document.documentElement.style.setProperty('--align-x-board', `center`);
    }

    if (boardSize.height > pageContentSize.height) {
        document.documentElement.style.setProperty('--align-y-board', `flex-start`);
    } else {
        document.documentElement.style.setProperty('--align-y-board', `space-evenly`);
    }
}

function refreshGameLines() {
    Game.currGame.lines = Game.currGame.lines.filter(line => {
        let playerExists = Game.currGame.players.some(player => player.id == line.byPlayerID);

        let isNotPossibleLine = lineNotExists(line, state.allPossibleLines);

        return playerExists && !isNotPossibleLine;
    });

    Game.currGame.save();
}

function replay() {
    Game.currGame.reset();

    window.location.reload();
}

function newGame() {
    Game.currGame.reset();

    window.location.href = pages.setBoard;
}

function goHome() {
    window.location.href = pages.index;
}

function footerInfo() {
    const rowColInfoHtml = document.querySelector('.rowAndCol .value');

    rowColInfoHtml.innerHTML = `${Game.currGame.gameBoard.col} x ${Game.currGame.gameBoard.row}`;
}

function linePreview(event) {
    var x = event.offsetX, y = event.offsetY;

    if (!state.initDot) {
        return false;
    }

    var left = state.initDot.x - Game.currGame.gameBoard.gap;
    var top = state.initDot.y - Game.currGame.gameBoard.gap;
    var bottom = state.initDot.y + Game.currGame.gameBoard.gap;
    var right = state.initDot.x + Game.currGame.gameBoard.gap;

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

    var pseudoDot = new PseudoDot(x, y);

    prevLineMaker(
        new Line(state.initDot, pseudoDot)
    );
}

function nearDot(x, y) {
    var validFinalDots = getSurroundingDots(state.initDot);

    var nearest = validFinalDots[0];
    for (var dot of validFinalDots) {
        let cx = dot.x;
        let cy = dot.y;

        let oldcx = nearest.x;
        let oldcy = nearest.y;

        let x_cx = Math.abs(x - cx);
        let y_cy = Math.abs(y - cy);

        let oldxcx = Math.abs(x - oldcx);
        let oldycy = Math.abs(y - oldcy);

        if ((x_cx <= oldxcx) && y_cy <= oldycy) {
            nearest = dot;
        }
    }

    return nearest;
}

function nearestDot(x, y) {
    var dotEs = document.querySelectorAll(".dot");

    let dotDiffs = [...dotEs].map(dotE => ({
        element: dotE,
        Xdiff: Math.abs(x - (dotE as SVGCircleElement).cx.baseVal.value),
        Ydiff: Math.abs(y - (dotE as SVGCircleElement).cy.baseVal.value)
    }));

    let minXValue = Math.min(...dotDiffs.map(dotDiff => dotDiff.Xdiff));

    let minXdotDiffs = dotDiffs.filter(dotDiff => dotDiff.Xdiff == minXValue);

    let minYValue = Math.min(...minXdotDiffs.map(minXdotDiff => minXdotDiff.Ydiff));

    let minXYdotDiff = minXdotDiffs.find(minXdotDiff => minXdotDiff.Ydiff == minYValue);

    return minXYdotDiff?.element;
}

function prevLineMaker(line) {
    removePrevLines();

    line.byPlayerID = Game.currGame.currPlayerId;
    line.prev = true;
    document.querySelector(".lineSVG").appendChild(getSVGLine(line) as Node);
}

function removePrevLines() {
    document.querySelectorAll(".preview").forEach(line => line.remove());
}

function updateLinesUI() {
    Game.currGame.players.forEach(player => {
        player.score = 0;
    });

    Game.currGame.lines.forEach((line, index) => {
        drawLine(line);
    });
}

function updateBoxesUI(boxList) {
    Game.currGame.players.forEach(player => {
        player.score = boxList.filter(box => box.byLine.byPlayer == player).length;
    });

    setCurrPlayerInfo();
}

function addLine(line: Line) {
    if (!line.findHTMLElement()) {
        Game.currGame.lines.push(line);

        drawLine(line);
    } else {
        console.log('line exists');
    }

    state.initDot = undefined;
    state.selectedDot = null;
}

function drawLine(line: Line) {
    const lineSVG = document.querySelector(".lineSVG");

    let lineUI = getSVGLine(line);

    lineSVG.appendChild(lineUI as Node);

    let surroundingLines = getSurroundingLines(line);

    makeBox(surroundingLines, line);

    lineMade(line);

    updateBoxesUI(boxes);
}

function getBoxMakingLines(line) {
    let newVersionOfLine = Line.constructFromOldLine(line);

    if (line.orient == "vertical") {
        let left = Line.constructFromOldLine(line);
        left.dot1.col -= 1;
        left.dot2.col -= 1;

        let leftTop = Line.constructFromOldLine(line);
        leftTop.dot2.row = leftTop.dot1.row;
        leftTop.dot2.col -= 1;

        let leftBottom = Line.constructFromOldLine(line);
        leftBottom.dot1.row = leftBottom.dot2.row;
        leftBottom.dot1.col -= 1;

        let right = Line.constructFromOldLine(line);
        right.dot1.col += 1;
        right.dot2.col += 1;

        let rightTop = Line.constructFromOldLine(line);
        rightTop.dot2.row = rightTop.dot1.row;
        rightTop.dot2.col += 1;

        let rightBottom = Line.constructFromOldLine(line);
        rightBottom.dot1.row = rightBottom.dot2.row;
        rightBottom.dot1.col += 1;

        return {
            'line': newVersionOfLine,
            "orient": newVersionOfLine.orient,
            "leftBoxMakingLines": { left, leftBottom, leftTop, current: newVersionOfLine },
            "rightBoxMakingLines": { current: newVersionOfLine, rightBottom, right, rightTop }
        };

    } else if (line.orient == "horizontal") {
        let top = Line.constructFromOldLine(line);
        top.dot1.row -= 1;
        top.dot2.row -= 1;

        let topRight = Line.constructFromOldLine(line);
        topRight.dot1.col = topRight.dot2.col;
        topRight.dot1.row = topRight.dot2.row - 1;

        let topLeft = Line.constructFromOldLine(line);
        topLeft.dot2.col = topLeft.dot1.col;
        topLeft.dot2.row = topLeft.dot1.row - 1;

        let bottom = Line.constructFromOldLine(line);
        bottom.dot1.row += 1;
        bottom.dot2.row += 1;

        let bottomRight = Line.constructFromOldLine(line);
        bottomRight.dot1.col = bottomRight.dot2.col;
        bottomRight.dot1.row = bottomRight.dot2.row + 1;

        let bottomLeft = Line.constructFromOldLine(line);
        bottomLeft.dot2.col = bottomLeft.dot1.col;
        bottomLeft.dot2.row = bottomLeft.dot1.row + 1;

        return {
            'line': newVersionOfLine,
            "orient": newVersionOfLine.orient,
            "topBoxMakingLines": { top, topRight, topLeft, current: newVersionOfLine },
            "bottomBoxMakingLines": { current: newVersionOfLine, bottomRight, bottom, bottomLeft }
        };
    }
}

function getSurroundingLines(line) {
    var existingLineList = lineEsToJSON();
    var boxMakingLines = getBoxMakingLines(line);
    var square: any = {};

    if (line.orient == "vertical") {
        square.orient = "vertical";
        var leftSquare = [];
        var rightSquare = [];

        square.vline = line;

        existingLineList.forEach(existingLine => {
            Object.values(
                boxMakingLines.leftBoxMakingLines
            ).forEach(boxMakingLine => {
                if (Line.compareLineObj(existingLine, boxMakingLine) && !leftSquare.includes(boxMakingLine)) {
                    leftSquare.push(boxMakingLine);
                }
            });

            Object.values(
                boxMakingLines.rightBoxMakingLines
            ).forEach(boxMakingLine => {
                if (Line.compareLineObj(existingLine, boxMakingLine) && !rightSquare.includes(boxMakingLine)) {
                    rightSquare.push(boxMakingLine);
                }
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
            Object.values(
                boxMakingLines.topBoxMakingLines
            ).forEach(boxMakingLine => {
                if (Line.compareLineObj(existingLine, boxMakingLine) && !topSquare.includes(boxMakingLine)) {
                    topSquare.push(boxMakingLine);
                }
            });

            Object.values(
                boxMakingLines.bottomBoxMakingLines
            ).forEach(boxMakingLine => {
                if (Line.compareLineObj(existingLine, boxMakingLine) && !bottomSquare.includes(boxMakingLine)) {
                    bottomSquare.push(boxMakingLine);
                }
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
            y = Math.min(square.hline.y1, square.hline.y2) - Game.currGame.gameBoard.gap;

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
            x = Math.min(square.vline.x1, square.vline.x2) - Game.currGame.gameBoard.gap;

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

        let squareUI = createSquareUI(box);

        document.querySelector('.boxG').appendChild(squareUI);

        boxMade(box);
    }
}

function lineNotExists(line, linelist) {
    for (let listLine of linelist) {
        if (Line.compareLineObj(line, listLine)) {
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

function setupPlayerTurnList() {
    playerTurnList = [];

    var currIndex = Game.currGame.players.findIndex(player => player.id == Game.currGame.currPlayerId);
    var prevIndex: number, nextIndex: number, nextIndex2: number;

    prevIndex = currIndex === 0 ? Game.currGame.players.length - 1 : currIndex - 1;
    let lastIndex = Game.currGame.players.length - 1;

    if (currIndex === lastIndex) {
        nextIndex = 0;
    } else {
        nextIndex = currIndex + 1;
    }

    if (nextIndex === lastIndex) {
        nextIndex2 = 0;
    } else {
        nextIndex2 = nextIndex + 1;
    }

    playerTurnList.push(
        Game.currGame.players[prevIndex],
        Game.currGame.players[currIndex],
        Game.currGame.players[nextIndex],
        Game.currGame.players[nextIndex2]
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
    if (!Game?.currGame?.currPlayer) {
        console.error('currPlayer not found for game', Game.currGame);
        return false;
    }

    (document.querySelector('.curr-player-id .value') as HTMLElement).innerText = `${Game.currGame.currPlayer.id}`;
    (document.querySelector('.curr-player-name .value') as HTMLElement).innerText = `${Game.currGame.currPlayer.placeholderName}`;
    (document.querySelector('.curr-player-score .value') as HTMLElement).innerText = `${Game.currGame.currPlayer.score}`;
}

function winBoard() {
    updateBoxesUI(boxes);

    document.querySelector("dialog").showModal();
    document.querySelector("body").classList.add("winBoard-container");

    sortPlayerByScore();
    setupPlayerRankList();
}

function sortPlayerByScore() {
    Game.currGame.players.sort((a, b) => b.score - a.score);
}

function setupPlayerRankList() {
    const playerRankListUI = document.querySelector(".playerRankList");

    playerRankListUI.innerHTML = "";
    var rank = 1;
    Game.currGame.players.forEach((player, i, players) => {
        if (i > 0) {
            let prevPlayer = players[i - 1];

            if (prevPlayer.score > player.score) {
                rank++;
            }
        }

        player.rank = rank;

        playerRankListUI.append(createRankPlayerUI(player));
    });
}
