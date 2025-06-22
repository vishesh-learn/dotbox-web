//this file contains function that need to run only once per load to set up gameplay.

function getAllPossibleLines() {
    let dotEs = document.querySelectorAll(".dot"), validFinalDots, dot1, dot2;

    for (var dotE of dotEs) {
        dot1 = new Dot(
            Number(dotE.dataset.col),
            Number(dotE.dataset.row),
        );

        validFinalDots = getSurroundingDots(dot1);

        for (dot2 of validFinalDots) {
            var possibleLine = new Line(
                dot1, dot2
            );

            if (lineNotExists(possibleLine, allPossibleLines)) {
                allPossibleLines.push(possibleLine);
            }
        }
    }

    return allPossibleLines;
}

function getPendingPossiblelines() {
    pendingPossiblelines = allPossibleLines.filter((line) => {
        return lineNotExists(line, lineEsToJSON());
    });
    
    return pendingPossiblelines;
}