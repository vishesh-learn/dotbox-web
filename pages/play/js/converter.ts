import { Line } from '../../../common/js/classes.js';

export function lineEsToJSON() {
    const lineElements = document.querySelectorAll("svg line");

    var lines = Array.from(lineElements).map(Line.constructorFromElement);

    return lines;
}
