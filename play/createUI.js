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
    const svg = $(".boxG"), group = $('.boxDefs');

    if(xy.x && xy.y){
        var squareE = $cENS("rect");
        squareE.setAttribute("class", "winBox");
        squareE.setAttribute("x", xy.x);
        squareE.setAttribute("y", xy.y);
        squareE.setAttribute("width", gameBoard.gap);
        squareE.setAttribute("height", gameBoard.gap);

        if(currPlayer.color){
            var gradientUI = createGradientUI(xy);
            group.appendChild(gradientUI);

            //squareE.setAttribute("fill", currPlayer.color);
            squareE.setAttribute("fill", `url(#${gradientUI.id})`);
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
    gradientUI.id = `x${xy.x}y${xy.y}`;

    gradientUI.appendChild(createStopUI('60%', hueString(currPlayer.hue, '70%', "70%")));
    gradientUI.appendChild(createStopUI('100%', hueString(currPlayer.hue, '70%', "50%")));

    return gradientUI;
}

function createStopUI(offset, stopColor) {
    const stopUI = $cENS('stop');
    stopUI.setAttribute('offset', offset);
    stopUI.setAttribute("stop-color", stopColor);

    return stopUI;
}