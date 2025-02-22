function getSurroundingDots(dot) {
    var top = getDotAtTop(dot);

    var right = getDotAtRight(dot);

    var bottom = getDotAtBottom(dot);

    var left = getDotAtLeft(dot);
    
    var options = [top, right, bottom, left]
        .filter(findDotE);
    
    return options;
}

function getDotAtTop(dot) {
    var dotAtTop = new Dot(
        dot.x,
        dot.y - currGame.gameBoard.gap,
        'top'
    );

    return findDotE(dotAtTop) ? dotAtTop : false;
}

function getDotAtRight(dot) {
    var dotAtRight = new Dot(
        dot.x + currGame.gameBoard.gap,
        dot.y,
        "right",
    );

    return findDotE(dotAtRight) ? dotAtRight : false;
}

function getDotAtBottom(dot) {
    var dotAtBottom = new Dot(
        dot.x,
        dot.y + currGame.gameBoard.gap,
        "bottom",
    );

    return findDotE(dotAtBottom) ? dotAtBottom : false;
}

function getDotAtLeft(dot) {
    var dotAtLeft = new Dot(
        dot.x - currGame.gameBoard.gap,
        dot.y,
        'left',
    );

    return findDotE(dotAtLeft) ? dotAtLeft : false;
}

function findDotE(dot) {
    var dotsE = document.querySelectorAll("circle"), existingDot;

    for (const existingDotUI of dotsE) {
        existingDot = new Dot(
            existingDotUI.cx.baseVal.value,
            existingDotUI.cy.baseVal.value
        );

        if (compareDots(dot, existingDot)) {
            return existingDotUI;
        }
    }
    
    return false;
}

function compareDots(dot1, dot2) {
    if (typeof dot1 != "object" || typeof dot2 != "object") {
        return false;
    }

    if (typeof dot1.x != "number" || typeof dot1.y != "number") {
        console.error("invalid dot1 provided for comparison", { dot1, dot2 });

        return false;
    }

    if (typeof dot2.x != "number" || typeof dot2.y != "number") {
        console.error("invalid dot2 provided for comparison");

        return false;
    }

    return (dot1.x == dot2.x) && (dot1.y == dot2.y);
}