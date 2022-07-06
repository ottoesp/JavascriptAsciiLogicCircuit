<<<<<<< HEAD
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
=======
function findDistanceFromParentNode(row) {
  if (row === 2) {
    return 3;
  } else if (row === 1) {
    return 1;
  }
  return findDistanceFromParentNode(row - 1) * 2 + 1
}

function Node(value, row) {
  this.right = null;
  this.left = null;
  this.x = null;
  this.y = null;
  this.row = row;

  this.getValue = function () {
    return value
  }

  this.flipRows = function () {
    if (this.right !== null) {
      this.right.flipRows()
    }
    if (this.left !== null) {
      this.left.flipRows()
    }
    this.row = depthSizes.length - this.row;
  }
  this.assignDistanceToParent = function () {
    if (this.right !== null) {
      this.right.assignDistanceToParent()
    }
    if (this.left !== null) {
      this.left.assignDistanceToParent()
    }
    this.distance2PN = findDistanceFromParentNode(this.row);
  }
  this.assignYValues = function (gridHeight) {
    if (this.right !== null) {
      this.right.assignYValues()
    }
    if (this.left !== null) {
      this.left.assignYValues()
    }
    this.y = this.row === 1 ? 0 : 2 + 3 * (this.row - 2);
  }
  this.assignXValues = function (stem, boardWidth) {
    if (stem) {
      this.x = Math.floor(boardWidth / 2)
    }
    if (this.right !== false) {
      this.right.x = this.x + this.right.distance2PN
      if (this.right.row === 1) {
        this.right.x += 1
      }
      this.right.assignXValues(false)
    }
    if (this.left !== false) {
      this.left.x = this.x - this.left.distance2PN
      if (this.left.row === 1) {
        this.left.x -= 1
      }
      this.left.assignXValues(false)
    }
  }
  this.place = function (grid) {
    if (this.right !== false) {
      this.right.place(grid)
    }
    if (this.left !== false) {
      this.left.place(grid)
    }
    let stringVal = value.toString()
    if (stringVal.length > 3) {
      console.log("ERROR value too large")
    } else if (stringVal.length === 3) {
      grid[this.y].splice(this.x - 1, 3, stringVal[0], stringVal[1], stringVal[2])
    } else if (stringVal.length === 2) {
      grid[this.y].splice(this.x, 2, stringVal[0], stringVal[1])
    } else if (stringVal.length === 1) {
      grid[this.y].splice(this.x, 1, stringVal)
    }
    if (this.row !== 1) {
      if (this.right !== false) {
        grid[this.y - 1][this.x + 1] = "\\"
        for (let i = 2; i < this.right.distance2PN - 1; i++) {
          grid[this.y - 1][this.x + i] = "_"
        }
        if (this.row != 2) {
          grid[this.y - 2][this.x + this.right.distance2PN - 1] = "\\"
        }

      }
      if (this.left !== false) {
        grid[this.y - 1][this.x - 1] = "/"
        for (let i = 2; i < this.left.distance2PN - 1; i++) {
          grid[this.y - 1][this.x - i] = "_"
        }
        if (this.row !== 2) {
          grid[this.y - 2][this.x - this.left.distance2PN + 1] = "/"
        }

      }
    }
  }
}


// exports.randList = function (start, end, NumberOfValues) {
//   let output = [];
//   for (let i = 0; i < NumberOfValues; i++) {
//     output.push(Math.floor(Math.random() * (end - start)) + start);
//   }
//   return output;
// }

function parseGrid(grid) {
  let g = grid.reverse()
  for (let i = 0; i < g.length; i++) {
    for (let j = 0; j < g[i].length; j++) {
      if (g[i][j] === " ") {
        g[i][j] = "&nbsp"
      }
    }
    g[i] = g[i].join("")
  }
  g = g.join("\n")
  return g
}

function placeObjectInTree(val, tree, row) {
  if (val < tree.value) {
    if (tree.left) {
      placeObjectInTree(val, tree.left, row + 1);
    } else {
      tree.left = new Node(val, row);
    }
  } else {
    if (tree.right) {
      placeObjectInTree(val, tree.right, row + 1);
    } else {
      tree.right = new Node(val, row);
    }
  }

}

function createObjectTree(inp) {
  let tree = new Node(inp[0], 0);
  for (let i = 1; i < inp.length; i++) {
    placeObjectInTree(inp[i], tree, 1)
  }
  return tree;
}

var depthSizes = []

function findDepthSizes(tree, depth) {
  if (depthSizes[depth] === undefined) {
    depthSizes.push(0);
  }
  depthSizes[depth] += 1;
  if (tree.left) {
    findDepthSizes(tree.left, depth + 1)
  }
  if (tree.right) {
    findDepthSizes(tree.right, depth + 1)
  }
}

function findBoardWidth() {
  let numberOfRows = depthSizes.length
  return boardWidthRecur(numberOfRows)
}

function boardWidthRecur(depth) {
  if (depth === 1) {
    return 1;
  }
  return boardWidthRecur(depth - 1) * 2 + 3
}

function findBoardHeight() {
  let numberOfRows = depthSizes.length
  return boardHeightRecur(numberOfRows) + 1
}

function boardHeightRecur(depth) {
  if (depth === 3) {
    return 5;
  }
  if (depth === 2) {
    return 2;
  }
  if (depth === 1) {
    return 1;
  }
  return boardHeightRecur(depth - 1) + 3
}

function createGrid(width, height) {
  let grid = [];
  for (let i = 0; i < height; i++) {
    grid.push([]);
    for (let j = 0; j < width; j++) {
      grid[i].push(" ");
    }
  }
  return grid;
}

function parseInp(inp) {
  inp = inp.split(/[ ,]+/).map(function (item) {
    return parseInt(item)
  })
  return inp
}

getBinaryTree = function (inp) {
  inp = parseInp(inp)
  depthSizes = []
  let root = createObjectTree(inp);
  findDepthSizes(root, 0);
  root.flipRows()
  root.assignDistanceToParent()
  const boardWidth = findBoardWidth();
  const boardHeight = findBoardHeight();
  root.assignYValues(boardHeight)
  root.assignXValues(true, boardWidth)
  let grid = createGrid(boardWidth, boardHeight);
  root.place(grid)
  opt = parseGrid(grid)
  console.log(opt)
  return opt
}

getBinaryTree('[1, 3, 2, 5]')
// balance = function (arr) { // Broken
//   depthSizes = []
//   if (arr.length > 1) {
//     let middleIndex = Math.floor(arr.length / 2)
//     let temp = arr[middleIndex]
//     arr.splice(middleIndex, 1)
//     arr.splice(0, 0, temp)
//     let left = []
//     let right = []
//     for (let i = 0; i < arr.length; i++) {
//       if (i < middleIndex) {
//         left.push(arr[i])
//       } else {
//         right.push(arr[i])
//       }
//     }
//     left = balance(left)
//     right = balance(right)
//     // console.log(left, right)
//     return right.concat(left)
//   } else {
//     return arr
//   }
// }
>>>>>>> 77f5a983be8c315e5724178f18afe11a7b17a608
