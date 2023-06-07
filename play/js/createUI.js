function createPlayerUI(player) {
    if (!player) {
        console.trace("no player");

        return false;
    }

    const playerUI = document.createElement("div");
    playerUI.classList = "player";

    const avatarUI = document.createElement("div");
    avatarUI.classList = "avatar";
    avatarUI.style.backgroundColor = player.color;
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
    avatarUI.style.backgroundColor = player.color;
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

    dots.forEach(dot => dot.remove());

    if (currGame.gameBoard.row >= 2 && currGame.gameBoard.col >= 2) {
        for (let i = 0; i < currGame.gameBoard.row; i++) {
            for (let j = 0; j < currGame.gameBoard.col; j++) {
                cx = (currGame.gameBoard.gap * j + currGame.gameBoard.svgPaddingX).toString();
                cy = (currGame.gameBoard.gap * i + currGame.gameBoard.svgPaddingY).toString();

                let dot = document.createElementNS('http://www.w3.org/2000/svg', "circle");
                dot.setAttribute("class", "dot");

                dot.setAttribute("cx", cx);
                dot.setAttribute("cy", cy);

                svg.appendChild(dot);
            }
        }
    }

    svgResize();
}

function createSquareUI(box, line) {
    if (box.x && box.y) {
        var squareE = document.createElementNS('http://www.w3.org/2000/svg', "rect");
        squareE.setAttribute("class", "winBox");
        squareE.setAttribute("x", box.x);
        squareE.setAttribute("y", box.y);
        squareE.setAttribute("width", currGame.gameBoard.gap);
        squareE.setAttribute("height", currGame.gameBoard.gap);

        if (line.byPlayer.color) {
            squareE.style.fill = line.byPlayer.color;

            var gradientUI = createGradientUI(box, line);
            document.querySelector('.boxDefs').appendChild(gradientUI);
            squareE.style.fill = `url(#${gradientUI.id})`;
        }

        if (line.byPlayer.id) {
            squareE.setAttribute("byPlayer", line.byPlayer.id);
        }

        return squareE;
    }
    else {
        console.log("no xy");
    }
}

function createGradientUI(box, line) {
    const gradientUI = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
    gradientUI.setAttribute('id', `x${box.x}y${box.y}`);

    let hslO1 = hexToHslObject(line.byPlayer.color);
    hslO1.l = 50;
    let stopColor2 = hslToHex(hslO1);

    gradientUI.appendChild(createStopUI('60%', line.byPlayer.color));
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

    lineE.setAttribute("class", line.prev ? 'prevLine' : 'line');

    lineE.setAttribute("x1", line.x1);
    lineE.setAttribute("y1", line.y1);
    lineE.setAttribute("x2", line.x2);
    lineE.setAttribute("y2", line.y2);

    if (line.byPlayer.color) {
        lineE.setAttribute("stroke", line.byPlayer.color);
    } else {
        console.log("color not found");
    }

    if (line.byPlayerID) {
        lineE.setAttribute("byPlayer", line.byPlayerID);
    }

    return lineE;
}