const PF = require('./PathFindingJS/src/PathFinding');

const GATE_WIDTH = 6;
const GATE_HEIGHT = 2;
const GATES = ['OR', 'NOR', 'XOR', 'XNOR', 'AND', 'NAND', 'NOT']
const GATE_CHARACTERS = {
    left: '[',
    right: ']',
    filler: '-'
}
HORZ_SPACING = 5;
VERT_SPACING = 3;

exports.LogicGateFactory = function () {
    let maxDepth = 0;
    let maxX = 0;
    let variableYVals = {};

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
                    } = GATE_CHARACTERS;
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

            assignXValue: () => {
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
            assignYValue: (widthAtEachDepth, spaceAtEachDepth) => {
                const calculateY = function (d) {
                    const h = (maxDepth - 1) * (VERT_SPACING + 2) + 2;
                    const r = (widthAtEachDepth[d] - 1) * (VERT_SPACING + 2) + 2;
                    const offset = Math.floor((h - r)/2);
                    const s = spaceAtEachDepth[d] - 1
                    const y = offset + s * (VERT_SPACING + 2);
                    return y;
                }
                if (isVariable) {
                    if (variableYVals[symbol] === undefined) {
                        variableYVals[symbol] = calculateY(0); //BREAKPOINT 
                        spaceAtEachDepth[0]--;
                    }
                    coordinates.y = variableYVals[symbol];
                } else {
                    coordinates.y = calculateY(maxDepth - depth);
                    spaceAtEachDepth[maxDepth - depth]--;
                }
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
                variableYVals = {};
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
