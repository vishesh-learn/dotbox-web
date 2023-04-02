function validateLines(finalDot) {
  if (initDot && finalDot.x >= 0 && finalDot.y >= 0) {
      var deltaX = Math.abs(initDot.x - finalDot.x);
      var deltaY = Math.abs(initDot.y - finalDot.y);

      if ((initDot.x == finalDot.x) && (deltaY == game.gameBoard.gap)) {
          return true;
      } else if ((initDot.y == finalDot.y) && (deltaX == game.gameBoard.gap)) {
          return true;
      } else {
          return false;
      }
  }

  return false;
}