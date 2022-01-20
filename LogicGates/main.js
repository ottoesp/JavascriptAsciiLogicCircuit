const {
    max,
    nth,
    fill
} = require("lodash");

var HORZ_SPACING;
var VERT_SPACING;
const GATE_WIDTH = 6;
const GATE_HEIGHT = 2;
const GATES = ["OR", "NOR", "XOR", "XNOR", "AND", "NAND", "NOT"]
const GATE_STRING_CHARACTERS = {
    left: "[",
    right: "]",
    filler: "-"
}

const LogicGateFactory = function () {
    let maxDepth = 0;
    let maxX = 0;
    let placedVars = {};
    const abstractPositioning = [];
    return (_depth) => {
        const depth = _depth;
        if (_depth > maxDepth) {
            maxDepth = depth;
        }
        let symbol = undefined;
        let isVariable = undefined;
        return {
            getSymbol: () => {
                return symbol
            },
            setSymbol: (str) => {
                symbol = str;
                isVariable = !GATES.includes(symbol);
            },

            getPlaceableSymbol: () => {
                if (isVariable) {
                    return {
                        sym: symbol,
                        height: 1,
                        width: 1,
                    }
                } else if (symbol === "NOT") {
                    return {
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
                    return {
                        sym: `${left}${middle}${right}`,
                        height: GATE_HEIGHT,
                        width: GATE_WIDTH,
                    }
                }
            },

            children: [],

            coordinates: {
                x: undefined,
                y: undefined
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
                    return x
                }
                // is otherwise a variable
                return 0
            },
            generateYValue: () => {
                if (isVariable) {
                    if (Object.keys(placedVars).includes(symbol)) {
                        return placedVars[symbol].y
                    }
                    let y = VERT_SPACING * (abstractPositioning[maxDepth] || 0);
                    placedVars[symbol] = {
                        y: y
                    };
                    abstractPositioning[maxDepth] = (abstractPositioning[maxDepth] || 0) + 1;
                    return y
                } else {
                    let y = VERT_SPACING * (abstractPositioning[depth] || 0);
                    abstractPositioning[depth] = (abstractPositioning[depth] || 0) + 1;
                    return y
                }
            },
            getYCentreFactor: () => {
                const widestDepthSize = max(abstractPositioning);
                const depthSize = abstractPositioning[depth];
                if (isVariable) {
                    // console.log(symbol, placedVars[symbol]);
                    if (placedVars[symbol].centred) {
                        return placedVars[symbol].centred;
                    } else {
                        placedVars[symbol].centred = Math.floor(((widestDepthSize - depthSize) / 2) * VERT_SPACING);
                    }
                }
                return Math.floor(((widestDepthSize - depthSize) / 2) * VERT_SPACING);
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
        };
    };
}
const LogicGate = LogicGateFactory();

const GridFactory = function () {
    return (logicTree, initialisedValue = " ") => {
        const nOfRows = (max(logicTree.getAbstractPositioning()) + 1) * VERT_SPACING;
        const nOfColumns = logicTree.getMaxX() + GATE_WIDTH;
        let grid = [...Array(nOfRows)].map(() => Array(nOfColumns).fill(initialisedValue));

        const _placeSymbols = (lt) => {
            const {
                sym,
                height,
                width
            } = lt.getPlaceableSymbol();
            const {
                x,
                y
            } = lt.coordinates;
            if (grid[y][x] === initialisedValue) {
                for (let i = 0; i < height; i++) {
                    grid[y + i].splice(x, width, ...sym.split(""));
                }
            }
            lt.children.forEach((child) => {
                _placeSymbols(child);
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
                    console.log(row.join(""));
                })
            }
        }
    }
}
const Grid = GridFactory();

const splitElements = function (str) {
    let bracketDepth = 0;
    let output = [""]
    for (let i = 0; i < str.length; i++) {
        const character = str[i];
        if (bracketDepth === 0 && character === " ") {
            output.push("");
        };
        if (character === "(") {
            bracketDepth++
        } else if (character === ")") {
            bracketDepth--
        };

        if (bracketDepth > 0 || character !== " ") {
            output[output.length - 1] += character
        };
    };
    if (bracketDepth > 0) {
        throw "ERROR: UNENCLOSED BRACKETS"
    };
    // strip surrounding brackets
    output.forEach((element, i) => {
        if (element[0] === "(") {
            output[i] = element.slice(1, element.length - 1)
        };
    });
    return output;
}

const stringToLogicGate = function (input, depth = 0) {
    let splitInput = splitElements(input);

    const ORDER_OF_OPERATIONS = [
        ["OR", "NOR", "XOR", "XNOR"],
        ["AND", "NAND"],
        ["NOT"]
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
                        stringToLogicGate(splitInput.slice(0, i).join(" "), depth + 1)
                    )
                }
                if (i < splitInput.length - 1) {
                    output.children.push(
                        stringToLogicGate(splitInput.slice(i + 1, splitInput.length).join(" "), depth + 1)
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
    logicGate.coordinates.x = logicGate.generateXValue()
    logicGate.coordinates.y = logicGate.generateYValue();
    logicGate.children.forEach(child => {
        assignCoordinates(child);
    });
}
const centreYValues = function (logicGate) {
    const factor = logicGate.getYCentreFactor();
    logicGate.coordinates.y += factor;
    logicGate.children.forEach(child => {
        centreYValues(child);
    });
}
const getLogicDiagram = function (input, spacing) {
    HORZ_SPACING = spacing;
    VERT_SPACING = 3;
    let logicTree = interperetInput(input);
    assignCoordinates(logicTree);
    centreYValues(logicTree);
    const grid = Grid(logicTree);
    grid.placeSymbols();
    grid.debugPrintGrid();
}
getLogicDiagram("(A AND B AND NOT B) OR C AND B XNOR D", 2);