//this file contains function that need to run only once per load to set up gameplay.

function getAllPossibleLines() {
    console.log("getting all possible lines");
    
    var dotEs = document.querySelectorAll(".dot"), validFinalDots, dot1, dot2;

    for (var dotE of dotEs) {
        dot1 = new Dot(
            Number(dotE.dataset.row),
            Number(dotE.dataset.col)
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