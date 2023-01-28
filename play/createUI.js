function createPlayerUI(player) {
    const playerUI = document.createElement("div");
    playerUI.classList = "player";

    const avatarUI = document.createElement("div");
    avatarUI.classList = "avatar";
    avatarUI.style.backgroundColor = player.color;
    playerUI.append(avatarUI);

    const playerName = document.createElement("div");
    playerName.classList = "playerName";
    playerName.innerText = Player.getName(player);
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
    playerName.innerText = Player.getName(player);
    playerUI.append(playerName);

    const score = document.createElement("div");
    score.classList = "score";
    score.innerText = player.score;
    playerUI.append(score);

    return playerUI;
}

function createSquareUI(xy){
    const svg = $(".boxSVG"), group = $('.boxDefs');

    if(xy.x && xy.y){
        var squareE = $cENS("rect");
        squareE.setAttribute("class", "winBox");
        squareE.setAttribute("x", xy.x);
        squareE.setAttribute("y", xy.y);
        squareE.setAttribute("width", gameBoard.gap);
        squareE.setAttribute("height", gameBoard.gap);

        if(currPlayer.color){
            //squareE.style.fill = currPlayer.color;

            var gradientUI = createGradientUI(xy);
            group.appendChild(gradientUI);
            squareE.style.fill = `url(#${gradientUI.id})`;
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

function createGradientUI(xy) {
    const gradientUI = $cENS('radialGradient');
    gradientUI.setAttribute('id', `x${xy.x}y${xy.y}`);

    gradientUI.appendChild(createStopUI('60%', hueString(currPlayer.hue, '70%', "70%")));
    gradientUI.appendChild(createStopUI('100%', hueString(currPlayer.hue, '70%', "50%")));

    return gradientUI;
}

function createStopUI(offset, stopColor) {
    const stopUI = $cENS('stop');
    stopUI.setAttribute('offset', offset);
    stopUI.style.stopColor = stopColor;

    return stopUI;
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

                //dot.setAttribute("r", "7");
                dot.setAttribute("cx", cx);
                dot.setAttribute("cy", cy);
                
                svg.appendChild(dot);
            }
        }
    }

    svgResize();

    getAllPossibleLines();
}

function getSVGLine(theClass, line){
    let lineE = $cENS("line");

    lineE.setAttribute("class", theClass);

    lineE.setAttribute("x1", line.x1);
    lineE.setAttribute("y1", line.y1);
    lineE.setAttribute("x2", line.x2);
    lineE.setAttribute("y2", line.y2);

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