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

function getPendingPossiblelines() {
    state.pendingPossiblelines = state.allPossibleLines.filter((line) => {
        return lineNotExists(line, lineEsToJSON());
    });

    return state.pendingPossiblelines;
}
