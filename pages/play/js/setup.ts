import { Dot, Line } from '../../../common/js/classes.js';
import { getSurroundingDots } from '../../../common/js/gameBoard.js';
import { lineEsToJSON } from './converter.js';
import { state } from './data.js';
import { lineNotExists } from '../main.js';

export function getAllPossibleLines() {
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

export function getPendingPossiblelines() {
    state.pendingPossiblelines = state.allPossibleLines.filter((line) => {
        return lineNotExists(line, lineEsToJSON());
    });

    return state.pendingPossiblelines;
}
