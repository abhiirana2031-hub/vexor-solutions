import { WeekModule } from '../types/course';

export const WEEK_3_MODULE: WeekModule = {
  weekNumber: 3,
  title: 'Object-Oriented Architecture, Metaprogramming & Advanced Python',
  theme: 'OOP, C3 MRO, Dunders, Descriptors, Dataclasses, Protocols & Generators',
  description: 'Deep dive into Python\'s object model with 7 dedicated topics per day. Master type-driven architecture, name mangling, descriptors, multiple inheritance linearization, dunder protocol emulation, and generator pipelines.',
  conceptImage: '/src/assets/images/python_w3_oop_architecture_1792862444792.jpg',
  imageAlt: 'Python Class Hierarchy, Abstract Base Classes, and Object Metaprogramming',
  days: [
    {
      id: 'w3-d15',
      dayNumber: 15,
      weekNumber: 3,
      title: 'OOP Foundations: Classes, Instances & Namespaces',
      subtitle: '7 Topics: Class vs Instance, The self Parameter, Instantiation Lifecycle, __dict__ Namespaces, Class Attributes, Bound Methods, Dynamic Patching',
      durationMinutes: 60,
      overview: 'In Python, classes are first-class objects instantiated by the metaclass `type`. Understand how instance state differs from class state, how method binding works, and how Python stores attributes in hash tables across 7 detailed topics.',
      topics: [
        {
          id: 't15-1',
          topicNumber: 1,
          title: 'Class Objects vs Instance Objects',
          explanation: [
            'A class in Python is an actual runtime object (an instance of `type`). When Python executes a `class` statement, it evaluates the body into a namespace dictionary and creates a class object in memory.',
            'Instances are distinct heap objects that hold a reference to their class via `__class__`. When you access an attribute on an instance, Python first checks the instance namespace, then the class namespace, and finally the inheritance hierarchy.'
          ],
          keyRules: [
            'Classes are instances of `type`',
            'Instances reference their creator class via `obj.__class__`'
          ],
          codeSnippet: {
            id: 'cs3-15-1',
            title: 'Class vs Instance Identity',
            description: 'Inspecting the types and identities of classes and their instances.',
            language: 'python',
            code: `class Engine:\n    cylinders = 4\n\nv8 = Engine()\nprint("Class object type:", type(Engine))\nprint("Instance object type:", type(v8))\nprint("Instance points back to class:", v8.__class__ is Engine)`,
            expectedOutput: `Class object type: <class 'type'>\nInstance object type: <class 'Engine'>\nInstance points back to class: True`
          }
        },
        {
          id: 't15-2',
          topicNumber: 2,
          title: 'The self Parameter & Explicit Receiver',
          explanation: [
            'Unlike languages with implicit `this`, Python explicitly passes the target instance as the first parameter to methods, conventionally named `self`.',
            'When calling `obj.method(x)`, Python translates it into `Class.method(obj, x)`. This explicit receiver makes Python methods ordinary functions when accessed through the class.'
          ],
          keyRules: [
            'Method call `obj.drive(50)` is syntactic sugar for `Car.drive(obj, 50)`',
            '`self` is not a keyword, but a universal PEP 8 convention'
          ],
          codeSnippet: {
            id: 'cs3-15-2',
            title: 'Demonstrating Explicit self Passing',
            description: 'Calling methods both via instance syntax and explicit class function syntax.',
            language: 'python',
            code: `class Car:\n    def __init__(self, brand):\n        self.brand = brand\n    def honk(self):\n        return f"{self.brand} says beep!"\n\nsedan = Car("Tesla")\nprint(sedan.honk())\nprint(Car.honk(sedan))`,
            expectedOutput: `Tesla says beep!\nTesla says beep!`
          }
        },
        {
          id: 't15-3',
          topicNumber: 3,
          title: 'The Instantiation Lifecycle: __new__ vs __init__',
          explanation: [
            'Creating an object is a two-step process: `__new__` allocates the object in memory, and `__init__` initializes its state.',
            '`__new__(cls, ...)` is a static method that returns a new instance of `cls`. Once `__new__` returns the instance, Python invokes `__init__(self, ...)` to populate attributes.'
          ],
          keyRules: [
            '`__new__` is the constructor (allocates memory and returns object)',
            '`__init__` is the initializer (configures state on existing object)',
            'Singleton patterns and immutable subclassing override `__new__`'
          ],
          codeSnippet: {
            id: 'cs3-15-3',
            title: 'Tracing Object Creation Lifecycle',
            description: 'Printing execution order of __new__ and __init__.',
            language: 'python',
            code: `class Lifecycle:\n    def __new__(cls, *args, **kwargs):\n        print("1. __new__ allocating memory for class:", cls.__name__)\n        instance = super().__new__(cls)\n        return instance\n\n    def __init__(self, name):\n        print("2. __init__ initializing state for:", name)\n        self.name = name\n\nobj = Lifecycle("ProductionServer")`,
            expectedOutput: `1. __new__ allocating memory for class: Lifecycle\n2. __init__ initializing state for: ProductionServer`
          }
        },
        {
          id: 't15-4',
          topicNumber: 4,
          title: 'Instance and Class Namespaces via __dict__',
          explanation: [
            'Every standard Python object stores its writable attributes in an internal dictionary called `__dict__`.',
            'Modifying `self.x = 10` is functionally equivalent to writing `self.__dict__["x"] = 10`. Because attributes live in a hash table, lookups are fast O(1).'
          ],
          keyRules: [
            '`instance.__dict__` holds instance-specific attributes',
            '`Class.__dict__` holds class attributes and functions'
          ],
          codeSnippet: {
            id: 'cs3-15-4',
            title: 'Inspecting Object __dict__ Dictionaries',
            description: 'Directly inspecting the underlying dictionary storing object state.',
            language: 'python',
            code: `class User:\n    role = "Standard"\n    def __init__(self, username, email):\n        self.username = username\n        self.email = email\n\nu = User("alice", "alice@example.com")\nprint("Instance __dict__:", u.__dict__)\nprint("Class role in u.__class__.__dict__:", "role" in User.__dict__)`,
            expectedOutput: `Instance __dict__: {'username': 'alice', 'email': 'alice@example.com'}\nClass role in u.__class__.__dict__: True`
          }
        },
        {
          id: 't15-5',
          topicNumber: 5,
          title: 'Class Attributes vs Instance Shadowing',
          explanation: [
            'Class attributes are shared across all instances. If you read `instance.attr`, and `attr` is not in `instance.__dict__`, Python reads it from `Class.__dict__`.',
            'However, assigning `instance.attr = value` does NOT mutate the class attribute! It creates a new key in `instance.__dict__`, shadowing the class attribute for that instance alone.'
          ],
          keyRules: [
            'Reading falls back from instance to class',
            'Writing to `instance.attr` creates an instance attribute (shadowing)',
            'Mutable class attributes (like lists) mutated in-place affect ALL instances'
          ],
          codeSnippet: {
            id: 'cs3-15-5',
            title: 'Attribute Shadowing Demonstration',
            description: 'Showing how assigning to an instance shadows the shared class variable.',
            language: 'python',
            code: `class Node:\n    status = "healthy"\n\nn1 = Node()\nn2 = Node()\nprint("Initial status:", n1.status, n2.status)\n\nn1.status = "degraded"  # Shadows class attribute in n1 only\nprint("After n1 mutation:", n1.status, n2.status)\nprint("Node class status remains:", Node.status)`,
            expectedOutput: `Initial status: healthy healthy\nAfter n1 mutation: degraded healthy\nNode class status remains: healthy`
          }
        },
        {
          id: 't15-6',
          topicNumber: 6,
          title: 'Bound Methods vs Unbound Functions',
          explanation: [
            'When a function defined inside a class is accessed through an instance, Python invokes the descriptor protocol to create a `bound method` object.',
            'A bound method bundles the underlying function pointer with the target instance (`__self__`). When called, it automatically injects `__self__` as the first argument.'
          ],
          keyRules: [
            '`Class.method` is a standard function',
            '`instance.method` is a bound method bound to that instance'
          ],
          codeSnippet: {
            id: 'cs3-15-6',
            title: 'Bound vs Unbound Method Introspection',
            description: 'Inspecting method object binding and __self__ references.',
            language: 'python',
            code: `class Greeter:\n    def greet(self):\n        return "Hello"\n\ng = Greeter()\nprint("Class function:", Greeter.greet)\nprint("Bound method:", g.greet)\nprint("Bound instance is g:", g.greet.__self__ is g)`,
            expectedOutput: `Class function: <function Greeter.greet at ...>\nBound method: <bound method Greeter.greet of <Greeter object at ...>>\nBound instance is g: True`
          }
        },
        {
          id: 't15-7',
          topicNumber: 7,
          title: 'Dynamic Attribute Binding & Monkey Patching',
          explanation: [
            'Because Python namespaces are open mutable dictionaries, you can attach new attributes and functions to existing instances or classes at runtime.',
            'Attaching a method directly to an instance requires using `types.MethodType` so that `self` is properly bound.'
          ],
          keyRules: [
            'Classes can be modified at runtime (monkey patching)',
            'Direct instance methods require `types.MethodType` for binding'
          ],
          codeSnippet: {
            id: 'cs3-15-7',
            title: 'Dynamic Method Binding with MethodType',
            description: 'Binding a new method to a specific instance at runtime.',
            language: 'python',
            code: `import types\n\nclass Server:\n    def __init__(self, host):\n        self.host = host\n\ndef ping(self):\n    return f"Pinged {self.host} successfully"\n\ns = Server("192.168.1.1")\ns.ping = types.MethodType(ping, s)\nprint(s.ping())`,
            expectedOutput: `Pinged 192.168.1.1 successfully`
          }
        }
      ],
      practiceChallenge: {
        title: 'Build a Self-Registering Service Registry',
        instructions: [
          'Create a class `Service` with a class-level list `registry`.',
          'In `__init__`, append `self` to `Service.registry`.',
          'Implement a class method or function to return active service names.'
        ],
        starterCode: `class Service:\n    registry = []\n    def __init__(self, name):\n        self.name = name\n        # TODO: Register instance\n        pass\n\ns1 = Service("Auth")\ns2 = Service("Billing")\nprint("Registered count:", len(Service.registry))`,
        solutionCode: `class Service:\n    registry = []\n    def __init__(self, name):\n        self.name = name\n        Service.registry.append(self)\n\ns1 = Service("Auth")\ns2 = Service("Billing")\nprint("Registered count:", len(Service.registry))\nprint("Service names:", [s.name for s in Service.registry])`,
        hints: ['Access Service.registry directly inside __init__ to append self.']
      },
      keyTakeaways: [
        'Classes are heap objects created by type.',
        'self is an explicit instance receiver.',
        '__new__ allocates; __init__ configures.',
        'Instance attributes shadow class attributes on assignment.'
      ]
    },
    {
      id: 'w3-d16',
      dayNumber: 16,
      weekNumber: 3,
      title: 'Encapsulation, Descriptors & Memory Optimization',
      subtitle: '7 Topics: Public vs Protected, Private Name Mangling, The @property Decorator, Getters/Setters/Deleters, Descriptor Protocol, Memory Savings with __slots__, Read-Only Validation',
      durationMinutes: 65,
      overview: 'Master data hiding and attribute interception in Python. Discover the difference between convention and name mangling, how descriptors intercept attribute access, and how __slots__ eliminates dict overhead across 7 comprehensive topics.',
      topics: [
        {
          id: 't16-1',
          topicNumber: 1,
          title: 'Protected Attributes & Single Underscore Convention',
          explanation: [
            'Python does not have enforced `private` keywords. By convention established in PEP 8, an attribute prefixed with a single underscore (e.g. `_internal_state`) is protected: an indicator that it is private implementation detail and not part of public API.',
            'Tools, IDEs, and linters warn against accessing `_protected` attributes from outside the class hierarchy, but Python runtime permits it.'
          ],
          keyRules: [
            'Single underscore `_name` is an API convention for protected access',
            'Enforced by linters and code reviews, not by runtime exception'
          ],
          codeSnippet: {
            id: 'cs3-16-1',
            title: 'Single Underscore Convention',
            description: 'Distinguishing between public interface and protected internals.',
            language: 'python',
            code: `class BankAccount:\n    def __init__(self, owner, balance):\n        self.owner = owner          # Public\n        self._balance = balance      # Protected internal state\n\nacc = BankAccount("Alice", 1000)\nprint("Public owner:", acc.owner)\nprint("Internal balance:", acc._balance)`,
            expectedOutput: `Public owner: Alice\nInternal balance: 1000`
          }
        },
        {
          id: 't16-2',
          topicNumber: 2,
          title: 'Double Underscore & Name Mangling',
          explanation: [
            'Attributes prefixed with two leading underscores (and at most one trailing underscore), like `__secret`, trigger Python name mangling.',
            'The compiler automatically rewrites the attribute name in `__dict__` to `_ClassName__secret`. This is designed to prevent unintended attribute collisions in subclasses, not for cryptography.'
          ],
          keyRules: [
            '`__name` is transformed to `_ClassName__name` in `__dict__`',
            'Prevents accidental override by child classes',
            'Can still be accessed via the mangled name if deliberately needed'
          ],
          codeSnippet: {
            id: 'cs3-16-2',
            title: 'Name Mangling in Action',
            description: 'Inspecting mangled attribute names in instance __dict__.',
            language: 'python',
            code: `class Vault:\n    def __init__(self, key):\n        self.__secret_key = key\n\nv = Vault("top-secret-99")\nprint("Keys in __dict__:", list(v.__dict__.keys()))\nprint("Access via mangled name:", v._Vault__secret_key)`,
            expectedOutput: `Keys in __dict__: ['_Vault__secret_key']\nAccess via mangled name: top-secret-99`
          }
        },
        {
          id: 't16-3',
          topicNumber: 3,
          title: 'The @property Decorator: Managed Attributes',
          explanation: [
            'The `@property` decorator turns a method into a managed attribute getter. Callers access it with simple dotted syntax (`obj.area`), but under the hood, your function runs.',
            'This enables you to refactor simple attributes into computed properties without breaking client code contracts.'
          ],
          keyRules: [
            'Access managed attributes like fields: `circle.area` without parens `()`',
            'Executes custom logic dynamically upon every read'
          ],
          codeSnippet: {
            id: 'cs3-16-3',
            title: 'Computed Property with @property',
            description: 'Exposing dynamic calculations as clean attribute access.',
            language: 'python',
            code: `class Rectangle:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n\n    @property\n    def area(self):\n        return self.width * self.height\n\nrect = Rectangle(4, 5)\nprint("Computed area:", rect.area)`,
            expectedOutput: `Computed area: 20`
          }
        },
        {
          id: 't16-4',
          topicNumber: 4,
          title: 'Property Setters and Deleters for Validation',
          explanation: [
            'You can attach setter and deleter functions to a property using `@prop_name.setter` and `@prop_name.deleter`.',
            'This allows you to enforce strict business validation rules (e.g., non-negative temperature, email format) whenever an assignment `obj.prop = val` occurs.'
          ],
          keyRules: [
            'Define setter using `@<property_name>.setter`',
            'Raise `ValueError` or `TypeError` on invalid assignment',
            'Enforces encapsulation while preserving clean Pythonic syntax'
          ],
          codeSnippet: {
            id: 'cs3-16-4',
            title: 'Validated Property Setter',
            description: 'Enforcing boundary constraints during attribute assignment.',
            language: 'python',
            code: `class Temperature:\n    def __init__(self, celsius):\n        self.celsius = celsius\n\n    @property\n    def celsius(self):\n        return self._celsius\n\n    @celsius.setter\n    def celsius(self, value):\n        if value < -273.15:\n            raise ValueError("Temperature below absolute zero!")\n        self._celsius = value\n\nt = Temperature(25)\nprint("Temperature:", t.celsius)\nt.celsius = 30\nprint("Updated temperature:", t.celsius)`,
            expectedOutput: `Temperature: 25\nUpdated temperature: 30`
          }
        },
        {
          id: 't16-5',
          topicNumber: 5,
          title: 'The Descriptor Protocol: __get__, __set__, and __delete__',
          explanation: [
            'The descriptor protocol is the underlying machinery powering `@property`, `@classmethod`, `@staticmethod`, and ORMs like Django and SQLAlchemy.',
            'A descriptor is any object defining `__get__(self, instance, owner)`, `__set__(self, instance, value)`, or `__delete__(self, instance)`. Data descriptors (defining both get and set) take precedence over the instance dictionary.'
          ],
          keyRules: [
            'Descriptor must be attached as a CLASS attribute, not instance attribute',
            '`__get__` receives both the instance and the owner class'
          ],
          codeSnippet: {
            id: 'cs3-16-5',
            title: 'Custom NonNegative Number Descriptor',
            description: 'Building a reusable descriptor that validates numeric fields.',
            language: 'python',
            code: `class NonNegative:\n    def __set_name__(self, owner, name):\n        self.name = name\n    def __get__(self, instance, owner):\n        if instance is None:\n            return self\n        return instance.__dict__.get(self.name, 0)\n    def __set__(self, instance, value):\n        if value < 0:\n            raise ValueError(f"{self.name} cannot be negative")\n        instance.__dict__[self.name] = value\n\nclass Product:\n    price = NonNegative()\n    stock = NonNegative()\n\np = Product()\np.price = 49\np.stock = 100\nprint("Validated price and stock:", p.price, p.stock)`,
            expectedOutput: `Validated price and stock: 49 100`
          }
        },
        {
          id: 't16-6',
          topicNumber: 6,
          title: 'Memory Optimization with __slots__',
          explanation: [
            'By default, Python instances store attributes in an open `__dict__`, which consumes significant heap memory (around 150+ bytes per instance).',
            'By defining `__slots__ = ("x", "y")`, you instruct Python to allocate a fixed-size compact C struct array of pointers instead of a dynamic dictionary, slashing instance memory footprint by 60-70% and accelerating attribute lookups.'
          ],
          keyRules: [
            '`__slots__` prevents creation of `__dict__` and `__weakref__` by default',
            'Instances cannot have arbitrary new attributes assigned at runtime',
            'Ideal for high-volume objects (millions of records, particles, vectors)'
          ],
          codeSnippet: {
            id: 'cs3-16-6',
            title: 'Memory Savings with __slots__',
            description: 'Demonstrating that slotted instances have no __dict__ attribute.',
            language: 'python',
            code: `class SlottedPoint:\n    __slots__ = ("x", "y")\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n\np = SlottedPoint(10, 20)\nprint("Has __dict__?:", hasattr(p, "__dict__"))\nprint("Coordinates:", p.x, p.y)`,
            expectedOutput: `Has __dict__?: False\nCoordinates: 10 20`
          }
        },
        {
          id: 't16-7',
          topicNumber: 7,
          title: 'Read-Only and Cached Attributes',
          explanation: [
            'A property without a setter is inherently read-only: trying to reassign `obj.prop = 5` raises `AttributeError: can\'t set attribute`.',
            'Python 3.8+ introduced `@functools.cached_property`, which executes an expensive computation once on first access and stores the result directly in `instance.__dict__` for subsequent O(1) lookups.'
          ],
          keyRules: [
            'Omitting setter creates an immutable property',
            '`cached_property` caches expensive results without custom boilerplate'
          ],
          codeSnippet: {
            id: 'cs3-16-7',
            title: 'Read-Only Property Protection',
            description: 'Showing how read-only properties prevent accidental mutations.',
            language: 'python',
            code: `class SystemConfig:\n    def __init__(self, env):\n        self._env = env\n\n    @property\n    def env(self):\n        return self._env\n\ncfg = SystemConfig("production")\nprint("Current env:", cfg.env)\ntry:\n    cfg.env = "staging"\nexcept AttributeError as e:\n    print("Assignment blocked:", type(e).__name__)`,
            expectedOutput: `Current env: production\nAssignment blocked: AttributeError`
          }
        }
      ],
      practiceChallenge: {
        title: 'Build a Validated BankAccount with Properties',
        instructions: [
          'Create a class `Account` with protected `_balance`.',
          'Add a getter for `balance`.',
          'Add a `deposit(amount)` method that raises ValueError if amount <= 0.'
        ],
        starterCode: `class Account:\n    def __init__(self, balance):\n        self._balance = balance\n    # TODO: add balance property and deposit method\n\nacc = Account(100)\nprint("Balance:", acc.balance)`,
        solutionCode: `class Account:\n    def __init__(self, balance):\n        self._balance = balance\n\n    @property\n    def balance(self):\n        return self._balance\n\n    def deposit(self, amount):\n        if amount <= 0:\n            raise ValueError("Deposit must be positive")\n        self._balance += amount\n\nacc = Account(100)\nacc.deposit(50)\nprint("Balance:", acc.balance)`,
        hints: ['Use @property above def balance(self): return self._balance']
      },
      keyTakeaways: [
        'Single underscore is convention; double underscore triggers name mangling.',
        '@property enables getters, setters, and deleters with dot-syntax.',
        'Descriptors power properties, methods, and ORMs.',
        '__slots__ removes __dict__ to minimize memory usage.'
      ]
    },
    {
      id: 'w3-d17',
      dayNumber: 17,
      weekNumber: 3,
      title: 'Inheritance, Polymorphism & Abstract Base Classes',
      subtitle: '7 Topics: Single Inheritance, Method Overriding, super() Fundamentals, Polymorphic Dispatch, Abstract Classes (abc.ABC), Protocols & Duck Typing, Mixin Design Pattern',
      durationMinutes: 65,
      overview: 'Design extensible systems using inheritance and polymorphism. Learn when to subclass, how abstract base classes enforce interface contracts, and how Python leverages structural duck typing across 7 detailed topics.',
      topics: [
        {
          id: 't17-1',
          topicNumber: 1,
          title: 'Single Inheritance & Base Class Hierarchy',
          explanation: [
            'Inheritance allows a subclass to inherit attributes and methods from a parent class using the syntax `class Child(Parent):`.',
            'Every user-defined class in Python 3 implicitly inherits from the root `object` class, gaining default implementations of `__repr__`, `__eq__`, and `__hash__`.'
          ],
          keyRules: [
            'All Python classes inherit from `object`',
            'Subclasses automatically inherit methods from base classes'
          ],
          codeSnippet: {
            id: 'cs3-17-1',
            title: 'Basic Single Inheritance',
            description: 'Subclassing a base class and calling inherited methods.',
            language: 'python',
            code: `class Vehicle:\n    def start(self):\n        return "Engine ignition initialized"\n\nclass ElectricCar(Vehicle):\n    def charge(self):\n        return "Battery charging at 150kW"\n\nev = ElectricCar()\nprint("Inherited method:", ev.start())\nprint("Subclass method:", ev.charge())`,
            expectedOutput: `Inherited method: Engine ignition initialized\nSubclass method: Battery charging at 150kW`
          }
        },
        {
          id: 't17-2',
          topicNumber: 2,
          title: 'Method Overriding & Behavior Specialization',
          explanation: [
            'A subclass can redefine a method inherited from its parent. When that method is called on a child instance, Python finds and executes the child\'s version first.',
            'Overriding allows specialized domain behavior without modifying the original base class code (Open-Closed Principle).'
          ],
          keyRules: [
            'Child method definition overrides base method with the same name',
            'Base implementation remains intact for instances of the base class'
          ],
          codeSnippet: {
            id: 'cs3-17-2',
            title: 'Method Overriding in Action',
            description: 'Overriding parent methods in child classes.',
            language: 'python',
            code: `class Notification:\n    def send(self, recipient, message):\n        return f"Standard: {recipient} <- {message}"\n\nclass SMSNotification(Notification):\n    def send(self, recipient, message):\n        return f"SMS to {recipient}: {message[:160]}"\n\nnotifier = SMSNotification()\nprint(notifier.send("+1-555-0199", "Your OTP is 482910"))`,
            expectedOutput: `SMS to +1-555-0199: Your OTP is 482910`
          }
        },
        {
          id: 't17-3',
          topicNumber: 3,
          title: 'Using super() to Extend Base Implementations',
          explanation: [
            'Often you do not want to completely discard the parent\'s method, but rather extend it with extra initialization or teardown.',
            '`super()` delegates method calls to the next class in the Method Resolution Order (MRO). In single inheritance, `super().__init__(...)` ensures parent constructor logic runs reliably.'
          ],
          keyRules: [
            '`super().method(*args)` invokes parent implementation',
            'Prevents duplicating parent attribute assignments'
          ],
          codeSnippet: {
            id: 'cs3-17-3',
            title: 'Extending Constructors with super()',
            description: 'Calling super().__init__ to configure base class state.',
            language: 'python',
            code: `class Employee:\n    def __init__(self, name, salary):\n        self.name = name\n        self.salary = salary\n\nclass Manager(Employee):\n    def __init__(self, name, salary, department):\n        super().__init__(name, salary)\n        self.department = department\n\nm = Manager("Sarah", 125000, "Engineering")\nprint(f"Manager {m.name} leads {m.department} with base salary \${m.salary}")`,
            expectedOutput: `Manager Sarah leads Engineering with base salary \$125000`
          }
        },
        {
          id: 't17-4',
          topicNumber: 4,
          title: 'Polymorphic Dispatch & Uniform Interfaces',
          explanation: [
            'Polymorphism enables treating different specialized classes through the exact same interface without type checks or `switch` statements.',
            'A function can accept any object with a `.render()` or `.execute()` method and run it transparently.'
          ],
          keyRules: [
            'Call methods uniformly without inspecting explicit type',
            'Replaces rigid `if isinstance(x, ...)` branching'
          ],
          codeSnippet: {
            id: 'cs3-17-4',
            title: 'Polymorphic Rendering Pipeline',
            description: 'Iterating over heterogeneous objects invoking shared method signature.',
            language: 'python',
            code: `class JSONExporter:\n    def export(self, data): return f"{{\\"data\\": {data}}}"\n\nclass CSVExporter:\n    def export(self, data): return f"id,val\\n1,{data}"\n\nexporters = [JSONExporter(), CSVExporter()]\nfor exp in exporters:\n    print(exp.export("metrics"))`,
            expectedOutput: `{"data": metrics}\nid,val\n1,metrics`
          }
        },
        {
          id: 't17-5',
          topicNumber: 5,
          title: 'Abstract Base Classes with abc.ABC & @abstractmethod',
          explanation: [
            'Python\'s `abc` module lets you define formal interface contracts. A class inheriting from `abc.ABC` with at least one `@abstractmethod` cannot be directly instantiated.',
            'Subclasses MUST override and implement all abstract methods; if they do not, Python raises a `TypeError` at instantiation time.'
          ],
          keyRules: [
            'Subclasses of ABC cannot be instantiated until all abstract methods are implemented',
            'Guarantees API compliance at startup'
          ],
          codeSnippet: {
            id: 'cs3-17-5',
            title: 'Enforcing Interfaces with ABC',
            description: 'Creating an abstract base class that mandates child implementation.',
            language: 'python',
            code: `from abc import ABC, abstractmethod\n\nclass DatabaseDriver(ABC):\n    @abstractmethod\n    def connect(self):\n        pass\n\nclass PostgresDriver(DatabaseDriver):\n    def connect(self):\n        return "Connected to PostgreSQL on port 5432"\n\ndriver = PostgresDriver()\nprint(driver.connect())`,
            expectedOutput: `Connected to PostgreSQL on port 5432`
          }
        },
        {
          id: 't17-6',
          topicNumber: 6,
          title: 'Protocols and Structural Duck Typing',
          explanation: [
            'Python is famously duck-typed ("If it walks like a duck and quacks like a duck, it is a duck").',
            'With Python 3.8+ `typing.Protocol`, you can define structural subtyping without requiring explicit inheritance. An object satisfies the protocol simply by implementing the matching signatures.'
          ],
          keyRules: [
            'Protocols enable static type checking of duck typing',
            'No need to explicitly subclass the Protocol'
          ],
          codeSnippet: {
            id: 'cs3-17-6',
            title: 'Duck Typing and Protocol Compatibility',
            description: 'Passing duck-compatible objects without shared inheritance.',
            language: 'python',
            code: `class AudioStream:\n    def read(self): return "audio bytes"\n\nclass FileStream:\n    def read(self): return "file bytes"\n\ndef process_stream(stream):\n    return f"Processed: {stream.read()}"\n\nprint(process_stream(AudioStream()))\nprint(process_stream(FileStream()))`,
            expectedOutput: `Processed: audio bytes\nProcessed: file bytes`
          }
        },
        {
          id: 't17-7',
          topicNumber: 7,
          title: 'The Mixin Design Pattern',
          explanation: [
            'A Mixin is a specialized class intended to provide standalone behavior to other classes through multiple inheritance, without being instantiated on its own.',
            'Mixins encourage code reuse across unrelated class hierarchies (e.g. `JSONSerializableMixin`, `LoggingMixin`).'
          ],
          keyRules: [
            'Mixins should not have their own `__init__` state',
            'Place mixin classes first in inheritance list'
          ],
          codeSnippet: {
            id: 'cs3-17-7',
            title: 'Reusable Serialization Mixin',
            description: 'Composing behavior into classes using mixin inheritance.',
            language: 'python',
            code: `class JSONMixin:\n    def to_json(self):\n        return str(self.__dict__)\n\nclass Order(JSONMixin):\n    def __init__(self, order_id, amount):\n        self.order_id = order_id\n        self.amount = amount\n\no = Order(901, 299.95)\nprint("Mixin JSON output:", o.to_json())`,
            expectedOutput: `Mixin JSON output: {'order_id': 901, 'amount': 299.95}`
          }
        }
      ],
      practiceChallenge: {
        title: 'Implement an Abstract Payment Processor',
        instructions: [
          'Create an abstract class `PaymentProcessor(ABC)`.',
          'Declare `@abstractmethod def process(self, amount): pass`.',
          'Create `StripeProcessor` that implements `process` returning "Paid $X via Stripe".'
        ],
        starterCode: `from abc import ABC, abstractmethod\n\n# TODO: Create PaymentProcessor ABC and StripeProcessor child\n`,
        solutionCode: `from abc import ABC, abstractmethod\n\nclass PaymentProcessor(ABC):\n    @abstractmethod\n    def process(self, amount):\n        pass\n\nclass StripeProcessor(PaymentProcessor):\n    def process(self, amount):\n        return f"Paid \${amount} via Stripe"\n\np = StripeProcessor()\nprint(p.process(100))`,
        hints: ['Inherit from ABC and decorate the abstract method with @abstractmethod']
      },
      keyTakeaways: [
        'Inheritance shares code; polymorphism shares interfaces.',
        'super() delegates to parent classes.',
        'abc.ABC enforces abstract method implementation at instantiation.',
        'Mixins provide modular behavioral add-ons.'
      ]
    },
    {
      id: 'w3-d18',
      dayNumber: 18,
      weekNumber: 3,
      title: 'Multiple Inheritance, C3 Linearization & MRO',
      subtitle: '7 Topics: Multiple Inheritance Syntax, The Diamond Problem, The C3 Linearization Rules, Inspecting __mro__, Cooperative super() Chaining, Kwargs Forwarding in MRO, Anti-Patterns',
      durationMinutes: 70,
      overview: 'Conquer Python\'s most sophisticated inheritance mechanics: the C3 Linearization Algorithm. Understand how Python resolves the diamond problem deterministically and why cooperative super() calls are essential across 7 in-depth topics.',
      interactiveDiagram: {
        type: 'mro',
        title: 'The Diamond Problem & C3 MRO Linearization',
        caption: 'Class D inherits from B and C, which both inherit from A. C3 Linearization guarantees D -> B -> C -> A -> object with monotonic ordering.'
      },
      topics: [
        {
          id: 't18-1',
          topicNumber: 1,
          title: 'Multiple Inheritance Syntax and Mechanics',
          explanation: [
            'Python allows a class to inherit from multiple parent classes: `class D(B, C):`.',
            'This enables rich behavioral composition, but introduces challenges when parents declare methods with identical signatures.'
          ],
          keyRules: [
            'Classes can specify multiple parents in comma-separated list',
            'Order of declaration in the class header matters'
          ],
          codeSnippet: {
            id: 'cs3-18-1',
            title: 'Multiple Inheritance Declaration',
            description: 'Declaring a class that inherits methods from two distinct base classes.',
            language: 'python',
            code: `class Reader:\n    def read(self): return "reading data"\n\nclass Writer:\n    def write(self): return "writing data"\n\nclass StreamDevice(Reader, Writer):\n    pass\n\ndev = StreamDevice()\nprint("Can read:", dev.read())\nprint("Can write:", dev.write())`,
            expectedOutput: `Can read: reading data\nCan write: writing data`
          }
        },
        {
          id: 't18-2',
          topicNumber: 2,
          title: 'The Diamond Problem & Ambiguity',
          explanation: [
            'The Diamond Problem occurs when class `D` inherits from `B` and `C`, and both `B` and `C` inherit from root class `A`.',
            'If both `B` and `C` override a method from `A`, which implementation should `D` execute? Without a strict algorithm, resolution order is ambiguous and can lead to subtle bugs or duplicated calls to `A`.'
          ],
          keyRules: [
            'Occurs when two base classes share a common ancestor',
            'Naive depth-first search would evaluate A before C, violating subclass precedence'
          ],
          codeSnippet: {
            id: 'cs3-18-2',
            title: 'Diamond Problem Topology',
            description: 'Defining diamond hierarchy classes A, B, C, D.',
            language: 'python',
            code: `class A:\n    def ping(self): return "A"\nclass B(A):\n    def ping(self): return "B"\nclass C(A):\n    def ping(self): return "C"\nclass D(B, C):\n    pass\n\nd = D()\nprint("D resolves ping() to:", d.ping())`,
            expectedOutput: `D resolves ping() to: B`
          }
        },
        {
          id: 't18-3',
          topicNumber: 3,
          title: 'The C3 Linearization Algorithm',
          explanation: [
            'Python uses the C3 Linearization Algorithm (introduced in Python 2.3) to produce a monotonic Method Resolution Order (MRO).',
            'The 3 core constraints of C3 are: (1) Children precede parents, (2) Parent order in class definition is preserved, (3) Monotonicity: if A precedes B in one class MRO, A must precede B in any subclass MRO.'
          ],
          keyRules: [
            'Children always precede parents',
            'Left-to-right definition order is strictly maintained',
            'Incompatible hierarchies raise `TypeError: Cannot create a consistent method resolution order`'
          ],
          codeSnippet: {
            id: 'cs3-18-3',
            title: 'Inspecting Class MRO',
            description: 'Printing the exact linearized tuple of classes for D.',
            language: 'python',
            code: `class A: pass\nclass B(A): pass\nclass C(A): pass\nclass D(B, C): pass\n\nprint("Linearized MRO for D:")\nfor cls in D.__mro__:\n    print(" ->", cls.__name__)`,
            expectedOutput: `Linearized MRO for D:\n -> D\n -> B\n -> C\n -> A\n -> object`
          }
        },
        {
          id: 't18-4',
          topicNumber: 4,
          title: 'Cooperative super() Chaining',
          explanation: [
            '`super()` does NOT call the parent class! It calls the NEXT class in the instance MRO.',
            'In multiple inheritance, `super()` enables cooperative multiple inheritance: every method calls `super().method()`, causing execution to traverse the entire diamond without duplicating calls or skipping classes.'
          ],
          keyRules: [
            'super() delegates to the next class in `type(self).__mro__`',
            'Every participating class must call `super()` to sustain the chain'
          ],
          codeSnippet: {
            id: 'cs3-18-4',
            title: 'Cooperative Chain Execution',
            description: 'Tracing method execution through all diamond ancestors.',
            language: 'python',
            code: `class Root:\n    def action(self): return ["Root"]\nclass Left(Root):\n    def action(self): return ["Left"] + super().action()\nclass Right(Root):\n    def action(self): return ["Right"] + super().action()\nclass Combined(Left, Right):\n    def action(self): return ["Combined"] + super().action()\n\nprint("Cooperative chain:", Combined().action())`,
            expectedOutput: `Cooperative chain: ['Combined', 'Left', 'Right', 'Root']`
          }
        },
        {
          id: 't18-5',
          topicNumber: 5,
          title: 'Kwargs Forwarding Across Cooperative __init__',
          explanation: [
            'When classes in a cooperative MRO require different constructor parameters, methods must accept `**kwargs` and pass remaining keyword arguments forward to `super().__init__(**kwargs)`.',
            'The terminal class (`object.__init__`) accepts zero arguments, so all custom keyword arguments must be consumed by the chain before reaching `object`.'
          ],
          keyRules: [
            'Consume needed params with `kwargs.pop(\'key\')` and pass `**kwargs` forward',
            'Prevents missing argument or unexpected argument TypeErrors'
          ],
          codeSnippet: {
            id: 'cs3-18-5',
            title: 'Cooperative Kwargs Forwarding',
            description: 'Constructing cooperative classes with diverse initializers.',
            language: 'python',
            code: `class Base:\n    def __init__(self, **kwargs):\n        super().__init__()\n\nclass Timestamped(Base):\n    def __init__(self, timestamp=0, **kwargs):\n        super().__init__(**kwargs)\n        self.timestamp = timestamp\n\nclass Tagged(Base):\n    def __init__(self, tag="default", **kwargs):\n        super().__init__(**kwargs)\n        self.tag = tag\n\nclass Event(Timestamped, Tagged):\n    pass\n\ne = Event(timestamp=1700000000, tag="deploy")\nprint(f"Event tag: {e.tag}, timestamp: {e.timestamp}")`,
            expectedOutput: `Event tag: deploy, timestamp: 1700000000`
          }
        },
        {
          id: 't18-6',
          topicNumber: 6,
          title: 'Inconsistent MRO Conflicts',
          explanation: [
            'If you attempt to define an inheritance topology that violates the C3 constraints (such as asking Python to place class X before Y, while an ancestor demands Y before X), Python halts at class definition time.',
            'It will raise a `TypeError: Cannot create a consistent method resolution order (MRO) for bases`.'
          ],
          keyRules: [
            'C3 detects cyclic or conflicting ordering constraints at class creation',
            'Fix by harmonizing base class order or decoupling hierarchy'
          ],
          codeSnippet: {
            id: 'cs3-18-6',
            title: 'Handling Inconsistent MRO Detection',
            description: 'Demonstrating how Python detects conflicting order requirements.',
            language: 'python',
            code: `class X: pass\nclass Y(X): pass\n\ntry:\n    # X is parent of Y, but class Bad requests X before Y!\n    class Bad(X, Y):\n        pass\nexcept TypeError as err:\n    print("MRO conflict caught:", type(err).__name__)`,
            expectedOutput: `MRO conflict caught: TypeError`
          }
        },
        {
          id: 't18-7',
          topicNumber: 7,
          title: 'Composition vs Multiple Inheritance Tradeoffs',
          explanation: [
            'While multiple inheritance is powerful for mixins and frameworks, deeply nested diamond hierarchies are notoriously hard to reason about.',
            'The Gang of Four principle "Favor object composition over class inheritance" is standard Python practice: store helper components as attributes instead of inheriting them.'
          ],
          keyRules: [
            'Composition is easier to test and mock than deep inheritance',
            'Use mixins for orthogonal, stateless capabilities'
          ],
          codeSnippet: {
            id: 'cs3-18-7',
            title: 'Composition Pattern',
            description: 'Composing distinct components into a cohesive service.',
            language: 'python',
            code: `class MemoryLogger:\n    def log(self, msg): return f"[LOG] {msg}"\n\nclass WorkerService:\n    def __init__(self, logger):\n        self.logger = logger  # Composition\n    def run(self):\n        return self.logger.log("Job completed")\n\ns = WorkerService(MemoryLogger())\nprint(s.run())`,
            expectedOutput: `[LOG] Job completed`
          }
        }
      ],
      practiceChallenge: {
        title: 'Trace and Predict Cooperative MRO Chaining',
        instructions: [
          'Create classes `First`, `Second`, and `Child(First, Second)`.',
          'Implement `ping()` in each class using `super().ping()`.',
          'Create an instance of `Child` and verify the output sequence.'
        ],
        starterCode: `class Base:\n    def ping(self): return "Base"\n\nclass First(Base):\n    def ping(self): return "First -> " + super().ping()\n\nclass Second(Base):\n    def ping(self): return "Second -> " + super().ping()\n\nclass Child(First, Second):\n    def ping(self): return "Child -> " + super().ping()\n\nprint(Child().ping())`,
        solutionCode: `class Base:\n    def ping(self): return "Base"\n\nclass First(Base):\n    def ping(self): return "First -> " + super().ping()\n\nclass Second(Base):\n    def ping(self): return "Second -> " + super().ping()\n\nclass Child(First, Second):\n    def ping(self): return "Child -> " + super().ping()\n\nprint(Child().ping())`,
        hints: ['Follow the MRO: Child -> First -> Second -> Base']
      },
      keyTakeaways: [
        'C3 Linearization computes a deterministic, monotonic MRO.',
        'super() delegates to the next class in MRO, not the syntactic parent.',
        'Kwargs forwarding enables diverse cooperative constructors.',
        'Prefer composition for business logic; reserve mixins for cross-cutting concerns.'
      ]
    },
    {
      id: 'w3-d19',
      dayNumber: 19,
      weekNumber: 3,
      title: 'Dunder Magic Methods & Operator Overloading',
      subtitle: '7 Topics: __str__ vs __repr__, Comparison Dunders, Arithmetic Overloading, Emulating Containers (__getitem__), Callable Instances (__call__), Context Protocol (__enter__/__exit__), Hashability (__hash__)',
      durationMinutes: 70,
      overview: 'Transform custom classes into first-class Python citizens. Learn how special double-underscore methods emulate numbers, sequences, mappings, context managers, and callable functions across 7 deep topics.',
      topics: [
        {
          id: 't19-1',
          topicNumber: 1,
          title: '__repr__ vs __str__: Representations for Developers vs Users',
          explanation: [
            '`__repr__` is intended for developers and debugging: it should ideally return an unambiguous string that could recreate the object (e.g. `Vector(3, 4)`).',
            '`__str__` is intended for end users and human-readable output (e.g. `Vector at (3, 4)`). If `__str__` is missing, Python falls back to `__repr__`.'
          ],
          keyRules: [
            'Always implement `__repr__` first',
            '`__repr__` should be unambiguous; `__str__` should be readable'
          ],
          codeSnippet: {
            id: 'cs3-19-1',
            title: '__repr__ and __str__ Implementation',
            description: 'Defining distinct developer and user representations.',
            language: 'python',
            code: `class Vector:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n    def __repr__(self):\n        return f"Vector({self.x}, {self.y})"\n    def __str__(self):\n        return f"({self.x}, {self.y})"\n\nv = Vector(3, 4)\nprint("repr(v):", repr(v))\nprint("str(v):", str(v))`,
            expectedOutput: `repr(v): Vector(3, 4)\nstr(v): (3, 4)`
          }
        },
        {
          id: 't19-2',
          topicNumber: 2,
          title: 'Arithmetic Operator Overloading (__add__, __mul__)',
          explanation: [
            'Python maps binary operators directly to dunder methods: `+` calls `__add__`, `*` calls `__mul__`, and `-` calls `__sub__`.',
            'To support operations where your custom class is on the right side of a standard type (e.g., `3 * vector`), implement reflected methods like `__rmul__`.'
          ],
          keyRules: [
            '`a + b` invokes `a.__add__(b)`',
            'If `__add__` returns `NotImplemented`, Python attempts `b.__radd__(a)`'
          ],
          codeSnippet: {
            id: 'cs3-19-2',
            title: 'Vector Arithmetic Overloading',
            description: 'Implementing __add__ and __mul__ on custom vector class.',
            language: 'python',
            code: `class Vec2D:\n    def __init__(self, x, y):\n        self.x, self.y = x, y\n    def __add__(self, other):\n        return Vec2D(self.x + other.x, self.y + other.y)\n    def __mul__(self, scalar):\n        return Vec2D(self.x * scalar, self.y * scalar)\n    def __repr__(self):\n        return f"Vec2D({self.x}, {self.y})"\n\nv1 = Vec2D(1, 2)\nv2 = Vec2D(3, 4)\nprint("v1 + v2 =", v1 + v2)\nprint("v1 * 3 =", v1 * 3)`,
            expectedOutput: `v1 + v2 = Vec2D(4, 6)\nv1 * 3 = Vec2D(3, 6)`
          }
        },
        {
          id: 't19-3',
          topicNumber: 3,
          title: 'Rich Comparison Methods (__eq__, __lt__, functools.total_ordering)',
          explanation: [
            'Python provides 6 rich comparison dunders: `__eq__`, `__ne__`, `__lt__`, `__le__`, `__gt__`, and `__ge__`.',
            'Instead of manually coding all 6, decorating your class with `@functools.total_ordering` and defining `__eq__` plus just one ordering dunder (`__lt__`) automatically derives the rest.'
          ],
          keyRules: [
            'Default `__eq__` compares memory identity (`is`), not value equivalence',
            '`@total_ordering` synthesizes `<=`, `>`, `>=` from `==` and `<`'
          ],
          codeSnippet: {
            id: 'cs3-19-3',
            title: 'Total Ordering Comparisons',
            description: 'Deriving full comparison suite with functools.total_ordering.',
            language: 'python',
            code: `from functools import total_ordering\n\n@total_ordering\nclass PriorityTask:\n    def __init__(self, priority, name):\n        self.priority = priority\n        self.name = name\n    def __eq__(self, other):\n        return self.priority == other.priority\n    def __lt__(self, other):\n        return self.priority < other.priority\n\nt1 = PriorityTask(1, "Low")\nt2 = PriorityTask(5, "Urgent")\nprint("t1 < t2:", t1 < t2)\nprint("t2 > t1:", t2 > t1)\nprint("t1 <= t2:", t1 <= t2)`,
            expectedOutput: `t1 < t2: True\nt2 > t1: True\nt1 <= t2: True`
          }
        },
        {
          id: 't19-4',
          topicNumber: 4,
          title: 'Emulating Containers: __len__, __getitem__, __contains__',
          explanation: [
            'By implementing the sequence protocol methods, your custom object can be indexed with brackets `obj[i]`, measured with `len(obj)`, and checked with `in`.',
            'Supporting slice objects in `__getitem__` allows custom collections to slice just like native lists.'
          ],
          keyRules: [
            '`len(x)` calls `x.__len__()`',
            '`x[i]` calls `x.__getitem__(i)`',
            '`item in x` calls `x.__contains__(item)`'
          ],
          codeSnippet: {
            id: 'cs3-19-4',
            title: 'Custom Deck Container',
            description: 'Building a container supporting len, indexing, and iteration.',
            language: 'python',
            code: `class CardDeck:\n    def __init__(self):\n        self._cards = ["Ace", "King", "Queen", "Jack"]\n    def __len__(self):\n        return len(self._cards)\n    def __getitem__(self, index):\n        return self._cards[index]\n    def __contains__(self, card):\n        return card in self._cards\n\ndeck = CardDeck()\nprint("Deck length:", len(deck))\nprint("First card:", deck[0])\nprint("Has Queen?:", "Queen" in deck)`,
            expectedOutput: `Deck length: 4\nFirst card: Ace\nHas Queen?: True`
          }
        },
        {
          id: 't19-5',
          topicNumber: 5,
          title: 'Callable Instances with __call__',
          explanation: [
            'Defining `__call__(self, *args, **kwargs)` makes an instance callable just like a regular function: `obj(*args)`.',
            'This is the idiomatic way to create stateful function objects, custom decorators, and parameterized pipelines.'
          ],
          keyRules: [
            '`obj()` delegates to `obj.__call__()`',
            'Callable instances retain persistent state across invocations'
          ],
          codeSnippet: {
            id: 'cs3-19-5',
            title: 'Stateful Accumulator with __call__',
            description: 'Invoking object instances as functions.',
            language: 'python',
            code: `class Accumulator:\n    def __init__(self, start=0):\n        self.total = start\n    def __call__(self, amount):\n        self.total += amount\n        return self.total\n\nacc = Accumulator(10)\nprint("acc(5) =", acc(5))\nprint("acc(15) =", acc(15))`,
            expectedOutput: `acc(5) = 15\nacc(15) = 30`
          }
        },
        {
          id: 't19-6',
          topicNumber: 6,
          title: 'Context Management Protocol: __enter__ and __exit__',
          explanation: [
            'The `with` statement calls `__enter__` upon entering the block and guarantees `__exit__` runs when exiting, even if exceptions are raised.',
            '`__exit__(self, exc_type, exc_val, exc_tb)` receives exception details. If `__exit__` returns `True`, the exception is suppressed; if it returns `None` or `False`, it propagates.'
          ],
          keyRules: [
            '`__enter__` returns the resource bound by `as var`',
            '`__exit__` handles cleanup and error suppression'
          ],
          codeSnippet: {
            id: 'cs3-19-6',
            title: 'Custom Timer Context Manager',
            description: 'Measuring execution duration using enter and exit dunders.',
            language: 'python',
            code: `import time\n\nclass Benchmark:\n    def __enter__(self):\n        self.start = time.perf_counter()\n        return self\n    def __exit__(self, exc_type, exc_val, exc_tb):\n        self.elapsed = time.perf_counter() - self.start\n        print(f"Block finished in {self.elapsed:.4f}s")\n        return False\n\nwith Benchmark():\n    total = sum(i for i in range(100000))`,
            expectedOutput: `Block finished in 0.0...s`
          }
        },
        {
          id: 't19-7',
          topicNumber: 7,
          title: 'Hashability and Immutability: __hash__ and __eq__',
          explanation: [
            'For an object to be used as a dictionary key or set element, it must be hashable: its hash value must never change during its lifetime.',
            'If you override `__eq__`, Python automatically sets `__hash__ = None` to prevent bugs. To make it hashable again, implement `__hash__` using an immutable tuple of attributes.'
          ],
          keyRules: [
            'Equal objects must have equal hash values: `a == b ==> hash(a) == hash(b)`',
            'Never hash mutable attributes'
          ],
          codeSnippet: {
            id: 'cs3-19-7',
            title: 'Making Custom Objects Hashable',
            description: 'Pairing __eq__ and __hash__ for use in sets and dict keys.',
            language: 'python',
            code: `class Point:\n    def __init__(self, x, y):\n        self._x = x\n        self._y = y\n    def __eq__(self, other):\n        return isinstance(other, Point) and (self._x, self._y) == (other._x, other._y)\n    def __hash__(self):\n        return hash((self._x, self._y))\n\npoints = {Point(1, 2), Point(1, 2), Point(3, 4)}\nprint("Unique points in set:", len(points))`,
            expectedOutput: `Unique points in set: 2`
          }
        }
      ],
      practiceChallenge: {
        title: 'Build a 2D Vector with Addition and Dot Product',
        instructions: [
          'Create `Vector2D(x, y)` implementing `__repr__`.',
          'Implement `__add__` to add vectors coordinate-wise.',
          'Implement `__mul__` to return the dot product when multiplied by another vector.'
        ],
        starterCode: `class Vector2D:\n    def __init__(self, x, y):\n        self.x, self.y = x, y\n    # TODO: implement __repr__, __add__, __mul__\n\nv1 = Vector2D(2, 3)\nv2 = Vector2D(4, 5)\nprint(v1 + v2)`,
        solutionCode: `class Vector2D:\n    def __init__(self, x, y):\n        self.x, self.y = x, y\n    def __repr__(self):\n        return f"Vector2D({self.x}, {self.y})"\n    def __add__(self, other):\n        return Vector2D(self.x + other.x, self.y + other.y)\n    def __mul__(self, other):\n        return self.x * other.x + self.y * other.y\n\nv1 = Vector2D(2, 3)\nv2 = Vector2D(4, 5)\nprint("Sum:", v1 + v2)\nprint("Dot product:", v1 * v2)`,
        hints: ['Dot product is x1 * x2 + y1 * y2']
      },
      keyTakeaways: [
        'Dunder methods hook your classes into Python syntax.',
        'Always pair __repr__ and __str__.',
        'Use @total_ordering to minimize comparison boilerplate.',
        'Hashable objects require immutable fields and aligned __hash__ and __eq__.'
      ]
    },
    {
      id: 'w3-d20',
      dayNumber: 20,
      weekNumber: 3,
      title: 'Dataclasses, Type Hints & Metaprogramming',
      subtitle: '7 Topics: @dataclass Decorator, Field Defaults & default_factory, Frozen Immutable Dataclasses, Type Annotations & Generics, Runtime Introspection (inspect/getattr), __init_subclass__, Metaclasses with type',
      durationMinutes: 70,
      overview: 'Modernize Python code with declarative data classes, static type hints, and metaprogramming hooks. Eliminate boilerplate and enforce class contracts at compile and runtime across 7 topics.',
      topics: [
        {
          id: 't20-1',
          topicNumber: 1,
          title: 'The @dataclass Decorator: Automatic Boilerplate Generation',
          explanation: [
            'Python 3.7 introduced `@dataclass` in the standard library. It automatically generates `__init__`, `__repr__`, `__eq__`, and ordering methods based on type annotations.',
            'It eliminates hundreds of lines of repetitive boilerplate while preserving standard Python class semantics.'
          ],
          keyRules: [
            'Fields require type annotations to be recognized by dataclass',
            'Generates `__init__`, `__repr__`, and `__eq__` by default'
          ],
          codeSnippet: {
            id: 'cs3-20-1',
            title: 'Clean Model with @dataclass',
            description: 'Defining structured data models with automatic representations.',
            language: 'python',
            code: `from dataclasses import dataclass\n\n@dataclass\nclass Transaction:\n    sender: str\n    recipient: str\n    amount: float\n\nt = Transaction("Alice", "Bob", 250.75)\nprint(t)\nprint("Equality check:", t == Transaction("Alice", "Bob", 250.75))`,
            expectedOutput: `Transaction(sender='Alice', recipient='Bob', amount=250.75)\nEquality check: True`
          }
        },
        {
          id: 't20-2',
          topicNumber: 2,
          title: 'Field Customization and default_factory',
          explanation: [
            'Standard default values for mutable types (like `tags: list = []`) are forbidden in dataclasses because lists are shared singletons across all instances.',
            'Use `dataclasses.field(default_factory=list)` to guarantee that each new instance receives its own freshly allocated list or dictionary.'
          ],
          keyRules: [
            'Never use mutable literals as default values',
            '`field(default_factory=...)` creates fresh instances'
          ],
          codeSnippet: {
            id: 'cs3-20-2',
            title: 'Using field(default_factory=...) with Dataclasses',
            description: 'Safe mutable default initialization in dataclasses.',
            language: 'python',
            code: `from dataclasses import dataclass, field\n\n@dataclass\nclass UserProfile:\n    username: str\n    badges: list[str] = field(default_factory=list)\n\nu1 = UserProfile("alice")\nu1.badges.append("Pioneer")\nu2 = UserProfile("bob")\nprint("Alice badges:", u1.badges)\nprint("Bob badges:", u2.badges)`,
            expectedOutput: `Alice badges: ['Pioneer']\nBob badges: []`
          }
        },
        {
          id: 't20-3',
          topicNumber: 3,
          title: 'Immutable Dataclasses (frozen=True)',
          explanation: [
            'Adding `@dataclass(frozen=True)` makes the instance read-only. Any attempt to modify an attribute after instantiation raises `FrozenInstanceError`.',
            'Frozen dataclasses also automatically generate a `__hash__` method, making them immediately safe to use as dictionary keys or set elements.'
          ],
          keyRules: [
            '`frozen=True` prevents in-place mutation',
            'Frozen dataclasses are automatically hashable if their fields are hashable'
          ],
          codeSnippet: {
            id: 'cs3-20-3',
            title: 'Frozen Dataclass Immutability',
            description: 'Enforcing immutable value objects with frozen=True.',
            language: 'python',
            code: `from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Point3D:\n    x: float\n    y: float\n    z: float\n\np = Point3D(1.0, 2.0, 3.0)\ntry:\n    p.x = 9.9\nexcept Exception as e:\n    print("Mutation blocked:", type(e).__name__)\nprint("Safe in set:", len({p, p}))`,
            expectedOutput: `Mutation blocked: FrozenInstanceError\nSafe in set: 1`
          }
        },
        {
          id: 't20-4',
          topicNumber: 4,
          title: 'Modern Type Annotations and Generics',
          explanation: [
            'Modern Python (3.9+) supports built-in generic types (`list[str]`, `dict[str, int]`, `tuple[int, ...]`) directly without importing from `typing`.',
            'For parameterized functions and generic classes, use `TypeVar` and `Generic[T]` to enforce consistent types across inputs and outputs.'
          ],
          keyRules: [
            'Use built-in types for generics (`list[int]`, `dict[str, Any]`)',
            'Union types with pipe syntax: `int | str | None`'
          ],
          codeSnippet: {
            id: 'cs3-20-4',
            title: 'Type Hints with Pipe Unions and Generics',
            description: 'Declaring expressive type hints in modern Python.',
            language: 'python',
            code: `def find_record(record_id: int | str) -> dict[str, str] | None:\n    if record_id == 1 or record_id == "1":\n        return {"status": "active"}\n    return None\n\nprint("Found:", find_record(1))\nprint("Not found:", find_record(999))`,
            expectedOutput: `Found: {'status': 'active'}\nNot found: None`
          }
        },
        {
          id: 't20-5',
          topicNumber: 5,
          title: 'Runtime Introspection with getattr, setattr & inspect',
          explanation: [
            'Python allows inspecting and manipulating objects dynamically at runtime using `getattr()`, `setattr()`, `hasattr()`, and `inspect`.',
            'This forms the backbone of serialization frameworks, CLI argument parsers, and dependency injection containers.'
          ],
          keyRules: [
            '`getattr(obj, name, default)` safely retrieves attributes',
            '`setattr(obj, name, val)` modifies attributes dynamically'
          ],
          codeSnippet: {
            id: 'cs3-20-5',
            title: 'Dynamic Introspection Pipeline',
            description: 'Inspecting attributes and safely invoking methods dynamically.',
            language: 'python',
            code: `class Worker:\n    def task_a(self): return "Completed A"\n    def task_b(self): return "Completed B"\n\nw = Worker()\nfor name in ["task_a", "task_b", "task_c"]:\n    fn = getattr(w, name, None)\n    if callable(fn):\n        print(f"Executed {name}:", fn())\n    else:\n        print(f"{name} not available")`,
            expectedOutput: `Executed task_a: Completed A\nExecuted task_b: Completed B\ntask_c not available`
          }
        },
        {
          id: 't20-6',
          topicNumber: 6,
          title: 'Subclass Hooking with __init_subclass__',
          explanation: [
            'Python 3.6 introduced `__init_subclass__`, which provides an elegant hook for parent classes to intercept and configure subclasses when they are defined.',
            'It replaces complex metaclasses for 90% of subclass registration, validation, and schema configuration use cases.'
          ],
          keyRules: [
            '`__init_subclass__` runs automatically when a child class is created',
            'Can accept custom class keyword arguments: `class Child(Parent, plugin_name="v1"):`'
          ],
          codeSnippet: {
            id: 'cs3-20-6',
            title: 'Automatic Plugin Registration with __init_subclass__',
            description: 'Registering child plugins automatically upon class definition.',
            language: 'python',
            code: `class PluginBase:\n    registry = {}\n    def __init_subclass__(cls, plugin_name, **kwargs):\n        super().__init_subclass__(**kwargs)\n        cls.registry[plugin_name] = cls\n\nclass PDFPlugin(PluginBase, plugin_name="pdf"): pass\nclass ImagePlugin(PluginBase, plugin_name="image"): pass\n\nprint("Registered plugins:", list(PluginBase.registry.keys()))`,
            expectedOutput: `Registered plugins: ['pdf', 'image']`
          }
        },
        {
          id: 't20-7',
          topicNumber: 7,
          title: 'Metaclasses with type: The Class Factories',
          explanation: [
            'Just as objects are instances of classes, classes are instances of metaclasses. The default metaclass is `type`.',
            'By subclassing `type` and overriding `__new__(mcs, name, bases, namespace)`, you can intercept and modify class creation itself, enforcing attributes or transforming methods before the class exists.'
          ],
          keyRules: [
            '`class MyClass(metaclass=MyMeta):` defines custom metaclass',
            'Use sparingly: "Metaclasses are deeper magic than 99% of users should ever worry about"'
          ],
          codeSnippet: {
            id: 'cs3-20-7',
            title: 'Validating Metaclass',
            description: 'Enforcing that subclasses declare an author attribute.',
            language: 'python',
            code: `class VerifyAuthor(type):\n    def __new__(mcs, name, bases, namespace):\n        if "author" not in namespace and name != "Component":\n            raise TypeError(f"Class {name} must declare an author attribute")\n        return super().__new__(mcs, name, bases, namespace)\n\nclass Component(metaclass=VerifyAuthor): pass\nclass SearchWidget(Component):\n    author = "Core Team"\n\nprint("SearchWidget author:", SearchWidget.author)`,
            expectedOutput: `SearchWidget author: Core Team`
          }
        }
      ],
      practiceChallenge: {
        title: 'Create a Frozen Configuration Dataclass',
        instructions: [
          'Define a `@dataclass(frozen=True)` named `AppConfig`.',
          'Include fields `host: str = "localhost"` and `port: int = 8080`.',
          'Attempt to mutate `port` and catch the `FrozenInstanceError`.'
        ],
        starterCode: `from dataclasses import dataclass\n\n# TODO: create frozen AppConfig and test immutability\n`,
        solutionCode: `from dataclasses import dataclass, FrozenInstanceError\n\n@dataclass(frozen=True)\nclass AppConfig:\n    host: str = "localhost"\n    port: int = 8080\n\ncfg = AppConfig()\nprint("Config:", cfg.host, cfg.port)\ntry:\n    cfg.port = 9000\nexcept FrozenInstanceError:\n    print("Caught FrozenInstanceError: config is immutable!")`,
        hints: ['Use @dataclass(frozen=True)']
      },
      keyTakeaways: [
        '@dataclass synthesizes __init__, __repr__, and __eq__ automatically.',
        'Use field(default_factory=list) for mutable defaults.',
        'frozen=True produces hashable, immutable value objects.',
        '__init_subclass__ simplifies plugin registration without metaclasses.'
      ]
    },
    {
      id: 'w3-d21',
      dayNumber: 21,
      weekNumber: 3,
      title: 'Iterators, Generators & The Yield Protocol',
      subtitle: '7 Topics: Iterable vs Iterator Protocol, __iter__ and __next__, StopIteration Mechanics, Generator Functions & yield, Generator Expressions Memory Profile, Bidirectional Generators (.send()), Delegation with yield from',
      durationMinutes: 70,
      overview: 'Master Python\'s lazy evaluation engine. Understand how iterators traverse data without indexing, how generators execute on-demand with minimal memory, and how yield from delegates across 7 in-depth topics.',
      topics: [
        {
          id: 't21-1',
          topicNumber: 1,
          title: 'Iterable vs Iterator Protocol',
          explanation: [
            'An `Iterable` is any object that can return an iterator via `iter(obj)` (implements `__iter__`). Examples: list, tuple, dict, str.',
            'An `Iterator` is an object that represents a stream of data; it implements `__next__()` to return successive items, and `__iter__()` returning itself.'
          ],
          keyRules: [
            '`iter(iterable)` returns an iterator',
            '`next(iterator)` returns the next value or raises `StopIteration`'
          ],
          codeSnippet: {
            id: 'cs3-21-1',
            title: 'Iterating Manually with iter() and next()',
            description: 'Inspecting iterable and iterator objects under the hood.',
            language: 'python',
            code: `items = [10, 20]\nit = iter(items)\nprint("Iterator object:", type(it))\nprint("First item:", next(it))\nprint("Second item:", next(it))`,
            expectedOutput: `Iterator object: <class 'list_iterator'>\nFirst item: 10\nSecond item: 20`
          }
        },
        {
          id: 't21-2',
          topicNumber: 2,
          title: 'Custom Iterator Class Implementation',
          explanation: [
            'To build a custom iterator, define a class with `__iter__` (returning `self`) and `__next__`.',
            'When the sequence ends, `__next__` MUST raise `StopIteration`. The `for` loop catches this exception automatically to cleanly terminate the loop.'
          ],
          keyRules: [
            '`__iter__` returns self',
            '`__next__` updates state and returns value, raising `StopIteration` when complete'
          ],
          codeSnippet: {
            id: 'cs3-21-2',
            title: 'Countdown Iterator Class',
            description: 'Building a stateful iterator that raises StopIteration.',
            language: 'python',
            code: `class Countdown:\n    def __init__(self, start):\n        self.current = start\n    def __iter__(self):\n        return self\n    def __next__(self):\n        if self.current <= 0:\n            raise StopIteration\n        val = self.current\n        self.current -= 1\n        return val\n\nfor count in Countdown(3):\n    print(count)`,
            expectedOutput: `3\n2\n1`
          }
        },
        {
          id: 't21-3',
          topicNumber: 3,
          title: 'Generator Functions and the yield Statement',
          explanation: [
            'Any function containing the `yield` keyword is a generator function. Calling it does NOT run the code; it returns a generator object.',
            'When `next()` is called on the generator, execution advances until hitting `yield`. The yielded value is returned, and the function\'s execution frame (local variables and instruction pointer) is frozen in memory until the next request.'
          ],
          keyRules: [
            'yield pauses execution and preserves local variables in the frame',
            'Calling generator function returns a generator object without running yet'
          ],
          codeSnippet: {
            id: 'cs3-21-3',
            title: 'Lazy Fibonacci Generator',
            description: 'Generating infinite sequences lazily with yield.',
            language: 'python',
            code: `def fibonacci_gen(limit):\n    a, b = 0, 1\n    for _ in range(limit):\n        yield a\n        a, b = b, a + b\n\nfor num in fibonacci_gen(5):\n    print(num, end=" ")\nprint()`,
            expectedOutput: `0 1 1 2 3 `
          }
        },
        {
          id: 't21-4',
          topicNumber: 4,
          title: 'Generator Expressions vs List Comprehensions Memory Comparison',
          explanation: [
            'List comprehensions `[x for x in data]` build the entire collection in memory upfront, taking megabytes or gigabytes for large sequences.',
            'Generator expressions `(x for x in data)` evaluate one item at a time lazily on demand. Their memory footprint is tiny and constant O(1), regardless of whether they process 10 items or 10 billion items.'
          ],
          keyRules: [
            'Parentheses `(x for x in ...)` create generator expressions',
            'Memory usage is constant O(1) regardless of sequence length'
          ],
          codeSnippet: {
            id: 'cs3-21-4',
            title: 'Memory Footprint Comparison',
            description: 'Comparing memory sizes of list vs generator expression.',
            language: 'python',
            code: `import sys\n\nlist_comp = [x * 2 for x in range(10000)]\ngen_exp = (x * 2 for x in range(10000))\n\nprint("List size in bytes:", sys.getsizeof(list_comp))\nprint("Generator size in bytes:", sys.getsizeof(gen_exp))`,
            expectedOutput: `List size in bytes: 85176\nGenerator size in bytes: 200`
          }
        },
        {
          id: 't21-5',
          topicNumber: 5,
          title: 'Bidirectional Generators: Communicating with .send()',
          explanation: [
            'Generators are not just data producers—they can also receive data dynamically from callers using the `.send(value)` method.',
            'Inside the generator, `val = yield output` receives whatever the caller passed into `.send(val)`. This enables coroutines and state machine programming.'
          ],
          keyRules: [
            'Must prime the generator first with `next(gen)` or `gen.send(None)`',
            'Enables bidirectional data flow between caller and generator'
          ],
          codeSnippet: {
            id: 'cs3-21-5',
            title: 'Running Average Coroutine with .send()',
            description: 'Sending dynamic values into a running generator.',
            language: 'python',
            code: `def running_average():\n    total = 0.0\n    count = 0\n    avg = None\n    while True:\n        val = yield avg\n        if val is None: break\n        total += val\n        count += 1\n        avg = total / count\n\navg_gen = running_average()\nnext(avg_gen)  # Prime\nprint("Avg after 10:", avg_gen.send(10))\nprint("Avg after 20:", avg_gen.send(20))\nprint("Avg after 30:", avg_gen.send(30))`,
            expectedOutput: `Avg after 10: 10.0\nAvg after 20: 15.0\nAvg after 30: 20.0`
          }
        },
        {
          id: 't21-6',
          topicNumber: 6,
          title: 'Delegation with yield from',
          explanation: [
            'Python 3.3 introduced `yield from subgenerator()`, establishing a direct transparent bidirectional pipeline between the outer caller and an inner subgenerator.',
            'It forwards values, exceptions, and the subgenerator\'s return value automatically, eliminating verbose manual forwarding loops.'
          ],
          keyRules: [
            '`yield from iterable` delegates value production',
            'Captures subgenerator `return value` into a variable: `result = yield from subgen()`'
          ],
          codeSnippet: {
            id: 'cs3-21-6',
            title: 'Subgenerator Delegation with yield from',
            description: 'Flattening nested iterables cleanly using yield from.',
            language: 'python',
            code: `def chain_iterables(*iterables):\n    for it in iterables:\n        yield from it\n\nmerged = list(chain_iterables([1, 2], ("a", "b"), [True]))\nprint("Merged stream:", merged)`,
            expectedOutput: `Merged stream: [1, 2, 'a', 'b', True]`
          }
        },
        {
          id: 't21-7',
          topicNumber: 7,
          title: 'Generator Pipelines: Composable Data Processing',
          explanation: [
            'Generators can be chained together in pipelines, resembling Unix pipes (`cat log | grep ERROR | cut`).',
            'Each generator processes data on-the-fly and yields it to the next step, allowing petabyte-scale data stream processing with minuscule memory consumption.'
          ],
          keyRules: [
            'Compose small, single-responsibility generator stages',
            'Data streams through the stages without accumulating in RAM'
          ],
          codeSnippet: {
            id: 'cs3-21-7',
            title: 'Data Stream Processing Pipeline',
            description: 'Chaining generators for filtering and transforming logs.',
            language: 'python',
            code: `logs = ["INFO: ok", "ERROR: db timeout", "DEBUG: trace", "ERROR: port busy"]\n\ndef filter_errors(records):\n    for r in records:\n        if r.startswith("ERROR:"):\n            yield r\n\ndef clean_messages(records):\n    for r in records:\n        yield r.replace("ERROR: ", "").upper()\n\npipeline = clean_messages(filter_errors(logs))\nfor err in pipeline:\n    print("Alert:", err)`,
            expectedOutput: `Alert: DB TIMEOUT\nAlert: PORT BUSY`
          }
        }
      ],
      practiceChallenge: {
        title: 'Build a Windowed Batching Generator',
        instructions: [
          'Write a generator function `batch(iterable, size)`.',
          'Yield lists of items up to `size` elements each.',
          'Yield the final partial batch if items remain.'
        ],
        starterCode: `def batch(iterable, size):\n    # TODO: implement batching generator\n    pass\n\nfor b in batch(range(7), 3):\n    print(b)`,
        solutionCode: `def batch(iterable, size):\n    chunk = []\n    for item in iterable:\n        chunk.append(item)\n        if len(chunk) == size:\n            yield chunk\n            chunk = []\n    if chunk:\n        yield chunk\n\nfor b in batch(range(7), 3):\n    print(b)`,
        hints: ['Accumulate items in chunk; yield and reset when len(chunk) == size']
      },
      keyTakeaways: [
        'Iterables implement __iter__; iterators implement __next__ and __iter__.',
        'yield pauses function execution, maintaining local frame state.',
        'Generators enable infinite sequences with O(1) memory footprint.',
        'yield from transparently connects callers to subgenerators.'
      ]
    }
  ],
  quiz: {
    id: 'quiz-w3',
    weekNumber: 3,
    title: 'Week 3 Qualifying Exam: OOP & Advanced Architecture',
    description: 'Score 80% or higher to unlock Week 4: Concurrency, Asyncio & Production Engineering.',
    passingScorePercent: 80,
    questions: [
      {
        id: 'q3-1',
        question: 'Which method in Python is the actual object constructor responsible for allocating memory before state initialization?',
        options: ['__init__', '__new__', '__allocate__', '__build__'],
        correctIndex: 1,
        explanation: '__new__ is the static constructor method that allocates memory and returns a fresh instance. __init__ merely initializes state on an already created instance.'
      },
      {
        id: 'q3-2',
        question: 'What is the primary architectural purpose of the C3 Linearization Algorithm in Python?',
        options: [
          'To compress bytecode files into .pyc binaries',
          'To compute a deterministic, monotonic Method Resolution Order (MRO) for multiple inheritance',
          'To optimize garbage collection cycles for cyclic references',
          'To convert dynamically typed functions into static C extensions'
        ],
        correctIndex: 1,
        explanation: 'C3 Linearization guarantees a deterministic, monotonic Method Resolution Order preserving subclass precedence and local declaration order across multiple inheritance diamond hierarchies.'
      },
      {
        id: 'q3-3',
        question: 'What happens to the internal memory layout of an instance when a class defines `__slots__ = ("x", "y")`?',
        options: [
          'The class becomes read-only and immutable',
          'The __dict__ hash table is eliminated and attributes are stored in a compact pointer array',
          'All attributes are stored in a shared global class dictionary',
          'Attributes x and y are converted to 64-bit C floats'
        ],
        correctIndex: 1,
        explanation: '__slots__ disables the default instance __dict__, saving substantial memory by storing attributes in fixed-offset C pointer slots.'
      },
      {
        id: 'q3-4',
        question: 'In the Descriptor protocol, which condition defines a "Data Descriptor"?',
        options: [
          'Defining both __get__ and __set__ (or __delete__)',
          'Defining only __get__ without any other dunders',
          'Inheriting directly from dataclasses.Field',
          'Implementing the __call__ magic method'
        ],
        correctIndex: 0,
        explanation: 'A Data Descriptor defines both __get__ and __set__ (and/or __delete__). Data descriptors take precedence over the instance dictionary during attribute lookup.'
      },
      {
        id: 'q3-5',
        question: 'Why does a generator expression `(x * 2 for x in range(1_000_000))` consume virtually identical memory to `(x * 2 for x in range(10))`?',
        options: [
          'Because Python caches all integer values in a global table',
          'Because generators evaluate lazily on-demand without storing the entire sequence in memory',
          'Because range() allocates in CPU registers instead of heap memory',
          'Because the Python compiler optimizes generator expressions to C while-loops'
        ],
        correctIndex: 1,
        explanation: 'Generators yield values on-the-fly and preserve only the current frame state, achieving constant O(1) memory consumption regardless of stream length.'
      }
    ]
  }
};
