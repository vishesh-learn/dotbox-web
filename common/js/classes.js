class Game {
  constructor() {
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

    currGame.lines = currGame.lines.map(line => {
      return Object.assign(new Line, line);
    });
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
    this.x = x;
    this.y = y;
  }
}

class Dot {
  constructor(row, col) {
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

class Line_v2 { // Can replace Line class as it allows reading of all properties as in original Line class. It will just write the properties in a different way.
  constructor(dot1 = new Dot(), dot2 = new Dot(), byPlayerID, prev = false) {
    this.dot1 = dot1;
    this.dot2 = dot2;
    this.byPlayerID = byPlayerID;
    this.prev = prev;

    this.x1 = dot1.x;
    this.y1 = dot1.y;

    this.x2 = dot2.x;
    this.y2 = dot2.y;
  }

  get orient() {
    return (this.dot1.row == this.dot2.row) && (this.dot1.col != this.dot2.col)
      ? 'horizontal' : 'vertical';
  }

  get byPlayer() {
    return currGame.players.find(player => player.id == this.byPlayerID);
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