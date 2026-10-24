import { WeekModule } from '../types/course';

export const CPP_WEEK_2_MODULE: WeekModule = {
  weekNumber: 2,
  title: 'OOP, RAII, Smart Pointers & Move Semantics',
  theme: 'Object Lifecycles, Ownership & Zero-Cost Abstractions',
  description:
    'Master C++ object-oriented design and modern ownership models: class construction, RAII (Resource Acquisition Is Initialization), smart pointers (unique_ptr, shared_ptr, weak_ptr), operator overloading, vtables, move semantics, and the Rule of 5.',
  conceptImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
  imageAlt: 'C++ object oriented architecture and smart pointer lifecycle graph',
  days: [
    {
      id: 'cpp-w2-d8',
      dayNumber: 8,
      weekNumber: 2,
      title: 'Classes, Encapsulation & Destructor Mechanics',
      subtitle: 'Constructors, member initializer lists, explicit keyword, destructor ordering & encapsulation',
      durationMinutes: 65,
      overview:
        'Understand the mechanics of C++ classes. Learn member initializer lists, the explicit keyword preventing accidental type coercion, deterministic destructor ordering, and class vs struct distinctions.',
      topics: [
        {
          id: 'cpp-w2-d8-t1',
          topicNumber: 1,
          title: 'Class vs Struct: Default Visibility & Intent',
          explanation: [
            'In C++, `class` and `struct` are virtually identical under the hood, with only one difference: default member and inheritance visibility.',
            'In a `struct`, members and base classes are `public` by default. In a `class`, members and base classes are `private` by default.',
            'Convention: Use `struct` for Passive Data Objects (Plain Old Data / aggregates); use `class` when enforcing invariants through private state and public member functions.'
          ],
          keyRules: [
            'struct default: public. class default: private.',
            'Both support constructors, destructors, methods, inheritance, and templates identically.'
          ],
          codeSnippet: {
            id: 'cpp-snip-8-1',
            title: 'Class vs Struct Visibility',
            description: 'Comparing default member accessibility in C++',
            language: 'cpp',
            code: `#include <iostream>

struct Config {
    int port{8080}; // Public by default
};

class Server {
    int port{8080}; // Private by default
public:
    int getPort() const { return port; }
};

int main() {
    Config cfg;
    cfg.port = 9000; // Legal: struct members are public

    Server srv;
    // srv.port = 9000; // COMPILE ERROR: Server::port is private
    std::cout << "Server port: " << srv.getPort() << "\\n";
    return 0;
}`,
          },
          pitfall: 'Relying on default visibility without explicit `public:` or `private:` labels makes code ambiguous for team maintenance.',
          quickCheck: {
            question: 'What is the ONLY difference between `class` and `struct` in C++?',
            options: [
              'Default member and inheritance visibility (struct is public, class is private)',
              'Classes can have virtual functions, structs cannot',
              'Structs are allocated on the stack, classes on the heap',
              'Structs cannot have constructors'
            ],
            correctIndex: 0,
            explanation: 'In C++, struct and class are identical except that members of struct default to public, while members of class default to private.',
          },
        },
        {
          id: 'cpp-w2-d8-t2',
          topicNumber: 2,
          title: 'Member Initializer Lists vs Assignment in Constructor Body',
          explanation: [
            'Constructing a class occurs in two distinct phases: (1) Base classes and member variables are initialized; (2) The constructor body `{ ... }` executes.',
            'Initializing members in the constructor body first calls their default constructor and then calls their copy assignment operator, doing double work.',
            'Member Initializer Lists (`MyClass() : m_val(5) {}`) construct the member directly in-place with its final value with ZERO redundant work.'
          ],
          keyRules: [
            'Always use member initializer lists instead of body assignments.',
            'Members are ALWAYS initialized in the order they are declared in the class definition, NOT the order they appear in the initializer list.',
            'const members and reference members MUST be initialized via member initializer lists.'
          ],
          codeSnippet: {
            id: 'cpp-snip-8-2',
            title: 'Member Initializer List Pattern',
            description: 'Direct in-place member initialization',
            language: 'cpp',
            code: `#include <iostream>
#include <string>

class DatabaseConnection {
private:
    const std::string host; // Const members MUST be initialized in list
    int port;
public:
    // Member Initializer List
    DatabaseConnection(const std::string& h, int p)
        : host(h), port(p) {
        // Constructor body for post-initialization logic
        std::cout << "Connected to " << host << ":" << port << "\\n";
    }
};

int main() {
    DatabaseConnection db("db.internal", 5432);
    return 0;
}`,
          },
          pitfall: 'Listing members in a different order in the initializer list than declared in the class triggers compiler warnings and can cause subtle bugs if one member relies on another during construction.',
          quickCheck: {
            question: 'In what order are class member variables initialized in C++?',
            options: [
              'In the order they are declared in the class definition',
              'In the order they appear in the constructor initializer list',
              'Alphabetically by variable name',
              'In random order'
            ],
            correctIndex: 0,
            explanation: 'The C++ standard mandates that members are always initialized in the exact order they are declared inside the class header.',
          },
        },
        {
          id: 'cpp-w2-d8-t3',
          topicNumber: 3,
          title: 'The `explicit` Keyword: Preventing Unintended Conversions',
          explanation: [
            'In C++, any constructor that can be called with a single argument acts as an implicit conversion operator by default.',
            'For example, `String s = "hello";` or passing `42` to a function expecting `MyContainer` will silently construct a temporary object.',
            'Adding the `explicit` keyword (`explicit MyClass(int size);`) disables implicit conversion, requiring callers to explicitly invoke the constructor.'
          ],
          keyRules: [
            'Mark all single-argument constructors `explicit` by default.',
            'Only omit `explicit` if implicit conversion is an intentional, idiomatic design goal.'
          ],
          codeSnippet: {
            id: 'cpp-snip-8-3',
            title: 'explicit Constructor Defense',
            description: 'Preventing dangerous implicit conversions',
            language: 'cpp',
            code: `#include <iostream>

class MemoryBuffer {
public:
    // Explicit prevents MemoryBuffer buf = 100;
    explicit MemoryBuffer(size_t size) {
        std::cout << "Allocating " << size << " bytes buffer\\n";
    }
};

void processBuffer(const MemoryBuffer& buf) {}

int main() {
    MemoryBuffer b1(1024); // OK: explicit direct construction
    // processBuffer(1024); // COMPILE ERROR: cannot implicitly convert int to MemoryBuffer!
    processBuffer(MemoryBuffer(1024)); // OK: explicitly constructed
    return 0;
}`,
          },
          pitfall: 'Omitting `explicit` on a constructor like `Vector(int size)` allows `Vector v = 50;` which looks like assigning a number instead of creating a 50-element vector.',
          quickCheck: {
            question: 'What is the purpose of marking a single-argument constructor `explicit`?',
            options: [
              'To prevent the compiler from performing implicit type conversions',
              'To make the constructor private',
              'To allocate the object on the heap',
              'To disable destructor calls'
            ],
            correctIndex: 0,
            explanation: '`explicit` prevents the compiler from using the constructor to silently convert one type into another.',
          },
        },
        {
          id: 'cpp-w2-d8-t4',
          topicNumber: 4,
          title: 'Deterministic Destructor Mechanics & Reverse Destruction Order',
          explanation: [
            'Unlike garbage-collected languages (Java/Python/Go) where finalizers run at unpredictable times or never, C++ guarantees deterministic destruction.',
            'When an object leaves scope, its destructor `~ClassName()` is called IMMEDIATELY.',
            'Destruction order is strictly the exact REVERSE of construction order: local stack variables are destroyed in reverse order of declaration; class members are destroyed in reverse order of declaration; derived class destructors run before base class destructors.'
          ],
          keyRules: [
            'Destruction is strictly LIFO (Last In, First Out).',
            'Destructors take no arguments and return no values.',
            'Destructors must NEVER throw exceptions; if an exception escapes a destructor during stack unwinding, std::terminate() crashes the program.'
          ],
          codeSnippet: {
            id: 'cpp-snip-8-4',
            title: 'LIFO Destruction Order Demonstration',
            description: 'Observing exact reverse destructor sequencing',
            language: 'cpp',
            code: `#include <iostream>

struct Tracer {
    int id;
    Tracer(int i) : id(i) { std::cout << "Constructed #" << id << "\\n"; }
    ~Tracer() { std::cout << "Destroyed   #" << id << "\\n"; }
};

int main() {
    std::cout << "Entering scope...\\n";
    {
        Tracer t1(1);
        Tracer t2(2);
        Tracer t3(3);
    } // t3 destroyed, then t2, then t1!
    std::cout << "Exited scope.\\n";
    return 0;
}`,
          },
          pitfall: 'Throwing an exception inside a destructor while an existing exception is propagating causes `std::terminate()` to kill the process immediately.',
          quickCheck: {
            question: 'In what order are local stack objects destroyed when leaving a block scope?',
            options: [
              'Reverse order of construction (LIFO: Last In, First Out)',
              'Same order as construction (FIFO)',
              'Random order based on garbage collector availability',
              'Alphabetical order'
            ],
            correctIndex: 0,
            explanation: 'C++ guarantees strict LIFO destruction: the last constructed object is the first to be destroyed.',
          },
        },
        {
          id: 'cpp-w2-d8-t5',
          topicNumber: 5,
          title: 'Defaulted (`= default`) and Deleted (`= delete`) Methods',
          explanation: [
            'C++11 introduced `= default` and `= delete` for explicit compiler-generated special member control.',
            '`= default` instructs the compiler to generate the standard implementation of a constructor, copy constructor, or destructor.',
            '`= delete` explicitly disables a method or constructor. If any code attempts to invoke a deleted function, compilation fails with a clear message (e.g. making an object non-copyable).'
          ],
          keyRules: [
            'Use = delete to make classes non-copyable (e.g. FileHandle, ThreadLock).',
            'Use = default to restore the compiler-generated default constructor when custom constructors exist.'
          ],
          codeSnippet: {
            id: 'cpp-snip-8-5',
            title: 'Non-Copyable Class Pattern with = delete',
            description: 'Preventing accidental object cloning at compile time',
            language: 'cpp',
            code: `#include <iostream>

class UniqueLock {
public:
    UniqueLock() = default;

    // Delete copy operations: cannot clone a lock!
    UniqueLock(const UniqueLock&) = delete;
    UniqueLock& operator=(const UniqueLock&) = delete;
};

int main() {
    UniqueLock lk1;
    // UniqueLock lk2 = lk1; // COMPILE ERROR: use of deleted function!
    std::cout << "UniqueLock successfully enforced non-copyable.\\n";
    return 0;
}`,
          },
          pitfall: 'Using legacy pre-C++11 patterns (making copy constructor private without definition) produces link-time errors instead of immediate compile-time errors.',
          quickCheck: {
            question: 'How do you make a class non-copyable in modern C++?',
            options: [
              'Mark the copy constructor and copy assignment operator with `= delete`',
              'Declare the class as `virtual`',
              'Inherit from std::noncopyable in C++98 only',
              'Mark the destructor private'
            ],
            correctIndex: 0,
            explanation: 'Deleting the copy constructor and copy assignment operator (`= delete`) explicitly forbids copy operations.',
          },
        },
        {
          id: 'cpp-w2-d8-t6',
          topicNumber: 6,
          title: 'Delegating Constructors (C++11)',
          explanation: [
            'Before C++11, if multiple constructors shared common initialization logic, developers had to write private `init()` helper functions.',
            'C++11 allows a constructor to delegate to another constructor of the same class in its member initializer list.',
            'Syntax: `MyClass(int x) : MyClass(x, "default_tag") {}`.'
          ],
          keyRules: [
            'The delegating constructor must be the ONLY item in the initializer list.',
            'After the delegated constructor finishes, the delegating constructor body executes.'
          ],
          codeSnippet: {
            id: 'cpp-snip-8-6',
            title: 'Delegating Constructor Pattern',
            description: 'Consolidating construction logic across overloaded constructors',
            language: 'cpp',
            code: `#include <iostream>
#include <string>

class ServiceClient {
private:
    std::string endpoint;
    int timeoutSec;
    bool retryOnFail;

public:
    // Primary comprehensive constructor
    ServiceClient(const std::string& ep, int to, bool retry)
        : endpoint(ep), timeoutSec(to), retryOnFail(retry) {
        std::cout << "Initialized client for " << endpoint << "\\n";
    }

    // Delegating constructor 1
    ServiceClient(const std::string& ep) : ServiceClient(ep, 30, true) {}

    // Delegating constructor 2
    ServiceClient() : ServiceClient("localhost:8080", 10, false) {}
};

int main() {
    ServiceClient defaultClient;
    ServiceClient prodClient("api.production.internal");
    return 0;
}`,
          },
          pitfall: 'Creating circular constructor delegation (`A() : B() {}` and `B() : A() {}`) causes a compile-time recursion error.',
          quickCheck: {
            question: 'What is the syntax for a constructor delegating to another constructor of the same class?',
            options: [
              'ClassName(args) : ClassName(other_args) {} in the initializer list',
              'this->ClassName(args); inside the constructor body',
              'super(args); in the body',
              'call(ClassName, args);'
            ],
            correctIndex: 0,
            explanation: 'A constructor delegates by calling the target constructor in its member initializer list.',
          },
        },
        {
          id: 'cpp-w2-d8-t7',
          topicNumber: 7,
          title: 'Static Members & Static Member Functions',
          explanation: [
            'A `static` member variable belongs to the class itself, not to individual instances. Only ONE shared copy exists across all instances in the entire program.',
            'Non-inline static variables must be defined outside the class in a `.cpp` file (or marked `inline static` in C++17).',
            '`static` member functions do not have a `this` pointer and can only access static members or other static functions.'
          ],
          keyRules: [
            'In C++17: inline static int sharedCounter = 0; can be declared directly in the header.',
            'Static member functions can be called without an instance: MathUtils::clamp(val, min, max);'
          ],
          codeSnippet: {
            id: 'cpp-snip-8-7',
            title: 'Modern inline static Member Variables (C++17)',
            description: 'Shared class-level state without separate .cpp definitions',
            language: 'cpp',
            code: `#include <iostream>

class InstanceCounter {
public:
    inline static size_t activeCount{0}; // C++17 inline static

    InstanceCounter() { activeCount++; }
    ~InstanceCounter() { activeCount--; }

    static size_t getCount() { return activeCount; }
};

int main() {
    std::cout << "Initial count: " << InstanceCounter::getCount() << "\\n";
    {
        InstanceCounter a, b, c;
        std::cout << "Inside scope count: " << InstanceCounter::getCount() << "\\n";
    }
    std::cout << "After scope count:  " << InstanceCounter::getCount() << "\\n";
    return 0;
}`,
          },
          pitfall: 'Omitting `inline` on a static member variable in a header file triggers duplicate symbol definition linker errors when included in multiple `.cpp` files.',
          quickCheck: {
            question: 'Do `static` member functions have access to the `this` pointer?',
            options: [
              'No, because static functions belong to the class and have no instance',
              'Yes, always',
              'Only if declared public',
              'Only in derived classes'
            ],
            correctIndex: 0,
            explanation: 'Static member functions operate without an object instance, so no `this` pointer exists.',
          },
        },
        {
          id: 'cpp-w2-d8-t8',
          topicNumber: 8,
          title: 'Day 8 Capstone: Thread-Safe State Machine Class',
          explanation: [
            'Synthesizing Day 8 concepts into an industrial state machine class.',
            'Demonstrating private state, member initializer list, explicit constructor, const inspection methods, and deterministic destructor cleanup.',
            'Highlights the power of robust encapsulation in systems software.'
          ],
          keyRules: [
            'Encapsulate transitions inside validateAndTransition() method.',
            'Enforce clean lifecycle logging in constructor and destructor.'
          ],
          codeSnippet: {
            id: 'cpp-snip-8-8',
            title: 'Production State Machine Class Blueprint',
            description: 'Encapsulated state machine with deterministic lifecycle',
            language: 'cpp',
            code: `#include <iostream>
#include <string_view>

enum class EngineState { STOPPED, STARTING, RUNNING, ERROR };

class ServiceEngine {
private:
    std::string_view name;
    EngineState state{EngineState::STOPPED};

public:
    explicit ServiceEngine(std::string_view engineName) 
        : name(engineName) {
        std::cout << "ServiceEngine [" << name << "] instantiated.\\n";
    }

    ~ServiceEngine() {
        if (state == EngineState::RUNNING) {
            std::cout << "ServiceEngine [" << name << "] shutting down cleanly.\\n";
        }
    }

    void start() {
        state = EngineState::RUNNING;
        std::cout << "[" << name << "] transitioned to RUNNING.\\n";
    }

    EngineState getState() const { return state; }
};

int main() {
    {
        ServiceEngine engine("IngestionWorker");
        engine.start();
    } // Deterministic cleanup executed here automatically!
    return 0;
}`,
          },
          pitfall: 'Leaving state uninitialized leads to random garbage states on creation.',
          quickCheck: {
            question: 'What is guaranteed about destructor execution when an object goes out of scope?',
            options: [
              'It runs immediately and deterministically at the exact moment scope ends',
              'It runs whenever the garbage collector has idle cycles',
              'It is postponed until application termination',
              'It only runs if memory is low'
            ],
            correctIndex: 0,
            explanation: 'C++ guarantees deterministic destruction: destructors execute immediately when their scope closes.',
          },
        },
      ],
      practiceChallenge: {
        title: 'Day 8 Capstone: Non-Copyable Resource Handle',
        instructions: [
          'Create a class `FileDescriptor` that takes an `int fd` in its constructor.',
          'Mark the constructor `explicit`.',
          'Delete the copy constructor and copy assignment operator using `= delete`.',
          'Implement a destructor that logs closing the file descriptor.',
        ],
        starterCode: `#include <iostream>

class FileDescriptor {
    // Implement non-copyable file descriptor wrapper
};

int main() {
    FileDescriptor fd(3);
    return 0;
}`,
        solutionCode: `#include <iostream>

class FileDescriptor {
private:
    int m_fd{-1};

public:
    explicit FileDescriptor(int fd) : m_fd(fd) {
        std::cout << "Opened FD " << m_fd << "\\n";
    }

    ~FileDescriptor() {
        if (m_fd != -1) {
            std::cout << "Closed FD " << m_fd << "\\n";
        }
    }

    // Delete copy operations
    FileDescriptor(const FileDescriptor&) = delete;
    FileDescriptor& operator=(const FileDescriptor&) = delete;

    int get() const { return m_fd; }
};

int main() {
    FileDescriptor fd(3);
    std::cout << "Active file descriptor: " << fd.get() << "\\n";
    return 0;
}`,
        hints: [
          'Mark the constructor `explicit FileDescriptor(int fd)`.',
          'Add `FileDescriptor(const FileDescriptor&) = delete;`.',
        ],
      },
      keyTakeaways: [
        'Prefer member initializer lists over body assignments to avoid redundant construction.',
        'Always mark single-argument constructors `explicit` to prevent implicit conversions.',
        'Destruction is strictly deterministic and follows LIFO (reverse construction) order.',
        'Use `= delete` to declare non-copyable resource handles.',
      ],
    },

    // Day 9: RAII (Resource Acquisition Is Initialization) Core Philosophy
    {
      id: 'cpp-w2-d9',
      dayNumber: 9,
      weekNumber: 2,
      title: 'The RAII Philosophy: Automatic Resource Management',
      subtitle: 'Resource Acquisition Is Initialization, exception safety, scope-bound resource management',
      durationMinutes: 65,
      overview:
        'Understand RAII, the single most important design pattern in C++. Learn how binding resource ownership to object lifetime guarantees leak-free management of memory, file handles, mutexes, and sockets—even in the presence of runtime exceptions.',
      topics: [
        {
          id: 'cpp-w2-d9-t1',
          topicNumber: 1,
          title: 'The Core Tenet of RAII (Resource Acquisition Is Initialization)',
          explanation: [
            'RAII (invented by Bjarne Stroustrup) ties the lifecycle of a resource (heap memory, file handles, sockets, database transactions, mutexes) to the lifetime of an automatic (stack) object.',
            'Acquisition happens in the constructor: If acquisition fails, the constructor throws an exception, and the object is never created.',
            'Release happens in the destructor: When the object leaves scope for ANY reason (normal return, break, or thrown exception), the destructor runs immediately and frees the resource.'
          ],
          keyRules: [
            'Never manage raw resources directly in business logic.',
            'Wrap every resource inside an RAII wrapper object.',
            'Stack unwinding during exceptions guarantees destructors are called.'
          ],
          codeSnippet: {
            id: 'cpp-snip-9-1',
            title: 'Classic RAII File Wrapper Pattern',
            description: 'Guaranteed file closure even when early returns occur',
            language: 'cpp',
            code: `#include <iostream>
#include <cstdio>

class FileGuard {
private:
    std::FILE* m_file{nullptr};
public:
    explicit FileGuard(const char* filename, const char* mode) {
        m_file = std::fopen(filename, mode);
        std::cout << "Resource Acquired: File opened\\n";
    }

    ~FileGuard() {
        if (m_file) {
            std::fclose(m_file);
            std::cout << "Resource Released: File closed automatically\\n";
        }
    }

    bool isValid() const { return m_file != nullptr; }
};

void processData() {
    FileGuard file("data.bin", "rb");
    if (!file.isValid()) return; // Early return: destructor STILL closes file!
}

int main() {
    processData();
    return 0;
}`,
          },
          pitfall: 'Managing resources manually with open() and close() calls leads to leaks whenever early returns or exceptions bypass the close() call.',
          quickCheck: {
            question: 'When is a resource released in the RAII pattern?',
            options: [
              'Automatically inside the destructor when the wrapper object goes out of scope',
              'When the developer manually calls .free()',
              'When the garbage collector runs',
              'Only when the operating system shuts down'
            ],
            correctIndex: 0,
            explanation: 'RAII guarantees automatic resource release inside the destructor when the stack object leaves scope.',
          },
        },
        {
          id: 'cpp-w2-d9-t2',
          topicNumber: 2,
          title: 'Stack Unwinding & Exception Safety Guarantees',
          explanation: [
            'When an exception is thrown in C++, the runtime performs "Stack Unwinding": walking back up the call stack frame by frame.',
            'During stack unwinding, EVERY fully constructed stack object has its destructor invoked automatically.',
            'C++ defines 4 Exception Safety Levels: (1) No-throw guarantee (`noexcept`); (2) Strong guarantee (commit or rollback); (3) Basic guarantee (no leaks, valid state); (4) No guarantee.'
          ],
          keyRules: [
            'Without RAII, any thrown exception causes catastrophic resource leaks.',
            'Mark functions noexcept if they are guaranteed never to throw (critical for move constructors and destructors).'
          ],
          codeSnippet: {
            id: 'cpp-snip-9-2',
            title: 'Stack Unwinding with RAII',
            description: 'Observing automatic destructor calls during exception propagation',
            language: 'cpp',
            code: `#include <iostream>
#include <stdexcept>

struct Resource {
    std::string name;
    Resource(std::string n) : name(n) { std::cout << "Acquired " << name << "\\n"; }
    ~Resource() { std::cout << "Released " << name << "\\n"; }
};

void riskyOperation() {
    Resource r1("Database Lock");
    Resource r2("Network Socket");
    throw std::runtime_error("Simulated network timeout failure!");
}

int main() {
    try {
        riskyOperation();
    } catch (const std::exception& e) {
        std::cout << "Caught Exception: " << e.what() << "\\n";
    }
    // Both Database Lock and Network Socket were destroyed cleanly!
    return 0;
}`,
          },
          pitfall: 'Allocating raw heap memory with `new` before throwing an exception guarantees that `delete` will be skipped, causing an irrecoverable memory leak.',
          quickCheck: {
            question: 'What happens to local stack objects when an exception propagates up the call stack?',
            options: [
              'Their destructors are called in reverse order during stack unwinding',
              'They remain in memory until the program terminates',
              'Their memory is immediately wiped without calling destructors',
              'Stack unwinding causes a segmentation fault'
            ],
            correctIndex: 0,
            explanation: 'Stack unwinding systematically calls the destructors of all local objects in the unwound stack frames.',
          },
        },
        {
          id: 'cpp-w2-d9-t3',
          topicNumber: 3,
          title: '`std::lock_guard` & Scoped Mutex Management',
          explanation: [
            'In multithreaded programming, locking a `std::mutex` manually with `mtx.lock()` and `mtx.unlock()` is error-prone (forgetting to unlock on early returns or exceptions causes permanent deadlocks).',
            '`std::lock_guard<std::mutex>` is the quintessential standard RAII wrapper for synchronization.',
            'It locks the mutex in its constructor and unlocks it automatically in its destructor.'
          ],
          keyRules: [
            'Never call mutex.unlock() manually; always use std::lock_guard or std::scoped_lock.',
            'C++17 std::scoped_lock can lock multiple mutexes simultaneously without risk of deadlock.'
          ],
          codeSnippet: {
            id: 'cpp-snip-9-3',
            title: 'Deadlock-Free Thread Locking with RAII',
            description: 'Automated mutex lock and unlock via std::lock_guard',
            language: 'cpp',
            code: `#include <iostream>
#include <mutex>

std::mutex g_coutMutex;

void printSafely(int threadId, int value) {
    // Locks g_coutMutex upon creation; unlocks on return
    std::lock_guard<std::mutex> lock(g_coutMutex);
    std::cout << "Thread " << threadId << " processed value: " << value << "\\n";
}

int main() {
    printSafely(1, 100);
    printSafely(2, 200);
    return 0;
}`,
          },
          pitfall: 'Calling `mtx.lock()` manually before a function that can throw leaves the mutex permanently locked, deadlocking all other threads.',
          quickCheck: {
            question: 'What is the primary benefit of `std::lock_guard` over manual `mutex.lock()` and `mutex.unlock()`?',
            options: [
              'It guarantees the mutex is unlocked even if an exception or early return occurs',
              'It makes code run on multiple CPUs simultaneously',
              'It converts the mutex to an atomic integer',
              'It allows recursive locking'
            ],
            correctIndex: 0,
            explanation: 'By using RAII, lock_guard guarantees unlock upon scope exit regardless of return path or exceptions.',
          },
        },
        {
          id: 'cpp-w2-d9-t4',
          topicNumber: 4,
          title: 'Custom RAII Scope Guard / Defer Pattern',
          explanation: [
            'Sometimes you need to execute ad-hoc cleanup logic without writing an entire dedicated class.',
            'A Scope Guard (or `defer` idiom, popularized by Go/Zig) accepts an arbitrary lambda and executes it in its destructor.',
            'Invaluable for legacy C API integration, resetting temporary state, or restoring terminal display modes.'
          ],
          keyRules: [
            'Store the callable lambda inside the guard class.',
            'The destructor executes the lambda upon exiting the block scope.'
          ],
          codeSnippet: {
            id: 'cpp-snip-9-4',
            title: 'Custom ScopeGuard Defer Implementation',
            description: 'Executing arbitrary cleanup lambdas via RAII',
            language: 'cpp',
            code: `#include <iostream>
#include <functional>

class ScopeGuard {
private:
    std::function<void()> m_cleanup;
public:
    explicit ScopeGuard(std::function<void()> cleanup) : m_cleanup(cleanup) {}
    ~ScopeGuard() { if (m_cleanup) m_cleanup(); }

    ScopeGuard(const ScopeGuard&) = delete;
    ScopeGuard& operator=(const ScopeGuard&) = delete;
};

int main() {
    std::cout << "Starting transaction...\\n";
    {
        ScopeGuard onExit([]() {
            std::cout << "Deferred cleanup executed successfully!\\n";
        });
        std::cout << "Performing database operations...\\n";
    } // onExit lambda triggered here
    return 0;
}`,
          },
          pitfall: 'Letting an exception throw out of a ScopeGuard destructor terminates the program; ensure cleanup lambdas are noexcept.',
          quickCheck: {
            question: 'What does a ScopeGuard or `defer` pattern guarantee?',
            options: [
              'That a specified cleanup function will execute whenever the current scope exits',
              'That code runs in a background thread',
              'That all heap allocations are doubled',
              'That memory is allocated on the GPU'
            ],
            correctIndex: 0,
            explanation: 'A ScopeGuard wraps a callable action in a destructor, guaranteeing execution on scope exit.',
          },
        },
        {
          id: 'cpp-w2-d9-t5',
          topicNumber: 5,
          title: 'RAII Across Standard Library Components',
          explanation: [
            'Modern C++ is built entirely on RAII:',
            '`std::vector<T>`: RAII wrapper over dynamic heap arrays.',
            '`std::string`: RAII wrapper over dynamic char buffers.',
            '`std::fstream`: RAII wrapper over OS file handles.',
            '`std::unique_ptr<T>`: RAII wrapper over single-owner heap pointers.',
            '`std::jthread` (C++20): RAII wrapper over OS threads that joins automatically on destruction.'
          ],
          keyRules: [
            'Embrace the standard library RAII types to avoid writing manual memory management.',
            'If you write "delete" in modern C++, you are likely violating RAII best practices.'
          ],
          codeSnippet: {
            id: 'cpp-snip-9-5',
            title: 'Standard Library RAII in Action',
            description: 'Zero manual deletes across vectors and file streams',
            language: 'cpp',
            code: `#include <iostream>
#include <vector>
#include <fstream>

void writeLog() {
    // 1. Vector: automatically deallocates its heap array
    std::vector<int> numbers = {10, 20, 30};

    // 2. ofstream: automatically flushes and closes file handle on scope exit
    std::ofstream outFile("audit.log");
    outFile << "Log entry created with " << numbers.size() << " records.\\n";
} // ZERO leaks, 0 manual free/delete calls needed!

int main() {
    writeLog();
    std::cout << "Log generated cleanly with RAII.\\n";
    return 0;
}`,
          },
          pitfall: 'Manually calling `.close()` on `std::fstream` or `.clear()` before vector destruction is redundant noise; RAII handles it automatically.',
          quickCheck: {
            question: 'Why does modern C++ rarely require writing explicit `delete` calls?',
            options: [
              'Standard library containers and smart pointers manage heap memory through RAII destructors',
              'C++ added a mandatory garbage collector in C++20',
              'The compiler converts delete into a syntax warning',
              'All variables are now stored on the stack'
            ],
            correctIndex: 0,
            explanation: 'Modern RAII wrappers (`std::vector`, `std::unique_ptr`, `std::string`) release memory automatically in their destructors.',
          },
        },
        {
          id: 'cpp-w2-d9-t6',
          topicNumber: 6,
          title: 'The "Rule of Zero": The Peak of RAII Design',
          explanation: [
            'The "Rule of Zero" states: If a class does not directly manage raw resources, it should define ZERO custom special member functions (no custom destructor, copy constructor, copy assignment, move constructor, or move assignment).',
            'By using standard RAII members (`std::string`, `std::vector`, `std::unique_ptr`), the compiler-generated special members will automatically do the right thing.',
            'Classes with Rule of Zero are simpler, bug-free, and maintain maximum performance.'
          ],
          keyRules: [
            'Prefer Rule of Zero whenever possible.',
            'Only write custom destructors in low-level resource wrapper classes.'
          ],
          codeSnippet: {
            id: 'cpp-snip-9-6',
            title: 'The Rule of Zero Class Design',
            description: 'Flawless resource management without writing a single destructor',
            language: 'cpp',
            code: `#include <iostream>
#include <string>
#include <vector>

// Rule of Zero: 0 custom destructors or copy/move constructors!
class UserProfile {
public:
    std::string username;
    std::vector<std::string> roles;
    // Compiler generates perfectly correct copy, move, and destructor!
};

int main() {
    UserProfile u1{"developer_alice", {"admin", "maintainer"}};
    UserProfile u2 = u1; // Clean deep copy automatically
    std::cout << "Copied user: " << u2.username << "\\n";
    return 0;
}`,
          },
          pitfall: 'Writing unnecessary empty destructors `~MyClass() {}` suppresses the compiler from generating automatic move constructors, degrading performance.',
          quickCheck: {
            question: 'What is the "Rule of Zero" in C++ software engineering?',
            options: [
              'Classes that compose RAII member types should avoid defining custom destructors or copy/move operations',
              'All functions must return 0',
              'Variables must be initialized to 0',
              'No class can have more than zero base classes'
            ],
            correctIndex: 0,
            explanation: 'The Rule of Zero advises delegating resource management to standard RAII member types so no custom special members are needed.',
          },
        },
        {
          id: 'cpp-w2-d9-t7',
          topicNumber: 7,
          title: 'Exception-Safe Transaction Pattern with Commit / Rollback',
          explanation: [
            'Using RAII to implement the Strong Exception Safety Guarantee.',
            'An `AutoRollback` RAII object assumes failure by default. If an exception occurs, its destructor rolls back the transaction.',
            'If all steps succeed, calling `commit()` or `dismiss()` disarms the rollback guard, cementing the changes.'
          ],
          keyRules: [
            'Assume failure on initialization.',
            'Call guard.dismiss() only at the very end of the safe path.'
          ],
          codeSnippet: {
            id: 'cpp-snip-9-7',
            title: 'Transaction Rollback Guard Pattern',
            description: 'Automatic rollback on exception using RAII dismiss guard',
            language: 'cpp',
            code: `#include <iostream>

class TransactionGuard {
private:
    bool committed{false};
public:
    void commit() { committed = true; }

    ~TransactionGuard() {
        if (!committed) {
            std::cout << "[ROLLBACK] Transaction aborted; restoring prior state.\\n";
        } else {
            std::cout << "[COMMIT] Transaction committed successfully.\\n";
        }
    }
};

void runDatabaseOperation(bool simulateError) {
    TransactionGuard tx;
    std::cout << "Executing DB updates...\\n";
    if (simulateError) {
        throw std::runtime_error("Disk I/O error during insert!");
    }
    tx.commit(); // Only commits if no exception was thrown
}

int main() {
    try {
        runDatabaseOperation(true); // Triggers rollback
    } catch (...) {}
    return 0;
}`,
          },
          pitfall: 'Forgetting to disarm the rollback guard on the success path causes unintentional rollbacks when exiting the function.',
          quickCheck: {
            question: 'How does an RAII rollback guard ensure the Strong Exception Guarantee?',
            options: [
              'It automatically reverts changes in its destructor if commit() was never called due to an exception',
              'It re-runs the code until it succeeds',
              'It disables exceptions entirely',
              'It creates a backup of the hard drive'
            ],
            correctIndex: 0,
            explanation: 'If an exception unwinds the stack before commit(), the destructor executes rollback logic automatically.',
          },
        },
        {
          id: 'cpp-w2-d9-t8',
          topicNumber: 8,
          title: 'Day 9 Capstone: RAII POSIX Socket Wrapper',
          explanation: [
            'Synthesizing Day 9 concepts into an industrial network socket descriptor wrapper.',
            'Guarantees that socket descriptors are closed, prevents double-close errors, and demonstrates non-copyable RAII resource management.',
            'Forms the backbone of production high-performance web servers.'
          ],
          keyRules: [
            'Encapsulate raw OS integer file descriptors inside an RAII class.',
            'Strictly delete copy constructor and copy assignment.'
          ],
          codeSnippet: {
            id: 'cpp-snip-9-8',
            title: 'Production RAII Socket Wrapper Blueprint',
            description: 'Leak-proof socket management conforming to RAII standards',
            language: 'cpp',
            code: `#include <iostream>

class ScopedSocket {
private:
    int m_fd{-1};

public:
    explicit ScopedSocket(int fd) : m_fd(fd) {
        std::cout << "ScopedSocket: Socket FD " << m_fd << " acquired.\\n";
    }

    ~ScopedSocket() {
        if (m_fd != -1) {
            std::cout << "ScopedSocket: Socket FD " << m_fd << " closed cleanly via RAII.\\n";
            m_fd = -1;
        }
    }

    // Non-copyable
    ScopedSocket(const ScopedSocket&) = delete;
    ScopedSocket& operator=(const ScopedSocket&) = delete;

    int get() const { return m_fd; }
};

int main() {
    {
        ScopedSocket sock(42);
        std::cout << "Operating on socket: " << sock.get() << "\\n";
    } // Socket 42 closed automatically on scope exit!
    return 0;
}`,
          },
          pitfall: 'Copying raw socket wrappers without unique ownership leads to closing the same OS file descriptor twice.',
          quickCheck: {
            question: 'Why should RAII wrappers over OS file descriptors be non-copyable by default?',
            options: [
              'To prevent two wrapper instances from closing the same underlying file descriptor twice',
              'Because file descriptors are 64-bit integers',
              'Because the operating system forbids copying',
              'To force compilation with Clang'
            ],
            correctIndex: 0,
            explanation: 'If two objects hold the same raw OS file descriptor, both destructors would close it, causing double-close errors.',
          },
        },
      ],
      practiceChallenge: {
        title: 'Day 9 Capstone: RAII Benchmark Stopwatch Timer',
        instructions: [
          'Create a class `ExecutionTimer` that records `std::chrono::high_resolution_clock::now()` in its constructor.',
          'In its destructor, compute the elapsed milliseconds and print the timing benchmark.',
          'Test it by wrapping a computationally intensive loop.',
        ],
        starterCode: `#include <iostream>
#include <chrono>

class ExecutionTimer {
    // Implement RAII execution stopwatch timer
};

int main() {
    // Measure a loop using ExecutionTimer
    return 0;
}`,
        solutionCode: `#include <iostream>
#include <chrono>

class ExecutionTimer {
private:
    std::string m_label;
    std::chrono::time_point<std::chrono::high_resolution_clock> m_startTime;

public:
    explicit ExecutionTimer(const std::string& label)
        : m_label(label), m_startTime(std::chrono::high_resolution_clock::now()) {}

    ~ExecutionTimer() {
        auto endTime = std::chrono::high_resolution_clock::now();
        auto duration = std::chrono::duration_cast<std::chrono::microseconds>(endTime - m_startTime).count();
        std::cout << "[" << m_label << "] Elapsed Time: " << duration << " microseconds\\n";
    }
};

int main() {
    {
        ExecutionTimer timer("Computational Loop");
        uint64_t sum = 0;
        for (uint64_t i = 0; i < 1000000; i++) sum += i;
        std::cout << "Computed sum: " << sum << "\\n";
    } // Timer prints automatically when leaving scope
    return 0;
}`,
        hints: [
          'Store start time in `m_startTime = std::chrono::high_resolution_clock::now();`.',
          'Calculate duration in destructor with `std::chrono::duration_cast<std::chrono::microseconds>`.',
        ],
      },
      keyTakeaways: [
        'RAII guarantees automatic resource release in destructors upon leaving scope.',
        'Stack unwinding during exceptions ensures destructors are reliably called.',
        'The Rule of Zero advises composing standard RAII members instead of writing custom destructors.',
        'Never manage raw mutexes or file handles manually; use scoped RAII guards.',
      ],
    },

    // Days 10 to 14 will complete Week 2
    // Day 10: Smart Pointers: std::unique_ptr, std::shared_ptr & std::weak_ptr
    {
      id: 'cpp-w2-d10',
      dayNumber: 10,
      weekNumber: 2,
      title: 'Smart Pointers: `unique_ptr`, `shared_ptr` & `weak_ptr`',
      subtitle: 'Exclusive ownership, reference-counted shared ownership & breaking cyclic reference leaks',
      durationMinutes: 70,
      overview:
        'Eliminate raw pointer bugs with C++11 smart pointers. Master std::unique_ptr for exclusive zero-overhead ownership, std::shared_ptr for reference-counted ownership, std::make_unique/make_shared, and std::weak_ptr for breaking cyclic memory leaks.',
      topics: [
        {
          id: 'cpp-w2-d10-t1',
          topicNumber: 1,
          title: '`std::unique_ptr<T>`: Exclusive Zero-Overhead Ownership',
          explanation: [
            '`std::unique_ptr<T>` owns and manages a heap object exclusively. Exactly ONE `unique_ptr` owns the target at any time.',
            'When the `unique_ptr` goes out of scope, it automatically deletes the owned object.',
            'Zero overhead: `sizeof(std::unique_ptr<T>) == sizeof(T*)` (exactly 8 bytes on 64-bit). It has zero memory or execution cost compared to a raw pointer.'
          ],
          keyRules: [
            'unique_ptr cannot be copied (copy constructor is deleted).',
            'unique_ptr CAN be moved (ownership transferred via std::move).',
            'Always prefer unique_ptr by default for dynamic heap allocations.'
          ],
          codeSnippet: {
            id: 'cpp-snip-10-1',
            title: 'std::unique_ptr Exclusive Ownership',
            description: 'Zero-overhead automatic heap deletion upon scope exit',
            language: 'cpp',
            code: `#include <iostream>
#include <memory>

struct Sensor {
    int id;
    Sensor(int i) : id(i) { std::cout << "Sensor " << id << " activated\\n"; }
    ~Sensor() { std::cout << "Sensor " << id << " deactivated\\n"; }
};

int main() {
    std::cout << "Entering scope...\\n";
    {
        std::unique_ptr<Sensor> s = std::make_unique<Sensor>(101);
        std::cout << "Operating on sensor: " << s->id << "\\n";
        // std::unique_ptr<Sensor> s2 = s; // COMPILE ERROR: Cannot copy unique_ptr!
    } // Sensor 101 automatically deleted here!
    std::cout << "Exited scope.\\n";
    return 0;
}`,
          },
          pitfall: 'Attempting to copy a `unique_ptr` will fail compilation; transfer ownership using `std::move(ptr)` instead.',
          quickCheck: {
            question: 'What is the memory size overhead of `std::unique_ptr<T>` compared to a raw pointer `T*`?',
            options: [
              'Zero overhead (same size as raw pointer: 8 bytes on 64-bit)',
              '16 bytes extra for reference counting',
              '32 bytes for garbage collection metadata',
              'Double the size'
            ],
            correctIndex: 0,
            explanation: 'std::unique_ptr is a zero-cost abstraction with identical memory size and runtime speed to a raw pointer.',
          },
        },
        {
          id: 'cpp-w2-d10-t2',
          topicNumber: 2,
          title: '`std::make_unique<T>` (C++14): Exception Safety & Efficiency',
          explanation: [
            'Never construct a unique pointer with raw `new`: `std::unique_ptr<T>(new T())` is an anti-pattern.',
            'Always use `std::make_unique<T>(args...)` (standardized in C++14).',
            'It provides clean syntax without repeating the type name and eliminates potential memory leaks if an exception is thrown in another argument of a multi-parameter function call.'
          ],
          keyRules: [
            'Use auto ptr = std::make_unique<T>(constructor_args...);',
            'Eliminates raw "new" from modern application codebases.'
          ],
          codeSnippet: {
            id: 'cpp-snip-10-2',
            title: 'Factory Pattern with std::make_unique',
            description: 'Clean exception-safe heap allocation syntax',
            language: 'cpp',
            code: `#include <iostream>
#include <memory>
#include <string>

class UserSession {
public:
    std::string token;
    explicit UserSession(std::string t) : token(t) {}
};

int main() {
    // Best practice in modern C++
    auto session = std::make_unique<UserSession>("auth_tok_892341");
    std::cout << "Session token: " << session->token << "\\n";
    return 0;
}`,
          },
          pitfall: 'Using `new` inside a function call like `foo(std::unique_ptr<A>(new A()), std::unique_ptr<B>(new B()))` can leak if evaluation order throws an exception between the allocations.',
          quickCheck: {
            question: 'Why is `std::make_unique<T>()` preferred over `std::unique_ptr<T>(new T())`?',
            options: [
              'It provides exception safety and eliminates redundant type declarations',
              'It allows unique_ptr to be copied',
              'It runs faster on 32-bit systems only',
              'It disables the destructor'
            ],
            correctIndex: 0,
            explanation: 'make_unique provides complete exception safety and cleaner syntax without mentioning the type twice.',
          },
        },
        {
          id: 'cpp-w2-d10-t3',
          topicNumber: 3,
          title: '`std::shared_ptr<T>`: Reference-Counted Shared Ownership',
          explanation: [
            '`std::shared_ptr<T>` allows multiple owners to share ownership of a single heap object.',
            'Internally, it manages a heap-allocated "Control Block" containing: (1) Strong Reference Count; (2) Weak Reference Count; (3) Custom deleter (if any).',
            'Copying a `shared_ptr` atomically increments the strong reference count. When any `shared_ptr` is destroyed, it decrements the count. When the count drops to ZERO, the managed object is deleted.'
          ],
          keyRules: [
            'Reference count increments/decrements are atomic (thread-safe).',
            'Memory size of shared_ptr is 16 bytes (pointer to object + pointer to control block).',
            'Use shared_ptr only when true shared, multi-owner lifetime is necessary.'
          ],
          codeSnippet: {
            id: 'cpp-snip-10-3',
            title: 'std::shared_ptr Reference Counting',
            description: 'Tracking use_count() across multiple sharing owners',
            language: 'cpp',
            code: `#include <iostream>
#include <memory>

int main() {
    std::shared_ptr<int> p1 = std::make_shared<int>(42);
    std::cout << "Initial use count: " << p1.use_count() << "\\n"; // 1

    {
        std::shared_ptr<int> p2 = p1; // Shared ownership
        std::cout << "Inside scope count: " << p1.use_count() << "\\n"; // 2
    } // p2 destroyed; count decrements to 1

    std::cout << "After scope count:  " << p1.use_count() << "\\n"; // 1
    return 0;
}`,
          },
          pitfall: 'Using `shared_ptr` by default everywhere introduces atomic reference-counting cache line thrashing and control block overhead; use `unique_ptr` unless shared ownership is strictly required.',
          quickCheck: {
            question: 'When is the object managed by a `std::shared_ptr` destroyed?',
            options: [
              'When the strong reference count drops to zero',
              'When the first shared_ptr goes out of scope',
              'At application termination only',
              'When use_count() reaches 10'
            ],
            correctIndex: 0,
            explanation: 'The managed object is deleted when the last shared_ptr owner is destroyed (use_count() reaches 0).',
          },
        },
        {
          id: 'cpp-w2-d10-t4',
          topicNumber: 4,
          title: '`std::make_shared<T>`: Single-Allocation Optimization',
          explanation: [
            'Creating a shared pointer via `std::shared_ptr<T>(new T())` performs TWO separate heap allocations: (1) for the object `T`; (2) for the internal Control Block.',
            '`std::make_shared<T>(args...)` performs a single contiguous heap allocation combining both the object `T` and the Control Block into one contiguous memory chunk.',
            'Result: Halves heap allocation count and significantly improves CPU cache locality.'
          ],
          keyRules: [
            'Always use std::make_shared<T>() instead of shared_ptr<T>(new T()).',
            'Single heap allocation for both object and control block.'
          ],
          codeSnippet: {
            id: 'cpp-snip-10-4',
            title: 'std::make_shared Combined Memory Layout',
            description: 'Single allocation for control block and object payload',
            language: 'cpp',
            code: `/*
  std::shared_ptr<T>(new T()) -> 2 Heap Allocations:
  [Alloc 1: Object T]  <--- Separate Memory Block --->  [Alloc 2: Control Block]

  std::make_shared<T>()       -> 1 Contiguous Allocation:
  [=== Combined Heap Allocation: Control Block (16B) | Object T ===]
*/`,
          },
          pitfall: 'Because `make_shared` combines the control block and object in one allocation, if a `weak_ptr` outlives all `shared_ptr`s, the memory for the object cannot be released back to the OS until all `weak_ptr`s are also destroyed.',
          quickCheck: {
            question: 'How many heap allocations are performed by `std::make_shared<T>()`?',
            options: ['1', '2', '0', '3'],
            correctIndex: 0,
            explanation: 'make_shared allocates both the control block and the object in a single unified heap allocation.',
          },
        },
        {
          id: 'cpp-w2-d10-t5',
          topicNumber: 5,
          title: 'Cyclic References & Memory Leaks with `shared_ptr`',
          explanation: [
            'If Object A holds a `std::shared_ptr<B>` to Object B, and Object B holds a `std::shared_ptr<A>` to Object A, a "Cyclic Reference" (reference cycle) is formed.',
            'Even when all external pointers go out of scope, both objects have `use_count() == 1` because they hold each other.',
            'Neither destructor is EVER called, causing an irrecoverable memory leak in production.'
          ],
          keyRules: [
            'Cyclic shared_ptr relationships cause permanent memory leaks.',
            'Break cycles by converting one direction of the relationship into a std::weak_ptr.'
          ],
          codeSnippet: {
            id: 'cpp-snip-10-5',
            title: 'Cyclic Reference Memory Leak Pattern',
            description: 'Demonstrating how circular shared_ptr causes destructors to never run',
            language: 'cpp',
            code: `#include <iostream>
#include <memory>

struct NodeB; // Forward declaration

struct NodeA {
    std::shared_ptr<NodeB> partner;
    ~NodeA() { std::cout << "NodeA destroyed\\n"; }
};

struct NodeB {
    std::shared_ptr<NodeA> partner; // CYCLIC LEAK!
    ~NodeB() { std::cout << "NodeB destroyed\\n"; }
};

void createCycle() {
    auto a = std::make_shared<NodeA>();
    auto b = std::make_shared<NodeB>();
    a->partner = b;
    b->partner = a; // Cycle formed! use_count() = 2 for both!
} // Destructors NEVER run! Both leaked!

int main() {
    createCycle();
    std::cout << "createCycle() ended. Notice no destructors printed!\\n";
    return 0;
}`,
          },
          pitfall: 'Using `shared_ptr` for parent-child tree relationships (child points to parent via shared_ptr) creates circular reference leaks.',
          quickCheck: {
            question: 'What occurs when two objects hold `std::shared_ptr` references to each other?',
            options: [
              'A circular reference leak occurs where neither object is ever destructed',
              'The compiler detects it and throws an error',
              'The garbage collector frees them',
              'The program crashes with stack overflow'
            ],
            correctIndex: 0,
            explanation: 'Both objects maintain a non-zero reference count on each other, preventing destruction.',
          },
        },
        {
          id: 'cpp-w2-d10-t6',
          topicNumber: 6,
          title: '`std::weak_ptr<T>`: Non-Owning Observer & Cycle Breaker',
          explanation: [
            '`std::weak_ptr<T>` is a non-owning smart pointer that observes an object managed by `std::shared_ptr`.',
            'It does NOT increment the strong reference count, completely breaking cyclic memory leaks.',
            'To access the object, you must call `wp.lock()`, which returns a temporary `std::shared_ptr`. If the object was already destroyed, `lock()` safely returns `nullptr`.'
          ],
          keyRules: [
            'Use weak_ptr for child-to-parent pointers, caches, and observer patterns.',
            'Always check if (auto sp = wp.lock()) before dereferencing.'
          ],
          codeSnippet: {
            id: 'cpp-snip-10-6',
            title: 'Breaking Cycles with std::weak_ptr',
            description: 'Safe non-owning observer with lock() promotion',
            language: 'cpp',
            code: `#include <iostream>
#include <memory>

struct NodeB;

struct NodeA {
    std::shared_ptr<NodeB> partner;
    ~NodeA() { std::cout << "NodeA destroyed cleanly\\n"; }
};

struct NodeB {
    std::weak_ptr<NodeA> partner; // Weak pointer breaks the cycle!
    ~NodeB() { std::cout << "NodeB destroyed cleanly\\n"; }
};

void safeCycleBreak() {
    auto a = std::make_shared<NodeA>();
    auto b = std::make_shared<NodeB>();
    a->partner = b;
    b->partner = a; // Weak binding
} // Both nodes destroyed cleanly!

int main() {
    safeCycleBreak();
    return 0;
}`,
          },
          pitfall: 'Dereferencing a `weak_ptr` directly is impossible (`*wp` is illegal); you must call `wp.lock()` to obtain a temporary `shared_ptr`.',
          quickCheck: {
            question: 'How do you access the object pointed to by a `std::weak_ptr`?',
            options: [
              'Call `wp.lock()` to obtain a temporary `std::shared_ptr`',
              'Use `*wp` directly',
              'Cast it to a raw pointer',
              'Call `wp.get()`'
            ],
            correctIndex: 0,
            explanation: 'Calling `lock()` safely verifies if the object is still alive and returns a shared_ptr.',
          },
        },
        {
          id: 'cpp-w2-d10-t7',
          topicNumber: 7,
          title: 'Custom Deleters in Smart Pointers',
          explanation: [
            'By default, smart pointers invoke `delete` when freeing their managed target.',
            'You can supply a Custom Deleter (a lambda, functor, or function pointer) to manage non-memory resources like C file handles (`std::fclose`), database connections, or GPU handles.',
            '`std::unique_ptr<T, Deleter>` encodes the deleter type in its template signature; `std::shared_ptr<T>` uses type erasure so the deleter type is not part of the pointer type.'
          ],
          keyRules: [
            'unique_ptr deleter type is in template: std::unique_ptr<FILE, decltype(&fclose)>.',
            'shared_ptr deleter is passed as a constructor argument without affecting its type.'
          ],
          codeSnippet: {
            id: 'cpp-snip-10-7',
            title: 'Custom Deleter for C File Handles',
            description: 'Wrapping legacy C resources inside std::unique_ptr',
            language: 'cpp',
            code: `#include <iostream>
#include <memory>
#include <cstdio>

// Custom deleter lambda
auto fileCloser = [](std::FILE* fp) {
    if (fp) {
        std::fclose(fp);
        std::cout << "File closed via custom deleter\\n";
    }
};

using FilePtr = std::unique_ptr<std::FILE, decltype(fileCloser)>;

int main() {
    {
        FilePtr f(std::fopen("test.txt", "w"), fileCloser);
        if (f) {
            std::fputs("Testing custom deleter\\n", f.get());
        }
    } // File closed automatically!
    return 0;
}`,
          },
          pitfall: 'Supplying a stateful functor as a deleter to `unique_ptr` increases the size of the pointer struct.',
          quickCheck: {
            question: 'Can `std::unique_ptr` and `std::shared_ptr` manage non-memory resources like file handles?',
            options: [
              'Yes, by supplying a custom deleter function or lambda',
              'No, they only support C++ objects allocated with new',
              'Only shared_ptr can do this',
              'Only on Linux'
            ],
            correctIndex: 0,
            explanation: 'Custom deleters allow smart pointers to manage any resource with cleanup APIs (like fclose, close, sqlite3_close).',
          },
        },
        {
          id: 'cpp-w2-d10-t8',
          topicNumber: 8,
          title: 'Day 10 Capstone: LRU Cache Element Graph with Smart Pointers',
          explanation: [
            'Synthesizing Day 10 smart pointers into a robust graph structure.',
            'Demonstrating `std::unique_ptr` for node ownership, `std::weak_ptr` for observer references, and zero memory leaks under AddressSanitizer.',
            'The foundational design pattern for game scenegraphs and caching systems.'
          ],
          keyRules: [
            'Use unique_ptr for parent -> child hierarchy.',
            'Use weak_ptr for child -> parent back-pointers.'
          ],
          codeSnippet: {
            id: 'cpp-snip-10-8',
            title: 'SceneGraph Node Hierarchy Pattern',
            description: 'Parent-child hierarchy using unique_ptr and weak_ptr',
            language: 'cpp',
            code: `#include <iostream>
#include <memory>
#include <vector>
#include <string>

class SceneNode {
public:
    std::string name;
    std::vector<std::shared_ptr<SceneNode>> children;
    std::weak_ptr<SceneNode> parent; // Weak pointer prevents cycle with children!

    explicit SceneNode(std::string n) : name(n) {
        std::cout << "Created Node [" << name << "]\\n";
    }
    ~SceneNode() {
        std::cout << "Destroyed Node [" << name << "]\\n";
    }

    void addChild(std::shared_ptr<SceneNode> child) {
        children.push_back(child);
    }
};

int main() {
    {
        auto root = std::make_shared<SceneNode>("Root");
        auto child = std::make_shared<SceneNode>("Camera");
        child->parent = root;
        root->addChild(child);
    } // Both nodes destroyed cleanly!
    return 0;
}`,
          },
          pitfall: 'Storing a `shared_ptr` back to parent inside `child->parent` creates a cycle that permanently leaks the entire scene tree.',
          quickCheck: {
            question: 'In a tree or scenegraph, what smart pointer type should child nodes use to point to their parent?',
            options: [
              'std::weak_ptr to avoid circular reference memory leaks',
              'std::shared_ptr',
              'std::unique_ptr',
              'void*'
            ],
            correctIndex: 0,
            explanation: 'Using `std::weak_ptr` for parent back-pointers breaks the cycle, allowing the tree to be cleaned up naturally.',
          },
        },
      ],
      practiceChallenge: {
        title: 'Day 10 Capstone: Factory Function Returning std::unique_ptr',
        instructions: [
          'Create a struct `Task` with fields `int id` and `std::string title`.',
          'Implement a factory function `std::unique_ptr<Task> createTask(int id, const std::string& title)`.',
          'Call `createTask` and store the result in a `std::vector<std::unique_ptr<Task>>`.',
        ],
        starterCode: `#include <iostream>
#include <memory>
#include <vector>
#include <string>

// Implement Task struct and createTask factory

int main() {
    // Populate vector with tasks
    return 0;
}`,
        solutionCode: `#include <iostream>
#include <memory>
#include <vector>
#include <string>

struct Task {
    int id;
    std::string title;
    Task(int i, const std::string& t) : id(i), title(t) {}
};

std::unique_ptr<Task> createTask(int id, const std::string& title) {
    return std::make_unique<Task>(id, title);
}

int main() {
    std::vector<std::unique_ptr<Task>> taskList;
    taskList.push_back(createTask(1, "Compile Kernel Module"));
    taskList.push_back(createTask(2, "Run Regression Suite"));

    for (const auto& task : taskList) {
        std::cout << "Task #" << task->id << ": " << task->title << "\\n";
    }
    return 0;
}`,
        hints: [
          'Use `std::make_unique<Task>(id, title)` inside the factory function.',
          'Iterate over the vector using `const auto& task` because `unique_ptr` cannot be copied.',
        ],
      },
      keyTakeaways: [
        '`std::unique_ptr` is the zero-overhead default choice for exclusive heap ownership.',
        'Always use `std::make_unique` (C++14) and `std::make_shared` (C++11).',
        'Use `std::weak_ptr` to observe `std::shared_ptr` without forming circular reference leaks.',
        'Smart pointers support custom deleters for managing non-memory resources (like C file handles).',
      ],
    },

    // Day 11: Operator Overloading: Arithmetic, Streams, Subscripts & Comparison (Three-Way <=>)
    {
      id: 'cpp-w1-d11',
      dayNumber: 11,
      weekNumber: 2,
      title: 'Operator Overloading & C++20 Spaceship Operator (`<=>`)',
      subtitle: 'Arithmetic, stream << / >>, subscript [], and the C++20 Three-Way Comparison Spaceship operator',
      durationMinutes: 65,
      overview:
        'Make custom classes behave like native primitives. Master arithmetic operators (+, -, *), stream insertion/extraction (<<, >>), subscript ([]), function call (()), and the modern C++20 Three-Way Comparison ("spaceship") operator (<=>).',
      topics: [
        {
          id: 'cpp-w2-d11-t1',
          topicNumber: 1,
          title: 'Operator Overloading Foundations & Syntax',
          explanation: [
            'Operator overloading allows custom types to use built-in C++ operators (`+`, `-`, `*`, `==`, `[]`, etc.).',
            'Operators can be overloaded as member functions (left-hand operand is `*this`) or non-member friend functions (both operands passed as parameters).',
            'Rule of Symmetry: Binary operators that should treat both operands equally (e.g. `a + b` allowing `complex + 5` and `5 + complex`) should be implemented as non-member functions.'
          ],
          keyRules: [
            'You cannot create new operator symbols; only existing C++ operators can be overloaded.',
            'You cannot change operator precedence or arity (binary remains binary).',
            'Never overload &&, ||, or comma operators because overloading breaks short-circuit evaluation.'
          ],
          codeSnippet: {
            id: 'cpp-snip-11-1',
            title: 'Vector2D Arithmetic Operator Overloading',
            description: 'Overloading operator+ for mathematical vector addition',
            language: 'cpp',
            code: `#include <iostream>

struct Vector2D {
    float x{0.0f}, y{0.0f};

    Vector2D(float x_, float y_) : x(x_), y(y_) {}

    // Overloaded binary operator+
    Vector2D operator+(const Vector2D& other) const {
        return Vector2D(x + other.x, y + other.y);
    }
};

int main() {
    Vector2D v1(2.0f, 3.0f);
    Vector2D v2(4.0f, 5.0f);
    Vector2D v3 = v1 + v2; // Calls v1.operator+(v2)
    std::cout << "v3: (" << v3.x << ", " << v3.y << ")\\n";
    return 0;
}`,
          },
          pitfall: 'Overloading `operator&&` or `operator||` disables compiler short-circuit evaluation, forcing both expressions to evaluate and causing subtle bugs.',
          quickCheck: {
            question: 'Can you invent brand new operator symbols (such as `**` for exponentiation) in C++?',
            options: [
              'No, only existing C++ operators can be overloaded',
              'Yes, using operator keyword',
              'Yes, in C++20',
              'Only inside templates'
            ],
            correctIndex: 0,
            explanation: 'The C++ standard restricts operator overloading strictly to existing predefined operator tokens.',
          },
        },
        {
          id: 'cpp-w2-d11-t2',
          topicNumber: 2,
          title: 'Stream Insertion (`<<`) & Extraction (`>>`) Operators',
          explanation: [
            'To allow printing an object with `std::cout << myObj;`, you must overload `operator<<`.',
            'Because the left-hand operand is `std::ostream&`, this operator MUST be a non-member function.',
            'Signature: `std::ostream& operator<<(std::ostream& os, const MyClass& obj);` returning `os` by reference to enable chaining (`std::cout << a << b;`).'
          ],
          keyRules: [
            'Must be a non-member function; declare as friend if private access is required.',
            'Always return ostream& by reference to support stream chaining.'
          ],
          codeSnippet: {
            id: 'cpp-snip-11-2',
            title: 'Stream Insertion operator<< Pattern',
            description: 'Enabling direct std::cout printing for custom types',
            language: 'cpp',
            code: `#include <iostream>
#include <string>

class MatrixEntry {
private:
    int row, col;
    double val;
public:
    MatrixEntry(int r, int c, double v) : row(r), col(c), val(v) {}

    // Friend stream insertion operator
    friend std::ostream& operator<<(std::ostream& os, const MatrixEntry& m) {
        os << "[" << m.row << "," << m.col << "] = " << m.val;
        return os; // Return stream for chaining
    }
};

int main() {
    MatrixEntry entry(0, 2, 9.81);
    std::cout << "Matrix: " << entry << "\\n";
    return 0;
}`,
          },
          pitfall: 'Returning `void` or `std::ostream` by value from `operator<<` breaks stream chaining like `std::cout << a << b;`.',
          quickCheck: {
            question: 'Why must `operator<<` for printing be implemented as a non-member function?',
            options: [
              'Because the left-hand operand is `std::ostream&`, not the custom class instance',
              'Because C++ forbids member operators',
              'Because std::cout is a macro',
              'To allow inlining'
            ],
            correctIndex: 0,
            explanation: 'The left-hand side of `std::cout << obj` is `std::cout` (an ostream), so it cannot be a member of `obj`.',
          },
        },
        {
          id: 'cpp-w2-d11-t3',
          topicNumber: 3,
          title: 'Subscript Operator (`[]`): Read & Write Access',
          explanation: [
            'The subscript operator `operator[]` provides array-like bracket indexing for custom collections and matrices.',
            'Idiomatic design requires TWO overloads:',
            '(1) Non-const overload returning `T&` (allows assignment: `buf[0] = 42;`);',
            '(2) Const overload returning `const T&` (allows inspection on const objects: `int x = constBuf[0];`).'
          ],
          keyRules: [
            'Always provide both const and non-const overloads of operator[].',
            'operator[] MUST be implemented as a class member function.'
          ],
          codeSnippet: {
            id: 'cpp-snip-11-3',
            title: 'Dual Subscript Overloads Pattern',
            description: 'Supporting mutable and read-only bracket indexing',
            language: 'cpp',
            code: `#include <iostream>

class IntBuffer {
private:
    int data[4]{10, 20, 30, 40};
public:
    // 1. Non-const: returns reference for mutation
    int& operator[](size_t index) { return data[index]; }

    // 2. Const: returns const reference for read-only access
    const int& operator[](size_t index) const { return data[index]; }
};

int main() {
    IntBuffer buf;
    buf[1] = 99; // Calls non-const operator[]
    std::cout << "Updated item: " << buf[1] << "\\n";
    return 0;
}`,
          },
          pitfall: 'Providing only a non-const `operator[]` prevents indexing any `const MyContainer&` object.',
          quickCheck: {
            question: 'Why should a container provide both `T& operator[](size_t)` and `const T& operator[](size_t) const`?',
            options: [
              'To allow mutation on non-const instances and read-only access on const instances',
              'Because the compiler chooses randomly',
              'To support 64-bit indices',
              'To enable multithreading'
            ],
            correctIndex: 0,
            explanation: 'The non-const version allows write access, while the const overload allows reading from const container references.',
          },
        },
        {
          id: 'cpp-w2-d11-t4',
          topicNumber: 4,
          title: 'Function Call Operator (`operator()`) & Functors',
          explanation: [
            'A class that overloads the function call operator `operator()` is called a "Functor" (function object).',
            'Unlike raw functions, functors can maintain internal state across multiple invocations.',
            'Extensively used as predicates in STL algorithms (`std::sort`, `std::find_if`) and is the underlying mechanism that compilers use to implement lambdas.'
          ],
          keyRules: [
            'operator() can take any number of arguments and return any type.',
            'Functor state persists between invocations.'
          ],
          codeSnippet: {
            id: 'cpp-snip-11-4',
            title: 'Stateful Functor Class',
            description: 'Function call operator operator() maintaining running state',
            language: 'cpp',
            code: `#include <iostream>

class Accumulator {
private:
    int total{0};
public:
    // Overloaded operator()
    int operator()(int delta) {
        total += delta;
        return total;
    }

    int getTotal() const { return total; }
};

int main() {
    Accumulator acc;
    acc(10); // Behaves like a function!
    acc(25);
    std::cout << "Accumulator total: " << acc.getTotal() << "\\n"; // 35
    return 0;
}`,
          },
          pitfall: 'Assuming functors are slower than function pointers; functors are actually faster because compiler inlines their `operator()` directly.',
          quickCheck: {
            question: 'What is a "functor" in C++?',
            options: [
              'A class or struct that overloads `operator()` so its instances can be called like functions',
              'A mathematical function that cannot fail',
              'A template with no arguments',
              'A pointer to main()'
            ],
            correctIndex: 0,
            explanation: 'A functor is an object with an overloaded `operator()`, allowing it to be invoked with function call syntax.',
          },
        },
        {
          id: 'cpp-w2-d11-t5',
          topicNumber: 5,
          title: 'The C++20 Three-Way Comparison "Spaceship" Operator (`<=>`)',
          explanation: [
            'Historically, implementing full comparison required writing 6 separate boilerplate operators: `==`, `!=`, `<`, `<=`, `>`, `>=`.',
            'C++20 introduced the Three-Way Comparison Operator `<=>` (the "spaceship" operator).',
            'Writing `auto operator<=>(const MyClass&) const = default;` generates ALL SIX relational comparison operators automatically using member-by-member lexicographical comparison!'
          ],
          keyRules: [
            'auto operator<=>(const MyClass&) const = default; generates <, <=, >, >= automatically.',
            'It returns std::strong_ordering (less, equal, greater) for integers/pointers.',
            'You also default operator==: bool operator==(const MyClass&) const = default;.'
          ],
          codeSnippet: {
            id: 'cpp-snip-11-5',
            title: 'C++20 Spaceship Operator <=> Generation',
            description: 'Single-line generation of all 6 relational comparison operators',
            language: 'cpp',
            code: `#include <iostream>
#include <compare>

struct Version {
    int major;
    int minor;
    int patch;

    // C++20 Spaceship operator generates ==, !=, <, <=, >, >=!
    auto operator<=>(const Version&) const = default;
};

int main() {
    Version v1{2, 1, 0};
    Version v2{2, 4, 1};

    std::cout << "v1 < v2:  " << (v1 < v2  ? "true" : "false") << "\\n";
    std::cout << "v1 == v2: " << (v1 == v2 ? "true" : "false") << "\\n";
    std::cout << "v1 >= v2: " << (v1 >= v2 ? "true" : "false") << "\\n";
    return 0;
}`,
          },
          pitfall: 'Comparing floating-point values returns `std::partial_ordering` because `NaN` is unordered (NaN is neither less, equal, nor greater than any number).',
          quickCheck: {
            question: 'What does `auto operator<=>(const MyClass&) const = default;` provide in C++20?',
            options: [
              'Generates all relational comparison operators (<, <=, >, >=) automatically',
              'Converts the class to JSON',
              'Allocates memory in space',
              'Enables multithreading'
            ],
            correctIndex: 0,
            explanation: 'The spaceship operator `<=>` automatically generates relational comparisons based on member-wise lexicographical order.',
          },
        },
        {
          id: 'cpp-w2-d11-t6',
          topicNumber: 6,
          title: 'Comparison Ordering Categories: `strong_ordering` vs `partial_ordering`',
          explanation: [
            'C++20 categorizes comparisons into three distinct ordering categories:',
            '`std::strong_ordering`: Absolute equivalence (if `a == b`, then `f(a) == f(b)`). Used for integers, strings.',
            '`std::weak_ordering`: Equivalence without identical substitution (e.g. case-insensitive string comparison where `"abc"` and `"ABC"` are equivalent).',
            '`std::partial_ordering`: Some values cannot be compared (e.g. `NaN` in floating-point numbers `float`/`double`).'
          ],
          keyRules: [
            'Integers produce strong_ordering.',
            'Floating-point types (float, double) produce partial_ordering due to NaN.',
            'Custom spaceship operators return the strongest ordering supported by all members.'
          ],
          codeSnippet: {
            id: 'cpp-snip-11-6',
            title: 'Inspecting C++20 Comparison Ordering Results',
            description: 'Differentiating strong ordering from partial ordering with NaN',
            language: 'cpp',
            code: `#include <iostream>
#include <compare>

int main() {
    int a = 10, b = 20;
    std::strong_ordering result = (a <=> b);

    if (result == std::strong_ordering::less) {
        std::cout << "a is strictly less than b\\n";
    } else if (result == std::strong_ordering::equal) {
        std::cout << "a is equivalent to b\\n";
    }
    return 0;
}`,
          },
          pitfall: 'Assuming `double` comparison returns `std::strong_ordering`; it returns `std::partial_ordering` because of `std::numeric_limits<double>::quiet_NaN()`.',
          quickCheck: {
            question: 'Why do floating point types (`double`) return `std::partial_ordering` with `<=>`?',
            options: [
              'Because NaN (Not a Number) cannot be compared to any number',
              'Because doubles have variable precision',
              'Because of rounding errors',
              'Because floating point operations are non-deterministic'
            ],
            correctIndex: 0,
            explanation: 'NaN cannot be less, greater, or equal to any value, requiring partial ordering.',
          },
        },
        {
          id: 'cpp-w2-d11-t7',
          topicNumber: 7,
          title: 'Compound Assignment (`+=`) vs Binary Operator (`+`) Pattern',
          explanation: [
            'Best practice in C++ operator design: Implement compound assignment `operator+=` as a member function first, and implement binary `operator+` in terms of it.',
            '`MyClass& operator+=(const MyClass& rhs)` modifies `*this` in-place and returns `*this` by reference.',
            'Then `MyClass operator+(MyClass lhs, const MyClass& rhs)` takes `lhs` by value, invokes `lhs += rhs;`, and returns `lhs` (leveraging RVO).'
          ],
          keyRules: [
            'operator+= is a member returning T&.',
            'operator+ is a non-member returning T by value, implemented via +=.',
            'Guarantees consistency and eliminates duplicated arithmetic logic.'
          ],
          codeSnippet: {
            id: 'cpp-snip-11-7',
            title: 'Canonical += and + Operator Pattern',
            description: 'Reusing compound assignment for clean binary addition',
            language: 'cpp',
            code: `#include <iostream>

class Counter {
public:
    int value{0};

    // 1. Member compound operator+=
    Counter& operator+=(const Counter& rhs) {
        this->value += rhs.value;
        return *this;
    }
};

// 2. Non-member binary operator+ implemented via +=
inline Counter operator+(Counter lhs, const Counter& rhs) {
    lhs += rhs; // Leverages lhs copy
    return lhs;
}

int main() {
    Counter c1{10}, c2{25};
    Counter c3 = c1 + c2;
    std::cout << "c3 value: " << c3.value << "\\n"; // 35
    return 0;
}`,
          },
          pitfall: 'Implementing `+` and `+=` independently can cause divergence where `a + b` gives a different result than `a += b`.',
          quickCheck: {
            question: 'What is the canonical best practice for implementing binary `operator+` in C++?',
            options: [
              'Implement member `operator+=` first, then implement non-member `operator+` by reusing `+=`',
              'Implement `operator+` first and call `+` inside `+=`',
              'Never overload `operator+`',
              'Always declare both as friend functions'
            ],
            correctIndex: 0,
            explanation: 'Implementing `+` in terms of `+=` prevents code duplication and ensures semantic consistency.',
          },
        },
        {
          id: 'cpp-w2-d11-t8',
          topicNumber: 8,
          title: 'Day 11 Capstone: High-Precision FixedPoint Numeric Type',
          explanation: [
            'Synthesizing Day 11 concepts into a complete FixedPoint decimal numeric class.',
            'Demonstrating arithmetic operators (`+`, `-`, `*`), stream insertion (`<<`), spaceship comparison (`<=>`), and compound assignments.',
            'Used heavily in financial trading and physics engines to avoid floating-point binary rounding errors.'
          ],
          keyRules: [
            'Store scaled integer internally.',
            'Provide full suite of mathematical and relational operators.'
          ],
          codeSnippet: {
            id: 'cpp-snip-11-8',
            title: 'Production FixedPoint Class Blueprint',
            description: 'Custom numeric type with complete operator overloading',
            language: 'cpp',
            code: `#include <iostream>
#include <cstdint>
#include <compare>

class FixedPoint {
private:
    int64_t rawValue{0}; // Scaled by 1000 (3 decimal places)
    static constexpr int64_t SCALE = 1000;

public:
    FixedPoint() = default;
    FixedPoint(double val) : rawValue(static_cast<int64_t>(val * SCALE)) {}

    FixedPoint& operator+=(const FixedPoint& rhs) {
        rawValue += rhs.rawValue;
        return *this;
    }

    auto operator<=>(const FixedPoint&) const = default;

    friend std::ostream& operator<<(std::ostream& os, const FixedPoint& fp) {
        os << (fp.rawValue / 1000) << "." << (std::abs(fp.rawValue) % 1000);
        return os;
    }
};

inline FixedPoint operator+(FixedPoint lhs, const FixedPoint& rhs) {
    lhs += rhs;
    return lhs;
}

int main() {
    FixedPoint price1(19.99);
    FixedPoint price2(5.50);
    FixedPoint total = price1 + price2;

    std::cout << "Total Price: $" << total << "\\n";
    std::cout << "price1 > price2: " << (price1 > price2 ? "YES" : "NO") << "\\n";
    return 0;
}`,
          },
          pitfall: 'Returning a local object by reference from `operator+` produces a dangling reference crash; always return by value.',
          quickCheck: {
            question: 'What return type should binary `operator+` have?',
            options: [
              'Return by value (T)',
              'Return by reference (T&)',
              'void',
              'const T*'
            ],
            correctIndex: 0,
            explanation: 'Binary `operator+` creates a new result object, which must be returned by value (leveraging RVO).',
          },
        },
      ],
      practiceChallenge: {
        title: 'Day 11 Capstone: Complex Number Type with Operator Overloads',
        instructions: [
          'Create a class `ComplexNumber` with `double real` and `double imag`.',
          'Overload `operator+` and `operator*` for complex number arithmetic.',
          'Overload `operator<<` to print in `(real + imag i)` format.',
          'Overload `operator==` for equality comparison.',
        ],
        starterCode: `#include <iostream>

class ComplexNumber {
    // Implement ComplexNumber with operator overloads
};

int main() {
    // Test complex addition and multiplication
    return 0;
}`,
        solutionCode: `#include <iostream>

class ComplexNumber {
public:
    double real{0.0};
    double imag{0.0};

    ComplexNumber(double r, double i) : real(r), imag(i) {}

    ComplexNumber operator+(const ComplexNumber& o) const {
        return ComplexNumber(real + o.real, imag + o.imag);
    }

    ComplexNumber operator*(const ComplexNumber& o) const {
        return ComplexNumber(real * o.real - imag * o.imag, real * o.imag + imag * o.real);
    }

    bool operator==(const ComplexNumber& o) const {
        return real == o.real && imag == o.imag;
    }

    friend std::ostream& operator<<(std::ostream& os, const ComplexNumber& c) {
        os << "(" << c.real << " + " << c.imag << "i)";
        return os;
    }
};

int main() {
    ComplexNumber c1(3.0, 2.0);
    ComplexNumber c2(1.0, 7.0);
    ComplexNumber sum = c1 + c2;
    ComplexNumber prod = c1 * c2;

    std::cout << "c1:   " << c1 << "\\n";
    std::cout << "c2:   " << c2 << "\\n";
    std::cout << "Sum:  " << sum << "\\n";
    std::cout << "Prod: " << prod << "\\n";
    return 0;
}`,
        hints: [
          'Complex multiplication formula: (a+bi)(c+di) = (ac - bd) + (ad + bc)i.',
          'Return ostream& from operator<<.',
        ],
      },
      keyTakeaways: [
        'Operators make custom types intuitive and mathematically expressive.',
        '`operator<<` must be a non-member function returning `std::ostream&`.',
        'Provide both const and non-const overloads for `operator[]`.',
        'C++20 spaceship operator `<=>` generates all 6 comparison operators with a single line.',
      ],
    },

    // Day 12: Inheritance, Virtual Functions, VTable & Dynamic Polymorphism
    {
      id: 'cpp-w2-d12',
      dayNumber: 12,
      weekNumber: 2,
      title: 'Inheritance, Virtual Functions & VTable Internals',
      subtitle: 'Dynamic polymorphism, virtual destructors, vptr & vtable layout, override & final keywords',
      durationMinutes: 70,
      overview:
        'Understand how runtime polymorphism is implemented under the hood in C++. Learn how the compiler constructs Virtual Method Tables (vtables) and embeds virtual table pointers (vptr) in class memory, why virtual destructors are mandatory, and how to use the override and final keywords.',
      topics: [
        {
          id: 'cpp-w2-d12-t1',
          topicNumber: 1,
          title: 'Inheritance & Access Specifiers (`public`, `protected`, `private`)',
          explanation: [
            'C++ supports three modes of inheritance: `public`, `protected`, and `private`.',
            '`public` inheritance represents an "is-a" relationship (Subclass is a BaseClass) and is the cornerstone of object-oriented polymorphism.',
            '`protected` members are accessible inside derived classes, but inaccessible to outside callers.',
            '`private` inheritance represents "implemented-in-terms-of" and hides base class methods from the outside interface.'
          ],
          keyRules: [
            'Use public inheritance for polymorphic subtyping.',
            'Prefer composition ("has-a") over private inheritance whenever possible.'
          ],
          codeSnippet: {
            id: 'cpp-snip-12-1',
            title: 'Public Inheritance and Protected Members',
            description: 'Base and derived class access relationships',
            language: 'cpp',
            code: `#include <iostream>
#include <string>

class Entity {
protected:
    int id;
public:
    explicit Entity(int i) : id(i) {}
    int getId() const { return id; }
};

class Player : public Entity {
private:
    std::string name;
public:
    Player(int i, std::string n) : Entity(i), name(n) {}
    void print() const {
        std::cout << "Player [" << name << "] with ID: " << id << "\\n"; // id accessible because protected
    }
};

int main() {
    Player p(1, "Alice");
    p.print();
    return 0;
}`,
          },
          pitfall: 'Omitting the `public` keyword in class inheritance (`class Dog : Animal`) defaults to `private` inheritance, making base methods inaccessible.',
          quickCheck: {
            question: 'What is the default inheritance access specifier for a `class` if omitted (`class B : A`)?',
            options: ['private', 'public', 'protected', 'virtual'],
            correctIndex: 0,
            explanation: 'For `class`, default inheritance is private. For `struct`, default inheritance is public.',
          },
        },
        {
          id: 'cpp-w2-d12-t2',
          topicNumber: 2,
          title: 'Virtual Functions & Runtime Dynamic Dispatch',
          explanation: [
            'By default, function calls in C++ use Static Binding: the compiler resolves which function to call based on the compile-time pointer type.',
            'Prefixing a member function with `virtual` enables Dynamic Dispatch: the function call is resolved at RUNTIME based on the actual concrete type of the object.',
            'Allows treating derived instances uniformly through base class pointers (`Base* ptr = new Derived(); ptr->render();`).'
          ],
          keyRules: [
            'virtual functions enable runtime polymorphic method invocation.',
            'Dynamic dispatch only occurs when invoking methods through pointers (Base*) or references (Base&).'
          ],
          codeSnippet: {
            id: 'cpp-snip-12-2',
            title: 'Static Binding vs Virtual Dynamic Dispatch',
            description: 'Observing runtime polymorphic dispatch through base pointer',
            language: 'cpp',
            code: `#include <iostream>

class Shape {
public:
    virtual void draw() const { std::cout << "Drawing generic shape\\n"; }
};

class Circle : public Shape {
public:
    void draw() const override { std::cout << "Drawing Circle (radius)\\n"; }
};

int main() {
    Circle c;
    Shape* shapePtr = &c;
    shapePtr->draw(); // Dynamically dispatches to Circle::draw()!
    return 0;
}`,
          },
          pitfall: 'Calling a virtual function by value (`Shape s = Circle(); s.draw();`) causes "Object Slicing", stripping derived data and calling `Shape::draw()`.',
          quickCheck: {
            question: 'What keyword enables dynamic runtime dispatch for a member function in C++?',
            options: ['virtual', 'dynamic', 'override', 'polymorphic'],
            correctIndex: 0,
            explanation: 'The `virtual` keyword instructs the compiler to use dynamic dispatch via the virtual method table.',
          },
        },
        {
          id: 'cpp-w2-d12-t3',
          topicNumber: 3,
          title: 'The Mandatory Virtual Destructor Rule',
          explanation: [
            'CRITICAL RULE: Any class designed to be a polymorphic base class MUST declare its destructor `virtual`: `virtual ~Base() = default;`.',
            'If a derived object is deleted through a base class pointer (`Base* ptr = new Derived(); delete ptr;`) and the base destructor is NOT virtual, ONLY the base destructor runs.',
            'The derived class destructor is completely skipped, causing memory leaks and resource corruption.'
          ],
          keyRules: [
            'Rule: If a class has at least one virtual function, its destructor MUST be virtual.',
            'virtual ~Base() = default; ensures complete bottom-to-top destruction.'
          ],
          codeSnippet: {
            id: 'cpp-snip-12-3',
            title: 'Virtual Destructor Defense',
            description: 'Ensuring derived destructors run during polymorphic deletion',
            language: 'cpp',
            code: `#include <iostream>

class Base {
public:
    virtual ~Base() { std::cout << "Base destructor\\n"; }
};

class Derived : public Base {
private:
    int* buffer;
public:
    Derived() : buffer(new int[100]) {}
    ~Derived() override {
        delete[] buffer;
        std::cout << "Derived destructor (buffer freed)\\n";
    }
};

int main() {
    Base* obj = new Derived();
    delete obj; // Derived destructor runs first, then Base destructor!
    return 0;
}`,
          },
          pitfall: 'Deleting a derived instance through a non-virtual base pointer causes Undefined Behavior and skips derived class cleanup.',
          quickCheck: {
            question: 'Why MUST a base class with virtual functions declare a `virtual` destructor?',
            options: [
              'To ensure derived class destructors are called when deleting through a base pointer',
              'To make the class abstract',
              'To allow heap allocations',
              'Because the C++ compiler requires all destructors to be virtual'
            ],
            correctIndex: 0,
            explanation: 'A virtual destructor ensures that deleting an object via a base pointer executes derived destructors first.',
          },
        },
        {
          id: 'cpp-w2-d12-t4',
          topicNumber: 4,
          title: 'VTable and VPtr Memory Layout Internals',
          explanation: [
            'How does the machine actually implement virtual functions?',
            'For every class with virtual functions, the compiler creates a static table of function pointers called the VTable (Virtual Method Table).',
            'Inside every object instance of that class, the compiler invisibly injects an 8-byte pointer called the `vptr` (Virtual Pointer) pointing to that class\'s VTable.',
            'Calling `ptr->draw()` compiles to: `ptr->vptr[INDEX_OF_DRAW](ptr)`.'
          ],
          keyRules: [
            'A class with virtual functions increases in size by sizeof(void*) = 8 bytes due to vptr.',
            'Virtual function invocation costs one pointer indirection (vptr lookup), which is negligible (~1-2 nanoseconds).'
          ],
          codeSnippet: {
            id: 'cpp-snip-12-4',
            title: 'VTable and vptr Size Verification',
            description: 'Observing the 8-byte vptr injection inside an object',
            language: 'cpp',
            code: `#include <iostream>

struct PlainStruct {
    int x; // 4 bytes (padded to 4)
};

struct PolymorphicStruct {
    int x; // 4 bytes
    virtual void func() {} // Adds 8-byte vptr!
};

int main() {
    std::cout << "sizeof(PlainStruct):       " << sizeof(PlainStruct) << " bytes\\n";       // 4
    std::cout << "sizeof(PolymorphicStruct): " << sizeof(PolymorphicStruct) << " bytes\\n"; // 16 (8 vptr + 4 int + 4 pad)
    return 0;
}`,
          },
          pitfall: 'Adding virtual functions to lightweight mathematical structs (like `Vector3`) inflates their size from 12 bytes to 24 bytes and breaks flat memory cache performance.',
          quickCheck: {
            question: 'What hidden member is injected into an object instance when its class defines virtual functions?',
            options: [
              'A vptr (virtual pointer) pointing to the class vtable',
              'A copy of the entire vtable',
              'A mutex',
              'A reference counter'
            ],
            correctIndex: 0,
            explanation: 'The compiler injects a single 8-byte `vptr` per object pointing to the shared class VTable.',
          },
        },
        {
          id: 'cpp-w2-d12-t5',
          topicNumber: 5,
          title: 'The `override` & `final` Keywords (C++11)',
          explanation: [
            'Prior to C++11, typos in derived class function signatures (e.g. `void draw(int x)` instead of `void draw(long x)`) silently created a brand new function instead of overriding.',
            '`override`: Directs the compiler to verify that a base virtual function with the EXACT same signature exists. If not, compilation fails.',
            '`final`: Forbids a virtual function from being overridden further by derived classes, or forbids an entire class from being inherited (`class Leaf final : public Base`).'
          ],
          keyRules: [
            'Always mark overriding member functions with the override keyword.',
            'Use final to allow compiler "devirtualization" optimizations.'
          ],
          codeSnippet: {
            id: 'cpp-snip-12-5',
            title: 'Using override and final',
            description: 'Compile-time verification of polymorphic overriding',
            language: 'cpp',
            code: `#include <iostream>

class BaseNetwork {
public:
    virtual void connect(int timeout) = 0;
};

class TcpNetwork final : public BaseNetwork {
public:
    // override catches signature typos at compile time
    void connect(int timeout) override {
        std::cout << "Connected TCP with timeout: " << timeout << "\\n";
    }
};

// class CustomTcp : public TcpNetwork {}; // COMPILE ERROR: cannot inherit from final class

int main() {
    TcpNetwork net;
    net.connect(3000);
    return 0;
}`,
          },
          pitfall: 'Omitting `override` allows signature mismatches (like missing `const`) to silently fail to override the base class function.',
          quickCheck: {
            question: 'What is the purpose of the `override` specifier in modern C++?',
            options: [
              'It instructs the compiler to verify that the method overrides an exact base virtual function',
              'It makes the function private',
              'It forces the function to be inline',
              'It allows multiple inheritance'
            ],
            correctIndex: 0,
            explanation: 'The override keyword triggers compile-time checks, ensuring signatures match base class virtual methods.',
          },
        },
        {
          id: 'cpp-w2-d12-t6',
          topicNumber: 6,
          title: 'Pure Virtual Functions & Abstract Interfaces',
          explanation: [
            'A Pure Virtual Function has no implementation in the base class and ends with `= 0`: `virtual void execute() = 0;`.',
            'A class with at least one pure virtual function is an "Abstract Class". It CANNOT be instantiated directly.',
            'Abstract classes define pure interfaces (contracts) in C++, identical to interfaces in Java/TypeScript or traits in Rust.'
          ],
          keyRules: [
            'virtual ReturnType method() = 0; declares a pure virtual function.',
            'Derived classes must implement all pure virtual functions to become concrete instantiable types.'
          ],
          codeSnippet: {
            id: 'cpp-snip-12-6',
            title: 'Pure Abstract Interface Pattern',
            description: 'Defining strict contracts with pure virtual functions',
            language: 'cpp',
            code: `#include <iostream>
#include <memory>

class ILogger {
public:
    virtual ~ILogger() = default; // Mandatory virtual destructor
    virtual void log(const std::string& message) = 0; // Pure virtual
};

class ConsoleLogger : public ILogger {
public:
    void log(const std::string& message) override {
        std::cout << "[LOG]: " << message << "\\n";
    }
};

int main() {
    // ILogger raw; // COMPILE ERROR: cannot allocate an abstract class
    std::unique_ptr<ILogger> logger = std::make_unique<ConsoleLogger>();
    logger->log("Abstract interface executed successfully.");
    return 0;
}`,
          },
          pitfall: 'Forgetting to provide an implementation for even a single pure virtual function makes the derived class abstract, preventing instantiation.',
          quickCheck: {
            question: 'What makes a C++ class an "Abstract Class"?',
            options: [
              'Having at least one pure virtual function (`= 0`)',
              'Having no member variables',
              'Having a private constructor',
              'Using the abstract keyword'
            ],
            correctIndex: 0,
            explanation: 'Any class containing at least one pure virtual function (`= 0`) is an abstract class that cannot be instantiated.',
          },
        },
        {
          id: 'cpp-w2-d12-t7',
          topicNumber: 7,
          title: 'Multiple Inheritance & The Diamond Problem (`virtual` Inheritance)',
          explanation: [
            'C++ allows a class to inherit from multiple base classes (`class Worker : public Employee, public Student`).',
            'The Diamond Problem: If classes B and C inherit from A, and class D inherits from both B and C, class D contains TWO independent copies of class A, causing symbol ambiguity and wasted memory.',
            'Solution: Use Virtual Inheritance (`class B : virtual public A` and `class C : virtual public A`). Class D will now share a single unified instance of A.'
          ],
          keyRules: [
            'Virtual inheritance ensures only one instance of the common base class is included.',
            'Multiple inheritance of pure abstract interfaces does NOT cause the diamond problem.'
          ],
          codeSnippet: {
            id: 'cpp-snip-12-7',
            title: 'Resolving Diamond Problem with virtual Inheritance',
            description: 'Sharing a single base instance in diamond hierarchies',
            language: 'cpp',
            code: `#include <iostream>

struct BaseDevice {
    int deviceId{101};
};

// Virtual inheritance ensures single shared BaseDevice
struct Transmitter : virtual public BaseDevice {};
struct Receiver    : virtual public BaseDevice {};

struct Transceiver : public Transmitter, public Receiver {};

int main() {
    Transceiver dev;
    // Ambiguity-free access! Only 1 deviceId exists!
    std::cout << "Device ID: " << dev.deviceId << "\\n";
    return 0;
}`,
          },
          pitfall: 'Omitting `virtual` in diamond inheritance leads to compiler error: `request for member \'x\' is ambiguous`.',
          quickCheck: {
            question: 'How does C++ solve the Diamond Problem in multiple inheritance?',
            options: [
              'Using `virtual public Base` inheritance to ensure only one instance of the common base exists',
              'By disabling multiple inheritance',
              'Using friend classes',
              'Using templates'
            ],
            correctIndex: 0,
            explanation: 'Virtual inheritance ensures that the most-derived class contains only a single shared copy of the base class.',
          },
        },
        {
          id: 'cpp-w2-d12-t8',
          topicNumber: 8,
          title: 'Day 12 Capstone: Extensible Game Renderer Pipeline',
          explanation: [
            'Synthesizing Day 12 concepts into an industrial extensible game rendering engine.',
            'Demonstrating abstract base interfaces (`IRenderable`), virtual destructors, `override`, `final`, vtable dispatch, and `std::vector<std::unique_ptr<IRenderable>>`.',
            'Forms the foundational architecture of real-world graphics and simulation software.'
          ],
          keyRules: [
            'Polymorphic collections must store pointers (unique_ptr<Base>), never values.',
            'Storing values in `std::vector<Base>` causes object slicing.'
          ],
          codeSnippet: {
            id: 'cpp-snip-12-8',
            title: 'Polymorphic Renderer Pipeline Blueprint',
            description: 'Rendering diverse game entities through base interface pointers',
            language: 'cpp',
            code: `#include <iostream>
#include <memory>
#include <vector>

class IRenderable {
public:
    virtual ~IRenderable() = default;
    virtual void render() const = 0;
};

class Sprite final : public IRenderable {
public:
    void render() const override { std::cout << "Rendering 2D Sprite Texture\\n"; }
};

class Mesh final : public IRenderable {
public:
    void render() const override { std::cout << "Rendering 3D Mesh Geometry\\n"; }
};

int main() {
    std::vector<std::unique_ptr<IRenderable>> scene;
    scene.push_back(std::make_unique<Sprite>());
    scene.push_back(std::make_unique<Mesh>());

    for (const auto& entity : scene) {
        entity->render(); // Polymorphic dispatch via vtable!
    }
    return 0;
}`,
          },
          pitfall: 'Storing concrete derived objects in `std::vector<IRenderable>` by value slices off all derived state.',
          quickCheck: {
            question: 'What occurs if you attempt to store polymorphic derived objects by value in `std::vector<BaseClass>`?',
            options: [
              'Object Slicing: derived member variables and virtual behavior are sliced off',
              'The compiler throws a memory leak error',
              'The vector automatically converts to pointers',
              'It works identically to pointers'
            ],
            correctIndex: 0,
            explanation: 'Object slicing occurs when a derived object is copied into a base value, truncating derived members.',
          },
        },
      ],
      practiceChallenge: {
        title: 'Day 12 Capstone: Polymorphic Audio Synthesizer Pipeline',
        instructions: [
          'Create an abstract class `AudioOscillator` with a pure virtual method `float generateSample(float time) = 0` and a virtual destructor.',
          'Implement derived classes `SineOscillator` and `SquareOscillator`.',
          'Store oscillators in a `std::vector<std::unique_ptr<AudioOscillator>>` and iterate over them to print sample values.',
        ],
        starterCode: `#include <iostream>
#include <memory>
#include <vector>
#include <cmath>

// Implement AudioOscillator and derived classes

int main() {
    // Populate vector and generate samples
    return 0;
}`,
        solutionCode: `#include <iostream>
#include <memory>
#include <vector>
#include <cmath>

class AudioOscillator {
public:
    virtual ~AudioOscillator() = default;
    virtual float generateSample(float time) const = 0;
};

class SineOscillator final : public AudioOscillator {
public:
    float generateSample(float time) const override {
        return std::sin(time * 6.283185f);
    }
};

class SquareOscillator final : public AudioOscillator {
public:
    float generateSample(float time) const override {
        return (std::sin(time * 6.283185f) >= 0.0f) ? 1.0f : -1.0f;
    }
};

int main() {
    std::vector<std::unique_ptr<AudioOscillator>> synth;
    synth.push_back(std::make_unique<SineOscillator>());
    synth.push_back(std::make_unique<SquareOscillator>());

    float time = 0.25f;
    for (const auto& osc : synth) {
        std::cout << "Sample at t=" << time << ": " << osc->generateSample(time) << "\\n";
    }
    return 0;
}`,
        hints: [
          'Declare `virtual ~AudioOscillator() = default;`.',
          'Use `override` on derived generateSample implementations.',
        ],
      },
      keyTakeaways: [
        'Dynamic dispatch requires `virtual` and works through pointers or references.',
        'Always make base class destructors `virtual` to prevent resource leaks.',
        'The VTable and vptr (8 bytes) facilitate runtime method resolution.',
        'Always use `override` to catch signature typos at compile time.',
      ],
    },

    // Day 13: Move Semantics, Rvalue References (&&), std::move & The Rule of 5
    {
      id: 'cpp-w2-d13',
      dayNumber: 13,
      weekNumber: 2,
      title: 'Move Semantics, Rvalues (`&&`) & The Rule of 5',
      subtitle: 'Value categories (lvalue/rvalue), move constructors, std::move cast, and the Rule of 3/5/0',
      durationMinutes: 70,
      overview:
        'Master the performance revolution of C++11: Move Semantics. Understand lvalues vs rvalues, rvalue references (T&&), stealing heap buffers instead of deep copying, the mechanics of std::move, and the authoritative Rule of 5.',
      topics: [
        {
          id: 'cpp-w2-d13-t1',
          topicNumber: 1,
          title: 'Value Categories: Lvalues vs Rvalues Explained',
          explanation: [
            'Every expression in C++ has two properties: a type and a value category.',
            'Lvalue (locator value): An expression that has an identifiable memory address and persists beyond a single expression (e.g. named variables `int x = 5;`, `ptr`, `arr[0]`). You can take its address with `&`.',
            'Rvalue (read value / temporary): A temporary expression that does NOT have a persistent name or address, about to be destroyed at the end of the statement (e.g. literals `42`, temporary calculations `x + y`, function return temporaries `std::string("temp")`).'
          ],
          keyRules: [
            'If you can take its address with & -> It is an Lvalue.',
            'If it is a temporary value about to expire -> It is an Rvalue.'
          ],
          codeSnippet: {
            id: 'cpp-snip-13-1',
            title: 'Identifying Lvalues vs Rvalues',
            description: 'Testing expressions for addressability and lifetime',
            language: 'cpp',
            code: `#include <iostream>

int getNumber() { return 100; } // Returns an rvalue temporary

int main() {
    int x = 10; // x is an lvalue
    int* p = &x; // Legal: lvalues have persistent addresses

    // int* p2 = &42; // COMPILE ERROR: cannot take address of rvalue literal!
    // int* p3 = &getNumber(); // COMPILE ERROR: cannot take address of temporary!

    std::cout << "x is lvalue at " << p << "\\n";
    return 0;
}`,
          },
          pitfall: 'Attempting to bind a non-const lvalue reference `int& ref = 42;` fails compilation because 42 is an rvalue.',
          quickCheck: {
            question: 'Which of the following is an Lvalue?',
            options: ['A named local variable `int count;`', 'The literal integer `100`', 'The temporary result `a + b`', 'The return of `std::string("abc")`'],
            correctIndex: 0,
            explanation: 'A named variable has an identifiable memory address and outlives the current statement, making it an lvalue.',
          },
        },
        {
          id: 'cpp-w2-d13-t2',
          topicNumber: 2,
          title: 'Rvalue References (`T&&`): Binding to Temporaries',
          explanation: [
            'C++11 introduced Rvalue References, declared with two ampersands: `T&&`.',
            'While a traditional reference `T&` can only bind to lvalues, an rvalue reference `T&&` binds EXCLUSIVELY to expiring rvalue temporaries.',
            'Binding to an rvalue signals to the program: "This object is temporary and about to die; you can safely steal its internal heap resources instead of copying them."'
          ],
          keyRules: [
            'T& binds to mutable lvalues.',
            'const T& can bind to both lvalues and rvalues.',
            'T&& binds exclusively to rvalues.'
          ],
          codeSnippet: {
            id: 'cpp-snip-13-2',
            title: 'Rvalue Reference Binding Rules',
            description: 'Contrasting lvalue and rvalue reference binding',
            language: 'cpp',
            code: `#include <iostream>

void inspectValue(int& x) {
    std::cout << "Bound to mutable Lvalue: " << x << "\\n";
}

void inspectValue(const int& x) {
    std::cout << "Bound to const Lvalue: " << x << "\\n";
}

void inspectValue(int&& x) {
    std::cout << "Bound to temporary Rvalue (stealing permitted!): " << x << "\\n";
}

int main() {
    int a = 50;
    inspectValue(a);    // Calls int& (lvalue)
    inspectValue(100);  // Calls int&& (rvalue temporary!)
    return 0;
}`,
          },
          pitfall: 'A named rvalue reference variable (e.g. `int&& r = 42;`) is itself an LVALUE inside the function because it has a name and address!',
          quickCheck: {
            question: 'What does the `T&&` syntax represent in C++11 and later?',
            options: [
              'An Rvalue Reference',
              'A pointer to a reference',
              'A logical AND operation',
              'A double pointer'
            ],
            correctIndex: 0,
            explanation: 'Two ampersands `T&&` denote an rvalue reference, binding to temporary values for move semantics.',
          },
        },
        {
          id: 'cpp-w2-d13-t3',
          topicNumber: 3,
          title: 'The `std::move` Cast: Unconditional Cast to Rvalue',
          explanation: [
            'Contrary to its name, `std::move` DOES NOT MOVE ANYTHING at runtime. It emits zero machine instructions!',
            '`std::move(x)` is simply a compile-time static cast: `static_cast<std::remove_reference_t<T>&&>(x)`.',
            'It tells the compiler: "Treat this named variable as an rvalue temporary, enabling the move constructor to steal its resources."'
          ],
          keyRules: [
            'std::move does not move anything; it casts an lvalue to an rvalue reference.',
            'After calling std::move(x), x is left in a "valid but unspecified" state (usually empty). Do not read from it.'
          ],
          codeSnippet: {
            id: 'cpp-snip-13-3',
            title: 'Stealing Heap Buffers with std::move',
            description: 'Zero-copy pointer transfer between strings via std::move',
            language: 'cpp',
            code: `#include <iostream>
#include <string>
#include <utility>

int main() {
    std::string source = "Massive dataset string stored on heap...";
    std::cout << "Source before move: [" << source << "]\\n";

    // Steal heap pointer from source into destination
    std::string destination = std::move(source);

    std::cout << "Destination after move: [" << destination << "]\\n";
    std::cout << "Source after move (hollowed out): [" << source << "] (Length: " << source.length() << ")\\n";
    return 0;
}`,
          },
          pitfall: 'Reading or dereferencing an object after it has been moved-from leads to undefined or unexpected behavior.',
          quickCheck: {
            question: 'What does `std::move` actually do at runtime?',
            options: [
              'Nothing: it is a compile-time cast to an rvalue reference that generates 0 CPU instructions',
              'It copies memory bytes in a background thread',
              'It deletes the original object',
              'It frees the heap allocator'
            ],
            correctIndex: 0,
            explanation: 'std::move is purely a compile-time cast to an rvalue reference, enabling the move constructor.',
          },
        },
        {
          id: 'cpp-w2-d13-t4',
          topicNumber: 4,
          title: 'Move Constructor & Move Assignment Operator',
          explanation: [
            'A Copy Constructor duplicates memory: `MyClass(const MyClass& other)`.',
            'A Move Constructor steals pointers: `MyClass(MyClass&& other) noexcept`. It shallow-copies the internal heap pointer and sets `other.ptr = nullptr;`.',
            'The Move Assignment Operator `MyClass& operator=(MyClass&& other) noexcept` releases its current resource, steals the other\'s pointer, and nullifies the other.'
          ],
          keyRules: [
            'Move operations MUST be marked noexcept so STL containers (like std::vector) will use them during reallocation.',
            'Always set the moved-from object pointers to nullptr so its destructor does not free the stolen memory.'
          ],
          codeSnippet: {
            id: 'cpp-snip-13-4',
            title: 'Move Constructor & Move Assignment Implementation',
            description: 'Properly stealing raw pointers and nullifying moved-from object',
            language: 'cpp',
            code: `#include <iostream>
#include <utility>

class HeavyBuffer {
public:
    int* data{nullptr};
    size_t size{0};

    HeavyBuffer(size_t s) : size(s), data(new int[s]) {}
    ~HeavyBuffer() { delete[] data; }

    // Move Constructor: Steal data, neutralize other
    HeavyBuffer(HeavyBuffer&& other) noexcept 
        : data(other.data), size(other.size) {
        other.data = nullptr; // CRITICAL: Prevent double deletion!
        other.size = 0;
    }

    // Move Assignment
    HeavyBuffer& operator=(HeavyBuffer&& other) noexcept {
        if (this != &other) {
            delete[] data; // Free existing
            data = other.data; // Steal
            size = other.size;
            other.data = nullptr;
            other.size = 0;
        }
        return *this;
    }
};

int main() {
    HeavyBuffer b1(1000000);
    HeavyBuffer b2 = std::move(b1); // Instant O(1) pointer swap!
    std::cout << "b2 acquired buffer. b1.data is now: " << b1.data << "\\n";
    return 0;
}`,
          },
          pitfall: 'Forgetting to set `other.data = nullptr` in the move constructor causes a catastrophic double-free crash when `other` leaves scope.',
          quickCheck: {
            question: 'Why MUST move constructors be marked `noexcept` in modern C++?',
            options: [
              'So that `std::vector` will move elements during reallocation instead of copying them',
              'Because the compiler refuses to compile without noexcept',
              'To speed up CPU clock frequency',
              'To prevent stack unwinding'
            ],
            correctIndex: 0,
            explanation: 'std::vector checks `std::is_nothrow_move_constructible` to preserve the strong exception guarantee; without noexcept, it falls back to copying.',
          },
        },
        {
          id: 'cpp-w2-d13-t5',
          topicNumber: 5,
          title: 'The Rule of 3 vs The Rule of 5',
          explanation: [
            'C++98 "Rule of Three": If a class defines a custom Destructor, Copy Constructor, or Copy Assignment Operator, it almost certainly needs to define all THREE.',
            'C++11 "Rule of Five": With the advent of move semantics, if you define any of the big three, you must explicitly declare all FIVE special member functions: (1) Destructor; (2) Copy Constructor; (3) Copy Assignment; (4) Move Constructor; (5) Move Assignment.',
            'If you declare a custom destructor or copy operation, the compiler SUPPRESSES the automatic generation of move constructors.'
          ],
          keyRules: [
            'Rule of 5: Destructor, Copy Ctor, Copy Assign, Move Ctor, Move Assign.',
            'Rule of 0: Prefer using RAII members and defining none of the 5.'
          ],
          codeSnippet: {
            id: 'cpp-snip-13-5',
            title: 'The Full Rule of 5 Template',
            description: 'Complete boilerplate for managing a raw resource in C++',
            language: 'cpp',
            code: `#include <iostream>

class ResourceHolder {
private:
    int* resource;
public:
    ResourceHolder() : resource(new int(0)) {}

    // 1. Destructor
    ~ResourceHolder() { delete resource; }

    // 2. Copy Constructor (Deep copy)
    ResourceHolder(const ResourceHolder& o) : resource(new int(*o.resource)) {}

    // 3. Copy Assignment Operator
    ResourceHolder& operator=(const ResourceHolder& o) {
        if (this != &o) {
            *resource = *o.resource;
        }
        return *this;
    }

    // 4. Move Constructor (Shallow steal)
    ResourceHolder(ResourceHolder&& o) noexcept : resource(o.resource) {
        o.resource = nullptr;
    }

    // 5. Move Assignment Operator
    ResourceHolder& operator=(ResourceHolder&& o) noexcept {
        if (this != &o) {
            delete resource;
            resource = o.resource;
            o.resource = nullptr;
        }
        return *this;
    }
};

int main() {
    ResourceHolder r1;
    ResourceHolder r2 = std::move(r1); // Move ctor invoked
    return 0;
}`,
          },
          pitfall: 'Defining a custom destructor without declaring move operations forces the compiler to perform slow deep copies when returning from functions.',
          quickCheck: {
            question: 'What are the 5 special member functions in the "Rule of Five"?',
            options: [
              'Destructor, Copy Constructor, Copy Assignment, Move Constructor, Move Assignment',
              'Constructor, Destructor, Getter, Setter, Print',
              'New, Delete, Malloc, Free, Realloc',
              'Static constructor, Private constructor, Copy, Move, Virtual destructor'
            ],
            correctIndex: 0,
            explanation: 'The Rule of 5 covers the destructor plus both copy and move variations of constructors and assignments.',
          },
        },
        {
          id: 'cpp-w2-d13-t6',
          topicNumber: 6,
          title: 'The Copy-and-Swap Idiom: Strong Exception Safety in 1 Line',
          explanation: [
            'Writing separate copy and move assignment operators involves repetitive boilerplate, self-assignment checks, and exception vulnerabilities.',
            'The Copy-and-Swap Idiom implements both copy and move assignment in a single operator: `MyClass& operator=(MyClass other)` taking parameter BY VALUE.',
            'Inside, it simply swaps member pointers using `swap(*this, other);`. The parameter is constructed cleanly (via copy or move), and the destructor of `other` frees the old memory on scope exit!'
          ],
          keyRules: [
            'Pass by value: operator=(MyClass other).',
            'Swap members with non-throwing friend swap(a, b) noexcept.',
            'Provides the Strong Exception Guarantee automatically.'
          ],
          codeSnippet: {
            id: 'cpp-snip-13-6',
            title: 'Copy-and-Swap Assignment Idiom',
            description: 'Unified exception-safe assignment operator using swap',
            language: 'cpp',
            code: `#include <iostream>
#include <utility>

class SwapString {
public:
    char* data{nullptr};

    SwapString(const char* s) { /* allocate & copy */ }
    ~SwapString() { delete[] data; }

    // Non-throwing friend swap
    friend void swap(SwapString& first, SwapString& second) noexcept {
        using std::swap;
        swap(first.data, second.data);
    }

    // Unified assignment operator: Handles COPY and MOVE automatically!
    SwapString& operator=(SwapString other) noexcept {
        swap(*this, other);
        return *this;
    } // other's destructor cleanly frees old data upon function exit
};

int main() {
    std::cout << "Copy-and-swap idiom provides bulletproof exception safety.\\n";
    return 0;
}`,
          },
          pitfall: 'Passing by reference `const MyClass&` to the Copy-and-Swap operator breaks the idiom; the argument MUST be taken by value.',
          quickCheck: {
            question: 'Why does the Copy-and-Swap assignment operator take its argument by value (`MyClass other`)?',
            options: [
              'So the compiler automatically invokes the copy constructor for lvalues or the move constructor for rvalues',
              'To prevent stack allocation',
              'Because references are forbidden in assignment operators',
              'To disable destructor calls'
            ],
            correctIndex: 0,
            explanation: 'Taking by value delegates allocation and copying to the constructor, handling both copy and move uniformly.',
          },
        },
        {
          id: 'cpp-w2-d13-t7',
          topicNumber: 7,
          title: 'Universal References & `std::forward` (Perfect Forwarding Preview)',
          explanation: [
            'In template contexts, `T&&` with type deduction is NOT an rvalue reference; it is a "Forwarding Reference" (Universal Reference).',
            'Reference Collapsing Rules: `&` + `&` = `&`; `&` + `&&` = `&`; `&&` + `&&` = `&&`.',
            '`std::forward<T>(arg)` preserves the exact value category (lvalue or rvalue) of the argument passed by the caller, enabling perfect forwarding in templates and constructors.'
          ],
          keyRules: [
            'std::move casts unconditionally to rvalue.',
            'std::forward casts conditionally: preserves lvalue if caller passed lvalue, rvalue if caller passed rvalue.',
            'Essential for factory functions like std::make_unique.'
          ],
          codeSnippet: {
            id: 'cpp-snip-13-7',
            title: 'std::forward Perfect Forwarding Preview',
            description: 'Preserving value categories in generic forwarding wrappers',
            language: 'cpp',
            code: `#include <iostream>
#include <utility>

void target(int& x)  { std::cout << "Target received Lvalue\\n"; }
void target(int&& x) { std::cout << "Target received Rvalue\\n"; }

template <typename T>
void forwardWrapper(T&& arg) {
    // std::forward preserves whether caller passed lvalue or rvalue
    target(std::forward<T>(arg));
}

int main() {
    int val = 42;
    forwardWrapper(val); // Passes lvalue
    forwardWrapper(99);  // Passes rvalue
    return 0;
}`,
          },
          pitfall: 'Using `std::move` inside a generic forwarding function turns every argument into an rvalue, destroying caller variables even when they passed an lvalue.',
          quickCheck: {
            question: 'What is the key difference between `std::move` and `std::forward`?',
            options: [
              'std::move casts unconditionally to rvalue; std::forward preserves original lvalue/rvalue category',
              'std::forward copies memory; std::move deletes it',
              'std::move is C++98; std::forward is C++20',
              'There is no difference'
            ],
            correctIndex: 0,
            explanation: 'std::move is an unconditional cast to rvalue, whereas std::forward conditionally preserves the argument category.',
          },
        },
        {
          id: 'cpp-w2-d13-t8',
          topicNumber: 8,
          title: 'Day 13 Capstone: Benchmarking Deep Copy vs Move Semantics',
          explanation: [
            'Synthesizing Day 13 concepts into an empirical performance benchmark.',
            'Demonstrating the difference between a 10MB memory reallocation clone vs an instantaneous 0-cycle pointer transfer.',
            'Move semantics is the reason C++ standard containers achieve unmatched data pipeline throughput.'
          ],
          keyRules: [
            'Moving transfers ownership of a pointer in O(1) single-cycle time regardless of buffer size.',
            'Copying scales linearly O(N) with the buffer size.'
          ],
          codeSnippet: {
            id: 'cpp-snip-13-8',
            title: 'Copy vs Move Performance Simulation',
            description: 'Contrasting O(N) buffer cloning with O(1) move pointer swap',
            language: 'cpp',
            code: `#include <iostream>
#include <vector>

int main() {
    std::cout << "=== Copy vs Move Performance Comparison ===" << std::endl;
    std::cout << "Transferring 100MB buffer:" << std::endl;
    std::cout << "  Deep Copy (new[] + memcpy): ~14.2 milliseconds (100MB reallocated)" << std::endl;
    std::cout << "  Move Semantics (std::move): ~0.0001 milliseconds (Single 8-byte pointer swap)" << std::endl;
    std::cout << "Speedup factor: Over 140,000x faster!" << std::endl;
    return 0;
}`,
          },
          pitfall: 'Forgetting `noexcept` on move constructors causes `std::vector` to fall back to the slow deep-copy path during reallocation.',
          quickCheck: {
            question: 'What is the algorithmic time complexity of moving a `std::vector<int>` with 10,000,000 elements?',
            options: ['O(1) constant time', 'O(N) linear time', 'O(N log N)', 'O(N^2)'],
            correctIndex: 0,
            explanation: 'Moving a vector simply copies 3 internal pointers (begin, end, capacity) and sets the old pointers to null in O(1) time.',
          },
        },
      ],
      practiceChallenge: {
        title: 'Day 13 Capstone: Custom Move-Enabled String Buffer',
        instructions: [
          'Create a class `MoveBuffer` managing a dynamically allocated `char*` array.',
          'Implement a deep Copy Constructor and a shallow Move Constructor marked `noexcept`.',
          'Verify that moving an instance zeroes out the source pointer without memory leaks.',
        ],
        starterCode: `#include <iostream>

class MoveBuffer {
    // Implement Rule of 5 buffer
};

int main() {
    // Test copy and move constructors
    return 0;
}`,
        solutionCode: `#include <iostream>
#include <cstring>
#include <utility>

class MoveBuffer {
public:
    char* data{nullptr};
    size_t length{0};

    MoveBuffer(const char* str) {
        length = std::strlen(str);
        data = new char[length + 1];
        std::strcpy(data, str);
    }

    ~MoveBuffer() { delete[] data; }

    // Copy Constructor (Deep copy)
    MoveBuffer(const MoveBuffer& o) : length(o.length), data(new char[o.length + 1]) {
        std::strcpy(data, o.data);
    }

    // Move Constructor (Shallow steal)
    MoveBuffer(MoveBuffer&& o) noexcept : data(o.data), length(o.length) {
        o.data = nullptr;
        o.length = 0;
    }
};

int main() {
    MoveBuffer b1("Systems Architecture");
    MoveBuffer b2 = std::move(b1); // Move ctor

    std::cout << "b2 content: " << b2.data << "\\n";
    std::cout << "b1 data is null: " << (b1.data == nullptr ? "YES" : "NO") << "\\n";
    return 0;
}`,
        hints: [
          'In the move constructor, set `o.data = nullptr;` immediately after copying the pointer.',
          'Mark the move constructor with `noexcept`.',
        ],
      },
      keyTakeaways: [
        'Lvalues have persistent addresses; Rvalues are expiring temporaries.',
        '`std::move` is a compile-time cast to an rvalue reference that generates 0 CPU instructions.',
        'Move constructors steal pointers in $O(1)$ time and MUST be marked `noexcept`.',
        'Follow the Rule of 5 whenever managing a raw resource.',
      ],
    },

    // Day 14: Week 2 Capstone: Custom String / Vector Class & Module 2 Exam
    {
      id: 'cpp-w2-d14',
      dayNumber: 14,
      weekNumber: 2,
      title: 'Week 2 Capstone: Building a Custom `std::vector` & Exam',
      subtitle: 'Complete dynamic array class with Rule of 5, RAII, iterators & Module 2 qualifying exam',
      durationMinutes: 75,
      overview:
        'Synthesize all of Week 2 by constructing a full production-grade custom dynamic vector class (`CustomVector<T>`). Implement the Rule of 5, dynamic geometric capacity doubling, placement new, and pass the Week 2 Qualifying Assessment.',
      topics: [
        {
          id: 'cpp-w2-d14-t1',
          topicNumber: 1,
          title: 'Architecture of a Production Vector Container',
          explanation: [
            'A production vector maintains three pointers:',
            '1. `m_data`: Pointer to the start of allocated heap storage.',
            '2. `m_size`: Number of currently constructed, active elements.',
            '3. `m_capacity`: Total number of elements the buffer can hold before requiring reallocation.',
            'This 3-pointer architecture achieves amortized $O(1)$ `push_back()`.'
          ],
          keyRules: [
            'Capacity represents allocated memory; Size represents initialized objects.',
            'Never access memory past m_size, even if within m_capacity.'
          ],
          codeSnippet: {
            id: 'cpp-snip-14-1',
            title: 'Vector 3-Pointer Anatomy',
            description: 'Standard memory layout of dynamic vector containers',
            language: 'cpp',
            code: `/*
  [==================== HEAP ALLOCATED BUFFER ====================]
  |  Item 0  |  Item 1  |  Item 2  |  Item 3  |  Uninitialized Capacity... |
  ^                                           ^                            ^
  m_data                                  m_size                      m_capacity
*/`,
          },
          pitfall: 'Confusing `size()` with `capacity()`; writing to index `[size]` without resizing causes undefined behavior.',
          quickCheck: {
            question: 'What is the difference between vector `size` and vector `capacity`?',
            options: [
              'Size is the number of active constructed elements; Capacity is the total allocated buffer space',
              'They are always identical',
              'Capacity is in bytes, size is in bits',
              'Size cannot exceed 100'
            ],
            correctIndex: 0,
            explanation: 'Size counts valid objects currently in the vector; capacity counts how many elements can fit before reallocation is needed.',
          },
        },
        {
          id: 'cpp-w2-d14-t2',
          topicNumber: 2,
          title: 'Geometric Reallocation Strategy (Amortized $O(1)$ Push Back)',
          explanation: [
            'If a vector grew by 1 element on every `push_back()`, inserting $N$ elements would require $O(N^2)$ copies and reallocations.',
            'By doubling capacity geometrically (1, 2, 4, 8, 16, 32...) or multiplying by 1.5x, reallocations become rare exponential events.',
            'The aggregate cost of $N$ insertions is $O(N)$, resulting in an amortized $O(1)$ cost per insertion.'
          ],
          keyRules: [
            'Geometric growth (typically 1.5x or 2x) guarantees amortized O(1) push_back.',
            'Linear growth causes disastrous O(N^2) insertion slowdowns.'
          ],
          codeSnippet: {
            id: 'cpp-snip-14-2',
            title: 'Geometric Capacity Doubling Logic',
            description: 'Calculating amortized O(1) growth thresholds',
            language: 'cpp',
            code: `#include <iostream>

size_t computeNextCapacity(size_t currentCapacity) {
    if (currentCapacity == 0) return 2;
    return currentCapacity * 2; // Geometric doubling
}

int main() {
    size_t cap = 0;
    std::cout << "Growth sequence: ";
    for (int i = 0; i < 8; i++) {
        cap = computeNextCapacity(cap);
        std::cout << cap << " ";
    }
    std::cout << "\\n";
    return 0;
}`,
          },
          pitfall: 'Reallocating the vector invalidates all existing raw pointers and iterators referencing its elements.',
          quickCheck: {
            question: 'What is the amortized time complexity of `push_back()` in `std::vector`?',
            options: ['Amortized O(1)', 'Strict O(N)', 'O(log N)', 'O(N^2)'],
            correctIndex: 0,
            explanation: 'Because capacity doubles exponentially, the average cost across all insertions is O(1) constant time.',
          },
        },
        {
          id: 'cpp-w2-d14-t3',
          topicNumber: 3,
          title: 'Implementing the Complete `CustomVector<T>` Class',
          explanation: [
            'Building the production `CustomVector` class implementing:',
            '- Default constructor, destructor freeing memory via `delete[]`.',
            '- Rule of 5: Deep Copy Ctor, Copy Assignment, Move Ctor `noexcept`, Move Assignment `noexcept`.',
            '- `push_back(const T&)` and move-enabled `push_back(T&&)`.',
            '- Dual `operator[]` for mutable and const indexing.',
            '- `.size()`, `.capacity()`, and `.reserve()`.'
          ],
          keyRules: [
            'Implement full Rule of 5.',
            'Ensure move constructor is marked noexcept.'
          ],
          codeSnippet: {
            id: 'cpp-snip-14-3',
            title: 'Complete CustomVector Class Blueprint',
            description: 'Full implementation of a dynamic vector in C++',
            language: 'cpp',
            code: `#include <iostream>
#include <utility>

template <typename T>
class CustomVector {
private:
    T* m_data{nullptr};
    size_t m_size{0};
    size_t m_capacity{0};

    void reallocate(size_t newCapacity) {
        T* newBlock = new T[newCapacity];
        for (size_t i = 0; i < m_size; ++i) {
            newBlock[i] = std::move(m_data[i]); // Move elements over
        }
        delete[] m_data;
        m_data = newBlock;
        m_capacity = newCapacity;
    }

public:
    CustomVector() = default;

    ~CustomVector() {
        delete[] m_data;
    }

    // Copy Constructor
    CustomVector(const CustomVector& other) 
        : m_size(other.m_size), m_capacity(other.m_capacity) {
        m_data = new T[m_capacity];
        for (size_t i = 0; i < m_size; ++i) m_data[i] = other.m_data[i];
    }

    // Move Constructor
    CustomVector(CustomVector&& other) noexcept
        : m_data(other.m_data), m_size(other.m_size), m_capacity(other.m_capacity) {
        other.m_data = nullptr;
        other.m_size = 0;
        other.m_capacity = 0;
    }

    void push_back(const T& val) {
        if (m_size >= m_capacity) {
            reallocate(m_capacity == 0 ? 2 : m_capacity * 2);
        }
        m_data[m_size++] = val;
    }

    T& operator[](size_t idx) { return m_data[idx]; }
    const T& operator[](size_t idx) const { return m_data[idx]; }

    size_t size() const { return m_size; }
    size_t capacity() const { return m_capacity; }
};

int main() {
    CustomVector<int> vec;
    vec.push_back(10);
    vec.push_back(20);
    vec.push_back(30);

    for (size_t i = 0; i < vec.size(); ++i) {
        std::cout << vec[i] << " ";
    }
    std::cout << "\\n";
    return 0;
}`,
          },
          pitfall: 'Failing to move elements when reallocating forces expensive deep copies during vector expansion.',
          quickCheck: {
            question: 'Why does `reallocate()` use `std::move(m_data[i])` instead of copying?',
            options: [
              'To transfer element resources efficiently without cloning',
              'Because copying is illegal in templates',
              'To avoid deleting the old buffer',
              'To reverse the vector'
            ],
            correctIndex: 0,
            explanation: 'Moving elements during reallocation avoids cloning heap buffers for types like strings or sub-vectors.',
          },
        },
        {
          id: 'cpp-w2-d14-t4',
          topicNumber: 4,
          title: 'Iterator Support: `begin()` and `end()` for Range-Based For Loops',
          explanation: [
            'How does C++ enable range-based for loops: `for (const auto& item : myVector)`?',
            'The compiler simply looks for `.begin()` and `.end()` methods that return pointers or iterator objects supporting `*`, `++`, and `!=`.',
            'For contiguous arrays, raw pointers `T*` are already valid Random Access Iterators!'
          ],
          keyRules: [
            'T* begin() { return m_data; }',
            'T* end() { return m_data + m_size; }',
            'Enables standard STL algorithms and range-for loops automatically.'
          ],
          codeSnippet: {
            id: 'cpp-snip-14-4',
            title: 'Enabling Range-Based For Loops on Custom Containers',
            description: 'Adding begin() and end() pointer iterators',
            language: 'cpp',
            code: `#include <iostream>

class NumberContainer {
private:
    int data[5]{1, 2, 3, 4, 5};
public:
    // Pointers satisfy iterator requirements
    int* begin() { return data; }
    int* end()   { return data + 5; }

    const int* begin() const { return data; }
    const int* end()   const { return data + 5; }
};

int main() {
    NumberContainer nc;
    // Compiles cleanly to for (auto it = nc.begin(); it != nc.end(); ++it)
    for (int val : nc) {
        std::cout << val << " ";
    }
    std::cout << "\\n";
    return 0;
}`,
          },
          pitfall: 'Returning `data + size - 1` from `end()` is an off-by-one error; `end()` must point ONE PAST the last valid element.',
          quickCheck: {
            question: 'Where must `end()` point in standard C++ iterator semantics?',
            options: [
              'One position past the last valid element',
              'At the last element',
              'At nullptr',
              'At index 0'
            ],
            correctIndex: 0,
            explanation: 'C++ iterators use half-open ranges `[begin, end)`, where `end` points one past the final element.',
          },
        },
        {
          id: 'cpp-w2-d14-t5',
          topicNumber: 5,
          title: '`reserve()` vs `resize()`: Avoiding Reallocation Overhead',
          explanation: [
            '`vec.reserve(N)`: Pre-allocates memory capacity for at least $N$ elements without constructing any objects (`size` remains unchanged). Use this when you know the approximate element count in advance to eliminate ALL intermediate reallocations.',
            '`vec.resize(N)`: Actually changes the `size` of the vector to $N$, default-constructing new elements if growing, or destroying elements if shrinking.'
          ],
          keyRules: [
            'Always call vec.reserve(estimatedCount) before a heavy insertion loop.',
            'reserve() changes capacity; resize() changes size.'
          ],
          codeSnippet: {
            id: 'cpp-snip-14-5',
            title: 'reserve() Eliminating Reallocations',
            description: 'Zeroing allocation overhead with pre-reserved capacity',
            language: 'cpp',
            code: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> numbers;
    numbers.reserve(1000); // 1 allocation upfront!

    std::cout << "Size:     " << numbers.size() << "\\n";     // 0
    std::cout << "Capacity: " << numbers.capacity() << "\\n"; // 1000

    for (int i = 0; i < 1000; i++) {
        numbers.push_back(i); // 0 reallocations occur!
    }
    std::cout << "Final size: " << numbers.size() << "\\n";
    return 0;
}`,
          },
          pitfall: 'Calling `reserve()` and then using bracket indexing `vec[0] = 5;` without calling `push_back()` causes undefined behavior because `size` is still 0.',
          quickCheck: {
            question: 'What is the effect of calling `vec.reserve(500)` on an empty `std::vector`?',
            options: [
              'Capacity becomes at least 500, but size remains 0',
              'Size and capacity both become 500',
              '500 default integers are constructed',
              'It frees the memory'
            ],
            correctIndex: 0,
            explanation: 'reserve() only allocates raw capacity space without constructing objects; size remains 0.',
          },
        },
        {
          id: 'cpp-w2-d14-t6',
          topicNumber: 6,
          title: '`emplace_back()` vs `push_back()`: In-Place Construction',
          explanation: [
            '`push_back(obj)` requires creating a temporary object and then moving or copying it into the vector buffer.',
            '`emplace_back(args...)` uses variadic templates and placement new to construct the object directly IN-PLACE inside the vector\'s pre-allocated capacity.',
            'Eliminates temporary object construction and move operations entirely.'
          ],
          keyRules: [
            'Use emplace_back when passing constructor arguments.',
            'If you already have a constructed object, push_back(std::move(obj)) is identical.'
          ],
          codeSnippet: {
            id: 'cpp-snip-14-6',
            title: 'emplace_back In-Place Construction',
            description: 'Constructing directly inside vector buffer without temporaries',
            language: 'cpp',
            code: `#include <iostream>
#include <vector>
#include <string>

struct Employee {
    int id;
    std::string role;
    Employee(int i, std::string r) : id(i), role(r) {
        std::cout << "Constructed Employee #" << id << " directly in-place\\n";
    }
};

int main() {
    std::vector<Employee> team;
    team.reserve(2);

    // Constructs Employee directly in vector memory without temporaries!
    team.emplace_back(101, "Lead Systems Architect");
    return 0;
}`,
          },
          pitfall: 'Using `emplace_back(Employee(101, "role"))` defeats the purpose of emplace because a temporary object is still constructed.',
          quickCheck: {
            question: 'What is the primary performance benefit of `emplace_back()` over `push_back()`?',
            options: [
              'It constructs the object directly in the vector buffer, eliminating temporaries and moves',
              'It runs in a background thread',
              'It prevents vector reallocation forever',
              'It compresses strings'
            ],
            correctIndex: 0,
            explanation: 'emplace_back forwards constructor arguments directly to placement new inside the vector buffer.',
          },
        },
        {
          id: 'cpp-w2-d14-t7',
          topicNumber: 7,
          title: 'Week 2 Architectural Synthesis & Mastery Checklist',
          explanation: [
            'Consolidating all Week 2 pillars:',
            '1. OOP Encapsulation: Member initializer lists, `explicit`, and deterministic LIFO destruction.',
            '2. RAII: Automatic resource ownership tied to stack scopes, stack unwinding exception safety.',
            '3. Smart Pointers: `unique_ptr` (exclusive, 0 overhead), `shared_ptr` (atomic ref count), `weak_ptr` (cycle breaker).',
            '4. Operator Overloading: Canonical `+=` / `+`, stream `<<`, bracket `[]`, and C++20 `<=>`.',
            '5. Polymorphism: `virtual` functions, mandatory virtual destructors, vtables, `override` and `final`.',
            '6. Move Semantics: Rvalue references `&&`, `std::move` cast, and the Rule of 5.'
          ],
          keyRules: [
            'Follow the Rule of Zero as primary default; use Rule of Five when wrapping raw handles.',
            'Never delete through a base pointer without a virtual destructor.'
          ],
          codeSnippet: {
            id: 'cpp-snip-14-7',
            title: 'Week 2 Synthesis Verification Matrix',
            description: 'Verifying modern C++ OOP and ownership practices',
            language: 'cpp',
            code: `#include <iostream>
#include <memory>

class IService {
public:
    virtual ~IService() = default;
    virtual void run() = 0;
};

class Worker final : public IService {
public:
    void run() override { std::cout << "Worker executing with RAII\\n"; }
};

int main() {
    std::unique_ptr<IService> srv = std::make_unique<Worker>();
    srv->run();
    return 0;
}`,
          },
          pitfall: 'Mixing manual `new`/`delete` with smart pointers leads to double-free crashes or memory leaks.',
          quickCheck: {
            question: 'Which smart pointer should be used by default in modern C++ when dynamic allocation is needed?',
            options: ['std::unique_ptr', 'std::shared_ptr', 'std::weak_ptr', 'std::auto_ptr'],
            correctIndex: 0,
            explanation: '`std::unique_ptr` provides zero-cost, exclusive ownership and should be the default choice.',
          },
        },
        {
          id: 'cpp-w2-d14-t8',
          topicNumber: 8,
          title: 'Week 2 Qualifying Assessment Gateway',
          explanation: [
            'To unlock Week 3 (Templates, Generic Programming, C++20 Ranges & STL Mastery), you must pass the Week 2 Qualifying Exam with >= 80%.',
            'The assessment verifies: RAII destruction, virtual destructor necessity, smart pointer selection, copy vs move semantics, and vtable mechanics.',
            'Advance to Week 3 to master the generic programming engine of C++.'
          ],
          keyRules: [
            'Passing score: 80% (4 out of 5 questions correct).',
            'Unlocks Week 3: Templates, Concepts, STL Algorithms & C++20 Ranges.'
          ],
          codeSnippet: {
            id: 'cpp-snip-14-8',
            title: 'Week 2 Exam Gateway Kicker',
            description: 'Readiness checklist for Week 3 template advancement',
            language: 'cpp',
            code: `#include <iostream>

int main() {
    std::cout << "Week 2 Curriculum Complete!\\n";
    std::cout << "Ready for Week 2 Module Qualifying Assessment.\\n";
    return 0;
}`,
          },
          pitfall: 'Rushing past move semantics and smart pointers will make understanding STL containers and move-only types in Week 3 difficult.',
          quickCheck: {
            question: 'What is required to unlock Week 3 of the C++ Systems Academy?',
            options: [
              'Score at least 80% on the Week 2 Qualifying Exam (or enable Dev Mode)',
              'Recompile the Linux kernel',
              'Implement a custom memory allocator',
              'Read the C++ draft standard'
            ],
            correctIndex: 0,
            explanation: 'Achieving >= 80% on the Week 2 quiz certifies competency and unlocks Week 3.',
          },
        },
      ],
      practiceChallenge: {
        title: 'Day 14 Capstone Project: Production Move-Only UniquePointer Class',
        instructions: [
          'Implement your own simplified `UniquePtr<T>` class from scratch.',
          'Store a raw pointer `T* m_ptr`.',
          'Implement destructor that calls `delete m_ptr`.',
          'Delete the copy constructor and copy assignment operator.',
          'Implement move constructor and move assignment operator marked `noexcept`.',
          'Overload `operator*` and `operator->`.',
        ],
        starterCode: `#include <iostream>

template <typename T>
class UniquePtr {
    // Implement custom smart pointer
};

int main() {
    // Test your custom smart pointer
    return 0;
}`,
        solutionCode: `#include <iostream>
#include <utility>

template <typename T>
class UniquePtr {
private:
    T* m_ptr{nullptr};

public:
    explicit UniquePtr(T* ptr = nullptr) : m_ptr(ptr) {}

    ~UniquePtr() {
        delete m_ptr;
        m_ptr = nullptr;
    }

    // Delete copy operations
    UniquePtr(const UniquePtr&) = delete;
    UniquePtr& operator=(const UniquePtr&) = delete;

    // Move Constructor
    UniquePtr(UniquePtr&& other) noexcept : m_ptr(other.m_ptr) {
        other.m_ptr = nullptr;
    }

    // Move Assignment
    UniquePtr& operator=(UniquePtr&& other) noexcept {
        if (this != &other) {
            delete m_ptr;
            m_ptr = other.m_ptr;
            other.m_ptr = nullptr;
        }
        return *this;
    }

    T& operator*() const { return *m_ptr; }
    T* operator->() const { return m_ptr; }
    T* get() const { return m_ptr; }
};

struct Point {
    int x, y;
};

int main() {
    UniquePtr<Point> p1(new Point{10, 20});
    std::cout << "Point coordinates: (" << p1->x << ", " << p1->y << ")\\n";

    UniquePtr<Point> p2 = std::move(p1);
    std::cout << "Moved point coordinates: (" << p2->x << ", " << p2->y << ")\\n";
    std::cout << "p1 is now null: " << (p1.get() == nullptr ? "YES" : "NO") << "\\n";
    return 0;
}`,
        hints: [
          'In move constructor and move assignment, set `other.m_ptr = nullptr;`.',
          'Delete copy operations with `= delete;`.',
        ],
      },
      keyTakeaways: [
        'A vector uses a 3-pointer architecture to achieve amortized $O(1)$ push_back.',
        '`reserve()` pre-allocates capacity to eliminate reallocation overhead in hot loops.',
        'Iterators are half-open ranges `[begin, end)` that enable modern range-based for loops.',
        'Week 2 establishes professional object lifecycles: RAII, smart pointers, and move semantics.',
      ],
    },
  ],
  quiz: {
    id: 'cpp-quiz-week-2',
    weekNumber: 2,
    title: 'Week 2 Qualifying Exam: OOP, RAII & Move Semantics',
    description: 'Score at least 80% (4/5 correct) to unlock Week 3: Templates, Concepts, Modern C++20 & STL Mastery.',
    passingScorePercent: 80,
    questions: [
      {
        id: 'cpp-q2-1',
        question: 'Why must base class destructors be declared `virtual` in polymorphic hierarchies?',
        options: [
          'To ensure derived class destructors are invoked when deleting an object through a base pointer',
          'To allocate the class on the heap',
          'To make the class copyable',
          'To allow member variables to be private'
        ],
        correctIndex: 0,
        explanation: 'Without a virtual destructor, deleting via a base pointer only calls the base destructor, leaking derived class resources.',
      },
      {
        id: 'cpp-q2-2',
        question: 'What is the runtime cost of moving a `std::vector` or `std::string` using `std::move`?',
        options: [
          'O(1) constant time: it only swaps internal pointers, generating zero element allocations',
          'O(N) linear time proportional to vector size',
          'O(log N)',
          'It depends on the CPU clock speed'
        ],
        correctIndex: 0,
        explanation: 'Move semantics performs a shallow pointer transfer in O(1) time regardless of how many elements the container holds.',
      },
      {
        id: 'cpp-q2-3',
        question: 'What smart pointer should be used to break cyclic reference memory leaks between `std::shared_ptr` nodes?',
        options: ['std::weak_ptr', 'std::unique_ptr', 'raw pointer T*', 'std::auto_ptr'],
        correctIndex: 0,
        explanation: 'std::weak_ptr is a non-owning observer that does not increment the strong reference count, breaking reference cycles.',
      },
      {
        id: 'cpp-q2-4',
        question: 'What does `auto operator<=>(const MyClass&) const = default;` generate in C++20?',
        options: [
          'All six relational comparison operators (==, !=, <, <=, >, >=) using member-wise comparison',
          'Only the < and > operators',
          'A JSON serializer',
          'A move constructor'
        ],
        correctIndex: 0,
        explanation: 'Defaulting the three-way comparison spaceship operator generates the full suite of comparison operators automatically.',
      },
      {
        id: 'cpp-q2-5',
        question: 'Why should move constructors always be marked `noexcept`?',
        options: [
          'So standard containers like `std::vector` will move elements during reallocation instead of deep copying them',
          'Because the compiler refuses to compile move constructors without noexcept',
          'To make them thread-safe',
          'To disable stack unwinding'
        ],
        correctIndex: 0,
        explanation: 'std::vector will only move elements during growth if the move constructor is noexcept; otherwise it copies to preserve exception safety.',
      },
    ],
  },
};
