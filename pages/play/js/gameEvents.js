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
      nearInitDot.cx.baseVal.value,
      nearInitDot.cy.baseVal.value
    );

    const inRange = difference(x, initDot.x) <= currGame.gameBoard.gap / 2
      && difference(y, initDot.y) <= currGame.gameBoard.gap / 2;

    if (inRange) {
      pointerMoveAndUPEvents(true);

      getSurroundingDots(initDot).filter(validFinalDot => {
        var possibleLine = new Line(
          initDot.x, initDot.y, validFinalDot.x, validFinalDot.y
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
      validateLines(finalDot)
      && difference(x, finalDot.x) <= currGame.gameBoard.gap / 2
      && difference(y, finalDot.y) <= currGame.gameBoard.gap / 2
    ) {
      addLine(new Line(initDot.x, initDot.y, finalDot.x, finalDot.y, currPlayer.id));
    }
  } else {
    console.log("no x and y");
  }

  saveCurrGame();
}

function removePrevLines() {
  document.querySelectorAll(".preview").forEach(line => line.remove());
}

function lineMade(line) {
  made.lineMade = true;

  pendingPossiblelines.forEach((possibleLine, index) => {
    if (compareLineObj(possibleLine, line)) {
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
    // autoDrawLine();
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

let selectedDot;

function dotNavigate(event, direction) {
  if (!event.target.classList.contains("dot")) {
    console.log("dotNavigate -> not dot");

    return false;
  }

  console.log(event, direction);

  switch (direction) {
    case "top":
      if (event.target.dataset.row > 1) {
        let nextRow = parseInt(event.target.dataset.row) - 1;

        const nextDot = document.querySelector(`.dot[data-row="${nextRow}"][data-col="${event.target.dataset.col}"]`);

        nextDot.focus();

        if (selectedDot) {
          prevLineMaker(
            new Line(
              selectedDot.cx.baseVal.value, selectedDot.cy.baseVal.value, nextDot.cx.baseVal.value, nextDot.cy.baseVal.value
            )
          );
        }
      }

      break;

    case "right":
      if (event.target.dataset.col < currGame.gameBoard.col) {
        let nextCol = parseInt(event.target.dataset.col) + 1;

        document.querySelector(`.dot[data-row="${event.target.dataset.row}"][data-col="${nextCol}"]`).focus();
      }
      break;

    case "bottom":
      if (event.target.dataset.row < currGame.gameBoard.row) {
        let nextRow = parseInt(event.target.dataset.row) + 1;

        document.querySelector(`.dot[data-row="${nextRow}"][data-col="${event.target.dataset.col}"]`).focus();
      }
      break;

    case "left":
      if (event.target.dataset.col > 1) {
        let nextCol = parseInt(event.target.dataset.col) - 1;

        document.querySelector(`.dot[data-row="${event.target.dataset.row}"][data-col="${nextCol}"]`).focus();
      }
      break;

    case "enter":
      selectedDot = event.target;

      console.log("selectedDot", selectedDot);
      break;

    default:
      console.log('dotNavigate -> default direction');
      break;
  }
}