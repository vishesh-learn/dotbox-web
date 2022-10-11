
function autoDrawLine(){ //This function is working fine. No issue when it is called at currect event.

    var dotEs = $All(".dot"), allPossibleLines = getAllPossibleLines(), currSafeMoves = [];

    //did all lines made
    if(allPossibleLines.length <= 0){
        made.allLines = true;
    }

    // try to make a square
    var squareMakingLine = getSquareMakingLine();

    while (squareMakingLine) {
      lineMaker(squareMakingLine, currPlayer.color);

      squareMakingLine = getSquareMakingLine();
    }

    // find all safe lines
    for(var possibleLine of allPossibleLines){
        if(isSafeMove(possibleLine)){
            currSafeMoves.push(possibleLine);
        }
    }

    if(currSafeMoves.length > 0){ // draw safe line if exist
      var randomSafeMove = currSafeMoves[randi(currSafeMoves.length - 1)];
      //console.log(randomSafeMove);
        lineMaker(randomSafeMove);
    } else { // else draw any random line
        lineMaker(allPossibleLines[randi(allPossibleLines.length - 1)]);
    }
}

function getSquareMakingLine(){
  var allPossibleLines = getAllPossibleLines();

  for(var possibleLine of allPossibleLines){
      if(doesMakesSquare(possibleLine)){
        return possibleLine;
      }
  }

  return false;
}

function isSafeMove(middleLine){
    var possibleSquare = getSurroundingLines(middleLine);

    if(possibleSquare.orient == "horizontal"){
        if(((possibleSquare.top.length == 3) || (possibleSquare.bottom.length == 3)) || ((possibleSquare.top.length != 2) && (possibleSquare.bottom.length != 2))){
            return true;
        }
    } else if(possibleSquare.orient == "vertical"){
        if(((possibleSquare.left.length == 3) || (possibleSquare.right.length == 3)) || ((possibleSquare.left.length != 2) && (possibleSquare.right.length != 2))){
            return true;
        }
    }

    return false;
}
