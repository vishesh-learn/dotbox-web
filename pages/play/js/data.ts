var playerTurnList, initDot, selectedDot, finalDot, orient, made;

var allPossibleLines = [], pendingPossiblelines = [], removePrevLinesTimeOut, boxes = [];

class Box {
  x: number;
  y: number;
  byLine: any;

  constructor(x, y, byLine) {
    this.x = x,
    this.y = y,
    this.byLine = byLine
  }
}

class Made {
  lineMade: boolean;
  boxMade: number;

  constructor() {
    this.lineMade = false;
    this.boxMade = 0;
  }
}