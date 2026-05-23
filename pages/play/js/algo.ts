function autoDrawLine() {
  if (!Game.currentGame.currPlayer.isAlgo) {
    return false;
  }

  findAndMakeBoxMakingLines();

  if (isEnd()) {
    return true;
  }

  makeSafeOrRandomLine();
}

let squareMakingLine;

function findAndMakeBoxMakingLines() {
  if (squareMakingLine = getSquareMakingLine()) {
    squareMakingLine.byPlayerID = Game.currentGame.currPlayerId;

    addLine(squareMakingLine);

    findAndMakeBoxMakingLines();
  }

  Game.currentGame.save();
}

function makeSafeOrRandomLine() {
  var line;

  var currSafeMoves = state.pendingPossiblelines.filter(possibleLine => isSafeMove(possibleLine));

  if (currSafeMoves.length > 0) {
    line = currSafeMoves[getRndInteger(0, currSafeMoves.length - 1)];
  } else {
    line = state.pendingPossiblelines[getRndInteger(0, state.pendingPossiblelines.length - 1)];
  }

  line.byPlayerID = Game.currentGame.currPlayerId;

  addLine(line);

  Game.currentGame.save();
}

function getSquareMakingLine() {
  refreshPendingPossibleLines();

  for (var possibleLine of state.pendingPossiblelines) {
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
