function dotEToJSON(dotE){
    return {
        "cx": dotE.cx.baseVal.value,
        "cy": dotE.cy.baseVal.value
    }
}

const lineEsToJSON = () => {
    const linesE = $All("svg line");
    var lines = [];

    for(let lineE of linesE){
        lines.push(new Line(lineE.x1.baseVal.value, lineE.y1.baseVal.value, lineE.x2.baseVal.value, lineE.y2.baseVal.value));
    }

    return lines;
}