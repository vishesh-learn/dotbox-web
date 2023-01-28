//this file contains function that need to run only once per load to set up gameplay.

function getAllPossibleLines(){
    var dotEs = $All(".dot");

    for(var dotE of dotEs){
        var dot1 = dotEToJSON(dotE);
        var validFinalDots = getValidFinalDots(dot1);

        for(var dot2 of validFinalDots){
            var possibleLine = dotsToLine(dot1, dot2);

            if(lineExists(possibleLine, lineEsToJSON()) == false
                && lineExists(possibleLine, allPossibleLines) == false){

                allPossibleLines.push(possibleLine);
            }
        }
    }

    return allPossibleLines;
}