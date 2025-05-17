class Game {
  constructor() {
    this.meta_type = 'game';
    this.meta_version = '1.0';
    this.meta_createdAt = new Date();

    this.dateTime = new Date();
    this.gameBoard = new GameBoard();
    this.minPlayer = 2;
    this.players = [];
    this.lines = [];
    this.currPage = "";
  }

  get maxPlayer() {
    if (typeof this.gameBoard?.row == 'number' && typeof this.gameBoard?.col == 'number') {
      return (this.gameBoard.row - 1) * (this.gameBoard.col - 1);
    } else {
      return this.minPlayer;
    }
  }

  validatePlayers() {
    console.log("validating players");

    if (this.minPlayer < 2) {
      this.minPlayer = 2;
    }

    if (this.maxPlayer < this.minPlayer) {
      this.maxPlayer = this.minPlayer;
    }

    if (this.players.length > this.maxPlayer) {
      this.players = this.players.slice(0, this.maxPlayer);
    }

    while (this.players.length < this.minPlayer) {
      this.players.push(new Player(this.players));
    }

    this.players.forEach((player, index) => {
      player.id = index + 1;
    });

    this.players = this.players.map(player => {
      return Object.assign(new Player, player);
    });
  }

  save() {
    localStorage.setItem('currGame', JSON.stringify(this));
  }

  reset() {
    this.lines = [];

    this.save();
  }

  static load() {
    currGame = localStorage.currGame ? JSON.parse(localStorage.currGame) : new Game();

    currGame = Object.assign(new Game, currGame);

    currGame.gameBoard = Object.assign(new GameBoard, currGame.gameBoard);

    currGame.gameBoard.validate();

    currGame.validatePlayers();

    currGame.lines = currGame.lines.map(Line.constructFromOldLine);
  }
}

class GameBoard {
  constructor() {
    this.meta_type = 'gameBoard';
    this.meta_version = '1.0';
    this.meta_createdAt = new Date();

    this.gap = 50;
    this.minRow = 3;
    this.minCol = 3;

    this.maxRow = this.minRow;
    this.maxCol = this.minCol;

    this.row = this.minRow;
    this.col = this.minCol;

    this.x = 130;
  }

  validate() {
    console.log("validating game board");
    if (this.maxRow < this.minRow) {
      this.maxRow = this.minRow;
    }

    if (this.maxCol < this.minCol) {
      this.maxCol = this.minCol;
    }

    if (this.row < this.minRow) {
      this.row = this.minRow;
    }

    if (this.col < this.minCol) {
      this.col = this.minCol;
    }
  }
}

class Player {
  constructor(players = [], id = 0, name = '', color = null, isAlgo = false, rank = 0, score = 0, avatar = null) {
    this.meta_type = 'player';
    this.meta_version = '1.0';
    this.meta_createdAt = new Date();

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

class PseudoDot {
  constructor(x, y) {
    this.meta_type = 'pseudoDot';
    this.meta_version = '1.0';
    this.meta_createdAt = new Date();

    this.x = x;
    this.y = y;
  }
}

class Dot {
  constructor(row, col) {
    this.meta_type = 'dot';
    this.meta_version = '2.0';
    this.meta_createdAt = new Date();

    this.row = row;
    this.col = col;
  }

  get x() {
    const dotRadius = getDotRadius();
    return (this.col - 1) * currGame.gameBoard.gap + dotRadius;
  }

  get y() {
    const dotRadius = getDotRadius();
    return (this.row - 1) * currGame.gameBoard.gap + dotRadius;
  }
}

class Line {
  constructor(dot1 = new Dot(), dot2 = new Dot(), byPlayerID, prev = false) {
    this.meta_type = 'line';
    this.meta_version = '2.0';
    this.meta_createdAt = new Date();

    this.dot1 = dot1;
    this.dot2 = dot2;
    this.byPlayerID = byPlayerID || currPlayer?.id;
    this.prev = prev;
  }

  get x1() {
    return this.dot1.x;
  }

  get y1() {
    return this.dot1.y;
  }

  get x2() {
    return this.dot2.x;
  }

  get y2() {
    return this.dot2.y;
  }

  get orient() {
    return (this.dot1.row == this.dot2.row) && (this.dot1.col != this.dot2.col)
      ? 'horizontal' : 'vertical';
  }

  get byPlayer() {
    return currGame.players.find(player => player.id == this.byPlayerID);
  }

  isValid() {
    const deltaCol = Math.abs(this.dot1.col - this.dot2.col);
    const deltaRow = Math.abs(this.dot1.row - this.dot2.row);

    return (
      (this.dot1.row == this.dot2.row && deltaRow == 0 && deltaCol == 1) ||
      (this.dot1.col == this.dot2.col && deltaCol == 0 && deltaRow == 1)
    );
  }

  static isOldLine(line) {
    return !line.dot1;
  }

  static constructorFromElement(line) {
    const dot1 = new Dot(
      length_to_dotCount(line.y1.baseVal.value),
      length_to_dotCount(line.x1.baseVal.value)
    );

    const dot2 = new Dot(
      length_to_dotCount(line.y2.baseVal.value),
      length_to_dotCount(line.x2.baseVal.value)
    );

    return new Line(dot1, dot2, line.byPlayerID, line.prev);
  }

  static constructFromOldLine(line) {
    if (Line.isOldLine(line)) {
      const dot1 = new Dot(
        length_to_dotCount(line.y1),
        length_to_dotCount(line.x1)
      );

      const dot2 = new Dot(
        length_to_dotCount(line.y2),
        length_to_dotCount(line.x2)
      );

      return new Line(dot1, dot2, line.byPlayerID, line.prev);
    } else {
      const newLine = Object.assign(new Line, line);

      newLine.dot1 = Object.assign(new Dot, line.dot1);
      newLine.dot2 = Object.assign(new Dot, line.dot2);

      return newLine;
    }
  }

  static compareLineObj(obj1, obj2) {
    let isSameInOneWay = (
      (
        obj1.dot1.row == obj2.dot1.row &&
        obj1.dot1.col == obj2.dot1.col
      ) &&
      (
        obj1.dot2.row == obj2.dot2.row &&
        obj1.dot2.col == obj2.dot2.col
      )
    );

    let isSameInOtherWay = (
      (
        obj1.dot1.row == obj2.dot2.row &&
        obj1.dot1.col == obj2.dot2.col
      ) &&
      (
        obj1.dot2.row == obj2.dot1.row &&
        obj1.dot2.col == obj2.dot1.col
      )
    );

    let sameLine = isSameInOneWay || isSameInOtherWay;

    return sameLine;
  }

  findHTMLElement() {
    const selector1Part1 = `[data-row1="${this.dot1.row}"][data-col1="${this.dot1.col}"]`;
    const selector1Part2 = `[data-row2="${this.dot2.row}"][data-col2="${this.dot2.col}"]`;

    const lineInOneWay = document.querySelector(`.line${selector1Part1}${selector1Part2}`);

    const selector2Part1 = `[data-row1="${this.dot2.row}"][data-col1="${this.dot2.col}"]`;
    const selector2Part2 = `[data-row2="${this.dot1.row}"][data-col2="${this.dot1.col}"]`;

    const lineInOtherWay = document.querySelector(`.line${selector2Part1}${selector2Part2}`);

    return lineInOneWay || lineInOtherWay;
  }
}

class Version {
  static setVersion(versionName) {
    localStorage.setItem('versionName', versionName);

    updateVersionUI();
  }

  static updateVersionUI() {
    const versionUI = document.querySelector('.version');
    const versionSeparatorUI = document.querySelector('.versionSeparator');

    if (!versionUI) {
      return false;
    }

    let versionName = localStorage.getItem('versionName');

    if (versionName) {
      versionUI.innerHTML = `v${versionName}`;

      versionUI.classList.remove('displayNone');

      if (versionSeparatorUI) {
        versionSeparatorUI.classList.remove('displayNone');
      }
    } else {
      console.log('versionName not found in local storage');

      versionUI.classList.add('displayNone');

      if (versionSeparatorUI) {
        versionSeparatorUI.classList.add('displayNone');
      }
    }
  }
}