function createPlayerUI(player) {
    if (!player) {
        console.trace("no player");

        return false;
    }

    const playerUI = document.createElement("div");
    playerUI.classList = "player";

    const avatarUI = document.createElement("div");
    avatarUI.classList = "avatar";
    avatarUI.style.background = toRadialGradientCSSValue(player.color) || player.color;
    playerUI.append(avatarUI);

    const playerName = document.createElement("div");
    playerName.classList = "playerName";
    playerName.innerText = player.placeholderName;
    playerUI.append(playerName);

    return playerUI;
}

function createRankPlayerUI(player) {
    const playerUI = document.createElement("div");
    playerUI.classList = "player";

    const rank = document.createElement("div");
    rank.classList = "rank";
    rank.innerText = player.rank;
    playerUI.append(rank);

    const avatarUI = document.createElement("div");
    avatarUI.classList = "avatar";
    avatarUI.style.background = toRadialGradientCSSValue(player.color) || player.color;
    playerUI.append(avatarUI);

    const playerName = document.createElement("div");
    playerName.classList = "playerName";
    playerName.innerText = player.placeholderName;
    playerUI.append(playerName);

    const score = document.createElement("div");
    score.classList = "score";
    score.innerText = player.score;
    playerUI.append(score);

    return playerUI;
}

function gameBoardBuilder() {
    var cx, cy;
    var svg = document.querySelector(".dotSVG");
    var dots = document.querySelectorAll("circle");

    let dotRadius = getDotRadius();

    dots.forEach(dot => dot.remove());

    for (let i = 0; i < Game.currentGame.gameBoard.row; i++) {
        const row = i + 1;

        for (let j = 0; j < Game.currentGame.gameBoard.col; j++) {
            const col = j + 1;

            cx = (Game.currentGame.gameBoard.gap * j + dotRadius).toString();
            cy = (Game.currentGame.gameBoard.gap * i + dotRadius).toString();

            let dot = createDotUI(cx, cy, row, col);

            svg.appendChild(dot);
        }
    }

    svgResize();
}

function createDotUI(cx, cy, row, col) {
    var dotElement = document.createElementNS('http://www.w3.org/2000/svg', "circle");
    dotElement.setAttribute("class", "dot");

    dotElement.setAttribute("tabindex", "0");

    dotElement.setAttribute("cx", cx);
    dotElement.setAttribute("cy", cy);

    dotElement.setAttribute("data-row", row);
    dotElement.setAttribute("data-col", col);

    return dotElement;
}

function createSquareUI(box) {
    if (box.x && box.y) {
        var squareE = document.createElementNS('http://www.w3.org/2000/svg', "rect");
        squareE.setAttribute("class", "winBox");
        squareE.setAttribute("x", box.x);
        squareE.setAttribute("y", box.y);
        squareE.setAttribute("width", Game.currentGame.gameBoard.gap.toString());
        squareE.setAttribute("height", Game.currentGame.gameBoard.gap.toString());

        if (box?.byLine?.byPlayer?.color) {
            squareE.style.fill = box.byLine.byPlayer.color;

            var gradientUI = createGradientUI(box);
            document.querySelector('.boxDefs').appendChild(gradientUI);
            squareE.style.fill = `url(#${gradientUI.id})`;
        }

        if (box?.byLine?.byPlayer?.id) {
            squareE.setAttribute("byPlayer", box.byLine.byPlayer.id);
        }

        return squareE;
    }
    else {
        console.log("no xy");
    }
}

function createGradientUI(box) {
    const gradientUI = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
    gradientUI.setAttribute('id', `x${box.x}y${box.y}`);

    let hslO1 = toHslObject(box.byLine.byPlayer.color);
    hslO1.l = 50;
    let stopColor2 = hslToHex(hslO1);

    gradientUI.appendChild(createStopUI('60%', box.byLine.byPlayer.color));
    gradientUI.appendChild(createStopUI('100%', stopColor2));

    return gradientUI;
}

function createStopUI(offset, stopColor) {
    const stopUI = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stopUI.setAttribute('offset', offset);
    stopUI.style.stopColor = stopColor;
    return stopUI;
}

function getSVGLine(line) {
    let lineE = document.createElementNS('http://www.w3.org/2000/svg', "line");
    lineE.classList = "line";

    if (line.prev) {
        lineE.classList.add("preview");
    }

    lineE.setAttribute("x1", line.x1);
    lineE.setAttribute("y1", line.y1);
    lineE.setAttribute("x2", line.x2);
    lineE.setAttribute("y2", line.y2);

    if (!line.byPlayerID) {
        console.log("no byPlayerID", line.byPlayerID);

        return false;
    }

    if (line?.byPlayer?.color) {
        lineE.setAttribute("stroke", line.byPlayer.color);
    } else {
        console.log("color not found");
    }

    lineE.setAttribute("byPlayer", line.byPlayerID);

    line.dot1.row && lineE.setAttribute("data-dot1-row", line.dot1.row);
    line.dot1.col && lineE.setAttribute("data-dot1-col", line.dot1.col);
    line.dot2.row && lineE.setAttribute("data-dot2-row", line.dot2.row);
    line.dot2.col && lineE.setAttribute("data-dot2-col", line.dot2.col);

    return lineE;
}

function svgResize() {
    let dotRadius = getDotRadius();

    var width = ((Game.currentGame.gameBoard.col - 1) * Game.currentGame.gameBoard.gap) + (2 * dotRadius);
    var height = ((Game.currentGame.gameBoard.row - 1) * Game.currentGame.gameBoard.gap) + (2 * dotRadius);

    document.documentElement.style.setProperty('--boardWidth', `${width}px`);
    document.documentElement.style.setProperty('--boardHeight', `${height}px`);
}
