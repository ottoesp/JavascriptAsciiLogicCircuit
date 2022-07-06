const fGrid = function () {
    return (root) => {
        const maxX = 2**(root.maxDepth() + 2) - 2;
        const maxY = 3 * (root.maxDepth());
        const grid = [...Array(maxY)].map(() => Array(maxX).fill(' '));
        
        const placeNodes = function (node = root) {
            const {x, y} = node.getCoordinates();
            const strValue = `${node.value()}`;
            grid[y].splice(x, strValue.length, ...strValue.split(''));
            if (node.getLeft()) {
                placeNodes(node.getLeft())
            }
            if (node.getRight()) {
                placeNodes(node.getRight())
            }
        }

        const drawPaths = function (node = root) {
            const {x, y} = node.getCoordinates();
            const xOffset = 2**(node.maxDepth() - node.depth());
            // const leaf = node.depth() + 1 === node.maxDepth();
            const [left, right] = [node.getLeft(), node.getRight()]
            if (left) {
                if (left.isLeaf()) {
                    grid[y + 1][x - 1] = '/';
                } else {
                    const line = '_'.repeat(xOffset - 3) + '/';
                    grid[y + 1].splice(x - (xOffset - 2), line.length, ...line.split(''));
                    grid[y + 2][x - (xOffset - 1)] = '/'; 
                }
                
                
                drawPaths(node.getLeft());
            }
            if (node.getRight()) {
                if (right.isLeaf()) {
                    grid[y + 1][x + 1] = '\\'
                } else {
                    const line = '\\' + '_'.repeat(xOffset - 3);
                    grid[y + 1].splice(x + 1, line.length, ...line.split(''));
                    grid[y + 2][x + (xOffset - 1)] = '\\'; 
                }

                drawPaths(node.getRight());
            }
        }

        const printGrid = function () {
            grid.forEach((row) => {
                console.log(row.join(''));
            })
        }

        return {
            placeNodes : placeNodes,
            printGrid : printGrid,
            drawPaths : drawPaths,
        }
    }
}
exports.Grid = fGrid();