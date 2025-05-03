function lineEsToJSON() {
    const linesE = document.querySelectorAll("svg line");
    var lines = [];

    for (let lineE of linesE) {
        lines.push(new Line(
            new Dot(
                length_to_dotCount(lineE.y1.baseVal.value),
                length_to_dotCount(lineE.x1.baseVal.value)
            ),
            new Dot(
                length_to_dotCount(lineE.y2.baseVal.value),
                length_to_dotCount(lineE.x2.baseVal.value)
            )
        ));
    }

    return lines;
}