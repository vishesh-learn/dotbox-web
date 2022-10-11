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
        initDot = nearestDot(x, y);
        initDot = dotEToJSON(initDot);

        $aEL(dotSVG, "pointermove", linePrev);
        $aEL(svgC, "pointerup", pointerUp);
    }
}

function pointerUp(){
  const dotSVG = $(".dotSVG"), svgC = $(".svgC");

  $rEL(dotSVG, "pointermove", linePrev);
  $rEL(svgC, "pointerup", pointerUp);

  var x = event.offsetX, y = event.offsetY;

  made = new Made();

  let x_cx = difference(x, initDot.cx);

  let y_cy = difference(y, initDot.cy);

  var prevLines = $All(".prevLine");

  for(let o of prevLines){
    o.remove();
  }

    if(initDot && x && y){
        finalDot = nearDot(x, y);
        if(validateLines(finalDot)){
            lineMaker(dotsToLine(initDot, finalDot));
        }
    } else {
        console.log("no x and y");
    }
}

function lineMade(line){ // This function is working fine.
  made.lineMade = true;

  isEnd();

  gameEvent();
}

function gameEvent(){
  if(made.lineMade){

    if(made.boxMade > 0){
        currPlayer.score += made.boxMade;

        if (currPlayer.isAlgo && !made.allLines) {
          made = new Made();
          autoDrawLine();
        }
    } else {
        playerTurn();
    }

    if(made.allLines){
        winBoard();
    }
  }

  made = new Made();
}

function playerTurn(){
  if (currPlayer != undefined) {
    if (currPlayer.id == playerList.length) {
      currPlayer = playerList[0];
    } else {
      currPlayer = playerList[currPlayer.id];
    }

    setupPlayerTurnList();
    slideLeft();
  } else {
    currPlayer = playerList[0];

    setupPlayerTurnList();
    setupPlayerTurnListUI();
  }

  if(currPlayer.isAlgo){
    autoDrawLine();
  }
}

function isEnd(){
    if(getAllPossibleLines().length <= 0){
      made.allLines = true;
    }
}
