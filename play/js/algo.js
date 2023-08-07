
function autoDrawLine() { console.log(currPlayer);
  findAndMakeBoxMakingLines();
 
  if (isEnd()) {
    return true;
  }
  
  makeSafeOrRandomLine();
}

let squareMakingLine;
function findAndMakeBoxMakingLines() {
  if (squareMakingLine = getSquareMakingLine()) {
    squareMakingLine.byPlayerID = currPlayer.id;
    addLine(squareMakingLine);
    
    // try to make a square
    findAndMakeBoxMakingLines();
  }

  saveCurrGame();
}

function makeSafeOrRandomLine() {
  var line;

  var currSafeMoves = pendingPossiblelines.filter(possibleLine => isSafeMove(possibleLine));

  if (currSafeMoves.length > 0) { // draw safe line if exist
    line = currSafeMoves[getRndInteger(0, currSafeMoves.length - 1)];
  } else { // else draw any random line - *need to find and draw less unsafe line
    line = pendingPossiblelines[getRndInteger(0, pendingPossiblelines.length - 1)];
  }

  line.byPlayerID = currPlayer.id;
  addLine(line);

  saveCurrGame();
}

function getSquareMakingLine() {
  getPendingPossiblelines();

  for (var possibleLine of pendingPossiblelines) {
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
