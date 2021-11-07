const cloneDeep = require('lodash.clonedeep');
const PF = require('pathfinding');
const render = require("./rendering/render")
const comp = require("./inputComprehension")
const isIn = require("./isIn")

var placedNotVars = []
var placedPaths = []

function LogicGate(x, y, type, inputs, _parent) {
  this.x = x;
  this.y = y;
  this.type = type;
  this.parent = _parent;
  this.typeList = [];
  this.height = inputs.length;
  this.outputPos = { x: x + 1, y: y };
  if (type !== "NOT" && (/^[A-Z]+$/.test(type))) {
    this.height++
  }
  this.inputs = inputs

  this.inputsPos = []
  for (let i = 0; i < this.inputs.length; i++) {
    this.inputsPos.push({ x: x - this.type.length, y: y + i })
  }
  for (let i = 0; i < this.inputs.length; i++) {
    if (this.inputs[i].type === "NOT") {
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
        // console.log(board)
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
        if (!isIn.isIn(this.inputs[i].type, placedNotVars)) {
          let o = findPath(board, this.inputsPos[i].x, this.inputsPos[i].y,
            this.inputs[i].outputPos.x, this.inputs[i].outputPos.y, this)
          this.p = o[0]
          placedNotVars.push(this.inputs[i].type)
          render.drawPath(this.p, board, o[1])
        }
        // console.log("LLL", this.p)
        // placedPaths.push(this.p)
        // console.log(placedPaths.length)
        if (this.p !== undefined) {
          placedPaths.push(this.p)
        }
      } else {
        let o = findPath(board, this.inputsPos[i].x, this.inputsPos[i].y,
          this.inputs[i].outputPos.x, this.inputs[i].outputPos.y, this)
        this.p = o[0]
        render.drawPath(this.p, board, o[1])
        placedPaths.push(this.p)
        // console.log(placedPaths.length)


      }
    }
    if (this.inputs.length > 0) {
      for (let j = 0; j < this.inputs.length; j++) {
        this.inputs[j].draw(board)
      }
    }
  }

}

function convertBoardToGrid(board, sharedPath) {
  let b = cloneDeep(board)
  for (let y = 0; y < b.length; y++) {
    for (let x = 0; x < b[y].length; x++) {
      if (b[y][x] === " ") {
        b[y][x] = 0;
      } else if (isIn.isIn(b[y][x], ['─', '│'])) {
        b[y][x] = 1;
      } else if (isIn.isIn(b[y][x], ['┘', '┐', '┌', '└', '┤', '┴', '┬', '├'])) {
        b[y][x] = 4;
      }
      if (isIn.isIn(b[y][x], ["║", "-", "╢"]) || /^[A-Z]+$/.test(b[y][x])) {
        b[y][x] = 2;
      } else if (b[y][x + 1] && (isIn.isIn(b[y][x + 1], ["╢"])) || /^[A-Z]+$/.test(b[y][x + 1])) {
        b[y][x] = 5;
      } else if (board[y][x - 1] && (isIn.isIn(board[y][x - 1], ["║", "-", "╢"]) && board[y - 1][x - 1] === " ") || /^[A-Z]+$/.test(board[y][x - 1])) {
        b[y][x] = 5;
      } else {
        for (let i = 0; i < sharedPath.length; i++) {
          if (x === sharedPath[i][0] && y === sharedPath[i][1]) {
            b[y][x] = 3;
          }
        }
      }
    }
  }
  // output = ""
  // for (let i = 0; i < b.length; i++) {
  //   for (let j = 0; j < b[i].length; j++) {
  //     if (b[i][j] === " ") {
  //       output += "'\n'"
  //     } else {
  //       output += b[i][j]
  //     }
  //   }
  // }
  // console.log(output)
  return b
}


function findPath(board, startX, startY, endX, endY) {
  /** Converts board to a grid and returns a path between two points*/
  // Grouping paths from same parents
  let sharedPath = [];
  for (let i = 0; i < placedPaths.length - 1; i++) {
    // if (placedPaths[i] === undefined) {
    //   console.log(i, placedPaths.length, placedPaths)
    // }
    if (placedPaths[i][placedPaths[i].length - 1].x === endX && placedPaths[i][placedPaths[i].length - 1].y === endY) {
      for (let j = 0; j < placedPaths[i].length; j++) {
        sharedPath.push([placedPaths[i][j].x, placedPaths[i][j].y])
      }
    }
  }
  let b = convertBoardToGrid(board, sharedPath)
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
    { heuristic: PF.Heuristic.manhattan } // Want to change to custom heuristic which favours less corners
  )
  let path = finder.findPath(startX, startY, endX, endY, grid);
  let p = []
  for (let i = 0; i < path.length; i++) {
    p.push({ x: path[i][0], y: path[i][1] })
  }
  return [p, sharedPath];
}


var maxDepth = 0
function basObjToChildren(basObj, depth) {
  if (depth > maxDepth) {
    maxDepth = depth;
  }
  for (let i = 0; i < basObj.children.length; i++) {
    basObjToChildren(basObj.children[i], depth + 1);
  }
  return maxDepth;
}

function getBoardWidth(basObj, elementSpacing) {
  basObjToChildren(basObj, 0)
  return (maxDepth - 1) * elementSpacing + 1
}

var depthGroupSpace = [];

var depthGroupSpaceFirst = 0
var variablesSpace = [0];
var variablesSpaceFirst = 0
var doneVariables = [0];


function assignYValuesBasObj(basObj) {
  yValRecur(basObj, [], 0)
  depthGroupSpaceFirst = depthGroupSpace.sort(function (a, b) {
    if (a < b) {
      return 1
    } else {
      return -1
    }
  })[0]
  variablesSpaceFirst = variablesSpace.sort(function (a, b) {
    if (a < b) {
      return 1
    } else {
      return -1
    }
  })[0]
  if (variablesSpaceFirst > depthGroupSpaceFirst) {
    return variablesSpaceFirst + 1
  } else {
    return depthGroupSpaceFirst + 1
  }
}

function yValRecur(basObj, depthGroupSizes, depth) {
  if (basObj.type.length === 1) {
    if (!isIn.isIn(basObj.type, doneVariables)) {
      doneVariables.push(basObj.type)
      variablesSpace.push(variablesSpace[variablesSpace.length - 1] + 3)
      basObj.y = variablesSpace[doneVariables.indexOf(basObj.type)]
    } else {
      basObj.y = variablesSpace[doneVariables.indexOf(basObj.type)]
    }
  } else if (basObj.type !== "NOT") {
    if (depthGroupSpace[depth] === undefined) {
      depthGroupSizes.push(0)
      // console.log("howdy", typeof depthGroupSpace)
      depthGroupSpace.push(0)
    }
    depthGroupSizes[depth]++
    depthGroupSpace[depth] = basObj.children.length + depthGroupSpace[depth] + 3
    basObj.y = depthGroupSpace[depth]
  }

  for (let i = 0; i < basObj.children.length; i++) {
    yValRecur(basObj.children[i], depthGroupSizes, depth + 1)
  }
}

var placedVariablesNames = [];
var placedVariablesY = [];

// CHANGE BASIC OBJ TO SOMETHING ABOUT JSON
function convertBasicObjToLogicGate(basicObj, depth, gridWidth, childNo, gridHeight, elementSpacing, parent) {
  if (basicObj.type.length > 3) {
    // Logic Gate
    basicObj = new LogicGate(gridWidth - (depth) * elementSpacing, basicObj.y, basicObj.type, basicObj.children, parent)
  } else if (basicObj.type.length === 3) {
    // NOT Gate
    basicObj = new LogicGate(5, basicObj.children[0].y, basicObj.type, basicObj.children, parent)
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
  for (let i = 0; i < basicObj.inputs.length; i++) {
    basicObj.inputs[i] = convertBasicObjToLogicGate(basicObj.inputs[i], depth + 1, gridWidth, i, gridHeight, elementSpacing, basicObj)
  }
  return basicObj
}

function boardToString(board, LG, inp) {
  board[LG.outputPos.y].push("────", inp)
  let output = ""
  for (let i = 0; i < board.length; i++) {
    blankLineTest = new Set(board[i]) // Only unique values
    if (blankLineTest.size > 1) {     // Will only not be greater that 1 if there are only spaces
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === " ") {
          output += "&nbsp"
        } else {
          output += board[i][j]
        }
      }
      output += "\n"
    }
  }
  return output
}

function resetGlobals() { // Put into object at start of page with reset as method
  placedPaths.splice(0)

  depthGroupSpaceFirst = 0
  depthGroupSpace.splice(0)

  variablesSpace.splice(1)
  variablesSpace[0] = 0
  variablesSpaceFirst = 0
  
  doneVariables.splice(1)
  doneVariables[0] = 0

  maxDepth = 0

  placedVariablesNames.splice(0)
  placedVariablesY.splice(0)
  placedNotVars.splice(0)
}

exports.start = function (inp, elementSpacing) {
  /** Runner Code */
  resetGlobals()
  if (typeof inp !== "string") {
    throw "STATEMENT MUST BE STRING"
  }
  // if (typeof widthVar !== "number" || widthVar % 1 !== 0) {
  //     throw "WIDTHVAR MUST BE POSITIVE INTEGER"
  // }
  if (typeof elementSpacing !== "number" || elementSpacing % 1 !== 0) {
    throw "SPACING MUST BE POSITIVE INTEGER"
  }
  let basObj = comp.createObjectsFromInp(inp, { type: "", children: [] });
  let gridHeight = assignYValuesBasObj(basObj) + 1
  let gridWidth = getBoardWidth(basObj, elementSpacing)
  let LG = convertBasicObjToLogicGate(basObj, 0, gridWidth, 0, 15, elementSpacing);
  let board = []
  for (let i = 0; i < gridHeight; i++) {
    board.push([])
    for (let _ = 0; _ < gridWidth; _++) {
      board[i].push(' ')
    }
  }
  LG.place(board)
  LG.draw(board)
  return boardToString(board, LG, inp)
}
