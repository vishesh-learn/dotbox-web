function setupPlayerTurns() {
    pointerDownEvent(false);

    if (!(Game.currentGame?.players?.length > 0)) {
        console.error("No players found in memory.");

        return false;
    }

    if (Game.currentGame.currPlayerId != undefined) {
        setupPlayerTurnList();

        if (Game.currentGame.currPlayer.isAlgo) {
            setupPlayerTurnListUI();
        } else {
            slideLeft();
        }
    } else {
        Game.currentGame.currPlayerId = Game.currentGame.players[0].id;

        setupPlayerTurnList();
        setupPlayerTurnListUI();
    }

    if (Game.currentGame.currPlayer.isAlgo) {
        requestAnimationFrame(autoDrawLine);
    } else {
        pointerDownEvent(true);
    }
}

function getAllPossibleLines() {
    let dotEs = document.querySelectorAll(".dot"), validFinalDots, dot1, dot2;

    for (var dotE of dotEs) {
        dot1 = new Dot(
            Number((dotE as HTMLElement).dataset.col),
            Number((dotE as HTMLElement).dataset.row),
        );

        validFinalDots = getSurroundingDots(dot1);

        for (dot2 of validFinalDots) {
            var possibleLine = new Line(dot1, dot2);

            if (lineNotExists(possibleLine, state.allPossibleLines)) {
                state.allPossibleLines.push(possibleLine);
            }
        }
    }

    return state.allPossibleLines;
}

function refreshPendingPossibleLines() {
    state.pendingPossiblelines = state.allPossibleLines.filter((line) => {
        return lineNotExists(line, lineEsToJSON());
    });

    return state.pendingPossiblelines;
}
