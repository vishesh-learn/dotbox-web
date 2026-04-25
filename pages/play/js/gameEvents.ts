function pointerDownEvent(listen = true) {
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

    initDot = new Dot(
      Number(nearInitDot.dataset.col),
      Number(nearInitDot.dataset.row),
    );

    const inRange = Math.abs(x - initDot.x) <= Game.currGame.gameBoard.gap / 2
      && Math.abs(y - initDot.y) <= Game.currGame.gameBoard.gap / 2;

    if (inRange) {
      pointerMoveAndUPEvents(true);

      getSurroundingDots(initDot).filter(validFinalDot => {
        var possibleLine = new Line(
          initDot, validFinalDot
        );

        return !lineNotExists(possibleLine, pendingPossiblelines);
      });
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

  if (initDot && x && y) {
    finalDot = nearDot(x, y);

    if (
      new Line(initDot, finalDot).isValid()
      && Math.abs(x - finalDot.x) <= Game.currGame.gameBoard.gap / 2
      && Math.abs(y - finalDot.y) <= Game.currGame.gameBoard.gap / 2
    ) {
      new Line(initDot, finalDot, Game.currGame.currPlayerId).addLine();
    }
  } else {
    console.log("no x and y");
  }

  Game.currGame.save();
}

function removePrevLines() {
  document.querySelectorAll(".preview").forEach(line => line.remove());
}

function lineMade(line) {
  made.lineMade = true;

  pendingPossiblelines.forEach((possibleLine, index) => {
    if (Line.compareLineObj(possibleLine, line)) {
      pendingPossiblelines.splice(index, 1);
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

function playerTurn(isInitial = false) {
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

function isEnd() {
  return pendingPossiblelines.length <= 0;
}

/* ------------ */

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
        let nextRow = selectedDot ? parseInt(selectedDot.dataset.row) - 1 : parseInt(event.target.dataset.row) - 1;
        let nextCol = selectedDot ? parseInt(selectedDot.dataset.col) : parseInt(event.target.dataset.col);

        const nextDot = document.querySelector<HTMLElement>(`.dot[data-row="${nextRow}"][data-col="${nextCol}"]`);

        nextDot.focus();

        if (selectedDot) {
          prevLineMaker(
            new Line(
              new Dot(
                selectedDot.dataset.col, selectedDot.dataset.row,
              ),
              new Dot(
                nextCol, nextRow,
              )
            )
          );
        }
      }

      break;

    case "right":
      if (Number(event.target.dataset.col) < Game.currGame.gameBoard.col) {
        let nextRow = selectedDot ? parseInt(selectedDot.dataset.row) : parseInt(event.target.dataset.row);
        let nextCol = selectedDot ? parseInt(selectedDot.dataset.col) + 1 : parseInt(event.target.dataset.col) + 1;

        const nextDot = document.querySelector<HTMLElement>(`.dot[data-row="${nextRow}"][data-col="${nextCol}"]`);

        nextDot.focus();

        if (selectedDot) {
          prevLineMaker(
            new Line(
              new Dot(
                selectedDot.dataset.col,
                selectedDot.dataset.row,
              ),
              new Dot(
                nextCol,
                nextRow,
              )
            )
          );
        }
      }
      break;

    case "bottom":
      if (Number(event.target.dataset.row) < Game.currGame.gameBoard.row) {
        let nextRow = selectedDot ? parseInt(selectedDot.dataset.row) + 1 : parseInt(event.target.dataset.row) + 1;
        let nextCol = selectedDot ? parseInt(selectedDot.dataset.col) : parseInt(event.target.dataset.col);

        const nextDot = document.querySelector<HTMLElement>(`.dot[data-row="${nextRow}"][data-col="${nextCol}"]`);

        nextDot.focus();

        if (selectedDot) {
          prevLineMaker(
            new Line(
              new Dot(
                selectedDot.dataset.col,
                selectedDot.dataset.row,
              ),
              new Dot(
                nextCol,
                nextRow,
              )
            )
          );
        }
      }
      break;

    case "left":
      if (Number(event.target.dataset.col) > 1) {
        let nextRow = selectedDot ? parseInt(selectedDot.dataset.row) : parseInt(event.target.dataset.row);
        let nextCol = selectedDot ? parseInt(selectedDot.dataset.col) - 1 : parseInt(event.target.dataset.col) - 1;

        const nextDot = document.querySelector<HTMLElement>(`.dot[data-row="${nextRow}"][data-col="${nextCol}"]`);

        nextDot.focus();

        if (selectedDot) {
          prevLineMaker(
            new Line(
              new Dot(
                selectedDot.dataset.col,
                selectedDot.dataset.row,
              ),
              new Dot(
                nextCol,
                nextRow,
              )
            )
          );
        }
      }
      break;

    case "enter":
      if (selectedDot) {
        made = new Made();

        removePrevLines();

        new Line(
          new Dot(
            selectedDot.dataset.col,
            selectedDot.dataset.row,
          ),
          new Dot(
            event.target.dataset.col,
            event.target.dataset.row,
          ),
          Game.currGame.currPlayerId
        ).addLine();

        updateLinesUI();

        selectedDot = null;
        initDot = null;
      } else {
        selectedDot = event.target;
      }
      break;

    default:
      console.log('dotNavigate -> default direction');
      break;
  }
}