var currPlayer, playerTurnList, initDot, finalDot, orient, made, allPossibleLines = [], pendingPossiblelines = [], removePrevLinesTimeOut;

class Box {
  constructor(x, y) {
    this.x = x,
    this.y = y
  }
}

class Made {
  constructor() {
    this.lineMade = false;
    this.boxMade = 0;
  }
}