function addPointerEvents(){
  const dotSVG = $(".dotSVG");

  $aEL(dotSVG, "pointermove", linePrev);
  $aEL(dotSVG, "pointerdown", pointerDown);
  $aEL(dotSVG, "pointerup", pointerUp);
}

function removePointerEvents(){
  const dotSVG = $(".dotSVG");

  $rEL(dotSVG, "pointermove", linePrev);
  $rEL(dotSVG, "pointerdown", pointerDown);
  $rEL(dotSVG, "pointerup", pointerUp);
}

function pointerDown(){
  const dotSVG = $(".dotSVG"), svgC = $(".svgC");
  var x = event.offsetX, y = event.offsetY;

    if(x && y){
        let nearInitDot = nearestDot(x, y);
        initDot = dotEToJSON(nearInitDot);

        if (difference(x, initDot.cx) <= gameBoard.gap/2
        && difference(y, initDot.cy) <= gameBoard.gap/2) {
          $aEL(dotSVG, "pointermove", linePrev);
          $aEL(svgC, "pointerup", pointerUp);
        } else {
          console.log("line drawing canceled");
        }
    }
}

var removePrevLinesTimeOut;

function pointerUp(event){
  const dotSVG = $(".dotSVG"), svgC = $(".svgC");

  $rEL(dotSVG, "pointermove", linePrev);
  $rEL(svgC, "pointerup", pointerUp);

  var x = event.offsetX, y = event.offsetY;

  made = new Made();

  removePrevLines();

  if(initDot && x && y){
    finalDot = nearDot(x, y);
    
    if(
        validateLines(finalDot)
        && difference(x, finalDot.cx) <= gameBoard.gap/2
        && difference(y, finalDot.cy) <= gameBoard.gap/2
      ){
        lineMaker(dotsToLine(initDot, finalDot));
    }
  } else {
    console.log("no x and y");
  }
}

function removePrevLines(){
  var prevLines = $All(".prevLine");

  for(let o of prevLines){
    o.remove();
  }
}

function lineMade(line){
  made.lineMade = true;

  allPossibleLines.forEach((possibleLine, index) => {
    if (compareLineObj(possibleLine, line)) {
      var l = allPossibleLines.splice(index, 1);
    }
  });
  
  gameEvent();
}

function gameEvent(){
  if(made.lineMade){

    if(made.boxMade > 0){
        currPlayer.score += made.boxMade;
    } else {
      playerTurn();
    }

    if(isEnd()){
        winBoard();
    }
  }

  made = new Made();
}

function playerTurn(){
  clearTimeout(playerTurnTimeOut);

  removePointerEvents();

  if (currPlayer != undefined) {
    if (currPlayer.id == playerList.length) {
      currPlayer = playerList[0];
    } else {
      currPlayer = playerList[currPlayer.id];
    }

    setupPlayerTurnList();
    if (currPlayer.isAlgo) {
      setupPlayerTurnListUI();
    } else {
      slideLeft();
    }

  } else {
    currPlayer = playerList[0];

    setupPlayerTurnList();
    setupPlayerTurnListUI();
  }

  if(currPlayer.isAlgo){
    //timeout with time value '0' is by purpose
    autoDrawLineTimeOut = setTimeout(autoDrawLine, 0);
    //autoDrawLine();
  } else {
    addPointerEvents();
  }
}

function isEnd(){
    if(allPossibleLines.length <= 0){
      return true;
    }

    return false;
}
