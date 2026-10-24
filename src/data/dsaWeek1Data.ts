import { WeekModule } from '../types/course';

export const DSA_WEEK_1_MODULE: WeekModule = {
  weekNumber: 1,
  title: 'Asymptotics, Dynamic Arrays, Two Pointers & Binary Search',
  theme: 'Complexity Analysis, Contiguous Memory, Window Slicing & Logarithmic Search',
  description:
    'Build uncompromising foundations in Data Structures & Algorithms: Big-O asymptotic analysis, dynamic array mechanics, two-pointer invariants, sliding window optimizations, sorting mechanics, and binary search space reduction.',
  conceptImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80',
  imageAlt: 'Data structures, algorithms and computational complexity visualization',
  days: [
    {
      id: 'dsa-w1-d1',
      dayNumber: 1,
      weekNumber: 1,
      title: 'Asymptotic Analysis & Mathematical Big-O Foundations',
      subtitle: 'Big-O, Big-Omega, Big-Theta, space vs time complexity, recursion trees & Master Theorem',
      durationMinutes: 65,
      overview:
        'Transition from naive code execution to rigorous asymptotic reasoning. Master Big-O upper bounds, Omega lower bounds, Theta tight bounds, amortized runtime, auxiliary space analysis, and recurrence relations.',
      topics: [
        {
          id: 'dsa-w1-d1-t1',
          topicNumber: 1,
          title: 'The Language of Growth: Why Constant Factors Disappear',
          explanation: [
            'Asymptotic analysis evaluates how an algorithm runtime or memory scales as input size $N$ approaches infinity ($N \\to \\infty$).',
            'We ignore machine-specific constants (CPU clock speed, compiler flags) because as $N$ grows from 1,000 to 1,000,000, the growth rate dominates the constant multipliers.',
            'An $O(N)$ algorithm will always beat an $O(N^2)$ algorithm for sufficiently large $N$, even if the $O(N)$ algorithm has a constant factor of 100.'
          ],
          keyRules: [
            'Drop low-order terms: $3N^2 + 50N + 1000 \\implies O(N^2)$.',
            'Drop constant coefficients: $1000N \\implies O(N)$.'
          ],
          codeSnippet: {
            id: 'dsa-snip-1-1',
            title: 'Growth Rates Comparison',
            description: 'Comparing linear growth vs quadratic growth as N increases',
            language: 'python',
            code: `# Comparing step counts between O(N) and O(N^2)
def compare_growth(n: int):
    linear_steps = n
    quadratic_steps = n * n
    ratio = quadratic_steps / linear_steps
    print(f"N = {n:,} -> Linear: {linear_steps:,} ops | Quad: {quadratic_steps:,} ops | Ratio: {ratio:.0f}x")

for n in [10, 100, 1000, 10000]:
    compare_growth(n)`
          },
          pitfall: 'Assuming an O(N) algorithm is always faster than O(N^2) for tiny inputs (e.g., N=3): constant factors do matter for tiny N, but algorithms are designed for scaling.',
          quickCheck: {
            question: 'What is the asymptotic Big-O classification of f(N) = 7N^3 + 150N^2 + 9999N + 42?',
            options: ['O(N)', 'O(N^2)', 'O(N^3)', 'O(150N^2)'],
            correctIndex: 2,
            explanation: 'In asymptotic analysis, we drop non-dominant lower terms and multiplicative constants, leaving the highest-order term O(N^3).'
          }
        },
        {
          id: 'dsa-w1-d1-t2',
          topicNumber: 2,
          title: 'Big-O, Big-Omega (Ω), and Big-Theta (Θ)',
          explanation: [
            '- $O(g(N))$: Upper bound (asymptotic worst-case growth). $f(N) \\le c \\cdot g(N)$ for large $N$.',
            '- $\\Omega(g(N))$: Lower bound (asymptotic best-case growth). $f(N) \\ge c \\cdot g(N)$ for large $N$.',
            '- $\\Theta(g(N))$: Tight bound. $f(N)$ is bounded both above and below by $g(N)$.',
            'In software engineering interviews, people colloquially say "Big-O", but they usually seek the tightest bound $\\Theta(N)$.'
          ],
          keyRules: [
            'Big-O is an upper bound: saying linear search is O(N^3) is mathematically true, but not informative. Always provide the tightest upper bound.',
            'Theta represents both upper and lower bounds simultaneously.'
          ],
          codeSnippet: {
            id: 'dsa-snip-1-2',
            title: 'Best, Worst, and Average Cases',
            description: 'Linear search demonstrating distinct case complexities',
            language: 'python',
            code: `def linear_search(arr: list[int], target: int) -> int:
    # Best Case: target at arr[0] -> Omega(1)
    # Worst Case: target at end or absent -> O(N)
    # Average Case: target at N/2 -> Theta(N)
    for idx, val in enumerate(arr):
        if val == target:
            return idx
    return -1

nums = [10, 20, 30, 40, 50]
print("Best Case index:", linear_search(nums, 10))  # 1 operation
print("Worst Case index:", linear_search(nums, 99)) # 5 operations`
          },
          pitfall: 'Confusing "Worst Case" with "Big-O": Big-O is an upper bound for any function, while worst-case is the input scenario that requires the most steps.',
          quickCheck: {
            question: 'What is the best-case time complexity of linear search on an array of size N?',
            options: ['O(N)', 'Omega(1)', 'Theta(N log N)', 'O(log N)'],
            correctIndex: 1,
            explanation: 'If the target element is at index 0, linear search completes in exactly 1 operation, which is Omega(1).'
          }
        },
        {
          id: 'dsa-w1-d1-t3',
          topicNumber: 3,
          title: 'Space Complexity: Auxiliary Space vs Input Space',
          explanation: [
            'Total Space Complexity = Input Space + Auxiliary (Working) Space.',
            'Input Space is the memory required to hold the inputs themselves.',
            'Auxiliary Space is the temporary working memory allocated by the algorithm to solve the problem (call stack frames, hash sets, temporary arrays).',
            'When interviewers ask for space complexity, they almost universally refer to Auxiliary Space.'
          ],
          keyRules: [
            'In-place algorithms have $O(1)$ auxiliary space.',
            'Recursive call stacks consume $O(D)$ auxiliary space where $D$ is the maximum recursion depth.'
          ],
          codeSnippet: {
            id: 'dsa-snip-1-3',
            title: 'In-Place vs Out-of-Place Space Consumption',
            description: 'Comparing O(1) auxiliary space vs O(N) auxiliary space',
            language: 'python',
            code: `# Out-of-Place: O(N) auxiliary space
def reverse_copy(arr: list[int]) -> list[int]:
    return [arr[i] for i in range(len(arr) - 1, -1, -1)]

# In-Place: O(1) auxiliary space
def reverse_in_place(arr: list[int]) -> None:
    left, right = 0, len(arr) - 1
    while left < right:
        arr[left], arr[right] = arr[right], arr[left]
        left += 1
        right -= 1

data = [1, 2, 3, 4]
reverse_in_place(data)
print("In-place reversed:", data)`
          },
          pitfall: 'Forgetting the implicit recursion stack when measuring space: recursive Fibonacci has depth N, so it consumes O(N) auxiliary stack memory even without explicit lists.',
          quickCheck: {
            question: 'What is the auxiliary space complexity of an algorithm that modifies its input array in-place using two integer pointers?',
            options: ['O(N)', 'O(1)', 'O(log N)', 'O(N^2)'],
            correctIndex: 1,
            explanation: 'Two scalar integer pointers consume a constant number of bytes regardless of input size N, making auxiliary space O(1).'
          }
        },
        {
          id: 'dsa-w1-d1-t4',
          topicNumber: 4,
          title: 'Common Complexity Classes Ranked',
          explanation: [
            'From fastest to slowest:',
            '1. $O(1)$: Constant time (hash map lookup, array index).',
            '2. $O(\\log N)$: Logarithmic time (binary search, balanced BST search).',
            '3. $O(N)$: Linear time (array traversal, counting).',
            '4. $O(N \\log N)$: Linearithmic time (Merge sort, Heap sort, Tim sort).',
            '5. $O(N^2)$: Quadratic time (nested loops, bubble sort).',
            '6. $O(2^N)$: Exponential time (recursive power set, naive Fibonacci).',
            '7. $O(N!)$: Factorial time (permutations, Traveling Salesperson brute force).'
          ],
          keyRules: [
            'If $N = 10^5$, an $O(N^2)$ algorithm does $10^{10}$ ops and will TIME OUT (> 1 second). You MUST aim for $O(N \\log N)$ or $O(N)$.',
            'If $N = 10^8$, only $O(N)$ or $O(\\log N)$ can pass.'
          ],
          codeSnippet: {
            id: 'dsa-snip-1-4',
            title: 'Operations Estimate by Complexity Class',
            description: 'Calculating ops for N = 10,000 across complexity classes',
            language: 'python',
            code: `import math

N = 10_000
print(f"O(1):       1 operation")
print(f"O(log N):   {math.log2(N):.1f} operations")
print(f"O(N):       {N:,} operations")
print(f"O(N log N): {int(N * math.log2(N)):,} operations")
print(f"O(N^2):     {N**2:,} operations (Dangerous for N > 10,000!)")`
          },
          pitfall: 'Assuming O(N log N) is close to O(N^2): for N=1,000,000, N log N is ~20 million ops (instant), whereas N^2 is 1 trillion ops (hours of computation!).',
          quickCheck: {
            question: 'If an interview problem has input constraint N <= 100,000 and a 1.0 second execution limit, which complexity is acceptable?',
            options: ['O(N^2)', 'O(N!)', 'O(N log N)', 'O(2^N)'],
            correctIndex: 2,
            explanation: '100,000 ops * log2(100,000) is approx 1.7 * 10^6 ops, executing in ~10ms. O(N^2) would be 10^10 ops, exceeding the ~10^8 ops per second CPU threshold.'
          }
        },
        {
          id: 'dsa-w1-d1-t5',
          topicNumber: 5,
          title: 'Amortized Complexity: The Accounting Method',
          explanation: [
            'Amortized analysis evaluates the average performance of each operation over a worst-case sequence of operations.',
            'Example: Dynamic array append (`push_back`). Most appends take $O(1)$.',
            'Occasionally, when the array is full, it allocates double capacity and copies all $N$ elements, taking $O(N)$.',
            'However, doubling happens only after $N$ cheap operations. Distributing that $O(N)$ copy cost over $N$ appends yields an AMORTIZED runtime of $O(1)$ per append.'
          ],
          keyRules: [
            'Amortized O(1) means any sequence of K operations takes O(K) total time.',
            'Dynamic array resizing with geometric doubling (factor 2 or 1.5) guarantees amortized O(1).'
          ],
          codeSnippet: {
            id: 'dsa-snip-1-5',
            title: 'Simulating Dynamic Array Doubling Cost',
            description: 'Tracking total copy costs over N appends',
            language: 'python',
            code: `def simulate_dynamic_array(n: int):
    capacity = 1
    total_copies = 0
    
    for i in range(1, n + 1):
        if i > capacity:
            total_copies += (i - 1) # copy existing elements
            capacity *= 2
            
    print(f"Total elements appended: {n:,}")
    print(f"Total element copies during resizing: {total_copies:,}")
    print(f"Average copy cost per append: {total_copies / n:.2f} (Bounded by O(1)!)")

simulate_dynamic_array(100_000)`
          },
          pitfall: 'Increasing array capacity by a fixed constant (e.g. +10 elements each resize) results in O(N^2) total copy time, degrading amortized append to O(N)!',
          quickCheck: {
            question: 'What is the amortized time complexity of appending an element to a dynamically resizing array that doubles capacity when full?',
            options: ['O(N)', 'O(1)', 'O(log N)', 'O(N^2)'],
            correctIndex: 1,
            explanation: 'Because capacity grows geometrically (doubling), the expensive O(N) copy is amortized over N preceding operations, making each append amortized O(1).'
          }
        },
        {
          id: 'dsa-w1-d1-t6',
          topicNumber: 6,
          title: 'Recursion Trees and Call Stack Frame Space',
          explanation: [
            'To analyze recursive time complexity, draw the Recursion Tree.',
            'Total Time = (Number of tree nodes) $\\times$ (Work done per node).',
            'Total Auxiliary Space = Maximum depth of the recursion tree $\\times$ (Memory per stack frame).',
            'Binary branching without memoization (like naive Fibonacci) creates $2^N$ nodes, leading to disastrous $O(2^N)$ time complexity.'
          ],
          keyRules: [
            'Recursion depth equals the longest root-to-leaf path in the recursion tree.',
            'Stack Overflow occurs when recursion depth exceeds the OS stack limit (usually ~1,000 to 10,000 frames).'
          ],
          codeSnippet: {
            id: 'dsa-snip-1-6',
            title: 'Recursion Tree Depth and Calls',
            description: 'Tracking total call count in naive divide and conquer',
            language: 'python',
            code: `call_count = 0

def fib(n: int, depth: int = 0) -> int:
    global call_count
    call_count += 1
    if n <= 1:
        return n
    return fib(n - 1, depth + 1) + fib(n - 2, depth + 1)

print("fib(10) =", fib(10))
print("Total recursive calls:", call_count) # 177 calls for just N=10!`
          },
          pitfall: 'Assuming recursion space is proportional to total calls: space is proportional only to the MAX CURRENT DEPTH of the active call stack at any one instant.',
          quickCheck: {
            question: 'For a recursive function with depth D that makes 2 branch calls at each step, what is the maximum auxiliary stack space?',
            options: ['O(2^D)', 'O(D)', 'O(1)', 'O(D^2)'],
            correctIndex: 1,
            explanation: 'The call stack only holds the currently active ancestor frames along the path from root to leaf, which is O(D) memory.'
          }
        },
        {
          id: 'dsa-w1-d1-t7',
          topicNumber: 7,
          title: 'The Master Theorem for Divide-and-Conquer Recurrences',
          explanation: [
            'The Master Theorem provides instant asymptotic bounds for recurrences of the form:',
            '$T(N) = a \\cdot T(N/b) + O(N^d)$ where $a \\ge 1, b > 1$.',
            '- Case 1: If $d < \\log_b a$, then $T(N) = O(N^{\\log_b a})$ (leaf-heavy, e.g. Strassen matrix multiplication).',
            '- Case 2: If $d = \\log_b a$, then $T(N) = O(N^d \\log N)$ (balanced, e.g. Merge Sort: $a=2, b=2, d=1 \\implies O(N \\log N)$).',
            '- Case 3: If $d > \\log_b a$, then $T(N) = O(N^d)$ (root-heavy, work at root dominates).'
          ],
          keyRules: [
            'Binary search: $T(N) = 1 \\cdot T(N/2) + O(1) \\implies a=1, b=2, d=0 \\implies \\log_2 1 = 0 = d \\implies O(\\log N)$.',
            'Merge sort: $T(N) = 2 \\cdot T(N/2) + O(N) \\implies a=2, b=2, d=1 \\implies \\log_2 2 = 1 = d \\implies O(N \\log N)$.'
          ],
          codeSnippet: {
            id: 'dsa-snip-1-7',
            title: 'Master Theorem Recurrence Solver',
            description: 'Automated evaluation of Master Theorem cases',
            language: 'python',
            code: `import math

def master_theorem(a: int, b: int, d: float):
    log_b_a = math.log(a, b)
    if abs(d - log_b_a) < 1e-9:
        return f"Case 2 (Balanced): O(N^{d:.0f} * log N)"
    elif d < log_b_a:
        return f"Case 1 (Leaf dominated): O(N^{log_b_a:.2f})"
    else:
        return f"Case 3 (Root dominated): O(N^{d:.2f})"

print("Merge Sort [T(N) = 2T(N/2) + O(N)]:", master_theorem(2, 2, 1))
print("Binary Search [T(N) = T(N/2) + O(1)]:", master_theorem(1, 2, 0))`
          },
          pitfall: 'Applying the Master Theorem when b is not a constant division (e.g. $T(N) = T(N-1) + O(1)$ is linear decrement, NOT divide-and-conquer).',
          quickCheck: {
            question: 'What is the time complexity of a recurrence T(N) = 2T(N/2) + O(N) by the Master Theorem?',
            options: ['O(N)', 'O(N log N)', 'O(N^2)', 'O(log N)'],
            correctIndex: 1,
            explanation: 'Here a=2, b=2, d=1. Since log_2(2) = 1 == d, this falls into Case 2, giving O(N^1 * log N) = O(N log N).'
          }
        },
        {
          id: 'dsa-w1-d1-t8',
          topicNumber: 8,
          title: 'Algorithmic Problem-Solving Framework',
          explanation: [
            'Mastering DSA requires a repeatable step-by-step mental discipline:',
            '1. Clarify constraints: What is $N$? Are numbers negative? Duplicates allowed?',
            '2. Test edge cases: $N=0$, $N=1$, all identical elements, sorted, reverse sorted.',
            '3. Formulate brute force: Always start with the simplest working solution and state its complexity.',
            '4. Identify bottlenecks & patterns: Look for repeated lookups (Hash Map), sorted order (Binary Search / Two Pointers), or overlapping subproblems (DP).',
            '5. Write clean code and dry-run with a small example before running.'
          ],
          keyRules: [
            'Never write code before clarifying input constraints and asymptotic targets.',
            'State time and space complexity explicitly before writing the first line of code.'
          ],
          codeSnippet: {
            id: 'dsa-snip-1-8',
            title: 'Interview Strategy Blueprint',
            description: 'Structured execution template for algorithmic problems',
            language: 'python',
            code: `# Template for solving interview problems
def solve_problem(nums: list[int]) -> int:
    # Step 1: Handle Edge Cases
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]
        
    # Step 2: Optimal Execution (e.g. Two Pointers O(N) time, O(1) space)
    max_val = nums[0]
    for x in nums:
        if x > max_val:
            max_val = x
            
    return max_val

print("Sample run:", solve_problem([3, 7, 2, 9, 5]))`
          },
          pitfall: 'Jumping straight into coding without planning: you waste 20 minutes debugging a fundamentally flawed O(N^2) idea that cannot pass test constraints.',
          quickCheck: {
            question: 'What is the first step you should take when presented with an algorithm problem in an interview?',
            options: ['Start typing code immediately', 'Clarify constraints, assumptions, and edge cases', 'Tell the interviewer the problem is unsolvable', 'Ask for the optimal answer'],
            correctIndex: 1,
            explanation: 'Clarifying constraints (e.g., input size, range of values, memory limitations) reveals the required asymptotic complexity and prevents false starts.'
          }
        }
      ]
    },
    {
      id: 'dsa-w1-d2',
      dayNumber: 2,
      weekNumber: 1,
      title: 'Dynamic Arrays & Vector Mechanics',
      subtitle: 'Contiguous memory, resizing geometry, index math, in-place rotations & partition logic',
      durationMinutes: 70,
      overview:
        'Dissect the most fundamental data structure in computer science: the Dynamic Array. Understand how contiguous RAM enables O(1) random access, amortized doubling, in-place reversal rotations, and Dutch National Flag three-way partitioning.',
      topics: [
        {
          id: 'dsa-w1-d2-t1',
          topicNumber: 1,
          title: 'Contiguous Memory and O(1) Random Access',
          explanation: [
            'An array is a continuous chunk of RAM where elements are laid out back-to-back.',
            'Because memory is contiguous and elements are of fixed size $S$, calculating the memory address of index $i$ is a single CPU arithmetic instruction:',
            '$\\text{Address}(i) = \\text{BaseAddress} + (i \\times S)$.',
            'This gives arrays instantaneous $O(1)$ random access, unmatched by linked lists or trees.'
          ],
          keyRules: [
            'Random access by index is always O(1).',
            'Cache prefetchers stream contiguous array memory into CPU L1/L2 caches with near-zero latency.'
          ],
          codeSnippet: {
            id: 'dsa-snip-2-1',
            title: 'Memory Address Calculation Simulation',
            description: 'Demonstrating how O(1) index calculation works in hardware',
            language: 'python',
            code: `BASE_ADDRESS = 0x1000
ELEMENT_SIZE = 4 # 4 bytes for 32-bit int

def get_element_address(index: int) -> str:
    # Single multiplication and addition in CPU register
    address = BASE_ADDRESS + (index * ELEMENT_SIZE)
    return hex(address)

for i in range(5):
    print(f"Array index [{i}] -> Memory Address: {get_element_address(i)}")`
          },
          pitfall: 'Searching for a value in an unsorted array is still O(N); only access by known index is O(1).',
          quickCheck: {
            question: 'Why does an array provide O(1) element access by index?',
            options: ['Because it uses hash functions', 'Because contiguous memory layout allows direct memory address calculation via Base + (index * size)', 'Because the operating system caches all arrays', 'Because of binary search'],
            correctIndex: 1,
            explanation: 'The memory controller can compute the exact physical RAM byte address of any index in a single arithmetic instruction.'
          }
        },
        {
          id: 'dsa-w1-d2-t2',
          topicNumber: 2,
          title: 'Insertions and Deletions: Why Shifting Costs O(N)',
          explanation: [
            'Inserting or deleting at the end of a dynamic array takes $O(1)$ amortized time.',
            'However, inserting or deleting at index $i$ requires shifting all subsequent $(N - i)$ elements one position to the right or left to maintain contiguity.',
            'Inserting at the front (index 0) is the worst case: all $N$ elements must shift, costing $O(N)$ time.'
          ],
          keyRules: [
            'Insert at end: O(1) amortized.',
            'Insert at index 0: O(N).',
            'Delete at index 0: O(N).'
          ],
          codeSnippet: {
            id: 'dsa-snip-2-2',
            title: 'Visualizing Element Shifting on Insertion',
            description: 'Step-by-step element shifts during array insertion',
            language: 'python',
            code: `def insert_at(arr: list, index: int, val) -> list:
    arr.append(None) # expand capacity
    # Shift elements right from end down to index
    for i in range(len(arr) - 1, index, -1):
        arr[i] = arr[i - 1]
    arr[index] = val
    return arr

nums = [10, 20, 30, 40]
print("Before:", nums)
insert_at(nums, 1, 99)
print("After inserting 99 at index 1:", nums)`
          },
          pitfall: 'Using `list.insert(0, val)` or `list.pop(0)` in a loop creates an accidental $O(N^2)$ algorithm; use a `collections.deque` for $O(1)$ front operations.',
          quickCheck: {
            question: 'What is the time complexity of inserting an element at index 0 in an array of size N?',
            options: ['O(1)', 'O(log N)', 'O(N)', 'O(N^2)'],
            correctIndex: 2,
            explanation: 'All N existing elements must be shifted right by one index to create empty space at index 0, requiring O(N) operations.'
          }
        },
        {
          id: 'dsa-w1-d2-t3',
          topicNumber: 3,
          title: 'In-Place Reversal Algorithm (Array Rotation in O(1) Space)',
          explanation: [
            'Rotating an array right by $K$ steps can be done naively with $O(N)$ extra memory.',
            'The three-reversal algorithm achieves $O(N)$ time and $O(1)$ auxiliary space:',
            '1. Normalize $K = K \\pmod N$.',
            '2. Reverse the entire array.',
            '3. Reverse the first $K$ elements.',
            '4. Reverse the remaining $N - K$ elements.'
          ],
          keyRules: [
            'Always mod K by array length ($K = K \\% N$) to handle $K > N$.',
            'The three-reversal trick requires zero extra array allocations.'
          ],
          codeSnippet: {
            id: 'dsa-snip-2-3',
            title: 'Three-Reversal Array Rotation',
            description: 'Rotate array right by K positions in O(1) space',
            language: 'python',
            code: `def reverse_range(arr: list[int], start: int, end: int) -> None:
    while start < end:
        arr[start], arr[end] = arr[end], arr[start]
        start += 1
        end -= 1

def rotate_array(nums: list[int], k: int) -> None:
    n = len(nums)
    if n <= 1: return
    k = k % n
    
    # 1. Reverse entire array
    reverse_range(nums, 0, n - 1)
    # 2. Reverse first k elements
    reverse_range(nums, 0, k - 1)
    # 3. Reverse remaining n - k elements
    reverse_range(nums, k, n - 1)

arr = [1, 2, 3, 4, 5, 6, 7]
rotate_array(arr, 3)
print("Rotated by 3 steps:", arr) # [5, 6, 7, 1, 2, 3, 4]`
          },
          pitfall: 'Forgetting `k = k % n`: if k is 1,000,000 and n is 5, index out-of-range errors will crash your program.',
          quickCheck: {
            question: 'What is the auxiliary space complexity of the three-reversal array rotation algorithm?',
            options: ['O(K)', 'O(N)', 'O(1)', 'O(N log N)'],
            correctIndex: 2,
            explanation: 'The reversals are performed in-place using two scalar pointers, consuming O(1) auxiliary space.'
          }
        },
        {
          id: 'dsa-w1-d2-t4',
          topicNumber: 4,
          title: 'Dutch National Flag: Three-Way Partitioning (Sort Colors)',
          explanation: [
            'Given an array with three distinct keys (e.g. 0s, 1s, and 2s), sort it in a single pass in $O(N)$ time and $O(1)$ space.',
            'Maintain three pointers: `low`, `mid`, and `high` dividing the array into four regions:',
            '- `[0 .. low-1]`: 0s.',
            '- `[low .. mid-1]`: 1s.',
            '- `[mid .. high]`: unexamined elements.',
            '- `[high+1 .. n-1]`: 2s.',
            'Advance `mid` and swap into `low` or `high` dynamically.'
          ],
          keyRules: [
            'If nums[mid] == 0: swap(nums[low], nums[mid]), low++, mid++.',
            'If nums[mid] == 1: mid++.',
            'If nums[mid] == 2: swap(nums[mid], nums[high]), high-- (do NOT advance mid, as the swapped element needs checking!).'
          ],
          codeSnippet: {
            id: 'dsa-snip-2-4',
            title: 'Dutch National Flag Sort (0, 1, 2)',
            description: 'Single-pass 3-way partition in O(N) time and O(1) space',
            language: 'python',
            code: `def sort_colors(nums: list[int]) -> None:
    low, mid, high = 0, 0, len(nums) - 1
    
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else: # nums[mid] == 2
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1 # mid is NOT incremented!

colors = [2, 0, 2, 1, 1, 0]
sort_colors(colors)
print("Sorted colors:", colors) # [0, 0, 1, 1, 2, 2]`
          },
          pitfall: 'Incrementing `mid` when swapping with `high`: the element swapped from `high` into `mid` is unknown and must be evaluated on the next iteration.',
          quickCheck: {
            question: 'Why do we NOT increment the `mid` pointer after swapping nums[mid] with nums[high]?',
            options: ['Because mid must never move', 'Because the element swapped from high into mid has not been inspected yet', 'Because high is larger than mid', 'Because it would cause an infinite loop'],
            correctIndex: 1,
            explanation: 'The element at high came from the uninspected region; after swapping it into position mid, we must inspect it before moving forward.'
          }
        },
        {
          id: 'dsa-w1-d2-t5',
          topicNumber: 5,
          title: 'Remove Duplicates from Sorted Array in O(1) Space',
          explanation: [
            'In-place deduplication: given a sorted array, overwrite duplicate values so that unique elements occupy the first $K$ positions.',
            'Use a Slow-Fast pointer pattern:',
            '- `slow` marks the boundary of accepted unique elements.',
            '- `fast` scans ahead. When `nums[fast] != nums[slow]`, advance `slow` and write `nums[slow] = nums[fast]`.'
          ],
          keyRules: [
            'Requires sorted array so identical elements are contiguous.',
            'Runs in O(N) time with O(1) auxiliary space.'
          ],
          codeSnippet: {
            id: 'dsa-snip-2-5',
            title: 'In-Place Duplicate Elimination',
            description: 'Slow-fast pointer deduplication pattern',
            language: 'python',
            code: `def remove_duplicates(nums: list[int]) -> int:
    if not nums: return 0
    slow = 0
    for fast in range(1, len(nums)):
        if nums[fast] != nums[slow]:
            slow += 1
            nums[slow] = nums[fast]
    return slow + 1 # count of unique elements

arr = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]
k = remove_duplicates(arr)
print(f"Unique count: {k}, Prefix unique array: {arr[:k]}")`
          },
          pitfall: 'Modifying array length with `.pop()` inside the loop: changing array length while iterating leads to skipping elements and O(N^2) time complexity.',
          quickCheck: {
            question: 'What is the time complexity of removing duplicates in-place from a sorted array of length N?',
            options: ['O(1)', 'O(N)', 'O(N log N)', 'O(N^2)'],
            correctIndex: 1,
            explanation: 'The fast pointer inspects each element once, doing a single pass over the array in O(N) time.'
          }
        },
        {
          id: 'dsa-w1-d2-t6',
          topicNumber: 6,
          title: 'Maximum Subarray: Kadane\'s Algorithm (O(N) Time, O(1) Space)',
          explanation: [
            'Problem: Find the contiguous subarray with the largest sum.',
            'Brute force checks all pairs $(i, j)$ in $O(N^2)$ time.',
            'Kadane\'s Algorithm computes this in $O(N)$ time by maintaining the local maximum ending at the current position:',
            '$\\text{current\\_sum} = \\max(\\text{num}, \\text{current\\_sum} + \\text{num})$.',
            'If the running sum becomes negative, it hurts any future subarray, so we discard it and start fresh from the current element.'
          ],
          keyRules: [
            'Initialize max_sum to nums[0] (NOT 0) to correctly handle arrays of all negative numbers.',
            'Kadane\'s is a fundamental Dynamic Programming pattern compressed into O(1) space.'
          ],
          codeSnippet: {
            id: 'dsa-snip-2-6',
            title: 'Kadanes Maximum Subarray',
            description: 'Optimal linear scan for maximum contiguous sum',
            language: 'python',
            code: `def max_sub_array(nums: list[int]) -> int:
    current_sum = nums[0]
    max_sum = nums[0]
    
    for x in nums[1:]:
        # Either extend the existing subarray, or start fresh at x
        current_sum = max(x, current_sum + x)
        max_sum = max(max_sum, current_sum)
        
    return max_sum

print("Max Subarray Sum:", max_sub_array([-2, 1, -3, 4, -1, 2, 1, -5, 4])) # 6 ([4, -1, 2, 1])`
          },
          pitfall: 'Initializing max_sum = 0: if nums = [-5, -2, -8], the algorithm would erroneously return 0 instead of -2.',
          quickCheck: {
            question: 'What does Kadanes algorithm do when current_sum drops below 0?',
            options: ['Terminates execution', 'Discards current_sum and resets it to the current element', 'Inverts all negative signs', 'Sorts the array'],
            correctIndex: 1,
            explanation: 'A negative prefix sum only diminishes any future subarray, so max(x, current_sum + x) resets current_sum to x.'
          }
        },
        {
          id: 'dsa-w1-d2-t7',
          topicNumber: 7,
          title: 'Prefix Sum Arrays: O(1) Range Sum Queries',
          explanation: [
            'A Prefix Sum array precomputes cumulative sums where `prefix[i] = nums[0] + ... + nums[i-1]`.',
            'Any range sum query from index $L$ to $R$ can be answered in instantaneous $O(1)$ time:',
            '$\\text{sum}(L, R) = \\text{prefix}[R + 1] - \\text{prefix}[L]$.',
            'This transforms $Q$ range sum queries from $O(Q \\times N)$ to $O(N + Q)$ time.'
          ],
          keyRules: [
            'Use a 1-indexed prefix sum array of size N+1 with prefix[0] = 0 to avoid out-of-bounds checks for L=0.',
            'Precomputation costs O(N) time and O(N) auxiliary space.'
          ],
          codeSnippet: {
            id: 'dsa-snip-2-7',
            title: 'Prefix Sum Table Construction',
            description: 'O(1) range sum queries after O(N) preprocessing',
            language: 'python',
            code: `class NumArray:
    def __init__(self, nums: list[int]):
        self.prefix = [0] * (len(nums) + 1)
        for i, val in enumerate(nums):
            self.prefix[i + 1] = self.prefix[i] + val
            
    def sum_range(self, left: int, right: int) -> int:
        # Sum from left to right in O(1) time
        return self.prefix[right + 1] - self.prefix[left]

arr = NumArray([1, 2, 3, 4, 5, 6])
print("Sum of indices 1..3 (2+3+4):", arr.sum_range(1, 3)) # 9`
          },
          pitfall: 'Prefix sum arrays are static; if elements in nums are updated frequently, prefix sums must be rebuilt in O(N). For dynamic updates, use a Fenwick Tree (Binary Indexed Tree) or Segment Tree.',
          quickCheck: {
            question: 'What is the time complexity to answer a range sum query from index L to R using a precomputed prefix sum array?',
            options: ['O(R - L)', 'O(1)', 'O(N)', 'O(log N)'],
            correctIndex: 1,
            explanation: 'The query requires a single subtraction: prefix[R + 1] - prefix[L], executing in O(1) constant time.'
          }
        },
        {
          id: 'dsa-w1-d2-t8',
          topicNumber: 8,
          title: 'Product of Array Except Self (Without Division)',
          explanation: [
            'Problem: Return an array `output` such that `output[i]` is equal to the product of all elements of `nums` except `nums[i]`, in $O(N)$ time WITHOUT using the division operator.',
            'Prefix & Suffix Product decomposition:',
            'For any element $i$, `output[i] = (product of elements to the left) * (product of elements to the right)`.',
            'Compute prefix products in a left-to-right pass, then accumulate suffix products in a right-to-left pass directly into `output` in $O(1)$ auxiliary space.'
          ],
          keyRules: [
            'First pass: output[i] stores product of all elements left of i.',
            'Second pass: maintain a running right_product scalar and multiply into output[i].'
          ],
          codeSnippet: {
            id: 'dsa-snip-2-8',
            title: 'Product of Array Except Self',
            description: 'Two-pass prefix and suffix product without division',
            language: 'python',
            code: `def product_except_self(nums: list[int]) -> list[int]:
    n = len(nums)
    res = [1] * n
    
    # Left pass: res[i] contains prefix product of nums[0..i-1]
    left = 1
    for i in range(n):
        res[i] = left
        left *= nums[i]
        
    # Right pass: multiply suffix products on the fly
    right = 1
    for i in range(n - 1, -1, -1):
        res[i] *= right
        right *= nums[i]
        
    return res

print("Product except self:", product_except_self([1, 2, 3, 4])) # [24, 12, 8, 6]`
          },
          pitfall: 'Using division `total_product // nums[i]` fails completely if the array contains zeros (DivisionByZero exception).',
          quickCheck: {
            question: 'What is the auxiliary space complexity of the optimal Product of Array Except Self algorithm (excluding output array)?',
            options: ['O(N)', 'O(1)', 'O(N log N)', 'O(N^2)'],
            correctIndex: 1,
            explanation: 'The result array itself is the required return value; the running left and right products are stored in scalar variables, taking O(1) auxiliary space.'
          }
        }
      ]
    },
    {
      id: 'dsa-w1-d3',
      dayNumber: 3,
      weekNumber: 1,
      title: 'Two Pointers Pattern & String Algorithms',
      subtitle: 'Opposite-direction pointers, equational matching, Container With Most Water, 3Sum & Trapping Rain Water',
      durationMinutes: 75,
      overview:
        'Harness the power of pointer convergence. Convert quadratic $O(N^2)$ brute forces into $O(N)$ linear scans using Opposite-Direction Two Pointers, Two Sum II on sorted arrays, 3Sum duplicate pruning, Container With Most Water, and Trapping Rain Water.',
      topics: [
        {
          id: 'dsa-w1-d3-t1',
          topicNumber: 1,
          title: 'The Two-Pointer Philosophy: Eliminating Search Space',
          explanation: [
            'The two-pointer technique works on sorted or structured arrays by maintaining two indices (`left = 0`, `right = N - 1`).',
            'At each step, we evaluate the condition (e.g. `sum = nums[left] + nums[right]`).',
            'Based on the result, we can definitively DISCARD either `left` or `right`, pruning an entire row or column of the search space in $O(1)$ time.',
            'This collapses $O(N^2)$ nested loops into a single linear $O(N)$ convergence.'
          ],
          keyRules: [
            'Requires monotonic structure (often sorted order).',
            'At every step, exactly one pointer must advance closer to the other.'
          ],
          codeSnippet: {
            id: 'dsa-snip-3-1',
            title: 'Two Sum II (Input Array Is Sorted)',
            description: 'Converging pointers to find pair with target sum in O(N)',
            language: 'python',
            code: `def two_sum_sorted(numbers: list[int], target: int) -> list[int]:
    left, right = 0, len(numbers) - 1
    while left < right:
        curr_sum = numbers[left] + numbers[right]
        if curr_sum == target:
            return [left + 1, right + 1] # 1-based indices
        elif curr_sum < target:
            left += 1  # need larger sum
        else:
            right -= 1 # need smaller sum
    return []

print("Indices for target 9:", two_sum_sorted([2, 7, 11, 15], 9))`
          },
          pitfall: 'Applying sorted two-pointer logic on an unsorted array without sorting first: you will discard valid candidates unpredictably.',
          quickCheck: {
            question: 'Why does two_sum_sorted advance `left += 1` when curr_sum < target?',
            options: ['Because numbers[right] is too big', 'Because the array is sorted, so increasing left is the only way to increase the pair sum', 'To reverse the array', 'Because left pointer is always incremented'],
            correctIndex: 1,
            explanation: 'Since the array is in non-decreasing order, moving left to the right increases the value, raising curr_sum towards the target.'
          }
        },
        {
          id: 'dsa-w1-d3-t2',
          topicNumber: 2,
          title: 'Valid Palindrome with Alphanumeric Filtering',
          explanation: [
            'Problem: Determine if a string is a palindrome, considering only alphanumeric characters and ignoring cases.',
            'Initialize `left = 0` and `right = len(s) - 1`.',
            'Skip non-alphanumeric characters using `.isalnum()`.',
            'Compare lowercase characters. If mismatched, return `False`. If pointers cross, return `True` in $O(N)$ time and $O(1)$ auxiliary space.'
          ],
          keyRules: [
            'Avoid creating a cleaned copy of the string (e.g. `[c for c in s if c.isalnum()]`) to save O(N) memory.',
            'Increment left and decrement right while checking bounds.'
          ],
          codeSnippet: {
            id: 'dsa-snip-3-2',
            title: 'In-Place Valid Palindrome',
            description: 'Two pointers skipping non-alphanumeric characters',
            language: 'python',
            code: `def is_palindrome(s: str) -> bool:
    left, right = 0, len(s) - 1
    while left < right:
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
            
        if s[left].lower() != s[right].lower():
            return False
        left += 1
        right -= 1
    return True

print("Is Palindrome:", is_palindrome("A man, a plan, a canal: Panama")) # True`
          },
          pitfall: 'Forgetting the `left < right` check inside the inner skip loops, which causes index out-of-range errors on strings with no alphanumeric characters like `"???"`.',
          quickCheck: {
            question: 'What is the auxiliary space complexity of two-pointer palindrome validation when avoiding string copies?',
            options: ['O(N)', 'O(1)', 'O(log N)', 'O(N^2)'],
            correctIndex: 1,
            explanation: 'Comparing characters directly in place using two scalar integer indices uses O(1) auxiliary memory.'
          }
        },
        {
          id: 'dsa-w1-d3-t3',
          topicNumber: 3,
          title: 'Container With Most Water: Greedy Area Convergence',
          explanation: [
            'Given $N$ vertical lines, find two lines that together with the x-axis form a container holding the most water.',
            '$\\text{Area} = (\\text{right} - \\text{left}) \\times \\min(\\text{height}[\\text{left}], \\text{height}[\\text{right}])$.',
            'We start at maximum width (`left = 0, right = N - 1`).',
            'To find a larger area with smaller width, we MUST find a taller line. Therefore, we greedily discard the SHORTER of the two lines!'
          ],
          keyRules: [
            'Always move the pointer pointing to the shorter vertical bar.',
            'Moving the taller bar cannot possibly increase the area because width decreases and height is bounded by the shorter bar.'
          ],
          codeSnippet: {
            id: 'dsa-snip-3-3',
            title: 'Container With Most Water',
            description: 'Greedy two-pointer area maximization in O(N)',
            language: 'python',
            code: `def max_area(height: list[int]) -> int:
    left, right = 0, len(height) - 1
    max_water = 0
    
    while left < right:
        width = right - left
        h = min(height[left], height[right])
        max_water = max(max_water, width * h)
        
        # Advance the bottleneck (shorter line)
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
            
    return max_water

print("Max Water:", max_area([1, 8, 6, 2, 5, 4, 8, 3, 7])) # 49`
          },
          pitfall: 'Moving both pointers simultaneously: this could skip the true optimal configuration.',
          quickCheck: {
            question: 'Why do we advance the pointer pointing to the shorter line in Container With Most Water?',
            options: ['To make the width wider', 'Because the shorter line is the limiting factor on water height, so keeping it while reducing width can never yield a larger area', 'Because right pointer cannot move left', 'To sort the heights'],
            correctIndex: 1,
            explanation: 'The height of water is constrained by the minimum of both bars; moving the taller bar reduces width without any chance of increasing height.'
          }
        },
        {
          id: 'dsa-w1-d3-t4',
          topicNumber: 4,
          title: '3Sum: Sorting and Triplet Deduplication',
          explanation: [
            'Problem: Find all unique triplets `[nums[i], nums[j], nums[k]]` such that $i \\ne j \\ne k$ and the sum is 0.',
            'Brute force tests all triples in $O(N^3)$.',
            'Optimal approach:',
            '1. Sort the array in $O(N \\log N)$.',
            '2. Iterate with pointer $i$ from $0$ to $N-1$.',
            '3. Use Two Pointers (`left = i + 1`, `right = N - 1`) to find pairs matching target $-nums[i]$ in $O(N)$.',
            '4. Total Time: $O(N^2)$. Skip duplicate elements for $i$, $left$, and $right$ to ensure output uniqueness.'
          ],
          keyRules: [
            'Sort array first: nums.sort().',
            'Skip duplicates for both the outer loop i and inner two-pointers to avoid duplicate triplets.'
          ],
          codeSnippet: {
            id: 'dsa-snip-3-4',
            title: '3Sum Optimal Algorithm',
            description: 'O(N^2) two-pointer search with duplicate pruning',
            language: 'python',
            code: `def three_sum(nums: list[int]) -> list[list[int]]:
    nums.sort()
    triplets = []
    n = len(nums)
    
    for i in range(n - 2):
        # Optimization: smallest element > 0 means sum cannot be 0
        if nums[i] > 0: break
        # Skip duplicate i
        if i > 0 and nums[i] == nums[i - 1]: continue
        
        left, right = i + 1, n - 1
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            if total == 0:
                triplets.append([nums[i], nums[left], nums[right]])
                left += 1
                right -= 1
                while left < right and nums[left] == nums[left - 1]: left += 1
                while left < right and nums[right] == nums[right + 1]: right -= 1
            elif total < 0:
                left += 1
            else:
                right -= 1
    return triplets

print("Triplets:", three_sum([-1, 0, 1, 2, -1, -4])) # [[-1, -1, 2], [-1, 0, 1]]`
          },
          pitfall: 'Using a Python `set` of tuples to deduplicate triplets instead of skipping adjacent duplicates: hashing tuples adds significant overhead and can result in Memory Limit Exceeded.',
          quickCheck: {
            question: 'What is the overall time complexity of the optimal 3Sum algorithm?',
            options: ['O(N)', 'O(N log N)', 'O(N^2)', 'O(N^3)'],
            correctIndex: 2,
            explanation: 'Sorting costs O(N log N). The outer loop runs N times, and the inner two-pointer search takes O(N), yielding O(N^2) overall runtime.'
          }
        },
        {
          id: 'dsa-w1-d3-t5',
          topicNumber: 5,
          title: 'Trapping Rain Water: Two-Pointer O(N) Time, O(1) Space',
          explanation: [
            'Given $N$ non-negative integers representing an elevation map where each bar has width 1, compute how much water it can trap after raining.',
            'Water trapped above bar $i$ is determined by: $\\min(\\text{max\\_left}, \\text{max\\_right}) - \\text{height}[i]$.',
            'Instead of using $O(N)$ extra memory to store prefix and suffix max arrays, maintain `left`, `right`, `left_max`, and `right_max`.',
            'If `left_max < right_max`, water trapped at `left` is bounded by `left_max`, so we can accumulate water and advance `left`.'
          ],
          keyRules: [
            'Water above any position is strictly bounded by the smaller of the two enclosing maximum boundaries.',
            'O(1) space two-pointer approach eliminates the need for dynamic programming arrays.'
          ],
          codeSnippet: {
            id: 'dsa-snip-3-5',
            title: 'Trapping Rain Water (Two Pointers)',
            description: 'Optimal linear scan calculating trapped water in O(1) space',
            language: 'python',
            code: `def trap_rain_water(height: list[int]) -> int:
    if not height: return 0
    left, right = 0, len(height) - 1
    left_max, right_max = height[left], height[right]
    water = 0
    
    while left < right:
        if left_max < right_max:
            left += 1
            left_max = max(left_max, height[left])
            water += left_max - height[left]
        else:
            right -= 1
            right_max = max(right_max, height[right])
            water += right_max - height[right]
            
    return water

print("Total Trapped Water:", trap_rain_water([0,1,0,2,1,0,1,3,2,1,2,1])) # 6`
          },
          pitfall: 'Adding negative water: if current height is greater than left_max, water added is 0 (handled naturally by updating max first).',
          quickCheck: {
            question: 'What allows Trapping Rain Water to run in O(1) space with two pointers?',
            options: ['Water can only exist at index 0', 'The smaller of left_max and right_max guarantees the water level for the lower side regardless of unseen higher bars in the middle', 'It uses binary search', 'All heights are 1'],
            correctIndex: 1,
            explanation: 'If left_max < right_max, the bottleneck on water at index left is definitively left_max, so unseen bars to the right cannot lower that water level.'
          }
        },
        {
          id: 'dsa-w1-d3-t6',
          topicNumber: 6,
          title: 'String Compression with Two Pointers',
          explanation: [
            'Problem: Given an array of characters, compress it in-place. Consecutive identical characters are replaced with the character followed by the group count (if count > 1).',
            'Use a `write` pointer and an exploration pointer `read`:',
            '1. Count length of consecutive duplicates.',
            '2. Write the character to `chars[write]`.',
            '3. If count > 1, write each digit of the count to `chars[write]`.',
            '4. Return `write` as the new length.'
          ],
          keyRules: [
            'If group count is 1, write ONLY the character without any digit.',
            'Convert count to string to write multi-digit numbers (e.g. 12 -> "1", "2").'
          ],
          codeSnippet: {
            id: 'dsa-snip-3-6',
            title: 'In-Place String Compression',
            description: 'Modifying character array in place in O(N) time and O(1) space',
            language: 'python',
            code: `def compress(chars: list[str]) -> int:
    write = 0
    read = 0
    n = len(chars)
    
    while read < n:
        char = chars[read]
        count = 0
        while read < n and chars[read] == char:
            read += 1
            count += 1
            
        chars[write] = char
        write += 1
        
        if count > 1:
            for digit in str(count):
                chars[write] = digit
                write += 1
                
    return write

chars = ["a","a","b","b","c","c","c"]
k = compress(chars)
print("Compressed:", chars[:k]) # ['a', '2', 'b', '2', 'c', '3']`
          },
          pitfall: 'Overwriting characters before reading them: because compressed representations are always $\\le$ uncompressed length, `write <= read` is guaranteed.',
          quickCheck: {
            question: 'How are multi-digit group counts (e.g., 12 repetitions of "a") written into the compressed array?',
            options: ['As the single character "12"', 'Each digit "1" and "2" is written into its own array index', 'Truncated to 9', 'Ignored'],
            correctIndex: 1,
            explanation: 'The problem requires converting the count to digits and writing each individual digit character sequentially into the array.'
          }
        },
        {
          id: 'dsa-w1-d3-t7',
          topicNumber: 7,
          title: 'Reverse Words in a String: Word Boundary Mechanics',
          explanation: [
            'Given an input string `s`, reverse the order of the words while trimming multiple consecutive spaces into a single space.',
            'Steps for in-place string manipulation (or $O(N)$ string builder):',
            '1. Reverse individual words or scan from right to left.',
            '2. Skip leading, trailing, and redundant spaces.',
            '3. Join isolated words with a single space separator.'
          ],
          keyRules: [
            'Handle multiple spaces cleanly between words.',
            'In languages with mutable strings (C++), reverse the entire string then reverse each word in-place for O(1) auxiliary space.'
          ],
          codeSnippet: {
            id: 'dsa-snip-3-7',
            title: 'Reverse Words in a String',
            description: 'Two-pointer right-to-left word extraction',
            language: 'python',
            code: `def reverse_words(s: str) -> str:
    words = []
    i = len(s) - 1
    
    while i >= 0:
        # Skip trailing/interstitial spaces
        while i >= 0 and s[i] == ' ':
            i -= 1
        if i < 0: break
        
        # Find word boundary
        j = i
        while i >= 0 and s[i] != ' ':
            i -= 1
        words.append(s[i + 1:j + 1])
        
    return " ".join(words)

print("Reversed words:", reverse_words("  the sky  is   blue  ")) # "blue is sky the"`
          },
          pitfall: 'Relying on naive `s.split(" ")` which leaves empty strings `""` in the list for multiple spaces; in Python, use `s.split()` without arguments to handle arbitrary whitespace.',
          quickCheck: {
            question: 'What is the result of reversing words in " hello   world "?',
            options: ['"world   hello"', '"world hello"', '"dlrow olleh"', '" hello world "'],
            correctIndex: 1,
            explanation: 'The output must have single spaces between words and no leading or trailing whitespace: "world hello".'
          }
        },
        {
          id: 'dsa-w1-d3-t8',
          topicNumber: 8,
          title: 'Longest Palindromic Substring: Expand Around Center',
          explanation: [
            'Every palindrome is symmetric around its center.',
            'A string of length $N$ has $2N - 1$ possible centers (odd-length palindromes have 1-character centers; even-length palindromes have 2-character centers between adjacent characters).',
            'For each of the $2N - 1$ centers, expand two pointers outwards while characters match.',
            'Runs in $O(N^2)$ time with $O(1)$ auxiliary space, outperforming DP tables which require $O(N^2)$ memory.'
          ],
          keyRules: [
            'Odd centers: expand(i, i).',
            'Even centers: expand(i, i + 1).',
            'Auxiliary space is O(1) compared to O(N^2) for DP.'
          ],
          codeSnippet: {
            id: 'dsa-snip-3-8',
            title: 'Expand Around Center Palindrome Search',
            description: 'O(N^2) time, O(1) space longest palindrome search',
            language: 'python',
            code: `def longest_palindrome(s: str) -> str:
    if not s: return ""
    start, max_len = 0, 0
    
    def expand(left: int, right: int) -> int:
        while left >= 0 and right < len(s) and s[left] == s[right]:
            left -= 1
            right += 1
        return right - left - 1 # length of valid palindrome
        
    for i in range(len(s)):
        len1 = expand(i, i)       # odd center
        len2 = expand(i, i + 1)   # even center
        current_max = max(len1, len2)
        
        if current_max > max_len:
            max_len = current_max
            start = i - (current_max - 1) // 2
            
    return s[start:start + max_len]

print("Longest Palindrome:", longest_palindrome("babad")) # "bab" or "aba"`
          },
          pitfall: 'Forgetting the even-center expansion: missing even centers means palindromes like "cbbd" or "noon" will never be found.',
          quickCheck: {
            question: 'How many potential palindrome centers exist in a string of length N?',
            options: ['N', '2N', '2N - 1', 'N^2'],
            correctIndex: 2,
            explanation: 'There are N single-character centers (odd palindromes) and N - 1 between-character centers (even palindromes), totaling 2N - 1 centers.'
          }
        }
      ]
    },
    {
      id: 'dsa-w1-d4',
      dayNumber: 4,
      weekNumber: 1,
      title: 'Sliding Window Patterns',
      subtitle: 'Fixed-size windows, dynamic shrinking windows, frequency hash tables & substring problems',
      durationMinutes: 75,
      overview:
        'Master the Sliding Window pattern to transform brute-force $O(N^2)$ substring/subarray checks into linear $O(N)$ solutions. Learn the exact difference between fixed-size and dynamic-size windows, frequency count maintenance, and canonical problems: Longest Substring Without Repeating Characters and Minimum Window Substring.',
      topics: [
        {
          id: 'dsa-w1-d4-t1',
          topicNumber: 1,
          title: 'Fixed vs Dynamic Sliding Windows',
          explanation: [
            'Sliding Window maintains a contiguous subsegment `[left .. right]` of an array or string.',
            '- **Fixed Window**: The window size $K$ is invariant (e.g. maximum sum of $K$ consecutive elements). As `right` advances, `left` advances at the exact same pace (`left = right - K + 1`).',
            '- **Dynamic Window**: The window size expands with `right` until an invariant is violated (e.g. sum $> S$ or duplicate character found). Then `left` shrinks the window until the invariant is restored.'
          ],
          keyRules: [
            'Each element enters the window at `right` at most once and leaves at `left` at most once.',
            'Because both pointers move monotonically forward, the total runtime is $O(N + N) = O(N)$.'
          ],
          codeSnippet: {
            id: 'dsa-snip-4-1',
            title: 'Fixed Window Maximum Sum of Size K',
            description: 'O(N) window slide adding right element and subtracting left element',
            language: 'python',
            code: `def max_sum_subarray_k(nums: list[int], k: int) -> int:
    if len(nums) < k: return 0
    
    # Initialize first window of size k
    window_sum = sum(nums[:k])
    max_sum = window_sum
    
    # Slide window across the rest of the array
    for right in range(k, len(nums)):
        window_sum += nums[right] - nums[right - k] # add new, drop old
        max_sum = max(max_sum, window_sum)
        
    return max_sum

print("Max sum of window size 3:", max_sum_subarray_k([2, 1, 5, 1, 3, 2], 3)) # 9 ([5, 1, 3])`
          },
          pitfall: 'Recomputing the window sum from scratch `sum(nums[i:i+k])` on each iteration: this reverts the algorithm to O(N * K)! Always do `+ nums[right] - nums[left]`.',
          quickCheck: {
            question: 'What makes sliding window O(N) when there is an inner while loop shrinking the window?',
            options: ['The while loop executes only once in the entire program', 'Each element is added to the window at most once and removed at most once across the entire algorithm', 'The compiler optimizes it to O(1)', 'The while loop is parallelized'],
            correctIndex: 1,
            explanation: 'The right pointer moves from 0 to N-1 (N steps) and the left pointer moves from 0 to N-1 (N steps), bounding total operations to 2N = O(N).'
          }
        },
        {
          id: 'dsa-w1-d4-t2',
          topicNumber: 2,
          title: 'Longest Substring Without Repeating Characters',
          explanation: [
            'Problem: Given a string `s`, find the length of the longest substring without duplicate characters.',
            'Maintain a dynamic window `[left .. right]` and a hash map `char_index` storing the most recent index where each character appeared.',
            'When `s[right]` was previously seen at `prev_idx >= left`, jump `left = prev_idx + 1` instantly.',
            'Update `char_index[s[right]] = right` and track `max_len = max(max_len, right - left + 1)`.'
          ],
          keyRules: [
            'Only update left if `char_index[char] >= left` (ignore duplicates that occurred outside the active window).',
            'Runs in O(N) time with O(min(N, charset)) auxiliary space.'
          ],
          codeSnippet: {
            id: 'dsa-snip-4-2',
            title: 'Longest Substring Without Repeating Characters',
            description: 'Hash-map assisted sliding window in O(N) time',
            language: 'python',
            code: `def length_of_longest_substring(s: str) -> int:
    char_index = {}
    left = 0
    max_len = 0
    
    for right, char in enumerate(s):
        if char in char_index and char_index[char] >= left:
            left = char_index[char] + 1 # jump past duplicate
            
        char_index[char] = right
        max_len = max(max_len, right - left + 1)
        
    return max_len

print("Longest unique substring length:", length_of_longest_substring("abcabcbb")) # 3 ("abc")`
          },
          pitfall: 'Jumping left without checking `char_index[char] >= left`: this can cause `left` to move BACKWARDS, invalidating the window invariant!',
          quickCheck: {
            question: 'Why must we verify `char_index[char] >= left` before jumping the left pointer?',
            options: ['To avoid negative array indices', 'Because the duplicate character might have appeared before the current window start, in which case it is not a duplicate in the active window', 'To sort the hash map', 'Because dictionary keys are integers'],
            correctIndex: 1,
            explanation: 'If the character appeared at index 1 and the current window starts at index 5, that character is outside the current window and must not move left backwards to index 2.'
          }
        },
        {
          id: 'dsa-w1-d4-t3',
          topicNumber: 3,
          title: 'Minimum Size Subarray Sum (Target Sum Constraint)',
          explanation: [
            'Problem: Given an array of positive integers and a target $S$, find the minimal length of a contiguous subarray of which the sum is $\\ge S$.',
            'Because all numbers are positive, expanding `right` monotonically increases the sum, and advancing `left` monotonically decreases the sum.',
            'While `current_sum >= target`, record the minimum window length (`min_len = min(min_len, right - left + 1)`) and shrink `left`.'
          ],
          keyRules: [
            'Monotonicity guarantee holds ONLY when all numbers are positive (> 0).',
            'If array contains negative numbers, sliding window fails and Prefix Sum + Hash Map must be used.'
          ],
          codeSnippet: {
            id: 'dsa-snip-4-3',
            title: 'Minimum Size Subarray Sum',
            description: 'Dynamic shrinking window for sum >= target',
            language: 'python',
            code: `def min_sub_array_len(target: int, nums: list[int]) -> int:
    left = 0
    curr_sum = 0
    min_len = float('inf')
    
    for right in range(len(nums)):
        curr_sum += nums[right]
        # Shrink window as long as sum condition is satisfied
        while curr_sum >= target:
            min_len = min(min_len, right - left + 1)
            curr_sum -= nums[left]
            left += 1
            
    return min_len if min_len != float('inf') else 0

print("Min length for sum >= 7:", min_sub_array_len(7, [2, 3, 1, 2, 4, 3])) # 2 ([4, 3])`
          },
          pitfall: 'Attempting to use this sliding window on arrays with negative numbers: negative numbers break the invariant that expanding right increases the sum.',
          quickCheck: {
            question: 'Why does the sliding window approach for Minimum Size Subarray Sum fail when the array contains negative numbers?',
            options: ['Negative numbers cause syntax errors', 'Expanding the window no longer monotonically increases the sum, breaking the shrinkage invariant', 'Sliding windows cannot compare numbers', 'Python integers cannot be negative'],
            correctIndex: 1,
            explanation: 'With negative numbers, adding an element might decrease the sum and removing an element might increase it, invalidating the greedy shrink logic.'
          }
        },
        {
          id: 'dsa-w1-d4-t4',
          topicNumber: 4,
          title: 'Longest Repeating Character Replacement',
          explanation: [
            'Problem: Given string `s` and integer $k$, you can choose at most $k$ characters and replace them with any other uppercase English letter. Find the length of the longest substring containing identical letters.',
            'Invariant: In any window `[left .. right]`, the number of characters that need replacement is:',
            '$\\text{replacements} = (\\text{window\\_length}) - (\\text{frequency of most frequent character})$.',
            'If `(right - left + 1) - max_freq > k`, the window is invalid, so shrink `left` by 1.'
          ],
          keyRules: [
            'max_freq does NOT need to be decremented when shrinking the window because we only care about beating the all-time maximum window size.',
            'O(N) time with O(26) = O(1) auxiliary space.'
          ],
          codeSnippet: {
            id: 'dsa-snip-4-4',
            title: 'Longest Repeating Character Replacement',
            description: 'Sliding window tracking max frequency in O(N)',
            language: 'python',
            code: `from collections import defaultdict

def character_replacement(s: str, k: int) -> int:
    counts = defaultdict(int)
    left = 0
    max_freq = 0
    max_len = 0
    
    for right, char in enumerate(s):
        counts[char] += 1
        max_freq = max(max_freq, counts[char])
        
        # If replacements needed > k, shrink window
        if (right - left + 1) - max_freq > k:
            counts[s[left]] -= 1
            left += 1
            
        max_len = max(max_len, right - left + 1)
        
    return max_len

print("Longest replacement length:", character_replacement("AABABBA", 1)) # 4 ("AABA")`
          },
          pitfall: 'Scanning all 26 letters to recalculate max_freq on every shrink: it is unnecessary and adds an extra 26 factor.',
          quickCheck: {
            question: 'In Longest Repeating Character Replacement, when is a window considered valid?',
            options: ['When window length is exactly k', 'When (window_length - max_frequency) <= k', 'When all characters are distinct', 'When k == 0'],
            correctIndex: 1,
            explanation: 'The number of characters we must change to make the whole window uniform is window length minus the count of the most frequent character. This must be <= k.'
          }
        },
        {
          id: 'dsa-w1-d4-t5',
          topicNumber: 5,
          title: 'Permutation in String (Anagram Substring Matching)',
          explanation: [
            'Problem: Given two strings `s1` and `s2`, return true if `s2` contains a permutation of `s1`.',
            'A permutation of `s1` has the exact same character frequency counts and length $K = \\text{len}(s1)$.',
            'This is a fixed sliding window of size $K$ over `s2` maintaining character counts.',
            'Instead of comparing full 26-element arrays on every step ($26N$), track the count of matched characters `matches` out of 26. When `matches == 26`, return `True` in strict $O(N)$!'
          ],
          keyRules: [
            'Fixed window of size len(s1).',
            'Track match count across 26 letters for O(1) check per slide.'
          ],
          codeSnippet: {
            id: 'dsa-snip-4-5',
            title: 'Permutation in String via Match Count',
            description: 'Fixed window anagram search in O(len(s2)) time',
            language: 'python',
            code: `def check_inclusion(s1: str, s2: str) -> bool:
    if len(s1) > len(s2): return False
    
    s1_count = [0] * 26
    s2_count = [0] * 26
    for i in range(len(s1)):
        s1_count[ord(s1[i]) - ord('a')] += 1
        s2_count[ord(s2[i]) - ord('a')] += 1
        
    matches = sum(1 for i in range(26) if s1_count[i] == s2_count[i])
    k = len(s1)
    
    for i in range(len(s2) - k):
        if matches == 26: return True
        
        # Add character at right
        r_idx = ord(s2[i + k]) - ord('a')
        s2_count[r_idx] += 1
        if s2_count[r_idx] == s1_count[r_idx]: matches += 1
        elif s2_count[r_idx] == s1_count[r_idx] + 1: matches -= 1
        
        # Remove character at left
        l_idx = ord(s2[i]) - ord('a')
        s2_count[l_idx] -= 1
        if s2_count[l_idx] == s1_count[l_idx]: matches += 1
        elif s2_count[l_idx] == s1_count[l_idx] - 1: matches -= 1
        
    return matches == 26

print("Contains Permutation:", check_inclusion("ab", "eidbaooo")) # True`
          },
          pitfall: 'Sorting s1 and each substring of s2: sorting substrings of length K takes O(N * K log K), which is too slow for large inputs.',
          quickCheck: {
            question: 'What is the window size when checking if s2 contains a permutation of s1?',
            options: ['len(s2)', 'len(s1)', '26', 'len(s2) - len(s1)'],
            correctIndex: 1,
            explanation: 'An anagram of s1 must have the identical length to s1, so the sliding window has a fixed size equal to len(s1).'
          }
        },
        {
          id: 'dsa-w1-d4-t6',
          topicNumber: 6,
          title: 'Minimum Window Substring (The Hard Benchmark)',
          explanation: [
            'Problem: Given strings `s` and `t`, find the minimum window substring of `s` containing all characters of `t` (including duplicate frequencies).',
            'Maintain `t_count` and `window_count`.',
            'Track `have` (unique characters in window meeting required frequency) and `need = len(t_count)`.',
            'Expand `right`: when `window_count[char] == t_count[char]`, increment `have`.',
            'When `have == need`, record minimum window and shrink `left` until condition breaks.'
          ],
          keyRules: [
            'Check equality `window_count[char] == t_count[char]` to increment `have` exactly once per unique character.',
            'Runs in O(N + M) time with O(N + M) space.'
          ],
          codeSnippet: {
            id: 'dsa-snip-4-6',
            title: 'Minimum Window Substring',
            description: 'Two-pointer dynamic frequency matching in O(N + M)',
            language: 'python',
            code: `from collections import Counter

def min_window(s: str, t: str) -> str:
    if not t or not s: return ""
    t_count = Counter(t)
    window_count = Counter()
    have, need = 0, len(t_count)
    res = (-1, -1)
    res_len = float('inf')
    left = 0
    
    for right, char in enumerate(s):
        window_count[char] += 1
        if char in t_count and window_count[char] == t_count[char]:
            have += 1
            
        while have == need:
            if (right - left + 1) < res_len:
                res = (left, right)
                res_len = right - left + 1
                
            window_count[s[left]] -= 1
            if s[left] in t_count and window_count[s[left]] < t_count[s[left]]:
                have -= 1
            left += 1
            
    l, r = res
    return s[l:r + 1] if res_len != float('inf') else ""

print("Min Window Substring:", min_window("ADOBECODEBANC", "ABC")) # "BANC"`
          },
          pitfall: 'Incrementing `have` on every duplicate: if `t` needs one "A" and window has three "A"s, `have` must only increment ONCE when the first "A" is satisfied.',
          quickCheck: {
            question: 'In Minimum Window Substring, when is the left pointer allowed to shrink the window?',
            options: ['Whenever right reaches the end of string', 'Only when the active window contains all required characters (have == need)', 'On every single iteration', 'Only when characters are sorted'],
            correctIndex: 1,
            explanation: 'When have == need, the current window is valid, so we greedily shrink from the left to find the minimum length satisfying substring.'
          }
        },
        {
          id: 'dsa-w1-d4-t7',
          topicNumber: 7,
          title: 'Maximum Number of Vowels in a Substring of Given Length',
          explanation: [
            'Given string `s` and integer $k$, return the maximum number of vowel letters in any substring of length $k$.',
            'Canonical fixed sliding window: vowels are "aeiou".',
            '1. Count vowels in initial window `s[0..k-1]`.',
            '2. Slide window: if leaving character `s[i - k]` was a vowel, decrement count; if entering character `s[i]` is a vowel, increment count.',
            '3. Update max count in $O(1)$ per step.'
          ],
          keyRules: [
            'Use a lookup set for vowels `set("aeiou")` for O(1) membership testing.',
            'Runs in O(N) time with O(1) space.'
          ],
          codeSnippet: {
            id: 'dsa-snip-4-7',
            title: 'Max Vowels in Window of Size K',
            description: 'Fixed-window vowel counter',
            language: 'python',
            code: `def max_vowels(s: str, k: int) -> int:
    vowels = {'a', 'e', 'i', 'o', 'u'}
    curr_vowels = sum(1 for i in range(k) if s[i] in vowels)
    max_v = curr_vowels
    
    for i in range(k, len(s)):
        if s[i] in vowels: curr_vowels += 1
        if s[i - k] in vowels: curr_vowels -= 1
        max_v = max(max_v, curr_vowels)
        if max_v == k: break # early exit: cannot exceed k
        
    return max_v

print("Max vowels in k=3:", max_vowels("abciiidef", 3)) # 3 ("iii")`
          },
          pitfall: 'Searching in a string `if char in "aeiou"` repeatedly: while fast for 5 letters, checking a hash set is idiomatic and guarantees O(1) lookup.',
          quickCheck: {
            question: 'What is the maximum theoretical vowel count in a substring of length k?',
            options: ['5', 'k', '26', 'k / 2'],
            correctIndex: 1,
            explanation: 'A substring of length k cannot contain more than k characters, so the maximum possible vowel count is k.'
          }
        },
        {
          id: 'dsa-w1-d4-t8',
          topicNumber: 8,
          title: 'Subarrays with K Different Integers (AtMost Trick)',
          explanation: [
            'Problem: Find the number of good subarrays with EXACTLY $K$ distinct integers.',
            'Finding "exactly $K$" directly with sliding window is difficult because shrinking `left` might change both size and validity.',
            'The Mathematical Transformation Trick:',
            '$\\text{Count}(\\text{exactly } K) = \\text{Count}(\\text{at most } K) - \\text{Count}(\\text{at most } K - 1)$.',
            'Calculating "at most $K$" with sliding window is trivial: for any valid window `[left .. right]`, the number of new valid subarrays ending at `right` is simply `right - left + 1`!'
          ],
          keyRules: [
            'Number of subarrays ending at right with at most K distinct elements is (right - left + 1).',
            'Compute at_most(k) - at_most(k - 1) in two simple O(N) passes.'
          ],
          codeSnippet: {
            id: 'dsa-snip-4-8',
            title: 'Exact K Distinct via At-Most Reduction',
            description: 'Transforming exact count to difference of two atMost queries',
            language: 'python',
            code: `from collections import defaultdict

def subarrays_with_k_distinct(nums: list[int], k: int) -> int:
    def at_most(limit: int) -> int:
        if limit == 0: return 0
        counts = defaultdict(int)
        left = 0
        total = 0
        for right, val in enumerate(nums):
            counts[val] += 1
            while len(counts) > limit:
                counts[nums[left]] -= 1
                if counts[nums[left]] == 0:
                    del counts[nums[left]]
                left += 1
            total += right - left + 1
        return total
        
    return at_most(k) - at_most(k - 1)

print("Subarrays with exactly 2 distinct:", subarrays_with_k_distinct([1, 2, 1, 2, 3], 2)) # 7`
          },
          pitfall: 'Trying to track multiple left pointers simultaneously instead of using the at_most difference trick: this results in messy, bug-ridden code.',
          quickCheck: {
            question: 'Why is Count(exactly K) = Count(at most K) - Count(at most K - 1)?',
            options: ['By the binomial theorem', 'Because the set of subarrays with at most K integers minus those with at most K - 1 integers leaves precisely those with exactly K integers', 'Because K is prime', 'To prevent stack overflow'],
            correctIndex: 1,
            explanation: 'The difference between the cumulative counts <= K and <= K - 1 isolates the exact equality count == K.'
          }
        }
      ]
    },
    {
      id: 'dsa-w1-d5',
      dayNumber: 5,
      weekNumber: 1,
      title: 'Binary Search & Search Space Reduction',
      subtitle: 'Sorted array halving, overflow-safe mid calculation, lower/upper bounds, rotated arrays & binary search on answer',
      durationMinutes: 70,
      overview:
        'Harness the power of logarithmic search space reduction. Understand the subtle mechanics of binary search: integer overflow avoidance, left vs right boundary bias, bisect patterns, search in rotated sorted arrays, and binary search on the answer domain (Koko Eating Bananas).',
      topics: [
        {
          id: 'dsa-w1-d5-t1',
          topicNumber: 1,
          title: 'The Logarithmic Engine: Halving Search Space',
          explanation: [
            'Binary search works on any monotonically ordered search space.',
            'By testing the midpoint `mid`, we can determine whether the target lies in the left half or right half.',
            'Each step cuts the remaining search space in half ($N \\to N/2 \\to N/4 \\dots$).',
            'For an array of $1,000,000,000$ (one billion) elements, binary search finds the answer in at most $\\log_2(10^9) \\approx 30$ comparisons!'
          ],
          keyRules: [
            'Requires monotonic condition: if condition(mid) is true, it is true for all x > mid (or x < mid).',
            'Time complexity is strictly O(log N).'
          ],
          codeSnippet: {
            id: 'dsa-snip-5-1',
            title: 'Classic Binary Search Template',
            description: 'Canonical inclusive range [left, right] binary search',
            language: 'python',
            code: `def binary_search(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    
    while left <= right:
        # Overflow safe midpoint: left + (right - left) // 2
        mid = left + (right - left) // 2
        
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
            
    return -1

print("Found target 9 at index:", binary_search([-1, 0, 3, 5, 9, 12], 9)) # 4`
          },
          pitfall: 'Calculating midpoint as `(left + right) // 2`: in languages like C++/Java with fixed 32-bit integers, `left + right` can overflow to a negative number! Always use `left + (right - left) // 2`.',
          quickCheck: {
            question: 'Why should midpoint be calculated as `left + (right - left) // 2` instead of `(left + right) // 2`?',
            options: ['To ensure integer division', 'To prevent 32-bit integer overflow when left and right are large numbers', 'To make binary search run in O(1)', 'Because the compiler rejects addition'],
            correctIndex: 1,
            explanation: 'When left and right exceed 2^30, their sum exceeds 2^31 - 1, causing signed integer overflow into negative values in compiled languages.'
          }
        },
        {
          id: 'dsa-w1-d5-t2',
          topicNumber: 2,
          title: 'Lower Bound vs Upper Bound (Bisect Left vs Bisect Right)',
          explanation: [
            'When arrays contain duplicate elements, standard binary search finds AN arbitrary matching index, not necessarily the FIRST or LAST.',
            '- **Lower Bound (bisect_left)**: Find the first index where `nums[index] >= target`.',
            '- **Upper Bound (bisect_right)**: Find the first index where `nums[index] > target`.',
            'To find the range of a target `[first, last]`: `first = lower_bound(target)`, `last = upper_bound(target) - 1`.'
          ],
          keyRules: [
            'Lower bound: when nums[mid] >= target, move right = mid.',
            'Upper bound: when nums[mid] > target, move right = mid.'
          ],
          codeSnippet: {
            id: 'dsa-snip-5-2',
            title: 'Lower and Upper Bound Implementations',
            description: 'Finding first and last position of element in sorted array',
            language: 'python',
            code: `def lower_bound(nums: list[int], target: int) -> int:
    left, right = 0, len(nums)
    while left < right:
        mid = left + (right - left) // 2
        if nums[mid] >= target:
            right = mid
        else:
            left = mid + 1
    return left

def search_range(nums: list[int], target: int) -> list[int]:
    start = lower_bound(nums, target)
    if start == len(nums) or nums[start] != target:
        return [-1, -1]
    end = lower_bound(nums, target + 1) - 1
    return [start, end]

print("First and last position of 8:", search_range([5, 7, 7, 8, 8, 10], 8)) # [3, 4]`
          },
          pitfall: 'Using `left <= right` with `right = mid`: this can trap the search in an infinite loop when `left == right`!',
          quickCheck: {
            question: 'What index does lower_bound(nums, target) return if target is present multiple times in nums?',
            options: ['The last occurrence', 'The first occurrence', 'The middle occurrence', '-1'],
            correctIndex: 1,
            explanation: 'Lower bound returns the index of the very first element that is >= target.'
          }
        },
        {
          id: 'dsa-w1-d5-t3',
          topicNumber: 3,
          title: 'Search in Rotated Sorted Array',
          explanation: [
            'A sorted array rotated at an unknown pivot (e.g. `[4, 5, 6, 7, 0, 1, 2]`) is split into two sorted halves.',
            'Key insight: For any midpoint `mid`, AT LEAST ONE HALF (`[left..mid]` or `[mid..right]`) IS STRICTLY SORTED!',
            'Check which half is sorted:',
            '1. If `nums[left] <= nums[mid]`: left half is sorted. Check if target lies within `[nums[left] .. nums[mid]]`.',
            '2. Else: right half is sorted. Check if target lies within `[nums[mid] .. nums[right]]`.',
            'Eliminate half the array and achieve $O(\\log N)$ time.'
          ],
          keyRules: [
            'Identify which half is sorted first: nums[left] <= nums[mid].',
            'Check if target is bounded inside the sorted half to decide which direction to branch.'
          ],
          codeSnippet: {
            id: 'dsa-snip-5-3',
            title: 'Search in Rotated Sorted Array',
            description: 'O(log N) search by detecting sorted subarray halves',
            language: 'python',
            code: `def search_rotated(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target: return mid
        
        # Check if left half is sorted
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1 # target is in sorted left half
            else:
                left = mid + 1  # target is in right half
        # Otherwise, right half is sorted
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1  # target is in sorted right half
            else:
                right = mid - 1 # target is in left half
                
    return -1

print("Found 0 in rotated array at index:", search_rotated([4, 5, 6, 7, 0, 1, 2], 0)) # 4`
          },
          pitfall: 'Using strict `<` instead of `<=` in `nums[left] <= nums[mid]`: when left == mid (2-element array), it misidentifies the sorted half.',
          quickCheck: {
            question: 'In a rotated sorted array without duplicates, what property is always true for any choice of midpoint?',
            options: ['The target is always at mid', 'At least one of the two halves [left..mid] or [mid..right] is guaranteed to be normally sorted', 'The array is completely unsorted', 'Binary search is impossible'],
            correctIndex: 1,
            explanation: 'A single rotation point can only disrupt one half; the other half will always remain strictly sorted.'
          }
        },
        {
          id: 'dsa-w1-d5-t4',
          topicNumber: 4,
          title: 'Find Minimum in Rotated Sorted Array',
          explanation: [
            'Problem: Find the minimum element in a rotated sorted array in $O(\\log N)$ time.',
            'Compare `nums[mid]` with `nums[right]`:',
            '- If `nums[mid] > nums[right]`: the inflection point (minimum) MUST be strictly to the right of `mid`, so `left = mid + 1`.',
            '- If `nums[mid] <= nums[right]`: the minimum is either at `mid` or to the left of `mid`, so `right = mid`.',
            'When `left == right`, the minimum element is found.'
          ],
          keyRules: [
            'Compare mid with right (NOT left) to reliably detect whether the rotation point lies in the right partition.',
            'Never do right = mid - 1 when nums[mid] <= nums[right], because mid could BE the minimum element!'
          ],
          codeSnippet: {
            id: 'dsa-snip-5-4',
            title: 'Find Minimum in Rotated Sorted Array',
            description: 'Locating the pivot inflection point in O(log N)',
            language: 'python',
            code: `def find_min(nums: list[int]) -> int:
    left, right = 0, len(nums) - 1
    
    while left < right:
        mid = left + (right - left) // 2
        if nums[mid] > nums[right]:
            left = mid + 1 # inflection point is to the right
        else:
            right = mid    # mid could be minimum or to the left
            
    return nums[left]

print("Minimum element:", find_min([4, 5, 6, 7, 0, 1, 2])) # 0`
          },
          pitfall: 'Comparing `nums[mid]` against `nums[left]`: fails on unrotated sorted arrays like `[1, 2, 3]` because `nums[mid] > nums[left]` would falsely suggest the minimum is to the right.',
          quickCheck: {
            question: 'Why do we compare nums[mid] against nums[right] rather than nums[left] in Find Minimum in Rotated Array?',
            options: ['Because right is always larger than left', 'Comparing with right handles both rotated and unrotated arrays correctly without edge-case branches', 'Because Python arrays are indexed from right', 'To prevent out-of-bounds errors'],
            correctIndex: 1,
            explanation: 'If nums[mid] > nums[right], the pivot is guaranteed to be in the right half. If nums[mid] <= nums[right], the right half is sorted and the min is at or left of mid.'
          }
        },
        {
          id: 'dsa-w1-d5-t5',
          topicNumber: 5,
          title: 'Search a 2D Matrix (Flattened Index Math)',
          explanation: [
            'Given an $M \\times N$ matrix where each row is sorted and the first integer of each row is greater than the last integer of the previous row.',
            'The entire 2D matrix can be viewed as a single sorted 1D array of length $M \\times N$.',
            'Convert 1D index `mid` to 2D matrix coordinates in $O(1)$:',
            '$\\text{row} = \\text{mid} // N, \\quad \\text{col} = \\text{mid} \\% N$.',
            'Perform standard binary search over range `[0 .. M * N - 1]` in $O(\\log(M \\times N))$ time and $O(1)$ space.'
          ],
          keyRules: [
            'row = mid // cols, col = mid % cols.',
            'Zero matrix copies or flattening arrays needed.'
          ],
          codeSnippet: {
            id: 'dsa-snip-5-5',
            title: 'Search 2D Matrix with Virtual 1D Index',
            description: 'Direct binary search over 2D array in O(log(M * N))',
            language: 'python',
            code: `def search_matrix(matrix: list[list[int]], target: int) -> bool:
    if not matrix or not matrix[0]: return False
    rows, cols = len(matrix), len(matrix[0])
    left, right = 0, rows * cols - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        r, c = divmod(mid, cols) # r = mid // cols, c = mid % cols
        val = matrix[r][c]
        
        if val == target: return True
        elif val < target: left = mid + 1
        else: right = mid - 1
        
    return False

mat = [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]]
print("Found 3 in 2D Matrix:", search_matrix(mat, 3)) # True`
          },
          pitfall: 'Physically flattening the 2D matrix into a 1D list: creates an unnecessary O(M * N) memory allocation. Use virtual index math instead.',
          quickCheck: {
            question: 'Given an M x N matrix, what is the 2D row and column for a flattened index `k`?',
            options: ['row = k % M, col = k // N', 'row = k // N, col = k % N', 'row = k // M, col = k % M', 'row = k, col = k'],
            correctIndex: 1,
            explanation: 'Since each row contains N elements (cols), the row index is k // N and the column index within that row is k % N.'
          }
        },
        {
          id: 'dsa-w1-d5-t6',
          topicNumber: 6,
          title: 'Binary Search on the Answer: Koko Eating Bananas',
          explanation: [
            'Many complex optimization problems have a monotonic property over their ANSWER domain:',
            '"Given $N$ piles of bananas and $H$ hours, find the minimum integer eating speed $K$ such that Koko can eat all bananas within $H$ hours."',
            'Notice:',
            '- If speed $K$ is fast enough, any speed $> K$ is also fast enough.',
            '- If speed $K$ is too slow, any speed $< K$ is also too slow.',
            'The answer domain $[1 .. \\max(\\text{piles})]$ is monotonic! We can binary search for the minimum viable speed $K$.'
          ],
          keyRules: [
            'Identify monotonic predicate function: `can_finish(speed) -> bool`.',
            'Search space is bounded by [1, max(piles)].',
            'Time complexity: O(N * log(max(piles))).'
          ],
          codeSnippet: {
            id: 'dsa-snip-5-6',
            title: 'Koko Eating Bananas (Search on Answer)',
            description: 'Binary searching minimum eating speed in O(N log M)',
            language: 'python',
            code: `import math

def min_eating_speed(piles: list[int], h: int) -> int:
    def can_finish(k: int) -> bool:
        # Total hours needed at eating speed k
        hours = sum(math.ceil(p / k) for p in piles)
        return hours <= h
        
    left, right = 1, max(piles)
    ans = right
    
    while left <= right:
        mid = left + (right - left) // 2
        if can_finish(mid):
            ans = mid
            right = mid - 1 # try finding a slower valid speed
        else:
            left = mid + 1  # speed too slow, must eat faster
            
    return ans

print("Minimum speed for H=8:", min_eating_speed([3, 6, 7, 11], 8)) # 4`
          },
          pitfall: 'Using linear scan `for k in range(1, max(piles))` which takes O(N * max(piles)) and results in Time Limit Exceeded.',
          quickCheck: {
            question: 'When can binary search be applied to a problem that does not provide a sorted input array?',
            options: ['Never', 'Whenever the answer domain has a monotonic boolean predicate (e.g. false, false, ..., true, true)', 'Only when inputs are prime numbers', 'Only in tree problems'],
            correctIndex: 1,
            explanation: 'Binary search on the answer applies whenever a candidate solution value can be tested with a monotonic feasibility function.'
          }
        },
        {
          id: 'dsa-w1-d5-t7',
          topicNumber: 7,
          title: 'Split Array Largest Sum / Capacity to Ship Packages Within D Days',
          explanation: [
            'Given package weights and days $D$, find the minimum ship capacity to deliver all packages in order within $D$ days.',
            'This is structurally identical to Split Array Largest Sum.',
            'Search space for capacity:',
            '- Lower bound: `max(weights)` (capacity must be at least as large as the heaviest single package).',
            '- Upper bound: `sum(weights)` (shipping all packages in 1 day).',
            'Binary search on capacity in range `[max(weights) .. sum(weights)]`.'
          ],
          keyRules: [
            'Search space lower bound is max(weights).',
            'Search space upper bound is sum(weights).'
          ],
          codeSnippet: {
            id: 'dsa-snip-5-7',
            title: 'Capacity to Ship Packages Within D Days',
            description: 'Greedy days verification with binary search on capacity',
            language: 'python',
            code: `def ship_within_days(weights: list[int], days: int) -> int:
    def days_needed(capacity: int) -> int:
        d = 1
        curr = 0
        for w in weights:
            if curr + w > capacity:
                d += 1
                curr = 0
            curr += w
        return d
        
    left, right = max(weights), sum(weights)
    ans = right
    
    while left <= right:
        mid = left + (right - left) // 2
        if days_needed(mid) <= days:
            ans = mid
            right = mid - 1 # try smaller capacity
        else:
            left = mid + 1  # need larger capacity
            
    return ans

print("Min ship capacity for D=5:", ship_within_days([1,2,3,4,5,6,7,8,9,10], 5)) # 15`
          },
          pitfall: 'Setting lower bound to 1 or 0: if capacity is less than `max(weights)`, a single package cannot fit on the ship, causing an infinite loop in the greedy check.',
          quickCheck: {
            question: 'Why is the lower bound of binary search for ship capacity set to max(weights)?',
            options: ['To speed up compilation', 'Because the ship must be able to carry the heaviest individual package without splitting it', 'Because weights are sorted', 'To avoid division by zero'],
            correctIndex: 1,
            explanation: 'Packages cannot be divided; therefore, the ship must have at least enough capacity to hold the heaviest package.'
          }
        },
        {
          id: 'dsa-w1-d5-t8',
          topicNumber: 8,
          title: 'Median of Two Sorted Arrays (The Peak Logarithmic Challenge)',
          explanation: [
            'Given two sorted arrays `nums1` of size $M$ and `nums2` of size $N$, find the median in $O(\\log(\\min(M, N)))$ time.',
            'We binary search the partition in the SMALLER array `nums1` (`left1`), which automatically determines the partition in `nums2` (`left2 = (M + N + 1) // 2 - left1`).',
            'Verify partition validity:',
            '$\\text{maxLeft1} \\le \\text{minRight2}$ AND $\\text{maxLeft2} \\le \\text{minRight1}$.',
            'Once valid, the median is calculated from the boundary elements in $O(1)$.'
          ],
          keyRules: [
            'Always binary search on the shorter array to ensure O(log(min(M, N))) and guarantee valid non-negative indices in the longer array.',
            'Use infinity (-inf, +inf) for edge partitions where left1=0 or left1=M.'
          ],
          codeSnippet: {
            id: 'dsa-snip-5-8',
            title: 'Median of Two Sorted Arrays',
            description: 'Partition-based binary search in O(log(min(M, N)))',
            language: 'python',
            code: `def find_median_sorted_arrays(nums1: list[int], nums2: list[int]) -> float:
    # Ensure nums1 is the shorter array
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1
        
    m, n = len(nums1), len(nums2)
    left, right = 0, m
    total_left = (m + n + 1) // 2
    
    while left <= right:
        i = (left + right) // 2
        j = total_left - i
        
        l1 = nums1[i - 1] if i > 0 else float('-inf')
        r1 = nums1[i] if i < m else float('inf')
        l2 = nums2[j - 1] if j > 0 else float('-inf')
        r2 = nums2[j] if j < n else float('inf')
        
        if l1 <= r2 and l2 <= r1:
            if (m + n) % 2 == 1:
                return float(max(l1, l2))
            else:
                return (max(l1, l2) + min(r1, r2)) / 2.0
        elif l1 > r2:
            right = i - 1
        else:
            left = i + 1
            
    return 0.0

print("Median:", find_median_sorted_arrays([1, 3], [2])) # 2.0`
          },
          pitfall: 'Binary searching on the larger array: can cause index `j = total_left - i` to become negative or out of bounds.',
          quickCheck: {
            question: 'What is the time complexity of the optimal Median of Two Sorted Arrays algorithm?',
            options: ['O(M + N)', 'O(log(min(M, N)))', 'O((M + N) log(M + N))', 'O(1)'],
            correctIndex: 1,
            explanation: 'By binary searching the partition cut exclusively on the smaller array, the time complexity is bounded by O(log(min(M, N))).'
          }
        }
      ]
    },
    {
      id: 'dsa-w1-d6',
      dayNumber: 6,
      weekNumber: 1,
      title: 'Sorting Algorithms, Stability & QuickSelect',
      subtitle: 'Merge Sort, Quick Sort (Lomuto vs Hoare), sorting stability, TimSort, and O(N) QuickSelect',
      durationMinutes: 70,
      overview:
        'Master the mechanics, invariants, and trade-offs of canonical sorting algorithms. Understand comparison sort limits (Omega(N log N)), stability, Merge Sort divide-and-conquer, Quick Sort partition schemes, and finding the Kth largest element in O(N) average time with QuickSelect.',
      topics: [
        {
          id: 'dsa-w1-d6-t1',
          topicNumber: 1,
          title: 'Comparison Sort Lower Bound: Why Ω(N log N) Is Unbeatable',
          explanation: [
            'Any comparison-based sorting algorithm can be modeled as a Binary Decision Tree where each internal node is a comparison `A[i] < A[j]`.',
            'For an array of $N$ elements, there are $N!$ possible permutations (leaves in the decision tree).',
            'A binary tree with $N!$ leaves must have a minimum height of:',
            '$\\text{Height} \\ge \\log_2(N!) = \\Omega(N \\log N)$ (by Stirling\'s approximation).',
            'Therefore, NO comparison-based sorting algorithm can ever run faster than $\\Omega(N \\log N)$ in the worst case.'
          ],
          keyRules: [
            'Comparison sorting lower bound is mathematically proven to be Omega(N log N).',
            'Non-comparison sorts (Counting Sort, Radix Sort) can achieve O(N) by exploiting bounded key ranges.'
          ],
          codeSnippet: {
            id: 'dsa-snip-6-1',
            title: 'Stirlings Approximation Verification',
            description: 'Demonstrating log2(N!) asymptotic equivalence to N log2(N)',
            language: 'python',
            code: `import math

for n in [10, 100, 1000]:
    log_factorial = sum(math.log2(i) for i in range(1, n + 1))
    n_log_n = n * math.log2(n)
    print(f"N = {n:4d} | log2(N!) = {log_factorial:10.1f} | N*log2(N) = {n_log_n:10.1f} | Ratio: {log_factorial / n_log_n:.3f}")`
          },
          pitfall: 'Claiming a new comparison sorting algorithm runs in O(N) time: mathematically impossible for arbitrary keys.',
          quickCheck: {
            question: 'What is the theoretical worst-case lower bound for any comparison-based sorting algorithm?',
            options: ['O(N)', 'Omega(N log N)', 'O(log N)', 'O(N^2)'],
            correctIndex: 1,
            explanation: 'A decision tree distinguishing N! permutations requires a height of at least log2(N!) = Omega(N log N).'
          }
        },
        {
          id: 'dsa-w1-d6-t2',
          topicNumber: 2,
          title: 'Sorting Stability: Why It Matters in Real Systems',
          explanation: [
            'A sorting algorithm is **Stable** if elements with identical keys preserve their relative order from the original input.',
            'Example: Sort students by Grade, then sort by Name. If Name sort is stable, students with the same name remain grouped by Grade.',
            '- Stable sorts: Merge Sort, Insertion Sort, Bubble Sort, TimSort.',
            '- Unstable sorts: Quick Sort, Heap Sort, Selection Sort.'
          ],
          keyRules: [
            'Python sorted() / list.sort() uses TimSort, which is strictly stable.',
            'C++ std::sort is unstable (Introsort); std::stable_sort is stable (MergeSort).'
          ],
          codeSnippet: {
            id: 'dsa-snip-6-2',
            title: 'Stable vs Unstable Sorting Demonstration',
            description: 'Preserving relative order of equal keys',
            language: 'python',
            code: `class Item:
    def __init__(self, key: int, original_pos: int):
        self.key = key
        self.original_pos = original_pos
    def __repr__(self):
        return f"({self.key}, pos:{self.original_pos})"

items = [Item(5, 1), Item(3, 2), Item(5, 3), Item(2, 4)]
# Python sort is stable (TimSort)
items.sort(key=lambda x: x.key)
print("Stable Sorted Items:", items)
# Notice Item(5, pos:1) remains before Item(5, pos:3)!`
          },
          pitfall: 'Using an unstable sort when multi-column sorting (e.g., sort by date then sort by department): an unstable second sort scrambles the order established by the first sort.',
          quickCheck: {
            question: 'Which of the following sorting algorithms is guaranteed to be stable?',
            options: ['Heap Sort', 'Merge Sort', 'Quick Sort', 'Selection Sort'],
            correctIndex: 1,
            explanation: 'Merge Sort preserves original relative order when merging elements with <= comparisons, making it guaranteed stable.'
          }
        },
        {
          id: 'dsa-w1-d6-t3',
          topicNumber: 3,
          title: 'Merge Sort: Divide, Conquer & Stable Merging',
          explanation: [
            'Merge Sort recursively splits the array into two halves until single-element arrays are reached, then merges the sorted halves.',
            'Recurrence: $T(N) = 2T(N/2) + O(N) \\implies O(N \\log N)$ across best, worst, and average cases.',
            'Auxiliary Space: $O(N)$ because merging requires allocating temporary buffers to hold elements during combination.',
            'Guaranteed $O(N \\log N)$ worst-case performance makes it resilient against adversarial inputs.'
          ],
          keyRules: [
            'Always stable if merge uses <=: `if left[i] <= right[j]: pick left`.',
            'Requires O(N) auxiliary memory for buffer allocations.'
          ],
          codeSnippet: {
            id: 'dsa-snip-6-3',
            title: 'Merge Sort Implementation',
            description: 'Divide and conquer recursive merge sort',
            language: 'python',
            code: `def merge_sort(arr: list[int]) -> list[int]:
    if len(arr) <= 1:
        return arr
        
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    # Merge step
    merged = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]: # <= maintains stability
            merged.append(left[i])
            i += 1
        else:
            merged.append(right[j])
            j += 1
    merged.extend(left[i:])
    merged.extend(right[j:])
    return merged

print("Merge Sorted:", merge_sort([38, 27, 43, 3, 9, 82, 10]))`
          },
          pitfall: 'Using strict `<` in the merge step: changes Merge Sort from stable to unstable by picking the right element before the left element on equal keys.',
          quickCheck: {
            question: 'What is the auxiliary space complexity of standard array-based Merge Sort?',
            options: ['O(1)', 'O(log N)', 'O(N)', 'O(N^2)'],
            correctIndex: 2,
            explanation: 'Standard Merge Sort requires O(N) auxiliary buffer space to merge the two sorted halves.'
          }
        },
        {
          id: 'dsa-w1-d6-t4',
          topicNumber: 4,
          title: 'Quick Sort: Lomuto vs Hoare Partition Schemes',
          explanation: [
            'Quick Sort picks a `pivot` and partitions the array so elements `< pivot` are on the left, and elements `> pivot` are on the right, then recurses.',
            '- **Lomuto Partition**: Simpler to write. Pivot at end; single scanner pointer. Performs ~3x more swaps than Hoare.',
            '- **Hoare Partition**: Original scheme. Two pointers converging from both ends. Fewer swaps, faster in practice.',
            'Average Time: $O(N \\log N)$. Worst Time: $O(N^2)$ (if pivot is consistently min or max, e.g. already sorted array with naive pivot).'
          ],
          keyRules: [
            'In-place: O(log N) auxiliary stack space.',
            'Mitigate O(N^2) worst case using Randomized Pivot or Median-of-Three.'
          ],
          codeSnippet: {
            id: 'dsa-snip-6-4',
            title: 'Quick Sort with Lomuto Partition',
            description: 'In-place recursive quick sort implementation',
            language: 'python',
            code: `def quick_sort(arr: list[int], low: int, high: int) -> None:
    if low < high:
        # Lomuto Partition
        pivot = arr[high]
        i = low - 1
        for j in range(low, high):
            if arr[j] <= pivot:
                i += 1
                arr[i], arr[j] = arr[j], arr[i]
        arr[i + 1], arr[high] = arr[high], arr[i + 1]
        p_idx = i + 1
        
        quick_sort(arr, low, p_idx - 1)
        quick_sort(arr, p_idx + 1, high)

nums = [10, 80, 30, 90, 40, 50, 70]
quick_sort(nums, 0, len(nums) - 1)
print("Quick Sorted:", nums)`
          },
          pitfall: 'Picking the first element as pivot on an already-sorted array: triggers the O(N^2) worst-case with recursion depth N, causing recursion stack overflow.',
          quickCheck: {
            question: 'What is the worst-case time complexity of Quick Sort with naive pivot selection?',
            options: ['O(N)', 'O(N log N)', 'O(N^2)', 'O(2^N)'],
            correctIndex: 2,
            explanation: 'If the chosen pivot is always the smallest or largest element (e.g. sorted input with end pivot), the partition is lopsided (1 vs N-1), resulting in O(N^2) comparisons.'
          }
        },
        {
          id: 'dsa-w1-d6-t5',
          topicNumber: 5,
          title: 'QuickSelect: Find Kth Largest Element in O(N) Average Time',
          explanation: [
            'To find the Kth smallest/largest element, full sorting takes $O(N \\log N)$.',
            'QuickSelect adapts Quick Sort\'s partition logic: after partitioning around pivot index `p`:',
            '- If `p == target_index`: the pivot is the exact Kth element! Return it immediately.',
            '- If `target_index < p`: recurse ONLY into the left partition.',
            '- If `target_index > p`: recurse ONLY into the right partition.',
            'Because we drop half the problem at each step, recurrence is $N + N/2 + N/4 \\dots = 2N = O(N)$ average time!'
          ],
          keyRules: [
            'Average Time: O(N) linear time.',
            'Auxiliary Space: O(1) iterative or O(log N) recursive.'
          ],
          codeSnippet: {
            id: 'dsa-snip-6-5',
            title: 'QuickSelect for Kth Largest Element',
            description: 'Average O(N) selection without full sorting',
            language: 'python',
            code: `import random

def find_kth_largest(nums: list[int], k: int) -> int:
    target_idx = len(nums) - k # Kth largest is (N - k)th smallest
    
    def quick_select(low: int, high: int) -> int:
        pivot_idx = random.randint(low, high)
        nums[pivot_idx], nums[high] = nums[high], nums[pivot_idx]
        pivot = nums[high]
        
        i = low
        for j in range(low, high):
            if nums[j] <= pivot:
                nums[i], nums[j] = nums[j], nums[i]
                i += 1
        nums[i], nums[high] = nums[high], nums[i]
        
        if i == target_idx:
            return nums[i]
        elif target_idx < i:
            return quick_select(low, i - 1)
        else:
            return quick_select(i + 1, high)
            
    return quick_select(0, len(nums) - 1)

print("2nd largest in [3, 2, 1, 5, 6, 4]:", find_kth_largest([3, 2, 1, 5, 6, 4], 2)) # 5`
          },
          pitfall: 'Using QuickSelect when the array must remain unmodified: QuickSelect mutates and reorders array elements in place.',
          quickCheck: {
            question: 'What is the average time complexity of QuickSelect to find the median of an unsorted array?',
            options: ['O(log N)', 'O(N)', 'O(N log N)', 'O(N^2)'],
            correctIndex: 1,
            explanation: 'QuickSelect only recurses into one half of the partition, yielding N + N/2 + N/4 + ... = O(N) average time.'
          }
        },
        {
          id: 'dsa-w1-d6-t6',
          topicNumber: 6,
          title: 'Counting Sort: O(N + K) Non-Comparison Integer Sort',
          explanation: [
            'When sorting integers within a bounded range $[0 .. K]$ where $K = O(N)$, we can bypass the $\\Omega(N \\log N)$ comparison bound.',
            'Counting Sort counts the frequency of each distinct key in an auxiliary array `count` of size $K + 1$.',
            'Compute prefix sums of `count` to determine the exact output positions for each value.',
            'Place elements into the output array iterating backwards to preserve stability in $O(N + K)$ time.'
          ],
          keyRules: [
            'Time Complexity: O(N + K).',
            'Practical only when range K is proportional to N (e.g. K <= 1,000,000).'
          ],
          codeSnippet: {
            id: 'dsa-snip-6-6',
            title: 'Stable Counting Sort Implementation',
            description: 'Non-comparison O(N + K) sorting for bounded integers',
            language: 'python',
            code: `def counting_sort(arr: list[int]) -> list[int]:
    if not arr: return []
    min_val, max_val = min(arr), max(arr)
    k = max_val - min_val + 1
    
    count = [0] * k
    for x in arr:
        count[x - min_val] += 1
        
    for i in range(1, k):
        count[i] += count[i - 1]
        
    output = [0] * len(arr)
    # Iterate backwards to ensure stability
    for x in reversed(arr):
        idx = x - min_val
        output[count[idx] - 1] = x
        count[idx] -= 1
        
    return output

print("Counting Sorted:", counting_sort([4, 2, 2, 8, 3, 3, 1])) # [1, 2, 2, 3, 3, 4, 8]`
          },
          pitfall: 'Using Counting Sort when K is huge (e.g., sorting 10 numbers whose values are up to $10^{12}$): it will attempt to allocate a trillion-element array and crash with Out-Of-Memory.',
          quickCheck: {
            question: 'When is Counting Sort preferred over Quick Sort or Merge Sort?',
            options: ['When keys are floating point numbers', 'When integers are bounded within a small known range K comparable to N', 'When memory is restricted to 10 bytes', 'When the input is already reversed'],
            correctIndex: 1,
            explanation: 'Counting Sort achieves O(N + K) linear time when the integer range K is small, outperforming O(N log N) comparison sorts.'
          }
        },
        {
          id: 'dsa-w1-d6-t7',
          topicNumber: 7,
          title: 'Custom Comparators and Edge Cases (Largest Number Problem)',
          explanation: [
            'Real-world problems frequently require sorting by custom transitive relations rather than standard numerical order.',
            'Problem (Largest Number): Given a list of non-negative integers, arrange them such that they form the largest possible number (e.g., `[3, 30, 34, 5, 9]` -> `"9534330"`).',
            'Comparator rule: For strings $A$ and $B$, $A$ comes before $B$ if $A + B > B + A$.',
            'Handle edge case: if the highest number is `"0"`, return `"0"` (avoid `"00"`).'
          ],
          keyRules: [
            'A custom comparator must define a Strict Weak Ordering (transitivity: if A < B and B < C, then A < C).',
            'Use functools.cmp_to_key in Python to convert 2-argument comparators.'
          ],
          codeSnippet: {
            id: 'dsa-snip-6-7',
            title: 'Largest Number via Custom String Comparator',
            description: 'Transitive concatenation comparator for largest number',
            language: 'python',
            code: `from functools import cmp_to_key

def largest_number(nums: list[int]) -> str:
    str_nums = [str(x) for x in nums]
    
    # Custom comparator: returns -1 if a should precede b
    def compare(a: str, b: str) -> int:
        if a + b > b + a:
            return -1 # a comes first
        elif a + b < b + a:
            return 1  # b comes first
        return 0
        
    str_nums.sort(key=cmp_to_key(compare))
    res = "".join(str_nums)
    return "0" if res[0] == "0" else res

print("Largest Number:", largest_number([3, 30, 34, 5, 9])) # "9534330"`
          },
          pitfall: 'Comparing strings with standard alphabetical sort: "30" > "3", which would arrange them as "303" instead of the larger "330".',
          quickCheck: {
            question: 'Why does comparing (a + b) vs (b + a) work for arranging the Largest Number?',
            options: ['It counts the number of digits', 'It directly evaluates which pairwise concatenation produces the larger numerical value', 'It multiplies the numbers', 'It tests if numbers are prime'],
            correctIndex: 1,
            explanation: 'Comparing the two concatenated strings a + b and b + a determines which ordering yields the higher value when adjacent.'
          }
        },
        {
          id: 'dsa-w1-d6-t8',
          topicNumber: 8,
          title: 'TimSort: The Hybrid Standard in Python and Java',
          explanation: [
            'Created by Tim Peters in 2002 for Python, TimSort is now the default sorting algorithm in Python (`list.sort`), Java (`Arrays.sort` for objects), and V8 JavaScript.',
            'How it works:',
            '1. Scans for already-ordered segments ("natural runs").',
            '2. Extends short runs using Insertion Sort (which is blazingly fast for $N < 64$ due to cache locality).',
            '3. Merges runs using an intelligent stack-based Merge Sort with "galloping mode" for unbalanced runs.',
            'Best Case: $O(N)$ for already sorted or nearly sorted data. Worst Case: $O(N \\log N)$. Guaranteed Stable.'
          ],
          keyRules: [
            'TimSort combines Insertion Sort and Merge Sort.',
            'Exploits real-world data patterns, achieving O(N) on sorted inputs.'
          ],
          codeSnippet: {
            id: 'dsa-snip-6-8',
            title: 'TimSort Performance Characteristics',
            description: 'Demonstrating O(N) performance on pre-sorted arrays',
            language: 'python',
            code: `import time

sorted_data = list(range(1_000_000))
start = time.perf_counter()
sorted_data.sort() # TimSort detects natural run in single O(N) pass!
elapsed = time.perf_counter() - start

print(f"TimSort on 1,000,000 sorted items: {elapsed * 1000:.2f} ms (Near instant!)")`
          },
          pitfall: 'Writing your own custom quicksort for general-purpose use: language-native TimSort has decades of assembly optimizations, cache tuning, and stability guarantees.',
          quickCheck: {
            question: 'What is the best-case time complexity of TimSort on an already-sorted array?',
            options: ['O(N log N)', 'O(N)', 'O(1)', 'O(N^2)'],
            correctIndex: 1,
            explanation: 'TimSort scans for natural ascending runs; an already-sorted array is identified as a single continuous run in a single O(N) pass.'
          }
        }
      ]
    },
    {
      id: 'dsa-w1-d7',
      dayNumber: 7,
      weekNumber: 1,
      title: 'Module 1 Capstone: Subarray Invariants & Linear Mastery',
      subtitle: 'Prefix sum hash maps, longest subarray with zero sum, contiguous array & module synthesis',
      durationMinutes: 80,
      overview:
        'Synthesize Week 1 algorithmic paradigms into master-level execution. Unify prefix sums, hash table lookups, and contiguous window invariants to solve Subarray Sum Equals K and Contiguous Array in O(N) time, followed by the Week 1 Qualifying Exam.',
      topics: [
        {
          id: 'dsa-w1-d7-t1',
          topicNumber: 1,
          title: 'Subarray Sum Equals K: The Prefix Sum + Hash Map Paradigm',
          explanation: [
            'Problem: Given an array of integers (which MAY contain negative numbers) and an integer $K$, find the total number of continuous subarrays whose sum equals $K$.',
            'Sliding window FAILS because numbers can be negative (no monotonicity).',
            'Prefix Sum Property: If $\\text{sum}(i, j) = \\text{prefix}[j] - \\text{prefix}[i - 1] = K$, then:',
            '$\\text{prefix}[i - 1] = \\text{prefix}[j] - K$.',
            'As we compute running prefix sum `curr_sum`, we check a hash map for how many times `curr_sum - K` has appeared previously!'
          ],
          keyRules: [
            'Initialize hash map with `{0: 1}` to account for subarrays starting at index 0.',
            'Runs in O(N) time with O(N) space, supporting negative numbers.'
          ],
          codeSnippet: {
            id: 'dsa-snip-7-1',
            title: 'Subarray Sum Equals K',
            description: 'O(N) prefix sum frequency hash map',
            language: 'python',
            code: `from collections import defaultdict

def subarray_sum(nums: list[int], k: int) -> int:
    prefix_counts = defaultdict(int)
    prefix_counts[0] = 1 # base case: prefix sum of 0 appears once
    curr_sum = 0
    count = 0
    
    for x in nums:
        curr_sum += x
        # If (curr_sum - k) occurred before, those prefix points form valid subarrays
        if (curr_sum - k) in prefix_counts:
            count += prefix_counts[curr_sum - k]
        prefix_counts[curr_sum] += 1
        
    return count

print("Subarrays with sum 2 in [1, 1, 1]:", subarray_sum([1, 1, 1], 2)) # 2 ([1,1] at [0..1] and [1..2])`
          },
          pitfall: 'Forgetting `prefix_counts[0] = 1`: if a subarray starting from index 0 has sum equal to K, `curr_sum - K == 0`, and without `{0: 1}` that subarray is missed.',
          quickCheck: {
            question: 'Why is `prefix_counts[0] = 1` mandatory in Subarray Sum Equals K?',
            options: ['To avoid division by zero', 'To count valid subarrays that start at index 0 where curr_sum equals k exactly', 'Because arrays are 0-indexed', 'To set hash map size'],
            correctIndex: 1,
            explanation: 'When the running prefix sum itself equals k, curr_sum - k is 0. Having prefix_counts[0] = 1 registers this entire prefix as a valid subarray.'
          }
        },
        {
          id: 'dsa-w1-d7-t2',
          topicNumber: 2,
          title: 'Contiguous Array: Equal Number of 0s and 1s',
          explanation: [
            'Problem: Given a binary array `nums`, find the maximum length of a contiguous subarray with an equal number of 0s and 1s.',
            'Mathematical Transformation: Replace every `0` with `-1`.',
            'Now the problem becomes: "Find the maximum length subarray with sum equal to 0"!',
            'Maintain a running sum: if the same `curr_sum` is seen at index `j` that was previously recorded at index `i`, the sum of elements between `i+1` and `j` MUST be exactly 0!',
            'Store the EARLIEST index of each prefix sum in a hash map to maximize subarray length.'
          ],
          keyRules: [
            'Transform 0 -> -1 so equal 0s and 1s cancel out to sum 0.',
            'Store ONLY the earliest index seen for each sum: do NOT overwrite it, to maximize window length (j - i).'
          ],
          codeSnippet: {
            id: 'dsa-snip-7-2',
            title: 'Contiguous Array Equal 0s and 1s',
            description: '0 to -1 reduction finding max subarray with sum 0',
            language: 'python',
            code: `def find_max_length(nums: list[int]) -> int:
    first_seen = {0: -1} # sum 0 seen at virtual index -1
    curr_sum = 0
    max_len = 0
    
    for idx, num in enumerate(nums):
        # Treat 0 as -1
        curr_sum += 1 if num == 1 else -1
        
        if curr_sum in first_seen:
            max_len = max(max_len, idx - first_seen[curr_sum])
        else:
            first_seen[curr_sum] = idx # store only first occurrence
            
    return max_len

print("Max length equal 0 and 1 in [0, 1, 0]:", find_max_length([0, 1, 0])) # 2 ([0, 1])`
          },
          pitfall: 'Overwriting `first_seen[curr_sum]` on subsequent occurrences: updating the index would shorten the distance and fail to find the maximum length.',
          quickCheck: {
            question: 'Why do we NOT update `first_seen[curr_sum]` when the sum has been seen previously?',
            options: ['Because hash maps cannot update values', 'To preserve the earliest index so the difference (current_index - earliest_index) is maximized', 'To prevent memory leaks', 'Because the sum resets to zero'],
            correctIndex: 1,
            explanation: 'Keeping the earliest index ensures that any future matching prefix sum calculates the longest possible distance.'
          }
        },
        {
          id: 'dsa-w1-d7-t3',
          topicNumber: 3,
          title: 'Subarray Sums Divisible by K (Modular Arithmetic Hash Map)',
          explanation: [
            'Problem: Find the number of non-empty subarrays with sum divisible by $K$.',
            'Modular Arithmetic Rule: If `prefix[j] % K == prefix[i - 1] % K`, then `(prefix[j] - prefix[i - 1]) % K == 0`.',
            'Therefore, two prefix sums with the exact same remainder modulo $K$ form a subarray divisible by $K$!',
            'Be careful with negative remainders: in Python `%` always returns non-negative values, but in C++/Java you must normalize `(rem % K + K) % K`.'
          ],
          keyRules: [
            'Normalize negative modulo: (sum % k + k) % k.',
            'Combinatorics: if a remainder appeared M times, it contributes M * (M - 1) // 2 pairs.'
          ],
          codeSnippet: {
            id: 'dsa-snip-7-3',
            title: 'Subarray Sums Divisible by K',
            description: 'Modular prefix sum remainder counting in O(N)',
            language: 'python',
            code: `from collections import defaultdict

def subarrays_div_by_k(nums: list[int], k: int) -> int:
    remainder_counts = defaultdict(int)
    remainder_counts[0] = 1
    curr_sum = 0
    count = 0
    
    for x in nums:
        curr_sum += x
        rem = curr_sum % k
        # In Python curr_sum % k is always in [0, k-1]
        count += remainder_counts[rem]
        remainder_counts[rem] += 1
        
    return count

print("Subarrays divisible by 5 in [4, 5, 0, -2, -3, 1]:", subarrays_div_by_k([4, 5, 0, -2, -3, 1], 5)) # 7`
          },
          pitfall: 'Negative modulo in C++: `-7 % 5` is `-2` instead of `3`. Always do `((sum % k) + k) % k`.',
          quickCheck: {
            question: 'Why do two identical prefix sum remainders (rem_A == rem_B) imply a subarray divisible by K?',
            options: ['Because K is a factor of both numbers', 'Because (prefix_B - prefix_A) mod K = (rem_B - rem_A) mod K = 0', 'Because all remainders are zero', 'By Fermat\'s Little Theorem'],
            correctIndex: 1,
            explanation: 'The difference between two values with the same remainder modulo K cancels out the remainder, leaving a multiple of K.'
          }
        },
        {
          id: 'dsa-w1-d7-t4',
          topicNumber: 4,
          title: 'Maximum Points You Can Obtain from Cards',
          explanation: [
            'There are several cards arranged in a row. In each step, you can take one card from the beginning or from the end of the row.',
            'You must take exactly $K$ cards. Find the maximum score you can achieve.',
            'Complementary Invariant Trick: Taking $K$ cards from the edges is mathematically equivalent to LEAVING a contiguous subarray of size $N - K$ with the MINIMAL possible sum in the middle!',
            '$\\text{Max Points} = \\text{Total Sum} - \\text{Minimum Subarray Sum of size } (N - K)$.',
            'Find minimum sum subarray of fixed size $N - K$ using sliding window in $O(N)$ time!'
          ],
          keyRules: [
            'Window size is fixed at N - K.',
            'Compute total_sum - min_window_sum.'
          ],
          codeSnippet: {
            id: 'dsa-snip-7-4',
            title: 'Complementary Window: Cards from Ends',
            description: 'Solving edge card problem by minimizing middle subarray',
            language: 'python',
            code: `def max_score(card_points: list[int], k: int) -> int:
    n = len(card_points)
    total_sum = sum(card_points)
    if k == n: return total_sum
    
    # We want to minimize middle subarray of size n - k
    window_size = n - k
    curr_sum = sum(card_points[:window_size])
    min_middle_sum = curr_sum
    
    for i in range(window_size, n):
        curr_sum += card_points[i] - card_points[i - window_size]
        min_middle_sum = min(min_middle_sum, curr_sum)
        
    return total_sum - min_middle_sum

print("Max score taking 3 cards:", max_score([1, 2, 3, 4, 5, 6, 1], 3)) # 12 ([5, 6, 1])`
          },
          pitfall: 'Using recursive backtracking (branching 2^K choices): for K=50, 2^50 operations will time out. Complementary sliding window solves it in O(N).',
          quickCheck: {
            question: 'What is the complementary perspective for taking K elements from the ends of an array?',
            options: ['Sorting the array', 'Finding the contiguous middle subarray of size N - K with the minimum sum', 'Taking the median elements', 'Using binary search on the answer'],
            correctIndex: 1,
            explanation: 'Removing K elements from the ends leaves a contiguous block of N - K elements in the middle. Maximizing the cards taken is equivalent to minimizing the remaining block.'
          }
        },
        {
          id: 'dsa-w1-d7-t5',
          topicNumber: 5,
          title: 'First Missing Positive (In-Place Cyclic Placement)',
          explanation: [
            'Problem: Given an unsorted integer array `nums`, return the smallest positive integer missing from the array in $O(N)$ time and $O(1)$ auxiliary space.',
            'Key Insight: For an array of size $N$, the first missing positive MUST fall in the range $[1 .. N + 1]$.',
            'Cyclic Placement Algorithm: Place each number $x$ in its natural bucket `nums[x - 1]`:',
            '- While `1 <= nums[i] <= N` and `nums[nums[i] - 1] != nums[i]`, swap `nums[i]` with `nums[nums[i] - 1]`.',
            'After placement, scan from $0$ to $N-1$: the first index where `nums[i] != i + 1` reveals the answer $i + 1$!'
          ],
          keyRules: [
            'Ignore non-positive numbers (<= 0) and numbers > N.',
            'Each swap places at least one number in its permanent slot, bounding total swaps to O(N).'
          ],
          codeSnippet: {
            id: 'dsa-snip-7-5',
            title: 'First Missing Positive in O(1) Space',
            description: 'In-place cyclic indexing placement',
            language: 'python',
            code: `def first_missing_positive(nums: list[int]) -> int:
    n = len(nums)
    
    for i in range(n):
        # Swap nums[i] into its correct index nums[i] - 1
        while 1 <= nums[i] <= n and nums[nums[i] - 1] != nums[i]:
            target_idx = nums[i] - 1
            nums[i], nums[target_idx] = nums[target_idx], nums[i]
            
    # Find the first mismatch
    for i in range(n):
        if nums[i] != i + 1:
            return i + 1
            
    return n + 1

print("First missing positive in [3, 4, -1, 1]:", first_missing_positive([3, 4, -1, 1])) # 2`
          },
          pitfall: 'Using `if` instead of `while` in the cyclic swap loop: swapping can bring in another valid number that also needs placement.',
          quickCheck: {
            question: 'What is the maximum possible value for the first missing positive in an array of size N?',
            options: ['N', 'N + 1', 'N^2', '2^N'],
            correctIndex: 1,
            explanation: 'If the array contains all numbers from 1 to N, the first missing positive is N + 1.'
          }
        },
        {
          id: 'dsa-w1-d7-t6',
          topicNumber: 6,
          title: 'Algorithmic Complexity Cheat Sheet & Trade-Off Matrix',
          explanation: [
            'Before any coding test or interview, align the given constraints with the required algorithmic pattern:',
            '- $N \\le 20$: Backtracking / Bitmask DP ($O(2^N)$ or $O(N!)$).',
            '- $N \\le 100$: All-pairs shortest path / 3D DP ($O(N^3)$).',
            '- $N \\le 2,000$: Nested loops, 2D DP ($O(N^2)$).',
            '- $N \\le 200,000$: Sorting, Divide & Conquer, Binary Search, Heaps, Sliding Window ($O(N \\log N)$ or $O(N)$).',
            '- $N \\le 10^9$: Binary search, math formulas ($O(\\log N)$ or $O(1)$).'
          ],
          keyRules: [
            'If N = 100,000, quadratic O(N^2) algorithms are guaranteed to fail with Time Limit Exceeded.',
            'Constraints provide the primary clue for the expected algorithm architecture.'
          ],
          codeSnippet: {
            id: 'dsa-snip-7-6',
            title: 'Complexity Constraint Analyzer',
            description: 'Mapping input constraint N to viable Big-O paradigms',
            language: 'python',
            code: `def recommend_algorithm(n: int) -> str:
    if n <= 20: return "Backtracking / Bitmask DP (O(2^N))"
    elif n <= 500: return "Floyd-Warshall / O(N^3) Matrix operations"
    elif n <= 5000: return "2D DP / Nested Two-Pointers (O(N^2))"
    elif n <= 200_000: return "Two Pointers, Sliding Window, Sorting, Monotonic Stack (O(N) or O(N log N))"
    else: return "Binary Search / Math Formula / Prefix Sum (O(log N) or O(1))"

print("Recommendation for N = 100,000:", recommend_algorithm(100_000))`
          },
          pitfall: 'Submitting an O(N^2) solution when N=100,000 hoping it passes: LeetCode and competitive programming platforms have strict 1-second timeout thresholds.',
          quickCheck: {
            question: 'What is the maximum practical Big-O complexity for an array of size N = 150,000 within a 1-second time limit?',
            options: ['O(N^2)', 'O(N log N) or O(N)', 'O(2^N)', 'O(N^3)'],
            correctIndex: 1,
            explanation: '150,000 log2(150,000) is approx 2.5 * 10^6 ops, executing in ~15 ms. O(N^2) would take 2.25 * 10^10 ops, exceeding the ~10^8 ops/sec limit by over 200x.'
          }
        },
        {
          id: 'dsa-w1-d7-t7',
          topicNumber: 7,
          title: 'Testing and Edge Case Defense Arsenal',
          explanation: [
            'Top-tier software engineers verify edge cases before running code:',
            '1. Empty input: `[]` or `""`.',
            '2. Single element: `[42]`.',
            '3. Two elements: `[1, 2]`.',
            '4. All duplicate elements: `[5, 5, 5, 5]`.',
            '5. Already sorted vs reverse sorted: `[1, 2, 3]` vs `[3, 2, 1]`.',
            '6. Extreme negative and positive numbers: `INT_MIN`, `INT_MAX`.',
            '7. Even vs Odd lengths.'
          ],
          keyRules: [
            'Test at least 3 edge cases mentally before considering code complete.',
            'Verify pointer boundary conditions (e.g. left < right vs left <= right).'
          ],
          codeSnippet: {
            id: 'dsa-snip-7-7',
            title: 'Edge Case Test Runner Template',
            description: 'Automated sanity suite for algorithmic functions',
            language: 'python',
            code: `def run_edge_cases(fn):
    test_cases = [
        ([], "Empty array"),
        ([1], "Single element"),
        ([1, 1, 1], "All identical"),
        ([1, 2, 3], "Already sorted"),
        ([3, 2, 1], "Reverse sorted"),
        ([-5, -2, -9], "All negative numbers")
    ]
    for case, desc in test_cases:
        try:
            res = fn(case.copy())
            print(f"PASS: {desc} -> Output: {res}")
        except Exception as e:
            print(f"FAIL: {desc} -> Threw {type(e).__name__}: {e}")

# Example runner
run_edge_cases(lambda arr: sum(arr) if arr else 0)`
          },
          pitfall: 'Assuming inputs will always conform to the happy path: edge cases account for >80% of real-world bugs and interview failed test cases.',
          quickCheck: {
            question: 'What is the most common cause of index out-of-range exceptions in two-pointer algorithms?',
            options: ['Allocating too much memory', 'Failing to check `left < right` inside inner while-loops that advance pointers', 'Using 64-bit integers', 'Iterating over hash maps'],
            correctIndex: 1,
            explanation: 'Inner while loops that increment left or decrement right without checking left < right will march off the ends of the array when all elements match.'
          }
        },
        {
          id: 'dsa-w1-d7-t8',
          topicNumber: 8,
          title: 'Week 1 Algorithmic Synthesis & Mastery Blueprint',
          explanation: [
            'Congratulations on completing Module 1 of the DSA Mastery Academy!',
            'You now possess a complete mastery of contiguous memory algorithms:',
            '- Asymptotic reasoning and Big-O upper/lower bounds.',
            '- Dynamic array resizing geometry and amortized analysis.',
            '- Two Pointers converging to eliminate quadratic search spaces.',
            '- Sliding Window tracking frequencies in linear time.',
            '- Binary Search halving search spaces over sorted data and monotonic answer domains.',
            '- Sorting mechanics, stability invariants, and QuickSelect.',
            '- Prefix sum transformations with modular and negative support.',
            'Next in Week 2: Linked Lists, Monotonic Stacks, Queues, Hash Tables & LRU Cache Design.'
          ],
          keyRules: [
            'Linear scans and logarithmic binary searches are your primary weapons.',
            'Contiguous arrays offer the highest cache-locality performance.'
          ],
          codeSnippet: {
            id: 'dsa-snip-7-8',
            title: 'Week 1 Graduation Synthesis',
            description: 'Summary of core patterns mastered in Week 1',
            language: 'python',
            code: `def print_week_1_summary():
    patterns = [
        "1. Asymptotic Complexity (Big-O, Omega, Theta, Master Theorem)",
        "2. Dynamic Arrays & In-Place Two Pointers",
        "3. Sliding Window (Fixed and Dynamic)",
        "4. Binary Search (Indices and Answer Domain)",
        "5. Sorting Mechanics, Stability & QuickSelect",
        "6. Prefix Sums & Hash Map Invariant Reductions"
    ]
    print("=== DSA MASTERY ACADEMY: MODULE 1 COMPLETE ===")
    for p in patterns:
        print(f" [V] {p}")
    print("\\nReady for Qualifying Exam!")

print_week_1_summary()`
          },
          pitfall: 'Neglecting to practice: algorithms are muscle memory. Write implementations from scratch without looking at notes to solidify mastery.',
          quickCheck: {
            question: 'Which algorithmic pattern achieves O(N) time for checking all contiguous subarrays when numbers may be negative?',
            options: ['Sliding Window', 'Prefix Sum with Hash Map', 'Binary Search', 'Bubble Sort'],
            correctIndex: 1,
            explanation: 'When numbers can be negative, sliding window monotonicity is broken; Prefix Sum with a Hash Map restores O(N) evaluation.'
          }
        }
      ]
    }
  ],
  quiz: {
    id: 'dsa-quiz-1',
    weekNumber: 1,
    title: 'Module 1 Qualifying Exam: Asymptotics, Pointers & Binary Search',
    description: 'Verify your mastery of Big-O complexity, two-pointer invariants, sliding windows, and binary search algorithms.',
    passingScorePercent: 80,
    questions: [
      {
        id: 'dsa-q1-1',
        question: 'What is the time complexity of a divide-and-conquer algorithm with recurrence T(N) = 2T(N/2) + O(N)?',
        options: ['O(N)', 'O(N log N)', 'O(N^2)', 'O(log N)'],
        correctIndex: 1,
        explanation: 'By the Master Theorem, with a=2, b=2, d=1: log_2(2) = 1 == d, which is Case 2 giving O(N^1 * log N) = O(N log N).'
      },
      {
        id: 'dsa-q1-2',
        question: 'Why is standard dynamic sliding window NOT applicable for finding subarrays with sum equal to K when elements can be negative?',
        options: [
          'Negative numbers cause syntax errors in Python',
          'Adding an element no longer guarantees an increase in window sum, breaking monotonic expansion/shrinkage logic',
          'Negative numbers cannot be stored in arrays',
          'Sliding window only works on strings'
        ],
        correctIndex: 1,
        explanation: 'Dynamic sliding window relies on monotonicity: expanding the right pointer must increase sum, and shrinking the left pointer must decrease sum. Negative numbers invalidate this invariant.'
      },
      {
        id: 'dsa-q1-3',
        question: 'What is the average time complexity of QuickSelect to find the Kth largest element in an unsorted array of size N?',
        options: ['O(1)', 'O(N)', 'O(N log N)', 'O(N^2)'],
        correctIndex: 1,
        explanation: 'QuickSelect only recurses into the partition containing the target index, yielding N + N/2 + N/4 + ... = O(N) average time.'
      },
      {
        id: 'dsa-q1-4',
        question: 'In Container With Most Water, why do we greedily advance the pointer pointing to the shorter vertical bar?',
        options: [
          'Because the shorter bar cannot be part of any larger area with reduced width',
          'To sort the heights',
          'Because the taller bar has more water',
          'Because left pointer must always advance'
        ],
        correctIndex: 0,
        explanation: 'The area is bounded by min(height[left], height[right]). Moving the taller bar reduces the width while height remains bottlenecked by the shorter bar, so area can never increase.'
      },
      {
        id: 'dsa-q1-5',
        question: 'In Subarray Sum Equals K using Prefix Sums and a Hash Map, why is prefix_counts[0] initialized to 1?',
        options: [
          'To avoid division by zero',
          'To correctly account for subarrays that sum to K starting from index 0 (where curr_sum - k == 0)',
          'To set the initial array size',
          'To indicate an empty list'
        ],
        correctIndex: 1,
        explanation: 'If a subarray from index 0 to j has sum equal to K, then curr_sum - k = 0. Having prefix_counts[0] = 1 ensures this subarray is counted.'
      }
    ]
  }
};
