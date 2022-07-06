const { parseInput } = require('./parseInput')
const { getWidthAtEachDepth } = require('./getWidthAtEachDepth')
const { Grid } = require('./grid')
const { clone } = require('lodash')


const assignCoordinates = function (logicGate, widthAtEachDepth, spaceAtEachDepth) {
    logicGate.assignXValue()
    logicGate.assignYValue(widthAtEachDepth, spaceAtEachDepth);
    logicGate.children.forEach(child => {
        assignCoordinates(child, widthAtEachDepth, spaceAtEachDepth);
    });
}

const getLogicDiagram = function (input) {
    const root = parseInput(input);
    const widthAtEachDepth = getWidthAtEachDepth(root);
    assignCoordinates(root, widthAtEachDepth, clone(widthAtEachDepth)); // used to be lodash clone
    root.generatePlaceableSymbol(); // NOTE this is weird but sure

    const grid = Grid(root);
    grid.placeSymbols(root);
    grid.drawPaths();
    grid.drawOutput(input);
    grid.debugPrintGrid();
    return grid.getGrid();
}

exports.getLogicDiagram = getLogicDiagram;

// getLogicDiagram('A AND (B OR C AND A) AND C')
