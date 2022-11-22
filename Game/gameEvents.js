function pointerOver(){
    const target = event.target;
    const doth = $All(".doth");

    if(target.classList.contains("doth")){
        target.classList.remove("invisible");
    }

    if(target.tagName == "svg"){
        for(let o of doth){
            o.classList.add("invisible");
        }
    }
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

function pointerUp(){
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

function lineMade(){ // This function is working fine.
  made.lineMade = true;

  isEnd();

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
    if(getAllPossibleLines().length <= 0){
      return true;
    }

    return false;
}
