class Game {
  constructor() {
    this.dateTime = new Date(),
      this.gameBoard = gameBoard(),
      this.minPlayer = 2,
      this.players = players(this.minPlayer, this.maxPlayer),
      this.lines = [],
      this.currPage = ""
  }

  get maxPlayer() {
    if (typeof this.gameBoard?.row == 'number' && typeof this.gameBoard?.col == 'number') {
      return (this.gameBoard.row - 1) * (this.gameBoard.col - 1);
    } else {
      return this.minPlayer;
    }
  }
}

class GameBoard {
  constructor() {
    this.gap = 50;
    this.minRow = 3;
    this.minCol = 3;
    this.maxRow = this.minRow;
    this.maxCol = this.minCol;
    this.row = this.minRow;
    this.col = this.minCol;
    this.x = 130;
  }
}

class Player {
  constructor(players = [], id = 0, name = '', color = null, isAlgo = false, rank = 0, score = 0, avatar = null) {
    this.avatar = avatar;
    this.color = color || newColor(players.map(player => player.color));
    this.id = id;
    this.isAlgo = isAlgo;
    this.name = name;
    this.rank = rank;
    this.score = score;
  }

  get placeholderName() {
    return this.name || `player${this.id}`;
  }
}

class Dot {
  constructor(x, y, side) {
    this.x = x;
    this.y = y;
    this.side = side;
  }
}

class Line {
  constructor(x1, y1, x2, y2, byPlayerID, prev = false) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.byPlayerID = byPlayerID;
    this.prev = prev;
  }

  get orient() {
    return (this.x1 == this.x2) && (this.y1 != this.y2)
      ? 'vertical' : 'horizontal';
  }

  get byPlayer() {
    return currGame.players.find(player => player.id == this.byPlayerID);
  }

  //include comparison method to compare parameter/argument with this object.
}

// ========= [ Guide ] ========= //

class ElementGuide {
  constructor(element, title, instruction) {
    this.element = element,
      this.title = title,
      this.instruction = instruction
  }

  activate() {
    highlightElement(this.element);

    elementTooltip(this.element);
  }

  static deactivate() {
    removeHighlight();
  }
}