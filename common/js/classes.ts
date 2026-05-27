function randomUUID(): string {
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, c =>
    (+c ^ Math.random() * 16 >> +c / 4).toString(16)
  );
}

class Game {
  static games: Game[] = [];
  static currentGame: Game = null;

  id: string;
  meta_type: string;
  meta_version: string;
  meta_createdAt: Date;
  meta_updatedAt: Date;
  dateTime: Date;
  gameBoard: GameBoard;
  minPlayer: number;
  players: Player[];
  currPage: string;
  lines: Line[];
  boxes: Box[];
  currPlayerId: number | null;

  constructor() {
    this.id = crypto.randomUUID?.() ?? randomUUID();

    this.meta_type = 'game';
    this.meta_version = '1.0';
    this.meta_createdAt = new Date();
    this.meta_updatedAt = new Date();

    this.dateTime = new Date();
    this.gameBoard = new GameBoard();
    this.minPlayer = 2;
    this.players = [];
    this.currPage = "";

    this.lines = [];
    this.boxes = [];

    this.currPlayerId = null
  }

  save() {
    this.meta_updatedAt = new Date();

    const gameIndex = Game.games.findIndex(game => game.id == this.id);

    if (gameIndex != -1) {
      Game.games[gameIndex] = this;
    } else {
      Game.games.push(this);
    }

    localStorage.setItem('games', JSON.stringify(Game.games));
  }

  static load() {
    Game.games = localStorage.games ? JSON.parse(localStorage.games) : [];

    Game.games = Game.games.map(this.parseGame)
      .sort((a, b) => b.meta_updatedAt.valueOf() - a.meta_updatedAt.valueOf());

    console.log('load -> parsed games', Game.games);

    if (!Game.games.length) {
      Game.currentGame = localStorage.currentGame ? JSON.parse(localStorage.currentGame) : null;

      Game.currentGame = Game.currentGame ? Game.parseGame(Game.currentGame) : null;
    } else {
      Game.currentGame = Game.games[0];
    }
  }

  static parseGame(game: Game) {
    game = Object.assign(new Game, game);

    game.gameBoard = Object.assign(new GameBoard, game.gameBoard);

    game.gameBoard.validate();

    game.validatePlayers();

    game.lines = game.lines.map(Line.constructFromOldLine);

    if (!game.lines.length) {
      game.currPlayerId = null;

      game.lines = [];
    }

    game.boxes.forEach(box => {
      box.byLine = Object.assign(new Line, box.byLine);
    });

    game.meta_createdAt = new Date(game.meta_createdAt);
    game.meta_updatedAt = new Date(game.meta_updatedAt);

    return game;
  }

  get currPlayer() {
    if (this.currPlayerId) {
      return this.players.find(player => player.id == this.currPlayerId);
    } else {
      return null;
    }
  }

  get maxPlayer() {
    if (typeof this.gameBoard?.row == 'number' && typeof this.gameBoard?.col == 'number') {
      return (this.gameBoard.row - 1) * (this.gameBoard.col - 1);
    } else {
      return this.minPlayer;
    }
  }

  validatePlayers() {
    if (this.minPlayer < 2) {
      this.minPlayer = 2;
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

  static continue() {
    Game.load();

    window.location.href = Game.currentGame.currPage ?? pages.setBoard;
  }

  reset() {
    this.currPlayerId = null;

    this.lines = [];

    this.boxes = [];

    this.save();
  }

  get listItemUI() {
    const createdAtFormatted = formatDateTimeWithRelativeEn(this.meta_createdAt);
    const updatedAtFormatted = formatDateTimeWithRelativeEn(this.meta_updatedAt);

    const gameUI = document.createElement("div");
    gameUI.classList = "saved-game";

    const detailsContainer = document.createElement("div");
    detailsContainer.classList = "details-container";

    const nameUI = document.createElement("div");
    nameUI.classList = "name";
    nameUI.innerHTML = `<span class="label">ID:</span> ${this.id}`;

    const statsUI = document.createElement("div");
    statsUI.classList = "stats";

    const sizeUI = document.createElement("div");
    sizeUI.classList = "stat size";
    sizeUI.innerHTML = `
    <image class="icon-label" src="/assets/images/dots.svg" />
    <span class="column-count">${this.gameBoard.col}</span>
    x
    <span class="row-count">${this.gameBoard.row}</span>
    `;

    const playerCountUI = document.createElement("div");
    playerCountUI.classList = "stat player-count";
    playerCountUI.innerHTML = `
    <image class="icon-label" src="/assets/images/player.svg" />
    <span class="column-count">${this.players.length}</span>
    `;

    const movesCountUI = document.createElement("div");
    movesCountUI.classList = "stat moves-count";
    movesCountUI.innerHTML = `
    <image class="icon-label" src="/assets/images/move.svg" />
    <span class="column-count">${this.lines.length}</span>
    moves
    `;

    statsUI.append(sizeUI, playerCountUI, movesCountUI);

    const createdDateUI = document.createElement("div");
    createdDateUI.classList = "date";
    createdDateUI.innerHTML = `
    <span class="label">Created at:</span>
    <span class="absolute">${createdAtFormatted.absolute}</span>
    <span class="relative">(${createdAtFormatted.relative})</span>
    `;

    const updatedDateUI = document.createElement("div");
    updatedDateUI.classList = "date";
    updatedDateUI.innerHTML = `
    <span class="label">Updated at:</span>
    <span class="absolute">${updatedAtFormatted.absolute}</span>
    <span class="relative">(${updatedAtFormatted.relative})</span>
    `;

    detailsContainer.append(nameUI, statsUI, createdDateUI, updatedDateUI);

    const actionBar = document.createElement("div");
    actionBar.classList = "action-bar";

    const deleteButton = document.createElement("button");
    deleteButton.classList = "button deleteButton";
    deleteButton.innerHTML = "&#10005;";
    actionBar.append(deleteButton);

    gameUI.append(detailsContainer, actionBar);

    detailsContainer.addEventListener('click', () => {
      this.save();

      Game.continue();
    });

    deleteButton.addEventListener('click', () => {
      const index = Game.games.findIndex(game => game.id == this.id);

      Game.games.splice(index, 1);

      localStorage.setItem('games', JSON.stringify(Game.games));

      gameUI.remove();
    });

    return gameUI;
  }
}

class GameBoard {
  meta_type: string;
  meta_version: string;
  meta_createdAt: Date;

  gap: number;
  minRow: number;
  minCol: number;
  maxRow: number;
  maxCol: number;
  row: number;
  col: number;
  x: number;

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

class Box {
  meta_type: string;
  meta_version: string;
  meta_createdAt: Date;

  x: number;
  y: number;
  byLine: Line;

  constructor(x, y, byLine) {
    this.meta_type = "box";
    this.meta_version = "1";
    this.meta_createdAt = new Date();

    this.x = x;
    this.y = y;
    this.byLine = byLine;
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

class Player {
  meta_type: string;
  meta_version: string;
  meta_createdAt: Date;
  avatar: any;
  color: string | null;
  id: number;
  isAlgo: boolean;
  name: string;
  rank: number;
  score: number;

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
    return this.name || `Player ${this.id}`;
  }
}

class PseudoDot {
  meta_type: string;
  meta_version: string;
  meta_createdAt: Date;
  x: number;
  y: number;

  constructor(x, y) {
    this.meta_type = 'pseudoDot';
    this.meta_version = '1.0';
    this.meta_createdAt = new Date();

    this.x = x;
    this.y = y;
  }
}

class Dot {
  meta_type: string;
  meta_version: string;
  meta_createdAt: Date;
  col: number;
  row: number;

  constructor(col = 0, row = 0, _direction?: string) {
    this.meta_type = 'dot';
    this.meta_version = '2.0';
    this.meta_createdAt = new Date();

    this.col = col;
    this.row = row;
  }

  get x() {
    const dotRadius = getDotRadius();
    return (this.col - 1) * Game.currentGame.gameBoard.gap + dotRadius;
  }

  get y() {
    const dotRadius = getDotRadius();
    return (this.row - 1) * Game.currentGame.gameBoard.gap + dotRadius;
  }
}

class Line {
  meta_type: string;
  meta_version: string;
  meta_createdAt: Date;
  dot1: any;
  dot2: any;
  byPlayerID: number | null | undefined;
  prev: boolean;

  constructor(dot1: any = new Dot(), dot2: any = new Dot(), byPlayerID?: number | null, prev = false) {
    this.meta_type = 'line';
    this.meta_version = '2.0';
    this.meta_createdAt = new Date();

    this.dot1 = dot1;
    this.dot2 = dot2;
    this.byPlayerID = byPlayerID;
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
    return Game.currentGame.players.find(player => player.id == this.byPlayerID);
  }

  get svg() {
    let lineE = document.createElementNS('http://www.w3.org/2000/svg', "line");
    lineE.classList = "line";

    if (this.prev) {
      lineE.classList.add("preview");
    }

    lineE.setAttribute("x1", this.x1);
    lineE.setAttribute("y1", this.y1);
    lineE.setAttribute("x2", this.x2);
    lineE.setAttribute("y2", this.y2);

    if (!this.byPlayerID) {
      console.log("no byPlayerID", this.byPlayerID);

      return false;
    }

    if (this?.byPlayer?.color) {
      lineE.setAttribute("stroke", this.byPlayer.color);
    } else {
      console.log("color not found");
    }

    lineE.setAttribute("byPlayer", this.byPlayerID.toString());

    this.dot1.row && lineE.setAttribute("data-dot1-row", this.dot1.row);
    this.dot1.col && lineE.setAttribute("data-dot1-col", this.dot1.col);
    this.dot2.row && lineE.setAttribute("data-dot2-row", this.dot2.row);
    this.dot2.col && lineE.setAttribute("data-dot2-col", this.dot2.col);

    return lineE;
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
      length_to_dotCount(line.x1.baseVal.value),
      length_to_dotCount(line.y1.baseVal.value),
    );

    const dot2 = new Dot(
      length_to_dotCount(line.x2.baseVal.value),
      length_to_dotCount(line.y2.baseVal.value),
    );

    return new Line(dot1, dot2, line.byPlayerID, line.prev);
  }

  static constructFromOldLine(line) {
    if (Line.isOldLine(line)) {
      const dot1 = new Dot(
        length_to_dotCount(line.x1),
        length_to_dotCount(line.y1),
      );

      const dot2 = new Dot(
        length_to_dotCount(line.x2),
        length_to_dotCount(line.y2),
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
    const selector1Part1 = `[data-dot1-row="${this.dot1.row}"][data-dot1-col="${this.dot1.col}"]`;
    const selector1Part2 = `[data-dot2-row="${this.dot2.row}"][data-dot2-col="${this.dot2.col}"]`;

    const lineInOneWay = document.querySelector(`.line${selector1Part1}${selector1Part2}`);

    const selector2Part1 = `[data-dot1-row="${this.dot2.row}"][data-dot1-col="${this.dot2.col}"]`;
    const selector2Part2 = `[data-dot2-row="${this.dot1.row}"][data-dot2-col="${this.dot1.col}"]`;

    const lineInOtherWay = document.querySelector(`.line${selector2Part1}${selector2Part2}`);

    return lineInOneWay || lineInOtherWay;
  }
}

class Version {
  static setVersion(versionName) {
    console.log('setting version', versionName);

    const versionUI = document.querySelector('.version');
    const versionSeparatorUI = document.querySelector('.versionSeparator');

    if (!versionUI) {
      return false;
    }

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

function length_to_dotCount(length) {
  return (length - length % Game.currentGame.gameBoard.gap + Game.currentGame.gameBoard.gap) / Game.currentGame.gameBoard.gap;
}
