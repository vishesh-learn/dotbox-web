function addPointerEvents() {
  const dotSVG = $(".dotSVG");

  $aEL(dotSVG, "pointerdown", pointerDown);
  $aEL(dotSVG, "pointermove", linePrev);
  $aEL(dotSVG, "pointerup", pointerUp);
}

function removePointerEvents() {
  const dotSVG = $(".dotSVG");

  $rEL(dotSVG, "pointerdown", pointerDown);
  $rEL(dotSVG, "pointermove", linePrev);
  $rEL(dotSVG, "pointerup", pointerUp);
}

function pointerDown(event) {
  const dotSVG = $(".dotSVG"), svgC = $(".svgC");
  var x = event.offsetX, y = event.offsetY;

  if (x && y) {
    let nearInitDot = nearestDot(x, y);
    initDot = new Dot(
      nearInitDot.cx.baseVal.value,
      nearInitDot.cy.baseVal.value
    );

    if (difference(x, initDot.x) <= game.gameBoard.gap / 2
      && difference(y, initDot.y) <= game.gameBoard.gap / 2) {
      $aEL(dotSVG, "pointermove", linePrev);
      $aEL(svgC, "pointerup", pointerUp);
    } else {
      console.log("line drawing canceled");
    }
  }
}

function pointerUp(event) {
  const dotSVG = $(".dotSVG"), svgC = $(".svgC");

  $rEL(dotSVG, "pointermove", linePrev);
  $rEL(svgC, "pointerup", pointerUp);

  var x = event.offsetX, y = event.offsetY;

  made = new Made();

  abc = setTimeout(removePrevLines);
  //removePrevLines();

  if (initDot && x && y) {
    finalDot = nearDot(x, y);
    
    if (
      validateLines(finalDot)
      && difference(x, finalDot.x) <= game.gameBoard.gap / 2
      && difference(y, finalDot.y) <= game.gameBoard.gap / 2
    ) {
      lineMaker(new Line(initDot.x, initDot.y, finalDot.x, finalDot.y));
    }
  } else {
    console.log("no x and y");
  }
}

function removePrevLines() { clearTimeout(abc);
  $All(".prevLine").forEach(line => line.remove());
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
  //console.log(box);
}

function gameEvent() {
  if (made.lineMade) {
    if (made.boxMade > 0) {
      currPlayer.score += made.boxMade;
    } else {
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
    if (currPlayer.id == game.playerList.length) {
      currPlayer = game.playerList[0];
    } else {
      currPlayer = game.playerList[currPlayer.id];
    }

    setupPlayerTurnList();
    if (currPlayer.isAlgo) {
      setupPlayerTurnListUI();
    } else {
      slideLeft();
    }

  } else {
    currPlayer = game.playerList[0];

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
  if (pendingPossiblelines.length <= 0) {
    return true;
  }

  return false;
}
