import { WeekModule } from '../types/course';

export const DSA_WEEK_2_MODULE: WeekModule = {
  weekNumber: 2,
  title: 'Linear Structures: Linked Lists, Stacks, Queues & Hash Maps',
  theme: 'Pointer Chains, LIFO/FIFO Buffers, Monotonic Sequences & O(1) Key-Value Architecture',
  description:
    'Master non-contiguous memory structures and key-value indexing: singly and doubly linked lists, Floyd cycle detection, in-place reversals, monotonic stacks, sliding window maximum with monotonic deques, hash collision strategies, and production LRU Cache design.',
  conceptImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
  imageAlt: 'Linked data nodes, stacks and hash tables structural visualization',
  days: [
    {
      id: 'dsa-w2-d8',
      dayNumber: 8,
      weekNumber: 2,
      title: 'Singly & Doubly Linked Lists & Cycle Detection',
      subtitle: 'Node pointers, dummy head Sentinel pattern, fast & slow pointers & Floyd\'s cycle detection',
      durationMinutes: 70,
      overview:
        'Explore non-contiguous linear structures where elements are linked by pointers. Master node manipulation, eliminate boundary condition bugs with Dummy Sentinel Nodes, and implement Floyd\'s Tortoise and Hare Cycle Detection.',
      topics: [
        {
          id: 'dsa-w2-d8-t1',
          topicNumber: 1,
          title: 'Linked List Anatomy vs Dynamic Arrays',
          explanation: [
            'Unlike arrays, linked list elements (nodes) are scattered across heap memory, connected by pointers.',
            'Each node stores data and a `next` pointer (plus a `prev` pointer in doubly linked lists).',
            'Trade-offs:',
            '- Insertion/Deletion at known position: $O(1)$ pointer update (no shifting!).',
            '- Access by index: $O(N)$ sequential traversal (no random indexing!).',
            '- Cache locality: Poor (pointer hopping causes CPU cache misses).'
          ],
          keyRules: [
            'Inserting at head: O(1).',
            'Accessing index K: O(K) sequential traversal.',
            'Node memory overhead: extra 8 bytes per node for the next pointer on 64-bit systems.'
          ],
          codeSnippet: {
            id: 'dsa-snip-8-1',
            title: 'Singly Linked Node Definition & Insertion',
            description: 'Basic node class and O(1) head insertion',
            language: 'python',
            code: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def insert_at_head(head: ListNode, val: int) -> ListNode:
    new_node = ListNode(val, head)
    return new_node # new head

head = ListNode(10)
head = insert_at_head(head, 20)
head = insert_at_head(head, 30)

curr = head
while curr:
    print(curr.val, end=" -> ")
    curr = curr.next
print("None") # 30 -> 20 -> 10 -> None`
          },
          pitfall: 'Losing reference to the rest of the list: executing `node.next = new_node` before setting `new_node.next = node.next` drops the entire downstream chain in memory.',
          quickCheck: {
            question: 'What is the time complexity of inserting a node at the head of a singly linked list?',
            options: ['O(N)', 'O(1)', 'O(log N)', 'O(N^2)'],
            correctIndex: 1,
            explanation: 'Inserting at the head requires creating a new node, pointing its next to the old head, and updating the head pointer, taking O(1) time.'
          }
        },
        {
          id: 'dsa-w2-d8-t2',
          topicNumber: 2,
          title: 'The Sentinel (Dummy Head) Pattern',
          explanation: [
            'Deleting or inserting at the head of a linked list frequently requires messy edge-case code (`if head is None: ... elif head.val == target: ...`).',
            'The Dummy Head pattern creates a permanent placeholder node `dummy = ListNode(0, head)`.',
            'All operations are performed relative to `dummy.next`.',
            'At the end, simply return `dummy.next`. This guarantees that the head node is never treated as a special case!'
          ],
          keyRules: [
            'Always use a dummy head node when modifying linked lists that could alter the head.',
            'Return dummy.next at the end.'
          ],
          codeSnippet: {
            id: 'dsa-snip-8-2',
            title: 'Remove Linked List Elements using Dummy Sentinel',
            description: 'Eliminating all head edge cases with a dummy node',
            language: 'python',
            code: `def remove_elements(head: ListNode, val: int) -> ListNode:
    dummy = ListNode(0, head)
    curr = dummy
    
    while curr.next:
        if curr.next.val == val:
            curr.next = curr.next.next # bypass deleted node
        else:
            curr = curr.next
            
    return dummy.next

# Test list: 7 -> 7 -> 1 -> 7
node4 = ListNode(7)
node3 = ListNode(1, node4)
node2 = ListNode(7, node3)
node1 = ListNode(7, node2)

res = remove_elements(node1, 7)
print("After removing 7s:", res.val, "-> None") # 1 -> None`
          },
          pitfall: 'Advancing `curr = curr.next` after deleting a node: if the next node ALSO needs deletion (e.g. adjacent 7s), advancing will skip it!',
          quickCheck: {
            question: 'What is the main advantage of using a dummy sentinel node in linked list problems?',
            options: ['It reduces memory usage to zero', 'It eliminates special-case logic for inserting or deleting at the head of the list', 'It makes the list doubly linked', 'It reverses the list automatically'],
            correctIndex: 1,
            explanation: 'A dummy node ensures that every real node (including the original head) has a preceding predecessor node, unifying all deletion and insertion operations.'
          }
        },
        {
          id: 'dsa-w2-d8-t3',
          topicNumber: 3,
          title: 'Fast and Slow Pointers: Middle of the Linked List',
          explanation: [
            'Problem: Find the middle node of a singly linked list in a single pass without computing its length first.',
            'Use two pointers: `slow` and `fast`, both starting at `head`.',
            'In each step: `slow = slow.next` (moves 1 step), while `fast = fast.next.next` (moves 2 steps).',
            'When `fast` reaches the end of the list, `slow` is guaranteed to be at the exact middle node!'
          ],
          keyRules: [
            'Loop condition: while fast and fast.next: slow = slow.next; fast = fast.next.next.',
            'For even-length lists: slow stops at the second of the two middle nodes.'
          ],
          codeSnippet: {
            id: 'dsa-snip-8-3',
            title: 'Middle of the Linked List',
            description: 'Single-pass tortoise and hare middle finding',
            language: 'python',
            code: `def middle_node(head: ListNode) -> ListNode:
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow

# 1 -> 2 -> 3 -> 4 -> 5
n5 = ListNode(5)
n4 = ListNode(4, n5)
n3 = ListNode(3, n4)
n2 = ListNode(2, n3)
n1 = ListNode(1, n2)

mid = middle_node(n1)
print("Middle node value:", mid.val) # 3`
          },
          pitfall: 'Checking `while fast.next.next:` without verifying `fast` and `fast.next`: causes `AttributeError: NoneType has no attribute next`.',
          quickCheck: {
            question: 'Where will the slow pointer land in a list of 4 elements (1 -> 2 -> 3 -> 4) using `while fast and fast.next`?',
            options: ['Node 1', 'Node 2', 'Node 3', 'Node 4'],
            correctIndex: 2,
            explanation: 'Iteration 1: slow=2, fast=3. Iteration 2: slow=3, fast=None. Loop exits and returns node 3 (the second middle node).'
          }
        },
        {
          id: 'dsa-w2-d8-t4',
          topicNumber: 4,
          title: 'Floyd\'s Cycle Detection Algorithm (Tortoise and Hare)',
          explanation: [
            'Problem: Determine if a linked list has a cycle in $O(N)$ time and $O(1)$ auxiliary space.',
            'Using a hash set of visited nodes costs $O(N)$ memory.',
            'Floyd\'s Algorithm uses two pointers:',
            '- `slow` advances 1 step; `fast` advances 2 steps.',
            '- If there is no cycle, `fast` hits `None`.',
            '- If there IS a cycle, `fast` enters the loop and gains on `slow` by 1 node per iteration, eventually catching and meeting `slow`!'
          ],
          keyRules: [
            'Guaranteed O(1) space with no node mutation.',
            'Inside a loop of length C, fast will catch slow in at most C steps.'
          ],
          codeSnippet: {
            id: 'dsa-snip-8-4',
            title: 'Floyds Cycle Detection',
            description: 'O(1) memory cycle detection with two pointers',
            language: 'python',
            code: `def has_cycle(head: ListNode) -> bool:
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True # Cycle detected!
    return False

# Create cycle: 1 -> 2 -> 3 -> 4 -> points back to 2
a = ListNode(1)
b = ListNode(2)
c = ListNode(3)
d = ListNode(4)
a.next = b; b.next = c; c.next = d; d.next = b

print("Has cycle?", has_cycle(a)) # True`
          },
          pitfall: 'Comparing node values `slow.val == fast.val` instead of pointer references `slow == fast`: distinct nodes with identical values will trigger false positive cycle detections.',
          quickCheck: {
            question: 'What is the auxiliary space complexity of Floyds Cycle Detection algorithm?',
            options: ['O(N)', 'O(1)', 'O(log N)', 'O(C) where C is cycle length'],
            correctIndex: 1,
            explanation: 'The algorithm uses only two pointer references (slow and fast), requiring O(1) auxiliary space.'
          }
        },
        {
          id: 'dsa-w2-d8-t5',
          topicNumber: 5,
          title: 'Linked List Cycle II: Finding the Cycle Start Node',
          explanation: [
            'Problem: Find the exact node where the cycle begins in $O(1)$ space.',
            'Mathematical Proof:',
            'Let distance from head to cycle entrance = $L$.',
            'Let distance from entrance to meeting point = $K$.',
            'Let cycle length = $C$.',
            'Distance traveled by slow = $L + K$.',
            'Distance traveled by fast = $2(L + K) = L + K + mC \\implies L = mC - K$.',
            'Therefore, if you reset one pointer to `head` and advance both pointers 1 step at a time, they will meet PRECISELY at the cycle start!'
          ],
          keyRules: [
            'Phase 1: Find meeting point where slow == fast.',
            'Phase 2: Reset ptr1 = head, keep ptr2 = meeting point. Advance both by 1 step until they meet.'
          ],
          codeSnippet: {
            id: 'dsa-snip-8-5',
            title: 'Locating Cycle Entrance Node',
            description: 'Two-phase Floyd algorithm finding cycle start',
            language: 'python',
            code: `def detect_cycle_start(head: ListNode) -> ListNode:
    slow = fast = head
    has_loop = False
    
    # Phase 1: Detect cycle
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            has_loop = True
            break
            
    if not has_loop: return None
    
    # Phase 2: Find entrance
    ptr1 = head
    ptr2 = slow
    while ptr1 != ptr2:
        ptr1 = ptr1.next
        ptr2 = ptr2.next
        
    return ptr1 # cycle entrance node

print("Cycle start node value:", detect_cycle_start(a).val) # 2`
          },
          pitfall: 'Forgetting to return None when `has_loop` is false: entering Phase 2 without a cycle triggers infinite loop or null pointer exceptions.',
          quickCheck: {
            question: 'In Phase 2 of finding the cycle entrance, how many steps do ptr1 (from head) and ptr2 (from meeting point) take per iteration?',
            options: ['ptr1 takes 1 step, ptr2 takes 2 steps', 'Both take exactly 1 step', 'ptr1 takes 2 steps, ptr2 takes 1 step', 'Both take 2 steps'],
            correctIndex: 1,
            explanation: 'Both pointers move forward at the identical speed of 1 step per iteration until they collide at the cycle entry node.'
          }
        },
        {
          id: 'dsa-w2-d8-t6',
          topicNumber: 6,
          title: 'Intersection of Two Linked Lists',
          explanation: [
            'Problem: Find the node at which the intersection of two singly linked lists begins.',
            'The Two-Runner Pointer Alignment Trick:',
            'Pointer $A$ starts at `headA`; Pointer $B$ starts at `headB`.',
            'When $A$ reaches the end of list $A$, redirect it to `headB`.',
            'When $B$ reaches the end of list $B$, redirect it to `headA`.',
            'Both pointers traverse $(L_A + L_B)$ distance total, canceling the difference in length and colliding at the intersection node in $O(N + M)$ time and $O(1)$ space!'
          ],
          keyRules: [
            'If lists do not intersect, both pointers hit None simultaneously after two passes.',
            'Zero hash sets or length counting needed.'
          ],
          codeSnippet: {
            id: 'dsa-snip-8-6',
            title: 'Intersection of Two Linked Lists',
            description: 'Dual redirection two-pointer alignment in O(1) space',
            language: 'python',
            code: `def get_intersection_node(headA: ListNode, headB: ListNode) -> ListNode:
    if not headA or not headB: return None
    pA, pB = headA, headB
    
    while pA != pB:
        pA = pA.next if pA else headB
        pB = pB.next if pB else headA
        
    return pA # either intersection node or None

# List A: 1 -> 2 -> [8 -> 4 -> 5]
# List B: 3 -> [8 -> 4 -> 5]
shared = ListNode(8, ListNode(4, ListNode(5)))
headA = ListNode(1, ListNode(2, shared))
headB = ListNode(3, shared)

intersect = get_intersection_node(headA, headB)
print("Intersection node value:", intersect.val) # 8`
          },
          pitfall: 'Redirecting on `pA.next` instead of `pA`: redirecting when `pA is None` is essential so non-intersecting lists cleanly terminate at `None == None`.',
          quickCheck: {
            question: 'What happens in get_intersection_node when the two lists do not intersect at all?',
            options: ['An infinite loop occurs', 'Both pointers become None simultaneously and the function returns None', 'It raises an exception', 'It returns the head of list A'],
            correctIndex: 1,
            explanation: 'After traversing LenA + LenB steps, both pointers reach the end of the other list and equal None, exiting the loop gracefully.'
          }
        },
        {
          id: 'dsa-w2-d8-t7',
          topicNumber: 7,
          title: 'Remove Nth Node From End of List (One Pass)',
          explanation: [
            'Problem: Given a linked list, remove the $N$-th node from the end in a single pass.',
            'Use two pointers `fast` and `slow` separated by a gap of $N$ nodes:',
            '1. Initialize `dummy = ListNode(0, head)`.',
            '2. Advance `fast` $N + 1$ steps ahead.',
            '3. Advance both `fast` and `slow` together until `fast` is `None`.',
            '4. Now `slow.next` is precisely the target node to delete! Set `slow.next = slow.next.next`.'
          ],
          keyRules: [
            'Use a dummy node to seamlessly handle removing the head node.',
            'Maintain an exact (N + 1) gap between slow and fast.'
          ],
          codeSnippet: {
            id: 'dsa-snip-8-7',
            title: 'Remove Nth Node from End in One Pass',
            description: 'Fixed-gap two-pointer deletion in O(N) time',
            language: 'python',
            code: `def remove_nth_from_end(head: ListNode, n: int) -> ListNode:
    dummy = ListNode(0, head)
    fast = slow = dummy
    
    # Move fast N + 1 steps ahead
    for _ in range(n + 1):
        fast = fast.next
        
    # Advance both until fast hits None
    while fast:
        slow = slow.next
        fast = fast.next
        
    # Delete the target node
    slow.next = slow.next.next
    return dummy.next

# 1 -> 2 -> 3 -> 4 -> 5, remove 2nd from end (node 4)
n1 = ListNode(1, ListNode(2, ListNode(3, ListNode(4, ListNode(5)))))
new_h = remove_nth_from_end(n1, 2)

out = []
while new_h:
    out.append(new_h.val)
    new_h = new_h.next
print("After removing 2nd from end:", out) # [1, 2, 3, 5]`
          },
          pitfall: 'Not using a dummy node: deleting the head node (when N == length) causes null pointer errors when attempting to advance fast.',
          quickCheck: {
            question: 'Why does fast move N + 1 steps ahead before slow starts moving?',
            options: ['To reverse the list', 'So when fast hits None, slow stops directly at the node PRECEDING the node to be removed', 'Because arrays are 0-indexed', 'To count list size'],
            correctIndex: 1,
            explanation: 'To delete a node in a singly linked list, you need a pointer to the node before it; an N + 1 gap positions slow at that predecessor.'
          }
        },
        {
          id: 'dsa-w2-d8-t8',
          topicNumber: 8,
          title: 'Doubly Linked List Mechanics: O(1) Bidirectional Mutation',
          explanation: [
            'A Doubly Linked List node stores `val`, `next`, and `prev`.',
            'Given a reference to any node, it can be deleted in instantaneous $O(1)$ time without traversing from the head:',
            '`node.prev.next = node.next; node.next.prev = node.prev;`.',
            'By using Sentinel `head` and `tail` nodes, edge cases for empty lists and head/tail mutations are completely eliminated.',
            'Doubly linked lists are the foundational engine behind LRU Caches and OS process runqueues.'
          ],
          keyRules: [
            'Deletion of an arbitrary node given its pointer is strictly O(1).',
            'Always maintain Sentinel dummy head and dummy tail.'
          ],
          codeSnippet: {
            id: 'dsa-snip-8-8',
            title: 'Doubly Linked List with Sentinels',
            description: 'O(1) node insertion and removal',
            language: 'python',
            code: `class DNode:
    def __init__(self, key=0, val=0):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None

class DoublyLinkedList:
    def __init__(self):
        self.head = DNode()
        self.tail = DNode()
        self.head.next = self.tail
        self.tail.prev = self.head
        
    def add_to_head(self, node: DNode) -> None:
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node
        
    def remove_node(self, node: DNode) -> None:
        node.prev.next = node.next
        node.next.prev = node.prev

dll = DoublyLinkedList()
item = DNode(1, 100)
dll.add_to_head(item)
print("Added node 100, head.next value:", dll.head.next.val)
dll.remove_node(item)
print("Removed node, list is empty:", dll.head.next == dll.tail)`
          },
          pitfall: 'Omitting the `prev` pointer update: forgetting `node.next.prev = node.prev` corrupts backward traversals while forward traversal appears to work.',
          quickCheck: {
            question: 'What is the time complexity to delete a node in a Doubly Linked List given a direct pointer to that node?',
            options: ['O(N)', 'O(1)', 'O(log N)', 'O(N^2)'],
            correctIndex: 1,
            explanation: 'Because the node has direct pointers to both its predecessor and successor, unlinking it requires only updating those adjacent pointers in O(1) time.'
          }
        }
      ]
    },
    {
      id: 'dsa-w2-d9',
      dayNumber: 9,
      weekNumber: 2,
      title: 'Linked List Reversals, Merging & Reordering',
      subtitle: 'Iterative 3-pointer reversal, recursive reversal, reverse sublist [L..R], merge sorted lists & copy with random pointer',
      durationMinutes: 75,
      overview:
        'Master the most frequent linked list interview patterns. Conquer in-place pointer reversal, recursive reversal stack frames, sublist transformations, list merging, palindrome verification, and deep-copying graphs with random pointers.',
      topics: [
        {
          id: 'dsa-w2-d9-t1',
          topicNumber: 1,
          title: 'In-Place Linked List Reversal (Three-Pointer Pattern)',
          explanation: [
            'Reversing a singly linked list in-place in $O(N)$ time and $O(1)$ space requires maintaining three pointers:',
            '- `prev`: points to the reversed portion (initialized to `None`).',
            '- `curr`: points to the node currently being reversed (starts at `head`).',
            '- `nxt`: temporarily saves `curr.next` before overwriting the pointer.',
            'At each step: `nxt = curr.next; curr.next = prev; prev = curr; curr = nxt`.',
            'When `curr` is `None`, `prev` points to the new head.'
          ],
          keyRules: [
            'Always save curr.next BEFORE redirecting curr.next to prev.',
            'Returns prev as the new head.'
          ],
          codeSnippet: {
            id: 'dsa-snip-9-1',
            title: 'Iterative Three-Pointer List Reversal',
            description: 'O(N) time and O(1) space list reversal',
            language: 'python',
            code: `def reverse_list(head: ListNode) -> ListNode:
    prev = None
    curr = head
    
    while curr:
        nxt = curr.next # 1. save next
        curr.next = prev # 2. reverse pointer
        prev = curr      # 3. advance prev
        curr = nxt       # 4. advance curr
        
    return prev

h = ListNode(1, ListNode(2, ListNode(3, ListNode(4))))
rev = reverse_list(h)

vals = []
while rev:
    vals.append(rev.val)
    rev = rev.next
print("Reversed:", vals) # [4, 3, 2, 1]`
          },
          pitfall: 'Executing `curr.next = prev` without saving `curr.next`: severs the rest of the list, losing all subsequent nodes.',
          quickCheck: {
            question: 'What does the `prev` pointer point to after the while loop finishes in reverse_list?',
            options: ['None', 'The original head', 'The new head (last node of original list)', 'The middle node'],
            correctIndex: 2,
            explanation: 'When curr hits None, prev is pointing to the final node of the original list, which is the new head of the reversed list.'
          }
        },
        {
          id: 'dsa-w2-d9-t2',
          topicNumber: 2,
          title: 'Recursive Linked List Reversal',
          explanation: [
            'Recursive reversal delegates reversing the sublist `head.next` to the recursive call.',
            'Base case: if `head` is None or `head.next` is None, return `head`.',
            'Recursive step: `new_head = reverse_list(head.next)`.',
            'Re-link the adjacent node back to `head`: `head.next.next = head`.',
            'Sever the old forward link: `head.next = None`.',
            'Runs in $O(N)$ time with $O(N)$ auxiliary call stack space.'
          ],
          keyRules: [
            'head.next.next = head redirects the downstream node back to the current node.',
            'head.next = None severs cyclic loops.'
          ],
          codeSnippet: {
            id: 'dsa-snip-9-2',
            title: 'Recursive List Reversal',
            description: 'Call-stack driven reverse linking',
            language: 'python',
            code: `def reverse_list_recursive(head: ListNode) -> ListNode:
    if not head or not head.next:
        return head
        
    new_head = reverse_list_recursive(head.next)
    head.next.next = head # reverse link
    head.next = None      # break cycle
    return new_head

h = ListNode(10, ListNode(20, ListNode(30)))
res = reverse_list_recursive(h)
print("New head value:", res.val) # 30`
          },
          pitfall: 'Forgetting `head.next = None`: creates an infinite cycle between the first two nodes of the list (`1 <-> 2`).',
          quickCheck: {
            question: 'What is the auxiliary space complexity of recursive linked list reversal?',
            options: ['O(1)', 'O(N)', 'O(log N)', 'O(N^2)'],
            correctIndex: 1,
            explanation: 'Each node adds a frame to the execution call stack, consuming O(N) auxiliary stack memory.'
          }
        },
        {
          id: 'dsa-w2-d9-t3',
          topicNumber: 3,
          title: 'Reverse Linked List II (Reversing Sublist [Left .. Right])',
          explanation: [
            'Problem: Reverse only the portion of the list from position `left` to position `right` in a single pass.',
            '1. Create `dummy = ListNode(0, head)`.',
            '2. Advance `pre` pointer to `left - 1` position.',
            '3. Set `curr = pre.next`.',
            '4. In a loop running `right - left` times, pull `curr.next` to the front of the sublist using the "Head Insertion" trick:',
            '   `nxt = curr.next; curr.next = nxt.next; nxt.next = pre.next; pre.next = nxt;`.',
            'Achieves in-place sublist reversal in $O(N)$ time and $O(1)$ space.'
          ],
          keyRules: [
            'pre pointer remains fixed at left - 1 position.',
            'curr remains fixed as the tail of the reversed sublist, moving downstream nodes forward.'
          ],
          codeSnippet: {
            id: 'dsa-snip-9-3',
            title: 'Reverse Sublist in One Pass',
            description: 'In-place front-pulling reversal for range [left, right]',
            language: 'python',
            code: `def reverse_between(head: ListNode, left: int, right: int) -> ListNode:
    if not head or left == right: return head
    dummy = ListNode(0, head)
    pre = dummy
    
    for _ in range(left - 1):
        pre = pre.next
        
    curr = pre.next
    for _ in range(right - left):
        nxt = curr.next
        curr.next = nxt.next
        nxt.next = pre.next
        pre.next = nxt
        
    return dummy.next

# 1 -> 2 -> 3 -> 4 -> 5, reverse [2..4]
h = ListNode(1, ListNode(2, ListNode(3, ListNode(4, ListNode(5)))))
res = reverse_between(h, 2, 4)

out = []
while res: out.append(res.val); res = res.next
print("Reversed [2..4]:", out) # [1, 4, 3, 2, 5]`
          },
          pitfall: 'Attempting to reverse by creating a separate disconnected sublist: re-stitching the disconnected sublist back into the parent list requires complex edge case checks.',
          quickCheck: {
            question: 'How many pointer adjustments are executed per node in the front-pulling sublist reversal?',
            options: ['1', '4', 'N', 'log N'],
            correctIndex: 1,
            explanation: 'Each step executes 4 pointer assignments: saving nxt, updating curr.next, connecting nxt.next, and advancing pre.next.'
          }
        },
        {
          id: 'dsa-w2-d9-t4',
          topicNumber: 4,
          title: 'Merge Two Sorted Lists',
          explanation: [
            'Problem: Merge two sorted linked lists into one sorted linked list in $O(N + M)$ time and $O(1)$ auxiliary space.',
            'Use a `dummy` sentinel node and a `tail` pointer.',
            'While both `l1` and `l2` are non-null:',
            '- Attach the smaller node: `if l1.val <= l2.val: tail.next = l1; l1 = l1.next; else: tail.next = l2; l2 = l2.next`.',
            '- Advance `tail = tail.next`.',
            'Splice the remaining non-null list directly: `tail.next = l1 or l2`.'
          ],
          keyRules: [
            'No new nodes are allocated: pointers are rewired in place.',
            'Attach remaining non-null chain with a single assignment: tail.next = l1 or l2.'
          ],
          codeSnippet: {
            id: 'dsa-snip-9-4',
            title: 'Merge Two Sorted Lists',
            description: 'In-place pointer rewiring in O(N + M)',
            language: 'python',
            code: `def merge_two_lists(l1: ListNode, l2: ListNode) -> ListNode:
    dummy = ListNode(0)
    tail = dummy
    
    while l1 and l2:
        if l1.val <= l2.val:
            tail.next = l1
            l1 = l1.next
        else:
            tail.next = l2
            l2 = l2.next
        tail = tail.next
        
    tail.next = l1 if l1 else l2
    return dummy.next

a = ListNode(1, ListNode(2, ListNode(4)))
b = ListNode(1, ListNode(3, ListNode(4)))
merged = merge_two_lists(a, b)

out = []
while merged: out.append(merged.val); merged = merged.next
print("Merged list:", out) # [1, 1, 2, 3, 4, 4]`
          },
          pitfall: 'Iterating through the remainder of the non-null list node-by-node: unnecessary! Because the remaining list is already sorted, a single assignment `tail.next = l1 or l2` links all remaining nodes in O(1).',
          quickCheck: {
            question: 'What is the auxiliary space complexity of merge_two_lists when splicing nodes in place?',
            options: ['O(N + M)', 'O(1)', 'O(log(N + M))', 'O(N)'],
            correctIndex: 1,
            explanation: 'The algorithm reuses existing list nodes by rewiring their next pointers, requiring only O(1) auxiliary pointer memory.'
          }
        },
        {
          id: 'dsa-w2-d9-t5',
          topicNumber: 5,
          title: 'Merge K Sorted Lists: Divide-and-Conquer vs Priority Queue',
          explanation: [
            'Given $K$ sorted linked lists with total $N$ elements across all lists.',
            'Approach 1: Min-Heap of size $K$. Push the heads of all $K$ lists into the heap. Pop the minimum node and push its `next`. Time: $O(N \\log K)$, Space: $O(K)$.',
            'Approach 2: Divide and Conquer. Pairwise merge lists like Merge Sort (`lists[0]` with `lists[1]`, `lists[2]` with `lists[3]`, etc.). Time: $O(N \\log K)$, Space: $O(1)$ iterative!',
            'Both achieve the optimal asymptotic bound $O(N \\log K)$.'
          ],
          keyRules: [
            'Divide and conquer merges pairs iteratively, using O(1) auxiliary memory.',
            'Heap approach requires O(K) space for heap nodes.'
          ],
          codeSnippet: {
            id: 'dsa-snip-9-5',
            title: 'Divide-and-Conquer Merge K Lists',
            description: 'Pairwise merging in O(N log K) time and O(1) space',
            language: 'python',
            code: `def merge_k_lists(lists: list[ListNode]) -> ListNode:
    if not lists: return None
    
    interval = 1
    amount = len(lists)
    while interval < amount:
        for i in range(0, amount - interval, interval * 2):
            lists[i] = merge_two_lists(lists[i], lists[i + interval])
        interval *= 2
        
    return lists[0]`
          },
          pitfall: 'Merging lists sequentially one-by-one: `merged = merge(merged, list[i])` results in $O(N \\times K)$ time complexity, which will time out for large $K$.',
          quickCheck: {
            question: 'What is the time complexity of merging K sorted lists containing N total elements using Divide-and-Conquer?',
            options: ['O(N * K)', 'O(N log K)', 'O(K log N)', 'O(N)'],
            correctIndex: 1,
            explanation: 'There are log2(K) pairwise merge rounds, and each round processes all N elements, yielding O(N log K) total time.'
          }
        },
        {
          id: 'dsa-w2-d9-t6',
          topicNumber: 6,
          title: 'Palindrome Linked List (O(N) Time, O(1) Space)',
          explanation: [
            'Problem: Check if a singly linked list is a palindrome in $O(N)$ time and $O(1)$ auxiliary space.',
            'Three-Step Algorithmic Pipeline:',
            '1. Find the middle node using fast and slow pointers.',
            '2. Reverse the second half of the linked list in place.',
            '3. Compare values of first half and reversed second half. If identical, it is a palindrome!',
            '(Optional: reverse second half back to restore original structure).'
          ],
          keyRules: [
            'O(1) space requires in-place half-reversal.',
            'Slow and fast pointers cleanly split odd and even lists.'
          ],
          codeSnippet: {
            id: 'dsa-snip-9-6',
            title: 'In-Place Palindrome Linked List',
            description: 'Half-list reversal comparison in O(1) space',
            language: 'python',
            code: `def is_palindrome_list(head: ListNode) -> bool:
    if not head or not head.next: return True
    
    # 1. Find middle
    slow = fast = head
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next
        
    # 2. Reverse second half
    prev = None
    curr = slow.next
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
        
    # 3. Compare halves
    p1 = head
    p2 = prev
    is_palin = True
    while p2:
        if p1.val != p2.val:
            is_palin = False
            break
        p1 = p1.next
        p2 = p2.next
        
    return is_palin

p = ListNode(1, ListNode(2, ListNode(2, ListNode(1))))
print("Is palindrome list:", is_palindrome_list(p)) # True`
          },
          pitfall: 'Copying list values into a Python list: while easy `vals == vals[::-1]`, it uses O(N) memory, failing the O(1) space requirement.',
          quickCheck: {
            question: 'How does the optimal Palindrome Linked List algorithm achieve O(1) auxiliary space?',
            options: ['By using recursion', 'By reversing the second half of the list in place and comparing it against the first half', 'By converting numbers to strings', 'By using a hash set'],
            correctIndex: 1,
            explanation: 'Reversing the second half in place requires only pointer manipulation (O(1) memory) before comparing.'
          }
        },
        {
          id: 'dsa-w2-d9-t7',
          topicNumber: 7,
          title: 'Reorder List (L0 → Ln → L1 → Ln-1 ...)',
          explanation: [
            'Problem: Given `L0 -> L1 -> ... -> Ln-1 -> Ln`, reorder it to `L0 -> Ln -> L1 -> Ln-1 -> L2 -> Ln-2 ...` in place.',
            'Composed of three modular primitives:',
            '1. Find the middle node (`slow/fast`). Cut the list in half (`slow.next = None`).',
            '2. Reverse the second half (`prev = reverse_list(second_half)`).',
            '3. Interleave/Zip the two lists together alternately (`l1.next = l2; l2.next = next_l1`).'
          ],
          keyRules: [
            'Must cut the first half: slow.next = None before reversing.',
            'Runs in O(N) time with O(1) space.'
          ],
          codeSnippet: {
            id: 'dsa-snip-9-7',
            title: 'Reorder List In-Place Interleaving',
            description: 'Split, reverse, and interleave in O(1) space',
            language: 'python',
            code: `def reorder_list(head: ListNode) -> None:
    if not head or not head.next: return
    
    # 1. Split in half
    slow = fast = head
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next
    second = slow.next
    slow.next = None
    
    # 2. Reverse second half
    prev = None
    curr = second
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    second = prev
    
    # 3. Interleave
    first = head
    while second:
        tmp1, tmp2 = first.next, second.next
        first.next = second
        second.next = tmp1
        first, second = tmp1, tmp2

h = ListNode(1, ListNode(2, ListNode(3, ListNode(4))))
reorder_list(h)
out = []
while h: out.append(h.val); h = h.next
print("Reordered list:", out) # [1, 4, 2, 3]`
          },
          pitfall: 'Forgetting to sever `slow.next = None`: leaves a cycle connecting the middle of the first half to the second half.',
          quickCheck: {
            question: 'What are the three steps required to reorder a linked list in O(1) space?',
            options: ['Sort, Reverse, Print', 'Find middle and split, reverse second half, interleave nodes', 'Copy to array, sort, copy back', 'Add dummy node, reverse entire list, delete duplicates'],
            correctIndex: 1,
            explanation: 'The problem decomposes into finding the midpoint, reversing the back half, and alternating node connections between the two sublists.'
          }
        },
        {
          id: 'dsa-w2-d9-t8',
          topicNumber: 8,
          title: 'Copy List with Random Pointer: Interweaving vs Hash Map',
          explanation: [
            'Each node contains `val`, `next`, and a `random` pointer which could point to any node or `None`. Construct a deep copy.',
            '- **Hash Map Approach**: Map `old_node -> new_node`. Space: $O(N)$.',
            '- **O(1) Auxiliary Space Interweaving Trick**:',
            '  1. Clone each node and insert it directly adjacent to the original: `A -> A\' -> B -> B\' -> C -> C\'`.',
            '  2. Assign random pointers: `curr.next.random = curr.random.next` (if `curr.random` exists).',
            '  3. Unweave the lists to restore original and extract cloned copy in $O(1)$ space!'
          ],
          keyRules: [
            'Interweaving stores the mapping in the nodes next pointers directly.',
            'Restore original list next pointers during separation.'
          ],
          codeSnippet: {
            id: 'dsa-snip-9-8',
            title: 'Copy List with Random Pointer (O(1) Space)',
            description: 'Three-pass interweaving deep copy',
            language: 'python',
            code: `class RandomNode:
    def __init__(self, val=0, next=None, random=None):
        self.val = val
        self.next = next
        self.random = random

def copy_random_list(head: RandomNode) -> RandomNode:
    if not head: return None
    
    # 1. Interweave clone nodes: A -> A' -> B -> B'
    curr = head
    while curr:
        nxt = curr.next
        curr.next = RandomNode(curr.val, nxt)
        curr = nxt
        
    # 2. Copy random pointers
    curr = head
    while curr:
        if curr.random:
            curr.next.random = curr.random.next
        curr = curr.next.next
        
    # 3. Unweave lists
    curr = head
    clone_head = head.next
    while curr:
        clone = curr.next
        curr.next = clone.next
        clone.next = clone.next.next if clone.next else None
        curr = curr.next
        
    return clone_head`
          },
          pitfall: 'Failing to restore the original list: interviewers verify that the input linked list remains completely intact after the function returns.',
          quickCheck: {
            question: 'How does the interweaving algorithm assign the random pointer for a cloned node A\'?',
            options: ['A\'.random = A.random', 'A\'.random = A.random.next', 'A\'.random = None', 'A\'.random = A'],
            correctIndex: 1,
            explanation: 'Because each original node X is immediately followed by its clone X\', the clone of A.random is precisely A.random.next.'
          }
        }
      ]
    },
    {
      id: 'dsa-w2-d10',
      dayNumber: 10,
      weekNumber: 2,
      title: 'Stacks: LIFO Mechanics & Monotonic Stack Pattern',
      subtitle: 'LIFO arrays, parenthesis parsing, Reverse Polish Notation, Min Stack in O(1) & Next Greater Element',
      durationMinutes: 75,
      overview:
        'Understand the Last-In First-Out (LIFO) execution model. Build stack primitives, parse nested expressions, evaluate postfix notation, design an O(1) Min Stack, and master the Monotonic Decreasing/Increasing Stack pattern for Next Greater Element.',
      topics: [
        {
          id: 'dsa-w2-d10-t1',
          topicNumber: 1,
          title: 'The LIFO Execution Model & Array Stack',
          explanation: [
            'A Stack enforces Last-In, First-Out (LIFO) access.',
            'Operations:',
            '- `push(x)`: Append element to top in $O(1)$ amortized.',
            '- `pop()`: Remove top element in $O(1)$.',
            '- `peek()` / `top()`: Inspect top element in $O(1)$.',
            '- `is_empty()`: Check if size is 0 in $O(1)$.',
            'Stacks naturally model execution context, undo history, DFS traversals, and parenthesis nesting.'
          ],
          keyRules: [
            'All primary operations (push, pop, peek) are strictly O(1).',
            'Dynamic array backend provides top CPU cache locality.'
          ],
          codeSnippet: {
            id: 'dsa-snip-10-1',
            title: 'Stack Implementation via Dynamic Array',
            description: 'Standard O(1) operations with bounds checks',
            language: 'python',
            code: `class ArrayStack:
    def __init__(self):
        self._data = []
        
    def push(self, val):
        self._data.append(val)
        
    def pop(self):
        if self.is_empty(): raise IndexError("pop from empty stack")
        return self._data.pop()
        
    def peek(self):
        if self.is_empty(): raise IndexError("peek from empty stack")
        return self._data[-1]
        
    def is_empty(self) -> bool:
        return len(self._data) == 0

s = ArrayStack()
s.push(10); s.push(20); s.push(30)
print("Top:", s.peek()) # 30
print("Popped:", s.pop()) # 30
print("New Top:", s.peek()) # 20`
          },
          pitfall: 'Calling `pop()` on an empty stack: always verify `not stack` before popping to prevent `IndexError`.',
          quickCheck: {
            question: 'What is the time complexity of push and pop in an array-backed stack?',
            options: ['O(N)', 'O(1) amortized', 'O(log N)', 'O(N^2)'],
            correctIndex: 1,
            explanation: 'Push and pop operate exclusively on the tail of the array, executing in O(1) amortized time.'
          }
        },
        {
          id: 'dsa-w2-d10-t2',
          topicNumber: 2,
          title: 'Valid Parentheses: Matching Nested Brackets',
          explanation: [
            'Problem: Given a string containing `()[]{}` determine if the input string is valid.',
            'A string is valid if open brackets are closed by the same type of brackets in the correct order.',
            'Algorithm:',
            '1. Maintain a stack of expected closing brackets.',
            '2. When an opening bracket is seen, push its matching closing bracket onto the stack.',
            '3. When a closing bracket is seen, pop from stack: if stack is empty or popped bracket does not match, return `False`.',
            '4. Return `len(stack) == 0` at the end.'
          ],
          keyRules: [
            'Map opening brackets to their closing counterpart: `mapping = {"(": ")", "{": "}", "[": "]"}`.',
            'Stack must be completely empty at the end for the string to be valid.'
          ],
          codeSnippet: {
            id: 'dsa-snip-10-2',
            title: 'Valid Parentheses Parser',
            description: 'Stack validation of matching bracket pairs in O(N)',
            language: 'python',
            code: `def is_valid_parentheses(s: str) -> bool:
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    
    for char in s:
        if char in mapping: # closing bracket
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                return False
        else: # opening bracket
            stack.append(char)
            
    return len(stack) == 0

print("Is '()[]{}' valid?", is_valid_parentheses("()[]{}")) # True
print("Is '(]' valid?", is_valid_parentheses("(]"))         # False`
          },
          pitfall: 'Forgetting to check if the stack is empty at the end: string `"((("` has matching opening brackets but no closing brackets; `len(stack) == 0` catches this.',
          quickCheck: {
            question: 'Why does the string "(((" fail the valid parentheses check?',
            options: ['It contains invalid characters', 'Stack is not empty at the end (unclosed opening brackets)', 'It causes a syntax error', 'It exceeds string length'],
            correctIndex: 1,
            explanation: 'The stack still contains three unclosed opening brackets when iteration finishes, so len(stack) == 0 evaluates to False.'
          }
        },
        {
          id: 'dsa-w2-d10-t3',
          topicNumber: 3,
          title: 'Min Stack: O(1) Minimum Retrieval',
          explanation: [
            'Problem: Design a stack that supports `push`, `pop`, `top`, and retrieving the minimum element `getMin()` in $O(1)$ time.',
            'Approach 1: Two parallel stacks: the main stack and a `min_stack` where `min_stack[-1]` stores the minimum value seen so far.',
            'Approach 2: Single stack storing pairs `(val, current_min)`.',
            'Because elements are removed in reverse order of insertion, tracking the minimum alongside each node ensures that when a minimum element is popped, the previous minimum is immediately revealed in $O(1)$!'
          ],
          keyRules: [
            'All operations (including getMin) run in strictly O(1) time.',
            'Memory is O(N) auxiliary space.'
          ],
          codeSnippet: {
            id: 'dsa-snip-10-3',
            title: 'Min Stack Implementation',
            description: 'Dual stack maintaining running minimum in O(1)',
            language: 'python',
            code: `class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []
        
    def push(self, val: int) -> None:
        self.stack.append(val)
        curr_min = min(val, self.min_stack[-1] if self.min_stack else val)
        self.min_stack.append(curr_min)
        
    def pop(self) -> None:
        self.stack.pop()
        self.min_stack.pop()
        
    def top(self) -> int:
        return self.stack[-1]
        
    def getMin(self) -> int:
        return self.min_stack[-1]

ms = MinStack()
ms.push(-2); ms.push(0); ms.push(-3)
print("Min:", ms.getMin()) # -3
ms.pop()
print("Top:", ms.top())    # 0
print("Min:", ms.getMin()) # -2`
          },
          pitfall: 'Only pushing to min_stack when `val < current_min`: if duplicate minimums exist and you pop one, you prematurely discard the active minimum.',
          quickCheck: {
            question: 'What is the time complexity of getMin() in MinStack?',
            options: ['O(N)', 'O(log N)', 'O(1)', 'O(N^2)'],
            correctIndex: 2,
            explanation: 'The minimum element is stored directly at the top of min_stack, allowing O(1) immediate lookup.'
          }
        },
        {
          id: 'dsa-w2-d10-t4',
          topicNumber: 4,
          title: 'Evaluate Reverse Polish Notation (Postfix Evaluation)',
          explanation: [
            'Reverse Polish Notation (RPN) is postfix expression format: `["2", "1", "+", "3", "*"]` equals `(2 + 1) * 3 = 9`.',
            'No parentheses are needed because operator precedence is unambiguous.',
            'Algorithm:',
            '- Iterate through tokens.',
            '- If token is a number: push onto stack.',
            '- If token is an operator (`+ - * /`): pop operand $b$, pop operand $a$, compute $a \\text{ op } b$, and push result back onto stack.',
            'Note: In division, truncate towards zero: `int(a / b)` in Python.'
          ],
          keyRules: [
            'Order matters: for subtraction and division, first popped is the right operand (b), second popped is left operand (a). Compute (a - b) and (a / b).',
            'Python // does floor division (towards -inf); use int(a / b) for truncation towards 0.'
          ],
          codeSnippet: {
            id: 'dsa-snip-10-4',
            title: 'Evaluate Reverse Polish Notation',
            description: 'Stack-based postfix arithmetic evaluator',
            language: 'python',
            code: `def eval_rpn(tokens: list[str]) -> int:
    stack = []
    
    for token in tokens:
        if token in {"+", "-", "*", "/"}:
            b = stack.pop()
            a = stack.pop()
            if token == "+": stack.append(a + b)
            elif token == "-": stack.append(a - b)
            elif token == "*": stack.append(a * b)
            else: stack.append(int(a / b)) # truncate toward zero
        else:
            stack.append(int(token))
            
    return stack[0]

print("RPN Result:", eval_rpn(["2", "1", "+", "3", "*"])) # 9`
          },
          pitfall: 'Reversing operand order `stack.append(b - a)`: subtraction and division are non-commutative, causing incorrect negative answers.',
          quickCheck: {
            question: 'When an operator is encountered in RPN evaluation, in what order are the operands popped?',
            options: ['Left operand first, right operand second', 'Right operand first, left operand second', 'Both simultaneously', 'Random order'],
            correctIndex: 1,
            explanation: 'Because stacks are LIFO, the second operand written (right operand) was pushed last and is therefore popped first.'
          }
        },
        {
          id: 'dsa-w2-d10-t5',
          topicNumber: 5,
          title: 'The Monotonic Stack Paradigm: Next Greater Element',
          explanation: [
            'A Monotonic Stack maintains its elements in strictly sorted order (either strictly increasing or strictly decreasing).',
            'Pattern: Finding the "Next Greater Element" to the right for every array index in $O(N)$ time (brute force is $O(N^2)$).',
            'Monotonic Decreasing Stack:',
            '- Scan array from left to right.',
            '- While stack is non-empty and `nums[i] > nums[stack[-1]]`: the next greater element for `stack[-1]` IS `nums[i]`! Pop and record.',
            '- Push index `i` onto stack.'
          ],
          keyRules: [
            'Store INDICES on the stack (not just values) so you can update the result array at the corresponding positions.',
            'Each index is pushed once and popped at most once, guaranteeing strict O(N) runtime.'
          ],
          codeSnippet: {
            id: 'dsa-snip-10-5',
            title: 'Next Greater Element via Monotonic Stack',
            description: 'Linear O(N) calculation of next greater values',
            language: 'python',
            code: `def next_greater_element(nums: list[int]) -> list[int]:
    n = len(nums)
    res = [-1] * n
    stack = [] # stores indices
    
    for i in range(n):
        # While current element is greater than element at top of stack
        while stack and nums[i] > nums[stack[-1]]:
            idx = stack.pop()
            res[idx] = nums[i]
        stack.append(i)
        
    return res

print("Next Greater:", next_greater_element([2, 1, 2, 4, 3])) # [4, 2, 4, -1, -1]`
          },
          pitfall: 'Assuming the while loop makes it O(N^2): every index is pushed onto the stack exactly once and popped at most once. Amortized operations are strictly $\\le 2N = O(N)$.',
          quickCheck: {
            question: 'What is the time complexity of Next Greater Element using a monotonic stack on an array of size N?',
            options: ['O(N^2)', 'O(N log N)', 'O(N)', 'O(1)'],
            correctIndex: 2,
            explanation: 'Each element enters the stack once and leaves the stack at most once, bounding total operations to 2N = O(N).'
          }
        },
        {
          id: 'dsa-w2-d10-t6',
          topicNumber: 6,
          title: 'Daily Temperatures (Distance to Warmer Day)',
          explanation: [
            'Problem: Given an array of integers `temperatures`, return an array `answer` such that `answer[i]` is the number of days you have to wait after the $i$-th day to get a warmer temperature.',
            'This is a direct application of Monotonic Decreasing Stack tracking indices.',
            'When `temperatures[curr_day] > temperatures[stack[-1]]`:',
            '- `prev_day = stack.pop()`',
            '- `answer[prev_day] = curr_day - prev_day` (distance in days!).'
          ],
          keyRules: [
            'Wait distance is (current_index - popped_index).',
            'Indices remaining on stack at the end have no warmer day (default 0).'
          ],
          codeSnippet: {
            id: 'dsa-snip-10-6',
            title: 'Daily Temperatures Stack Solution',
            description: 'Calculating wait days to next warmer temperature in O(N)',
            language: 'python',
            code: `def daily_temperatures(temperatures: list[int]) -> list[int]:
    n = len(temperatures)
    res = [0] * n
    stack = [] # indices of unresolved colder days
    
    for curr_idx, temp in enumerate(temperatures):
        while stack and temp > temperatures[stack[-1]]:
            prev_idx = stack.pop()
            res[prev_idx] = curr_idx - prev_idx
        stack.append(curr_idx)
        
    return res

temps = [73, 74, 75, 71, 69, 72, 76, 73]
print("Days to warmer temp:", daily_temperatures(temps)) # [1, 1, 4, 2, 1, 1, 0, 0]`
          },
          pitfall: 'Storing temperature values instead of indices in the stack: you cannot calculate day distance `curr_idx - prev_idx` without storing the index.',
          quickCheck: {
            question: 'What do the indices remaining on the stack represent after daily_temperatures finishes scanning?',
            options: ['Days with freezing temperatures', 'Days that never experience a warmer future temperature', 'The hottest day of the year', 'Corrupted inputs'],
            correctIndex: 1,
            explanation: 'Any day left on the stack was never popped by a warmer future day, meaning its wait days remain 0.'
          }
        },
        {
          id: 'dsa-w2-d10-t7',
          topicNumber: 7,
          title: 'Next Greater Element II (Circular Array Traversal)',
          explanation: [
            'Problem: Find the next greater element in a circular array (the next element after the last element is the first element).',
            'Algorithmic Pattern: Virtual Array Doubling.',
            'Instead of physically copying the array to double size ($O(2N)$ space), iterate through range `2 * N - 1` and use modulo indexing `i % N`!',
            'Perform standard monotonic decreasing stack operations in $O(N)$ time and $O(N)$ space.'
          ],
          keyRules: [
            'Loop for 2 * N iterations.',
            'Access array element via `nums[i % n]`.',
            'Push onto stack only during the first pass (i < n).'
          ],
          codeSnippet: {
            id: 'dsa-snip-10-7',
            title: 'Circular Next Greater Element',
            description: 'Virtual doubling with modulo indexing',
            language: 'python',
            code: `def next_greater_elements_circular(nums: list[int]) -> list[int]:
    n = len(nums)
    res = [-1] * n
    stack = []
    
    # Iterate twice through array virtually
    for i in range(2 * n):
        idx = i % n
        while stack and nums[idx] > nums[stack[-1]]:
            popped = stack.pop()
            res[popped] = nums[idx]
        if i < n:
            stack.append(idx)
            
    return res

print("Circular Next Greater in [1, 2, 1]:", next_greater_elements_circular([1, 2, 1])) # [2, -1, 2]`
          },
          pitfall: 'Pushing elements during the second pass (`i >= n`): pushes duplicate indices, corrupting result indices.',
          quickCheck: {
            question: 'Why do we iterate through 2 * N elements in Circular Next Greater Element?',
            options: ['To sort the array twice', 'To allow elements near the end of the array to wrap around and inspect elements at the beginning', 'Because circular arrays have double capacity', 'To prevent stack overflow'],
            correctIndex: 1,
            explanation: 'Traversing 2N steps simulates wrapping around the circular array once, giving every element a chance to see elements before it.'
          }
        },
        {
          id: 'dsa-w2-d10-t8',
          topicNumber: 8,
          title: 'Asteroid Collision: Stack Destruction Simulation',
          explanation: [
            'Given an array of integers representing asteroids in a row.',
            'Absolute value = size. Sign = direction (`+` moves right, `-` moves left).',
            'Asteroids moving in the same direction or moving apart never collide.',
            'Collision occurs ONLY when top of stack is moving right (`> 0`) and current asteroid is moving left (`< 0`).',
            'Use a stack to simulate the collisions: smaller asteroids explode; identical sizes destroy both.'
          ],
          keyRules: [
            'Collision condition: `stack and stack[-1] > 0 and asteroid < 0`.',
            'Break out when current asteroid explodes.'
          ],
          codeSnippet: {
            id: 'dsa-snip-10-8',
            title: 'Asteroid Collision Simulation',
            description: 'Stack simulation of opposing kinetic collisions',
            language: 'python',
            code: `def asteroid_collision(asteroids: list[int]) -> list[int]:
    stack = []
    
    for a in asteroids:
        alive = True
        # Collision occurs only if stack top moves right (+) and incoming moves left (-)
        while alive and a < 0 and stack and stack[-1] > 0:
            if stack[-1] < -a:
                stack.pop() # top asteroid explodes, incoming keeps going
            elif stack[-1] == -a:
                stack.pop() # both explode!
                alive = False
            else:
                alive = False # incoming explodes!
                
        if alive:
            stack.append(a)
            
    return stack

print("Remaining asteroids [5, 10, -5]:", asteroid_collision([5, 10, -5])) # [5, 10]
print("Remaining asteroids [8, -8]:", asteroid_collision([8, -8]))       # []`
          },
          pitfall: 'Triggering collision when stack top is negative and incoming is positive: `[-2, 2]` are moving AWAY from each other and never collide!',
          quickCheck: {
            question: 'Under what condition do two adjacent asteroids collide in Asteroid Collision?',
            options: ['Whenever their signs are different', 'Only when the left asteroid moves right (+) and the right asteroid moves left (-)', 'Whenever they have the same size', 'Only when both are negative'],
            correctIndex: 1,
            explanation: 'Asteroids collide only if they are heading toward each other: the earlier asteroid moving right (+) and the later asteroid moving left (-).'
          }
        }
      ]
    },
    {
      id: 'dsa-w2-d11',
      dayNumber: 11,
      weekNumber: 2,
      title: 'Advanced Monotonic Stacks & Monotonic Queues',
      subtitle: 'Largest Rectangle in Histogram, Maximal Rectangle 2D, and Sliding Window Maximum in O(N)',
      durationMinutes: 75,
      overview:
        'Conquer hard-level geometric and queue optimization challenges. Master Largest Rectangle in Histogram using a monotonic increasing stack, reduce Maximal Rectangle 2D to histogram projections, and implement the Monotonic Queue for Sliding Window Maximum in strict O(N) time.',
      topics: [
        {
          id: 'dsa-w2-d11-t1',
          topicNumber: 1,
          title: 'Largest Rectangle in Histogram: Monotonic Increasing Stack',
          explanation: [
            'Given $N$ non-negative integers representing histogram bar heights where each bar has width 1, find the area of the largest rectangle.',
            'For any bar $i$, what is the largest rectangle using bar $i$ as the SHORTEST bar?',
            'The rectangle extends left until a bar shorter than $h_i$ is found, and right until a bar shorter than $h_i$ is found.',
            'Maintain a Monotonic Increasing Stack of indices:',
            'When bar $h_i < h_{\\text{top}}$: pop `top`.',
            'Its height is $h = \\text{heights}[\\text{top}]$.',
            'Its width extends from the new stack top (left boundary) to $i$ (right boundary):',
            '$\\text{width} = i - \\text{stack}[-1] - 1$ (or $i$ if stack is empty).'
          ],
          keyRules: [
            'Monotonic increasing stack tracks left boundary.',
            'Append a dummy 0 height at the end to flush all remaining bars from the stack.',
            'Runs in strict O(N) time.'
          ],
          codeSnippet: {
            id: 'dsa-snip-11-1',
            title: 'Largest Rectangle in Histogram',
            description: 'Monotonic stack calculating max area in O(N)',
            language: 'python',
            code: `def largest_rectangle_area(heights: list[int]) -> int:
    stack = [] # indices of increasing heights
    max_area = 0
    # Append 0 to flush remaining bars at the end
    heights_with_sentinel = heights + [0]
    
    for i, h in enumerate(heights_with_sentinel):
        while stack and h < heights_with_sentinel[stack[-1]]:
            height = heights_with_sentinel[stack.pop()]
            width = i if not stack else i - stack[-1] - 1
            max_area = max(max_area, height * width)
        stack.append(i)
        
    return max_area

print("Max rectangle area:", largest_rectangle_area([2, 1, 5, 6, 2, 3])) # 10 (height 5 * width 2)`
          },
          pitfall: 'Omitting the sentinel 0 at the end: if heights are strictly increasing `[1, 2, 3, 4, 5]`, no bars are popped during the loop, yielding 0 area without explicit post-loop flushing.',
          quickCheck: {
            question: 'What is the role of appending a height 0 sentinel at the end of the histogram array?',
            options: ['To increase array size', 'To force every remaining bar in the monotonic increasing stack to be popped and its area calculated', 'To sort the array', 'To prevent negative numbers'],
            correctIndex: 1,
            explanation: 'Since height 0 is <= all possible heights, it triggers the while loop repeatedly until the stack is completely empty, ensuring no bars are left uncalculated.'
          }
        },
        {
          id: 'dsa-w2-d11-t2',
          topicNumber: 2,
          title: 'Maximal Rectangle: 2D Matrix Reduction to Histograms',
          explanation: [
            'Problem: Given a 2D binary matrix filled with `0`s and `1`s, find the largest rectangle containing only `1`s.',
            'Reduction Trick: Treat each row of the matrix as the base of a histogram!',
            'Maintain a 1D `heights` array of size `cols`:',
            '- For each row: if `matrix[r][c] == "1"`, `heights[c] += 1`. If `matrix[r][c] == "0"`, reset `heights[c] = 0`.',
            '- Run the 1D Largest Rectangle in Histogram algorithm on `heights`.',
            'Time Complexity: $O(R \\times C)$ time and $O(C)$ space.'
          ],
          keyRules: [
            'If matrix cell is "0", reset height to 0 (a rectangle cannot bridge across a zero).',
            'Calls Largest Rectangle in Histogram R times.'
          ],
          codeSnippet: {
            id: 'dsa-snip-11-2',
            title: 'Maximal Rectangle in 2D Binary Matrix',
            description: 'Row-by-row histogram reduction in O(R * C)',
            language: 'python',
            code: `def maximal_rectangle(matrix: list[list[str]]) -> int:
    if not matrix or not matrix[0]: return 0
    cols = len(matrix[0])
    heights = [0] * cols
    max_rect = 0
    
    for row in matrix:
        for c in range(cols):
            # Accumulate height if 1, reset if 0
            heights[c] = heights[c] + 1 if row[c] == '1' else 0
        max_rect = max(max_rect, largest_rectangle_area(heights))
        
    return max_rect

grid = [
    ["1","0","1","0","0"],
    ["1","0","1","1","1"],
    ["1","1","1","1","1"],
    ["1","0","0","1","0"]
]
print("Maximal 2D Rectangle Area:", maximal_rectangle(grid)) # 6`
          },
          pitfall: 'Failing to reset `heights[c] = 0` when encountering `"0"`: breaks the contiguity of the vertical bar.',
          quickCheck: {
            question: 'What is the time complexity of the optimal Maximal Rectangle algorithm on an R x C binary matrix?',
            options: ['O(R^2 * C^2)', 'O(R * C)', 'O(R * C log C)', 'O(R + C)'],
            correctIndex: 1,
            explanation: 'For each of the R rows, updating heights and running the O(C) histogram calculation takes O(C), giving O(R * C) overall runtime.'
          }
        },
        {
          id: 'dsa-w2-d11-t3',
          topicNumber: 3,
          title: 'The Monotonic Queue: Concept and Mechanics',
          explanation: [
            'A Monotonic Queue supports `push`, `pop`, and `max()` in amortized $O(1)$ time.',
            'It is implemented using a Double-Ended Queue (`collections.deque`):',
            '- `push(val)`: Pop elements from the BACK of the deque as long as they are smaller than `val` (they can never be the maximum while `val` is present), then append `val`.',
            '- `pop(val)`: If the front element equals `val`, pop from FRONT.',
            '- `max()`: The front element of the deque is ALWAYS the maximum!'
          ],
          keyRules: [
            'Maintains elements in monotonically non-increasing order.',
            'Smaller elements that entered earlier are rendered obsolete and purged.'
          ],
          codeSnippet: {
            id: 'dsa-snip-11-3',
            title: 'Monotonic Queue Implementation',
            description: 'Deque maintaining maximum element in O(1)',
            language: 'python',
            code: `from collections import deque

class MonotonicQueue:
    def __init__(self):
        self.q = deque()
        
    def push(self, val: int):
        # Eliminate all smaller elements from the back
        while self.q and self.q[-1] < val:
            self.q.pop()
        self.q.append(val)
        
    def pop(self, val: int):
        if self.q and self.q[0] == val:
            self.q.popleft()
            
    def max(self) -> int:
        return self.q[0]

mq = MonotonicQueue()
mq.push(1); mq.push(3); mq.push(-1)
print("Max:", mq.max()) # 3
mq.pop(1) # 1 was already removed by 3
print("Max after popping 1:", mq.max()) # 3`
          },
          pitfall: 'Using a max-heap instead: a max-heap takes O(log K) to push/pop, whereas a Monotonic Queue achieves amortized O(1).',
          quickCheck: {
            question: 'Why can smaller elements be safely purged from the back of a Monotonic Queue when a larger element arrives?',
            options: ['Because smaller elements are not allowed in queues', 'Because the larger element arrived later, so it will outlive the smaller elements and always be greater than them', 'To prevent memory leaks', 'To sort the queue'],
            correctIndex: 1,
            explanation: 'The new element is larger AND entered more recently; the older smaller elements can never be the maximum of any future window, so they are redundant.'
          }
        },
        {
          id: 'dsa-w2-d11-t4',
          topicNumber: 4,
          title: 'Sliding Window Maximum (LeetCode 239 - Hard Benchmark)',
          explanation: [
            'Problem: Given an array `nums` and sliding window size $k$, return the max sliding window values from left to right.',
            'Brute force re-scans window in $O(N \\times K)$.',
            'Optimal approach using Deque of INDICES:',
            '1. Remove indices from front that fell out of the active window (`q[0] < i - k + 1`).',
            '2. Pop indices from back whose values are $\\le nums[i]$.',
            '3. Append index `i`.',
            '4. When `i >= k - 1`, record `nums[q[0]]` into output array.',
            'Total runtime: strictly $O(N)$ because every index enters and leaves the deque at most once!'
          ],
          keyRules: [
            'Store INDICES in the deque so you can check if elements have expired out of the window: `q[0] < i - k + 1`.',
            'Amortized O(1) operations per window step.'
          ],
          codeSnippet: {
            id: 'dsa-snip-11-4',
            title: 'Sliding Window Maximum in O(N)',
            description: 'Monotonic index deque for sliding window maximum',
            language: 'python',
            code: `from collections import deque

def max_sliding_window(nums: list[int], k: int) -> list[int]:
    q = deque() # stores indices
    res = []
    
    for i, val in enumerate(nums):
        # 1. Remove elements outside current window
        if q and q[0] < i - k + 1:
            q.popleft()
            
        # 2. Maintain monotonic decreasing order
        while q and nums[q[-1]] <= val:
            q.pop()
            
        # 3. Add current index
        q.append(i)
        
        # 4. Record max when window reaches size k
        if i >= k - 1:
            res.append(nums[q[0]])
            
    return res

print("Sliding Window Max:", max_sliding_window([1,3,-1,-3,5,3,6,7], 3)) # [3, 3, 5, 5, 6, 7]`
          },
          pitfall: 'Storing values instead of indices in the deque: if the array has duplicates, popping values makes it impossible to know WHICH duplicate expired out of the window.',
          quickCheck: {
            question: 'Why does Sliding Window Maximum run in O(N) time despite the inner while loop?',
            options: ['Because k is constant', 'Because every element is pushed onto the deque at most once and popped from the deque at most once across the entire run', 'Because of parallel execution', 'Because deque operations are O(0)'],
            correctIndex: 1,
            explanation: 'Each element enters the deque once and leaves the deque at most once, bounding total operations across the entire loop to 2N = O(N).'
          }
        },
        {
          id: 'dsa-w2-d11-t5',
          topicNumber: 5,
          title: 'Constrained Subsequence Sum',
          explanation: [
            'Problem: Find the maximum sum of a non-empty subsequence such that for every two consecutive integers in the subsequence, their index difference is $\\le K$.',
            'DP State: `dp[i]` is the max subsequence sum ending at index `i`:',
            '$\\text{dp}[i] = \\text{nums}[i] + \\max(0, \\max_{j = i - k}^{i - 1} \\text{dp}[j])$.',
            'Naive lookup takes $O(K)$, making total time $O(N \\times K)$.',
            'Using a Monotonic Queue to maintain the maximum `dp[j]` in the sliding window of size $K$ reduces each step to $O(1)$, achieving $O(N)$ overall!'
          ],
          keyRules: [
            'Monotonic queue accelerates dynamic programming transitions.',
            'Store (dp[i], i) in the deque.'
          ],
          codeSnippet: {
            id: 'dsa-snip-11-5',
            title: 'Constrained Subsequence Sum via Monotonic Deque',
            description: 'DP optimization from O(N * K) to O(N)',
            language: 'python',
            code: `from collections import deque

def constrained_subset_sum(nums: list[int], k: int) -> int:
    q = deque() # stores indices
    dp = nums.copy()
    
    for i in range(len(nums)):
        # Remove expired window elements
        if q and q[0] < i - k:
            q.popleft()
            
        if q:
            dp[i] = max(dp[i], nums[i] + dp[q[0]])
            
        while q and dp[q[-1]] <= dp[i]:
            q.pop()
            
        if dp[i] > 0:
            q.append(i)
            
    return max(dp)

print("Constrained Subsequence Sum:", constrained_subset_sum([10, 2, -10, 5, 20], 2)) # 37 ([10, 2, 5, 20])`
          },
          pitfall: 'Pushing negative dp[i] values into the deque: adding negative sums only hurts future subsequences; only push if `dp[i] > 0`.',
          quickCheck: {
            question: 'What optimization does a monotonic queue provide for sliding window DP transitions?',
            options: ['Reduces space to O(1)', 'Reduces finding max(dp[i-k..i-1]) from O(K) to O(1) amortized', 'Sorts the array', 'Eliminates all negative numbers'],
            correctIndex: 1,
            explanation: 'The monotonic queue maintains the maximum value over a sliding window of size K in O(1) amortized time, replacing an O(K) inner search.'
          }
        },
        {
          id: 'dsa-w2-d11-t6',
          topicNumber: 6,
          title: 'Sum of Subarray Minimums (Monotonic Contribution Trick)',
          explanation: [
            'Problem: Given an array of integers, find the sum of `min(b)` over all contiguous subarrays `b`.',
            'Instead of examining every subarray ($O(N^2)$), evaluate each element\'s individual CONTRIBUTION to the total sum!',
            'For element $nums[i]$: how many subarrays have $nums[i]$ as their minimum?',
            '- Find distance to Previous Smaller Element (`left_count`).',
            '- Find distance to Next Smaller or Equal Element (`right_count`).',
            '- Total subarrays where $nums[i]$ is minimum $= \\text{left\\_count} \\times \\text{right\\_count}$.',
            '- Contribution $= nums[i] \\times \\text{left\\_count} \\times \\text{right\\_count}$.'
          ],
          keyRules: [
            'Contribution principle: Count how many times an element serves as the answer.',
            'Use strict inequality on one side and non-strict (<=) on the other to prevent double counting duplicates.'
          ],
          codeSnippet: {
            id: 'dsa-snip-11-6',
            title: 'Sum of Subarray Minimums',
            description: 'Contribution counting via monotonic stacks in O(N)',
            language: 'python',
            code: `def sum_subarray_mins(arr: list[int]) -> int:
    MOD = 10**9 + 7
    n = len(arr)
    
    # 1. Previous Smaller Element distance
    left = [0] * n
    stack = []
    for i in range(n):
        count = 1
        while stack and stack[-1][0] > arr[i]:
            count += stack.pop()[1]
        stack.append((arr[i], count))
        left[i] = count
        
    # 2. Next Smaller or Equal Element distance
    right = [0] * n
    stack = []
    for i in range(n - 1, -1, -1):
        count = 1
        while stack and stack[-1][0] >= arr[i]:
            count += stack.pop()[1]
        stack.append((arr[i], count))
        right[i] = count
        
    total = sum(val * l * r for val, l, r in zip(arr, left, right))
    return total % MOD

print("Sum of subarray minimums:", sum_subarray_mins([3, 1, 2, 4])) # 17`
          },
          pitfall: 'Using strict `<` on BOTH sides: duplicate identical numbers would count the same subarray multiple times. One side must be strict (`>`) and the other non-strict (`>=`).',
          quickCheck: {
            question: 'Why does one side use strict inequality and the other use non-strict inequality in Sum of Subarray Minimums?',
            options: ['To ensure integer division', 'To prevent duplicate identical elements from counting the same subarray twice', 'To reverse the array', 'Because modulo arithmetic requires it'],
            correctIndex: 1,
            explanation: 'Breaking ties asymmetrically (e.g. left is strictly smaller, right is smaller or equal) assigns each subarray uniquely to its earliest minimum.'
          }
        },
        {
          id: 'dsa-w2-d11-t7',
          topicNumber: 7,
          title: 'Remove K Digits: Greedy Monotonic Stack',
          explanation: [
            'Problem: Given string `num` representing a non-negative integer and integer $k$, return the smallest possible integer after removing $k$ digits.',
            'Greedy Strategy: To make a number as small as possible, digits at higher place values (leftmost) must be minimized.',
            'If digit $D_i > D_{i+1}$, removing $D_i$ immediately places a smaller digit in that higher place value.',
            'Monotonic Increasing Stack:',
            '- While `k > 0` and `stack and stack[-1] > digit`: pop from stack and decrement `k`.',
            '- Push digit.',
            '- Strip remaining $k$ from end and strip leading zeros.'
          ],
          keyRules: [
            'Monotonic increasing stack maintains smallest prefix digits.',
            'Strip leading zeros using `.lstrip("0") or "0"`.',
            'If k > 0 after the loop, slice `stack[:-k]`.'
          ],
          codeSnippet: {
            id: 'dsa-snip-11-7',
            title: 'Remove K Digits',
            description: 'Greedy monotonic stack digit removal in O(N)',
            language: 'python',
            code: `def remove_k_digits(num: str, k: int) -> str:
    stack = []
    
    for digit in num:
        while k > 0 and stack and stack[-1] > digit:
            stack.pop()
            k -= 1
        stack.append(digit)
        
    # If k > 0 remains, truncate from tail
    final_stack = stack[:-k] if k > 0 else stack
    
    # Strip leading zeros
    res = "".join(final_stack).lstrip("0")
    return res if res else "0"

print("Smallest after removing 3 digits from 1432219:", remove_k_digits("1432219", 3)) # "1219"`
          },
          pitfall: 'Forgetting to handle `k > 0` after scanning all digits: for already sorted numbers like `"12345"`, nothing is popped in the loop, so `stack[:-k]` is mandatory.',
          quickCheck: {
            question: 'What does remove_k_digits do if the resulting string is empty or entirely zeros?',
            options: ['Returns ""', 'Returns "0"', 'Throws an error', 'Returns None'],
            correctIndex: 1,
            explanation: 'The problem specifies that valid non-negative integers must return "0" rather than an empty string.'
          }
        },
        {
          id: 'dsa-w2-d11-t8',
          topicNumber: 8,
          title: 'Monotonic Structures Synthesis & Decision Tree',
          explanation: [
            'When should you use a Monotonic Stack vs Monotonic Queue?',
            '- **Monotonic Stack**: Use when you need the Next/Previous Greater/Smaller element for each index, or when analyzing nested boundaries (Histograms, Parentheses, Trapping Rain Water). Time: $O(N)$, Space: $O(N)$.',
            '- **Monotonic Queue (Deque)**: Use when you need the Maximum or Minimum over a moving sliding window of size $K$, or when optimizing 1D Dynamic Programming transitions. Time: $O(N)$, Space: $O(K)$.',
            'Both structures guarantee that every element is added once and deleted once, ensuring strict $O(N)$ amortized runtime.'
          ],
          keyRules: [
            'Stack: operates on one end (LIFO) -> Next/Previous comparisons.',
            'Queue/Deque: pushes to back, pops from front (FIFO window) -> Sliding window extrema.'
          ],
          codeSnippet: {
            id: 'dsa-snip-11-8',
            title: 'Monotonic Decision Architecture',
            description: 'Diagnostic guide for selecting monotonic structures',
            language: 'python',
            code: `def monotonic_selector(problem_type: str) -> str:
    if "next_greater" in problem_type or "histogram" in problem_type:
        return "Use Monotonic Stack (stores indices, pops when ordering breaks)"
    elif "sliding_window" in problem_type or "window_extremum" in problem_type:
        return "Use Monotonic Deque (pops obsolete elements from back, pops expired from front)"
    return "Standard linear scan"

print("Diagnostic:", monotonic_selector("sliding_window_max"))`
          },
          pitfall: 'Attempting to use a priority queue (heap) for sliding window when monotonic deque provides strictly better asymptotic and cache performance.',
          quickCheck: {
            question: 'What is the primary operational difference between a Monotonic Stack and a Monotonic Deque?',
            options: ['Monotonic Stack is slower', 'Monotonic Stack operates on one end (LIFO); Monotonic Deque pops expired elements from the front and smaller elements from the back', 'Monotonic Deque cannot store integers', 'They are strictly identical'],
            correctIndex: 1,
            explanation: 'Monotonic Deques support dual-ended access: popping expired elements that leave the sliding window from the front, while maintaining monotonic ordering from the back.'
          }
        }
      ]
    },
    {
      id: 'dsa-w2-d12',
      dayNumber: 12,
      weekNumber: 2,
      title: 'Queues, Deques & Circular Buffers',
      subtitle: 'FIFO mechanics, circular array implementation, deque mechanics, queue using two stacks & BFS pipelines',
      durationMinutes: 70,
      overview:
        'Master the First-In First-Out (FIFO) queue architecture. Build bounded Circular Ring Buffers using modulo arithmetic, implement a Queue using two Stacks with amortized O(1) transfer, explore Double-Ended Queues (Deque), and examine BFS queue patterns.',
      topics: [
        {
          id: 'dsa-w2-d12-t1',
          topicNumber: 1,
          title: 'The FIFO Pipeline and Circular Array Buffer',
          explanation: [
            'A Queue enforces First-In, First-Out (FIFO) ordering.',
            'Implementing a queue with a naive dynamic array causes a disaster: `pop(0)` takes $O(N)$ time because all elements shift left.',
            'Solution: Circular Array Buffer.',
            'Maintain a fixed-size array with `head` and `tail` pointers that wrap around using modulo arithmetic: `tail = (tail + 1) % capacity`.',
            'Enqueuing and dequeuing are strictly $O(1)$ with zero element shifting!'
          ],
          keyRules: [
            'Never use list.pop(0) in Python: it is an O(N) memory shift.',
            'Circular buffers wrap indices with `(index + 1) % capacity`.'
          ],
          codeSnippet: {
            id: 'dsa-snip-12-1',
            title: 'Circular Queue Implementation',
            description: 'Bounded array queue with O(1) push and pop',
            language: 'python',
            code: `class CircularQueue:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.data = [0] * capacity
        self.head = 0
        self.tail = 0
        self.size = 0
        
    def enqueue(self, val: int) -> bool:
        if self.is_full(): return False
        self.data[self.tail] = val
        self.tail = (self.tail + 1) % self.capacity
        self.size += 1
        return True
        
    def dequeue(self) -> bool:
        if self.is_empty(): return False
        self.head = (self.head + 1) % self.capacity
        self.size -= 1
        return True
        
    def front(self) -> int:
        return -1 if self.is_empty() else self.data[self.head]
        
    def is_empty(self) -> bool: return self.size == 0
    def is_full(self) -> bool: return self.size == self.capacity

cq = CircularQueue(3)
cq.enqueue(10); cq.enqueue(20); cq.enqueue(30)
print("Front:", cq.front()) # 10
cq.dequeue()
cq.enqueue(40) # Wraps around!
print("New Front:", cq.front()) # 20`
          },
          pitfall: 'Confusing empty and full states when tracking without a `size` variable: when `head == tail`, the queue could be completely empty OR completely full. Maintain a `size` count or leave one empty slot.',
          quickCheck: {
            question: 'Why is `list.pop(0)` in Python banned for implementing queue dequeues?',
            options: ['It crashes the interpreter', 'It is an O(N) operation because all subsequent elements must shift left in contiguous memory', 'It removes the wrong element', 'It only works on integers'],
            correctIndex: 1,
            explanation: 'Python lists are dynamic arrays; removing index 0 forces the runtime to move all remaining N-1 elements forward by one slot in RAM, taking O(N) time.'
          }
        },
        {
          id: 'dsa-w2-d12-t2',
          topicNumber: 2,
          title: 'Implement Queue using Two Stacks (Amortized Analysis)',
          explanation: [
            'How can you build a FIFO Queue using only two LIFO Stacks (`stack_in` and `stack_out`)?',
            '- `push(x)`: Push onto `stack_in` in $O(1)$.',
            '- `pop()`: If `stack_out` is empty, pop all elements from `stack_in` and push them onto `stack_out`. This REVERSES the LIFO order into FIFO order! Then pop from `stack_out`.',
            'Amortized Analysis:',
            'Each element is pushed to `stack_in` once, transferred to `stack_out` once, and popped from `stack_out` once.',
            'Total operations per element = 3. Therefore, amortized time is strictly $O(1)$ per operation!'
          ],
          keyRules: [
            'Transfer from stack_in to stack_out ONLY when stack_out is completely empty.',
            'Amortized time is strictly O(1).'
          ],
          codeSnippet: {
            id: 'dsa-snip-12-2',
            title: 'Queue Using Two Stacks',
            description: 'Amortized O(1) FIFO queue with two LIFO stacks',
            language: 'python',
            code: `class MyQueue:
    def __init__(self):
        self.stack_in = []
        self.stack_out = []
        
    def push(self, x: int) -> None:
        self.stack_in.append(x)
        
    def pop(self) -> int:
        self.peek()
        return self.stack_out.pop()
        
    def peek(self) -> int:
        if not self.stack_out:
            while self.stack_in:
                self.stack_out.append(self.stack_in.pop())
        return self.stack_out[-1]
        
    def empty(self) -> bool:
        return not self.stack_in and not self.stack_out

q = MyQueue()
q.push(1); q.push(2)
print("Peek:", q.peek()) # 1
print("Pop:", q.pop())   # 1
q.push(3)
print("Pop:", q.pop())   # 2`
          },
          pitfall: 'Transferring elements from `stack_in` to `stack_out` on every single operation: transfers must happen ONLY when `stack_out` is exhausted, otherwise ordering is scrambled.',
          quickCheck: {
            question: 'What is the amortized time complexity of the pop() operation in a two-stack queue?',
            options: ['O(N)', 'O(1)', 'O(log N)', 'O(N^2)'],
            correctIndex: 1,
            explanation: 'While an individual pop may take O(N) during a transfer, each element is moved at most once, distributing the cost over N operations to achieve amortized O(1).'
          }
        },
        {
          id: 'dsa-w2-d12-t3',
          topicNumber: 3,
          title: 'Implement Stack using Queues (Push-Cost vs Pop-Cost Trade-Off)',
          explanation: [
            'Building a LIFO Stack using FIFO Queues can be done with a single queue by rotating elements.',
            'On `push(x)`:',
            '1. Enqueue $x$ to the queue.',
            '2. Rotate all previous $(N - 1)$ elements by dequeuing from front and re-enqueuing to back: `q.append(q.popleft())`.',
            'Now the newly added element is directly at the FRONT of the queue!',
            'Pop and Top become instantaneous $O(1)$ operations.'
          ],
          keyRules: [
            'Push is O(N) by rotating elements to keep newest item at front.',
            'Pop and Top are O(1).'
          ],
          codeSnippet: {
            id: 'dsa-snip-12-3',
            title: 'Stack Using a Single Queue',
            description: 'Rotating queue elements on push to maintain LIFO',
            language: 'python',
            code: `from collections import deque

class MyStack:
    def __init__(self):
        self.q = deque()
        
    def push(self, x: int) -> None:
        self.q.append(x)
        for _ in range(len(self.q) - 1):
            self.q.append(self.q.popleft()) # rotate
            
    def pop(self) -> int:
        return self.q.popleft()
        
    def top(self) -> int:
        return self.q[0]
        
    def empty(self) -> bool:
        return len(self.q) == 0

s = MyStack()
s.push(10); s.push(20)
print("Top:", s.top()) # 20
print("Pop:", s.pop()) # 20
print("Top:", s.top()) # 10`
          },
          pitfall: 'Attempting to rotate during `pop()`: rotating during push keeps `top()` and `pop()` as clean O(1) operations.',
          quickCheck: {
            question: 'What is the time complexity of the push operation in this single-queue stack implementation?',
            options: ['O(1)', 'O(N)', 'O(log N)', 'O(N^2)'],
            correctIndex: 1,
            explanation: 'Push rotates the N - 1 existing elements around the queue, requiring O(N) operations.'
          }
        },
        {
          id: 'dsa-w2-d12-t4',
          topicNumber: 4,
          title: 'Design Circular Deque (Double-Ended Queue)',
          explanation: [
            'A Double-Ended Queue (Deque) supports insertion and deletion at BOTH front and rear in $O(1)$ time.',
            'Circular Array mechanics with wrap-around pointers:',
            '- `insertFront(val)`: `front = (front - 1 + capacity) % capacity; data[front] = val;`.',
            '- `insertLast(val)`: `data[rear] = val; rear = (rear + 1) % capacity;`.',
            '- `deleteFront()`: `front = (front + 1) % capacity;`.',
            '- `deleteLast()`: `rear = (rear - 1 + capacity) % capacity;`.'
          ],
          keyRules: [
            'Adding capacity before modulo `(x - 1 + capacity) % capacity` prevents negative remainder indices.',
            'All operations are strictly O(1) with bounded memory.'
          ],
          codeSnippet: {
            id: 'dsa-snip-12-4',
            title: 'Design Circular Deque',
            description: 'Double-ended bounded circular array in O(1)',
            language: 'python',
            code: `class MyCircularDeque:
    def __init__(self, k: int):
        self.k = k
        self.data = [0] * k
        self.size = 0
        self.front = 0
        self.rear = 0
        
    def insertFront(self, value: int) -> bool:
        if self.isFull(): return False
        self.front = (self.front - 1 + self.k) % self.k
        self.data[self.front] = value
        self.size += 1
        return True
        
    def insertLast(self, value: int) -> bool:
        if self.isFull(): return False
        self.data[self.rear] = value
        self.rear = (self.rear + 1) % self.k
        self.size += 1
        return True
        
    def deleteFront(self) -> bool:
        if self.isEmpty(): return False
        self.front = (self.front + 1) % self.k
        self.size -= 1
        return True
        
    def deleteLast(self) -> bool:
        if self.isEmpty(): return False
        self.rear = (self.rear - 1 + self.k) % self.k
        self.size -= 1
        return True
        
    def getFront(self) -> int: return -1 if self.isEmpty() else self.data[self.front]
    def getRear(self) -> int: return -1 if self.isEmpty() else self.data[(self.rear - 1 + self.k) % self.k]
    def isEmpty(self) -> bool: return self.size == 0
    def isFull(self) -> bool: return self.size == self.k`
          },
          pitfall: 'Reading `self.data[self.rear]` for getRear: `rear` points to the NEXT empty insertion slot; the actual last element is at `(rear - 1 + k) % k`.',
          quickCheck: {
            question: 'Why do we add capacity before the modulo operator when moving a circular pointer backward?',
            options: ['To increase array size', 'To ensure the dividend is positive, preventing negative index errors', 'To round to the nearest integer', 'To sort the queue'],
            correctIndex: 1,
            explanation: 'When front is 0, front - 1 is -1. Adding capacity yields (k - 1) % k = k - 1, cleanly wrapping around to the end of the array.'
          }
        },
        {
          id: 'dsa-w2-d12-t5',
          topicNumber: 5,
          title: 'BFS Level-Order Processing Pipeline using Queues',
          explanation: [
            'Breadth-First Search (BFS) explores tree or graph nodes level-by-level using a FIFO Queue.',
            'The Standard BFS Queue Loop Pattern:',
            '1. Enqueue initial source node(s).',
            '2. While queue is not empty:',
            '   a. Capture current level size: `level_size = len(queue)`.',
            '   b. Iterate `level_size` times, popping nodes from front and enqueuing their unvisited neighbors.',
            'This discrete batching guarantees that all nodes at distance $D$ are fully processed before any node at distance $D + 1$ is visited.'
          ],
          keyRules: [
            'Freezing level_size = len(queue) separates tree/graph levels deterministically.',
            'Guarantees shortest path in unweighted graphs.'
          ],
          codeSnippet: {
            id: 'dsa-snip-12-5',
            title: 'Level-Order BFS Queue Template',
            description: 'Standard FIFO queue pattern for level-by-level traversal',
            language: 'python',
            code: `from collections import deque

def bfs_levels(tree_nodes):
    q = deque([tree_nodes[0]])
    levels = []
    
    while q:
        level_size = len(q)
        current_level = []
        for _ in range(level_size):
            node = q.popleft()
            current_level.append(node['val'])
            for child in node.get('children', []):
                q.append(child)
        levels.append(current_level)
        
    return levels

tree = [{'val': 1, 'children': [{'val': 2, 'children': []}, {'val': 3, 'children': []}]}]
print("BFS Levels:", bfs_levels(tree)) # [[1], [2, 3]]`
          },
          pitfall: 'Calling `while len(q):` without freezing `level_size`: newly enqueued children mingle with current level nodes, destroying level boundary tracking.',
          quickCheck: {
            question: 'Why is `level_size = len(q)` captured before the inner loop in BFS level-order traversal?',
            options: ['To prevent memory allocation', 'To fix the count of nodes belonging strictly to the current level before new children are enqueued', 'To reverse the queue', 'Because len(q) is slow'],
            correctIndex: 1,
            explanation: 'As children are added to the queue during processing, freezing level_size ensures the loop only iterates over the nodes of the current depth level.'
          }
        },
        {
          id: 'dsa-w2-d12-t6',
          topicNumber: 6,
          title: 'Number of Recent Calls (LeetCode 933 - Window Queue)',
          explanation: [
            'Problem: Design a counter that counts the number of recent requests within a certain time frame (the past 3,000 milliseconds).',
            'Each call `ping(t)` adds a request at time $t$ (strictly increasing times). Return requests in range `[t - 3000, t]`.',
            'Using a FIFO Queue (`deque`):',
            '- Enqueue new timestamp `t`.',
            '- While `q[0] < t - 3000`: pop from left (expired requests).',
            '- Return `len(q)` in amortized $O(1)$ time!'
          ],
          keyRules: [
            'Timestamps are strictly increasing.',
            'Each ping enters the queue once and is evicted at most once.'
          ],
          codeSnippet: {
            id: 'dsa-snip-12-6',
            title: 'Recent Calls Queue Counter',
            description: 'Sliding time-window request counting with deque',
            language: 'python',
            code: `from collections import deque

class RecentCounter:
    def __init__(self):
        self.q = deque()
        
    def ping(self, t: int) -> int:
        self.q.append(t)
        # Evict timestamps older than t - 3000
        while self.q and self.q[0] < t - 3000:
            self.q.popleft()
        return len(self.q)

rc = RecentCounter()
print("Ping 1:", rc.ping(1))       # 1
print("Ping 100:", rc.ping(100))   # 2
print("Ping 3001:", rc.ping(3001)) # 3
print("Ping 3002:", rc.ping(3002)) # 3 (timestamp 1 expired!)`
          },
          pitfall: 'Iterating through the entire list to count timestamps in range: takes O(N) per ping, which scales quadratically to O(N^2) for N requests.',
          quickCheck: {
            question: 'What is the amortized time complexity of each ping() operation in RecentCounter?',
            options: ['O(N)', 'O(1)', 'O(log N)', 'O(3000)'],
            correctIndex: 1,
            explanation: 'Every timestamp is appended once and popped once from the front of the queue, giving amortized O(1) runtime per ping.'
          }
        },
        {
          id: 'dsa-w2-d12-t7',
          topicNumber: 7,
          title: 'Dota2 Senate: Round-Robin Elimination Simulation',
          explanation: [
            'Problem: Two parties ("Radiant" and "Dire") vote round-by-round to ban opposing senators. Each senator can ban the next upcoming opposing senator.',
            'Simulate round-robin using two FIFO Queues (`radiant` and `dire`):',
            '- Store the indices of active senators in each queue.',
            '- Compare front senators: whichever has the smaller index bans the other!',
            '- The winning senator survives to the next round: re-enqueue with index `idx + n`.',
            '- Repeat until one queue is empty.'
          ],
          keyRules: [
            'Smaller index senator gets to vote first in the current round.',
            'Surviving senator re-enters at the back with index updated by +N.'
          ],
          codeSnippet: {
            id: 'dsa-snip-12-7',
            title: 'Dota2 Senate Elimination',
            description: 'Dual queue round-robin elimination simulation in O(N)',
            language: 'python',
            code: `from collections import deque

def predict_party_victory(senate: str) -> str:
    n = len(senate)
    r_q = deque([i for i, c in enumerate(senate) if c == 'R'])
    d_q = deque([i for i, c in enumerate(senate) if c == 'D'])
    
    while r_q and d_q:
        r_idx = r_q.popleft()
        d_idx = d_q.popleft()
        
        # Earlier index votes first, banning the opponent
        if r_idx < d_idx:
            r_q.append(r_idx + n) # enters next round
        else:
            d_q.append(d_idx + n)
            
    return "Radiant" if r_q else "Dire"

print("Winner of 'RD':", predict_party_victory("RD"))   # Radiant
print("Winner of 'RDD':", predict_party_victory("RDD")) # Dire`
          },
          pitfall: 'Greedily banning senators from the back of the opposing party: optimal strategy is always to ban the NEXT upcoming opposing senator to prevent them from voting in the current round.',
          quickCheck: {
            question: 'Why does a surviving senator re-enter the queue with index `idx + n`?',
            options: ['To multiply their voting power', 'To place them at the end of the line for the subsequent round while preserving round-robin order', 'To mark them as eliminated', 'Because of 0-based indexing'],
            correctIndex: 1,
            explanation: 'Adding n preserves the relative ordering of surviving senators for the next round of voting.'
          }
        },
        {
          id: 'dsa-w2-d12-t8',
          topicNumber: 8,
          title: 'Memory Leaks & Buffer Overflows in Industrial Queues',
          explanation: [
            'In production systems (Go channels, Redis queues, Kafka consumers, Linux ring buffers):',
            '- Unbounded queues under producer-consumer imbalance consume infinite memory until the OS terminates the process via the Out-Of-Memory (OOM) killer.',
            '- Bounded queues apply Backpressure: when full, producers block or incoming packets are dropped (e.g. TCP packet drop).',
            'Always design queues with finite capacities and explicit overflow strategies.'
          ],
          keyRules: [
            'Unbounded queues in production are a severe memory exhaustion risk.',
            'Implement bounded queues with backpressure or drop-oldest policies.'
          ],
          codeSnippet: {
            id: 'dsa-snip-12-8',
            title: 'Bounded Queue with Drop-Oldest Policy',
            description: 'Industrial ring buffer preventing memory exhaustion',
            language: 'python',
            code: `from collections import deque

class BoundedQueue:
    def __init__(self, max_capacity: int):
        self.q = deque(maxlen=max_capacity)
        
    def push(self, item):
        # Automatically drops oldest item if full, preventing OOM
        self.q.append(item)
        
    def pop(self):
        return self.q.popleft() if self.q else None

bq = BoundedQueue(2)
bq.push("Packet 1")
bq.push("Packet 2")
bq.push("Packet 3") # Automatically drops Packet 1!
print("Remaining packets:", list(bq.q)) # ['Packet 2', 'Packet 3']`
          },
          pitfall: 'Letting worker queues grow without bounds in microservices: a slow database causes queues to accumulate millions of tasks, crashing the container.',
          quickCheck: {
            question: 'What is Backpressure in queue architecture?',
            options: ['Reversing the order of elements', 'A mechanism that signals producers to slow down or block when the queue reaches capacity, preventing system collapse', 'Compressing queue data', 'Increasing CPU frequency'],
            correctIndex: 1,
            explanation: 'Backpressure prevents memory exhaustion by throttling or blocking producers when consumer processing cannot keep up.'
          }
        }
      ]
    },
    {
      id: 'dsa-w2-d13',
      dayNumber: 13,
      weekNumber: 2,
      title: 'Hash Tables: Hashing Functions, Collisions & Load Factors',
      subtitle: 'Hash math, bucket indexing, separate chaining, open addressing (probing), load factor & dynamic rehashing',
      durationMinutes: 70,
      overview:
        'Demystify the internal machinery of Hash Tables that deliver average O(1) key-value lookups. Explore mathematical hash functions, collision resolution via Separate Chaining and Open Addressing, load factors, and dynamic table resizing.',
      topics: [
        {
          id: 'dsa-w2-d13-t1',
          topicNumber: 1,
          title: 'The Hash Table Architecture: Transforming Keys to Indices',
          explanation: [
            'A Hash Table achieves average $O(1)$ search, insertion, and deletion by mapping arbitrary keys (strings, objects, numbers) to integer bucket indices.',
            'Two-Step Pipeline:',
            '1. **Hash Function**: Computes a large integer hash code from the key: $h = \\text{hash}(key)$.',
            '2. **Bucket Compression**: Compresses the hash code to fit table capacity: $\\text{bucket\\_index} = h \\pmod M$ (or $h \\ \\& \\ (M - 1)$ if $M$ is a power of 2).'
          ],
          keyRules: [
            'Deterministic: identical keys MUST produce the exact same hash code every time.',
            'Uniform distribution: distributes keys evenly across all buckets to minimize collisions.'
          ],
          codeSnippet: {
            id: 'dsa-snip-13-1',
            title: 'Hash and Bucket Mapping Simulation',
            description: 'Converting string key to bucket index via polynomial rolling hash',
            language: 'python',
            code: `def simple_hash(key: str, capacity: int) -> int:
    # Polynomial rolling hash
    hash_val = 0
    prime = 31
    for char in key:
        hash_val = (hash_val * prime + ord(char))
    return hash_val % capacity

cap = 16
for k in ["apple", "banana", "cherry", "date"]:
    print(f"Key '{k}' -> Bucket Index: {simple_hash(k, cap)}")`
          },
          pitfall: 'Mutating an object after using it as a hash table key: altering its state changes its hash code, making the key permanently unfindable in the table!',
          quickCheck: {
            question: 'What is the required property of any valid hash function?',
            options: ['It must encrypt the key with AES', 'Two equal keys must always produce the exact same hash code', 'It must return a negative integer', 'It must sort the keys'],
            correctIndex: 1,
            explanation: 'Determinism is non-negotiable: if a key produces a different hash code on lookup than it did on insertion, the entry cannot be retrieved.'
          }
        },
        {
          id: 'dsa-w2-d13-t2',
          topicNumber: 2,
          title: 'Collision Resolution: Separate Chaining',
          explanation: [
            'By the Pigeonhole Principle, collisions (two distinct keys producing the same bucket index) are mathematically inevitable.',
            'Separate Chaining stores a linked list (or dynamic array) at each bucket.',
            'On insert: append `(key, value)` to the bucket\'s linked list.',
            'On lookup: traverse the bucket\'s linked list to find the matching key in $O(L)$ where $L$ is the chain length.',
            'With a uniform hash function and load factor $\\alpha \\le 0.75$, average chain length is $O(1)$.'
          ],
          keyRules: [
            'Used by C++ std::unordered_map and Java HashMap (converts to Red-Black Tree when chain length > 8).',
            'Average lookup is O(1); worst-case is O(N) if all keys hash to a single bucket.'
          ],
          codeSnippet: {
            id: 'dsa-snip-13-2',
            title: 'Separate Chaining Hash Map Implementation',
            description: 'Bucket array of linked key-value lists',
            language: 'python',
            code: `class ChainingHashMap:
    def __init__(self, capacity: int = 16):
        self.capacity = capacity
        self.buckets = [[] for _ in range(capacity)]
        
    def _hash(self, key) -> int:
        return hash(key) % self.capacity
        
    def put(self, key, value) -> None:
        idx = self._hash(key)
        for pair in self.buckets[idx]:
            if pair[0] == key:
                pair[1] = value # update existing key
                return
        self.buckets[idx].append([key, value]) # insert new
        
    def get(self, key):
        idx = self._hash(key)
        for pair in self.buckets[idx]:
            if pair[0] == key: return pair[1]
        return None

hm = ChainingHashMap()
hm.put("user_1", "Alice")
hm.put("user_2", "Bob")
print("Retrieved:", hm.get("user_1")) # Alice`
          },
          pitfall: 'Adversarial Hash Flooding Attacks: malicious attackers generate thousands of keys that hash to the exact same bucket, degrading server lookups from O(1) to O(N) and causing denial-of-service.',
          quickCheck: {
            question: 'What is the worst-case time complexity of a hash table lookup when all N keys collide into the same bucket?',
            options: ['O(1)', 'O(log N)', 'O(N)', 'O(N^2)'],
            correctIndex: 2,
            explanation: 'If all keys collide into a single bucket, the table degenerates into a singly linked list of size N, taking O(N) time to search.'
          }
        },
        {
          id: 'dsa-w2-d13-t3',
          topicNumber: 3,
          title: 'Collision Resolution: Open Addressing (Linear & Quadratic Probing)',
          explanation: [
            'Open Addressing stores all entries directly in the table array without secondary linked list nodes.',
            'When a collision occurs at bucket $H$:',
            '- **Linear Probing**: Check consecutive slots $(H + 1) \\% M, (H + 2) \\% M, \\dots$ until an empty slot is found.',
            '- **Quadratic Probing**: Check $(H + 1^2) \\% M, (H + 2^2) \\% M, \\dots$ to reduce clustering.',
            'Open addressing offers superior cache locality (contiguous memory), but requires tombstone markers for deletions.'
          ],
          keyRules: [
            'Requires load factor alpha < 0.7 (performance drops precipitously as table fills).',
            'Deleted slots must be marked with a "Tombstone" (DELETED) so probe sequences do not abort prematurely.'
          ],
          codeSnippet: {
            id: 'dsa-snip-13-3',
            title: 'Linear Probing Hash Table',
            description: 'Contiguous collision probing with tombstone deletions',
            language: 'python',
            code: `class LinearProbingMap:
    DELETED = object() # Sentinel tombstone
    
    def __init__(self, capacity: int = 16):
        self.capacity = capacity
        self.keys = [None] * capacity
        self.vals = [None] * capacity
        
    def put(self, key, val) -> None:
        idx = hash(key) % self.capacity
        while self.keys[idx] is not None and self.keys[idx] is not self.DELETED:
            if self.keys[idx] == key:
                self.vals[idx] = val # update
                return
            idx = (idx + 1) % self.capacity
            
        self.keys[idx] = key
        self.vals[idx] = val

lpm = LinearProbingMap()
lpm.put("alpha", 100)
lpm.put("beta", 200)`
          },
          pitfall: 'Setting a deleted slot to `None` in open addressing: this breaks the probe chain, causing lookups for elements inserted after that slot to incorrectly return "Not Found"!',
          quickCheck: {
            question: 'Why are tombstone markers necessary when deleting keys in an open-addressing hash table?',
            options: ['To free RAM memory', 'To allow subsequent lookups to continue probing past the deleted slot instead of stopping at None', 'To sort the array', 'To prevent hash code recalculation'],
            correctIndex: 1,
            explanation: 'Linear probing terminates upon finding an empty (None) slot. A tombstone indicates that a key was deleted and subsequent probes must continue searching.'
          }
        },
        {
          id: 'dsa-w2-d13-t4',
          topicNumber: 4,
          title: 'Load Factor (α) and Dynamic Rehashing',
          explanation: [
            'Load Factor: $\\alpha = \\frac{N}{\\text{Capacity}}$ (ratio of stored keys to total buckets).',
            'As $\\alpha$ increases, collisions skyrocket and lookup time degrades toward $O(N)$.',
            'When $\\alpha$ exceeds a threshold (typically $\\alpha \\ge 0.75$ for chaining, $\\alpha \\ge 0.5$ for open addressing):',
            '1. Allocate a new bucket array with DOUBLE the capacity ($2 \\times M$).',
            '2. Rehash: Recompute bucket indices for all existing elements and insert them into the new table.',
            'Amortized cost: Doubling ensures rehashing cost is amortized $O(1)$ per insertion.'
          ],
          keyRules: [
            'Standard rehashing threshold is alpha >= 0.75.',
            'Rehashing is O(N) when triggered, but amortized O(1).'
          ],
          codeSnippet: {
            id: 'dsa-snip-13-4',
            title: 'Dynamic Rehashing Simulation',
            description: 'Automatic capacity doubling when load factor threshold is breached',
            language: 'python',
            code: `class DynamicHashMap:
    def __init__(self, initial_cap: int = 4):
        self.capacity = initial_cap
        self.size = 0
        self.buckets = [[] for _ in range(initial_cap)]
        
    def put(self, key, val):
        # Check load factor alpha >= 0.75
        if (self.size + 1) / self.capacity >= 0.75:
            self._rehash(self.capacity * 2)
            
        idx = hash(key) % self.capacity
        for pair in self.buckets[idx]:
            if pair[0] == key:
                pair[1] = val
                return
        self.buckets[idx].append([key, val])
        self.size += 1
        
    def _rehash(self, new_cap: int):
        old_buckets = self.buckets
        self.capacity = new_cap
        self.buckets = [[] for _ in range(new_cap)]
        self.size = 0
        for b in old_buckets:
            for k, v in b:
                self.put(k, v)
        print(f"Rehashed table to new capacity: {new_cap}")

dhm = DynamicHashMap(4)
for i in range(6): dhm.put(f"key_{i}", i)`
          },
          pitfall: 'Copying old bucket indices into the new table directly: capacity changed from M to 2M, so bucket index `hash % new_capacity` is completely different and MUST be recomputed for every key!',
          quickCheck: {
            question: 'What is the typical load factor threshold for doubling the size of a chaining hash table?',
            options: ['0.1', '0.75', '2.5', '10.0'],
            correctIndex: 1,
            explanation: 'A load factor of 0.75 strikes the optimal engineering balance between memory utilization and low collision probability.'
          }
        },
        {
          id: 'dsa-w2-d13-t5',
          topicNumber: 5,
          title: 'Two Sum (The Classic Hash Map Benchmark)',
          explanation: [
            'Problem: Given an array of integers `nums` and an integer `target`, return indices of the two numbers that add up to `target`.',
            'Brute force checks all pairs in $O(N^2)$ time.',
            'Hash Map Solution in a Single Pass:',
            '- For each element `x`, its required complement is `comp = target - x`.',
            '- If `comp` is already in our hash map, we found the pair! Return `[seen[comp], current_index]`.',
            '- Otherwise, store `seen[x] = current_index`.',
            'Runs in $O(N)$ time with $O(N)$ space.'
          ],
          keyRules: [
            'Store complement lookup: target - num.',
            'Check map before inserting current element to prevent pairing an element with itself.'
          ],
          codeSnippet: {
            id: 'dsa-snip-13-5',
            title: 'Two Sum in O(N) Time',
            description: 'Single-pass hash map complement matching',
            language: 'python',
            code: `def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {} # val -> index
    
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
        
    return []

print("Two sum indices for target 9:", two_sum([2, 7, 11, 15], 9)) # [0, 1]`
          },
          pitfall: 'Pre-populating the entire hash map before checking: if `nums = [3, 2, 4]` and target is 6, checking 3 finds index 0 (itself!), returning `[0, 0]` incorrectly.',
          quickCheck: {
            question: 'Why does single-pass Two Sum check the map BEFORE inserting the current number?',
            options: ['To save CPU instructions', 'To avoid pairing an element with itself when target = 2 * num', 'To sort the hash map', 'Because dictionary keys must be unique'],
            correctIndex: 1,
            explanation: 'Checking before inserting ensures that the complement found in the map is a previously seen distinct element, never the current element itself.'
          }
        },
        {
          id: 'dsa-w2-d13-t6',
          topicNumber: 6,
          title: 'Group Anagrams: Canonical Key Hashing',
          explanation: [
            'Problem: Given an array of strings `strs`, group the anagrams together in any order.',
            'Anagram invariant: Two strings are anagrams if and only if they possess identical character counts.',
            'Two ways to construct a canonical hash map key:',
            '1. **Sorted String Key**: `tuple(sorted(s))` -> $O(N \\times K \\log K)$ time.',
            '2. **Character Count Tuple Key**: A 26-element tuple of counts `tuple(counts)` -> $O(N \\times K)$ time (optimal!).',
            'Group all matching words into a hash map list.'
          ],
          keyRules: [
            'Tuples are immutable and hashable in Python, making them valid dictionary keys.',
            'Character count tuple achieves optimal O(N * K) runtime where K is max word length.'
          ],
          codeSnippet: {
            id: 'dsa-snip-13-6',
            title: 'Group Anagrams via Frequency Key',
            description: 'Grouping anagrams with 26-element tuple hashing in O(N * K)',
            language: 'python',
            code: `from collections import defaultdict

def group_anagrams(strs: list[str]) -> list[list[str]]:
    groups = defaultdict(list)
    
    for s in strs:
        # Build 26-element frequency key
        count = [0] * 26
        for c in s:
            count[ord(c) - ord('a')] += 1
        groups[tuple(count)].append(s)
        
    return list(groups.values())

words = ["eat","tea","tan","ate","nat","bat"]
print("Anagram groups:", group_anagrams(words))`
          },
          pitfall: 'Using a mutable `list` as a Python dictionary key: lists are unhashable and raise `TypeError: unhashable type: list`. Always convert to `tuple(count)`.',
          quickCheck: {
            question: 'Why must the 26-element count array be converted to a tuple before being used as a dictionary key in Python?',
            options: ['Tuples use less memory', 'Tuples are immutable and therefore hashable; lists are mutable and unhashable', 'Dictionaries only accept tuples', 'To sort the counts'],
            correctIndex: 1,
            explanation: 'Python requires dictionary keys to be immutable so their hash codes never change; lists are mutable and cannot be hashed.'
          }
        },
        {
          id: 'dsa-w2-d13-t7',
          topicNumber: 7,
          title: 'Longest Consecutive Sequence: O(N) Hash Set Search',
          explanation: [
            'Problem: Given an unsorted array of integers, find the length of the longest consecutive elements sequence (e.g. `[100, 4, 200, 1, 3, 2]` -> 4 for `[1, 2, 3, 4]`). Must run in $O(N)$ time.',
            'Sorting takes $O(N \\log N)$, violating the constraint.',
            'Hash Set Solution:',
            '1. Insert all numbers into a hash set for $O(1)$ lookups.',
            '2. Iterate through numbers in the set. Check if `(num - 1)` is in the set.',
            '3. If `(num - 1)` is NOT in the set, this `num` is the START of a streak!',
            '4. Count streak length: `while (num + length) in set: length += 1`.',
            'Because each sequence is explored ONLY from its starting element, each number is visited at most twice, guaranteeing $O(N)$ total time!'
          ],
          keyRules: [
            'Only expand streaks when num - 1 is NOT in set (identifies sequence root).',
            'Runs in O(N) time with O(N) auxiliary space.'
          ],
          codeSnippet: {
            id: 'dsa-snip-13-7',
            title: 'Longest Consecutive Sequence in O(N)',
            description: 'Hash set streak discovery starting only at sequence roots',
            language: 'python',
            code: `def longest_consecutive(nums: list[int]) -> int:
    num_set = set(nums)
    max_streak = 0
    
    for x in num_set:
        # Check if x is the start of a consecutive sequence
        if x - 1 not in num_set:
            curr_num = x
            curr_streak = 1
            
            while curr_num + 1 in num_set:
                curr_num += 1
                curr_streak += 1
                
            max_streak = max(max_streak, curr_streak)
            
    return max_streak

print("Longest consecutive streak:", longest_consecutive([100, 4, 200, 1, 3, 2])) # 4 ([1, 2, 3, 4])`
          },
          pitfall: 'Starting a while loop expansion for EVERY number without checking `x - 1 not in num_set`: this degrades performance to $O(N^2)$ on sequences like `[1, 2, 3, 4, 5]`.',
          quickCheck: {
            question: 'Why is the check `if x - 1 not in num_set` critical to guaranteeing O(N) time in Longest Consecutive Sequence?',
            options: ['It avoids negative numbers', 'It ensures the while-loop is entered only at the true beginning of a sequence, avoiding redundant scanning of sub-streaks', 'It counts duplicates', 'It balances the hash table'],
            correctIndex: 1,
            explanation: 'Without this check, elements in the middle of a streak would initiate redundant O(N) scans, degrading total runtime to quadratic O(N^2).'
          }
        },
        {
          id: 'dsa-w2-d13-t8',
          topicNumber: 8,
          title: 'Design HashSet & HashMap from Scratch (Without Built-ins)',
          explanation: [
            'Interview benchmark: Implement MyHashMap from scratch without using any built-in hash map or dictionary libraries.',
            'Combine all principles learned today:',
            '- Pre-allocate a prime-sized bucket array (e.g. 1009 or 2069).',
            '- Implement bucket chaining with singly or doubly linked nodes.',
            '- Implement `put(key, val)`, `get(key)`, and `remove(key)` in $O(1)$ average time.',
            '- Handle collisions, updates, and key removals cleanly.'
          ],
          keyRules: [
            'Use a prime number capacity (e.g. 1009) to minimize collisions with simple modulo indexing.',
            'Implement clean node traversal for updates and deletions.'
          ],
          codeSnippet: {
            id: 'dsa-snip-13-8',
            title: 'Complete Hand-Built MyHashMap',
            description: 'Custom hash map with separate chaining from scratch',
            language: 'python',
            code: `class MapNode:
    def __init__(self, key=-1, val=-1, next=None):
        self.key = key
        self.val = val
        self.next = next

class MyHashMap:
    def __init__(self):
        self.capacity = 1009 # Prime number capacity
        self.buckets = [MapNode() for _ in range(self.capacity)] # Sentinels
        
    def _hash(self, key: int) -> int:
        return key % self.capacity
        
    def put(self, key: int, value: int) -> None:
        head = self.buckets[self._hash(key)]
        curr = head.next
        while curr:
            if curr.key == key:
                curr.val = value # Update
                return
            curr = curr.next
        head.next = MapNode(key, value, head.next) # Insert at front
        
    def get(self, key: int) -> int:
        curr = self.buckets[self._hash(key)].next
        while curr:
            if curr.key == key: return curr.val
            curr = curr.next
        return -1
        
    def remove(self, key: int) -> None:
        curr = self.buckets[self._hash(key)]
        while curr.next:
            if curr.next.key == key:
                curr.next = curr.next.next # Delete
                return
            curr = curr.next

my_map = MyHashMap()
my_map.put(1, 100); my_map.put(2, 200)
print("Key 1:", my_map.get(1)) # 100
my_map.remove(1)
print("Key 1 after removal:", my_map.get(1)) # -1`
          },
          pitfall: 'Allocating an array of 1,000,000 integers directly to mimic a hash map: wastes megabytes of RAM and fails if keys can be negative or strings.',
          quickCheck: {
            question: 'Why is a prime number (like 1009) preferred as the capacity for a basic hash table using modulo indexing?',
            options: ['Prime numbers compile faster', 'Prime modulo reduces clustering when keys share common divisors or patterns', 'Prime numbers take less memory', 'The Python interpreter requires primes'],
            correctIndex: 1,
            explanation: 'Using a prime modulus ensures that key patterns sharing factors with table capacity do not all hash to the same subset of buckets.'
          }
        }
      ]
    },
    {
      id: 'dsa-w2-d14',
      dayNumber: 14,
      weekNumber: 2,
      title: 'Module 2 Capstone: Production LRU Cache Design',
      subtitle: 'Doubly linked list + hash map hybrid, O(1) eviction mechanics & Module 2 Qualifying Exam',
      durationMinutes: 80,
      overview:
        'Synthesize linear pointer structures, doubly linked list mutations, and hash tables into the premier systems interview design challenge: the LRU (Least Recently Used) Cache. Build an uncompromising O(1) cache engine, followed by the Week 2 Qualifying Exam.',
      topics: [
        {
          id: 'dsa-w2-d14-t1',
          topicNumber: 1,
          title: 'The LRU Cache Challenge: Why Pure Arrays or Hash Maps Fail',
          explanation: [
            'An LRU (Least Recently Used) Cache holds a fixed capacity $C$.',
            'Operations:',
            '- `get(key)`: Retrieve value and mark key as Most Recently Used in $O(1)$.',
            '- `put(key, value)`: Insert/update key and mark as Most Recently Used in $O(1)$. If full, evict the Least Recently Used key in $O(1)$.',
            'Why single data structures fail:',
            '- A Hash Map gives $O(1)$ lookup, but CANNOT track element access ordering in $O(1)$.',
            '- An Array/List tracks ordering, but moving an element from middle to head costs $O(N)$ shifting.',
            '- The Hybrid Solution: Hash Map + Doubly Linked List!'
          ],
          keyRules: [
            'Both get and put MUST execute in strict O(1) time.',
            'Doubly linked list allows O(1) node removal given a node pointer.'
          ],
          codeSnippet: {
            id: 'dsa-snip-14-1',
            title: 'LRU Cache Architectural Blueprint',
            description: 'Hybrid Doubly Linked List + Hash Map structure',
            language: 'python',
            code: `# Blueprint Concept:
# Hash Map: key -> Node pointer (O(1) search)
# Doubly Linked List: Sentinel Head <-> Most Recent <-> ... <-> Least Recent <-> Sentinel Tail
# Moving a node to front:
# 1. Unlink node from current position (O(1))
# 2. Re-insert right after Sentinel Head (O(1))`
          },
          pitfall: 'Attempting to use a singly linked list for LRU Cache: deleting a node requires finding its predecessor, which takes O(N) search.',
          quickCheck: {
            question: 'Why is a Doubly Linked List required instead of a Singly Linked List for O(1) LRU Cache eviction?',
            options: ['Doubly linked lists use less memory', 'A doubly linked node can unlink itself in O(1) using its prev pointer, without traversing from the head', 'Singly linked lists cannot store values', 'Python forbids singly linked lists'],
            correctIndex: 1,
            explanation: 'To delete a node in O(1) time, you need immediate access to its predecessor (node.prev.next = node.next), which only a doubly linked list provides.'
          }
        },
        {
          id: 'dsa-w2-d14-t2',
          topicNumber: 2,
          title: 'Doubly Linked Node & Sentinel Design for LRU',
          explanation: [
            'Each node stores `key`, `val`, `prev`, and `next`.',
            'Why store `key` inside the node? When the cache is full, we must evict the least recently used node (`tail.prev`). To remove it from the Hash Map in $O(1)$, we must know its key (`del map[node.key]`)!',
            'Maintain permanent dummy `head` (Most Recently Used side) and dummy `tail` (Least Recently Used side).',
            'Sentinels eliminate all null checks during node insertions and removals.'
          ],
          keyRules: [
            'Node must store both key and value.',
            'Sentinel head and tail ensure non-null pointer invariants.'
          ],
          codeSnippet: {
            id: 'dsa-snip-14-2',
            title: 'LRU Node and Doubly Linked Primitives',
            description: 'Sentinel head/tail with O(1) add and remove primitives',
            language: 'python',
            code: `class LRUNode:
    def __init__(self, key=0, val=0):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None

class LRUList:
    def __init__(self):
        self.head = LRUNode() # MRU Sentinel
        self.tail = LRUNode() # LRU Sentinel
        self.head.next = self.tail
        self.tail.prev = self.head
        
    def add_to_head(self, node: LRUNode):
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node
        
    def remove(self, node: LRUNode):
        node.prev.next = node.next
        node.next.prev = node.prev`
          },
          pitfall: 'Forgetting to store `key` in the linked node: you can pop the node from the list, but you cannot delete its entry from the hash map without an O(N) scan.',
          quickCheck: {
            question: 'Why must the LRUNode store the `key` as well as the `val`?',
            options: ['To print the key', 'So when the LRU tail node is evicted, its corresponding entry in the hash map can be deleted in O(1)', 'For hash code calculation', 'Because values are optional'],
            correctIndex: 1,
            explanation: 'Evicting the LRU element gives us a node reference (tail.prev); to remove it from map, we need map.pop(node.key).'
          }
        },
        {
          id: 'dsa-w2-d14-t3',
          topicNumber: 3,
          title: 'The Full LRU Cache Implementation',
          explanation: [
            'Assemble the complete LRU Cache:',
            '1. `get(key)`:',
            '   - If key not in map: return -1.',
            '   - Node exists: move node to head (remove from current spot, add to head).',
            '   - Return `node.val`.',
            '2. `put(key, value)`:',
            '   - If key exists: update value and move to head.',
            '   - If key is new: create node, add to head, insert in map.',
            '   - If `len(map) > capacity`: remove `tail.prev` from list and delete from map.'
          ],
          keyRules: [
            'Every get and put moves accessed node to head.',
            'Capacity overflow removes tail.prev.'
          ],
          codeSnippet: {
            id: 'dsa-snip-14-3',
            title: 'Complete Production LRU Cache Class',
            description: 'Self-contained O(1) get and put LRU Cache',
            language: 'python',
            code: `class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.map = {} # key -> LRUNode
        self.head = LRUNode()
        self.tail = LRUNode()
        self.head.next = self.tail
        self.tail.prev = self.head
        
    def _remove(self, node: LRUNode):
        node.prev.next = node.next
        node.next.prev = node.prev
        
    def _add_to_head(self, node: LRUNode):
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node
        
    def get(self, key: int) -> int:
        if key not in self.map: return -1
        node = self.map[key]
        self._remove(node)
        self._add_to_head(node) # mark most recently used
        return node.val
        
    def put(self, key: int, value: int) -> None:
        if key in self.map:
            node = self.map[key]
            node.val = value
            self._remove(node)
            self._add_to_head(node)
        else:
            if len(self.map) >= self.capacity:
                # Evict least recently used (tail.prev)
                lru = self.tail.prev
                self._remove(lru)
                del self.map[lru.key]
            new_node = LRUNode(key, value)
            self._add_to_head(new_node)
            self.map[key] = new_node

cache = LRUCache(2)
cache.put(1, 10)
cache.put(2, 20)
print("Get 1:", cache.get(1)) # 10 (1 is now MRU)
cache.put(3, 30)             # Evicts key 2!
print("Get 2:", cache.get(2)) # -1 (evicted!)
print("Get 3:", cache.get(3)) # 30`
          },
          pitfall: 'Evicting `tail` instead of `tail.prev`: `tail` is the dummy sentinel node! Evicting it destroys list invariants and crashes with AttributeError.',
          quickCheck: {
            question: 'What node in the doubly linked list represents the Least Recently Used item to be evicted?',
            options: ['head', 'head.next', 'tail.prev', 'tail'],
            correctIndex: 2,
            explanation: 'head is MRU sentinel, head.next is most recently used, tail is LRU sentinel, and tail.prev is the least recently used element.'
          }
        },
        {
          id: 'dsa-w2-d14-t4',
          topicNumber: 4,
          title: 'LFU (Least Frequently Used) Cache Architecture',
          explanation: [
            'While LRU evicts based on access recency, LFU evicts based on access frequency (with recency as tie-breaker).',
            'Architecture:',
            '- `key_to_node`: maps `key -> (val, freq, node)`.',
            '- `freq_to_dll`: maps `freq -> DoublyLinkedList of nodes`.',
            '- `min_freq`: tracks the minimum frequency currently present in the cache.',
            'When an item is accessed: increment its `freq`, move it to `freq + 1` list. If its old list becomes empty and `freq == min_freq`, increment `min_freq`.',
            'Achieves $O(1)$ get and put for frequency-based caching!'
          ],
          keyRules: [
            'Maintain min_freq scalar to find eviction bucket in O(1).',
            'Tie-breaker within the same frequency is LRU.'
          ],
          codeSnippet: {
            id: 'dsa-snip-14-4',
            title: 'LFU Frequency Architecture Concept',
            description: 'Frequency buckets with Doubly Linked Lists in O(1)',
            language: 'python',
            code: `# LFU Architectural Model
# min_freq = 1
# freq_to_dll[1]: Node(B) <-> Node(C)
# freq_to_dll[2]: Node(A)
# Eviction: Pop from tail of freq_to_dll[min_freq]`
          },
          pitfall: 'Searching for the minimum frequency with a linear scan: would degrade eviction to O(N). Maintaining `min_freq` scalar guarantees O(1).',
          quickCheck: {
            question: 'How does LFU Cache determine which node to evict when multiple keys share the same lowest frequency?',
            options: ['Random choice', 'By using LRU (least recently used) among the tied keys', 'Alphabetical order', 'By key size'],
            correctIndex: 1,
            explanation: 'LFU specifies that if there is a tie in minimum access frequency, the least recently used key among them is evicted.'
          }
        },
        {
          id: 'dsa-w2-d14-t5',
          topicNumber: 5,
          title: 'Memory Overhead and Cache Line Prefetching in Linear Data Structures',
          explanation: [
            'Theoretical Big-O analysis ignores hardware cache lines, but real systems engineering requires mechanical sympathy:',
            '- Dynamic Arrays (`std::vector`, Python `list`): elements contiguous in RAM. Fetching 1 element loads 64 bytes into L1 cache, prefetching adjacent elements.',
            '- Linked Lists: each node requires separate heap allocation (`malloc`). Nodes are scattered across non-contiguous addresses. Traversing causes a cache miss on almost EVERY node!',
            'In benchmarks, scanning an array is up to 50x faster than traversing a linked list of identical size due to CPU cache prefetchers.'
          ],
          keyRules: [
            'Favor arrays over linked lists unless O(1) splicing or pointer persistence is strictly necessary.',
            'Pointer hopping degrades memory bandwidth.'
          ],
          codeSnippet: {
            id: 'dsa-snip-14-5',
            title: 'Memory Footprint Comparison',
            description: 'Byte overhead of linked list node vs contiguous array',
            language: 'python',
            code: `import sys

val = 42
# Contiguous list: 4-8 bytes per pointer reference in array
arr = [val] * 1000

# Linked node: object overhead + val reference + next reference = ~56 bytes per node
print(f"Array of 1,000 refs size: {sys.getsizeof(arr)} bytes")
print("Contiguous array is vastly lighter and cache-friendly!")`
          },
          pitfall: 'Using linked lists for everything because "insertions are O(1)": finding WHERE to insert requires an O(N) cache-miss traversal, making it slower in practice than array shifts.',
          quickCheck: {
            question: 'Why is linear search through a dynamic array significantly faster in practice than traversing a linked list of identical size?',
            options: ['Arrays use faster CPU arithmetic', 'Arrays reside in contiguous memory, allowing CPU hardware prefetchers to stream cache lines into L1 cache without cache misses', 'Linked lists use Python code only', 'Arrays disable operating system interrupts'],
            correctIndex: 1,
            explanation: 'Spatial locality allows CPU cache controllers to preload contiguous 64-byte blocks, while linked lists suffer from pointer-chasing cache misses across scattered heap memory.'
          }
        },
        {
          id: 'dsa-w2-d14-t6',
          topicNumber: 6,
          title: 'Concurrency Hazards in Linear Structures (Thread Safety)',
          explanation: [
            'Standard data structures (Python lists, `std::vector`, `std::unordered_map`) are NOT thread-safe.',
            'Concurrent mutations cause corrupted pointers:',
            '- Two threads pushing to a stack simultaneously can overwrite each other\'s elements or leak nodes.',
            '- Concurrent resizing of a hash table can trap linked chains in an infinite loop.',
            'Production solutions:',
            '- Mutex locking (`std::mutex`, `threading.Lock`).',
            '- Lock-free atomic structures (Treiber Stack, Michael-Scott Queue).'
          ],
          keyRules: [
            'Never share mutable linked lists or hash maps across threads without synchronization.',
            'Lock contention becomes the throughput bottleneck under high concurrency.'
          ],
          codeSnippet: {
            id: 'dsa-snip-14-6',
            title: 'Thread-Safe Synchronized Stack',
            description: 'Mutex protected thread-safe LIFO stack',
            language: 'python',
            code: `import threading

class ThreadSafeStack:
    def __init__(self):
        self._data = []
        self._lock = threading.Lock()
        
    def push(self, val):
        with self._lock:
            self._data.append(val)
            
    def pop(self):
        with self._lock:
            if not self._data: return None
            return self._data.pop()`
          },
          pitfall: 'Assuming Python GIL (Global Interpreter Lock) makes all operations thread-safe: multi-step operations like `if not stack.empty(): stack.pop()` still suffer from race conditions without explicit locks.',
          quickCheck: {
            question: 'What danger exists when multiple threads write to an unsynchronized hash table?',
            options: ['Memory corruption, lost writes, or infinite loops during bucket rehashing', 'The compiler deletes the code', 'CPU clock speed drops to 0', 'The operating system restarts'],
            correctIndex: 0,
            explanation: 'Concurrent unsynchronized mutations cause race conditions that corrupt bucket pointers and can create circular pointer loops.'
          }
        },
        {
          id: 'dsa-w2-d14-t7',
          topicNumber: 7,
          title: 'Linear Structures Diagnostic Matrix',
          explanation: [
            'Use this mental checklist when selecting linear data structures in technical interviews:',
            '- Need $O(1)$ random indexing? -> Dynamic Array (`vector`).',
            '- Need frequent insertions/deletions at known positions without shifting? -> Linked List.',
            '- Need LIFO parsing, undo history, or Next Greater Element? -> Monotonic Stack.',
            '- Need FIFO processing, level-order BFS, or sliding window extrema? -> Monotonic Queue / Deque.',
            '- Need $O(1)$ key-value search and existence testing? -> Hash Map / Hash Set.',
            '- Need $O(1)$ cache eviction combining lookup and access recency? -> LRU Cache (Hash Map + Doubly Linked List).'
          ],
          keyRules: [
            'Match the access pattern to the data structure invariant.',
            'Always specify time and space bounds before coding.'
          ],
          codeSnippet: {
            id: 'dsa-snip-14-7',
            title: 'Linear Data Structure Selector',
            description: 'Automated requirement to structure selector',
            language: 'python',
            code: `def select_structure(need: str) -> str:
    mapping = {
        "random_access": "Dynamic Array (O(1) access)",
        "lifo_nesting": "Stack (O(1) push/pop)",
        "fifo_pipeline": "Circular Queue / Deque",
        "key_lookup": "Hash Table (O(1) average)",
        "lru_cache": "Doubly Linked List + Hash Map"
    }
    return mapping.get(need, "Custom hybrid structure")

print("Requirement 'lru_cache' ->", select_structure("lru_cache"))`
          },
          pitfall: 'Using a linear structure where a tree or heap is needed (e.g. maintaining sorted order dynamically: inserting into array is O(N), balanced BST is O(log N)).',
          quickCheck: {
            question: 'Which data structure combination provides O(1) get and O(1) put for an LRU Cache?',
            options: ['Array + Binary Search Tree', 'Hash Map + Doubly Linked List', 'Two Stacks', 'Singly Linked List + Heap'],
            correctIndex: 1,
            explanation: 'A Hash Map provides O(1) key-to-node lookup, and a Doubly Linked List enables O(1) node detachment and front insertion.'
          }
        },
        {
          id: 'dsa-w2-d14-t8',
          topicNumber: 8,
          title: 'Week 2 Linear Structures Graduation Synthesis',
          explanation: [
            'Congratulations on completing Module 2 of the DSA Mastery Academy!',
            'You have mastered all fundamental linear and key-value data structures:',
            '- Singly & Doubly Linked Lists with Sentinel dummy heads.',
            '- Floyd\'s Tortoise and Hare Cycle Detection & intersection math.',
            '- In-place list reversals, merging, and interweaving deep copies.',
            '- Stacks (LIFO), parentheses validation, and RPN calculation.',
            '- Monotonic Stacks (Next Greater Element, Daily Temperatures, Largest Rectangle in Histogram).',
            '- Monotonic Queues for Sliding Window Maximum in $O(N)$ time.',
            '- FIFO Queues, Circular Buffers, and two-stack queues.',
            '- Hash Tables, collision strategies, load factors, and dynamic rehashing.',
            '- Production LRU Cache combining Hash Maps and Doubly Linked Lists.',
            'Next in Week 3: Hierarchical Structures: Binary Trees, BSTs, AVL Trees, Heaps & Tries.'
          ],
          keyRules: [
            'Pointer manipulation and hash mappings are now second nature.',
            'You are ready to conquer the Module 2 Qualifying Exam!'
          ],
          codeSnippet: {
            id: 'dsa-snip-14-8',
            title: 'Week 2 Graduation Summary',
            description: 'Milestone summary of linear algorithms mastered',
            language: 'python',
            code: `def print_week_2_summary():
    topics = [
        "1. Singly & Doubly Linked Lists & Floyd Cycle Detection",
        "2. In-Place Reversals, Merging & Reordering",
        "3. Stacks & Monotonic Stack Patterns",
        "4. Advanced Histograms & Monotonic Deque (Sliding Window Max)",
        "5. Circular Queues, Deques & Two-Stack Queue",
        "6. Hash Tables: Chaining, Probing, Load Factors & Rehashing",
        "7. Production LRU Cache Engine"
    ]
    print("=== DSA MASTERY ACADEMY: MODULE 2 COMPLETE ===")
    for t in topics:
        print(f" [V] {t}")
    print("\\nReady for Qualifying Exam!")

print_week_2_summary()`
          },
          pitfall: 'Assuming linked data structures are always best: remember contiguous cache locality rules in production systems.',
          quickCheck: {
            question: 'What is the time complexity to find the start of a cycle in a linked list using Floyds Algorithm?',
            options: ['O(N)', 'O(1)', 'O(N^2)', 'O(log N)'],
            correctIndex: 0,
            explanation: 'Floyd\'s Tortoise and Hare algorithm detects the cycle and locates the entrance in O(N) linear time and O(1) auxiliary space.'
          }
        }
      ]
    }
  ],
  quiz: {
    id: 'dsa-quiz-2',
    weekNumber: 2,
    title: 'Module 2 Qualifying Exam: Linear Structures, Stacks, Queues & Hash Maps',
    description: 'Verify your mastery of linked lists, Floyd cycle detection, monotonic stacks/queues, and LRU Cache architecture.',
    passingScorePercent: 80,
    questions: [
      {
        id: 'dsa-q2-1',
        question: 'In Floyd\'s Cycle Detection algorithm, after slow and fast pointers meet inside a loop, how is the cycle entrance located?',
        options: [
          'By reversing the entire linked list',
          'By resetting one pointer to head while leaving the other at the meeting point, then advancing both 1 step at a time until they collide',
          'By doubling the speed of both pointers',
          'By computing the hash code of all nodes'
        ],
        correctIndex: 1,
        explanation: 'Mathematical analysis proves that the distance from head to entrance equals the distance from the meeting point around the loop to the entrance. Advancing both at 1 step per iteration guarantees they meet at the entrance.'
      },
      {
        id: 'dsa-q2-2',
        question: 'What is the time complexity of the Sliding Window Maximum problem using a Monotonic Deque on an array of size N?',
        options: ['O(N * K)', 'O(N)', 'O(N log K)', 'O(K log N)'],
        correctIndex: 1,
        explanation: 'Each element enters the deque at most once and leaves the deque at most once, bounding total operations across the entire algorithm to 2N = O(N).'
      },
      {
        id: 'dsa-q2-3',
        question: 'Why are tombstone markers (DELETED sentinels) mandatory when removing elements from an open-addressing hash table?',
        options: [
          'To conserve memory',
          'To ensure subsequent searches continue probing past the deleted slot instead of stopping prematurely at None',
          'To encrypt keys',
          'To sort the table'
        ],
        correctIndex: 1,
        explanation: 'In open addressing, a search probe sequence stops when it reaches an empty slot. If a deleted element were replaced with None, any element inserted after it in the probe chain would become unreachable.'
      },
      {
        id: 'dsa-q2-4',
        question: 'What is the amortized time complexity of the pop() operation in a Queue implemented using two Stacks?',
        options: ['O(N)', 'O(1)', 'O(log N)', 'O(N^2)'],
        correctIndex: 1,
        explanation: 'Although a transfer from stack_in to stack_out costs O(N), it happens only when stack_out is empty. Each element is moved at most once across its lifetime, giving an amortized time of O(1).'
      },
      {
        id: 'dsa-q2-5',
        question: 'In a production LRU Cache, why must each node in the Doubly Linked List store the key as well as the value?',
        options: [
          'To print the key to console',
          'So that when the least recently used node is evicted from the tail, its entry can be removed from the Hash Map in O(1) time',
          'Because values are unhashable',
          'To calculate hash codes'
        ],
        correctIndex: 1,
        explanation: 'When capacity is exceeded, the LRU node (tail.prev) is evicted from the doubly linked list. Without knowing node.key, removing that node from the hash map would require an O(N) search.'
      }
    ]
  }
};
