//------------------------------------------------------
// Work-around not being able to pass operators as arguments. Using functions as arguments instead

function whichOp (operatorNo, el1, el2) {
    if (operatorNo === 0) {
        return greaterOp(el1, el2)
    } else if (operatorNo === 1) {
        return lessOp(el1, el2)
    } else {
        return equalsOp(el1, el2)
    }
}

function greaterOp (el1, el2) {
    a = el1 > el2
    return a
}

function lessOp (el1, el2) {
    a = el1 < el2
    return a
}

function equalsOp (el1, el2) {
    a = el1 === el2
    return a
}
//------------------------------------------------------

drawPathLogic1 = function (operatorArr, p, i) {
    /** Returns a boolien based on where the target tile (p[i]) is in reference to other parts of its path (p)
     * which is used in "DrawPath" to determine what ascii character to use
     * operatorArr accepts an array of 4 integers from 0 to 2 relating to what operator is required
     *      0 = >
     *      1 = <
     *      2 = ===
     * p accepts a "path" object */
    return ((whichOp(operatorArr[0], p[i - 1].x, p[i].x)) && (whichOp(operatorArr[1], p[i - 1].y, p[i].y)) &&
        (whichOp(operatorArr[2], p[i + 1].x, p[i].x)) && (whichOp(operatorArr[3], p[i + 1].y, p[i].y))) ||
        ((whichOp(operatorArr[0], p[i + 1].x, p[i].x)) && (whichOp(operatorArr[1], p[i + 1].y, p[i].y)) &&
        (whichOp(operatorArr[2], p[i - 1].x, p[i].x)) && (whichOp(operatorArr[3], p[i - 1].y, p[i].y)))
}

drawPathLogic2 = function (operatorArr, p, i) {
    /** Does same as "drawPathLogic1 however accepts an array instead of path object*/
    return ((whichOp(operatorArr[0], p[i - 1][0], p[i][0])) && (whichOp(operatorArr[1], p[i - 1][1], p[i][1])) &&
        (whichOp(operatorArr[2], p[i + 1][0], p[i][0])) && (whichOp(operatorArr[3], p[i + 1][1], p[i][1]))) ||
        ((whichOp(operatorArr[0], p[i + 1][0], p[i][0])) && (whichOp(operatorArr[1], p[i + 1][1], p[i][1])) &&
            (whichOp(operatorArr[2], p[i - 1][0], p[i][0])) && (whichOp(operatorArr[3], p[i - 1][1], p[i][1])))
}


//------------------------------------------------------ Helper functions for "DrawPath"
// each function determines the tile type and renders accordingly
// directly edits "board"

exports.endTile = function (i, p, board) {
    if (p[i].x === p[i + 1].x && p[i].y > p[i + 1].y) {
        board[p[i].y][p[i].x] = '└'
    } else if (p[i].x === p[i + 1].x && p[i].y < p[i + 1].y) {
        board[p[i].y][p[i].x] = '┌'
    } else {
        board[p[i].y][p[i].x] = '─'
    }
}
exports.startTile = function (i, p, board) {
    if (p[i - 1].x === p[i].x && p[i - 1].y < p[i].y){
        board[p[i].y][p[i].x] = '┘'
    } else if (p[i - 1].x === p[i].x && p[i - 1].y > p[i].y){
        board[p[i].y][p[i].x] = '┐'
    } else {
        board[p[i].y][p[i].x] = '─'
    }
}
exports.middleTile = function (i, p, board) {
    if (drawPathLogic1([1, 2, 0, 2], p, i)) {
        board[p[i].y][p[i].x] = '─'
    } else if (drawPathLogic1([2, 1, 2, 0], p, i)){
        board[p[i].y][p[i].x] = '│'
    } else if (drawPathLogic1([1, 2, 2, 1], p, i)){
        board[p[i].y][p[i].x] = '┘'
    } else if (drawPathLogic1([1, 2, 2, 0], p, i)){
        board[p[i].y][p[i].x] = '┐'
    } else if (drawPathLogic1([2, 1, 0, 2], p, i)){
        board[p[i].y][p[i].x] = '└'
    } else if (drawPathLogic1([2, 0, 0, 2], p, i)){
        board[p[i].y][p[i].x] = '┌'
    } else { // Sends to console where in the path an error occured
        console.log(p[i - 1], p[i], p[i + 1])
    }
}
exports.backLSharedTile = function (sp, q, board) {
    if (sp[q + 1] === undefined){
        if (sp[q - 1][0] === sp[q][0] && sp[q - 1][1] > sp[q][1]) {
            board[sp[q][1]][p[q][0]] = '┐'
        }
        else {
            board[sp[q][1]][sp[q][0]] = '─'
        }
    } else {
        if (drawPathLogic2([1, 2, 0, 2], sp, q)) {
            board[sp[q][1]][sp[q][0]] = '┴' //'─'
        } else if (drawPathLogic2([2, 1, 2, 0], sp, q)) {
            board[sp[q][1]][sp[q][0]] = '┤' //'│'
        } else if (drawPathLogic2([1, 2, 2, 0], sp, q)) {
            board[sp[q][1]][sp[q][0]] = '┤' //'┐'
        } else if (drawPathLogic2([2, 1, 0, 2], sp, q)) {
            board[sp[q][1]][sp[q][0]] = '┴' //'└'
        } else if (drawPathLogic2([2, 0, 0, 2], sp, q)) {
            board[sp[q][1]][sp[q][0]] = '┼' //'┌'
        } else {
            console.log(1, sp[q - 1], sp[q], sp[q + 1])
        }
    }
}
exports.backRSharedTile = function (sp, q, board) {
    if (sp[q + 1] === undefined){
        if (sp[q - 1][0] === sp[q][0] && sp[q - 1][1] < sp[q][1]){
            board[sp[q][1]][sp[q][0]] = '┤'
        } else {
            board[sp[q][1]][sp[q][0]] = '┬'
        }
    } else {
        if (drawPathLogic2([1, 2, 0, 2], sp, q)) {
            board[sp[q][1]][sp[q][0]] = '┬' //'─'
        } else if (drawPathLogic2([2, 1, 2, 0], sp, q)) {
            board[sp[q][1]][sp[q][0]] = '┤' //'│'
        } else if (drawPathLogic2([1, 2, 2, 1], sp, q)) {
            board[sp[q][1]][sp[q][0]] = '┤' //'┘'
        } else if (drawPathLogic2([2, 1, 0, 2], sp, q)) {
            board[sp[q][1]][sp[q][0]] = '┼' //'└'
        } else if (drawPathLogic2([2, 0, 0, 2], sp, q)) {
            board[sp[q][1]][sp[q][0]] = '┬' //'┌'
        } else {
            console.log(2, sp[q - 1], sp[q], sp[q + 1])
        }
    }
}
exports.lSharedTile = function (sp, q, board) {
    if (drawPathLogic2([1, 2, 0, 2], sp, q)) {
        board[sp[q][1]][sp[q][0]] = '┴' //'─'
    } else if (drawPathLogic2([2, 1, 2, 0], sp, q)) {
        board[sp[q][1]][sp[q][0]] = '├' //'│'
    } else if (drawPathLogic2([1, 2, 2, 0], sp, q)) {
        board[sp[q][1]][sp[q][0]] = '┼' //'┐'
    } else if (drawPathLogic2([1, 2, 2, 1], sp, q)) {
        board[sp[q][1]][sp[q][0]] = '┴' //'┘'
    } else if (drawPathLogic2([2, 0, 0, 2], sp, q)) {
        board[sp[q][1]][sp[q][0]] = '├' //'┌'
    } else {
        console.log(3, sp[q - 1], sp[q], sp[q + 1])
    }
}
exports.rSharedTile = function (sp, q, board) {
    if (drawPathLogic2([1, 2, 0, 2], sp, q)) {
        board[sp[q][1]][sp[q][0]] = '┬' //'─'
    } else if (drawPathLogic2([2, 1, 2, 0], sp, q)) {
        board[sp[q][1]][sp[q][0]] = '├' //'│'
    } else if (drawPathLogic2([1, 2, 2, 0], sp, q)) {
        board[sp[q][1]][sp[q][0]] = '┬' //'┐'
    } else if (drawPathLogic2([1, 2, 2, 1], sp, q)) {
        board[sp[q][1]][sp[q][0]] = '┼' //'┘'
    } else if (drawPathLogic2([2, 1, 0, 2], sp, q)) {
        board[sp[q][1]][sp[q][0]] = '├' //'└'
    } else {
        console.log(4, sp[q - 1], sp[q], sp[q + 1])
    }
}
exports.flatSharedTile = function (sp, q, board) {
    if (drawPathLogic2([2, 1, 2, 0], sp, q)) {
        board[sp[q][1]][sp[q][0]] = '┼' //'│'
    } else if (drawPathLogic2([1, 2, 2, 0], sp, q)) {
        board[sp[q][1]][sp[q][0]] = '┬' //'┐'
    } else if (drawPathLogic2([1, 2, 2, 1], sp, q)) {
        board[sp[q][1]][sp[q][0]] = '┴' //'┘'
    } else if (drawPathLogic2([2, 1, 0, 2], sp, q)) {
        board[sp[q][1]][sp[q][0]] = '┴' //'└'
    } else {
        console.log(4, sp[q - 1], sp[q], sp[q + 1])
    }
}

//------------------------------------------------------
