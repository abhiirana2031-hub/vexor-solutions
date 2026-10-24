import { WeekModule } from '../types/course';

export const DSA_WEEK_3_MODULE: WeekModule = {
  weekNumber: 3,
  title: 'Hierarchical Structures: Trees, BSTs, Heaps & Tries',
  theme: 'Non-Linear Branching, Logarithmic Traversals, Heap Invariants & Prefix Automata',
  description:
    'Master hierarchical data structures: binary trees, DFS/BFS traversals, lowest common ancestor, binary search tree invariants, AVL/Red-Black tree rotations, priority queues with binary heaps, and prefix Tries for autocomplete search engines.',
  conceptImage: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&w=1200&q=80',
  imageAlt: 'Hierarchical tree branching, heaps and trie data structures visualization',
  days: [
    {
      id: 'dsa-w3-d15',
      dayNumber: 15,
      weekNumber: 3,
      title: 'Binary Trees & Depth-First Traversals (DFS)',
      subtitle: 'Tree properties, recursion vs explicit stacks, Inorder, Preorder, Postorder & Morris traversal',
      durationMinutes: 70,
      overview:
        'Transition from linear sequences to hierarchical branching trees. Master binary tree node mechanics, depth vs height, and the three canonical DFS traversals: Preorder, Inorder, and Postorder—both recursively and iteratively with an explicit stack.',
      topics: [
        {
          id: 'dsa-w3-d15-t1',
          topicNumber: 1,
          title: 'Tree Terminology & Mathematical Properties',
          explanation: [
            'A Tree is a non-linear hierarchical structure where each node has at most one parent and zero or more children.',
            'A Binary Tree is a tree where each node has AT MOST 2 children (left and right).',
            'Mathematical Invariants:',
            '- A binary tree with $N$ nodes has exactly $N - 1$ edges.',
            '- Maximum nodes at depth $d$ is $2^d$ (root is depth 0).',
            '- Maximum nodes in a binary tree of height $h$ is $2^{h+1} - 1$.',
            '- Minimum height of a binary tree with $N$ nodes is $\\lfloor\\log_2 N\\rfloor$.'
          ],
          keyRules: [
            'Leaf node: node with 0 children (left is None and right is None).',
            'Height of node: number of edges on longest path down to a leaf.',
            'Depth of node: number of edges from root down to that node.'
          ],
          codeSnippet: {
            id: 'dsa-snip-15-1',
            title: 'TreeNode Definition in Python',
            description: 'Standard binary tree node class',
            language: 'python',
            code: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

# Construct simple tree:
#       1
#      / \\
#     2   3
root = TreeNode(1)
root.left = TreeNode(2)
root.right = TreeNode(3)
print(f"Root: {root.val}, Left: {root.left.val}, Right: {root.right.val}")`
          },
          pitfall: 'Confusing 0-indexed vs 1-indexed tree height: some definitions define height of single-node tree as 0 (edges), others as 1 (nodes). Clarify in interviews.',
          quickCheck: {
            question: 'What is the maximum number of nodes in a full binary tree of height h (where height of root is 0)?',
            options: ['2^h', '2^(h + 1) - 1', 'h^2', '2h'],
            correctIndex: 1,
            explanation: 'Summing 2^0 + 2^1 + ... + 2^h yields 2^(h + 1) - 1 maximum nodes.'
          }
        },
        {
          id: 'dsa-w3-d15-t2',
          topicNumber: 2,
          title: 'Preorder Traversal: Root → Left → Right',
          explanation: [
            'Preorder processes the CURRENT node FIRST, then visits left subtree, then visits right subtree.',
            'Uses:',
            '- Creating a clone/copy of the tree.',
            '- Serializing the tree into a flat string representation.',
            '- Prefix expression evaluation.',
            'Time: $O(N)$ visiting each node once. Space: $O(H)$ for call stack where $H$ is tree height.'
          ],
          keyRules: [
            'Order: Node -> Left -> Right.',
            'In balanced trees: space is O(log N). In degenerate skewed trees: space is O(N).'
          ],
          codeSnippet: {
            id: 'dsa-snip-15-2',
            title: 'Preorder Traversal (Recursive & Iterative)',
            description: 'Root-Left-Right traversal using stack',
            language: 'python',
            code: `def preorder_recursive(root: TreeNode) -> list[int]:
    res = []
    def dfs(node):
        if not node: return
        res.append(node.val) # Root
        dfs(node.left)       # Left
        dfs(node.right)      # Right
    dfs(root)
    return res

def preorder_iterative(root: TreeNode) -> list[int]:
    if not root: return []
    res, stack = [], [root]
    while stack:
        node = stack.pop()
        res.append(node.val)
        # Push right FIRST so left is popped first (LIFO)!
        if node.right: stack.append(node.right)
        if node.left: stack.append(node.left)
    return res

# Tree: 1 -> left: 2, right: 3
print("Preorder:", preorder_iterative(root)) # [1, 2, 3]`
          },
          pitfall: 'Pushing left child onto stack before right child in iterative preorder: because stacks are LIFO, pushing left first causes right to pop first, producing Root-Right-Left order!',
          quickCheck: {
            question: 'Why do we push the right child before the left child onto the stack in iterative preorder traversal?',
            options: ['Right child has higher value', 'Because stacks are LIFO, pushing right first ensures left is on top and processed next', 'To reverse the tree', 'To balance the tree'],
            correctIndex: 1,
            explanation: 'The stack pops the most recently pushed item first; pushing right then left places the left child on top of the stack.'
          }
        },
        {
          id: 'dsa-w3-d15-t3',
          topicNumber: 3,
          title: 'Inorder Traversal: Left → Root → Right',
          explanation: [
            'Inorder visits the left subtree, processes the CURRENT node, then visits the right subtree.',
            'CRITICAL PROPERTY: In a Binary Search Tree (BST), Inorder traversal yields node values in STRICTLY ASCENDING SORTED ORDER!',
            'Iterative approach: push all left children onto stack until hitting None. Pop node, process it, and move to `node.right`.'
          ],
          keyRules: [
            'Order: Left -> Node -> Right.',
            'Inorder on a BST always produces non-decreasing sorted order.'
          ],
          codeSnippet: {
            id: 'dsa-snip-15-3',
            title: 'Inorder Traversal (Recursive & Iterative)',
            description: 'Left-Root-Right traversal',
            language: 'python',
            code: `def inorder_recursive(root: TreeNode) -> list[int]:
    res = []
    def dfs(node):
        if not node: return
        dfs(node.left)       # Left
        res.append(node.val) # Root
        dfs(node.right)      # Right
    dfs(root)
    return res

def inorder_iterative(root: TreeNode) -> list[int]:
    res, stack = [], []
    curr = root
    while curr or stack:
        # Traverse to leftmost child
        while curr:
            stack.append(curr)
            curr = curr.left
        curr = stack.pop()
        res.append(curr.val) # Process Root
        curr = curr.right    # Visit Right
    return res

# BST: 2 -> left: 1, right: 3
bst = TreeNode(2, TreeNode(1), TreeNode(3))
print("Inorder BST:", inorder_iterative(bst)) # [1, 2, 3] (Sorted!)`
          },
          pitfall: 'Resetting `curr = root` inside the loop: curr must advance to `curr.right` after processing the popped node.',
          quickCheck: {
            question: 'What special property does an Inorder traversal possess when executed on a Binary Search Tree (BST)?',
            options: ['It visits leaves first', 'It outputs all node values in strictly sorted ascending order', 'It reverses the tree values', 'It calculates tree height'],
            correctIndex: 1,
            explanation: 'Because a BST places smaller values in left subtrees and larger values in right subtrees, Left-Root-Right traversal naturally sorts the values.'
          }
        },
        {
          id: 'dsa-w3-d15-t4',
          topicNumber: 4,
          title: 'Postorder Traversal: Left → Right → Root',
          explanation: [
            'Postorder visits left subtree, visits right subtree, and processes CURRENT node LAST.',
            'Uses:',
            '- Deleting a tree safely from leaves up to root (freeing child nodes before parent node).',
            '- Bottom-Up computations where parent needs results from BOTH children (tree height, maximum path sum).',
            '- Postfix expression trees.'
          ],
          keyRules: [
            'Order: Left -> Right -> Node.',
            'Children are guaranteed to be fully evaluated before parent node is processed.'
          ],
          codeSnippet: {
            id: 'dsa-snip-15-4',
            title: 'Postorder Traversal Implementation',
            description: 'Left-Right-Root bottom-up processing',
            language: 'python',
            code: `def postorder_recursive(root: TreeNode) -> list[int]:
    res = []
    def dfs(node):
        if not node: return
        dfs(node.left)       # Left
        dfs(node.right)      # Right
        res.append(node.val) # Root
    dfs(root)
    return res

# Iterative postorder: Preorder modified (Root -> Right -> Left), then reversed!
def postorder_iterative(root: TreeNode) -> list[int]:
    if not root: return []
    res, stack = [], [root]
    while stack:
        node = stack.pop()
        res.append(node.val)
        if node.left: stack.append(node.left)
        if node.right: stack.append(node.right)
    return res[::-1] # Reverse Root-Right-Left to get Left-Right-Root!

print("Postorder:", postorder_iterative(root)) # [2, 3, 1]`
          },
          pitfall: 'Attempting to calculate a bottom-up metric (like subtree sizes or tree height) in preorder: parent does not yet know child metrics! Use postorder.',
          quickCheck: {
            question: 'Which traversal is ideal for bottom-up algorithms where a parent node requires answers from both children before computing its own value?',
            options: ['Preorder', 'Inorder', 'Postorder', 'Level-order'],
            correctIndex: 2,
            explanation: 'Postorder processes left and right subtrees completely before evaluating the root, enabling bottom-up aggregation.'
          }
        },
        {
          id: 'dsa-w3-d15-t5',
          topicNumber: 5,
          title: 'Morris Traversal: O(1) Auxiliary Space Tree Traversal',
          explanation: [
            'Standard recursive and stack-based traversals consume $O(H)$ auxiliary memory for stack frames.',
            'Can we traverse a binary tree in $O(N)$ time with STRICTLY $O(1)$ auxiliary space without recursion or stacks?',
            'Yes! Morris Traversal uses **Threaded Binary Trees**:',
            '- For current node `curr`: if `curr.left` exists, find its Inorder Predecessor (rightmost node in left subtree).',
            '- If predecessor\'s `right` is None: establish temporary thread `pred.right = curr` and move `curr = curr.left`.',
            '- If predecessor\'s `right` is `curr`: thread already exists! Remove thread `pred.right = None`, process `curr`, and move `curr = curr.right`.'
          ],
          keyRules: [
            'Temporarily modifies tree leaf pointers, then restores them to original state before finishing.',
            'Strictly O(1) auxiliary space.'
          ],
          codeSnippet: {
            id: 'dsa-snip-15-5',
            title: 'Morris Inorder Traversal in O(1) Space',
            description: 'Threaded binary tree traversal without stack or recursion',
            language: 'python',
            code: `def morris_inorder(root: TreeNode) -> list[int]:
    res = []
    curr = root
    
    while curr:
        if not curr.left:
            res.append(curr.val)
            curr = curr.right
        else:
            # Find inorder predecessor
            pred = curr.left
            while pred.right and pred.right != curr:
                pred = pred.right
                
            if not pred.right:
                pred.right = curr # establish thread
                curr = curr.left
            else:
                pred.right = None # restore original tree structure
                res.append(curr.val)
                curr = curr.right
                
    return res

print("Morris Inorder:", morris_inorder(bst)) # [1, 2, 3]`
          },
          pitfall: 'Terminating Morris Traversal early upon finding a target: if you break out early without clearing active threads, the tree is left corrupted with cyclic pointer loops!',
          quickCheck: {
            question: 'What is the auxiliary space complexity of Morris Traversal?',
            options: ['O(N)', 'O(log N)', 'O(1)', 'O(H)'],
            correctIndex: 2,
            explanation: 'Morris Traversal utilizes empty right-child pointers of predecessor nodes to track the return path, requiring zero stack or recursive memory.'
          }
        },
        {
          id: 'dsa-w3-d15-t6',
          topicNumber: 6,
          title: 'Maximum Depth of Binary Tree',
          explanation: [
            'Problem: Find the maximum depth (height in nodes) of a binary tree.',
            'Recursive formulation (Divide and Conquer):',
            'Base case: if `root is None`, depth is 0.',
            'Recursive step: $\\text{max\\_depth} = 1 + \\max(\\text{depth}(\\text{root.left}), \\text{depth}(\\text{root.right}))$.',
            'Time: $O(N)$ visiting every node. Space: $O(H)$ for call stack.'
          ],
          keyRules: [
            'Depth of empty tree is 0.',
            'Depth of single root node is 1.'
          ],
          codeSnippet: {
            id: 'dsa-snip-15-6',
            title: 'Maximum Depth Calculation',
            description: 'Postorder divide and conquer depth calculation',
            language: 'python',
            code: `def max_depth(root: TreeNode) -> int:
    if not root: return 0
    left_h = max_depth(root.left)
    right_h = max_depth(root.right)
    return 1 + max(left_h, right_h)

# 1 -> left: 2, right: 3 -> left: 4
tree = TreeNode(1, TreeNode(2), TreeNode(3, TreeNode(4)))
print("Max Depth:", max_depth(tree)) # 3`
          },
          pitfall: 'Confusing maximum depth with minimum depth: minimum depth must find the closest LEAF node (if one child is None, you cannot simply take min(0, right)).',
          quickCheck: {
            question: 'What is the maximum recursion call stack depth for max_depth on a completely skewed linked-list-like binary tree of N nodes?',
            options: ['O(1)', 'O(log N)', 'O(N)', 'O(N^2)'],
            correctIndex: 2,
            explanation: 'In a degenerate tree where every node has only one child, the tree height is N, consuming N call stack frames.'
          }
        },
        {
          id: 'dsa-w3-d15-t7',
          topicNumber: 7,
          title: 'Diameter of Binary Tree (Longest Node-to-Node Path)',
          explanation: [
            'Problem: Find the length of the longest path between ANY two nodes in a tree (path does not necessarily pass through root).',
            'Length is the number of edges along the path.',
            'At every node `curr`, the longest path with `curr` as its turning peak is:',
            '$\\text{path\\_edges} = \\text{left\\_height} + \\text{right\\_height}$.',
            'While calculating tree height bottom-up, maintain a global maximum diameter.'
          ],
          keyRules: [
            'Height helper returns max height down one branch (1 + max(left, right)).',
            'Diameter updates with left + right at each node.'
          ],
          codeSnippet: {
            id: 'dsa-snip-15-7',
            title: 'Diameter of Binary Tree',
            description: 'Postorder height return with global diameter update',
            language: 'python',
            code: `def diameter_of_binary_tree(root: TreeNode) -> int:
    max_diameter = 0
    
    def get_height(node: TreeNode) -> int:
        nonlocal max_diameter
        if not node: return 0
        
        left_h = get_height(node.left)
        right_h = get_height(node.right)
        
        # Longest path turning at this node
        max_diameter = max(max_diameter, left_h + right_h)
        
        # Return height of this subtree to parent
        return 1 + max(left_h, right_h)
        
    get_height(root)
    return max_diameter

# 1 -> left: 2 (has children 4, 5), right: 3
d_tree = TreeNode(1, TreeNode(2, TreeNode(4), TreeNode(5)), TreeNode(3))
print("Tree Diameter:", diameter_of_binary_tree(d_tree)) # 3 (path 4 -> 2 -> 1 -> 3 or 4 -> 2 -> 5)`
          },
          pitfall: 'Returning `left_h + right_h` to parent: a parent can only extend a path down ONE of its branches, so the helper function must return `1 + max(left, right)`.',
          quickCheck: {
            question: 'Why does the helper function in diameter_of_binary_tree return `1 + max(left_h, right_h)` instead of `left_h + right_h`?',
            options: ['To avoid negative numbers', 'Because a path extending up to a parent can only continue down one child branch, not both', 'To count leaf nodes', 'Because Python requires it'],
            correctIndex: 1,
            explanation: 'A path cannot branch in two directions at the child node and also continue upward into the parent.'
          }
        },
        {
          id: 'dsa-w3-d15-t8',
          topicNumber: 8,
          title: 'Balanced Binary Tree Validation in O(N) Time',
          explanation: [
            'A binary tree is Height-Balanced if the depth of the two subtrees of every node never differs by more than 1.',
            'Naive approach calculates height for every node: $O(N^2)$ time.',
            'Optimal Postorder Bottom-Up approach in $O(N)$:',
            '- Helper function returns tree height if balanced, or `-1` if unbalanced.',
            '- If left or right subtree returns `-1`, or `abs(left_h - right_h) > 1`, immediately return `-1` to prune execution.',
            'Tree is balanced if `check_height(root) != -1`.'
          ],
          keyRules: [
            'Return -1 as error sentinel for early exit.',
            'Runs in single pass O(N) time.'
          ],
          codeSnippet: {
            id: 'dsa-snip-15-8',
            title: 'Height-Balanced Binary Tree Validation',
            description: 'O(N) bottom-up height verification with early pruning',
            language: 'python',
            code: `def is_balanced(root: TreeNode) -> bool:
    def check_height(node: TreeNode) -> int:
        if not node: return 0
        
        left_h = check_height(node.left)
        if left_h == -1: return -1 # left is unbalanced
        
        right_h = check_height(node.right)
        if right_h == -1: return -1 # right is unbalanced
        
        if abs(left_h - right_h) > 1:
            return -1 # current node is unbalanced
            
        return 1 + max(left_h, right_h)
        
    return check_height(root) != -1

print("Is tree balanced?", is_balanced(d_tree)) # True`
          },
          pitfall: 'Recalculating height from top down with `abs(height(node.left) - height(node.right)) > 1`: recalculating height at each level results in an O(N^2) algorithm.',
          quickCheck: {
            question: 'What is the time complexity of the optimal bottom-up Balanced Binary Tree check?',
            options: ['O(N^2)', 'O(N)', 'O(log N)', 'O(2^N)'],
            correctIndex: 1,
            explanation: 'Each node is visited once during the postorder traversal, propagating heights upward in O(N) linear time.'
          }
        }
      ]
    },
    {
      id: 'dsa-w3-d16',
      dayNumber: 16,
      weekNumber: 3,
      title: 'Breadth-First Search (BFS) & Level-Order Tree Problems',
      subtitle: 'Level-order traversal, Zigzag traversal, Right Side View & lowest common ancestor',
      durationMinutes: 70,
      overview:
        'Traverse trees horizontally level-by-level using Breadth-First Search (BFS). Master queue-based level freezing, alternating Zigzag traversal, visible node projections (Right Side View), and Lowest Common Ancestor (LCA) algorithms.',
      topics: [
        {
          id: 'dsa-w3-d16-t1',
          topicNumber: 1,
          title: 'Binary Tree Level Order Traversal (BFS Queue)',
          explanation: [
            'Problem: Return the level order traversal of a binary tree\'s values as a list of lists (e.g. `[[3], [9, 20], [15, 7]]`).',
            'Use a FIFO Queue (`collections.deque`):',
            '1. Push `root` to queue.',
            '2. While queue is not empty:',
            '   a. `level_size = len(queue)` (snapshot node count at current depth).',
            '   b. Pop `level_size` nodes, collect their values, and enqueue non-null children.',
            '   c. Append level values to result array.',
            'Runs in $O(N)$ time and $O(N)$ space.'
          ],
          keyRules: [
            'Freeze level_size at start of each outer loop iteration.',
            'Queue holds at most N/2 nodes at the widest tree level.'
          ],
          codeSnippet: {
            id: 'dsa-snip-16-1',
            title: 'Level Order Traversal',
            description: 'Standard BFS queue pattern for 2D level matrix',
            language: 'python',
            code: `from collections import deque

def level_order(root: TreeNode) -> list[list[int]]:
    if not root: return []
    res = []
    q = deque([root])
    
    while q:
        level_size = len(q)
        current_level = []
        for _ in range(level_size):
            node = q.popleft()
            current_level.append(node.val)
            if node.left: q.append(node.left)
            if node.right: q.append(node.right)
        res.append(current_level)
        
    return res

# Tree: 3 -> left: 9, right: 20 (children: 15, 7)
t = TreeNode(3, TreeNode(9), TreeNode(20, TreeNode(15), TreeNode(7)))
print("Level Order:", level_order(t)) # [[3], [9, 20], [15, 7]]`
          },
          pitfall: 'Omitting the `if not root: return []` check: enqueuing `None` yields `[[None]]` instead of an empty list `[]`.',
          quickCheck: {
            question: 'What is the maximum space occupied by the queue during level order traversal of a balanced binary tree with N nodes?',
            options: ['O(1)', 'O(log N)', 'O(N) (specifically ~N/2 at bottom leaf level)', 'O(N^2)'],
            correctIndex: 2,
            explanation: 'In a complete binary tree, the last leaf level contains approximately N/2 nodes, so the queue consumes O(N) memory at its peak.'
          }
        },
        {
          id: 'dsa-w3-d16-t2',
          topicNumber: 2,
          title: 'Binary Tree Zigzag Level Order Traversal',
          explanation: [
            'Problem: Return level order traversal in zigzag order (level 0 left-to-right, level 1 right-to-left, level 2 left-to-right, etc.).',
            'Implementation Options:',
            '1. Store current level values in a `deque`: if even level, append to right; if odd level, append to left (`appendleft`).',
            '2. Standard BFS + reverse odd-indexed levels: `if level % 2 == 1: current_level.reverse()`.',
            'Both run in $O(N)$ time with $O(N)$ space.'
          ],
          keyRules: [
            'Toggle a boolean flag `left_to_right = not left_to_right` at each level.',
            'Deque appendleft avoids O(K) reverse cost.'
          ],
          codeSnippet: {
            id: 'dsa-snip-16-2',
            title: 'Zigzag Level Order Traversal',
            description: 'Alternating left-to-right and right-to-left traversal',
            language: 'python',
            code: `from collections import deque

def zigzag_level_order(root: TreeNode) -> list[list[int]]:
    if not root: return []
    res = []
    q = deque([root])
    left_to_right = True
    
    while q:
        level_size = len(q)
        current_level = deque()
        for _ in range(level_size):
            node = q.popleft()
            if left_to_right:
                current_level.append(node.val)
            else:
                current_level.appendleft(node.val)
                
            if node.left: q.append(node.left)
            if node.right: q.append(node.right)
            
        res.append(list(current_level))
        left_to_right = not left_to_right
        
    return res

print("Zigzag:", zigzag_level_order(t)) # [[3], [20, 9], [15, 7]]`
          },
          pitfall: 'Reversing how children are enqueued into the BFS queue: queue children MUST ALWAYS be enqueued in left-to-right order to maintain level parentage; only the collected values are alternated!',
          quickCheck: {
            question: 'In Zigzag traversal, how should children be enqueued into the primary BFS queue?',
            options: ['Alternate left-right and right-left each level', 'Always left child first, then right child', 'Only right child', 'Randomly'],
            correctIndex: 1,
            explanation: 'The traversal queue must maintain consistent spatial ordering of nodes for the next level; only value insertion into current_level alternates.'
          }
        },
        {
          id: 'dsa-w3-d16-t3',
          topicNumber: 3,
          title: 'Binary Tree Right Side View (Projection Photography)',
          explanation: [
            'Problem: Imagine standing on the right side of a binary tree. Return values of nodes you can see ordered from top to bottom.',
            'BFS Approach: In level-order traversal, the RIGHTMOST node at each level is simply the LAST node processed in that level (`current_level[-1]`).',
            'DFS Approach: Traverse `Root -> Right -> Left`. If `current_depth == len(res)`, this is the first time reaching this depth, so record `node.val`!',
            'Both achieve $O(N)$ time.'
          ],
          keyRules: [
            'BFS: pick the last node of each level.',
            'DFS: visit right before left and record first node seen at each depth.'
          ],
          codeSnippet: {
            id: 'dsa-snip-16-3',
            title: 'Right Side View via BFS',
            description: 'Extracting rightmost node at every level',
            language: 'python',
            code: `from collections import deque

def right_side_view(root: TreeNode) -> list[int]:
    if not root: return []
    res = []
    q = deque([root])
    
    while q:
        level_size = len(q)
        for i in range(level_size):
            node = q.popleft()
            if i == level_size - 1: # last element in level!
                res.append(node.val)
            if node.left: q.append(node.left)
            if node.right: q.append(node.right)
            
    return res

# 1 -> left: 2 (has right: 5), right: 3 (has right: 4)
tree_proj = TreeNode(1, TreeNode(2, None, TreeNode(5)), TreeNode(3, None, TreeNode(4)))
print("Right Side View:", right_side_view(tree_proj)) # [1, 3, 4]`
          },
          pitfall: 'Assuming you only need to traverse down `node.right`: if the right subtree is shorter than the left subtree, lower nodes in the left subtree become visible from the right side!',
          quickCheck: {
            question: 'Why does simply following `curr = curr.right` fail for Right Side View?',
            options: ['Right pointers can be negative', 'If the left subtree is deeper than the right subtree, nodes in the left subtree will be visible from the right side at lower depths', 'Trees cannot have right pointers', 'It causes infinite loops'],
            correctIndex: 1,
            explanation: 'A left subtree with depth 5 alongside a right subtree with depth 2 exposes levels 3, 4, and 5 to the right side view.'
          }
        },
        {
          id: 'dsa-w3-d16-t4',
          topicNumber: 4,
          title: 'Lowest Common Ancestor (LCA) in a Binary Tree',
          explanation: [
            'The Lowest Common Ancestor of two nodes $P$ and $Q$ is the deepest node that has both $P$ and $Q$ as descendants (a node can be a descendant of itself).',
            'Postorder Recursive Algorithm:',
            '1. If `root is None` or `root == p` or `root == q`: return `root`.',
            '2. Recurse into left and right subtrees: `left = lca(root.left, p, q); right = lca(root.right, p, q);`.',
            '3. If both `left` and `right` are non-null: $P$ is in one subtree and $Q$ is in the other! Therefore, `root` IS the LCA!',
            '4. Otherwise, return the non-null child (`left or right`).'
          ],
          keyRules: [
            'If both left and right return non-null, root is the LCA.',
            'Runs in O(N) time with O(H) call stack space.'
          ],
          codeSnippet: {
            id: 'dsa-snip-16-4',
            title: 'Lowest Common Ancestor in Binary Tree',
            description: 'Postorder LCA discovery in O(N)',
            language: 'python',
            code: `def lowest_common_ancestor(root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:
    if not root or root == p or root == q:
        return root
        
    left = lowest_common_ancestor(root.left, p, q)
    right = lowest_common_ancestor(root.right, p, q)
    
    if left and right:
        return root # Both found in opposite subtrees
        
    return left if left else right

n4 = TreeNode(4); n5 = TreeNode(5)
n2 = TreeNode(2, n4, n5)
n3 = TreeNode(3)
root_lca = TreeNode(1, n2, n3)

ancestor = lowest_common_ancestor(root_lca, n4, n5)
print("LCA of 4 and 5:", ancestor.val) # 2`
          },
          pitfall: 'Assuming the tree is a Binary Search Tree: in an arbitrary Binary Tree, you cannot use value comparisons (< or >) to branch; you MUST use postorder search.',
          quickCheck: {
            question: 'What does it signify when both `left` and `right` recursive calls return non-null in lowest_common_ancestor?',
            options: ['The tree has a cycle', 'One target node is in the left subtree and the other is in the right subtree, making current root the LCA', 'Neither target node exists', 'The tree is empty'],
            correctIndex: 1,
            explanation: 'If both subtrees contain one of the target nodes, the current node is the lowest node where their paths diverge.'
          }
        },
        {
          id: 'dsa-w3-d16-t5',
          topicNumber: 5,
          title: 'Populating Next Right Pointers in Each Node (Level-Linked Tree)',
          explanation: [
            'Problem: Populate each node\'s `next` pointer to point to its next right node on the same level (like a linked list per level).',
            'Level Order with Queue costs $O(N)$ memory.',
            'O(1) Space Trick using previously established `next` pointers:',
            '- Use the parent level as a linked list to connect the child level!',
            '- `curr.left.next = curr.right`.',
            '- If `curr.next` exists: `curr.right.next = curr.next.left` (connecting across different subtrees!).',
            '- Advance `curr = curr.next` along the level, then drop down to next level.'
          ],
          keyRules: [
            'Parent level acts as the iterator for stitching the child level.',
            'Achieves O(1) auxiliary space without queues or recursion.'
          ],
          codeSnippet: {
            id: 'dsa-snip-16-5',
            title: 'Populating Next Right Pointers in O(1) Space',
            description: 'Parent-guided child stitching for complete binary tree',
            language: 'python',
            code: `class NodeNext:
    def __init__(self, val=0, left=None, right=None, next=None):
        self.val = val
        self.left = left
        self.right = right
        self.next = next

def connect_next_pointers(root: NodeNext) -> NodeNext:
    if not root: return root
    leftmost = root
    
    while leftmost.left: # While next level exists
        curr = leftmost
        while curr:
            # 1. Connect children of same parent
            curr.left.next = curr.right
            # 2. Connect across adjacent parent subtrees
            if curr.next:
                curr.right.next = curr.next.left
            curr = curr.next
        leftmost = leftmost.left
        
    return root`
          },
          pitfall: 'Connecting `curr.right.next = curr.next.left` without checking if `curr.next` exists: crashes on rightmost parent of each level.',
          quickCheck: {
            question: 'How does connect_next_pointers achieve O(1) auxiliary space?',
            options: ['By compressing node values', 'By utilizing the already-connected next pointers of the current level to traverse horizontally without a queue', 'By using DFS recursion', 'By sorting nodes'],
            correctIndex: 1,
            explanation: 'The current level is already a singly linked list via next pointers, so it functions as a queue with zero memory overhead.'
          }
        },
        {
          id: 'dsa-w3-d16-t6',
          topicNumber: 6,
          title: 'Path Sum I, II & III: Backtracking and Prefix Sums on Trees',
          explanation: [
            '- **Path Sum I**: Does any root-to-leaf path equal target? Divide and conquer: `has_path_sum(root.left, target - root.val) or has_path_sum(root.right, target - root.val)`.',
            '- **Path Sum II**: Return all root-to-leaf paths. Backtracking: append `node.val` to path, recurse, pop from path.',
            '- **Path Sum III**: Path does NOT need to start at root or end at leaf (must go downwards). Prefix Sum + Hash Map on Tree in $O(N)$! Store running prefix sums in hash map during DFS, and remove on backtrack.'
          ],
          keyRules: [
            'Root-to-leaf checks must verify is_leaf: `not node.left and not node.right`.',
            'Path Sum III: backtrack prefix counts `prefix_counts[curr_sum] -= 1` upon returning from subtree.'
          ],
          codeSnippet: {
            id: 'dsa-snip-16-6',
            title: 'Path Sum III via Prefix Sum Hash Map',
            description: 'O(N) downwards path counting using backtracking prefix map',
            language: 'python',
            code: `from collections import defaultdict

def path_sum_iii(root: TreeNode, target_sum: int) -> int:
    prefix_counts = defaultdict(int)
    prefix_counts[0] = 1
    total_paths = 0
    
    def dfs(node: TreeNode, curr_sum: int):
        nonlocal total_paths
        if not node: return
        
        curr_sum += node.val
        total_paths += prefix_counts[curr_sum - target_sum]
        
        prefix_counts[curr_sum] += 1
        dfs(node.left, curr_sum)
        dfs(node.right, curr_sum)
        prefix_counts[curr_sum] -= 1 # Backtrack!
        
    dfs(root, 0)
    return total_paths

# Tree: 10 -> left: 5 (has child 3), target = 8
p_tree = TreeNode(10, TreeNode(5, TreeNode(3)))
print("Paths with sum 8:", path_sum_iii(p_tree, 8)) # 1 (5 + 3)`
          },
          pitfall: 'Forgetting to backtrack `prefix_counts[curr_sum] -= 1`: counts from one branch would leak into parallel sibling branches, yielding inflated counts.',
          quickCheck: {
            question: 'Why must `prefix_counts[curr_sum] -= 1` be executed upon returning from a subtree in Path Sum III?',
            options: ['To free RAM memory', 'To ensure prefix sums from the left branch are not visible when searching the right sibling branch', 'To prevent negative sums', 'Because hash maps cannot store duplicate keys'],
            correctIndex: 1,
            explanation: 'Paths must only travel downwards; failing to remove the current node prefix sum would allow illegal zig-zag paths across sibling branches.'
          }
        },
        {
          id: 'dsa-w3-d16-t7',
          topicNumber: 7,
          title: 'Binary Tree Maximum Path Sum (LeetCode Hard)',
          explanation: [
            'Problem: Find the maximum path sum between ANY two nodes in a binary tree (can turn at any node; each node visited at most once).',
            'Node values can be NEGATIVE!',
            'At each node `curr` during postorder DFS:',
            '1. Calculate max branch gain from left child: `left_gain = max(0, dfs(curr.left))` (discard negative branches with `max(0, ...)`).',
            '2. Calculate max branch gain from right child: `right_gain = max(0, dfs(curr.right))`.',
            '3. Turning path through current node: `curr.val + left_gain + right_gain`. Update `global_max`.',
            '4. Return single branch gain to parent: `curr.val + max(left_gain, right_gain)`.'
          ],
          keyRules: [
            'Use max(0, gain) to ignore subtrees that reduce the total sum.',
            'Return to parent includes at most ONE child branch.'
          ],
          codeSnippet: {
            id: 'dsa-snip-16-7',
            title: 'Maximum Path Sum in Binary Tree',
            description: 'Postorder branch gain and peak path tracking in O(N)',
            language: 'python',
            code: `def max_path_sum(root: TreeNode) -> int:
    max_sum = float('-inf')
    
    def gain_from_subtree(node: TreeNode) -> int:
        nonlocal max_sum
        if not node: return 0
        
        # Discard subtrees that yield negative gains
        left_gain = max(0, gain_from_subtree(node.left))
        right_gain = max(0, gain_from_subtree(node.right))
        
        # Max path turning at current node
        current_path_sum = node.val + left_gain + right_gain
        max_sum = max(max_sum, current_path_sum)
        
        # Return maximum contribution to parent (only 1 branch allowed!)
        return node.val + max(left_gain, right_gain)
        
    gain_from_subtree(root)
    return max_sum

# Tree: -10 -> left: 9, right: 20 (children: 15, 7)
hard_tree = TreeNode(-10, TreeNode(9), TreeNode(20, TreeNode(15), TreeNode(7)))
print("Max Path Sum:", max_path_sum(hard_tree)) # 42 (15 + 20 + 7)`
          },
          pitfall: 'Initializing `max_sum = 0`: if all nodes in the tree are negative (e.g. `[-3]`), the answer is -3, but initializing to 0 returns 0 incorrectly.',
          quickCheck: {
            question: 'Why does max_path_sum wrap child gains in `max(0, ...)`?',
            options: ['To ensure integer types', 'Because if a child subtree has a negative net sum, we can simply omit that branch from the path', 'To handle None nodes', 'Because tree heights are positive'],
            correctIndex: 1,
            explanation: 'If extending the path down a child subtree produces a negative sum, including it would only decrease the total, so we choose not to extend into it (gain 0).'
          }
        },
        {
          id: 'dsa-w3-d16-t8',
          topicNumber: 8,
          title: 'Serialize and Deserialize Binary Tree (Codec Architecture)',
          explanation: [
            'Design an algorithm to serialize a binary tree into a string and deserialize that string back into the original tree structure.',
            'Serialization (Preorder with Sentinels):',
            '- Traverse `Root -> Left -> Right`.',
            '- If node is None, append sentinel `"#"`.',
            '- Output: `"1,2,#,#,3,4,#,#,5,#,#"`',
            'Deserialization:',
            '- Split string by comma into an iterator/queue.',
            '- Recursively pop next value: if `"#"`, return `None`. Else create `TreeNode(val)` and recurse for left and right!'
          ],
          keyRules: [
            'Sentinels for None eliminate all structural ambiguity.',
            'Preorder traversal guarantees root is always the first token.'
          ],
          codeSnippet: {
            id: 'dsa-snip-16-8',
            title: 'Serialize and Deserialize Binary Tree',
            description: 'Preorder serialization with sentinel null tokens',
            language: 'python',
            code: `class Codec:
    def serialize(self, root: TreeNode) -> str:
        vals = []
        def dfs(node):
            if not node:
                vals.append("#")
                return
            vals.append(str(node.val))
            dfs(node.left)
            dfs(node.right)
        dfs(root)
        return ",".join(vals)
        
    def deserialize(self, data: str) -> TreeNode:
        tokens = iter(data.split(","))
        def build():
            val = next(tokens)
            if val == "#": return None
            node = TreeNode(int(val))
            node.left = build()
            node.right = build()
            return node
        return build()

codec = Codec()
serialized = codec.serialize(hard_tree)
print("Serialized Tree:", serialized)
deserialized = codec.deserialize(serialized)
print("Deserialized Root Value:", deserialized.val) # -10`
          },
          pitfall: 'Attempting to serialize without None sentinels: without sentinels, an Inorder traversal sequence is also required to reconstruct the tree; with sentinels, Preorder alone suffices.',
          quickCheck: {
            question: 'Why does Preorder serialization with null sentinels ("#") unambiguously reconstruct the tree without needing Inorder data?',
            options: ['Because trees are sorted', 'Null sentinels explicitly record where subtrees terminate, removing all structural ambiguity', 'Because commas encode tree depth', 'It works on full trees only'],
            correctIndex: 1,
            explanation: 'In standard traversals, two different tree structures can yield identical preorder outputs. Marking null leaf ends ensures a 1-to-1 unique mapping.'
          }
        }
      ]
    },
    {
      id: 'dsa-w3-d17',
      dayNumber: 17,
      weekNumber: 3,
      title: 'Binary Search Trees (BST): Invariants, Search & Mutations',
      subtitle: 'BST property, logarithmic search, node insertion, node deletion with successor & range validation',
      durationMinutes: 70,
      overview:
        'Master the Binary Search Tree (BST) invariant: all left descendant keys < node key < all right descendant keys. Explore O(H) logarithmic search and insertion, three-case node deletion with in-order successors, BST range validation, and Kth smallest element.',
      topics: [
        {
          id: 'dsa-w3-d17-t1',
          topicNumber: 1,
          title: 'The BST Invariant & O(H) Search',
          explanation: [
            'A Binary Search Tree (BST) enforces the ordering invariant for EVERY node $X$:',
            '- All keys in $X$\'s left subtree are STRICTLY LESS than $X.val$.',
            '- All keys in $X$\'s right subtree are STRICTLY GREATER than $X.val$.',
            'Searching in a BST:',
            '- If `target == curr.val`: found!',
            '- If `target < curr.val`: branch left (`curr = curr.left`).',
            '- If `target > curr.val`: branch right (`curr = curr.right`).',
            'Time: $O(H)$ where $H$ is height ($O(\\log N)$ balanced, $O(N)$ skewed).'
          ],
          keyRules: [
            'The invariant applies to ALL nodes in the subtrees, not just immediate children!',
            'Average search is O(log N).'
          ],
          codeSnippet: {
            id: 'dsa-snip-17-1',
            title: 'Iterative BST Search',
            description: 'Logarithmic search branching left or right',
            language: 'python',
            code: `def search_bst(root: TreeNode, val: int) -> TreeNode:
    curr = root
    while curr:
        if curr.val == val:
            return curr
        elif val < curr.val:
            curr = curr.left
        else:
            curr = curr.right
    return None

# BST: 4 -> left: 2 (has 1, 3), right: 7
bst_root = TreeNode(4, TreeNode(2, TreeNode(1), TreeNode(3)), TreeNode(7))
found = search_bst(bst_root, 3)
print("Found node value:", found.val if found else "None") # 3`
          },
          pitfall: 'Believing BST search is ALWAYS O(log N): if elements are inserted in sorted order `1, 2, 3, 4`, the tree becomes a skewed linked list with height N, degrading search to O(N). Balanced trees (AVL/Red-Black) fix this.',
          quickCheck: {
            question: 'What is the worst-case time complexity of searching for a key in an un-balanced Binary Search Tree with N nodes?',
            options: ['O(1)', 'O(log N)', 'O(N)', 'O(N^2)'],
            correctIndex: 2,
            explanation: 'If keys were inserted in ascending order, the BST degenerates into a single long chain (height N), making search O(N).'
          }
        },
        {
          id: 'dsa-w3-d17-t2',
          topicNumber: 2,
          title: 'Validate Binary Search Tree (Range Constraint Propagation)',
          explanation: [
            'Problem: Determine if a given binary tree is a valid BST.',
            'Common Mistake: Checking only immediate children (`node.left.val < node.val < node.right.val`). This fails if a right grandchild is smaller than the grandparent!',
            'Correct Approach: Propagate valid numerical range `(min_val, max_val)` down the tree:',
            '- Root must satisfy $(-\\infty, +\\infty)$.',
            '- When branching left: update range to `(min_val, curr.val)`.',
            '- When branching right: update range to `(curr.val, max_val)`.',
            'Alternatively: Inorder traversal must be STRICTLY MONOTONICALLY INCREASING.'
          ],
          keyRules: [
            'Every node must satisfy min_val < node.val < max_val.',
            'Duplicate values violate strict BST invariant (< and >).'
          ],
          codeSnippet: {
            id: 'dsa-snip-17-2',
            title: 'Validate BST via Range Constraints',
            description: 'Propagating lower and upper bounds during DFS',
            language: 'python',
            code: `def is_valid_bst(root: TreeNode) -> bool:
    def validate(node: TreeNode, low=float('-inf'), high=float('inf')) -> bool:
        if not node: return True
        if not (low < node.val < high):
            return False
            
        # Left subtree must be < node.val; Right subtree must be > node.val
        return validate(node.left, low, node.val) and validate(node.right, node.val, high)
        
    return validate(root)

# Invalid BST: 5 -> left: 1, right: 4 (has children 3, 6 where 3 < 5!)
invalid = TreeNode(5, TreeNode(1), TreeNode(4, TreeNode(3), TreeNode(6)))
print("Is valid BST?", is_valid_bst(invalid)) # False`
          },
          pitfall: 'Checking only `if node.left and node.left.val >= node.val`: this passes trees where a right descendant violates grandparent bounds.',
          quickCheck: {
            question: 'Why does checking `node.left.val < node.val < node.right.val` locally fail to validate a BST?',
            options: ['Because it is slow', 'It fails to detect violations where a deep descendant violates an ancestor constraint higher up the tree', 'Because left can be None', 'It causes syntax errors'],
            correctIndex: 1,
            explanation: 'A node deep in the right subtree might be smaller than the root; local checks only examine immediate children, missing global violations.'
          }
        },
        {
          id: 'dsa-w3-d17-t3',
          topicNumber: 3,
          title: 'Insert into a Binary Search Tree',
          explanation: [
            'Insertion in a BST is deterministic: the new key has a unique leaf slot that maintains the invariant.',
            'Algorithm:',
            '- Start at `root`.',
            '- If `val < curr.val`: if `curr.left` is None, attach `curr.left = TreeNode(val)`. Else `curr = curr.left`.',
            '- If `val > curr.val`: if `curr.right` is None, attach `curr.right = TreeNode(val)`. Else `curr = curr.right`.',
            'Runs in $O(H)$ time and $O(1)$ space iterative.'
          ],
          keyRules: [
            'Iterative insertion uses O(1) auxiliary memory.',
            'New keys are always inserted as new leaf nodes.'
          ],
          codeSnippet: {
            id: 'dsa-snip-17-3',
            title: 'Iterative BST Insertion',
            description: 'O(H) search and leaf attachment',
            language: 'python',
            code: `def insert_into_bst(root: TreeNode, val: int) -> TreeNode:
    if not root: return TreeNode(val)
    curr = root
    
    while True:
        if val < curr.val:
            if not curr.left:
                curr.left = TreeNode(val)
                break
            curr = curr.left
        else:
            if not curr.right:
                curr.right = TreeNode(val)
                break
            curr = curr.right
            
    return root

r = insert_into_bst(None, 5)
insert_into_bst(r, 3)
insert_into_bst(r, 7)
print("Root:", r.val, "Left:", r.left.val, "Right:", r.right.val)`
          },
          pitfall: 'Forgetting to handle `root is None`: must return `TreeNode(val)` as the new root when inserting into an empty tree.',
          quickCheck: {
            question: 'Where are new keys placed during standard BST insertion?',
            options: ['Always as the new root', 'As a new leaf node at the position where the search terminated', 'At the middle level', 'In the left subtree always'],
            correctIndex: 1,
            explanation: 'Following the BST search path to a null pointer identifies the exact leaf location where the new key belongs.'
          }
        },
        {
          id: 'dsa-w3-d17-t4',
          topicNumber: 4,
          title: 'Delete Node in a BST (The Three Deletion Cases)',
          explanation: [
            'Deleting a key from a BST requires handling three distinct topological cases:',
            '- **Case 1 (Leaf Node)**: 0 children. Simply remove the node (`return None`).',
            '- **Case 2 (One Child)**: 1 child. Replace the node with its non-null child (`return node.left or node.right`).',
            '- **Case 3 (Two Children)**: Find the Inorder Successor (the smallest node in the right subtree: leftmost child of `node.right`).',
            '  Copy the successor\'s value into the current node, then recursively delete the successor from the right subtree!'
          ],
          keyRules: [
            'Inorder successor is the minimum node of the right subtree: leftmost descendant.',
            'Case 3 reduces to deleting a node with at most one child.'
          ],
          codeSnippet: {
            id: 'dsa-snip-17-4',
            title: 'Delete Node in BST',
            description: 'Three-case deletion using inorder successor replacement',
            language: 'python',
            code: `def delete_node_bst(root: TreeNode, key: int) -> TreeNode:
    if not root: return None
    
    if key < root.val:
        root.left = delete_node_bst(root.left, key)
    elif key > root.val:
        root.right = delete_node_bst(root.right, key)
    else:
        # Node to delete found!
        if not root.left: return root.right # Case 1 & 2
        if not root.right: return root.left # Case 2
        
        # Case 3: Two children -> find inorder successor (min in right subtree)
        successor = root.right
        while successor.left:
            successor = successor.left
            
        root.val = successor.val # replace value
        # Delete successor from right subtree
        root.right = delete_node_bst(root.right, successor.val)
        
    return root

# Delete 2 from bst_root (has children 1 and 3)
new_tree = delete_node_bst(bst_root, 2)
print("After deleting 2, root.left val:", new_tree.left.val) # 3 (successor replaced!)`
          },
          pitfall: 'Hard-deleting a node with two children by re-attaching its entire left subtree under the successor: this increases tree height unnecessarily and unbalances the tree.',
          quickCheck: {
            question: 'What is the Inorder Successor of a node with two children in a BST?',
            options: ['The root node', 'The minimum (leftmost) node in its right subtree', 'The maximum node in its left subtree', 'Its parent node'],
            correctIndex: 1,
            explanation: 'The inorder successor is the smallest value greater than the target node, found by going right once, then left as far as possible.'
          }
        },
        {
          id: 'dsa-w3-d17-t5',
          topicNumber: 5,
          title: 'Kth Smallest Element in a BST',
          explanation: [
            'Problem: Given a BST, find the $K$-th smallest element ($1$-indexed).',
            'Because Inorder Traversal visits nodes in strictly ascending sorted order, the $K$-th node visited during Inorder traversal IS the $K$-th smallest element!',
            'Iterative approach with explicit stack:',
            '- Drive left onto stack.',
            '- Pop node, decrement $K$. When $K == 0$, return `node.val` immediately.',
            '- Move to `node.right`.',
            'Time: $O(H + K)$ early exit without traversing the entire tree!'
          ],
          keyRules: [
            'Early exit when K == 0 avoids full tree traversal.',
            'Runs in O(H + K) time and O(H) space.'
          ],
          codeSnippet: {
            id: 'dsa-snip-17-5',
            title: 'Kth Smallest Element via Inorder Stack',
            description: 'Early-exit iterative inorder traversal',
            language: 'python',
            code: `def kth_smallest(root: TreeNode, k: int) -> int:
    stack = []
    curr = root
    
    while curr or stack:
        while curr:
            stack.append(curr)
            curr = curr.left
            
        curr = stack.pop()
        k -= 1
        if k == 0:
            return curr.val # Kth smallest found!
            
        curr = curr.right
        
    return -1

# BST: 3 -> left: 1 (has right: 2), right: 4
b3 = TreeNode(3, TreeNode(1, None, TreeNode(2)), TreeNode(4))
print("1st smallest:", kth_smallest(b3, 1)) # 1
print("2nd smallest:", kth_smallest(b3, 2)) # 2`
          },
          pitfall: 'Dumping all node values into an array with full traversal and then indexing `arr[k-1]`: wastes O(N) space and time when K=1.',
          quickCheck: {
            question: 'What is the best-case time complexity to find the 1st smallest element in a BST of N nodes using iterative inorder stack?',
            options: ['O(N)', 'O(H) where H is tree height', 'O(N log N)', 'O(N^2)'],
            correctIndex: 1,
            explanation: 'The 1st smallest element is the leftmost node in the tree; navigating down the left spine takes O(H) steps, stopping immediately.'
          }
        },
        {
          id: 'dsa-w3-d17-t6',
          topicNumber: 6,
          title: 'Lowest Common Ancestor in a BST (Exploiting Order)',
          explanation: [
            'In a general Binary Tree, LCA takes $O(N)$ because you must search both subtrees.',
            'In a Binary Search Tree, we can exploit the BST ordering invariant to find the LCA in $O(H)$ time and $O(1)$ space!',
            '- If both `p.val` and `q.val` are strictly less than `root.val`: LCA MUST be in the left subtree (`root = root.left`).',
            '- If both `p.val` and `q.val` are strictly greater than `root.val`: LCA MUST be in the right subtree (`root = root.right`).',
            '- Otherwise: `root` is the split point where $P$ and $Q$ diverge (or root equals $P$ or $Q$). Therefore, `root` IS the LCA!'
          ],
          keyRules: [
            'Split point is the LCA: p.val <= root.val <= q.val (or vice versa).',
            'O(H) time and strictly O(1) space iterative.'
          ],
          codeSnippet: {
            id: 'dsa-snip-17-6',
            title: 'LCA in Binary Search Tree',
            description: 'O(H) time and O(1) space split-point discovery',
            language: 'python',
            code: `def lca_bst(root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:
    curr = root
    while curr:
        if p.val < curr.val and q.val < curr.val:
            curr = curr.left  # both in left subtree
        elif p.val > curr.val and q.val > curr.val:
            curr = curr.right # both in right subtree
        else:
            return curr       # split point: this is the LCA!
    return None

# BST: 6 -> left: 2 (children 0, 4), right: 8
t_lca = TreeNode(6, TreeNode(2, TreeNode(0), TreeNode(4)), TreeNode(8))
print("LCA of 2 and 8 in BST:", lca_bst(t_lca, TreeNode(2), TreeNode(8)).val) # 6`
          },
          pitfall: 'Recursing into both subtrees: unnecessary in a BST! You only branch in ONE direction at each step.',
          quickCheck: {
            question: 'What identifies the Lowest Common Ancestor of p and q in a BST?',
            options: ['The root node always', 'The first node whose value falls between p.val and q.val (the split point)', 'The leaf node', 'The node with maximum depth'],
            correctIndex: 1,
            explanation: 'The moment p and q lie on opposite sides of a node (one < curr.val and one > curr.val), that node is their unique lowest common ancestor.'
          }
        },
        {
          id: 'dsa-w3-d17-t7',
          topicNumber: 7,
          title: 'Convert Sorted Array to Binary Search Tree (Height-Balanced)',
          explanation: [
            'Problem: Given an integer array `nums` sorted in ascending order, convert it to a height-balanced BST.',
            'Divide and Conquer:',
            'To ensure the tree is perfectly balanced, the MIDDLE element of the array must be chosen as the `root`!',
            '- `mid = (left + right) // 2`.',
            '- `root = TreeNode(nums[mid])`.',
            '- `root.left = build(left, mid - 1)`.',
            '- `root.right = build(mid + 1, right)`.',
            'Time: $O(N)$ visiting each element once. Tree height is guaranteed $\\lfloor\\log_2 N\\rfloor$.'
          ],
          keyRules: [
            'Middle element is chosen as root to split elements equally (N/2 left, N/2 right).',
            'Pass indices (left, right) rather than slicing arrays to save O(N) copy memory.'
          ],
          codeSnippet: {
            id: 'dsa-snip-17-7',
            title: 'Sorted Array to Balanced BST',
            description: 'Recursive midpoint partitioning in O(N)',
            language: 'python',
            code: `def sorted_array_to_bst(nums: list[int]) -> TreeNode:
    def build(left: int, right: int) -> TreeNode:
        if left > right: return None
        mid = left + (right - left) // 2
        node = TreeNode(nums[mid])
        node.left = build(left, mid - 1)
        node.right = build(mid + 1, right)
        return node
        
    return build(0, len(nums) - 1)

balanced_tree = sorted_array_to_bst([-10, -3, 0, 5, 9])
print("Root of balanced BST:", balanced_tree.val) # 0`
          },
          pitfall: 'Slicing the array `build(nums[:mid])`: slicing creates new array copies at every recursive call, increasing total time to O(N log N) and space to O(N log N). Pass indices instead.',
          quickCheck: {
            question: 'Why does choosing the midpoint of a sorted array as the root guarantee a balanced BST?',
            options: ['Because mid is an integer', 'It guarantees that the number of elements in the left subtree and right subtree differ by at most 1', 'To sort the array', 'Because the array length is even'],
            correctIndex: 1,
            explanation: 'Selecting the middle element divides the remaining elements into two equal halves of size N/2, ensuring equal tree heights.'
          }
        },
        {
          id: 'dsa-w3-d17-t8',
          topicNumber: 8,
          title: 'Construct Binary Tree from Preorder and Inorder Traversal',
          explanation: [
            'Given preorder and inorder traversals, reconstruct the unique binary tree.',
            'Key Insights:',
            '1. `preorder[0]` is ALWAYS the root of the tree!',
            '2. Find the root\'s index in `inorder`: elements to the left belong to the LEFT subtree; elements to the right belong to the RIGHT subtree!',
            '3. Precompute `inorder` value-to-index mapping in a Hash Map for $O(1)$ index lookups.',
            'Total Time: $O(N)$ with $O(N)$ space.'
          ],
          keyRules: [
            'Use a hash map for inorder indices to eliminate O(N) searches.',
            'Track boundaries with left and right indices.'
          ],
          codeSnippet: {
            id: 'dsa-snip-17-8',
            title: 'Construct Tree from Preorder and Inorder',
            description: 'Hash-map accelerated tree reconstruction in O(N)',
            language: 'python',
            code: `def build_tree(preorder: list[int], inorder: list[int]) -> TreeNode:
    in_map = {val: i for i, val in enumerate(inorder)}
    pre_idx = 0
    
    def helper(in_left: int, in_right: int) -> TreeNode:
        nonlocal pre_idx
        if in_left > in_right: return None
        
        root_val = preorder[pre_idx]
        pre_idx += 1
        root = TreeNode(root_val)
        
        mid = in_map[root_val]
        # Must build left subtree first because preorder is Root -> Left -> Right!
        root.left = helper(in_left, mid - 1)
        root.right = helper(mid + 1, in_right)
        return root
        
    return helper(0, len(inorder) - 1)

rebuilt = build_tree([3, 9, 20, 15, 7], [9, 3, 15, 20, 7])
print("Rebuilt tree root:", rebuilt.val) # 3`
          },
          pitfall: 'Calling `root.right` before `root.left`: `pre_idx` advances in preorder sequence (Root, Left, Right), so `root.left` MUST be built first.',
          quickCheck: {
            question: 'Why must `root.left` be constructed before `root.right` when reconstructing from preorder traversal?',
            options: ['Left subtrees are smaller', 'Because preorder traversal visits the left subtree immediately after the root, so pre_idx points to left subtree elements next', 'To sort the tree', 'Because inorder is sorted'],
            correctIndex: 1,
            explanation: 'The preorder sequence places all nodes of the left subtree before any nodes of the right subtree.'
          }
        }
      ]
    },
    {
      id: 'dsa-w3-d18',
      dayNumber: 18,
      weekNumber: 3,
      title: 'Balanced BSTs: AVL Trees & Red-Black Tree Mechanics',
      subtitle: 'Tree balance factors, Left/Right rotations, double rotations LL/RR/LR/RL & Red-Black tree invariants',
      durationMinutes: 75,
      overview:
        'Eliminate the O(N) worst-case degeneracy of unbalanced BSTs. Master self-balancing binary search trees: AVL Tree Balance Factors, Single Rotations (Left/Right), Double Rotations (LR/RL), and the five architectural invariants of Red-Black Trees powering production standard libraries.',
      topics: [
        {
          id: 'dsa-w3-d18-t1',
          topicNumber: 1,
          title: 'The Degeneracy Problem & Self-Balancing Rationale',
          explanation: [
            'An un-balanced BST degrades to $O(N)$ when keys are inserted in sequential order.',
            'A Self-Balancing BST automatically performs local transformations during insertion and deletion to keep tree height bounded by $O(\\log N)$.',
            'Two industry standards:',
            '- **AVL Trees**: Strictly balanced (balance factor $\\in \\{-1, 0, +1\\}$). Faster lookups; slower insertions/deletions due to frequent rotations.',
            '- **Red-Black Trees**: More relaxed balance (height $\\le 2 \\log_2(N + 1)$). Fewer rotations on insertion/deletion; powers `std::map`, `std::set`, and Linux kernel VM maps.'
          ],
          keyRules: [
            'Guarantees worst-case O(log N) for search, insert, and delete.',
            'Local restructuring is achieved via Tree Rotations.'
          ],
          codeSnippet: {
            id: 'dsa-snip-18-1',
            title: 'Height Comparison: Unbalanced vs Balanced',
            description: 'Demonstrating tree height explosion without rebalancing',
            language: 'python',
            code: `import math

N = 1_000_000
unbalanced_height = N
balanced_height = math.ceil(math.log2(N))
print(f"For N = 1,000,000 nodes:")
print(f"Unbalanced BST Height: {unbalanced_height:,} steps (Fatal!)")
print(f"Balanced BST Height:   {balanced_height} steps (Instantaneous!)")`
          },
          pitfall: 'Assuming tree rotations change the in-order traversal: rotations are specifically designed to preserve the exact BST in-order sorted invariant while altering tree height.',
          quickCheck: {
            question: 'What is the primary guarantee of a self-balancing binary search tree?',
            options: ['All node values are positive', 'Tree height is strictly bounded by O(log N), preventing degenerate O(N) operations', 'Nodes have 3 children', 'Keys are compressed'],
            correctIndex: 1,
            explanation: 'Self-balancing trees maintain logarithmic height bounds through rotations, ensuring search, insert, and delete remain O(log N) in the worst case.'
          }
        },
        {
          id: 'dsa-w3-d18-t2',
          topicNumber: 2,
          title: 'Tree Rotations: Left Rotation & Right Rotation',
          explanation: [
            'A Tree Rotation is an $O(1)$ local pointer manipulation that changes tree height while preserving the Inorder traversal invariant.',
            '- **Right Rotation** on node $Y$ (with left child $X$):',
            '  $X$ becomes the new parent. $Y$ becomes $X$\'s right child. $X$\'s former right child $T_2$ becomes $Y$\'s left child.',
            '- **Left Rotation** on node $X$ (with right child $Y$):',
            '  $Y$ becomes the new parent. $X$ becomes $Y$\'s left child. $Y$\'s former left child $T_2$ becomes $X$\'s right child.'
          ],
          keyRules: [
            'Rotations take strictly O(1) time and require only 3 pointer updates.',
            'Inorder sequence (A < X < B < Y < C) is identical before and after rotation.'
          ],
          codeSnippet: {
            id: 'dsa-snip-18-2',
            title: 'Right and Left Rotation Implementations',
            description: 'O(1) pointer rotations preserving BST invariant',
            language: 'python',
            code: `class AVLNode:
    def __init__(self, val=0):
        self.val = val
        self.left = None
        self.right = None
        self.height = 1

def right_rotate(y: AVLNode) -> AVLNode:
    x = y.left
    T2 = x.right
    # Perform rotation
    x.right = y
    y.left = T2
    # Update heights
    y.height = 1 + max(get_h(y.left), get_h(y.right))
    x.height = 1 + max(get_h(x.left), get_h(x.right))
    return x # new root

def left_rotate(x: AVLNode) -> AVLNode:
    y = x.right
    T2 = y.left
    # Perform rotation
    y.left = x
    x.right = T2
    # Update heights
    x.height = 1 + max(get_h(x.left), get_h(x.right))
    y.height = 1 + max(get_h(y.left), get_h(y.right))
    return y # new root

def get_h(node) -> int: return node.height if node else 0`
          },
          pitfall: 'Updating node heights in wrong order: y becomes a child of x after right rotation, so y\'s height MUST be recalculated before x\'s height.',
          quickCheck: {
            question: 'What is the time complexity of a tree rotation operation?',
            options: ['O(N)', 'O(log N)', 'O(1)', 'O(H)'],
            correctIndex: 2,
            explanation: 'Rotations alter a constant number of pointer references (parent and child links), executing in strictly O(1) time.'
          }
        },
        {
          id: 'dsa-w3-d18-t3',
          topicNumber: 3,
          title: 'AVL Tree: Balance Factor & The 4 Rotation Cases',
          explanation: [
            'In an AVL tree, every node defines $\\text{Balance Factor} = \\text{height}(\\text{left}) - \\text{height}(\\text{right})$.',
            'Invariant: Balance Factor MUST be $\\in \\{-1, 0, +1\\}$.',
            'When an insertion causes $|BF| > 1$, four rotation cases restore balance:',
            '1. **Left-Left (LL)**: $BF > 1$ and `key < node.left.val` -> Single Right Rotate(`node`).',
            '2. **Right-Right (RR)**: $BF < -1$ and `key > node.right.val` -> Single Left Rotate(`node`).',
            '3. **Left-Right (LR)**: $BF > 1$ and `key > node.left.val` -> Left Rotate(`node.left`), then Right Rotate(`node`).',
            '4. **Right-Left (RL)**: $BF < -1$ and `key < node.right.val` -> Right Rotate(`node.right`), then Left Rotate(`node`).'
          ],
          keyRules: [
            'Outer imbalances (LL / RR) require 1 single rotation.',
            'Inner dogleg imbalances (LR / RL) require 2 double rotations.'
          ],
          codeSnippet: {
            id: 'dsa-snip-18-3',
            title: 'AVL Tree Rebalance Dispatcher',
            description: 'Selecting from the 4 rotation cases based on balance factor',
            language: 'python',
            code: `def get_balance(node: AVLNode) -> int:
    return get_h(node.left) - get_h(node.right) if node else 0

def rebalance_avl(node: AVLNode, key: int) -> AVLNode:
    bf = get_balance(node)
    
    # 1. Left-Left Case
    if bf > 1 and key < node.left.val:
        return right_rotate(node)
    # 2. Right-Right Case
    if bf < -1 and key > node.right.val:
        return left_rotate(node)
    # 3. Left-Right Case
    if bf > 1 and key > node.left.val:
        node.left = left_rotate(node.left)
        return right_rotate(node)
    # 4. Right-Left Case
    if bf < -1 and key < node.right.val:
        node.right = right_rotate(node.right)
        return left_rotate(node)
        
    return node`
          },
          pitfall: 'Performing a single rotation for an inner dogleg (LR): single rotation on an LR imbalance leaves the tree unbalanced! Must left-rotate child first to transform into LL, then right-rotate parent.',
          quickCheck: {
            question: 'What sequence of rotations resolves a Left-Right (LR) imbalance in an AVL tree?',
            options: ['Single Left Rotation', 'Left Rotate the left child, then Right Rotate the node', 'Single Right Rotation', 'Two Right Rotations'],
            correctIndex: 1,
            explanation: 'An LR dogleg is straightened into an LL line by left-rotating the left child, followed by a right rotation on the unbalanced parent.'
          }
        },
        {
          id: 'dsa-w3-d18-t4',
          topicNumber: 4,
          title: 'Complete AVL Tree Insertion Implementation',
          explanation: [
            'Assemble the full recursive AVL insertion algorithm:',
            '1. Perform standard BST recursive insertion.',
            '2. Update height of current ancestor node: `1 + max(left_h, right_h)`.',
            '3. Compute balance factor `get_balance(node)`.',
            '4. If unbalanced, apply the appropriate rotation and return the new subtree root.',
            'Guarantees height is strictly bounded by $1.44 \\log_2 N$.'
          ],
          keyRules: [
            'Rebalancing unwinds along the recursion call stack from leaf to root.',
            'At most ONE rotation (or double rotation) is needed per insertion.'
          ],
          codeSnippet: {
            id: 'dsa-snip-18-4',
            title: 'Complete AVL Tree Insertion',
            description: 'Self-balancing AVL insertion with automatic rotations',
            language: 'python',
            code: `def insert_avl(root: AVLNode, key: int) -> AVLNode:
    # 1. Standard BST insertion
    if not root: return AVLNode(key)
    if key < root.val:
        root.left = insert_avl(root.left, key)
    elif key > root.val:
        root.right = insert_avl(root.right, key)
    else:
        return root # duplicate keys ignored
        
    # 2. Update height
    root.height = 1 + max(get_h(root.left), get_h(root.right))
    
    # 3 & 4. Rebalance
    return rebalance_avl(root, key)

avl = None
for x in [10, 20, 30, 40, 50, 25]:
    avl = insert_avl(avl, x)
print("AVL Root after balancing:", avl.val) # 30 (Self-balanced!)`
          },
          pitfall: 'Forgetting to return the rotated root up the recursion stack: if you do `right_rotate(root)` without reassigning `root = right_rotate(root)`, parent pointers remain attached to the old unrotated root.',
          quickCheck: {
            question: 'What is the maximum number of rotations required to rebalance an AVL tree after an insertion?',
            options: ['1 single or double rotation', 'O(log N) rotations', 'O(N) rotations', '0 rotations'],
            correctIndex: 0,
            explanation: 'A single rotation or double rotation at the lowest unbalanced ancestor completely restores the AVL invariant for the entire tree.'
          }
        },
        {
          id: 'dsa-w3-d18-t5',
          topicNumber: 5,
          title: 'Red-Black Tree: The Five Architectural Invariants',
          explanation: [
            'A Red-Black Tree is a self-balancing BST where each node stores a color bit (`RED` or `BLACK`).',
            'The 5 Invariants:',
            '1. Every node is either RED or BLACK.',
            '2. The root is ALWAYS BLACK.',
            '3. Every leaf (NIL null pointer) is considered BLACK.',
            '4. If a node is RED, both its children MUST BE BLACK (No two consecutive RED nodes!).',
            '5. Every path from a node to any of its descendant NIL leaves contains the EXACT SAME NUMBER of black nodes ("Black-Height").'
          ],
          keyRules: [
            'Invariant 4 & 5 mathematically guarantee that the longest path (alternating red-black) is at most twice the length of the shortest path (all black).',
            'Maximum height is strictly bounded by 2 * log2(N + 1).'
          ],
          codeSnippet: {
            id: 'dsa-snip-18-5',
            title: 'Red-Black Node Definition & Colors',
            description: 'Core color constants and structural invariants',
            language: 'python',
            code: `RED = True
BLACK = False

class RBNode:
    def __init__(self, val, color=RED):
        self.val = val
        self.color = color # newly inserted nodes are always RED!
        self.left = None
        self.right = None
        self.parent = None

# Why are new nodes inserted as RED?
# Because adding a RED node does NOT violate Invariant 5 (Black-Height)!
# It may only violate Invariant 4 (no red-red), which is easily fixed by recoloring or rotations.`
          },
          pitfall: 'Inserting new nodes as BLACK: inserting a black node immediately violates Invariant 5 (Black-Height) on that branch, which is much harder to fix than a red-red collision.',
          quickCheck: {
            question: 'Why are newly inserted nodes in a Red-Black Tree colored RED by default?',
            options: ['Because red is faster to process', 'To preserve the Black-Height invariant (Invariant 5) along all leaf paths', 'Because root is red', 'To distinguish numbers'],
            correctIndex: 1,
            explanation: 'Inserting a red node preserves the black-height invariant for all paths, limiting potential violations to the local red-child constraint (Invariant 4).'
          }
        },
        {
          id: 'dsa-w3-d18-t6',
          topicNumber: 6,
          title: 'Red-Black Tree Insertion: Recoloring vs Rotations',
          explanation: [
            'When a RED node is inserted under a RED parent, an Invariant 4 violation occurs.',
            'The resolution depends on the color of the **UNCLE** node (sibling of the parent):',
            '- **Case 1 (Uncle is RED)**: Simple Recoloring! Recolor Parent and Uncle to BLACK; recolor Grandparent to RED. Propagate check up to Grandparent.',
            '- **Case 2 (Uncle is BLACK - Dogleg)**: Rotate child into a straight line.',
            '- **Case 3 (Uncle is BLACK - Straight Line)**: Rotate Grandparent, swap colors of Parent and Grandparent. Done in $O(1)$ rotations!'
          ],
          keyRules: [
            'Red uncle = recoloring only (no rotations).',
            'Black uncle = rotations required (at most 2 rotations per insertion).'
          ],
          codeSnippet: {
            id: 'dsa-snip-18-6',
            title: 'Red-Black Tree Insertion Logic Model',
            description: 'Uncle color diagnostic for recoloring vs rotation',
            language: 'python',
            code: `def fix_violation_diagnostic(uncle_color: bool) -> str:
    if uncle_color == RED:
        return "Uncle is RED: Recolor Parent & Uncle to BLACK, Grandparent to RED, repeat for Grandparent"
    else:
        return "Uncle is BLACK: Perform 1 or 2 Rotations and recolor Parent/Grandparent. Rebalancing complete!"

print("Resolution when uncle is RED:  ", fix_violation_diagnostic(RED))
print("Resolution when uncle is BLACK:", fix_violation_diagnostic(BLACK))`
          },
          pitfall: 'Assuming Red-Black Trees require many rotations: insertion requires at most 2 rotations; deletion requires at most 3 rotations.',
          quickCheck: {
            question: 'In a Red-Black Tree, what action is taken when both parent and uncle are RED?',
            options: ['Perform 3 rotations', 'Recolor parent and uncle to BLACK, recolor grandparent to RED, and continue checking upward', 'Delete the node', 'Convert to AVL tree'],
            correctIndex: 1,
            explanation: 'When the uncle is red, a simple recoloring pushes the red property up to the grandparent without requiring any geometric tree rotations.'
          }
        },
        {
          id: 'dsa-w3-d18-t7',
          topicNumber: 7,
          title: 'AVL vs Red-Black Trees: Industrial Engineering Trade-Offs',
          explanation: [
            'When should you choose AVL vs Red-Black in production?',
            '- **AVL Trees**: More strictly balanced (height $\\approx 1.0 \\log_2 N$). Lookups are faster because tree height is strictly minimal. Choose AVL when the workload is **READ-HEAVY** (e.g. database query indices, dictionary lookups).',
            '- **Red-Black Trees**: Slightly more relaxed balance (height $\\le 1.44 \\log_2 N$). Insertions and deletions require fewer rotations (at most 2 or 3). Choose Red-Black when the workload has **FREQUENT WRITES/MUTATIONS** (e.g. Linux scheduler CFS, Java `TreeMap`, C++ `std::map`).'
          ],
          keyRules: [
            'Read-Heavy -> AVL Trees.',
            'Write-Heavy or Balanced -> Red-Black Trees.',
            'Both guarantee O(log N) worst-case time.'
          ],
          codeSnippet: {
            id: 'dsa-snip-18-7',
            title: 'Industrial Data Structure Selection Matrix',
            description: 'Workload-driven balanced tree selector',
            language: 'python',
            code: `def choose_tree(workload: str) -> str:
    if workload == "lookup_intensive":
        return "AVL Tree (strictly minimal height yields fastest O(log N) searches)"
    elif workload == "frequent_inserts_deletes":
        return "Red-Black Tree (at most 2-3 rotations per write, lower mutation overhead)"
    return "B-Tree (for disk/database blocks)"

print("Choice for trading engine order book:", choose_tree("frequent_inserts_deletes"))`
          },
          pitfall: 'Using an in-memory balanced tree for disk databases: disk blocks are 4KB; binary trees make too many pointer hops. Use B-Trees or B+ Trees for disk I/O.',
          quickCheck: {
            question: 'Why do the C++ STL (std::map) and Java Collections (TreeMap) use Red-Black Trees instead of AVL Trees?',
            options: ['Red-Black trees use less memory', 'Red-Black trees require fewer rotations on insertions and deletions, making general-purpose modifications faster', 'AVL trees are copyrighted', 'Red-Black trees do not require pointers'],
            correctIndex: 1,
            explanation: 'General-purpose libraries expect frequent insertions and deletions; Red-Black trees bound rotations to at most 3 per modification, reducing write overhead.'
          }
        },
        {
          id: 'dsa-w3-d18-t8',
          topicNumber: 8,
          title: 'B-Trees and 2-3-4 Trees: Scaling Beyond Memory Cache Lines',
          explanation: [
            'Red-Black trees are isomorphic to **2-3-4 Trees** (each black node grouped with its red children forms a 2-node, 3-node, or 4-node).',
            'When data exceeds RAM and resides on SSD/Hard Drive, binary pointer chasing causes crippling disk I/O latency.',
            'A **B-Tree** generalizes 2-3-4 trees to thousands of keys per node (e.g., $M = 1024$), matching the OS disk page size (4KB to 64KB).',
            'A B-Tree of height 3 can index billions of database records with only 3 disk reads!'
          ],
          keyRules: [
            'B-Trees optimize for block storage and cache lines.',
            'Multi-way branching keeps tree height extremely flat (typically 3-4 levels).'
          ],
          codeSnippet: {
            id: 'dsa-snip-18-8',
            title: 'B-Tree Fanout Demonstration',
            description: 'Calculating records indexed by high-fanout B-Tree',
            language: 'python',
            code: `def btree_capacity(order: int, height: int) -> int:
    # Each node has up to 'order' children
    return (order ** height)

fanout = 512 # 512 keys per 4KB disk page
print(f"B-Tree Height 1: {btree_capacity(fanout, 1):,} records")
print(f"B-Tree Height 2: {btree_capacity(fanout, 2):,} records")
print(f"B-Tree Height 3: {btree_capacity(fanout, 3):,} records (134 Million!)")
print(f"B-Tree Height 4: {btree_capacity(fanout, 4):,} records (68 Billion records in just 4 disk hops!)")`
          },
          pitfall: 'Using binary search trees for relational databases: reading single binary nodes from disk incurs millions of disk seeks.',
          quickCheck: {
            question: 'Why are B-Trees preferred over Binary Search Trees for database storage engines (PostgreSQL, MySQL InnoDB)?',
            options: ['B-Trees are easier to code', 'High-fanout multi-way nodes match OS disk page sizes, keeping tree height flat and minimizing expensive disk I/O reads', 'B-Trees only run on Linux', 'B-Trees cannot store strings'],
            correctIndex: 1,
            explanation: 'With a fanout of hundreds or thousands of keys per node, B-trees can index billions of rows with only 3 or 4 disk page fetches.'
          }
        }
      ]
    },
    {
      id: 'dsa-w3-d19',
      dayNumber: 19,
      weekNumber: 3,
      title: 'Heaps & Priority Queues',
      subtitle: 'Binary heap array representation, Bubble-Up, Sift-Down, O(N) linear heapify & Top-K elements',
      durationMinutes: 75,
      overview:
        'Harness the Priority Queue abstraction. Build binary Min and Max Heaps packed in contiguous arrays with zero pointer overhead, prove why Floyd\'s Heapify builds a heap in O(N) linear time, solve Top-K Frequent Elements, and build the Dual-Heap Median Stream engine.',
      topics: [
        {
          id: 'dsa-w3-d19-t1',
          topicNumber: 1,
          title: 'The Binary Heap & Contiguous Array Layout',
          explanation: [
            'A Binary Heap is a Complete Binary Tree (every level is completely filled except possibly the last, which is filled from left to right).',
            'Because it is complete, it requires ZERO pointers! It is stored directly in a flat 0-indexed contiguous array:',
            '- Root is at index `0`.',
            '- For node at index `i`:',
            '  - Left Child: `2 * i + 1`.',
            '  - Right Child: `2 * i + 2`.',
            '  - Parent: `(i - 1) // 2`.',
            'Max-Heap Invariant: `parent.val >= child.val` for all nodes.'
          ],
          keyRules: [
            'Parent index = (i - 1) // 2.',
            'Children indices = 2*i + 1 and 2*i + 2.',
            'Zero pointer overhead and maximum CPU cache locality.'
          ],
          codeSnippet: {
            id: 'dsa-snip-19-1',
            title: 'Heap Index Arithmetic',
            description: 'Parent and child pointer-free array index math',
            language: 'python',
            code: `def get_parent(i: int) -> int: return (i - 1) // 2
def get_left(i: int) -> int: return 2 * i + 1
def get_right(i: int) -> int: return 2 * i + 2

heap_array = [100, 19, 36, 17, 3, 25, 1, 2, 7]
print("Root:", heap_array[0])
print("Left child of root:", heap_array[get_left(0)])   # 19
print("Right child of root:", heap_array[get_right(0)]) # 36
print("Parent of index 4 (val 3):", heap_array[get_parent(4)]) # 19`
          },
          pitfall: 'Accessing child indices without verifying bounds `2 * i + 1 < len(heap)`: triggers out-of-range errors on leaf nodes.',
          quickCheck: {
            question: 'What is the formula for the left child index of node `i` in a 0-indexed binary heap array?',
            options: ['2 * i', '2 * i + 1', '2 * i + 2', 'i // 2'],
            correctIndex: 1,
            explanation: 'In 0-indexed arrays, the left child is at index 2*i + 1 and the right child is at index 2*i + 2.'
          }
        },
        {
          id: 'dsa-w3-d19-t2',
          topicNumber: 2,
          title: 'Bubble-Up (Sift-Up) on Insertion: O(log N)',
          explanation: [
            'To insert an element into a heap:',
            '1. Append the new value to the END of the array (preserving the Complete Tree property).',
            '2. Bubble-Up (Sift-Up): Compare the new element with its parent `(i - 1) // 2`.',
            '3. In a Max-Heap, if `child > parent`: swap them! Repeat until the invariant holds or the element reaches the root.',
            'Because the tree height is strictly $\\lfloor\\log_2 N\\rfloor$, insertion takes at most $O(\\log N)$ swaps.'
          ],
          keyRules: [
            'Appends at end, bubbles up to root.',
            'Time complexity is O(log N).'
          ],
          codeSnippet: {
            id: 'dsa-snip-19-2',
            title: 'Bubble-Up Heap Insertion',
            description: 'Pushing to end and bubbling up in O(log N)',
            language: 'python',
            code: `class MaxHeap:
    def __init__(self):
        self.heap = []
        
    def push(self, val: int):
        self.heap.append(val)
        self._sift_up(len(self.heap) - 1)
        
    def _sift_up(self, idx: int):
        parent = (idx - 1) // 2
        while idx > 0 and self.heap[idx] > self.heap[parent]:
            self.heap[idx], self.heap[parent] = self.heap[parent], self.heap[idx]
            idx = parent
            parent = (idx - 1) // 2

h = MaxHeap()
for v in [10, 20, 15, 30]: h.push(v)
print("Max Heap Array:", h.heap) # [30, 20, 15, 10]`
          },
          pitfall: 'Checking `while idx >= 0`: when idx is 0, parent is `(0 - 1) // 2 = -1`, which wraps around to the back of the Python list! Must be `while idx > 0`.',
          quickCheck: {
            question: 'What is the maximum number of swaps performed during a heap push operation on N elements?',
            options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
            correctIndex: 1,
            explanation: 'The element travels up from a leaf along a single branch to the root, bounded by tree height log2(N).'
          }
        },
        {
          id: 'dsa-w3-d19-t3',
          topicNumber: 3,
          title: 'Sift-Down on Extraction: O(log N)',
          explanation: [
            'To extract the root (maximum element):',
            '1. Save `root_val = heap[0]`.',
            '2. Move the LAST element of the array to index `0`, and pop the last slot (`O(1)`).',
            '3. Sift-Down: Compare the new root with its children (`2i + 1` and `2i + 2`).',
            '4. Swap with the LARGER of the two children (in Max-Heap). Repeat until invariant holds or a leaf is reached.',
            'Guarantees $O(\\log N)$ extraction time.'
          ],
          keyRules: [
            'Always swap with the LARGER child in a Max-Heap (or SMALLER child in a Min-Heap).',
            'Moving last element to root maintains complete tree shape.'
          ],
          codeSnippet: {
            id: 'dsa-snip-19-3',
            title: 'Sift-Down Heap Pop',
            description: 'Extracting root and restoring invariant via sift-down',
            language: 'python',
            code: `def pop_max(self) -> int:
    if not self.heap: raise IndexError("pop from empty heap")
    if len(self.heap) == 1: return self.heap.pop()
    
    root_val = self.heap[0]
    self.heap[0] = self.heap.pop() # move last to root
    self._sift_down(0)
    return root_val

def _sift_down(self, idx: int):
    n = len(self.heap)
    while True:
        largest = idx
        left = 2 * idx + 1
        right = 2 * idx + 2
        
        if left < n and self.heap[left] > self.heap[largest]:
            largest = left
        if right < n and self.heap[right] > self.heap[largest]:
            largest = right
            
        if largest == idx: break
        self.heap[idx], self.heap[largest] = self.heap[largest], self.heap[idx]
        idx = largest

MaxHeap.pop_max = pop_max
MaxHeap._sift_down = _sift_down

print("Extracted max:", h.pop_max()) # 30
print("New root:", h.heap[0])         # 20`
          },
          pitfall: 'Swapping with whichever child is valid instead of the larger child: if left is 25 and right is 30, swapping with 25 violates the heap property with the right child!',
          quickCheck: {
            question: 'Why must we swap with the larger of the two children during Sift-Down in a Max-Heap?',
            options: ['To speed up loop execution', 'Because the new parent must be greater than BOTH children; choosing the largest child guarantees this', 'To sort the children', 'Because right child is ignored'],
            correctIndex: 1,
            explanation: 'If you swapped with the smaller child, the larger child would still be greater than the new parent, violating the Max-Heap invariant.'
          }
        },
        {
          id: 'dsa-w3-d19-t4',
          topicNumber: 4,
          title: 'Floyd\'s Heapify: Why Building a Heap is O(N) Linear Time',
          explanation: [
            'Naive insertion of $N$ elements into an empty heap takes $N \\times O(\\log N) = O(N \\log N)$.',
            'Floyd\'s Heapify transforms an arbitrary array of $N$ elements into a valid heap in strictly $O(N)$ linear time!',
            'Algorithm: Start at the last non-leaf parent index `(N // 2) - 1` and call `sift_down` backwards to index 0.',
            'Mathematical Proof: Most nodes are near the leaves and do almost 0 swaps; only the few nodes near the root do $O(\\log N)$ swaps. The sum $\\sum_{h=0}^{\\infty} \\frac{h}{2^h} = 2$, proving exact $O(N)$!'
          ],
          keyRules: [
            'Start sift_down from (N // 2) - 1 down to 0.',
            'Heapify is O(N) time (NOT O(N log N)).'
          ],
          codeSnippet: {
            id: 'dsa-snip-19-4',
            title: 'Floyds Linear O(N) Heapify',
            description: 'Building a heap in place in linear time',
            language: 'python',
            code: `def heapify(arr: list[int]) -> None:
    n = len(arr)
    # Start at last non-leaf parent and sift down backwards
    for i in range((n // 2) - 1, -1, -1):
        idx = i
        while True:
            largest = idx
            left = 2 * idx + 1
            right = 2 * idx + 2
            if left < n and arr[left] > arr[largest]: largest = left
            if right < n and arr[right] > arr[largest]: largest = right
            if largest == idx: break
            arr[idx], arr[largest] = arr[largest], arr[idx]
            idx = largest

raw_data = [4, 10, 3, 5, 1]
heapify(raw_data)
print("Linear Heapified Array:", raw_data) # [10, 5, 3, 4, 1]`
          },
          pitfall: 'Calling sift_up from index 0 to N: sift_up takes O(N log N) total time! Linear O(N) is achieved ONLY by bottom-up sift_down.',
          quickCheck: {
            question: 'What is the time complexity of building a binary heap from an unsorted array of size N using Floyds Heapify?',
            options: ['O(N log N)', 'O(N)', 'O(1)', 'O(N^2)'],
            correctIndex: 1,
            explanation: 'Because the vast majority of nodes reside at or near leaf levels where sift-down depth is small (0 or 1), the geometric sum converges to O(N).'
          }
        },
        {
          id: 'dsa-w3-d19-t5',
          topicNumber: 5,
          title: 'Heap Sort: In-Place Comparison Sort',
          explanation: [
            'Heap Sort achieves $O(N \\log N)$ time and $O(1)$ auxiliary space.',
            '1. Build a Max-Heap from the array in $O(N)$ using Heapify.',
            '2. For $i$ from $N - 1$ down to 1:',
            '   a. Swap `arr[0]` (current max) with `arr[i]` (placing max in its permanent sorted position at end).',
            '   b. Call `sift_down(0)` on the reduced heap of size $i$.',
            'Result: In-place sorted array with zero buffer allocations!'
          ],
          keyRules: [
            'Time: O(N log N) best, worst, average.',
            'Auxiliary Space: strictly O(1) in-place.',
            'Unstable sorting algorithm.'
          ],
          codeSnippet: {
            id: 'dsa-snip-19-5',
            title: 'Heap Sort Implementation',
            description: 'In-place O(N log N) sorting with Max-Heap',
            language: 'python',
            code: `def heap_sort(arr: list[int]) -> None:
    n = len(arr)
    # 1. Build max heap in O(N)
    for i in range((n // 2) - 1, -1, -1):
        _sift_down_range(arr, n, i)
        
    # 2. Extract max to back of array
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0] # swap max to sorted position
        _sift_down_range(arr, i, 0)     # re-heapify remaining elements

def _sift_down_range(arr, limit, idx):
    while True:
        largest = idx
        left = 2 * idx + 1
        right = 2 * idx + 2
        if left < limit and arr[left] > arr[largest]: largest = left
        if right < limit and arr[right] > arr[largest]: largest = right
        if largest == idx: break
        arr[idx], arr[largest] = arr[largest], arr[idx]
        idx = largest

nums = [12, 11, 13, 5, 6, 7]
heap_sort(nums)
print("Heap Sorted:", nums) # [5, 6, 7, 11, 12, 13]`
          },
          pitfall: 'Believing Heap Sort is faster than Quick Sort in practice: while both are O(N log N), Heap Sort has poor cache locality (jumping across array indices 2i+1 and 2i+2), making it 2x-3x slower than QuickSort in real hardware benchmarks.',
          quickCheck: {
            question: 'What is the auxiliary space complexity of Heap Sort?',
            options: ['O(N)', 'O(log N)', 'O(1)', 'O(N log N)'],
            correctIndex: 2,
            explanation: 'Heap Sort rearranges elements directly within the existing input array, requiring strictly O(1) auxiliary memory.'
          }
        },
        {
          id: 'dsa-w3-d19-t6',
          topicNumber: 6,
          title: 'Top K Frequent Elements (Min-Heap of Size K)',
          explanation: [
            'Problem: Given an integer array `nums` and integer $k$, return the $k$ most frequent elements.',
            'Sorting frequencies takes $O(N \\log N)$.',
            'Min-Heap Optimization of Size $K$:',
            '1. Count frequencies using a hash map: `counts = Counter(nums)`.',
            '2. Iterate through frequency pairs `(count, num)`. Push to a Min-Heap of size $K$.',
            '3. When heap size exceeds $K$: pop the minimum element (`heappop`).',
            'At the end, the heap contains the $K$ elements with the HIGHEST frequencies!',
            'Time: $O(N \\log K)$ (much faster than $O(N \\log N)$ when $K \\ll N$).'
          ],
          keyRules: [
            'Use a MIN-HEAP to maintain the TOP-K elements (smallest of the top-K is popped).',
            'Space is O(N + K).'
          ],
          codeSnippet: {
            id: 'dsa-snip-19-6',
            title: 'Top K Frequent Elements via Min-Heap',
            description: 'Bounded heap of size K in O(N log K) time',
            language: 'python',
            code: `import heapq
from collections import Counter

def top_k_frequent(nums: list[int], k: int) -> list[int]:
    counts = Counter(nums)
    # Min-heap storing tuples: (frequency, num)
    heap = []
    
    for num, freq in counts.items():
        heapq.heappush(heap, (freq, num))
        if len(heap) > k:
            heapq.heappop(heap) # evict element with smallest frequency
            
    return [num for freq, num in heap]

print("Top 2 frequent in [1,1,1,2,2,3]:", top_k_frequent([1, 1, 1, 2, 2, 3], 2)) # [2, 1]`
          },
          pitfall: 'Using a max-heap of all N elements: pushing all N elements takes O(N log N) time; keeping a bounded MIN-heap of size K takes strictly O(N log K).',
          quickCheck: {
            question: 'Why do we use a MIN-heap (instead of a max-heap) to find the top K largest elements?',
            options: ['Min-heaps are faster to allocate', 'The min-heap root stores the smallest of the top-K candidates, allowing instant O(1) eviction of the lowest contender when capacity is breached', 'Max-heaps cannot store frequencies', 'To sort the output'],
            correctIndex: 1,
            explanation: 'A bounded min-heap keeps the smallest element at the root, making it trivial to discard the least viable contender whenever size exceeds K.'
          }
        },
        {
          id: 'dsa-w3-d19-t7',
          topicNumber: 7,
          title: 'Find Median from Data Stream (Dual-Heap Architecture)',
          explanation: [
            'Problem: Design a data structure that supports adding numbers from a continuous stream and finding the current median in $O(1)$ time.',
            'The Dual-Heap Balancing Architecture:',
            '- `small`: A **Max-Heap** storing the lower half of numbers (simulated with negated values in Python).',
            '- `large`: A **Min-Heap** storing the upper half of numbers.',
            'Invariants:',
            '1. Every element in `small` $\\le$ every element in `large`.',
            '2. Size invariant: `len(small) == len(large)` OR `len(small) == len(large) + 1`.',
            'Median is either `small[0]` (odd count) or `(small[0] + large[0]) / 2.0` (even count) in instantaneous $O(1)$!'
          ],
          keyRules: [
            'small is Max-Heap; large is Min-Heap.',
            'Insertion takes O(log N); finding median is O(1).'
          ],
          codeSnippet: {
            id: 'dsa-snip-19-7',
            title: 'Dual-Heap Median Finder',
            description: 'Max-heap and min-heap maintaining dynamic stream median',
            language: 'python',
            code: `import heapq

class MedianFinder:
    def __init__(self):
        self.small = [] # Max-heap (store negated values)
        self.large = [] # Min-heap
        
    def addNum(self, num: int) -> None:
        # Push to small max-heap first
        heapq.heappush(self.small, -num)
        
        # Ensure max of small <= min of large
        if self.small and self.large and (-self.small[0] > self.large[0]):
            val = -heapq.heappop(self.small)
            heapq.heappush(self.large, val)
            
        # Balance sizes (small can have at most 1 more element than large)
        if len(self.small) > len(self.large) + 1:
            val = -heapq.heappop(self.small)
            heapq.heappush(self.large, val)
        if len(self.large) > len(self.small):
            val = heapq.heappop(self.large)
            heapq.heappush(self.small, -val)
            
    def findMedian(self) -> float:
        if len(self.small) > len(self.large):
            return float(-self.small[0])
        return (-self.small[0] + self.large[0]) / 2.0

mf = MedianFinder()
mf.addNum(1); mf.addNum(2)
print("Median of [1, 2]:", mf.findMedian()) # 1.5
mf.addNum(3)
print("Median of [1, 2, 3]:", mf.findMedian()) # 2.0`
          },
          pitfall: 'Re-sorting the array on each insertion: `arr.sort()` on every `addNum` costs $O(N \\log N)$ per addition ($O(N^2)$ overall), timing out completely.',
          quickCheck: {
            question: 'What is the time complexity to retrieve the median using the Dual-Heap MedianFinder?',
            options: ['O(N)', 'O(log N)', 'O(1)', 'O(N log N)'],
            correctIndex: 2,
            explanation: 'The roots of the small max-heap and large min-heap are immediately accessible at index 0, enabling O(1) constant-time median retrieval.'
          }
        },
        {
          id: 'dsa-w3-d19-t8',
          topicNumber: 8,
          title: 'Merge K Sorted Arrays (K-Way Heap Merge)',
          explanation: [
            'Given $K$ sorted arrays with total $N$ elements, merge them into a single sorted array in $O(N \\log K)$ time.',
            'Algorithm:',
            '1. Insert the first element of each of the $K$ arrays into a Min-Heap: `(val, array_idx, element_idx)`.',
            '2. Pop the minimum element from the heap and append to `result`.',
            '3. If that array has more elements, push its next element `(arr[next_idx], array_idx, next_idx)` into the heap.',
            '4. Repeat until heap is empty.',
            'Runs in $O(N \\log K)$ time and $O(K)$ auxiliary space.'
          ],
          keyRules: [
            'Heap size never exceeds K.',
            'Tracks array index and element index alongside value.'
          ],
          codeSnippet: {
            id: 'dsa-snip-19-8',
            title: 'Merge K Sorted Arrays via Min-Heap',
            description: 'K-way merge in O(N log K) time and O(K) space',
            language: 'python',
            code: `import heapq

def merge_k_sorted_arrays(arrays: list[list[int]]) -> list[int]:
    heap = [] # (value, array_index, element_index)
    
    # 1. Initialize heap with first element of each non-empty array
    for i, arr in enumerate(arrays):
        if arr:
            heapq.heappush(heap, (arr[0], i, 0))
            
    res = []
    # 2. Extract min and push next element from that array
    while heap:
        val, arr_i, el_i = heapq.heappop(heap)
        res.append(val)
        if el_i + 1 < len(arrays[arr_i]):
            next_val = arrays[arr_i][el_i + 1]
            heapq.heappush(heap, (next_val, arr_i, el_i + 1))
            
    return res

lists = [[1, 4, 7], [2, 5, 8], [3, 6, 9]]
print("Merged K Arrays:", merge_k_sorted_arrays(lists)) # [1..9]`
          },
          pitfall: 'Concatenating all arrays and running full `sort()`: takes O(N log N) and fails to exploit the pre-sorted property of the K individual arrays.',
          quickCheck: {
            question: 'What is the auxiliary space complexity of K-way heap merge?',
            options: ['O(N)', 'O(K)', 'O(1)', 'O(N log K)'],
            correctIndex: 1,
            explanation: 'The min-heap holds at most one element from each of the K arrays at any given time, requiring O(K) auxiliary space.'
          }
        }
      ]
    },
    {
      id: 'dsa-w3-d20',
      dayNumber: 20,
      weekNumber: 3,
      title: 'Tries (Prefix Trees) & Prefix Automata',
      subtitle: 'TrieNode architecture, insert, search, startsWith, wildcards & prefix search engines',
      durationMinutes: 70,
      overview:
        'Explore the Prefix Tree (Trie) data structure designed for ultra-fast string retrieval and autocomplete dictionaries. Master TrieNode branching, O(L) word insertion and prefix matching, wildcard pattern matching with dots, and memory compaction.',
      topics: [
        {
          id: 'dsa-w3-d20-t1',
          topicNumber: 1,
          title: 'The Prefix Tree Architecture: Eliminating Redundant Prefixes',
          explanation: [
            'A Trie (pronounced "try", from reTRIEval) is a multi-way tree structure where each node represents a common prefix character.',
            'All descendants of a node share the prefix associated with that node.',
            'Each node contains:',
            '- `children`: Hash map or fixed array of 26 child references.',
            '- `is_end_of_word`: Boolean flag indicating if a word terminates at this node.',
            'Key Advantage: Searching for a word of length $L$ takes $O(L)$ time, COMPLETELY INDEPENDENT of how many millions of words ($N$) are stored in the dictionary!'
          ],
          keyRules: [
            'Search time is O(L) where L is string length, not dictionary size N.',
            'Common prefixes (e.g. "car", "cart", "carpet") share the same root path nodes.'
          ],
          codeSnippet: {
            id: 'dsa-snip-20-1',
            title: 'TrieNode Class Definition',
            description: 'Core building block of prefix trees',
            language: 'python',
            code: `class TrieNode:
    def __init__(self):
        self.children = {} # char -> TrieNode
        self.is_end_of_word = False

# Example: inserting "cat" and "car" shares "c" -> "a" nodes!`
          },
          pitfall: 'Storing the full word or character inside the node: the character is represented by the EDGE (key in the `children` dictionary), not stored inside the child node itself.',
          quickCheck: {
            question: 'What is the time complexity to search for a word of length L in a Trie containing 10,000,000 words?',
            options: ['O(10,000,000)', 'O(L)', 'O(log 10,000,000)', 'O(L * 10,000,000)'],
            correctIndex: 1,
            explanation: 'Trie lookup follows exactly L character links from root to leaf, executing in O(L) time regardless of how many millions of words exist in the Trie.'
          }
        },
        {
          id: 'dsa-w3-d20-t2',
          topicNumber: 2,
          title: 'Implement Trie (Prefix Tree): Insert, Search & StartsWith',
          explanation: [
            'Implement the canonical Trie API:',
            '- `insert(word)`: For each char in word, if not in `curr.children`, create new `TrieNode`. Move `curr = curr.children[char]`. At end, set `curr.is_end_of_word = True`.',
            '- `search(word)`: Follow char links. If any char is missing, return `False`. At end, return `curr.is_end_of_word`.',
            '- `startsWith(prefix)`: Follow char links. If prefix exists, return `True` (does NOT require `is_end_of_word` to be true!).'
          ],
          keyRules: [
            'search() requires is_end_of_word == True.',
            'startsWith() only requires that the path exists.'
          ],
          codeSnippet: {
            id: 'dsa-snip-20-2',
            title: 'Complete Trie Implementation',
            description: 'Insert, Search and StartsWith methods in O(L)',
            language: 'python',
            code: `class Trie:
    def __init__(self):
        self.root = TrieNode()
        
    def insert(self, word: str) -> None:
        curr = self.root
        for c in word:
            if c not in curr.children:
                curr.children[c] = TrieNode()
            curr = curr.children[c]
        curr.is_end_of_word = True
        
    def search(self, word: str) -> bool:
        curr = self.root
        for c in word:
            if c not in curr.children: return False
            curr = curr.children[c]
        return curr.is_end_of_word
        
    def startsWith(self, prefix: str) -> bool:
        curr = self.root
        for c in prefix:
            if c not in curr.children: return False
            curr = curr.children[c]
        return True

trie = Trie()
trie.insert("apple")
print("Search 'apple':", trie.search("apple"))     # True
print("Search 'app':", trie.search("app"))         # False
print("StartsWith 'app':", trie.startsWith("app")) # True`
          },
          pitfall: 'Returning True in `search("app")` when only "apple" was inserted: "app" is only a prefix, not a full word. `is_end_of_word` prevents this false positive.',
          quickCheck: {
            question: 'What is the difference between search(word) and startsWith(prefix)?',
            options: ['search only works on capital letters', 'search requires is_end_of_word to be True at the terminal node, while startsWith only requires that the path exists', 'startsWith is slower', 'They are strictly identical'],
            correctIndex: 1,
            explanation: 'search confirms that a full word was inserted; startsWith confirms that at least one word in the Trie begins with that prefix.'
          }
        },
        {
          id: 'dsa-w3-d20-t3',
          topicNumber: 3,
          title: 'Design Add and Search Words Data Structure (Wildcard Matching)',
          explanation: [
            'Problem: Support `addWord(word)` and `search(word)` where `word` can contain the dot character `.` which matches ANY letter.',
            'If character is a letter: follow the single child link `curr.children[char]`.',
            'If character is `.`: RECURSE across ALL active children in `curr.children.values()`! If ANY recursive branch returns True, return True.',
            'DFS Backtracking over Trie branches for wildcard resolution.'
          ],
          keyRules: [
            'Dot wildcard branches into all existing children.',
            'Runs in O(M) for exact words; worst case O(26^L) for all-dot words ("...").'
          ],
          codeSnippet: {
            id: 'dsa-snip-20-3',
            title: 'Wildcard Word Dictionary with Dots',
            description: 'Trie search with DFS branching on "." wildcard',
            language: 'python',
            code: `class WordDictionary:
    def __init__(self):
        self.root = TrieNode()
        
    def addWord(self, word: str) -> None:
        curr = self.root
        for c in word:
            if c not in curr.children:
                curr.children[c] = TrieNode()
            curr = curr.children[c]
        curr.is_end_of_word = True
        
    def search(self, word: str) -> bool:
        def dfs(node: TrieNode, idx: int) -> bool:
            if idx == len(word):
                return node.is_end_of_word
                
            c = word[idx]
            if c == '.':
                # Wildcard: check every active child
                for child in node.children.values():
                    if dfs(child, idx + 1): return True
                return False
            else:
                if c not in node.children: return False
                return dfs(node.children[c], idx + 1)
                
        return dfs(self.root, 0)

wd = WordDictionary()
wd.addWord("bad"); wd.addWord("dad"); wd.addWord("mad")
print("Search '.ad':", wd.search(".ad")) # True
print("Search 'b..':", wd.search("b..")) # True
print("Search 'b.x':", wd.search("b.x")) # False`
          },
          pitfall: 'Checking 26 letters naively in a loop when `c == "."`: only iterate over `node.children.values()` to avoid testing non-existent branches.',
          quickCheck: {
            question: 'What happens when a "." wildcard is encountered during WordDictionary search?',
            options: ['The search fails immediately', 'DFS branches into all existing children of the current Trie node', 'The dot is converted to "a"', 'The search restarts from root'],
            correctIndex: 1,
            explanation: 'The dot can match any character, so the algorithm explores every child branch currently branching from that node.'
          }
        },
        {
          id: 'dsa-w3-d20-t4',
          topicNumber: 4,
          title: 'Maximum XOR of Two Numbers in an Array (Bitwise Trie)',
          explanation: [
            'Problem: Given an integer array `nums`, return the maximum result of `nums[i] XOR nums[j]`.',
            'Brute force checks all pairs in $O(N^2)$ time.',
            'Bitwise Binary Trie in $O(N \\times 31) = O(N)$ time:',
            '1. Insert 31-bit binary representation of each number into a binary Trie (children are `0` and `1`).',
            '2. For each number, greedily traverse the Trie to maximize XOR: at bit $B$, if the current bit is $b$, we PREFER to take the OPPOSITE bit $1 - b$ (since $b \\oplus (1-b) = 1$).',
            '3. If opposite branch exists, take it and set bit $B$ to 1 in result; else take matching branch.'
          ],
          keyRules: [
            'Binary Trie has fixed alphabet {0, 1}.',
            'Greedy choice: always pick opposite bit to maximize leading 1-bits.'
          ],
          codeSnippet: {
            id: 'dsa-snip-20-4',
            title: 'Maximum XOR via Binary Trie',
            description: 'Greedy bitwise opposite-branch traversal in O(32N)',
            language: 'python',
            code: `class BinaryTrieNode:
    def __init__(self):
        self.children = [None, None] # 0 and 1

def find_maximum_xor(nums: list[int]) -> int:
    root = BinaryTrieNode()
    
    # 1. Insert all numbers (31 bits)
    for num in nums:
        curr = root
        for i in range(30, -1, -1):
            bit = (num >> i) & 1
            if not curr.children[bit]:
                curr.children[bit] = BinaryTrieNode()
            curr = curr.children[bit]
            
    # 2. Greedily find max XOR partner for each number
    max_xor = 0
    for num in nums:
        curr = root
        curr_xor = 0
        for i in range(30, -1, -1):
            bit = (num >> i) & 1
            toggled = 1 - bit
            if curr.children[toggled]:
                curr_xor |= (1 << i)
                curr = curr.children[toggled]
            else:
                curr = curr.children[bit]
        max_xor = max(max_xor, curr_xor)
        
    return max_xor

print("Max XOR in [3, 10, 5, 25, 2, 8]:", find_maximum_xor([3, 10, 5, 25, 2, 8])) # 28 (5 ^ 25)`
          },
          pitfall: 'Scanning from bit 0 up to 30: greedy bit selection MUST proceed from most significant bit (bit 30) down to 0, because a 1 in a higher place value outweighs all lower bits combined!',
          quickCheck: {
            question: 'Why does the Bitwise Trie for Maximum XOR prioritize the opposite bit (1 - bit) at each step?',
            options: ['To minimize XOR', 'Because XOR of opposite bits (0 ^ 1 or 1 ^ 0) produces a 1 bit, maximizing the resulting number', 'To prevent overflow', 'Because binary numbers are negative'],
            correctIndex: 1,
            explanation: 'The XOR operation produces 1 when bits differ; choosing the opposite bit at high bit positions maximizes the numeric result.'
          }
        },
        {
          id: 'dsa-w3-d20-t5',
          topicNumber: 5,
          title: 'Word Search II: Backtracking on 2D Board with Trie (LeetCode Hard)',
          explanation: [
            'Problem: Given an $M \\times N$ board of characters and a list of words, find all words on the board (adjacent letters, no reusing cells).',
            'Naive DFS per word searches board $K$ times: $O(K \\times M \\times N \\times 4^L)$ -> Time Limit Exceeded.',
            'Trie Optimization: Build a Trie of ALL words once.',
            'Run ONE single DFS from each board cell matching against the Trie:',
            '- If current board prefix is not in Trie: prune immediately (stops millions of dead search paths!).',
            '- When a Trie node has `word`: record word into output, and set `node.word = None` to prevent duplicate answers.'
          ],
          keyRules: [
            'Store word string directly at terminal Trie node to avoid reconstructing strings during DFS.',
            'Prune child nodes after words are matched to accelerate subsequent searches.'
          ],
          codeSnippet: {
            id: 'dsa-snip-20-5',
            title: 'Word Search II with Trie and Board Backtracking',
            description: 'Trie-guided DFS pruning on 2D character matrix',
            language: 'python',
            code: `def find_words_2d(board: list[list[str]], words: list[str]) -> list[str]:
    # 1. Build Trie
    root = {}
    for word in words:
        curr = root
        for c in word:
            curr = curr.setdefault(c, {})
        curr['$'] = word # '$' marks end of word and stores payload
        
    rows, cols = len(board), len(board[0])
    res = []
    
    def dfs(r, c, parent_node):
        char = board[r][c]
        curr_node = parent_node.get(char)
        if not curr_node: return
        
        # Word found!
        if '$' in curr_node:
            res.append(curr_node['$'])
            del curr_node['$'] # prevent duplicate matches
            
        board[r][c] = '#' # mark visited in-place
        for dr, dc in [(-1,0), (1,0), (0,-1), (0,1)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and board[nr][nc] != '#':
                dfs(nr, nc, curr_node)
        board[r][c] = char # unmark visited (backtrack)
        
    for r in range(rows):
        for c in range(cols):
            dfs(r, c, root)
            
    return res

grid = [
  ['o','a','a','n'],
  ['e','t','a','e'],
  ['i','h','k','r'],
  ['i','f','l','v']
]
print("Found words:", find_words_2d(grid, ["oath","pea","eat","rain"])) # ['oath', 'eat']`
          },
          pitfall: 'Using a visited set `(r, c)` instead of mutating board `board[r][c] = "#"` in place: hash set operations add massive overhead in tight 2D DFS loops.',
          quickCheck: {
            question: 'Why is a Trie vastly superior to standard Word Search for multiple words?',
            options: ['Tries use less memory than arrays', 'The Trie allows the board DFS to search for ALL words simultaneously, pruning invalid prefixes in O(1) before recursing further', 'Tries sort the board', 'It eliminates recursion'],
            correctIndex: 1,
            explanation: 'Instead of re-searching the board for each of the K words, a single board traversal explores valid prefixes for all K words simultaneously.'
          }
        },
        {
          id: 'dsa-w3-d20-t6',
          topicNumber: 6,
          title: 'Memory Footprint Optimization in Tries: Radix Trees (Compressed Tries)',
          explanation: [
            'A standard Trie has high memory consumption because every single character allocates a `TrieNode`.',
            'If a word like `"internationalization"` has no branching children, allocating 20 separate nodes is wasteful.',
            '**Radix Tree (Patricia Trie)**: Compresses non-branching chains into a single edge containing the entire substring (e.g. edge `"internation"`).',
            'Used in Linux IP routing tables and Git commit hash indexing, reducing node count by up to 80%.'
          ],
          keyRules: [
            'Radix trees merge nodes with a single child into single multi-character edges.',
            'Drastically reduces pointer memory overhead.'
          ],
          codeSnippet: {
            id: 'dsa-snip-20-6',
            title: 'Radix Tree Edge Compression Concept',
            description: 'Compressed prefix nodes for memory reduction',
            language: 'python',
            code: `# Standard Trie for "test", "team":
# root -> 't' -> 'e' -> ('s' -> 't', 'a' -> 'm')

# Compressed Radix Tree:
# root -> "te" -> ("st", "am")
# Saves 2 intermediate node allocations!`
          },
          pitfall: 'Implementing a Radix Tree when strings share only single characters: compression is beneficial only when long non-branching common substrings exist.',
          quickCheck: {
            question: 'What optimization does a Radix Tree (Compressed Trie) perform compared to a standard Trie?',
            options: ['It removes all vowels', 'It compresses single-child node chains into single edges containing multi-character substrings', 'It converts strings to integers', 'It encrypts the keys'],
            correctIndex: 1,
            explanation: 'Radix trees eliminate redundant single-child intermediate nodes by merging non-branching paths into multi-character edge labels.'
          }
        },
        {
          id: 'dsa-w3-d20-t7',
          topicNumber: 7,
          title: 'Trie Autocomplete and Suggestion Engines',
          explanation: [
            'How do search bars (Google, Amazon) display autocomplete suggestions as you type?',
            '1. Navigate down the Trie matching the user\'s typed `prefix`.',
            '2. Once at the prefix terminal node, perform a DFS to collect all leaf words in that subtree.',
            '3. Production optimization: Store the Top-5 most frequent words directly at each TrieNode! This eliminates the subtree DFS entirely, delivering $O(L)$ instant autocomplete suggestions!'
          ],
          keyRules: [
            'Store precomputed top suggestions directly on nodes for instant O(L) response.',
            'Update suggestion lists during word insertion.'
          ],
          codeSnippet: {
            id: 'dsa-snip-20-7',
            title: 'Instant Autocomplete Suggestion Trie',
            description: 'Caching top suggestions on prefix nodes in O(L)',
            language: 'python',
            code: `class AutocompleteNode:
    def __init__(self):
        self.children = {}
        self.suggestions = [] # Top 3 words sharing this prefix

class AutocompleteSystem:
    def __init__(self, words: list[str]):
        self.root = AutocompleteNode()
        words.sort() # sort lexicographically
        for word in words:
            curr = self.root
            for c in word:
                if c not in curr.children:
                    curr.children[c] = AutocompleteNode()
                curr = curr.children[c]
                if len(curr.suggestions) < 3:
                    curr.suggestions.append(word)
                    
    def suggest(self, prefix: str) -> list[str]:
        curr = self.root
        for c in prefix:
            if c not in curr.children: return []
            curr = curr.children[c]
        return curr.suggestions

auto = AutocompleteSystem(["mobile","mouse","moneypot","monitor","mousepad"])
print("Suggestions for 'mo':", auto.suggest("mo")) # ['mobile', 'moneypot', 'monitor']`
          },
          pitfall: 'Running an unbounded DFS on every keystroke: on large dictionaries, finding all words under a common prefix like "a" visits millions of nodes, lagging the UI.',
          quickCheck: {
            question: 'How do production search engines achieve sub-millisecond autocomplete suggestions using Tries?',
            options: ['By querying a remote SQL database', 'By precomputing and caching the top-K highest-ranked words directly at each prefix Trie node during indexing', 'By running binary search on all words', 'By guessing randomly'],
            correctIndex: 1,
            explanation: 'Caching the top suggestions directly inside each node allows queries to read the answer in O(1) immediately upon reaching the prefix node.'
          }
        },
        {
          id: 'dsa-w3-d20-t8',
          topicNumber: 8,
          title: 'Hierarchical Structures Diagnostic Guide',
          explanation: [
            'How to choose between Trees, BSTs, Heaps, and Tries:',
            '- Need hierarchical parent-child relationships and subtree expressions? -> Binary Tree (DFS/BFS).',
            '- Need dynamic ordered collection with $O(\\log N)$ search, insert, min/max, predecessor/successor? -> Balanced BST (AVL/Red-Black).',
            '- Need continuous access to the extreme element (min or max) with $O(1)$ peek and $O(\\log N)$ updates? -> Binary Heap (Priority Queue).',
            '- Need prefix matching, string dictionary search, autocomplete, or bitwise XOR? -> Trie (Prefix Tree).'
          ],
          keyRules: [
            'Heaps do NOT support fast arbitrary search: searching a heap is O(N). Use a BST if you need to search for arbitrary keys.',
            'Tries are specialized for strings and bitwise integers.'
          ],
          codeSnippet: {
            id: 'dsa-snip-20-8',
            title: 'Hierarchical Selector Guide',
            description: 'Automated requirement-to-structure selector',
            language: 'python',
            code: `def hierarchical_selector(req: str) -> str:
    options = {
        "priority_max": "Binary Heap (Priority Queue) - O(1) peek, O(log N) pop",
        "dynamic_sorted": "Balanced BST (Red-Black / AVL) - O(log N) search and insert",
        "prefix_search": "Trie (Prefix Tree) - O(L) independent of dictionary size",
        "level_traversal": "Binary Tree with BFS Queue - O(N)"
    }
    return options.get(req, "General Tree")

print("Requirement 'priority_max' ->", hierarchical_selector("priority_max"))`
          },
          pitfall: 'Attempting to use a Heap when you need to search for arbitrary elements: heaps only organize the root min or max; finding an arbitrary key in a heap requires an O(N) scan.',
          quickCheck: {
            question: 'What is the time complexity to search for an arbitrary element in a standard Binary Min-Heap of size N?',
            options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
            correctIndex: 2,
            explanation: 'Heaps only guarantee ordering between parents and children (not left vs right siblings), so searching for an arbitrary key requires checking all N elements in O(N) time.'
          }
        }
      ]
    },
    {
      id: 'dsa-w3-d21',
      dayNumber: 21,
      weekNumber: 3,
      title: 'Module 3 Capstone: Prefix Automata & Hierarchical Mastery',
      subtitle: 'Disjoint Set Union (Union-Find) foundations, Trie autocomplete engine & Module 3 Qualifying Exam',
      durationMinutes: 80,
      overview:
        'Synthesize trees, heaps, and prefix automata into full architectural mastery. Build production Trie search systems, explore Disjoint Set Union (Union-Find) tree mechanics with Path Compression, and conquer the Week 3 Qualifying Exam.',
      topics: [
        {
          id: 'dsa-w3-d21-t1',
          topicNumber: 1,
          title: 'Disjoint Set Union (DSU / Union-Find) Foundations',
          explanation: [
            'Disjoint Set Union (DSU) maintains a collection of disjoint sets partitioned across elements $0$ to $N - 1$.',
            'Two core operations:',
            '- `find(x)`: Returns the canonical representative (root) of the set containing $x$.',
            '- `union(x, y)`: Merges the set containing $x$ with the set containing $y$.',
            'DSU is represented as an inverted tree where each node points to its parent: `parent[i] = i` initially.',
            'Without optimizations, trees can degenerate to chains of height $N$, making operations $O(N)$.'
          ],
          keyRules: [
            'parent array initializes to parent[i] = i.',
            'find(x) traverses parent pointers to root.'
          ],
          codeSnippet: {
            id: 'dsa-snip-21-1',
            title: 'Naive DSU Implementation',
            description: 'Parent-pointer tree representation',
            language: 'python',
            code: `class NaiveDSU:
    def __init__(self, n: int):
        self.parent = list(range(n))
        
    def find(self, x: int) -> int:
        while x != self.parent[x]:
            x = self.parent[x]
        return x
        
    def union(self, x: int, y: int) -> None:
        root_x = self.find(x)
        root_y = self.find(y)
        if root_x != root_y:
            self.parent[root_x] = root_y`
          },
          pitfall: 'Using naive DSU without optimizations: chaining makes `find()` run in O(N) time, failing graph connectivity algorithms.',
          quickCheck: {
            question: 'What does the find(x) operation return in Disjoint Set Union?',
            options: ['The index x', 'The canonical representative (root) of the set containing x', 'The number of elements in the set', 'True or False'],
            correctIndex: 1,
            explanation: 'find(x) traverses upward through parent pointers until it reaches the root node that uniquely represents that connected component.'
          }
        },
        {
          id: 'dsa-w3-d21-t2',
          topicNumber: 2,
          title: 'DSU Optimization: Path Compression & Union by Rank',
          explanation: [
            'Two optimizations compress DSU from $O(N)$ to nearly $O(1)$ amortized time:',
            '1. **Path Compression**: During `find(x)`, make every node along the path point DIRECTLY to the root: `parent[x] = find(parent[x])`. Flattens tree to height 1!',
            '2. **Union by Rank (or Size)**: Always attach the shorter tree under the root of the taller tree to minimize height growth.',
            'Together, operations run in $O(\\alpha(N))$ time, where $\\alpha$ is the Inverse Ackermann Function ($\\alpha(N) < 5$ for all practical universe inputs, effectively $O(1)$!).'
          ],
          keyRules: [
            'Path compression: parent[x] = find(parent[x]).',
            'Union by rank attaches smaller tree under larger tree root.',
            'Amortized runtime is O(alpha(N)) ~ O(1).'
          ],
          codeSnippet: {
            id: 'dsa-snip-21-2',
            title: 'Optimal DSU with Path Compression and Rank',
            description: 'Inverse Ackermann near-constant time DSU',
            language: 'python',
            code: `class DSU:
    def __init__(self, n: int):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.count = n # connected components count
        
    def find(self, x: int) -> int:
        if self.parent[x] != x:
            # Path compression: points directly to root!
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
        
    def union(self, x: int, y: int) -> bool:
        root_x = self.find(x)
        root_y = self.find(y)
        if root_x == root_y:
            return False # Already in same set!
            
        # Union by rank
        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            self.parent[root_y] = root_x
            self.rank[root_x] += 1
            
        self.count -= 1
        return True

dsu = DSU(5)
dsu.union(0, 1)
dsu.union(1, 2)
print("Are 0 and 2 connected?", dsu.find(0) == dsu.find(2)) # True
print("Are 0 and 3 connected?", dsu.find(0) == dsu.find(3)) # False
print("Connected components:", dsu.count)                 # 3`
          },
          pitfall: 'Omitting path compression: union by rank alone gives O(log N). Path compression alone gives O(log N). ONLY BOTH TOGETHER achieve O(alpha(N)) ~ O(1).',
          quickCheck: {
            question: 'What is the time complexity of DSU operations when combining both Path Compression and Union by Rank?',
            options: ['O(N)', 'O(log N)', 'O(alpha(N)) which is effectively O(1)', 'O(N^2)'],
            correctIndex: 2,
            explanation: 'The combination of path compression and union by rank guarantees that any sequence of M operations takes O(M * alpha(N)) time, where alpha is the inverse Ackermann function (<= 4 in practice).'
          }
        },
        {
          id: 'dsa-w3-d21-t3',
          topicNumber: 3,
          title: 'Redundant Connection: Cycle Detection with DSU',
          explanation: [
            'Problem: Given an undirected graph starting as a tree with $N$ nodes plus ONE additional edge that creates a cycle, find and return that redundant edge.',
            'DSU Cycle Detection Algorithm:',
            '1. Initialize DSU with $N + 1$ elements.',
            '2. For each edge `(u, v)`:',
            '   - If `find(u) == find(v)`: both nodes are ALREADY connected in the same component! Adding this edge creates a cycle. Return `[u, v]` immediately!',
            '   - Else: `union(u, v)` to connect them.',
            'Runs in $O(N \\times \\alpha(N)) \\approx O(N)$ time and $O(N)$ space.'
          ],
          keyRules: [
            'An edge between two nodes already sharing the same root creates a cycle.',
            'O(N) single-pass cycle detection.'
          ],
          codeSnippet: {
            id: 'dsa-snip-21-3',
            title: 'Redundant Connection Cycle Detection',
            description: 'DSU edge inspection finding cycle-creating edge in O(N)',
            language: 'python',
            code: `def find_redundant_connection(edges: list[list[int]]) -> list[int]:
    n = len(edges)
    dsu = DSU(n + 1)
    
    for u, v in edges:
        if not dsu.union(u, v):
            return [u, v] # Redundant edge that creates cycle!
            
    return []

# Triangle cycle: 1-2, 2-3, 3-1
print("Redundant edge:", find_redundant_connection([[1,2], [1,3], [2,3]])) # [2, 3]`
          },
          pitfall: 'Using DFS/BFS for every edge: running DFS to check connectivity for each edge takes O(N^2), whereas DSU achieves near-instant O(N).',
          quickCheck: {
            question: 'How does DSU determine that an edge (u, v) creates a cycle?',
            options: ['If u == v', 'If find(u) == find(v) before union is called', 'If rank[u] > rank[v]', 'If u and v are odd'],
            correctIndex: 1,
            explanation: 'If find(u) == find(v), a path already exists between u and v; adding another direct edge between them forms a cycle.'
          }
        },
        {
          id: 'dsa-w3-d21-t4',
          topicNumber: 4,
          title: 'Number of Connected Components in an Undirected Graph',
          explanation: [
            'Problem: Given $N$ nodes labeled $0$ to $N-1$ and a list of undirected edges, find the total number of connected components.',
            'DSU Solution:',
            '- Initialize `dsu = DSU(n)`. Component count starts at $N$.',
            '- For each edge `(u, v)`: call `dsu.union(u, v)`. If union succeeds (merging two previously separate components), decrement component count by 1.',
            '- Final answer is `dsu.count`!',
            'Runs in $O(N + E \\cdot \\alpha(N))$ time.'
          ],
          keyRules: [
            'Every successful union decreases connected components by 1.',
            'Final component count is n - successful_unions.'
          ],
          codeSnippet: {
            id: 'dsa-snip-21-4',
            title: 'Connected Components via DSU',
            description: 'Tracking component count decrement on union',
            language: 'python',
            code: `def count_components(n: int, edges: list[list[int]]) -> int:
    dsu = DSU(n)
    for u, v in edges:
        dsu.union(u, v)
    return dsu.count

print("Components for 5 nodes with edges [[0,1], [1,2], [3,4]]:", count_components(5, [[0,1], [1,2], [3,4]])) # 2`
          },
          pitfall: 'Counting unique values in `dsu.parent` array: parent pointers are not fully flattened until `find()` is called on every element! Use `dsu.count` or call `len(set(dsu.find(i) for i in range(n)))`.',
          quickCheck: {
            question: 'Why is `len(set(dsu.parent))` an unreliable way to count connected components?',
            options: ['Sets do not support numbers', 'Because some nodes may still point to intermediate ancestors rather than the ultimate root if find() was not called on them', 'Parent array is always empty', 'Python sets are slow'],
            correctIndex: 1,
            explanation: 'Path compression flattens paths only when find() is invoked; inspecting dsu.parent directly includes uncompressed intermediate parent references.'
          }
        },
        {
          id: 'dsa-w3-d21-t5',
          topicNumber: 5,
          title: 'Accounts Merge (DSU String Mapping)',
          explanation: [
            'Problem: Given account names and lists of email addresses, merge accounts that share at least one email address.',
            'Algorithmic Pipeline:',
            '1. Assign unique integer IDs to each email address.',
            '2. Map each email to its owner name.',
            '3. For each account, union all its emails together with its first email in a DSU.',
            '4. Group emails by their canonical DSU root: `groups[dsu.find(email_id)].append(email)`.',
            '5. Sort emails and format output `[name, sorted_emails...]`.'
          ],
          keyRules: [
            'Map emails to integer IDs for fast DSU manipulation.',
            'Union all emails belonging to the same account.'
          ],
          codeSnippet: {
            id: 'dsa-snip-21-5',
            title: 'Accounts Merge via DSU',
            description: 'Grouping shared identity emails with Union-Find',
            language: 'python',
            code: `from collections import defaultdict

def accounts_merge(accounts: list[list[str]]) -> list[list[str]]:
    dsu = DSU(20000)
    email_to_id = {}
    email_to_name = {}
    id_gen = 0
    
    for acc in accounts:
        name = acc[0]
        first_email = acc[1]
        for email in acc[1:]:
            if email not in email_to_id:
                email_to_id[email] = id_gen
                email_to_name[email] = name
                id_gen += 1
            dsu.union(email_to_id[first_email], email_to_id[email])
            
    # Group by DSU representative root
    groups = defaultdict(list)
    for email, eid in email_to_id.items():
        root_id = dsu.find(eid)
        groups[root_id].append(email)
        
    res = []
    for root_id, email_list in groups.items():
        name = email_to_name[email_list[0]]
        res.append([name] + sorted(email_list))
    return res`
          },
          pitfall: 'Assuming people with the same name are the same person: names can be identical (`"John"`), but accounts should merge ONLY if they share at least one email address.',
          quickCheck: {
            question: 'What is the condition for merging two accounts in Accounts Merge?',
            options: ['They have the same name', 'They share at least one identical email address', 'They have the same number of emails', 'They were created on the same day'],
            correctIndex: 1,
            explanation: 'The problem statement specifies that accounts are merged if and only if there is a common email address linking them.'
          }
        },
        {
          id: 'dsa-w3-d21-t6',
          topicNumber: 6,
          title: 'Memory & Cache Layout of Pointer Trees vs Binary Heaps',
          explanation: [
            'Compare hardware performance between Tree structures:',
            '- **Binary Search Trees & Tries**: Node-based pointer structures. Each node requires independent heap allocation. Visiting nodes forces pointer dereferencing, causing frequent CPU L1/L2 cache misses.',
            '- **Binary Heaps**: Contiguous array layout. Elements are stored packed in RAM. Visiting child indices `2i + 1` takes advantage of CPU prefetch buffers.',
            'Whenever priority operations are needed, prefer array heaps over tree-based priority queues.'
          ],
          keyRules: [
            'Array heaps have zero pointer overhead and superior cache locality.',
            'Trie nodes can be flattened into array tables for production engines.'
          ],
          codeSnippet: {
            id: 'dsa-snip-21-6',
            title: 'Cache Locality Demonstration',
            description: 'Array sequential memory vs heap pointer hops',
            language: 'python',
            code: `# Memory Layout Comparison:
# Heap Array: [100, 50, 40, 20, 10] -> Contiguous 20 bytes in RAM (1 cache line!)
# Pointer Tree: Node(100) -> 0x8A40 -> Node(50) -> 0x1F20 -> Node(40) (3 cache misses!)`
          },
          pitfall: 'Assuming Big-O is the only performance metric: an O(N) array scan can outperform an O(log N) tree search for small N due to hardware cache line mechanics.',
          quickCheck: {
            question: 'Why does an array-based binary heap have superior cache locality compared to a pointer-based binary tree?',
            options: ['Array elements reside in contiguous RAM addresses loaded together on CPU cache lines', 'Heaps disable CPU interrupts', 'Arrays use less precision', 'Trees cannot run on 64-bit systems'],
            correctIndex: 0,
            explanation: 'Contiguous array storage allows modern CPUs to fetch 64-byte cache lines that hold multiple adjacent heap elements simultaneously.'
          }
        },
        {
          id: 'dsa-w3-d21-t7',
          topicNumber: 7,
          title: 'Hierarchical Structures Master Interview Checklist',
          explanation: [
            'Before any technical interview on hierarchical structures:',
            '1. Trees: Recursive base cases (`if not root: return ...`), height vs depth, level-size freezing in BFS.',
            '2. BSTs: Inorder traversal is sorted, range validation `(low, high)`, inorder successor replacement for 2-child deletions.',
            '3. Balanced BSTs: AVL balance factor $\\in \\{-1, 0, 1\\}$, Red-Black 5 invariants (root is black, no red-red, equal black height).',
            '4. Heaps: Array index math `(i-1)//2`, `2i+1`, linear $O(N)$ heapify, bounded min-heap for Top-K.',
            '5. Tries: `is_end_of_word` flag, $O(L)$ prefix lookup, dot wildcard DFS, 2D board pruning.',
            '6. DSU: Path compression `parent[x] = find(parent[x])` + union by rank for $O(\\alpha(N))$.'
          ],
          keyRules: [
            'State tree invariants clearly before implementing.',
            'Check boundary conditions (empty root, single node, skewed chain).'
          ],
          codeSnippet: {
            id: 'dsa-snip-21-7',
            title: 'Hierarchical Verification Checklist',
            description: 'Self-check diagnostic routine for tree and heap problems',
            language: 'python',
            code: `def verify_hierarchical_solution(has_empty_root_check: bool,
                                   has_base_case: bool,
                                   has_bounds_check: bool) -> bool:
    return has_empty_root_check and has_base_case and has_bounds_check

print("Code hygiene check passed:", verify_hierarchical_solution(True, True, True))`
          },
          pitfall: 'Forgetting to handle `root is None` as the very first line of tree recursion: triggers immediate `AttributeError: NoneType object has no attribute val`.',
          quickCheck: {
            question: 'What is the first check you should always write in any recursive tree function?',
            options: ['Print the node', 'if not root: return base_case', 'Sort the tree', 'Check if root is leaf'],
            correctIndex: 1,
            explanation: 'Handling the null node base case immediately prevents null pointer exceptions and cleanly terminates recursive leaf branching.'
          }
        },
        {
          id: 'dsa-w3-d21-t8',
          topicNumber: 8,
          title: 'Week 3 Hierarchical Structures Graduation Synthesis',
          explanation: [
            'Congratulations on completing Module 3 of the DSA Mastery Academy!',
            'You have conquered all hierarchical and non-linear data structures:',
            '- Binary Tree DFS (Inorder, Preorder, Postorder) & Morris O(1) space.',
            '- BFS Level-order, Zigzag, Right Side View, and Level-linked trees.',
            '- Lowest Common Ancestor in Binary Trees and Binary Search Trees.',
            '- Binary Search Tree invariants, insertions, and 3-case deletions.',
            '- Self-Balancing Trees: AVL balance factors & Red-Black 5 invariants.',
            '- Binary Heaps, O(N) Floyd Heapify, and Top-K Priority Queues.',
            '- Dual-Heap Dynamic Stream Median Architecture.',
            '- Prefix Trees (Tries), wildcard matching, and Word Search II.',
            '- Disjoint Set Union (Union-Find) with Path Compression and Rank.',
            'Next in Week 4: Graphs (Dijkstra, Topological Sort), Dynamic Programming & Greedy Mastery.'
          ],
          keyRules: [
            'Tree recursion and heap priorities are mastered.',
            'Ready for the Module 3 Qualifying Exam!'
          ],
          codeSnippet: {
            id: 'dsa-snip-21-8',
            title: 'Week 3 Graduation Summary',
            description: 'Milestone summary of hierarchical data structures mastered',
            language: 'python',
            code: `def print_week_3_summary():
    topics = [
        "1. Binary Tree DFS Traversals & Morris O(1) Traversal",
        "2. BFS Level Order, Zigzag & Tree Diameter",
        "3. BST Invariants, Mutations & LCA",
        "4. Balanced BSTs: AVL Rotations & Red-Black Invariants",
        "5. Binary Heaps, Linear Heapify & Priority Queues",
        "6. Dual-Heap Dynamic Median Engine",
        "7. Tries (Prefix Trees) & Word Search II",
        "8. Disjoint Set Union (Union-Find) with Path Compression"
    ]
    print("=== DSA MASTERY ACADEMY: MODULE 3 COMPLETE ===")
    for t in topics:
        print(f" [V] {t}")
    print("\\nReady for Qualifying Exam!")

print_week_3_summary()`
          },
          pitfall: 'Skipping the qualifying exam: verify your structural understanding before moving to graphs and dynamic programming.',
          quickCheck: {
            question: 'What is the time complexity to search for a word of length L in a Trie?',
            options: ['O(N) where N is number of words', 'O(L) independent of dictionary size', 'O(N log N)', 'O(2^L)'],
            correctIndex: 1,
            explanation: 'A Trie traverses exactly L edges from root to leaf, executing in O(L) time regardless of how many words are stored.'
          }
        }
      ]
    }
  ],
  quiz: {
    id: 'dsa-quiz-3',
    weekNumber: 3,
    title: 'Module 3 Qualifying Exam: Trees, BSTs, Heaps & Tries',
    description: 'Verify your mastery of binary tree traversals, BST invariants, heapify algorithms, and prefix Tries.',
    passingScorePercent: 80,
    questions: [
      {
        id: 'dsa-q3-1',
        question: 'Why does Floyd\'s Heapify algorithm construct a binary heap from an unsorted array in O(N) linear time instead of O(N log N)?',
        options: [
          'Because it uses quicksort internally',
          'Because the vast majority of nodes are at or near the leaf levels where sift-down height is 0 or 1, and the mathematical summation converges to O(N)',
          'Because it runs on multiple CPU cores simultaneously',
          'Because heaps do not require sorting'
        ],
        correctIndex: 1,
        explanation: 'In a complete binary tree, half the nodes are leaves (height 0), a quarter have height 1, an eighth have height 2, etc. The sum sum(h / 2^h) converges to a constant, making total work O(N).'
      },
      {
        id: 'dsa-q3-2',
        question: 'What invariant is required for Inorder traversal to output values in strictly ascending sorted order?',
        options: [
          'The tree must be a complete binary tree',
          'The tree must be a valid Binary Search Tree (BST)',
          'The tree must be an AVL tree',
          'The tree must be a Max-Heap'
        ],
        correctIndex: 1,
        explanation: 'In a Binary Search Tree, all left subtree values are smaller and all right subtree values are larger; Left-Root-Right traversal naturally sorts the values.'
      },
      {
        id: 'dsa-q3-3',
        question: 'In an AVL Tree, what sequence of rotations is required to rebalance a Left-Right (LR) dogleg imbalance?',
        options: [
          'A single Right Rotation on the parent',
          'Left Rotate the left child, then Right Rotate the unbalanced parent node',
          'A single Left Rotation on the parent',
          'Two Right Rotations'
        ],
        correctIndex: 1,
        explanation: 'Left-rotating the left child straightens the dogleg into a Left-Left line, which is then balanced by right-rotating the parent node.'
      },
      {
        id: 'dsa-q3-4',
        question: 'How does the Dual-Heap MedianFinder maintain the median of a streaming data source in O(1) retrieval time?',
        options: [
          'By sorting the array on every insertion',
          'By balancing a Max-Heap for the lower half of values and a Min-Heap for the upper half, so the median is always at the heap roots',
          'By storing values in a circular deque',
          'By computing the arithmetic mean'
        ],
        correctIndex: 1,
        explanation: 'Dividing elements into a lower-half max-heap and an upper-half min-heap places the median elements directly at index 0 of the heaps for instant O(1) access.'
      },
      {
        id: 'dsa-q3-5',
        question: 'What combined optimizations allow Disjoint Set Union (Union-Find) to achieve O(alpha(N)) ~ O(1) amortized time per operation?',
        options: [
          'Recursion and Memoization',
          'Path Compression (pointing nodes directly to root during find) and Union by Rank (attaching shorter tree under taller tree)',
          'Binary Search and Two Pointers',
          'Bitwise shifting and hashing'
        ],
        correctIndex: 1,
        explanation: 'Combining path compression (flattening paths during find) with union by rank (minimizing tree height growth) bounds operations to the inverse Ackermann function O(alpha(N)).'
      }
    ]
  }
};
