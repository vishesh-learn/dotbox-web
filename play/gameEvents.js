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
    initDot = dotEToJSON(nearInitDot);

    if (difference(x, initDot.cx) <= game.gameBoard.gap / 2
      && difference(y, initDot.cy) <= game.gameBoard.gap / 2) {
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

  removePrevLines();

  if (initDot && x && y) {
    finalDot = nearDot(x, y);

    if (
      validateLines(finalDot)
      && difference(x, finalDot.cx) <= game.gameBoard.gap / 2
      && difference(y, finalDot.cy) <= game.gameBoard.gap / 2
    ) {
      lineMaker(new Line(initDot.cx, initDot.cy, finalDot.cx, finalDot.cy));
    }
  } else {
    console.log("no x and y");
  }
}

function removePrevLines() {
  var prevLines = $All(".prevLine");

  for (let o of prevLines) {
    o.remove();
  }
}

function lineMade(line) {
  made.lineMade = true;

  allPossibleLines.forEach((possibleLine, index) => {
    if (compareLineObj(possibleLine, line)) {
      var l = allPossibleLines.splice(index, 1);
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
  if (allPossibleLines.length <= 0) {
    return true;
  }

  return false;
}
