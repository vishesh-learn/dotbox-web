//this file contains function that need to run only once per load to set up gameplay.

function getAllPossibleLines(){
    var dotEs = $All(".dot");

    for(var dotE of dotEs){
        var dot1 = dotEToJSON(dotE);
        var validFinalDots = getValidFinalDots(dot1);

        for(var dot2 of validFinalDots){
            var possibleLine = new Line(dot1.cx, dot1.cy, dot2.cx, dot2.cy);

            if(lineExists(possibleLine, lineEsToJSON()) == false
                && lineExists(possibleLine, allPossibleLines) == false){

                allPossibleLines.push(possibleLine);
            }
        }
    }

    return allPossibleLines;
}