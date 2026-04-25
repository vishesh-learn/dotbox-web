export class Box {
  x: number;
  y: number;
  byLine: any;

  constructor(x, y, byLine) {
    this.x = x,
    this.y = y,
    this.byLine = byLine
  }
}

export class Made {
  lineMade: boolean;
  boxMade: number;

  constructor() {
    this.lineMade = false;
    this.boxMade = 0;
  }
}

export const state = {
  allPossibleLines: [] as any[],
  pendingPossiblelines: [] as any[],
  initDot: undefined as any,
  selectedDot: null as any,
};
