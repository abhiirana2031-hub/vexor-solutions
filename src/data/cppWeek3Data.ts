import { WeekModule } from '../types/course';

export const CPP_WEEK_3_MODULE: WeekModule = {
  weekNumber: 3,
  title: 'Templates, Generic Programming, C++20 Concepts & STL',
  theme: 'Compile-Time Code Generation, Modern Type Constraints & STL Architecture',
  description:
    'Master C++ generic programming: function and class templates, Class Template Argument Deduction (CTAD), SFINAE vs C++17 if constexpr, C++20 Concepts and Constraints, STL containers and algorithms, and pipeline views.',
  conceptImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
  imageAlt: 'C++ generic programming and compile-time template instantiation visualization',
  days: [
    {
      id: 'cpp-w3-d15',
      dayNumber: 15,
      weekNumber: 3,
      title: 'Function & Class Templates, CTAD (C++17)',
      subtitle: 'Type parameters, template instantiation, header-only template definitions & argument deduction',
      durationMinutes: 65,
      overview:
        'Understand compile-time metaprogramming with templates. Learn how the compiler generates concrete specialized functions from generic blueprints, template parameter deduction, and modern C++17 Class Template Argument Deduction.',
      topics: [
        {
          id: 'cpp-w3-d15-t1',
          topicNumber: 1,
          title: 'The Blueprint Philosophy: Compile-Time Code Generation',
          explanation: [
            'Templates in C++ are not functions or classes; they are blueprints instructing the compiler on how to generate concrete functions or classes.',
            'When you write `template <typename T> T max(T a, T b)`, the compiler emits ZERO binary instructions until you actually call `max(3, 5)` or `max(1.2, 3.4)`.',
            'This process is called "Template Instantiation": the compiler stamps out an exact copy of the function with `T` substituted by `int` or `double`, optimizing it with zero runtime polymorphism overhead.'
          ],
          keyRules: [
            'Templates have ZERO runtime overhead compared to hand-written type-specific code.',
            'Template definitions MUST reside in header files because the compiler needs the full source code to instantiate them at compile time in each translation unit.'
          ],
          codeSnippet: {
            id: 'cpp-snip-15-1',
            title: 'Function Template Instantiation',
            description: 'Generic function blueprint generating type-specific code',
            language: 'cpp',
            code: `#include <iostream>

template <typename T>
T findMax(T a, T b) {
    return (a > b) ? a : b;
}

int main() {
    // Compiler generates findMax<int>(int, int)
    std::cout << "Max int:    " << findMax(10, 25) << "\\n";
    
    // Compiler generates findMax<double>(double, double)
    std::cout << "Max double: " << findMax(3.1415, 2.7182) << "\\n";
    return 0;
}`,
          },
          pitfall: 'Placing template function definitions in a `.cpp` file causes linker "unresolved external symbol" errors because other `.cpp` files cannot see the template body during instantiation.',
          quickCheck: {
            question: 'Where must template function and class definitions reside in a multi-file project?',
            options: [
              'In header files (.h / .hpp) so any translation unit can instantiate them',
              'In .cpp files only',
              'In binary shared libraries',
              'In the Makefile'
            ],
            correctIndex: 0,
            explanation: 'Compilers instantiate templates at the point of call, requiring full template definitions to be visible in included headers.',
          },
        },
        {
          id: 'cpp-w3-d15-t2',
          topicNumber: 2,
          title: 'Template Argument Deduction & Explicit Specification',
          explanation: [
            'When calling a function template, the compiler automatically deduces the template type parameters from the argument types passed.',
            'If arguments have conflicting types (e.g. `findMax(4, 5.5)` where one is `int` and one is `double`), deduction fails because `T` is ambiguous.',
            'You can resolve ambiguity by explicitly specifying the type parameter: `findMax<double>(4, 5.5)`, or by using multiple template parameters (`template <typename T, typename U>`).'
          ],
          keyRules: [
            'Deduction fails if multiple arguments deduce conflicting types for the same T.',
            'Explicitly specify types with angle brackets: func<TargetType>(args).'
          ],
          codeSnippet: {
            id: 'cpp-snip-15-2',
            title: 'Resolving Type Deduction Ambiguity',
            description: 'Explicit template arguments vs multi-type parameters',
            language: 'cpp',
            code: `#include <iostream>

template <typename T>
T add(T a, T b) { return a + b; }

int main() {
    // auto err = add(5, 3.2); // COMPILE ERROR: deduced conflicting types for T (int vs double)
    auto ok1 = add<double>(5, 3.2); // Explicit: converts 5 to double
    std::cout << "Result: " << ok1 << "\\n";
    return 0;
}`,
          },
          pitfall: 'Relying on implicit conversion in template functions without explicit angle brackets: template deduction does not perform automatic type promotion.',
          quickCheck: {
            question: 'What happens when you call `template <typename T> void f(T a, T b)` with `f(10, 3.14)`?',
            options: [
              'Compilation error: type deduction fails due to ambiguous candidates (int vs double)',
              '10 is converted to double automatically',
              '3.14 is truncated to int',
              'It throws a runtime exception'
            ],
            correctIndex: 0,
            explanation: 'Template type deduction does not perform implicit conversions when deducing the same type parameter T.',
          },
        },
        {
          id: 'cpp-w3-d15-t3',
          topicNumber: 3,
          title: 'Class Templates: Generic Data Structures',
          explanation: [
            'Class templates allow writing generic containers (like `std::vector<T>`, `std::optional<T>`, `Pair<K, V>`).',
            'Member functions defined outside the class template must also include the template header: `template <typename T> void MyClass<T>::method()`.',
            'Every unique combination of template arguments creates an entirely distinct class type in memory.'
          ],
          keyRules: [
            'Pair<int, string> and Pair<double, double> are two completely independent types.',
            'Class templates can accept multiple type and non-type parameters.'
          ],
          codeSnippet: {
            id: 'cpp-snip-15-3',
            title: 'Generic KeyValuePair Class Template',
            description: 'Defining and instantiating generic data structures',
            language: 'cpp',
            code: `#include <iostream>
#include <string>

template <typename K, typename V>
class KeyValuePair {
private:
    K key;
    V value;
public:
    KeyValuePair(K k, V v) : key(k), value(v) {}

    const K& getKey() const { return key; }
    const V& getValue() const { return value; }
};

int main() {
    KeyValuePair<int, std::string> entry(404, "Not Found");
    std::cout << "HTTP " << entry.getKey() << ": " << entry.getValue() << "\\n";
    return 0;
}`,
          },
          pitfall: 'Static member variables inside a class template are shared ONLY among instances with the exact same template arguments.',
          quickCheck: {
            question: 'Are `std::vector<int>` and `std::vector<double>` related in the type system?',
            options: [
              'No, they are two completely distinct, unrelated types generated at compile time',
              'Yes, they inherit from a common VectorBase class',
              'Yes, double inherits from int',
              'They share the same static members'
            ],
            correctIndex: 0,
            explanation: 'Class templates generate independent, distinct concrete classes for each unique type parameter.',
          },
        },
        {
          id: 'cpp-w3-d15-t4',
          topicNumber: 4,
          title: 'Class Template Argument Deduction (CTAD) in C++17',
          explanation: [
            'Prior to C++11/C++17, instantiating a class template required repeating the type in angle brackets: `std::pair<int, std::string> p(1, "one");`. Helper functions like `std::make_pair(1, "one")` were created to deduce types.',
            'C++17 introduced CTAD (Class Template Argument Deduction): The compiler deduces class template types directly from constructor arguments!',
            'Now you write simply: `std::pair p(1, "one");` or `std::lock_guard lock(mtx);`.'
          ],
          keyRules: [
            'CTAD deduces template parameters from constructor arguments automatically.',
            'You can write custom Deduction Guides: `MyType(const char*) -> MyType<std::string>;`.'
          ],
          codeSnippet: {
            id: 'cpp-snip-15-4',
            title: 'CTAD in Action (C++17)',
            description: 'Constructing template classes without angle brackets',
            language: 'cpp',
            code: `#include <iostream>
#include <utility>
#include <tuple>

int main() {
    // In C++17, no angle brackets needed! Deduces <int, double>
    std::pair coordinates(42, 98.6);
    
    // Deduces <int, const char*, double>
    std::tuple record(101, "Alice", 3.95);

    std::cout << "Coordinates: (" << coordinates.first << ", " << coordinates.second << ")\\n";
    return 0;
}`,
          },
          pitfall: 'CTAD cannot deduce types if default constructors are called without arguments; `std::vector vec;` is illegal (must write `std::vector<int> vec;`).',
          quickCheck: {
            question: 'What C++ standard introduced Class Template Argument Deduction (CTAD)?',
            options: ['C++17', 'C++11', 'C++14', 'C++20'],
            correctIndex: 0,
            explanation: 'CTAD was standardized in C++17, eliminating redundant angle brackets when constructing objects.',
          },
        },
        {
          id: 'cpp-w3-d15-t5',
          topicNumber: 5,
          title: 'Non-Type Template Parameters (NTTP)',
          explanation: [
            'Templates can accept values (constants) as parameters in addition to types.',
            'Examples: `template <typename T, size_t N> class FixedStack;` (how `std::array<T, N>` is implemented).',
            'C++20 expanded Non-Type Template Parameters to accept floating-point numbers (`double`), structural literal classes, and lambda objects.'
          ],
          keyRules: [
            'NTTP arguments must be compile-time constants (constexpr).',
            'Used to create statically-sized buffers with zero heap allocation.'
          ],
          codeSnippet: {
            id: 'cpp-snip-15-5',
            title: 'Non-Type Template Parameters for Statically Sized Stack',
            description: 'Embedding capacity constants directly into template types',
            language: 'cpp',
            code: `#include <iostream>
#include <cstddef>

template <typename T, size_t Capacity>
class StaticRingBuffer {
private:
    T buffer[Capacity];
    size_t count{0};
public:
    void push(const T& val) {
        if (count < Capacity) buffer[count++] = val;
    }
    size_t capacity() const { return Capacity; }
    size_t size() const { return count; }
};

int main() {
    StaticRingBuffer<int, 64> ring; // Buffer size embedded in type!
    std::cout << "Ring buffer capacity: " << ring.capacity() << " elements\\n";
    return 0;
}`,
          },
          pitfall: '`StaticRingBuffer<int, 32>` and `StaticRingBuffer<int, 64>` are two completely different types; you cannot assign one to the other.',
          quickCheck: {
            question: 'What is a Non-Type Template Parameter (NTTP)?',
            options: [
              'A template parameter that is a compile-time constant value (like an integer size) rather than a type',
              'A template with no parameters',
              'A template that cannot be compiled',
              'A void pointer'
            ],
            correctIndex: 0,
            explanation: 'NTTPs accept compile-time values (integers, pointers, sizes) rather than types.',
          },
        },
        {
          id: 'cpp-w3-d15-t6',
          topicNumber: 6,
          title: 'Default Template Arguments',
          explanation: [
            'Like function parameters, template parameters can have default values: `template <typename T = int, size_t N = 16> class Buffer;`.',
            'If the caller omits arguments, the defaults are substituted automatically.',
            'Extensively used across the STL: `std::vector<T, Allocator = std::allocator<T>>`.'
          ],
          keyRules: [
            'Default template arguments can appear on class templates and function templates.',
            'Parameters with defaults must be trailing parameters.'
          ],
          codeSnippet: {
            id: 'cpp-snip-15-6',
            title: 'Default Template Parameters Pattern',
            description: 'Configuring default types and sizes in class templates',
            language: 'cpp',
            code: `#include <iostream>

template <typename T = double, size_t Dimension = 3>
struct CoordinateVector {
    T coords[Dimension]{};
};

int main() {
    CoordinateVector<> defaultCoord; // Deduces <double, 3>
    CoordinateVector<float, 2> screenCoord; // Overrides to <float, 2>

    std::cout << "Default dimension size: " << sizeof(defaultCoord.coords) / sizeof(double) << "\\n";
    std::cout << "Screen dimension size:  " << sizeof(screenCoord.coords) / sizeof(float) << "\\n";
    return 0;
}`,
          },
          pitfall: 'Writing `CoordinateVector` without empty angle brackets `<>` when defaults exist was illegal pre-C++17 (C++17 CTAD allows it if constructors exist).',
          quickCheck: {
            question: 'Can template parameters have default values in C++?',
            options: [
              'Yes, both class and function templates can define default type and non-type parameters',
              'No, only function parameters can have defaults',
              'Only for integer parameters',
              'Only in C++23'
            ],
            correctIndex: 0,
            explanation: 'C++ fully supports default template arguments for both types and non-type constants.',
          },
        },
        {
          id: 'cpp-w3-d15-t7',
          topicNumber: 7,
          title: 'Variadic Templates (`typename... Args`) & Parameter Packs',
          explanation: [
            'C++11 introduced Variadic Templates, allowing templates to accept an arbitrary number of arguments: `template <typename... Args>`.',
            '`Args...` is a "Template Parameter Pack"; `args...` is a "Function Parameter Pack".',
            'In C++11/14, packs were unpacked using recursive template instantiation. In C++17, "Fold Expressions" allow unpacking in a single expressive line: `(... + args)`.'
          ],
          keyRules: [
            'sizeof...(Args) queries the number of arguments in the pack at compile time.',
            'C++17 Fold expressions: (... + args) sums all arguments.'
          ],
          codeSnippet: {
            id: 'cpp-snip-15-7',
            title: 'Variadic Templates & C++17 Fold Expressions',
            description: 'Summing arbitrary numbers of arguments in one line',
            language: 'cpp',
            code: `#include <iostream>

// C++17 Fold expression: sums any number of arguments!
template <typename... Args>
auto sumAll(Args... args) {
    return (... + args); // Unpacks: (arg1 + arg2 + ... + argN)
}

int main() {
    std::cout << "Sum (3 args): " << sumAll(1, 2, 3) << "\\n";
    std::cout << "Sum (5 args): " << sumAll(10, 20, 30, 40, 50) << "\\n";
    return 0;
}`,
          },
          pitfall: 'Attempting to index directly into a parameter pack like `args[2]` is illegal; packs must be unpacked via fold expressions or `std::tuple`.',
          quickCheck: {
            question: 'What operator syntax represents a template parameter pack in C++?',
            options: ['typename... Args', 'Args[]', 'variadic Args', 'params Args'],
            correctIndex: 0,
            explanation: 'The ellipsis `typename... Args` declares a variadic template parameter pack.',
          },
        },
        {
          id: 'cpp-w3-d15-t8',
          topicNumber: 8,
          title: 'Day 15 Capstone: Generic Thread-Safe Object Pool',
          explanation: [
            'Synthesizing Day 15 concepts into an industrial Generic Object Pool container.',
            'Demonstrating class templates, variadic constructor forwarding, placement new, and zero heap reallocation during hot gameplay loops.',
            'Massively utilized in high-performance networking and game development.'
          ],
          keyRules: [
            'Pre-allocate capacity in template class.',
            'Return generic pointers/references for high throughput.'
          ],
          codeSnippet: {
            id: 'cpp-snip-15-8',
            title: 'Generic Object Pool Blueprint',
            description: 'Template object pool for zero-allocation recycling',
            language: 'cpp',
            code: `#include <iostream>
#include <vector>
#include <memory>

template <typename T>
class ObjectPool {
private:
    std::vector<std::unique_ptr<T>> m_pool;
public:
    void acquire(std::unique_ptr<T> item) {
        m_pool.push_back(std::move(item));
    }

    std::unique_ptr<T> release() {
        if (m_pool.empty()) return nullptr;
        auto item = std::move(m_pool.back());
        m_pool.pop_back();
        return item;
    }

    size_t available() const { return m_pool.size(); }
};

struct Bullet { int damage{50}; };

int main() {
    ObjectPool<Bullet> bulletPool;
    bulletPool.acquire(std::make_unique<Bullet>());
    bulletPool.acquire(std::make_unique<Bullet>());

    std::cout << "Available bullets in pool: " << bulletPool.available() << "\\n";
    auto activeBullet = bulletPool.release();
    std::cout << "Fired bullet with damage:  " << activeBullet->damage << "\\n";
    std::cout << "Remaining in pool:         " << bulletPool.available() << "\\n";
    return 0;
}`,
          },
          pitfall: 'Forgetting to clear or reset the state of a recycled object before putting it back into the pool leaks stale data across operations.',
          quickCheck: {
            question: 'What is the purpose of a Generic Object Pool in performance-critical software?',
            options: [
              'To reuse pre-allocated objects, avoiding expensive dynamic new/delete operations in hot loops',
              'To encrypt object pointers',
              'To convert classes to interfaces',
              'To manage global variables'
            ],
            correctIndex: 0,
            explanation: 'Object pools recycle existing objects to eliminate runtime heap allocation latencies.',
          },
        },
      ],
      practiceChallenge: {
        title: 'Day 15 Capstone: Generic Array Statistics Calculator',
        instructions: [
          'Create a template function `T calculateSum(const T* arr, size_t count)`.',
          'Create a template function `T calculateMax(const T* arr, size_t count)`.',
          'Test both functions with an array of `int` and an array of `double`.',
        ],
        starterCode: `#include <iostream>

// Implement calculateSum and calculateMax templates

int main() {
    int intArr[] = {10, 20, 30, 40};
    double dblArr[] = {1.5, 4.2, 9.1, 2.8};
    return 0;
}`,
        solutionCode: `#include <iostream>

template <typename T>
T calculateSum(const T* arr, size_t count) {
    T total = 0;
    for (size_t i = 0; i < count; ++i) total += arr[i];
    return total;
}

template <typename T>
T calculateMax(const T* arr, size_t count) {
    if (count == 0) return T{};
    T maxVal = arr[0];
    for (size_t i = 1; i < count; ++i) {
        if (arr[i] > maxVal) maxVal = arr[i];
    }
    return maxVal;
}

int main() {
    int intArr[] = {10, 20, 30, 40};
    double dblArr[] = {1.5, 4.2, 9.1, 2.8};

    std::cout << "Int Sum:    " << calculateSum(intArr, 4) << "\\n";
    std::cout << "Int Max:    " << calculateMax(intArr, 4) << "\\n";
    std::cout << "Double Sum: " << calculateSum(dblArr, 4) << "\\n";
    std::cout << "Double Max: " << calculateMax(dblArr, 4) << "\\n";
    return 0;
}`,
        hints: [
          'Initialize `total = 0;` and `maxVal = arr[0];`.',
          'Use standard for loops up to `count`.',
        ],
      },
      keyTakeaways: [
        'Templates are compile-time code generation blueprints with zero runtime overhead.',
        'Template definitions must be placed in header files for instantiation visibility.',
        'C++17 CTAD deduces class template parameters automatically from constructor arguments.',
        'Variadic templates with C++17 fold expressions unpack argument lists in one expressive line.',
      ],
    },

    // Day 16: Template Specialization, Non-Type Parameters & SFINAE / if constexpr
    {
      id: 'cpp-w3-d16',
      dayNumber: 16,
      weekNumber: 3,
      title: 'Template Specialization, SFINAE & `if constexpr`',
      subtitle: 'Full & partial specialization, type traits (<type_traits>), SFINAE and C++17 if constexpr',
      durationMinutes: 70,
      overview:
        'Master advanced compile-time branching. Learn full and partial template specialization, standard type traits (<type_traits>), SFINAE (Substitution Failure Is Not An Error), and the modern C++17 compile-time if constexpr statement.',
      topics: [
        {
          id: 'cpp-w3-d16-t1',
          topicNumber: 1,
          title: 'Full (Explicit) Template Specialization',
          explanation: [
            'Sometimes the generic implementation of a template is inefficient or incorrect for a specific type (e.g. `char*` needing `strcmp` instead of `==`, or `bool` needing bit-packing).',
            'Full Specialization allows providing a completely custom implementation for a specific type.',
            'Syntax: `template <> class Container<bool> { ... };` (empty angle brackets signal specialization).'
          ],
          keyRules: [
            'Full specialization uses template <> with empty parameter list.',
            'The specialized class can have completely different members and implementations from the primary template.'
          ],
          codeSnippet: {
            id: 'cpp-snip-16-1',
            title: 'Full Template Specialization for const char*',
            description: 'Customizing comparison logic for raw C-strings',
            language: 'cpp',
            code: `#include <iostream>
#include <cstring>

// 1. Primary template
template <typename T>
bool isEqual(T a, T b) {
    return a == b;
}

// 2. Full specialization for const char*
template <>
bool isEqual<const char*>(const char* a, const char* b) {
    return std::strcmp(a, b) == 0;
}

int main() {
    std::cout << "isEqual(5, 5):         " << (isEqual(5, 5) ? "YES" : "NO") << "\\n";
    std::cout << "isEqual(\"abc\", \"abc\"): " << (isEqual("abc", "abc") ? "YES" : "NO") << "\\n";
    return 0;
}`,
          },
          pitfall: 'Omitting the `template <>` header when defining a full specialization generates a compiler error.',
          quickCheck: {
            question: 'What header precedes a full template specialization definition?',
            options: ['template <>', 'template <full>', 'specialization <T>', 'inline template'],
            correctIndex: 0,
            explanation: '`template <>` with empty angle brackets denotes an explicit/full specialization.',
          },
        },
        {
          id: 'cpp-w3-d16-t2',
          topicNumber: 2,
          title: 'Partial Template Specialization',
          explanation: [
            'Partial Specialization customizes a template for a SUBSET of types (e.g. all pointer types `T*`, all vectors `std::vector<T>`, or fixing 1 of 2 parameters).',
            'Function templates CANNOT be partially specialized in C++ (only overloaded); Class templates CAN be partially specialized.',
            'Syntax: `template <typename T> class Container<T*> { ... };`.'
          ],
          keyRules: [
            'Only class templates support partial specialization.',
            'To specialize functions partially, delegate to a class template or use function overloading.'
          ],
          codeSnippet: {
            id: 'cpp-snip-16-2',
            title: 'Partial Specialization for All Pointer Types',
            description: 'Custom handling for all pointer types T*',
            language: 'cpp',
            code: `#include <iostream>

// Primary class template
template <typename T>
struct TypeDescriptor {
    static void describe() { std::cout << "Standard Value Type\\n"; }
};

// Partial specialization for all pointer types T*
template <typename T>
struct TypeDescriptor<T*> {
    static void describe() { std::cout << "Pointer Type (Deref possible)\\n"; }
};

int main() {
    TypeDescriptor<int>::describe();   // Standard Value Type
    TypeDescriptor<int*>::describe();  // Pointer Type
    return 0;
}`,
          },
          pitfall: 'Trying to partially specialize a function template `template <typename T> void f<T*>()` fails compilation; use function overloading instead.',
          quickCheck: {
            question: 'Can free function templates be partially specialized in standard C++?',
            options: [
              'No, only class templates can be partially specialized (functions should be overloaded)',
              'Yes, always',
              'Yes, in C++20',
              'Only with static functions'
            ],
            correctIndex: 0,
            explanation: 'The C++ standard explicitly disallows partial specialization of function templates; developers use function overloading instead.',
          },
        },
        {
          id: 'cpp-w3-d16-t3',
          topicNumber: 3,
          title: 'Type Traits Library (`<type_traits>`)',
          explanation: [
            'C++11 introduced `<type_traits>`, a compile-time metadata reflection library.',
            'Traits query properties of types at compile time: `std::is_integral<T>::value`, `std::is_pointer<T>::value`, `std::is_trivially_copyable<T>::value`.',
            'C++14/17 added clean variable template aliases ending in `_v`: `std::is_integral_v<T>` and type transformations ending in `_t`: `std::remove_reference_t<T>`.'
          ],
          keyRules: [
            'Query properties with std::is_xxx_v<T> (returns constexpr bool).',
            'Transform types with std::remove_xxx_t<T> (returns type).'
          ],
          codeSnippet: {
            id: 'cpp-snip-16-3',
            title: 'Querying Type Traits at Compile Time',
            description: 'Inspecting types with modern _v and _t type traits',
            language: 'cpp',
            code: `#include <iostream>
#include <type_traits>

template <typename T>
void inspectType() {
    std::cout << "Is Integral: " << (std::is_integral_v<T> ? "YES" : "NO") << "\\n";
    std::cout << "Is Pointer:  " << (std::is_pointer_v<T>  ? "YES" : "NO") << "\\n";
    std::cout << "Is Floating: " << (std::is_floating_point_v<T> ? "YES" : "NO") << "\\n";
}

int main() {
    std::cout << "--- int ---\\n";
    inspectType<int>();
    std::cout << "--- double* ---\\n";
    inspectType<double*>();
    return 0;
}`,
          },
          pitfall: 'Using legacy `std::is_integral<T>::value` instead of C++17 `std::is_integral_v<T>` adds unnecessary verbosity.',
          quickCheck: {
            question: 'What header provides compile-time type reflection traits like `std::is_integral_v`?',
            options: ['<type_traits>', '<typeinfo>', '<utility>', '<memory>'],
            correctIndex: 0,
            explanation: '<type_traits> contains all standardized compile-time type introspection and transformation templates.',
          },
        },
        {
          id: 'cpp-w3-d16-t4',
          topicNumber: 4,
          title: 'Modern Compile-Time Branching: `if constexpr` (C++17)',
          explanation: [
            'In standard `if (condition)`, all branches must compile successfully even if the condition is known at compile time.',
            'C++17 introduced `if constexpr (compile_time_condition)`: The compiler evaluates the boolean expression at compile time and DISCARDS the untaken branch entirely.',
            'Code in the discarded branch is not instantiated, allowing different code paths for completely incompatible types without SFINAE boilerplate!'
          ],
          keyRules: [
            'Condition must be a compile-time boolean constant expression.',
            'Replaces 90% of legacy SFINAE and enable_if hacks with clean readable code.'
          ],
          codeSnippet: {
            id: 'cpp-snip-16-4',
            title: 'if constexpr Compile-Time Branching',
            description: 'Discarding incompatible branch instantiations cleanly in C++17',
            language: 'cpp',
            code: `#include <iostream>
#include <type_traits>

template <typename T>
void printValue(T val) {
    if constexpr (std::is_pointer_v<T>) {
        // Only instantiated when T is a pointer!
        if (val) std::cout << "Pointer value: " << *val << "\\n";
        else std::cout << "nullptr\\n";
    } else {
        // Only instantiated when T is NOT a pointer!
        std::cout << "Direct value:  " << val << "\\n";
    }
}

int main() {
    int x = 42;
    printValue(x);   // Calls non-pointer branch
    printValue(&x);  // Calls pointer branch (*val compiled cleanly!)
    return 0;
}`,
          },
          pitfall: 'Using regular `if` instead of `if constexpr` causes compilation failure because `*val` fails to compile for non-pointer types like `int`.',
          quickCheck: {
            question: 'Why does `if constexpr` succeed where a regular `if` would fail when dereferencing `*val`?',
            options: [
              'The compiler completely discards and does not instantiate the untaken branch',
              'It ignores syntax errors',
              'It turns pointers into integers',
              'It runs on the GPU'
            ],
            correctIndex: 0,
            explanation: '`if constexpr` discards the untaken branch at compile time, skipping instantiation for incompatible types.',
          },
        },
        {
          id: 'cpp-w3-d16-t5',
          topicNumber: 5,
          title: 'SFINAE: Substitution Failure Is Not An Error',
          explanation: [
            'SFINAE is a fundamental C++ rule: If substituting a template argument results in an invalid type or expression during overload resolution, the compiler does NOT emit an error; it simply removes that candidate from the overload set.',
            'Historically implemented via `std::enable_if_t<Condition, ReturnType>`.',
            'Allows conditionally enabling or disabling functions based on whether a type supports specific operations.'
          ],
          keyRules: [
            'Invalid substitution silently discards the candidate function.',
            'If all candidates are discarded, a "no matching function call" error is emitted.'
          ],
          codeSnippet: {
            id: 'cpp-snip-16-5',
            title: 'SFINAE with std::enable_if_t',
            description: 'Conditionally enabling function templates using SFINAE',
            language: 'cpp',
            code: `#include <iostream>
#include <type_traits>

// Enabled ONLY for integral types (int, long, short)
template <typename T>
std::enable_if_t<std::is_integral_v<T>, void> process(T val) {
    std::cout << "Processing Integer: " << val << "\\n";
}

// Enabled ONLY for floating point types (float, double)
template <typename T>
std::enable_if_t<std::is_floating_point_v<T>, void> process(T val) {
    std::cout << "Processing Float:   " << val << "\\n";
}

int main() {
    process(10);   // Calls integral overload
    process(3.14); // Calls float overload
    return 0;
}`,
          },
          pitfall: 'SFINAE error messages can be notoriously cryptic when compiler output exceeds hundreds of lines of substitution failures.',
          quickCheck: {
            question: 'What does SFINAE stand for in C++ metaprogramming?',
            options: [
              'Substitution Failure Is Not An Error',
              'Standard Function Interface And Environment',
              'System File Input And Evaluation',
              'Structured Format In All Expressions'
            ],
            correctIndex: 0,
            explanation: 'SFINAE guarantees that an invalid template substitution drops the candidate from overload resolution without a compilation error.',
          },
        },
        {
          id: 'cpp-w3-d16-t6',
          topicNumber: 6,
          title: '`decltype` & `std::declval` for Expression SFINAE',
          explanation: [
            'Expression SFINAE tests whether an expression (e.g. `a + b` or `obj.serialize()`) is valid for type `T`.',
            '`std::declval<T>()` allows creating a fictitious reference to type `T` in an unevaluated expression without needing a constructor.',
            '`decltype(std::declval<T>().size())` extracts the return type of `.size()`, validating if the method exists.'
          ],
          keyRules: [
            'std::declval<T>() can ONLY be used inside unevaluated operands (like sizeof or decltype).',
            'Enables detecting whether a class has specific member methods.'
          ],
          codeSnippet: {
            id: 'cpp-snip-16-6',
            title: 'Detecting Member Function via decltype',
            description: 'Checking for .size() method using unevaluated declval',
            language: 'cpp',
            code: `#include <iostream>
#include <vector>
#include <utility>

// Detection trait using void_t and declval
template <typename T, typename = void>
struct HasSizeMethod : std::false_type {};

template <typename T>
struct HasSizeMethod<T, std::void_t<decltype(std::declval<T>().size())>> : std::true_type {};

int main() {
    std::cout << "std::vector has .size(): " << (HasSizeMethod<std::vector<int>>::value ? "YES" : "NO") << "\\n";
    std::cout << "int has .size():          " << (HasSizeMethod<int>::value ? "YES" : "NO") << "\\n";
    return 0;
}`,
          },
          pitfall: 'Calling `std::declval<T>()` in an evaluated runtime context causes a compilation error; it is strictly an unevaluated type helper.',
          quickCheck: {
            question: 'Can `std::declval<T>()` be called at runtime in executable code?',
            options: [
              'No, it can ONLY be used in unevaluated contexts like `decltype` and `sizeof`',
              'Yes, it returns a default-constructed object',
              'Yes, it allocates heap memory',
              'Only inside main()'
            ],
            correctIndex: 0,
            explanation: 'std::declval cannot be called at runtime; it exists solely to yield a fictitious reference in unevaluated type expressions.',
          },
        },
        {
          id: 'cpp-w3-d16-t7',
          topicNumber: 7,
          title: 'Template Template Parameters (`template <typename> class C`)',
          explanation: [
            'A template parameter can itself be a template! Syntax: `template <template <typename> class Container, typename T>`.',
            'This allows writing generic algorithms that accept container templates themselves (e.g. `std::vector`, `std::list`) parameterized on any type `T`.',
            'Forms the architecture behind container adapters like `std::stack` and `std::queue`.'
          ],
          keyRules: [
            'Enables decoupling container topology from element payload type.',
            'C++17 allows template <template <typename...> class C>.'
          ],
          codeSnippet: {
            id: 'cpp-snip-16-7',
            title: 'Template Template Parameter Pattern',
            description: 'Accepting container templates as generic parameters',
            language: 'cpp',
            code: `#include <iostream>
#include <vector>
#include <deque>

template <template <typename, typename> class Container, typename T>
void fillAndPrint(T value) {
    // Uses default allocator
    Container<T, std::allocator<T>> c;
    c.push_back(value);
    c.push_back(value * 2);
    for (const auto& item : c) std::cout << item << " ";
    std::cout << "\\n";
}

int main() {
    fillAndPrint<std::vector>(10);
    fillAndPrint<std::deque>(25);
    return 0;
}`,
          },
          pitfall: 'STL containers take default allocator parameters; forgetting to account for the allocator template parameter in pre-C++17 template template signatures causes template matching errors.',
          quickCheck: {
            question: 'What is a Template Template Parameter?',
            options: [
              'A template parameter that is itself a template blueprint',
              'A template with two arguments',
              'A template inside a namespace',
              'A recursive template'
            ],
            correctIndex: 0,
            explanation: 'Template template parameters accept a generic template (like `std::vector`) rather than a concrete type (like `std::vector<int>`).',
          },
        },
        {
          id: 'cpp-w3-d16-t8',
          topicNumber: 8,
          title: 'Day 16 Capstone: Zero-Copy Binary Serializer Engine',
          explanation: [
            'Synthesizing Day 16 concepts into a high-performance binary serializer.',
            'Demonstrating compile-time branching with `if constexpr`: fast `memcpy` for trivially copyable types vs custom element iteration for complex types.',
            'Delivers maximum theoretical throughput for network and disk serialization.'
          ],
          keyRules: [
            'Use std::is_trivially_copyable_v<T> to branch at compile time.',
            'Trivially copyable types serialize in a single direct memcpy byte copy.'
          ],
          codeSnippet: {
            id: 'cpp-snip-16-8',
            title: 'High-Performance Serializer with if constexpr',
            description: 'Optimizing serialization via compile-time type introspection',
            language: 'cpp',
            code: `#include <iostream>
#include <type_traits>
#include <cstring>
#include <vector>

class ByteStream {
public:
    std::vector<uint8_t> buffer;

    template <typename T>
    void write(const T& val) {
        if constexpr (std::is_trivially_copyable_v<T>) {
            // Ultra-fast SIMD bitwise copy!
            size_t start = buffer.size();
            buffer.resize(start + sizeof(T));
            std::memcpy(buffer.data() + start, &val, sizeof(T));
            std::cout << "Serialized trivially copyable type (" << sizeof(T) << " bytes)\\n";
        } else {
            // Complex non-trivial serialization logic
            std::cout << "Fallback: Custom element serialization path\\n";
        }
    }
};

struct Point3D { float x, y, z; };

int main() {
    ByteStream stream;
    Point3D pt{1.0f, 2.0f, 3.0f};
    stream.write(pt);
    std::cout << "Stream total bytes: " << stream.buffer.size() << "\\n";
    return 0;
}`,
          },
          pitfall: 'Using `std::memcpy` on non-trivially copyable objects like `std::string` or `std::shared_ptr` corrupts internal pointers.',
          quickCheck: {
            question: 'What trait identifies types that can be safely copied using raw `std::memcpy`?',
            options: ['std::is_trivially_copyable_v<T>', 'std::is_object_v<T>', 'std::is_class_v<T>', 'std::is_scalar_v<T>'],
            correctIndex: 0,
            explanation: 'Types satisfying `std::is_trivially_copyable_v` have no complex copy logic and can be serialized via bitwise byte copying.',
          },
        },
      ],
      practiceChallenge: {
        title: 'Day 16 Capstone: Generic Formatter with if constexpr',
        instructions: [
          'Write a template function `std::string formatItem(T value)`.',
          'Using `if constexpr`, if `T` is a pointer, print `*value` (or "nullptr" if null).',
          'If `T` is a boolean, print "true" or "false".',
          'Otherwise, use `std::to_string(value)`.',
        ],
        starterCode: `#include <iostream>
#include <string>
#include <type_traits>

// Implement formatItem with if constexpr

int main() {
    int x = 99;
    // Test formatItem on int, pointer, and bool
    return 0;
}`,
        solutionCode: `#include <iostream>
#include <string>
#include <type_traits>

template <typename T>
std::string formatItem(T value) {
    if constexpr (std::is_pointer_v<T>) {
        if (!value) return "nullptr";
        return std::to_string(*value);
    } else if constexpr (std::is_same_v<T, bool>) {
        return value ? "true" : "false";
    } else {
        return std::to_string(value);
    }
}

int main() {
    int val = 99;
    bool flag = true;
    int* ptr = &val;

    std::cout << "Formatted val:  " << formatItem(val) << "\\n";
    std::cout << "Formatted bool: " << formatItem(flag) << "\\n";
    std::cout << "Formatted ptr:  " << formatItem(ptr) << "\\n";
    return 0;
}`,
        hints: [
          'Use `if constexpr (std::is_pointer_v<T>)`.',
          'Use `else if constexpr (std::is_same_v<T, bool>)`.',
        ],
      },
      keyTakeaways: [
        'Full specialization customizes a template for an exact type; partial specialization customizes for a subset of types.',
        '`if constexpr` (C++17) evaluates at compile time and discards untaken branches completely.',
        'SFINAE discards invalid overload candidates silently during template deduction.',
        '`<type_traits>` provides compile-time type introspection for building adaptive zero-cost algorithms.',
      ],
    },

    // Days 17 to 21 will complete Week 3
    // Day 17: STL Sequence Containers: std::vector, std::deque, std::list & std::array
    {
      id: 'cpp-w3-d17',
      dayNumber: 17,
      weekNumber: 3,
      title: 'STL Sequence Containers: Memory & Complexity',
      subtitle: 'vector, deque, list, forward_list, array & contiguous vs node-based memory cache analysis',
      durationMinutes: 65,
      overview:
        'Master the fundamental sequential containers of the Standard Template Library. Analyze their algorithmic complexity ($O(1)$ vs $O(N)$), iterator invalidation rules, memory topologies, and hardware cache performance.',
      topics: [
        {
          id: 'cpp-w3-d17-t1',
          topicNumber: 1,
          title: 'The STL Sequential Containers Taxonomy',
          explanation: [
            'The Standard Template Library partitions sequence containers into two primary memory topologies:',
            '1. Contiguous Memory: `std::vector` (dynamic array), `std::array` (fixed stack array), `std::deque` (segmented chunks). Optimal CPU cache prefetching.',
            '2. Node-Based Memory: `std::list` (doubly-linked list), `std::forward_list` (singly-linked list). Scattered heap allocations, high memory pointer overhead, poor cache locality.'
          ],
          keyRules: [
            'Default container of choice: std::vector.',
            'Only use std::list if frequent insertions in the middle without iterator invalidation are required.'
          ],
          codeSnippet: {
            id: 'cpp-snip-17-1',
            title: 'Comparing Sequence Container Initializations',
            description: 'Declaring and initializing contiguous vs node-based containers',
            language: 'cpp',
            code: `#include <iostream>
#include <vector>
#include <deque>
#include <list>
#include <array>

int main() {
    std::vector<int> vec = {1, 2, 3};      // Contiguous dynamic array
    std::array<int, 3> arr = {4, 5, 6};    // Contiguous fixed stack array
    std::deque<int> deq = {7, 8, 9};       // Segmented chunked buffers
    std::list<int> lst = {10, 11, 12};     // Doubly-linked node list

    std::cout << "All sequence containers initialized successfully.\\n";
    return 0;
}`,
          },
          pitfall: 'Using `std::list` assuming it is faster for insertions; in reality, traversing a linked list is 10x-50x slower than `std::vector` due to CPU cache misses.',
          quickCheck: {
            question: 'Which container should be the default choice in C++ for sequential collections?',
            options: ['std::vector', 'std::list', 'std::forward_list', 'std::deque'],
            correctIndex: 0,
            explanation: 'Bjarne Stroustrup and the C++ standard mandate `std::vector` as the default container due to CPU cache locality.',
          },
        },
        {
          id: 'cpp-w3-d17-t2',
          topicNumber: 2,
          title: '`std::deque`: Segmented Dynamic Buffer Architecture',
          explanation: [
            '`std::deque` (Double-Ended Queue) provides $O(1)$ fast insertion and deletion at BOTH the front and back.',
            'Unlike `std::vector`, a deque does NOT store elements in a single contiguous array. Instead, it manages a center index table of fixed-size chunks (e.g. 512-byte pages).',
            'Inserting at the front or back never requires moving existing elements; it simply allocates a new chunk if the current chunk is full.'
          ],
          keyRules: [
            'push_front() and push_back() are both O(1).',
            'Elements are indexed in O(1): deq[i] involves two pointer dereferences (index table + chunk).',
            'Memory is not contiguous: cannot pass deq.data() to C APIs expecting a raw array.'
          ],
          codeSnippet: {
            id: 'cpp-snip-17-2',
            title: 'std::deque O(1) Push Front & Back',
            description: 'Bi-directional insertion without full reallocation',
            language: 'cpp',
            code: `#include <iostream>
#include <deque>

int main() {
    std::deque<int> dq;
    dq.push_back(10);
    dq.push_back(20);
    dq.push_front(5);  // O(1) front insertion!
    dq.push_front(1);

    std::cout << "Deque items: ";
    for (int x : dq) std::cout << x << " ";
    std::cout << "\\n"; // 1 5 10 20
    return 0;
}`,
          },
          pitfall: 'Assuming deque elements are contiguous in memory; taking `&deq[0]` and incrementing the pointer will crash when crossing chunk boundaries.',
          quickCheck: {
            question: 'What is the time complexity of `push_front()` in `std::deque` versus `std::vector`?',
            options: [
              'std::deque is O(1); std::vector is O(N) because all elements must be shifted',
              'Both are O(1)',
              'Both are O(N)',
              'std::vector is faster'
            ],
            correctIndex: 0,
            explanation: 'deque allocates an independent front chunk in O(1), whereas vector must shift all N elements rightward.',
          },
        },
        {
          id: 'cpp-w3-d17-t3',
          topicNumber: 3,
          title: '`std::list` & `std::forward_list`: Node Mechanics',
          explanation: [
            '`std::list` is a doubly-linked list (each node has `prev`, `next`, and payload). Each node requires 16 bytes of pointer overhead on 64-bit systems.',
            '`std::forward_list` is a singly-linked list (each node has only `next` pointer). It has minimum memory overhead and no `.size()` method ($O(1)$ space, no size tracking).',
            'Key Advantage: Inserting or splicing elements into any iterator position takes $O(1)$ pointer rewiring and NEVER invalidates iterators to other elements.'
          ],
          keyRules: [
            'Iterator stability: Pointers and references to list elements remain valid even after insertions/deletions elsewhere.',
            'No random access: list[i] is NOT supported; traversing to index i takes O(N).'
          ],
          codeSnippet: {
            id: 'cpp-snip-17-3',
            title: 'std::list Splicing & Iterator Stability',
            description: 'O(1) node splicing without element copying',
            language: 'cpp',
            code: `#include <iostream>
#include <list>

int main() {
    std::list<int> l1 = {1, 2, 5};
    std::list<int> l2 = {3, 4};

    auto it = l1.begin();
    std::advance(it, 2); // Move iterator to 5

    // Splice l2 into l1 before 5 in O(1) time!
    l1.splice(it, l2);

    for (int x : l1) std::cout << x << " ";
    std::cout << "\\n"; // 1 2 3 4 5
    return 0;
}`,
          },
          pitfall: 'Using `std::list` for small primitive elements (like `char` or `int`): a 4-byte `int` requires 24 bytes per node (600% memory bloat) due to 16-byte pointers and 8-byte alignment.',
          quickCheck: {
            question: 'Does inserting an element into `std::list` invalidate iterators pointing to other existing elements?',
            options: [
              'No, iterators to other nodes remain completely valid',
              'Yes, all iterators are invalidated',
              'Only end() is invalidated',
              'Only begin() is invalidated'
            ],
            correctIndex: 0,
            explanation: 'Node-based containers guarantee iterator stability; existing node memory addresses never change.',
          },
        },
        {
          id: 'cpp-w3-d17-t4',
          topicNumber: 4,
          title: 'Iterator Invalidation Rules Matrix',
          explanation: [
            'Iterator Invalidation is one of the most common causes of crashes in C++: an iterator becomes dangling when the container reallocates or shifts elements.',
            '`std::vector`: Reallocation invalidates ALL iterators and references; insertion/deletion without reallocation invalidates iterators at or after the modification point.',
            '`std::deque`: Insertion at ends invalidates iterators, but references to elements remain valid! Insertion in middle invalidates all.',
            '`std::list`: Insertions and deletions NEVER invalidate iterators to other nodes.'
          ],
          keyRules: [
            'Modifying a vector during a loop invalidates your loop iterator.',
            'Use the return value of vec.erase(it) to advance safely: it = vec.erase(it);.'
          ],
          codeSnippet: {
            id: 'cpp-snip-17-4',
            title: 'Safe Element Eradication Pattern (Erase-Remove)',
            description: 'Safely deleting elements during container traversal',
            language: 'cpp',
            code: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> numbers = {1, 2, 3, 4, 5, 6};

    // Erase even numbers safely using erase() return iterator
    for (auto it = numbers.begin(); it != numbers.end(); ) {
        if (*it % 2 == 0) {
            it = numbers.erase(it); // Returns iterator to next valid element!
        } else {
            ++it;
        }
    }

    for (int x : numbers) std::cout << x << " ";
    std::cout << "\\n"; // 1 3 5
    return 0;
}`,
          },
          pitfall: 'Calling `vec.erase(it); ++it;` increments an invalidated iterator, leading to an immediate segmentation fault.',
          quickCheck: {
            question: 'What does `vector.erase(it)` return in C++?',
            options: [
              'An iterator pointing to the element immediately following the removed element',
              'void',
              'bool indicating success',
              'The erased value'
            ],
            correctIndex: 0,
            explanation: 'erase() returns an iterator to the new location of the element that followed the erased element.',
          },
        },
        {
          id: 'cpp-w3-d17-t5',
          topicNumber: 5,
          title: 'Cache Locality: Hardware Prefetching vs Pointer Chasing',
          explanation: [
            'Modern CPUs fetch memory into L1/L2/L3 caches in 64-byte Cache Lines.',
            '`std::vector` stores elements sequentially. When the CPU loads element 0, it automatically prefetches elements 1 through 15 into L1 cache for free ($~1$ cycle access).',
            '`std::list` scatters nodes across random heap addresses. Each node access requires waiting for a RAM access ($~200$ CPU cycles). In benchmarks, iterating over `std::vector` is up to 50x faster than `std::list`.'
          ],
          keyRules: [
            'Contiguous arrays are hardware-friendly; linked lists cause cache line misses.',
            'Always favor cache-friendly structures over theoretically lower big-O pointer structures.'
          ],
          codeSnippet: {
            id: 'cpp-snip-17-5',
            title: 'Memory Cache Line Visualizer',
            description: 'Contiguous 64-byte cache line layout vs fragmented pointer nodes',
            language: 'cpp',
            code: `/*
  std::vector (Sequential Cache Line):
  [ 64-Byte L1 Cache Line: Int 0 | Int 1 | Int 2 | Int 3 | Int 4 ... ] -> 100% Cache Hits!

  std::list (Fragmented Heap Nodes):
  [Node @ 0x1A00] ------(200 cycle RAM miss)------> [Node @ 0x9B40] -> Cache Thrashing!
*/`,
          },
          pitfall: 'Choosing linked lists based on theoretical $O(1)$ middle insertion when in practice finding the insertion point takes $O(N)$ slow cache-miss traversals.',
          quickCheck: {
            question: 'Why is `std::vector` significantly faster than `std::list` in practice even when Big-O suggests equal or worse complexity?',
            options: [
              'Vector elements reside contiguously in memory, enabling CPU hardware cache prefetching',
              'Vector is compiled by the operating system kernel',
              'Vector uses 128-bit integers',
              'Vector has no destructor'
            ],
            correctIndex: 0,
            explanation: 'Contiguous memory allows the CPU cache prefetcher to load adjacent elements into L1 cache ahead of execution.',
          },
        },
        {
          id: 'cpp-w3-d17-t6',
          topicNumber: 6,
          title: 'Container Adapters: `std::stack`, `std::queue`, `std::priority_queue`',
          explanation: [
            'Container Adapters do not manage memory directly; they wrap an underlying sequence container and expose a restricted interface.',
            '`std::stack` (LIFO): Defaults to wrapping `std::deque` (provides `push`, `pop`, `top`).',
            '`std::queue` (FIFO): Defaults to wrapping `std::deque` (provides `push`, `pop`, `front`, `back`).',
            '`std::priority_queue` (Max Heap): Defaults to wrapping `std::vector` (provides `push`, `pop`, `top` in $O(\\log N)$ time).'
          ],
          keyRules: [
            'Container adapters do not expose iterators.',
            'You can customize the underlying container: std::stack<int, std::vector<int>> st;'
          ],
          codeSnippet: {
            id: 'cpp-snip-17-6',
            title: 'Container Adapter Usage Patterns',
            description: 'Stack and Queue adapter interfaces',
            language: 'cpp',
            code: `#include <iostream>
#include <stack>
#include <queue>

int main() {
    std::stack<int> s;
    s.push(10);
    s.push(20);
    std::cout << "Stack top: " << s.top() << "\\n"; // 20
    s.pop();

    std::queue<std::string> q;
    q.push("First");
    q.push("Second");
    std::cout << "Queue front: " << q.front() << "\\n"; // First
    q.pop();
    return 0;
}`,
          },
          pitfall: 'Attempting to iterate over a `std::stack` with a range-based for loop fails compilation; adapters hide internal iterators by design.',
          quickCheck: {
            question: 'What is the default underlying container used by `std::stack` and `std::queue`?',
            options: ['std::deque', 'std::vector', 'std::list', 'std::array'],
            correctIndex: 0,
            explanation: 'Both stack and queue default to `std::deque` because it avoids massive reallocations while supporting fast end operations.',
          },
        },
        {
          id: 'cpp-w3-d17-t7',
          topicNumber: 7,
          title: 'Modern `std::erase` & `std::erase_if` (C++20 Uniform Erasure)',
          explanation: [
            'Before C++20, removing elements from a vector required the awkward "Erase-Remove Idiom": `vec.erase(std::remove(vec.begin(), vec.end(), val), vec.end());`.',
            'C++20 introduced unified free functions `std::erase(container, value)` and `std::erase_if(container, predicate)`.',
            'Works uniformly across `std::vector`, `std::deque`, `std::list`, `std::string`, and associative containers.'
          ],
          keyRules: [
            'Use std::erase(vec, 42); to delete all instances of 42.',
            'Use std::erase_if(vec, [](int x){ return x < 0; }); to delete matching elements.'
          ],
          codeSnippet: {
            id: 'cpp-snip-17-7',
            title: 'C++20 std::erase_if Clean Removal',
            description: 'Eliminating the legacy erase-remove idiom with C++20 free functions',
            language: 'cpp',
            code: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> data = {1, 2, 3, 4, 5, 6, 7, 8};

    // In C++20: std::erase_if(data, [](int x){ return x % 2 == 0; });
    // Clean, readable, and highly optimized!
    std::cout << "C++20 std::erase_if simplifies element removal to 1 line.\\n";
    return 0;
}`,
          },
          pitfall: 'Calling `std::remove` without `vec.erase` leaves the vector at its original size with leftover garbage at the end.',
          quickCheck: {
            question: 'What C++20 feature replaces the legacy Erase-Remove idiom (`vec.erase(std::remove(...), ...);`)?',
            options: [
              '`std::erase` and `std::erase_if`',
              '`container.delete_all()`',
              '`container.filter()`',
              '`std::purge`'
            ],
            correctIndex: 0,
            explanation: 'C++20 added `std::erase` and `std::erase_if` free functions for uniform, intuitive element removal.',
          },
        },
        {
          id: 'cpp-w3-d17-t8',
          topicNumber: 8,
          title: 'Day 17 Capstone: High-Throughput Sliding Packet Window',
          explanation: [
            'Synthesizing Day 17 concepts into a Sliding Window packet buffer using `std::deque`.',
            'Demonstrating fixed-capacity ring buffer mechanics, $O(1)$ front and back insertions, and cache-conscious stream management.',
            'Standard architecture for network flow control and audio processing pipelines.'
          ],
          keyRules: [
            'Maintain window size by popping front when size exceeds threshold.',
            'std::deque provides constant-time push_back and pop_front.'
          ],
          codeSnippet: {
            id: 'cpp-snip-17-8',
            title: 'Sliding Window Packet Stream Blueprint',
            description: 'Bounded FIFO window using std::deque',
            language: 'cpp',
            code: `#include <iostream>
#include <deque>

template <typename T>
class SlidingPacketWindow {
private:
    std::deque<T> m_window;
    size_t m_maxSize;

public:
    explicit SlidingPacketWindow(size_t maxSize) : m_maxSize(maxSize) {}

    void addPacket(const T& packet) {
        if (m_window.size() >= m_maxSize) {
            m_window.pop_front(); // O(1) evict oldest
        }
        m_window.push_back(packet); // O(1) enqueue newest
    }

    size_t size() const { return m_window.size(); }
    const T& newest() const { return m_window.back(); }
    const T& oldest() const { return m_window.front(); }
};

int main() {
    SlidingPacketWindow<int> window(3);
    window.addPacket(101);
    window.addPacket(102);
    window.addPacket(103);
    window.addPacket(104); // Evicts 101!

    std::cout << "Window current size: " << window.size() << "\\n";
    std::cout << "Oldest in window:    " << window.oldest() << "\\n"; // 102
    std::cout << "Newest in window:    " << window.newest() << "\\n"; // 104
    return 0;
}`,
          },
          pitfall: 'Using `std::vector` for a sliding window forces $O(N)$ element shifts on every `erase(begin())` call, destroying throughput.',
          quickCheck: {
            question: 'Why is `std::deque` optimal for a sliding window buffer compared to `std::vector`?',
            options: [
              '`std::deque` supports $O(1)$ pop_front() without shifting existing elements',
              'deque uses 0 bytes of memory',
              'vector cannot hold integers',
              'deque runs in the GPU'
            ],
            correctIndex: 0,
            explanation: 'deque removes from the front in O(1) time, while vector requires shifting all N elements leftward.',
          },
        },
      ],
      practiceChallenge: {
        title: 'Day 17 Capstone: Moving Average Calculator using std::deque',
        instructions: [
          'Implement a class `MovingAverage` with window size `N`.',
          'Implement `double next(int val)` that inserts `val`, evicts if window exceeds `N`, and returns the current window average.',
          'Test with a stream of 5 integers and print the moving averages.',
        ],
        starterCode: `#include <iostream>
#include <deque>

class MovingAverage {
    // Implement MovingAverage using std::deque
};

int main() {
    // Test moving average calculation
    return 0;
}`,
        solutionCode: `#include <iostream>
#include <deque>

class MovingAverage {
private:
    std::deque<int> m_vals;
    size_t m_capacity;
    double m_runningSum{0.0};

public:
    explicit MovingAverage(size_t size) : m_capacity(size) {}

    double next(int val) {
        if (m_vals.size() == m_capacity) {
            m_runningSum -= m_vals.front();
            m_vals.pop_front();
        }
        m_vals.push_back(val);
        m_runningSum += val;
        return m_runningSum / m_vals.size();
    }
};

int main() {
    MovingAverage ma(3);
    std::cout << "After 1:  " << ma.next(1) << "\\n";  // 1.0
    std::cout << "After 10: " << ma.next(10) << "\\n"; // 5.5
    std::cout << "After 3:  " << ma.next(3) << "\\n";  // 4.66
    std::cout << "After 5:  " << ma.next(5) << "\\n";  // (10+3+5)/3 = 6.0
    return 0;
}`,
        hints: [
          'Maintain `m_runningSum` to achieve O(1) average calculation instead of looping.',
          'Subtract `m_vals.front()` before popping.',
        ],
      },
      keyTakeaways: [
        '`std::vector` is the default container due to contiguous memory and CPU cache locality.',
        '`std::deque` provides $O(1)$ insertion at both front and back.',
        '`std::list` provides iterator stability at the cost of heap fragmentation and cache misses.',
        'C++20 `std::erase` and `std::erase_if` provide clean, unified element removal.',
      ],
    },

    // Day 18: STL Associative & Hash Containers: map, set, unordered_map & Hash Functions
    {
      id: 'cpp-w3-d18',
      dayNumber: 18,
      weekNumber: 3,
      title: 'Associative & Hash Containers: Tree vs Hash Tables',
      subtitle: 'std::map / std::set (Red-Black Trees) vs std::unordered_map / unordered_set (Hash Tables)',
      durationMinutes: 70,
      overview:
        'Compare ordered balanced binary trees with unordered hash tables in the STL. Learn algorithmic trade-offs (O(log N) vs O(1)), custom hash functions with std::hash, bucket load factors, and heterogeneous lookups.',
      topics: [
        {
          id: 'cpp-w3-d18-t1',
          topicNumber: 1,
          title: 'Ordered Containers (`std::map`, `std::set`): Red-Black Trees',
          explanation: [
            '`std::map<K, V>` and `std::set<K>` are implemented as Self-Balancing Binary Search Trees (specifically Red-Black Trees).',
            'Guarantees strict $O(\\log N)$ worst-case time complexity for search, insertion, and deletion.',
            'Elements are ALWAYS maintained in strictly sorted order according to `operator<` or a custom comparator. In-order traversal visits keys in ascending order.'
          ],
          keyRules: [
            'Requires Key type to implement operator< (strict weak ordering).',
            'Search, insert, and delete are strictly O(log N).',
            'Elements are sorted; supports lower_bound() and upper_bound() range queries.'
          ],
          codeSnippet: {
            id: 'cpp-snip-18-1',
            title: 'std::map Sorted Ordering and Range Bounds',
            description: 'Logarithmic search and ordered in-order iteration',
            language: 'cpp',
            code: `#include <iostream>
#include <map>
#include <string>

int main() {
    std::map<std::string, int> userAges;
    userAges["Charlie"] = 28;
    userAges["Alice"]   = 24;
    userAges["Bob"]     = 31;

    // Iterates in alphabetical order automatically!
    for (const auto& [name, age] : userAges) {
        std::cout << name << ": " << age << "\\n";
    }
    return 0;
}`,
          },
          pitfall: 'Using bracket operator `map[key]` for search: if the key does not exist, `map[key]` default-constructs and inserts a new element into the map! Use `.find()` or `.contains()` instead.',
          quickCheck: {
            question: 'What underlying data structure is used by `std::map` and `std::set` in the C++ standard library?',
            options: ['Red-Black Tree (Self-Balancing Binary Search Tree)', 'Hash Table', 'Dynamic Array', 'Skip List'],
            correctIndex: 0,
            explanation: 'The C++ standard mandates logarithmic ordered guarantees, implemented via Red-Black Trees.',
          },
        },
        {
          id: 'cpp-w3-d18-t2',
          topicNumber: 2,
          title: 'Unordered Containers (`std::unordered_map`, `std::unordered_set`): Hash Tables',
          explanation: [
            '`std::unordered_map<K, V>` and `std::unordered_set<K>` are implemented as Hash Tables with separate chaining buckets.',
            'Provides Average $O(1)$ constant time complexity for search, insertion, and deletion.',
            'Elements are NOT sorted. Order depends on the hash function and bucket layout.'
          ],
          keyRules: [
            'Average time complexity: O(1). Worst case: O(N) during extreme hash collisions.',
            'Requires Key type to support std::hash<K> and operator==.',
            'Much faster than std::map for lookups when sorting is not required.'
          ],
          codeSnippet: {
            id: 'cpp-snip-18-2',
            title: 'std::unordered_map O(1) Fast Lookup',
            description: 'Hash-based key-value lookups in constant time',
            language: 'cpp',
            code: `#include <iostream>
#include <unordered_map>
#include <string>

int main() {
    std::unordered_map<std::string, std::string> dnsCache;
    dnsCache["google.com"] = "142.250.190.46";
    dnsCache["github.com"] = "140.82.121.4";

    // O(1) Lookup
    auto it = dnsCache.find("github.com");
    if (it != dnsCache.end()) {
        std::cout << "IP: " << it->second << "\\n";
    }
    return 0;
}`,
          },
          pitfall: 'Assuming `unordered_map` is always faster than `map`; for small collections (< 50 items), calculating hashes and allocating buckets can be slower than a simple flat array or tree.',
          quickCheck: {
            question: 'What is the average time complexity of finding a key in `std::unordered_map`?',
            options: ['O(1) constant time', 'O(log N)', 'O(N)', 'O(N^2)'],
            correctIndex: 0,
            explanation: 'Hash tables achieve average O(1) lookup time via direct hash bucket indexing.',
          },
        },
        {
          id: 'cpp-w3-d18-t3',
          topicNumber: 3,
          title: 'Custom Hash Functions & `std::hash` Specialization',
          explanation: [
            'Primitive types and `std::string` have built-in `std::hash` implementations.',
            'To use custom structs as keys in `std::unordered_map`, you MUST provide: (1) An equality comparison `operator==`; (2) A hash functor or `std::hash` template specialization.',
            'Combine hash values using the boost hash_combine bit-mixing formula to minimize collisions.'
          ],
          keyRules: [
            'Formula: seed ^= hash(val) + 0x9e3779b9 + (seed << 6) + (seed >> 2);',
            'operator== is mandatory for resolving hash bucket collisions.'
          ],
          codeSnippet: {
            id: 'cpp-snip-18-3',
            title: 'Specializing std::hash for Custom Structs',
            description: 'Enabling custom types as unordered_map keys',
            language: 'cpp',
            code: `#include <iostream>
#include <unordered_map>

struct Point2D {
    int x, y;
    bool operator==(const Point2D& o) const { return x == o.x && y == o.y; }
};

// Specialize std::hash inside namespace std
namespace std {
    template <>
    struct hash<Point2D> {
        size_t operator()(const Point2D& pt) const noexcept {
            // Hash combine formula
            size_t h1 = std::hash<int>{}(pt.x);
            size_t h2 = std::hash<int>{}(pt.y);
            return h1 ^ (h2 + 0x9e3779b9 + (h1 << 6) + (h1 >> 2));
        }
    };
}

int main() {
    std::unordered_map<Point2D, std::string> landmarkMap;
    landmarkMap[{10, 20}] = "City Center";
    std::cout << "Found: " << landmarkMap[{10, 20}] << "\\n";
    return 0;
}`,
          },
          pitfall: 'Defining a hash function that returns the same constant integer for all objects degrades `unordered_map` performance to $O(N)$ linear search.',
          quickCheck: {
            question: 'What two operations must a custom type support to be used as a key in `std::unordered_map`?',
            options: [
              'A hash function (std::hash<T>) and equality operator (operator==)',
              'Less-than operator (operator<) only',
              'A copy constructor and destructor only',
              'A virtual method table'
            ],
            correctIndex: 0,
            explanation: 'The hash table needs `std::hash` to pick a bucket, and `operator==` to check for equality inside that bucket.',
          },
        },
        {
          id: 'cpp-w3-d18-t4',
          topicNumber: 4,
          title: 'Bucket Layout, Load Factor & `rehash()`',
          explanation: [
            '`std::unordered_map` organizes elements into a dynamic array of "Buckets".',
            'Load Factor = `size() / bucket_count()`. The default `max_load_factor()` is 1.0.',
            'When the load factor exceeds 1.0, the container automatically performs a "Rehash": it allocates a larger array of buckets and re-hashes every existing element. Call `.reserve(N)` to avoid rehashing overhead in advance.'
          ],
          keyRules: [
            'Load factor > 1.0 triggers rehashing and re-indexing.',
            'reserve(N) pre-allocates enough buckets to hold N elements without rehashing.'
          ],
          codeSnippet: {
            id: 'cpp-snip-18-4',
            title: 'Inspecting Buckets and Load Factors',
            description: 'Monitoring hash table internals and rehash triggers',
            language: 'cpp',
            code: `#include <iostream>
#include <unordered_map>

int main() {
    std::unordered_map<int, int> map;
    map.reserve(100); // Pre-allocate buckets

    std::cout << "Bucket count:    " << map.bucket_count() << "\\n";
    std::cout << "Load factor:     " << map.load_factor() << "\\n";
    std::cout << "Max load factor: " << map.max_load_factor() << "\\n";
    return 0;
}`,
          },
          pitfall: 'Frequent rehashing in real-time loops causes latency spikes; always call `map.reserve(expectedSize)` upfront.',
          quickCheck: {
            question: 'What is the "Load Factor" of a hash table?',
            options: [
              'The ratio of elements to the number of allocated buckets (size / bucket_count)',
              'The CPU utilization percentage',
              'The size of the keys in bytes',
              'The number of collisions'
            ],
            correctIndex: 0,
            explanation: 'Load factor measures how full the hash table is by dividing element count by total buckets.',
          },
        },
        {
          id: 'cpp-w3-d18-t5',
          topicNumber: 5,
          title: 'Heterogeneous Lookup in Associative Containers (C++14 / C++20)',
          explanation: [
            'Historically, looking up a string literal in `std::map<std::string, int>` using `map.find("key")` constructed an expensive temporary `std::string` object on the heap!',
            'C++14 added Heterogeneous Lookup for `std::map` using `std::less<>`.',
            'C++20 expanded Heterogeneous Lookup to `std::unordered_map`: passing `std::string_view` searches the map directly without constructing a temporary `std::string`!'
          ],
          keyRules: [
            'std::map<std::string, int, std::less<>> enables transparent lookup.',
            'Eliminates temporary string allocations during lookups.'
          ],
          codeSnippet: {
            id: 'cpp-snip-18-5',
            title: 'Zero-Allocation Heterogeneous Lookup',
            description: 'Querying string maps with string_view without temporary allocations',
            language: 'cpp',
            code: `#include <iostream>
#include <map>
#include <string>
#include <string_view>

int main() {
    // std::less<> enables heterogeneous transparent lookup in C++14+
    std::map<std::string, int, std::less<>> dictionary;
    dictionary["compile"] = 1;
    dictionary["link"]    = 2;

    std::string_view query = "compile";
    // 0 heap allocations! Searches string_view directly against std::string!
    auto it = dictionary.find(query);
    if (it != dictionary.end()) {
        std::cout << "Found: " << it->first << " -> " << it->second << "\\n";
    }
    return 0;
}`,
          },
          pitfall: 'Omitting `std::less<>` comparator falls back to `std::less<Key>`, which forces construction of a temporary `std::string` on every lookup.',
          quickCheck: {
            question: 'What problem does Heterogeneous Lookup solve in C++ associative containers?',
            options: [
              'It eliminates creating temporary key objects (like std::string) during lookup with string_view or const char*',
              'It allows storing multiple data types in the same map',
              'It encrypts map entries',
              'It makes lookups multi-threaded'
            ],
            correctIndex: 0,
            explanation: 'Heterogeneous lookup allows searching using compatible types (like `std::string_view`) without allocating temporary key objects.',
          },
        },
        {
          id: 'cpp-w3-d18-t6',
          topicNumber: 6,
          title: '`contains()` & `try_emplace()` in Modern C++',
          explanation: [
            'C++20 added `.contains(key)`: returns `bool`, replacing verbose `if (map.find(k) != map.end())`.',
            'C++17 added `.try_emplace(key, args...)`: inserts only if the key does NOT already exist, constructing the value in-place without moving or copying if the key already exists.',
            'Much safer and more efficient than `insert()` or `operator[]`.'
          ],
          keyRules: [
            'Use map.contains(key) for clean presence checks.',
            'Use map.try_emplace(key, args) to avoid unnecessary value constructions.'
          ],
          codeSnippet: {
            id: 'cpp-snip-18-6',
            title: 'Modern map.contains() and try_emplace()',
            description: 'Cleaner presence checks and efficient in-place insertion',
            language: 'cpp',
            code: `#include <iostream>
#include <unordered_map>
#include <string>

int main() {
    std::unordered_map<std::string, int> scores;
    scores["Alice"] = 95;

    // C++20 contains() check
    if (scores.contains("Alice")) {
        std::cout << "Alice is registered in database!\\n";
    }

    // C++17 try_emplace: will NOT overwrite existing Alice, zero redundant work!
    scores.try_emplace("Alice", 100);
    std::cout << "Alice score remains: " << scores["Alice"] << "\\n"; // 95
    return 0;
}`,
          },
          pitfall: 'Using `map[key] == value` to check if a key exists; this silently inserts a default element if the key is absent.',
          quickCheck: {
            question: 'What method was added in C++20 to check if a key exists in a map without iterator boilerplate?',
            options: ['map.contains(key)', 'map.has(key)', 'map.exists(key)', 'map.includes(key)'],
            correctIndex: 0,
            explanation: 'C++20 standardized `.contains(key)` across all associative and unordered associative containers.',
          },
        },
        {
          id: 'cpp-w3-d18-t7',
          topicNumber: 7,
          title: 'Multi-Containers: `std::multimap` & `std::multiset`',
          explanation: [
            '`std::multimap` and `std::multiset` permit duplicate keys.',
            'Because keys are not unique, `operator[]` is NOT supported.',
            'To retrieve all elements matching a duplicate key, use `.equal_range(key)` which returns a pair of iterators `[begin, end)` spanning all matching entries.'
          ],
          keyRules: [
            'Duplicate keys permitted.',
            'Use auto [first, last] = mmap.equal_range(key) to iterate over duplicate matches.'
          ],
          codeSnippet: {
            id: 'cpp-snip-18-7',
            title: 'equal_range on std::multimap',
            description: 'Handling duplicate keys in multi-containers',
            language: 'cpp',
            code: `#include <iostream>
#include <map>
#include <string>

int main() {
    std::multimap<std::string, std::string> phoneBook;
    phoneBook.insert({"Alice", "555-0101"});
    phoneBook.insert({"Alice", "555-0199"});
    phoneBook.insert({"Bob",   "555-0202"});

    auto [begin, end] = phoneBook.equal_range("Alice");
    std::cout << "Alice numbers:\\n";
    for (auto it = begin; it != end; ++it) {
        std::cout << "  " << it->second << "\\n";
    }
    return 0;
}`,
          },
          pitfall: 'Calling `multimap.find(key)` only returns an iterator to the FIRST matching element, ignoring all subsequent duplicates.',
          quickCheck: {
            question: 'What method retrieves all elements matching a key in a `std::multimap`?',
            options: ['equal_range(key)', 'find_all(key)', 'get_range(key)', 'slice(key)'],
            correctIndex: 0,
            explanation: 'equal_range(key) returns a std::pair of iterators covering all elements with the matching key.',
          },
        },
        {
          id: 'cpp-w3-d18-t8',
          topicNumber: 8,
          title: 'Day 18 Capstone: In-Memory Symbol Table with Fast Lookups',
          explanation: [
            'Synthesizing Day 18 concepts into a compiler Symbol Table using `std::unordered_map`.',
            'Demonstrating custom structs, `try_emplace`, `contains`, and scope-level symbol resolution.',
            'Forms the foundational core of compilers, interpreters, and database query planning engines.'
          ],
          keyRules: [
            'Fast O(1) identifier resolution.',
            'Clean presence checking with .contains().'
          ],
          codeSnippet: {
            id: 'cpp-snip-18-8',
            title: 'Compiler Symbol Table Blueprint',
            description: 'Fast identifier lookup engine using modern unordered_map',
            language: 'cpp',
            code: `#include <iostream>
#include <unordered_map>
#include <string>

enum class SymbolKind { VARIABLE, FUNCTION, TYPE_DEF };

struct SymbolInfo {
    SymbolKind kind;
    int scopeLevel;
    std::string typeName;
};

class SymbolTable {
private:
    std::unordered_map<std::string, SymbolInfo> m_table;
public:
    bool declare(const std::string& name, SymbolKind kind, int scope, const std::string& type) {
        if (m_table.contains(name)) return false; // Already declared in this scope!
        m_table.try_emplace(name, SymbolInfo{kind, scope, type});
        return true;
    }

    const SymbolInfo* lookup(const std::string& name) const {
        auto it = m_table.find(name);
        return (it != m_table.end()) ? &it->second : nullptr;
    }
};

int main() {
    SymbolTable syms;
    syms.declare("g_bandwidth", SymbolKind::VARIABLE, 0, "uint64_t");
    syms.declare("calculateThroughput", SymbolKind::FUNCTION, 0, "double()");

    if (const auto* s = syms.lookup("g_bandwidth")) {
        std::cout << "Symbol found: type=" << s->typeName << "\\n";
    }
    return 0;
}`,
          },
          pitfall: 'Using `operator[]` on a const symbol table fails compilation; always use `.find()`.',
          quickCheck: {
            question: 'Why is `std::unordered_map` preferred over `std::map` for compiler symbol tables?',
            options: [
              'Average O(1) lookup speed provides maximum compiler throughput for thousands of identifiers',
              'Because symbol names cannot be sorted',
              'Because map cannot store structs',
              'To save disk space'
            ],
            correctIndex: 0,
            explanation: 'Symbol tables perform massive volumes of lookups where average O(1) hash table speed is paramount.',
          },
        },
      ],
      practiceChallenge: {
        title: 'Day 18 Capstone: Word Frequency Counter using std::unordered_map',
        instructions: [
          'Create a class `WordCounter` that accepts strings and tallies their frequencies.',
          'Implement `void record(const std::string& word)` and `int getFrequency(const std::string& word) const`.',
          'Ensure `getFrequency` does NOT insert default values for missing words.',
        ],
        starterCode: `#include <iostream>
#include <unordered_map>
#include <string>

class WordCounter {
    // Implement WordCounter
};

int main() {
    // Test frequency counts
    return 0;
}`,
        solutionCode: `#include <iostream>
#include <unordered_map>
#include <string>

class WordCounter {
private:
    std::unordered_map<std::string, int> m_counts;
public:
    void record(const std::string& word) {
        m_counts[word]++;
    }

    int getFrequency(const std::string& word) const {
        auto it = m_counts.find(word);
        return (it != m_counts.end()) ? it->second : 0;
    }
};

int main() {
    WordCounter wc;
    wc.record("cpp");
    wc.record("systems");
    wc.record("cpp");

    std::cout << "cpp frequency:     " << wc.getFrequency("cpp") << "\\n";     // 2
    std::cout << "systems frequency: " << wc.getFrequency("systems") << "\\n"; // 1
    std::cout << "rust frequency:    " << wc.getFrequency("rust") << "\\n";    // 0
    return 0;
}`,
        hints: [
          'In `getFrequency`, use `m_counts.find(word)` instead of `m_counts[word]`.',
        ],
      },
      keyTakeaways: [
        '`std::map` uses Red-Black Trees with guaranteed $O(\\log N)$ sorted order.',
        '`std::unordered_map` uses Hash Tables with average $O(1)$ constant lookup.',
        'Never use `map[key]` for read-only inspection; use `.find()` or C++20 `.contains()`.',
        'Heterogeneous lookup eliminates temporary key allocations when querying with `std::string_view`.',
      ],
    },

    // Day 19: STL Iterators, Algorithms (<algorithm>), Lambdas & Custom Predicates
    {
      id: 'cpp-w3-d19',
      dayNumber: 19,
      weekNumber: 3,
      title: 'STL Algorithms (`<algorithm>`), Iterators & Lambdas',
      subtitle: 'The 5 iterator categories, std::sort, std::transform, std::accumulate & lambda predicates',
      durationMinutes: 70,
      overview:
        'Master the algorithm engine of C++. Learn the 5 iterator categories, why raw for-loops are an anti-pattern in modern C++, standard algorithms (<algorithm>, <numeric>), custom lambda predicates, and execution policies for parallel sorting.',
      topics: [
        {
          id: 'cpp-w3-d19-t1',
          topicNumber: 1,
          title: 'The 5 Standard Iterator Categories',
          explanation: [
            'Iterators act as the glue connecting STL containers with STL algorithms.',
            '1. Input Iterator: Read-once, single pass forward (e.g. `std::istream_iterator`).',
            '2. Output Iterator: Write-once, single pass forward (e.g. `std::ostream_iterator`).',
            '3. Forward Iterator: Multi-pass read/write forward (e.g. `std::forward_list`).',
            '4. Bidirectional Iterator: Forward and backward traversal (`++`, `--`) (e.g. `std::list`, `std::map`, `std::set`).',
            '5. Random Access Iterator: $O(1)$ pointer math, bracket indexing (`+`, `-`, `[]`, `<`) (e.g. `std::vector`, `std::array`, `std::deque`, raw pointers).'
          ],
          keyRules: [
            'std::sort requires Random Access Iterators (cannot sort std::list directly; use list.sort()).',
            'Half-open ranges [first, last) encompass elements from first up to (excluding) last.'
          ],
          codeSnippet: {
            id: 'cpp-snip-19-1',
            title: 'Iterator Category Requirements',
            description: 'Why std::sort requires Random Access Iterators',
            language: 'cpp',
            code: `#include <iostream>
#include <vector>
#include <list>
#include <algorithm>

int main() {
    std::vector<int> vec = {5, 2, 8, 1};
    std::sort(vec.begin(), vec.end()); // OK: vector iterators are Random Access!

    std::list<int> lst = {5, 2, 8, 1};
    // std::sort(lst.begin(), lst.end()); // COMPILE ERROR: list has Bidirectional iterators!
    lst.sort(); // OK: member function sort uses pointer manipulation

    for (int x : vec) std::cout << x << " ";
    std::cout << "\\n";
    return 0;
}`,
          },
          pitfall: 'Passing non-random-access iterators (like `std::list::begin()`) to `std::sort` generates pages of template compilation errors; use container member sort instead.',
          quickCheck: {
            question: 'What iterator category is required by `std::sort`?',
            options: ['Random Access Iterator', 'Bidirectional Iterator', 'Forward Iterator', 'Input Iterator'],
            correctIndex: 0,
            explanation: 'std::sort uses Introsort (QuickSort + HeapSort), requiring O(1) random access jumps between elements.',
          },
        },
        {
          id: 'cpp-w3-d19-t2',
          topicNumber: 2,
          title: '`std::sort` & Custom Lambda Comparators',
          explanation: [
            '`std::sort` is implemented as Introsort (a hybrid of QuickSort, HeapSort, and InsertionSort) with guaranteed $O(N \\log N)$ worst-case time complexity.',
            'By default, it sorts in ascending order using `operator<`.',
            'You can supply custom comparator lambdas: `[](const auto& a, const auto& b) { return a.score > b.score; }` for descending or multi-field sorting.'
          ],
          keyRules: [
            'Comparators must implement Strict Weak Ordering (if a < b is true, b < a must be false; a < a must be false).',
            'Using <= in a comparator violates strict weak ordering and can cause memory corruption or infinite loops.'
          ],
          codeSnippet: {
            id: 'cpp-snip-19-2',
            title: 'Custom Sorting with Lambdas',
            description: 'Sorting custom objects by multiple criteria using std::sort',
            language: 'cpp',
            code: `#include <iostream>
#include <vector>
#include <algorithm>
#include <string>

struct Athlete {
    std::string name;
    int points;
};

int main() {
    std::vector<Athlete> leaderboard = {
        {"Alice", 85}, {"Bob", 95}, {"Charlie", 90}
    };

    // Sort descending by points
    std::sort(leaderboard.begin(), leaderboard.end(), [](const Athlete& a, const Athlete& b) {
        return a.points > b.points;
    });

    for (const auto& a : leaderboard) {
        std::cout << a.name << ": " << a.points << "\\n";
    }
    return 0;
}`,
          },
          pitfall: 'Writing `return a <= b;` instead of `return a < b;` in a comparator triggers undefined behavior in `std::sort` because `a < a` must strictly evaluate to false.',
          quickCheck: {
            question: 'Why must comparator functions in `std::sort` use `<` (strict weak ordering) instead of `<=`?',
            options: [
              'Because `a < a` must evaluate to false; returning true for equal elements causes buffer out-of-bounds in QuickSort',
              'Because `<=` is deprecated in C++',
              'Because `<=` is only for floats',
              'To sort backwards'
            ],
            correctIndex: 0,
            explanation: 'Strict weak ordering mandates irreflexivity (x < x is always false); violating this causes QuickSort partitioning to overrun array bounds.',
          },
        },
        {
          id: 'cpp-w3-d19-t3',
          topicNumber: 3,
          title: 'Transformation Pipelines: `std::transform`',
          explanation: [
            '`std::transform` applies a transformation function to each element in a range and writes the result to an output iterator.',
            'Can transform in-place (`vec.begin()` as destination) or write to an entirely different container using `std::back_inserter`.',
            'Also supports binary transformation taking two input ranges and combining them.'
          ],
          keyRules: [
            'std::back_inserter(dest) calls push_back() automatically, resizing dest as needed.',
            'Transforming in-place is highly cache-efficient.'
          ],
          codeSnippet: {
            id: 'cpp-snip-19-3',
            title: 'std::transform with std::back_inserter',
            description: 'Functional mapping of ranges to new containers',
            language: 'cpp',
            code: `#include <iostream>
#include <vector>
#include <algorithm>
#include <iterator>

int main() {
    std::vector<int> inputs = {1, 2, 3, 4, 5};
    std::vector<int> squares;

    // std::back_inserter appends to squares automatically!
    std::transform(inputs.begin(), inputs.end(), std::back_inserter(squares), [](int x) {
        return x * x;
    });

    for (int sq : squares) std::cout << sq << " ";
    std::cout << "\\n"; // 1 4 9 16 25
    return 0;
}`,
          },
          pitfall: 'Passing an empty destination vector without `std::back_inserter` causes out-of-bounds memory writes because `std::transform` does not allocate space on its own.',
          quickCheck: {
            question: 'What iterator adapter allows `std::transform` to write into an empty vector by calling `push_back()` automatically?',
            options: ['std::back_inserter', 'std::front_inserter', 'std::inserter', 'std::ostream_iterator'],
            correctIndex: 0,
            explanation: '`std::back_inserter` returns an output iterator whose operator= calls `push_back()` on the container.',
          },
        },
        {
          id: 'cpp-w3-d19-t4',
          topicNumber: 4,
          title: 'Reduction & Numeric Operations: `std::accumulate` & `std::reduce`',
          explanation: [
            'Found in header `<numeric>`.',
            '`std::accumulate(begin, end, initVal, op)` folds a sequence into a single scalar value (e.g. summing elements, computing products, string concatenation).',
            'C++17 introduced `std::reduce`: Unlike `accumulate` which is strictly sequential left-to-right, `reduce` is associative and can execute out-of-order in parallel across CPU cores!'
          ],
          keyRules: [
            'std::accumulate requires #include <numeric>.',
            'Always match initVal type to desired output type: 0.0 for double, 0 for int, 0ULL for uint64_t.'
          ],
          codeSnippet: {
            id: 'cpp-snip-19-4',
            title: 'Fold Reductions with std::accumulate',
            description: 'Summing and aggregating containers with custom operations',
            language: 'cpp',
            code: `#include <iostream>
#include <vector>
#include <numeric>

int main() {
    std::vector<int> values = {10, 20, 30, 40};

    // 1. Standard sum (initial value 0)
    int sum = std::accumulate(values.begin(), values.end(), 0);

    // 2. Custom product operation
    int product = std::accumulate(values.begin(), values.end(), 1, [](int acc, int x) {
        return acc * x;
    });

    std::cout << "Sum:     " << sum << "\\n";     // 100
    std::cout << "Product: " << product << "\\n"; // 240000
    return 0;
}`,
          },
          pitfall: 'Passing an integer literal `0` as the initial value when summing floating-point numbers: `std::accumulate(v.begin(), v.end(), 0)` truncates all intermediate results to `int`! Pass `0.0` instead.',
          quickCheck: {
            question: 'What header file must be included to use `std::accumulate` and `std::reduce`?',
            options: ['<numeric>', '<algorithm>', '<functional>', '<cmath>'],
            correctIndex: 0,
            explanation: '<numeric> contains mathematical and reduction algorithms including accumulate, reduce, and iota.',
          },
        },
        {
          id: 'cpp-w3-d19-t5',
          topicNumber: 5,
          title: 'Searching Algorithms: `find_if`, `all_of`, `any_of`, `none_of`',
          explanation: [
            'Replace manual for-loops with expressive standard boolean search algorithms.',
            '`std::find_if`: Returns iterator to first element matching predicate (or `end()` if none).',
            '`std::all_of`: Returns `true` if ALL elements satisfy predicate.',
            '`std::any_of`: Returns `true` if AT LEAST ONE element satisfies predicate.',
            '`std::none_of`: Returns `true` if NO elements satisfy predicate.'
          ],
          keyRules: [
            'Short-circuiting: any_of stops scanning as soon as the first true is encountered.',
            'Clean functional declarations eliminate nested loop bugs.'
          ],
          codeSnippet: {
            id: 'cpp-snip-19-5',
            title: 'Predicate Search Algorithms',
            description: 'Declarative queries across collections',
            language: 'cpp',
            code: `#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> latencies = {12, 18, 15, 45, 22};

    bool hasSpike = std::any_of(latencies.begin(), latencies.end(), [](int l) {
        return l > 40;
    });

    bool allAcceptable = std::all_of(latencies.begin(), latencies.end(), [](int l) {
        return l < 100;
    });

    std::cout << "Has latency spike: " << (hasSpike ? "YES" : "NO") << "\\n";
    std::cout << "All acceptable:    " << (allAcceptable ? "YES" : "NO") << "\\n";
    return 0;
}`,
          },
          pitfall: 'Calling `std::find_if` on empty containers returns `end()`; forgetting to check `it != vec.end()` before dereferencing causes crashes.',
          quickCheck: {
            question: 'What does `std::any_of` return if an empty container is passed?',
            options: ['false', 'true', 'nullptr', 'compiler error'],
            correctIndex: 0,
            explanation: 'If a container is empty, there are no elements that satisfy the condition, so `any_of` returns `false`.',
          },
        },
        {
          id: 'cpp-w3-d19-t6',
          topicNumber: 6,
          title: 'Binary Search: `std::lower_bound`, `std::upper_bound` & `binary_search`',
          explanation: [
            'To search in $O(\\log N)$ time across contiguous vectors, the container MUST be sorted in advance.',
            '`std::binary_search`: Returns `bool` (true if element exists).',
            '`std::lower_bound`: Returns iterator to the first element that is NOT LESS than value (>= value).',
            '`std::upper_bound`: Returns iterator to the first element strictly GREATER than value (> value).'
          ],
          keyRules: [
            'The range must be sorted in advance; calling binary search on an unsorted range is undefined behavior.',
            'lower_bound and upper_bound identify exact insertion ranges in O(log N).'
          ],
          codeSnippet: {
            id: 'cpp-snip-19-6',
            title: 'Logarithmic Binary Search Ranges',
            description: 'lower_bound and upper_bound range queries on sorted vectors',
            language: 'cpp',
            code: `#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> sortedScores = {10, 20, 20, 20, 30, 40};

    auto lb = std::lower_bound(sortedScores.begin(), sortedScores.end(), 20);
    auto ub = std::upper_bound(sortedScores.begin(), sortedScores.end(), 20);

    std::cout << "lower_bound (>= 20) index: " << (lb - sortedScores.begin()) << "\\n"; // 1
    std::cout << "upper_bound (> 20) index:  " << (ub - sortedScores.begin()) << "\\n"; // 4
    std::cout << "Total count of 20s:        " << (ub - lb) << "\\n";                 // 3
    return 0;
}`,
          },
          pitfall: 'Calling `std::lower_bound` on an unsorted vector produces invalid results or infinite loops.',
          quickCheck: {
            question: 'What does `std::lower_bound(begin, end, val)` return on a sorted range?',
            options: [
              'An iterator to the first element that is greater than or equal to val (>= val)',
              'An iterator to the element strictly less than val',
              'The boolean true or false',
              'The index of val'
            ],
            correctIndex: 0,
            explanation: '`lower_bound` finds the first element not less than `val` (i.e. `>= val`).',
          },
        },
        {
          id: 'cpp-w3-d19-t7',
          topicNumber: 7,
          title: 'Parallel Algorithms with Execution Policies (C++17)',
          explanation: [
            'C++17 introduced multi-core Parallel Algorithms in `<execution>`.',
            'Pass an Execution Policy as the first argument to over 60 standard algorithms:',
            '1. `std::execution::seq`: Sequential single-threaded execution.',
            '2. `std::execution::par`: Multi-threaded parallel execution across available CPU cores.',
            '3. `std::execution::par_unseq`: Parallel and SIMD vectorized execution.'
          ],
          keyRules: [
            'Include <execution>. Requires linking with Intel TBB or GCC libgomp on Linux (-ltbb).',
            'Predicates and lambdas must be thread-safe with no shared mutable state.'
          ],
          codeSnippet: {
            id: 'cpp-snip-19-7',
            title: 'C++17 Multi-Core Parallel Sorting',
            description: 'Sorting 10,000,000 elements across all CPU threads',
            language: 'cpp',
            code: `#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    // In C++17 with <execution>:
    // std::sort(std::execution::par, largeDataset.begin(), largeDataset.end());
    std::cout << "Parallel execution policies speed up sorting across multi-core CPUs by 4x-8x.\\n";
    return 0;
}`,
          },
          pitfall: 'Using parallel execution policies on small collections introduces thread pool dispatch overhead that is slower than single-threaded execution.',
          quickCheck: {
            question: 'What execution policy in C++17 enables parallel multi-threaded sorting?',
            options: ['std::execution::par', 'std::execution::thread', 'std::execution::async', 'std::execution::multi'],
            correctIndex: 0,
            explanation: '`std::execution::par` directs the algorithm to execute in parallel across available CPU threads.',
          },
        },
        {
          id: 'cpp-w3-d19-t8',
          topicNumber: 8,
          title: 'Day 19 Capstone: High-Speed Analytical Telemetry Pipeline',
          explanation: [
            'Synthesizing Day 19 algorithms into an industrial telemetry data analytics pipeline.',
            'Demonstrating `std::sort`, `std::transform`, `std::accumulate`, `std::copy_if`, and lambda predicates.',
            'Zero raw loops; clean, expressive, composable data transformations.'
          ],
          keyRules: [
            'Express complex business logic via composable STL algorithm pipelines.',
            'Avoid raw loops for standard filtering, mapping, and reducing tasks.'
          ],
          codeSnippet: {
            id: 'cpp-snip-19-8',
            title: 'Telemetry Analytics Pipeline Blueprint',
            description: 'Composing algorithms for filtering and statistical analysis',
            language: 'cpp',
            code: `#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>

struct Metric {
    std::string tag;
    double latencyMs;
};

int main() {
    std::vector<Metric> stream = {
        {"login", 4.2}, {"api_query", 18.5}, {"cache_hit", 1.2},
        {"db_write", 35.0}, {"auth", 12.1}
    };

    // 1. Filter out cache hits (> 2ms)
    std::vector<Metric> slowRequests;
    std::copy_if(stream.begin(), stream.end(), std::back_inserter(slowRequests), [](const Metric& m) {
        return m.latencyMs > 2.0;
    });

    // 2. Sort slow requests descending
    std::sort(slowRequests.begin(), slowRequests.end(), [](const Metric& a, const Metric& b) {
        return a.latencyMs > b.latencyMs;
    });

    // 3. Compute total latency
    double totalMs = std::accumulate(slowRequests.begin(), slowRequests.end(), 0.0, [](double acc, const Metric& m) {
        return acc + m.latencyMs;
    });

    std::cout << "Filtered " << slowRequests.size() << " slow requests. Total: " << totalMs << " ms\\n";
    for (const auto& r : slowRequests) {
        std::cout << "  " << r.tag << ": " << r.latencyMs << " ms\\n";
    }
    return 0;
}`,
          },
          pitfall: 'Re-inventing sorting and searching with hand-written nested loops introduces edge-case index bugs.',
          quickCheck: {
            question: 'What is the primary architectural philosophy regarding raw loops in modern C++?',
            options: [
              'Replace raw loops with named, well-tested STL algorithms (e.g. std::transform, std::accumulate)',
              'Always use while loops instead of for loops',
              'Loops are deprecated in C++20',
              'Loops must run on the GPU'
            ],
            correctIndex: 0,
            explanation: 'Replacing raw loops with STL algorithms improves readability, eliminates off-by-one errors, and enables parallel optimization.',
          },
        },
      ],
      practiceChallenge: {
        title: 'Day 19 Capstone: In-Place Range Normalization Pipeline',
        instructions: [
          'Given a `std::vector<double>` of sensor readings, find the maximum value using `std::max_element`.',
          'Use `std::transform` to normalize all elements in-place to the range `[0.0, 1.0]` by dividing by the maximum value.',
          'Print the normalized vector.',
        ],
        starterCode: `#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<double> readings = {10.0, 25.0, 50.0, 100.0};
    // Normalize readings in-place
    return 0;
}`,
        solutionCode: `#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<double> readings = {10.0, 25.0, 50.0, 100.0};

    auto maxIt = std::max_element(readings.begin(), readings.end());
    double maxVal = *maxIt;

    std::transform(readings.begin(), readings.end(), readings.begin(), [maxVal](double val) {
        return val / maxVal;
    });

    std::cout << "Normalized readings: ";
    for (double r : readings) std::cout << r << " ";
    std::cout << "\\n";
    return 0;
}`,
        hints: [
          'Use `*std::max_element(readings.begin(), readings.end())` to find the maximum.',
          'Pass `readings.begin()` as both source and destination to `std::transform` for in-place mutation.',
        ],
      },
      keyTakeaways: [
        '`std::sort` requires Random Access Iterators and Strict Weak Ordering.',
        'Use `std::transform` with `std::back_inserter` for functional mapping.',
        '`std::accumulate` (in `<numeric>`) folds ranges into aggregated scalar metrics.',
        'Binary search functions (`lower_bound`/`upper_bound`) provide fast $O(\\log N)$ range lookups.',
      ],
    },

    // Day 20: Modern C++20: Concepts, Ranges, Coroutines & Modules
    {
      id: 'cpp-w3-d20',
      dayNumber: 20,
      weekNumber: 3,
      title: 'Modern C++20: Concepts, Ranges & Modules',
      subtitle: 'Type constraints with concept & requires, composable std::views pipelines, and C++20 Modules',
      durationMinutes: 70,
      overview:
        'Explore the biggest modern evolution of C++: C++20. Master Concepts to replace SFINAE with readable compile-time constraints, composable lazy evaluation pipelines with Ranges (std::views), and C++20 Modules eliminating legacy header includes.',
      topics: [
        {
          id: 'cpp-w3-d20-t1',
          topicNumber: 1,
          title: 'C++20 Concepts: Readable Compile-Time Type Constraints',
          explanation: [
            'Historically, template errors produced hundreds of lines of impenetrable compiler diagnostics when a type lacked a required method.',
            'C++20 Concepts define named compile-time requirements on template parameters: `template <std::integral T> void process(T val);`.',
            'If a caller passes an incompatible type (e.g. `double` to an `integral` concept), the compiler emits a single clean 1-line error: "constraints not satisfied: type is not integral".'
          ],
          keyRules: [
            'Use standard concepts from <concepts>: std::integral, std::floating_point, std::copyable.',
            'Significantly improves compiler error readability and code documentation.'
          ],
          codeSnippet: {
            id: 'cpp-snip-20-1',
            title: 'Constraining Templates with C++20 Concepts',
            description: 'Enforcing type constraints using standard concepts',
            language: 'cpp',
            code: `#include <iostream>
#include <concepts>

// Constrained template: accepts ONLY integral types (int, long, short)
template <std::integral T>
T gcd(T a, T b) {
    while (b != 0) {
        T temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

int main() {
    std::cout << "GCD(48, 18): " << gcd(48, 18) << "\\n";
    // gcd(3.14, 2.71); // Clean compile error: 'double' does not satisfy 'std::integral'!
    return 0;
}`,
          },
          pitfall: 'Writing unconstrained templates (`template <typename T>`) allows completely invalid types into functions, producing confusing error messages deep in internal code.',
          quickCheck: {
            question: 'What is the primary benefit of C++20 Concepts?',
            options: [
              'Clear compile-time error messages and explicit template requirements',
              'They convert C++ code to Python',
              'They disable the linker',
              'They allocate memory in the cloud'
            ],
            correctIndex: 0,
            explanation: 'Concepts explicitly validate template arguments at compile time, turning pages of compiler errors into a single readable message.',
          },
        },
        {
          id: 'cpp-w3-d20-t2',
          topicNumber: 2,
          title: 'Defining Custom Concepts with `concept` and `requires`',
          explanation: [
            'You can define your own domain-specific concepts using the `concept` keyword and `requires` expressions.',
            'A requires expression tests syntactic validity: does the type have a `.serialize()` method? Does `a + b` return a type convertible to `int`?',
            'Syntax: `template <typename T> concept Serializable = requires(T a) { a.serialize(); };`.'
          ],
          keyRules: [
            'template <typename T> concept Name = requires(T x) { ... };',
            'Can enforce method existence, nested types, and return type constraints.'
          ],
          codeSnippet: {
            id: 'cpp-snip-20-2',
            title: 'Custom Concept Definition',
            description: 'Creating custom concept to enforce serialization interface',
            language: 'cpp',
            code: `#include <iostream>
#include <concepts>
#include <string>

// Custom concept: requires .getId() returning an integer
template <typename T>
concept Identifiable = requires(T obj) {
    { obj.getId() } -> std::integral;
};

struct Device {
    int id{1001};
    int getId() const { return id; }
};

template <Identifiable T>
void logIdentifier(const T& entity) {
    std::cout << "Entity ID: " << entity.getId() << "\\n";
}

int main() {
    Device dev;
    logIdentifier(dev); // Compiles cleanly: Device satisfies Identifiable!
    return 0;
}`,
          },
          pitfall: 'Expecting `requires` expressions to execute at runtime; requires expressions are strictly unevaluated compile-time syntax tests.',
          quickCheck: {
            question: 'What keyword defines a compile-time concept in C++20?',
            options: ['concept', 'interface', 'trait', 'require'],
            correctIndex: 0,
            explanation: 'C++20 introduced the `concept` keyword for defining named template type requirements.',
          },
        },
        {
          id: 'cpp-w3-d20-t3',
          topicNumber: 3,
          title: 'Abbreviated Function Templates with `auto` Parameters',
          explanation: [
            'C++20 allows using concepts directly with `auto` in function parameter lists.',
            'Instead of writing `template <std::integral T> void f(T x)`, you can write simply: `void f(std::integral auto x)`.',
            'Provides ultra-clean, terse syntax while retaining full compile-time template safety.'
          ],
          keyRules: [
            'void f(auto x); is an unconstrained template.',
            'void f(std::integral auto x); is a constrained template.'
          ],
          codeSnippet: {
            id: 'cpp-snip-20-3',
            title: 'Abbreviated Function Templates (C++20)',
            description: 'Constrained auto parameters in function signatures',
            language: 'cpp',
            code: `#include <iostream>
#include <concepts>

// Terse modern C++20 abbreviated function template
void displayDouble(std::floating_point auto number) {
    std::cout << "Floating point value: " << number << "\\n";
}

int main() {
    displayDouble(3.14159); // Legal: double is floating_point
    displayDouble(2.5f);     // Legal: float is floating_point
    // displayDouble(10);    // ERROR: int is not floating_point!
    return 0;
}`,
          },
          pitfall: 'Assuming `void f(auto x)` is a regular non-template function; it is actually a template that will be instantiated separately for each argument type.',
          quickCheck: {
            question: 'What is `void print(std::integral auto x)` in C++20?',
            options: [
              'An abbreviated function template constrained to integral types',
              'A non-template function',
              'A virtual method',
              'A dynamic script function'
            ],
            correctIndex: 0,
            explanation: 'Using `auto` with a concept in a parameter list creates an abbreviated function template.',
          },
        },
        {
          id: 'cpp-w3-d20-t4',
          topicNumber: 4,
          title: 'C++20 Ranges & Composable Views (`std::views`)',
          explanation: [
            'Historically, STL algorithms required passing two iterators (`vec.begin(), vec.end()`) and could not be piped together.',
            'C++20 Ranges allow passing the container directly: `std::ranges::sort(vec);`.',
            'Even more powerful are `std::views`: lightweight, lazy-evaluated transformations piped together using the Unix pipe operator `|` (`vec | std::views::filter(...) | std::views::transform(...)`).'
          ],
          keyRules: [
            'Views are lazy: no computation happens until you iterate over the result.',
            'Zero heap allocations: views are non-owning slices and adaptors.'
          ],
          codeSnippet: {
            id: 'cpp-snip-20-4',
            title: 'C++20 Ranges and Pipe Operator Views',
            description: 'Composable lazy data pipelines using std::views and pipe |',
            language: 'cpp',
            code: `#include <iostream>
#include <vector>
#include <ranges>

int main() {
    std::vector<int> numbers = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};

    // Lazy composable pipeline: filter evens, square them, take first 3!
    auto pipeline = numbers 
        | std::views::filter([](int n) { return n % 2 == 0; })
        | std::views::transform([](int n) { return n * n; })
        | std::views::take(3);

    for (int val : pipeline) {
        std::cout << val << " "; // 4, 16, 36
    }
    std::cout << "\\n";
    return 0;
}`,
          },
          pitfall: 'Storing a view that references a temporary container: `auto v = getVector() | std::views::filter(...);` leaves `v` holding dangling references after `getVector()` temporary is destroyed.',
          quickCheck: {
            question: 'When do operations inside a `std::views` pipeline execute?',
            options: [
              'Lazily on-demand as elements are iterated over',
              'Immediately when the pipe expression is evaluated',
              'At compile time only',
              'In a background thread'
            ],
            correctIndex: 0,
            explanation: 'Ranges views are lazy; calculations occur on-the-fly as iterators advance through the sequence.',
          },
        },
        {
          id: 'cpp-w3-d20-t5',
          topicNumber: 5,
          title: 'C++20 Modules: Replacing Legacy `#include`',
          explanation: [
            'For 40 years, C++ relied on textual `#include` preprocessor copying, leading to hours of redundant header parsing in large codebases.',
            'C++20 Modules introduce compiled module interfaces (`import std;` or `import MyModule;`).',
            'Modules are parsed ONCE into a binary AST format. They eliminate macro leakage, enforce boundary encapsulation, and speed up project compilation times by up to 10x.'
          ],
          keyRules: [
            'export module ModuleName; declares a module.',
            'export void func(); marks a function visible to importers.',
            'import ModuleName; loads precompiled module interface without macro pollution.'
          ],
          codeSnippet: {
            id: 'cpp-snip-20-5',
            title: 'C++20 Module Definition & Import Blueprint',
            description: 'Defining and importing compiled modules',
            language: 'cpp',
            code: `// --- math_engine.cppm (Module Interface) ---
/*
export module MathEngine;

export int multiply(int a, int b) {
    return a * b;
}
*/

// --- main.cpp ---
/*
import MathEngine;
import std;

int main() {
    std::println("Result: {}", multiply(6, 7));
    return 0;
}
*/
#include <iostream>

int main() {
    std::cout << "C++20 Modules replace #include with precompiled binary interfaces.\\n";
    return 0;
}`,
          },
          pitfall: 'Macros defined inside a module do NOT leak into importing files; if you rely on macro injection from headers, modules will intentionally isolate them.',
          quickCheck: {
            question: 'What is the primary advantage of C++20 Modules over legacy `#include`?',
            options: [
              'Modules are compiled once into binary interfaces, drastically accelerating compile times and isolating macros',
              'Modules eliminate the need for a compiler',
              'Modules make C++ dynamically typed',
              'Modules run in web browsers natively'
            ],
            correctIndex: 0,
            explanation: 'Modules eliminate textual preprocessor copying, boosting compilation speed and preventing macro leaks.',
          },
        },
        {
          id: 'cpp-w3-d20-t6',
          topicNumber: 6,
          title: 'C++20 Coroutines: Stackless Asynchronous Generators',
          explanation: [
            'C++20 added native language support for Stackless Coroutines: functions that can suspend execution and resume later while preserving their local state.',
            'Three new keywords: `co_await` (suspends until an awaitable completes), `co_yield` (suspends and emits a generator value), `co_return` (completes execution).',
            'Extensively used for lazy sequence generators, asynchronous I/O event loops, and non-blocking network servers.'
          ],
          keyRules: [
            'Any function containing co_yield, co_await, or co_return is a coroutine.',
            'Coroutines allocate a small coroutine frame on the heap to store local state across suspensions.'
          ],
          codeSnippet: {
            id: 'cpp-snip-20-6',
            title: 'Coroutine Generator Concept (C++20)',
            description: 'Generating infinite sequences on-demand via co_yield',
            language: 'cpp',
            code: `/*
#include <coroutine>

// A coroutine generator emitting Fibonacci numbers on demand
Generator<uint64_t> fibonacci() {
    uint64_t a = 0, b = 1;
    while (true) {
        co_yield a; // Suspends and returns value to caller!
        auto next = a + b;
        a = b;
        b = next;
    }
}
*/
#include <iostream>

int main() {
    std::cout << "C++20 Coroutines enable co_yield and co_await for asynchronous systems.\\n";
    return 0;
}`,
          },
          pitfall: 'Passing references to local temporary objects into a coroutine: when the coroutine suspends and resumes later, the temporary is gone, resulting in dangling references.',
          quickCheck: {
            question: 'Which C++20 keyword suspends a coroutine and emits a value to the caller?',
            options: ['co_yield', 'yield', 'co_await', 'co_return'],
            correctIndex: 0,
            explanation: '`co_yield` pauses the coroutine and returns a generated element to the consumer.',
          },
        },
        {
          id: 'cpp-w3-d20-t7',
          topicNumber: 7,
          title: '`std::format` & `std::print` (C++20 / C++23 Modern Formatting)',
          explanation: [
            'C++ historically had two formatting options: safe but slow/verbose iostreams (`std::cout << ...`), or fast but type-unsafe and vulnerability-prone C `printf`.',
            'C++20 introduced `std::format` (based on the popular `{fmt}` library): Python-like curly brace formatting (`"{}"`) with full compile-time format string validation and extreme speed.',
            'C++23 introduced `std::print` and `std::println`, allowing direct formatted printing to stdout without intermediate string allocations.'
          ],
          keyRules: [
            'std::format("{} has {} points", name, score);',
            'Full compile-time validation: mismatched argument counts or types fail compilation.'
          ],
          codeSnippet: {
            id: 'cpp-snip-20-7',
            title: 'Modern std::format Syntax',
            description: 'Typesafe Python-like string interpolation in C++20',
            language: 'cpp',
            code: `#include <iostream>
// In C++20: #include <format>

int main() {
    // std::string msg = std::format("Server listening on {}:{}", "0.0.0.0", 8080);
    std::cout << "Server listening on 0.0.0.0:8080 (via std::format)\\n";
    return 0;
}`,
          },
          pitfall: 'Using `printf` with mismatched specifiers (e.g. `%d` with `int64_t`) causes stack corruption; `std::format` prevents this at compile time.',
          quickCheck: {
            question: 'What is the advantage of `std::format` over `printf`?',
            options: [
              'It is completely typesafe and validates format strings at compile time',
              'It only works with numbers',
              'It requires no headers',
              'It prints to files only'
            ],
            correctIndex: 0,
            explanation: '`std::format` combines the speed of printf with complete C++ type safety and compile-time format string checking.',
          },
        },
        {
          id: 'cpp-w3-d20-t8',
          topicNumber: 8,
          title: 'Day 20 Capstone: Ranges-Based Data Transformation Engine',
          explanation: [
            'Synthesizing Day 20 Concepts and Ranges into a clean stream processing engine.',
            'Demonstrating custom Concepts, constrained auto parameters, and piped lazy `std::views`.',
            'Showcases the apex of modern expressive, zero-cost C++20 software engineering.'
          ],
          keyRules: [
            'Enforce data constraints with concepts.',
            'Pipe stream transformations lazily using std::views.'
          ],
          codeSnippet: {
            id: 'cpp-snip-20-8',
            title: 'Modern C++20 Stream Processing Pipeline',
            description: 'Composing concepts and ranges for financial transaction filtering',
            language: 'cpp',
            code: `#include <iostream>
#include <vector>
#include <concepts>
#include <ranges>

struct Transaction {
    int id;
    double amount;
    bool approved;
};

// Constrain to transactions
template <typename T>
concept ValidTransaction = requires(T t) {
    { t.amount } -> std::convertible_to<double>;
    { t.approved } -> std::same_as<bool&>;
};

void processApproved(const std::vector<Transaction>& txs) {
    auto approvedStream = txs 
        | std::views::filter([](const ValidTransaction auto& t) { return t.approved && t.amount > 100.0; })
        | std::views::transform([](const auto& t) { return t.amount; });

    std::cout << "Approved Large Transactions:\\n";
    for (double amt : approvedStream) {
        std::cout << "  $" << amt << "\\n";
    }
}

int main() {
    std::vector<Transaction> batch = {
        {1, 50.0, true}, {2, 450.0, true}, {3, 1200.0, false}, {4, 300.0, true}
    };
    processApproved(batch);
    return 0;
}`,
          },
          pitfall: 'Materializing lazy ranges prematurely using loops when you only need to pass them to standard algorithms.',
          quickCheck: {
            question: 'What does the pipe operator `|` accomplish when used with `std::views` in C++20?',
            options: [
              'It composes lazy range transformations into a single readable processing pipeline',
              'It performs a bitwise OR on all integers',
              'It pipes output to the Linux shell',
              'It runs operations in parallel'
            ],
            correctIndex: 0,
            explanation: 'The pipe operator `|` composes range adaptors into functional, lazy data transformation pipelines.',
          },
        },
      ],
      practiceChallenge: {
        title: 'Day 20 Capstone: Constrained Generic Math Library with Concepts',
        instructions: [
          'Define a custom concept `Numeric` that accepts any type satisfying `std::integral` or `std::floating_point`.',
          'Implement a function `Numeric auto clampValue(Numeric auto val, Numeric auto minVal, Numeric auto maxVal)` that clamps `val` between `minVal` and `maxVal`.',
          'Test it with both integer and floating-point inputs.',
        ],
        starterCode: `#include <iostream>
#include <concepts>

// Define Numeric concept and clampValue function

int main() {
    // Test clampValue on int and double
    return 0;
}`,
        solutionCode: `#include <iostream>
#include <concepts>

template <typename T>
concept Numeric = std::integral<T> || std::floating_point<T>;

template <Numeric T>
T clampValue(T val, T minVal, T maxVal) {
    if (val < minVal) return minVal;
    if (val > maxVal) return maxVal;
    return val;
}

int main() {
    std::cout << "Clamped int (15 in [0, 10]):    " << clampValue(15, 0, 10) << "\\n";
    std::cout << "Clamped double (-2.5 in [0, 5]): " << clampValue(-2.5, 0.0, 5.0) << "\\n";
    return 0;
}`,
        hints: [
          'Use `std::integral<T> || std::floating_point<T>` in the concept definition.',
          'Constrain the function with `template <Numeric T>`.',
        ],
      },
      keyTakeaways: [
        'C++20 Concepts turn cryptic template errors into clear, single-line compile diagnostics.',
        '`std::views` pipelines provide lazy, allocation-free data manipulation via the `|` pipe operator.',
        'Modules eliminate textual `#include` overhead, vastly accelerating compile times.',
        'C++20 coroutines enable stackless asynchronous generators and cooperative multitasking.',
      ],
    },

    // Day 21: Week 3 Capstone: High-Performance Generic Thread-Safe LRU Cache & Module 3 Exam
    {
      id: 'cpp-w3-d21',
      dayNumber: 21,
      weekNumber: 3,
      title: 'Week 3 Capstone: Generic Thread-Safe LRU Cache & Exam',
      subtitle: 'Combining templates, list, unordered_map, mutex locking & Module 3 qualifying exam',
      durationMinutes: 75,
      overview:
        'Synthesize all of Week 3 into the classic systems architecture component: a Generic Thread-Safe LRU (Least Recently Used) Cache. Combine templates, std::list, std::unordered_map, RAII mutex locks, and pass the Week 3 Qualifying Exam.',
      topics: [
        {
          id: 'cpp-w3-d21-t1',
          topicNumber: 1,
          title: 'LRU Cache Algorithmic Architecture',
          explanation: [
            'An LRU Cache requires two core guarantees:',
            '1. $O(1)$ fast lookup of cached values by key.',
            '2. $O(1)$ eviction of the least recently accessed item when capacity is exceeded.',
            'To achieve both, we pair a `std::unordered_map` (for $O(1)$ key lookup) with a `std::list` (for $O(1)$ node splicing and order maintenance).'
          ],
          keyRules: [
            'std::unordered_map stores Key -> list::iterator.',
            'std::list stores std::pair<Key, Value> in most-recent to least-recent order.'
          ],
          codeSnippet: {
            id: 'cpp-snip-21-1',
            title: 'LRU Cache Dual Data Structure Layout',
            description: 'Coupling hash map with doubly linked list for O(1) performance',
            language: 'cpp',
            code: `/*
  [std::unordered_map: Key -> ListIterator]
         |                  |
         v                  v
  [std::list:  (Key1, Val1) <-> (Key2, Val2) <-> (Key3, Val3) ]
               ^                                  ^
          Most Recent                         Least Recent (Eviction candidate!)
*/`,
          },
          pitfall: 'Storing raw values in the list without the key makes it impossible to delete the key from the hash map when evicting from the back of the list.',
          quickCheck: {
            question: 'Why does an LRU Cache store both Key and Value inside the doubly linked list nodes?',
            options: [
              'So that when the oldest node is evicted from the list, its key can be erased from the hash map in O(1)',
              'To encrypt the keys',
              'Because std::list requires pairs',
              'To support sorting'
            ],
            correctIndex: 0,
            explanation: 'When evicting the tail of the list, the cache must look up that node\'s key to remove it from the hash table.',
          },
        },
        {
          id: 'cpp-w3-d21-t2',
          topicNumber: 2,
          title: 'The O(1) Splice Operation in LRU Caching',
          explanation: [
            'When a cached item is accessed, it must move to the front of the list to become the most recently used.',
            'In an array, moving an item to the front takes $O(N)$ shifts.',
            'In `std::list`, the member function `m_list.splice(m_list.begin(), m_list, it)` unlinks and relinks the node in $O(1)$ time WITHOUT reallocating or copying!'
          ],
          keyRules: [
            'm_list.splice(dest, m_list, srcIt) is O(1) pointer relinking.',
            'Iterator stability guarantees m_map iterators remain completely valid.'
          ],
          codeSnippet: {
            id: 'cpp-snip-21-2',
            title: 'O(1) Node Splicing on Access',
            description: 'Relinking nodes to front without element copying',
            language: 'cpp',
            code: `#include <iostream>
#include <list>

int main() {
    std::list<int> items = {10, 20, 30};
    auto it = std::next(items.begin(), 2); // Points to 30

    // Splice 30 to the front in O(1)!
    items.splice(items.begin(), items, it);

    for (int x : items) std::cout << x << " ";
    std::cout << "\\n"; // 30 10 20
    return 0;
}`,
          },
          pitfall: 'Erasing and re-inserting nodes instead of splicing allocates and deallocates heap nodes on every single cache read.',
          quickCheck: {
            question: 'What method on `std::list` moves an existing node to a new position in $O(1)$ time without reallocation?',
            options: ['splice()', 'move()', 'relink()', 'shift()'],
            correctIndex: 0,
            explanation: '`splice()` unhooks and re-inserts nodes into another position in O(1) time without allocating or copying.',
          },
        },
        {
          id: 'cpp-w3-d21-t3',
          topicNumber: 3,
          title: 'Thread Safety with `std::mutex` & `std::lock_guard`',
          explanation: [
            'Caches in production servers are accessed concurrently by multiple worker threads.',
            'Concurrent reads and writes to `std::unordered_map` or `std::list` without synchronization trigger race conditions, memory corruption, and crashes.',
            'We protect all cache operations using a private `mutable std::mutex m_mutex;` and lock it via `std::lock_guard<std::mutex> lock(m_mutex);` in every public method.'
          ],
          keyRules: [
            'Mark the mutex mutable so const methods (like get() or size()) can lock it.',
            'Use std::lock_guard for exception-safe scoped locking.'
          ],
          codeSnippet: {
            id: 'cpp-snip-21-3',
            title: 'Thread-Safe Scoped Locking Pattern',
            description: 'Protecting concurrent cache access with mutable mutex',
            language: 'cpp',
            code: `#include <iostream>
#include <mutex>

class ThreadSafeCounter {
private:
    int count{0};
    mutable std::mutex m_mtx; // Mutable allows locking in const methods
public:
    void increment() {
        std::lock_guard<std::mutex> lock(m_mtx);
        count++;
    }

    int get() const {
        std::lock_guard<std::mutex> lock(m_mtx);
        return count;
    }
};

int main() {
    ThreadSafeCounter c;
    c.increment();
    std::cout << "Count: " << c.get() << "\\n";
    return 0;
}`,
          },
          pitfall: 'Forgetting `mutable` on `m_mutex` prevents calling `get()` or inspection methods on const cache references.',
          quickCheck: {
            question: 'Why should a mutex in a class be declared with the `mutable` specifier?',
            options: [
              'To allow it to be locked and unlocked inside const member functions',
              'To make the mutex lock-free',
              'To allow copying the mutex',
              'To share it across processes'
            ],
            correctIndex: 0,
            explanation: '`mutable` allows a member variable to be modified inside `const` methods, which is necessary because locking modifies the mutex state.',
          },
        },
        {
          id: 'cpp-w3-d21-t4',
          topicNumber: 4,
          title: 'Implementing the Complete `LRUCache<Key, Value>` Class',
          explanation: [
            'Bringing all components together into the production generic class template:',
            '- Template parameters: `typename Key`, `typename Value`.',
            '- `std::optional<Value> get(const Key& key)`: Looks up key, splices node to front, returns value.',
            '- `void put(const Key& key, const Value& val)`: Inserts or updates; evicts LRU tail if capacity is exceeded.',
            '- Full thread safety via `mutable std::mutex`.'
          ],
          keyRules: [
            'Return std::optional<Value> from get() to handle missing keys cleanly.',
            'Eviction pops list.back() and erases corresponding entry from m_map.'
          ],
          codeSnippet: {
            id: 'cpp-snip-21-4',
            title: 'Production Generic Thread-Safe LRU Cache Blueprint',
            description: 'Complete O(1) thread-safe LRU Cache implementation in C++',
            language: 'cpp',
            code: `#include <iostream>
#include <list>
#include <unordered_map>
#include <optional>
#include <mutex>
#include <string>

template <typename Key, typename Value>
class LRUCache {
private:
    using KeyValuePair = std::pair<Key, Value>;
    using ListIterator = typename std::list<KeyValuePair>::iterator;

    size_t m_capacity;
    std::list<KeyValuePair> m_list;
    std::unordered_map<Key, ListIterator> m_map;
    mutable std::mutex m_mutex;

public:
    explicit LRUCache(size_t capacity) : m_capacity(capacity) {}

    std::optional<Value> get(const Key& key) {
        std::lock_guard<std::mutex> lock(m_mutex);
        auto it = m_map.find(key);
        if (it == m_map.end()) return std::nullopt;

        // Splice accessed node to front (most recently used)
        m_list.splice(m_list.begin(), m_list, it->second);
        return it->second->second;
    }

    void put(const Key& key, const Value& value) {
        std::lock_guard<std::mutex> lock(m_mutex);
        auto it = m_map.find(key);

        if (it != m_map.end()) {
            // Update existing value and move to front
            it->second->second = value;
            m_list.splice(m_list.begin(), m_list, it->second);
            return;
        }

        // Evict LRU tail if at capacity
        if (m_map.size() >= m_capacity) {
            auto oldest = m_list.back();
            m_map.erase(oldest.first);
            m_list.pop_back();
        }

        // Insert new entry at front
        m_list.emplace_front(key, value);
        m_map[key] = m_list.begin();
    }
};

int main() {
    LRUCache<int, std::string> cache(2);
    cache.put(1, "Data 1");
    cache.put(2, "Data 2");
    std::cout << "Key 1: " << cache.get(1).value_or("MISS") << "\\n"; // Hits 1, 2 becomes LRU

    cache.put(3, "Data 3"); // Evicts 2!
    std::cout << "Key 2 (evicted): " << cache.get(2).value_or("MISS") << "\\n"; // MISS
    std::cout << "Key 3:           " << cache.get(3).value_or("MISS") << "\\n"; // Data 3
    return 0;
}`,
          },
          pitfall: 'Returning a raw reference `Value&` from `get()` in a multithreaded cache: another thread could evict the item, leaving the caller holding a dangling reference.',
          quickCheck: {
            question: 'Why should `get()` return `std::optional<Value>` instead of a raw reference `Value&` in a multithreaded cache?',
            options: [
              'Because another thread could evict the item, making a reference dangling; returning by value (optional) is thread-safe',
              'Because references are illegal in C++',
              'To speed up CPU clock speed',
              'Because templates forbid references'
            ],
            correctIndex: 0,
            explanation: 'Returning by value via `std::optional` guarantees the caller owns a safe copy that will not be invalidated if another thread evicts the item.',
          },
        },
        {
          id: 'cpp-w3-d21-t5',
          topicNumber: 5,
          title: '`std::optional<T>`: Expressing Nullable Return Values',
          explanation: [
            'Before C++17, functions that might fail to return a value used output parameters with boolean return codes, or magic sentinel values like `-1` or `nullptr`.',
            '`std::optional<T>` represents an object that may or may not contain a valid value.',
            'Provides `.has_value()`, `operator bool()`, dereference `*opt`, and `.value_or(fallback)` for expressive, safe access.'
          ],
          keyRules: [
            'Zero heap allocations: std::optional stores T inline on the stack with a boolean flag.',
            'opt.value_or(defaultVal) returns the contained value or fallback.'
          ],
          codeSnippet: {
            id: 'cpp-snip-21-5',
            title: 'std::optional Return Pattern',
            description: 'Safe nullable returns without pointers or sentinels',
            language: 'cpp',
            code: `#include <iostream>
#include <optional>
#include <string>

std::optional<std::string> findUser(int id) {
    if (id == 42) return "Alice Developer";
    return std::nullopt; // No value present
}

int main() {
    auto u1 = findUser(42);
    auto u2 = findUser(99);

    std::cout << "User 42: " << u1.value_or("Guest") << "\\n";
    std::cout << "User 99: " << u2.value_or("Guest") << "\\n";
    return 0;
}`,
          },
          pitfall: 'Calling `*opt` or `opt.value()` when `opt.has_value() == false`: `*opt` is undefined behavior, while `opt.value()` throws `std::bad_optional_access`.',
          quickCheck: {
            question: 'Does `std::optional<int>` allocate heap memory?',
            options: [
              'No, it stores the integer inline with a boolean presence flag on the stack',
              'Yes, it calls new int',
              'Only when empty',
              'Yes, via malloc'
            ],
            correctIndex: 0,
            explanation: 'std::optional stores its value inline on the stack with zero dynamic heap allocation overhead.',
          },
        },
        {
          id: 'cpp-w3-d21-t6',
          topicNumber: 6,
          title: '`std::variant<Ts...>`: Typesafe Tagged Unions',
          explanation: [
            'C-style unions (`union { int i; float f; }`) are type-unsafe: accessing the wrong member causes memory corruption.',
            'C++17 `std::variant<Ts...>` is a typesafe tagged union. It knows which type is currently active and calls proper constructors and destructors.',
            'Use `std::holds_alternative<T>(var)` to check active type, and `std::visit(visitor, var)` for pattern matching across types.'
          ],
          keyRules: [
            'Typesafe tagged union with zero dynamic heap allocation.',
            'std::visit enables functional pattern matching over variants.'
          ],
          codeSnippet: {
            id: 'cpp-snip-21-6',
            title: 'std::variant and std::visit Pattern Matching',
            description: 'Typesafe union handling integers, strings, and floats',
            language: 'cpp',
            code: `#include <iostream>
#include <variant>
#include <string>

using ConfigValue = std::variant<int, double, std::string>;

void printConfig(const ConfigValue& val) {
    // Pattern matching via std::visit
    std::visit([](const auto& v) {
        std::cout << "Active config value: " << v << "\\n";
    }, val);
}

int main() {
    ConfigValue v1 = 8080;
    ConfigValue v2 = "production.host";

    printConfig(v1);
    printConfig(v2);
    return 0;
}`,
          },
          pitfall: 'Calling `std::get<T>(v)` when `v` holds a different type throws `std::bad_variant_access`.',
          quickCheck: {
            question: 'What C++17 feature provides a typesafe tagged union with automatic destructor management?',
            options: ['std::variant', 'std::any', 'std::union', 'std::tuple'],
            correctIndex: 0,
            explanation: '`std::variant` is a typesafe union that manages object lifecycles and provides pattern matching via `std::visit`.',
          },
        },
        {
          id: 'cpp-w3-d21-t7',
          topicNumber: 7,
          title: 'Week 3 Synthesis & Generic Architecture Review',
          explanation: [
            'Consolidating all Week 3 milestones:',
            '1. Templates & CTAD: Blueprints, compile-time instantiation, and class template argument deduction.',
            '2. Compile-Time Branching: Template specialization, type traits (`_v`, `_t`), and C++17 `if constexpr`.',
            '3. Sequence Containers: `std::vector` contiguous prefetching vs `std::deque` and `std::list`.',
            '4. Associative Containers: `std::map` (Red-Black Trees, $O(\\log N)$) vs `std::unordered_map` (Hash Tables, $O(1)$).',
            '5. Algorithms & Lambdas: Composable data pipelines with `<algorithm>` and `<numeric>`.',
            '6. Modern C++20: Concepts for explicit type constraints and Ranges for piped lazy evaluation.'
          ],
          keyRules: [
            'Prefer compile-time constraints and algorithms over runtime manual loops.',
            'Use standard vocabulary types: std::optional, std::variant, std::string_view.'
          ],
          codeSnippet: {
            id: 'cpp-snip-21-7',
            title: 'Week 3 Architectural Synthesis Matrix',
            description: 'Comprehensive generic template and container validation',
            language: 'cpp',
            code: `#include <iostream>
#include <vector>
#include <algorithm>
#include <optional>

template <typename T>
std::optional<T> findFirstPositive(const std::vector<T>& data) {
    auto it = std::find_if(data.begin(), data.end(), [](T val) { return val > 0; });
    if (it != data.end()) return *it;
    return std::nullopt;
}

int main() {
    std::vector<int> numbers = {-5, -2, 42, 10};
    auto result = findFirstPositive(numbers);
    std::cout << "First positive: " << result.value_or(0) << "\\n";
    return 0;
}`,
          },
          pitfall: 'Over-engineering with complex templates when simple concrete functions would suffice.',
          quickCheck: {
            question: 'What is the primary architectural advantage of generic programming in C++?',
            options: [
              'Zero-cost abstractions: maximum reusability with zero runtime penalty compared to hand-written code',
              'Smaller binary executable size',
              'Faster compilation times',
              'Eliminating the need for pointers'
            ],
            correctIndex: 0,
            explanation: 'Templates generate optimized, inlined machine code tailored to exact types with zero runtime abstraction penalty.',
          },
        },
        {
          id: 'cpp-w3-d21-t8',
          topicNumber: 8,
          title: 'Week 3 Qualifying Assessment Gateway',
          explanation: [
            'To unlock Week 4 (Concurrency, Multithreading, Systems Programming, CMake & Production C++), you must pass the Week 3 Qualifying Exam with >= 80%.',
            'The assessment verifies: Template instantiation rules, SFINAE vs if constexpr, container complexities, custom hash requirements, and C++20 Concepts/Ranges.',
            'Pass to enter the final week of advanced systems engineering!'
          ],
          keyRules: [
            'Passing score: 80% (4 out of 5 questions correct).',
            'Unlocks Week 4: Concurrency, Thread Synchronization, Atomics, CMake & Systems Capstone.'
          ],
          codeSnippet: {
            id: 'cpp-snip-21-8',
            title: 'Week 3 Exam Gateway Kicker',
            description: 'Readiness checklist for Week 4 Concurrency module',
            language: 'cpp',
            code: `#include <iostream>

int main() {
    std::cout << "Week 3 Curriculum Complete!\\n";
    std::cout << "Ready for Week 3 Module Qualifying Assessment.\\n";
    return 0;
}`,
          },
          pitfall: 'Moving into multithreading without understanding standard containers and move semantics will make concurrent memory safety challenging.',
          quickCheck: {
            question: 'What is required to unlock Week 4 of the C++ Systems Academy?',
            options: [
              'Score at least 80% on the Week 3 Qualifying Exam (or enable Dev Mode)',
              'Write a compiler from scratch',
              'Submit a pull request to GCC',
              'Read all 2,000 pages of the C++ standard'
            ],
            correctIndex: 0,
            explanation: 'Scoring >= 80% on the qualifying assessment verifies readiness and unlocks Week 4.',
          },
        },
      ],
      practiceChallenge: {
        title: 'Day 21 Capstone Project: Working Single-Threaded LRU Cache',
        instructions: [
          'Implement an `LRUCache` class with capacity 2.',
          'Support `void put(int key, int val)` and `int get(int key)` (return -1 if missing).',
          'Verify that inserting a third element evicts the least recently accessed element.',
        ],
        starterCode: `#include <iostream>
#include <list>
#include <unordered_map>

class LRUCache {
    // Implement LRUCache
};

int main() {
    // Test LRU eviction order
    return 0;
}`,
        solutionCode: `#include <iostream>
#include <list>
#include <unordered_map>

class LRUCache {
private:
    size_t m_capacity;
    std::list<std::pair<int, int>> m_items;
    std::unordered_map<int, std::list<std::pair<int, int>>::iterator> m_lookup;

public:
    explicit LRUCache(size_t cap) : m_capacity(cap) {}

    int get(int key) {
        auto it = m_lookup.find(key);
        if (it == m_lookup.end()) return -1;
        m_items.splice(m_items.begin(), m_items, it->second);
        return it->second->second;
    }

    void put(int key, int val) {
        auto it = m_lookup.find(key);
        if (it != m_lookup.end()) {
            it->second->second = val;
            m_items.splice(m_items.begin(), m_items, it->second);
            return;
        }

        if (m_lookup.size() >= m_capacity) {
            int oldKey = m_items.back().first;
            m_lookup.erase(oldKey);
            m_items.pop_back();
        }

        m_items.emplace_front(key, val);
        m_lookup[key] = m_items.begin();
    }
};

int main() {
    LRUCache cache(2);
    cache.put(1, 100);
    cache.put(2, 200);
    std::cout << "get(1): " << cache.get(1) << "\\n"; // 100, 2 is LRU

    cache.put(3, 300); // Evicts 2
    std::cout << "get(2): " << cache.get(2) << "\\n"; // -1 (evicted!)
    std::cout << "get(3): " << cache.get(3) << "\\n"; // 300
    return 0;
}`,
        hints: [
          'Use `m_items.splice(m_items.begin(), m_items, it->second)` on access.',
          'Erase `m_items.back().first` from `m_lookup` before `pop_back()`.',
        ],
      },
      keyTakeaways: [
        'An LRU Cache couples `std::unordered_map` with `std::list` to achieve $O(1)$ lookup and $O(1)$ eviction.',
        '`std::list::splice` unlinks and relinks nodes in $O(1)$ time without memory allocations.',
        '`std::optional` provides a typesafe, zero-allocation representation for nullable return values.',
        'Week 3 establishes mastery of C++ generic programming, type traits, and STL algorithms.',
      ],
    },
  ],
  quiz: {
    id: 'cpp-quiz-week-3',
    weekNumber: 3,
    title: 'Week 3 Qualifying Exam: Templates, Concepts & STL Architecture',
    description: 'Score at least 80% (4/5 correct) to unlock Week 4: Concurrency, Multithreading, CMake & Production Systems.',
    passingScorePercent: 80,
    questions: [
      {
        id: 'cpp-q3-1',
        question: 'Why does C++17 `if constexpr` succeed where a traditional `if` statement fails when compiling code for different types?',
        options: [
          'The compiler evaluates the condition at compile time and completely discards the untaken branch without instantiating it',
          'It converts all variables to strings',
          'It disables syntax checking',
          'It runs on multiple CPUs'
        ],
        correctIndex: 0,
        explanation: '`if constexpr` discards the untaken branch at compile time, skipping instantiation for incompatible types.',
      },
      {
        id: 'cpp-q3-2',
        question: 'What is the algorithmic time complexity of searching in `std::map` versus `std::unordered_map`?',
        options: [
          'std::map is O(log N) (Red-Black Tree); std::unordered_map is average O(1) (Hash Table)',
          'Both are O(1)',
          'std::map is O(1); std::unordered_map is O(log N)',
          'Both are O(N)'
        ],
        correctIndex: 0,
        explanation: 'std::map provides guaranteed logarithmic O(log N) tree search, while std::unordered_map provides average O(1) hash lookups.',
      },
      {
        id: 'cpp-q3-3',
        question: 'What is the primary benefit of C++20 Concepts over legacy SFINAE / std::enable_if?',
        options: [
          'Readable, explicit compile-time type constraints with clean single-line error messages',
          'They eliminate the need for templates',
          'They make functions execute in the kernel',
          'They allow using Python libraries'
        ],
        correctIndex: 0,
        explanation: 'Concepts replace complex SFINAE boilerplate with explicit type requirements and concise error messages.',
      },
      {
        id: 'cpp-q3-4',
        question: 'What occurs when you access a non-existent key using bracket indexing `map[key]` on `std::map` or `std::unordered_map`?',
        options: [
          'It default-constructs and inserts a new element into the map with that key',
          'It throws a std::out_of_range exception',
          'It returns nullptr',
          'It emits a compiler error'
        ],
        correctIndex: 0,
        explanation: 'Bracket operator `[]` inserts a default-constructed value if the key does not exist; use `.find()` or `.contains()` to inspect without insertion.',
      },
      {
        id: 'cpp-q3-5',
        question: 'What iterator category is required by `std::sort` from `<algorithm>`?',
        options: ['Random Access Iterator', 'Bidirectional Iterator', 'Forward Iterator', 'Input Iterator'],
        correctIndex: 0,
        explanation: 'std::sort requires Random Access Iterators (like `std::vector` or raw pointers) for O(1) index arithmetic during partitioning.',
      },
    ],
  },
};
