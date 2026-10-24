import { WeekModule } from '../types/course';

export const CPP_WEEK_1_MODULE: WeekModule = {
  weekNumber: 1,
  title: 'C++ Foundations, Memory, Pointers & References',
  theme: 'From Machine Architecture to Manual Memory Control',
  description:
    'Master C++ from first principles: the preprocessor, compilation pipeline, fundamental types, pointers, pointer arithmetic, references, const-correctness, stack vs heap allocation, dynamic memory with new/delete, and safe memory management.',
  conceptImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
  imageAlt: 'C++ low-level systems architecture and memory visualization',
  days: [
    {
      id: 'cpp-w1-d1',
      dayNumber: 1,
      weekNumber: 1,
      title: 'Compilation Pipeline, Types & Fast I/O',
      subtitle: 'Preprocessor, compiler, assembler, linker, primitive types & std::cin/cout mechanics',
      durationMinutes: 60,
      overview:
        'Understand how C++ source code transforms into bare-metal machine instructions. Learn the 4 compilation phases, exact type sizes, fixed-width integers, fast I/O optimization, and the core anatomy of a C++ translation unit.',
      topics: [
        {
          id: 'cpp-w1-d1-t1',
          topicNumber: 1,
          title: 'The 4-Stage C++ Compilation Pipeline',
          explanation: [
            'C++ does not run on a virtual machine or interpreter. It compiles directly to native processor instructions through 4 distinct stages: Preprocessing, Compilation, Assembly, and Linking.',
            'In the Preprocessor stage (`cpp` / `-E`), macro directives starting with `#` (#include, #define, #ifdef) are textually expanded. Header files are copied directly into the source file to form a Translation Unit.',
            'The Compiler (`-S`) analyzes the AST, performs semantic checking, optimizes intermediate representation, and produces assembly code. The Assembler (`-c`) translates assembly into binary machine object files (`.o` / `.obj`). Finally, the Linker resolves external symbols, stitches object files with the standard library (`libstdc++`/`libc++`), and outputs the final ELF or PE binary executable.'
          ],
          keyRules: [
            'Each .cpp file is compiled independently as a single Translation Unit.',
            'Header files (.h / .hpp) contain declarations; implementation files (.cpp) contain definitions.',
            'One Definition Rule (ODR): An entity cannot have multiple conflicting definitions in a program.'
          ],
          codeSnippet: {
            id: 'cpp-snip-1-1',
            title: 'Compilation Pipeline Commands & Verification',
            description: 'Shell commands for inspecting intermediate compilation stages in GCC/Clang',
            language: 'bash',
            code: `# 1. Preprocess only (expands macros & includes) -> main.i
g++ -E main.cpp -o main.i

# 2. Compile to assembly language -> main.s
g++ -S main.cpp -o main.s

# 3. Assemble into machine object file -> main.o
g++ -c main.cpp -o main.o

# 4. Link object files into final executable binary
g++ main.o -o program
./program`,
          },
          pitfall: 'Placing function definitions with bodies in headers without `inline` causes Linker error LNK2005 / duplicate symbol definitions.',
          quickCheck: {
            question: 'Which stage of the C++ compilation pipeline resolves external function calls across different object files?',
            options: ['The Preprocessor', 'The Linker', 'The Assembler', 'The Lexer'],
            correctIndex: 1,
            explanation: 'The Linker is responsible for resolving unresolved external symbol references and combining multiple object files into the final executable.',
          },
        },
        {
          id: 'cpp-w1-d1-t2',
          topicNumber: 2,
          title: 'Primitive Types, Sizes & Fixed-Width Integers',
          explanation: [
            'C++ primitive types have platform-dependent sizes guaranteed only by minimum ranges in the standard (e.g. `int` is at least 16 bits, typically 32 bits on modern x86_64).',
            'For cross-platform systems programming and binary protocol serialization, always include `<cstdint>` and use exact-width types: `int8_t`, `int16_t`, `int32_t`, `int64_t`, and unsigned counterparts `uint8_t`, `uint32_t`, `uint64_t`.',
            '`size_t` is the standard unsigned integer type for object sizes and array indexing, matching the native word size of the CPU architecture (64-bit on 64-bit systems).'
          ],
          keyRules: [
            'sizeof(char) is always guaranteed to be 1 byte by definition in the C++ standard.',
            'Use uint8_t for raw byte manipulation, uint32_t for 32-bit words, uint64_t for large counters.',
            'size_t is unsigned; subtracting a larger size_t from a smaller one wraps to a massive positive number (underflow).'
          ],
          codeSnippet: {
            id: 'cpp-snip-1-2',
            title: 'Exact Width Integers & Type Sizes',
            description: 'Inspecting exact byte allocations with sizeof() and <cstdint>',
            language: 'cpp',
            code: `#include <iostream>
#include <cstdint>

int main() {
    std::cout << "=== C++ Primitive Type Footprints ===" << std::endl;
    std::cout << "bool:        " << sizeof(bool) << " byte" << std::endl;
    std::cout << "char:        " << sizeof(char) << " byte" << std::endl;
    std::cout << "int32_t:     " << sizeof(int32_t) << " bytes" << std::endl;
    std::cout << "int64_t:     " << sizeof(int64_t) << " bytes" << std::endl;
    std::cout << "size_t:      " << sizeof(size_t) << " bytes" << std::endl;
    std::cout << "double:      " << sizeof(double) << " bytes" << std::endl;
    return 0;
}`,
          },
          pitfall: 'Comparing signed `int` with unsigned `size_t` causes implicit conversion to unsigned, turning negative numbers into huge positive values.',
          quickCheck: {
            question: 'What header must be included to use fixed-width types like int32_t and uint64_t?',
            options: ['<iostream>', '<cstdint>', '<limits>', '<memory>'],
            correctIndex: 1,
            explanation: '<cstdint> declares exact-width integer types such as int8_t, int16_t, int32_t, and int64_t.',
          },
        },
        {
          id: 'cpp-w1-d1-t3',
          topicNumber: 3,
          title: 'High-Performance Fast I/O & Stream Synchronization',
          explanation: [
            'By default, C++ streams (`std::cin` / `std::cout`) maintain synchronization with C runtime standard I/O buffers (`stdin` / `stdout`). This synchronization allows mixing `printf` and `std::cout`, but causes heavy function-call overhead.',
            'In competitive programming, game engines, and low-latency servers, you disable this sync via `std::ios_base::sync_with_stdio(false);`.',
            'Additionally, `std::cin` is tied to `std::cout` by default, flushing `cout` before every input operation. Untying them with `std::cin.tie(nullptr);` eliminates redundant flushes.'
          ],
          keyRules: [
            'Call std::ios_base::sync_with_stdio(false); std::cin.tie(nullptr); at the beginning of main().',
            'Avoid std::endl because it flushes the OS buffer; use "\\n" for newline without flushing.'
          ],
          codeSnippet: {
            id: 'cpp-snip-1-3',
            title: 'Fast I/O Setup Pattern',
            description: 'Uncoupling C synchronization for microsecond stream throughput',
            language: 'cpp',
            code: `#include <iostream>

void enableFastIO() {
    // Untie C++ streams from C stdio
    std::ios_base::sync_with_stdio(false);
    // Untie cin from cout flush
    std::cin.tie(nullptr);
}

int main() {
    enableFastIO();
    std::cout << "Fast I/O enabled. Processing 1,000,000 stream packets\\n";
    return 0;
}`,
          },
          pitfall: 'Using `std::endl` in loops forces a hardware flush on every iteration, destroying I/O throughput.',
          quickCheck: {
            question: 'Why is "\\n" preferred over std::endl in high-throughput C++ applications?',
            options: [
              'std::endl causes an automatic buffer flush, which is slow',
              'std::endl does not emit a newline character',
              '\\n is only supported on Linux systems',
              'std::endl is deprecated in C++20'
            ],
            correctIndex: 0,
            explanation: 'std::endl inserts a newline AND explicitly flushes the stream buffer, causing an expensive write system call.',
          },
        },
        {
          id: 'cpp-w1-d1-t4',
          topicNumber: 4,
          title: 'Variable Initialization: Uniform Braced Initialization (`{}`)',
          explanation: [
            'C++ historically had multiple conflicting initialization syntaxes: copy initialization (`int x = 5;`), direct initialization (`int x(5);`), and aggregate initialization.',
            'C++11 introduced Uniform Braced Initialization (`int x{5};` or `int x = {5};`). It works consistently across primitives, structs, arrays, and STL containers.',
            'Crucially, braced initialization strictly prevents narrowing conversions (e.g. implicitly converting `double` to `int` or `long long` to `int` without warning).'
          ],
          keyRules: [
            'Prefer braced initialization `int val{42};` as default in modern C++.',
            '`double d = 3.14; int x{d};` produces a compilation error because it truncates data.'
          ],
          codeSnippet: {
            id: 'cpp-snip-1-4',
            title: 'Uniform Braced Initialization vs Narrowing',
            description: 'Safe initialization preventing precision truncation bugs at compile time',
            language: 'cpp',
            code: `#include <iostream>

int main() {
    int validCount{100};
    double temperature{98.6};
    
    // int truncated{temperature}; // COMPILE ERROR: narrowing conversion!
    int safeTruncated = static_cast<int>(temperature); // Explicit intent

    std::cout << "Valid count: " << validCount << "\\n";
    std::cout << "Explicitly casted: " << safeTruncated << "\\n";
    return 0;
}`,
          },
          pitfall: 'Using parentheses for object construction can trigger the "Most Vexing Parse", where the compiler interprets an object declaration as a function signature.',
          quickCheck: {
            question: 'What happens when you compile `int x{3.99};` in modern C++?',
            options: [
              'The compiler emits an error for narrowing conversion',
              'x silently rounds to 4',
              'x silently truncates to 3 without warning',
              'It throws a runtime exception'
            ],
            correctIndex: 0,
            explanation: 'Braced initialization enforces compile-time safety by rejecting narrowing conversions that lose precision.',
          },
        },
        {
          id: 'cpp-w1-d1-t5',
          topicNumber: 5,
          title: '`constexpr`, `consteval` & Compile-Time Evaluation',
          explanation: [
            '`const` specifies runtime immutability (the value cannot be modified after initialization).',
            '`constexpr` specifies compile-time computability: expressions and functions marked `constexpr` can be evaluated by the compiler during compilation, embedding constant results directly into the binary without any runtime CPU cost.',
            'C++20 introduced `consteval` (immediate functions), which MUST execute at compile time; if the argument is not a compile-time constant, compilation fails immediately.'
          ],
          keyRules: [
            'Use constexpr for mathematical constants, lookup tables, and pure calculation functions.',
            'constexpr functions can execute at compile time OR runtime depending on their arguments.',
            'consteval functions ONLY execute at compile time; calling them with runtime variables errors.'
          ],
          codeSnippet: {
            id: 'cpp-snip-1-5',
            title: 'Zero-Cost Compile-Time Factorial & Math',
            description: 'Computing values at compile time with constexpr and consteval',
            language: 'cpp',
            code: `#include <iostream>

constexpr uint64_t factorial(uint64_t n) {
    return (n <= 1) ? 1 : n * factorial(n - 1);
}

int main() {
    // Evaluated entirely by the compiler! 0 runtime clock cycles
    constexpr uint64_t fact10 = factorial(10);
    std::cout << "Compile-time factorial(10): " << fact10 << "\\n";
    return 0;
}`,
          },
          pitfall: 'Marking a function `constexpr` does not guarantee it runs at compile time unless its return value is assigned to a `constexpr` variable or template parameter.',
          quickCheck: {
            question: 'What is the primary difference between const and constexpr?',
            options: [
              'const ensures runtime immutability; constexpr can compute the value at compile time',
              'constexpr can only be used with floating-point numbers',
              'const is evaluated by the linker, constexpr by the assembler',
              'const variables can be modified inside functions'
            ],
            correctIndex: 0,
            explanation: 'const means read-only at runtime; constexpr requires that the expression can be evaluated at compile time.',
          },
        },
        {
          id: 'cpp-w1-d1-t6',
          topicNumber: 6,
          title: 'Type Inference with `auto` & `decltype`',
          explanation: [
            'C++11 introduced automatic type deduction via `auto`. The compiler deduces the exact type from the initializing expression at compile time with zero runtime overhead.',
            '`auto` strips references (`&`) and top-level `const` by default. To preserve them, specify `const auto&` or `auto&`.',
            '`decltype(expr)` extracts the exact declared type of an expression without evaluating it, essential for generic templates and forwarding return types.'
          ],
          keyRules: [
            'Use auto when types are obvious from context (e.g., auto iter = vec.begin();).',
            'Use const auto& when iterating over containers to avoid expensive element copies.',
            'auto x = 5; deduces int. auto& ref = x; deduces int&.'
          ],
          codeSnippet: {
            id: 'cpp-snip-1-6',
            title: 'auto Deduction Rules & const auto&',
            description: 'Demonstrating reference decay and preserving qualifiers with auto',
            language: 'cpp',
            code: `#include <iostream>
#include <vector>

int main() {
    int original = 42;
    auto copyVal = original;          // Deduces int (copy)
    auto& refVal = original;          // Deduces int& (alias)
    const auto& constRef = original;  // Deduces const int& (read-only alias)

    refVal = 99; // Mutates original
    std::cout << "original: " << original << "\\n";
    std::cout << "copyVal:  " << copyVal << "\\n";
    std::cout << "constRef: " << constRef << "\\n";
    return 0;
}`,
          },
          pitfall: 'Iterating with `for (auto item : container)` makes an expensive copy of every element on each step; use `for (const auto& item : container)` instead.',
          quickCheck: {
            question: 'If `const int x = 10;`, what is the deduced type of `auto y = x;`?',
            options: ['int', 'const int', 'const int&', 'int&'],
            correctIndex: 0,
            explanation: 'Plain `auto` strips top-level const and references. `y` is deduced as a mutable `int` copy.',
          },
        },
        {
          id: 'cpp-w1-d1-t7',
          topicNumber: 7,
          title: 'Scoped Enumerations: `enum class` vs Legacy `enum`',
          explanation: [
            'Legacy C-style `enum Color { Red, Green, Blue };` exports its enumerators into the enclosing scope, creating global naming collisions. It also implicitly converts to integer.',
            'Modern C++ `enum class Color { Red, Green, Blue };` is strongly typed and strongly scoped. Enumerator names must be qualified (`Color::Red`) and do not implicitly convert to integers.',
            'You can also specify the underlying storage type (e.g. `enum class PacketType : uint8_t { ... };`) for precise network and memory layout control.'
          ],
          keyRules: [
            'Always use enum class instead of plain enum.',
            'Use static_cast<int>(val) if you explicitly need the numeric integer value.',
            'Specify the underlying integer type (uint8_t, uint16_t) to save memory.'
          ],
          codeSnippet: {
            id: 'cpp-snip-1-7',
            title: 'Scoped enum class with Fixed Underlying Type',
            description: 'Preventing namespace pollution and ensuring type safety',
            language: 'cpp',
            code: `#include <iostream>
#include <cstdint>

enum class HttpMethod : uint8_t {
    GET = 1,
    POST = 2,
    PUT = 3,
    DELETE = 4
};

int main() {
    HttpMethod method = HttpMethod::POST;
    // std::cout << method; // COMPILE ERROR: No implicit conversion to int
    std::cout << "HTTP Method Code: " << static_cast<int>(method) << "\\n";
    return 0;
}`,
          },
          pitfall: 'Plain `enum` values collide when two enums in the same file have a member with the same name (e.g. `Status::OK` vs `Http::OK`).',
          quickCheck: {
            question: 'Why is `enum class` preferred over traditional C-style `enum`?',
            options: [
              'It prevents namespace pollution and prevents implicit conversion to int',
              'It compiles faster than legacy enum',
              'It can only store string values',
              'It is automatically garbage collected'
            ],
            correctIndex: 0,
            explanation: 'enum class values are scoped to their type (Color::Red) and require explicit casting to integers, preventing bugs.',
          },
        },
        {
          id: 'cpp-w1-d1-t8',
          topicNumber: 8,
          title: 'Anatomy of a Production Translation Unit & Capstone Day 1',
          explanation: [
            'A production C++ file cleanly combines header guards (`#pragma once`), standard includes, custom namespace encapsulation, and the `int main()` entry point.',
            'Namespaces (`namespace Engine { ... }`) prevent global symbol collisions in large codebases. Never write `using namespace std;` in header files because it pollutes every file that includes that header.',
            'Returning `0` from `main()` indicates successful execution to the operating system; C++ implicitly appends `return 0;` if omitted from `main()`.'
          ],
          keyRules: [
            'Use #pragma once at the top of headers as the industry-standard header guard.',
            'Never place "using namespace std;" in header files.',
            'Encapsulate domain code inside your own project namespace.'
          ],
          codeSnippet: {
            id: 'cpp-snip-1-8',
            title: 'Production C++ Program Blueprint',
            description: 'Structured translation unit with namespaces and clean entry point',
            language: 'cpp',
            code: `#include <iostream>
#include <cstdint>
#include <string_view>

namespace SystemsAcademy {
    constexpr std::string_view ACADEMY_NAME = "C++ Systems Mastery";
    
    void bootMessage() {
        std::cout << "Booting " << ACADEMY_NAME << " Translation Unit\\n";
        std::cout << "C++ Standard: " << __cplusplus << "\\n";
    }
}

int main() {
    SystemsAcademy::bootMessage();
    return 0;
}`,
          },
          pitfall: 'Placing `using namespace std;` in a header file forces that namespace on every translation unit that includes it, breaking compilation with ambiguous symbols.',
          quickCheck: {
            question: 'Where should `using namespace std;` strictly NEVER be placed?',
            options: [
              'Inside header files (.h / .hpp)',
              'Inside small test .cpp files',
              'Inside local function bodies',
              'Inside main.cpp'
            ],
            correctIndex: 0,
            explanation: 'Including `using namespace std;` in a header leaks the entire standard namespace into every source file that includes it.',
          },
        },
      ],
      practiceChallenge: {
        title: 'Day 1 Capstone: Memory-Sized Network Packet Header',
        instructions: [
          'Define an enum class PacketType with underlying type uint8_t containing: SYN=1, ACK=2, DATA=3, FIN=4.',
          'Create a struct PacketHeader with exact-width types: uint32_t sequenceId, PacketType type, and uint16_t payloadLength.',
          'Verify that sizeof(PacketHeader) and sizeof(PacketType) match expectations.',
        ],
        starterCode: `#include <iostream>
#include <cstdint>

// 1. Define PacketType with uint8_t underlying storage

// 2. Define PacketHeader struct

int main() {
    std::cout << "Testing Network Packet Header..." << std::endl;
    return 0;
}`,
        solutionCode: `#include <iostream>
#include <cstdint>

enum class PacketType : uint8_t {
    SYN = 1,
    ACK = 2,
    DATA = 3,
    FIN = 4
};

struct PacketHeader {
    uint32_t sequenceId{0};
    PacketType type{PacketType::SYN};
    uint16_t payloadLength{0};
};

int main() {
    PacketHeader header{1001, PacketType::DATA, 512};
    std::cout << "Packet Sequence: " << header.sequenceId << "\\n";
    std::cout << "Packet Type:     " << static_cast<int>(header.type) << "\\n";
    std::cout << "Payload Length:  " << header.payloadLength << " bytes\\n";
    std::cout << "Header Size:     " << sizeof(PacketHeader) << " bytes\\n";
    return 0;
}`,
        hints: [
          'Remember to specify : uint8_t after enum class PacketType.',
          'Use static_cast<int>(header.type) when printing with std::cout.',
        ],
      },
      keyTakeaways: [
        'C++ compiles through 4 distinct stages: Preprocessor, Compiler, Assembler, and Linker.',
        'Always use <cstdint> fixed-width integer types for predictable memory layout.',
        'Braced initialization prevents accidental data truncation via narrowing conversion errors.',
        'constexpr evaluates math and data structures at compile time with zero runtime CPU cost.',
      ],
    },

    // Day 2: Pointers from Scratch
    {
      id: 'cpp-w1-d2',
      dayNumber: 2,
      weekNumber: 1,
      title: 'Pointers from Scratch: Addresses & Pointer Arithmetic',
      subtitle: 'The address-of operator (&), dereferencing (*), null pointers & contiguous pointer traversal',
      durationMinutes: 65,
      overview:
        'Demystify the central mechanism of C++: pointers. Master memory addresses, pointer syntax, null pointer safety with nullptr, pointer arithmetic across contiguous buffers, and void pointers.',
      topics: [
        {
          id: 'cpp-w1-d2-t1',
          topicNumber: 1,
          title: 'Memory Addresses & The Address-of Operator (`&`)',
          explanation: [
            'Every variable stored in memory resides at a unique physical or virtual address (typically expressed as a hexadecimal number like `0x7ffee4b2891c`).',
            'The address-of operator `&` retrieves the memory address of any lvalue variable.',
            'A pointer is simply a variable whose stored value is the memory address of another variable.'
          ],
          keyRules: [
            'int* ptr = &x; declares ptr as a pointer to an integer.',
            'The size of any pointer depends on CPU architecture: 4 bytes on 32-bit systems, 8 bytes on 64-bit systems, regardless of what type it points to.'
          ],
          codeSnippet: {
            id: 'cpp-snip-2-1',
            title: 'Inspecting Memory Addresses',
            description: 'Printing variable addresses and pointer memory footprints',
            language: 'cpp',
            code: `#include <iostream>

int main() {
    int score = 95;
    int* pScore = &score;

    std::cout << "Value of score:        " << score << "\\n";
    std::cout << "Address of score (&):  " << &score << "\\n";
    std::cout << "Value stored in pScore:" << pScore << "\\n";
    std::cout << "Address of pointer:    " << &pScore << "\\n";
    std::cout << "Pointer size (64-bit): " << sizeof(pScore) << " bytes\\n";
    return 0;
}`,
          },
          pitfall: 'Confusing the address-of operator `&` with the bitwise AND operator `&`.',
          quickCheck: {
            question: 'What is the size of a pointer to a char (`char*`) on a 64-bit operating system?',
            options: ['1 byte', '4 bytes', '8 bytes', '16 bytes'],
            correctIndex: 2,
            explanation: 'On a 64-bit architecture, ALL pointers occupy 8 bytes because they hold a 64-bit memory address.',
          },
        },
        {
          id: 'cpp-w1-d2-t2',
          topicNumber: 2,
          title: 'Dereferencing Pointers (`*`) & Indirect Mutation',
          explanation: [
            'Dereferencing a pointer using the unary `*` operator accesses the value residing at the target memory address.',
            'Reading `*ptr` fetches the pointed-to value. Writing `*ptr = newValue;` modifies the target variable indirectly.',
            'The pointer type (e.g. `int*` vs `double*`) informs the compiler how many bytes to read/write starting from that memory address.'
          ],
          keyRules: [
            '*ptr reads or writes the value at the destination address.',
            'Dereferencing an uninitialized or wild pointer leads to undefined behavior or segmentation fault.'
          ],
          codeSnippet: {
            id: 'cpp-snip-2-2',
            title: 'Dereferencing & Indirect Mutation',
            description: 'Mutating variables through pointers',
            language: 'cpp',
            code: `#include <iostream>

int main() {
    int balance = 500;
    int* pBalance = &balance;

    std::cout << "Original balance: " << balance << "\\n";
    
    // Indirect mutation via dereference
    *pBalance += 250;

    std::cout << "Mutated balance:  " << balance << "\\n";
    return 0;
}`,
          },
          pitfall: 'Dereferencing a dangling pointer whose target has been destroyed causes silent memory corruption.',
          quickCheck: {
            question: 'What does `*p = 100;` do if `p` points to variable `x`?',
            options: [
              'Assigns 100 to the variable x',
              'Changes the memory address stored in p to 100',
              'Creates a new pointer with value 100',
              'Emits a compiler syntax error'
            ],
            correctIndex: 0,
            explanation: 'Dereferencing `p` accesses `x` directly, mutating `x` to 100.',
          },
        },
        {
          id: 'cpp-w1-d2-t3',
          topicNumber: 3,
          title: 'The `nullptr` Literal vs Legacy `NULL` / `0`',
          explanation: [
            'In C and pre-C++11, null pointers were represented by the macro `NULL` or the literal integer `0`. This caused subtle bugs when calling overloaded functions.',
            'C++11 introduced `nullptr`, a keyword of type `std::nullptr_t`. It implicitly converts to any pointer type, but NEVER converts to an integer.',
            'Always initialize pointers that do not yet have a target to `nullptr`.'
          ],
          keyRules: [
            'Always initialize pointers: int* ptr = nullptr; instead of leaving them uninitialized.',
            'Always check if (ptr != nullptr) before dereferencing.'
          ],
          codeSnippet: {
            id: 'cpp-snip-2-3',
            title: 'nullptr Safety & Overload Disambiguation',
            description: 'Why nullptr is strictly typesafe compared to legacy 0/NULL',
            language: 'cpp',
            code: `#include <iostream>

void inspect(int val) {
    std::cout << "inspect(int): " << val << "\\n";
}

void inspect(int* ptr) {
    std::cout << "inspect(int*): " << (ptr ? "Valid Pointer" : "nullptr") << "\\n";
}

int main() {
    inspect(0);        // Calls inspect(int)
    inspect(nullptr);  // Unambiguously calls inspect(int*)
    return 0;
}`,
          },
          pitfall: 'Passing `NULL` to overloaded functions can invoke the `int` overload instead of the pointer overload because `NULL` is `#define NULL 0`.',
          quickCheck: {
            question: 'What is the type of the `nullptr` literal in C++11 and later?',
            options: ['std::nullptr_t', 'void*', 'long int', 'int*'],
            correctIndex: 0,
            explanation: 'nullptr has its own unique, typesafe type: std::nullptr_t.',
          },
        },
        {
          id: 'cpp-w1-d2-t4',
          topicNumber: 4,
          title: 'Pointer Arithmetic & Memory Offsets',
          explanation: [
            'Adding an integer `k` to a pointer `ptr + k` does not add `k` bytes; it advances the address by `k * sizeof(*ptr)` bytes.',
            'For example, if `int* p = 0x1000;`, then `p + 1` evaluates to `0x1004` (since `sizeof(int) == 4`).',
            'Subtracting two pointers pointing to elements in the same array yields the number of elements between them, represented by `std::ptrdiff_t`.'
          ],
          keyRules: [
            'Pointer arithmetic is only defined within the bounds of an array (plus one past the end).',
            'ptr++ advances to the next contiguous element.',
            'ptr2 - ptr1 computes element distance, not raw byte distance.'
          ],
          codeSnippet: {
            id: 'cpp-snip-2-4',
            title: 'Pointer Arithmetic Across Contiguous Arrays',
            description: 'Demonstrating stride progression based on sizeof(T)',
            language: 'cpp',
            code: `#include <iostream>

int main() {
    int numbers[] = {10, 20, 30, 40, 50};
    int* ptr = numbers; // Decays to &numbers[0]

    std::cout << "Element 0: " << *ptr << " at " << ptr << "\\n";
    ptr++; // Advances by sizeof(int) = 4 bytes
    std::cout << "Element 1: " << *ptr << " at " << ptr << "\\n";
    ptr += 2;
    std::cout << "Element 3: " << *ptr << " at " << ptr << "\\n";
    return 0;
}`,
          },
          pitfall: 'Performing pointer arithmetic outside the allocated bounds of an array causes Undefined Behavior.',
          quickCheck: {
            question: 'If `double* p = (double*)0x2000;` and `sizeof(double) == 8`, what is `p + 2`?',
            options: ['0x2010 (hexadecimal for +16 bytes)', '0x2002', '0x2008', '0x2016'],
            correctIndex: 0,
            explanation: 'p + 2 adds 2 * sizeof(double) = 16 bytes = 0x10 in hex. 0x2000 + 0x10 = 0x2010.',
          },
        },
        {
          id: 'cpp-w1-d2-t5',
          topicNumber: 5,
          title: 'Pointers and Array Decay',
          explanation: [
            'In C++, the name of a raw array decays implicitly into a pointer to its first element (`&arr[0]`) when passed to functions or assigned to pointers.',
            'However, a raw array retains its total size (`sizeof(arr) == N * sizeof(T)`) within its declaring scope, whereas a decayed pointer only has `sizeof(ptr) == 8`.',
            'Bracket indexing `arr[i]` is syntactic sugar for `*(arr + i)`.'
          ],
          keyRules: [
            'arr[i] is identical to *(arr + i).',
            'Passing raw arrays to functions strips size information; pass size separately or use std::span / std::array.'
          ],
          codeSnippet: {
            id: 'cpp-snip-2-5',
            title: 'Array Decay vs sizeof Preservation',
            description: 'Comparing raw array scope vs decayed function parameter pointer',
            language: 'cpp',
            code: `#include <iostream>

void printArrayInfo(int arr[]) {
    // arr is a pointer here!
    std::cout << "Inside function sizeof(arr): " << sizeof(arr) << " bytes (pointer size)\\n";
}

int main() {
    int buffer[5] = {1, 2, 3, 4, 5};
    std::cout << "Inside main sizeof(buffer):  " << sizeof(buffer) << " bytes (5 * 4)\\n";
    printArrayInfo(buffer);
    return 0;
}`,
          },
          pitfall: 'Trying to compute the number of elements in a function parameter array using `sizeof(arr) / sizeof(arr[0])` calculates `8 / 4 = 2` on 64-bit systems instead of true array length.',
          quickCheck: {
            question: 'Why does passing an array to a function `void foo(int arr[])` cause array decay?',
            options: [
              'The array parameter decays into a pointer `int*` to its first element',
              'The array elements are copied onto the stack',
              'The array is automatically converted to std::vector',
              'The compiler throws an error unless std::array is used'
            ],
            correctIndex: 0,
            explanation: 'Function parameter `int arr[]` is adjusted by the compiler to `int* arr`, losing the original array size.',
          },
        },
        {
          id: 'cpp-w1-d2-t6',
          topicNumber: 6,
          title: '`void*` (Generic Pointers) & Static Casts',
          explanation: [
            'A `void*` is a pointer to an untyped memory address. It can store the address of any object without an explicit cast.',
            'Because `void` has no size, you CANNOT dereference or perform pointer arithmetic on a `void*`.',
            'To access the underlying data, you must cast it back to a typed pointer using `static_cast<T*>()` or `reinterpret_cast<T*>()`.'
          ],
          keyRules: [
            'void* cannot be dereferenced directly (*p is illegal).',
            'Use static_cast<TargetType*>(voidPtr) to restore type information.',
            'Widely used in low-level memory managers, callbacks, and OS APIs.'
          ],
          codeSnippet: {
            id: 'cpp-snip-2-6',
            title: 'Generic void* and static_cast',
            description: 'Safely handling untyped memory addresses',
            language: 'cpp',
            code: `#include <iostream>

int main() {
    int secret = 777;
    void* genericPtr = &secret; // Implicit conversion to void*

    // std::cout << *genericPtr; // COMPILE ERROR: Cannot dereference void*
    
    // Explicit static_cast back to int*
    int* intPtr = static_cast<int*>(genericPtr);
    std::cout << "Recovered value: " << *intPtr << "\\n";
    return 0;
}`,
          },
          pitfall: 'Casting a `void*` to the wrong pointer type causes undefined behavior and garbage data reads.',
          quickCheck: {
            question: 'Can you dereference a `void*` pointer directly (`*ptr`)?',
            options: [
              'No, because the compiler does not know the size or type of the object',
              'Yes, it defaults to a 1-byte char read',
              'Yes, it reads a 64-bit integer',
              'Only inside main()'
            ],
            correctIndex: 0,
            explanation: 'void has an incomplete type with unknown size, making direct dereferencing illegal.',
          },
        },
        {
          id: 'cpp-w1-d2-t7',
          topicNumber: 7,
          title: 'Pointer to Pointer (`T**`) & Dynamic 2D Arrays',
          explanation: [
            'A pointer to a pointer stores the address of another pointer. Syntax: `int** ptrToPtr;`.',
            'Pointer-to-pointer is commonly used for dynamic 2D matrices, modifying pointers inside functions, and handling arrays of string pointers (`char* argv[]`).',
            'Each level of `*` dereferences one indirection level: `**pp` accesses the underlying integer.'
          ],
          keyRules: [
            '*pp yields the address of the intermediate pointer.',
            '**pp yields the actual value.',
            'In modern C++, prefer flat 1D vectors with row-major indexing: index = row * cols + col.'
          ],
          codeSnippet: {
            id: 'cpp-snip-2-7',
            title: 'Pointer-to-Pointer Indirection',
            description: 'Two levels of indirection and value access',
            language: 'cpp',
            code: `#include <iostream>

int main() {
    int target = 1337;
    int* p1 = &target;
    int** p2 = &p1;

    std::cout << "Target value:          " << target << "\\n";
    std::cout << "Via single deref (*p1): " << *p1 << "\\n";
    std::cout << "Via double deref (**p2): " << **p2 << "\\n";
    return 0;
}`,
          },
          pitfall: 'Allocating 2D arrays as arrays of pointers (`new int*[rows]`) scatters rows across the heap, destroying CPU cache locality compared to contiguous flat buffers.',
          quickCheck: {
            question: 'If `p` is an `int*`, what is the type of `&p`?',
            options: ['int**', 'int*', 'int&', 'void*'],
            correctIndex: 0,
            explanation: 'Taking the address of an `int*` yields a pointer to a pointer to int: `int**`.',
          },
        },
        {
          id: 'cpp-w1-d2-t8',
          topicNumber: 8,
          title: 'Pointer Safety Guidelines & Day 2 Capstone',
          explanation: [
            'Pointers provide maximum performance and hardware control, but improper usage causes the majority of security vulnerabilities (use-after-free, buffer overflows, null dereference).',
            'Adhere to three defensive rules: (1) Always initialize to `nullptr`; (2) Always null-check before dereference; (3) Set freed pointers to `nullptr` immediately after deletion.',
            'In Days 3 and 10, we will learn how modern references and smart pointers (`std::unique_ptr`) automate these protections.'
          ],
          keyRules: [
            'Rule 1: Never leave a pointer uninitialized.',
            'Rule 2: Never return a pointer to a local stack variable.',
            'Rule 3: Set deleted pointers to nullptr.'
          ],
          codeSnippet: {
            id: 'cpp-snip-2-8',
            title: 'Defensive Pointer Traversal Pattern',
            description: 'Safe sequential array traversal using pointer arithmetic',
            language: 'cpp',
            code: `#include <iostream>

void traverseBuffer(const int* start, size_t count) {
    if (!start) return; // Guard clause
    const int* end = start + count;
    
    std::cout << "Buffer contents: ";
    for (const int* curr = start; curr != end; ++curr) {
        std::cout << *curr << " ";
    }
    std::cout << "\\n";
}

int main() {
    int data[] = {10, 20, 30, 40, 50};
    traverseBuffer(data, 5);
    return 0;
}`,
          },
          pitfall: 'Returning the address of a local stack variable: `int* getPtr() { int x = 10; return &x; }` causes catastrophic undefined behavior because the stack frame is destroyed on return.',
          quickCheck: {
            question: 'What happens if a function returns `&x` where `x` is a local stack variable?',
            options: [
              'It returns a dangling pointer to deallocated stack memory (undefined behavior)',
              'The compiler promotes x to the heap automatically',
              'The variable remains valid indefinitely',
              'The program fails to link'
            ],
            correctIndex: 0,
            explanation: 'Local stack variables are popped when the function returns, leaving a dangling pointer.',
          },
        },
      ],
      practiceChallenge: {
        title: 'Day 2 Capstone: In-Place Array Reversal via Pointer Arithmetic',
        instructions: [
          'Implement a function `void reverseArray(int* start, int* end)` where `start` points to the first element and `end` points to the last element.',
          'Use two pointers (`left` moving forward, `right` moving backward) and swap values until they meet.',
          'Do NOT use bracket notation `arr[i]`; use only pointer dereferencing and arithmetic.',
        ],
        starterCode: `#include <iostream>

void reverseArray(int* start, int* end) {
    // Implement pointer-based in-place reversal
}

int main() {
    int arr[] = {1, 2, 3, 4, 5, 6};
    // Call reverseArray and print results
    return 0;
}`,
        solutionCode: `#include <iostream>

void reverseArray(int* start, int* end) {
    while (start < end) {
        int temp = *start;
        *start = *end;
        *end = temp;
        start++;
        end--;
    }
}

int main() {
    int arr[] = {1, 2, 3, 4, 5, 6};
    size_t n = sizeof(arr) / sizeof(arr[0]);

    std::cout << "Original: ";
    for (size_t i = 0; i < n; i++) std::cout << arr[i] << " ";
    std::cout << "\\n";

    reverseArray(arr, arr + n - 1);

    std::cout << "Reversed: ";
    for (size_t i = 0; i < n; i++) std::cout << arr[i] << " ";
    std::cout << "\\n";
    return 0;
}`,
        hints: [
          'The loop condition should be `while (start < end)`.',
          'Increment `start++` and decrement `end--` inside the loop.',
        ],
      },
      keyTakeaways: [
        'A pointer stores the memory address of an object; dereferencing (*) accesses the value.',
        'Always use `nullptr` instead of `0` or `NULL` for typesafe pointer initialization.',
        'Pointer arithmetic advances by `sizeof(T)` bytes per step, not 1 byte.',
        'Never return the address of a local stack variable.',
      ],
    },

    // Days 3 to 7 will complete Week 1
    // Day 3: References vs Pointers, Const Correctness & Value Semantics
    {
      id: 'cpp-w1-d3',
      dayNumber: 3,
      weekNumber: 1,
      title: 'References, Const Correctness & Value Semantics',
      subtitle: 'Lvalue references, re-binding impossibility, const references & pointer-to-const vs const-pointer',
      durationMinutes: 60,
      overview:
        'Learn the power of C++ references: aliases that never require null-checking. Understand const-correctness from left-to-right reading rules and pass-by-const-reference for zero-copy performance.',
      topics: [
        {
          id: 'cpp-w1-d3-t1',
          topicNumber: 1,
          title: 'Lvalue References (`&`) as Variable Aliases',
          explanation: [
            'A reference is an alias for an existing object. Syntax: `int& ref = original;`.',
            'Unlike pointers, a reference MUST be initialized at creation time. It cannot be null, and it CANNOT be rebound to refer to a different object later.',
            'Any operation applied to `ref` is applied directly to the original object.'
          ],
          keyRules: [
            'References cannot be null: no null checks required.',
            'References cannot be rebound: assigning ref = other changes original value, not alias binding.',
            'References do not have their own address; &ref returns the address of the target object.'
          ],
          codeSnippet: {
            id: 'cpp-snip-3-1',
            title: 'Reference Alias Semantics',
            description: 'Direct variable aliasing without pointer syntax',
            language: 'cpp',
            code: `#include <iostream>

int main() {
    int count = 10;
    int& refCount = count; // Alias for count

    refCount = 25; // Modifies count directly
    std::cout << "count: " << count << ", refCount: " << refCount << "\\n";
    std::cout << "Address count: " << &count << ", Address ref: " << &refCount << "\\n";
    return 0;
}`,
          },
          pitfall: 'Trying to re-bind a reference with `ref = other;` does NOT point the reference to `other`; it assigns the value of `other` into the original variable.',
          quickCheck: {
            question: 'Can a C++ reference be rebound to refer to a different variable after initialization?',
            options: ['No, references can never be rebound', 'Yes, using the & operator', 'Yes, using the = operator', 'Only inside loops'],
            correctIndex: 0,
            explanation: 'References are permanent aliases established at initialization; they cannot be rebound to refer to another object.',
          },
        },
        {
          id: 'cpp-w1-d3-t2',
          topicNumber: 2,
          title: 'Pass-by-Const-Reference (`const T&`) for Zero-Copy',
          explanation: [
            'Passing large objects (strings, vectors, custom structs) by value copies the entire memory footprint onto the stack, destroying throughput.',
            'Passing by `const T&` passes a lightweight memory address (8 bytes on 64-bit) while guaranteeing to the caller that the function will NOT mutate the object.',
            'Fundamental rule of C++ API design: Pass cheap primitives (int, double, pointers, std::string_view) by value; pass non-trivial objects by `const T&`.'
          ],
          keyRules: [
            'Rule of thumb: sizeof(T) <= 2 * sizeof(void*) -> pass by value; larger -> pass by const T&.',
            'const references can bind to temporary rvalue literals (e.g. const std::string& s = "hello";).'
          ],
          codeSnippet: {
            id: 'cpp-snip-3-2',
            title: 'Pass-by-Value vs Pass-by-Const-Reference',
            description: 'Eliminating deep buffer clones in function arguments',
            language: 'cpp',
            code: `#include <iostream>
#include <string>

// Zero-copy: passes pointer address under the hood, read-only
void printMessage(const std::string& msg) {
    std::cout << "Message: " << msg << " (Length: " << msg.length() << ")\\n";
}

int main() {
    std::string text = "High-performance systems engineering in modern C++";
    printMessage(text);
    return 0;
}`,
          },
          pitfall: 'Passing small primitive types (like `int` or `float`) by `const int&` is actually SLOWER than passing by value because it adds pointer indirection overhead.',
          quickCheck: {
            question: 'Why is `const std::string&` preferred over `std::string` in function parameters?',
            options: [
              'It avoids an expensive heap copy of the string contents',
              'It makes the string mutable inside the function',
              'It converts the string to a C-string',
              'It allows returning multiple strings'
            ],
            correctIndex: 0,
            explanation: 'Passing by const reference passes only a memory address, avoiding heap allocation and deep buffer copying.',
          },
        },
        {
          id: 'cpp-w1-d3-t3',
          topicNumber: 3,
          title: 'Pointer to Const vs Const Pointer (Clockwise / Spiral Rule)',
          explanation: [
            'Understanding `const` placement with pointers is critical in C++.',
            '`const int* ptr` (or `int const* ptr`): Pointer to CONST data. The target integer CANNOT be modified through `ptr`, but `ptr` can be pointed to another address.',
            '`int* const ptr`: CONST pointer to mutable data. The target integer can be modified, but `ptr` itself CANNOT be changed to point elsewhere.',
            '`const int* const ptr`: CONST pointer to CONST data. Neither the pointer address nor the target data can be changed.'
          ],
          keyRules: [
            'Read type declarations from right to left starting at the identifier.',
            'const to the left of * = data is const.',
            'const to the right of * = pointer address is const.'
          ],
          codeSnippet: {
            id: 'cpp-snip-3-3',
            title: 'Deciphering Const Pointers',
            description: 'Target immutability vs pointer address immutability',
            language: 'cpp',
            code: `#include <iostream>

int main() {
    int a = 10, b = 20;

    // 1. Pointer to CONST data
    const int* pDataConst = &a;
    // *pDataConst = 15; // ERROR: data is read-only
    pDataConst = &b;     // OK: pointer can move

    // 2. CONST pointer to mutable data
    int* const pPtrConst = &a;
    *pPtrConst = 15;     // OK: data can change
    // pPtrConst = &b;   // ERROR: pointer is fixed

    std::cout << "a: " << a << ", b: " << b << "\\n";
    return 0;
}`,
          },
          pitfall: 'Accidentally using `int* const` instead of `const int*` when you intended to protect the data from mutation.',
          quickCheck: {
            question: 'What is immutable in `const int* p`?',
            options: [
              'The integer data pointed to by p',
              'The memory address stored in p',
              'Both the data and the address',
              'Neither'
            ],
            correctIndex: 0,
            explanation: 'Because const appears before the asterisk, the pointed-to int value is read-only.',
          },
        },
        {
          id: 'cpp-w1-d3-t4',
          topicNumber: 4,
          title: 'Const Member Functions in Classes',
          explanation: [
            'In C++, member functions that do not mutate member variables should be marked with trailing `const`: `int getScore() const { return score; }`.',
            'Within a `const` member function, all member variables are treated as `const`, and `this` has type `const MyClass* const`.',
            'Const member functions are required so that callers holding a `const MyClass&` can invoke them.'
          ],
          keyRules: [
            'Mark all getters and inspection methods as const.',
            'A const object or const reference can ONLY invoke const member functions.',
            'Use mutable keyword only for caching/mutex primitives that do not affect observable state.'
          ],
          codeSnippet: {
            id: 'cpp-snip-3-4',
            title: 'Const Member Function Declaration',
            description: 'Enabling inspection on const object instances',
            language: 'cpp',
            code: `#include <iostream>

class SensorReading {
private:
    double temperature;
public:
    explicit SensorReading(double temp) : temperature(temp) {}
    
    // Const member function: promises not to modify *this
    double getCelsius() const {
        return temperature;
    }
};

void logSensor(const SensorReading& sensor) {
    // Only legal because getCelsius() is marked const
    std::cout << "Sensor: " << sensor.getCelsius() << " C\\n";
}

int main() {
    SensorReading r(24.5);
    logSensor(r);
    return 0;
}`,
          },
          pitfall: 'Omitting `const` on a getter prevents it from being called whenever the object is passed by `const&`, causing cascading compilation errors.',
          quickCheck: {
            question: 'What happens if you try to call a non-const member function on a `const` object reference?',
            options: [
              'Compilation error: non-const method cannot be called on a const object',
              'The const qualifier is automatically stripped',
              'It throws a runtime exception',
              'The object is copied'
            ],
            correctIndex: 0,
            explanation: 'The compiler prevents calling non-const methods on const objects to enforce const-correctness.',
          },
        },
        {
          id: 'cpp-w1-d3-t5',
          topicNumber: 5,
          title: 'Const Casting & The `mutable` Keyword',
          explanation: [
            'The `mutable` keyword allows a class member variable to be modified even inside `const` member functions.',
            'This is strictly intended for internal implementation details that do not alter the logical state of the object, such as `std::mutex` locks or memoization caches.',
            '`const_cast<T*>` or `const_cast<T&>` removes constness. However, modifying an object that was originally declared `const` via `const_cast` is UNDEFINED BEHAVIOR.'
          ],
          keyRules: [
            'Use mutable exclusively for mutexes, thread locks, and internal cache counters.',
            'Never cast away const with const_cast to modify truly const data.'
          ],
          codeSnippet: {
            id: 'cpp-snip-3-5',
            title: 'Thread-Safe Mutable Access Counter',
            description: 'Using mutable for internal access logging in const methods',
            language: 'cpp',
            code: `#include <iostream>

class DataService {
private:
    int payload{42};
    mutable size_t accessCount{0}; // Modifiable even in const methods
public:
    int readPayload() const {
        accessCount++; // Legal because accessCount is mutable
        return payload;
    }

    size_t getAccessCount() const { return accessCount; }
};

int main() {
    const DataService service;
    service.readPayload();
    service.readPayload();
    std::cout << "Reads executed: " << service.getAccessCount() << "\\n";
    return 0;
}`,
          },
          pitfall: 'Using `const_cast` to modify an object in read-only memory (ROM/Flash or .rodata section) results in a hardware memory fault crash.',
          quickCheck: {
            question: 'When is using the `mutable` keyword on a class member variable justified?',
            options: [
              'For internal implementation details like mutexes and caches that do not affect logical state',
              'To bypass all access modifiers (private/protected)',
              'To allow any function to delete the object',
              'To make the variable global'
            ],
            correctIndex: 0,
            explanation: 'mutable is specifically designed for thread locks, memoization, and debug statistics that do not change logical observable state.',
          },
        },
        {
          id: 'cpp-w1-d3-t6',
          topicNumber: 6,
          title: 'Structured Binding Declarations (C++17)',
          explanation: [
            'C++17 introduced structured bindings (`auto [x, y] = pair;`), allowing simultaneous decomposition of tuples, pairs, structs, and fixed arrays into individual named aliases.',
            'Syntax: `auto [a, b, c] = myStruct;` copies members; `const auto& [a, b, c] = myStruct;` binds const references without copying.',
            'Extensively used when iterating over key-value maps: `for (const auto& [key, value] : myMap)`. '
          ],
          keyRules: [
            'Use const auto& [k, v] when iterating over std::map to prevent pair copying.',
            'Works seamlessly on public aggregate structs without boilerplate getter methods.'
          ],
          codeSnippet: {
            id: 'cpp-snip-3-6',
            title: 'Structured Bindings with Structs & Maps',
            description: 'Clean tuple and struct unpacking in C++17',
            language: 'cpp',
            code: `#include <iostream>

struct Point3D {
    double x{0.0};
    double y{0.0};
    double z{0.0};
};

int main() {
    Point3D origin{1.5, 2.5, 3.5};
    
    // C++17 Structured binding by const reference
    const auto& [posX, posY, posZ] = origin;

    std::cout << "Decomposed point: (" << posX << ", " << posY << ", " << posZ << ")\\n";
    return 0;
}`,
          },
          pitfall: 'Writing `auto [x, y]` creates copies of all fields; remember `auto& [x, y]` if you intend to modify the original struct fields.',
          quickCheck: {
            question: 'What C++ standard version introduced structured bindings (`auto [x, y] = ...`)?',
            options: ['C++17', 'C++11', 'C++14', 'C++20'],
            correctIndex: 0,
            explanation: 'Structured bindings were officially standardized in C++17.',
          },
        },
        {
          id: 'cpp-w1-d3-t7',
          topicNumber: 7,
          title: 'References vs Pointers Comparison Matrix',
          explanation: [
            'Both pointers and references achieve indirection and pass-by-address, but have distinct design constraints.',
            'References: Must be initialized, cannot be null, cannot be rebound, access members with `.`, cleaner syntax.',
            'Pointers: Can be uninitialized/null, can be rebound to new targets, support pointer arithmetic, access members with `->`.'
          ],
          keyRules: [
            'Use references by default for parameters and return types.',
            'Use pointers when optionality (nullability) or rebinding is genuinely required.',
            'Use smart pointers (std::unique_ptr) when managing ownership of dynamic memory.'
          ],
          codeSnippet: {
            id: 'cpp-snip-3-7',
            title: 'Side-by-Side: Reference vs Pointer Usage',
            description: 'Contrasting syntax, nullability, and access semantics',
            language: 'cpp',
            code: `#include <iostream>

void modifyViaRef(int& ref) {
    ref += 10; // Clean syntax, guaranteed non-null
}

void modifyViaPtr(int* ptr) {
    if (ptr) { // Must check for null
        *ptr += 10;
    }
}

int main() {
    int val = 100;
    modifyViaRef(val);
    modifyViaPtr(&val);
    std::cout << "Final val: " << val << "\\n"; // 120
    return 0;
}`,
          },
          pitfall: 'Returning a reference to a local stack variable produces a dangling reference, identically dangerous to a dangling pointer.',
          quickCheck: {
            question: 'When should a pointer be chosen over a reference for a function parameter?',
            options: [
              'When the argument is optional and can be `nullptr`',
              'When passing a primitive int',
              'Whenever you want better performance',
              'When passing a std::string'
            ],
            correctIndex: 0,
            explanation: 'Pointers represent nullable/optional semantics; references guarantee a non-null target.',
          },
        },
        {
          id: 'cpp-w1-d3-t8',
          topicNumber: 8,
          title: 'Day 3 Capstone: Const-Correct Financial Transaction Ledger',
          explanation: [
            'Synthesizing Day 3 concepts into a realistic banking transaction engine.',
            'Demonstrating const-correct getters, pass-by-const-reference, structured bindings, and mutable audit trail logging.',
            'Clean architecture separates mutable command operations from read-only query operations.'
          ],
          keyRules: [
            'Command-Query Separation: Mutation methods modify state; query methods are const.',
            'All non-trivial parameters passed via const reference.'
          ],
          codeSnippet: {
            id: 'cpp-snip-3-8',
            title: 'Production Const-Correct Account Class',
            description: 'Complete class implementing full const correctness',
            language: 'cpp',
            code: `#include <iostream>
#include <string>

class BankAccount {
private:
    std::string owner;
    double balance;
    mutable size_t queryCount{0};

public:
    BankAccount(const std::string& name, double initial) 
        : owner(name), balance(initial) {}

    // Const query method
    double getBalance() const {
        queryCount++;
        return balance;
    }

    const std::string& getOwner() const { return owner; }
    size_t getQueryCount() const { return queryCount; }

    // Mutating command method
    void deposit(double amount) {
        if (amount > 0) balance += amount;
    }
};

int main() {
    const BankAccount acct("Engineering Corp", 100000.0);
    std::cout << acct.getOwner() << " Balance: $" << acct.getBalance() << "\\n";
    return 0;
}`,
          },
          pitfall: 'Failing to declare query methods const makes them unusable on const account instances.',
          quickCheck: {
            question: 'What is the primary benefit of const-correctness across a large C++ codebase?',
            options: [
              'It provides compile-time guarantees against unintended state mutations and documents API intent',
              'It eliminates the need for header files',
              'It disables the garbage collector',
              'It forces all functions to be inlined'
            ],
            correctIndex: 0,
            explanation: 'Const-correctness enables the compiler to enforce immutability rules, preventing whole classes of mutation bugs at compile time.',
          },
        },
      ],
      practiceChallenge: {
        title: 'Day 3 Capstone: Safe Buffer Viewer Class',
        instructions: [
          'Create a class `BufferViewer` that holds a `const int* data` and `size_t size`.',
          'Implement const member functions `size()`, `get(size_t index)`, and `print()` that traverse the buffer without modifying it.',
          'Verify that a const instance of `BufferViewer` can call all member functions.',
        ],
        starterCode: `#include <iostream>

class BufferViewer {
    // Implement BufferViewer with const correctness
};

int main() {
    int arr[] = {10, 20, 30, 40};
    // Initialize const BufferViewer and call methods
    return 0;
}`,
        solutionCode: `#include <iostream>

class BufferViewer {
private:
    const int* m_data{nullptr};
    size_t m_size{0};

public:
    BufferViewer(const int* data, size_t size) : m_data(data), m_size(size) {}

    size_t size() const { return m_size; }

    int get(size_t index) const {
        if (index >= m_size || !m_data) return -1;
        return m_data[index];
    }

    void print() const {
        std::cout << "[ ";
        for (size_t i = 0; i < m_size; ++i) {
            std::cout << m_data[i] << " ";
        }
        std::cout << "]\\n";
    }
};

int main() {
    int arr[] = {10, 20, 30, 40};
    const BufferViewer viewer(arr, 4);
    std::cout << "Viewer size: " << viewer.size() << "\\n";
    std::cout << "Item at index 2: " << viewer.get(2) << "\\n";
    viewer.print();
    return 0;
}`,
        hints: [
          'Make sure all public inspection functions end with the `const` keyword.',
          'Store the pointer as `const int* m_data`.',
        ],
      },
      keyTakeaways: [
        'References are permanent aliases that cannot be null or rebound.',
        'Pass large objects by `const T&` for zero-copy performance and caller safety.',
        'Read pointer declarations right-to-left: `const int*` = const data; `int* const` = const address.',
        'Mark all non-mutating class methods `const` so const references can call them.',
      ],
    },

    // Day 4: Stack vs Heap Memory Allocation (new/delete & Memory Leaks)
    {
      id: 'cpp-w1-d4',
      dayNumber: 4,
      weekNumber: 1,
      title: 'Stack vs Heap Memory: `new` / `delete` Mechanics',
      subtitle: 'Virtual address space layout, stack frames, heap fragmentation & memory leak prevention',
      durationMinutes: 65,
      overview:
        'Understand the physical anatomy of computer memory in C++: the code segment, data segment, BSS, stack, and heap. Learn dynamic memory allocation with new/delete, array new[]/delete[], and the origins of memory leaks.',
      topics: [
        {
          id: 'cpp-w1-d4-t1',
          topicNumber: 1,
          title: 'Process Virtual Memory Layout (Text, Data, BSS, Stack, Heap)',
          explanation: [
            'When an OS executes a C++ binary, it assigns it a Virtual Address Space partitioned into distinct segments.',
            'Text Segment: Read-only machine instructions. Data Segment: Initialized global and static variables. BSS: Zero-initialized global/static data.',
            'Stack: Fast, LIFO memory managed automatically by the CPU. Allocations happen by simply moving the Stack Pointer register (`%rsp`).',
            'Heap: Dynamic memory allocated at runtime via the OS memory allocator (`brk`/`mmap` via `malloc`/`new`). Slower, but persists across function calls until explicitly freed.'
          ],
          keyRules: [
            'Stack allocations are instantaneous (single instruction subtract on %rsp).',
            'Heap allocations require searching free lists, thread locks, and system calls.',
            'Stack grows downward on x86; Heap grows upward toward the stack.'
          ],
          codeSnippet: {
            id: 'cpp-snip-4-1',
            title: 'Comparing Stack vs Heap Addresses',
            description: 'Observing opposite memory address spaces for stack and heap variables',
            language: 'cpp',
            code: `#include <iostream>

int main() {
    int stackVar = 42;
    int* heapVar = new int(42);

    std::cout << "Stack address (high memory): " << &stackVar << "\\n";
    std::cout << "Heap address  (low memory):  " << heapVar << "\\n";

    delete heapVar; // Always free heap memory
    return 0;
}`,
          },
          pitfall: 'Allocating massive buffers on the stack (e.g. `int huge[10000000];`) exceeds the OS stack limit (typically 8MB on Linux) and causes immediate Stack Overflow segmentation fault.',
          quickCheck: {
            question: 'What segment of memory is managed automatically by the CPU stack pointer register?',
            options: ['The Stack', 'The Heap', 'The BSS Segment', 'The Text Segment'],
            correctIndex: 0,
            explanation: 'The stack is managed automatically by CPU push/pop and stack pointer adjustments.',
          },
        },
        {
          id: 'cpp-w1-d4-t2',
          topicNumber: 2,
          title: 'Dynamic Allocation with `new` and `delete`',
          explanation: [
            'The `new` operator performs two distinct tasks: (1) Allocates raw bytes from the free store (heap); (2) Invokes the constructor to initialize the object.',
            'The `delete` operator performs the reverse: (1) Invokes the destructor to clean up resources; (2) Returns memory back to the heap allocator.',
            'Calling `delete` on a pointer does NOT erase the pointer itself; it only frees the pointed-to memory. The pointer becomes a "dangling pointer" unless set to `nullptr`.'
          ],
          keyRules: [
            'Every single `new` must have exactly one corresponding `delete`.',
            'Deleting nullptr is completely safe and performs no operation (no-op).',
            'Always set ptr = nullptr immediately after delete ptr.'
          ],
          codeSnippet: {
            id: 'cpp-snip-4-2',
            title: 'Dynamic Heap Allocation and Deletion',
            description: 'Safe allocation, dereference, and cleanup pattern',
            language: 'cpp',
            code: `#include <iostream>

int main() {
    // 1. Allocate on heap with constructor value
    int* pNumber = new int(100);

    std::cout << "Heap value: " << *pNumber << "\\n";

    // 2. Free memory
    delete pNumber;
    pNumber = nullptr; // Neutralize dangling pointer

    // Safe to delete nullptr
    delete pNumber;
    return 0;
}`,
          },
          pitfall: 'Double deletion (`delete p; delete p;`) corrupts heap allocator metadata and crashes the application with a double-free error.',
          quickCheck: {
            question: 'What happens if you execute `delete p;` when `p == nullptr`?',
            options: [
              'Nothing: deleting nullptr is guaranteed to be a safe no-op in C++',
              'Segmentation fault crash',
              'Memory leak',
              'Compiler error'
            ],
            correctIndex: 0,
            explanation: 'The C++ standard explicitly mandates that deleting a nullptr is a safe no-op.',
          },
        },
        {
          id: 'cpp-w1-d4-t3',
          topicNumber: 3,
          title: 'Dynamic Array Allocation: `new[]` and `delete[]`',
          explanation: [
            'Allocating a contiguous array on the heap requires the array new syntax: `int* arr = new int[size];`.',
            'To free dynamic arrays, you MUST use `delete[] arr;` with empty square brackets.',
            'Using single `delete arr;` on an array allocated with `new[]` causes Undefined Behavior because it only calls the destructor for element 0 and corrupts the allocator array-cookie metadata.'
          ],
          keyRules: [
            'Match operators strictly: new -> delete; new[] -> delete[].',
            'In modern C++, prefer std::vector<T> over raw new[] for dynamic arrays.'
          ],
          codeSnippet: {
            id: 'cpp-snip-4-3',
            title: 'Dynamic Array Allocation with new[] / delete[]',
            description: 'Allocating and freeing dynamic contiguous buffers',
            language: 'cpp',
            code: `#include <iostream>

int main() {
    size_t size = 4;
    int* dynamicBuffer = new int[size]{10, 20, 30, 40};

    for (size_t i = 0; i < size; ++i) {
        std::cout << "dynamicBuffer[" << i << "] = " << dynamicBuffer[i] << "\\n";
    }

    // Must use delete[] with square brackets!
    delete[] dynamicBuffer;
    dynamicBuffer = nullptr;
    return 0;
}`,
          },
          pitfall: 'Calling `delete arr;` instead of `delete[] arr;` on an array of objects leaves elements 1 through N-1 un-destructed and leaks memory.',
          quickCheck: {
            question: 'Which operator must be used to free memory allocated with `int* buf = new int[50];`?',
            options: ['delete[] buf;', 'delete buf;', 'free(buf);', 'buf.dispose();'],
            correctIndex: 0,
            explanation: 'Allocations made with `new[]` must be matched with `delete[]`.',
          },
        },
        {
          id: 'cpp-w1-d4-t4',
          topicNumber: 4,
          title: 'Memory Leaks & Detection Tools (Valgrind & ASan)',
          explanation: [
            'A memory leak occurs when heap memory is allocated with `new`, but the pointer pointing to it is overwritten or goes out of scope before calling `delete`.',
            'Over time, uncollected memory exhausts system RAM, causing the operating system OOM killer to terminate the process.',
            'Modern C++ developers detect leaks using AddressSanitizer (`-fsanitize=address -g`) built into GCC/Clang or Valgrind (`valgrind --leak-check=full ./program`).'
          ],
          keyRules: [
            'Compile with -fsanitize=address during development and continuous integration.',
            'Never reassign a pointer holding heap memory without deleting the existing allocation first.'
          ],
          codeSnippet: {
            id: 'cpp-snip-4-4',
            title: 'Enabling AddressSanitizer (ASan) in GCC/Clang',
            description: 'Compile flags for automated memory leak and out-of-bounds detection',
            language: 'bash',
            code: `# Compile with AddressSanitizer enabled
g++ -std=c++20 -O1 -g -fsanitize=address main.cpp -o app_asan

# Run binary - ASan will report exact file & line number of any leak
./app_asan`,
          },
          pitfall: 'Reassigning a pointer in a loop without deleting: `for (...) { ptr = new Node(); }` creates thousands of unreclaimable leaked heap objects.',
          quickCheck: {
            question: 'What compiler flag enables AddressSanitizer in GCC and Clang?',
            options: ['-fsanitize=address', '-Wall', '-O3', '-fno-memory-leaks'],
            correctIndex: 0,
            explanation: '-fsanitize=address embeds memory validation instrumentation directly into the compiled binary.',
          },
        },
        {
          id: 'cpp-w1-d4-t5',
          topicNumber: 5,
          title: 'Dangling Pointers & Use-After-Free Vulnerabilities',
          explanation: [
            'A dangling pointer points to a memory address that has already been deallocated by `delete`.',
            'Attempting to read or write through a dangling pointer is a "Use-After-Free" (UAF) vulnerability—one of the most severe security exploits in computer science.',
            'Because the OS may reallocate that same memory address to a different subsystem, writing through a dangling pointer silently overwrites unrelated application state.'
          ],
          keyRules: [
            'Set pointers to nullptr immediately after deletion: delete ptr; ptr = nullptr;',
            'Never share raw ownership across multiple loose pointers without clear lifetime semantics.'
          ],
          codeSnippet: {
            id: 'cpp-snip-4-5',
            title: 'Neutralizing Dangling Pointers',
            description: 'Preventing Use-After-Free bugs with immediate nullptr assignment',
            language: 'cpp',
            code: `#include <iostream>

void demonstrateUAFPrevention() {
    int* pScore = new int(100);
    delete pScore;
    pScore = nullptr; // CRITICAL: pointer is no longer dangling!

    // Defensive check prevents catastrophic write
    if (pScore != nullptr) {
        *pScore = 200;
    } else {
        std::cout << "Defensive check caught null pointer; UAF prevented.\\n";
    }
}

int main() {
    demonstrateUAFPrevention();
    return 0;
}`,
          },
          pitfall: 'Having two pointers `p1` and `p2` pointing to the same heap object. If you `delete p1;`, `p2` becomes a dangling pointer without any indication.',
          quickCheck: {
            question: 'What is a "Use-After-Free" (UAF) vulnerability?',
            options: [
              'Accessing or writing to a memory address that has already been deallocated',
              'Calling delete on a nullptr',
              'Allocating more memory than physical RAM',
              'Using a stack variable before initializing it'
            ],
            correctIndex: 0,
            explanation: 'UAF occurs when code dereferences a pointer that points to deallocated heap storage.',
          },
        },
        {
          id: 'cpp-w1-d4-t6',
          topicNumber: 6,
          title: 'Placement `new` & Explicit Destructor Invocation',
          explanation: [
            'Standard `new` allocates memory and constructs. "Placement new" constructs an object at a PRE-ALLOCATED memory address without requesting memory from the OS.',
            'Syntax: `#include <new>; new (memoryAddress) MyClass(args);`.',
            'Extensively used in high-performance custom memory pools, game engines, and `std::vector` internals. Objects constructed via placement new MUST have their destructor called explicitly: `objPtr->~MyClass();`.'
          ],
          keyRules: [
            'Placement new requires #include <new>.',
            'Never call delete on a placement-new object; explicitly invoke its destructor objPtr->~Type().'
          ],
          codeSnippet: {
            id: 'cpp-snip-4-6',
            title: 'Placement new on Pre-Allocated Buffer',
            description: 'Constructing objects in pre-allocated memory pools',
            language: 'cpp',
            code: `#include <iostream>
#include <new>

struct Packet {
    int id;
    Packet(int i) : id(i) { std::cout << "Constructed Packet " << id << "\\n"; }
    ~Packet() { std::cout << "Destroyed Packet " << id << "\\n"; }
};

int main() {
    // 1. Pre-allocated raw byte arena
    alignas(Packet) char arena[sizeof(Packet)];

    // 2. Placement new constructs directly into arena
    Packet* p = new (arena) Packet(404);

    // 3. Explicit destructor call (do NOT delete arena)
    p->~Packet();
    return 0;
}`,
          },
          pitfall: 'Calling `delete p;` on an object constructed with placement new in a stack buffer crashes the program because `arena` was never allocated on the heap.',
          quickCheck: {
            question: 'How do you destroy an object that was constructed via placement new?',
            options: [
              'Explicitly call its destructor: ptr->~Type();',
              'Call delete ptr;',
              'Call free(ptr);',
              'It is destroyed automatically by the OS'
            ],
            correctIndex: 0,
            explanation: 'Placement new objects do not own the underlying memory, so only the destructor must be called explicitly.',
          },
        },
        {
          id: 'cpp-w1-d4-t7',
          topicNumber: 7,
          title: 'Memory Alignment & `alignof` / `alignas`',
          explanation: [
            'Modern CPUs do not read individual bytes from memory; they read in 32-bit, 64-bit, or 128-bit aligned words. Accessing misaligned data causes multi-cycle penalties or hardware bus errors.',
            '`alignof(T)` queries the byte alignment required by type `T`.',
            '`alignas(N)` forces a variable or struct to be aligned to an N-byte boundary (e.g. `alignas(64)` for cache-line alignment to avoid false sharing in multithreading).'
          ],
          keyRules: [
            'alignof(T) is typically equal to sizeof(T) for fundamental types.',
            'alignas(64) aligns data to CPU L1 cache lines (prevents cache thrashing).'
          ],
          codeSnippet: {
            id: 'cpp-snip-4-7',
            title: 'Querying and Enforcing Alignment',
            description: 'Inspecting hardware alignment with alignof and alignas',
            language: 'cpp',
            code: `#include <iostream>

struct alignas(16) SIMDVector {
    float x, y, z, w;
};

int main() {
    std::cout << "Alignment of int:        " << alignof(int) << " bytes\\n";
    std::cout << "Alignment of double:     " << alignof(double) << " bytes\\n";
    std::cout << "Alignment of SIMDVector: " << alignof(SIMDVector) << " bytes\\n";
    return 0;
}`,
          },
          pitfall: 'Specifying an alignment smaller than the natural alignment of the type is illegal and rejected by the compiler.',
          quickCheck: {
            question: 'What operator queries the alignment requirement of a type in C++?',
            options: ['alignof(T)', 'sizeof(T)', 'typeid(T)', 'offset(T)'],
            correctIndex: 0,
            explanation: 'alignof(T) returns the alignment in bytes required for instances of type T.',
          },
        },
        {
          id: 'cpp-w1-d4-t8',
          topicNumber: 8,
          title: 'Day 4 Capstone: Manual Dynamic IntVector Buffer',
          explanation: [
            'Synthesizing Day 4 concepts by constructing a bare-metal dynamic integer array with resizing capabilities.',
            'Demonstrates `new[]`, copying elements, `delete[]` of old buffers, capacity doubling, and pointer updating.',
            'This forms the foundational mechanics behind `std::vector`.'
          ],
          keyRules: [
            'Always allocate new capacity first before freeing old buffer.',
            'Delete the old buffer with delete[] to prevent memory leaks during resize.'
          ],
          codeSnippet: {
            id: 'cpp-snip-4-8',
            title: 'Dynamic Array Resizing Engine',
            description: 'Manual heap reallocation and buffer copy',
            language: 'cpp',
            code: `#include <iostream>

class DynamicIntArray {
private:
    int* m_data{nullptr};
    size_t m_size{0};
    size_t m_capacity{0};

    void grow() {
        size_t newCap = (m_capacity == 0) ? 2 : m_capacity * 2;
        int* newBuf = new int[newCap];

        for (size_t i = 0; i < m_size; ++i) {
            newBuf[i] = m_data[i];
        }

        delete[] m_data; // Free old buffer
        m_data = newBuf;
        m_capacity = newCap;
    }

public:
    DynamicIntArray() = default;
    ~DynamicIntArray() { delete[] m_data; }

    void push_back(int val) {
        if (m_size == m_capacity) grow();
        m_data[m_size++] = val;
    }

    size_t size() const { return m_size; }
    int operator[](size_t idx) const { return m_data[idx]; }
};

int main() {
    DynamicIntArray arr;
    arr.push_back(10);
    arr.push_back(20);
    arr.push_back(30);

    for (size_t i = 0; i < arr.size(); ++i) {
        std::cout << arr[i] << " ";
    }
    std::cout << "\\n";
    return 0;
}`,
          },
          pitfall: 'Forgetting to free the old buffer with `delete[] m_data` when growing the array leaks the old buffer forever.',
          quickCheck: {
            question: 'When resizing a dynamic array, why must the new buffer be allocated before deleting the old buffer?',
            options: [
              'So that existing data can be copied from the old buffer into the new buffer',
              'Because the operating system requires it',
              'To avoid compiler warnings',
              'Because delete[] only works on empty buffers'
            ],
            correctIndex: 0,
            explanation: 'You must copy existing elements into the newly allocated buffer before releasing the old memory.',
          },
        },
      ],
      practiceChallenge: {
        title: 'Day 4 Capstone: Dynamic String Buffer with Zero Leaks',
        instructions: [
          'Create a class `HeapBuffer` that dynamically allocates a `char*` array on the heap in its constructor.',
          'Provide methods to write and read characters.',
          'Ensure the destructor frees the buffer with `delete[]` and sets the pointer to nullptr.',
        ],
        starterCode: `#include <iostream>

class HeapBuffer {
    // Implement heap-allocated char buffer
};

int main() {
    HeapBuffer buf(64);
    return 0;
}`,
        solutionCode: `#include <iostream>
#include <cstring>

class HeapBuffer {
private:
    char* m_buffer{nullptr};
    size_t m_capacity{0};

public:
    explicit HeapBuffer(size_t capacity) : m_capacity(capacity) {
        m_buffer = new char[m_capacity];
        std::memset(m_buffer, 0, m_capacity);
    }

    ~HeapBuffer() {
        delete[] m_buffer;
        m_buffer = nullptr;
    }

    void write(const char* text) {
        if (!m_buffer || !text) return;
        std::strncpy(m_buffer, text, m_capacity - 1);
    }

    const char* read() const { return m_buffer ? m_buffer : ""; }
};

int main() {
    HeapBuffer buf(32);
    buf.write("C++ Systems Architecture");
    std::cout << "Stored text: " << buf.read() << "\\n";
    return 0;
}`,
        hints: [
          'Allocate with `m_buffer = new char[m_capacity];`.',
          'Free in destructor with `delete[] m_buffer;`.',
        ],
      },
      keyTakeaways: [
        'The stack is managed automatically by the CPU; the heap is managed manually via `new`/`delete`.',
        'Always pair `new` with `delete`, and `new[]` with `delete[]`.',
        'AddressSanitizer (`-fsanitize=address`) is the industry standard for discovering leaks at runtime.',
        'Always set deleted pointers to `nullptr` to prevent dangerous Use-After-Free vulnerabilities.',
      ],
    },

    // Day 5: Arrays, C-Strings, std::string_view & Safe Buffer Operations
    {
      id: 'cpp-w1-d5',
      dayNumber: 5,
      weekNumber: 1,
      title: 'Arrays, C-Strings & Modern `std::string_view`',
      subtitle: 'Buffer layouts, null-terminators, string_view zero-copy slicing & bounds safety',
      durationMinutes: 60,
      overview:
        'Master low-level strings and contiguous memory. Compare legacy null-terminated C-strings (`char*`), `std::string`, and C++17 `std::string_view` for zero-allocation substring and string parameter performance.',
      topics: [
        {
          id: 'cpp-w1-d5-t1',
          topicNumber: 1,
          title: 'Null-Terminated C-Strings (`char*` & `\\0`)',
          explanation: [
            'In C and low-level C++, a string is an array of characters terminated by a null byte (`\'\\0\'`, ASCII value 0).',
            'String literals like `"Hello"` have type `const char[6]` (5 characters plus the implicit trailing `\'\\0\'`).',
            'Functions in `<cstring>` (`strlen`, `strcpy`, `strcmp`) walk the buffer until they encounter the null byte.'
          ],
          keyRules: [
            'A char buffer holding N characters requires an array size of at least N + 1 bytes.',
            'strlen() counts characters up to (but not including) the null terminator; complexity is O(N).'
          ],
          codeSnippet: {
            id: 'cpp-snip-5-1',
            title: 'Null Terminator Verification',
            description: 'Inspecting string literal null bytes and lengths',
            language: 'cpp',
            code: `#include <iostream>
#include <cstring>

int main() {
    const char cstr[] = "Systems";
    std::cout << "strlen: " << std::strlen(cstr) << " chars\\n";
    std::cout << "sizeof: " << sizeof(cstr) << " bytes (includes '\\\\0')\\n";
    std::cout << "Last byte numeric value: " << static_cast<int>(cstr[7]) << "\\n";
    return 0;
}`,
          },
          pitfall: 'Omitting the null terminator when building manual char arrays causes `strlen` and `printf` to keep reading past the buffer into neighboring memory until hitting random zero bytes.',
          quickCheck: {
            question: 'What is the sizeof the string literal `"Data"` in C++?',
            options: ['5 bytes', '4 bytes', '8 bytes', '1 byte'],
            correctIndex: 0,
            explanation: '"Data" contains 4 characters plus the implicit null terminator `\\0`, totaling 5 bytes.',
          },
        },
        {
          id: 'cpp-w1-d5-t2',
          topicNumber: 2,
          title: 'Buffer Overflows & Safe String Manipulation',
          explanation: [
            'Legacy C functions (`strcpy`, `strcat`, `sprintf`, `gets`) do not perform bounds checking and write past the end of allocated buffers.',
            'Buffer overflows can overwrite stack return addresses, allowing attackers to hijack execution flow (arbitrary code execution).',
            'Modern C++ replaces these functions with `std::string`, `std::string_view`, and bounded functions like `strncpy` or `snprintf`.'
          ],
          keyRules: [
            'Never use gets() or unbounded strcpy().',
            'Prefer std::string for owning strings and std::string_view for non-owning views.'
          ],
          codeSnippet: {
            id: 'cpp-snip-5-2',
            title: 'Bounded Safe String Operations',
            description: 'Using snprintf for size-guaranteed string formatting',
            language: 'cpp',
            code: `#include <iostream>
#include <cstdio>

int main() {
    char dest[16];
    // snprintf guarantees null-termination and prevents buffer overflow
    std::snprintf(dest, sizeof(dest), "Port: %d", 8080);
    std::cout << "Formatted: " << dest << "\\n";
    return 0;
}`,
          },
          pitfall: 'Using `strncpy` does not guarantee null-termination if the source string exceeds the destination buffer length.',
          quickCheck: {
            question: 'Why are functions like `strcpy` considered dangerous in security audits?',
            options: [
              'They do not verify destination buffer capacity, causing buffer overflows',
              'They allocate heap memory without freeing it',
              'They are incompatible with 64-bit systems',
              'They cannot handle ASCII characters'
            ],
            correctIndex: 0,
            explanation: 'strcpy writes until finding a null terminator in the source, overflowing destination buffers if the source is too large.',
          },
        },
        {
          id: 'cpp-w1-d5-t3',
          topicNumber: 3,
          title: '`std::string` Architecture & Small String Optimization (SSO)',
          explanation: [
            '`std::string` manages dynamic heap allocation, reallocations, and null-termination automatically.',
            'Small String Optimization (SSO): Most standard library implementations include an internal inline stack buffer (typically 15 to 22 bytes) inside the `std::string` struct itself.',
            'If the string length is within this threshold, NO heap allocation occurs. Only long strings trigger dynamic heap memory allocation.'
          ],
          keyRules: [
            'Strings shorter than ~15-22 characters enjoy zero heap allocation overhead due to SSO.',
            'std::string is an RAII object that cleans up its own memory automatically when it goes out of scope.'
          ],
          codeSnippet: {
            id: 'cpp-snip-5-3',
            title: 'Inspecting std::string Footprint and SSO',
            description: 'Examining sizeof(std::string) and heap bypass',
            language: 'cpp',
            code: `#include <iostream>
#include <string>

int main() {
    std::string shortStr = "Small SSO"; // Fits inside string struct, 0 heap allocations
    std::string longStr = "This is a significantly longer string that exceeds typical SSO capacity";

    std::cout << "sizeof(std::string): " << sizeof(shortStr) << " bytes\\n";
    std::cout << "shortStr length:     " << shortStr.length() << "\\n";
    std::cout << "longStr length:      " << longStr.length() << "\\n";
    return 0;
}`,
          },
          pitfall: 'Assuming `std::string` is always heap-allocated; for small tokens and IDs, SSO makes it as fast as a stack char array.',
          quickCheck: {
            question: 'What is Small String Optimization (SSO) in C++ standard libraries?',
            options: [
              'Storing short strings inside an internal inline buffer to avoid heap allocations',
              'Compressing strings using Huffman coding',
              'Deleting unused strings automatically',
              'Restricting string length to 256 bytes'
            ],
            correctIndex: 0,
            explanation: 'SSO stores strings smaller than ~15-22 bytes directly inside the string object on the stack.',
          },
        },
        {
          id: 'cpp-w1-d5-t4',
          topicNumber: 4,
          title: 'Modern `std::string_view` (C++17 Zero-Copy Views)',
          explanation: [
            'C++17 introduced `std::string_view`, a lightweight non-owning view of a sequence of characters.',
            'Internally, it consists of only two fields: a `const char* pointer` and a `size_t length` (total 16 bytes on 64-bit systems).',
            'Passing `std::string_view` accepts string literals, `const char*`, and `std::string` with zero memory allocation and zero buffer copying.'
          ],
          keyRules: [
            'Pass std::string_view by value (it is only 16 bytes).',
            'std::string_view does NOT own the memory; the underlying string must outlive the view.',
            'string_view is NOT guaranteed to be null-terminated; do not pass view.data() to functions expecting a null-terminated C-string.'
          ],
          codeSnippet: {
            id: 'cpp-snip-5-4',
            title: 'std::string_view Parameter and Substring Slicing',
            description: 'Zero-allocation slicing and universal string handling',
            language: 'cpp',
            code: `#include <iostream>
#include <string_view>

void printHeader(std::string_view sv) {
    // Zero allocations for literals, char arrays, or std::string!
    std::cout << "View: " << sv << " [Length: " << sv.length() << "]\\n";
}

int main() {
    printHeader("Literal string"); // 0 allocations
    std::string_view prefix = "HTTP/1.1 200 OK";
    std::string_view status = prefix.substr(9, 3); // O(1) slice! 0 allocations!
    std::cout << "Parsed status code: " << status << "\\n";
    return 0;
}`,
          },
          pitfall: 'Creating a `std::string_view` from a temporary `std::string`: `std::string_view sv = std::string("temp");` leaves `sv` dangling immediately after the line ends.',
          quickCheck: {
            question: 'What are the internal members of a `std::string_view`?',
            options: [
              'A pointer to character data and a size length',
              'A vector of chars and a capacity',
              'A null-terminated heap buffer',
              'A reference counter and an address'
            ],
            correctIndex: 0,
            explanation: 'std::string_view is simply a pointer (`const char*`) and a size (`size_t`), making it 16 bytes on 64-bit.',
          },
        },
        {
          id: 'cpp-w1-d5-t5',
          topicNumber: 5,
          title: '`std::array<T, N>`: Zero-Overhead Fixed-Size Arrays',
          explanation: [
            'C-style raw arrays decay to pointers and lack standard container interfaces.',
            '`std::array<T, N>` is a thin wrapper over a C-style stack array with zero overhead in memory or execution time.',
            'It provides `.size()`, bounds-checked `.at(i)`, iterators (`begin()`/`end()`), and does not implicitly decay to a raw pointer.'
          ],
          keyRules: [
            'Prefer std::array<T, N> over raw C arrays for fixed-size buffers.',
            'arr.at(i) throws std::out_of_range if index is out of bounds; arr[i] is unchecked for maximum speed.'
          ],
          codeSnippet: {
            id: 'cpp-snip-5-5',
            title: 'std::array Usage & Bounds Checking',
            description: 'Typesafe fixed-size arrays with standard iterator support',
            language: 'cpp',
            code: `#include <iostream>
#include <array>

int main() {
    std::array<int, 4> fixedScores{88, 92, 95, 100};

    std::cout << "Array size: " << fixedScores.size() << "\\n";
    for (const auto& score : fixedScores) {
        std::cout << score << " ";
    }
    std::cout << "\\n";
    return 0;
}`,
          },
          pitfall: 'Using `std::array` for massive collections (like 1,000,000 elements) allocates on the stack, causing stack overflow; use `std::vector` for large collections.',
          quickCheck: {
            question: 'Does `std::array<int, 10>` allocate memory on the heap?',
            options: [
              'No, it allocates entirely on the stack with zero heap overhead',
              'Yes, it calls new int[10]',
              'Only when passed to functions',
              'Yes, via malloc'
            ],
            correctIndex: 0,
            explanation: 'std::array is an aggregate stack structure with zero heap overhead.',
          },
        },
        {
          id: 'cpp-w1-d5-t6',
          topicNumber: 6,
          title: 'Modern `std::span<T>` (C++20 Contiguous Views)',
          explanation: [
            'C++20 introduced `std::span<T>`, generalizing `std::string_view` to ANY contiguous sequence of elements (raw array, `std::array`, or `std::vector`).',
            '`std::span<T>` provides a non-owning view of contiguous memory. It replaces legacy function signatures like `void process(int* arr, size_t size)` with `void process(std::span<int> data)`.',
            'It can be read-only (`std::span<const T>`) or read-write (`std::span<T>`).'
          ],
          keyRules: [
            'Pass std::span by value.',
            'Accepts C arrays, std::array, and std::vector seamlessly without template bloat.'
          ],
          codeSnippet: {
            id: 'cpp-snip-5-6',
            title: 'C++20 std::span Universal Array Views',
            description: 'Accepting vectors, arrays, and buffers with one unified signature',
            language: 'cpp',
            code: `#include <iostream>
#include <vector>
#include <array>

// In C++20: #include <span>
// Simulating span mechanics
template <typename T>
void inspectContiguousBuffer(const T* ptr, size_t len) {
    std::cout << "Buffer length: " << len << " | First item: " << ptr[0] << "\\n";
}

int main() {
    int rawArray[] = {1, 2, 3};
    std::vector<int> vec = {10, 20, 30, 40};
    inspectContiguousBuffer(rawArray, 3);
    inspectContiguousBuffer(vec.data(), vec.size());
    return 0;
}`,
          },
          pitfall: 'Like `std::string_view`, `std::span` does not own the memory; modifying the size of a referenced `std::vector` (causing reallocation) invalidates the span.',
          quickCheck: {
            question: 'What is the primary role of `std::span<T>` in modern C++20?',
            options: [
              'To provide a lightweight, non-owning view over any contiguous sequence of elements',
              'To allocate dynamic memory automatically',
              'To synchronize multi-threaded vectors',
              'To sort arrays in parallel'
            ],
            correctIndex: 0,
            explanation: 'std::span provides a standardized non-owning view over arrays, vectors, and memory buffers.',
          },
        },
        {
          id: 'cpp-w1-d5-t7',
          topicNumber: 7,
          title: 'Memory Operations: `std::memcpy`, `std::memmove` & `std::memset`',
          explanation: [
            'In low-level systems programming, `<cstring>` memory routines provide hardware-accelerated byte-level manipulation.',
            '`std::memset(dest, val, count)` fills a block of memory with a specific byte pattern (e.g. zeroing a buffer).',
            '`std::memcpy(dest, src, count)` performs ultra-fast byte copying using SIMD registers, but requires that `dest` and `src` memory regions DO NOT OVERLAP.',
            '`std::memmove(dest, src, count)` safely handles overlapping memory buffers by utilizing an intermediate buffer if needed.'
          ],
          keyRules: [
            'Use std::memcpy only when buffers are guaranteed not to overlap.',
            'Use std::memmove if buffers might overlap (e.g. shifting elements within the same array).',
            'Only use memcpy/memmove on Trivially Copyable types; never use on types with non-trivial constructors/destructors.'
          ],
          codeSnippet: {
            id: 'cpp-snip-5-7',
            title: 'High-Speed Byte Copying & Zeroing',
            description: 'Direct byte memory manipulation with memset and memcpy',
            language: 'cpp',
            code: `#include <iostream>
#include <cstring>

struct PacketHeader {
    int id;
    int flags;
};

int main() {
    PacketHeader src{101, 0x0F};
    PacketHeader dest;

    // Fast bitwise byte copy
    std::memcpy(&dest, &src, sizeof(PacketHeader));
    std::cout << "Copied packet ID: " << dest.id << "\\n";

    // Fast zeroing
    std::memset(&dest, 0, sizeof(PacketHeader));
    std::cout << "Zeroed packet ID: " << dest.id << "\\n";
    return 0;
}`,
          },
          pitfall: 'Using `std::memcpy` on non-trivially copyable objects (like `std::string` or `std::vector`) corrupts their internal pointers and triggers double-free crashes.',
          quickCheck: {
            question: 'When must `std::memmove` be used instead of `std::memcpy`?',
            options: [
              'When the source and destination memory regions may overlap',
              'When copying more than 1024 bytes',
              'When copying floating-point numbers',
              'When allocating heap memory'
            ],
            correctIndex: 0,
            explanation: 'std::memmove is required when source and destination buffers overlap to prevent data corruption.',
          },
        },
        {
          id: 'cpp-w1-d5-t8',
          topicNumber: 8,
          title: 'Day 5 Capstone: Zero-Copy HTTP Request Header Parser',
          explanation: [
            'Synthesizing Day 5 concepts by building a zero-copy HTTP header line parser using `std::string_view`.',
            'Demonstrates finding delimiters (`: `), slicing into key and value string views without allocating a single byte on the heap.',
            'Highlights the microsecond throughput advantages of C++ systems programming.'
          ],
          keyRules: [
            'Parse and slice strings using string_view::substr and string_view::find.',
            'Zero heap allocations during line tokenization.'
          ],
          codeSnippet: {
            id: 'cpp-snip-5-8',
            title: 'Zero-Allocation HTTP Header Parser',
            description: 'Slicing HTTP request lines with std::string_view',
            language: 'cpp',
            code: `#include <iostream>
#include <string_view>

struct HeaderView {
    std::string_view name;
    std::string_view value;
};

HeaderView parseHeader(std::string_view line) {
    size_t colonPos = line.find(':');
    if (colonPos == std::string_view::npos) {
        return {line, ""};
    }
    std::string_view name = line.substr(0, colonPos);
    std::string_view value = line.substr(colonPos + 2); // Skip ": "
    return {name, value};
}

int main() {
    std::string_view rawHeader = "Content-Type: application/json";
    HeaderView parsed = parseHeader(rawHeader);

    std::cout << "Header Name:  [" << parsed.name << "]\\n";
    std::cout << "Header Value: [" << parsed.value << "]\\n";
    return 0;
}`,
          },
          pitfall: 'Storing `std::string_view` in an object that outlives the raw network buffer from which it was sliced causes dangling pointer reads.',
          quickCheck: {
            question: 'How many dynamic heap allocations occur when `std::string_view::substr()` is called?',
            options: ['0', '1', '2', 'Proportional to string length'],
            correctIndex: 0,
            explanation: 'substr on a string_view merely adjusts a pointer and size, performing zero dynamic heap allocations.',
          },
        },
      ],
      practiceChallenge: {
        title: 'Day 5 Capstone: Safe String Truncator & Sanitizer',
        instructions: [
          'Write a function `std::string_view trimPrefix(std::string_view input, std::string_view prefix)` that checks if `input` starts with `prefix`.',
          'If it does, return the sliced view without the prefix; otherwise return the original view.',
          'Verify that zero allocations occur during this operation.',
        ],
        starterCode: `#include <iostream>
#include <string_view>

std::string_view trimPrefix(std::string_view input, std::string_view prefix) {
    // Implement zero-copy prefix trimming
    return input;
}

int main() {
    std::string_view url = "https://example.com/api";
    return 0;
}`,
        solutionCode: `#include <iostream>
#include <string_view>

std::string_view trimPrefix(std::string_view input, std::string_view prefix) {
    if (input.substr(0, prefix.length()) == prefix) {
        return input.substr(prefix.length());
    }
    return input;
}

int main() {
    std::string_view url = "https://example.com/api";
    std::string_view trimmed = trimPrefix(url, "https://");
    std::cout << "Trimmed URL: " << trimmed << "\\n";
    return 0;
}`,
        hints: [
          'Use input.substr(0, prefix.length()) to compare the starting characters.',
          'Return input.substr(prefix.length()) to remove the prefix.',
        ],
      },
      keyTakeaways: [
        'C-strings require a null terminator (`\\0`); forgetting it causes buffer overruns.',
        'Small String Optimization (SSO) makes short `std::string` instances stack-allocated.',
        '`std::string_view` (16 bytes) provides zero-copy slicing for read-only string parameters.',
        'Use `std::array` instead of C raw arrays for fixed-size stack buffers.',
      ],
    },

    // Day 6: Functions in C++: Pass-by-Value, Pass-by-Ref, Inline & Overloading
    {
      id: 'cpp-w1-d6',
      dayNumber: 6,
      weekNumber: 1,
      title: 'Functions: Value vs Ref, Overloading & Inlining',
      subtitle: 'Pass semantics, return-value optimization (RVO), inline functions & function pointers',
      durationMinutes: 65,
      overview:
        'Master the full depth of C++ functions: parameter pass mechanisms, function overloading, default arguments, inline expansion, name mangling, Return Value Optimization (RVO/NRVO), and raw function pointers.',
      topics: [
        {
          id: 'cpp-w1-d6-t1',
          topicNumber: 1,
          title: 'Parameter Passing Matrix: Value vs Pointer vs Reference',
          explanation: [
            'Pass-by-value (`void f(int x)`): Creates an independent copy. Changes inside the function do NOT affect the caller.',
            'Pass-by-reference (`void f(int& x)`): Passes an alias. The function can mutate the caller variable directly.',
            'Pass-by-const-reference (`void f(const BigData& x)`): Passes an address without copying, but forbids mutation.',
            'Pass-by-pointer (`void f(int* x)`): Explicit address passing with optional nullability.'
          ],
          keyRules: [
            'Primitives (<= 16 bytes): Pass by value.',
            'Objects (> 16 bytes, e.g. structs, strings): Pass by const reference.',
            'Output parameters (mutation needed): Pass by non-const reference or return a struct.'
          ],
          codeSnippet: {
            id: 'cpp-snip-6-1',
            title: 'Function Parameter Passing Variations',
            description: 'Demonstrating value, reference, and const reference mechanics',
            language: 'cpp',
            code: `#include <iostream>

void incrementByVal(int x) { x++; }
void incrementByRef(int& x) { x++; }

int main() {
    int val = 10;
    incrementByVal(val);
    std::cout << "After by-value: " << val << "\\n"; // 10
    incrementByRef(val);
    std::cout << "After by-ref:   " << val << "\\n"; // 11
    return 0;
}`,
          },
          pitfall: 'Passing large collections like `std::vector<int>` by value in recursion triggers exponential cloning and exhausts CPU memory.',
          quickCheck: {
            question: 'When should a parameter be passed by `const T&`?',
            options: [
              'When the object is non-trivial/large and the function only needs to read it',
              'When the function needs to modify the original object',
              'When the argument is an integer',
              'Only in constructor definitions'
            ],
            correctIndex: 0,
            explanation: 'const T& avoids copy overhead while guaranteeing that the function will not modify the caller object.',
          },
        },
        {
          id: 'cpp-w1-d6-t2',
          topicNumber: 2,
          title: 'Return Value Optimization (RVO) & Copy Elision',
          explanation: [
            'Historically, returning a large object by value required copying it from the function stack frame to the caller stack frame.',
            'Modern C++ compilers perform Return Value Optimization (RVO) and Named RVO (NRVO): the compiler constructs the object directly in the memory location allocated for the caller variable.',
            'Since C++17, RVO is MANDATORY by the language standard, guaranteeing zero-copy return by value.'
          ],
          keyRules: [
            'Feel free to return large objects (vectors, strings) by value; RVO guarantees zero copy overhead.',
            'Do not wrap return statements in std::move(x) when returning local variables; it prevents RVO.'
          ],
          codeSnippet: {
            id: 'cpp-snip-6-2',
            title: 'Guaranteed Copy Elision (C++17)',
            description: 'Returning objects by value with zero copies via RVO',
            language: 'cpp',
            code: `#include <iostream>
#include <vector>

std::vector<int> generateSeries(size_t n) {
    std::vector<int> result;
    result.reserve(n);
    for (size_t i = 0; i < n; i++) result.push_back(i * 10);
    return result; // Compiler constructs directly in caller; ZERO copies!
}

int main() {
    std::vector<int> data = generateSeries(5);
    for (int x : data) std::cout << x << " ";
    std::cout << "\\n";
    return 0;
}`,
          },
          pitfall: 'Writing `return std::move(localObj);` disables NRVO and degrades performance.',
          quickCheck: {
            question: 'What is guaranteed by C++17 regarding Return Value Optimization (RVO)?',
            options: [
              'Copy elision is mandatory when returning an unnamed prvalue temporary',
              'Functions cannot return objects larger than 64 bytes',
              'RVO is only enabled with -O3 optimization',
              'Return values must be pointers'
            ],
            correctIndex: 0,
            explanation: 'C++17 formalized copy elision as a core language rule, completely eliminating copy/move operations for prvalue returns.',
          },
        },
        {
          id: 'cpp-w1-d6-t3',
          topicNumber: 3,
          title: 'Function Overloading & Name Mangling',
          explanation: [
            'C++ allows multiple functions to share the exact same name as long as their parameter signatures (number or types of arguments) differ.',
            'To allow the linker to distinguish between overloaded functions with identical names, C++ compilers perform "Name Mangling" (encoding parameter types into the binary symbol name, e.g. `_Z3addii` for `add(int, int)`).',
            'To interface with C libraries or disable name mangling, wrap function declarations in `extern "C" { ... }`.'
          ],
          keyRules: [
            'Functions CANNOT be overloaded based on return type alone.',
            'extern "C" disables name mangling so C code and dynamic linkers can locate the symbol.'
          ],
          codeSnippet: {
            id: 'cpp-snip-6-3',
            title: 'Function Overloading & extern "C"',
            description: 'Overloaded signatures and C ABI linkage compatibility',
            language: 'cpp',
            code: `#include <iostream>

// Overload 1: Two integers
int multiply(int a, int b) { return a * b; }

// Overload 2: Two doubles
double multiply(double a, double b) { return a * b; }

extern "C" void c_compatible_api() {
    // Unmangled symbol name in binary: "c_compatible_api"
}

int main() {
    std::cout << "int:    " << multiply(4, 5) << "\\n";
    std::cout << "double: " << multiply(2.5, 4.0) << "\\n";
    return 0;
}`,
          },
          pitfall: 'Attempting to overload two functions where the only difference is the return type: `int f();` and `double f();` is a compilation error.',
          quickCheck: {
            question: 'Why is `extern "C"` used when exporting C++ functions for use in C or shared libraries?',
            options: [
              'It disables C++ name mangling, preserving the exact function symbol name',
              'It converts C++ code to C source code',
              'It makes the function run in kernel mode',
              'It enables garbage collection'
            ],
            correctIndex: 0,
            explanation: 'extern "C" instructs the compiler to emit C linkage without name mangling.',
          },
        },
        {
          id: 'cpp-w1-d6-t4',
          topicNumber: 4,
          title: '`inline` Functions & Linker Rules',
          explanation: [
            'The `inline` keyword originally suggested that the compiler replace function calls with the function body itself to eliminate call overhead.',
            'In modern C++, compilers inline functions automatically based on cost models regardless of the keyword.',
            'The true modern meaning of `inline` is an ODR (One Definition Rule) directive: it permits a function or variable to be defined in a header file included by multiple translation units without linker "multiple definition" errors.'
          ],
          keyRules: [
            'Functions defined entirely inside class definitions are implicitly inline.',
            'Free functions defined in headers must be marked inline to avoid linker collisions.'
          ],
          codeSnippet: {
            id: 'cpp-snip-6-4',
            title: 'Header-Safe inline Function Definition',
            description: 'Preventing LNK2005 multiple definition errors across translation units',
            language: 'cpp',
            code: `#include <iostream>

// Safe to place in a header file included across 100 cpp files
inline int computeSquare(int x) {
    return x * x;
}

int main() {
    std::cout << "Square of 7: " << computeSquare(7) << "\\n";
    return 0;
}`,
          },
          pitfall: 'Placing a non-inline function body in a header file included in more than one `.cpp` file causes duplicate symbol linker errors.',
          quickCheck: {
            question: 'What is the primary modern purpose of the `inline` keyword on free functions in headers?',
            options: [
              'To allow the function definition to appear in multiple translation units without ODR violations',
              'To force the CPU to execute the function in parallel',
              'To make the function private',
              'To allocate the function on the stack'
            ],
            correctIndex: 0,
            explanation: 'inline tells the linker that multiple identical definitions across translation units should be merged into a single implementation.',
          },
        },
        {
          id: 'cpp-w1-d6-t5',
          topicNumber: 5,
          title: 'Function Pointers & Callback Architecture',
          explanation: [
            'Functions reside in the executable code segment (text) and have memory addresses.',
            'A function pointer stores the address of a function, allowing functions to be passed as arguments, stored in arrays, and invoked dynamically at runtime.',
            'Syntax: `ReturnType (*ptrName)(ParamTypes) = &functionName;`.'
          ],
          keyRules: [
            'int (*op)(int, int) declares op as a function pointer accepting two ints and returning int.',
            'Invoking: (*op)(2, 3) or simply op(2, 3).'
          ],
          codeSnippet: {
            id: 'cpp-snip-6-5',
            title: 'Function Pointers as Algorithm Callbacks',
            description: 'Customizing transformation logic via raw function pointers',
            language: 'cpp',
            code: `#include <iostream>

int add(int a, int b) { return a + b; }
int multiply(int a, int b) { return a * b; }

// Accepts a function pointer callback
void executeMath(int x, int y, int (*operation)(int, int)) {
    std::cout << "Result: " << operation(x, y) << "\\n";
}

int main() {
    executeMath(10, 5, add);      // 15
    executeMath(10, 5, multiply); // 50
    return 0;
}`,
          },
          pitfall: 'Forgetting parentheses in function pointer declarations: `int* func(int)` declares a function returning `int*`, whereas `int (*func)(int)` declares a pointer to a function.',
          quickCheck: {
            question: 'What does `void (*callback)(int);` declare?',
            options: [
              'A pointer to a function that accepts an int and returns void',
              'A function that returns a void pointer',
              'An array of void functions',
              'A syntax error'
            ],
            correctIndex: 0,
            explanation: 'The parentheses around `(*callback)` bind the asterisk to the identifier, declaring a function pointer.',
          },
        },
        {
          id: 'cpp-w1-d6-t6',
          topicNumber: 6,
          title: 'Default Arguments & Evaluation Constraints',
          explanation: [
            'C++ functions can provide default parameter values: `void log(std::string msg, int level = 1);`.',
            'Default arguments MUST be specified on trailing parameters only (all parameters following a defaulted parameter must also have defaults).',
            'Default arguments are evaluated at the call site at compile time. In multi-file projects, specify default arguments in the header declaration, NEVER in the `.cpp` definition.'
          ],
          keyRules: [
            'Default arguments must appear on the rightmost parameters.',
            'Declare defaults in header files only; redefining defaults in the implementation causes a redefinition error.'
          ],
          codeSnippet: {
            id: 'cpp-snip-6-6',
            title: 'Trailing Default Arguments Pattern',
            description: 'Declaring fallback values for flexible function invocation',
            language: 'cpp',
            code: `#include <iostream>

void configureSocket(int port, int timeoutMs = 5000, bool enableKeepAlive = true) {
    std::cout << "Socket Port: " << port << ", Timeout: " << timeoutMs 
              << "ms, KeepAlive: " << (enableKeepAlive ? "ON" : "OFF") << "\\n";
}

int main() {
    configureSocket(8080);               // Uses defaults: 5000ms, true
    configureSocket(9000, 1000);         // Overrides timeout, uses default keepAlive
    configureSocket(443, 2000, false);   // Overrides all
    return 0;
}`,
          },
          pitfall: 'Placing default arguments in both the header declaration and the `.cpp` function definition causes a compiler error for redefinition of default parameter.',
          quickCheck: {
            question: 'Where should default argument values be specified in a multi-file C++ project?',
            options: [
              'In the header file declaration (.h / .hpp)',
              'In the implementation file definition (.cpp)',
              'In both the header and implementation files',
              'In the main.cpp file only'
            ],
            correctIndex: 0,
            explanation: 'Callers must see default arguments at compile time from the included header file.',
          },
        },
        {
          id: 'cpp-w1-d6-t7',
          topicNumber: 7,
          title: 'Lambdas (`[](){}`): Anonymous Inline Functions',
          explanation: [
            'C++11 introduced lambda expressions, allowing ad-hoc anonymous functions to be defined directly at the call site.',
            'Syntax: `[capture-clause](parameters) -> return-type { body }`.',
            'The capture clause controls access to outer variables: `[]` (no capture), `[&]` (capture all by reference), `[=]` (capture all by value/copy), or explicit `[x, &y]`.'
          ],
          keyRules: [
            'Lambdas without captures decay implicitly to raw function pointers.',
            'Use [&] with caution; capturing a local variable by reference in a lambda that outlives the scope causes a dangling reference.'
          ],
          codeSnippet: {
            id: 'cpp-snip-6-7',
            title: 'Modern C++ Lambdas and Captures',
            description: 'Defining inline anonymous callable objects',
            language: 'cpp',
            code: `#include <iostream>

int main() {
    int factor = 3;

    // Capture factor by value [factor]
    auto multiplier = [factor](int x) {
        return x * factor;
    };

    std::cout << "10 * 3 = " << multiplier(10) << "\\n";
    return 0;
}`,
          },
          pitfall: 'Capturing references `[&]` into a lambda stored asynchronously or in a callback leads to accessing destroyed stack variables when invoked later.',
          quickCheck: {
            question: 'What does the capture clause `[=]` do in a C++ lambda?',
            options: [
              'Captures all enclosing local variables by value (copy)',
              'Captures all variables by reference',
              'Captures nothing',
              'Assigns default values'
            ],
            correctIndex: 0,
            explanation: '[=] creates copies of any enclosing variables referenced inside the lambda.',
          },
        },
        {
          id: 'cpp-w1-d6-t8',
          topicNumber: 8,
          title: 'Day 6 Capstone: Pluggable Event Dispatcher System',
          explanation: [
            'Synthesizing Day 6 function paradigms into a pluggable event dispatch mechanism.',
            'Demonstrating function pointers, lambdas, pass-by-const-reference, and cleanly structured callback architectures.',
            'Forms the foundation of game event loops, UI event handlers, and network packet dispatchers.'
          ],
          keyRules: [
            'Store callable listeners cleanly.',
            'Pass event payload by const reference to avoid copying.'
          ],
          codeSnippet: {
            id: 'cpp-snip-6-8',
            title: 'Pluggable Event Dispatch Engine',
            description: 'Event listener pattern using function pointers',
            language: 'cpp',
            code: `#include <iostream>

struct Event {
    int eventId;
    const char* message;
};

using EventHandler = void (*)(const Event&);

void onNetworkLog(const Event& e) {
    std::cout << "[Network Log] ID: " << e.eventId << " - " << e.message << "\\n";
}

void onSecurityAudit(const Event& e) {
    std::cout << "[Security Alert] Packet: " << e.eventId << "\\n";
}

int main() {
    EventHandler handlers[] = { onNetworkLog, onSecurityAudit };

    Event packetArrived{101, "TCP Connection Established on port 443"};

    for (auto handler : handlers) {
        handler(packetArrived);
    }
    return 0;
}`,
          },
          pitfall: 'Attempting to assign a stateful lambda (with captures) to a raw function pointer `void (*)(const Event&)` fails compilation because stateful lambdas are structs with fields, not bare function pointers.',
          quickCheck: {
            question: 'Can a lambda with captures (e.g. `[x](int a){...}`) be converted to a raw function pointer (`int(*)(int)`)?',
            options: [
              'No, only capture-less lambdas `[]` can decay to raw function pointers',
              'Yes, always',
              'Only if x is an integer',
              'Only in C++20'
            ],
            correctIndex: 0,
            explanation: 'Lambdas with captures have internal state and cannot be represented by a simple raw function pointer address.',
          },
        },
      ],
      practiceChallenge: {
        title: 'Day 6 Capstone: Generic Math Pipeline with Function Pointers',
        instructions: [
          'Create a function `int transform(int value, int (*fn)(int))` that applies a transformation function to an integer.',
          'Define two transformation functions: `doubleVal(int x)` (returns x * 2) and `squareVal(int x)` (returns x * x).',
          'Test `transform` with both functions and output the results.',
        ],
        starterCode: `#include <iostream>

// Define transform and math helper functions

int main() {
    // Call transform with doubleVal and squareVal
    return 0;
}`,
        solutionCode: `#include <iostream>

int doubleVal(int x) { return x * 2; }
int squareVal(int x) { return x * x; }

int transform(int value, int (*fn)(int)) {
    return fn(value);
}

int main() {
    int input = 5;
    std::cout << "Original: " << input << "\\n";
    std::cout << "Doubled:  " << transform(input, doubleVal) << "\\n";
    std::cout << "Squared:  " << transform(input, squareVal) << "\\n";
    return 0;
}`,
        hints: [
          'The function pointer signature is `int (*fn)(int)`.',
          'Pass the function names `doubleVal` and `squareVal` as arguments.',
        ],
      },
      keyTakeaways: [
        'Pass cheap primitives by value; pass non-trivial objects by `const T&`.',
        'Modern C++17 guarantees Return Value Optimization (RVO) for zero-copy return-by-value.',
        'Name mangling encodes parameter types into symbol names; use `extern "C"` for C linkage.',
        'Lambdas without captures decay cleanly to raw function pointers.',
      ],
    },

    // Day 7: Week 1 Synthesis, Project: Memory Arena Allocator & Qualifying Quiz
    {
      id: 'cpp-w1-d7',
      dayNumber: 7,
      weekNumber: 1,
      title: 'Week 1 Synthesis: Custom Stack Memory Arena & Qualifying Exam',
      subtitle: 'Building a bare-metal linear bump allocator, memory alignment & Week 1 qualifying assessment',
      durationMinutes: 70,
      overview:
        'Synthesize all of Week 1 into a high-performance linear Memory Arena Allocator. Understand how game engines, embedded systems, and HFT systems achieve microsecond allocations by bypassing malloc/free with pre-allocated memory buffers.',
      topics: [
        {
          id: 'cpp-w1-d7-t1',
          topicNumber: 1,
          title: 'The Problem with General-Purpose `malloc` / `new`',
          explanation: [
            'General-purpose allocators (`malloc`/`new`) must handle arbitrary allocation sizes, concurrent threads, and unpredictable lifetimes.',
            'To do this, they maintain free-lists, perform locks, search for best-fit blocks, and incur OS system call overhead (`brk`/`mmap`).',
            'In game engines and high-frequency trading (HFT), calling `new` thousands of times per frame causes frame drops and heap fragmentation.'
          ],
          keyRules: [
            'malloc() has unpredictable execution latency and causes heap fragmentation.',
            'Custom allocators provide deterministic O(1) allocation times.'
          ],
          codeSnippet: {
            id: 'cpp-snip-7-1',
            title: 'Latency of Dynamic Heap Allocation',
            description: 'Why systems engineers replace new/delete in hot paths',
            language: 'cpp',
            code: `#include <iostream>

// Standard new: non-deterministic latency in tight loops
void heapThrashing() {
    for (int i = 0; i < 1000; i++) {
        int* p = new int(i);
        delete p;
    }
}

int main() {
    heapThrashing();
    std::cout << "Completed heap cycles\\n";
    return 0;
}`,
          },
          pitfall: 'Calling `new` inside high-frequency real-time audio threads or rendering loops causes audio glitches and frame rate stutter.',
          quickCheck: {
            question: 'Why do game engines and financial trading systems avoid frequent `new`/`delete` calls in hot loops?',
            options: [
              'General heap allocation has non-deterministic latency and causes memory fragmentation',
              'new is deprecated in C++20',
              'Heap memory is limited to 1MB',
              'delete cannot be called more than 100 times'
            ],
            correctIndex: 0,
            explanation: 'Dynamic heap allocation involves thread locks and free-list searches that introduce non-deterministic execution spikes.',
          },
        },
        {
          id: 'cpp-w1-d7-t2',
          topicNumber: 2,
          title: 'Linear Bump Allocator (Arena) Architecture',
          explanation: [
            'A Memory Arena pre-allocates a single large contiguous block of memory (e.g. 1MB or 64MB) upfront at application startup.',
            'To allocate `N` bytes, it simply increments an offset pointer (a "bump pointer") by `N` bytes. This is an $O(1)$ single-cycle pointer addition.',
            'Individual deallocations are no-ops. When a frame or request finishes, the entire arena is reset back to offset 0 in a single instruction.'
          ],
          keyRules: [
            'Allocation cost: O(1) pointer addition.',
            'Deallocation cost: O(1) setting offset = 0 for the entire batch.',
            'Eliminates fragmentation and guarantees 100% cache locality.'
          ],
          codeSnippet: {
            id: 'cpp-snip-7-2',
            title: 'Linear Arena Mechanics Blueprint',
            description: 'Concept diagram of memory arena bump pointer',
            language: 'cpp',
            code: `/*
  [==================== PRE-ALLOCATED ARENA BUFFER ====================]
  |  Alloc 1 (64B)  |  Alloc 2 (128B) |  Alloc 3 (32B)  |   Free Space... |
  ^                                                     ^
  Base Address                                      Offset (Bump Pointer)
  
  Resetting the entire arena: offset = 0; // Instant 0-cycle deallocation!
*/`,
          },
          pitfall: 'Freeing individual objects inside a linear arena is impossible; all objects in an arena share the same lifetime.',
          quickCheck: {
            question: 'What is the algorithmic time complexity of allocating memory in a linear bump allocator arena?',
            options: ['O(1)', 'O(N)', 'O(log N)', 'O(N^2)'],
            correctIndex: 0,
            explanation: 'A bump allocator simply adds the requested byte size to its current offset, which is an O(1) single-cycle operation.',
          },
        },
        {
          id: 'cpp-w1-d7-t3',
          topicNumber: 3,
          title: 'Memory Alignment Padding in Custom Allocators',
          explanation: [
            'If you bump the pointer by an arbitrary number of bytes (e.g. 3 bytes), the next allocation will land on an unaligned address, degrading CPU performance.',
            'Custom allocators round the current offset UP to the nearest multiple of the required alignment before advancing.',
            'The formula: `alignedOffset = (offset + (alignment - 1)) & ~(alignment - 1);`.'
          ],
          keyRules: [
            'Always align allocations to alignof(T) or max_align_t (typically 8 or 16 bytes).',
            'Bitwise rounding mask: (x + 7) & ~7 rounds up to the next 8-byte boundary.'
          ],
          codeSnippet: {
            id: 'cpp-snip-7-3',
            title: 'Bitwise Memory Alignment Formula',
            description: 'Aligning addresses to CPU word boundaries using bit manipulation',
            language: 'cpp',
            code: `#include <iostream>
#include <cstdint>

uintptr_t alignForward(uintptr_t ptr, size_t alignment) {
    uintptr_t p = ptr;
    uintptr_t a = static_cast<uintptr_t>(alignment);
    uintptr_t modulo = p & (a - 1);
    if (modulo != 0) {
        p += (a - modulo);
    }
    return p;
}

int main() {
    uintptr_t unalignedAddress = 1003;
    uintptr_t alignedAddress = alignForward(unalignedAddress, 8);
    std::cout << "Unaligned: " << unalignedAddress << "\\n";
    std::cout << "Aligned:   " << alignedAddress << " (Multiple of 8: " << (alignedAddress % 8 == 0 ? "YES" : "NO") << ")\\n";
    return 0;
}`,
          },
          pitfall: 'Failing to align allocations can trigger CPU bus error traps on ARM and RISC architectures that forbid unaligned memory reads.',
          quickCheck: {
            question: 'What is the purpose of alignment padding in a custom memory allocator?',
            options: [
              'To ensure every allocation starts at an address divisible by the type alignment requirement',
              'To clear memory with zeros',
              'To encrypt the memory buffer',
              'To prevent stack overflow'
            ],
            correctIndex: 0,
            explanation: 'Alignment padding guarantees that data starts on hardware-friendly memory boundaries for fast CPU cache access.',
          },
        },
        {
          id: 'cpp-w1-d7-t4',
          topicNumber: 4,
          title: 'Implementing the `MemoryArena` Class',
          explanation: [
            'Constructing the full C++ `MemoryArena` class.',
            'Maintains a heap-allocated byte buffer `char* m_buffer`, total `m_capacity`, and current `m_offset`.',
            'Provides a templated `alloc<T>(size_t count)` method that handles alignment, bounds checks, and returns a typed pointer `T*`.'
          ],
          keyRules: [
            'Constructor allocates raw buffer: new char[capacity].',
            'Destructor frees buffer: delete[] m_buffer.',
            'reset() sets m_offset = 0.'
          ],
          codeSnippet: {
            id: 'cpp-snip-7-4',
            title: 'The Complete MemoryArena Class Implementation',
            description: 'Production-ready linear bump allocator in modern C++',
            language: 'cpp',
            code: `#include <iostream>
#include <cstdint>
#include <cstddef>
#include <new>

class MemoryArena {
private:
    char* m_buffer{nullptr};
    size_t m_capacity{0};
    size_t m_offset{0};

public:
    explicit MemoryArena(size_t capacity) 
        : m_capacity(capacity), m_offset(0) {
        m_buffer = new char[m_capacity];
    }

    ~MemoryArena() {
        delete[] m_buffer;
        m_buffer = nullptr;
    }

    // Allocate N bytes with alignment
    void* allocate(size_t bytes, size_t alignment = alignof(std::max_align_t)) {
        uintptr_t currAddress = reinterpret_cast<uintptr_t>(m_buffer + m_offset);
        uintptr_t mask = alignment - 1;
        uintptr_t alignedAddress = (currAddress + mask) & ~mask;
        size_t newOffset = (alignedAddress - reinterpret_cast<uintptr_t>(m_buffer)) + bytes;

        if (newOffset > m_capacity) {
            std::cerr << "Arena Out of Memory!\\n";
            return nullptr;
        }

        m_offset = newOffset;
        return reinterpret_cast<void*>(alignedAddress);
    }

    void reset() {
        m_offset = 0; // Instant reset of all allocations
    }

    size_t getUsedBytes() const { return m_offset; }
    size_t getCapacity() const { return m_capacity; }
};

int main() {
    MemoryArena arena(1024 * 64); // 64 KB Arena
    std::cout << "Arena initialized with " << arena.getCapacity() << " bytes.\\n";
    return 0;
}`,
          },
          pitfall: 'Overrunning the arena buffer without checking `newOffset > m_capacity` causes heap memory corruption.',
          quickCheck: {
            question: 'How does a memory arena free all allocated memory at the end of a frame?',
            options: [
              'By resetting its internal offset pointer back to 0',
              'By calling free() on every individual object',
              'By rebooting the CPU',
              'By running the garbage collector'
            ],
            correctIndex: 0,
            explanation: 'The entire arena is reclaimed instantaneously by resetting the offset counter to 0.',
          },
        },
        {
          id: 'cpp-w1-d7-t5',
          topicNumber: 5,
          title: 'Constructing Objects in Arena Memory via Placement `new`',
          explanation: [
            'The `allocate()` method returns raw uninitialized bytes.',
            'To create real C++ objects with active constructors inside the arena, we combine the arena with placement new.',
            'Template helper: `template <typename T, typename... Args> T* create(Args&&... args)`.'
          ],
          keyRules: [
            'Use placement new: new (rawMemory) T(std::forward<Args>(args)...);',
            'Constructs objects directly in the arena without general heap overhead.'
          ],
          codeSnippet: {
            id: 'cpp-snip-7-5',
            title: 'Arena Object Construction Pattern',
            description: 'Combining arena allocation with placement new for zero-overhead objects',
            language: 'cpp',
            code: `#include <iostream>
#include <new>

struct GameObject {
    int id;
    float posX, posY;
    GameObject(int i, float x, float y) : id(i), posX(x), posY(y) {
        std::cout << "Created Entity #" << id << "\\n";
    }
};

int main() {
    char arenaMemory[sizeof(GameObject) * 2];
    
    // Construct Entity 1 at slot 0
    GameObject* e1 = new (arenaMemory) GameObject(1, 10.0f, 20.0f);
    
    // Construct Entity 2 at slot 1
    GameObject* e2 = new (arenaMemory + sizeof(GameObject)) GameObject(2, 50.0f, 80.0f);

    std::cout << "Entity 1 at (" << e1->posX << ", " << e1->posY << ")\\n";
    std::cout << "Entity 2 at (" << e2->posX << ", " << e2->posY << ")\\n";
    return 0;
}`,
          },
          pitfall: 'Constructing objects that hold external resources (like file handles or network sockets) in an arena requires calling their destructors before calling arena.reset().',
          quickCheck: {
            question: 'Why is placement new needed when allocating objects in a custom memory arena?',
            options: [
              'Because arena allocation only reserves raw bytes; placement new executes the constructor',
              'Because C++ forbids pointers to arenas',
              'Because delete requires placement new',
              'To convert C++ code to C'
            ],
            correctIndex: 0,
            explanation: 'The arena reserves raw memory bytes; placement new initializes the object state by executing its constructor at that address.',
          },
        },
        {
          id: 'cpp-w1-d7-t6',
          topicNumber: 6,
          title: 'Benchmarking Arena vs Standard Heap Allocator',
          explanation: [
            'Benchmarking 1,000,000 allocations in standard `new` vs a custom `MemoryArena`.',
            'Standard `new` takes tens to hundreds of milliseconds due to heap bookkeeping and synchronization.',
            'The linear arena completes 1,000,000 allocations in single-digit milliseconds, delivering an order-of-magnitude throughput improvement.'
          ],
          keyRules: [
            'Arena throughput is bounded only by memory bandwidth, not CPU allocator algorithms.',
            'Cache locality is vastly superior because allocations are strictly contiguous.'
          ],
          codeSnippet: {
            id: 'cpp-snip-7-6',
            title: 'Arena Allocation Benchmark Simulation',
            description: 'Demonstrating contiguous cache locality and allocation throughput',
            language: 'cpp',
            code: `#include <iostream>
#include <vector>

int main() {
    std::cout << "=== Allocator Benchmark Simulation ===" << std::endl;
    std::cout << "1,000,000 Small Allocations:" << std::endl;
    std::cout << "  Standard heap (new/delete): ~85.4 ms (High fragmentation)" << std::endl;
    std::cout << "  Custom MemoryArena:         ~ 1.8 ms (Contiguous, 0 fragmentation)" << std::endl;
    std::cout << "Speedup factor: 47x faster!" << std::endl;
    return 0;
}`,
          },
          pitfall: 'Using an arena for objects with long, staggered, independent lifetimes causes memory bloat because memory cannot be reclaimed until the whole arena resets.',
          quickCheck: {
            question: 'Why is a linear memory arena faster than standard `new`/`delete`?',
            options: [
              'It avoids free-list searches and locks, performing allocations in a single pointer addition',
              'It uses graphics cards for allocation',
              'It disables CPU interrupts',
              'It compresses integers automatically'
            ],
            correctIndex: 0,
            explanation: 'A bump allocator eliminates heap search overhead and fragmentation, advancing a single memory pointer.',
          },
        },
        {
          id: 'cpp-w1-d7-t7',
          topicNumber: 7,
          title: 'Week 1 Review & Architecture Checklist',
          explanation: [
            'Reviewing the core pillars of Week 1:',
            '1. Types & Sizes: Fixed-width `<cstdint>` integers, braced initialization `{}` preventing narrowing.',
            '2. Pointers: Addresses `&`, dereferencing `*`, typesafe `nullptr`, pointer arithmetic strides.',
            '3. References: Un-rebindable aliases, pass-by-`const T&`, const member methods.',
            '4. Memory Management: Stack vs Heap, `new`/`delete` matching `new[]`/`delete[]`, leak detection via ASan.',
            '5. Strings & Views: `std::string` SSO vs zero-copy `std::string_view`.'
          ],
          keyRules: [
            'Clean mental model: Variables hold values; pointers hold addresses; references are aliases.',
            'Const-correctness is non-negotiable in production C++.'
          ],
          codeSnippet: {
            id: 'cpp-snip-7-7',
            title: 'Week 1 Syntax Verification Matrix',
            description: 'Consolidated verification of all Week 1 core syntax rules',
            language: 'cpp',
            code: `#include <iostream>
#include <string_view>

int main() {
    int val = 42;
    int* ptr = &val;
    int& ref = val;
    std::string_view view = "C++ Systems Mastery";

    std::cout << "val: " << val << ", *ptr: " << *ptr << ", ref: " << ref << "\\n";
    std::cout << "view: " << view << "\\n";
    return 0;
}`,
          },
          pitfall: 'Neglecting const correctness early in a project leads to painful refactoring when integrating with standard library algorithms.',
          quickCheck: {
            question: 'Which of the following causes Undefined Behavior in C++?',
            options: [
              'Deleting a pointer twice (double free)',
              'Deleting a nullptr',
              'Passing a const reference to a function',
              'Using braced initialization'
            ],
            correctIndex: 0,
            explanation: 'Calling delete on an already freed pointer causes heap metadata corruption and undefined behavior.',
          },
        },
        {
          id: 'cpp-w1-d7-t8',
          topicNumber: 8,
          title: 'Week 1 Qualifying Exam Readiness',
          explanation: [
            'To unlock Week 2 (Object-Oriented Programming, RAII & Smart Pointers), you must pass the Week 1 Qualifying Exam with a score of >= 80%.',
            'The exam tests: Compilation stages, exact type sizes, pointer arithmetic byte math, const rules, delete vs delete[], and string_view semantics.',
            'Take the exam when ready or retake it to reinforce your systems engineering foundations.'
          ],
          keyRules: [
            'Passing score: 80% (4 out of 5 questions correct).',
            'Unlocks Week 2: Object-Oriented Programming, RAII, Smart Pointers & Move Semantics.'
          ],
          codeSnippet: {
            id: 'cpp-snip-7-8',
            title: 'Week 1 Exam Gateway Kicker',
            description: 'Readiness checklist for module advancement',
            language: 'cpp',
            code: `#include <iostream>

int main() {
    std::cout << "Week 1 Curriculum Complete!\\n";
    std::cout << "Ready for Week 1 Module Qualifying Assessment.\\n";
    return 0;
}`,
          },
          pitfall: 'Rushing into Object-Oriented design without mastering pointers and memory will cause confusion when implementing copy/move constructors in Week 2.',
          quickCheck: {
            question: 'What is required to unlock Week 2 of the C++ Systems Academy?',
            options: [
              'Score at least 80% on the Week 1 Qualifying Exam (or enable Dev Mode)',
              'Write 10,000 lines of code',
              'Install Clang compiler on your local machine',
              'Read the entire ISO C++ specification'
            ],
            correctIndex: 0,
            explanation: 'Passing the qualifying quiz with >= 80% verifies competency and unlocks Week 2.',
          },
        },
      ],
      practiceChallenge: {
        title: 'Day 7 Capstone Project: Working Linear Memory Arena',
        instructions: [
          'Implement a complete `ArenaAllocator` with a fixed buffer size of 256 bytes.',
          'Implement `void* allocate(size_t bytes)` that advances a bump pointer.',
          'Implement `void reset()` that clears the allocated count back to 0.',
          'Allocate space for 3 integer variables, assign them values, and print them out.',
        ],
        starterCode: `#include <iostream>
#include <cstddef>

class ArenaAllocator {
    // Implement 256-byte linear bump allocator
};

int main() {
    // Allocate 3 integers and verify their values
    return 0;
}`,
        solutionCode: `#include <iostream>
#include <cstddef>

class ArenaAllocator {
private:
    char m_buffer[256];
    size_t m_offset{0};

public:
    ArenaAllocator() = default;

    void* allocate(size_t bytes) {
        if (m_offset + bytes > sizeof(m_buffer)) {
            std::cerr << "Arena out of memory!\\n";
            return nullptr;
        }
        void* ptr = &m_buffer[m_offset];
        m_offset += bytes;
        return ptr;
    }

    void reset() { m_offset = 0; }
    size_t bytesUsed() const { return m_offset; }
};

int main() {
    ArenaAllocator arena;
    int* a = static_cast<int*>(arena.allocate(sizeof(int)));
    int* b = static_cast<int*>(arena.allocate(sizeof(int)));
    int* c = static_cast<int*>(arena.allocate(sizeof(int)));

    *a = 10;
    *b = 20;
    *c = 30;

    std::cout << "Allocated 3 ints in arena: " << *a << ", " << *b << ", " << *c << "\\n";
    std::cout << "Total arena bytes used:   " << arena.bytesUsed() << " bytes\\n";
    arena.reset();
    std::cout << "After reset bytes used:   " << arena.bytesUsed() << " bytes\\n";
    return 0;
}`,
        hints: [
          'Use a static char buffer `char m_buffer[256];` inside the class.',
          'Cast the allocated void pointer to `int*` with `static_cast<int*>()`.',
        ],
      },
      keyTakeaways: [
        'Memory Arenas provide microsecond O(1) allocation and O(1) bulk reset.',
        'Always handle memory alignment when building low-level custom allocators.',
        'Placement new constructs objects in pre-allocated buffers without requesting memory from the OS.',
        'Week 1 establishes the bedrock of C++ memory control: pointers, references, and hardware layouts.',
      ],
    },
  ],
  quiz: {
    id: 'cpp-quiz-week-1',
    weekNumber: 1,
    title: 'Week 1 Qualifying Exam: C++ Memory & Pointer Architecture',
    description: 'Score at least 80% (4/5 correct) to unlock Week 2: OOP, RAII, Smart Pointers & Move Semantics.',
    passingScorePercent: 80,
    questions: [
      {
        id: 'cpp-q1-1',
        question: 'Which tool in the C++ compilation pipeline resolves external function definitions across multiple object files?',
        options: ['The Preprocessor', 'The Linker', 'The Assembler', 'The Optimizer'],
        correctIndex: 1,
        explanation: 'The Linker stitches together compiled object files and libraries, resolving cross-module symbols.',
      },
      {
        id: 'cpp-q1-2',
        question: 'If `int* ptr = (int*)0x1000;` on an x86_64 system where `sizeof(int) == 4`, what is `ptr + 3`?',
        options: ['0x100C (0x1000 + 12 bytes)', '0x1003', '0x1006', '0x1012'],
        correctIndex: 0,
        explanation: 'Pointer arithmetic increments by 3 * sizeof(int) = 12 bytes = 0x0C in hex. 0x1000 + 0x0C = 0x100C.',
      },
      {
        id: 'cpp-q1-3',
        question: 'Why is `const std::string&` preferred over `std::string` when passing a string parameter for inspection?',
        options: [
          'It passes by address, eliminating an expensive deep heap copy of the string buffer',
          'It converts the string to upper-case automatically',
          'It allows the function to modify the caller string',
          'It is required by the C++ preprocessor'
        ],
        correctIndex: 0,
        explanation: 'Passing by const reference avoids cloning the string buffer onto the stack or heap.',
      },
      {
        id: 'cpp-q1-4',
        question: 'What happens if you free an array allocated with `int* a = new int[20];` using single `delete a;`?',
        options: [
          'Undefined Behavior: only element 0 is destructed and heap allocator metadata is corrupted',
          'All 20 elements are freed correctly',
          'The compiler converts it to delete[] automatically',
          'It emits a compile-time warning and works normally'
        ],
        correctIndex: 0,
        explanation: 'Allocations made with `new[]` must be matched with `delete[]`. Mismatched delete invokes Undefined Behavior.',
      },
      {
        id: 'cpp-q1-5',
        question: 'What is the memory size of `std::string_view` on a 64-bit architecture?',
        options: [
          '16 bytes (8 bytes for pointer + 8 bytes for length)',
          '1 byte',
          '32 bytes',
          'Dynamically sized depending on string length'
        ],
        correctIndex: 0,
        explanation: 'std::string_view is a non-owning slice containing a const char* pointer (8 bytes) and a size_t length (8 bytes).',
      },
    ],
  },
};
