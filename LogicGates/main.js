const { parseInput } = require('./parseInput')
const { getWidthAtEachDepth } = require('./getWidthAtEachDepth')
const { Grid } = require('./grid')


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
    assignCoordinates(root, widthAtEachDepth, [...widthAtEachDepth]); // used to be lodash clone
    root.generatePlaceableSymbol(); // NOTE this is weird but sure

    const grid = Grid(root);
    grid.placeSymbols(root);
    grid.drawPaths();
    grid.drawOutput(input);
    return grid.getGrid();
}

exports.getLogicDiagram = getLogicDiagram;
