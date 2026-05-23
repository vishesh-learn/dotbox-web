var playerTurnList: Player[] = [];

window.onload = () => {
    document.querySelector("#homeButton").addEventListener("click", () => window.location.href = pages.index);

    Game.load();

    console.log("currentGame", Game.currentGame);

    footerInfo();

    Game.currentGame.currPage = pages.play;

    gameBoardBuilder();

    getAllPossibleLines();

    // refreshGameLines();

    loadingStartUI();

    setTimeout(() => {
        updateLinesAndBoxesUI();

        refreshPendingPossibleLines();

        if (isEnd()) {
            winBoard();
        }

        loadingEndUI();

        setupPlayerTurns();

        setCurrPlayerInfo();

        play_tooltip_init();
    }, 0);

    document.querySelector(".playerTurnList").addEventListener("transitionend", setupPlayerTurnListUI);

    document.querySelector("#replayButton").addEventListener("click", replay);

    document.querySelector("#newGameButton").addEventListener("click", resetGame);

    document.querySelector(".button.home").addEventListener("click", () => window.location.href = pages.index);

    keyOnTabIndex();

    gameBoardOverFlow();
    addEventListener("resize", gameBoardOverFlow);
}

function play_tooltip_init() {
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

function replay() {
    Game.currentGame.reset();

    window.location.reload();
}

function resetGame() {
    Game.currentGame.reset();

    window.location.href = pages.setBoard;
}

function footerInfo() {
    const rowColInfoHtml = document.querySelector('.rowAndCol .value');

    rowColInfoHtml.innerHTML = `${Game.currentGame.gameBoard.col} x ${Game.currentGame.gameBoard.row}`;
}

function linePreview(event) {
    var x = event.offsetX, y = event.offsetY;

    if (!state.initDot) {
        return false;
    }

    var left = state.initDot.x - Game.currentGame.gameBoard.gap;
    var top = state.initDot.y - Game.currentGame.gameBoard.gap;
    var bottom = state.initDot.y + Game.currentGame.gameBoard.gap;
    var right = state.initDot.x + Game.currentGame.gameBoard.gap;

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

    line.byPlayerID = Game.currentGame.currPlayerId;
    line.prev = true;
    document.querySelector(".lineSVG").appendChild(line.svg as Node);
}

function removePrevLines() {
    document.querySelectorAll(".preview").forEach(line => line.remove());
}

function updateLinesAndBoxesUI() {
    const lineSVG = document.querySelector(".lineSVG");
    const boxesContainer = document.querySelector('.boxG');

    const lineUIs = Game.currentGame.lines.map(line => line.svg);

    lineSVG.append(...lineUIs as Node[]);

    const boxeUIs = Game.currentGame.boxes.map(box => createSquareUI(box));

    boxesContainer.append(...boxeUIs);
}

function updateBoxesUI(boxList) {
    Game.currentGame.players.forEach(player => {
        player.score = boxList.filter(box => box.byLine.byPlayer == player).length;
    });

    setCurrPlayerInfo();
}

function addLine(line: Line) {
    if (!line.findHTMLElement()) {
        Game.currentGame.lines.push(line);

        drawLine(line);
    } else {
        console.log('line exists');
    }

    state.initDot = undefined;
    state.selectedDot = null;
}

function drawLine(line: Line) {
    const lineSVG = document.querySelector(".lineSVG");

    let lineUI = line.svg;

    lineSVG.appendChild(lineUI as Node);

    let surroundingLines = getSurroundingLines(line);

    makeBox(surroundingLines, line);

    lineMade(line);

    updateBoxesUI(Game.currentGame.boxes);
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
            y = Math.min(square.hline.y1, square.hline.y2) - Game.currentGame.gameBoard.gap;

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
            x = Math.min(square.vline.x1, square.vline.x2) - Game.currentGame.gameBoard.gap;

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
    if (boxNotExists(box, Game.currentGame.boxes)) {
        Game.currentGame.boxes.push(box);

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

    var currIndex = Game.currentGame.players.findIndex(player => player.id == Game.currentGame.currPlayerId);
    var prevIndex: number, nextIndex: number, nextIndex2: number;

    prevIndex = currIndex === 0 ? Game.currentGame.players.length - 1 : currIndex - 1;
    let lastIndex = Game.currentGame.players.length - 1;

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
        Game.currentGame.players[prevIndex],
        Game.currentGame.players[currIndex],
        Game.currentGame.players[nextIndex],
        Game.currentGame.players[nextIndex2]
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
    if (!Game?.currentGame?.currPlayer) {
        console.error('currPlayer not found for game', Game.currentGame);
        return false;
    }

    (document.querySelector('.curr-player-id .value') as HTMLElement).innerText = `${Game.currentGame.currPlayer.id}`;
    (document.querySelector('.curr-player-name .value') as HTMLElement).innerText = `${Game.currentGame.currPlayer.placeholderName}`;
    (document.querySelector('.curr-player-score .value') as HTMLElement).innerText = `${Game.currentGame.currPlayer.score}`;
}

function winBoard() {
    updateBoxesUI(Game.currentGame.boxes);

    requestAnimationFrame(() => {
        document.querySelector("dialog").showModal();
        document.querySelector("body").classList.add("winBoard-container");

        sortPlayerByScore();
        setupPlayerRankList();
    });
}

function sortPlayerByScore() {
    Game.currentGame.players.sort((a, b) => b.score - a.score);
}

function setupPlayerRankList() {
    const playerRankListUI = document.querySelector(".playerRankList");

    playerRankListUI.innerHTML = "";
    var rank = 1;
    Game.currentGame.players.forEach((player, i, players) => {
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
