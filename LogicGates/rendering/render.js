const logic = require("./renderDecisions")

function isArrayPathInSharedPath(arrayPath, sharedPath){
    for (let j = 0; j < sharedPath.length; j++){
        if (arrayPath[0] === sharedPath[j][0] && arrayPath[1] === sharedPath[j][1]) {
            return [true, j]
        }
    }
    return [false, 0]
}


exports.drawPath = function (p, board, sp){
    /** Renders the path on board */
    for (let i = 0; i < p.length; i++){
        // End/Start path tiles only have either i + 1 or i - 1. Dealing with them seperatly means we avoid errors further on
        if (p[i+1] && !p[i-1]){
            logic.endTile(i, p, board)
        } else if (p[i-1] && !p[i+1]){
            logic.startTile(i, p, board)
        } else if (p[i-1] && p[i+1]){
            logic.middleTile(i, p, board)
        }
    }
    let arrayPath = [];
    if (sp.length > 0){
        // Creates new array and pushes all items from (path object) p into arrayPath in format [x, y]
        for (let i = 0; i < p.length; i++) {
            arrayPath.push([p[i].x, p[i].y])
        }
        for (let i = 0; i < p.length; i++){
            let o = isArrayPathInSharedPath(arrayPath[i], sp)
            let q = o[1]
            if (isArrayPathInSharedPath(arrayPath[i], sp)[0]){
                if (board[arrayPath[i][1]][arrayPath[i][0]] === "┘"){
                    logic.backLSharedTile(sp, q, board)
                } else if (board[arrayPath[i][1]][arrayPath[i][0]] === "┐"){
                    logic.backRSharedTile(sp, q, board)
                } else if (board[arrayPath[i][1]][arrayPath[i][0]] === "└"){
                    logic.lSharedTile(sp, q, board)
                } else if (board[arrayPath[i][1]][arrayPath[i][0]] === "┌"){
                    logic.rSharedTile(sp, q, board)
                } else if (board[arrayPath[i][1]][arrayPath[i][0]] === "─"){
                    logic.flatSharedTile(sp, q, board)
                }
                break
            }
        }
    }
}
