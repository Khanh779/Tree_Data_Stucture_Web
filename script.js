// Get tree definitions description from combobox named "treeTypeCom"
const treeTypeCom = document.getElementById('treeType');
const descriptionTree = document.getElementById('description_Tree');

treeTypeCom.addEventListener('change', function() {
    const selectedValue = treeTypeCom.value;
    let description = '';

    switch (selectedValue) {
        case 'binary':
            description = 'Binary Tree is a tree data structure in which each node has at most two children, referred to as the left child and the right child.';
            break;
        case 'bst':
            description = 'Binary Search Tree is a binary tree in which the value of the left child node is less than the parent node and the value of the right child node is greater than the parent node.';
            break;
        case 'b':
            description = 'B-Tree is a self-balancing tree data structure that maintains sorted data and allows for efficient insertion, deletion, and search operations.';
            break;
        case 'skew':
            description = 'Skew Tree is a binary tree in which every node has only one child (either left or right).';
            break;
        case 'avl':
            description = 'AVL Tree is a self-balancing binary search tree where the height difference between the left and right subtrees of any node is at most 1.';
            break;
        case 'splay':
            description = 'Splay Tree is a self-adjusting binary search tree where recently accessed nodes are moved closer to the root.';
            break;
    }

    descriptionTree.innerHTML = "<b>Description: </b><i>" +  description+ "</i>";
});




// Tree Node Classes
class TreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.parent = null;
    }
}

// Binary Search Tree
class BST {
    constructor() {
        this.root = null;
    }
    insert(value) {
        if (!this.root) {
            this.root = new TreeNode(value);
            return true;
        }
        let curr = this.root;
        while (true) {
            if (value === curr.value) return false;
            if (value < curr.value) {
                if (!curr.left) {
                    curr.left = new TreeNode(value);
                    curr.left.parent = curr;
                    return true;
                }
                curr = curr.left;
            } else {
                if (!curr.right) {
                    curr.right = new TreeNode(value);
                    curr.right.parent = curr;
                    return true;
                }
                curr = curr.right;
            }
        }
    }
    find(value) {
        let curr = this.root;
        while (curr) {
            if (value === curr.value) return curr;
            curr = value < curr.value ? curr.left : curr.right;
        }
        return null;
    }
    remove(value) {
        this.root = this._remove(this.root, value);
    }
    _remove(node, value) {
        if (!node) return null;
        if (value < node.value) node.left = this._remove(node.left, value);
        else if (value > node.value) node.right = this._remove(node.right, value);
        else {
            if (!node.left) return node.right;
            if (!node.right) return node.left;
            let minLarger = node.right;
            while (minLarger.left) minLarger = minLarger.left;
            node.value = minLarger.value;
            node.right = this._remove(node.right, minLarger.value);
        }
        return node;
    }
}

// Binary Tree (no specific order)
class BinaryTree {
    constructor() {
        this.root = null;
    }
    insert(value) {
        const newNode = new TreeNode(value);
        if (!this.root) {
            this.root = newNode;
            return true;
        }
        // BFS to find the first empty position
        const queue = [this.root];
        while (queue.length) {
            const node = queue.shift();
            if (!node.left) {
                node.left = newNode;
                newNode.parent = node;
                return true;
            } else queue.push(node.left);
            if (!node.right) {
                node.right = newNode;
                newNode.parent = node;
                return true;
            } else queue.push(node.right);
        }
    }
    find(value) {
        const queue = [this.root];
        while (queue.length) {
            const node = queue.shift();
            if (!node) continue;
            if (node.value === value) return node;
            queue.push(node.left, node.right);
        }
        return null;
    }
    remove(value) {
        if (!this.root) return;
        // Find node to delete and last node
        let nodeToDelete = null, lastNode = null, parentOfLast = null;
        const queue = [this.root];
        while (queue.length) {
            const node = queue.shift();
            if (node.value === value) nodeToDelete = node;
            if (node.left) {
                parentOfLast = node;
                queue.push(node.left);
            }
            if (node.right) {
                parentOfLast = node;
                queue.push(node.right);
            }
            lastNode = node;
        }
        if (!nodeToDelete) return;
        if (lastNode === this.root) {
            this.root = null;
            return;
        }
        nodeToDelete.value = lastNode.value;
        // Delete last node
        if (parentOfLast.right === lastNode) parentOfLast.right = null;
        else parentOfLast.left = null;
    }
}

// Skew Tree (every node has only one child on the left)
class SkewTree {
    constructor() { this.root = null; }
    insert(value) {
        const newNode = new TreeNode(value);
        if (!this.root) { this.root = newNode; return true; }
        let curr = this.root;
        while (curr.left) curr = curr.left;
        curr.left = newNode;
        newNode.parent = curr;
        return true;
    }
    find(value) {
        let curr = this.root;
        while (curr) {
            if (curr.value === value) return curr;
            curr = curr.left;
        }
        return null;
    }
    remove(value) {
        if (!this.root) return;
        if (this.root.value === value) { this.root = this.root.left; return; }
        let prev = this.root, curr = this.root.left;
        while (curr) {
            if (curr.value === value) {
                prev.left = curr.left;
                return;
            }
            prev = curr;
            curr = curr.left;
        }
    }
}

// AVL Tree
class AVLNode extends TreeNode {
    constructor(value) {
        super(value);
        this.height = 1;
    }
}
class AVLTree {
    constructor() { this.root = null; }
    getHeight(node) { return node ? node.height : 0; }
    updateHeight(node) {
        node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
    }
    getBalance(node) {
        return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
    }
    rotateRight(y) {
        const x = y.left;
        y.left = x.right;
        x.right = y;
        this.updateHeight(y);
        this.updateHeight(x);
        return x;
    }
    rotateLeft(x) {
        const y = x.right;
        x.right = y.left;
        y.left = x;
        this.updateHeight(x);
        this.updateHeight(y);
        return y;
    }
    insert(value) {
        let inserted = false;
        const insertRec = (node, value) => {
            if (!node) { inserted = true; return new AVLNode(value); }
            if (value === node.value) return node;
            if (value < node.value) node.left = insertRec(node.left, value);
            else node.right = insertRec(node.right, value);
            this.updateHeight(node);
            const balance = this.getBalance(node);
            if (balance > 1 && value < node.left.value) return this.rotateRight(node);
            if (balance < -1 && value > node.right.value) return this.rotateLeft(node);
            if (balance > 1 && value > node.left.value) {
                node.left = this.rotateLeft(node.left);
                return this.rotateRight(node);
            }
            if (balance < -1 && value < node.right.value) {
                node.right = this.rotateRight(node.right);
                return this.rotateLeft(node);
            }
            return node;
        };
        this.root = insertRec(this.root, value);
        return inserted;
    }
    find(value) {
        let curr = this.root;
        while (curr) {
            if (value === curr.value) return curr;
            curr = value < curr.value ? curr.left : curr.right;
        }
        return null;
    }
    remove(value) {
        const removeRec = (node, value) => {
            if (!node) return null;
            if (value < node.value) node.left = removeRec(node.left, value);
            else if (value > node.value) node.right = removeRec(node.right, value);
            else {
                if (!node.left) return node.right;
                if (!node.right) return node.left;
                let minLarger = node.right;
                while (minLarger.left) minLarger = minLarger.left;
                node.value = minLarger.value;
                node.right = removeRec(node.right, minLarger.value);
            }
            this.updateHeight(node);
            const balance = this.getBalance(node);
            if (balance > 1 && this.getBalance(node.left) >= 0) return this.rotateRight(node);
            if (balance > 1 && this.getBalance(node.left) < 0) {
                node.left = this.rotateLeft(node.left);
                return this.rotateRight(node);
            }
            if (balance < -1 && this.getBalance(node.right) <= 0) return this.rotateLeft(node);
            if (balance < -1 && this.getBalance(node.right) > 0) {
                node.right = this.rotateRight(node.right);
                return this.rotateLeft(node);
            }
            return node;
        };
        this.root = removeRec(this.root, value);
    }
}

// Splay Tree
class SplayTree extends BST {
    splay(x) {
        if (!x || !x.parent) return x;
        while (x.parent) {
            let p = x.parent;
            let gp = p.parent;
            if (!gp) {
                if (p.left === x) this.rotateRight(p);
                else this.rotateLeft(p);
            } else if (gp.left === p && p.left === x) {
                this.rotateRight(gp);
                this.rotateRight(p);
            } else if (gp.right === p && p.right === x) {
                this.rotateLeft(gp);
                this.rotateLeft(p);
            } else if (gp.left === p && p.right === x) {
                this.rotateLeft(p);
                this.rotateRight(gp);
            } else {
                this.rotateRight(p);
                this.rotateLeft(gp);
            }
        }
        this.root = x;
    }
    rotateLeft(x) {
        let y = x.right;
        if (!y) return;
        x.right = y.left;
        if (y.left) y.left.parent = x;
        y.parent = x.parent;
        if (!x.parent) this.root = y;
        else if (x === x.parent.left) x.parent.left = y;
        else x.parent.right = y;
        y.left = x;
        x.parent = y;
    }
    rotateRight(x) {
        let y = x.left;
        if (!y) return;
        x.left = y.right;
        if (y.right) y.right.parent = x;
        y.parent = x.parent;
        if (!x.parent) this.root = y;
        else if (x === x.parent.left) x.parent.left = y;
        else x.parent.right = y;
        y.right = x;
        x.parent = y;
    }
    insert(value) {
        let node = super.insert(value) ? this.find(value) : null;
        if (node) this.splay(node);
        return !!node;
    }
    find(value) {
        let node = this.root, last = null;
        while (node) {
            last = node;
            if (value === node.value) break;
            node = value < node.value ? node.left : node.right;
        }
        if (last) this.splay(last);
        return node && node.value === value ? node : null;
    }
    remove(value) {
        let node = this.find(value);
        if (!node) return;
        this.splay(node);
        if (!node.left) this.root = node.right;
        else {
            let maxLeft = node.left;
            while (maxLeft.right) maxLeft = maxLeft.right;
            this.splay(maxLeft);
            maxLeft.right = node.right;
            if (node.right) node.right.parent = maxLeft;
            this.root = maxLeft;
            maxLeft.parent = null;
        }
    }
}

// B-Tree (order 3 for demo)
class BTreeNode {
    constructor(t, leaf = true) {
        this.t = t; // Minimum degree
        this.leaf = leaf;
        this.keys = [];
        this.children = [];
    }
}
class BTree {
    constructor(t = 3) {
        this.t = t;
        this.root = new BTreeNode(t);
    }
    find(value, node = this.root) {
        let i = 0;
        while (i < node.keys.length && value > node.keys[i]) i++;
        if (i < node.keys.length && node.keys[i] === value) return node;
        if (node.leaf) return null;
        return this.find(value, node.children[i]);
    }
    insert(value) {
        if (this.find(value)) return false;
        let r = this.root;
        if (r.keys.length === 2 * this.t - 1) {
            let s = new BTreeNode(this.t, false);
            s.children[0] = r;
            this.splitChild(s, 0);
            this.insertNonFull(s, value);
            this.root = s;
        } else {
            this.insertNonFull(r, value);
        }
        return true;
    }
    insertNonFull(node, value) {
        let i = node.keys.length - 1;
        if (node.leaf) {
            node.keys.push(0);
            while (i >= 0 && value < node.keys[i]) {
                node.keys[i + 1] = node.keys[i];
                i--;
            }
            node.keys[i + 1] = value;
        } else {
            while (i >= 0 && value < node.keys[i]) i--;
            i++;
            if (node.children[i].keys.length === 2 * this.t - 1) {
                this.splitChild(node, i);
                if (value > node.keys[i]) i++;
            }
            this.insertNonFull(node.children[i], value);
        }
    }
    splitChild(parent, i) {
        let t = this.t;
        let y = parent.children[i];
        let z = new BTreeNode(t, y.leaf);
        z.keys = y.keys.splice(t);
        if (!y.leaf) z.children = y.children.splice(t);
        parent.children.splice(i + 1, 0, z);
        parent.keys.splice(i, 0, y.keys.pop());
    }
    remove(value) {
        // For demo: not fully implemented (B-Tree remove is complex)
        // Only remove from leaf for simplicity
        function removeFromLeaf(node, value) {
            let idx = node.keys.indexOf(value);
            if (idx !== -1) node.keys.splice(idx, 1);
        }
        function dfs(node) {
            if (!node) return;
            let idx = node.keys.indexOf(value);
            if (idx !== -1 && node.leaf) removeFromLeaf(node, value);
            else if (!node.leaf) node.children.forEach(dfs);
        }
        dfs(this.root);
    }
}

// UI and Animation
const treeTypes = {
    binary: BinaryTree,
    bst: BST,
    b: BTree,
    skew: SkewTree,
    avl: AVLTree,
    splay: SplayTree
};
let currentTree = new treeTypes['binary']();

function showModal(msg) {
    const modal = document.getElementById('modal');
    document.getElementById('modalMessage').innerHTML = msg;
    modal.style.display = 'block';
}
document.querySelector('.close').onclick = () => {
    document.getElementById('modal').style.display = 'none';
};
window.onclick = function (event) {
    if (event.target == document.getElementById('modal')) {
        document.getElementById('modal').style.display = 'none';
    }
};

// function renderTree(tree) {
//     const container = document.getElementById('treeContainer');
//     container.innerHTML = '';
//     container.style.position = 'relative';
//     container.style.height = '400px';
//     if (!tree.root) return;
//     if (tree instanceof BTree) {
//         // B-Tree rendering
//         function renderBTree(node, x, y, depth) {
//             if (!node) return;
//             const nodeDiv = document.createElement('div');
//             nodeDiv.className = 'node';
//             nodeDiv.style.borderRadius = '10px';
//             nodeDiv.style.width = (node.keys.length * 40 + 8) + 'px';
//             nodeDiv.style.height = '48px';
//             nodeDiv.style.left = x + 'px';
//             nodeDiv.style.top = y + 'px';
//             nodeDiv.style.position = 'absolute';
//             nodeDiv.innerText = node.keys.join(' | ');
//             container.appendChild(nodeDiv);
//             if (!node.leaf) {
//                 let childX = x - (node.children.length - 1) * 60;
//                 for (let i = 0; i < node.children.length; i++) {
//                     renderBTree(node.children[i], childX + i * 120, y + 70, depth + 1);
//                 }
//             }
//         }
//         renderBTree(tree.root, 400, 20, 1);
//         return;
//     }
//     // Render các cây nhị phân
//     function createNode(node, x, y, angle, depth, parentX, parentY) {
//         if (!node) return;
//         const nodeDiv = document.createElement('div');
//         nodeDiv.className = 'node';
//         nodeDiv.innerText = node.value;
//         nodeDiv.style.position = 'absolute';
//         nodeDiv.style.left = x + 'px';
//         nodeDiv.style.top = y + 'px';
//         container.appendChild(nodeDiv);
//         if (parentX !== null && parentY !== null) {
//             const edge = document.createElement('div');
//             edge.className = 'edge';
//             edge.style.position = 'absolute';
//             edge.style.width = Math.sqrt((x - parentX) * (x - parentX) + (y - parentY) * (y - parentY)) + 'px';
//             edge.style.height = '2px';
//             edge.style.left = parentX + 24 + 'px';
//             edge.style.top = parentY + 24 + 'px';
//             edge.style.transformOrigin = '0 0';
//             edge.style.transform = `rotate(${Math.atan2(y - parentY, x - parentX) * 180 / Math.PI}deg)`;
//             container.appendChild(edge);
//         }
//         createNode(node.left, x - 80 / Math.pow(1.2, depth), y + 70, angle - 20, depth + 1, x, y);
//         createNode(node.right, x + 80 / Math.pow(1.2, depth), y + 70, angle + 20, depth + 1, x, y);
//     }
//     createNode(tree.root, 400, 20, 0, 1, null, null);
// }


function renderTree(tree) {
    const container = document.getElementById('treeContainer');
    container.replaceChildren();           // clear previous content
    container.className = '';              // reset class for new render
    container.style.position = 'relative';
    container.style.height = '400px';

    if (!tree?.root) return;

    /* ---------- UTILITY ---------- */
    const EDGE_DELAY = 0;       // ms – if you want delay when drawing edge

    // Create DOM node with pop-in effect
    function makeNode(content, extraClass = '') {
        const n = document.createElement('div');
        n.className = `node adding ${extraClass}`.trim();
        n.textContent = content;
        n.addEventListener('animationend', () => n.classList.remove('adding'), { once: true });
        return n;
    }

    // Draw edge with slide animation
    function makeEdge(x1, y1, x2, y2) {
        const dx = x2 - x1, dy = y2 - y1;
        const length = Math.sqrt(dx * dx + dy * dy);

        const e = document.createElement('div');
        e.className = 'edge';
        e.style.left = x1 + 'px';
        e.style.top = y1 + 'px';
        e.style.transform = `rotate(${Math.atan2(dy, dx) * 180 / Math.PI}deg)`;
        container.appendChild(e);

        // activate transition in the next frame
        setTimeout(() => { e.style.width = (length) + 'px'; }, EDGE_DELAY);
    }

    /* ---------- 1. B‑TREE ---------- */
    if (tree instanceof BTree) {
        (function renderB(node, x, y, depth) {
            if (!node) return;

            const nodeWidth = node.keys.length * 40 + 8;
            const nodeHeight = 40;
            const nodeEl = makeNode(node.keys.join(' | '));

            nodeEl.style.cssText += `
            position: absolute;
            border-radius: 10px;
            width: ${nodeWidth}px;
            height: ${nodeHeight}px;
            left: ${x - nodeWidth / 2}px;
            top: ${y}px;
            text-align: center;
            line-height: ${nodeHeight}px;
        `;
            container.appendChild(nodeEl);

            if (!node.leaf) {
                const childCount = node.children.length;
                const totalWidth = childCount * (nodeWidth+120); // distance between child nodes
                const startX = x - totalWidth / 2 + 60; // center children relative to parent

                for (let i = 0; i < childCount; i++) {
                    const cx = startX + i * (nodeWidth+120);
                    const cy = y + 100; // increase vertical spacing for aesthetics

                    renderB(node.children[i], cx, cy, depth + 1);

                    // Calculate center of parent and child nodes to connect edges
                    const parentCenterX = x;
                    const parentBottomY = y + nodeHeight;
                    const childCenterX = cx;
                    const childTopY = cy;

                    makeEdge(parentCenterX, parentBottomY, childCenterX, childTopY);
                }
            }
        })(tree.root, 400, 20, 1);
        return;
    }


    /* ---------- 2. BINARY TREE ---------- */
    (function renderBinary(node, x, y, depth, px, py) {
        if (!node) return;

        const n = makeNode(node.value);
        n.style.cssText += `position:absolute; left:${x}px; top:${y}px;`;
        container.appendChild(n);

        if (px !== null && py !== null) {
            makeEdge(px + 26, py + 26, x + 26, y + 26);   // 26px = radius of circular node
        }

        const offset = 80 / Math.pow(1.2, depth);
        renderBinary(node.left, x - offset, y + 70, depth + 1, x, y);
        renderBinary(node.right, x + offset, y + 70, depth + 1, x, y);
    })(tree.root, 400, 20, 1, null, null);
}

/* ---------- SUPPORT FOR MARKING FOUND/NOT FOUND ---------- */
function markNode(domNode, status /* 'found' | 'notfound' */) {
    domNode.classList.add(status);
    // automatically remove the class after 2 seconds
    setTimeout(() => domNode.classList.remove(status), 2000);
}


document.getElementById('treeType').onchange = function () {
    const type = this.value;
    currentTree = new treeTypes[type]();
    renderTree(currentTree);
};

document.getElementById('addBtn').onclick = function () {
    const val = parseInt(document.getElementById('valueInput').value);
    if (isNaN(val)) return showModal('Please enter a number!');
    if (currentTree.find(val)) return showModal('Value <font color="green"><b>' + val + '</b></font> already exists!');
    const ok = currentTree.insert(val);
    if (!ok) return showModal('Cannot add value <font color="red"><b>' + val + '</b></font>!');
    renderTree(currentTree);
};

document.getElementById('removeBtn').onclick = function () {
    const val = parseInt(document.getElementById('valueInput').value);
    if (isNaN(val)) return showModal('Please enter a number!');
    if (!currentTree.find(val)) return showModal('Value not found!');
    currentTree.remove(val);
    renderTree(currentTree);
    showModal('Deleted value ' + val);
};

document.getElementById('checkBtn').onclick = function () {
    const val = parseInt(document.getElementById('valueInput').value);
    if (isNaN(val)) return showModal('Please enter a number!');
    const node = currentTree.find(val);
    renderTree(currentTree);

    if (node) showModal('Value <font color="green"><b>' + val + '</b></font> exists!');
    else showModal('Value <font color="red"><b>' + val + '</b></font> does not exist!');
};

renderTree(currentTree);
