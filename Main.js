const cloneDeep = require('lodash/clonedeep');
const PF = require('pathfinding');

function IsIn(value, array){
    for (let ArrayVal = 0; ArrayVal < array.length; ArrayVal++){
        if (array[ArrayVal] === value){
            return true
        }
    }
    return false
}

var placedNotVars = []

function LogicGate(x, y, type, inputs, _parent){
    this.x = x;
    this.y = y;
    this.type = type;
    this.parent = _parent;
    // console.log(this.type, this.parentType)
    this.typeList = [];
    this.height = inputs.length;
    this.outputPos = {x:x + 1, y:y};
    if (type !== "NOT" && (/^[A-Z]+$/.test(type))){
        this.height ++
    }
    this.inputs = inputs

    this.inputsPos = []
    for (let i = 0; i < this.inputs.length; i ++){
        this.inputsPos.push({x:x - this.type.length, y:y + i})
    }
    // console.log(this.x, this.y, this.type, this.inputsPos)
    for (let i = 0; i < this.inputs.length; i++){
        if (this.inputs[i].type === "NOT"){
            this.inputs[i].y = this.inputs[i].children[0].y
        }
    }
    this.inputs.sort((a, b) => {
        if (a.y > b.y) {
            return 1
        } else {
            return -1
        }
    })

    this.place = function (board) {
        /** Places the logic gate and it's children on the board and draws lines to them */
        for (let i = 0; i < this.type.length; i++) {
            this.typeList.push(this.type[i])
        }
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.type.length; j++) {
                board[this.y + i].splice(this.x - j, 1, this.typeList[this.typeList.length - 1 - j]);
            }
        }
        if (this.inputs.length > 0) {
            for (let j = 0; j < this.inputs.length; j++) {
                this.inputs[j].place(board)
            }
        }
    }
    this.draw = function (board) {
        for (let i = 0; i < this.inputs.length; i++) {
            if (this.type === "NOT") {
                if (!IsIn(this.inputs[i].type, placedNotVars)) {
                    let o = FindPath(board, this.inputsPos[i].x, this.inputsPos[i].y,
                        this.inputs[i].outputPos.x, this.inputs[i].outputPos.y, this)
                    this.p = o[0]
                    placedNotVars.push(this.inputs[i].type)
                    DrawPath(this.p, board, o[1])
                }
                placedPaths.push(this.p)
            } else {
                let o = FindPath(board, this.inputsPos[i].x, this.inputsPos[i].y,
                    this.inputs[i].outputPos.x, this.inputs[i].outputPos.y, this)
                this.p = o[0]
                DrawPath(this.p, board, o[1])
                placedPaths.push(this.p)

            }
        }
        if (this.inputs.length > 0) {
            for (let j = 0; j < this.inputs.length; j++) {
                this.inputs[j].draw(board)
            }
        }
    }

}

var placedPaths = []

function ConvertBoardToGrid(board, sharedPath){
    let b = cloneDeep(board)
    for (let y = 0; y < b.length; y++){
        for (let x = 0; x < b[y].length; x++){
            if (b[y][x] === " "){
                b[y][x] = 0;
            }else if(IsIn(b[y][x], ['─', '│'])){
                b[y][x] = 1;
            }else if(IsIn(b[y][x], ['┘', '┐', '┌', '└' , '┤', '┴', '┬', '├'])){
                b[y][x] = 4;
            }
            if(IsIn(b[y][x], ["║", "-", "╢"]) || /^[A-Z]+$/.test(b[y][x])) {
                b[y][x] = 2;
            }else if (b[y][x + 1] && IsIn(b[y][x + 1], ["║", "-", "╢"]) || /^[A-Z]+$/.test(b[y][x + 1])){
                b[y][x] = 5;
            }else if (board[y][x - 1] && IsIn(board[y][x - 1], ["║", "-", "╢"]) || /^[A-Z]+$/.test(board[y][x - 1])) {
                b[y][x] = 5;
            }else{
                for (let i = 0; i < sharedPath.length; i++){
                    if (x === sharedPath[i][0] && y === sharedPath[i][1]){
                        b[y][x] = 3;
                    }
                }
            }
        }
    }
    // console.log("\n")
    // for (let i = 0; i < b.length; i++){
    //     console.log(b[i].join(""))
    // }
    return b
}


function FindPath(board, startX, startY, endX, endY) {
    /** Converts board to a grid and returns a path between two points*/
    // Grouping paths from same parents
    let sharedPath = [];
    for (let i = 0; i < placedPaths.length; i++){
        if (placedPaths[i][placedPaths[i].length - 1].x === endX && placedPaths[i][placedPaths[i].length - 1].y === endY){
            for (let j = 0; j < placedPaths[i].length; j++){
                sharedPath.push([placedPaths[i][j].x, placedPaths[i][j].y])
            }
        }
    }
    let b = ConvertBoardToGrid(board, sharedPath)
    let grid = new PF.Grid(b[0].length, b.length);
    for (let y = 0; y < b.length; y++) {
        for (let x = 0; x < b[0].length; x++) {
            if (b[y][x] === 2) {
                grid.setWalkableAt(x, y, false)
            } else if (b[y][x] === 1) {
                grid.setWeightAt(x, y, 2)
            } else if (b[y][x] === 5) {
                grid.setWeightAt(x, y, 100)
            } else if (b[y][x] === 3) {
                grid.setWeightAt(x, y, .5)
            } else if (b[y][x] === 4) {
                grid.setWeightAt(x, y, 5)
            } else {
                grid.setWalkableAt(x, y, true)
            }
        }
    }
    let finder = new PF.AStarFinder(
        {heuristic: PF.Heuristic.manhattan} // Want to change to custom heuristic which favours less corners
    )
    let path = finder.findPath(startX, startY, endX, endY, grid);
    let p = []
    for (let i = 0; i < path.length; i++) {
        p.push({x: path[i][0], y: path[i][1]})
    }
    return [p, sharedPath];
}


function isArrayPathInSharedPath(arrayPath, sharedPath){
    for (let j = 0; j < sharedPath.length; j++){
        if (arrayPath[0] === sharedPath[j][0] && arrayPath[1] === sharedPath[j][1]) {
            return [true, j]
        }
    }
    return [false, 0]
}


function DrawPath(p, board, sharedPath){
    for (let i = 0; i < p.length; i++){
        if (p[i+1] && !p[i-1]){
            if (p[i].x === p[i + 1].x && p[i].y > p[i + 1].y) {
                board[p[i].y][p[i].x] = '└'
            } else if (p[i].x === p[i + 1].x && p[i].y < p[i + 1].y) {
                board[p[i].y][p[i].x] = '┌'
            } else {
                board[p[i].y][p[i].x] = '─'
            }
        } else if (p[i-1] && !p[i+1]){
            if (p[i - 1].x === p[i].x && p[i - 1].y < p[i].y){
                board[p[i].y][p[i].x] = '┘'
            } else if (p[i - 1].x === p[i].x && p[i - 1].y > p[i].y){
                board[p[i].y][p[i].x] = '┐'
            } else {
                board[p[i].y][p[i].x] = '─'
            }
        } else if (p[i-1] && p[i+1]){
            if (((p[i - 1].x < p[i].x && p[i - 1].y === p[i].y) && (p[i + 1].x > p[i].x && p[i + 1].y === p[i].y)) ||
                ((p[i + 1].x < p[i].x && p[i + 1].y === p[i].y) && (p[i - 1].x > p[i].x && p[i - 1].y === p[i].y))){
                board[p[i].y][p[i].x] = '─'
            } else if (((p[i - 1].x === p[i].x && p[i - 1].y < p[i].y) && (p[i + 1].x === p[i].x && p[i + 1].y > p[i].y)) ||
                       ((p[i + 1].x === p[i].x && p[i + 1].y < p[i].y) && (p[i - 1].x === p[i].x && p[i - 1].y > p[i].y))){
                board[p[i].y][p[i].x] = '│'
            } else if (((p[i - 1].x < p[i].x && p[i - 1].y === p[i].y) && (p[i + 1].x === p[i].x && p[i + 1].y < p[i].y)) ||
                       ((p[i + 1].x < p[i].x && p[i + 1].y === p[i].y) && (p[i - 1].x === p[i].x && p[i - 1].y < p[i].y))){
                board[p[i].y][p[i].x] = '┘'
            } else if (((p[i - 1].x < p[i].x && p[i - 1].y === p[i].y) && (p[i + 1].x === p[i].x && p[i + 1].y > p[i].y)) ||
                       ((p[i + 1].x < p[i].x && p[i + 1].y === p[i].y) && (p[i - 1].x === p[i].x && p[i - 1].y > p[i].y))){
                board[p[i].y][p[i].x] = '┐'
            } else if (((p[i - 1].x === p[i].x && p[i - 1].y < p[i].y) && (p[i + 1].x > p[i].x && p[i + 1].y === p[i].y)) ||
                       ((p[i + 1].x === p[i].x && p[i + 1].y < p[i].y) && (p[i - 1].x > p[i].x && p[i - 1].y === p[i].y))){
                board[p[i].y][p[i].x] = '└'
            } else if (((p[i - 1].x === p[i].x && p[i - 1].y > p[i].y) && (p[i + 1].x > p[i].x && p[i + 1].y === p[i].y)) ||
                       ((p[i + 1].x === p[i].x && p[i + 1].y > p[i].y) && (p[i - 1].x > p[i].x && p[i - 1].y === p[i].y))) {
                board[p[i].y][p[i].x] = '┌'
            } else {
                console.log(p[i - 1], p[i], p[i + 1])
            }
        }

    }
    let arrayPath = [];
    if (sharedPath.length > 0){
        for (let i = 0; i < p.length; i++) {
            arrayPath.push([p[i].x, p[i].y])
        }
        for (let i = 0; i < p.length; i++){
            let o = isArrayPathInSharedPath(arrayPath[i], sharedPath)
            let q = o[1]
            if (isArrayPathInSharedPath(arrayPath[i], sharedPath)[0]){
                if (board[arrayPath[i][1]][arrayPath[i][0]] === "┘"){
                    if (sharedPath[q + 1] === undefined){
                        console.log(1)
                    } else if (sharedPath[q - 1] === undefined){
                        console.log(2)
                    } else {
                        if (((sharedPath[q - 1][0] < sharedPath[q][0] && sharedPath[q - 1][1] === sharedPath[q][1]) && (sharedPath[q + 1][0] > sharedPath[q][0] && sharedPath[q + 1][1] === sharedPath[q][1])) ||
                            ((sharedPath[q + 1][0] < sharedPath[q][0] && sharedPath[q + 1][1] === sharedPath[q][1]) && (sharedPath[q - 1][0] > sharedPath[q][0] && sharedPath[q - 1][1] === sharedPath[q][1]))){
                            board[sharedPath[q][1]][sharedPath[q][0]] = '┴' //'─'
                        } else if (((sharedPath[q - 1][0] === sharedPath[q][0] && sharedPath[q - 1][1] < sharedPath[q][1]) && (sharedPath[q + 1][0] === sharedPath[q][0] && sharedPath[q + 1][1] > sharedPath[q][1])) ||
                            ((sharedPath[q + 1][0] === sharedPath[q][0] && sharedPath[q + 1][1] < sharedPath[q][1]) && (sharedPath[q - 1][0] === sharedPath[q][0] && sharedPath[q - 1][1] > sharedPath[q][1]))){
                            board[sharedPath[q][1]][sharedPath[q][0]] = '┤' //'│'
                        } else if (((sharedPath[q - 1][0] < sharedPath[q][0] && sharedPath[q - 1][1] === sharedPath[q][1]) && (sharedPath[q + 1][0] === sharedPath[q][0] && sharedPath[q + 1][1] > sharedPath[q][1])) ||
                            ((sharedPath[q + 1][0] < sharedPath[q][0] && sharedPath[q + 1][1] === sharedPath[q][1]) && (sharedPath[q - 1][0] === sharedPath[q][0] && sharedPath[q - 1][1] > sharedPath[q][1]))){
                            board[sharedPath[q][1]][sharedPath[q][0]] = '┤' //'┐'
                        } else if (((sharedPath[q - 1][0] === sharedPath[q][0] && sharedPath[q - 1][1] < sharedPath[q][1]) && (sharedPath[q + 1][0] > sharedPath[q][0] && sharedPath[q + 1][1] === sharedPath[q][1])) ||
                            ((sharedPath[q + 1][0] === sharedPath[q][0] && sharedPath[q + 1][1] < sharedPath[q][1]) && (sharedPath[q - 1][0] > sharedPath[q][0] && sharedPath[q - 1][1] === sharedPath[q][1]))){
                            board[sharedPath[q][1]][sharedPath[q][0]] = '┴' //'└'
                        } else if (((sharedPath[q - 1][0] === sharedPath[q][0] && sharedPath[q - 1][1] > sharedPath[q][1]) && (sharedPath[q + 1][0] > sharedPath[q][0] && sharedPath[q + 1][1] === sharedPath[q][1])) ||
                            ((sharedPath[q + 1][0] === sharedPath[q][0] && sharedPath[q + 1][1] > sharedPath[q][1]) && (sharedPath[q - 1][0] > sharedPath[q][0] && sharedPath[q - 1][1] === sharedPath[q][1]))) {
                            board[sharedPath[q][1]][sharedPath[q][0]] = '┼' //'┌'
                        } else {
                            console.log(sharedPath[q - 1], sharedPath[q], sharedPath[q + 1])
                        }
                    }
                } else if (board[arrayPath[i][1]][arrayPath[i][0]] === "┐"){
                    if (sharedPath[q + 1] === undefined){
                        console.log(1)
                    } else if (sharedPath[q - 1] === undefined){
                        console.log(2)
                    } else {
                        if (((sharedPath[q - 1][0] < sharedPath[q][0] && sharedPath[q - 1][1] === sharedPath[q][1]) && (sharedPath[q + 1][0] > sharedPath[q][0] && sharedPath[q + 1][1] === sharedPath[q][1])) ||
                            ((sharedPath[q + 1][0] < sharedPath[q][0] && sharedPath[q + 1][1] === sharedPath[q][1]) && (sharedPath[q - 1][0] > sharedPath[q][0] && sharedPath[q - 1][1] === sharedPath[q][1]))){
                            board[sharedPath[q][1]][sharedPath[q][0]] = '┬' //'─'
                        } else if (((sharedPath[q - 1][0] === sharedPath[q][0] && sharedPath[q - 1][1] < sharedPath[q][1]) && (sharedPath[q + 1][0] === sharedPath[q][0] && sharedPath[q + 1][1] > sharedPath[q][1])) ||
                            ((sharedPath[q + 1][0] === sharedPath[q][0] && sharedPath[q + 1][1] < sharedPath[q][1]) && (sharedPath[q - 1][0] === sharedPath[q][0] && sharedPath[q - 1][1] > sharedPath[q][1]))){
                            board[sharedPath[q][1]][sharedPath[q][0]] = '┤' //'│'
                        } else if (((sharedPath[q - 1][0] < sharedPath[q][0] && sharedPath[q - 1][1] === sharedPath[q][1]) && (sharedPath[q + 1][0] === sharedPath[q][0] && sharedPath[q + 1][1] < sharedPath[q][1])) ||
                            ((sharedPath[q + 1][0] < sharedPath[q][0] && sharedPath[q + 1][1] === sharedPath[q][1]) && (sharedPath[q - 1][0] === sharedPath[q][0] && sharedPath[q - 1][1] < sharedPath[q][1]))){
                            board[sharedPath[q][1]][sharedPath[q][0]] = '┤' //'┘'
                        } else if (((sharedPath[q - 1][0] === sharedPath[q][0] && sharedPath[q - 1][1] < sharedPath[q][1]) && (sharedPath[q + 1][0] > sharedPath[q][0] && sharedPath[q + 1][1] === sharedPath[q][1])) ||
                            ((sharedPath[q + 1][0] === sharedPath[q][0] && sharedPath[q + 1][1] < sharedPath[q][1]) && (sharedPath[q - 1][0] > sharedPath[q][0] && sharedPath[q - 1][1] === sharedPath[q][1]))){
                            board[sharedPath[q][1]][sharedPath[q][0]] = '┼' //'└'
                        } else if (((sharedPath[q - 1][0] === sharedPath[q][0] && sharedPath[q - 1][1] > sharedPath[q][1]) && (sharedPath[q + 1][0] > sharedPath[q][0] && sharedPath[q + 1][1] === sharedPath[q][1])) ||
                            ((sharedPath[q + 1][0] === sharedPath[q][0] && sharedPath[q + 1][1] > sharedPath[q][1]) && (sharedPath[q - 1][0] > sharedPath[q][0] && sharedPath[q - 1][1] === sharedPath[q][1]))) {
                            board[sharedPath[q][1]][sharedPath[q][0]] = '┬' //'┌'
                        } else {
                            console.log(sharedPath[q - 1], sharedPath[q], sharedPath[q + 1])
                        }
                    }
                } else if (board[arrayPath[i][1]][arrayPath[i][0]] === "└"){
                    if (sharedPath[q + 1] === undefined){
                        console.log(1)
                    } else if (sharedPath[q - 1] === undefined){
                        console.log(2)
                    } else {
                        if (((sharedPath[q - 1][0] < sharedPath[q][0] && sharedPath[q - 1][1] === sharedPath[q][1]) && (sharedPath[q + 1][0] > sharedPath[q][0] && sharedPath[q + 1][1] === sharedPath[q][1])) ||
                            ((sharedPath[q + 1][0] < sharedPath[q][0] && sharedPath[q + 1][1] === sharedPath[q][1]) && (sharedPath[q - 1][0] > sharedPath[q][0] && sharedPath[q - 1][1] === sharedPath[q][1]))){
                            board[sharedPath[q][1]][sharedPath[q][0]] = '┴' //'─'
                        } else if (((sharedPath[q - 1][0] === sharedPath[q][0] && sharedPath[q - 1][1] < sharedPath[q][1]) && (sharedPath[q + 1][0] === sharedPath[q][0] && sharedPath[q + 1][1] > sharedPath[q][1])) ||
                            ((sharedPath[q + 1][0] === sharedPath[q][0] && sharedPath[q + 1][1] < sharedPath[q][1]) && (sharedPath[q - 1][0] === sharedPath[q][0] && sharedPath[q - 1][1] > sharedPath[q][1]))){
                            board[sharedPath[q][1]][sharedPath[q][0]] = '├' //'│'
                        } else if (((sharedPath[q - 1][0] < sharedPath[q][0] && sharedPath[q - 1][1] === sharedPath[q][1]) && (sharedPath[q + 1][0] === sharedPath[q][0] && sharedPath[q + 1][1] > sharedPath[q][1])) ||
                            ((sharedPath[q + 1][0] < sharedPath[q][0] && sharedPath[q + 1][1] === sharedPath[q][1]) && (sharedPath[q - 1][0] === sharedPath[q][0] && sharedPath[q - 1][1] > sharedPath[q][1]))){
                            board[sharedPath[q][1]][sharedPath[q][0]] = '┼' //'┐'
                        } else if (((sharedPath[q - 1][0] < sharedPath[q][0] && sharedPath[q - 1][1] === sharedPath[q][1]) && (sharedPath[q + 1][0] === sharedPath[q][0] && sharedPath[q + 1][1] < sharedPath[q][1])) ||
                            ((sharedPath[q + 1][0] < sharedPath[q][0] && sharedPath[q + 1][1] === sharedPath[q][1]) && (sharedPath[q - 1][0] === sharedPath[q][0] && sharedPath[q - 1][1] < sharedPath[q][1]))){
                            board[sharedPath[q][1]][sharedPath[q][0]] = '┴' //'┘'
                        } else if (((sharedPath[q - 1][0] === sharedPath[q][0] && sharedPath[q - 1][1] > sharedPath[q][1]) && (sharedPath[q + 1][0] > sharedPath[q][0] && sharedPath[q + 1][1] === sharedPath[q][1])) ||
                            ((sharedPath[q + 1][0] === sharedPath[q][0] && sharedPath[q + 1][1] > sharedPath[q][1]) && (sharedPath[q - 1][0] > sharedPath[q][0] && sharedPath[q - 1][1] === sharedPath[q][1]))) {
                            board[sharedPath[q][1]][sharedPath[q][0]] = '├' //'┌'
                        } else {
                            console.log(sharedPath[q - 1], sharedPath[q], sharedPath[q + 1])
                        }
                    }
                } else if (board[arrayPath[i][1]][arrayPath[i][0]] === "┌"){
                    if (sharedPath[q + 1] === undefined){
                        console.log(1)
                    } else if (sharedPath[q - 1] === undefined){
                        console.log(2)
                    } else {
                        if (((sharedPath[q - 1][0] < sharedPath[q][0] && sharedPath[q - 1][1] === sharedPath[q][1]) && (sharedPath[q + 1][0] > sharedPath[q][0] && sharedPath[q + 1][1] === sharedPath[q][1])) ||
                            ((sharedPath[q + 1][0] < sharedPath[q][0] && sharedPath[q + 1][1] === sharedPath[q][1]) && (sharedPath[q - 1][0] > sharedPath[q][0] && sharedPath[q - 1][1] === sharedPath[q][1]))){
                            board[sharedPath[q][1]][sharedPath[q][0]] = '┬' //'─'
                        } else if (((sharedPath[q - 1][0] === sharedPath[q][0] && sharedPath[q - 1][1] < sharedPath[q][1]) && (sharedPath[q + 1][0] === sharedPath[q][0] && sharedPath[q + 1][1] > sharedPath[q][1])) ||
                            ((sharedPath[q + 1][0] === sharedPath[q][0] && sharedPath[q + 1][1] < sharedPath[q][1]) && (sharedPath[q - 1][0] === sharedPath[q][0] && sharedPath[q - 1][1] > sharedPath[q][1]))){
                            board[sharedPath[q][1]][sharedPath[q][0]] = '├' //'│'
                        } else if (((sharedPath[q - 1][0] < sharedPath[q][0] && sharedPath[q - 1][1] === sharedPath[q][1]) && (sharedPath[q + 1][0] === sharedPath[q][0] && sharedPath[q + 1][1] > sharedPath[q][1])) ||
                            ((sharedPath[q + 1][0] < sharedPath[q][0] && sharedPath[q + 1][1] === sharedPath[q][1]) && (sharedPath[q - 1][0] === sharedPath[q][0] && sharedPath[q - 1][1] > sharedPath[q][1]))){
                            board[sharedPath[q][1]][sharedPath[q][0]] = '┬' //'┐'
                            } else if (((sharedPath[q - 1][0] < sharedPath[q][0] && sharedPath[q - 1][1] === sharedPath[q][1]) && (sharedPath[q + 1][0] === sharedPath[q][0] && sharedPath[q + 1][1] < sharedPath[q][1])) ||
                                ((sharedPath[q + 1][0] < sharedPath[q][0] && sharedPath[q + 1][1] === sharedPath[q][1]) && (sharedPath[q - 1][0] === sharedPath[q][0] && sharedPath[q - 1][1] < sharedPath[q][1]))){
                                board[sharedPath[q][1]][sharedPath[q][0]] = '┼' //'┘'
                        } else if (((sharedPath[q - 1][0] === sharedPath[q][0] && sharedPath[q - 1][1] < sharedPath[q][1]) && (sharedPath[q + 1][0] > sharedPath[q][0] && sharedPath[q + 1][1] === sharedPath[q][1])) ||
                            ((sharedPath[q + 1][0] === sharedPath[q][0] && sharedPath[q + 1][1] < sharedPath[q][1]) && (sharedPath[q - 1][0] > sharedPath[q][0] && sharedPath[q - 1][1] === sharedPath[q][1]))){
                            board[sharedPath[q][1]][sharedPath[q][0]] = '├' //'└'
                        } else {
                            console.log(sharedPath[q - 1], sharedPath[q], sharedPath[q + 1])
                        }
                    }
                }
                break
            }
        }
    }
    //     console.log("\n")
    //     for (let i = 0; i < board.length; i++){
    //         console.log(board[i].join(""))
    // }
}

var maxDepth = 0
function basObjToChildren(basObj, depth){
    if (depth > maxDepth){
        maxDepth = depth;
    }
    for (let i = 0; i < basObj.children.length; i++){
        basObjToChildren(basObj.children[i], depth + 1);
    }
    return maxDepth;
}

function getBoardWidth(basObj){
    basObjToChildren(basObj, 0)
    return (maxDepth) * 10 + 10
}

function CreateObjectsFromInp(inp, elements) {
    let bracketDepth = 0;
    let outOfBracket = [];
    let inOfBracket = [];
    for (let i = 0; i < inp.length; i++){
        if (inp[i] === "("){
            bracketDepth++;
            if (bracketDepth === 1){
                inOfBracket.push([]);
            }
            inOfBracket[inOfBracket.length - 1].push(inp[i]);
        } else if (inp[i] === ")"){
            bracketDepth--;
            inOfBracket[inOfBracket.length - 1].push(inp[i]);
        } else if (bracketDepth === 0){
            outOfBracket.push(inp[i]);
        } else {
            inOfBracket[inOfBracket.length - 1].push(inp[i]);
        }
    }
    inOfBracket = inOfBracket.map(function (e){
        return e.splice(1, e.length - 2).join("");
    })
    elements.type = /AND|NAND|OR|NOR|XNOR|XOR/.exec(outOfBracket.join(""))[0];
    if (IsIn(elements.type, ["AND", "NOR", "XOR", "XOR"])) { // "NAND", "OR",
        elements.type = "╢".concat(elements.type.concat("-║"))
    } else if (elements.type === "NAND"){
        elements.type = "╢".concat(elements.type.concat("║"))
    } else if (elements.type === "OR"){
        elements.type = "╢-".concat(elements.type.concat("-║"))
    }

    outOfBracket = outOfBracket.join("").replace(/AND|NAND|OR|NOR|XNOR|XOR/g, "").
    split(" ").filter(function (element){
        return (element !== "");
    })
    for (let i = 0; i < outOfBracket.length; i++){
        if (outOfBracket[i] === "NOT"){
            elements.children.push({type:"NOT", children : [{type : outOfBracket[i + 1], children : []}]})
            i++
        } else {
            elements.children.push({type : outOfBracket[i], children : []})
        }
    }
    for (let i = 0; i < inOfBracket.length; i++){
        elements.children.push(CreateObjectsFromInp(inOfBracket[i], {type : "", children : []}))
    }
    return elements;
}

var depthGroupSpace = [];
var variablesSpace = [0];
var doneVariables = [0];

function AssignYValuesBasObj(basObj){
    yValRecur(basObj, [], 0)
    depthGroupSpace = depthGroupSpace.sort(function (a, b){
        if (a < b){
            return 1
        } else {
            return -1
        }
    })[0]
    variablesSpace = variablesSpace.sort(function (a, b){
        if (a < b){
            return 1
        } else {
            return -1
        }
    })[0]
    if (variablesSpace > depthGroupSpace){
        return variablesSpace + 1
    } else {
        return depthGroupSpace + 1
    }
}

function yValRecur(basObj, depthGroupSizes, depth){
    if (basObj.type.length === 1){
        if (!IsIn(basObj.type, doneVariables)){
            doneVariables.push(basObj.type)
            variablesSpace.push(variablesSpace[variablesSpace.length - 1] + 3)
            basObj.y = variablesSpace[doneVariables.indexOf(basObj.type)]
        } else {
            basObj.y = variablesSpace[doneVariables.indexOf(basObj.type)]
        }
    } else if (basObj.type !== "NOT") {
        if (depthGroupSpace[depth] === undefined) {
            depthGroupSizes.push(0)
            depthGroupSpace.push(0)
        }
        depthGroupSizes[depth]++
        depthGroupSpace[depth] = basObj.children.length + depthGroupSpace[depth] + 3
        basObj.y = depthGroupSpace[depth]
    }

    for (let i = 0; i < basObj.children.length; i++){
        yValRecur(basObj.children[i], depthGroupSizes, depth + 1)
    }
}

var placedVariablesNames = [];
var placedVariablesY = [];

function ConvertBasicObjToLogicGate(basicObj, depth, gridWidth, childNo, gridHeight, parent){
    if (basicObj.type.length > 3 ) {
        // Logic Gate
        basicObj = new LogicGate(gridWidth - depth * 16 -1, basicObj.y, basicObj.type, basicObj.children, parent)
    } else if (basicObj.type.length === 3){
        // NOT Gate
        basicObj = new LogicGate(6, basicObj.children[0].y, basicObj.type, basicObj.children, parent)
    } else {
        // Variables
        if (placedVariablesNames.indexOf(basicObj.type) === -1) {
            placedVariablesNames.push(basicObj.type)
            placedVariablesY.push(basicObj.y)
            basicObj = new LogicGate(0, basicObj.y, basicObj.type, basicObj.children, parent)
        } else {
            basicObj = new LogicGate(0, placedVariablesY[placedVariablesNames.indexOf(basicObj.type)],
                basicObj.type, basicObj.children, parent)
        }

    }
    // console.log(basicObj)
    for (let i = 0; i < basicObj.inputs.length; i++){
        basicObj.inputs[i] = ConvertBasicObjToLogicGate(basicObj.inputs[i], depth + 1, gridWidth, i, gridHeight, basicObj)
    }
    return basicObj
}

function Start(inp) {
    /** Runner Code */
    let basObj = CreateObjectsFromInp(inp, {type : "", children : []});
    let gridHeight = AssignYValuesBasObj(basObj)
    let gridWidth = getBoardWidth(basObj)
    let LG = ConvertBasicObjToLogicGate(basObj, 0, gridWidth, 0, 15);
    let board = []
    for (let i = 0; i < gridHeight; i++) {
        board.push([])
        for (let _ = 0; _ < gridWidth; _++) {
            board[i].push(' ')
        }
    }
    LG.place(board)
    LG.draw(board)
    board[LG.outputPos.y].push("────", inp)
    let output = ""
    for (let i = 0; i < board.length; i++){
        for (let j = 0; j < board[i].length; j++){
            output += board[i][j]
        }
        output += "\n"
    }
    return output
}

console.log(Start('(A AND NOT B) OR C'))

// example inp (A AND NOT B) OR C

