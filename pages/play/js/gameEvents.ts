import { Game, Line, Dot } from '../../../common/js/classes.js';
import { Made, state } from './data.js';
import { autoDrawLine } from './algo.js';
import {
    nearestDot, nearDot, prevLineMaker, linePreview,
    setupPlayerTurnList, setupPlayerTurnListUI, slideLeft,
    setCurrPlayerInfo, winBoard, updateLinesUI, addLine
} from '../main.js';

var made: Made = new Made();

export function pointerDownEvent(listen = true) {
  const board = document.querySelector(".dotSVG");

  if (listen) {
    board.addEventListener("pointerdown", pointerDown);

    board.addEventListener("keydown", keyHandler);
  } else {
    board.removeEventListener("pointerdown", pointerDown);

    board.removeEventListener("keydown", keyHandler);
  }
}

function pointerMoveAndUPEvents(listen = true) {
  const board = document.querySelector(".svgC");

  if (listen) {
    board.addEventListener("pointermove", linePreview);
    board.addEventListener("pointerup", pointerUp);
  } else {
    board.removeEventListener("pointermove", linePreview);
    board.removeEventListener("pointerup", pointerUp);
  }
}

function pointerDown(event) {
  var x = event.offsetX, y = event.offsetY;

  if (x && y) {
    let nearInitDot = nearestDot(x, y) as HTMLElement;

    state.initDot = new Dot(
      Number(nearInitDot.dataset.col),
      Number(nearInitDot.dataset.row),
    );

    const inRange = Math.abs(x - state.initDot.x) <= Game.currGame.gameBoard.gap / 2
      && Math.abs(y - state.initDot.y) <= Game.currGame.gameBoard.gap / 2;

    if (inRange) {
      pointerMoveAndUPEvents(true);
    } else {
      console.log("line drawing canceled");
    }
  }
}

function pointerUp(event) {
  pointerMoveAndUPEvents(false);

  var x = event.offsetX, y = event.offsetY;

  made = new Made();

  removePrevLines();

  if (state.initDot && x && y) {
    var finalDot = nearDot(x, y);

    if (
      new Line(state.initDot, finalDot).isValid()
      && Math.abs(x - finalDot.x) <= Game.currGame.gameBoard.gap / 2
      && Math.abs(y - finalDot.y) <= Game.currGame.gameBoard.gap / 2
    ) {
      addLine(new Line(state.initDot, finalDot, Game.currGame.currPlayerId));
    }
  } else {
    console.log("no x and y");
  }

  Game.currGame.save();
}

function removePrevLines() {
  document.querySelectorAll(".preview").forEach(line => line.remove());
}

export function lineMade(line) {
  made.lineMade = true;

  state.pendingPossiblelines.forEach((possibleLine, index) => {
    if (Line.compareLineObj(possibleLine, line)) {
      state.pendingPossiblelines.splice(index, 1);
    }
  });

  gameEvent();
}

export function boxMade(box) {
  made.boxMade++;
}

function gameEvent() {
  if (made.lineMade) {
    if (made.boxMade <= 0) {
      playerTurn();
    }

    if (isEnd()) {
      winBoard();
    }
  }

  made = new Made();
  setCurrPlayerInfo();
}

export function playerTurn(isInitial = false) {
  if (isInitial && Game?.currGame?.currPlayerId) {
    return false;
  }

  pointerDownEvent(false);

  console.trace("playerTurn - currPlayerId", Game.currGame.currPlayerId);

  if (!(Game.currGame?.players?.length > 0)) {
    console.error('not enough players for the game', Game.currGame);
    return false;
  }

  if (Game.currGame.currPlayer != undefined) {
    if (Game.currGame.currPlayerId == Game.currGame.players.length) {
      Game.currGame.currPlayerId = Game.currGame.players[0].id;
    } else {
      Game.currGame.currPlayerId = Game.currGame.players[Game.currGame.currPlayerId].id;
    }

    setupPlayerTurnList();
    if (Game.currGame.currPlayer.isAlgo) {
      setupPlayerTurnListUI();
    } else {
      slideLeft();
    }

  } else {
    Game.currGame.currPlayerId = Game.currGame.players[0].id;

    setupPlayerTurnList();
    setupPlayerTurnListUI();
  }

  if (Game.currGame.currPlayer.isAlgo) {
    requestAnimationFrame(autoDrawLine);
  } else {
    pointerDownEvent(true);
  }
}

export function isEnd() {
  return state.pendingPossiblelines.length <= 0;
}

function keyHandler(event) {
  switch (event.keyCode) {
    case 13:
      dotNavigate(event, "enter");
      break;

    case 37:
      dotNavigate(event, "left");
      break;

    case 38:
      dotNavigate(event, "top");
      break;

    case 39:
      dotNavigate(event, "right");
      break;

    case 40:
      dotNavigate(event, "bottom");
      break;

    default:
      break;
  }
}

function dotNavigate(event, direction) {
  if (!event.target.classList.contains("dot")) {
    console.log("dotNavigate -> not dot");

    return false;
  }

  switch (direction) {
    case "top":
      if (Number(event.target.dataset.row) > 1) {
        let nextRow = state.selectedDot ? parseInt(state.selectedDot.dataset.row) - 1 : parseInt(event.target.dataset.row) - 1;
        let nextCol = state.selectedDot ? parseInt(state.selectedDot.dataset.col) : parseInt(event.target.dataset.col);

        const nextDot = document.querySelector<HTMLElement>(`.dot[data-row="${nextRow}"][data-col="${nextCol}"]`);

        nextDot.focus();

        if (state.selectedDot) {
          prevLineMaker(
            new Line(
              new Dot(state.selectedDot.dataset.col, state.selectedDot.dataset.row),
              new Dot(nextCol, nextRow)
            )
          );
        }
      }
      break;

    case "right":
      if (Number(event.target.dataset.col) < Game.currGame.gameBoard.col) {
        let nextRow = state.selectedDot ? parseInt(state.selectedDot.dataset.row) : parseInt(event.target.dataset.row);
        let nextCol = state.selectedDot ? parseInt(state.selectedDot.dataset.col) + 1 : parseInt(event.target.dataset.col) + 1;

        const nextDot = document.querySelector<HTMLElement>(`.dot[data-row="${nextRow}"][data-col="${nextCol}"]`);

        nextDot.focus();

        if (state.selectedDot) {
          prevLineMaker(
            new Line(
              new Dot(state.selectedDot.dataset.col, state.selectedDot.dataset.row),
              new Dot(nextCol, nextRow)
            )
          );
        }
      }
      break;

    case "bottom":
      if (Number(event.target.dataset.row) < Game.currGame.gameBoard.row) {
        let nextRow = state.selectedDot ? parseInt(state.selectedDot.dataset.row) + 1 : parseInt(event.target.dataset.row) + 1;
        let nextCol = state.selectedDot ? parseInt(state.selectedDot.dataset.col) : parseInt(event.target.dataset.col);

        const nextDot = document.querySelector<HTMLElement>(`.dot[data-row="${nextRow}"][data-col="${nextCol}"]`);

        nextDot.focus();

        if (state.selectedDot) {
          prevLineMaker(
            new Line(
              new Dot(state.selectedDot.dataset.col, state.selectedDot.dataset.row),
              new Dot(nextCol, nextRow)
            )
          );
        }
      }
      break;

    case "left":
      if (Number(event.target.dataset.col) > 1) {
        let nextRow = state.selectedDot ? parseInt(state.selectedDot.dataset.row) : parseInt(event.target.dataset.row);
        let nextCol = state.selectedDot ? parseInt(state.selectedDot.dataset.col) - 1 : parseInt(event.target.dataset.col) - 1;

        const nextDot = document.querySelector<HTMLElement>(`.dot[data-row="${nextRow}"][data-col="${nextCol}"]`);

        nextDot.focus();

        if (state.selectedDot) {
          prevLineMaker(
            new Line(
              new Dot(state.selectedDot.dataset.col, state.selectedDot.dataset.row),
              new Dot(nextCol, nextRow)
            )
          );
        }
      }
      break;

    case "enter":
      if (state.selectedDot) {
        made = new Made();

        document.querySelectorAll(".preview").forEach(line => line.remove());

        addLine(new Line(
          new Dot(state.selectedDot.dataset.col, state.selectedDot.dataset.row),
          new Dot(event.target.dataset.col, event.target.dataset.row),
          Game.currGame.currPlayerId
        ));

        updateLinesUI();

        state.selectedDot = null;
        state.initDot = null;
      } else {
        state.selectedDot = event.target;
      }
      break;

    default:
      console.log('dotNavigate -> default direction');
      break;
  }
}
