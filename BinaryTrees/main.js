const { bubbleSort } = require('./bubbleSort')
const { Grid } = require('./grid')
const { Node } = require('./node')

const arrToTree = function (arr) {
    const root = Node(arr[0], 0);
    root.resetMaxDepth()
    for (let i = 1; i < arr.length; i++) {
        const value = arr[i];
        root.insert(value);
    }
    return root;
}

const assignCoordinates = function (root) {
    root.setCoordinates(2**(root.maxDepth() + 1) - 1, 0)
    root.assignChildCoordinates();
    return root;
}

const balanceInput = function (arr) {
    const sortedArr = bubbleSort(arr)
    const output = [];
    const pushMidpoint = function (a) {
        if (a.length < 1) {
            return
        }
        const mid = Math.floor(a.length/2);
        output.push(a[mid])
        pushMidpoint(a.slice(0, mid))
        pushMidpoint(a.slice(mid + 1))
    }
    pushMidpoint(sortedArr);
    return output;
}

exports.getBinaryTree = function (str, balance) {
    let arr = JSON.parse(str);
    if (balance) {
        arr = balanceInput(arr);
    }
    const root = arrToTree(arr);
    assignCoordinates(root);
    const grid = Grid(root);
    grid.placeNodes();
    grid.drawPaths()
    return grid.outputGrid()
}

