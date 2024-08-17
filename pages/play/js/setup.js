//this file contains function that need to run only once per load to set up gameplay.

function getAllPossibleLines() {
    var dotEs = document.querySelectorAll(".dot"), validFinalDots, dot1, dot2;

    for (var dotE of dotEs) {
        dot1 = new Dot(
            dotE.cx.baseVal.value,
            dotE.cy.baseVal.value
        );

        validFinalDots = getSurroundingDots(dot1);

        for (dot2 of validFinalDots) {
            var possibleLine = new Line(
                dot1.x, dot1.y, dot2.x, dot2.y
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