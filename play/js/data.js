var currPlayer, playerTurnList, initDot, finalDot, orient, made, allPossibleLines = [], pendingPossiblelines = [], removePrevLinesTimeOut, boxes = [];

class Box {
  constructor(x, y, byLine) {
    this.x = x,
    this.y = y,
    this.byLine = byLine
  }
}

class Made {
  constructor() {
    this.lineMade = false;
    this.boxMade = 0;
  }
}