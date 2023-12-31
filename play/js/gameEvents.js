function addPointerEvents() {
  const svgC = document.querySelector(".svgC");

  $aEL(svgC, "pointerdown", pointerDown);
  $aEL(svgC, "pointermove", linePrev);
  $aEL(svgC, "pointerup", pointerUp);
}

function removePointerEvents() {
  const svgC = document.querySelector(".svgC");

  $rEL(svgC, "pointerdown", pointerDown);
  $rEL(svgC, "pointermove", linePrev);
  $rEL(svgC, "pointerup", pointerUp);
}

function pointerDown(event) {
  const svgC = document.querySelector(".svgC");
  var x = event.offsetX, y = event.offsetY;

  if (x && y) {
    let nearInitDot = nearestDot(x, y);
    initDot = new Dot(
      nearInitDot.cx.baseVal.value,
      nearInitDot.cy.baseVal.value
    );

    if (difference(x, initDot.x) <= currGame.gameBoard.gap / 2
      && difference(y, initDot.y) <= currGame.gameBoard.gap / 2) {
      $aEL(svgC, "pointermove", linePrev);
      $aEL(svgC, "pointerup", pointerUp);
    } else {
      console.log("line drawing canceled");
    }
  }
}

function pointerUp(event) { console.log(event);
  const svgC = document.querySelector(".svgC");

  $rEL(svgC, "pointermove", linePrev);
  $rEL(svgC, "pointerup", pointerUp);

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

function gameEvent() { //console.log(made);
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
  removePointerEvents();

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
    addPointerEvents();
  }
}

function isEnd() {
  return pendingPossiblelines.length <= 0;
}
