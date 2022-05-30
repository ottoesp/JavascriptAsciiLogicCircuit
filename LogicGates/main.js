const {
    max,
    nth,
    fill,
    clone
} = require('lodash');
const PF = require('./PathFindingJS/src/PathFinding');

const Render = require('./render')

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

const ALPHABET = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]

const LogicGateFactory = function () {
    let maxDepth = 0;
    let maxX = 0;
    let placedVars = {};
    const abstractPositioning = [];

    const finder = new PF.AStarFinder({
        // heuristic: PF.Heuristic.manhattan
        heuristic: PF.Heuristic.manhattan,
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
            generateYValue: () => { // run seperate thing getting abstract pos so that we can do the centring in one place
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
                    if (placedVars[symbol].centred === undefined) { // BREAKPOINT
                        placedVars[symbol].centred = coordinates.y + Math.floor(((widestDepthSize - depthSize) / 2) * VERT_SPACING);
                    }
                    coordinates.y = placedVars[symbol].centred;
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

            getPathsToChildren: (PFGrid, child, i) => { 
                let childOutput = child.getOutput();
                let input = {
                    x: coordinates.x - 1,
                    y: coordinates.y + i
                }
                const grid = PFGrid(child.getSymbol(), child.getIsVariable());

                const path = finder.findPath(input.x, input.y, childOutput.x, childOutput.y, grid);
                return {
                    path: path,
                    isVariable: child.getIsVariable(),
                    symbol: child.getSymbol()
                };
            }
        };
    };
}

const GridFactory = function () {
    const PATH_CORNER_WEIGHT = 10;
    const PATH_WEIGHT = 4;
    const SHARED_PATH_WEIGHT = 1;

    return (logicTree, initialisedValue = ' ') => {
        const nOfRows = (max(logicTree.getAbstractPositioning())) * (VERT_SPACING - 1) + 1;
        const nOfColumns = logicTree.getMaxX() + GATE_WIDTH;
        const pathsToVars = {};

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

        const generatePFGrid = function (symbol, isVariable) {
            const PFGrid = new PF.Grid(grid[0].length, grid.length);
            let sharedPaths = isVariable ? pathsToVars[symbol] || [] : [];
            sharedPaths = sharedPaths.flat().map((node) => JSON.stringify(node));
            // console.log('\n\n');
            // for (let y = 0; y < grid.length; y++) {
            //     console.log(grid[y].map((cell, x) => {
            //         if (sharedPaths.includes(JSON.stringify([x, y])) && isVariable) return symbol
            //         else return cell
            //     }).join(""))
            // }

            for (let row = 0; row < grid.length; row++) {
                for (let column = 0; column < grid[0].length; column++) {
                    const tile = grid[row][column];
                    // next to a gate
                    if (["║", "-", "╢", "[", "]"].concat(ALPHABET).includes(tile)) {
                        PFGrid.setWalkableAt(column, row, false)
                    } else if (
                        ["║", "-", "╢", "[", "]"].concat(ALPHABET).includes((column > 0) ? grid[row][column - 1] : null) || ["║", "-", "╢", "[", "]"].concat(ALPHABET).includes((column < grid[0].length - 1) ? grid[row][column + 1] : null)
                    ) {
                        PFGrid.setWeightAt(column, row, 9)
                    } else if (sharedPaths.includes(JSON.stringify([row, column]))) {
                        PFGrid.setWeightAt(column, row, SHARED_PATH_WEIGHT)
                    } else if (['┘', '┐', '┌', '└', '┤', '┴', '┬', '├'].includes(tile)) {
                        PFGrid.setWeightAt(column, row, PATH_CORNER_WEIGHT)
                    } else if (['─', '│', '#'].includes(tile)) {
                        PFGrid.setWeightAt(column, row, PATH_WEIGHT)
                    } else {
                        PFGrid.setWeightAt(column, row, 2)
                    }
                }
            }
            // for (let y = 0; y < grid.length; y++) {
            //     console.log(grid[y].map((cell, x) => {
            //         return PFGrid.getWeightAt(x, y)
            //     }).join(''))
            // }
            // console.log('\n')
            // grid.forEach((row) => {
            //     console.log(row.join(''));
            // })

            return PFGrid
        }
        const addPathToSharedPath = function (path) {
            // add to pathsToVars
            if (path.isVariable) {
                if (!Object.keys(pathsToVars).includes(path.symbol)) {
                    pathsToVars[path.symbol] = []
                }
                pathsToVars[path.symbol].push(path.path)
            }
        }

        const _drawPaths = function (logicGate) {
            logicGate.children.forEach((child) => {
                if (!child.getIsVariable()) {
                    _drawPaths(child);
                }
            });
            logicGate.children.forEach((child, i) => {
                const path = logicGate.getPathsToChildren(generatePFGrid, child, i);
                Render.render(
                    path.path,
                    grid,
                    (path.isVariable ? pathsToVars[path.symbol] || [] : [])
                    .flat()
                    .map((node) => JSON.stringify(node))
                )
                addPathToSharedPath(path)
            })
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
let LogicGate;

// LogicGate = LogicGateFactory();
// getLogicDiagram('((A AND A) AND (A AND A)) AND A', 5); // check how this is handling inputs : A AND A AND A AND A AND A
LogicGate = LogicGateFactory();
getLogicDiagram('(A AND B AND NOT B) OR C AND B XNOR D', 5);
// LogicGate = LogicGateFactory();
// getLogicDiagram('A AND B AND NOT B', 5);