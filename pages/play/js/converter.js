const lineEsToJSON = () => {
    const linesE = document.querySelectorAll("svg line");
    var lines = [];

    for (let lineE of linesE) {
        lines.push(new Line(lineE.x1.baseVal.value, lineE.y1.baseVal.value, lineE.x2.baseVal.value, lineE.y2.baseVal.value));
    }

    return lines;
}