const { getWidthAtEachDepth } = require('./getWidthAtEachDepth')
const Render = require('./render')
const PF = require('./PathFindingJS/src/PathFinding');

var VERT_SPACING = 3;

const ALPHABET = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]

const GridFactory = function () {
    const PATH_CORNER_WEIGHT = 10;
    const PATH_WEIGHT = 2;
    const SHARED_PATH_WEIGHT = 1;

    return (root, whitespace = '&nbsp') => { 
        const nOfRows = (Math.max(...getWidthAtEachDepth(root))) * (VERT_SPACING + 2) + 2;
        const nOfColumns = root.getMaxX() + 6; // + GateWidth
        const pathsToVars = {};

        let grid = [...Array(nOfRows)].map(() => Array(nOfColumns).fill(whitespace));

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
            if (grid[y][x] === whitespace) {
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
            for (let row = 0; row < grid.length; row++) {
                for (let column = 0; column < grid[0].length; column++) {
                    const tile = grid[row][column];
                    // next to a gate
                    if (sharedPaths.includes(JSON.stringify([row, column]))) {
                        PFGrid.setWeightAt(column, row, SHARED_PATH_WEIGHT)
                    } else if (["║", "-", "╢", "[", "]"].concat(ALPHABET).includes(tile)) {
                        PFGrid.setWalkableAt(column, row, false)
                    } else if (
                        ["║", "-", "╢", "[", "]"].concat(ALPHABET)
                            .includes((column > 0) ? grid[row][column - 1] : null) ||
                        ["║", "-", "╢", "[", "]"].concat(ALPHABET)
                            .includes((column < grid[0].length - 1) ? grid[row][column + 1] : null)
                    ) {
                        PFGrid.setWeightAt(column, row, 1000)
                    } else if (['┘', '┐', '┌', '└', '┤', '┴', '┬', '├'].includes(tile)) {
                        PFGrid.setWeightAt(column, row, PATH_CORNER_WEIGHT)
                    } else if (['─', '│', '#'].includes(tile)) {
                        PFGrid.setWeightAt(column, row, PATH_WEIGHT)
                    } else {
                        PFGrid.setWeightAt(column, row, 1)
                    }
                }
            }
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

        const drawPaths = function (logicGate) {
            logicGate.children.forEach((child) => {
                if (!child.getIsVariable()) {
                    drawPaths(child);
                }
            });
            let a = 0;
            if (logicGate.children.length > 1) {
                a = logicGate.children[0].coordinates().y < logicGate.children[0].coordinates().y ? 0 : 1;
            }

            logicGate.children.forEach((child, i) => {
                const path = logicGate.getPathsToChildren(generatePFGrid, child, (a + i) % logicGate.children.length);
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
        const drawOutput = function (input) {
            const y = root.getOutput().y;
            grid[y] = [...grid[y], "─", ...input.split("")];
        }
        return {
            drawOutput: (input) => {
                drawOutput(input)
            },
            placeSymbols: () => {
                return _placeSymbols(root)
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
                drawPaths(root);
            }
        }
    }
}
exports.Grid = GridFactory();