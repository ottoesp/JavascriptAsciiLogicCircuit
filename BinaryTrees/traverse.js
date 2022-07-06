exports.traverse = {
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