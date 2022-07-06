const { max, sortBy } = require("lodash");

const fNode = function () {
    let maxDepth = 0;
    return (value, depth) => {
        maxDepth = max([depth, maxDepth])
        let left = null;
        let right = null;
        let x = null;
        let y = null;
        const insert = function (newValue) {
            if (newValue <= value) {
                if (left) {
                    left.insert(newValue);
                } else {
                    left = Node(newValue, depth + 1);
                }
            } else {
                if (right) {
                    right.insert(newValue);
                } else {
                    right = Node(newValue, depth + 1);
                }
            }
        }
        const assignChildCoordinates = function () {
            const xOffset = 2**(maxDepth - depth);
            if (left) {
                const leaf = left.isLeaf();
                left.setCoordinates(x - (leaf ? 2 : xOffset), y + (leaf ? 2 : 3))
                left.assignChildCoordinates();
            }
            if (right) {
                const leaf = right.isLeaf();
                right.setCoordinates(x + (leaf ? 2 : xOffset), y + (leaf ? 2 : 3))
                right.assignChildCoordinates();
            }
        }
        const isLeaf = function () {
            return (left === null && right === null);
        }
        return {
            getLeft : () => left,
            getRight : () => right,
            setCoordinates : (a, b) => {
                x = a;
                y = b;
            },
            isLeaf : isLeaf,
            getCoordinates : () => {return {x, y}},
            value : () => value,
            insert : insert,
            maxDepth : () => maxDepth,
            resetMaxDepth : () => {maxDepth = 0},
            depth : () => depth,
            assignChildCoordinates : () => assignChildCoordinates(),
        }
    }
}
const Node = fNode();

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
const Grid = fGrid();

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

const getBinaryTree = function (arr, balance) {
    let a = [...arr];
    console.log(a)
    if (balance) {
        a = balanceInput(a);
    }
    console.log(a)
    let root = arrToTree(a);
    assignCoordinates(root);
    const grid = Grid(root);
    grid.placeNodes();
    grid.drawPaths()
    grid.printGrid()
}

const randomArray = function (n, b) {
    const arr = [];
    for (let i = 0; i < n; i++) {
        arr.push(Math.floor(Math.random() * b));
    }
    return arr;
}
const traverse = {
    preorder : (node, foo) => {
        const output = foo(node);
        if (node.getLeft()) {
            traverse.preorder(node.getLeft(), foo);
        }
        if (node.getRight()) {
            traverse.preorder(node.getRight(), foo);
        }
        return output;
    },
    inorder : (node, foo) => {
        if (node.getLeft()) {
            traverse.inorder(node.getLeft(), foo);
        }
        const output = foo(node);
        if (node.getRight()) {
            traverse.inorder(node.getRight(), foo);
        }
        return output;
    },
    postorder : (node, foo) => {
        if (node.getLeft()) {
            traverse.postorder(node.getLeft(), foo);
        }
        if (node.getRight()) {
            traverse.postorder(node.getRight(), foo);
        }
        const output = foo(node);
        return output;
    }
}
const balanceInput = function (arr) {
    const sortedArr = sortBy(arr)
    const output = [];
    const pushMidpoint = function (a) {
        if (a.length < 1) {
            return
        }
        const mid = Math.floor(a.length/2);
        console.log(a.length, mid)
        output.push(a[mid])
        pushMidpoint(a.slice(0, mid))
        pushMidpoint(a.slice(mid + 1))
    }
    pushMidpoint(sortedArr);
    return output;
}
let a = randomArray(5, 99)
getBinaryTree(a, false);
getBinaryTree(a, true);
