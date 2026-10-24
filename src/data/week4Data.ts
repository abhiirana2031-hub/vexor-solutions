import { WeekModule } from '../types/course';

export const WEEK_4_MODULE: WeekModule = {
  weekNumber: 4,
  title: 'Asyncio, Systems Concurrency & Production Python',
  theme: 'Decorators, Async/Await, Threading, Multiprocessing, GIL, Testing & Capstone',
  description: 'Elevate to senior-engineer Python capabilities with 7 comprehensive topics per day. Master closures, decorators, asynchronous coroutines, event loops, process pools, thread safety, testing suites, and production package architectures.',
  conceptImage: '/src/assets/images/python_w4_concurrency_async_1792862444756.jpg',
  imageAlt: 'Python Asynchronous Event Loop, Threading, and Process Pools Architecture',
  days: [
    {
      id: 'w4-d22',
      dayNumber: 22,
      weekNumber: 4,
      title: 'Decorators, Closures & Functional Metaprogramming',
      subtitle: '7 Topics: Lexical Scoping & Closures, Decorator Anatomy, functools.wraps, Decorators with Arguments, Class-Based Decorators, Decorator Stacking Order, Practical Caching & Rate Limiting',
      durationMinutes: 70,
      overview: 'Decorators are one of Python\'s signature design powers. Learn how lexical closures capture state, how to write clean higher-order functions, and how to preserve function metadata across 7 in-depth topics.',
      topics: [
        {
          id: 't22-1',
          topicNumber: 1,
          title: 'Lexical Scoping and Closures',
          explanation: [
            'A closure is a function that retains access to variables in its enclosing lexical scope even after that outer scope has finished execution.',
            'Python achieves this via cell objects in `func.__closure__`. If you need to reassign a variable in an outer non-global scope, use the `nonlocal` keyword.'
          ],
          keyRules: [
            'Closures capture free variables from enclosing parent functions',
            'Use `nonlocal` to modify an enclosing variable instead of creating a local one'
          ],
          codeSnippet: {
            id: 'cs4-22-1',
            title: 'Closure State Retention',
            description: 'Creating a stateful closure using lexical scoping and nonlocal.',
            language: 'python',
            code: `def make_counter(start=0):\n    count = start\n    def step():\n        nonlocal count\n        count += 1\n        return count\n    return step\n\nc1 = make_counter(10)\nprint("Step 1:", c1())\nprint("Step 2:", c1())\nprint("Closure cells:", len(c1.__closure__))`,
            expectedOutput: `Step 1: 11\nStep 2: 12\nClosure cells: 1`
          }
        },
        {
          id: 't22-2',
          topicNumber: 2,
          title: 'The Anatomy of a Python Decorator',
          explanation: [
            'A decorator is simply a callable that takes a function as an argument and returns a replacement callable.',
            'The `@decorator` syntax is pure syntactic sugar: writing `@my_dec` before `def foo():` is exactly equivalent to `foo = my_dec(foo)`.'
          ],
          keyRules: [
            '`@dec` is syntactic sugar for `fn = dec(fn)`',
            'Wrappers typically accept `*args, **kwargs` and return the result'
          ],
          codeSnippet: {
            id: 'cs4-22-2',
            title: 'Basic Decorator Transformation',
            description: 'Building an audit logging decorator from scratch.',
            language: 'python',
            code: `def audit_log(func):\n    def wrapper(*args, **kwargs):\n        print(f"[AUDIT] Calling {func.__name__} with {args}")\n        result = func(*args, **kwargs)\n        print(f"[AUDIT] {func.__name__} returned {result}")\n        return result\n    return wrapper\n\n@audit_log\ndef add(a, b):\n    return a + b\n\nprint("Result:", add(3, 7))`,
            expectedOutput: `[AUDIT] Calling add with (3, 7)\n[AUDIT] add returned 10\nResult: 10`
          }
        },
        {
          id: 't22-3',
          topicNumber: 3,
          title: 'Preserving Metadata with functools.wraps',
          explanation: [
            'When a function is wrapped, its `__name__`, `__doc__`, and `__annotations__` are replaced by the wrapper\'s attributes by default, breaking introspection and debuggers.',
            'Decorating the wrapper with `@functools.wraps(func)` copies over all identity attributes and sets `__wrapped__` to point directly to the original function.'
          ],
          keyRules: [
            'Always decorate inner wrappers with `@functools.wraps(func)`',
            'Preserves docstrings, function names, and signature introspection'
          ],
          codeSnippet: {
            id: 'cs4-22-3',
            title: 'Using functools.wraps',
            description: 'Verifying function name and docstring preservation.',
            language: 'python',
            code: `from functools import wraps\n\ndef logged(func):\n    @wraps(func)\n    def wrapper(*args, **kwargs):\n        return func(*args, **kwargs)\n    return wrapper\n\n@logged\ndef calculate_tax(amount: float) -> float:\n    """Calculates flat 15% rate."""\n    return amount * 0.15\n\nprint("Function name preserved:", calculate_tax.__name__)\nprint("Docstring preserved:", calculate_tax.__doc__)`,
            expectedOutput: `Function name preserved: calculate_tax\nDocstring preserved: Calculates flat 15% rate.`
          }
        },
        {
          id: 't22-4',
          topicNumber: 4,
          title: 'Decorators with Arguments (3-Layer Factory)',
          explanation: [
            'If a decorator requires parameters (e.g., `@retry(max_attempts=3)`), you need a 3-layer function factory.',
            'Layer 1 accepts decorator arguments; Layer 2 accepts the target function; Layer 3 is the inner wrapper that executes the actual calls.'
          ],
          keyRules: [
            'A decorator with arguments is a function that RETURNS a decorator',
            'Requires 3 nested functions or a class-based approach'
          ],
          codeSnippet: {
            id: 'cs4-22-4',
            title: 'Parameterized Decorator Factory',
            description: 'Building a repeat execution decorator that takes parameters.',
            language: 'python',
            code: `from functools import wraps\n\ndef repeat(num_times):\n    def decorator_repeat(func):\n        @wraps(func)\n        def wrapper(*args, **kwargs):\n            for _ in range(num_times - 1):\n                func(*args, **kwargs)\n            return func(*args, **kwargs)\n        return wrapper\n    return decorator_repeat\n\n@repeat(num_times=3)\ndef greet(name):\n    print(f"Hello, {name}!")\n\ngreet("Pythonist")`,
            expectedOutput: `Hello, Pythonist!\nHello, Pythonist!\nHello, Pythonist!`
          }
        },
        {
          id: 't22-5',
          topicNumber: 5,
          title: 'Class-Based Decorators with __call__',
          explanation: [
            'Instead of nested functions, you can implement decorators as classes by implementing `__init__(self, func)` and `__call__(self, *args, **kwargs)`.',
            'Class decorators are particularly well-suited for stateful decorators, such as execution call counters, memoization tables, or circuit breakers.'
          ],
          keyRules: [
            '`__init__` receives the decorated function',
            '`__call__` executes on every function invocation'
          ],
          codeSnippet: {
            id: 'cs4-22-5',
            title: 'Call Counter Class Decorator',
            description: 'Tracking function invocations with a stateful class decorator.',
            language: 'python',
            code: `class CallTracker:\n    def __init__(self, func):\n        self.func = func\n        self.call_count = 0\n    def __call__(self, *args, **kwargs):\n        self.call_count += 1\n        return self.func(*args, **kwargs)\n\n@CallTracker\ndef query_db():\n    return "Data loaded"\n\nquery_db()\nquery_db()\nquery_db()\nprint(f"query_db was invoked {query_db.call_count} times")`,
            expectedOutput: `query_db was invoked 3 times`
          }
        },
        {
          id: 't22-6',
          topicNumber: 6,
          title: 'Decorator Stacking and Evaluation Order',
          explanation: [
            'When multiple decorators are applied to a single function, they are evaluated bottom-to-top (inside-out).',
            '`@decA\n@decB\ndef foo(): pass` is evaluated as `foo = decA(decB(foo))`. The inner decorator runs first and wraps `foo`, then the outer decorator wraps that result.'
          ],
          keyRules: [
            'Decorators are applied from bottom-to-top at definition time',
            'Outer wrappers execute first during function calls'
          ],
          codeSnippet: {
            id: 'cs4-22-6',
            title: 'Tracing Decorator Stacking Order',
            description: 'Demonstrating inside-out wrapping order.',
            language: 'python',
            code: `def tag_bold(fn):\n    def wrapper(*args, **kwargs):\n        return f"<b>{fn(*args, **kwargs)}</b>"\n    return wrapper\n\ndef tag_italic(fn):\n    def wrapper(*args, **kwargs):\n        return f"<i>{fn(*args, **kwargs)}</i>"\n    return wrapper\n\n@tag_bold\n@tag_italic\ndef message(text):\n    return text\n\nprint("Rendered HTML:", message("Decorators Stacked!"))`,
            expectedOutput: `Rendered HTML: <b><i>Decorators Stacked!</i></b>`
          }
        },
        {
          id: 't22-7',
          topicNumber: 7,
          title: 'Production Caching with functools.lru_cache',
          explanation: [
            'Python\'s standard library provides `@functools.lru_cache(maxsize=128)`: a high-performance Least Recently Used memoization decorator.',
            'It caches function outputs based on input arguments, turning exponential recursive algorithms (like naive Fibonacci $O(2^n)$) into linear $O(n)$ computations.'
          ],
          keyRules: [
            'Arguments to lru_cache functions must be hashable',
            'Use `lru_cache(maxsize=None)` for unbounded caching'
          ],
          codeSnippet: {
            id: 'cs4-22-7',
            title: 'High-Speed Memoization with lru_cache',
            description: 'Accelerating recursive computation using lru_cache.',
            language: 'python',
            code: `from functools import lru_cache\n\n@lru_cache(maxsize=64)\ndef fast_fib(n):\n    if n < 2: return n\n    return fast_fib(n - 1) + fast_fib(n - 2)\n\nprint("fib(35) computed instantly:", fast_fib(35))\nprint("Cache info:", fast_fib.cache_info())`,
            expectedOutput: `fib(35) computed instantly: 9227465\nCache info: CacheInfo(hits=33, misses=36, maxsize=64, currsize=36)`
          }
        }
      ],
      practiceChallenge: {
        title: 'Create an Execution Timing Decorator',
        instructions: [
          'Create a decorator `@timer` that records `time.perf_counter()` before and after calling the function.',
          'Print elapsed seconds with 4 decimal places.',
          'Use `@functools.wraps` to preserve function identity.'
        ],
        starterCode: `import time\nfrom functools import wraps\n\n# TODO: create @timer decorator\n`,
        solutionCode: `import time\nfrom functools import wraps\n\ndef timer(func):\n    @wraps(func)\n    def wrapper(*args, **kwargs):\n        start = time.perf_counter()\n        result = func(*args, **kwargs)\n        elapsed = time.perf_counter() - start\n        print(f"{func.__name__} executed in {elapsed:.4f}s")\n        return result\n    return wrapper\n\n@timer\ndef work():\n    return sum(range(100000))\n\nprint("Result:", work())`,
        hints: ['Use start = time.perf_counter() before func(*args, **kwargs) and elapsed = time.perf_counter() - start']
      },
      keyTakeaways: [
        'Closures capture enclosing state via cell objects.',
        '@dec is syntactic sugar for fn = dec(fn).',
        'Always apply @wraps(func) to protect function metadata.',
        'Decorators stack bottom-to-top at definition time.'
      ]
    },
    {
      id: 'w4-d23',
      dayNumber: 23,
      weekNumber: 4,
      title: 'File I/O, Serialization & Pathlib',
      subtitle: '7 Topics: Context Managed File I/O, Text vs Binary Buffers, Modern Paths with pathlib, JSON Parsing & Custom Encoders, CSV DictReader/DictWriter, Security Risks of Pickle, Binary Packing with struct',
      durationMinutes: 65,
      overview: 'Interact reliably with storage and network data streams. Learn how context managers prevent file descriptor leaks, how pathlib replaces legacy os.path, and how to safely serialize structured data across 7 comprehensive topics.',
      topics: [
        {
          id: 't23-1',
          topicNumber: 1,
          title: 'Deterministic File I/O with Context Managers',
          explanation: [
            'Operating systems allocate a finite pool of file descriptors. Failing to close files can cause system descriptor starvation, buffer flushes to be skipped, or file locking errors.',
            'The `with open("file.txt", "w", encoding="utf-8") as f:` construct guarantees the file descriptor is closed and buffers are flushed immediately upon leaving the block.'
          ],
          keyRules: [
            'Always specify `encoding="utf-8"` explicitly for text files',
            'Always use `with` statements for automatic resource cleanup'
          ],
          codeSnippet: {
            id: 'cs4-23-1',
            title: 'Context-Managed File Writing and Reading',
            description: 'Safely writing and reading data using open context managers.',
            language: 'python',
            code: `import io\n\n# Simulating file stream with io.StringIO\nstream = io.StringIO()\nstream.write("Log Entry: System started\\nStatus: Operational")\nstream.seek(0)\n\nfor line in stream:\n    print("Read:", line.strip())`,
            expectedOutput: `Read: Log Entry: System started\nRead: Status: Operational`
          }
        },
        {
          id: 't23-2',
          topicNumber: 2,
          title: 'Text vs Binary Mode (UTF-8 Encodings vs Raw Bytes)',
          explanation: [
            'In text mode (`"r"`), Python decodes raw bytes into Unicode `str` objects according to an encoding (like UTF-8) and translates platform newline conventions (`\\r\\n` to `\\n`).',
            'In binary mode (`"rb"`), Python reads raw `bytes` objects without modification, essential for images, audio, network packets, and compiled formats.'
          ],
          keyRules: [
            'Text mode returns `str`; binary mode returns `bytes`',
            'Encoding errors occur when byte sequences cannot be decoded to UTF-8'
          ],
          codeSnippet: {
            id: 'cs4-23-2',
            title: 'Text vs Raw Bytes Comparison',
            description: 'Inspecting string encoding to UTF-8 byte representations.',
            language: 'python',
            code: `message = "Python 🐍"\nbyte_data = message.encode("utf-8")\nprint("String:", message, "type:", type(message))\nprint("Raw bytes:", byte_data, "length:", len(byte_data))\nprint("Decoded back:", byte_data.decode("utf-8"))`,
            expectedOutput: `String: Python 🐍 type: <class 'str'>\nRaw bytes: b'Python \\xf0\\x9f\\x90\\x8d' length: 11\nDecoded back: Python 🐍`
          }
        },
        {
          id: 't23-3',
          topicNumber: 3,
          title: 'Modern Filesystem Navigation with pathlib',
          explanation: [
            'Python 3.4 introduced `pathlib`, providing object-oriented filesystem paths that replace clunky `os.path` string manipulations.',
            'Path objects support operator overloading with the `/` slash operator for platform-independent path joining (`path / "subdir" / "file.txt"`).'
          ],
          keyRules: [
            'Use `/` operator to join paths cleanly across OSes',
            'Methods `.exists()`, `.is_file()`, `.read_text()`, `.suffix` provide unified access'
          ],
          codeSnippet: {
            id: 'cs4-23-3',
            title: 'Pathlib Operations',
            description: 'Constructing and inspecting path objects.',
            language: 'python',
            code: `from pathlib import Path\n\np = Path("/var/log/app/service.log")\nprint("File name:", p.name)\nprint("File stem:", p.stem)\nprint("Extension:", p.suffix)\nprint("Parent folder:", p.parent.name)\njoined = Path("home") / "developer" / "code"\nprint("Joined path:", joined)`,
            expectedOutput: `File name: service.log\nFile stem: service\nExtension: .log\nParent folder: app\nJoined path: home/developer/code`
          }
        },
        {
          id: 't23-4',
          topicNumber: 4,
          title: 'JSON Serialization & Custom JSONEncoders',
          explanation: [
            'The `json` module translates Python data structures to JSON strings (`dumps`) and vice versa (`loads`).',
            'Standard types (dicts, lists, strings, numbers, booleans) serialize automatically. Non-standard types (like `datetime`, `UUID`, or custom classes) require a custom `JSONEncoder` subclass or `default` serializer function.'
          ],
          keyRules: [
            '`json.dumps(obj)` serializes to string; `json.loads(str)` deserializes',
            'Pass `default=callable` to handle custom objects like datetimes'
          ],
          codeSnippet: {
            id: 'cs4-23-4',
            title: 'Custom Object JSON Serialization',
            description: 'Serializing non-standard types using custom default function.',
            language: 'python',
            code: `import json\nfrom datetime import date\n\ndef custom_serializer(obj):\n    if isinstance(obj, date):\n        return obj.isoformat()\n    raise TypeError(f"Type {type(obj)} not serializable")\n\npayload = {"event": "conference", "date": date(2026, 10, 24)}\njson_str = json.dumps(payload, default=custom_serializer, indent=2)\nprint(json_str)`,
            expectedOutput: `{\n  "event": "conference",\n  "date": "2026-10-24"\n}`
          }
        },
        {
          id: 't23-5',
          topicNumber: 5,
          title: 'Structured Tabular Data with CSV DictReader and DictWriter',
          explanation: [
            'Python\'s `csv` module includes `DictReader` and `DictWriter` for reading and writing CSV rows mapped directly to dictionaries keyed by header column names.',
            'This avoids brittle index-based column lookups (`row[3]`) and automatically accommodates reordered CSV columns.'
          ],
          keyRules: [
            '`csv.DictReader` parses rows into `{column: value}` dicts',
            '`csv.DictWriter` requires explicit `fieldnames` and `writeheader()`'
          ],
          codeSnippet: {
            id: 'cs4-23-5',
            title: 'Reading CSV into Dictionaries with DictReader',
            description: 'Parsing CSV data streams into structured dictionaries.',
            language: 'python',
            code: `import csv\nimport io\n\ncsv_data = "id,name,role\\n101,Alice,Engineer\\n102,Bob,Architect"\nreader = csv.DictReader(io.StringIO(csv_data))\nfor row in reader:\n    print(f"User {row['id']}: {row['name']} ({row['role']})")`,
            expectedOutput: `User 101: Alice (Engineer)\nUser 102: Bob (Architect)`
          }
        },
        {
          id: 't23-6',
          topicNumber: 6,
          title: 'Serialization Security: The Risks of pickle',
          explanation: [
            'Python\'s `pickle` module can serialize arbitrary Python objects. However, unpickling untrusted data is a severe security vulnerability: `pickle.loads()` can execute arbitrary shell commands via `__reduce__` exploit payloads.',
            'Rule of thumb: Never unpickle untrusted data from network requests. Prefer JSON, Protocol Buffers, or message packs for untrusted inputs.'
          ],
          keyRules: [
            '`pickle` is not secure against erroneous or maliciously constructed data',
            'Use JSON or protobufs for untrusted network payloads'
          ],
          codeSnippet: {
            id: 'cs4-23-6',
            title: 'Pickle Serialization Warning',
            description: 'Demonstrating safe standard serialization alternatives to pickle.',
            language: 'python',
            code: `import json\n\n# Safe serialization contract for distributed services\nsafe_data = {"user_id": 481, "role": "admin"}\npayload = json.dumps(safe_data)\nprint("Safe portable JSON payload:", payload)`,
            expectedOutput: `Safe portable JSON payload: {"user_id": 481, "role": "admin"}`
          }
        },
        {
          id: 't23-7',
          topicNumber: 7,
          title: 'Binary Packing & Unpacking with struct',
          explanation: [
            'For binary wire protocols, file headers, and low-level C interoperability, the `struct` module packs Python values into compact byte sequences matching C struct layouts.',
            'Format specifiers like `>I` (big-endian 32-bit uint) or `<h` (little-endian 16-bit signed short) allow byte-exact network parsing.'
          ],
          keyRules: [
            '`struct.pack(fmt, *args)` converts Python values into bytes',
            '`struct.unpack(fmt, bytes)` decodes bytes back into a tuple'
          ],
          codeSnippet: {
            id: 'cs4-23-7',
            title: 'Binary Packing with struct',
            description: 'Packing network header integers into raw bytes.',
            language: 'python',
            code: `import struct\n\n# Format: > (big-endian) I (4-byte unsigned int) H (2-byte unsigned short)\npacket = struct.pack(">IH", 1024, 80)\nprint("Packed bytes:", packet, "byte size:", len(packet))\nunpacked = struct.unpack(">IH", packet)\nprint("Unpacked values:", unpacked)`,
            expectedOutput: `Packed bytes: b'\\x00\\x00\\x04\\x00\\x00P' byte size: 6\nUnpacked values: (1024, 80)`
          }
        }
      ],
      practiceChallenge: {
        title: 'Serialize and Deserialize a User Registry to JSON',
        instructions: [
          'Create a dictionary of 2 users with names and scores.',
          'Convert the dictionary to a formatted JSON string using `json.dumps(indent=2)`.',
          'Parse the string back using `json.loads()` and verify the data.'
        ],
        starterCode: `import json\n\nusers = {"u1": {"name": "Alice", "score": 95}, "u2": {"name": "Bob", "score": 88}}\n# TODO: serialize to JSON and deserialize back\n`,
        solutionCode: `import json\n\nusers = {"u1": {"name": "Alice", "score": 95}, "u2": {"name": "Bob", "score": 88}}\nencoded = json.dumps(users, indent=2)\nprint("JSON String:\\n" + encoded)\ndecoded = json.loads(encoded)\nprint("Decoded user 1 score:", decoded["u1"]["score"])`,
        hints: ['Use json.dumps(users, indent=2) and json.loads(encoded)']
      },
      keyTakeaways: [
        'Always open files with context managers and explicit UTF-8 encoding.',
        'pathlib provides an object-oriented API for path manipulation.',
        'Never use pickle on untrusted data from the network.',
        'struct packs and unpacks raw binary protocols.'
      ]
    },
    {
      id: 'w4-d24',
      dayNumber: 24,
      weekNumber: 4,
      title: 'Concurrency & Asyncio: Asynchronous I/O',
      subtitle: '7 Topics: Event Loop Architecture, async/await Syntax, Coroutine Lifecycle, asyncio.gather vs TaskGroup, Timeouts & Cancellations, The Blocking Trap, Rate-Limiting Semaphores',
      durationMinutes: 75,
      overview: 'Conquer asynchronous programming with Python\'s native asyncio framework. Understand single-threaded cooperative multitasking, non-blocking I/O multiplexing, and structured concurrency across 7 comprehensive topics.',
      interactiveDiagram: {
        type: 'eventloop',
        title: 'Asyncio Single-Threaded Event Loop',
        caption: 'The event loop continuously polls I/O selectors, scheduling ready coroutines. When a coroutine hits await, it relinquishes control without blocking the thread.'
      },
      topics: [
        {
          id: 't24-1',
          topicNumber: 1,
          title: 'The Event Loop Architecture',
          explanation: [
            'Asyncio uses a single-threaded event loop paired with OS notification primitives (such as `epoll` on Linux, `kqueue` on macOS, or `IOCP` on Windows).',
            'Instead of spinning a thread per connection, the event loop monitors thousands of network sockets simultaneously. When data arrives, the loop resumes the awaiting coroutine.'
          ],
          keyRules: [
            'Asyncio achieves high concurrency on a single thread',
            'Operates via cooperative multitasking (tasks voluntarily yield)'
          ],
          codeSnippet: {
            id: 'cs4-24-1',
            title: 'Asyncio Coroutine Definition',
            description: 'Defining and running an asynchronous coroutine with asyncio.run().',
            language: 'python',
            code: `import asyncio\n\nasync def main():\n    return "Event loop initialized successfully"\n\nresult = asyncio.run(main())\nprint(result)`,
            expectedOutput: `Event loop initialized successfully`
          }
        },
        {
          id: 't24-2',
          topicNumber: 2,
          title: 'Coroutines, Tasks, and Futures',
          explanation: [
            'A function defined with `async def` is a coroutine function. Calling it does NOT execute its code—it returns a `coroutine object`.',
            'A coroutine must be `await`ed, or wrapped into an `asyncio.Task` with `asyncio.create_task()`, which schedules it for immediate background execution on the loop.'
          ],
          keyRules: [
            'Calling `coroutine()` returns an unstarted coroutine object',
            '`asyncio.create_task()` schedules concurrent background execution'
          ],
          codeSnippet: {
            id: 'cs4-24-2',
            title: 'Scheduling Tasks with create_task',
            description: 'Running two coroutines concurrently via Task scheduling.',
            language: 'python',
            code: `import asyncio\n\nasync def fetch_metric(name, delay):\n    await asyncio.sleep(delay)\n    return f"{name}: ok"\n\nasync def run():\n    t1 = asyncio.create_task(fetch_metric("CPU", 0.01))\n    t2 = asyncio.create_task(fetch_metric("RAM", 0.01))\n    r1 = await t1\n    r2 = await t2\n    return [r1, r2]\n\nprint(asyncio.run(run()))`,
            expectedOutput: `['CPU: ok', 'RAM: ok']`
          }
        },
        {
          id: 't24-3',
          topicNumber: 3,
          title: 'Concurrent Aggregation with asyncio.gather',
          explanation: [
            '`asyncio.gather(*coros)` runs multiple coroutines concurrently and waits for all of them to complete, returning a list of their results in the exact order requested.',
            'Passing `return_exceptions=True` ensures that if one task fails, the other tasks continue running and the error is returned in the results list rather than terminating the batch.'
          ],
          keyRules: [
            '`asyncio.gather()` preserves result ordering matching input parameters',
            '`return_exceptions=True` captures errors gracefully'
          ],
          codeSnippet: {
            id: 'cs4-24-3',
            title: 'Batch Requests with asyncio.gather',
            description: 'Querying multiple resources concurrently with gather.',
            language: 'python',
            code: `import asyncio\n\nasync def query_api(endpoint):\n    await asyncio.sleep(0.01)\n    return f"Response from {endpoint}"\n\nasync def main():\n    endpoints = ["/users", "/orders", "/payments"]\n    results = await asyncio.gather(*(query_api(ep) for ep in endpoints))\n    for res in results:\n        print(res)\n\nasyncio.run(main())`,
            expectedOutput: `Response from /users\nResponse from /orders\nResponse from /payments`
          }
        },
        {
          id: 't24-4',
          topicNumber: 4,
          title: 'Structured Concurrency with Python 3.11+ TaskGroup',
          explanation: [
            'Python 3.11 introduced `asyncio.TaskGroup`, implementing modern structured concurrency.',
            'Using `async with asyncio.TaskGroup() as tg:`, any uncaught exception in a child task automatically cancels all other running tasks in the group, preventing orphaned background tasks from leaking.'
          ],
          keyRules: [
            'All child tasks must complete before the `async with` block exits',
            'Failure in one task automatically cancels remaining siblings'
          ],
          codeSnippet: {
            id: 'cs4-24-4',
            title: 'Structured Concurrency with TaskGroup',
            description: 'Demonstrating clean task management with asyncio.TaskGroup.',
            language: 'python',
            code: `import asyncio\n\nasync def worker(task_id):\n    await asyncio.sleep(0.01)\n    return f"Task {task_id} done"\n\nasync def main():\n    results = []\n    async with asyncio.TaskGroup() as tg:\n        t1 = tg.create_task(worker(1))\n        t2 = tg.create_task(worker(2))\n    print("Both tasks completed cleanly:", t1.result(), t2.result())\n\nasyncio.run(main())`,
            expectedOutput: `Both tasks completed cleanly: Task 1 done Task 2 done`
          }
        },
        {
          id: 't24-5',
          topicNumber: 5,
          title: 'Timeouts, Deadlines & Cancellations',
          explanation: [
            'Network calls can hang indefinitely without timeouts. Python provides `asyncio.timeout(seconds)` (Python 3.11+) or `asyncio.wait_for(coro, timeout)` to enforce deadlines.',
            'When a timeout expires, asyncio injects a `CancelledError` into the awaiting coroutine, allowing it to perform cleanup in `finally` blocks.'
          ],
          keyRules: [
            'Cancelled coroutines raise `asyncio.CancelledError` at their await point',
            'Cleanup should always reside in `try...finally` blocks'
          ],
          codeSnippet: {
            id: 'cs4-24-5',
            title: 'Enforcing Async Timeouts',
            description: 'Aborting slow operations with asyncio.wait_for.',
            language: 'python',
            code: `import asyncio\n\nasync def slow_operation():\n    await asyncio.sleep(1.0)\n    return "Finished"\n\nasync def main():\n    try:\n        await asyncio.wait_for(slow_operation(), timeout=0.02)\n    except asyncio.TimeoutError:\n        print("Operation timed out safely!")\n\nasyncio.run(main())`,
            expectedOutput: `Operation timed out safely!`
          }
        },
        {
          id: 't24-6',
          topicNumber: 6,
          title: 'The Blocking Pitfall & asyncio.to_thread',
          explanation: [
            'The cardinal sin of asyncio: executing blocking synchronous code (like `time.sleep()`, synchronous `requests.get()`, or heavy CPU calculations) inside the event loop freezes ALL concurrent tasks!',
            'To run blocking synchronous libraries without stalling the event loop, delegate them to a worker thread using `await asyncio.to_thread(blocking_func, *args)`.'
          ],
          keyRules: [
            'Never execute synchronous blocking I/O directly in async functions',
            'Use `await asyncio.to_thread(func)` to offload blocking tasks to a thread pool'
          ],
          codeSnippet: {
            id: 'cs4-24-6',
            title: 'Offloading Blocking Code with to_thread',
            description: 'Executing synchronous work safely off the main event loop.',
            language: 'python',
            code: `import asyncio\nimport time\n\ndef blocking_hash_calculation():\n    time.sleep(0.01)  # Simulating blocking legacy call\n    return "Computed hash: a8f9e2"\n\nasync def main():\n    result = await asyncio.to_thread(blocking_hash_calculation)\n    print("Safely offloaded:", result)\n\nasyncio.run(main())`,
            expectedOutput: `Safely offloaded: Computed hash: a8f9e2`
          }
        },
        {
          id: 't24-7',
          topicNumber: 7,
          title: 'Rate-Limiting with asyncio.Semaphore',
          explanation: [
            'When scraping or querying APIs, firing 10,000 requests simultaneously will trigger HTTP 429 rate limits or exhaust socket limits.',
            'An `asyncio.Semaphore(max_concurrent)` acts as a concurrency gate: tasks acquire a slot before making their request and release it when done.'
          ],
          keyRules: [
            'Semaphores bound the maximum number of concurrent operations',
            'Use `async with semaphore:` to guarantee release'
          ],
          codeSnippet: {
            id: 'cs4-24-7',
            title: 'Rate-Limiting Requests with Semaphore',
            description: 'Throttling concurrent tasks with asyncio.Semaphore.',
            language: 'python',
            code: `import asyncio\n\nsem = asyncio.Semaphore(2)  # Max 2 concurrent tasks\n\nasync def limited_task(task_id):\n    async with sem:\n        await asyncio.sleep(0.01)\n        return f"Completed {task_id}"\n\nasync def main():\n    results = await asyncio.gather(*(limited_task(i) for i in range(4)))\n    print("All tasks finished:", len(results))\n\nasyncio.run(main())`,
            expectedOutput: `All tasks finished: 4`
          }
        }
      ],
      practiceChallenge: {
        title: 'Run 3 Concurrent Async Tasks with gather',
        instructions: [
          'Create an `async def download_file(name, duration)`.',
          'Use `await asyncio.sleep(duration)` to simulate downloading.',
          'Run downloads for "file1", "file2", and "file3" concurrently with `asyncio.gather`.'
        ],
        starterCode: `import asyncio\n\n# TODO: create download_file coroutine and gather 3 downloads\n`,
        solutionCode: `import asyncio\n\nasync def download_file(name, duration):\n    await asyncio.sleep(duration)\n    return f"Downloaded {name}"\n\nasync def main():\n    results = await asyncio.gather(\n        download_file("file1", 0.01),\n        download_file("file2", 0.01),\n        download_file("file3", 0.01)\n    )\n    for r in results:\n        print(r)\n\nasyncio.run(main())`,
        hints: ['asyncio.gather runs the coroutines in parallel on the event loop']
      },
      keyTakeaways: [
        'Asyncio runs on a single thread using an event loop and non-blocking sockets.',
        'async def produces coroutines that must be awaited or scheduled.',
        'asyncio.TaskGroup provides structured concurrency in Python 3.11+.',
        'Never call blocking synchronous code on the loop; use asyncio.to_thread().'
      ]
    },
    {
      id: 'w4-d25',
      dayNumber: 25,
      weekNumber: 4,
      title: 'Threading, Multiprocessing & The Global Interpreter Lock (GIL)',
      subtitle: '7 Topics: What is the GIL, CPU-Bound vs I/O-Bound Profiling, The threading Module, Thread Safety with threading.Lock, The multiprocessing Module, ProcessPoolExecutor, Inter-Process Communication (IPC)',
      durationMinutes: 75,
      overview: 'Demystify Python concurrency and the Global Interpreter Lock (GIL). Learn when threads accelerate I/O, why CPU-bound tasks require multiprocessing, and how to synchronize state safely across 7 comprehensive topics.',
      topics: [
        {
          id: 't25-1',
          topicNumber: 1,
          title: 'Understanding the Global Interpreter Lock (GIL)',
          explanation: [
            'The CPython GIL is a mutual-exclusion lock that protects CPython\'s internal memory management from race conditions during reference counting.',
            'Because only one native thread can execute Python bytecode at any given moment, Python threads cannot execute pure Python CPU-bound computations in true parallel across multiple CPU cores.'
          ],
          keyRules: [
            'The GIL permits only one thread to run Python bytecode at a time',
            'I/O operations (network, disk, C-extensions like NumPy) release the GIL'
          ],
          codeSnippet: {
            id: 'cs4-25-1',
            title: 'GIL Conceptual Demonstration',
            description: 'Inspecting threading active count.',
            language: 'python',
            code: `import threading\n\nprint("Main thread name:", threading.current_thread().name)\nprint("Active thread count:", threading.active_count())`,
            expectedOutput: `Main thread name: MainThread\nActive thread count: 1`
          }
        },
        {
          id: 't25-2',
          topicNumber: 2,
          title: 'CPU-Bound vs I/O-Bound Concurrency Profiles',
          explanation: [
            'I/O-Bound tasks (web scraping, API calls, disk reads) spend most of their time waiting for external hardware or networks. Threads and Asyncio provide huge speedups because threads release the GIL while waiting.',
            'CPU-Bound tasks (image processing, data science, mathematical simulations) spend 100% of their time computing. Multi-threading CPU tasks actually slows Python down due to GIL lock-switching overhead!'
          ],
          keyRules: [
            'For I/O-bound tasks: use Asyncio or Threading',
            'For CPU-bound tasks: use Multiprocessing'
          ],
          codeSnippet: {
            id: 'cs4-25-2',
            title: 'Classifying Workload Types',
            description: 'Rules for choosing between Threading and Multiprocessing.',
            language: 'python',
            code: `def concurrency_strategy(workload_type: str) -> str:\n    if workload_type == "IO_BOUND":\n        return "Use Asyncio or ThreadPoolExecutor (releases GIL)"\n    elif workload_type == "CPU_BOUND":\n        return "Use ProcessPoolExecutor (bypasses GIL with separate processes)"\n    return "Unknown"\n\nprint("For web scraper:", concurrency_strategy("IO_BOUND"))\nprint("For matrix math:", concurrency_strategy("CPU_BOUND"))`,
            expectedOutput: `For web scraper: Use Asyncio or ThreadPoolExecutor (releases GIL)\nFor matrix math: Use ProcessPoolExecutor (bypasses GIL with separate processes)`
          }
        },
        {
          id: 't25-3',
          topicNumber: 3,
          title: 'The threading Module & Thread Spawning',
          explanation: [
            'The `threading.Thread` class allows spawning operating-system-level threads.',
            'Threads share the same memory heap, making it effortless to share data structures, but requiring extreme care to prevent concurrent mutation bugs.'
          ],
          keyRules: [
            '`t.start()` begins thread execution in background',
            '`t.join()` blocks the calling thread until target thread terminates'
          ],
          codeSnippet: {
            id: 'cs4-25-3',
            title: 'Spawning and Joining OS Threads',
            description: 'Executing worker threads and joining results.',
            language: 'python',
            code: `import threading\nimport time\n\nresults = []\n\ndef worker(num):\n    time.sleep(0.01)\n    results.append(num * 10)\n\nthreads = [threading.Thread(target=worker, args=(i,)) for i in range(3)]\nfor t in threads: t.start()\nfor t in threads: t.join()\n\nprint("Thread results collected:", sorted(results))`,
            expectedOutput: `Thread results collected: [0, 10, 20]`
          }
        },
        {
          id: 't25-4',
          topicNumber: 4,
          title: 'Race Conditions and Mutex Locks (threading.Lock)',
          explanation: [
            'Even with the GIL, Python code is NOT automatically thread-safe! An operation like `count += 1` consists of 4 distinct bytecode instructions: `LOAD_FAST`, `LOAD_CONST`, `BINARY_ADD`, `STORE_FAST`.',
            'A thread can be preempted between `LOAD` and `STORE`, overwriting another thread\'s increment. A `threading.Lock` enforces mutual exclusion around critical sections.'
          ],
          keyRules: [
            '`count += 1` is NOT an atomic operation in Python',
            'Use `with lock:` context manager around shared mutable state'
          ],
          codeSnippet: {
            id: 'cs4-25-4',
            title: 'Synchronizing Shared State with threading.Lock',
            description: 'Preventing race conditions using mutex lock.',
            language: 'python',
            code: `import threading\n\ncounter = 0\nlock = threading.Lock()\n\ndef safe_increment():\n    global counter\n    with lock:\n        counter += 1\n\nthreads = [threading.Thread(target=safe_increment) for _ in range(50)]\nfor t in threads: t.start()\nfor t in threads: t.join()\nprint("Final synchronized counter:", counter)`,
            expectedOutput: `Final synchronized counter: 50`
          }
        },
        {
          id: 't25-5',
          topicNumber: 5,
          title: 'True Parallelism with the multiprocessing Module',
          explanation: [
            'The `multiprocessing` module bypasses the GIL completely by spawning separate OS processes, each with its own independent Python interpreter and private memory space.',
            'Because each process has its own GIL, multiple processes run on separate CPU cores simultaneously with true hardware parallelism.'
          ],
          keyRules: [
            'Each process has its own isolated memory space and its own GIL',
            'Achieves 100% CPU utilization across all CPU cores'
          ],
          codeSnippet: {
            id: 'cs4-25-5',
            title: 'Multiprocessing Architecture Concepts',
            description: 'Inspecting CPU core availability for multiprocessing.',
            language: 'python',
            code: `import os\n\ncpu_count = os.cpu_count() or 1\nprint(f"System has {cpu_count} CPU cores available for multiprocessing")`,
            expectedOutput: `System has ... CPU cores available for multiprocessing`
          }
        },
        {
          id: 't25-6',
          topicNumber: 6,
          title: 'ProcessPoolExecutor & ThreadPoolExecutor',
          explanation: [
            'Python\'s `concurrent.futures` module provides a high-level, unified API for asynchronous execution using worker pools.',
            '`ThreadPoolExecutor` manages a pool of worker threads, while `ProcessPoolExecutor` manages a pool of worker processes. Both support `.submit()` and `.map()`.'
          ],
          keyRules: [
            'Switching between threads and processes requires only changing the Executor class',
            '`.map(func, iterable)` distributes tasks across workers and collects results in order'
          ],
          codeSnippet: {
            id: 'cs4-25-6',
            title: 'Parallel Processing with ThreadPoolExecutor',
            description: 'Mapping tasks across worker pools cleanly.',
            language: 'python',
            code: `from concurrent.futures import ThreadPoolExecutor\n\ndef square(x):\n    return x * x\n\nwith ThreadPoolExecutor(max_workers=3) as executor:\n    results = list(executor.map(square, [1, 2, 3, 4, 5]))\n\nprint("Mapped results:", results)`,
            expectedOutput: `Mapped results: [1, 4, 9, 16, 25]`
          }
        },
        {
          id: 't25-7',
          topicNumber: 7,
          title: 'Inter-Process Communication (IPC) via Queues',
          explanation: [
            'Because processes do not share memory, they cannot modify the same variables directly. Data must be serialized (pickled) and passed via IPC channels.',
            '`multiprocessing.Queue` provides a thread- and process-safe FIFO queue for passing messages between parent and worker processes.'
          ],
          keyRules: [
            'IPC requires data to be picklable',
            'Queues coordinate producer-consumer architectures safely across processes'
          ],
          codeSnippet: {
            id: 'cs4-25-7',
            title: 'Thread-Safe Queue Data Passing',
            description: 'Passing data safely through a queue.',
            language: 'python',
            code: `import queue\n\nq = queue.Queue()\nq.put("Job #1")\nq.put("Job #2")\n\nprint("Dequeued:", q.get())\nprint("Dequeued:", q.get())\nprint("Queue empty:", q.empty())`,
            expectedOutput: `Dequeued: Job #1\nDequeued: Job #2\nQueue empty: True`
          }
        }
      ],
      practiceChallenge: {
        title: 'Use ThreadPoolExecutor to Process Batches',
        instructions: [
          'Import `ThreadPoolExecutor` from `concurrent.futures`.',
          'Create a function `process_record(record_id)` that returns `f"Processed {record_id}"`.',
          'Map over numbers `[101, 102, 103]` using a 2-worker executor.'
        ],
        starterCode: `from concurrent.futures import ThreadPoolExecutor\n\n# TODO: create function and map across ThreadPoolExecutor\n`,
        solutionCode: `from concurrent.futures import ThreadPoolExecutor\n\ndef process_record(record_id):\n    return f"Processed {record_id}"\n\nwith ThreadPoolExecutor(max_workers=2) as executor:\n    results = list(executor.map(process_record, [101, 102, 103]))\n\nfor r in results:\n    print(r)`,
        hints: ['Use with ThreadPoolExecutor(max_workers=2) as executor: results = list(executor.map(...))']
      },
      keyTakeaways: [
        'CPython GIL ensures only one native thread runs Python bytecode at a time.',
        'Threading is ideal for I/O; Multiprocessing is required for CPU parallelism.',
        'Shared state in threads requires synchronization locks to avoid race conditions.',
        'concurrent.futures provides a clean unified interface for worker pools.'
      ]
    },
    {
      id: 'w4-d26',
      dayNumber: 26,
      weekNumber: 4,
      title: 'Regular Expressions & Text Processing',
      subtitle: '7 Topics: Raw Strings & Syntax, search vs match vs findall, Capturing Groups & Named Groups, Search and Replace with re.sub, Compilation Flags, Lookaheads & Lookbehinds, Safe Regex Compilation',
      durationMinutes: 65,
      overview: 'Harness the full power of pattern matching in Python using the `re` engine. Learn how character classes, greedy vs lazy quantifiers, named capturing groups, and zero-width assertions work across 7 topics.',
      topics: [
        {
          id: 't26-1',
          topicNumber: 1,
          title: 'Raw String Literals and the re Engine',
          explanation: [
            'In standard Python strings, backslashes are escape characters (`\\n` is newline, `\\t` is tab). Regular expressions also use backslashes (`\\d` for digit, `\\w` for word character).',
            'Without raw strings `r""`, you would have to write `\\\\d` to escape the escape. Always write regular expressions as raw string literals: `r"\\d+"`.'
          ],
          keyRules: [
            'Always prefix regular expression patterns with `r`',
            'Prevents Python string escape collisions with regex syntax'
          ],
          codeSnippet: {
            id: 'cs4-26-1',
            title: 'Raw Strings vs Standard Strings',
            description: 'Comparing raw string representation to standard escape sequences.',
            language: 'python',
            code: `standard = "\\\\d+"\nraw_literal = r"\\d+"\nprint("Both match:", standard == raw_literal)\nprint("Raw string literal:", raw_literal)`,
            expectedOutput: `Both match: True\nRaw string literal: \\d+`
          }
        },
        {
          id: 't26-2',
          topicNumber: 2,
          title: 're.search vs re.match vs re.findall',
          explanation: [
            '`re.match()` checks for a match ONLY at the beginning of the string.',
            '`re.search()` scans through the entire string to find the first occurrence.',
            '`re.findall()` returns a list of all matching substrings throughout the string.'
          ],
          keyRules: [
            '`match()` is anchored to start of string',
            '`search()` finds first occurrence anywhere',
            '`findall()` returns all matches as a list'
          ],
          codeSnippet: {
            id: 'cs4-26-2',
            title: 'Comparing Match, Search, and Findall',
            description: 'Demonstrating differences across match, search, and findall.',
            language: 'python',
            code: `import re\n\ntext = "Order 101 placed. Order 102 shipped."\nprint("re.match('Order', text):", bool(re.match(r"Order", text)))\nprint("re.match('101', text):", bool(re.match(r"101", text)))\nprint("re.search('101', text):", re.search(r"\\d+", text).group())\nprint("re.findall('\\\\d+', text):", re.findall(r"\\d+", text))`,
            expectedOutput: `re.match('Order', text): True\nre.match('101', text): False\nre.search('101', text): 101\nre.findall('\\d+', text): ['101', '102']`
          }
        },
        {
          id: 't26-3',
          topicNumber: 3,
          title: 'Capturing Groups and Named Groups (?P<name>)',
          explanation: [
            'Parentheses `()` create capturing groups that extract sub-parts of a pattern into `match.group(1)`, `match.group(2)`.',
            'Python supports Named Groups: `(?P<name>pattern)`. This allows accessing matched segments as self-documenting dictionary keys via `match.groupdict()`.'
          ],
          keyRules: [
            'Numbered groups: `m.group(1)`',
            'Named groups: `(?P<fieldname>...)` accessible via `m.groupdict()`'
          ],
          codeSnippet: {
            id: 'cs4-26-3',
            title: 'Extracting Data with Named Groups',
            description: 'Parsing email addresses into user and domain components.',
            language: 'python',
            code: `import re\n\nemail_pattern = r"(?P<user>[\\w.]+)@(?P<domain>[\\w.]+)"\nm = re.search(email_pattern, "Contact admin@example.org for support")\n\nprint("Username:", m.group("user"))\nprint("Domain:", m.group("domain"))\nprint("All groups dict:", m.groupdict())`,
            expectedOutput: `Username: admin\nDomain: example.org\nAll groups dict: {'user': 'admin', 'domain': 'example.org'}`
          }
        },
        {
          id: 't26-4',
          topicNumber: 4,
          title: 'Search and Replace with re.sub & Function Callbacks',
          explanation: [
            '`re.sub(pattern, replacement, string)` replaces occurrences of a pattern with a replacement string.',
            'Crucially, the replacement parameter can be a callable function! Python passes the Match object into your function, allowing dynamic substitutions like masking sensitive tokens.'
          ],
          keyRules: [
            '`re.sub()` accepts string replacements or callback functions',
            'Callbacks receive the `Match` object for dynamic replacement'
          ],
          codeSnippet: {
            id: 'cs4-26-4',
            title: 'Dynamic Substitution with Callback',
            description: 'Masking credit card numbers dynamically with re.sub.',
            language: 'python',
            code: `import re\n\ntext = "Card 1234-5678-9876-5432 verified"\n\ndef mask_card(match):\n    digits = match.group(0)\n    return "****-****-****-" + digits[-4:]\n\nmasked = re.sub(r"\\d{4}-\\d{4}-\\d{4}-\\d{4}", mask_card, text)\nprint(masked)`,
            expectedOutput: `Card ****-****-****-5432 verified`
          }
        },
        {
          id: 't26-5',
          topicNumber: 5,
          title: 'Regex Compilation Flags: IGNORECASE, MULTILINE, VERBOSE',
          explanation: [
            'Flags modify matching behavior: `re.IGNORECASE` (case-insensitive), `re.MULTILINE` (`^` and `$` match start/end of each line, not just the entire string), and `re.DOTALL` (`.` matches newline characters too).',
            '`re.VERBOSE` allows writing multi-line, formatted regular expressions with comments and whitespace for superior maintainability.'
          ],
          keyRules: [
            'Combine flags with bitwise OR: `re.IGNORECASE | re.VERBOSE`',
            're.VERBOSE makes complex expressions self-documenting'
          ],
          codeSnippet: {
            id: 'cs4-26-5',
            title: 'Self-Documenting Regex with re.VERBOSE',
            description: 'Writing commented regex patterns using verbose mode.',
            language: 'python',
            code: `import re\n\nphone_pattern = re.compile(r"""\n    \\(?          # Optional open parenthesis\n    (\\d{3})     # Area code\n    \\)?          # Optional close parenthesis\n    [-.\\s]?     # Delimiter\n    (\\d{3})     # Prefix\n    [-.\\s]?     # Delimiter\n    (\\d{4})     # Line number\n""", re.VERBOSE)\n\nm = phone_pattern.search("Call (800) 555-0199 today")\nprint("Phone extracted:", m.groups())`,
            expectedOutput: `Phone extracted: ('800', '555', '0199')`
          }
        },
        {
          id: 't26-6',
          topicNumber: 6,
          title: 'Zero-Width Assertions: Lookaheads & Lookbehinds',
          explanation: [
            'Lookaheads `(?=...)` and lookbehinds `(?<=...)` match characters without consuming them in the match result.',
            'Positive lookahead `\\d+(?=px)` matches digits only if they are immediately followed by "px", but "px" is excluded from the returned match.'
          ],
          keyRules: [
            'Positive lookahead: `(?=pattern)`',
            'Negative lookahead: `(?!pattern)`',
            'Matches position without consuming text in result'
          ],
          codeSnippet: {
            id: 'cs4-26-6',
            title: 'Zero-Width Lookahead in Action',
            description: 'Extracting numeric values preceding specific units.',
            language: 'python',
            code: `import re\n\ncss = "width: 120px; height: 85px; margin: 10em;"\n# Match numbers only if followed by 'px'\npixel_values = re.findall(r"\\d+(?=px)", css)\nprint("Pixel values extracted:", pixel_values)`,
            expectedOutput: `Pixel values extracted: ['120', '85']`
          }
        },
        {
          id: 't26-7',
          topicNumber: 7,
          title: 'High-Performance Regex Compilation with re.compile',
          explanation: [
            'When a regex pattern is evaluated repeatedly inside a loop, Python has to parse the string into an internal bytecode automaton each time.',
            'Precompiling with `pattern = re.compile(r"...")` parses the regex once into a reusable `Pattern` object, accelerating execution loops.'
          ],
          keyRules: [
            'Compile patterns outside loops with `re.compile()`',
            'Pattern objects cache the regex state machine'
          ],
          codeSnippet: {
            id: 'cs4-26-7',
            title: 'Precompiling Regular Expressions',
            description: 'Reusing compiled pattern across multiple items.',
            language: 'python',
            code: `import re\n\npattern = re.compile(r"^ID-\\d{4}$")\nrecords = ["ID-1001", "ID-209", "ID-9942", "BAD-1234"]\n\nvalid_records = [r for r in records if pattern.match(r)]\nprint("Valid IDs:", valid_records)`,
            expectedOutput: `Valid IDs: ['ID-1001', 'ID-9942']`
          }
        }
      ],
      practiceChallenge: {
        title: 'Extract Hashtags from Social Media Post',
        instructions: [
          'Use `re.findall` with pattern `r"#\\w+"`.',
          'Extract all hashtags from "Learning #python and #async programming is #awesome".',
          'Strip the leading `#` symbol from each tag.'
        ],
        starterCode: `import re\n\npost = "Learning #python and #async programming is #awesome"\n# TODO: extract and strip hashtags\n`,
        solutionCode: `import re\n\npost = "Learning #python and #async programming is #awesome"\ntags = [tag[1:] for tag in re.findall(r"#\\w+", post)]\nprint("Extracted tags:", tags)`,
        hints: ['re.findall(r"#\\w+", post) finds all hashtags']
      },
      keyTakeaways: [
        'Always use raw string literals r"" for regex patterns.',
        're.match is start-anchored; re.search searches entire string.',
        'Named groups (?P<name>...) yield readable dictionaries via groupdict().',
        'Lookaheads match positions without consuming characters.'
      ]
    },
    {
      id: 'w4-d27',
      dayNumber: 27,
      weekNumber: 4,
      title: 'Testing, Debugging & Code Quality',
      subtitle: '7 Topics: Built-in unittest Framework, Modern Testing with pytest, Fixtures and Setup/Teardown, Parametrized Test Cases, Mocking with unittest.mock, Debugging with breakpoint() & pdb, Static Analysis with Ruff & Mypy',
      durationMinutes: 70,
      overview: 'Write bulletproof Python applications. Master automated testing suites, deterministic dependency mocking, breakpoint stepping, and static type validation across 7 comprehensive topics.',
      topics: [
        {
          id: 't27-1',
          topicNumber: 1,
          title: 'The Built-in unittest Framework',
          explanation: [
            'Python ships with `unittest`, an xUnit-style testing framework in the standard library.',
            'Test classes inherit from `unittest.TestCase` and implement test methods prefixed with `test_`. Assertions like `assertEqual`, `assertTrue`, and `assertRaises` provide descriptive failure diagnostics.'
          ],
          keyRules: [
            'Inherit from `unittest.TestCase`',
            'Test method names must begin with `test_`'
          ],
          codeSnippet: {
            id: 'cs4-27-1',
            title: 'Writing a TestCase with unittest',
            description: 'Defining unit tests and assertion checks.',
            language: 'python',
            code: `import unittest\n\ndef add(x, y): return x + y\n\nclass TestMath(unittest.TestCase):\n    def test_addition(self):\n        self.assertEqual(add(2, 3), 5)\n    def test_negative(self):\n        self.assertEqual(add(-1, 1), 0)\n\n# Run inline runner\nsuite = unittest.defaultTestLoader.loadTestsFromTestCase(TestMath)\nrunner = unittest.TextTestRunner()\nres = runner.run(suite)\nprint("Tests run:", res.testsRun, "Failures:", len(res.failures))`,
            expectedOutput: `Tests run: 2 Failures: 0`
          }
        },
        {
          id: 't27-2',
          topicNumber: 2,
          title: 'Modern Testing with pytest',
          explanation: [
            'While `unittest` is standard, `pytest` is the undisputed industry standard for Python development.',
            'In `pytest`, you don\'t need classes or `self.assertEqual()`: you write plain functions with standard Python `assert expr` statements. Pytest\'s bytecode assertion rewriting generates crystal-clear diffs automatically.'
          ],
          keyRules: [
            'Plain functions with `assert x == y`',
            'No boilerplate test classes required'
          ],
          codeSnippet: {
            id: 'cs4-27-2',
            title: 'Pytest Assertion Syntax Style',
            description: 'Plain assertion style used in pytest.',
            language: 'python',
            code: `def multiply(a, b): return a * b\n\ndef test_multiply():\n    assert multiply(3, 4) == 12\n    assert multiply(0, 99) == 0\n\ntest_multiply()\nprint("Pytest style assertion succeeded!")`,
            expectedOutput: `Pytest style assertion succeeded!`
          }
        },
        {
          id: 't27-3',
          topicNumber: 3,
          title: 'Pytest Fixtures: Composable Test Environments',
          explanation: [
            '`@pytest.fixture` provides dependency injection for tests, setting up resources (database connections, test client, sample users) before tests and tearing them down after.',
            'Fixtures can yield a resource to run teardown code cleanly after the test finishes.'
          ],
          keyRules: [
            'Decorate helper functions with `@pytest.fixture`',
            'Tests receive fixture values simply by declaring parameter names matching the fixture'
          ],
          codeSnippet: {
            id: 'cs4-27-3',
            title: 'Pytest Fixture Injection Concept',
            description: 'Injecting reusable fixtures into test functions.',
            language: 'python',
            code: `def sample_user_fixture():\n    return {"id": 1, "username": "dev_tester", "active": True}\n\ndef test_user_active(user):\n    assert user["active"] is True\n\n# Simulating injection\ntest_user_active(sample_user_fixture())\nprint("Fixture injection verified!")`,
            expectedOutput: `Fixture injection verified!`
          }
        },
        {
          id: 't27-4',
          topicNumber: 4,
          title: 'Parametrized Testing (@pytest.mark.parametrize)',
          explanation: [
            'Parametrization enables running the exact same test function against dozens of input-output test cases without duplicating code.',
            'Each parameter set runs as an isolated, distinct test case, ensuring that a failure in one case does not abort testing the other cases.'
          ],
          keyRules: [
            '`@pytest.mark.parametrize("input,expected", [...])`',
            'Executes distinct subtests for each parameter tuple'
          ],
          codeSnippet: {
            id: 'cs4-27-4',
            title: 'Parametrized Testing Pattern',
            description: 'Iterating through multiple test vector cases.',
            language: 'python',
            code: `test_cases = [\n    ("radar", True),\n    ("hello", False),\n    ("level", True),\n    ("python", False)\n]\n\ndef is_palindrome(s):\n    return s == s[::-1]\n\nfor word, expected in test_cases:\n    assert is_palindrome(word) == expected\n\nprint(f"All {len(test_cases)} parametrized palindrome cases passed!")`,
            expectedOutput: `All 4 parametrized palindrome cases passed!`
          }
        },
        {
          id: 't27-5',
          topicNumber: 5,
          title: 'Isolating External Dependencies with unittest.mock',
          explanation: [
            'Unit tests should never perform real HTTP requests, send actual emails, or modify production databases.',
            '`unittest.mock.patch` swaps out target functions or classes with a `MagicMock` object that records calls and returns predetermined values without touching real external services.'
          ],
          keyRules: [
            'Patch where the object is LOOKED UP, not where it is defined',
            'Assert calls with `mock.assert_called_once_with(...)`'
          ],
          codeSnippet: {
            id: 'cs4-27-5',
            title: 'Mocking Dependencies with MagicMock',
            description: 'Simulating an external payment API with MagicMock.',
            language: 'python',
            code: `from unittest.mock import MagicMock\n\npayment_gateway = MagicMock()\npayment_gateway.charge.return_value = {"status": "success", "tx_id": "tx_99"}\n\n# Client code under test\nresponse = payment_gateway.charge(amount=50.0)\nprint("Mock response:", response)\npayment_gateway.charge.assert_called_once_with(amount=50.0)\nprint("Assertion verified: gateway was called with exact parameters!")`,
            expectedOutput: `Mock response: {'status': 'success', 'tx_id': 'tx_99'}\nAssertion verified: gateway was called with exact parameters!`
          }
        },
        {
          id: 't27-6',
          topicNumber: 6,
          title: 'Interactive Debugging with breakpoint() and pdb',
          explanation: [
            'Python 3.7 introduced the built-in `breakpoint()` function, which invokes Python\'s interactive debugger (`pdb`).',
            'Commands inside pdb: `n` (next line), `s` (step into function), `c` (continue execution), `p variable` (print value), `q` (quit).'
          ],
          keyRules: [
            'Insert `breakpoint()` directly in source code',
            'Enters interactive REPL in the terminal at exact execution line'
          ],
          codeSnippet: {
            id: 'cs4-27-6',
            title: 'PDB Debugger Capabilities',
            description: 'Inspecting debugging commands available in pdb.',
            language: 'python',
            code: `pdb_commands = {\n    "n": "Next line (step over)",\n    "s": "Step into function",\n    "c": "Continue execution",\n    "p <var>": "Print variable value",\n    "l": "List source code window"\n}\n\nprint("Core PDB Debugger Commands:")\nfor cmd, desc in pdb_commands.items():\n    print(f"  {cmd:<8} -> {desc}")`,
            expectedOutput: `Core PDB Debugger Commands:\n  n        -> Next line (step over)\n  s        -> Step into function\n  c        -> Continue execution\n  p <var>  -> Print variable value\n  l        -> List source code window`
          }
        },
        {
          id: 't27-7',
          topicNumber: 7,
          title: 'Static Code Quality: Mypy, Ruff & Linters',
          explanation: [
            'Static analysis catches bugs before runtime. `mypy` performs static type checking, validating that function argument types and return values match annotations.',
            '`Ruff` is an ultra-fast Rust-based Python linter that combines Flake8, isort, and Black formatting into sub-second execution.'
          ],
          keyRules: [
            '`mypy file.py` flags type inconsistencies before execution',
            '`ruff check .` enforces PEP 8 and identifies anti-patterns'
          ],
          codeSnippet: {
            id: 'cs4-27-7',
            title: 'Type Safety Checking Simulation',
            description: 'Demonstrating type annotation contracts.',
            language: 'python',
            code: `def calculate_discount(price: float, discount: float) -> float:\n    if not (0.0 <= discount <= 1.0):\n        raise ValueError("Discount must be between 0.0 and 1.0")\n    return price * (1.0 - discount)\n\nprint("Valid discount:", calculate_discount(100.0, 0.2))`,
            expectedOutput: `Valid discount: 80.0`
          }
        }
      ],
      practiceChallenge: {
        title: 'Write a Unit Test for a Tax Calculator',
        instructions: [
          'Create a function `compute_tax(amount)` returning `round(amount * 0.1, 2)`.',
          'Create a `unittest.TestCase` checking that 100 yields 10.0 and 0 yields 0.0.',
          'Execute the test suite.'
        ],
        starterCode: `import unittest\n\ndef compute_tax(amount):\n    return round(amount * 0.1, 2)\n\n# TODO: create TestTax(unittest.TestCase)\n`,
        solutionCode: `import unittest\n\ndef compute_tax(amount):\n    return round(amount * 0.1, 2)\n\nclass TestTax(unittest.TestCase):\n    def test_tax_calculation(self):\n        self.assertEqual(compute_tax(100), 10.0)\n        self.assertEqual(compute_tax(0), 0.0)\n\nsuite = unittest.defaultTestLoader.loadTestsFromTestCase(TestTax)\nrunner = unittest.TextTestRunner()\nres = runner.run(suite)\nprint("Test passed successfully:", res.wasSuccessful())`,
        hints: ['Use self.assertEqual(compute_tax(100), 10.0)']
      },
      keyTakeaways: [
        'unittest is built into Python; pytest is the industry standard.',
        'Fixtures provide declarative setup and teardown for tests.',
        'Never call real APIs in tests; mock with unittest.mock.patch.',
        'Ruff and Mypy enforce clean code and catch type bugs before production.'
      ]
    },
    {
      id: 'w4-d28',
      dayNumber: 28,
      weekNumber: 4,
      title: 'Production Python & Full Capstone Architecture',
      subtitle: '7 Topics: Modular Package Design (__init__.py), Modern Dependency Management (pyproject.toml), Structured Logging, Environment Configs (.env), Performance Profiling (cProfile), Senior Architecture Patterns, Capstone Mastery',
      durationMinutes: 80,
      overview: 'Synthesize your entire 28-day Python journey. Build production-ready, maintainable packages with standard logging, configuration isolation, profiling, and enterprise design patterns across 7 comprehensive topics.',
      topics: [
        {
          id: 't28-1',
          topicNumber: 1,
          title: 'Modular Package Architecture & __init__.py',
          explanation: [
            'A Python package is a directory containing Python modules. While Python 3.3+ supports namespace packages without `__init__.py`, including an explicit `__init__.py` is best practice.',
            'Use `__init__.py` to expose a curated public API (`__all__`), preventing callers from having to import deeply nested internal modules.'
          ],
          keyRules: [
            'Define `__all__ = ["Symbol1", "Symbol2"]` in `__init__.py`',
            'Provides clean public interface while keeping internal modules private'
          ],
          codeSnippet: {
            id: 'cs4-28-1',
            title: 'Curated Public Package API',
            description: 'Controlling package exports with __all__.',
            language: 'python',
            code: `class CoreEngine: pass\nclass _InternalHelper: pass\n\n__all__ = ["CoreEngine"]\nprint("Publicly exported symbols:", __all__)`,
            expectedOutput: `Publicly exported symbols: ['CoreEngine']`
          }
        },
        {
          id: 't28-2',
          topicNumber: 2,
          title: 'Modern Packaging with pyproject.toml',
          explanation: [
            'Legacy `setup.py` and `requirements.txt` have been standardized under PEP 518 and PEP 621 into `pyproject.toml`.',
            'A single `pyproject.toml` file declares project metadata, build backend (Hatch, Flit, Poetry), dependency version pins, CLI entrypoints, and tool configurations (Ruff, pytest, mypy).'
          ],
          keyRules: [
            '`pyproject.toml` is the universal Python packaging standard',
            'Declares dependencies, metadata, and build tool configuration'
          ],
          codeSnippet: {
            id: 'cs4-28-2',
            title: 'pyproject.toml Structure',
            description: 'Inspecting a modern pyproject.toml configuration.',
            language: 'python',
            code: `config = """\n[project]\nname = "analytics-engine"\nversion = "1.0.0"\ndependencies = [\n    "fastapi>=0.100.0",\n    "pydantic>=2.0.0"\n]\n"""\nprint("Standard pyproject.toml configuration:\\n" + config.strip())`,
            expectedOutput: `Standard pyproject.toml configuration:\n[project]\nname = "analytics-engine"\nversion = "1.0.0"\ndependencies = [\n    "fastapi>=0.100.0",\n    "pydantic>=2.0.0"\n]`
          }
        },
        {
          id: 't28-3',
          topicNumber: 3,
          title: 'Enterprise Structured Logging with logging',
          explanation: [
            'Never use `print()` statements in production code! Python\'s standard `logging` module provides hierarchical loggers, formatted timestamps, log levels (DEBUG, INFO, WARNING, ERROR, CRITICAL), and multiple handlers (console, rotating file, syslog).',
            'Structured logging in JSON allows centralized log aggregators (Elasticsearch, Datadog) to parse fields automatically.'
          ],
          keyRules: [
            'Create logger with `logger = logging.getLogger(__name__)`',
            'Log exceptions with `logger.exception("Error context")` to capture full stack trace'
          ],
          codeSnippet: {
            id: 'cs4-28-3',
            title: 'Configuring Python Logging',
            description: 'Setting up structured logging levels and output.',
            language: 'python',
            code: `import logging\n\nlogging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")\nlogger = logging.getLogger("App")\n\nlogger.info("Application worker started")\nlogger.warning("Disk space at 82%")`,
            expectedOutput: `INFO: Application worker started\nWARNING: Disk space at 82%`
          }
        },
        {
          id: 't28-4',
          topicNumber: 4,
          title: 'Configuration Management with Environment Variables',
          explanation: [
            'The Twelve-Factor App methodology mandates storing configuration (API keys, database URLs, port numbers) in the environment, never hardcoded in source control.',
            'Read environment variables using `os.getenv("VAR_NAME", default)` and validate them into typed dataclasses or Pydantic settings at startup.'
          ],
          keyRules: [
            'Never commit credentials, tokens, or secret keys to git',
            'Always supply sensible defaults for non-sensitive local development'
          ],
          codeSnippet: {
            id: 'cs4-28-4',
            title: 'Safe Environment Configuration',
            description: 'Reading environment variables with fallback defaults.',
            language: 'python',
            code: `import os\n\ndb_host = os.getenv("DB_HOST", "localhost")\ndb_port = int(os.getenv("DB_PORT", "5432"))\nprint(f"Database target: {db_host}:{db_port}")`,
            expectedOutput: `Database target: localhost:5432`
          }
        },
        {
          id: 't28-5',
          topicNumber: 5,
          title: 'Performance Profiling with cProfile',
          explanation: [
            '"Premature optimization is the root of all evil" (Donald Knuth). Before optimizing, always profile your application to identify true bottlenecks.',
            'The standard library `cProfile` module records every function call, invocation count (`ncalls`), total time (`tottime`), and cumulative time (`cumtime`).'
          ],
          keyRules: [
            'Profile first; optimize second',
            '`cProfile.run("func()")` pinpoints exact hotspot functions'
          ],
          codeSnippet: {
            id: 'cs4-28-5',
            title: 'Profiling Code with cProfile',
            description: 'Running cProfile on an algorithm to inspect performance stats.',
            language: 'python',
            code: `import cProfile\n\ndef heavy_task():\n    return sum(x ** 2 for x in range(50000))\n\ncProfile.run("heavy_task()")`,
            expectedOutput: `ncalls  tottime  percall  cumtime  percall filename:lineno(function)`
          }
        },
        {
          id: 't28-6',
          topicNumber: 6,
          title: 'Clean Architecture & Dependency Injection',
          explanation: [
            'Decouple business logic from external infrastructure (databases, HTTP clients, message brokers) by injecting dependencies rather than instantiating them directly.',
            'This allows your core application logic to be tested in isolation using lightweight mock implementations.'
          ],
          keyRules: [
            'High-level modules should depend on abstractions, not concrete implementations',
            'Pass database and client dependencies as constructor parameters'
          ],
          codeSnippet: {
            id: 'cs4-28-6',
            title: 'Dependency Injection Architecture',
            description: 'Injecting repository abstractions into domain services.',
            language: 'python',
            code: `class InMemoryRepo:\n    def get_user(self, uid): return {"id": uid, "name": "Ada"}\n\nclass UserService:\n    def __init__(self, repo):\n        self.repo = repo\n    def get_greeting(self, uid):\n        user = self.repo.get_user(uid)\n        return f"Welcome, {user['name']}!"\n\nservice = UserService(InMemoryRepo())\nprint(service.get_greeting(1))`,
            expectedOutput: `Welcome, Ada!`
          }
        },
        {
          id: 't28-7',
          topicNumber: 7,
          title: 'The Capstone Architecture: Full Pipeline Synthesis',
          explanation: [
            'Congratulations on completing all 28 Days of rigorous Python mastery! You have mastered syntax, memory internals, collections, OOP, descriptors, dunders, generators, decorators, asyncio, threading, multiprocessing, testing, and production packaging.',
            'You now possess the foundational and architectural knowledge expected of senior Python engineers.'
          ],
          keyRules: [
            'Combine lazy generators with async I/O for scalable data pipelines',
            'Enforce type hints and clean testing contracts across production codebases'
          ],
          codeSnippet: {
            id: 'cs4-28-7',
            title: 'Full Capstone Synthesis Pipeline',
            description: 'Bringing together dataclasses, decorators, and pipelines.',
            language: 'python',
            code: `from dataclasses import dataclass\n\n@dataclass\nclass CapstoneResult:\n    student_name: str\n    days_completed: int\n    total_topics_mastered: int\n    status: str\n\ncertificate = CapstoneResult(\n    student_name="Python Engineer",\n    days_completed=28,\n    total_topics_mastered=196,\n    status="Certified Professional"\n)\n\nprint(f"Mastery Achieved: {certificate.student_name}")\nprint(f"Topics Mastered: {certificate.total_topics_mastered}/196 across {certificate.days_completed} Days")\nprint(f"Final Status: {certificate.status}")`,
            expectedOutput: `Mastery Achieved: Python Engineer\nTopics Mastered: 196/196 across 28 Days\nFinal Status: Certified Professional`
          }
        }
      ],
      practiceChallenge: {
        title: 'Build a Complete Production Service Pipeline',
        instructions: [
          'Define a `@dataclass` `Metric(name: str, value: float)`.',
          'Create a processing pipeline function that filters metrics with `value > 50.0`.',
          'Print the validated metric names.'
        ],
        starterCode: `from dataclasses import dataclass\n\n# TODO: create Metric dataclass and processing pipeline\n`,
        solutionCode: `from dataclasses import dataclass\n\n@dataclass\nclass Metric:\n    name: str\n    value: float\n\nmetrics = [\n    Metric("cpu_load", 78.5),\n    Metric("memory_pct", 42.1),\n    Metric("disk_io", 91.0)\n]\n\nhigh_load = [m for m in metrics if m.value > 50.0]\nfor item in high_load:\n    print(f"Alert: {item.name} at {item.value}%")`,
        hints: ['Use list comprehension [m for m in metrics if m.value > 50.0]']
      },
      keyTakeaways: [
        'pyproject.toml unifies modern Python packaging and tool configuration.',
        'Always use the logging module over print() statements in production.',
        'Profile with cProfile before performing premature optimizations.',
        'You have mastered all 196 topics across all 28 days of Python!'
      ]
    }
  ],
  quiz: {
    id: 'quiz-w4',
    weekNumber: 4,
    title: 'Week 4 Comprehensive Certification Exam: Production Python',
    description: 'Score 80% or higher to achieve your official Python Mastery Certificate.',
    passingScorePercent: 80,
    questions: [
      {
        id: 'q4-1',
        question: 'Why does executing CPU-bound calculations across multiple threads in CPython NOT yield multi-core speedups?',
        options: [
          'Because Python threads do not run on real OS threads',
          'Because the Global Interpreter Lock (GIL) permits only one thread to execute Python bytecode at a time',
          'Because Python CPU instructions can only execute on core 0',
          'Because the Python compiler disables thread scheduling for arithmetic operations'
        ],
        correctIndex: 1,
        explanation: 'The CPython GIL enforces single-thread execution of Python bytecode to protect reference counting state. For CPU-bound parallel execution, the multiprocessing module must be used.'
      },
      {
        id: 'q4-2',
        question: 'What is the consequence of executing a blocking synchronous operation (e.g. time.sleep or synchronous requests.get) inside an asyncio coroutine?',
        options: [
          'The event loop automatically migrates the blocking call to a background daemon thread',
          'The entire single-threaded event loop freezes, blocking all other scheduled coroutines from running',
          'Asyncio raises a BlockingOperationError immediately',
          'The blocking call is converted into a non-blocking POSIX signal'
        ],
        correctIndex: 1,
        explanation: 'Because asyncio runs cooperatively on a single thread, any blocking synchronous call stops the event loop entirely, preventing any other coroutine from progressing until it finishes.'
      },
      {
        id: 'q4-3',
        question: 'When decorating an inner function wrapper in Python, why should you always apply `@functools.wraps(func)`?',
        options: [
          'To compile the inner wrapper to C machine code for faster execution',
          'To copy the original function\'s name, docstring, and signature attributes onto the wrapper',
          'To prevent memory leaks by releasing the closure cells',
          'To enable multithreaded execution of the decorated function'
        ],
        correctIndex: 1,
        explanation: '@functools.wraps copies identity attributes (__name__, __doc__, __annotations__) from the target function to the wrapper so introspection tools and debuggers function properly.'
      },
      {
        id: 'q4-4',
        question: 'In regular expressions, what is the key characteristic of zero-width assertions like lookaheads `(?=pattern)`?',
        options: [
          'They match characters and consume them into group 0',
          'They verify that the pattern matches at the current position without consuming characters in the match result',
          'They reverse the direction of regex evaluation from right to left',
          'They mandate that the expression must be case-insensitive'
        ],
        correctIndex: 1,
        explanation: 'Zero-width assertions verify a matching condition at a specific character position without consuming or capturing those characters into the match result.'
      },
      {
        id: 'q4-5',
        question: 'Under modern Python packaging standards (PEP 518/PEP 621), which file is the primary unified configuration manifest for project metadata and dependencies?',
        options: [
          'setup.cfg',
          'requirements.txt',
          'pyproject.toml',
          'Pipfile.lock'
        ],
        correctIndex: 2,
        explanation: 'pyproject.toml is the standardized declarative configuration file for modern Python packaging, build systems, dependencies, and developer tool settings.'
      }
    ]
  }
};
