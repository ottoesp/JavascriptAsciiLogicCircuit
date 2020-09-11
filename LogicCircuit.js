const cloneDeep = require('lodash/clonedeep');

function IsIn(value, array){
    for (let ArrayVal = 0; ArrayVal < array.length; ArrayVal++){
        if (array[ArrayVal] === value){
            return true
        }
    }
    return false
}

var placedNotVars = []

function LogicGate(x, y, type, inputs){
    this.x = x;
    this.y = y;
    this.type = type;
    this.typeList = []
    this.height = inputs.length
    this.outputPos = {x:x + type.length, y:y}
    if (type !== "NOT" && (/^[A-Z]+$/.test(type))){
        this.height ++
    }
    this.inputs = inputs

    this.inputsPos = []
    for (let i = 0; i < this.inputs.length + 1; i ++){
        this.inputsPos.push({x:x - 1, y:y + i})
    }
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

    this.place = function (board){
        /** Places the logic gate and it's children on the board and draws lines to them */
        for (let i = 0; i < this.type.length; i++){
            this.typeList.push(this.type[i])
        }for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.type.length; j++){
                board[y + i].splice(x+j, 1, this.typeList[j]);
            }
        }if (this.inputs.length > 0){
            for (let j = 0; j < this.inputs.length; j++){
                this.inputs[j].place(board)
            }
        }
        for (let i = 0; i < this.inputs.length; i++){
            if (this.type === "NOT"){
                if (!IsIn(this.inputs[i].type, placedNotVars)) {
                    DrawLinePath(board, this.inputsPos[i].x, this.inputsPos[i].y,
                        this.inputs[i].outputPos.x, this.inputs[i].outputPos.y)
                    placedNotVars.push(this.inputs[i].type)
                }
            } else {
                DrawLinePath(board, this.inputsPos[i].x, this.inputsPos[i].y,
                    this.inputs[i].outputPos.x, this.inputs[i].outputPos.y)
            }

        }
    }
}

function ConvertBoardToGrid(board){
    let b = cloneDeep(board)
    for (let y = 0; y < b.length; y++){
        for (let x = 0; x < b[y].length; x++){
            if (b[y][x] === " "){
                b[y][x] = 0;
            }else if(IsIn(b[y][x], ['┘', '┐', '┌', '└' , '┤', '┴', '┬', '├', '─', '│'])){
                b[y][x] = 1;
            }else if(IsIn(b[y][x], ["║", "-"]) || /^[A-Z]+$/.test(b[y][x])) {
                b[y][x] = 2;
            } if(x === 1){
                b[y][x] = 5;
            }
        }
    }
    // for (let i = 0; i < b.length; i++){
    //     console.log(b[i].join(""))
    // }
    return b
}

function DrawLinePath(board, startX, startY, endX, endY){
    /** Converts board to a grid and returns a path between two points*/
    let b = ConvertBoardToGrid(board)
    var easystarjs = require('easystarjs');
    var easystar = new easystarjs.js();
    let grid_ = b
    easystar.setGrid(
        grid_
    );
    // easystar.enableDiagonals()
    easystar.disableCornerCutting()
    easystar.enableSync()
    easystar.setAcceptableTiles([0, 1, 5])
    easystar.setTileCost(1, 10);
    easystar.setTileCost(0, 0);
    easystar.setTileCost(5, 1000);

    easystar.setDirectionalCondition(endX, endY, ["RIGHT"])
    easystar.setDirectionalCondition(startX, startY, ["LEFT"])

    var p = "";
    easystar.findPath(startX, startY, endX, endY, function( path ) {
        if (path === null) {
            console.log("no path found")
        } else {
            p = path;
        }
    })
    easystar.setIterationsPerCalculation(1000);
    easystar.calculate();
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
            if (p[i - 1].x === p[i].x && p[i - 1].y === p[i].x-1){
                board[p[i].y][p[i].x] = '┘'
            } else if (p[i - 1].x === p[i].x && p[i - 1].y === p[i].x+1){
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
        }}
}

var maxDepth = 0
function basObjToChildren(basObj, depth){
    if (depth > maxDepth){
        maxDepth = depth
    }
    for (let i = 0; i < basObj.children.length; i++){
        basObjToChildren(basObj.children[i], depth++)
    }
    return maxDepth
}

function getBoardWidth(basObj){
    basObjToChildren(basObj, 0)
    return (maxDepth) * 14 + 5
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
        elements.type = "║".concat(elements.type.concat("-║"))
    } else if (elements.type === "NAND"){
        elements.type = "║".concat(elements.type.concat("║"))
    } else if (elements.type === "OR"){
        elements.type = "║-".concat(elements.type.concat("-║"))
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
    return Math.round(depthGroupSpace.sort()[depthGroupSpace.length-1] * 1.5)
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
        depthGroupSpace[depth] = basObj.children.length + depthGroupSpace[depth] + 2
        basObj.y = depthGroupSpace[depth]
    }

    for (let i = 0; i < basObj.children.length; i++){
        yValRecur(basObj.children[i], depthGroupSizes, depth + 1)
        // console.log(depthGroupSpace, depth)

        // console.log(basObj.children[i].y)
    }
}

var placedVariablesNames = [];
var placedVariablesY = [];

function ConvertBasicObjToLogicGate(basicObj, depth, gridWidth, childNo, gridHeight){
    if (basicObj.type.length > 3 ) {
        // Logic Gate
        basicObj = new LogicGate(gridWidth - depth * 16 -1, basicObj.y, basicObj.type, basicObj.children)
    } else if (basicObj.type.length === 3){
        // NOT Gate
        basicObj = new LogicGate(6, basicObj.children[0].y, basicObj.type, basicObj.children)
    } else {
        // Variables
        if (placedVariablesNames.indexOf(basicObj.type) === -1) {
            placedVariablesNames.push(basicObj.type)
            placedVariablesY.push(basicObj.y)
            basicObj = new LogicGate(0, basicObj.y, basicObj.type, basicObj.children)
        } else {
            basicObj = new LogicGate(0, placedVariablesY[placedVariablesNames.indexOf(basicObj.type)], basicObj.type, basicObj.children)
        }

    }
    // console.log(basicObj)
    for (let i = 0; i < basicObj.inputs.length; i++){
        basicObj.inputs[i] = ConvertBasicObjToLogicGate(basicObj.inputs[i], depth + 1, gridWidth, i, gridHeight)
    }
    return basicObj
}

function Start(inp) {
    /** Call start with an expression like "(A AND (A OR NOT B)) OR (B AND (A OR NOT B))"
     * to return a ascii logic circuit
     * */
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

    let output = ""
    for (let i = 0; i < board.length; i++){
        for (let j = 0; j < board[i].length; j++){
            output += board[i][j]
        }
        output += "\n"
    }
    return output
}



