const {
    log
} = require('console');
const {
    cp
} = require('fs');
const {
    max,
    nth,
    fill,
    clone
} = require('lodash');
const PF = require('./PathFindingJS/src/PathFinding');


var HORZ_SPACING;
var VERT_SPACING;
const GATE_WIDTH = 6;
const GATE_HEIGHT = 2;
const GATES = ['OR', 'NOR', 'XOR', 'XNOR', 'AND', 'NAND', 'NOT']
const GATE_STRING_CHARACTERS = {
    left: '[',
    right: ']',
    filler: '-'
}

const LogicGateFactory = function () {
    let maxDepth = 0;
    let maxX = 0;
    let placedVars = {};
    const abstractPositioning = [];

    const finder = new PF.AStarFinder({
        heuristic: PF.Heuristic.manhattan
    })

    return (_depth) => {
        const depth = _depth;
        if (_depth > maxDepth) {
            maxDepth = depth;
        }
        let symbol = undefined;
        let _placeableSymbol = undefined;

        let isVariable = false;
        let coordinates = {
            x: undefined,
            y: undefined
        };

        let children = [];

        input = undefined



        return {
            getSymbol: () => {
                return symbol
            },
            setSymbol: (str) => {
                symbol = str;
                isVariable = !GATES.includes(symbol);
            },

            placeableSymbol: () => {
                return _placeableSymbol;
            },

            generatePlaceableSymbol: () => {
                if (isVariable) {
                    _placeableSymbol = {
                        sym: symbol,
                        height: 1,
                        width: 1,
                    }
                } else if (symbol === 'NOT') {
                    _placeableSymbol = {
                        sym: symbol,
                        height: 1,
                        width: 3,
                    }
                } else {
                    const {
                        left,
                        right,
                        filler
                    } = GATE_STRING_CHARACTERS;
                    let middle = symbol;
                    while (middle.length < GATE_WIDTH - 2) {
                        middle += filler;
                    };
                    _placeableSymbol = {
                        sym: `${left}${middle}${right}`,
                        height: GATE_HEIGHT,
                        width: GATE_WIDTH,
                    }
                }

                children.forEach(child => {
                    child.generatePlaceableSymbol()
                });
            },


            children: children,

            coordinates: () => {
                return coordinates
            },

            generateXValue: () => {
                if (!isVariable) {
                    const inverseDepth = maxDepth - depth;
                    const x = (
                        inverseDepth * HORZ_SPACING +
                        (inverseDepth - 1) * GATE_WIDTH + 1
                    );
                    if (x > maxX) {
                        maxX = x;
                    }
                    coordinates.x = x
                    return
                }
                // is otherwise a variable
                coordinates.x = 0;
            },
            generateYValue: () => {
                if (isVariable) {
                    if (Object.keys(placedVars).includes(symbol)) {
                        coordinates.y = placedVars[symbol].y
                        return
                    }
                    let y = VERT_SPACING * (abstractPositioning[maxDepth] || 0);
                    placedVars[symbol] = {
                        y: y
                    };
                    abstractPositioning[maxDepth] = (abstractPositioning[maxDepth] || 0) + 1;
                    coordinates.y = y
                } else {
                    let y = VERT_SPACING * (abstractPositioning[depth] || 0);
                    abstractPositioning[depth] = (abstractPositioning[depth] || 0) + 1;
                    coordinates.y = y
                }
            },
            centreYFactor: () => {
                const widestDepthSize = max(abstractPositioning);
                const depthSize = abstractPositioning[depth];
                if (isVariable) {
                    if (placedVars[symbol].centred !== undefined) {
                        coordinates.y = placedVars[symbol].centred;
                    } else {
                        placedVars[symbol].centred = Math.floor(((widestDepthSize - depthSize) / 2) * VERT_SPACING);
                    }
                    return
                }
                // console.log(`symbol: ${symbol}, ${coordinates.y}, ${Math.floor(((widestDepthSize - depthSize) / 2) * VERT_SPACING)}`)
                coordinates.y += Math.floor(((widestDepthSize - depthSize) / 2) * VERT_SPACING);
            },

            getAbstractPositioning: () => {
                return abstractPositioning;
            },

            getMaxDepth: () => {
                return maxDepth
            },

            getMaxX: () => {
                return maxX
            },

            resetClassVariables: () => {
                maxDepth = 0;
                maxX = 0;
                placedVars = {};
                abstractPositioning = [];
            },

            getOutput: () => {
                return output = {
                    x: coordinates.x + _placeableSymbol.width,
                    y: coordinates.y
                }
            },

            getIsVariable: () => {
                return isVariable;
            },
            
            getPathsToChildren: (PFGrid) => {
                let paths = [];
                for (let i = 0; i < children.length; i++) {
                    let g = PFGrid.clone(); // bug in library where grids are altered after use.
                    const child = children[i];
                    let childOutput = child.getOutput();
                    let input = {
                        x: coordinates.x - 1,
                        y: coordinates.y + i
                    }
                    let _path = finder.findPath(input.x, input.y, childOutput.x, childOutput.y, g);
                    paths.push({path : _path, isVariable : child.getIsVariable(), symbol : child.getSymbol()});
                }
                return paths;
            }
        };
    };
}
const LogicGate = LogicGateFactory();

const GridFactory = function () {
    const PATH_CORNER_WEIGHT = 5;
    const PATH_WEIGHT = 3;
    const SHARED_PATH_WEIGHT = 0;

    return (logicTree, initialisedValue = ' ') => {
        const nOfRows = (max(logicTree.getAbstractPositioning()) + 1) * VERT_SPACING;
        const nOfColumns = logicTree.getMaxX() + GATE_WIDTH;
        let pathsToVars = {};

        let grid = [...Array(nOfRows)].map(() => Array(nOfColumns).fill(initialisedValue));

        const _placeSymbols = (lt) => {
            const {
                sym,
                height,
                width
            } = lt.placeableSymbol();
            const {
                x,
                y
            } = lt.coordinates();
            if (grid[y][x] === initialisedValue) {
                for (let i = 0; i < height; i++) {
                    grid[y + i].splice(x, width, ...sym.split(''));
                }
            }
            lt.children.forEach((child) => {
                _placeSymbols(child);
            })
        }

        const generatePFGrid = function () {
            let PFGrid = new PF.Grid(grid[0].length, grid.length);
            for (let row = 0; row < grid.length; row++) {
                for (let column = 0; column < grid.length; column++) {
                    if ([' '].includes(grid[row][column])) {
                        PFGrid.setWeightAt(column, row, 1)
                    } else if (['─', '│', '#'].includes(grid[row][column])) {
                        PFGrid.setWeightAt(column, row, PATH_WEIGHT)
                    } else if (['┘', '┐', '┌', '└', '┤', '┴', '┬', '├'].includes(grid[row][column])) {
                        PFGrid.setWeightAt(column, row, PATH_CORNER_WEIGHT)
                    } else if (["║", "-", "╢"].includes(grid[row][column])) {
                        PFGrid.setWalkableAt(column, row, false)
                    } else if (/^[A-Z]+$/.test(grid[row][column])) {
                        PFGrid.setWalkableAt(column, row, false)
                    }
                }
            }
            return PFGrid
        }

        const findPath = function (logicGate) {
            let paths = logicGate.getPathsToChildren(generatePFGrid())

            let p = [];
            paths.forEach(path => { // add to pathsToVars
                if (path.isVariable) {
                    if (!Object.keys(pathsToVars).includes(path.symbol)) {
                        pathsToVars[path.symbol] = []
                    }
                    pathsToVars[path.symbol].push(path.path)
                }
                p.push(path.path);
            });
            
            return p;
        }

        const renderPath = function (path) {
            directionalPath = [{step : {x : path[0][0], y : path[0][1]}, direction : 'left'}];

            for (let i = 1; i < path.length - 1; i++) {
                let step = {x : path[i][0], y : path[i][1]}
                let nextStep = {x : path[i + 1][0], y : path[i + 1][1]}

                if (step)
                if (step.x < nextStep.x) {
                    dir = 'right'
                } else if (step.x > nextStep.x) {
                    dir = 'left'
                } else if (step.y < nextStep.y) {
                    dir = 'down'
                } else if (step.y > nextStep.y) {
                    dir = 'up'
                }

                directionalPath.push({
                    step : step, direction : dir
                })
            }
            directionalPath.push({
                step : {x : path[path.length - 1][0], y : path[path.length - 1][1]}, direction : 'left'
            })
            for (let i = 1; i < path.length; i++) {
                let dirs = directionalPath[i - 1].direction + directionalPath[i].direction
                console.log(dirs)
                if (dirs === 'rightright' || dirs ===  'leftleft') {
                    grid[path[i][1]][path[i][0]] = '─'
                } else if (dirs === 'rightup' || dirs === 'downleft') {
                    grid[path[i][1]][path[i][0]] = '┘'
                }
                else if (dirs === 'rightdown' || dirs === 'upleft') {
                    grid[path[i][1]][path[i][0]] = '┐'
                }
                else if (dirs === 'upright' || dirs === 'leftdown') {
                    grid[path[i][1]][path[i][0]] = '┌'
                }
                else if (dirs === 'downright' || dirs === 'leftup') {
                    grid[path[i][1]][path[i][0]] = '└'
                }
                else if (dirs === 'upup' || dirs === 'downdown') {
                    grid[path[i][1]][path[i][0]] = '│'
                }
                // ┘
                // ┐
                // ┌
                // └
                // │
                // ─
            }
        }

        const _drawPaths = function (logicGate) {
            // logicGate.children.forEach((child) => {
            //     _drawPaths(child)
            // });

            logicGate.children.forEach((child) => {
                _drawPaths(child)
            })
            let paths = findPath(logicGate);
            paths.forEach(path => {
                renderPath(path)
            });
            
        }

        return {
            placeSymbols: () => {
                return _placeSymbols(logicTree)
            },
            getGrid: () => {
                return grid
            },
            debugPrintGrid: () => {
                grid.forEach((row) => {
                    console.log(row.join(''));
                })
            },
            drawPaths: () => {
                _drawPaths(logicTree)
            }
        }
    }
}
const Grid = GridFactory();

const splitElements = function (str) {
    let bracketDepth = 0;
    let output = ['']
    for (let i = 0; i < str.length; i++) {
        const character = str[i];
        if (bracketDepth === 0 && character === ' ') {
            output.push('');
        };
        if (character === '(') {
            bracketDepth++
        } else if (character === ')') {
            bracketDepth--
        };

        if (bracketDepth > 0 || character !== ' ') {
            output[output.length - 1] += character
        };
    };
    if (bracketDepth > 0) {
        throw 'ERROR: UNENCLOSED BRACKETS'
    };
    // strip surrounding brackets
    output.forEach((element, i) => {
        if (element[0] === '(') {
            output[i] = element.slice(1, element.length - 1)
        };
    });
    return output;
}

const stringToLogicGate = function (input, depth = 0) {
    let splitInput = splitElements(input);

    const ORDER_OF_OPERATIONS = [
        ['OR', 'NOR', 'XOR', 'XNOR'],
        ['AND', 'NAND'],
        ['NOT']
    ];
    // loop through each group of operations and test against each element from right to left
    let output = LogicGate(depth);
    if (splitInput.length === 1) {
        output.setSymbol(splitInput[0]);
        return output
    }
    for (let j = 0; j < ORDER_OF_OPERATIONS.length; j++) {
        const operationArray = ORDER_OF_OPERATIONS[j];
        for (let i = splitInput.length - 1; i >= 0; i--) {
            const element = splitInput[i];
            if (operationArray.includes(element)) {
                output.setSymbol(element);
                if (i > 0) {
                    output.children.push(
                        stringToLogicGate(splitInput.slice(0, i).join(' '), depth + 1)
                    )
                }
                if (i < splitInput.length - 1) {
                    output.children.push(
                        stringToLogicGate(splitInput.slice(i + 1, splitInput.length).join(' '), depth + 1)
                    )
                }
                return output
            }
        }
    }
}
const interperetInput = function (input) {
    // remove any excess whitespece
    input = input.replace(/\s{2,}/g, ' ').trim().toUpperCase();
    return stringToLogicGate(input);
}
const assignCoordinates = function (logicGate) {
    logicGate.generateXValue()
    logicGate.generateYValue();
    logicGate.children.forEach(child => {
        assignCoordinates(child);
    });
}
const centreYValues = function (logicGate) {
    logicGate.centreYFactor();
    logicGate.children.forEach(child => {
        centreYValues(child);
    });
}

const getLogicDiagram = function (input, spacing) {
    HORZ_SPACING = spacing;
    VERT_SPACING = 4;

    let logicTree = interperetInput(input);
    assignCoordinates(logicTree);
    logicTree.generatePlaceableSymbol();
    centreYValues(logicTree);

    const grid = Grid(logicTree);
    grid.placeSymbols(logicTree);
    grid.drawPaths();
    grid.debugPrintGrid();
}
getLogicDiagram('(A AND B AND NOT B) OR C AND B XNOR D', 5);