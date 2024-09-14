function pointerDownEvent(listen = true) {
  const board = document.querySelector(".dotSVG");

  if (listen) {
    board.addEventListener("pointerdown", pointerDown);
  } else {
    board.removeEventListener("pointerdown", pointerDown);
  }
}

function pointerMoveAndUPEvents(listen = true) {
  const board = document.querySelector(".svgC");

  if (listen) {
    board.addEventListener("pointermove", linePrev);
    board.addEventListener("pointerup", pointerUp);
  } else {
    board.removeEventListener("pointermove", linePrev);
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

    if (difference(x, initDot.x) <= currGame.gameBoard.gap / 2
      && difference(y, initDot.y) <= currGame.gameBoard.gap / 2) {
      pointerMoveAndUPEvents(true);

      let validFinalDots = getSurroundingDots(initDot).filter(validFinalDot => {
        var possibleLine = new Line(
          initDot.x, initDot.y, validFinalDot.x, validFinalDot.y
        );

        return !lineNotExists(possibleLine, pendingPossiblelines);
      })

      // console.log(validFinalDots);
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
  document.querySelectorAll(".prevLine").forEach(line => line.remove());
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
