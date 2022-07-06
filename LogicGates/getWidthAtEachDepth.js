exports.getWidthAtEachDepth = function (lt) {
    const placedVars = {};
    const maxDepth = lt.getMaxDepth();
    const widthAtEachDepth = new Array(maxDepth + 1).fill(0);
    const recurDepthWidth = function (depth, lg) {
        if (lg.getIsVariable()) {
            if (placedVars[lg.getSymbol()] === undefined) {
                widthAtEachDepth[0]++;
            }
            placedVars[lg.getSymbol()] = true;
        } else widthAtEachDepth[depth]++;
        lg.children.forEach(child => {
            recurDepthWidth(depth - 1, child);
        })
    }
    recurDepthWidth(maxDepth, lt);
    return widthAtEachDepth;
}