const fNode = function () {
    let maxDepth = 0;
    return (value, depth) => {
        maxDepth = Math.max(depth, maxDepth)
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
exports.Node = Node;