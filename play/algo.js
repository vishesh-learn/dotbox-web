
function autoDrawLine() {
  findAndMakeBoxMakingLines();
 
  if (isEnd()) {
    return true;
  }
  
  makeSafeOrRandomLine();
}

let squareMakingLine;
function findAndMakeBoxMakingLines() {
  if (squareMakingLine = getSquareMakingLine()) {
    lineMaker(squareMakingLine);
    
    // try to make a square
    findAndMakeBoxMakingLines();
  }
}

function makeSafeOrRandomLine() {
  var line;

  var currSafeMoves = allPossibleLines.filter(possibleLine => isSafeMove(possibleLine));

  if (currSafeMoves.length > 0) { // draw safe line if exist
    line = currSafeMoves[getRndInteger(0, currSafeMoves.length - 1)];
  } else { // else draw any random line - *need to find and draw less unsafe line
    line = allPossibleLines[getRndInteger(0, allPossibleLines.length - 1)];
  }

  lineMaker(line);
}

function getSquareMakingLine() {
  allPossibleLines = getAllPossibleLines();

  for (var possibleLine of allPossibleLines) {
    if (doesMakesSquare(possibleLine)) {
      return possibleLine;
    }
  }

  return false;
}

function isSafeMove(middleLine) {
  var possibleSquare = getSurroundingLines(middleLine);

  if (possibleSquare.orient == "horizontal") {
    if (((possibleSquare.top.length == 3) || (possibleSquare.bottom.length == 3)) || ((possibleSquare.top.length != 2) && (possibleSquare.bottom.length != 2))) {
      return true;
    }
  } else if (possibleSquare.orient == "vertical") {
    if (((possibleSquare.left.length == 3) || (possibleSquare.right.length == 3)) || ((possibleSquare.left.length != 2) && (possibleSquare.right.length != 2))) {
      return true;
    }
  }

  return false;
}
