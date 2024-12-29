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

    return findDotE(dotAtTop);
}

function getDotAtRight(dot) {
    var dotAtRight = new Dot(
        dot.x + currGame.gameBoard.gap,
        dot.y,
        "right",
    );

    return findDotE(dotAtRight);
}

function getDotAtBottom(dot) {
    var dotAtBottom = new Dot(
        dot.x,
        dot.y + currGame.gameBoard.gap,
        "bottom",
    );

    return findDotE(dotAtBottom);
}

function getDotAtLeft(dot) {
    var dotAtLeft = new Dot(
        dot.x - currGame.gameBoard.gap,
        dot.y,
        'left',
    );

    return findDotE(dotAtLeft);
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
    return (dot1.x == dot2.x) && (dot1.y == dot2.y);
}