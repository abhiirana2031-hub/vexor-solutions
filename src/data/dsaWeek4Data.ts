import { WeekModule } from '../types/course';

export const DSA_WEEK_4_MODULE: WeekModule = {
  weekNumber: 4,
  title: 'Graphs, Dynamic Programming, Greedy & Technical Interview Mastery',
  theme: 'Graph Theory, Shortest Paths, Optimal Substructures, Memoization & Algorithmic Synthesis',
  description:
    'Master advanced algorithms: Graph BFS/DFS, Topological Sort (Kahn\'s algorithm), Dijkstra shortest paths, Minimum Spanning Trees (Kruskal/Prim), 1D/2D Dynamic Programming (Knapsack, LCS, Edit Distance), Greedy intervals, Backtracking (N-Queens), and production interview architectures.',
  conceptImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  imageAlt: 'Graph networks, dynamic programming matrices and computational graphs visualization',
  days: [
    {
      id: 'dsa-w4-d22',
      dayNumber: 22,
      weekNumber: 4,
      title: 'Graph Representations & Traversals (BFS & DFS)',
      subtitle: 'Adjacency list vs matrix, BFS shortest paths, DFS connected components & cycle detection',
      durationMinutes: 75,
      overview:
        'Conquer general non-linear graph networks. Compare Adjacency Lists vs Adjacency Matrices, implement Breadth-First Search for unweighted shortest paths, Depth-First Search for connected components, and detect cycles in undirected and directed graphs.',
      topics: [
        {
          id: 'dsa-w4-d22-t1',
          topicNumber: 1,
          title: 'Graph Anatomy: Adjacency List vs Adjacency Matrix',
          explanation: [
            'A Graph $G = (V, E)$ consists of Vertices (nodes) and Edges (connections).',
            'Can be Directed (one-way) or Undirected (bidirectional), Weighted or Unweighted.',
            'Representations:',
            '- **Adjacency Matrix** ($V \\times V$ 2D array): `matrix[u][v] = 1`. Edge lookup is $O(1)$, but space is $O(V^2)$ and iterating neighbors takes $O(V)$. Wasteful for sparse real-world graphs.',
            '- **Adjacency List** (Hash map / Array of lists): `adj[u] = [v1, v2]`. Space is $O(V + E)$, neighbor iteration is $O(\\text{degree}(u))$ (optimal!).',
            'Always use Adjacency Lists unless the graph is extremely dense ($E \\approx V^2$).'
          ],
          keyRules: [
            'Adjacency List space is O(V + E).',
            'For undirected graphs, add edge in BOTH directions: adj[u].append(v); adj[v].append(u).'
          ],
          codeSnippet: {
            id: 'dsa-snip-22-1',
            title: 'Adjacency List Construction',
            description: 'Building an undirected graph from an edge list',
            language: 'python',
            code: `from collections import defaultdict

def build_adj_list(n: int, edges: list[list[int]]) -> dict[int, list[int]]:
    adj = defaultdict(list)
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u) # bidirectional for undirected graph
    return adj

edges = [[0, 1], [0, 2], [1, 2], [2, 3]]
graph = build_adj_list(4, edges)
print("Graph Adjacency List:")
for node, neighbors in graph.items():
    print(f"Node {node} -> {neighbors}")`
          },
          pitfall: 'Using an Adjacency Matrix when V = 100,000: allocating a 100,000 x 100,000 matrix requires 10 billion entries (~40GB RAM), crashing with Memory Limit Exceeded.',
          quickCheck: {
            question: 'What is the space complexity of an Adjacency List for a graph with V vertices and E edges?',
            options: ['O(V^2)', 'O(V + E)', 'O(E^2)', 'O(1)'],
            correctIndex: 1,
            explanation: 'The list stores V array slots and 2E edge endpoints (for undirected graphs), consuming O(V + E) space.'
          }
        },
        {
          id: 'dsa-w4-d22-t2',
          topicNumber: 2,
          title: 'Breadth-First Search (BFS): Shortest Path in Unweighted Graphs',
          explanation: [
            'BFS explores vertices layer-by-layer radiating outward from the source using a FIFO Queue.',
            'THE FUNDAMENTAL BFS GUARANTEE: In any unweighted graph, BFS is GUARANTEED to find the SHORTEST PATH (minimum number of edges) from the source to all reachable nodes!',
            'Maintain a `visited` set to avoid infinite loops in cyclic graphs.',
            'Time: $O(V + E)$ visiting each vertex and edge once. Space: $O(V)$.'
          ],
          keyRules: [
            'Mark nodes as visited IMMEDIATELY upon enqueuing (not upon dequeuing) to prevent duplicate enqueueing.',
            'BFS gives shortest paths ONLY when all edge weights are uniform (unweighted).'
          ],
          codeSnippet: {
            id: 'dsa-snip-22-2',
            title: 'BFS Shortest Path Distance',
            description: 'Queue-based shortest path finder in unweighted graph',
            language: 'python',
            code: `from collections import deque

def bfs_shortest_path(adj: dict, start: int, target: int) -> int:
    visited = {start}
    q = deque([(start, 0)]) # (node, distance)
    
    while q:
        curr, dist = q.popleft()
        if curr == target:
            return dist
            
        for neighbor in adj[curr]:
            if neighbor not in visited:
                visited.add(neighbor) # mark visited on enqueue!
                q.append((neighbor, dist + 1))
                
    return -1 # unreachable

print("Shortest distance 0 to 3:", bfs_shortest_path(graph, 0, 3)) # 2 (0 -> 2 -> 3)`
          },
          pitfall: 'Marking a node visited when it is POPPED from the queue: allows the same node to be enqueued dozens of times by neighboring nodes, causing exponential queue explosion!',
          quickCheck: {
            question: 'When must a node be added to the `visited` set during BFS to prevent redundant queue entries?',
            options: ['When it is popped from the queue', 'Immediately when it is enqueued into the queue', 'At the end of the program', 'Never'],
            correctIndex: 1,
            explanation: 'Marking a node visited at the moment it is pushed into the queue guarantees that no other neighbor can add that same node to the queue again.'
          }
        },
        {
          id: 'dsa-w4-d22-t3',
          topicNumber: 3,
          title: 'Depth-First Search (DFS) & Connected Components',
          explanation: [
            'DFS explores as deep as possible along each branch before backtracking using recursion or an explicit stack.',
            'Use Cases: Finding connected components, topological sorting, path existence, and cycle detection.',
            'To count disconnected islands/components in a graph:',
            '- Iterate from node $0$ to $V - 1$.',
            '- If a node is not yet visited, initiate a DFS to visit its entire connected subgraph, and increment the component count.',
            'Time: $O(V + E)$ across the entire graph.'
          ],
          keyRules: [
            'Outer loop over all vertices handles disconnected graphs.',
            'Time complexity is O(V + E).'
          ],
          codeSnippet: {
            id: 'dsa-snip-22-3',
            title: 'DFS Connected Components Count',
            description: 'Recursive DFS marking all reachable vertices',
            language: 'python',
            code: `def count_connected_components(n: int, adj: dict) -> int:
    visited = set()
    components = 0
    
    def dfs(node: int):
        visited.add(node)
        for neighbor in adj[node]:
            if neighbor not in visited:
                dfs(neighbor)
                
    for i in range(n):
        if i not in visited:
            dfs(i)
            components += 1
            
    return components

disconn_adj = {0: [1], 1: [0], 2: [], 3: [4], 4: [3]}
print("Total components:", count_connected_components(5, disconn_adj)) # 3`
          },
          pitfall: 'Omitting the `visited` set in recursive DFS: on graphs with cycles, infinite recursion will crash the runtime with `RecursionError: maximum recursion depth exceeded`.',
          quickCheck: {
            question: 'What is the time complexity of running DFS on an adjacency list of V vertices and E edges?',
            options: ['O(V^2)', 'O(V + E)', 'O(E log V)', 'O(V * E)'],
            correctIndex: 1,
            explanation: 'DFS visits each vertex once and traverses each edge once (or twice in undirected graphs), executing in O(V + E) time.'
          }
        },
        {
          id: 'dsa-w4-d22-t4',
          topicNumber: 4,
          title: 'Number of Islands (2D Grid Connected Components)',
          explanation: [
            'Problem: Given an $M \\times N$ 2D binary grid of `"1"`s (land) and `"0"`s (water), count the number of islands.',
            'An island is surrounded by water and formed by connecting adjacent lands horizontally or vertically.',
            'Algorithm: Scan all cells $(r, c)$ in the matrix:',
            '- When a `"1"` is encountered: increment island count, and launch a DFS/BFS sink routine that flips all connected `"1"`s to `"0"` (visited in-place!).',
            'Time: $O(M \\times N)$ visiting each cell at most twice. Space: $O(M \\times N)$ recursion stack.'
          ],
          keyRules: [
            'Mutate "1" -> "0" in-place to avoid allocating an O(M * N) visited matrix.',
            'Check grid boundary limits (0 <= r < M and 0 <= c < N).'
          ],
          codeSnippet: {
            id: 'dsa-snip-22-4',
            title: 'Number of Islands via In-Place DFS Sinking',
            description: 'Flood-fill DFS island counting in O(M * N)',
            language: 'python',
            code: `def num_islands(grid: list[list[str]]) -> int:
    if not grid: return 0
    rows, cols = len(grid), len(grid[0])
    islands = 0
    
    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != '1':
            return
        grid[r][c] = '0' # Sink the island in-place!
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)
        
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                islands += 1
                dfs(r, c)
                
    return islands

grid_sample = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]
print("Total Islands:", num_islands(grid_sample)) # 3`
          },
          pitfall: 'Including diagonal neighbors when the problem specifies horizontal and vertical only: check 4 directions `(dr, dc) in [(-1,0), (1,0), (0,-1), (0,1)]`.',
          quickCheck: {
            question: 'Why does flipping grid[r][c] from "1" to "0" eliminate the need for a visited set?',
            options: ['It saves memory by using the grid itself as the visited state: sunken land cannot be revisited', 'It deletes the grid from RAM', 'It sorts the cells', 'It converts strings to ints'],
            correctIndex: 0,
            explanation: 'Once a land cell is converted to water ("0"), future scans will ignore it, functioning as an in-place visited marker.'
          }
        },
        {
          id: 'dsa-w4-d22-t5',
          topicNumber: 5,
          title: 'Cycle Detection in Undirected Graphs (Parent Tracking)',
          explanation: [
            'In an undirected graph, every edge $(u, v)$ is bidirectional, meaning $v$ will naturally list $u$ as a neighbor.',
            'To detect a TRUE cycle (not just walking backward along the edge you just crossed), pass a `parent` parameter in DFS:',
            '- For each neighbor: if `neighbor == parent`, skip it (it\'s the edge we just came from).',
            '- If `neighbor in visited` and `neighbor != parent`: a BACK-EDGE has been found! A cycle exists!',
            'Time: $O(V + E)$.'
          ],
          keyRules: [
            'Skip the immediate parent: if neighbor == parent: continue.',
            'Visiting an already visited non-parent node indicates a cycle.'
          ],
          codeSnippet: {
            id: 'dsa-snip-22-5',
            title: 'Undirected Graph Cycle Detection',
            description: 'DFS cycle detection using parent pointer tracking',
            language: 'python',
            code: `def has_cycle_undirected(n: int, adj: dict) -> bool:
    visited = set()
    
    def dfs(node: int, parent: int) -> bool:
        visited.add(node)
        for neighbor in adj[node]:
            if neighbor not in visited:
                if dfs(neighbor, node): return True
            elif neighbor != parent:
                return True # Found back-edge to visited non-parent!
        return False
        
    for i in range(n):
        if i not in visited:
            if dfs(i, -1): return True
            
    return False

# Graph with cycle: 0-1, 1-2, 2-0
cycle_adj = {0: [1, 2], 1: [0, 2], 2: [1, 0]}
print("Has cycle?", has_cycle_undirected(3, cycle_adj)) # True`
          },
          pitfall: 'Omitting parent tracking in undirected cycle detection: the algorithm will immediately see the parent as a "visited node" and report false positive cycles on simple linear paths like `0 - 1`!',
          quickCheck: {
            question: 'Why must we pass a `parent` parameter during DFS cycle detection in an undirected graph?',
            options: ['To print the tree', 'To avoid mistakenly identifying the bidirectional edge we just crossed from the parent as a cycle', 'Because Python requires 2 arguments', 'To measure tree height'],
            correctIndex: 1,
            explanation: 'Since undirected edges are two-way, the neighbor list of child V contains parent U; skipping parent prevents treating that reverse edge as a cycle.'
          }
        },
        {
          id: 'dsa-w4-d22-t6',
          topicNumber: 6,
          title: 'Cycle Detection in Directed Graphs (3-Color State DFS)',
          explanation: [
            'In a DIRECTED graph, parent tracking does not work. A cycle occurs if and only if an edge points to a node that is CURRENTLY IN THE ACTIVE RECURSION CALL STACK.',
            'The 3-Color State Algorithm:',
            '- **WHITE (0)**: Unvisited.',
            '- **GRAY (1)**: Currently being visited (active on current call stack).',
            '- **BLACK (2)**: Completely processed and all descendants explored.',
            'If DFS encounters a **GRAY** node, a BACK-EDGE exists -> A DIRECTED CYCLE IS DETECTED!'
          ],
          keyRules: [
            'WHITE = 0 (unvisited), GRAY = 1 (visiting/in call stack), BLACK = 2 (visited/safe).',
            'Hitting a GRAY node indicates a directed cycle.'
          ],
          codeSnippet: {
            id: 'dsa-snip-22-6',
            title: 'Directed Graph Cycle Detection (3-Color)',
            description: 'State-based DFS detecting back-edges in directed graph',
            language: 'python',
            code: `WHITE, GRAY, BLACK = 0, 1, 2

def has_cycle_directed(n: int, adj: dict) -> bool:
    state = [WHITE] * n
    
    def dfs(u: int) -> bool:
        state[u] = GRAY # Mark active on call stack
        for v in adj[u]:
            if state[v] == GRAY:
                return True # Cycle! Back-edge to active ancestor!
            if state[v] == WHITE:
                if dfs(v): return True
        state[u] = BLACK # Completely processed
        return False
        
    for i in range(n):
        if state[i] == WHITE:
            if dfs(i): return True
            
    return False

# Directed cycle: 0 -> 1 -> 2 -> 0
d_adj = {0: [1], 1: [2], 2: [0]}
print("Directed graph has cycle?", has_cycle_directed(3, d_adj)) # True`
          },
          pitfall: 'Treating BLACK nodes as cycles: hitting a BLACK node simply means another branch previously explored it; only hitting a GRAY node indicates an ancestor cycle.',
          quickCheck: {
            question: 'In the 3-Color directed cycle detection algorithm, what indicates that a cycle has been discovered?',
            options: ['Encountering a WHITE node', 'Encountering a BLACK node', 'Encountering a GRAY node (active in recursion stack)', 'Reaching an empty neighbor list'],
            correctIndex: 2,
            explanation: 'A GRAY node is currently on the active recursion call stack. Re-encountering it means there is an edge pointing back to an active ancestor, completing a cycle.'
          }
        },
        {
          id: 'dsa-w4-d22-t7',
          topicNumber: 7,
          title: 'Clone Graph: Deep Copying Cyclic Graph Networks',
          explanation: [
            'Problem: Given a reference to a node in a connected undirected graph, return a deep copy (clone) of the graph.',
            'Each node has `val` and a list of `neighbors`.',
            'Cyclic Hazard: Because graphs contain cycles, naive cloning triggers infinite recursion.',
            'Algorithm with Hash Map `old_to_new`:',
            '1. If node is already in `old_to_new`: return the cloned node `old_to_new[node]`.',
            '2. Create clone: `clone = Node(node.val)`.',
            '3. Record in map: `old_to_new[node] = clone` BEFORE recursing on neighbors!',
            '4. For each neighbor: `clone.neighbors.append(clone_graph(neighbor))`.',
            'Runs in $O(V + E)$ time and $O(V)$ space.'
          ],
          keyRules: [
            'Must map old node pointer to new clone node pointer: old_to_new[node] = clone.',
            'Insert clone into map BEFORE processing neighbors to terminate cycles.'
          ],
          codeSnippet: {
            id: 'dsa-snip-22-7',
            title: 'Clone Graph via Hash-Map Assisted DFS',
            description: 'Deep copy of cyclic graph in O(V + E)',
            language: 'python',
            code: `class GraphNode:
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []

def clone_graph(node: GraphNode) -> GraphNode:
    if not node: return None
    old_to_new = {}
    
    def dfs(curr: GraphNode) -> GraphNode:
        if curr in old_to_new:
            return old_to_new[curr] # already cloned
            
        clone = GraphNode(curr.val)
        old_to_new[curr] = clone # register before recursion!
        
        for neighbor in curr.neighbors:
            clone.neighbors.append(dfs(neighbor))
            
        return clone
        
    return dfs(node)`
          },
          pitfall: 'Inserting clone into `old_to_new` AFTER recursing on neighbors: this causes infinite recursion on cyclic graphs because the lookup fails while the cycle is being traversed!',
          quickCheck: {
            question: 'Why must `old_to_new[curr] = clone` occur before recursing on curr.neighbors?',
            options: ['To speed up Python execution', 'So that when a cycle points back to curr, the recursive call returns the existing clone instead of creating an infinite loop', 'To sort the neighbors', 'Because values are immutable'],
            correctIndex: 1,
            explanation: 'Registering the clone immediately breaks cyclic recursion by allowing recursive calls on neighbors that loop back to retrieve the existing clone instance.'
          }
        },
        {
          id: 'dsa-w4-d22-t8',
          topicNumber: 8,
          title: 'Rotting Oranges: Multi-Source BFS',
          explanation: [
            'Problem: In a 2D grid, fresh oranges (`1`) turn rotten (`2`) if adjacent to a rotten orange. Each minute, all fresh oranges 4-directionally adjacent to ANY rotten orange rot. Find minimum minutes until no fresh orange remains.',
            'Standard BFS starts from ONE source node.',
            'Multi-Source BFS Pattern:',
            '1. Scan grid: enqueue ALL initially rotten oranges into the queue at minute 0!',
            '2. Count total fresh oranges.',
            '3. Run level-order BFS: each minute level rots adjacent fresh oranges, decrements fresh count, and enqueues newly rotten oranges.',
            '4. Return minutes elapsed if `fresh == 0`, else -1.'
          ],
          keyRules: [
            'Enqueue all sources into the queue before starting the BFS loop.',
            'Decrements fresh count to determine if isolated oranges remain.'
          ],
          codeSnippet: {
            id: 'dsa-snip-22-8',
            title: 'Rotting Oranges Multi-Source BFS',
            description: 'Simultaneous multi-source expansion in O(R * C)',
            language: 'python',
            code: `from collections import deque

def oranges_rotting(grid: list[list[int]]) -> int:
    rows, cols = len(grid), len(grid[0])
    q = deque()
    fresh = 0
    
    # 1. Enqueue all rotten oranges and count fresh
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2: q.append((r, c))
            elif grid[r][c] == 1: fresh += 1
            
    if fresh == 0: return 0
    minutes = 0
    
    # 2. Multi-source BFS
    while q and fresh > 0:
        minutes += 1
        for _ in range(len(q)):
            r, c = q.popleft()
            for dr, dc in [(-1,0), (1,0), (0,-1), (0,1)]:
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                    grid[nr][nc] = 2 # rot orange
                    fresh -= 1
                    q.append((nr, nc))
                    
    return minutes if fresh == 0 else -1

orange_grid = [[2,1,1],[1,1,0],[0,1,1]]
print("Minutes to rot all:", oranges_rotting(orange_grid)) # 4`
          },
          pitfall: 'Running individual BFS searches from each rotten orange sequentially: this calculates independent spread rather than simultaneous multi-source rotting!',
          quickCheck: {
            question: 'What defines the Multi-Source BFS algorithmic pattern?',
            options: ['Running BFS on multiple CPU cores', 'Pushing all initial source nodes into the queue at time 0 before initiating the BFS loop', 'Using multiple queues', 'Sorting the matrix'],
            correctIndex: 1,
            explanation: 'Multi-source BFS begins with all source nodes in the queue simultaneously, simulating concurrent parallel wave expansion across the grid.'
          }
        }
      ]
    },
    {
      id: 'dsa-w4-d23',
      dayNumber: 23,
      weekNumber: 4,
      title: 'Topological Sort & Dijkstra\'s Shortest Path',
      subtitle: 'DAG ordering, Kahn\'s algorithm, Course Schedule I & II, and Dijkstra with min-priority queues',
      durationMinutes: 75,
      overview:
        'Master the two most important advanced graph algorithms in computer science: Topological Sorting on Directed Acyclic Graphs (DAGs) using Kahn\'s algorithm and in-degrees, and Dijkstra\'s Algorithm using Min-Heaps for shortest paths in non-negative weighted graphs.',
      topics: [
        {
          id: 'dsa-w4-d23-t1',
          topicNumber: 1,
          title: 'Topological Sort & Directed Acyclic Graphs (DAG)',
          explanation: [
            'A Topological Sort of a directed graph is a linear ordering of its vertices such that for every directed edge $U \\to V$, vertex $U$ comes BEFORE vertex $V$ in the ordering.',
            'Fundamental Law: A graph has a topological sort IF AND ONLY IF it is a Directed Acyclic Graph (DAG). If the graph contains a cycle, no valid topological order exists.',
            'Applications:',
            '- Build task dependency schedulers (Makefile, CMake).',
            '- College course prerequisites.',
            '- Package dependency resolution (npm, pip, cargo).'
          ],
          keyRules: [
            'Only valid on Directed Acyclic Graphs (DAGs).',
            'If the topological sort output contains fewer than V vertices, a cycle exists!'
          ],
          codeSnippet: {
            id: 'dsa-snip-23-1',
            title: 'Topological Order Concept',
            description: 'Task dependency ordering in DAG',
            language: 'python',
            code: `# Dependency: Task A -> Task B (A must finish before B)
# Dependency: Task B -> Task C
# Valid Topological Sort: [A, B, C]`
          },
          pitfall: 'Attempting topological sort on an undirected graph: topological sorting is mathematically defined ONLY for directed graphs.',
          quickCheck: {
            question: 'Under what condition does a directed graph possess a valid topological sort?',
            options: ['If all edge weights are equal', 'If and only if it is a Directed Acyclic Graph (contains no directed cycles)', 'If it is a complete graph', 'If it has an even number of vertices'],
            correctIndex: 1,
            explanation: 'Any cycle creates a circular dependency where no node can be placed first, making topological sorting possible only on DAGs.'
          }
        },
        {
          id: 'dsa-w4-d23-t2',
          topicNumber: 2,
          title: 'Kahn\'s Algorithm: BFS In-Degree Queue Topological Sort',
          explanation: [
            'Kahn\'s Algorithm computes topological sort using In-Degrees (number of incoming directed edges):',
            '1. Calculate `in_degree[u]` for all nodes.',
            '2. Enqueue all nodes with `in_degree == 0` into a FIFO queue (nodes with zero prerequisites!).',
            '3. While queue is not empty:',
            '   a. Pop node $U$, append to `topological_order`.',
            '   b. For each neighbor $V$ of $U$: decrement `in_degree[v] -= 1`.',
            '   c. If `in_degree[v] == 0`: enqueue $V$!',
            '4. If `len(topological_order) == V`, return order. Else: graph has a cycle!'
          ],
          keyRules: [
            'Queue holds nodes with in_degree == 0.',
            'If result length < V, a cycle prevented some nodes from ever reaching in-degree 0.'
          ],
          codeSnippet: {
            id: 'dsa-snip-23-2',
            title: 'Kahns Algorithm Implementation',
            description: 'In-degree queue topological sort in O(V + E)',
            language: 'python',
            code: `from collections import deque, defaultdict

def kahns_topological_sort(n: int, edges: list[list[int]]) -> list[int]:
    adj = defaultdict(list)
    in_degree = [0] * n
    
    for u, v in edges: # u -> v
        adj[u].append(v)
        in_degree[v] += 1
        
    # Enqueue nodes with 0 incoming dependencies
    q = deque([i for i in range(n) if in_degree[i] == 0])
    order = []
    
    while q:
        u = q.popleft()
        order.append(u)
        for v in adj[u]:
            in_degree[v] -= 1
            if in_degree[v] == 0:
                q.append(v)
                
    if len(order) == n:
        return order
    return [] # Cycle detected!

dag_edges = [[0, 1], [0, 2], [1, 3], [2, 3]]
print("Topological Sort:", kahns_topological_sort(4, dag_edges)) # [0, 1, 2, 3] or [0, 2, 1, 3]`
          },
          pitfall: 'Reversing edge direction: if `[a, b]` means "to take course `a`, you must take `b` first", the directed edge is `b -> a`, so `in_degree[a]` increments, NOT `in_degree[b]`.',
          quickCheck: {
            question: 'How does Kahns algorithm detect that a directed graph contains a cycle?',
            options: ['It throws an exception', 'The number of processed nodes in the final order is strictly less than the total number of vertices V', 'The queue never terminates', 'In-degrees become negative'],
            correctIndex: 1,
            explanation: 'Nodes trapped inside a cycle will never see their in-degrees drop to 0, leaving them unvisited and resulting in len(order) < V.'
          }
        },
        {
          id: 'dsa-w4-d23-t3',
          topicNumber: 3,
          title: 'Course Schedule I & II',
          explanation: [
            '- **Course Schedule I**: Can you finish all courses given prerequisite pairs `[course, prereq]`? Return `True` if topological sort is valid (no cycles), `False` if cycle exists.',
            '- **Course Schedule II**: Return the actual ordering of courses. If impossible, return `[]`.',
            'Construct edge `prereq -> course`. Calculate in-degrees. Apply Kahn\'s algorithm in $O(V + E)$ time and $O(V + E)$ space.'
          ],
          keyRules: [
            'prerequisites: [a, b] means b must be taken before a (edge b -> a).',
            'Course Schedule I: len(order) == numCourses.',
            'Course Schedule II: return order if len(order) == numCourses else [].'
          ],
          codeSnippet: {
            id: 'dsa-snip-23-3',
            title: 'Course Schedule II Implementation',
            description: 'Returning valid course schedule ordering via Kahn algorithm',
            language: 'python',
            code: `def find_course_order(numCourses: int, prerequisites: list[list[int]]) -> list[int]:
    adj = [[] for _ in range(numCourses)]
    in_degree = [0] * numCourses
    
    for course, prereq in prerequisites:
        adj[prereq].append(course) # prereq -> course
        in_degree[course] += 1
        
    q = deque([i for i in range(numCourses) if in_degree[i] == 0])
    order = []
    
    while q:
        curr = q.popleft()
        order.append(curr)
        for next_course in adj[curr]:
            in_degree[next_course] -= 1
            if in_degree[next_course] == 0:
                q.append(next_course)
                
    return order if len(order) == numCourses else []

print("Course Order:", find_course_order(4, [[1,0],[2,0],[3,1],[3,2]])) # [0, 1, 2, 3]`
          },
          pitfall: 'Inverting dependency direction: putting `course -> prereq` produces the reverse schedule that forces taking advanced courses before introductory prerequisites.',
          quickCheck: {
            question: 'If prerequisite pair is [1, 0], which way does the directed dependency edge point?',
            options: ['1 -> 0', '0 -> 1', 'Bidirectional', 'No edge'],
            correctIndex: 1,
            explanation: 'Course 0 is the prerequisite that must be taken before course 1, so the flow of progression is 0 -> 1.'
          }
        },
        {
          id: 'dsa-w4-d23-t4',
          topicNumber: 4,
          title: 'Alien Dictionary (Topological Sort from Lexicographical Order)',
          explanation: [
            'Problem: Given a sorted dictionary of an alien language, derive the alphabetical ordering of the alien letters.',
            'Algorithm:',
            '1. Compare adjacent words pairwise: find the FIRST mismatching character `c1 != c2`. This gives a directed dependency `c1 -> c2` (`c1` comes before `c2`).',
            '2. Edge case: If word $B$ is a prefix of word $A$ and appears AFTER word $A$ (e.g. `["abc", "ab"]`), the dictionary is INVALID! Return `""`.',
            '3. Run Kahn\'s Topological Sort on the character graph.'
          ],
          keyRules: [
            'Only the FIRST mismatching character between adjacent words establishes an edge.',
            'Prefix validation: if word2 is prefix of word1 and shorter, return "" immediately.'
          ],
          codeSnippet: {
            id: 'dsa-snip-23-4',
            title: 'Alien Dictionary Graph Construction',
            description: 'Extracting character order from sorted alien word list',
            language: 'python',
            code: `def alien_order(words: list[str]) -> str:
    adj = {c: set() for w in words for c in w}
    in_degree = {c: 0 for c in adj}
    
    for i in range(len(words) - 1):
        w1, w2 = words[i], words[i + 1]
        min_len = min(len(w1), len(w2))
        if len(w1) > len(w2) and w1[:min_len] == w2[:min_len]:
            return "" # Invalid prefix order!
            
        for j in range(min_len):
            if w1[j] != w2[j]:
                if w2[j] not in adj[w1[j]]:
                    adj[w1[j]].add(w2[j])
                    in_degree[w2[j]] += 1
                break # only first mismatch matters
                
    q = deque([c for c in in_degree if in_degree[c] == 0])
    res = []
    while q:
        c = q.popleft()
        res.append(c)
        for neighbor in adj[c]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                q.append(neighbor)
                
    return "".join(res) if len(res) == len(in_degree) else ""

print("Alien alphabet:", alien_order(["wrt","wrf","er","ett","rftt"])) # "wertf"`
          },
          pitfall: 'Continuing to compare subsequent characters after the first mismatch: only the first differing character defines the ordering relation; subsequent characters have no ordering significance.',
          quickCheck: {
            question: 'Why does alien_order stop comparing two words after finding the first differing character?',
            options: ['To save CPU instructions', 'Because in lexicographical sorting, only the first mismatching character determines which word precedes the other', 'Subsequent characters are identical', 'Python strings truncate'],
            correctIndex: 1,
            explanation: 'Just like "apple" precedes "banana" solely because \'a\' < \'b\', subsequent letters play no role in the pairwise ordering.'
          }
        },
        {
          id: 'dsa-w4-d23-t5',
          topicNumber: 5,
          title: 'Dijkstra\'s Shortest Path Algorithm (The Gold Standard)',
          explanation: [
            'Dijkstra\'s Algorithm finds the shortest path from a source vertex to all other vertices in a weighted graph with NON-NEGATIVE edge weights.',
            'Greedy Min-Heap Mechanics:',
            '1. Maintain `dist = {node: inf}`. Set `dist[source] = 0`.',
            '2. Min-Heap stores pairs `(distance, node)`. Push `(0, source)`.',
            '3. While heap is not empty:',
            '   a. Pop `(d, u)` with the smallest distance.',
            '   b. If `d > dist[u]`: this is a stale/outdated heap entry! Skip it (`continue`).',
            '   c. For each edge `(u, v, weight)`: if `d + weight < dist[v]`:',
            '      `dist[v] = d + weight`, and push `(dist[v], v)` onto heap!',
            'Time Complexity: $O((V + E) \\log V)$ using a binary min-heap.'
          ],
          keyRules: [
            'REQUIRES non-negative edge weights (weights >= 0). Fails with negative weights (use Bellman-Ford).',
            'Stale entry check: if d > dist[u]: continue.'
          ],
          codeSnippet: {
            id: 'dsa-snip-23-5',
            title: 'Dijkstras Shortest Path Implementation',
            description: 'Min-heap priority queue shortest path in O((V + E) log V)',
            language: 'python',
            code: `import heapq

def dijkstra(n: int, edges: list[list[int]], src: int) -> dict[int, int]:
    # edges: [u, v, weight]
    adj = defaultdict(list)
    for u, v, w in edges:
        adj[u].append((v, w))
        
    dist = {i: float('inf') for i in range(n)}
    dist[src] = 0
    pq = [(0, src)] # (distance, node)
    
    while pq:
        d, u = heapq.heappop(pq)
        
        # Skip stale entries
        if d > dist[u]:
            continue
            
        for v, weight in adj[u]:
            new_dist = d + weight
            if new_dist < dist[v]:
                dist[v] = new_dist
                heapq.heappush(pq, (new_dist, v))
                
    return dist

w_edges = [[0, 1, 4], [0, 2, 1], [2, 1, 2], [1, 3, 1], [2, 3, 5]]
print("Shortest distances from 0:", dijkstra(4, w_edges, 0)) # {0: 0, 1: 3, 2: 1, 3: 4}`
          },
          pitfall: 'Omitting the `if d > dist[u]: continue` stale check: Python `heapq` does not support `decrease_key`, so multiple entries for the same node accumulate. Without the stale check, runtime degrades drastically.',
          quickCheck: {
            question: 'Why does Dijkstra algorithm fail when a graph contains negative edge weights?',
            options: ['Min-heaps cannot store negative numbers', 'Its greedy assumption is broken: once a node is popped, Dijkstra assumes its shortest path is permanently finalized, which negative edges can later invalidate', 'Python raises a ValueError', 'Edge weights must be integers'],
            correctIndex: 1,
            explanation: 'Dijkstra greedily marks a node distance finalized once popped; a subsequent negative edge could offer a cheaper path to that finalized node, violating the greedy invariant.'
          }
        },
        {
          id: 'dsa-w4-d23-t6',
          topicNumber: 6,
          title: 'Network Delay Time (LeetCode 743 - Dijkstra Benchmark)',
          explanation: [
            'Problem: You are given network travel times between $N$ nodes labeled $1$ to $N$. Send a signal from node $K$. Return the minimum time for all $N$ nodes to receive the signal, or -1 if unreachable.',
            'Solution:',
            '- Run Dijkstra starting from source $K$.',
            '- Time for ALL nodes to receive the signal is the MAXIMUM shortest path distance: $\\max(\\text{dist}[1..N])$.',
            '- If any node has distance $\\infty$, return -1.'
          ],
          keyRules: [
            'Result is max(dist.values()).',
            'Verify all N nodes were reached.'
          ],
          codeSnippet: {
            id: 'dsa-snip-23-6',
            title: 'Network Delay Time via Dijkstra',
            description: 'Calculating maximum signal propagation latency',
            language: 'python',
            code: `def network_delay_time(times: list[list[int]], n: int, k: int) -> int:
    adj = defaultdict(list)
    for u, v, w in times:
        adj[u].append((v, w))
        
    dist = {}
    pq = [(0, k)]
    
    while pq:
        d, u = heapq.heappop(pq)
        if u in dist: continue
        dist[u] = d
        
        for v, w in adj[u]:
            if v not in dist:
                heapq.heappush(pq, (d + w, v))
                
    if len(dist) == n:
        return max(dist.values())
    return -1

times = [[2,1,1],[2,3,1],[3,4,1]]
print("Network Delay Time from node 2:", network_delay_time(times, 4, 2)) # 2`
          },
          pitfall: 'Summing the distances instead of taking the maximum: signal propagates in parallel across all branches, so total time is bounded by the slowest branch (`max(dist)`).',
          quickCheck: {
            question: 'Why is the network delay time equal to max(dist) rather than sum(dist)?',
            options: ['Because only one packet can exist', 'Because signals travel concurrently in parallel across all edges, so all nodes receive the signal by the time the most distant node receives it', 'To save memory', 'Because sum is too large'],
            correctIndex: 1,
            explanation: 'Signals propagate in parallel; the total elapsed time until all nodes receive the signal is dictated by the node that takes the longest time.'
          }
        },
        {
          id: 'dsa-w4-d23-t7',
          topicNumber: 7,
          title: 'Bellman-Ford Algorithm: Negative Weights & Negative Cycles',
          explanation: [
            'When edge weights can be NEGATIVE, Dijkstra fails.',
            'The Bellman-Ford Algorithm relaxes ALL $E$ edges $V - 1$ times:',
            '- A simple path in a graph with $V$ vertices has at most $V - 1$ edges.',
            '- Therefore, $V - 1$ relaxation passes guarantee shortest path convergence.',
            '- **Negative Cycle Detection**: If a $V$-th pass can STILL relax any edge (`dist[u] + w < dist[v]`), then a NEGATIVE CYCLE exists (paths can decrease infinitely to $-\\infty$)!',
            'Time Complexity: $O(V \\times E)$.'
          ],
          keyRules: [
            'Relaxes all edges V - 1 times.',
            'A 14th pass relaxation proves the existence of a negative cycle.',
            'Runs in O(V * E) time.'
          ],
          codeSnippet: {
            id: 'dsa-snip-23-7',
            title: 'Bellman-Ford with Negative Cycle Detection',
            description: 'Shortest paths with negative weights in O(V * E)',
            language: 'python',
            code: `def bellman_ford(n: int, edges: list[list[int]], src: int):
    dist = [float('inf')] * n
    dist[src] = 0
    
    # 1. Relax edges V - 1 times
    for _ in range(n - 1):
        for u, v, w in edges:
            if dist[u] != float('inf') and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                
    # 2. Check for negative weight cycles
    for u, v, w in edges:
        if dist[u] != float('inf') and dist[u] + w < dist[v]:
            raise ValueError("Graph contains a negative weight cycle!")
            
    return dist

bf_edges = [[0, 1, 4], [0, 2, 5], [1, 2, -3], [2, 3, 2]]
print("Bellman-Ford distances:", bellman_ford(4, bf_edges, 0)) # [0, 4, 1, 3]`
          },
          pitfall: 'Using Bellman-Ford when all edge weights are positive: Dijkstra is vastly faster ($O((V + E) \\log V)$ vs $O(V \\times E)$).',
          quickCheck: {
            question: 'How does Bellman-Ford detect that a graph contains a negative-weight cycle?',
            options: ['If edge weights are negative', 'If any edge can still be relaxed on the V-th iteration pass', 'If the graph is directed', 'If dist[src] < 0'],
            correctIndex: 1,
            explanation: 'In a graph without negative cycles, all shortest paths must converge in at most V - 1 edges; if an edge can still be relaxed on step V, an infinite negative cycle exists.'
          }
        },
        {
          id: 'dsa-w4-d23-t8',
          topicNumber: 8,
          title: 'Floyd-Warshall: All-Pairs Shortest Paths in O(V³)',
          explanation: [
            'When you need the shortest path between EVERY pair of vertices $(u, v)$:',
            'Dynamic Programming formulation over intermediate nodes $k$ from $0$ to $V - 1$:',
            '$\\text{dist}[i][j] = \\min(\\text{dist}[i][j], \\text{dist}[i][k] + \\text{dist}[k][j])$.',
            'Three nested loops: `for k in range(V): for i in range(V): for j in range(V)`.',
            'Time: $O(V^3)$. Space: $O(V^2)$. Simple to write, optimal for dense graphs with $V \\le 500$.'
          ],
          keyRules: [
            'The loop over intermediate node k MUST be the OUTERMOST loop!',
            'Handles negative weights (no negative cycles).'
          ],
          codeSnippet: {
            id: 'dsa-snip-23-8',
            title: 'Floyd-Warshall All-Pairs Algorithm',
            description: 'O(V^3) matrix dynamic programming for all pairs',
            language: 'python',
            code: `def floyd_warshall(n: int, edges: list[list[int]]) -> list[list[float]]:
    dist = [[float('inf')] * n for _ in range(n)]
    for i in range(n): dist[i][i] = 0
    for u, v, w in edges: dist[u][v] = w
    
    # k must be the OUTERMOST loop!
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]
                    
    return dist

fw_edges = [[0, 1, 3], [1, 2, 1], [0, 2, 8]]
matrix = floyd_warshall(3, fw_edges)
print("Shortest path 0 to 2 via node 1:", matrix[0][2]) # 4 (3 + 1)`
          },
          pitfall: 'Placing loop `k` as the inner loop: makes the algorithm fail completely because it evaluates paths using higher intermediate nodes before all lower nodes have converged.',
          quickCheck: {
            question: 'Why MUST the intermediate node loop `k` be the outermost loop in Floyd-Warshall?',
            options: ['Python syntax requires it', 'Because DP state dist[i][j] at step k represents shortest paths using intermediate nodes strictly from set {0..k-1}', 'To optimize cache prefetching', 'To prevent division by zero'],
            correctIndex: 1,
            explanation: 'The DP invariant relies on incrementally allowing vertex k to be used as an intermediate stepping stone for all pairs (i, j).'
          }
        }
      ]
    },
    {
      id: 'dsa-w4-d24',
      dayNumber: 24,
      weekNumber: 4,
      title: 'Minimum Spanning Trees & Advanced Network Algorithms',
      subtitle: 'Kruskal\'s algorithm with DSU, Prim\'s algorithm with priority queues & Chepeast Flights Within K Stops',
      durationMinutes: 70,
      overview:
        'Explore minimum cost tree connectivity in weighted graphs. Master Minimum Spanning Tree (MST) algorithms: Kruskal\'s greedy edge-sorting with DSU, Prim\'s vertex expansion with Min-Heaps, and constrained Bellman-Ford for Cheapest Flights Within K Stops.',
      topics: [
        {
          id: 'dsa-w4-d24-t1',
          topicNumber: 1,
          title: 'Minimum Spanning Tree (MST) Concept & Cut Property',
          explanation: [
            'A Spanning Tree of a connected undirected weighted graph $G = (V, E)$ is a subgraph that connects all $V$ vertices with exactly $V - 1$ edges and no cycles.',
            'The Minimum Spanning Tree (MST) is the spanning tree that minimizes the TOTAL SUM of edge weights.',
            'The Cut Property: For any partition (cut) of vertices into two sets $S$ and $V \\setminus S$, the minimum weight edge crossing the cut MUST belong to the MST.',
            'This greedy property guarantees correctness for both Kruskal\'s and Prim\'s algorithms.'
          ],
          keyRules: [
            'An MST on V vertices always contains exactly V - 1 edges.',
            'If all edge weights are distinct, the MST is unique.'
          ],
          codeSnippet: {
            id: 'dsa-snip-24-1',
            title: 'MST Properties Verification',
            description: 'Checking spanning tree edge count and acyclic property',
            language: 'python',
            code: `# MST Theorem:
# 1. Total vertices connected = V
# 2. Total edges in MST = V - 1
# 3. Contains 0 cycles`
          },
          pitfall: 'Confusing an MST with Shortest Path Tree: an MST minimizes the global total wire length, NOT the distance from a specific source node.',
          quickCheck: {
            question: 'How many edges does a Minimum Spanning Tree contain for a connected graph of V vertices?',
            options: ['V', 'V - 1', 'V + 1', 'E / 2'],
            correctIndex: 1,
            explanation: 'Any tree connecting V vertices without cycles must possess exactly V - 1 edges.'
          }
        },
        {
          id: 'dsa-w4-d24-t2',
          topicNumber: 2,
          title: 'Kruskal\'s Algorithm: Greedy Edge Sorting with DSU',
          explanation: [
            'Kruskal\'s Algorithm builds an MST by sorting edges:',
            '1. Sort all $E$ edges in ascending order of weight: $O(E \\log E)$.',
            '2. Initialize a DSU with $V$ vertices.',
            '3. Iterate through sorted edges `(w, u, v)`:',
            '   - If `dsu.union(u, v)` succeeds (they were not already in the same component): add edge to MST and add $w$ to total cost!',
            '   - If `dsu.union(u, v)` returns False: adding this edge would create a cycle! Skip it.',
            '4. Stop when $V - 1$ edges have been added.',
            'Time: $O(E \\log E)$ sorting dominates. Optimal for sparse graphs.'
          ],
          keyRules: [
            'Sort edges first by weight.',
            'Use DSU to avoid adding cycle-creating edges in O(alpha(V)).'
          ],
          codeSnippet: {
            id: 'dsa-snip-24-2',
            title: 'Kruskals Algorithm Implementation',
            description: 'Greedy edge selection with DSU in O(E log E)',
            language: 'python',
            code: `def kruskals_mst(n: int, edges: list[list[int]]) -> int:
    # edges: [u, v, weight]
    edges.sort(key=lambda x: x[2]) # sort by weight ascending
    dsu = DSU(n)
    mst_cost = 0
    edges_added = 0
    
    for u, v, w in edges:
        if dsu.union(u, v):
            mst_cost += w
            edges_added += 1
            if edges_added == n - 1:
                break
                
    return mst_cost if edges_added == n - 1 else -1

sample_edges = [[0, 1, 10], [0, 2, 6], [0, 3, 5], [1, 3, 15], [2, 3, 4]]
print("Minimum Spanning Tree Cost:", kruskals_mst(4, sample_edges)) # 19 (edges 4 + 5 + 10)`
          },
          pitfall: 'Running Kruskal\'s on a disconnected graph: if `edges_added < n - 1`, the graph was disconnected and no single spanning tree exists.',
          quickCheck: {
            question: 'What is the dominant time complexity factor in Kruskal\'s algorithm?',
            options: ['DSU union operations', 'Sorting all E edges by weight: O(E log E)', 'Printing the tree', 'Initializing vertices'],
            correctIndex: 1,
            explanation: 'Sorting the edge list takes O(E log E), while the subsequent DSU operations take near-linear O(E * alpha(V)).'
          }
        },
        {
          id: 'dsa-w4-d24-t3',
          topicNumber: 3,
          title: 'Prim\'s Algorithm: Vertex Expansion with Priority Queues',
          explanation: [
            'While Kruskal\'s grows a forest of edges, Prim\'s grows a single tree outward from an initial vertex.',
            '1. Start at arbitrary node (e.g. node 0). Mark visited.',
            '2. Min-Heap stores available cut edges: `(weight, neighbor)`. Push all edges from node 0.',
            '3. While heap is not empty and visited count $< V$:',
            '   a. Pop edge `(w, v)` with smallest weight.',
            '   b. If $v$ is already visited: skip.',
            '   c. Mark $v$ visited, add $w$ to MST cost.',
            '   d. For all unvisited neighbors of $v$: push their edges into the heap.',
            'Time: $O((V + E) \\log V)$ using binary min-heap.'
          ],
          keyRules: [
            'Grows a single connected component continuously.',
            'Optimal for dense graphs using an adjacency matrix (O(V^2)).'
          ],
          codeSnippet: {
            id: 'dsa-snip-24-3',
            title: 'Prims MST Algorithm',
            description: 'Priority queue cut-edge expansion in O(E log V)',
            language: 'python',
            code: `import heapq
from collections import defaultdict

def prims_mst(n: int, edges: list[list[int]]) -> int:
    adj = defaultdict(list)
    for u, v, w in edges:
        adj[u].append((v, w))
        adj[v].append((u, w))
        
    visited = set()
    pq = [(0, 0)] # (weight, node) starting at node 0
    mst_cost = 0
    
    while pq and len(visited) < n:
        w, u = heapq.heappop(pq)
        if u in visited: continue
        visited.add(u)
        mst_cost += w
        
        for v, weight in adj[u]:
            if v not in visited:
                heapq.heappush(pq, (weight, v))
                
    return mst_cost if len(visited) == n else -1

print("Prims MST Cost:", prims_mst(4, sample_edges)) # 19`
          },
          pitfall: 'Omitting the `if u in visited: continue` check: multiple edges leading to the same node accumulate in the heap; failure to skip visited nodes causes duplicate weight additions.',
          quickCheck: {
            question: 'When is Prim\'s algorithm asymptotically superior to Kruskal\'s algorithm?',
            options: ['On sparse graphs with few edges', 'On dense graphs where E is close to V^2', 'When all weights are negative', 'When the graph is directed'],
            correctIndex: 1,
            explanation: 'On dense graphs, Kruskal\'s sorts V^2 edges (O(V^2 log V)), while Prim\'s with adjacency matrix runs in O(V^2).'
          }
        },
        {
          id: 'dsa-w4-d24-t4',
          topicNumber: 4,
          title: 'Cheapest Flights Within K Stops (Constrained Bellman-Ford)',
          explanation: [
            'Problem: Find the cheapest price from `src` to `dst` with AT MOST $K$ stops (at most $K + 1$ flight edges).',
            'Dijkstra fails because a cheaper path with MORE than $K$ stops can prematurely finalize distances.',
            'Constrained Bellman-Ford Approach:',
            '- Run exactly $K + 1$ iterations.',
            '- Crucial Invariant: Copy the distance array (`prev_dist = dist.copy()`) at the start of each iteration so you ONLY use flights from the PREVIOUS iteration step!',
            'This guarantees paths use at most $K + 1$ edges in $O(K \\times E)$ time.'
          ],
          keyRules: [
            'Must use a copy of previous distances: `prev = dist.copy()`.',
            'Updates use `prev[u] + cost` to prevent cascading through multiple flights in a single iteration.'
          ],
          codeSnippet: {
            id: 'dsa-snip-24-4',
            title: 'Cheapest Flights Within K Stops',
            description: 'Layered Bellman-Ford with distance array snapshots',
            language: 'python',
            code: `def find_cheapest_price(n: int, flights: list[list[int]], src: int, dst: int, k: int) -> int:
    dist = [float('inf')] * n
    dist[src] = 0
    
    # Run at most K + 1 iterations
    for _ in range(k + 1):
        prev_dist = dist.copy() # Snapshot previous layer!
        for u, v, price in flights:
            if prev_dist[u] != float('inf') and prev_dist[u] + price < dist[v]:
                dist[v] = prev_dist[u] + price
                
    return dist[dst] if dist[dst] != float('inf') else -1

flights = [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]]
print("Cheapest price within 1 stop:", find_cheapest_price(4, flights, 0, 3, 1)) # 700 (0 -> 1 -> 3)`
          },
          pitfall: 'Updating `dist` directly without the snapshot `prev_dist`: in a single iteration, updates can chain across 3 or 4 flights, violating the exact stop constraint!',
          quickCheck: {
            question: 'Why must we copy `dist` before each iteration in Cheapest Flights Within K Stops?',
            options: ['To free memory', 'To ensure that each iteration only advances paths by exactly one edge from the previous step, strictly enforcing the K stops limit', 'To reverse the flights', 'Because arrays are immutable'],
            correctIndex: 1,
            explanation: 'Using the snapshot prevents intra-iteration cascading, ensuring iteration `i` evaluates paths with at most `i` edges.'
          }
        },
        {
          id: 'dsa-w4-d24-t5',
          topicNumber: 5,
          title: 'Minimum Cost to Connect All Points (Manhattan MST)',
          explanation: [
            'Problem: Given 2D coordinates `points[i] = [xi, yi]`, find the minimum cost to connect all points such that there is a path between any two points. Cost between points is Manhattan distance $|x_i - x_j| + |y_i - y_j|$.',
            'This is an implicit Complete Graph ($E = \\frac{N(N - 1)}{2} \\approx \\frac{N^2}{2}$ edges).',
            'Prim\'s Algorithm is optimal for dense complete graphs:',
            '- Maintain `min_cost = [inf] * N`.',
            '- Start at point 0. Repeatedly pick the unvisited point with the smallest Manhattan distance to the MST.',
            'Runs in $O(N^2)$ time and $O(N)$ space.'
          ],
          keyRules: [
            'Manhattan distance: abs(x1 - x2) + abs(y1 - y2).',
            'Dense Prim\'s O(N^2) avoids generating and sorting N^2 edges.'
          ],
          codeSnippet: {
            id: 'dsa-snip-24-5',
            title: 'Min Cost to Connect Points (Dense Prim)',
            description: 'Dense O(N^2) Prim algorithm without edge heap',
            language: 'python',
            code: `def min_cost_connect_points(points: list[list[int]]) -> int:
    n = len(points)
    dist = [float('inf')] * n
    dist[0] = 0
    visited = [False] * n
    total_cost = 0
    
    for _ in range(n):
        # Pick unvisited node with smallest distance
        u = -1
        for i in range(n):
            if not visited[i] and (u == -1 or dist[i] < dist[u]):
                u = i
                
        visited[u] = True
        total_cost += dist[u]
        
        # Update distances to all other unvisited nodes
        x1, y1 = points[u]
        for v in range(n):
            if not visited[v]:
                x2, y2 = points[v]
                cost = abs(x1 - x2) + abs(y1 - y2)
                dist[v] = min(dist[v], cost)
                
    return total_cost

pts = [[0,0],[2,2],[3,10],[5,2],[7,0]]
print("Min Connection Cost:", min_cost_connect_points(pts)) # 20`
          },
          pitfall: 'Generating all $N^2$ edges and running Kruskal\'s: for $N = 1000$, generating 500,000 edges and sorting them takes far more memory than Dense Prim\'s $O(N)$ array.',
          quickCheck: {
            question: 'What is the auxiliary space complexity of Dense Prim\'s algorithm on N coordinate points?',
            options: ['O(N^2)', 'O(N)', 'O(1)', 'O(N log N)'],
            correctIndex: 1,
            explanation: 'The dense Prim algorithm tracks only the visited flags and minimum distance array for the N points, consuming O(N) space.'
          }
        },
        {
          id: 'dsa-w4-d24-t6',
          topicNumber: 6,
          title: 'Eulerian Path & Circuit: Hierholzer\'s Algorithm',
          explanation: [
            'An **Eulerian Trail** is a path that visits every EDGE in a graph exactly once.',
            'An **Eulerian Circuit** is an Eulerian Trail that starts and ends on the same vertex.',
            'Existence Criteria (Euler\'s Theorem):',
            '- Undirected: Connected, and all vertices have even degree (circuit) OR exactly 2 vertices have odd degree (path).',
            '- Directed: Connected, and every vertex has `in_degree == out_degree` (circuit) OR exactly one has `out - in = 1` and one has `in - out = 1` (path).',
            'Hierholzer\'s Algorithm finds the trail in $O(E)$ using postorder DFS traversal.'
          ],
          keyRules: [
            'Eulerian path visits every EDGE once; Hamiltonian path visits every VERTEX once.',
            'Hierholzer\'s runs in O(E) time by splicing cycles in reverse postorder.'
          ],
          codeSnippet: {
            id: 'dsa-snip-24-6',
            title: 'Hierholzers Eulerian Path',
            description: 'Postorder edge-exhaustion traversal in O(E)',
            language: 'python',
            code: `def find_itinerary(tickets: list[list[str]]) -> list[str]:
    adj = defaultdict(list)
    for src, dst in sorted(tickets, reverse=True):
        adj[src].append(dst)
        
    route = []
    def dfs(curr):
        while adj[curr]:
            next_dest = adj[curr].pop()
            dfs(next_dest)
        route.append(curr) # postorder append
        
    dfs("JFK")
    return route[::-1] # reverse postorder

tix = [["MUC","LHR"],["JFK","MUC"],["SFO","SJC"],["LHR","SFO"]]
print("Valid Itinerary:", find_itinerary(tix)) # ['JFK', 'MUC', 'LHR', 'SFO', 'SJC']`
          },
          pitfall: 'Confusing Eulerian Path (visits all edges in O(E)) with Hamiltonian Path (visits all vertices, NP-Complete $O(2^N)$ problem!).',
          quickCheck: {
            question: 'What is the condition for a connected undirected graph to have an Eulerian Circuit?',
            options: ['Every vertex must have an even degree', 'Exactly 2 vertices have odd degree', 'All edges must be equal', 'The graph must be a tree'],
            correctIndex: 0,
            explanation: 'Every time a path enters and leaves a vertex, it consumes 2 incident edges; therefore, every vertex must have an even degree to start and end at the same node.'
          }
        },
        {
          id: 'dsa-w4-d24-t7',
          topicNumber: 7,
          title: 'Graph Problem Diagnostic Architecture',
          explanation: [
            'Diagnostic mental model for any graph problem in technical interviews:',
            '1. **Unweighted Shortest Path**? -> Breadth-First Search (BFS) with Queue ($O(V + E)$).',
            '2. **Weighted Shortest Path (Non-negative)**? -> Dijkstra with Min-Heap ($O((V + E) \\log V)$).',
            '3. **Weighted Shortest Path with Negative Edges**? -> Bellman-Ford ($O(V \\times E)$).',
            '4. **All-Pairs Shortest Paths**? -> Floyd-Warshall ($O(V^3)$).',
            '5. **Dependencies & Prerequisite Ordering**? -> Topological Sort (Kahn\'s Algorithm $O(V + E)$).',
            '6. **Cycle Detection**? -> DSU (undirected) or 3-Color DFS (directed).',
            '7. **Connect All Nodes with Minimum Cost**? -> Kruskal\'s or Prim\'s MST ($O(E \\log V)$).'
          ],
          keyRules: [
            'Classify edge weights and directedness first.',
            'Select algorithm strictly according to constraints.'
          ],
          codeSnippet: {
            id: 'dsa-snip-24-7',
            title: 'Graph Algorithm Selector Function',
            description: 'Automated problem diagnostic engine',
            language: 'python',
            code: `def select_graph_algorithm(unweighted: bool, non_negative_weights: bool, needs_mst: bool, is_dag: bool) -> str:
    if needs_mst: return "Kruskal (with DSU) or Prim (with Min-Heap)"
    if is_dag: return "Kahn's Topological Sort (In-Degree Queue)"
    if unweighted: return "Breadth-First Search (Queue BFS)"
    if non_negative_weights: return "Dijkstra's Algorithm (Min-Heap Priority Queue)"
    return "Bellman-Ford Algorithm (Handles Negative Edges)"

print("Diagnosis for weighted map routing:", select_graph_algorithm(False, True, False, False))`
          },
          pitfall: 'Trying to use Dijkstra for unweighted graphs: standard BFS is faster ($O(V + E)$ vs $O((V + E) \\log V)$) and does not require heap comparisons.',
          quickCheck: {
            question: 'Which algorithm is optimal for finding the shortest path between two nodes in an UNWEIGHTED graph?',
            options: ['Dijkstra', 'Breadth-First Search (BFS)', 'Floyd-Warshall', 'Kruskal'],
            correctIndex: 1,
            explanation: 'In unweighted graphs, simple BFS explores nodes in exact order of edge distance, guaranteeing shortest paths in linear O(V + E) without heap overhead.'
          }
        },
        {
          id: 'dsa-w4-d24-t8',
          topicNumber: 8,
          title: 'Graph Synthesis: Industrial Telecommunications & Routing',
          explanation: [
            'Every major network system relies directly on graph theory:',
            '- OSPF (Open Shortest Path First) internet routers run Dijkstra\'s algorithm to route IP packets.',
            '- Spanning Tree Protocol (IEEE 802.1D) in Ethernet switches prevents broadcast packet loops using MST.',
            '- Package managers (npm, Gradle, Maven) build DAGs and execute Kahn\'s algorithm to resolve compilation targets.',
            'Mastering graphs is the bridge between pure mathematics and modern infrastructure.'
          ],
          keyRules: [
            'Routing protocols run Dijkstra and Bellman-Ford at line rate.',
            'Build pipelines are topological DAG traversals.'
          ],
          codeSnippet: {
            id: 'dsa-snip-24-8',
            title: 'Network Engineering Synthesis',
            description: 'Principles of industrial graph applications',
            language: 'python',
            code: `def print_graph_milestones():
    print("=== INDUSTRIAL GRAPH ROUTING ARCHITECTURES ===")
    print("1. IP Packet Routing -> Dijkstra (OSPF protocol)")
    print("2. Ethernet Switch Loop Prevention -> Spanning Tree Protocol (MST)")
    print("3. Build Dependency Compilation -> Topological Sort (Kahn)")
    print("4. Social Network Connectivity -> Multi-Source BFS")

print_graph_milestones()`
          },
          pitfall: 'Assuming graph algorithms are only for interview tests: they form the core routing layer of the internet and distributed databases.',
          quickCheck: {
            question: 'What graph algorithm forms the routing engine of the internet OSPF (Open Shortest Path First) protocol?',
            options: ['Bubble sort', 'Dijkstra shortest path algorithm', 'Binary search', 'Linear regression'],
            correctIndex: 1,
            explanation: 'OSPF routers maintain a synchronized link-state database and run Dijkstra algorithm locally to compute the shortest path tree to every network destination.'
          }
        }
      ]
    },
    {
      id: 'dsa-w4-d25',
      dayNumber: 25,
      weekNumber: 4,
      title: 'Dynamic Programming Fundamentals: 1D DP',
      subtitle: 'Overlapping subproblems, memoization vs tabulation, Climbing Stairs, House Robber, Coin Change & LIS',
      durationMinutes: 75,
      overview:
        'Demystify Dynamic Programming (DP). Understand the two pillars: Optimal Substructure and Overlapping Subproblems. Master the conversion from Top-Down Memoization to Bottom-Up Tabulation, space optimization to O(1), and canonical 1D problems: Climbing Stairs, House Robber, Coin Change, and Longest Increasing Subsequence.',
      topics: [
        {
          id: 'dsa-w4-d25-t1',
          topicNumber: 1,
          title: 'The Two Pillars of Dynamic Programming',
          explanation: [
            'Dynamic Programming applies when a problem exhibits two mathematical properties:',
            '1. **Optimal Substructure**: The optimal solution to the problem can be constructed from optimal solutions to its subproblems.',
            '2. **Overlapping Subproblems**: The same subproblems are solved repeatedly in a naive recursive divide-and-conquer tree.',
            'Instead of recalculating the same subproblem $2^N$ times, store the result in memory (cache/table) so it is computed EXACTLY ONCE, reducing exponential time $O(2^N)$ to polynomial time $O(N)$!'
          ],
          keyRules: [
            'Top-Down: Recursion + Memoization (caching results).',
            'Bottom-Up: Iteration + Tabulation (building table from base cases up).',
            'Space optimization: compress DP arrays to scalar variables when state depends only on recent steps.'
          ],
          codeSnippet: {
            id: 'dsa-snip-25-1',
            title: 'Fibonacci: Naive O(2^N) vs Memoized O(N)',
            description: 'Dramatic complexity collapse via memoization',
            language: 'python',
            code: `# Memoized Top-Down Fibonacci
def fib_memo(n: int, memo=None) -> int:
    if memo is None: memo = {}
    if n in memo: return memo[n]
    if n <= 1: return n
    
    memo[n] = fib_memo(n - 1, memo) + fib_memo(n - 2, memo)
    return memo[n]

# Space-Optimized Bottom-Up Tabulation in O(1) space
def fib_bottom_up(n: int) -> int:
    if n <= 1: return n
    prev2, prev1 = 0, 1
    for _ in range(2, n + 1):
        prev2, prev1 = prev1, prev2 + prev1
    return prev1

print("fib(50):", fib_bottom_up(50)) # 12,586,269,025 (Calculated in microseconds!)`
          },
          pitfall: 'Applying DP to problems without overlapping subproblems (e.g. Merge Sort splits into independent halves that never overlap; DP provides no benefit for independent divide-and-conquer).',
          quickCheck: {
            question: 'What are the two mandatory properties required for a problem to be solved via Dynamic Programming?',
            options: ['Prime numbers and odd lengths', 'Optimal Substructure and Overlapping Subproblems', 'Contiguous memory and sorted order', 'Binary trees and stacks'],
            correctIndex: 1,
            explanation: 'Optimal substructure allows building the global answer from subproblems; overlapping subproblems ensures caching provides exponential speedup.'
          }
        },
        {
          id: 'dsa-w4-d25-t2',
          topicNumber: 2,
          title: 'Climbing Stairs: State Transitions and O(1) Space',
          explanation: [
            'Problem: It takes $n$ steps to reach the top of a staircase. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
            'State Formulation:',
            'To reach step $i$, you must have come from either step $i - 1$ (by taking 1 step) or step $i - 2$ (by taking 2 steps).',
            'Transition: $\\text{dp}[i] = \\text{dp}[i - 1] + \\text{dp}[i - 2]$.',
            'Base cases: $\\text{dp}[1] = 1, \\text{dp}[2] = 2$.',
            'Since `dp[i]` depends only on the previous two values, reduce space from $O(N)$ to strictly $O(1)$!'
          ],
          keyRules: [
            'Define DP state explicitly: dp[i] = distinct ways to reach step i.',
            'Compress to 2 variables for O(1) space.'
          ],
          codeSnippet: {
            id: 'dsa-snip-25-2',
            title: 'Climbing Stairs with O(1) Space',
            description: 'Linear time, constant space state transition',
            language: 'python',
            code: `def climb_stairs(n: int) -> int:
    if n <= 2: return n
    one_step_before = 2
    two_steps_before = 1
    
    for _ in range(3, n + 1):
        curr = one_step_before + two_steps_before
        two_steps_before = one_step_before
        one_step_before = curr
        
    return one_step_before

print("Ways to climb 5 stairs:", climb_stairs(5)) # 8`
          },
          pitfall: 'Allocating an array of size N when only the previous 2 values are needed: wasting O(N) memory is considered sloppy in interviews when O(1) space is achievable.',
          quickCheck: {
            question: 'What is the recurrence relation for Climbing Stairs where you can take 1, 2, or 3 steps at a time?',
            options: ['dp[i] = dp[i-1] * 2', 'dp[i] = dp[i-1] + dp[i-2] + dp[i-3]', 'dp[i] = max(dp[i-1], dp[i-2])', 'dp[i] = dp[i-3]'],
            correctIndex: 1,
            explanation: 'To reach step i, you can arrive from i-1 (1 step), i-2 (2 steps), or i-3 (3 steps), summing the distinct ways of all three predecessor states.'
          }
        },
        {
          id: 'dsa-w4-d25-t3',
          topicNumber: 3,
          title: 'House Robber: Non-Adjacent Selection State Machine',
          explanation: [
            'Problem: You are planning to rob houses along a street. Adjacent houses have security systems that will alert the police if two adjacent houses are robbed on the same night. Maximize stolen money.',
            'State Formulation:',
            'At house $i$, you have two mutually exclusive choices:',
            '1. Rob house $i$: gain $nums[i] + \\text{max stolen from houses up to } i - 2$.',
            '2. Skip house $i$: gain $\\text{max stolen from houses up to } i - 1$.',
            'Transition: $\\text{dp}[i] = \\max(\\text{dp}[i - 1], \\text{nums}[i] + \\text{dp}[i - 2])$.',
            'Space optimization: maintain `rob1` and `rob2` scalars for $O(1)$ space!'
          ],
          keyRules: [
            'Transition: max(skip_current, rob_current + two_houses_back).',
            'O(N) time with O(1) auxiliary space.'
          ],
          codeSnippet: {
            id: 'dsa-snip-25-3',
            title: 'House Robber in O(1) Space',
            description: 'Non-adjacent dynamic selection in linear time',
            language: 'python',
            code: `def rob(nums: list[int]) -> int:
    # rob1 represents max money robbing up to house i-2
    # rob2 represents max money robbing up to house i-1
    rob1, rob2 = 0, 0
    
    for num in nums:
        # Max of robbing current + rob1 vs skipping (rob2)
        new_rob = max(rob2, num + rob1)
        rob1 = rob2
        rob2 = new_rob
        
    return rob2

print("Max loot from [2, 7, 9, 3, 1]:", rob([2, 7, 9, 3, 1])) # 12 (2 + 9 + 1)`
          },
          pitfall: 'Picking all odd indices vs all even indices: greedily taking even/odd indices fails on `[2, 1, 1, 2]` where the optimal selection is index 0 and 3 (sum 4).',
          quickCheck: {
            question: 'Why does the simple heuristic "pick the sum of even houses or sum of odd houses" fail for House Robber?',
            options: ['Houses can be negative', 'Optimal solutions can skip two houses consecutively (e.g., house 0 then house 3)', 'Even and odd indices are not adjacent', 'It causes index errors'],
            correctIndex: 1,
            explanation: 'Skipping two adjacent houses is legal and often yields higher loot than alternating strictly between even and odd indices.'
          }
        },
        {
          id: 'dsa-w4-d25-t4',
          topicNumber: 4,
          title: 'House Robber II: Circular Street Decomposition',
          explanation: [
            'Problem: All houses are arranged in a CIRCLE. The first house is neighbor to the last house!',
            'Circular Constraint:',
            'House 0 and House $N - 1$ CANNOT both be robbed.',
            'Decomposition Trick: Split into two linear House Robber subproblems!',
            '1. Rob houses from index $0$ to $N - 2$ (ignoring the last house).',
            '2. Rob houses from index $1$ to $N - 1$ (ignoring the first house).',
            'Result: $\\max(\\text{rob}(nums[0 .. N-2]), \\text{rob}(nums[1 .. N-1]))$.'
          ],
          keyRules: [
            'Handle edge case: if len(nums) == 1, return nums[0].',
            'Two linear calls solve the circular constraint in O(N) time and O(1) space.'
          ],
          codeSnippet: {
            id: 'dsa-snip-25-4',
            title: 'House Robber II (Circular Street)',
            description: 'Two-subproblem decomposition for circular constraint',
            language: 'python',
            code: `def rob_circular(nums: list[int]) -> int:
    if not nums: return 0
    if len(nums) == 1: return nums[0]
    
    def linear_rob(houses: list[int]) -> int:
        r1, r2 = 0, 0
        for h in houses:
            r1, r2 = r2, max(r2, h + r1)
        return r2
        
    # Max of excluding last house OR excluding first house
    return max(linear_rob(nums[:-1]), linear_rob(nums[1:]))

print("Max loot circular [2, 3, 2]:", rob_circular([2, 3, 2])) # 3`
          },
          pitfall: 'Forgetting the single-house edge case `len(nums) == 1`: slicing `nums[:-1]` and `nums[1:]` both produce empty lists `[]`, erroneously returning 0 instead of `nums[0]`.',
          quickCheck: {
            question: 'How is the circular constraint resolved in House Robber II?',
            options: ['By doubling the array', 'By solving two linear House Robber problems: one excluding the first house, and one excluding the last house', 'By sorting the array', 'By using binary search'],
            correctIndex: 1,
            explanation: 'Since the first and last houses cannot both be robbed, the optimal answer must either omit the last house or omit the first house.'
          }
        },
        {
          id: 'dsa-w4-d25-t5',
          topicNumber: 5,
          title: 'Coin Change (Fewest Coins to Make Amount)',
          explanation: [
            'Problem: Given coins of different denominations and an integer `amount`, return the fewest number of coins needed to make up that amount. If impossible, return -1.',
            'Greedy Approach (picking largest coin) FAILS: for coins `[1, 3, 4, 5]` and amount 7, greedy picks `5 + 1 + 1` (3 coins), but optimal is `4 + 3` (2 coins)!',
            'DP State: `dp[a]` = minimum coins to make amount `a`:',
            '$\\text{dp}[a] = 1 + \\min_{c \\in \\text{coins}, c \\le a}(\\text{dp}[a - c])$.',
            'Initialize `dp = [inf] * (amount + 1)`, with `dp[0] = 0`.',
            'Time: $O(\\text{amount} \\times \\text{len}(\\text{coins}))$. Space: $O(\\text{amount})$.'
          ],
          keyRules: [
            'Initialize table with amount + 1 (infinity sentinel).',
            'dp[0] = 0 base case.'
          ],
          codeSnippet: {
            id: 'dsa-snip-25-5',
            title: 'Coin Change Tabulation',
            description: 'Bottom-up fewest coins calculation in O(amount * len(coins))',
            language: 'python',
            code: `def coin_change(coins: list[int], amount: int) -> int:
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for a in range(1, amount + 1):
        for c in coins:
            if a - c >= 0:
                dp[a] = min(dp[a], 1 + dp[a - c])
                
    return dp[amount] if dp[amount] != float('inf') else -1

print("Fewest coins for amount 11 with [1, 2, 5]:", coin_change([1, 2, 5], 11)) # 3 (5 + 5 + 1)`
          },
          pitfall: 'Attempting a greedy approach in currency systems that are not canonical (e.g. US currency is canonical, but arbitrary problem coin sets are not and WILL fail with greedy).',
          quickCheck: {
            question: 'Why does the greedy strategy (always taking the largest possible coin) fail for the Coin Change problem with coins [1, 3, 4] and amount 6?',
            options: ['Because coins are integers', 'Greedy takes 4 + 1 + 1 (3 coins), whereas the optimal solution is 3 + 3 (2 coins)', 'Greedy causes infinite loops', 'Coins cannot be repeated'],
            correctIndex: 1,
            explanation: 'Greedily taking the largest coin leaves a remainder that requires suboptimal smaller coins, while a combination of smaller coins yields a better total.'
          }
        },
        {
          id: 'dsa-w4-d25-t6',
          topicNumber: 6,
          title: 'Coin Change II (Number of Combinations / Unbounded Knapsack)',
          explanation: [
            'Problem: Return the number of combinations that make up that amount using unlimited supply of each coin.',
            'CRITICAL ORDERING INSIGHT (Permutations vs Combinations):',
            '- Outer loop `coins`, inner loop `amount`: Computes COMBINATIONS (order does NOT matter, `[1, 2]` is identical to `[2, 1]`).',
            '- Outer loop `amount`, inner loop `coins`: Computes PERMUTATIONS (order matters, `[1, 2]` and `[2, 1]` are counted separately!).',
            'Transition for Combinations: `dp[a] += dp[a - coin]`.'
          ],
          keyRules: [
            'For COMBINATIONS: loop coins externally, amount internally.',
            'For PERMUTATIONS: loop amount externally, coins internally.'
          ],
          codeSnippet: {
            id: 'dsa-snip-25-6',
            title: 'Coin Change II (Combinations Count)',
            description: 'Unbounded knapsack counting combinations in O(amount * len(coins))',
            language: 'python',
            code: `def change(amount: int, coins: list[int]) -> int:
    dp = [0] * (amount + 1)
    dp[0] = 1 # 1 way to make amount 0: use zero coins
    
    # Outer loop over coins guarantees unique combinations (no permutations)
    for coin in coins:
        for a in range(coin, amount + 1):
            dp[a] += dp[a - coin]
            
    return dp[amount]

print("Combinations for amount 5 with [1, 2, 5]:", change(5, [1, 2, 5])) # 4 (5, 2+2+1, 2+1+1+1, 1*5)`
          },
          pitfall: 'Reversing the loops: placing `for a in range(1, amount+1)` on the outside computes permutations (ordering matters), giving 9 instead of 4 combinations for amount 5!',
          quickCheck: {
            question: 'Why does placing the outer loop over `coins` produce combinations rather than permutations in Coin Change II?',
            options: ['It runs faster', 'Because each coin denomination is processed in fixed sequence, preventing coins from appearing in different orderings for the same combination', 'To save memory', 'Because amount is sorted'],
            correctIndex: 1,
            explanation: 'Considering coins one-by-one ensures that any valid combination generates its coins in monotonic non-decreasing order of index, eliminating duplicate permutations.'
          }
        },
        {
          id: 'dsa-w4-d25-t7',
          topicNumber: 7,
          title: 'Longest Increasing Subsequence: O(N²) DP to O(N log N) Patience Sorting',
          explanation: [
            'Problem: Find the length of the longest strictly increasing subsequence in `nums`.',
            '- **O(N^2) DP**: `dp[i] = 1 + max(dp[j] for j < i if nums[j] < nums[i])`.',
            '- **O(N log N) Patience Sorting (Optimal)**:',
            '  Maintain an array `tails` where `tails[i]` stores the smallest tail of all increasing subsequences of length $i + 1$.',
            '  For each `x` in `nums`:',
            '  Use Binary Search (`bisect_left`) to find first index in `tails` where `tails[idx] >= x`.',
            '  If `idx == len(tails)`: extend LIS (`tails.append(x)`).',
            '  Else: overwrite `tails[idx] = x` (creates a smaller, more promising tail!).'
          ],
          keyRules: [
            'tails array is strictly sorted, enabling O(log N) binary search per number.',
            'Total runtime: O(N log N) time and O(N) space.'
          ],
          codeSnippet: {
            id: 'dsa-snip-25-7',
            title: 'Longest Increasing Subsequence in O(N log N)',
            description: 'Patience sorting with binary search',
            language: 'python',
            code: `import bisect

def length_of_lis(nums: list[int]) -> int:
    tails = []
    
    for x in nums:
        idx = bisect.bisect_left(tails, x)
        if idx == len(tails):
            tails.append(x) # extends longest subsequence
        else:
            tails[idx] = x  # lower tail allows future numbers to extend more easily
            
    return len(tails)

print("LIS length in [10,9,2,5,3,7,101,18]:", length_of_lis([10,9,2,5,3,7,101,18])) # 4 ([2, 3, 7, 101])`
          },
          pitfall: 'Assuming `tails` represents the actual subsequence: `tails` stores the optimal tails for each length, which may not be a valid subsequence itself, but its length is guaranteed equal to the max LIS length.',
          quickCheck: {
            question: 'What is the time complexity of the optimal Longest Increasing Subsequence algorithm using patience sorting?',
            options: ['O(N^2)', 'O(N log N)', 'O(N)', 'O(2^N)'],
            correctIndex: 1,
            explanation: 'Each of the N elements triggers a binary search over the tails array of size <= N, taking O(N log N) total time.'
          }
        },
        {
          id: 'dsa-w4-d25-t8',
          topicNumber: 8,
          title: 'Word Break: Substring State Memoization',
          explanation: [
            'Problem: Given string `s` and dictionary `wordDict`, determine if `s` can be segmented into space-separated dictionary words.',
            'DP State: `dp[i]` is a boolean indicating whether prefix `s[0 .. i-1]` can be segmented.',
            'Base Case: `dp[0] = True` (empty string is always valid).',
            'Transition for $i$ from 1 to $N$:',
            '$\\text{dp}[i] = \\text{True if } \\exists j < i \\text{ such that } \\text{dp}[j] == \\text{True and } s[j..i] \\in \\text{wordSet}$.',
            'Time: $O(N^2 \\times L)$ where $L$ is max word length.'
          ],
          keyRules: [
            'Convert wordDict to a hash set for O(1) substring lookups.',
            'Only test substrings starting from valid prefix points (where dp[j] == True).'
          ],
          codeSnippet: {
            id: 'dsa-snip-25-8',
            title: 'Word Break DP Tabulation',
            description: 'Prefix segmentation verification in O(N^2)',
            language: 'python',
            code: `def word_break(s: str, wordDict: list[str]) -> bool:
    word_set = set(wordDict)
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True # base case: empty string
    
    for i in range(1, n + 1):
        for j in range(i):
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break # early exit for index i
                
    return dp[n]

print("Can segment 'leetcode':", word_break("leetcode", ["leet", "code"])) # True`
          },
          pitfall: 'Scanning `j` across all indices without checking `if dp[j]:`: checking whether `s[j:i]` is in the dictionary when `dp[j]` is False is wasted computation; only valid prefixes can extend.',
          quickCheck: {
            question: 'What does dp[i] represent in the Word Break algorithm?',
            options: ['The number of vowels in the word', 'Whether the prefix substring s[0..i-1] can be segmented into valid dictionary words', 'The length of the word', 'The index of the word'],
            correctIndex: 1,
            explanation: 'dp[i] is a boolean tracking whether the first i characters of string s can be formed by concatenating words from the dictionary.'
          }
        }
      ]
    },
    {
      id: 'dsa-w4-d26',
      dayNumber: 26,
      weekNumber: 4,
      title: '2D Dynamic Programming & Knapsack Patterns',
      subtitle: '0/1 Knapsack, Unbounded Knapsack, Subset Sum, Longest Common Subsequence (LCS) & Edit Distance',
      durationMinutes: 75,
      overview:
        'Conquer multidimensional dynamic programming. Master the classic 0/1 Knapsack decision table and space-saving 1D backward array compression, Partition Equal Subset Sum, Longest Common Subsequence (LCS), and Levenshtein Edit Distance.',
      topics: [
        {
          id: 'dsa-w4-d26-t1',
          topicNumber: 1,
          title: '0/1 Knapsack: Decision Matrix & 1D Space Compression',
          explanation: [
            'Given $N$ items with weights and values, maximize total value in a knapsack of capacity $W$. Each item can be picked AT MOST ONCE (0 or 1).',
            '2D State: `dp[i][w]` is max value using a subset of first $i$ items with capacity $w$:',
            '- Choice 1 (Exclude item $i$): $\\text{dp}[i-1][w]$.',
            '- Choice 2 (Include item $i$, if $w_i \\le w$): $v_i + \\text{dp}[i-1][w - w_i]$.',
            '$\\text{dp}[i][w] = \\max(\\text{dp}[i-1][w], v_i + \\text{dp}[i-1][w - w_i])$.',
            'Space Optimization to 1D Array:',
            'Iterate capacity $w$ in REVERSE (from $W$ down to $w_i$)! Reverse iteration ensures an item is used AT MOST ONCE by pulling from the previous item\'s states.'
          ],
          keyRules: [
            '0/1 Knapsack with 1D array MUST iterate capacity BACKWARDS: from W down to weight.',
            'Forward iteration would reuse the same item multiple times (Unbounded Knapsack)!'
          ],
          codeSnippet: {
            id: 'dsa-snip-26-1',
            title: '0/1 Knapsack 1D Backward Tabulation',
            description: 'Optimal O(W) space knapsack with reverse capacity traversal',
            language: 'python',
            code: `def knapsack_01(weights: list[int], values: list[int], capacity: int) -> int:
    dp = [0] * (capacity + 1)
    
    for w_i, v_i in zip(weights, values):
        # Must iterate BACKWARDS from capacity down to item weight!
        for w in range(capacity, w_i - 1, -1):
            dp[w] = max(dp[w], v_i + dp[w - w_i])
            
    return dp[capacity]

w = [1, 3, 4, 5]
v = [1, 4, 5, 7]
print("Max Knapsack Value for W=7:", knapsack_01(w, v, 7)) # 9 (items weight 3 and 4 -> values 4 + 5)`
          },
          pitfall: 'Iterating capacity forward in 0/1 knapsack: `for w in range(w_i, capacity + 1)` allows an item to be selected multiple times, turning it into Unbounded Knapsack.',
          quickCheck: {
            question: 'Why MUST capacity be iterated backwards in the 1D space-optimized 0/1 Knapsack?',
            options: ['To speed up loop execution', 'To ensure dp[w - w_i] represents the state from the PREVIOUS item, preventing the current item from being used multiple times', 'Because capacity is negative', 'To sort the weights'],
            correctIndex: 1,
            explanation: 'Reverse iteration ensures that when calculating dp[w], the value dp[w - w_i] has not yet been overwritten by the current item, enforcing the 0/1 single-use rule.'
          }
        },
        {
          id: 'dsa-w4-d26-t2',
          topicNumber: 2,
          title: 'Partition Equal Subset Sum (0/1 Knapsack Reduction)',
          explanation: [
            'Problem: Given a non-empty array `nums` of positive integers, determine if it can be partitioned into two subsets with equal sums.',
            'Mathematical Reduction:',
            'Total sum must be EVEN (if `sum(nums) % 2 != 0`, return `False` immediately!).',
            'Target sum for each subset is `target = sum(nums) // 2`.',
            'The problem is now identical to 0/1 Knapsack: "Can we find a subset of items that sums to EXACTLY `target`?"',
            'Boolean DP table: `dp[w] = dp[w] or dp[w - num]` iterated backwards in $O(\\text{target})$ space.'
          ],
          keyRules: [
            'If sum(nums) % 2 == 1, partition is impossible.',
            'Target = sum(nums) // 2.',
            'Iterate backwards to prevent duplicate element usage.'
          ],
          codeSnippet: {
            id: 'dsa-snip-26-2',
            title: 'Partition Equal Subset Sum',
            description: 'Subset sum reduction using 1D boolean array in O(target)',
            language: 'python',
            code: `def can_partition(nums: list[int]) -> bool:
    total = sum(nums)
    if total % 2 != 0: return False
    target = total // 2
    
    dp = [False] * (target + 1)
    dp[0] = True # sum 0 is always achievable
    
    for num in nums:
        for w in range(target, num - 1, -1):
            dp[w] = dp[w] or dp[w - num]
            if dp[target]: return True # early exit
            
    return dp[target]

print("Can partition [1, 5, 11, 5]:", can_partition([1, 5, 11, 5])) # True ([11] and [1, 5, 5])`
          },
          pitfall: 'Omitting the early exit `if dp[target]: return True`: on large inputs, early exit saves significant time once a valid subset is achieved.',
          quickCheck: {
            question: 'What is the target sum searched for in Partition Equal Subset Sum?',
            options: ['sum(nums)', 'sum(nums) // 2', 'max(nums)', 'sum(nums) * 2'],
            correctIndex: 1,
            explanation: 'Dividing the array into two subsets with equal sums means each subset must sum to exactly half of the total sum.'
          }
        },
        {
          id: 'dsa-w4-d26-t3',
          topicNumber: 3,
          title: 'Target Sum (+ and - Assignment Reduction)',
          explanation: [
            'Problem: Assign `+` or `-` to each integer in `nums` so the expression evaluates to `target`. Return the number of different expressions.',
            'Mathematical Derivation:',
            'Partition `nums` into subset $P$ (positive signs) and subset $N$ (negative signs):',
            '$\\text{sum}(P) - \\text{sum}(N) = \\text{target}$.',
            '$\\text{sum}(P) + \\text{sum}(N) = \\text{total\\_sum}$.',
            'Adding equations: $2 \\cdot \\text{sum}(P) = \\text{target} + \\text{total\\_sum} \\implies \\text{sum}(P) = \\frac{\\text{target} + \\text{total\\_sum}}{2}$.',
            'Reduces to counting subsets with sum equal to $\\text{sum}(P)$!'
          ],
          keyRules: [
            'If (target + total_sum) is odd or negative, return 0.',
            'Subset sum counting: dp[w] += dp[w - num] iterated backwards.'
          ],
          codeSnippet: {
            id: 'dsa-snip-26-3',
            title: 'Target Sum Reduction to Subset Sum',
            description: 'Algebraic transformation into subset count DP',
            language: 'python',
            code: `def find_target_sum_ways(nums: list[int], target: int) -> int:
    total = sum(nums)
    if (total + target) < 0 or (total + target) % 2 != 0:
        return 0
    subset_target = (total + target) // 2
    
    dp = [0] * (subset_target + 1)
    dp[0] = 1 # 1 way to form sum 0
    
    for num in nums:
        for w in range(subset_target, num - 1, -1):
            dp[w] += dp[w - num]
            
    return dp[subset_target]

print("Target sum ways for [1,1,1,1,1], target 3:", find_target_sum_ways([1,1,1,1,1], 3)) # 5`
          },
          pitfall: 'Running 2^N recursive backtracking: takes O(2^N) time, whereas the subset sum reduction executes in O(N * target) time.',
          quickCheck: {
            question: 'What mathematical condition causes find_target_sum_ways to return 0 immediately?',
            options: ['If target is 0', 'If (total_sum + target) is negative or odd', 'If nums contains 1', 'If len(nums) is even'],
            correctIndex: 1,
            explanation: '2 * sum(P) must be an integer >= 0; if total_sum + target is odd, dividing by 2 yields a fraction, making it impossible.'
          }
        },
        {
          id: 'dsa-w4-d26-t4',
          topicNumber: 4,
          title: 'Longest Common Subsequence (LCS): The 2D Grid Template',
          explanation: [
            'Problem: Given two strings `text1` and `text2`, find the length of their longest common subsequence.',
            'A subsequence does not need to be contiguous (e.g. `"ace"` is a subsequence of `"abcde"`).',
            '2D State: `dp[i][j]` is LCS length of `text1[0..i-1]` and `text2[0..j-1]`:',
            '- If `text1[i-1] == text2[j-1]`: characters match! Take diagonal $+ 1$: $\\text{dp}[i][j] = 1 + \\text{dp}[i-1][j-1]$.',
            '- If characters mismatch: $\\text{dp}[i][j] = \\max(\\text{dp}[i-1][j], \\text{dp}[i][j-1])$ (skip char from text1 or text2).',
            'Time: $O(M \\times N)$. Space: $O(\\min(M, N))$ with 1D rolling array.'
          ],
          keyRules: [
            'Match: 1 + dp[i-1][j-1] (diagonal).',
            'Mismatch: max(dp[i-1][j], dp[i][j-1]) (top or left).',
            'Foundational template for diff tools (git diff) and DNA sequence alignment (Needleman-Wunsch).'
          ],
          codeSnippet: {
            id: 'dsa-snip-26-4',
            title: 'Longest Common Subsequence (LCS)',
            description: '2D matrix dynamic programming in O(M * N)',
            language: 'python',
            code: `def longest_common_subsequence(text1: str, text2: str) -> int:
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = 1 + dp[i - 1][j - 1]
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
                
    return dp[m][n]

print("LCS of 'abcde' and 'ace':", longest_common_subsequence("abcde", "ace")) # 3 ("ace")`
          },
          pitfall: 'Mixing up substrings and subsequences: a substring must be contiguous; a subsequence preserves relative order without requiring contiguity.',
          quickCheck: {
            question: 'What is the transition when characters text1[i-1] and text2[j-1] match in LCS?',
            options: ['dp[i][j] = dp[i-1][j] + 1', 'dp[i][j] = 1 + dp[i-1][j-1] (extend diagonal)', 'dp[i][j] = dp[i][j-1]', 'dp[i][j] = 0'],
            correctIndex: 1,
            explanation: 'When characters match, both prefixes contribute that character, extending the LCS of the prior sub-prefixes by 1.'
          }
        },
        {
          id: 'dsa-w4-d26-t5',
          topicNumber: 5,
          title: 'Edit Distance (Levenshtein Distance)',
          explanation: [
            'Problem: Given strings `word1` and `word2`, find the minimum operations (Insert, Delete, Replace) to convert `word1` to `word2`.',
            '2D State: `dp[i][j]` = min edits to convert `word1[0..i-1]` to `word2[0..j-1]`:',
            '- Base cases: `dp[i][0] = i` (delete all), `dp[0][j] = j` (insert all).',
            '- If `word1[i-1] == word2[j-1]`: no operation needed -> `dp[i][j] = dp[i-1][j-1]`.',
            '- Else: `dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])`:',
            '  - `dp[i-1][j]`: Delete character from word1.',
            '  - `dp[i][j-1]`: Insert character into word1.',
            '  - `dp[i-1][j-1]`: Replace character in word1.',
            'Time: $O(M \\times N)$. Space: $O(M \\times N)$ or $O(\\min(M, N))$ rolling.'
          ],
          keyRules: [
            'Delete: dp[i-1][j]. Insert: dp[i][j-1]. Replace: dp[i-1][j-1].',
            'Base cases initialize with index counts.'
          ],
          codeSnippet: {
            id: 'dsa-snip-26-5',
            title: 'Edit Distance Tabulation',
            description: 'Levenshtein edit distance matrix calculation',
            language: 'python',
            code: `def min_distance(word1: str, word2: str) -> int:
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(m + 1): dp[i][0] = i # delete all
    for j in range(n + 1): dp[0][j] = j # insert all
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(
                    dp[i - 1][j],     # Delete
                    dp[i][j - 1],     # Insert
                    dp[i - 1][j - 1]  # Replace
                )
                
    return dp[m][n]

print("Edit distance 'horse' to 'ros':", min_distance("horse", "ros")) # 3`
          },
          pitfall: 'Forgetting to add 1 when doing operations: `min(...)` without `+ 1` yields 0 cost for edits!',
          quickCheck: {
            question: 'What do the three arguments in min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) represent in Edit Distance?',
            options: ['Multiply, Divide, Subtract', 'Delete from word1, Insert into word1, Replace in word1', 'Left, Right, Center', 'Three random operations'],
            correctIndex: 1,
            explanation: 'dp[i-1][j] drops a character from word1 (delete), dp[i][j-1] consumes a target character from word2 (insert), and dp[i-1][j-1] swaps the character (replace).'
          }
        },
        {
          id: 'dsa-w4-d26-t6',
          topicNumber: 6,
          title: 'Unique Paths with Obstacles',
          explanation: [
            'Problem: A robot is located at top-left of an $M \\times N$ grid. It can only move Down or Right. Calculate unique paths to bottom-right avoiding obstacles (`1`s).',
            'State: `dp[r][c]` = unique paths to reach cell `(r, c)`.',
            'Transition:',
            '- If `grid[r][c] == 1`: cell is blocked! `dp[r][c] = 0`.',
            '- Else: $\\text{dp}[r][c] = \\text{dp}[r-1][c] + \\text{dp}[r][c-1]$.',
            '1D Space Optimization: Use a single row array `dp` of size `cols` where `dp[c] += dp[c - 1]`.'
          ],
          keyRules: [
            'Obstacle cell is 0 paths.',
            'O(M * N) time with O(N) space.'
          ],
          codeSnippet: {
            id: 'dsa-snip-26-6',
            title: 'Unique Paths II (with Obstacles)',
            description: '1D space-optimized grid path counting',
            language: 'python',
            code: `def unique_paths_with_obstacles(obstacleGrid: list[list[int]]) -> int:
    if not obstacleGrid or obstacleGrid[0][0] == 1:
        return 0
        
    cols = len(obstacleGrid[0])
    dp = [0] * cols
    dp[0] = 1 # Start cell
    
    for row in obstacleGrid:
        for c in range(cols):
            if row[c] == 1:
                dp[c] = 0 # Obstacle blocks path
            elif c > 0:
                dp[c] += dp[c - 1] # Paths from left
                
    return dp[cols - 1]

grid_obs = [[0,0,0],[0,1,0],[0,0,0]]
print("Unique paths avoiding obstacle:", unique_paths_with_obstacles(grid_obs)) # 2`
          },
          pitfall: 'Failing to check if start `(0, 0)` or destination is an obstacle: if `obstacleGrid[0][0] == 1`, robot cannot start moving; return 0 immediately.',
          quickCheck: {
            question: 'What value is assigned to dp[c] when a grid cell contains an obstacle?',
            options: ['-1', '0', 'infinity', 'dp[c - 1]'],
            correctIndex: 1,
            explanation: 'An obstacle blocks all transit, so exactly 0 paths can traverse or pass through that cell.'
          }
        },
        {
          id: 'dsa-w4-d26-t7',
          topicNumber: 7,
          title: 'Palindromic Substrings: Count and Longest via 2D DP',
          explanation: [
            'Problem: Given string `s`, count how many substrings are palindromes.',
            '2D DP Table: `dp[i][j]` is True if `s[i .. j]` is a palindrome.',
            'Base Cases: Single characters `dp[i][i] = True`. Adjacent characters `dp[i][i+1] = (s[i] == s[i+1])`.',
            'Transition for length $\\ge 3$:',
            '$\\text{dp}[i][j] = (s[i] == s[j]) \\text{ and } \\text{dp}[i+1][j-1]$.',
            'Iterate by substring length $L$ from 1 to $N$, or iterate $i$ backwards and $j$ forwards.'
          ],
          keyRules: [
            'Outer character match + inner substring palindrome = valid palindrome.',
            'Fill table in order of increasing length.'
          ],
          codeSnippet: {
            id: 'dsa-snip-26-7',
            title: 'Palindromic Substrings 2D DP',
            description: 'Counting palindromic substrings via diagonal DP table in O(N^2)',
            language: 'python',
            code: `def count_substrings(s: str) -> int:
    n = len(s)
    dp = [[False] * n for _ in range(n)]
    count = 0
    
    # Iterate backwards for i to ensure dp[i+1][j-1] is already computed!
    for i in range(n - 1, -1, -1):
        for j in range(i, n):
            if s[i] == s[j] and (j - i <= 2 or dp[i + 1][j - 1]):
                dp[i][j] = True
                count += 1
                
    return count

print("Palindromic substrings in 'aaa':", count_substrings("aaa")) # 6 ("a","a","a","aa","aa","aaa")`
          },
          pitfall: 'Filling table with standard nested loops `for i in range(N): for j in range(i, N)`: calculating `dp[i][j]` requires `dp[i+1][j-1]` which has not been computed yet! You must iterate $i$ BACKWARDS from $N-1$ down to 0.',
          quickCheck: {
            question: 'Why does the 2D DP table for palindromes iterate index `i` backwards from n-1 down to 0?',
            options: ['To reverse the string', 'Because evaluating range [i..j] requires the answer for inner range [i+1..j-1], which resides at a higher row index', 'To sort the matrix', 'It runs faster on CPUs'],
            correctIndex: 1,
            explanation: 'The subproblem dp[i+1][j-1] is located on row i+1; iterating i backwards guarantees row i+1 is already fully computed before row i is evaluated.'
          }
        },
        {
          id: 'dsa-w4-d26-t8',
          topicNumber: 8,
          title: 'Dynamic Programming Master Recipe & Invariants',
          explanation: [
            'Any Dynamic Programming problem can be solved by following this 5-step recipe:',
            '1. **Define State in Words**: What do the indices represent? (e.g., `dp[i][w]` is max value from first $i$ items with capacity $w$).',
            '2. **Identify Base Cases**: What are the smallest non-decomposable inputs? (e.g., $N=0$ or capacity $=0$).',
            '3. **Derive the Recurrence Relation**: Formulate the transition from subproblems.',
            '4. **Determine Evaluation Order**: Ensure subproblems are solved before their dependents (forward, reverse, or diagonal).',
            '5. **Optimize Space**: Compress rows if state depends only on previous row or previous two elements.'
          ],
          keyRules: [
            'State definition is 80% of the battle.',
            'Always test base cases with manual trace before writing code.'
          ],
          codeSnippet: {
            id: 'dsa-snip-26-8',
            title: 'DP Verification Blueprint',
            description: 'Five-step checklist for dynamic programming',
            language: 'python',
            code: `def dp_recipe_checklist():
    steps = [
        "1. State: Define dp[i] semantics clearly in plain English",
        "2. Base Case: Initialize minimal boundaries",
        "3. Transition: Formulate recurrence math",
        "4. Order: Ensure subproblem dependencies are computed first",
        "5. Compression: Reduce 2D to 1D array if possible"
    ]
    for s in steps: print(f" [V] {s}")

dp_recipe_checklist()`
          },
          pitfall: 'Jumping straight into code without defining what `dp[i]` means: if you cannot explain `dp[i]` in one clear sentence, your transition logic will be flawed.',
          quickCheck: {
            question: 'What is the first and most critical step in solving any Dynamic Programming problem?',
            options: ['Allocating a large array', 'Defining precisely what dp[i] or dp[i][j] represents in plain words', 'Writing while loops', 'Using recursion'],
            correctIndex: 1,
            explanation: 'Without a clear, unambiguous definition of the state semantics, formulating correct base cases and transition recurrences is impossible.'
          }
        }
      ]
    },
    {
      id: 'dsa-w4-d27',
      dayNumber: 27,
      weekNumber: 4,
      title: 'Greedy Algorithms & Interval Scheduling',
      subtitle: 'Greedy choice property, Activity Selection, Merge Intervals, Non-overlapping Intervals & Jump Game',
      durationMinutes: 75,
      overview:
        'Harness the speed of Greedy Algorithms that make locally optimal choices at each step. Understand when Greedy works vs when Dynamic Programming is required, master interval sorting by start vs end times, solve Non-overlapping Intervals, and conquer Jump Game I & II.',
      topics: [
        {
          id: 'dsa-w4-d27-t1',
          topicNumber: 1,
          title: 'The Greedy Choice Property vs Dynamic Programming',
          explanation: [
            'A Greedy Algorithm makes the locally optimal choice at each step, hoping to achieve the global optimum.',
            '- In **Dynamic Programming**: You evaluate ALL choices for a subproblem and take the optimal, caching results because local decisions may interact.',
            '- In **Greedy**: A mathematical property guarantees that ONE specific local choice is definitively part of the global optimal solution without needing to explore alternatives!',
            'Greedy algorithms run in $O(N)$ or $O(N \\log N)$, vastly faster and simpler than DP.'
          ],
          keyRules: [
            'Requires Greedy Choice Property and Optimal Substructure.',
            'If a greedy choice can lead to a dead-end, DP is required.'
          ],
          codeSnippet: {
            id: 'dsa-snip-27-1',
            title: 'Greedy vs DP Diagnostic',
            description: 'Comparing greedy local choice vs dynamic programming evaluation',
            language: 'python',
            code: `# Example: Coin Change for canonical currency [1, 5, 10, 25]:
# Greedy always works! 36 cents -> 25 + 10 + 1 (3 coins).
# Non-canonical [1, 3, 4] for 6:
# Greedy fails (4 + 1 + 1 = 3), DP required (3 + 3 = 2)!`
          },
          pitfall: 'Assuming a greedy choice works without proof: greedy algorithms frequently look intuitive but fail on subtle edge cases. Always construct counterexamples before committing to greedy.',
          quickCheck: {
            question: 'What distinguishes a Greedy algorithm from Dynamic Programming?',
            options: ['Greedy uses more memory', 'Greedy commits irrevocably to the locally best choice at each step without backtracking or comparing alternative paths', 'Greedy is only for graphs', 'Greedy requires recursion'],
            correctIndex: 1,
            explanation: 'Greedy never re-evaluates past decisions; it commits immediately to the best local choice, relying on mathematical proof that this leads to the global optimum.'
          }
        },
        {
          id: 'dsa-w4-d27-t2',
          topicNumber: 2,
          title: 'Activity Selection Problem (Interval Scheduling)',
          explanation: [
            'Problem: Given $N$ activities with start and finish times, select the maximum number of non-overlapping activities.',
            'THE GREEDY RULE: ALWAYS PICK THE ACTIVITY THAT FINISHES EARLIEST!',
            'Why? Finishing earliest leaves the maximum remaining time available for subsequent activities.',
            'Algorithm:',
            '1. Sort intervals by FINISH TIME `x[1]` in ascending order.',
            '2. Select first activity.',
            '3. For each subsequent activity: if `start >= prev_end`, select it and update `prev_end`.',
            'Time: $O(N \\log N)$ sorting dominates.'
          ],
          keyRules: [
            'Sort by END time (not start time).',
            'Greedily choose the activity that finishes earliest.'
          ],
          codeSnippet: {
            id: 'dsa-snip-27-2',
            title: 'Activity Selection via Earliest Finish Time',
            description: 'Greedy interval scheduling in O(N log N)',
            language: 'python',
            code: `def max_activities(intervals: list[list[int]]) -> int:
    # Sort by end time ascending
    intervals.sort(key=lambda x: x[1])
    count = 0
    prev_end = float('-inf')
    
    for start, end in intervals:
        if start >= prev_end:
            count += 1
            prev_end = end
            
    return count

acts = [[1, 4], [3, 5], [0, 6], [5, 7], [3, 9], [5, 9], [6, 10], [8, 11], [8, 12], [2, 14], [12, 16]]
print("Max compatible activities:", max_activities(acts)) # 4`
          },
          pitfall: 'Sorting by start time: sorting by start time fails on `[[0, 100], [1, 2], [3, 4]]` where picking the earliest start selects `[0, 100]`, blocking all other activities!',
          quickCheck: {
            question: 'Why does the Activity Selection problem sort intervals by END time rather than START time?',
            options: ['To sort numbers backwards', 'Picking the activity that finishes earliest frees up the resource as soon as possible, leaving maximum time for future tasks', 'Because start times can be negative', 'To avoid division by zero'],
            correctIndex: 1,
            explanation: 'Finishing early is strictly greedy; it leaves the largest possible remaining time window for subsequent compatible activities.'
          }
        },
        {
          id: 'dsa-w4-d27-t3',
          topicNumber: 3,
          title: 'Merge Intervals (Overlapping Interval Consolidation)',
          explanation: [
            'Problem: Given an array of intervals `[start, end]`, merge all overlapping intervals into one.',
            'Algorithm:',
            '1. Sort intervals by START TIME `x[0]` in ascending order.',
            '2. Append first interval to `merged`.',
            '3. Iterate through subsequent intervals `[curr_start, curr_end]`:',
            '   - If `curr_start <= merged[-1][1]`: they overlap! Extend end boundary: `merged[-1][1] = max(merged[-1][1], curr_end)`.',
            '   - Else: no overlap! Append `[curr_start, curr_end]` as a new interval.',
            'Time: $O(N \\log N)$ sorting dominates. Space: $O(N)$ for output.'
          ],
          keyRules: [
            'Sort by START time.',
            'Overlap condition: curr_start <= prev_end.',
            'Merged end is max(prev_end, curr_end).'
          ],
          codeSnippet: {
            id: 'dsa-snip-27-3',
            title: 'Merge Overlapping Intervals',
            description: 'Start-sorted interval consolidation in O(N log N)',
            language: 'python',
            code: `def merge_intervals(intervals: list[list[int]]) -> list[list[int]]:
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    
    for start, end in intervals[1:]:
        prev_end = merged[-1][1]
        if start <= prev_end:
            # Overlap: extend existing interval
            merged[-1][1] = max(prev_end, end)
        else:
            # Disjoint: append new interval
            merged.append([start, end])
            
    return merged

intvs = [[1,3],[2,6],[8,10],[15,18]]
print("Merged intervals:", merge_intervals(intvs)) # [[1, 6], [8, 10], [15, 18]]`
          },
          pitfall: 'Setting `merged[-1][1] = end` instead of `max(prev_end, end)`: fails when an interval is completely contained inside another `[[1, 10], [2, 3]]`.',
          quickCheck: {
            question: 'Why do we sort intervals by START time in Merge Intervals?',
            options: ['To find the shortest interval', 'Sorting by start time ensures overlapping intervals are adjacent in the list, allowing consolidation in a single linear pass', 'Because end times are unknown', 'Python requires it'],
            correctIndex: 1,
            explanation: 'Once sorted by start time, any interval that can possibly overlap with the current merged segment must start immediately adjacent to it.'
          }
        },
        {
          id: 'dsa-w4-d27-t4',
          topicNumber: 4,
          title: 'Non-Overlapping Intervals: Minimum Removals',
          explanation: [
            'Problem: Given a collection of intervals, find the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.',
            'Mathematical Equivalence:',
            '$\\text{Min Removals} = \\text{Total Intervals} - \\text{Maximum Non-Overlapping Intervals}$.',
            'This is the exact Activity Selection problem!',
            'Greedy Strategy: When two intervals overlap, ALWAYS REMOVE the one with the LARGER end time, because the one that ends later is more likely to cause future overlaps!'
          ],
          keyRules: [
            'Sort by start time or end time.',
            'On overlap: keep interval with smaller end time, increment removal count.'
          ],
          codeSnippet: {
            id: 'dsa-snip-27-4',
            title: 'Non-Overlapping Intervals Minimum Removals',
            description: 'Greedy removal of later-ending overlapping intervals in O(N log N)',
            language: 'python',
            code: `def erase_overlap_intervals(intervals: list[list[int]]) -> int:
    intervals.sort(key=lambda x: x[0])
    removals = 0
    prev_end = intervals[0][1]
    
    for start, end in intervals[1:]:
        if start < prev_end:
            # Overlap! Greedily remove the interval that finishes later
            removals += 1
            prev_end = min(prev_end, end)
        else:
            prev_end = end
            
    return removals

print("Min removals in [[1,2],[2,3],[3,4],[1,3]]:", erase_overlap_intervals([[1,2],[2,3],[3,4],[1,3]])) # 1`
          },
          pitfall: 'Keeping the later-ending interval on overlap: keeping the longer/later interval increases the probability of collision with subsequent intervals.',
          quickCheck: {
            question: 'When two intervals overlap in erase_overlap_intervals, which one is greedily removed?',
            options: ['The one that starts first', 'The one with the larger end time', 'The one with the smaller end time', 'Both are removed'],
            correctIndex: 1,
            explanation: 'Removing the interval that extends furthest into the future frees up space and minimizes future collisions.'
          }
        },
        {
          id: 'dsa-w4-d27-t5',
          topicNumber: 5,
          title: 'Jump Game I & II: Greedy Reach Horizon',
          explanation: [
            '- **Jump Game I**: Can you reach the last index? Maintain `max_reach`. At index $i$, if $i > \\text{max\\_reach}$, you are stranded (return `False`). Update `max_reach = max(max_reach, i + nums[i])`. Return `True` if `max_reach >= n - 1`.',
            '- **Jump Game II**: Find MINIMUM jumps to reach last index. Maintain `current_jump_end` and `farthest`. When $i$ reaches `current_jump_end`, we MUST make another jump: increment `jumps += 1`, set `current_jump_end = farthest`.',
            'Both run in strictly $O(N)$ time and $O(1)$ space!'
          ],
          keyRules: [
            'Jump Game I: strand condition is i > max_reach.',
            'Jump Game II: increment jumps when loop index hits current_jump_end.'
          ],
          codeSnippet: {
            id: 'dsa-snip-27-5',
            title: 'Jump Game I and II in O(N)',
            description: 'Greedy furthest horizon tracking in linear time',
            language: 'python',
            code: `def can_jump(nums: list[int]) -> bool:
    max_reach = 0
    for i, jump in enumerate(nums):
        if i > max_reach: return False
        max_reach = max(max_reach, i + jump)
        if max_reach >= len(nums) - 1: return True
    return True

def jump_min_steps(nums: list[int]) -> int:
    jumps = 0
    curr_end = 0
    farthest = 0
    for i in range(len(nums) - 1):
        farthest = max(farthest, i + nums[i])
        if i == curr_end:
            jumps += 1
            curr_end = farthest
    return jumps

print("Can jump [2,3,1,1,4]?", can_jump([2,3,1,1,4]))       # True
print("Min jumps [2,3,1,1,4]:", jump_min_steps([2,3,1,1,4])) # 2`
          },
          pitfall: 'Running the loop in Jump Game II up to `len(nums)`: iterating through the last index would trigger an extra unnecessary jump when you have already arrived at the destination.',
          quickCheck: {
            question: 'What is the time complexity of the greedy Jump Game I and II algorithms?',
            options: ['O(N^2)', 'O(N)', 'O(log N)', 'O(2^N)'],
            correctIndex: 1,
            explanation: 'A single linear pass over the array maintaining the furthest reach horizon runs in strictly O(N) time and O(1) space.'
          }
        },
        {
          id: 'dsa-w4-d27-t6',
          topicNumber: 6,
          title: 'Gas Station (Circular Tour Invariant)',
          explanation: [
            'Problem: $N$ gas stations along a circular route. `gas[i]` is gas available; `cost[i]` is gas to travel from $i$ to $i+1$. Find the starting station index to complete the circuit.',
            'Theorem 1: If `sum(gas) < sum(cost)`, it is IMPOSSIBLE to complete the circuit from ANY station (return `-1`).',
            'Theorem 2: If `sum(gas) >= sum(cost)`, a valid starting station is GUARANTEED to exist!',
            'Greedy Algorithm in a Single Pass:',
            '- Maintain `total_tank = 0` and `curr_tank = 0`.',
            '- For each station $i$: `curr_tank += gas[i] - cost[i]`.',
            '- If `curr_tank < 0`: station $i$ (and ANY station between `start` and $i$) cannot be the starting point! Reset `start = i + 1` and `curr_tank = 0`.'
          ],
          keyRules: [
            'sum(gas) >= sum(cost) guarantees a valid start exists.',
            'If curr_tank < 0, reset start = i + 1 in single pass O(N).'
          ],
          codeSnippet: {
            id: 'dsa-snip-27-6',
            title: 'Gas Station Single Pass O(N)',
            description: 'Greedy circular tour starting index discovery',
            language: 'python',
            code: `def can_complete_circuit(gas: list[int], cost: list[int]) -> int:
    if sum(gas) < sum(cost):
        return -1
        
    start_station = 0
    curr_tank = 0
    
    for i in range(len(gas)):
        curr_tank += gas[i] - cost[i]
        if curr_tank < 0:
            # Cannot start from any station from start_station up to i
            start_station = i + 1
            curr_tank = 0
            
    return start_station

g = [1, 2, 3, 4, 5]
c = [3, 4, 5, 1, 2]
print("Valid starting station index:", can_complete_circuit(g, c)) # 3 (station 4)`
          },
          pitfall: 'Testing every station with nested loops in $O(N^2)$: unnecessary, because if station $A$ cannot reach $B$, no station between $A$ and $B$ can reach $B$ either.',
          quickCheck: {
            question: 'Why can we discard all stations between `start_station` and `i` when `curr_tank` drops below zero?',
            options: ['Gas stations cannot be skipped', 'Because any intermediate station entered with positive gas and still failed at i; entering it with zero gas would fail even earlier', 'To save memory', 'Because cost is negative'],
            correctIndex: 1,
            explanation: 'Starting at A gave bonus accumulated gas entering intermediate station K; if even with bonus gas it failed at i, starting at K with 0 gas will certainly fail.'
          }
        },
        {
          id: 'dsa-w4-d27-t7',
          topicNumber: 7,
          title: 'Huffman Coding: Optimal Prefix Compression via Min-Heap',
          explanation: [
            'Huffman Coding is a greedy algorithm for lossless data compression.',
            'Characters with higher frequency are assigned SHORTER variable-length binary codes; rare characters are assigned LONGER codes.',
            'No code is a prefix of any other code (Prefix-Free Code).',
            'Algorithm with Min-Heap:',
            '1. Push all character frequencies into a Min-Heap.',
            '2. While heap has $> 1$ node:',
            '   Pop the two nodes with the SMALLEST frequencies ($f_1, f_2$).',
            '   Create internal parent node with frequency $f_1 + f_2$, and push back into heap.',
            '3. The final remaining node is the root of the optimal Huffman Tree!'
          ],
          keyRules: [
            'Repeatedly merges the two smallest frequency nodes.',
            'Forms the basis of JPEG, MP3, and Gzip compression.'
          ],
          codeSnippet: {
            id: 'dsa-snip-27-7',
            title: 'Huffman Tree Construction',
            description: 'Greedy min-heap prefix code generator',
            language: 'python',
            code: `import heapq

class HuffmanNode:
    def __init__(self, char, freq):
        self.char = char
        self.freq = freq
        self.left = None
        self.right = None
    def __lt__(self, other):
        return self.freq < other.freq

def build_huffman_tree(frequencies: dict[str, int]) -> HuffmanNode:
    heap = [HuffmanNode(c, f) for c, f in frequencies.items()]
    heapq.heapify(heap)
    
    while len(heap) > 1:
        n1 = heapq.heappop(heap)
        n2 = heapq.heappop(heap)
        merged = HuffmanNode(None, n1.freq + n2.freq)
        merged.left = n1
        merged.right = n2
        heapq.heappush(heap, merged)
        
    return heap[0]

tree = build_huffman_tree({'a': 45, 'b': 13, 'c': 12, 'd': 16, 'e': 9, 'f': 5})
print("Huffman Root Frequency:", tree.freq) # 100`
          },
          pitfall: 'Assigning fixed-length bits to all characters: fixed 8-bit ASCII wastes storage compared to dynamic 1-bit or 2-bit codes for frequent characters.',
          quickCheck: {
            question: 'In a Huffman Tree, which characters are located closest to the root with the shortest bit codes?',
            options: ['Vowels', 'Characters with the highest frequencies', 'Characters with the lowest frequencies', 'Consonants'],
            correctIndex: 1,
            explanation: 'Higher frequency nodes are merged late in the heap process, placing them closer to the root and granting them the shortest binary bit representations.'
          }
        },
        {
          id: 'dsa-w4-d27-t8',
          topicNumber: 8,
          title: 'Greedy Strategy Arsenal & Proof Techniques',
          explanation: [
            'How to prove a Greedy strategy is mathematically sound:',
            '1. **Exchange Argument (Greedy Stays Ahead)**: Assume an optimal solution differs from the greedy choice. Show that swapping the optimal choice with the greedy choice produces an equally good or better solution without violating constraints.',
            '2. **Matroid Theory**: Independent sets and greedy optimization structures.',
            'If you cannot construct an exchange argument, beware: the problem almost certainly requires Dynamic Programming!'
          ],
          keyRules: [
            'Use the Exchange Argument to verify greedy correctness.',
            'When in doubt: test against counterexamples or pivot to DP.'
          ],
          codeSnippet: {
            id: 'dsa-snip-27-8',
            title: 'Greedy Proof Template',
            description: 'Exchange argument verification framework',
            language: 'python',
            code: `def verify_greedy_applicability(has_exchange_proof: bool, subproblems_interact: bool) -> str:
    if has_exchange_proof and not subproblems_interact:
        return "Safe to use Greedy (O(N) or O(N log N))"
    return "Hazardous! Subproblems interact: use Dynamic Programming (O(N^2) or O(N*W))"

print("Assessment for Knapsack:", verify_greedy_applicability(False, True))`
          },
          pitfall: 'Choosing greedy because "it feels simpler": if greedy fails on 1 test case out of 100, the solution gets rejected. Prove greedy stays ahead first.',
          quickCheck: {
            question: 'What is the "Exchange Argument" in greedy algorithm design?',
            options: ['Trading money between functions', 'A proof technique showing that swapping any alternative choice in an optimal solution with the greedy choice does not decrease solution quality', 'Exchanging arrays for linked lists', 'Swapping pointers'],
            correctIndex: 1,
            explanation: 'The exchange argument mathematically demonstrates that the greedy choice is at least as good as any alternative choice at every decision step.'
          }
        }
      ]
    },
    {
      id: 'dsa-w4-d28',
      dayNumber: 28,
      weekNumber: 4,
      title: 'Backtracking, Master Capstone & Technical Interview Architecture',
      subtitle: 'Backtracking decision trees, N-Queens, Sudoku Solver, system scalability & Final Graduation Exam',
      durationMinutes: 80,
      overview:
        'Reach the pinnacle of algorithmic mastery. Explore state-space search with Backtracking (Permutations, Subsets, N-Queens, Sudoku Solver), synthesize the entire 4-week curriculum into a unified engineering decision engine, and complete the Academy Final Qualifying Exam.',
      topics: [
        {
          id: 'dsa-w4-d28-t1',
          topicNumber: 1,
          title: 'The Backtracking Blueprint: State-Space Tree Search',
          explanation: [
            'Backtracking systematically searches for solutions by evaluating candidates and PRUNING branches as soon as a constraint is violated.',
            'The Standard 3-Step Backtracking Blueprint:',
            '```python',
            'def backtrack(path, choices):',
            '    if is_solution(path):',
            '        result.append(path.copy()) # 1. Record deep copy',
            '        return',
            '    for choice in choices:',
            '        if is_valid(choice):',
            '            make_choice(choice)     # 2. Mutate state',
            '            backtrack(new_path)     # 3. Recurse',
            '            undo_choice(choice)     # 4. BACKTRACK state!',
            '```'
          ],
          keyRules: [
            'Always append a COPY of path: result.append(path[:]) or result.append(list(path)).',
            'Undo choice cleanly after the recursive call returns.'
          ],
          codeSnippet: {
            id: 'dsa-snip-28-1',
            title: 'Subsets Generation (Power Set)',
            description: 'Canonical backtracking decision tree in O(2^N)',
            language: 'python',
            code: `def subsets(nums: list[int]) -> list[list[int]]:
    res = []
    
    def backtrack(start: int, path: list[int]):
        res.append(path.copy()) # copy current subset
        for i in range(start, len(nums)):
            path.append(nums[i])   # make choice
            backtrack(i + 1, path) # recurse
            path.pop()             # undo choice (backtrack)
            
    backtrack(0, [])
    return res

print("Subsets of [1, 2]:", subsets([1, 2])) # [[], [1], [1, 2], [2]]`
          },
          pitfall: 'Appending `path` directly without `.copy()`: `res.append(path)` appends a reference to the mutable list, which empties out to `[[], [], []]` at the end of execution.',
          quickCheck: {
            question: 'Why must we append `path.copy()` instead of `path` when collecting backtracking solutions in Python?',
            options: ['Python requires it for syntax', 'Because path is mutated and popped on backtrack; appending a reference results in all saved solutions reflecting the final empty list state', 'To sort the subsets', 'To prevent integer overflow'],
            correctIndex: 1,
            explanation: 'Appending path appends a memory reference; mutating path later alters all previously appended entries unless a shallow copy path.copy() was saved.'
          }
        },
        {
          id: 'dsa-w4-d28-t2',
          topicNumber: 2,
          title: 'Permutations (All Ordering Permutations)',
          explanation: [
            'Problem: Given an array `nums` of distinct integers, return all possible permutations ($N!$).',
            'Backtracking Decision Tree:',
            '- Maintain a `used` boolean array or check `if nums[i] not in path`.',
            '- Base case: `len(path) == len(nums)`.',
            '- Recurse across all unused elements.',
            'Total permutations: $N!$. Total runtime: $O(N \\times N!)$.'
          ],
          keyRules: [
            'Base case is len(path) == len(nums).',
            'Use a boolean array `used` for O(1) membership checks.'
          ],
          codeSnippet: {
            id: 'dsa-snip-28-2',
            title: 'Permutations Generation',
            description: 'Generating N! ordering permutations with boolean visited array',
            language: 'python',
            code: `def permute(nums: list[int]) -> list[list[int]]:
    res = []
    used = [False] * len(nums)
    
    def backtrack(path):
        if len(path) == len(nums):
            res.append(path.copy())
            return
            
        for i in range(len(nums)):
            if not used[i]:
                used[i] = True
                path.append(nums[i])
                backtrack(path)
                path.pop()
                used[i] = False
                
    backtrack([])
    return res

print("Permutations of [1, 2]:", permute([1, 2])) # [[1, 2], [2, 1]]`
          },
          pitfall: 'Checking `if nums[i] in path` in a loop: searching a list takes O(N), slowing down backtracking. Use the boolean array `used[i]` for O(1) checks.',
          quickCheck: {
            question: 'How many permutations exist for an array of N distinct elements?',
            options: ['2^N', 'N!', 'N^2', 'N log N'],
            correctIndex: 1,
            explanation: 'There are N choices for the first position, N-1 for the second, ..., yielding N! total permutations.'
          }
        },
        {
          id: 'dsa-w4-d28-t3',
          topicNumber: 3,
          title: 'N-Queens: Constraint Propagation & Diagonal Math',
          explanation: [
            'Problem: Place $N$ queens on an $N \\times N$ chessboard such that no two queens attack each other (no shared row, column, or diagonal).',
            'Row-by-Row Search: Place exactly one queen per row $r$ from $0$ to $N - 1$.',
            'Constraint Checking in $O(1)$ with Hash Sets:',
            '- Column conflict: `c in cols`.',
            '- Positive diagonal conflict ($/$): cells sharing same $r + c$ sum! `r + c in pos_diags`.',
            '- Negative diagonal conflict ($\\backslash$): cells sharing same $r - c$ difference! `r - c in neg_diags`.'
          ],
          keyRules: [
            'Positive diagonal index is (r + c).',
            'Negative diagonal index is (r - c).',
            'Provides instant O(1) attack safety checks.'
          ],
          codeSnippet: {
            id: 'dsa-snip-28-3',
            title: 'N-Queens Solver with O(1) Diagonal Sets',
            description: 'Row-by-row constraint satisfaction in N-Queens',
            language: 'python',
            code: `def solve_n_queens(n: int) -> list[list[str]]:
    cols = set()
    pos_diags = set() # (r + c)
    neg_diags = set() # (r - c)
    res = []
    board = [["."] * n for _ in range(n)]
    
    def backtrack(r: int):
        if r == n:
            res.append(["".join(row) for row in board])
            return
            
        for c in range(n):
            if c in cols or (r + c) in pos_diags or (r - c) in neg_diags:
                continue # Attacked!
                
            # Place queen
            cols.add(c); pos_diags.add(r + c); neg_diags.add(r - c)
            board[r][c] = "Q"
            
            backtrack(r + 1)
            
            # Remove queen (backtrack)
            cols.remove(c); pos_diags.remove(r + c); neg_diags.remove(r - c)
            board[r][c] = "."
            
    backtrack(0)
    return res

queens_4 = solve_n_queens(4)
print(f"Total valid configurations for 4-Queens: {len(queens_4)}") # 2 solutions`
          },
          pitfall: 'Scanning the board diagonally with while-loops to check safety: slow! Using `pos_diags` and `neg_diags` sets checks safety in O(1).',
          quickCheck: {
            question: 'What mathematical property is identical for all cells on the same positive diagonal (/) of a chessboard?',
            options: ['r - c is constant', 'r + c is constant', 'r * c is constant', 'r == c'],
            correctIndex: 1,
            explanation: 'Moving along a positive diagonal increases row by 1 and decreases column by 1, keeping the sum (r + c) invariant.'
          }
        },
        {
          id: 'dsa-w4-d28-t4',
          topicNumber: 4,
          title: 'Sudoku Solver: 9x9 Constraint Satisfaction',
          explanation: [
            'Problem: Solve a 9x9 Sudoku puzzle by filling empty cells `"."` with digits 1-9.',
            'Constraints: Each digit must occur exactly once in each row, each column, and each $3 \\times 3$ subgrid.',
            'Subgrid index: `(r // 3, c // 3)`.',
            'Algorithm:',
            '- Find next empty cell `(r, c)`. If none remain, puzzle is SOLVED! Return True.',
            '- Try digits `"1"` through `"9"`: if valid, place digit and recurse.',
            '- If recursion returns True: propagate True upward to halt search.',
            '- If all 9 digits fail: reset `board[r][c] = "."` and return False.'
          ],
          keyRules: [
            'Subgrid index: (r // 3) * 3 + (c // 3).',
            'Return boolean from backtrack to stop immediately when solution is found.'
          ],
          codeSnippet: {
            id: 'dsa-snip-28-4',
            title: 'Sudoku Solver Backtracking Engine',
            description: 'Solving 9x9 Sudoku via recursive constraint search',
            language: 'python',
            code: `def solve_sudoku(board: list[list[str]]) -> bool:
    def is_valid(r, c, ch):
        for i in range(9):
            if board[r][i] == ch: return False
            if board[i][c] == ch: return False
            # Check 3x3 box
            box_r = 3 * (r // 3) + i // 3
            box_c = 3 * (c // 3) + i % 3
            if board[box_r][box_c] == ch: return False
        return True
        
    def solve() -> bool:
        for r in range(9):
            for c in range(9):
                if board[r][c] == ".":
                    for digit in "123456789":
                        if is_valid(r, c, digit):
                            board[r][c] = digit
                            if solve(): return True
                            board[r][c] = "." # Backtrack
                    return False
        return True # All cells filled!
        
    solve()
    return True`
          },
          pitfall: 'Not returning True from the recursive call: if you do not check `if solve(): return True`, the function will backtrack out of the correct solution and erase the board back to empty.',
          quickCheck: {
            question: 'What is the row and column formula for inspecting cell `i` (from 0 to 8) within a 3x3 Sudoku subgrid?',
            options: ['r = 3 * (r // 3) + i // 3, c = 3 * (c // 3) + i % 3', 'r = r + i, c = c + i', 'r = i, c = i', 'r = 3i, c = 3i'],
            correctIndex: 0,
            explanation: 'The base box corner is at 3*(r//3) and 3*(c//3); index i translates into row offset i//3 and column offset i%3.'
          }
        },
        {
          id: 'dsa-w4-d28-t5',
          topicNumber: 5,
          title: 'Algorithmic Complexity Master Cheat Sheet & Decision Flowchart',
          explanation: [
            'When reading an algorithmic problem:',
            '1. Look at $N$:',
            '   - $N \\le 12$: Permutations ($O(N!)$).',
            '   - $N \\le 20$: Backtracking / Subsets ($O(2^N)$).',
            '   - $N \\le 500$: Floyd-Warshall / 3D DP ($O(N^3)$).',
            '   - $N \\le 2,000$: 2D DP / Nested loops ($O(N^2)$).',
            '   - $N \\le 200,000$: Sorting, Binary Search, Heaps, Two Pointers, Monotonic Stack ($O(N \\log N)$ or $O(N)$).',
            '   - $N \\ge 10^9$: Binary search on answer, Math, Bit manipulation ($O(\\log N)$ or $O(1)$).',
            '2. Identify data structure by access pattern.'
          ],
          keyRules: [
            'Target < 10^8 operations per second in modern online judges.',
            'Match input constraint N to viable complexity classes.'
          ],
          codeSnippet: {
            id: 'dsa-snip-28-5',
            title: 'Master Complexity Decision Engine',
            description: 'Algorithmic strategy evaluator based on input size',
            language: 'python',
            code: `def decide_strategy(n: int, properties: list[str]) -> str:
    if "sorted" in properties and n > 1000:
        return "Binary Search or Two Pointers (O(log N) or O(N))"
    if "shortest_path_unweighted" in properties:
        return "BFS Queue (O(V + E))"
    if "shortest_path_weighted" in properties:
        return "Dijkstra with Min-Heap (O((V + E) log V))"
    if "subarray_sum" in properties:
        return "Prefix Sum + Hash Map (O(N))"
    if n <= 20:
        return "Backtracking / Bitmask DP (O(2^N))"
    return "Dynamic Programming or Greedy"

print("Optimal strategy for sorted N=100,000:", decide_strategy(100_000, ["sorted"]))`
          },
          pitfall: 'Skipping constraint inspection: constraints are the primary clue provided by the problem author regarding which Big-O complexity will pass.',
          quickCheck: {
            question: 'If a problem has constraint N = 50,000, what is the maximum permissible Big-O time complexity?',
            options: ['O(N^3)', 'O(N^2) (borderline/fail)', 'O(N log N) or O(N)', 'O(2^N)'],
            correctIndex: 2,
            explanation: 'N = 50,000 squared is 2.5 * 10^9 operations, which will exceed the 1.0s timeout (~10^8 ops). O(N log N) requires only ~8 * 10^5 operations.'
          }
        },
        {
          id: 'dsa-w4-d28-t6',
          topicNumber: 6,
          title: 'System Scalability: From Algorithm to Distributed Systems',
          explanation: [
            'How foundational DSA scales into massive cloud systems:',
            '- **Hash Maps** -> Consistent Hashing in Distributed Caches (Redis, Memcached, DynamoDB).',
            '- **Tries** -> Autocomplete and routing in DNS systems and CDNs (Cloudflare).',
            '- **B-Trees** -> Storage engines in PostgreSQL and MySQL (InnoDB).',
            '- **LSM Trees (Log-Structured Merge Trees)** -> Append-only storage in Cassandra, RocksDB, BigTable.',
            '- **Bloom Filters** -> Probabilistic existence checking preventing expensive disk lookups.',
            '- **Graph BFS/Dijkstra** -> Social networks (Facebook Graph API) and navigation (Google Maps).'
          ],
          keyRules: [
            'Algorithms form the atomic building blocks of distributed architecture.',
            'Memory constraints drive persistent storage tree designs.'
          ],
          codeSnippet: {
            id: 'dsa-snip-28-7',
            title: 'System Scalability Mapping',
            description: 'Connecting fundamental DSA to cloud architecture',
            language: 'python',
            code: `architectures = {
    "Hash Table": "Consistent Hashing Ring (DynamoDB / Cassandra)",
    "B-Tree": "Database Storage Engine (PostgreSQL / InnoDB)",
    "Trie": "Search Engine Autocomplete & IP Routing (Cloudflare)",
    "Priority Queue": "OS Kernel Process Scheduler & Event Loop",
    "LRU Cache": "Operating System Page Replacement & Web Proxies"
}
for dsa, cloud in architectures.items():
    print(f"{dsa:15s} ---> {cloud}")`
          },
          pitfall: 'Thinking algorithms exist only in isolation: enterprise systems engineering is the application of optimal data structures under hardware constraints.',
          quickCheck: {
            question: 'What distributed caching pattern adapts the hash table concept to minimize remapping when cache servers join or leave?',
            options: ['Binary Search', 'Consistent Hashing', 'Bubble Sort', 'Linear Probing'],
            correctIndex: 1,
            explanation: 'Consistent Hashing maps both keys and servers to a circular hash ring, requiring only K/N keys to be remapped when a server is added or removed.'
          }
        },
        {
          id: 'dsa-w4-d28-t7',
          topicNumber: 7,
          title: 'The Coding Interview Framework: Communication & Execution',
          explanation: [
            'Top-tier engineering candidates follow a disciplined interview execution protocol:',
            '1. **Clarify (3-5 min)**: Restate problem, clarify input types, edge cases ($N=0$, negatives, duplicates), and verify constraints.',
            '2. **Explore Solutions (5-7 min)**: State naive brute force, identify bottleneck, propose optimal approach, and state Time & Space complexity BEFORE writing code.',
            '3. **Code (15-20 min)**: Write clean, modular, variable-named code. Speak through your thought process.',
            '4. **Dry Run & Test (5 min)**: Manually trace code with a non-trivial test case and edge cases (single element, empty). Catch boundary bugs before the interviewer points them out.'
          ],
          keyRules: [
            'Never write code in silence: explain your intent continuously.',
            'State asymptotic complexity explicitly before typing the first line.'
          ],
          codeSnippet: {
            id: 'dsa-snip-28-8',
            title: 'Candidate Interview Rubric Checklist',
            description: 'Checklist for technical engineering interviews',
            language: 'python',
            code: `def interview_checklist():
    steps = [
        "1. Clarified constraints, assumptions and edge cases",
        "2. Formulated brute force and identified optimal pattern",
        "3. Stated Big-O Time and Space complexity explicitly",
        "4. Wrote clean, idiomatic code without syntax shortcuts",
        "5. Manually dry-ran with test case and verified boundary conditions"
    ]
    for s in steps: print(f" [V] {s}")

interview_checklist()`
          },
          pitfall: 'Asking "Does this look good?" without testing your own code: always dry-run with a small example to demonstrate testing discipline.',
          quickCheck: {
            question: 'What should you do immediately after completing the code implementation in a technical interview?',
            options: ['Tell the interviewer you are done and wait', 'Manually trace the code step-by-step using a sample input and test boundary edge cases', 'Delete the code and start over', 'Ask for the answer'],
            correctIndex: 1,
            explanation: 'Top software engineers demonstrate maturity by rigorously walking through their code with a test case to verify correctness and catch off-by-one errors.'
          }
        },
        {
          id: 'dsa-w4-d28-t8',
          topicNumber: 8,
          title: 'The Grand Synthesis: 28 Days of Algorithmic Mastery',
          explanation: [
            'Congratulations on completing the entire 4-week, 28-day DSA Mastery Academy!',
            'You have mastered the foundational disciplines of computer science:',
            '- Week 1: Asymptotics, Arrays, Two Pointers, Sliding Window, Binary Search.',
            '- Week 2: Linked Lists, Stacks, Monotonic Queues, Hash Tables, LRU Cache.',
            '- Week 3: Binary Trees, BSTs, AVL/Red-Black Invariants, Heaps, Tries, DSU.',
            '- Week 4: Graphs (BFS/DFS, Dijkstra, Topological Sort), 1D/2D Dynamic Programming, Greedy Intervals, and Backtracking.',
            'You possess the knowledge, mental models, and muscle memory to conquer any technical coding challenge and architect scalable software.'
          ],
          keyRules: [
            'All 28 days and 224 topics mastered.',
            'Proceed to the Final Qualifying Exam and claim your certification!'
          ],
          codeSnippet: {
            id: 'dsa-snip-28-9',
            title: 'DSA Mastery Academy Final Graduation Synthesis',
            description: 'Celebration of complete curriculum mastery',
            language: 'python',
            code: `def print_graduation_certificate():
    print("====================================================")
    print(" DATA STRUCTURES & ALGORITHMS MASTERY ACADEMY      ")
    print(" 28 DAYS * 224 IN-DEPTH TOPICS COMPLETED!          ")
    print("====================================================")
    modules = [
        "Module 1: Asymptotics, Two Pointers & Binary Search",
        "Module 2: Linear Structures, Monotonic Stacks & LRU Cache",
        "Module 3: Trees, BSTs, Heaps, Tries & DSU",
        "Module 4: Graphs, Dynamic Programming & Backtracking"
    ]
    for m in modules:
        print(f" [GRADUATED] {m}")
    print("\\nReady for the Final Qualifying Exam!")

print_graduation_certificate()`
          },
          pitfall: 'Stopping here: algorithms are a continuous discipline. Practice weekly, solve competitive programming problems, and review patterns regularly.',
          quickCheck: {
            question: 'What is the primary philosophical foundation of optimal algorithmic design?',
            options: ['Memorizing code snippets', 'Identifying mathematical invariants, eliminating redundant search spaces, and leveraging mechanical sympathy with hardware cache hierarchies', 'Using the latest programming language', 'Writing short variable names'],
            correctIndex: 1,
            explanation: 'Algorithmic mastery is the ability to recognize structural invariants, eliminate wasted computation through appropriate data structures, and execute in harmony with hardware.'
          }
        }
      ]
    }
  ],
  quiz: {
    id: 'dsa-quiz-4',
    weekNumber: 4,
    title: 'Module 4 Qualifying Exam: Graphs, Dynamic Programming & Advanced Algorithms',
    description: 'Verify your mastery of Topological Sort, Dijkstra, 1D/2D Dynamic Programming, Greedy intervals, and Backtracking.',
    passingScorePercent: 80,
    questions: [
      {
        id: 'dsa-q4-1',
        question: 'In Kahn\'s Topological Sort algorithm, how does the algorithm detect that a directed graph contains a cycle?',
        options: [
          'It throws an unhandled exception',
          'The number of nodes appended to the final topological order is strictly less than the total number of vertices V',
          'The in-degree of all nodes becomes negative',
          'The queue runs in an infinite loop'
        ],
        correctIndex: 1,
        explanation: 'Nodes inside a cycle never have their in-degrees reduced to zero because they depend circularly on each other; therefore, they are never enqueued, leaving len(order) < V.'
      },
      {
        id: 'dsa-q4-2',
        question: 'Why does Dijkstra\'s Shortest Path algorithm fail on graphs with negative edge weights?',
        options: [
          'Min-heaps cannot compare negative numbers',
          'Once a node is popped from the min-heap, Dijkstra assumes its shortest distance is permanently finalized; a subsequent negative edge could offer a cheaper path to that finalized node, violating the greedy invariant',
          'Negative edge weights cause segmentation faults in Python',
          'Dijkstra requires all vertices to have even degree'
        ],
        correctIndex: 1,
        explanation: 'Dijkstra relies on the greedy invariant that adding non-negative edges can only increase path distance. A negative edge can decrease distance to a previously finalized node, breaking correctness.'
      },
      {
        id: 'dsa-q4-3',
        question: 'In the 1D space-optimized 0/1 Knapsack algorithm, why MUST the capacity w be iterated in REVERSE (from W down to item_weight)?',
        options: [
          'To sort the items',
          'To ensure that dp[w - weight] reflects the value from the previous item rather than the current item, preventing the current item from being used multiple times',
          'To optimize CPU cache prefetching',
          'Because capacity is decremented'
        ],
        correctIndex: 1,
        explanation: 'Reverse iteration ensures that dp[w - weight] has not yet been updated for the current item, guaranteeing that each item is included at most once (0/1).'
      },
      {
        id: 'dsa-q4-4',
        question: 'What mathematical property is identical for all cells lying on the same positive diagonal (/) of an N x N chessboard in N-Queens?',
        options: [
          'The row index r equals the column index c',
          'The sum of row and column indices (r + c) is constant',
          'The product (r * c) is constant',
          'The difference (r - c) is constant'
        ],
        correctIndex: 1,
        explanation: 'Moving along a positive diagonal increases r by 1 and decreases c by 1, preserving the sum r + c as an invariant.'
      },
      {
        id: 'dsa-q4-5',
        question: 'In Longest Common Subsequence (LCS), what is the state transition when text1[i-1] == text2[j-1]?',
        options: [
          'dp[i][j] = dp[i-1][j] + 1',
          'dp[i][j] = 1 + dp[i-1][j-1]',
          'dp[i][j] = max(dp[i-1][j], dp[i][j-1])',
          'dp[i][j] = dp[i-1][j-1]'
        ],
        correctIndex: 1,
        explanation: 'When the current characters match, both characters are included in the common subsequence, extending the optimal subsequence of the smaller prefixes by 1: 1 + dp[i-1][j-1].'
      }
    ]
  }
};
