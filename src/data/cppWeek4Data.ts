import { WeekModule } from '../types/course';

export const CPP_WEEK_4_MODULE: WeekModule = {
  weekNumber: 4,
  title: 'Concurrency, Atomics, Systems Programming & Production Architecture',
  theme: 'High-Performance Multithreading, Lock-Free Primitives, CMake & Industrial Systems',
  description:
    'Master industrial C++ engineering: std::thread & std::jthread, mutexes, locks, condition variables, std::atomic and the memory model, systems programming with POSIX and std::filesystem, modern CMake build systems, sanitizers (ASan/TSan), and an enterprise multi-threaded worker pool capstone.',
  conceptImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
  imageAlt: 'High-performance concurrent computing and modern systems architecture',
  days: [
    {
      id: 'cpp-w4-d22',
      dayNumber: 22,
      weekNumber: 4,
      title: 'Threads, Lifecycle & std::jthread (C++20)',
      subtitle: 'OS thread creation, RAII join wrappers, cooperative cancellation tokens & thread affinity',
      durationMinutes: 70,
      overview:
        'Explore thread execution models in modern C++. Understand OS kernel threads, joining vs detaching hazards, C++20 std::jthread with auto-joining and stop tokens, thread-local storage, and passing references across execution contexts.',
      topics: [
        {
          id: 'cpp-w4-d22-t1',
          topicNumber: 1,
          title: 'The OS Thread Model and std::thread Internals',
          explanation: [
            'A `std::thread` is a handle to an OS kernel execution context (such as a POSIX pthread on Linux or a Win32 thread on Windows).',
            'When constructed, the OS allocates a separate execution stack (typically 2MB to 8MB) and schedules the instruction pointer independently across available CPU cores.',
            'C++ threads execute concurrently with the calling thread. The C++ runtime abstracts platform differences, but you must respect OS hardware limits.'
          ],
          keyRules: [
            'Each thread allocates its own execution call stack.',
            'Spawning thousands of threads wastes gigabytes of memory and introduces heavy OS context-switching overhead.'
          ],
          codeSnippet: {
            id: 'cpp-snip-22-1',
            title: 'Spawning a Native Thread',
            description: 'Creating an independent execution thread',
            language: 'cpp',
            code: `#include <iostream>
#include <thread>

void worker(int id) {
    std::cout << "Worker " << id << " executing on OS thread\\n";
}

int main() {
    std::thread t(worker, 42);
    t.join(); // Wait for worker to finish
    std::cout << "Worker finished\\n";
    return 0;
}`
          },
          pitfall: 'Constructing a thread and letting it go out of scope without calling join() or detach() causes std::terminate() and an immediate program crash.',
          quickCheck: {
            question: 'What happens if a std::thread object is destroyed while still joinable?',
            options: ['It automatically joins in the destructor', 'The thread is forcibly killed by the OS', 'std::terminate is called, crashing the program', 'It becomes a background daemon thread'],
            correctIndex: 2,
            explanation: 'In C++11/14/17, std::~thread() checks if joinable(). If true, it invokes std::terminate() immediately to prevent undefined behavior.'
          }
        },
        {
          id: 'cpp-w4-d22-t2',
          topicNumber: 2,
          title: 'Join vs Detach: Thread Lifecycle Hazards',
          explanation: [
            '`join()` blocks the calling thread until the target thread finishes execution and releases OS resources.',
            '`detach()` disassociates the thread handle from the underlying OS thread, allowing the thread to run independently in the background ("daemon thread").',
            'Detached threads are dangerous: if `main()` exits, the entire process terminates immediately, abruptly killing any active detached threads without running destructors.'
          ],
          keyRules: [
            'Prefer join() for deterministic lifecycle management.',
            'Never detach threads that access stack references or shared application resources that might be destroyed before the thread finishes.'
          ],
          codeSnippet: {
            id: 'cpp-snip-22-2',
            title: 'Deterministic Thread Joining',
            description: 'Joining multiple concurrent worker threads',
            language: 'cpp',
            code: `#include <iostream>
#include <thread>
#include <vector>

void task(int id) {
    std::cout << "Task " << id << " completed\\n";
}

int main() {
    std::vector<std::thread> workers;
    for (int i = 0; i < 4; ++i) {
        workers.emplace_back(task, i + 1);
    }
    for (auto& w : workers) {
        if (w.joinable()) w.join();
    }
    std::cout << "All 4 workers joined successfully.\\n";
    return 0;
}`
          },
          pitfall: 'Detaching a thread that references variables on a stack frame that exits leads to reading corrupt memory or segmentation faults.',
          quickCheck: {
            question: 'Why are detached threads hazardous in C++ applications?',
            options: ['They run at half CPU clock frequency', 'Process exit abruptly halts them without executing RAII stack destructors', 'They cannot write to console streams', 'They require root/administrator privileges'],
            correctIndex: 1,
            explanation: 'When the main thread returns from main(), the runtime calls exit(), which terminates all threads immediately, leaving destructors unexecuted.'
          }
        },
        {
          id: 'cpp-w4-d22-t3',
          topicNumber: 3,
          title: 'std::jthread in C++20: RAII Auto-Join & Cooperative Stop Tokens',
          explanation: [
            'C++20 introduced `std::jthread` ("joining thread"), fixing the major design flaw of `std::thread`.',
            'In its destructor, `std::jthread` automatically requests cancellation (via its stop token) and calls `join()`. This eliminates the fatal `std::terminate` hazard.',
            'Furthermore, `std::jthread` supports cooperative interruption via `std::stop_token` passed as the first parameter to the thread callable.'
          ],
          keyRules: [
            'Use std::jthread by default in modern C++20 code.',
            'Workers should regularly query `stoken.stop_requested()` to exit cleanly.'
          ],
          codeSnippet: {
            id: 'cpp-snip-22-3',
            title: 'C++20 std::jthread with Stop Token',
            description: 'Auto-joining thread with cooperative cancellation',
            language: 'cpp',
            code: `#include <iostream>
#include <thread>
#include <chrono>

void cancelableTask(std::stop_token stoken) {
    while (!stoken.stop_requested()) {
        std::cout << "Working...\\n";
        std::this_thread::sleep_for(std::chrono::milliseconds(50));
        break; // For demo run once
    }
    std::cout << "Exiting clean on stop request.\\n";
}

int main() {
    {
        std::jthread jt(cancelableTask);
        // jt automatically requests stop and joins when leaving this scope!
    }
    std::cout << "jthread safely joined out of scope!\\n";
    return 0;
}`
          },
          pitfall: 'Assuming jthread forcibly kills a thread: stop tokens are cooperative. The target thread must inspect the token and exit cooperatively.',
          quickCheck: {
            question: 'What is the primary difference between std::thread and std::jthread?',
            options: ['std::jthread auto-joins in its destructor and supports stop tokens', 'std::jthread is for JavaScript web workers only', 'std::jthread allocates 10x less memory', 'std::jthread runs synchronously on the same thread'],
            correctIndex: 0,
            explanation: 'std::jthread incorporates RAII joining on destruction and integrates cooperative cancellation via std::stop_token.'
          }
        },
        {
          id: 'cpp-w4-d22-t4',
          topicNumber: 4,
          title: 'Passing Arguments: std::ref vs Moving vs By-Value',
          explanation: [
            'By default, `std::thread` constructor decays arguments and makes COPIES into the internal thread storage tuple.',
            'If you want a thread to modify an existing variable by reference, you MUST explicitly wrap it in `std::ref()` or `std::cref()`.',
            'Move-only types (like `std::unique_ptr` or `std::packaged_task`) can be transferred into a thread using `std::move()`.'
          ],
          keyRules: [
            'Use std::ref(var) when passing arguments by reference into thread functions.',
            'Ensure referenced objects outlive the thread execution to avoid dangling reference crashes.'
          ],
          codeSnippet: {
            id: 'cpp-snip-22-4',
            title: 'Passing By Reference and By Move',
            description: 'Transferring data safely into a worker thread',
            language: 'cpp',
            code: `#include <iostream>
#include <thread>
#include <memory>

void modifyAccumulator(int& count, std::unique_ptr<std::string> ptr) {
    count += 100;
    std::cout << "Received string: " << *ptr << "\\n";
}

int main() {
    int total = 0;
    auto message = std::make_unique<std::string>("Thread Safe Payload");
    
    // std::ref for reference, std::move for unique_ptr
    std::thread t(modifyAccumulator, std::ref(total), std::move(message));
    t.join();
    
    std::cout << "Updated total: " << total << "\\n";
    return 0;
}`
          },
          pitfall: 'Omitting std::ref when the function signature expects a reference results in a cryptic compile error because std::thread copies arguments by default.',
          quickCheck: {
            question: 'How do you pass a variable by non-const reference into a std::thread constructor?',
            options: ['Pass with & prefix: std::thread(fn, &x)', 'Pass with std::ref(x)', 'Pass with std::move(x)', 'Threads cannot accept references'],
            correctIndex: 1,
            explanation: 'std::thread copies arguments unless wrapped in std::ref() or std::cref().'
          }
        },
        {
          id: 'cpp-w4-d22-t5',
          topicNumber: 5,
          title: 'Member Functions and Lambdas as Thread Targets',
          explanation: [
            'You can run class member functions on separate threads by providing the member function pointer and the object pointer `(&Class::method, &instance)`.',
            'Lambdas are the most common and idiomatic way to launch threads, allowing concise capture of necessary context.',
            'Always be cautious with lambda captures: default `[&]` captures can easily capture a stack variable that dies before the thread finishes.'
          ],
          keyRules: [
            'When using lambdas with threads, prefer explicit capture by value `[=]` or explicit named move captures `[data = std::move(data)]`.',
            'To run a member function: std::thread(&MyClass::run, &myInstance).'
          ],
          codeSnippet: {
            id: 'cpp-snip-22-5',
            title: 'Running Member Function on Thread',
            description: 'Dispatching member methods and lambdas',
            language: 'cpp',
            code: `#include <iostream>
#include <thread>

class ServerWorker {
public:
    void handleConnection(int clientId) {
        std::cout << "Processing client " << clientId << " on background thread\\n";
    }
};

int main() {
    ServerWorker worker;
    std::thread t(&ServerWorker::handleConnection, &worker, 7001);
    t.join();
    
    // Lambda thread
    std::thread lambdaThread([](int val) {
        std::cout << "Lambda thread received: " << val << "\\n";
    }, 999);
    lambdaThread.join();
    return 0;
}`
          },
          pitfall: 'Using `[&]` capture in a detached thread or long-running thread risks capturing local stack variables that get deallocated, causing undefined behavior.',
          quickCheck: {
            question: 'What is required to invoke a non-static member function on a new std::thread?',
            options: ['A static cast of the function', 'The address of the member function and a pointer/reference to the target object instance', 'The object must inherit from std::runnable', 'It is not possible in C++'],
            correctIndex: 1,
            explanation: 'std::thread(&Class::memberFn, &instance, args...) passes the member pointer and the instance pointer.'
          }
        },
        {
          id: 'cpp-w4-d22-t6',
          topicNumber: 6,
          title: 'Hardware Concurrency and CPU Core Detection',
          explanation: [
            '`std::thread::hardware_concurrency()` returns the number of concurrent execution threads supported by the physical CPU (taking hyperthreading into account).',
            'Creating more compute-bound threads than hardware cores causes thread thrashing: the CPU spends more time switching contexts than executing work.',
            'For I/O-bound tasks (disk/network), thread count can exceed core count because threads spend most of their time blocked.'
          ],
          keyRules: [
            'For CPU-bound tasks: optimal thread count is approximately std::thread::hardware_concurrency().',
            'Check for 0: on platforms where core count cannot be determined, hardware_concurrency() returns 0, so provide a fallback.'
          ],
          codeSnippet: {
            id: 'cpp-snip-22-6',
            title: 'Detecting Hardware Threads',
            description: 'Querying system capability to size a thread pool',
            language: 'cpp',
            code: `#include <iostream>
#include <thread>
#include <algorithm>

int main() {
    unsigned int cores = std::thread::hardware_concurrency();
    if (cores == 0) cores = 4; // safe default fallback
    
    std::cout << "Detected hardware execution threads: " << cores << "\\n";
    std::cout << "Recommended worker pool size: " << std::max(1u, cores) << "\\n";
    return 0;
}`
          },
          pitfall: 'Failing to handle hardware_concurrency() returning 0 can lead to allocating 0 worker threads in a thread pool, freezing task execution completely.',
          quickCheck: {
            question: 'What does std::thread::hardware_concurrency() return when the platform cannot detect the core count?',
            options: ['-1', '0', '1', 'It throws std::system_error'],
            correctIndex: 1,
            explanation: 'The C++ standard specifies that std::thread::hardware_concurrency() returns 0 if the value is not well-defined or computable.'
          }
        },
        {
          id: 'cpp-w4-d22-t7',
          topicNumber: 7,
          title: 'std::this_thread: Thread IDs, Yielding & Sleep',
          explanation: [
            'The `std::this_thread` namespace provides utilities to query and manipulate the currently running thread.',
            '`std::this_thread::get_id()` returns a unique, hashable `std::thread::id`.',
            '`std::this_thread::sleep_for(duration)` suspends execution for a minimum specified time using `<chrono>`.',
            '`std::this_thread::yield()` hints to the OS scheduler to let other waiting threads run, useful in busy-wait spin loops.'
          ],
          keyRules: [
            'Use std::this_thread::sleep_for(std::chrono::milliseconds(n)) for timed pauses.',
            'std::thread::id can be compared with == and outputted to std::cout.'
          ],
          codeSnippet: {
            id: 'cpp-snip-22-7',
            title: 'Thread Identity and Controlled Suspension',
            description: 'Inspecting current thread ID and timed sleep',
            language: 'cpp',
            code: `#include <iostream>
#include <thread>
#include <chrono>

void logWorker() {
    std::cout << "Subthread ID: " << std::this_thread::get_id() << "\\n";
    std::this_thread::sleep_for(std::chrono::milliseconds(10));
}

int main() {
    std::cout << "Main thread ID: " << std::this_thread::get_id() << "\\n";
    std::thread t(logWorker);
    t.join();
    return 0;
}`
          },
          pitfall: 'Using sleep_for() for thread synchronization instead of condition variables is brittle, slow, and creates timing race conditions.',
          quickCheck: {
            question: 'What is the purpose of std::this_thread::yield()?',
            options: ['It permanently terminates the thread', 'It yields control to the OS scheduler to allow other runnable threads to execute', 'It frees all memory allocated by the thread', 'It blocks until a mutex becomes unlocked'],
            correctIndex: 1,
            explanation: 'std::this_thread::yield() suggests to the operating system scheduler that it should grant CPU time to other threads ready to run.'
          }
        },
        {
          id: 'cpp-w4-d22-t8',
          topicNumber: 8,
          title: 'Thread-Local Storage (thread_local) and Exception Propagation',
          explanation: [
            'Variables declared with `thread_local` have a distinct, independent copy for every thread in the application.',
            'Their lifetime starts when the thread first visits them and ends when the thread terminates.',
            'Exceptions thrown inside a thread function do NOT propagate to the parent thread: uncaught exceptions call `std::terminate()`.',
            'To transport exceptions safely across threads, capture them with `std::current_exception()` into a `std::exception_ptr`.'
          ],
          keyRules: [
            'thread_local variables avoid lock contention for thread-private scratchpads and state.',
            'Uncaught exceptions inside worker threads immediately crash the entire process unless caught and forwarded.'
          ],
          codeSnippet: {
            id: 'cpp-snip-22-8',
            title: 'thread_local Counter & Exception Passing',
            description: 'Thread-local variables and cross-thread exceptions',
            language: 'cpp',
            code: `#include <iostream>
#include <thread>
#include <exception>

thread_local int threadCounter = 0;
std::exception_ptr crossThreadEx = nullptr;

void workerRoutine(int delta) {
    try {
        threadCounter += delta;
        if (delta < 0) throw std::runtime_error("Negative delta forbidden!");
    } catch (...) {
        crossThreadEx = std::current_exception();
    }
}

int main() {
    std::thread t(workerRoutine, -5);
    t.join();
    
    if (crossThreadEx) {
        try {
            std::rethrow_exception(crossThreadEx);
        } catch (const std::exception& e) {
            std::cout << "Caught exception from worker thread: " << e.what() << "\\n";
        }
    }
    return 0;
}`
          },
          pitfall: 'Expecting try-catch in main around `t.join()` to catch exceptions thrown inside `t` is a fatal mistake; they must be caught inside the thread routine.',
          quickCheck: {
            question: 'What occurs if an exception escapes a worker thread function unhandled?',
            options: ['The main thread catches it automatically', 'The thread restarts from the beginning', 'std::terminate is called, ending the entire process', 'The exception is logged to stderr and ignored'],
            correctIndex: 2,
            explanation: 'If an exception is not caught within the thread function, std::terminate() is called, terminating the program.'
          }
        }
      ]
    },
    {
      id: 'cpp-w4-d23',
      dayNumber: 23,
      weekNumber: 4,
      title: 'Mutexes, Locks & Deadlock Avoidance',
      subtitle: 'Critical sections, std::lock_guard, std::unique_lock, std::scoped_lock & reader-writer locks',
      durationMinutes: 75,
      overview:
        'Eliminate race conditions and deadlocks. Learn how to protect shared state with std::mutex, enforce RAII locking with std::lock_guard and std::unique_lock, achieve deadlock-free multi-resource locking with std::scoped_lock, and scale reads with std::shared_mutex.',
      topics: [
        {
          id: 'cpp-w4-d23-t1',
          topicNumber: 1,
          title: 'Data Races: The Root of Undefined Behavior',
          explanation: [
            'A Data Race occurs when two or more threads concurrently access the same memory location, at least one of the accesses is a write, and there is no synchronization.',
            'According to the C++ standard, a data race is UNDEFINED BEHAVIOR: the compiler may reorder instructions, tear multi-byte writes, or optimize variables into CPU registers.',
            'Synchronization tools like mutexes establish a "happens-before" relationship between writes and reads.'
          ],
          keyRules: [
            'Concurrent reads from multiple threads are completely safe.',
            'One write without synchronization concurrently with ANY other read or write is undefined behavior.'
          ],
          codeSnippet: {
            id: 'cpp-snip-23-1',
            title: 'Race Condition vs Synchronized Access',
            description: 'Why unsynchronized concurrent writes fail',
            language: 'cpp',
            code: `#include <iostream>
#include <thread>
#include <vector>
#include <mutex>

int sharedCounter = 0;
std::mutex mtx;

void safeIncrement() {
    for (int i = 0; i < 1000; ++i) {
        mtx.lock();
        sharedCounter++;
        mtx.unlock();
    }
}

int main() {
    std::thread t1(safeIncrement);
    std::thread t2(safeIncrement);
    t1.join();
    t2.join();
    std::cout << "Final counter: " << sharedCounter << " (expected 2000)\\n";
    return 0;
}`
          },
          pitfall: 'Calling manual mtx.lock() and mtx.unlock() is unsafe: if an exception is thrown before unlock(), the mutex remains locked forever (deadlock).',
          quickCheck: {
            question: 'Under the C++ standard, what is the consequence of a data race?',
            options: ['The compiler issues a warning at compile time', 'The operating system restarts the thread', 'Undefined behavior occurs, invalidating program correctness', 'The program raises a SIGBUS signal'],
            correctIndex: 2,
            explanation: 'A data race is strict Undefined Behavior under the C++ standard, meaning anything can happen including corrupt data or memory violation.'
          }
        },
        {
          id: 'cpp-w4-d23-t2',
          topicNumber: 2,
          title: 'std::lock_guard: RAII Scoped Locking',
          explanation: [
            '`std::lock_guard` is a lightweight RAII wrapper for a mutex.',
            'Its constructor acquires the lock on the given mutex; its destructor releases the lock automatically when leaving the scope.',
            'Because destructor execution is guaranteed during stack unwinding, `std::lock_guard` ensures exception safety: locks are never leaked.'
          ],
          keyRules: [
            'Always prefer RAII locks over explicit .lock() and .unlock() calls.',
            'Keep the critical section scope as short as possible to minimize contention.'
          ],
          codeSnippet: {
            id: 'cpp-snip-23-2',
            title: 'Exception-Safe Scoped Locking',
            description: 'Guaranteed unlock on normal exit or exception',
            language: 'cpp',
            code: `#include <iostream>
#include <mutex>
#include <vector>

std::vector<int> sharedList;
std::mutex listMtx;

void addData(int val) {
    // Lock acquired here, released automatically at closing brace
    std::lock_guard<std::mutex> lock(listMtx);
    sharedList.push_back(val);
    std::cout << "Added: " << val << "\\n";
}

int main() {
    addData(10);
    addData(20);
    return 0;
}`
          },
          pitfall: 'Creating an unnamed temporary `std::lock_guard<std::mutex>(mtx);` unlocks IMMEDIATELY at the semicolon, leaving the rest of the scope unprotected!',
          quickCheck: {
            question: 'What is the danger of writing `std::lock_guard<std::mutex>(myMutex);` without a variable name?',
            options: ['It fails to compile', 'It creates a temporary that locks and unlocks immediately at the end of that single statement', 'It causes an infinite loop', 'It creates a global lock'],
            correctIndex: 1,
            explanation: 'An unnamed temporary is destroyed at the end of the full expression (the semicolon), unlocking the mutex immediately and leaving subsequent code unprotected.'
          }
        },
        {
          id: 'cpp-w4-d23-t3',
          topicNumber: 3,
          title: 'std::unique_lock: Flexible Ownership and Conditional Locking',
          explanation: [
            '`std::unique_lock` is a more flexible RAII lock than `lock_guard`.',
            'It can be constructed without locking immediately (`std::defer_lock`), can lock and unlock multiple times during its lifetime, and can be moved across functions.',
            'It is mandatory when using condition variables (`std::condition_variable`), which require the ability to unlock and relock during `wait()`.'
          ],
          keyRules: [
            'Use std::lock_guard when you only need simple scoped locking.',
            'Use std::unique_lock when you need deferred locking, manual lock/unlock cycles, or condition variable integration.'
          ],
          codeSnippet: {
            id: 'cpp-snip-23-3',
            title: 'Flexible Locking with std::unique_lock',
            description: 'Deferred locking and manual unlock control',
            language: 'cpp',
            code: `#include <iostream>
#include <mutex>

std::mutex mtx;

void flexibleWork() {
    std::unique_lock<std::mutex> lock(mtx, std::defer_lock);
    // Do heavy pre-computations without holding the lock...
    
    lock.lock(); // acquire only when needed
    std::cout << "Critical section under unique_lock\\n";
    lock.unlock(); // release early if done with shared state
    
    // Do post-processing without blocking other threads
}`
          },
          pitfall: '`std::unique_lock` has slightly more memory overhead than `std::lock_guard` (it stores a boolean flag tracking lock ownership). Do not use it if a simple lock_guard suffices.',
          quickCheck: {
            question: 'Why does std::condition_variable require std::unique_lock instead of std::lock_guard?',
            options: ['Because unique_lock is faster', 'Because condition variables must unlock the mutex while waiting and re-lock it upon wake-up', 'Because lock_guard cannot be used with mutexes', 'Because lock_guard is deprecated'],
            correctIndex: 1,
            explanation: 'cv.wait() must atomically unlock the mutex to allow other threads to signal, and reacquire it when unblocked. std::unique_lock supports this dynamic locking.'
          }
        },
        {
          id: 'cpp-w4-d23-t4',
          topicNumber: 4,
          title: 'std::scoped_lock (C++17): Deadlock-Free Multi-Locking',
          explanation: [
            'A Deadlock occurs when Thread 1 holds Lock A and waits for Lock B, while Thread 2 holds Lock B and waits for Lock A. Both wait forever.',
            'C++17 introduced `std::scoped_lock`, which uses a deadlock-avoidance algorithm (like the Dining Philosophers order or try_lock backtracking) to lock any number of mutexes simultaneously.',
            'It supports Class Template Argument Deduction (CTAD): `std::scoped_lock lock(mtx1, mtx2);`.'
          ],
          keyRules: [
            'Whenever an operation requires locking more than one mutex, ALWAYS use std::scoped_lock.',
            'Never lock multiple mutexes sequentially with individual lock_guards.'
          ],
          codeSnippet: {
            id: 'cpp-snip-23-4',
            title: 'Deadlock-Free Transfer with std::scoped_lock',
            description: 'Safely locking two accounts simultaneously',
            language: 'cpp',
            code: `#include <iostream>
#include <mutex>

struct Account {
    int id;
    int balance;
    std::mutex mtx;
};

void transfer(Account& from, Account& to, int amount) {
    if (&from == &to) return; // avoid self-deadlock
    
    // Locks both mutexes simultaneously without deadlock
    std::scoped_lock lock(from.mtx, to.mtx);
    from.balance -= amount;
    to.balance += amount;
    std::cout << "Transferred " << amount << " from " << from.id << " to " << to.id << "\\n";
}

int main() {
    Account a{1, 500, {}};
    Account b{2, 300, {}};
    transfer(a, b, 150);
    return 0;
}`
          },
          pitfall: 'Attempting to lock the same `std::mutex` twice in `std::scoped_lock(a.mtx, a.mtx)` causes a self-deadlock; always check for identical object addresses.',
          quickCheck: {
            question: 'How does std::scoped_lock prevent deadlocks when locking multiple mutexes?',
            options: ['It disables thread switching in the kernel', 'It acquires all mutexes using a deadlock-avoidance algorithm simultaneously', 'It only allows one thread to exist in the application', 'It converts all mutexes to read-only locks'],
            correctIndex: 1,
            explanation: 'std::scoped_lock implements deadlock-avoidance lock acquisition across all supplied mutexes before returning.'
          }
        },
        {
          id: 'cpp-w4-d23-t5',
          topicNumber: 5,
          title: 'std::shared_mutex (C++17): Reader-Writer Optimization',
          explanation: [
            'In many real-world systems, reads outnumber writes by 100:1 (e.g. database lookups, config caches).',
            '`std::shared_mutex` allows multiple threads to acquire shared read access simultaneously via `std::shared_lock`.',
            'When a thread needs to write, it acquires exclusive access via `std::unique_lock`, blocking all readers until the write completes.'
          ],
          keyRules: [
            'Use std::shared_lock<std::shared_mutex> for read operations.',
            'Use std::unique_lock<std::shared_mutex> for write operations.'
          ],
          codeSnippet: {
            id: 'cpp-snip-23-5',
            title: 'Reader-Writer Thread-Safe Cache',
            description: 'Concurrent readers with exclusive writer',
            language: 'cpp',
            code: `#include <iostream>
#include <shared_mutex>
#include <unordered_map>
#include <string>

class ThreadSafeCache {
    mutable std::shared_mutex rwMtx;
    std::unordered_map<std::string, std::string> data;
public:
    std::string get(const std::string& key) const {
        std::shared_lock<std::shared_mutex> readLock(rwMtx); // shared
        auto it = data.find(key);
        return it != data.end() ? it->second : "";
    }
    
    void set(const std::string& key, const std::string& val) {
        std::unique_lock<std::shared_mutex> writeLock(rwMtx); // exclusive
        data[key] = val;
    }
};

int main() {
    ThreadSafeCache cache;
    cache.set("host", "127.0.0.1");
    std::cout << "Cached host: " << cache.get("host") << "\\n";
    return 0;
}`
          },
          pitfall: 'Using std::shared_mutex when reads and writes are 50/50 is often SLOWER than a normal std::mutex due to the extra atomic tracking overhead of reader counts.',
          quickCheck: {
            question: 'When is std::shared_mutex most beneficial?',
            options: ['When writes occur far more frequently than reads', 'When reads heavily dominate over infrequent writes', 'When there is only one thread running', 'When memory is constrained to under 1KB'],
            correctIndex: 1,
            explanation: 'std::shared_mutex excels when many threads read concurrent data without contention, while writers are rare and require exclusive locks.'
          }
        },
        {
          id: 'cpp-w4-d23-t6',
          topicNumber: 6,
          title: 'std::call_once & std::once_flag: Thread-Safe Lazy Initialization',
          explanation: [
            'Lazy initialization initializes a resource only when first requested.',
            'Doing lazy initialization with a naive `if (ptr == nullptr)` is a race condition.',
            'C++ provides `std::call_once` with `std::once_flag`, guaranteeing that the callable is executed exactly once across all competing threads with zero race conditions.'
          ],
          keyRules: [
            'C++11 also guarantees that static local variables in functions are initialized in a thread-safe manner (Meyers Singleton).',
            'std::call_once handles exceptions cleanly: if the callable throws, the flag is not set, allowing subsequent calls to retry.'
          ],
          codeSnippet: {
            id: 'cpp-snip-23-6',
            title: 'Thread-Safe Lazy Initialization',
            description: 'Ensuring a setup routine runs exactly once',
            language: 'cpp',
            code: `#include <iostream>
#include <mutex>
#include <thread>

std::once_flag initFlag;

void initializeEngine() {
    std::cout << "Engine initialized exactly once!\\n";
}

void workerAccess() {
    std::call_once(initFlag, initializeEngine);
    std::cout << "Worker proceeding\\n";
}

int main() {
    std::thread t1(workerAccess);
    std::thread t2(workerAccess);
    t1.join();
    t2.join();
    return 0;
}`
          },
          pitfall: 'Do not use naive double-checked locking without std::atomic or std::call_once, as processor instruction reordering will expose half-initialized objects to other threads.',
          quickCheck: {
            question: 'What occurs if the function passed to std::call_once throws an exception?',
            options: ['The program terminates immediately', 'The flag is not marked initialized, and a subsequent call will attempt initialization again', 'The exception is swallowed silently', 'All waiting threads are terminated'],
            correctIndex: 1,
            explanation: 'If an exception is thrown, the once_flag is not set, allowing another thread to attempt initialization.'
          }
        },
        {
          id: 'cpp-w4-d23-t7',
          topicNumber: 7,
          title: 'std::recursive_mutex vs Clean Separation of Concerns',
          explanation: [
            '`std::recursive_mutex` allows the same thread to acquire the lock multiple times without self-deadlock, maintaining an internal lock count.',
            'While it seems convenient for recursive functions or helper methods, it is widely considered an architectural code smell in production.',
            'It masks bad structural boundaries and makes reasoning about invariant validity difficult.'
          ],
          keyRules: [
            'Prefer splitting classes into public synchronized methods and private unchecked helper methods `(doWork_unlocked())`.',
            'Each acquisition of recursive_mutex must be paired with an equal number of unlocks.'
          ],
          codeSnippet: {
            id: 'cpp-snip-23-7',
            title: 'Refactoring Away from Recursive Mutex',
            description: 'Public locking wrapper over private unlocked implementation',
            language: 'cpp',
            code: `#include <iostream>
#include <mutex>

class DatabaseConnection {
    std::mutex mtx;
    
    // Private unchecked helper assuming mtx is already held
    void queryInternal(const std::string& sql) {
        std::cout << "Executing: " << sql << "\\n";
    }
public:
    void query(const std::string& sql) {
        std::lock_guard<std::mutex> lock(mtx);
        queryInternal(sql);
    }
    
    void batchQuery() {
        std::lock_guard<std::mutex> lock(mtx);
        queryInternal("SELECT 1;");
        queryInternal("SELECT 2;");
    }
};

int main() {
    DatabaseConnection db;
    db.batchQuery();
    return 0;
}`
          },
          pitfall: 'Using recursive_mutex makes it impossible to know which thread broke a class invariant when an exception is thrown midway through a nested critical section.',
          quickCheck: {
            question: 'What is the clean architectural alternative to using std::recursive_mutex?',
            options: ['Never use classes', 'Private helper functions that assume the mutex is already locked, called by public synchronized methods', 'Use detaching threads instead', 'Use std::terminate on duplicates'],
            correctIndex: 1,
            explanation: 'The standard idiom is to have public methods acquire the lock and delegate to private _unlocked() helper methods.'
          }
        },
        {
          id: 'cpp-w4-d23-t8',
          topicNumber: 8,
          title: 'Condition Variables: Producer-Consumer Coordination',
          explanation: [
            'A Condition Variable (`std::condition_variable`) allows threads to sleep efficiently until notified by another thread that a condition is met.',
            'This avoids CPU-wasting "busy-waiting" polling loops.',
            'When `cv.wait(lock, predicate)` is called: it checks the predicate. If false, it atomically releases the lock and puts the thread into an OS sleep queue.',
            'When notified, the thread wakes up, re-acquires the lock, and re-checks the predicate.'
          ],
          keyRules: [
            'ALWAYS pass a predicate lambda to cv.wait(lock, []{ return condition; }); to protect against spurious wakeups.',
            'Use notify_one() when waking a single worker, and notify_all() when state change affects all waiting threads.'
          ],
          codeSnippet: {
            id: 'cpp-snip-23-8',
            title: 'Producer-Consumer Synchronization',
            description: 'Waking worker when work queue has items',
            language: 'cpp',
            code: `#include <iostream>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <queue>

std::queue<int> tasks;
std::mutex mtx;
std::condition_variable cv;
bool finished = false;

void consumer() {
    std::unique_lock<std::mutex> lock(mtx);
    // Wait until queue is not empty or work finished
    cv.wait(lock, [] { return !tasks.empty() || finished; });
    
    while (!tasks.empty()) {
        int item = tasks.front();
        tasks.pop();
        std::cout << "Consumer processed: " << item << "\\n";
    }
}

void producer() {
    {
        std::lock_guard<std::mutex> lock(mtx);
        tasks.push(42);
        tasks.push(84);
        finished = true;
    }
    cv.notify_one(); // signal consumer
}

int main() {
    std::thread tCons(consumer);
    std::thread tProd(producer);
    tProd.join();
    tCons.join();
    return 0;
}`
          },
          pitfall: 'Calling `cv.wait(lock)` without a predicate loop exposes you to Spurious Wakeups (the OS waking the thread even though no notification was sent), leading to accessing an empty queue.',
          quickCheck: {
            question: 'What is a spurious wakeup in multithreading?',
            options: ['A CPU hardware glitch causing reboots', 'A condition variable waking a waiting thread even though no notification was signaled', 'An exception thrown by the scheduler', 'A thread joining before it finishes'],
            correctIndex: 1,
            explanation: 'Operating systems can wake sleeping threads due to internal scheduling interrupts without an explicit signal. The predicate protects against this.'
          }
        }
      ]
    },
    {
      id: 'cpp-w4-d24',
      dayNumber: 24,
      weekNumber: 4,
      title: 'Futures, Promises, Async & Lock-Free Atomics',
      subtitle: 'std::async, std::future, std::promise, std::atomic, memory orders & cache line false sharing',
      durationMinutes: 75,
      overview:
        'Harness asynchronous task execution and lock-free hardware atomics. Master std::async and std::future channels, atomic types and CAS (compare-and-swap), C++ memory models, and avoiding false sharing with cache-line alignment.',
      topics: [
        {
          id: 'cpp-w4-d24-t1',
          topicNumber: 1,
          title: 'std::async and std::future: High-Level Asynchronous Tasks',
          explanation: [
            '`std::async` runs a function asynchronously and returns a `std::future<T>` that will eventually hold the result.',
            'You retrieve the result by calling `future.get()`, which automatically blocks until the result is ready or rethrows any exception that occurred inside the task.',
            'Execution policies: `std::launch::async` guarantees a new thread; `std::launch::deferred` runs lazily on the calling thread only when `.get()` is called.'
          ],
          keyRules: [
            'Always explicitly specify `std::launch::async` if you want guaranteed parallel execution.',
            'Calling .get() can only be done ONCE per std::future.'
          ],
          codeSnippet: {
            id: 'cpp-snip-24-1',
            title: 'Asynchronous Computation with std::async',
            description: 'Fetching compute results asynchronously',
            language: 'cpp',
            code: `#include <iostream>
#include <future>

int calculateFactorial(int n) {
    int res = 1;
    for (int i = 2; i <= n; ++i) res *= i;
    return res;
}

int main() {
    // Launch task asynchronously
    std::future<int> fut = std::async(std::launch::async, calculateFactorial, 6);
    
    std::cout << "Main thread doing other work...\\n";
    int result = fut.get(); // blocks until ready
    std::cout << "Factorial 6 = " << result << "\\n";
    return 0;
}`
          },
          pitfall: 'Discarding the returned future `std::async(std::launch::async, ...);` blocks immediately in the temporary future destructor, running synchronously!',
          quickCheck: {
            question: 'What happens if you do not store the std::future returned by std::async(std::launch::async, ...)?',
            options: ['It crashes with an error', 'The temporary future destructor blocks until the async task completes, making it synchronous', 'The task is cancelled immediately', 'It runs in the background indefinitely'],
            correctIndex: 1,
            explanation: 'The destructor of a temporary std::future returned from std::async blocks until the asynchronous task finishes, turning what was intended to be async into synchronous.'
          }
        },
        {
          id: 'cpp-w4-d24-t2',
          topicNumber: 2,
          title: 'std::promise and std::future: Point-to-Point Communication Channels',
          explanation: [
            'A `std::promise<T>` is the write end of a channel, and `std::future<T>` is the read end.',
            'The producer thread calls `promise.set_value(data)` or `promise.set_exception(ptr)`.',
            'The consumer thread holds `promise.get_future()` and calls `future.get()` to wait for the value.',
            'This provides a clean, synchronized, one-shot pipeline without manual mutexes.'
          ],
          keyRules: [
            'A promise can only fulfill a value or exception exactly ONCE.',
            'Setting a value on an already-fulfilled promise throws std::future_error.'
          ],
          codeSnippet: {
            id: 'cpp-snip-24-2',
            title: 'Decoupled Handshake with std::promise',
            description: 'Producer setting value for consumer future',
            language: 'cpp',
            code: `#include <iostream>
#include <future>
#include <thread>

void worker(std::promise<std::string> prom) {
    prom.set_value("Payload from worker thread");
}

int main() {
    std::promise<std::string> myPromise;
    std::future<std::string> myFuture = myPromise.get_future();
    
    std::thread t(worker, std::move(myPromise));
    std::cout << "Waiting for payload: " << myFuture.get() << "\\n";
    t.join();
    return 0;
}`
          },
          pitfall: 'If a promise is destroyed before setting a value or exception, waiting futures throw `std::future_error` with `broken_promise`.',
          quickCheck: {
            question: 'What happens if a std::promise is destroyed without setting a value or exception?',
            options: ['Waiting futures hang forever', 'The waiting future throws std::future_error (broken_promise)', 'The value defaults to 0', 'The process terminates'],
            correctIndex: 1,
            explanation: 'Destroying an unfulfilled promise breaks the channel and causes .get() on the future to throw std::future_error with code broken_promise.'
          }
        },
        {
          id: 'cpp-w4-d24-t3',
          topicNumber: 3,
          title: 'std::atomic<T>: Lock-Free Hardware Primitives',
          explanation: [
            '`std::atomic<T>` provides lock-free, race-free operations on scalar types (integers, booleans, pointers).',
            'Operations are translated by the compiler into single CPU hardware atomic instructions (e.g. `LOCK XADD` or `CMPXCHG` on x86).',
            'No OS mutexes, kernel context switches, or sleeping threads are involved, achieving nanosecond-level synchronization speeds.'
          ],
          keyRules: [
            'Always check `myAtomic.is_lock_free()` to verify that the target CPU supports lock-free hardware instructions for that type size.',
            'std::atomic types are non-copyable and non-movable; initialize or store them explicitly.'
          ],
          codeSnippet: {
            id: 'cpp-snip-24-3',
            title: 'High-Throughput Atomic Counter',
            description: 'Thread-safe counter without mutex locks',
            language: 'cpp',
            code: `#include <iostream>
#include <atomic>
#include <thread>
#include <vector>

std::atomic<int> atomicCounter{0};

void increment() {
    for (int i = 0; i < 5000; ++i) {
        atomicCounter.fetch_add(1); // or ++atomicCounter
    }
}

int main() {
    std::cout << "Is lock free? " << (atomicCounter.is_lock_free() ? "Yes" : "No") << "\\n";
    std::vector<std::thread> threads;
    for (int i = 0; i < 4; ++i) threads.emplace_back(increment);
    for (auto& t : threads) t.join();
    
    std::cout << "Final atomic sum: " << atomicCounter.load() << " (expected 20000)\\n";
    return 0;
}`
          },
          pitfall: 'Writing `atomicVar = atomicVar + 1;` is TWO operations (load then store), which is NOT atomic! Always use `atomicVar.fetch_add(1)` or `atomicVar++`.',
          quickCheck: {
            question: 'Why is `atomicVar.fetch_add(1)` safe while `atomicVar = atomicVar + 1` can produce race conditions?',
            options: ['fetch_add is a single hardware atomic instruction; the latter is a separate read and separate write', 'fetch_add allocates heap memory', 'The latter is rejected by the compiler', 'They are strictly identical'],
            correctIndex: 0,
            explanation: 'The statement atomicVar = atomicVar + 1 does an atomic load followed by an atomic store; another thread can modify the value between the two operations.'
          }
        },
        {
          id: 'cpp-w4-d24-t4',
          topicNumber: 4,
          title: 'Compare-And-Swap (CAS): The Foundation of Lock-Free Algorithms',
          explanation: [
            '`compare_exchange_weak` and `compare_exchange_strong` are the fundamental building blocks of all lock-free stacks, queues, and hazard pointers.',
            'CAS compares the atomic variable against an `expected` value. If equal, it stores `desired` and returns true. If not equal, it loads the actual current value into `expected` and returns false.',
            'Use `weak` in loops (it allows spurious failures on ARM/RISC architectures for higher performance); use `strong` outside loops.'
          ],
          keyRules: [
            'Use compare_exchange_weak in a while-loop for maximum throughput on RISC architectures.',
            'Ensure your loop handles retries gracefully.'
          ],
          codeSnippet: {
            id: 'cpp-snip-24-4',
            title: 'Atomic Compare-And-Swap Update',
            description: 'Atomic update of a value based on current state',
            language: 'cpp',
            code: `#include <iostream>
#include <atomic>

std::atomic<int> maxVal{10};

void updateMaximum(int candidate) {
    int current = maxVal.load();
    // Loop until candidate is not greater OR successfully swapped
    while (candidate > current && !maxVal.compare_exchange_weak(current, candidate)) {
        // current is automatically updated with the latest value on CAS failure!
    }
}

int main() {
    updateMaximum(25);
    updateMaximum(15); // should not reduce
    std::cout << "Maximum recorded: " << maxVal.load() << "\\n";
    return 0;
}`
          },
          pitfall: 'The ABA Problem: Thread 1 reads value A; Thread 2 changes A to B then back to A; Thread 1 CAS succeeds even though underlying state changed. Solution: tagged pointers with version counters.',
          quickCheck: {
            question: 'What is the key difference between compare_exchange_weak and compare_exchange_strong?',
            options: ['Weak only works on integers', 'Weak may fail spuriously even if values match, but is faster in retry loops on RISC architectures', 'Strong never updates the expected parameter', 'Weak is deprecated in C++20'],
            correctIndex: 1,
            explanation: 'compare_exchange_weak can fail spuriously due to cache invalidations or context switches on LL/SC architectures, but generates faster assembly inside loops.'
          }
        },
        {
          id: 'cpp-w4-d24-t5',
          topicNumber: 5,
          title: 'C++ Memory Ordering: Relaxed, Acquire-Release & Sequentially Consistent',
          explanation: [
            'By default, all atomic operations use `std::memory_order_seq_cst` (Sequential Consistency): a globally uniform total order across all CPU cores.',
            '`std::memory_order_relaxed`: Guarantees atomicity only, with NO ordering constraints or memory fences (fastest).',
            '`std::memory_order_acquire`: Prevents subsequent reads/writes from being reordered BEFORE this read.',
            '`std::memory_order_release`: Prevents preceding reads/writes from being reordered AFTER this write.',
            'Acquire-Release pairs synchronize memory without full barrier bus locking.'
          ],
          keyRules: [
            'Stick to sequential consistency (default) unless profiling proves a memory barrier bottleneck.',
            'Pair a release store with an acquire load to publish complex data without mutexes.'
          ],
          codeSnippet: {
            id: 'cpp-snip-24-5',
            title: 'Acquire-Release Synchronization',
            description: 'Publishing non-atomic payload with atomic flag',
            language: 'cpp',
            code: `#include <iostream>
#include <atomic>
#include <thread>
#include <string>

std::string sharedPayload;
std::atomic<bool> ready{false};

void producer() {
    sharedPayload = "High-Performance Data Ready";
    // Store release ensures sharedPayload write is visible before ready becomes true
    ready.store(true, std::memory_order_release);
}

void consumer() {
    // Acquire load ensures reads after this see data written before the release store
    while (!ready.load(std::memory_order_acquire)) {
        std::this_thread::yield();
    }
    std::cout << "Consumed safely: " << sharedPayload << "\\n";
}

int main() {
    std::thread t2(consumer);
    std::thread t1(producer);
    t1.join();
    t2.join();
    return 0;
}`
          },
          pitfall: 'Using memory_order_relaxed to publish pointers or payloads causes other threads to see the atomic flag true before the payload writes have flushed from CPU store buffers!',
          quickCheck: {
            question: 'What is the purpose of std::memory_order_release on a store operation?',
            options: ['It frees the atomic object from heap memory', 'It ensures all prior memory writes in the current thread become visible before this store', 'It unlocks all active mutexes', 'It relaxes memory consistency completely'],
            correctIndex: 1,
            explanation: 'std::memory_order_release prevents any memory writes prior to the store from being reordered past the store operation.'
          }
        },
        {
          id: 'cpp-w4-d24-t6',
          topicNumber: 6,
          title: 'False Sharing & Cache Line Alignment',
          explanation: [
            'Modern CPUs do not fetch individual bytes; they fetch 64-byte Cache Lines into L1/L2 caches.',
            'False Sharing happens when two independent threads modify distinct variables that happen to share the same 64-byte cache line.',
            'Each write invalidates the cache line across all CPU cores, causing constant bus ping-pong and degrading performance by up to 50x.',
            'Fix: Align concurrent variables with `alignas(std::hardware_destructive_interference_size)`.'
          ],
          keyRules: [
            'Ensure independent thread-modified variables do not occupy the same 64-byte cache line.',
            'Use alignas(64) or std::hardware_destructive_interference_size in performance-critical structs.'
          ],
          codeSnippet: {
            id: 'cpp-snip-24-6',
            title: 'Eliminating False Sharing with Alignment',
            description: 'Aligning thread counters to separate cache lines',
            language: 'cpp',
            code: `#include <iostream>
#include <new>

// Struct with cache line padding to prevent false sharing
struct alignas(64) PaddedCounter {
    std::atomic<uint64_t> count{0};
    // 64-byte alignment ensures each instance occupies its own CPU cache line
};

int main() {
    PaddedCounter counterA;
    PaddedCounter counterB;
    
    std::cout << "Address A: " << &counterA << "\\n";
    std::cout << "Address B: " << &counterB << "\\n";
    std::cout << "Byte offset: " << (reinterpret_cast<char*>(&counterB) - reinterpret_cast<char*>(&counterA)) << " bytes\\n";
    return 0;
}`
          },
          pitfall: 'Placing an array of atomic counters `std::atomic<int> workerCounts[8]` directly adjacent creates terrible false sharing as all 8 cores fight over a single cache line.',
          quickCheck: {
            question: 'What causes false sharing in multi-threaded programs?',
            options: ['Sharing source files between compilers', 'Threads modifying distinct variables that reside within the same CPU cache line (typically 64 bytes)', 'Threads sharing the same process ID', 'Running on single-core processors'],
            correctIndex: 1,
            explanation: 'When independent variables modified by different cores share a 64-byte cache line, the CPU cache coherence protocol repeatedly invalidates the line across cores.'
          }
        },
        {
          id: 'cpp-w4-d24-t7',
          topicNumber: 7,
          title: 'C++20 Atomic Waiting and Notification: atomic::wait & atomic::notify_one',
          explanation: [
            'In C++20, `std::atomic` can act as an ultra-efficient futex-based condition variable without allocating a `std::condition_variable` or mutex.',
            '`atomic.wait(oldValue)` suspends the calling thread if `atomic.load() == oldValue` using kernel fast user-space mutexes (futex on Linux).',
            'The modifying thread calls `atomic.notify_one()` or `atomic.notify_all()` to wake sleeping waiters.',
            'This provides the lowest-overhead synchronization primitive available in the C++ standard.'
          ],
          keyRules: [
            'atomic::wait() eliminates the need for a separate std::mutex and std::condition_variable for single-flag coordination.',
            'Available on all atomic types including std::atomic_flag.'
          ],
          codeSnippet: {
            id: 'cpp-snip-24-7',
            title: 'C++20 atomic::wait and notify',
            description: 'Sleeping directly on atomic flag without mutex',
            language: 'cpp',
            code: `#include <iostream>
#include <atomic>
#include <thread>

std::atomic<int> signalFlag{0};

void worker() {
    std::cout << "Worker waiting for signalFlag != 0...\\n";
    // Block until signalFlag is no longer 0
    signalFlag.wait(0);
    std::cout << "Worker woke up with flag: " << signalFlag.load() << "\\n";
}

int main() {
    std::thread t(worker);
    std::this_thread::sleep_for(std::chrono::milliseconds(20));
    
    signalFlag.store(1);
    signalFlag.notify_one(); // wake waiting thread
    t.join();
    return 0;
}`
          },
          pitfall: 'Forget calling notify_one() after storing a new value: waiters will block indefinitely because atomic stores do not automatically wake threads.',
          quickCheck: {
            question: 'What is the main advantage of C++20 atomic::wait over std::condition_variable?',
            options: ['It uses 10x more threads', 'It does not require a separate std::mutex or std::unique_lock', 'It works on files', 'It only works in debug mode'],
            correctIndex: 1,
            explanation: 'std::atomic::wait blocks directly on the atomic variable via OS futexes without requiring a companion mutex or condition_variable.'
          }
        },
        {
          id: 'cpp-w4-d24-t8',
          topicNumber: 8,
          title: 'Lock-Free Single-Producer Single-Consumer (SPSC) Ring Buffer',
          explanation: [
            'In high-frequency trading (HFT) and audio DSP, locks are forbidden due to non-deterministic latency.',
            'A Single-Producer Single-Consumer (SPSC) ring buffer enables zero-lock communication between one writer and one reader.',
            'It uses a circular buffer with atomic `head` and `tail` indices using acquire-release memory ordering.',
            'Writes and reads proceed at line-rate with zero system calls and zero blocking.'
          ],
          keyRules: [
            'SPSC queues are valid ONLY for exactly one producer thread and one consumer thread.',
            'Multiple producers require CAS-based MPMC queues.'
          ],
          codeSnippet: {
            id: 'cpp-snip-24-8',
            title: 'Lock-Free SPSC Ring Buffer Concept',
            description: 'Circular atomic queue for ultra-low latency',
            language: 'cpp',
            code: `#include <iostream>
#include <atomic>
#include <array>

template <typename T, size_t Capacity>
class SpscQueue {
    std::array<T, Capacity> buffer;
    alignas(64) std::atomic<size_t> head{0};
    alignas(64) std::atomic<size_t> tail{0};
public:
    bool push(const T& item) {
        size_t currentTail = tail.load(std::memory_order_relaxed);
        size_t nextTail = (currentTail + 1) % Capacity;
        if (nextTail == head.load(std::memory_order_acquire)) {
            return false; // Queue full
        }
        buffer[currentTail] = item;
        tail.store(nextTail, std::memory_order_release);
        return true;
    }
    
    bool pop(T& item) {
        size_t currentHead = head.load(std::memory_order_relaxed);
        if (currentHead == tail.load(std::memory_order_acquire)) {
            return false; // Queue empty
        }
        item = buffer[currentHead];
        head.store((currentHead + 1) % Capacity, std::memory_order_release);
        return true;
    }
};

int main() {
    SpscQueue<int, 16> q;
    q.push(101);
    q.push(202);
    int val = 0;
    while (q.pop(val)) {
        std::cout << "Popped: " << val << "\\n";
    }
    return 0;
}`
          },
          pitfall: 'Using an SPSC queue with multiple concurrent producers will corrupt the buffer pointers because relaxed loads and stores are not safe for multi-writer races.',
          quickCheck: {
            question: 'Why can an SPSC queue operate without mutexes or CAS loops?',
            options: ['Because only one thread writes to head and only one thread writes to tail', 'Because it disables CPU interrupts', 'Because it allocates endless memory', 'Because it uses Python under the hood'],
            correctIndex: 0,
            explanation: 'With single producer and single consumer, each index (head/tail) has only one writer, so acquire-release stores and loads suffice without CAS contention.'
          }
        }
      ]
    },
    {
      id: 'cpp-w4-d25',
      dayNumber: 25,
      weekNumber: 4,
      title: 'Systems Programming: std::filesystem, POSIX & Bit Twiddling',
      subtitle: 'Path manipulation, directory traversal, fast binary I/O, mmap, POSIX calls & C++20 <bit>',
      durationMinutes: 70,
      overview:
        'Bridge C++ to the underlying operating system. Master std::filesystem for cross-platform file and directory operations, zero-copy memory-mapped file access (mmap), bitwise intrinsics with C++20 <bit>, and graceful OS signal handling.',
      topics: [
        {
          id: 'cpp-w4-d25-t1',
          topicNumber: 1,
          title: 'std::filesystem (C++17): Cross-Platform Path Handling',
          explanation: [
            'C++17 standardized `<filesystem>`, providing portable path manipulation across Windows (backslashes) and POSIX (forward slashes).',
            '`std::filesystem::path` handles path concatenation (`/`), filename extraction, extensions, parent paths, and canonicalization.',
            'It supports non-throwing overloads accepting `std::error_code&` to avoid expensive exception overhead in file scanning.'
          ],
          keyRules: [
            'Use the `/` operator for path composition: `path dir = "base"; path file = dir / "data.bin";`.',
            'Always handle non-existent paths with `std::filesystem::exists()`.',
            'Use the std::error_code overload in tight loops to avoid throwing exceptions for routine missing files.'
          ],
          codeSnippet: {
            id: 'cpp-snip-25-1',
            title: 'Portable Path Manipulation',
            description: 'Composing and inspecting filesystem paths',
            language: 'cpp',
            code: `#include <iostream>
#include <filesystem>

namespace fs = std::filesystem;

int main() {
    fs::path p = "/var/log/app";
    p /= "server.log"; // appends with OS-native separator
    
    std::cout << "Full path: " << p << "\\n";
    std::cout << "Filename:  " << p.filename() << "\\n";
    std::cout << "Stem:      " << p.stem() << "\\n";
    std::cout << "Extension: " << p.extension() << "\\n";
    std::cout << "Parent:    " << p.parent_path() << "\\n";
    return 0;
}`
          },
          pitfall: 'Using manual string concatenation `path + "/" + file` breaks Windows compatibility; always use the `path::operator/=` overload.',
          quickCheck: {
            question: 'What operator does std::filesystem::path provide to append subdirectories portably?',
            options: ['+', '/', '->', '<<'],
            correctIndex: 1,
            explanation: 'The / operator is overloaded to append path components using the operating systems native directory separator.'
          }
        },
        {
          id: 'cpp-w4-d25-t2',
          topicNumber: 2,
          title: 'Directory Iteration and Recursive File Tree Scanning',
          explanation: [
            '`fs::directory_iterator` iterates non-recursively over the entries in a single folder.',
            '`fs::recursive_directory_iterator` traverses an entire file hierarchy recursively.',
            'Each entry yields a `directory_entry` with cached status (is_regular_file, is_directory, file_size, last_write_time).'
          ],
          keyRules: [
            'Check `entry.is_regular_file()` before querying `entry.file_size()`.',
            'Use `fs::copy_options` and `fs::create_directories()` for recursive folder setup.'
          ],
          codeSnippet: {
            id: 'cpp-snip-25-2',
            title: 'Recursive Directory Scanning',
            description: 'Walking directory trees with error code handling',
            language: 'cpp',
            code: `#include <iostream>
#include <filesystem>

namespace fs = std::filesystem;

void scanFiles(const fs::path& target) {
    std::error_code ec;
    if (!fs::exists(target, ec)) {
        std::cout << "Target path does not exist\\n";
        return;
    }
    
    for (const auto& entry : fs::directory_iterator(target, ec)) {
        if (entry.is_regular_file()) {
            std::cout << "File: " << entry.path().filename() << " (" << entry.file_size() << " bytes)\\n";
        } else if (entry.is_directory()) {
            std::cout << "Dir:  " << entry.path().filename() << "\\n";
        }
    }
}

int main() {
    scanFiles(".");
    return 0;
}`
          },
          pitfall: 'Calling entry.file_size() on a directory or symlink points can throw a filesystem_error on some operating systems.',
          quickCheck: {
            question: 'Which iterator should you use to search for a file in all nested subfolders?',
            options: ['fs::directory_iterator', 'fs::recursive_directory_iterator', 'fs::deep_search_iterator', 'std::filesystem_iterator'],
            correctIndex: 1,
            explanation: 'fs::recursive_directory_iterator automatically descends into all nested subdirectories during traversal.'
          }
        },
        {
          id: 'cpp-w4-d25-t3',
          topicNumber: 3,
          title: 'Fast Binary File I/O with std::ifstream & std::ofstream',
          explanation: [
            'Formatted I/O (`<<` and `>>`) converts binary integers into ASCII text characters, which is slow for gigabytes of structured data.',
            'Raw binary I/O uses `.read()` and `.write()` with `reinterpret_cast<char*>`, bypassing formatting and copying memory buffers directly.',
            'Always open binary streams with `std::ios::binary` to avoid line-ending conversions (`\\r\\n` to `\\n` on Windows).'
          ],
          keyRules: [
            'Always specify std::ios::binary for binary streams.',
            'Verify file opened successfully with `if (!file) throw ...` or check `.is_open()`.',
            'Read and write POD/trivially-copyable structs directly.'
          ],
          codeSnippet: {
            id: 'cpp-snip-25-3',
            title: 'Raw Binary Serialization',
            description: 'Direct memory buffer write and read',
            language: 'cpp',
            code: `#include <iostream>
#include <fstream>
#include <vector>

struct Header {
    uint32_t magic;
    uint32_t version;
    uint64_t recordCount;
};

int main() {
    Header outHdr{0xDEADBEEF, 1, 1000000};
    
    // Writing binary struct
    {
        std::ofstream out("header.bin", std::ios::binary);
        out.write(reinterpret_cast<const char*>(&outHdr), sizeof(Header));
    }
    
    // Reading binary struct
    Header inHdr{};
    {
        std::ifstream in("header.bin", std::ios::binary);
        in.read(reinterpret_cast<char*>(&inHdr), sizeof(Header));
    }
    
    std::cout << "Read Magic: 0x" << std::hex << inHdr.magic << " Records: " << std::dec << inHdr.recordCount << "\\n";
    return 0;
}`
          },
          pitfall: 'Never write classes containing pointers, `std::string`, or `std::vector` directly with raw `write(&obj, sizeof(obj))`. It writes dead memory addresses instead of payload content!',
          quickCheck: {
            question: 'Why must binary files be opened with std::ios::binary on Windows?',
            options: ['It activates hardware compression', 'To prevent automatic translation between newline \\n and carriage return \\r\\n which corrupts binary bytes', 'It sets read-only permissions', 'Binary mode is required for file deletion'],
            correctIndex: 1,
            explanation: 'On Windows, text streams convert \\n into \\r\\n on write and strip \\r on read. If a binary byte happens to be 0x0A (10), it corrupts the file.'
          }
        },
        {
          id: 'cpp-w4-d25-t4',
          topicNumber: 4,
          title: 'Memory-Mapped Files (mmap): Zero-Copy File Processing',
          explanation: [
            '`mmap` (POSIX) and `CreateFileMapping` (Windows) map a file directly into the application process virtual memory address space.',
            'Reading from memory triggers OS page faults that fetch disk blocks directly into RAM without copying into intermediate user-space stream buffers (Zero-Copy).',
            'Enables accessing multi-gigabyte files as simple `const char*` arrays with near-instant random access and OS cache sharing.'
          ],
          keyRules: [
            'Zero-copy: no allocation of intermediate buffers.',
            'The OS manages caching, paging out blocks under memory pressure automatically.'
          ],
          codeSnippet: {
            id: 'cpp-snip-25-4',
            title: 'Memory-Mapped File Conceptual Model',
            description: 'Direct memory pointer access to disk blocks',
            language: 'cpp',
            code: `#include <iostream>
#include <string_view>

// Conceptual portable wrapper around POSIX mmap / Win32 MapViewOfFile
class MappedFileView {
    const char* dataPtr = nullptr;
    size_t fileSize = 0;
public:
    MappedFileView(const char* mockData, size_t size) : dataPtr(mockData), fileSize(size) {}
    
    std::string_view view() const {
        return std::string_view(dataPtr, fileSize);
    }
};

int main() {
    const char sampleDiskData[] = "HEADER_V1:FAST_PARSING_RECORD_CHUNK";
    MappedFileView mapped(sampleDiskData, sizeof(sampleDiskData) - 1);
    
    std::cout << "Mapped file content: " << mapped.view() << "\\n";
    std::cout << "Byte at index 7: " << mapped.view()[7] << "\\n";
    return 0;
}`
          },
          pitfall: 'Accessing memory past the end of a mapped file triggers a hardware `SIGBUS` signal on Linux, which terminates the process unless specifically caught.',
          quickCheck: {
            question: 'What is the primary performance benefit of memory mapping (mmap) compared to standard read() syscalls?',
            options: ['It encrypts data automatically', 'It avoids copying data between kernel buffers and user-space memory (zero-copy)', 'It compiles C++ code faster', 'It prevents disk fragmentation'],
            correctIndex: 1,
            explanation: 'mmap maps kernel page cache directly into process virtual memory, eliminating the memory copy required by read() system calls.'
          }
        },
        {
          id: 'cpp-w4-d25-t5',
          topicNumber: 5,
          title: 'POSIX System Calls in C++: File Descriptors & Error Handling',
          explanation: [
            'Low-level systems programming frequently interacts with POSIX APIs: `open()`, `close()`, `read()`, `write()`, `socket()`, and `epoll()`.',
            'POSIX uses integer File Descriptors (`int fd`) rather than C++ stream objects.',
            'Errors are indicated by returning `-1` and setting the thread-local global `errno`.',
            'Always wrap file descriptors in RAII classes (FileDescriptor guard) to avoid leaking kernel file handles on exceptions.'
          ],
          keyRules: [
            'Wrap raw file descriptors in an RAII class that calls close(fd) in the destructor.',
            'Use `std::strerror(errno)` or `std::system_category()` to format readable error messages.'
          ],
          codeSnippet: {
            id: 'cpp-snip-25-5',
            title: 'RAII File Descriptor Guard',
            description: 'Automatic close on scope exit for POSIX file descriptors',
            language: 'cpp',
            code: `#include <iostream>
#include <utility>

class ScopedFd {
    int fd;
public:
    explicit ScopedFd(int descriptor = -1) : fd(descriptor) {}
    ~ScopedFd() {
        if (fd >= 0) {
            // ::close(fd);
            std::cout << "Closing OS file descriptor: " << fd << "\\n";
        }
    }
    
    // Non-copyable, movable
    ScopedFd(const ScopedFd&) = delete;
    ScopedFd& operator=(const ScopedFd&) = delete;
    ScopedFd(ScopedFd&& other) noexcept : fd(std::exchange(other.fd, -1)) {}
    
    int get() const { return fd; }
};

int main() {
    {
        ScopedFd fd(3);
        std::cout << "Using descriptor: " << fd.get() << "\\n";
    } // fd 3 closed here automatically
    return 0;
}`
          },
          pitfall: 'Forgetting to close file descriptors leaks OS table handles; once process limits (e.g. 1024) are reached, open() and socket() calls fail.',
          quickCheck: {
            question: 'How should raw OS file descriptors be managed in modern C++?',
            options: ['Close them manually at the end of main()', 'Wrap them in an RAII class whose destructor invokes close()', 'Leave them open; the OS cleans them up instantly during run', 'Store them in a global vector without cleanup'],
            correctIndex: 1,
            explanation: 'Wrapping file descriptors in an RAII class ensures deterministic cleanup during stack unwinding or exception propagation.'
          }
        },
        {
          id: 'cpp-w4-d25-t6',
          topicNumber: 6,
          title: 'C++20 <bit>: Hardware Bit Manipulation & Endianness',
          explanation: [
            'Before C++20, bit manipulation relied on non-standard compiler intrinsics (`__builtin_popcount`, `_BitScanForward`).',
            'C++20 `<bit>` standardizes hardware-accelerated bit operations:',
            '- `std::popcount()`: Count set 1-bits (CPU POPCNT instruction).',
            '- `std::countl_zero()` / `countr_zero()`: Count leading/trailing zero bits (LZCNT/TZCNT).',
            '- `std::bit_cast<To>(from)`: Safe type-punning without undefined behavior.',
            '- `std::endian::native`: Detect CPU endianness (Little vs Big Endian).'
          ],
          keyRules: [
            'Use std::bit_cast instead of reinterpret_cast for type-punning floats and ints (avoids strict aliasing violations).',
            'std::popcount generates single-cycle hardware CPU instructions.'
          ],
          codeSnippet: {
            id: 'cpp-snip-25-6',
            title: 'Modern Hardware Bit Operations',
            description: 'Single-instruction population count and bit inspection',
            language: 'cpp',
            code: `#include <iostream>
#include <bit>
#include <cstdint>

int main() {
    uint32_t flags = 0b10110100;
    
    std::cout << "Set bits (popcount):   " << std::popcount(flags) << "\\n";
    std::cout << "Trailing zeros:        " << std::countr_zero(flags) << "\\n";
    std::cout << "Leading zeros (32b):   " << std::countl_zero(flags) << "\\n";
    std::cout << "Is power of 2?         " << (std::has_single_bit(flags) ? "Yes" : "No") << "\\n";
    
    // Check system byte order
    if constexpr (std::endian::native == std::endian::little) {
        std::cout << "Architecture: Little Endian (x86/x64/ARM)\\n";
    }
    return 0;
}`
          },
          pitfall: 'Using `reinterpret_cast<uint32_t*>(&myFloat)` for type-punning violates C++ Strict Aliasing Rules and triggers undefined compiler optimizations; always use `std::bit_cast`.',
          quickCheck: {
            question: 'What is the correct, standard-compliant way to inspect the raw bits of a float as a uint32_t in C++20?',
            options: ['reinterpret_cast<uint32_t*>(&f)', 'std::bit_cast<uint32_t>(f)', '*(uint32_t*)&f', 'static_cast<uint32_t>(f)'],
            correctIndex: 1,
            explanation: 'std::bit_cast is the only standard-compliant way to perform type-punning without violating strict aliasing rules or invoking undefined behavior.'
          }
        },
        {
          id: 'cpp-w4-d25-t7',
          topicNumber: 7,
          title: 'Signal Handling & Clean Graceful Shutdown',
          explanation: [
            'Operating systems deliver signals (e.g. `SIGINT` on Ctrl+C, `SIGTERM` on service kill) to request application termination.',
            'Signal handlers execute in an interrupted execution context with severe restrictions: you can ONLY call async-signal-safe functions.',
            'Allocating memory, calling `malloc`, locking a mutex, or printing to `std::cout` inside a signal handler is UNDEFINED BEHAVIOR.',
            'Idiomatic C++ pattern: set a `std::atomic<bool> g_shutdownRequested{false}` in the signal handler and let worker loops check it.'
          ],
          keyRules: [
            'Inside signal handlers: do nothing except set a volatile or atomic shutdown flag.',
            'Worker threads periodically poll the shutdown flag and initiate clean RAII shutdown.'
          ],
          codeSnippet: {
            id: 'cpp-snip-25-7',
            title: 'Async-Safe Graceful Shutdown Pattern',
            description: 'Atomic flag signal handler for server loop',
            language: 'cpp',
            code: `#include <iostream>
#include <atomic>
#include <csignal>

std::atomic<bool> running{true};

void handleSignal(int signum) {
    // Only async-signal-safe action: atomic write
    running.store(false, std::memory_order_relaxed);
}

int main() {
    std::signal(SIGINT, handleSignal);
    std::cout << "Service running. Press Ctrl+C or wait for completion...\\n";
    
    int cycles = 0;
    while (running.load(std::memory_order_relaxed) && cycles < 3) {
        std::cout << "Heartbeat cycle " << ++cycles << "\\n";
        if (cycles == 3) running = false; // simulate stop
    }
    
    std::cout << "Graceful shutdown complete: all connections drained.\\n";
    return 0;
}`
          },
          pitfall: 'Calling `printf`, `std::cout`, or `free()` inside a signal handler can deadlock the process if the signal interrupted a thread that was already holding the internal I/O or heap lock.',
          quickCheck: {
            question: 'What is safe to do inside an OS signal handler in C++?',
            options: ['Allocate memory with new', 'Write to std::cout', 'Store a value into a std::atomic_flag or atomic boolean', 'Lock a std::mutex'],
            correctIndex: 2,
            explanation: 'Signal handlers must only perform async-signal-safe operations, such as setting an atomic flag. Heap allocation and I/O lock acquisition can cause deadlocks.'
          }
        },
        {
          id: 'cpp-w4-d25-t8',
          topicNumber: 8,
          title: 'Memory Arenas and Custom Linear Allocators',
          explanation: [
            'General-purpose `malloc`/`new` is slow for allocating millions of transient small objects per frame/request (tree nodes, tokens, messages).',
            'A Linear Arena Allocator pre-allocates a contiguous block of memory (e.g. 16MB) and bumps an offset pointer for each allocation (`O(1)` zero-overhead).',
            'Deallocation is instantaneous: reset the bump offset to zero (`O(1)` free for the entire frame of millions of objects).'
          ],
          keyRules: [
            'Linear arenas provide O(1) allocation and O(1) bulk deallocation.',
            'Objects allocated in an arena must be trivially destructible or destructed explicitly before resetting the arena.'
          ],
          codeSnippet: {
            id: 'cpp-snip-25-8',
            title: 'High-Speed Bump Pointer Arena',
            description: 'Fast sequential memory allocation without heap fragmentation',
            language: 'cpp',
            code: `#include <iostream>
#include <vector>
#include <cstddef>

class BumpArena {
    std::vector<std::byte> storage;
    size_t offset = 0;
public:
    explicit BumpArena(size_t capacity) : storage(capacity) {}
    
    void* allocate(size_t bytes, size_t alignment = alignof(std::max_align_t)) {
        size_t current = reinterpret_cast<size_t>(storage.data() + offset);
        size_t aligned = (current + alignment - 1) & ~(alignment - 1);
        size_t newOffset = (aligned - reinterpret_cast<size_t>(storage.data())) + bytes;
        if (newOffset > storage.size()) throw std::bad_alloc();
        offset = newOffset;
        return reinterpret_cast<void*>(aligned);
    }
    
    void reset() noexcept { offset = 0; }
    size_t bytesUsed() const { return offset; }
};

int main() {
    BumpArena arena(1024 * 1024); // 1MB arena
    int* p1 = new (arena.allocate(sizeof(int))) int(42);
    int* p2 = new (arena.allocate(sizeof(int))) int(84);
    std::cout << "Arena allocated values: " << *p1 << ", " << *p2 << "\\n";
    std::cout << "Bytes allocated: " << arena.bytesUsed() << "\\n";
    arena.reset(); // instantaneous free of all objects!
    return 0;
}`
          },
          pitfall: 'Individual objects in a bump arena cannot be freed independently; attempting to delete an individual pointer will crash because it was not allocated via standard malloc.',
          quickCheck: {
            question: 'What is the time complexity of resetting a linear bump arena allocator holding 100,000 objects?',
            options: ['O(N) where N is object count', 'O(1) constant time', 'O(log N)', 'O(N^2)'],
            correctIndex: 1,
            explanation: 'Resetting a bump arena simply sets the offset pointer back to zero in O(1) constant time, freeing all allocated memory instantaneously.'
          }
        }
      ]
    },
    {
      id: 'cpp-w4-d26',
      dayNumber: 26,
      weekNumber: 4,
      title: 'Modern CMake, Toolchains & Sanitizers',
      subtitle: 'Target-based CMake, compilation pipelines, AddressSanitizer, ThreadSanitizer & static analysis',
      durationMinutes: 70,
      overview:
        'Professional C++ engineering requires mastery of the build pipeline and automated diagnostics. Learn Modern Target-Based CMake, link dependencies cleanly, integrate AddressSanitizer (ASan) and ThreadSanitizer (TSan) for zero-defect runtime validation, and configure clang-tidy.',
      topics: [
        {
          id: 'cpp-w4-d26-t1',
          topicNumber: 1,
          title: 'Modern CMake: Targets and Properties vs Global Variables',
          explanation: [
            'Legacy CMake used global variables like `include_directories()` and `set(CMAKE_CXX_FLAGS)`. This caused polluted build configurations.',
            'Modern CMake (3.12+) is strictly Target-Based: everything is an executable or library target with private, public, or interface properties.',
            '`target_link_libraries(myApp PRIVATE myLib)` automatically transitively propagates include directories and compiler flags required by `myLib`.'
          ],
          keyRules: [
            'Never use global `include_directories()`; use `target_include_directories(target PUBLIC/PRIVATE ...)`.',
            'PUBLIC means "this target needs it and anyone linking to this target also needs it". PRIVATE means "only this target needs it".'
          ],
          codeSnippet: {
            id: 'cpp-snip-26-1',
            title: 'Modern Target-Based CMakeLists.txt',
            description: 'Standard modern CMake architecture',
            language: 'cmake',
            code: `cmake_minimum_required(VERSION 3.20)
project(CoreEngine VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Library target
add_library(EngineLib STATIC src/engine.cpp)
target_include_directories(EngineLib PUBLIC include)

# Executable target
add_executable(App main.cpp)
target_link_libraries(App PRIVATE EngineLib)`
          },
          pitfall: 'Marking internal headers as PUBLIC leaks implementation detail directories to downstream consumers, increasing rebuild times and risking header collisions.',
          quickCheck: {
            question: 'What is the difference between PRIVATE and PUBLIC in target_link_libraries()?',
            options: ['PUBLIC exposes symbols to web browsers', 'PRIVATE dependencies are used only by the target itself, while PUBLIC dependencies are also transitively propagated to anyone linking the target', 'PRIVATE disables optimization', 'PUBLIC requires an open-source license'],
            correctIndex: 1,
            explanation: 'PUBLIC propagates include paths, compile definitions, and link flags transitively to consumers; PRIVATE keeps them scoped strictly to the compiling target.'
          }
        },
        {
          id: 'cpp-w4-d26-t2',
          topicNumber: 2,
          title: 'CMake Build Types: Debug, Release, RelWithDebInfo & MinSizeRel',
          explanation: [
            'CMake provides four standard build configurations via `-DCMAKE_BUILD_TYPE`:',
            '- `Debug`: `-O0 -g`. No optimization, full debug symbols, asserts enabled.',
            '- `Release`: `-O3 -DNDEBUG`. Maximum performance optimizations, assertions stripped.',
            '- `RelWithDebInfo`: `-O2 -g -DNDEBUG`. Production performance with line-number debug symbols for crash dumps.',
            '- `MinSizeRel`: `-Os -DNDEBUG`. Optimization for binary code size (embedded/IoT).'
          ],
          keyRules: [
            'Always develop in Debug or RelWithDebInfo to catch assertions and trace crashes.',
            'Production server builds should use RelWithDebInfo so stack traces in core dumps can be symbolized.'
          ],
          codeSnippet: {
            id: 'cpp-snip-26-2',
            title: 'Configuring and Building with CMake',
            description: 'Terminal commands for out-of-source builds',
            language: 'bash',
            code: `# 1. Configure out-of-source build in 'build' directory
cmake -B build -DCMAKE_BUILD_TYPE=RelWithDebInfo

# 2. Compile across all CPU cores
cmake --build build -j$(nproc)

# 3. Run test suite
ctest --test-dir build --output-on-failure`
          },
          pitfall: 'Running benchmarks on a `Debug` build: unoptimized C++ (with inlining disabled and iterators checked) can be 20x to 100x slower than Release!',
          quickCheck: {
            question: 'Why is RelWithDebInfo the preferred build configuration for production deployments?',
            options: ['It disables all C++ exceptions', 'It includes optimizations (-O2) while preserving debug symbols (-g) to analyze core dumps and stack traces', 'It produces the smallest possible file size', 'It is required to run multi-threaded code'],
            correctIndex: 1,
            explanation: 'RelWithDebInfo provides near-identical runtime speed to Release while retaining symbol tables necessary for debugging production core dumps.'
          }
        },
        {
          id: 'cpp-w4-d26-t3',
          topicNumber: 3,
          title: 'AddressSanitizer (ASan) & LeakSanitizer (LSan): Catching Memory Bugs',
          explanation: [
            'AddressSanitizer is a compiler instrumentation tool that detects memory errors with ~2x CPU overhead (vastly faster than Valgrind).',
            'It detects:',
            '- Out-of-bounds accesses to heap, stack, and globals.',
            '- Use-After-Free (UAF) and Use-After-Scope.',
            '- Double free and invalid free.',
            '- Memory leaks on process termination (via LSan).',
            'Compile with `-fsanitize=address -g`.'
          ],
          keyRules: [
            'Enable AddressSanitizer in your continuous integration (CI) test suite.',
            'ASan poisons memory around allocations with "redzones" to detect 1-byte buffer overflows instantly.'
          ],
          codeSnippet: {
            id: 'cpp-snip-26-3',
            title: 'Enabling AddressSanitizer in CMake',
            description: 'Compiler flags for automated memory sanitization',
            language: 'cmake',
            code: `option(ENABLE_ASAN "Enable AddressSanitizer" ON)

if (ENABLE_ASAN)
    message(STATUS "AddressSanitizer enabled")
    add_compile_options(-fsanitize=address -fno-omit-frame-pointer -g)
    add_link_options(-fsanitize=address)
endif()`
          },
          pitfall: 'ASan cannot be combined with ThreadSanitizer (TSan) in the same binary because their memory shadow mapping algorithms conflict.',
          quickCheck: {
            question: 'What compiler flag activates AddressSanitizer in Clang and GCC?',
            options: ['-fmemory-safe', '-fsanitize=address', '-Werror=memory', '-check-heap'],
            correctIndex: 1,
            explanation: 'Passing -fsanitize=address to both compiler and linker instruments memory operations with AddressSanitizer.'
          }
        },
        {
          id: 'cpp-w4-d26-t4',
          topicNumber: 4,
          title: 'ThreadSanitizer (TSan): Catching Concurrency Data Races',
          explanation: [
            'ThreadSanitizer detects data races at runtime by instrumenting every memory read/write and synchronization event.',
            'If two threads access the same memory address without a valid happens-before order, TSan halts and prints the exact stack traces of both competing threads.',
            'Compile with `-fsanitize=thread -g`.'
          ],
          keyRules: [
            'Run multi-threaded unit tests under TSan to catch intermittent races before production.',
            'TSan incurs ~5x to 15x CPU overhead and 5x memory overhead.'
          ],
          codeSnippet: {
            id: 'cpp-snip-26-4',
            title: 'Enabling ThreadSanitizer in CMake',
            description: 'Instrumenting binary to detect race conditions',
            language: 'cmake',
            code: `option(ENABLE_TSAN "Enable ThreadSanitizer" OFF)

if (ENABLE_TSAN)
    message(STATUS "ThreadSanitizer enabled")
    add_compile_options(-fsanitize=thread -g)
    add_link_options(-fsanitize=thread)
endif()`
          },
          pitfall: 'Ignoring race warnings reported by TSan because "it works fine on my laptop": a race that does not trigger on x86 may corrupt memory on ARM due to weaker memory models.',
          quickCheck: {
            question: 'What type of defect is ThreadSanitizer (TSan) designed to catch?',
            options: ['Syntax errors in header files', 'Unsynchronized concurrent data races across multiple threads', 'Slow disk read operations', 'Unused variables in source code'],
            correctIndex: 1,
            explanation: 'TSan monitors all concurrent memory accesses at runtime to detect data races between unsynchronized threads.'
          }
        },
        {
          id: 'cpp-w4-d26-t5',
          topicNumber: 5,
          title: 'UndefinedBehaviorSanitizer (UBSan): Eliminating Silent Bugs',
          explanation: [
            'UndefinedBehaviorSanitizer catches non-memory undefined behaviors that compilers exploit for aggressive optimizations.',
            'It detects:',
            '- Signed integer overflow (`INT_MAX + 1`).',
            '- Null pointer dereferences.',
            '- Misaligned pointer access.',
            '- Shift exponents out of bounds (`x << 64` on 32-bit int).',
            '- Reaching the end of a value-returning function without returning.',
            'Compile with `-fsanitize=undefined`.'
          ],
          keyRules: [
            'UBSan has minimal runtime overhead (~5-20%) and can often remain enabled in testing environments.',
            'Signed integer overflow is undefined behavior in C++, while unsigned integer overflow wraps definedly (modulo 2^N).'
          ],
          codeSnippet: {
            id: 'cpp-snip-26-5',
            title: 'Enabling UBSan in CMake',
            description: 'Trapping signed overflow and alignment errors',
            language: 'cmake',
            code: `option(ENABLE_UBSAN "Enable UndefinedBehaviorSanitizer" ON)

if (ENABLE_UBSAN)
    add_compile_options(-fsanitize=undefined -fno-sanitize-recover=all)
    add_link_options(-fsanitize=undefined)
endif()`
          },
          pitfall: 'Relying on signed integer overflow wrapping (`int x = INT_MAX + 1`): modern compilers assume signed overflow NEVER happens and optimize out overflow checks entirely!',
          quickCheck: {
            question: 'In standard C++, what is the difference between signed and unsigned integer overflow?',
            options: ['Both wrap modulo 2^N', 'Signed overflow is Undefined Behavior, while unsigned overflow wraps with defined modulo arithmetic', 'Unsigned overflow crashes the CPU', 'Both throw std::overflow_error'],
            correctIndex: 1,
            explanation: 'Under the C++ standard, signed integer overflow is strict Undefined Behavior, whereas unsigned arithmetic is guaranteed to wrap modulo 2^N.'
          }
        },
        {
          id: 'cpp-w4-d26-t6',
          topicNumber: 6,
          title: 'Static Analysis: Clang-Tidy and Compiler Warnings (-Wall -Wextra -Wpedantic)',
          explanation: [
            'Static analysis examines source code without executing it, catching bugs before compilation even finishes.',
            'Configure your compiler flags with `-Wall -Wextra -Wpedantic -Wconversion -Werror`.',
            '`clang-tidy` performs deep AST analysis to check for C++ Core Guidelines violations, bug-prone patterns, performance hazards (e.g. accidental copies in range-for), and modern C++ modernize transformations.'
          ],
          keyRules: [
            'Treat compiler warnings as errors in CI: `-Werror`.',
            'Run `clang-tidy` as an automated linter in pull request validation.'
          ],
          codeSnippet: {
            id: 'cpp-snip-26-6',
            title: 'Strict Compiler Warnings Configuration',
            description: 'Enforcing industrial code quality in CMake',
            language: 'cmake',
            code: `target_compile_options(CoreEngine PRIVATE
    $<$<CXX_COMPILER_ID:GNU,Clang>:
        -Wall
        -Wextra
        -Wpedantic
        -Wshadow
        -Wnon-virtual-dtor
        -Wold-style-cast
        -Wcast-align
        -Wunused
        -Woverloaded-virtual
        -Wconversion
        -Werror
    >
)`
          },
          pitfall: 'Disabling compiler warnings with `#pragma GCC diagnostic ignored` instead of fixing the root design flaw.',
          quickCheck: {
            question: 'What is the purpose of the compiler flag -Werror?',
            options: ['It disables error messages', 'It treats all compiler warnings as fatal compilation errors', 'It generates a log file of warnings', 'It forces slow debug compilation'],
            correctIndex: 1,
            explanation: '-Werror treats any warning as an error, halting the build and preventing sloppy code or unnoticed bugs from entering the codebase.'
          }
        },
        {
          id: 'cpp-w4-d26-t7',
          topicNumber: 7,
          title: 'Automated Unit Testing with GoogleTest (GTest) & Catch2',
          explanation: [
            'Industrial C++ systems verify correctness with automated unit testing frameworks.',
            'GoogleTest (`GTest`) provides rich assertions (`EXPECT_EQ`, `ASSERT_TRUE`, mock objects via `gmock`).',
            'Catch2 offers modern, header-only or standalone test structures with expressive BDD syntax (`SCENARIO`, `GIVEN`, `WHEN`, `THEN`).',
            'Integrate testing directly into CMake using `include(CTest)` and `add_test()`.'
          ],
          keyRules: [
            'EXPECT_* logs a failure and continues the test; ASSERT_* logs failure and aborts the current test immediately.',
            'Keep tests isolated: tests must not rely on execution order or persistent file state from previous tests.'
          ],
          codeSnippet: {
            id: 'cpp-snip-26-7',
            title: 'GoogleTest Suite Integration',
            description: 'Writing unit tests with ASSERT and EXPECT',
            language: 'cpp',
            code: `#include <gtest/gtest.h>

int add(int a, int b) { return a + b; }

TEST(MathTestSuite, HandlesPositiveIntegers) {
    EXPECT_EQ(add(2, 3), 5);
    EXPECT_EQ(add(0, 0), 0);
}

TEST(MathTestSuite, HandlesNegativeIntegers) {
    ASSERT_EQ(add(-5, -5), -10);
    EXPECT_NE(add(-5, 5), -10);
}

int main(int argc, char** argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}`
          },
          pitfall: 'Using ASSERT_EQ on pointers before verifying they are non-null: if null, subsequent dereferencing in the same test crashes the test runner.',
          quickCheck: {
            question: 'In GoogleTest, what is the operational difference between EXPECT_EQ and ASSERT_EQ?',
            options: ['ASSERT_EQ only works on strings', 'EXPECT_EQ continues executing the test upon failure, whereas ASSERT_EQ aborts the current test immediately', 'EXPECT_EQ is evaluated at compile time', 'There is no difference'],
            correctIndex: 1,
            explanation: 'EXPECT_EQ records the failure and proceeds to execute the rest of the test function; ASSERT_EQ stops execution of the current test function on failure.'
          }
        },
        {
          id: 'cpp-w4-d26-t8',
          topicNumber: 8,
          title: 'Package Management: vcpkg and Conan in Modern C++',
          explanation: [
            'Historically, integrating 3rd party libraries in C++ required manual compilation and path hacking.',
            'Modern C++ uses package managers:',
            '- `vcpkg` (Microsoft): Integrates seamlessly with CMake via a toolchain file `-DCMAKE_TOOLCHAIN_FILE=[path]/scripts/buildsystems/vcpkg.cmake`. Declared via `vcpkg.json` manifest.',
            '- `Conan` (JFrog): Python-based cross-platform package manager using `conanfile.txt`.',
            'Allows declaring dependencies like Boost, OpenSSL, or Protobuf with automatic downloads and ABI matching.'
          ],
          keyRules: [
            'Use manifest mode (vcpkg.json) committed to Git for reproducible team dependency builds.',
            'Lock package versions to avoid unexpected breaking upstream changes.'
          ],
          codeSnippet: {
            id: 'cpp-snip-26-8',
            title: 'Declarative vcpkg.json Manifest',
            description: 'Reproducible dependencies definition',
            language: 'json',
            code: `{
  "name": "enterprise-cpp-service",
  "version-string": "1.0.0",
  "dependencies": [
    "fmt",
    "nlohmann-json",
    "gtest",
    "boost-asio"
  ]
}`
          },
          pitfall: 'Checking compiled third-party `.so` or `.lib` binaries directly into Git repositories causes massive repository bloat and cross-OS build breakage.',
          quickCheck: {
            question: 'How does vcpkg integrate with CMake during project configuration?',
            options: ['By rewriting the compiler executable', 'By passing the vcpkg CMake toolchain file via -DCMAKE_TOOLCHAIN_FILE', 'By compiling only on Windows', 'By requiring Python in all source files'],
            correctIndex: 1,
            explanation: 'vcpkg hooks into CMake through its toolchain file, redirecting find_package() to automatically locate and link installed libraries.'
          }
        }
      ]
    },
    {
      id: 'cpp-w4-d27',
      dayNumber: 27,
      weekNumber: 4,
      title: 'Performance Profiling, Benchmarking & Cache Optimization',
      subtitle: 'Google Benchmark, CPU cache hierarchies, branch prediction, perf, and SIMD vectorization',
      durationMinutes: 75,
      overview:
        'Engineer systems with mechanical sympathy for modern hardware. Learn how to construct microbenchmarks with Google Benchmark, analyze CPU L1/L2/L3 cache misses and branch mispredictions, optimize loop layouts for SIMD autovectorization, and avoid premature pessimization.',
      topics: [
        {
          id: 'cpp-w4-d27-t1',
          topicNumber: 1,
          title: 'Microbenchmarking Pitfalls & Google Benchmark',
          explanation: [
            'Naive timing loops (`std::chrono` around a loop) are often ruined by compiler optimizations: the compiler detects the result is unused and deletes the entire loop (`O(0)` benchmark).',
            'Google Benchmark provides tools like `benchmark::DoNotOptimize(var)` to prevent the compiler from optimizing away calculations without adding runtime assembly overhead.',
            'It calculates mean, standard deviation, and CPU time vs wall time.'
          ],
          keyRules: [
            'Always use `benchmark::DoNotOptimize()` on computed outputs in microbenchmarks.',
            'Run benchmarks on dedicated machines with CPU frequency scaling disabled to prevent clock jitter.'
          ],
          codeSnippet: {
            id: 'cpp-snip-27-1',
            title: 'Microbenchmarking with Google Benchmark',
            description: 'Accurate cycle and nanosecond timing',
            language: 'cpp',
            code: `#include <benchmark/benchmark.h>
#include <vector>
#include <numeric>

static void BM_VectorAccumulate(benchmark::State& state) {
    std::vector<int> data(state.range(0), 42);
    for (auto _ : state) {
        int sum = std::accumulate(data.begin(), data.end(), 0);
        benchmark::DoNotOptimize(sum);
    }
}
BENCHMARK(BM_VectorAccumulate)->Range(64, 4096);
BENCHMARK_MAIN();`
          },
          pitfall: 'Measuring unoptimized code: microbenchmarking without `-O3` or benchmarking with variables known at compile-time produces completely misleading numbers.',
          quickCheck: {
            question: 'What is the role of benchmark::DoNotOptimize() in C++ microbenchmarking?',
            options: ['It disables CPU caches', 'It forces the compiler to treat the value as read/write to prevent dead code elimination', 'It turns off threading', 'It calculates floating point square roots'],
            correctIndex: 1,
            explanation: 'benchmark::DoNotOptimize informs the compiler that the variable may be observed, preventing the optimizer from deleting the computation.'
          }
        },
        {
          id: 'cpp-w4-d27-t2',
          topicNumber: 2,
          title: 'CPU Cache Hierarchies: L1, L2, L3 and Main Memory Latency',
          explanation: [
            'Accessing CPU Registers takes ~0.5 ns.',
            'L1 Cache (~32-64KB per core): ~1-2 ns.',
            'L2 Cache (~512KB-1MB per core): ~3-5 ns.',
            'L3 Cache (~16-64MB shared): ~10-20 ns.',
            'Main RAM: ~60-100 ns (200x slower than L1!).',
            'High-performance C++ is designed around spatial locality (contiguous memory) and temporal locality (re-accessing recently loaded cache lines).'
          ],
          keyRules: [
            'Memory access is the primary bottleneck in modern high-performance computing, not arithmetic operations.',
            'Contiguous arrays (std::vector) massively outperform node-based pointer containers (std::list) due to cache prefetching.'
          ],
          codeSnippet: {
            id: 'cpp-snip-27-2',
            title: 'Row-Major vs Column-Major Cache Locality',
            description: 'Why traversing memory sequentially is 10x faster',
            language: 'cpp',
            code: `#include <iostream>
#include <vector>

const int ROWS = 2048;
const int COLS = 2048;
int matrix[ROWS][COLS];

// Cache-friendly: sequential row-major access (stride 1)
long long sumRowMajor() {
    long long total = 0;
    for (int r = 0; r < ROWS; ++r) {
        for (int c = 0; c < COLS; ++c) {
            total += matrix[r][c]; // contiguous in memory!
        }
    }
    return total;
}

int main() {
    std::cout << "Sequential cache traversal initialized\\n";
    std::cout << "Sum: " << sumRowMajor() << "\\n";
    return 0;
}`
          },
          pitfall: 'Iterating column-first `matrix[r][c]` in a C++ 2D array causes a cache miss on every single element access because successive elements are 2048 ints apart in memory.',
          quickCheck: {
            question: 'Why is traversing a 2D C++ array row-by-row much faster than column-by-column?',
            options: ['Columns are stored on the hard drive', 'Row-major storage ensures adjacent elements reside in contiguous memory on the same CPU cache line', 'Row traversal disables compiler warnings', 'C++ forbids column traversal'],
            correctIndex: 1,
            explanation: 'C++ arrays are laid out in row-major order; row traversal loads contiguous 64-byte blocks into L1 cache, while column traversal incurs a cache miss on every access.'
          }
        },
        {
          id: 'cpp-w4-d27-t3',
          topicNumber: 3,
          title: 'Branch Prediction and [[likely]] / [[unlikely]] (C++20)',
          explanation: [
            'CPUs feature deep instruction pipelines (15-20 stages). The CPU speculative branch predictor guesses which branch an `if` statement will take.',
            'A correct prediction incurs 0 stall cycles; a branch misprediction flushes the entire pipeline, costing 15-20 lost clock cycles.',
            'C++20 introduced `[[likely]]` and `[[unlikely]]` attributes to advise the compiler on how to lay out assembly instructions to maximize instruction cache hit rates for the hot path.'
          ],
          keyRules: [
            'Sort data before filtering when possible: branch predictors achieve >99% accuracy on sorted data.',
            'Use [[unlikely]] on rare error-handling branches to keep the hot path instruction cache contiguous.'
          ],
          codeSnippet: {
            id: 'cpp-snip-27-3',
            title: 'C++20 Branch Likelihood Attributes',
            description: 'Optimizing hot instruction cache layouts',
            language: 'cpp',
            code: `#include <iostream>

bool processTransaction(int amount, bool isVip) {
    if (amount <= 0) [[unlikely]] {
        // Cold path: kept out of the hot instruction cache
        std::cout << "Invalid negative transaction\\n";
        return false;
    }
    
    if (isVip) [[likely]] {
        // Hot path: laid out directly in line for zero-jump execution
        std::cout << "Instant VIP approval\\n";
        return true;
    }
    return true;
}

int main() {
    processTransaction(500, true);
    return 0;
}`
          },
          pitfall: 'Overusing `[[likely]]` everywhere without profiling data can degrade performance by distorting compiler heuristics; use it only for truly extreme ratios (e.g. 99% vs 1%).',
          quickCheck: {
            question: 'What is the performance penalty of a CPU branch misprediction?',
            options: ['Memory leak in L1 cache', 'The CPU pipeline must be flushed, wasting 15-20 clock cycles', 'The thread is terminated by the OS', 'The compiler recompiles the function'],
            correctIndex: 1,
            explanation: 'When a branch prediction fails, the speculative instructions in the CPU pipeline are discarded and the pipeline must be refilled from the correct branch, causing a ~15-20 cycle stall.'
          }
        },
        {
          id: 'cpp-w4-d27-t4',
          topicNumber: 4,
          title: 'SIMD and Compiler Auto-Vectorization',
          explanation: [
            'SIMD (Single Instruction, Multiple Data) instructions (SSE, AVX-2, AVX-512, ARM Neon) process 4, 8, or 16 floating-point numbers in a single CPU instruction clock cycle.',
            'Modern compilers auto-vectorize loops if:',
            '1. Loop count is known or computable.',
            '2. No pointer aliasing (use `__restrict` or pass distinct vectors).',
            '3. No loop-carried data dependencies (iteration `i` does not read output of `i-1`).',
            '4. Memory is aligned to 32 or 64 bytes.'
          ],
          keyRules: [
            'Write clean, simple, branchless loops over contiguous memory to enable auto-vectorization.',
            'Inspect compiler vectorization reports with `-fopt-info-vec-optimized` (GCC) or `-Rpass=loop-vectorize` (Clang).'
          ],
          codeSnippet: {
            id: 'cpp-snip-27-4',
            title: 'Auto-Vectorizable Float Multiply-Add',
            description: 'Clean loop structured for AVX-2 vectorization',
            language: 'cpp',
            code: `#include <iostream>
#include <vector>

void vectorMultiplyAdd(const float* __restrict a,
                       const float* __restrict b,
                       float* __restrict c,
                       size_t n) {
    // Easily vectorized into AVX VFMADD instructions
    for (size_t i = 0; i < n; ++i) {
        c[i] = a[i] * b[i] + 1.0f;
    }
}

int main() {
    const size_t N = 1024;
    std::vector<float> a(N, 2.0f), b(N, 3.0f), c(N, 0.0f);
    vectorMultiplyAdd(a.data(), b.data(), c.data(), N);
    std::cout << "Result sample c[0]: " << c[0] << " (expected 7.0)\\n";
    return 0;
}`
          },
          pitfall: 'Calling complex functions with side-effects or throwing exceptions inside an inner loop inhibits compiler auto-vectorization completely.',
          quickCheck: {
            question: 'What does the __restrict keyword indicate to the C++ compiler?',
            options: ['The variable cannot be read', 'The pointer does not alias (overlap) with any other pointer in the scope, allowing aggressive SIMD vectorization', 'The function cannot be overridden', 'The memory is allocated on the GPU'],
            correctIndex: 1,
            explanation: '__restrict informs the compiler that the pointer is the sole reference to that memory region, eliminating pointer aliasing fears and enabling SIMD instruction generation.'
          }
        },
        {
          id: 'cpp-w4-d27-t5',
          topicNumber: 5,
          title: 'Linux perf and Hardware Performance Counters',
          explanation: [
            '`perf` is the gold standard Linux performance profiling tool.',
            'It reads hardware performance counters built into the CPU (PMU):',
            '- `perf stat ./app`: Measures instructions per cycle (IPC), cache-misses, branch-misses, and page-faults.',
            '- `perf record -g ./app`: Samples stack traces to generate flame graphs.',
            '- Instructions Per Cycle (IPC): A high IPC (>2.0) indicates efficient pipeline utilization; a low IPC (<0.5) indicates stalls waiting for RAM cache misses.'
          ],
          keyRules: [
            'Target an IPC > 1.5 for compute-intensive C++ services.',
            'High cache miss rates (>5%) point directly to poor data layout and pointer-heavy structures.'
          ],
          codeSnippet: {
            id: 'cpp-snip-27-5',
            title: 'Profiling with Linux perf CLI',
            description: 'Hardware counter performance command examples',
            language: 'bash',
            code: `# Profile overall hardware performance counters
perf stat -e cycles,instructions,cache-misses,branch-misses ./my_app

# Record stack traces at 99Hz for flame graph generation
perf record -F 99 -g ./my_app

# Inspect annotated assembly showing hottest CPU instructions
perf annotate`
          },
          pitfall: 'Optimizing based on guesses rather than profiling: developers frequently optimize functions that account for 0.1% of runtime while ignoring the cache-miss bottleneck that dominates 85% of time.',
          quickCheck: {
            question: 'What does an Instructions Per Cycle (IPC) below 0.5 typically indicate?',
            options: ['The code is running at maximum efficiency', 'The CPU is frequently stalled waiting for memory from RAM or suffering branch mispredictions', 'The CPU clock frequency is too high', 'The code has no bugs'],
            correctIndex: 1,
            explanation: 'A low IPC means the CPU is spending most of its clock cycles idle and stalled waiting for cache lines to arrive from high-latency main RAM.'
          }
        },
        {
          id: 'cpp-w4-d27-t6',
          topicNumber: 6,
          title: 'Small String Optimization (SSO) and Small Buffer Optimization',
          explanation: [
            'Heap allocations (`malloc`) are slow. To avoid heap allocation for small strings, standard library implementations (`std::string`) store short strings (typically $\\le 15$ or $22$ bytes) in an internal stack buffer inside the string object itself.',
            'This is called Small String Optimization (SSO).',
            'You can apply this same architectural technique to your own custom containers (e.g. `SmallVector<T, N>`) to keep small collections strictly on the stack.'
          ],
          keyRules: [
            'Short strings under ~15-22 bytes incur ZERO heap allocations.',
            'Passing strings by value when SSO applies avoids heap pointer indirection.'
          ],
          codeSnippet: {
            id: 'cpp-snip-27-6',
            title: 'Demonstrating Small String Optimization',
            description: 'Checking whether a string allocates on heap',
            language: 'cpp',
            code: `#include <iostream>
#include <string>

int main() {
    std::string smallStr = "Hello World"; // 11 chars
    std::string largeStr = "This string is intentionally long enough to exceed the standard SSO buffer capacity!";
    
    std::cout << "std::string sizeof: " << sizeof(std::string) << " bytes\\n";
    std::cout << "smallStr internal pointer: " << static_cast<const void*>(smallStr.data()) << "\\n";
    std::cout << "smallStr object address:   " << static_cast<const void*>(&smallStr) << "\\n";
    
    // In SSO, data pointer points INSIDE the string object itself!
    bool isSso = (smallStr.data() >= reinterpret_cast<const char*>(&smallStr)) &&
                 (smallStr.data() < reinterpret_cast<const char*>(&smallStr) + sizeof(smallStr));
    std::cout << "Is smallStr stored on stack (SSO)? " << (isSso ? "Yes (Zero Heap Allocation!)" : "No") << "\\n";
    return 0;
}`
          },
          pitfall: 'Concatenating strings past the SSO limit forces an unexpected heap allocation, which can violate latency budgets in tight real-time audio or trading loops.',
          quickCheck: {
            question: 'What is Small String Optimization (SSO)?',
            options: ['A compression algorithm for text files', 'Storing short strings inside the std::string object itself to avoid dynamic heap allocation', 'Limiting strings to 10 characters maximum', 'A compiler flag in GCC'],
            correctIndex: 1,
            explanation: 'SSO embeds a small fixed-size buffer inside the string struct itself so strings under the threshold do not require any heap malloc.'
          }
        },
        {
          id: 'cpp-w4-d27-t7',
          topicNumber: 7,
          title: 'Memory Alignment, Padding & Struct Reordering',
          explanation: [
            'CPUs access memory at addresses aligned to data type boundaries (e.g. 4-byte ints at multiples of 4, 8-byte doubles at multiples of 8).',
            'Compilers insert invisible Padding Bytes between struct members to satisfy alignment constraints.',
            'Reordering struct members from largest to smallest eliminates wasted padding bytes and reduces memory footprint by up to 40%.'
          ],
          keyRules: [
            'Order struct members by descending size (8-byte, then 4-byte, 2-byte, 1-byte).',
            'Use `alignof(T)` to inspect alignment and `sizeof(T)` to verify structure packing.'
          ],
          codeSnippet: {
            id: 'cpp-snip-27-7',
            title: 'Optimizing Struct Layout to Eliminate Padding',
            description: 'Member reordering to reduce memory footprint',
            language: 'cpp',
            code: `#include <iostream>

// Poorly ordered: 24 bytes due to alignment padding
struct BadLayout {
    char a;      // 1 byte + 7 bytes padding
    double b;    // 8 bytes
    char c;      // 1 byte + 7 bytes padding
};

// Optimally ordered: 16 bytes
struct GoodLayout {
    double b;    // 8 bytes
    char a;      // 1 byte
    char c;      // 1 byte + 6 bytes tail padding
};

int main() {
    std::cout << "sizeof(BadLayout):  " << sizeof(BadLayout) << " bytes\\n";
    std::cout << "sizeof(GoodLayout): " << sizeof(GoodLayout) << " bytes\\n";
    std::cout << "Memory saved per million objects: " 
              << (sizeof(BadLayout) - sizeof(GoodLayout)) * 1000000 / (1024 * 1024) << " MB\\n";
    return 0;
}`
          },
          pitfall: 'Using `#pragma pack(1)` to strip all padding: while it reduces size to minimum bytes, unaligned memory accesses cause severe CPU execution penalties or hardware traps on ARM.',
          quickCheck: {
            question: 'How should you order member variables in a C++ struct to minimize padding waste?',
            options: ['Alphabetically by variable name', 'From largest alignment/size to smallest', 'Randomly', 'All integers first regardless of size'],
            correctIndex: 1,
            explanation: 'Placing members in descending order of size naturally satisfies alignment requirements with minimal padding bytes between members.'
          }
        },
        {
          id: 'cpp-w4-d27-t8',
          topicNumber: 8,
          title: 'Mechanical Sympathy: The Ten Commandments of C++ Performance',
          explanation: [
            'Production C++ performance is achieved through architecture, not micro-tricks:',
            '1. Choose the right algorithm and asymptotic Big-O first.',
            '2. Favor contiguous cache-friendly storage (`std::vector`).',
            '3. Eliminate unnecessary heap allocations (arenas, SSO, object pools).',
            '4. Eliminate unnecessary copies (pass by `const&`, `std::string_view`, move semantics).',
            '5. Keep critical sections short; lock contention kills multi-core scaling.',
            '6. Protect against false sharing with cache-line alignment.',
            '7. Structure hot loops to assist SIMD auto-vectorization.',
            '8. Make branches predictable and use sorted structures for large filtering.',
            '9. Profile with hardware counters (`perf`), do not guess.',
            '10. Verify correctness first with ASan, TSan, and strict compiler warnings.'
          ],
          keyRules: [
            'Mechanical sympathy means programming in harmony with CPU pipelines, caches, and memory controllers.',
            'Never sacrifice correctness or maintainability for unmeasured micro-optimizations.'
          ],
          codeSnippet: {
            id: 'cpp-snip-27-8',
            title: 'High-Performance Systems Checklist',
            description: 'Core tenets of enterprise systems engineering',
            language: 'cpp',
            code: `#include <iostream>

void printPerformanceTenets() {
    std::cout << "=== Modern C++ Systems Engineering Principles ===\\n";
    std::cout << "1. Zero-Cost Abstractions: Pay only for what you use\\n";
    std::cout << "2. Memory Locality: Contiguous cache lines over pointer graphs\\n";
    std::cout << "3. RAII Resource Safety: No leaks, deterministic destructors\\n";
    std::cout << "4. Lock-Free & Scoped Locking: Scale across multicore architectures\\n";
}

int main() {
    printPerformanceTenets();
    return 0;
}`
          },
          pitfall: 'Premature optimization: spending hours hand-unrolling an inner loop in a function that takes 0.05% of program runtime while neglecting architectural bottlenecks.',
          quickCheck: {
            question: 'What is the primary factor limiting the performance of modern high-performance C++ applications?',
            options: ['Arithmetic addition operations', 'Memory latency and CPU cache misses', 'The speed of light in fiber optic cables', 'The size of source code files'],
            correctIndex: 1,
            explanation: 'Modern CPUs can execute multiple arithmetic instructions per clock cycle, but waiting for uncached data from main RAM stalls the CPU for hundreds of cycles.'
          }
        }
      ]
    },
    {
      id: 'cpp-w4-d28',
      dayNumber: 28,
      weekNumber: 4,
      title: 'Capstone: Enterprise Thread Pool & Production Systems Architecture',
      subtitle: 'Work-stealing task queues, future-based task dispatch, graceful shutdown & capstone synthesis',
      durationMinutes: 80,
      overview:
        'Synthesize the entire 4-week C++ curriculum into a production-grade multi-threaded Worker Thread Pool. Implement task queue synchronization with condition variables, std::packaged_task future channels, cooperative worker shutdown, performance benchmarking, and review industrial architecture principles.',
      topics: [
        {
          id: 'cpp-w4-d28-t1',
          topicNumber: 1,
          title: 'Thread Pool Architecture: The Industrial Engine',
          explanation: [
            'Spawning a new OS thread for every incoming task has crippling overhead: thread creation costs ~50 microseconds and allocates megabytes of virtual stack memory.',
            'A Worker Thread Pool pre-allocates `N` persistent worker threads at application launch (matching `hardware_concurrency`).',
            'Tasks are pushed to a synchronized queue; idle threads wake up via condition variables, execute the task, and return to sleep waiting for new work.'
          ],
          keyRules: [
            'Pre-allocating threads amortizes thread creation cost to zero.',
            'Keeps CPU utilization at 100% without context switching thrashing.'
          ],
          codeSnippet: {
            id: 'cpp-snip-28-1',
            title: 'Thread Pool Design Blueprint',
            description: 'Core architectural components of a thread pool',
            language: 'cpp',
            code: `#include <iostream>
#include <vector>
#include <queue>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <functional>

// Architectural blueprint preview
class ThreadPoolSkeleton {
    std::vector<std::thread> workers;
    std::queue<std::function<void()>> tasks;
    std::mutex queueMutex;
    std::condition_variable cv;
    bool stop = false;
};`
          },
          pitfall: 'Failing to handle exceptions inside worker tasks: if an unhandled exception escapes a thread pool task, the entire process crashes.',
          quickCheck: {
            question: 'Why is a thread pool preferred over spawning a std::thread for every task?',
            options: ['Threads cannot be spawned outside main', 'Spawning threads per task creates heavy OS allocation and context-switching overhead; pools reuse persistent worker threads', 'Thread pools only work on GPU', 'OS threads cannot accept lambda functions'],
            correctIndex: 1,
            explanation: 'Thread pools avoid the latency and stack allocation overhead of creating and destroying OS threads repeatedly by keeping a fixed pool of workers alive.'
          }
        },
        {
          id: 'cpp-w4-d28-t2',
          topicNumber: 2,
          title: 'std::packaged_task and Future Enqueueing',
          explanation: [
            'How can a user submit an arbitrary callable with any return type `F(Args...) -> R` to a thread pool and get back a `std::future<R>`?',
            'Using `std::packaged_task<R()>`: it packages the callable and provides a `get_future()` handle.',
            'We wrap the packaged task inside a shared pointer and push a type-erased lambda `[taskPtr]{ (*taskPtr)(); }` into the `std::function<void()>` queue.',
            'This provides a clean, generic async API identical to `std::async`.'
          ],
          keyRules: [
            'Use std::packaged_task to package generic functions and connect to std::future.',
            'Wrap in std::make_shared because std::packaged_task is move-only and std::function requires copyability.'
          ],
          codeSnippet: {
            id: 'cpp-snip-28-2',
            title: 'Generic Task Enqueue with Future Return',
            description: 'Dispatching arbitrary callable and returning std::future',
            language: 'cpp',
            code: `#include <iostream>
#include <future>
#include <functional>
#include <memory>

// Concept: Wrapping a task to return a future
template <typename F, typename... Args>
auto wrapTask(F&& f, Args&&... args) 
    -> std::future<typename std::invoke_result<F, Args...>::type> {
    using ReturnType = typename std::invoke_result<F, Args...>::type;
    
    auto task = std::make_shared<std::packaged_task<ReturnType()>>(
        [func = std::forward<F>(f), ...args = std::forward<Args>(args)]() mutable {
            return std::invoke(func, args...);
        }
    );
    
    std::future<ReturnType> res = task->get_future();
    // (*task)(); // can be executed on background worker
    return res;
}`
          },
          pitfall: 'Storing raw packaged_task by value in a std::function: std::function requires copyable callables, but packaged_task is move-only. Use std::shared_ptr or custom move-only task queues.',
          quickCheck: {
            question: 'What is the role of std::packaged_task in a thread pool?',
            options: ['It compresses task data', 'It wraps a callable and links its return value or thrown exception to a std::future', 'It shuts down the threads', 'It parses command line arguments'],
            correctIndex: 1,
            explanation: 'std::packaged_task packages a function so its invocation automatically stores the return value into an associated std::future.'
          }
        },
        {
          id: 'cpp-w4-d28-t3',
          topicNumber: 3,
          title: 'Implementing the Thread-Safe Synchronized Task Queue',
          explanation: [
            'The task queue is the shared bottleneck between producers submitting work and worker threads consuming work.',
            'It encapsulates `std::queue<Task>`, protected by a `std::mutex` and coordinated by a `std::condition_variable`.',
            'Worker threads block on `cv.wait(lock, [this]{ return stop || !tasks.empty(); })`.',
            'When a task is pushed, `cv.notify_one()` wakes exactly one sleeping worker to minimize thundering herd contention.'
          ],
          keyRules: [
            'Use cv.notify_one() for individual tasks to prevent waking all threads when only one task is available.',
            'Always verify the queue state while holding the lock.'
          ],
          codeSnippet: {
            id: 'cpp-snip-28-3',
            title: 'Synchronized Task Queue Implementation',
            description: 'Thread-safe task dispatch queue',
            language: 'cpp',
            code: `#include <iostream>
#include <queue>
#include <mutex>
#include <condition_variable>
#include <functional>

class TaskQueue {
    std::queue<std::function<void()>> tasks;
    std::mutex mtx;
    std::condition_variable cv;
    bool stop = false;
public:
    void push(std::function<void()> task) {
        {
            std::lock_guard<std::mutex> lock(mtx);
            tasks.push(std::move(task));
        }
        cv.notify_one();
    }
    
    bool pop(std::function<void()>& task) {
        std::unique_lock<std::mutex> lock(mtx);
        cv.wait(lock, [this] { return stop || !tasks.empty(); });
        if (stop && tasks.empty()) return false;
        task = std::move(tasks.front());
        tasks.pop();
        return true;
    }
    
    void shutdown() {
        {
            std::lock_guard<std::mutex> lock(mtx);
            stop = true;
        }
        cv.notify_all();
    }
};`
          },
          pitfall: 'Calling notify_one() before acquiring the mutex or while holding non-thread-safe state can lead to missed notifications if consumer is evaluating the predicate concurrently.',
          quickCheck: {
            question: 'Why does the task queue call cv.notify_all() during shutdown rather than notify_one()?',
            options: ['To create more threads', 'To wake ALL sleeping worker threads so every worker can observe the stop flag and exit cleanly', 'To print error logs', 'To clear the queue'],
            correctIndex: 1,
            explanation: 'Shutdown requires every worker thread to wake up, verify that stop is true, and terminate its loop so the thread pool destructor can join them.'
          }
        },
        {
          id: 'cpp-w4-d28-t4',
          topicNumber: 4,
          title: 'The Production Thread Pool: Full Working Implementation',
          explanation: [
            'Now we combine the synchronized queue, persistent worker threads, and generic future task submission into a complete, pristine class.',
            'The constructor launches `hardware_concurrency` worker threads.',
            'The destructor safely sets the stop flag, notifies all threads, and joins all workers.',
            'Submitting a task returns a `std::future<ResultType>` for seamless caller synchronization.'
          ],
          keyRules: [
            'The thread pool destructor MUST ensure all active workers finish and are joined safely.',
            'Support arbitrary callables with std::forward and variadic templates.'
          ],
          codeSnippet: {
            id: 'cpp-snip-28-4',
            title: 'Complete Enterprise ThreadPool Class',
            description: 'Self-contained, production-grade ThreadPool implementation',
            language: 'cpp',
            code: `#include <iostream>
#include <vector>
#include <queue>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <future>
#include <functional>

class ThreadPool {
    std::vector<std::thread> workers;
    std::queue<std::function<void()>> tasks;
    std::mutex queueMutex;
    std::condition_variable cv;
    bool stop = false;
public:
    explicit ThreadPool(size_t threads) {
        for (size_t i = 0; i < threads; ++i) {
            workers.emplace_back([this] {
                while (true) {
                    std::function<void()> task;
                    {
                        std::unique_lock<std::mutex> lock(this->queueMutex);
                        this->cv.wait(lock, [this] {
                            return this->stop || !this->tasks.empty();
                        });
                        if (this->stop && this->tasks.empty()) return;
                        task = std::move(this->tasks.front());
                        this->tasks.pop();
                    }
                    task(); // execute outside the lock
                }
            });
        }
    }
    
    template <class F, class... Args>
    auto enqueue(F&& f, Args&&... args) 
        -> std::future<typename std::invoke_result<F, Args...>::type> {
        using return_type = typename std::invoke_result<F, Args...>::type;
        
        auto task = std::make_shared<std::packaged_task<return_type()>>(
            [func = std::forward<F>(f), ...args = std::forward<Args>(args)]() mutable {
                return std::invoke(func, args...);
            }
        );
        
        std::future<return_type> res = task->get_future();
        {
            std::unique_lock<std::mutex> lock(queueMutex);
            if (stop) throw std::runtime_error("enqueue on stopped ThreadPool");
            tasks.emplace([task]() { (*task)(); });
        }
        cv.notify_one();
        return res;
    }
    
    ~ThreadPool() {
        {
            std::unique_lock<std::mutex> lock(queueMutex);
            stop = true;
        }
        cv.notify_all();
        for (std::thread& worker : workers) {
            if (worker.joinable()) worker.join();
        }
    }
};

int main() {
    ThreadPool pool(4);
    auto f1 = pool.enqueue([](int a, int b) { return a * b; }, 6, 7);
    auto f2 = pool.enqueue([] { return std::string("C++ Systems Mastery!"); });
    
    std::cout << "Task 1 result: " << f1.get() << "\\n";
    std::cout << "Task 2 result: " << f2.get() << "\\n";
    return 0;
}`
          },
          pitfall: 'Executing `task()` inside the lock: if the task takes 100 milliseconds, all other worker threads remain locked and starved, completely defeating the purpose of multithreading!',
          quickCheck: {
            question: 'Why MUST the worker execute task() outside the queueMutex lock?',
            options: ['Because tasks cannot run in locked scopes', 'So that other worker threads can simultaneously acquire the lock to retrieve their own tasks without blocking', 'To speed up file compilation', 'Because mutexes do not allow function execution'],
            correctIndex: 1,
            explanation: 'Releasing the lock before calling task() ensures the queue is unlocked while the task executes, allowing other threads to pop tasks concurrently.'
          }
        },
        {
          id: 'cpp-w4-d28-t5',
          topicNumber: 5,
          title: 'Parallel Map-Reduce & Matrix Multiplication Capstone',
          explanation: [
            'Let us put the ThreadPool to work on a real-world computational workload: Parallel Matrix Multiplication.',
            'We divide the result matrix rows across the worker threads.',
            'Each thread computes its assigned row chunk independently, with zero write contention or mutex locks required during calculation.',
            'All workers write to their disjoint row slices, demonstrating optimal parallel scaling.'
          ],
          keyRules: [
            'Divide work into independent disjoint memory regions to eliminate synchronization during computation.',
            'Batch small tasks into row-chunks to amortize queue enqueue/dequeue overhead.'
          ],
          codeSnippet: {
            id: 'cpp-snip-28-5',
            title: 'Parallel Matrix Multiplication Chunking',
            description: 'Decomposing matrix workload across worker threads',
            language: 'cpp',
            code: `#include <iostream>
#include <vector>

void multiplyRowChunk(int startRow, int endRow, int N,
                      const std::vector<float>& A,
                      const std::vector<float>& B,
                      std::vector<float>& C) {
    for (int i = startRow; i < endRow; ++i) {
        for (int k = 0; k < N; ++k) {
            float r = A[i * N + k];
            for (int j = 0; j < N; ++j) {
                C[i * N + j] += r * B[k * N + j];
            }
        }
    }
}

int main() {
    const int N = 64;
    std::vector<float> A(N * N, 1.0f);
    std::vector<float> B(N * N, 2.0f);
    std::vector<float> C(N * N, 0.0f);
    
    // Compute first half on chunk 0
    multiplyRowChunk(0, N / 2, N, A, B, C);
    // Compute second half on chunk 1
    multiplyRowChunk(N / 2, N, N, A, B, C);
    
    std::cout << "Parallel chunked multiplication completed. Sample C[0]: " << C[0] << "\\n";
    return 0;
}`
          },
          pitfall: 'Dispatching tasks that are too granular (e.g. 1 task per single integer addition): the overhead of queue mutex locks will exceed the computation time, making parallel code slower than single-threaded code!',
          quickCheck: {
            question: 'What is task granularity and why does it matter in thread pool design?',
            options: ['The file size of the executable', 'The amount of work per task: tasks must be large enough to amortize queuing and lock overhead', 'The number of CPU registers available', 'The font size of code comments'],
            correctIndex: 1,
            explanation: 'If tasks are too small, synchronization overhead dominates runtime; chunking work into substantial batches ensures CPU time is spent on actual computation.'
          }
        },
        {
          id: 'cpp-w4-d28-t6',
          topicNumber: 6,
          title: 'Work-Stealing Architecture: Scaling Beyond Single-Queue Bottlenecks',
          explanation: [
            'In massive enterprise servers with 64+ cores, a single shared task queue becomes a severe mutex contention bottleneck.',
            'Work-Stealing Architecture (like Intel TBB or Go runtime):',
            '- Each worker thread possesses its own private double-ended queue (deque).',
            '- A worker pushes and pops from the bottom of its own queue (lock-free LIFO).',
            '- If a worker runs out of work, it "steals" tasks from the top of another thread queue (FIFO with lock or CAS).',
            'This achieves near-linear scaling across hundreds of CPU cores.'
          ],
          keyRules: [
            'Work-stealing maximizes cache affinity because threads process their recently pushed tasks locally.',
            'Contention occurs only when stealing, keeping average throughput exceptionally high.'
          ],
          codeSnippet: {
            id: 'cpp-snip-28-6',
            title: 'Work-Stealing Concepts',
            description: 'Per-worker deque and opportunistic task stealing',
            language: 'cpp',
            code: `#include <iostream>
#include <deque>
#include <mutex>

class WorkerDeque {
    std::deque<int> localTasks;
    std::mutex mtx;
public:
    void pushBottom(int task) {
        std::lock_guard<std::mutex> lock(mtx);
        localTasks.push_back(task);
    }
    
    bool popBottom(int& task) {
        std::lock_guard<std::mutex> lock(mtx);
        if (localTasks.empty()) return false;
        task = localTasks.back();
        localTasks.pop_back();
        return true;
    }
    
    bool stealTop(int& task) {
        std::lock_guard<std::mutex> lock(mtx);
        if (localTasks.empty()) return false;
        task = localTasks.front(); // steal from opposite end
        localTasks.pop_front();
        return true;
    }
};

int main() {
    WorkerDeque q;
    q.pushBottom(10);
    q.pushBottom(20);
    int stolen = 0;
    if (q.stealTop(stolen)) {
        std::cout << "Successfully stole task: " << stolen << "\\n";
    }
    return 0;
}`
          },
          pitfall: 'Implementing lock-free work-stealing without thorough formal verification: deques with concurrent popBottom and stealTop are notoriously prone to ABA bugs and subtle race conditions.',
          quickCheck: {
            question: 'What is the primary advantage of a work-stealing scheduler over a single central task queue?',
            options: ['It uses fewer CPU cores', 'It eliminates central lock contention by giving each thread its own queue, stealing work only when idle', 'It forbids dynamic memory allocation', 'It only works in debug mode'],
            correctIndex: 1,
            explanation: 'Work-stealing removes the centralized queue mutex bottleneck, allowing dozens of cores to operate concurrently without contending for the same lock.'
          }
        },
        {
          id: 'cpp-w4-d28-t7',
          topicNumber: 7,
          title: 'Packaging, Shared Libraries (.so/.dll) & ABI Stability',
          explanation: [
            'Building software for distribution requires producing shared libraries (`.so` on Linux, `.dylib` on macOS, `.dll` on Windows).',
            'Application Binary Interface (ABI) defines how functions are called, how structs are laid out in bytes, and name mangling in binary format.',
            'In C++, changing a private member variable or adding a virtual function breaks ABI compatibility, requiring all consumers to recompile.',
            'Use the Pimpl (Pointer to Implementation) idiom to maintain stable ABIs across library versions.'
          ],
          keyRules: [
            'Use visibility attributes (`__attribute__((visibility("default")))` or `__declspec(dllexport)`) to export only public API symbols.',
            'Never expose std::vector or std::string across ABI boundaries if client applications might compile with a different compiler or STL version.'
          ],
          codeSnippet: {
            id: 'cpp-snip-28-7',
            title: 'Exporting Clean C++ Library APIs',
            description: 'Macro definitions for cross-platform shared library exports',
            language: 'cpp',
            code: `#if defined(_WIN32)
  #if defined(BUILDING_ENGINE_DLL)
    #define ENGINE_API __declspec(dllexport)
  #else
    #define ENGINE_API __declspec(dllimport)
  #endif
#else
  #define ENGINE_API __attribute__((visibility("default")))
#endif

// Public API class with stable symbol export
class ENGINE_API EngineService {
public:
    void start();
    void stop();
};`
          },
          pitfall: 'Passing raw STL types across DLL boundaries compiled with different runtime libraries (e.g. Debug vs Release on MSVC) crashes instantly due to conflicting struct layouts.',
          quickCheck: {
            question: 'What is an Application Binary Interface (ABI) break in C++?',
            options: ['A typo in a source file', 'A change in binary layout, calling convention, or name mangling that prevents previously compiled binaries from linking or executing correctly without recompilation', 'A network socket timeout', 'A memory leak in main'],
            correctIndex: 1,
            explanation: 'An ABI break alters memory layout or calling conventions in compiled binary objects, causing crashes if mismatched binaries interact without full recompilation.'
          }
        },
        {
          id: 'cpp-w4-d28-t8',
          topicNumber: 8,
          title: 'The Master Synthesis: Enterprise C++ Engineering Principles',
          explanation: [
            'Congratulations on completing the 28-day C++ Systems & Software Architecture Academy!',
            'You have progressed from low-level memory layout and pointer arithmetic to object-oriented RAII, modern smart pointer ownership, generic templates, C++20 concepts, multithreading, atomics, modern CMake, and enterprise thread pools.',
            'Mastery in C++ is the discipline of combining maximum runtime performance with rock-solid resource safety.',
            'Build with pride, verify with sanitizers, design with RAII, and engineer systems that power the digital world.'
          ],
          keyRules: [
            'Rule of Zero > Rule of 5 > Rule of 3.',
            'RAII is non-negotiable: all resources must be bound to object lifetimes.',
            'Mechanical sympathy: respect CPU caches and memory hierarchy.',
            'Modern C++ is safe, expressive, and faster than ever.'
          ],
          codeSnippet: {
            id: 'cpp-snip-28-8',
            title: 'C++ Systems Academy Graduation Synthesis',
            description: 'Final execution verifying academy completion',
            language: 'cpp',
            code: `#include <iostream>
#include <string_view>
#include <array>

int main() {
    constexpr std::array<std::string_view, 4> milestones = {
        "Week 1: Memory Layout, Pointers, References & Arena Allocators",
        "Week 2: RAII, Smart Pointers, Move Semantics & Polymorphic Interfaces",
        "Week 3: Templates, Metaprogramming, C++20 Concepts, Ranges & STL",
        "Week 4: Concurrency, Atomics, POSIX Systems, CMake & Thread Pools"
    };
    
    std::cout << "====================================================\\n";
    std::cout << " C++ SYSTEMS & ARCHITECTURE ACADEMY COMPLETED!       \\n";
    std::cout << "====================================================\\n";
    for (size_t i = 0; i < milestones.size(); ++i) {
        std::cout << " [COMPLETED] " << milestones[i] << "\\n";
    }
    std::cout << "\\nReady for industrial systems programming!\\n";
    return 0;
}`
          },
          pitfall: 'Thinking learning ends here: C++ continues to evolve (C++23, C++26 reflection, contracts, and sender-receiver execution). Keep practicing and reading standards proposals!',
          quickCheck: {
            question: 'What is the core philosophical pillar unifying all modern C++ system designs?',
            options: ['Writing everything in header files', 'Deterministic resource management through RAII and zero-cost abstractions', 'Avoiding templates at all costs', 'Never running on 64-bit systems'],
            correctIndex: 1,
            explanation: 'Modern C++ is founded on deterministic RAII resource ownership and zero-overhead compile-time abstractions that execute at the speed of bare metal.'
          }
        }
      ]
    }
  ],
  quiz: {
    id: 'cpp-quiz-4',
    weekNumber: 4,
    title: 'Module 4 Qualifying Exam: Concurrency, Atomics & Systems Engineering',
    description: 'Verify your mastery of multithreading, locks, atomics, POSIX systems, and production thread pool architecture.',
    passingScorePercent: 80,
    questions: [
      {
        id: 'cpp-q4-1',
        question: 'Why does C++20 std::jthread eliminate the fatal crash hazard inherent in std::thread?',
        options: [
          'It runs on the GPU instead of CPU',
          'Its destructor automatically requests cancellation and calls join(), preventing std::terminate',
          'It disables all exceptions in the application',
          'It replaces threads with coroutines automatically'
        ],
        correctIndex: 1,
        explanation: 'std::jthread incorporates RAII into thread lifetime: if joinable upon destruction, it signals its stop_token and invokes join(), preventing the std::terminate call that std::~thread triggers.'
      },
      {
        id: 'cpp-q4-2',
        question: 'When synchronizing access to a shared resource between multiple reader threads and infrequent writer threads, which primitive delivers the highest concurrent read throughput?',
        options: [
          'std::mutex with std::lock_guard',
          'std::recursive_mutex',
          'std::shared_mutex with std::shared_lock for readers and std::unique_lock for writers',
          'A busy-wait while loop with sleep_for'
        ],
        correctIndex: 2,
        explanation: 'std::shared_mutex permits unlimited simultaneous readers holding std::shared_lock, while giving exclusive access to writers holding std::unique_lock.'
      },
      {
        id: 'cpp-q4-3',
        question: 'What is False Sharing in multi-threaded C++ applications?',
        options: [
          'Sharing code files across compilers',
          'Multiple threads concurrently writing to separate variables that reside on the same 64-byte CPU cache line, causing constant cache invalidation',
          'An invalid file descriptor in POSIX',
          'Throwing exceptions across thread boundaries'
        ],
        correctIndex: 1,
        explanation: 'False sharing occurs when independent variables accessed by different threads map to the same CPU cache line (usually 64 bytes), resulting in severe performance degradation as cores invalidate each others caches.'
      },
      {
        id: 'cpp-q4-4',
        question: 'Why is AddressSanitizer (ASan) dramatically superior to manual debugging for memory defects?',
        options: [
          'It automatically fixes your code syntax',
          'It instruments memory operations to catch buffer overflows, use-after-free, and leaks with low (~2x) CPU overhead and precise stack traces',
          'It converts C++ code into Rust automatically',
          'It only runs at compile time'
        ],
        correctIndex: 1,
        explanation: 'AddressSanitizer uses compiler instrumentation and shadow memory to detect buffer overruns, use-after-free, and leaks at runtime with detailed diagnostics and minimal runtime overhead.'
      },
      {
        id: 'cpp-q4-5',
        question: 'In a production Worker Thread Pool, why must worker threads release the queue lock BEFORE invoking task()?',
        options: [
          'The C++ language forbids executing functions inside lock scopes',
          'Releasing the lock allows other worker threads to simultaneously pop work from the queue while the task is executing',
          'Tasks can only be called from static member functions',
          'The operating system will terminate any thread that executes a task while holding a lock'
        ],
        correctIndex: 1,
        explanation: 'If a worker thread kept the queue locked while running task(), no other worker could access the queue, serializing all task execution and defeating the purpose of a multi-threaded pool.'
      }
    ]
  }
};
