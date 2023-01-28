function dotEToJSON(dotE){
    return {
        "cx": dotE.cx.baseVal.value,
        "cy": dotE.cy.baseVal.value
    }
}

function lineEToJSON(lineE){
    return {
            "x1": lineE.x1.baseVal.value,
            "y1": lineE.y1.baseVal.value,
            "x2": lineE.x2.baseVal.value,
            "y2": lineE.y2.baseVal.value
        };
}

const lineEsToJSON = () => {
    const linesE = $All("svg line");
    var lines = [];

    for(let lineE of linesE){
        lines.push(lineEToJSON(lineE));
    }

    return lines;
}