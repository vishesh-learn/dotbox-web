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
    let nearInitDot = nearestDot(x, y);

    initDot = new Dot(
      Number(nearInitDot.dataset.row),
      Number(nearInitDot.dataset.col)
    );

    const inRange = difference(x, initDot.x) <= currGame.gameBoard.gap / 2
      && difference(y, initDot.y) <= currGame.gameBoard.gap / 2;

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
      validateLines(initDot, finalDot)
      && difference(x, finalDot.x) <= currGame.gameBoard.gap / 2
      && difference(y, finalDot.y) <= currGame.gameBoard.gap / 2
    ) {
      addLine(new Line(initDot, finalDot, currPlayer.id));
    }
  } else {
    console.log("no x and y");
  }

  currGame.save();
}

function removePrevLines() {
  document.querySelectorAll(".preview").forEach(line => line.remove());
}

function lineMade(line) {
  console.log("lineMade", line);

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

function playerTurn() {
  pointerDownEvent(false);

  if (!(currGame?.players?.length > 0)) {
    console.error('not enough players for the game', currGame);
    return false;
  }

  if (currPlayer != undefined) {
    if (currPlayer.id == currGame.players.length) {
      currPlayer = currGame.players[0];
    } else {
      currPlayer = currGame.players[currPlayer.id];
    }

    setupPlayerTurnList();
    if (currPlayer.isAlgo) {
      setupPlayerTurnListUI();
    } else {
      slideLeft();
    }

  } else {
    currPlayer = currGame.players[0];

    setupPlayerTurnList();
    setupPlayerTurnListUI();
  }

  if (currPlayer.isAlgo) {
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

  console.log(event, direction);

  switch (direction) {
    case "top":
      if (Number(event.target.dataset.row) > 1) {
        let nextRow = selectedDot ? parseInt(selectedDot.dataset.row) - 1 : parseInt(event.target.dataset.row) - 1;
        let nextCol = selectedDot ? parseInt(selectedDot.dataset.col) : parseInt(event.target.dataset.col);

        const nextDot = document.querySelector(`.dot[data-row="${nextRow}"][data-col="${nextCol}"]`);

        nextDot.focus();

        if (selectedDot) {
          prevLineMaker(
            new Line(
              new Dot(
                selectedDot.dataset.row, selectedDot.dataset.col
              ),
              new Dot(
                nextRow, nextCol
              )
            )
          );
        }
      }

      break;

    case "right":
      if (Number(event.target.dataset.col) < currGame.gameBoard.col) {
        let nextRow = selectedDot ? parseInt(selectedDot.dataset.row) : parseInt(event.target.dataset.row);
        let nextCol = selectedDot ? parseInt(selectedDot.dataset.col) + 1 : parseInt(event.target.dataset.col) + 1;

        const nextDot = document.querySelector(`.dot[data-row="${nextRow}"][data-col="${nextCol}"]`);

        nextDot.focus();

        if (selectedDot) {
          prevLineMaker(
            new Line(
              new Dot(
                selectedDot.dataset.row, selectedDot.dataset.col
              ),
              new Dot(
                nextRow, nextCol
              )
            )
          );
        }
      }
      break;

    case "bottom":
      if (Number(event.target.dataset.row) < currGame.gameBoard.row) {
        let nextRow = selectedDot ? parseInt(selectedDot.dataset.row) + 1 : parseInt(event.target.dataset.row) + 1;
        let nextCol = selectedDot ? parseInt(selectedDot.dataset.col) : parseInt(event.target.dataset.col);

        const nextDot = document.querySelector(`.dot[data-row="${nextRow}"][data-col="${nextCol}"]`);

        nextDot.focus();

        if (selectedDot) {
          prevLineMaker(
            new Line(
              new Dot(
                selectedDot.dataset.row, selectedDot.dataset.col
              ),
              new Dot(
                nextRow, nextCol
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

        const nextDot = document.querySelector(`.dot[data-row="${nextRow}"][data-col="${nextCol}"]`);

        nextDot.focus();

        if (selectedDot) {
          prevLineMaker(
            new Line(
              new Dot(
                selectedDot.dataset.row, selectedDot.dataset.col
              ),
              new Dot(
                nextRow, nextCol
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

        addLine(new Line(
          new Dot(
            selectedDot.dataset.row, selectedDot.dataset.col
          ),
          new Dot(
            event.target.dataset.row, event.target.dataset.col
          ),
          currPlayer.id
        ));

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