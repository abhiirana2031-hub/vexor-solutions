import React, { useState } from 'react';
import { CodeRunner } from './CodeRunner';
import { SupportedLanguage } from '../types/course';
import { Terminal, Code2, Globe, Database } from 'lucide-react';

interface PresetProgram {
  id: string;
  name: string;
  category: 'Python' | 'Full Stack Web Dev' | 'C++ Systems' | 'DSA Mastery';
  language: SupportedLanguage;
  code: string;
}

const PRESET_PROGRAMS: PresetProgram[] = [
  // C++ Presets
  {
    id: 'cpp1',
    name: 'RAII & Smart Pointer Resource Ownership',
    category: 'C++ Systems',
    language: 'cpp',
    code: `#include <iostream>
#include <memory>
#include <string>

class SocketConnection {
private:
    std::string endpoint;
public:
    SocketConnection(std::string ep) : endpoint(std::move(ep)) {
        std::cout << "[RAII] Socket acquired to " << endpoint << "\\n";
    }
    ~SocketConnection() {
        std::cout << "[RAII] Socket closed deterministically\\n";
    }
    void transmit(const std::string& payload) {
        std::cout << "[SEND] " << payload.size() << " bytes -> " << endpoint << "\\n";
    }
};

int main() {
    std::cout << "=== C++20 Smart Pointer & RAII Lifecycle ===\\n";
    {
        auto conn = std::make_unique<SocketConnection>("10.0.0.42:8080");
        conn->transmit("SYN_ACK_PACKET");
    } // Deterministic destructor called right here!
    
    std::cout << "Out of scope: resource cleanly reclaimed.\\n";
    return 0;
}`,
  },
  {
    id: 'cpp2',
    name: 'Thread Synchronization & Mutex Locking',
    category: 'C++ Systems',
    language: 'cpp',
    code: `#include <iostream>
#include <vector>
#include <thread>
#include <mutex>

class ThreadSafeCounter {
private:
    int count = 0;
    std::mutex mtx;
public:
    void increment(int worker_id) {
        std::lock_guard<std::mutex> lock(mtx);
        count++;
        std::cout << "Worker " << worker_id << " incremented -> count=" << count << "\\n";
    }
    int get() {
        std::lock_guard<std::mutex> lock(mtx);
        return count;
    }
};

int main() {
    std::cout << "=== Multi-Threaded Atomic Mutex Work Queue ===\\n";
    ThreadSafeCounter counter;
    for (int i = 1; i <= 4; ++i) {
        counter.increment(i);
    }
    std::cout << "Final synchronized count: " << counter.get() << "\\n";
    return 0;
}`,
  },

  // DSA Presets
  {
    id: 'dsa1',
    name: 'Sliding Window Maximum & Monotonic Deque O(N)',
    category: 'DSA Mastery',
    language: 'python',
    code: `from collections import deque

def max_sliding_window(nums, k):
    """
    Find maximum in each sliding window of size k in O(N) time
    using a monotonic decreasing double-ended queue.
    """
    q = deque()  # stores indices of elements in decreasing value order
    result = []
    
    for i, n in enumerate(nums):
        # 1. Pop indices that fall outside the current sliding window [i - k + 1, i]
        while q and q[0] <= i - k:
            q.popleft()
            
        # 2. Maintain monotonic decreasing invariant: pop smaller elements
        while q and nums[q[-1]] < n:
            q.pop()
            
        q.append(i)
        
        # 3. Add to result once first window is filled
        if i >= k - 1:
            result.append(nums[q[0]])
            
    return result

test_nums = [1, 3, -1, -3, 5, 3, 6, 7]
window_k = 3
output = max_sliding_window(test_nums, window_k)
print(f"Input Array:  {test_nums}")
print(f"Window Size:  {window_k}")
print(f"Sliding Max:  {output}")`,
  },
  {
    id: 'dsa2',
    name: 'LRU Cache with Doubly Linked List & Map O(1)',
    category: 'DSA Mastery',
    language: 'python',
    code: `class DNode:
    def __init__(self, key=0, val=0):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.map = {}
        # Sentinel dummy nodes
        self.head = DNode()
        self.tail = DNode()
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node):
        node.prev.next = node.next
        node.next.prev = node.prev

    def _insert_front(self, node):
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node

    def get(self, key: int) -> int:
        if key not in self.map:
            return -1
        node = self.map[key]
        self._remove(node)
        self._insert_front(node)
        return node.val

    def put(self, key: int, value: int) -> None:
        if key in self.map:
            self._remove(self.map[key])
        node = DNode(key, value)
        self.map[key] = node
        self._insert_front(node)
        if len(self.map) > self.cap:
            lru = self.tail.prev
            self._remove(lru)
            del self.map[lru.key]

cache = LRUCache(2)
cache.put(1, 100)
cache.put(2, 200)
print("get(1):", cache.get(1))  # returns 100, marks 1 as recently used
cache.put(3, 300)               # evicts key 2
print("get(2) (evicted?):", cache.get(2))  # returns -1
cache.put(4, 400)               # evicts key 1
print("get(1) (evicted?):", cache.get(1))  # returns -1
print("get(3):", cache.get(3))  # returns 300
print("get(4):", cache.get(4))  # returns 400`,
  },
  {
    id: 'dsa3',
    name: 'Floyd Linear O(N) Min-Heapify in C++',
    category: 'DSA Mastery',
    language: 'cpp',
    code: `#include <iostream>
#include <vector>
#include <algorithm>

void siftDown(std::vector<int>& arr, int n, int i) {
    int smallest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;

    if (left < n && arr[left] < arr[smallest]) smallest = left;
    if (right < n && arr[right] < arr[smallest]) smallest = right;

    if (smallest != i) {
        std::swap(arr[i], arr[smallest]);
        siftDown(arr, n, smallest);
    }
}

void buildMinHeap(std::vector<int>& arr) {
    int n = arr.size();
    // Start from last non-leaf parent down to index 0: O(N) linear time
    for (int i = n / 2 - 1; i >= 0; --i) {
        siftDown(arr, n, i);
    }
}

int main() {
    std::cout << "=== Floyd Linear O(N) Heapify ===\\n";
    std::vector<int> nums = {45, 12, 85, 32, 89, 39, 69, 44, 42, 1, 10};
    
    std::cout << "Original array: ";
    for (int x : nums) std::cout << x << " ";
    std::cout << "\\n";

    buildMinHeap(nums);

    std::cout << "Min-Heap root (minimum element): " << nums[0] << "\\n";
    std::cout << "Heapified array: ";
    for (int x : nums) std::cout << x << " ";
    std::cout << "\\n";
    return 0;
}`,
  },

  // Full Stack Presets
  {
    id: 'fs1',
    name: 'ES6+ Data Transformation & Async Pipelines',
    category: 'Full Stack Web Dev',
    language: 'javascript',
    code: `// Fetch simulation and functional array transformations
const users = [
  { id: 1, name: 'Alice Dev', role: 'admin', active: true, commits: 142 },
  { id: 2, name: 'Bob Engineer', role: 'member', active: false, commits: 38 },
  { id: 3, name: 'Charlie Lead', role: 'admin', active: true, commits: 285 },
  { id: 4, name: 'Dana Architect', role: 'maintainer', active: true, commits: 194 }
];

console.log("=== Active Admin Engineers ===");
const activeAdmins = users
  .filter(u => u.active && (u.role === 'admin' || u.role === 'maintainer'))
  .map(u => ({ ...u, badge: \`🎖️ \${u.role.toUpperCase()}\` }))
  .sort((a, b) => b.commits - a.commits);

console.log(JSON.stringify(activeAdmins, null, 2));

const totalCommits = activeAdmins.reduce((sum, u) => sum + u.commits, 0);
console.log(\`Total team commits: \${totalCommits}\`);`,
  },
  {
    id: 'fs2',
    name: 'Express & RESTful Routing Simulation',
    category: 'Full Stack Web Dev',
    language: 'javascript',
    code: `// In-memory REST API Router pattern
class MockApiServer {
  constructor() {
    this.routes = {};
    this.posts = [
      { id: '101', title: 'React Server Components', tags: ['react', 'nextjs'] },
      { id: '102', title: 'PostgreSQL Index Optimization', tags: ['sql', 'database'] },
      { id: '103', title: 'Docker Multi-stage Builds', tags: ['devops', 'docker'] }
    ];
  }

  get(path, handler) {
    this.routes[\`GET \${path}\`] = handler;
  }

  post(path, handler) {
    this.routes[\`POST \${path}\`] = handler;
  }

  handleRequest(method, path, body = null) {
    const key = \`\${method} \${path}\`;
    console.log(\`--> Incoming Request: \${key}\`);
    if (this.routes[key]) {
      return this.routes[key]({ body });
    }
    return { status: 404, error: 'Route not found' };
  }
}

const app = new MockApiServer();
app.get('/api/posts', () => ({ status: 200, count: app.posts.length, data: app.posts }));
app.post('/api/posts', (req) => {
  const newPost = { id: String(Date.now()), ...req.body };
  app.posts.push(newPost);
  return { status: 201, message: 'Created successfully', post: newPost };
});

console.log(app.handleRequest('GET', '/api/posts'));
console.log(app.handleRequest('POST', '/api/posts', { title: 'CI/CD with GitHub Actions', tags: ['git', 'ci'] }));`,
  },
  {
    id: 'fs3',
    name: 'Relational SQL Query & Join Engine',
    category: 'Full Stack Web Dev',
    language: 'sql',
    code: `-- Relational schema & analytical aggregation queries
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'student'
);

CREATE TABLE course_enrollments (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  course_slug VARCHAR(100),
  completed_lessons INT DEFAULT 0
);

-- Analytical aggregation with JOIN
SELECT 
  u.name,
  u.email,
  e.course_slug,
  e.completed_lessons,
  CASE WHEN e.completed_lessons >= 28 THEN 'CERTIFIED' ELSE 'IN_PROGRESS' END AS status
FROM users u
INNER JOIN course_enrollments e ON u.id = e.user_id
WHERE e.completed_lessons > 5
ORDER BY e.completed_lessons DESC;`,
  },
  {
    id: 'fs4',
    name: 'Git & Deployment Bash Script',
    category: 'Full Stack Web Dev',
    language: 'bash',
    code: `#!/usr/bin/env bash
# Production Release Automation Pipeline
echo "🚀 Initializing Automated CI/CD Deployment Flow..."

echo "[1/4] Checking Git working directory..."
git status -s

echo "[2/4] Running automated test suite..."
echo "  ✓ 15/15 unit test suites passing"
echo "  ✓ ESLint static code verification clean"

echo "[3/4] Building optimized production bundles..."
echo "  ✓ Vite bundle generated: dist/index.html (1.2 kB)"
echo "  ✓ CSS chunk created: dist/assets/index.css (18.4 kB gzip)"
echo "  ✓ JS bundle: dist/assets/index.js (142.1 kB gzip)"

echo "[4/4] Deploying artifact to Cloud edge CDN..."
echo "✅ Deployed successfully! Health check HTTP 200 OK."`,
  },

  // Python Presets
  {
    id: 'py1',
    name: 'Bytecode & Memory References (Week 1)',
    category: 'Python',
    language: 'python',
    code: `# Inspecting object identity and small integer caching
a = 256
b = 256
print("a is b (interned singleton)?", a is b)
print("a memory address:", id(a))

# Tuple unpacking without temporary variable
x = "First"
y = "Second"
x, y = y, x
print(f"Swapped: x={x}, y={y}")

# Slicing sequence backwards
word = "Pythonic"
print("Reversed word:", word[::-1])`,
  },
  {
    id: 'py2',
    name: 'Inverted Index & Dict Comprehension (Week 2)',
    category: 'Python',
    language: 'python',
    code: `# Building a document inverted index with dictionaries and sets
docs = {
    101: "clean python architecture and decorators",
    102: "data structures with hash maps and lists",
    103: "clean code practices and python decorators"
}

index = {}
for doc_id, text in docs.items():
    for word in text.split():
        if word not in index:
            index[word] = set()
        index[word].add(doc_id)

print("Inverted index entries:")
for w in sorted(index.keys()):
    print(f"  '{w}': {sorted(list(index[w]))}")

# Finding docs mentioning both 'python' and 'decorators'
common = index["python"] & index["decorators"]
print("\\nDocs with both 'python' and 'decorators':", sorted(list(common)))`,
  },
  {
    id: 'py3',
    name: 'OOP & Dunder Vector Math (Week 3)',
    category: 'Python',
    language: 'python',
    code: `class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __repr__(self):
        return f"Vector({self.x}, {self.y})"

    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)

    def __mul__(self, scalar):
        return Vector(self.x * scalar, self.y * scalar)

v1 = Vector(3, 7)
v2 = Vector(2, 4)
v3 = v1 + v2
print("Vector 1:", v1)
print("Vector 2:", v2)
print("v1 + v2 =", v3)
print("v3 * 2  =", v3 * 2)`,
  },
  {
    id: 'py4',
    name: 'Async Pipeline Simulation (Week 4)',
    category: 'Python',
    language: 'python',
    code: `# Simulating asynchronous pipeline execution
tasks = [
    {"id": "JOB-1", "duration_ms": 20},
    {"id": "JOB-2", "duration_ms": 35},
    {"id": "JOB-3", "duration_ms": 15}
]

print("Starting simulated async batch...")
processed = []
for t in tasks:
    print(f"  -> Dispatched {t['id']} (est: {t['duration_ms']}ms)")
    processed.append(t['id'])

print("All tasks resolved!")
print("Completed batch summary:", processed)`,
  },
];

export const SandboxPlayground: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<PresetProgram>(PRESET_PROGRAMS[0]);
  const [activeCategory, setActiveCategory] = useState<'All' | 'Full Stack Web Dev' | 'Python' | 'C++ Systems' | 'DSA Mastery'>('All');

  const filteredPresets = PRESET_PROGRAMS.filter(
    (p) => activeCategory === 'All' || p.category === activeCategory
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Terminal className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            <span>Multi-Language Interactive Code Sandbox</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Experiment freely with C++, Python, DSA algorithms, JavaScript, TypeScript, SQL, and Bash script runners right in your browser.
          </p>
        </div>

        {/* Category Pills & Preset Selector */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold">
            {(['All', 'Full Stack Web Dev', 'Python', 'C++ Systems', 'DSA Mastery'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <select
            value={selectedPreset.id}
            onChange={(e) => {
              const found = PRESET_PROGRAMS.find((p) => p.id === e.target.value);
              if (found) setSelectedPreset(found);
            }}
            className="px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer shadow-sm"
          >
            {filteredPresets.map((p) => (
              <option key={p.id} value={p.id}>
                [{p.language.toUpperCase()}] {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <CodeRunner
        key={selectedPreset.id}
        initialCode={selectedPreset.code}
        language={selectedPreset.language}
        title={`[${selectedPreset.language.toUpperCase()}] ${selectedPreset.name}`}
      />
    </div>
  );
};
