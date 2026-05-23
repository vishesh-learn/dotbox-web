var made: Made = new Made();

function pointerDownEvent(listen = true) {
  const board = document.querySelector(".dotSVG");

  if (listen) {
    board.addEventListener("pointerdown", pointerDown);

    board.addEventListener("keydown", keyHandler);
  } else {
    board.removeEventListener("pointerdown", pointerDown);

    board.removeEventListener("keydown", (event) =>
      keyHandler(event, navigate_playBoard)
    );
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

    const inRange = Math.abs(x - state.initDot.x) <= Game.currentGame.gameBoard.gap / 2
      && Math.abs(y - state.initDot.y) <= Game.currentGame.gameBoard.gap / 2;

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
      && Math.abs(x - finalDot.x) <= Game.currentGame.gameBoard.gap / 2
      && Math.abs(y - finalDot.y) <= Game.currentGame.gameBoard.gap / 2
    ) {
      addLine(new Line(state.initDot, finalDot, Game.currentGame.currPlayerId));
    }
  } else {
    console.log("no x and y");
  }

  Game.currentGame.save();
}

function lineMade(line) {
  made.lineMade = true;

  state.pendingPossiblelines.forEach((possibleLine, index) => {
    if (Line.compareLineObj(possibleLine, line)) {
      state.pendingPossiblelines.splice(index, 1);
    }
  });

  gameEvent();
}

function boxMade(box) {
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

function playerTurn() {
  pointerDownEvent(false);

  if (!(Game.currentGame?.players?.length > 0)) {
    return false;
  }

  if (Game.currentGame.currPlayerId != undefined) {
    let currentPlayerIndex = Game.currentGame.players.findIndex(player => player.id == Game.currentGame.currPlayerId);
    let lastPlayerIndex = Game.currentGame.players.length - 1;

    if (currentPlayerIndex == lastPlayerIndex) {
      Game.currentGame.currPlayerId = Game.currentGame.players[0].id;
    } else {
      Game.currentGame.currPlayerId = Game.currentGame.players[currentPlayerIndex + 1].id;
    }

    setupPlayerTurnList();
    if (Game.currentGame.currPlayer.isAlgo) {
      setupPlayerTurnListUI();
    } else {
      slideLeft();
    }

  } else {
    Game.currentGame.currPlayerId = Game.currentGame.players[0].id;

    setupPlayerTurnList();
    setupPlayerTurnListUI();
  }

  if (Game.currentGame.currPlayer.isAlgo) {
    requestAnimationFrame(autoDrawLine);
  } else {
    pointerDownEvent(true);
  }
}

function isEnd() {
  return state.pendingPossiblelines.length <= 0;
}

function navigate_playBoard(event, direction) {
  if (!event.target.classList.contains("dot")) {
    console.log("navigate_playBoard -> not dot");

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
      if (Number(event.target.dataset.col) < Game.currentGame.gameBoard.col) {
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
      if (Number(event.target.dataset.row) < Game.currentGame.gameBoard.row) {
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
          Game.currentGame.currPlayerId
        ));

        // updateLinesAndBoxesUI();

        state.selectedDot = null;
        state.initDot = null;
      } else {
        state.selectedDot = event.target;
      }
      break;

    default:
      console.log('navigate_playBoard -> default direction');
      break;
  }
}
