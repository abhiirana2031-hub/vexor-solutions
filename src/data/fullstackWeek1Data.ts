import { WeekModule } from '../types/course';

export const FULLSTACK_WEEK_1_MODULE: WeekModule = {
  weekNumber: 1,
  title: 'Web Fundamentals, HTML5, CSS3 & Git/GitHub from Scratch',
  theme: 'Basics, Core Web Architecture & Version Control',
  description:
    'Master how the Internet and browser engines operate, semantic HTML5 structure, modern CSS styling with Flexbox and Grid, essential JavaScript programming from zero, and professional Git/GitHub version control workflows.',
  conceptImage: 'https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?auto=format&fit=crop&w=1200&q=80',
  imageAlt: 'Web development code editor and terminal workspace',
  days: [
    {
      id: 'fs-w1-d1',
      dayNumber: 1,
      weekNumber: 1,
      title: 'How the Web Works & Semantic HTML5',
      subtitle: 'Client-server architecture, HTTP requests, DNS resolution, and accessible markup',
      durationMinutes: 45,
      overview:
        'Understand the mechanics of the web: how URLs resolve via DNS, the HTTP request/response cycle, how browsers parse HTML into a DOM tree, and how to write clean, accessible, semantic HTML5.',
      topics: [
        {
          id: 'fs-w1-d1-t1',
          topicNumber: 1,
          title: 'The HTTP Request & Response Cycle',
          explanation: [
            'Every interaction on the web begins with a client (browser) sending an HTTP request to a server.',
            'The server processes the request (routing, database queries, business logic) and returns an HTTP response containing a status code (e.g., 200 OK, 404 Not Found), headers, and a body (HTML, JSON, or binary data).'
          ],
          keyRules: [
            'Client initiates, server responds (stateless protocol).',
            'Headers contain metadata such as Content-Type, Authorization, and Cache-Control.',
            'HTTP/2 and HTTP/3 multiplex requests over single persistent TCP/QUIC connections.'
          ],
          codeSnippet: {
            id: 'fs-t1-c1',
            title: 'Anatomy of an HTTP Request & Response',
            description: 'Standard HTTP/1.1 message structure sent across the network.',
            language: 'bash',
            code: `# Client sends GET Request
GET /api/v1/students HTTP/1.1
Host: api.academy.io
User-Agent: Mozilla/5.0
Accept: application/json

# Server returns HTTP Response
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 58

{"status": "success", "data": [{"id": 1, "name": "Alex"}]}`,
            expectedOutput: 'HTTP/1.1 200 OK'
          },
          pitfall: 'Do not assume HTTP is secure by default; unencrypted HTTP traffic can be intercepted. Always enforce HTTPS (TLS encryption on port 443).',
          quickCheck: {
            question: 'What HTTP status code indicates that a requested resource was successfully created on the server?',
            options: ['200 OK', '201 Created', '204 No Content', '301 Moved Permanently'],
            correctIndex: 1,
            explanation: 'HTTP 201 Created explicitly indicates that the request succeeded and resulted in a new resource being created.'
          }
        },
        {
          id: 'fs-w1-d1-t2',
          topicNumber: 2,
          title: 'DNS Resolution: From Domain Name to IP Address',
          explanation: [
            'Humans remember domain names (like google.com), but network routers communicate using numeric IP addresses (like 142.250.190.46).',
            'The Domain Name System (DNS) acts as the phonebook of the internet, traversing recursive resolvers, root servers, TLD servers, and authoritative nameservers to resolve an IP.'
          ],
          keyRules: [
            'DNS lookups are cached aggressively by browsers, OS resolvers, and ISPs using TTL (Time To Live).',
            'A records map domains to IPv4 addresses; AAAA records map to IPv6 addresses; CNAME creates aliases.'
          ],
          codeSnippet: {
            id: 'fs-t1-c2',
            title: 'DNS Lookup Inspection with Dig',
            description: 'Inspecting DNS query resolution records in bash.',
            language: 'bash',
            code: `# Query the A records for fullstackacademy.dev
dig fullstackacademy.dev +short

# Query Authoritative Nameservers
dig fullstackacademy.dev NS +noall +answer`,
            expectedOutput: 'Resolves IP address in milliseconds'
          },
          pitfall: 'Forgetting to configure both root domain (example.com) and subdomain (www.example.com) can cause users to get connection errors.',
          quickCheck: {
            question: 'Which DNS record type is used to map a domain directly to an IPv4 address?',
            options: ['CNAME Record', 'A Record', 'MX Record', 'TXT Record'],
            correctIndex: 1,
            explanation: 'An A record (Address record) directly maps a hostname to a 32-bit IPv4 address.'
          }
        },
        {
          id: 'fs-w1-d1-t3',
          topicNumber: 3,
          title: 'Document Structure & <!DOCTYPE html>',
          explanation: [
            'The `<!DOCTYPE html>` declaration informs browser rendering engines that the document adheres to modern HTML5 standards, preventing Quirks Mode.',
            'Every HTML document requires `<html lang="en">`, a `<head>` containing metadata/charset/viewport, and a `<body>` containing visible rendered elements.'
          ],
          codeSnippet: {
            id: 'fs-t1-c3',
            title: 'Modern HTML5 Document Template',
            description: 'The standard boilerplate for all production web applications.',
            language: 'html',
            code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Modern Web Application</title>
  </head>
  <body>
    <h1>Welcome to Full Stack Engineering</h1>
  </body>
</html>`,
            expectedOutput: 'Rendered web page with proper responsive viewport meta tag'
          },
          pitfall: 'Omitting the `viewport` meta tag will cause mobile devices to render the desktop viewport scaled down to microscopic size.',
          quickCheck: {
            question: 'Why is the viewport meta tag essential in modern web development?',
            options: [
              'It loads external CSS stylesheets',
              'It instructs mobile browsers how to control the page dimensions and scaling',
              'It defines the document character encoding',
              'It sets the title bar text'
            ],
            correctIndex: 1,
            explanation: 'The viewport meta tag ensures responsive rendering by setting the width to the device width and initial zoom to 1.0.'
          }
        },
        {
          id: 'fs-w1-d1-t4',
          topicNumber: 4,
          title: 'Semantic HTML5 Structural Tags',
          explanation: [
            'Semantic HTML uses tags that convey the meaning of the content, rather than generic `<div>` containers.',
            'Tags like `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, and `<footer>` improve accessibility (screen readers), SEO, and code maintainability.'
          ],
          codeSnippet: {
            id: 'fs-t1-c4',
            title: 'Semantic Page Layout',
            description: 'Clean semantic structure for a landing page.',
            language: 'html',
            code: `<header>
  <nav aria-label="Main Navigation">
    <a href="/">Home</a>
    <a href="/courses">Courses</a>
  </nav>
</header>
<main>
  <article>
    <h2>Understanding HTTP Protocols</h2>
    <p>HTTP/3 leverages QUIC over UDP for zero-RTT handshakes.</p>
  </article>
</main>
<footer>
  <p>&copy; 2026 Full Stack Academy</p>
</footer>`,
            expectedOutput: 'Accessible document landmark hierarchy'
          },
          pitfall: 'Avoid using multiple `<main>` tags in a single document; there should be exactly one visible `<main>` element per page.',
          quickCheck: {
            question: 'Which tag should contain the primary, dominant content of a document?',
            options: ['<section>', '<main>', '<article>', '<div>'],
            correctIndex: 1,
            explanation: '<main> represents the dominant, unique content of the body of a document.'
          }
        },
        {
          id: 'fs-w1-d1-t5',
          topicNumber: 5,
          title: 'Forms, Form Controls & Input Types',
          explanation: [
            'HTML forms are the primary mechanism for collecting user input to transmit to a backend server.',
            'HTML5 provides specialized input types like `email`, `password`, `number`, `tel`, and `date`, along with built-in client-side validation attributes like `required`, `pattern`, `min`, and `max`.'
          ],
          codeSnippet: {
            id: 'fs-t1-c5',
            title: 'Accessible User Registration Form',
            description: 'Form with explicit labels, validation attributes, and method attributes.',
            language: 'html',
            code: `<form action="/api/register" method="POST">
  <div>
    <label for="user-email">Email Address</label>
    <input type="email" id="user-email" name="email" required autocomplete="email" />
  </div>
  <div>
    <label for="user-pass">Password (Min 8 chars)</label>
    <input type="password" id="user-pass" name="password" minlength="8" required />
  </div>
  <button type="submit">Create Account</button>
</form>`,
            expectedOutput: 'Accessible form submitting POST payload to /api/register'
          },
          pitfall: 'Never omit the `for` attribute on `<label>` pointing to the `<input id="...">`; screen reader users rely on this connection.',
          quickCheck: {
            question: 'What is the purpose of tying a <label for="xyz"> to an input with id="xyz"?',
            options: [
              'It automatically submits the form',
              'It associates the text label with the form control for accessibility and click-focusing',
              'It hides the input field on mobile',
              'It styles the input with a border'
            ],
            correctIndex: 1,
            explanation: 'Associating label for and input id provides critical accessibility context and expands the clickable hit target.'
          }
        },
        {
          id: 'fs-w1-d1-t6',
          topicNumber: 6,
          title: 'Images, Media & Picture Elements for Responsive Art Direction',
          explanation: [
            'High-performance web applications must deliver optimized imagery to reduce page weight and First Contentful Paint (FCP).',
            'Use the `loading="lazy"` attribute, `alt` text for screen readers, and `<picture>` with `<source srcset="...">` for modern WebP/AVIF formats and responsive breakpoints.'
          ],
          codeSnippet: {
            id: 'fs-t1-c6',
            title: 'Responsive Picture Element with Modern Formats',
            description: 'Serving next-gen AVIF and WebP with fallback JPG.',
            language: 'html',
            code: `<picture>
  <source srcset="/hero-large.avif" type="image/avif" media="(min-width: 1024px)" />
  <source srcset="/hero-large.webp" type="image/webp" media="(min-width: 1024px)" />
  <img src="/hero-fallback.jpg" alt="Developer coding in dark modern editor" width="1200" height="600" loading="lazy" />
</picture>`,
            expectedOutput: 'Browser chooses optimal image format and dimensions'
          },
          pitfall: 'Never leave the `alt` attribute blank or missing on informative images; omit it only or use alt="" for purely decorative graphics.',
          quickCheck: {
            question: 'What does the loading="lazy" attribute on an <img> tag do?',
            options: [
              'Downscales the image resolution',
              'Defers loading until the image approaches the user viewport',
              'Converts PNGs to JPEGs',
              'Displays a loading spinner'
            ],
            correctIndex: 1,
            explanation: 'loading="lazy" defers off-screen image fetching until the user scrolls near it, saving bandwidth and speed.'
          }
        },
        {
          id: 'fs-w1-d1-t7',
          topicNumber: 7,
          title: 'The Browser Critical Rendering Path & DOM Tree',
          explanation: [
            'When the browser downloads HTML bytes, it converts them: Bytes -> Characters -> Tokens -> Nodes -> DOM (Document Object Model) Tree.',
            'Concurrently, CSS is parsed into the CSSOM (CSS Object Model). The DOM and CSSOM combine into the Render Tree, which undergoes Layout (Reflow) and Paint.'
          ],
          codeSnippet: {
            id: 'fs-t1-c7',
            title: 'Inspecting DOM Nodes via JavaScript',
            description: 'Querying and inspecting the DOM tree created by the HTML parser.',
            language: 'javascript',
            code: `// The DOM tree is exposed via window.document
console.log('Document Title:', document.title);

// Querying elements by selector
const heading = document.querySelector('h1');
console.log('Main Heading text:', heading?.textContent);
console.log('Child nodes count:', document.body.childNodes.length);`,
            expectedOutput: 'Document Title: Modern Web Application\nChild nodes count: 3'
          },
          pitfall: 'Placing synchronous `<script>` tags in the `<head>` blocks DOM parsing. Use `defer` or `type="module"` to unblock page rendering.',
          quickCheck: {
            question: 'Which phase combines the DOM and CSSOM to determine which visible elements to render?',
            options: ['DNS Resolution', 'Render Tree Construction', 'TCP 3-way Handshake', 'Compilation'],
            correctIndex: 1,
            explanation: 'The Render Tree combines DOM and CSSOM, omitting non-visible elements (like <head> or display:none).'
          }
        },
        {
          id: 'fs-w1-d1-t8',
          topicNumber: 8,
          title: 'Web Accessibility (a11y) & WCAG Core Guidelines',
          explanation: [
            'Accessible websites can be navigated by everyone, including people using screen readers, keyboard-only navigation, or voice controls.',
            'Follow WCAG principles: Perceivable, Operable, Understandable, and Robust (POUR). Ensure proper color contrast (minimum 4.5:1 for normal text) and visible keyboard focus rings.'
          ],
          codeSnippet: {
            id: 'fs-t1-c8',
            title: 'Accessible Button with ARIA State',
            description: 'Accessible button with aria-expanded state for dropdown toggle.',
            language: 'html',
            code: `<button 
  type="button" 
  aria-expanded="false" 
  aria-controls="menu-dropdown" 
  id="menu-btn"
  class="focus:ring-2 focus:ring-blue-500 focus:outline-none">
  Toggle Navigation Menu
</button>

<ul id="menu-dropdown" hidden>
  <li><a href="/profile">User Profile</a></li>
  <li><a href="/settings">Account Settings</a></li>
</ul>`,
            expectedOutput: 'Accessible interactive widget with programmatic focus states'
          },
          pitfall: 'Do not replace native `<button>` elements with clickable `<div>` elements without adding tabindex, keydown listeners, and role="button". Always prefer native elements.',
          quickCheck: {
            question: 'What is the minimum WCAG AA contrast ratio required for normal body text against its background?',
            options: ['2.0:1', '3.0:1', '4.5:1', '7.0:1'],
            correctIndex: 2,
            explanation: 'WCAG 2.1 AA mandates a minimum contrast ratio of 4.5:1 for standard body text (3:1 for large text).'
          }
        }
      ],
      practiceChallenge: {
        title: 'Build a Fully Accessible Semantic Profile Card',
        instructions: [
          'Create an accessible HTML5 document structure with header, main, and footer landmarks.',
          'Build an article card with an avatar <img> with lazy loading and alt text.',
          'Include a contact form with email and message inputs and associated labels.'
        ],
        starterCode: `<!-- Write your semantic profile card markup here -->
<article class="profile-card">
  <!-- Add header, image, body, and contact form -->
</article>`,
        solutionCode: `<article class="profile-card">
  <header>
    <img src="/avatar.jpg" alt="Devon Lane - Senior Full Stack Engineer" width="100" height="100" loading="lazy" />
    <h2>Devon Lane</h2>
    <p>Full Stack Engineer</p>
  </header>
  <main>
    <p>Passionate about React, Node.js, distributed databases, and high-performance web systems.</p>
    <form action="/contact" method="POST">
      <label for="msg">Quick Note:</label>
      <input type="text" id="msg" name="message" required />
      <button type="submit">Send Message</button>
    </form>
  </main>
</article>`,
        hints: [
          'Remember to wrap the avatar inside a header or figure with descriptive alt text.',
          'Ensure the label has a "for" attribute matching the input "id".'
        ]
      },
      keyTakeaways: [
        'Web browsing follows a continuous HTTP request/response cycle resolved through hierarchical DNS.',
        'Semantic HTML elements give structural meaning, improving SEO, maintainability, and accessibility.',
        'Accessible forms require explicit <label for="..."> associations and native input type constraints.'
      ]
    },
    {
      id: 'fs-w1-d2',
      dayNumber: 2,
      weekNumber: 1,
      title: 'Modern CSS3 Box Model, Cascade & Selectors',
      subtitle: 'Box sizing, specificity wars, modern reset, and typography hierarchy',
      durationMinutes: 50,
      overview:
        'Master the fundamental layout mechanics of CSS: the box model (content, padding, border, margin), specificity rules, the cascade, and fluid typography.',
      topics: [
        {
          id: 'fs-w1-d2-t1',
          topicNumber: 1,
          title: 'The CSS Box Model & box-sizing: border-box',
          explanation: [
            'Every HTML element is rendered as a rectangular box composed of four layers: Content, Padding, Border, and Margin.',
            'By default (`content-box`), adding padding and borders increases the total width of an element. Using `box-sizing: border-box` makes width include padding and border, preventing unexpected layout overflows.'
          ],
          codeSnippet: {
            id: 'fs-t2-c1',
            title: 'Universal Border-Box CSS Reset',
            description: 'The standard box-sizing rule adopted across all modern web apps.',
            language: 'css',
            code: `/* Standard modern CSS reset */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.card {
  width: 320px;
  padding: 24px;
  border: 2px solid #3b82f6;
  margin: 16px;
  /* With border-box, total rendered width is strictly 320px! */
}`,
            expectedOutput: 'Total element rendered width stays exactly 320px'
          },
          pitfall: 'Without box-sizing: border-box, a 100% width container with 20px padding will exceed 100% and create horizontal scrollbars.',
          quickCheck: {
            question: 'With box-sizing: border-box, if an element has width: 200px and padding: 20px on each side, what is its total outer width?',
            options: ['240px', '220px', '200px', '160px'],
            correctIndex: 2,
            explanation: 'With border-box, padding is absorbed inside the declared width, so the outer width remains exactly 200px.'
          }
        },
        {
          id: 'fs-w1-d2-t2',
          topicNumber: 2,
          title: 'Margin Collapsing & How to Prevent It',
          explanation: [
            'In standard block formatting contexts, adjoining vertical margins (top and bottom) collapse into a single margin equal to the largest of the two.',
            'Horizontal margins never collapse. Margin collapsing can be prevented by adding padding, borders, flex/grid containers, or `overflow: hidden`.'
          ],
          codeSnippet: {
            id: 'fs-t2-c2',
            title: 'Observing and Preventing Margin Collapse',
            description: 'Demonstration of collapsing vs isolated margins.',
            language: 'css',
            code: `/* Adjacent margins collapse */
h1 { margin-bottom: 30px; }
p  { margin-top: 20px; }
/* The gap between h1 and p is max(30, 20) = 30px, NOT 50px */

/* Prevent collapse by using a flex column container */
.container {
  display: flex;
  flex-direction: column;
  gap: 20px; /* Modern gap property eliminates margin collapse bugs */
}`,
            expectedOutput: 'Modern flex container gap provides deterministic spacing'
          },
          pitfall: 'Do not use negative margins to counter margin collapse; prefer parent `gap` or padding.',
          quickCheck: {
            question: 'Do horizontal margins (left and right) collapse in standard CSS layout?',
            options: ['Yes, always', 'No, only vertical margins collapse', 'Only inside tables', 'Yes, on mobile devices'],
            correctIndex: 1,
            explanation: 'Margin collapsing applies exclusively to vertical margins between adjoining block-level boxes.'
          }
        },
        {
          id: 'fs-w1-d2-t3',
          topicNumber: 3,
          title: 'Specificity: Calculating Selector Weight',
          explanation: [
            'When conflicting CSS rules target the same element, the browser computes specificity scores using a 3-part hierarchy: (Inline styles), (IDs), (Classes, attributes, pseudo-classes), (Elements, pseudo-elements).',
            'Specificity determines which declaration wins the cascade regardless of source file order.'
          ],
          codeSnippet: {
            id: 'fs-t2-c3',
            title: 'Specificity Hierarchy Examples',
            description: 'Comparing selector weights and winning declarations.',
            language: 'css',
            code: `/* Specificity: (0, 0, 1) - Element */
p { color: gray; }

/* Specificity: (0, 1, 0) - Class (Wins over element) */
.intro { color: blue; }

/* Specificity: (1, 0, 0) - ID (Wins over class) */
#hero-text { color: red; }

/* Specificity: (0, 2, 1) - Two classes + one element */
nav.primary ul.menu li { font-weight: bold; }`,
            expectedOutput: 'ID (#hero-text) takes precedence over class (.intro)'
          },
          pitfall: 'Avoid sprinkling `!important` across CSS to defeat specificity. Refactor selectors or lower specificity instead.',
          quickCheck: {
            question: 'Which of the following selectors has the highest specificity?',
            options: ['body div p.lead', '.header .nav a', '#main-header nav a', 'a:hover'],
            correctIndex: 2,
            explanation: '#main-header nav a has an ID selector (1,0,2), outweighing all class or element combinations.'
          }
        },
        {
          id: 'fs-w1-d2-t4',
          topicNumber: 4,
          title: 'Pseudo-classes & Pseudo-elements',
          explanation: [
            'Pseudo-classes (single colon `:`) select elements based on state or DOM hierarchy (e.g., `:hover`, `:focus-visible`, `:nth-child(even)`).',
            'Pseudo-elements (double colon `::`) style a specific part of an element or inject decorative content (e.g., `::before`, `::after`, `::placeholder`, `::selection`).'
          ],
          codeSnippet: {
            id: 'fs-t2-c4',
            title: 'Interactive Focus States and Custom Bullets',
            description: 'Accessible focus-visible and injected pseudo-elements.',
            language: 'css',
            code: `/* Interactive button with keyboard focus outline */
button:focus-visible {
  outline: 3px solid #6366f1;
  outline-offset: 2px;
}

/* Injected decorative badge */
.badge::before {
  content: '★ ';
  color: #f59e0b;
}

/* Zebra striping table rows */
tbody tr:nth-child(even) {
  background-color: #f8fafc;
}`,
            expectedOutput: 'Zebra striping and keyboard accessible focus ring'
          },
          pitfall: 'Do not remove outline with `outline: none` without providing an alternative `:focus-visible` style for keyboard users.',
          quickCheck: {
            question: 'What pseudo-class triggers ONLY when a user navigates via keyboard (tabs) rather than mouse clicks?',
            options: [':hover', ':active', ':focus-visible', ':visited'],
            correctIndex: 2,
            explanation: ':focus-visible applies focus styles selectively when keyboard interaction is detected, avoiding ugly rings on mouse click.'
          }
        },
        {
          id: 'fs-w1-d2-t5',
          topicNumber: 5,
          title: 'The CSS Display Property: Block, Inline, Inline-Block & None',
          explanation: [
            '`block` elements take full available width and start on a new line (e.g. `<div>`, `<p>`).',
            '`inline` elements flow with text; their width and height cannot be set, and vertical margins are ignored (e.g. `<span>`, `<a>`). `inline-block` flows inline while respecting width and height.'
          ],
          codeSnippet: {
            id: 'fs-t2-c5',
            title: 'Comparing Display Values',
            description: 'Controlling layout behavior with display modes.',
            language: 'css',
            code: `.block-box {
  display: block;
  width: 100%;
}

.inline-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 9999px;
  background: #e0e7ff;
  color: #3730a3;
}

.hidden-item {
  display: none; /* Removed from visual render and accessibility tree */
}`,
            expectedOutput: 'Inline-block respects padding and radius while flowing inline'
          },
          pitfall: '`display: none` completely hides elements from screen readers. Use visually-hidden utility classes if content should remain accessible to screen readers.',
          quickCheck: {
            question: 'Can you set a custom height and width on a standard display: inline element?',
            options: ['Yes, always', 'No, inline elements ignore width and height', 'Only in Chrome', 'Only if float is set'],
            correctIndex: 1,
            explanation: 'Standard inline elements flow with text and ignore explicit width and height. Use inline-block or block instead.'
          }
        },
        {
          id: 'fs-w1-d2-t6',
          topicNumber: 6,
          title: 'CSS Positioning: Static, Relative, Absolute, Fixed & Sticky',
          explanation: [
            '`position: static` is the default document flow.',
            '`position: relative` offsets an element relative to its normal position and establishes a containing block for `absolute` children.',
            '`position: absolute` removes the element from document flow and positions it relative to its closest positioned ancestor.',
            '`position: sticky` toggles between relative and fixed based on scroll offset.'
          ],
          codeSnippet: {
            id: 'fs-t2-c6',
            title: 'Sticky Header with Absolute Close Button',
            description: 'Practical relative, sticky, and absolute combination.',
            language: 'css',
            code: `/* Sticky navigation bar stays at top of screen */
header.sticky-nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
}

/* Card containing absolute positioned badge */
.card-container {
  position: relative; /* Anchor for absolute children */
  padding: 24px;
}

.card-container .notification-dot {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ef4444;
}`,
            expectedOutput: 'Sticky header sticks to viewport and red dot pins to top-right corner'
          },
          pitfall: '`position: sticky` will fail to stick if any parent ancestor has `overflow: hidden` or lacks explicit height boundaries.',
          quickCheck: {
            question: 'An element with position: absolute is positioned relative to what?',
            options: [
              'Always the browser window',
              'Its nearest ancestor that has a position other than static',
              'Its nearest sibling',
              'The root html element only'
            ],
            correctIndex: 1,
            explanation: 'position: absolute searches up the DOM tree for the nearest ancestor with position relative, absolute, fixed, or sticky.'
          }
        },
        {
          id: 'fs-w1-d2-t7',
          topicNumber: 7,
          title: 'Fluid Typography with clamp() & rem Units',
          explanation: [
            'Using `rem` (root em) units respects user browser font preferences, unlike fixed `px`. 1rem equals the root font size (default 16px).',
            'Modern fluid typography uses `clamp(min, preferred, max)` to smoothly scale font sizes across mobile and desktop without endless media query breakpoints.'
          ],
          codeSnippet: {
            id: 'fs-t2-c7',
            title: 'Fluid Font Sizing with clamp()',
            description: 'Scales headline smoothly from 1.75rem (28px) on mobile to 3rem (48px) on desktop.',
            language: 'css',
            code: `/* Fluid responsive heading */
h1.hero-title {
  /* clamp(minimum, preferred viewport scale, maximum) */
  font-size: clamp(1.75rem, 1.25rem + 2.5vw, 3rem);
  line-height: 1.15;
  letter-spacing: -0.02em;
  font-weight: 800;
}

p.body-text {
  font-size: 1.125rem; /* 18px */
  line-height: 1.6;
}`,
            expectedOutput: 'Smooth continuous typographic scaling across any screen width'
          },
          pitfall: 'Never set font-size on `html` or `body` using `px`, as it overrides the user accessibility preferences set in browser settings.',
          quickCheck: {
            question: 'What is the base reference size for 1rem in standard browser default settings?',
            options: ['12px', '14px', '16px', '20px'],
            correctIndex: 2,
            explanation: 'By standard convention across all web browsers, 1rem equals 16px by default.'
          }
        },
        {
          id: 'fs-w1-d2-t8',
          topicNumber: 8,
          title: 'CSS Transitions, Transforms & Hardware Acceleration',
          explanation: [
            'CSS `transform` (translate, scale, rotate) and `opacity` are rendered on the GPU (compositor thread) without triggering expensive layout reflows or repaints.',
            'Transitions smoothly interpolate property changes over a specified duration with timing curves (ease-in-out, cubic-bezier).'
          ],
          codeSnippet: {
            id: 'fs-t2-c8',
            title: 'High-Performance 60fps Button Hover Effect',
            description: 'Smooth hardware-accelerated button elevation on hover.',
            language: 'css',
            code: `.interactive-btn {
  background-color: #4f46e5;
  color: #ffffff;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  /* Animate only transform and opacity for buttery 60fps performance */
  transition: transform 180ms ease, box-shadow 180ms ease;
  will-change: transform;
}

.interactive-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);
}

.interactive-btn:active {
  transform: translateY(0);
}`,
            expectedOutput: 'Smooth elevation on hover and tactile depress on click'
          },
          pitfall: 'Animating layout properties like `top`, `left`, `width`, or `height` causes continuous CPU recalculation (reflow) and causes stuttery frame drops.',
          quickCheck: {
            question: 'Which two CSS properties are handled by the GPU compositor and provide the best animation performance?',
            options: ['width and height', 'margin and padding', 'transform and opacity', 'top and left'],
            correctIndex: 2,
            explanation: 'transform and opacity do not trigger layout or paint cycles, executing directly on the GPU compositor.'
          }
        }
      ],
      practiceChallenge: {
        title: 'Build a Sticky Navigation Bar with Fluid Hero Typography',
        instructions: [
          'Create a sticky header with a blur backdrop and z-index 50.',
          'Define a universal border-box reset.',
          'Style a fluid hero headline using clamp().',
          'Add a button with GPU-accelerated hover elevation.'
        ],
        starterCode: `/* Write your CSS layout here */
.nav-header {
  /* sticky styles */
}
.hero-heading {
  /* clamp typography */
}`,
        solutionCode: `*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.nav-header {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #e2e8f0;
}

.hero-heading {
  font-size: clamp(2rem, 1.5rem + 3vw, 4rem);
  line-height: 1.1;
  font-weight: 800;
  color: #0f172a;
}

.cta-button {
  transition: transform 150ms ease, box-shadow 150ms ease;
}
.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}`,
        hints: [
          'Use position: sticky along with top: 0 to lock the header at the top of the viewport.',
          'clamp(min, val, max) expects 3 comma-separated parameters.'
        ]
      },
      keyTakeaways: [
        'Universal box-sizing: border-box is mandatory for predictable sizing across responsive layouts.',
        'Specificity follows inline > IDs > classes/pseudo-classes > elements; avoid !important.',
        'Animate transform and opacity instead of width, height, or top/left for 60fps GPU performance.'
      ]
    },
    {
      id: 'fs-w1-d3',
      dayNumber: 3,
      weekNumber: 1,
      title: 'Modern Layouts: Flexbox Deep-Dive & Responsive UI',
      subtitle: 'Main vs cross axis, alignment, flex grow/shrink/basis, and mobile-first design',
      durationMinutes: 50,
      overview:
        'Master CSS Flexbox: 1-dimensional layout model controlling alignment, spacing, distribution, and wrapping of UI components.',
      topics: [
        {
          id: 'fs-w1-d3-t1',
          topicNumber: 1,
          title: 'The Two Axes: Main Axis vs Cross Axis',
          explanation: [
            'Flexbox operates along two perpendicular axes: the Main Axis (defined by `flex-direction`) and the Cross Axis (perpendicular to main axis).',
            'When `flex-direction: row` (default), main axis is horizontal (left-to-right). When `flex-direction: column`, main axis is vertical (top-to-bottom).'
          ],
          codeSnippet: {
            id: 'fs-t3-c1',
            title: 'Configuring Flex Direction',
            description: 'Switching axis orientation between desktop and mobile.',
            language: 'css',
            code: `.nav-container {
  display: flex;
  flex-direction: row; /* Horizontal main axis */
}

@media (max-width: 640px) {
  .nav-container {
    flex-direction: column; /* Vertical main axis on mobile */
  }
}`,
            expectedOutput: 'Layout transitions smoothly from horizontal bar to vertical mobile stack'
          },
          pitfall: 'Confusing `justify-content` and `align-items`. Remember: `justify-content` ALWAYS aligns along the main axis; `align-items` aligns along the cross axis.',
          quickCheck: {
            question: 'If flex-direction is set to column, which property controls horizontal alignment?',
            options: ['justify-content', 'align-items', 'flex-wrap', 'order'],
            correctIndex: 1,
            explanation: 'In column mode, the cross axis is horizontal, so align-items controls horizontal alignment.'
          }
        },
        {
          id: 'fs-w1-d3-t2',
          topicNumber: 2,
          title: 'Justify-Content: Distributing Space Along the Main Axis',
          explanation: [
            '`justify-content` defines how remaining space in the flex container is distributed between and around items along the main axis.',
            'Key values include `flex-start`, `center`, `flex-end`, `space-between` (items pushed to ends), `space-around` (equal space around items), and `space-evenly`.'
          ],
          codeSnippet: {
            id: 'fs-t3-c2',
            title: 'Navbar Distribution with space-between',
            description: 'Pushes brand logo to left edge and navigation links to right edge.',
            language: 'css',
            code: `.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
}

.brand { font-weight: bold; }
.links { display: flex; gap: 16px; }`,
            expectedOutput: 'Brand logo on far left and links on far right with zero manual margins'
          },
          pitfall: 'Do not use `float: right` or heavy margins to push navbar items apart; `justify-content: space-between` solves this cleanly.',
          quickCheck: {
            question: 'Which justify-content value places equal space between items with the first and last items flush against the container edges?',
            options: ['space-around', 'space-between', 'space-evenly', 'center'],
            correctIndex: 1,
            explanation: 'space-between puts maximum space between elements, pinning edge items directly to the boundaries.'
          }
        },
        {
          id: 'fs-w1-d3-t3',
          topicNumber: 3,
          title: 'Align-Items & Perfect Centering in CSS',
          explanation: [
            'For decades, vertical centering in CSS was notoriously difficult. With Flexbox, perfect horizontal and vertical centering requires just two properties: `justify-content: center` and `align-items: center`.',
            '`align-items` values include `stretch` (default), `center`, `flex-start`, `flex-end`, and `baseline`.'
          ],
          codeSnippet: {
            id: 'fs-t3-c3',
            title: 'The Legendary Perfect Centering Container',
            description: 'Flawlessly centers any child both vertically and horizontally.',
            language: 'css',
            code: `.hero-modal {
  display: flex;
  justify-content: center; /* Main axis center */
  align-items: center;     /* Cross axis center */
  min-height: 100vh;
}

.modal-content {
  max-width: 480px;
  padding: 32px;
  border-radius: 12px;
  background: #ffffff;
}`,
            expectedOutput: 'Card is perfectly centered in viewport regardless of screen size'
          },
          pitfall: 'If the container does not have a defined height (e.g., `min-height: 100vh`), `align-items: center` will only center within the container current shrink-wrapped height.',
          quickCheck: {
            question: 'What is the default value of align-items in a flex container?',
            options: ['center', 'flex-start', 'stretch', 'baseline'],
            correctIndex: 2,
            explanation: 'The default is stretch, making items expand to fill the entire cross-axis height of the tallest item.'
          }
        },
        {
          id: 'fs-w1-d3-t4',
          topicNumber: 4,
          title: 'Flex Item Sizing: flex-grow, flex-shrink & flex-basis',
          explanation: [
            'The shorthand `flex: <grow> <shrink> <basis>` is the core engine of flexible layouts.',
            '`flex-grow` defines ability to expand into free space; `flex-shrink` defines ability to shrink when space is restricted; `flex-basis` defines initial size before free space is distributed.'
          ],
          codeSnippet: {
            id: 'fs-t3-c4',
            title: 'Sidebar and Main Content Sizing',
            description: 'Fixed-width sidebar with fluid expanding main workspace.',
            language: 'css',
            code: `.dashboard {
  display: flex;
}

.sidebar {
  /* flex: grow shrink basis */
  flex: 0 0 260px; /* Never grow, never shrink, always exactly 260px */
}

.main-content {
  flex: 1 1 0%;    /* Grow to fill all remaining space, shrink if needed */
  min-width: 0;    /* Essential fix for flex overflow issues */
}`,
            expectedOutput: 'Sidebar stays fixed at 260px while main workspace fills remaining width'
          },
          pitfall: 'Always set `min-width: 0` on flex items containing text or code blocks; otherwise, unbreakable text will force the item to expand past the screen edge.',
          quickCheck: {
            question: 'What does flex: 1 1 0% mean?',
            options: [
              'Element cannot grow or shrink',
              'Element grows and shrinks proportionally starting from 0 base size to fill free space',
              'Element is hidden',
              'Element width is fixed at 1px'
            ],
            correctIndex: 1,
            explanation: 'flex: 1 1 0% allows elements to expand and contract equally to divide available space.'
          }
        },
        {
          id: 'fs-w1-d3-t5',
          topicNumber: 5,
          title: 'Flex Wrapping & Multi-Row Cards',
          explanation: [
            'By default, flex items attempt to squeeze onto a single line (`flex-wrap: nowrap`).',
            'Enabling `flex-wrap: wrap` permits items that exceed the row width to flow cleanly onto subsequent lines, perfect for responsive card grids.'
          ],
          codeSnippet: {
            id: 'fs-t3-c5',
            title: 'Responsive Flex Card Grid with Gap',
            description: 'Cards wrap naturally as viewport shrinks without media queries.',
            language: 'css',
            code: `.card-deck {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.card-item {
  flex: 1 1 280px; /* Each card is at least 280px, but expands if space remains */
  background: #f8fafc;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}`,
            expectedOutput: '3 cards on desktop, 2 on tablet, 1 stacked on mobile automatically'
          },
          pitfall: 'Do not use margin tricks on cards to fake gap; the `gap: 20px` property natively applies spacing between items and between rows.',
          quickCheck: {
            question: 'What property enables flex items to break onto multiple rows when they run out of horizontal space?',
            options: ['flex-direction: column', 'flex-wrap: wrap', 'overflow: scroll', 'align-content: stretch'],
            correctIndex: 1,
            explanation: 'flex-wrap: wrap permits items to wrap onto new lines when the container width is exhausted.'
          }
        },
        {
          id: 'fs-w1-d3-t6',
          topicNumber: 6,
          title: 'Align-Self & Order Overrides',
          explanation: [
            '`align-self` allows an individual flex item to override the container `align-items` rule.',
            '`order` allows visual reordering of items without altering the underlying HTML DOM structure (crucial for responsive design).'
          ],
          codeSnippet: {
            id: 'fs-t3-c6',
            title: 'Overriding Alignment on Individual Items',
            description: 'Pinning an individual badge to the bottom while other items center.',
            language: 'css',
            code: `.banner {
  display: flex;
  align-items: center;
  height: 80px;
}

.banner .special-badge {
  align-self: flex-end; /* Overrides center to sit at bottom edge */
  font-size: 11px;
}

.banner .avatar {
  order: -1; /* Displayed first visually regardless of DOM position */
}`,
            expectedOutput: 'Targeted flex item overrides container cross-axis alignment'
          },
          pitfall: 'Do not misuse `order` to fix flawed HTML; screen readers read the DOM in source code order, which can cause confusing accessibility mismatches.',
          quickCheck: {
            question: 'Can align-self be applied to a flex container or to flex children?',
            options: ['Only to flex containers', 'Only to individual flex child items', 'Both', 'Neither'],
            correctIndex: 1,
            explanation: 'align-self is an item-level property applied to children to override the parent container align-items.'
          }
        },
        {
          id: 'fs-w1-d3-t7',
          topicNumber: 7,
          title: 'Mobile-First Media Queries & Breakpoints',
          explanation: [
            'Mobile-first responsive design writes default CSS for mobile screens first, and adds `@media (min-width: ...)` breakpoints to progressively enhance layouts for larger screens.',
            'Standard modern breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px).'
          ],
          codeSnippet: {
            id: 'fs-t3-c7',
            title: 'Mobile-First Responsive Layout',
            description: 'Progression from single column to multi-column desktop grid.',
            language: 'css',
            code: `/* Mobile default: stacked column */
.content-wrapper {
  display: flex;
  flex-direction: column;
  padding: 16px;
}

/* Tablet & Desktop: switch to side-by-side row */
@media (min-width: 768px) {
  .content-wrapper {
    flex-direction: row;
    padding: 32px;
    gap: 24px;
  }
}`,
            expectedOutput: 'Layout shifts smoothly from mobile vertical stack to desktop horizontal row'
          },
          pitfall: 'Desktop-first design (`max-width`) requires overriding heavy desktop styles on mobile devices with low CPU power; mobile-first is leaner and faster.',
          quickCheck: {
            question: 'In mobile-first design, what media query query operator is standard?',
            options: ['max-width', 'min-width', 'orientation: portrait', 'device-height'],
            correctIndex: 1,
            explanation: 'Mobile-first uses min-width so base rules apply to mobile and enhanced rules trigger as screen size increases.'
          }
        },
        {
          id: 'fs-w1-d3-t8',
          topicNumber: 8,
          title: 'Flexbox Auto-Margins: The Power of margin-left: auto',
          explanation: [
            'In a flex container, applying `margin-left: auto` to an item consumes all remaining free space on its left, pushing it and all subsequent items to the far right.',
            'This provides an elegant solution for right-aligning specific action buttons or user profile avatars inside a navbar.'
          ],
          codeSnippet: {
            id: 'fs-t3-c8',
            title: 'Pushing Nav Items using margin-left: auto',
            description: 'Pushing user avatar to right edge without splitting containers.',
            language: 'css',
            code: `.header-nav {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-link { color: #475569; }

/* Pushes the user profile avatar to the far right! */
.user-avatar-btn {
  margin-left: auto;
  border-radius: 50%;
}`,
            expectedOutput: 'Avatar snaps to far right while links stay left-aligned'
          },
          pitfall: 'Using multiple `margin-left: auto` rules divides the remaining space equally among them, which can surprise developers.',
          quickCheck: {
            question: 'What does margin-left: auto do on a flex item inside a row-based flex container?',
            options: [
              'Centers the element horizontally',
              'Consumes all available space on the left, pushing the item to the right edge',
              'Sets the left margin to 0',
              'Hides the margin'
            ],
            correctIndex: 1,
            explanation: 'margin-left: auto absorbs all available space on the left, shoving the item and any following siblings to the right.'
          }
        }
      ],
      practiceChallenge: {
        title: 'Build a Professional Responsive App Navbar',
        instructions: [
          'Create a flex container navbar with logo, 3 navigation links, and a Sign In button.',
          'Use margin-left: auto or justify-content to push the Sign In button to the far right.',
          'Ensure items are vertically centered.',
          'Wrap into a column on screens narrower than 640px.'
        ],
        starterCode: `<nav class="app-navbar">
  <div class="logo">DevApp</div>
  <a href="#features">Features</a>
  <a href="#pricing">Pricing</a>
  <a href="#docs">Docs</a>
  <button class="cta-btn">Sign In</button>
</nav>`,
        solutionCode: `<style>
.app-navbar {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px 24px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
}
.logo {
  font-weight: 800;
  font-size: 1.25rem;
  color: #1e293b;
}
.app-navbar a {
  color: #64748b;
  text-decoration: none;
}
.cta-btn {
  margin-left: auto;
  background: #2563eb;
  color: white;
  padding: 8px 18px;
  border-radius: 6px;
  border: none;
}
@media (max-width: 640px) {
  .app-navbar {
    flex-direction: column;
    align-items: flex-start;
  }
  .cta-btn {
    margin-left: 0;
    width: 100%;
  }
}
</style>`,
        hints: [
          'Use gap for spacing between links.',
          'Use margin-left: auto on .cta-btn in desktop mode.'
        ]
      },
      keyTakeaways: [
        'Flexbox is a 1-dimensional layout system governed by the Main Axis and Cross Axis.',
        'justify-content aligns along main axis; align-items aligns along cross axis.',
        'margin-left: auto is the most powerful technique for snapping items to opposite edges.'
      ]
    },
    {
      id: 'fs-w1-d4',
      dayNumber: 4,
      weekNumber: 1,
      title: 'CSS Grid, Modern Variables & Tailwind CSS Workflow',
      subtitle: '2D grid templates, minmax, auto-fit/fill, CSS custom properties, and utility-first design',
      durationMinutes: 50,
      overview:
        'Master 2-dimensional layouts with CSS Grid, understand CSS Custom Properties (CSS variables) for dynamic runtime theming, and explore the utility-first philosophy of Tailwind CSS.',
      topics: [
        {
          id: 'fs-w1-d4-t1',
          topicNumber: 1,
          title: 'CSS Grid vs Flexbox: When to Use Which',
          explanation: [
            'Flexbox is designed for 1-dimensional layouts (components laid out along a single row OR a single column).',
            'CSS Grid is designed for 2-dimensional layouts (simultaneously managing rows AND columns in a unified coordinate system).',
            'In production applications, Grid handles overall page architecture (dashboard grids, galleries), while Flexbox handles micro-components inside each grid cell (navbars, card headers).'
          ],
          codeSnippet: {
            id: 'fs-t4-c1',
            title: 'Basic 2D CSS Grid Container',
            description: 'Declaring explicit columns and rows with gap.',
            language: 'css',
            code: `.dashboard-grid {
  display: grid;
  grid-template-columns: 240px 1fr 300px; /* 3 explicit columns */
  grid-template-rows: 64px 1fr 48px;     /* Header, Main, Footer */
  gap: 16px;
  min-height: 100vh;
}`,
            expectedOutput: 'Full 3-column, 3-row structured grid layout'
          },
          pitfall: 'Do not use nested flexbox rows and columns to simulate a 2D table or card grid; CSS Grid accomplishes this with significantly cleaner code.',
          quickCheck: {
            question: 'What is the primary architectural difference between Flexbox and CSS Grid?',
            options: [
              'Flexbox is 1D (row or column), Grid is 2D (rows and columns simultaneously)',
              'Flexbox only works in Chrome',
              'CSS Grid does not support responsive design',
              'There is no difference'
            ],
            correctIndex: 0,
            explanation: 'Flexbox is designed for single-axis linear flow; CSS Grid natively aligns elements across both rows and columns.'
          }
        },
        {
          id: 'fs-w1-d4-t2',
          topicNumber: 2,
          title: 'The fr Unit & repeat() Function',
          explanation: [
            'The `fr` (fractional) unit represents a fraction of the available space in the grid container after fixed dimensions and gaps are deducted.',
            'The `repeat(count, track-size)` function avoids tedious repetition when declaring multiple identical tracks.'
          ],
          codeSnippet: {
            id: 'fs-t4-c2',
            title: 'Using repeat() and fr Units',
            description: 'Clean declaration of 12-column grid and equal 3-column grid.',
            language: 'css',
            code: `/* Equal 3-column layout: each column takes 1/3 of available space */
.three-cols {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

/* Classic 12-column responsive layout */
.twelve-col-system {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 16px;
}`,
            expectedOutput: '3 exactly equal-width columns adjusting to container width'
          },
          pitfall: 'Avoid mixing fixed pixels with `1fr` without understanding how gaps affect calculations; `1fr` always claims remaining free space.',
          quickCheck: {
            question: 'In a grid with grid-template-columns: 1fr 2fr 1fr, how much space does the middle column occupy?',
            options: ['25% of space', '50% of available space', '33% of space', '200px'],
            correctIndex: 1,
            explanation: 'Total fr = 1 + 2 + 1 = 4fr. The middle column has 2fr, which is 2/4 = 50% of available space.'
          }
        },
        {
          id: 'fs-w1-d4-t3',
          topicNumber: 3,
          title: 'The Auto-Fit / Minmax Superpower: Responsive Without Media Queries',
          explanation: [
            'One of CSS Grid greatest features is creating fully responsive card grids without a single media query.',
            'Using `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))` instructs the browser to fit as many cards as possible that are at least 280px wide, expanding them equally to fill remaining space.'
          ],
          codeSnippet: {
            id: 'fs-t4-c3',
            title: 'The Media-Query-Free Responsive Grid',
            description: 'Automatically creates 1, 2, 3, or 4 columns based on screen width.',
            language: 'css',
            code: `.responsive-card-grid {
  display: grid;
  /* Auto-fits as many columns >= 280px as will fit, expanding to 1fr */
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.card {
  background: #ffffff;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}`,
            expectedOutput: 'Automatically scales column count across all screen sizes flawlessly'
          },
          pitfall: '`auto-fit` collapses empty tracks to 0px, whereas `auto-fill` preserves empty space tracks. Use `auto-fit` for card galleries.',
          quickCheck: {
            question: 'What does minmax(250px, 1fr) specify for a grid track?',
            options: [
              'The track is between 250px and 500px',
              'The track will never shrink below 250px, but can grow to fill 1 fractional share of available space',
              'The track size is random',
              'The track requires a media query'
            ],
            correctIndex: 1,
            explanation: 'minmax sets a lower bound of 250px and an upper bound of 1fr (expanding with free space).'
          }
        },
        {
          id: 'fs-w1-d4-t4',
          topicNumber: 4,
          title: 'Grid Template Areas & Named Grid Lines',
          explanation: [
            '`grid-template-areas` provides an ASCII-art style visual syntax to layout page sections.',
            'Each child element assigns itself to an area with `grid-area: <name>`, making complex layouts exceptionally intuitive to read and modify.'
          ],
          codeSnippet: {
            id: 'fs-t4-c4',
            title: 'Named Grid Areas for App Dashboard',
            description: 'Visual layout map linking areas to CSS components.',
            language: 'css',
            code: `.app-shell {
  display: grid;
  grid-template-areas:
    "nav   nav   nav"
    "side  main  stats"
    "foot  foot  foot";
  grid-template-columns: 240px 1fr 280px;
  grid-template-rows: 64px 1fr 40px;
  min-height: 100vh;
}

.top-nav { grid-area: nav; }
.sidebar { grid-area: side; }
.main-area { grid-area: main; }
.stats-panel { grid-area: stats; }
.footer { grid-area: foot; }`,
            expectedOutput: 'Visual layout mapped directly to declared ASCII grid areas'
          },
          pitfall: 'Every row in `grid-template-areas` must define the exact same number of cells; mismatched cell counts will invalidate the entire property.',
          quickCheck: {
            question: 'In grid-template-areas, what token is used to indicate an empty cell?',
            options: ['empty', 'null', 'A period (.)', 'none'],
            correctIndex: 2,
            explanation: 'A period or series of periods (...) represents an unnamed empty cell in grid-template-areas.'
          }
        },
        {
          id: 'fs-w1-d4-t5',
          topicNumber: 5,
          title: 'CSS Custom Properties (CSS Variables) for Dynamic Theming',
          explanation: [
            'CSS Custom Properties (prefixed with `--`) allow storing reusable values in the CSS cascade.',
            'Unlike preprocessor variables (Sass), CSS variables exist in the live browser DOM, can be inherited, and can be updated dynamically via JavaScript or theme classes (`.dark`).'
          ],
          codeSnippet: {
            id: 'fs-t4-c5',
            title: 'Light & Dark Theme Variables with Fallbacks',
            description: 'Defining root theme tokens and switching via .dark class.',
            language: 'css',
            code: `:root {
  --bg-primary: #ffffff;
  --text-primary: #0f172a;
  --accent-color: #4f46e5;
  --card-border: #e2e8f0;
}

/* Dark mode token overrides */
html.dark {
  --bg-primary: #090d16;
  --text-primary: #f8fafc;
  --accent-color: #818cf8;
  --card-border: #1e293b;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
}`,
            expectedOutput: 'Theme variables switch dynamically when .dark class is toggled'
          },
          pitfall: 'Always provide fallback values in `var(--token, fallback)` to safeguard against undefined custom properties.',
          quickCheck: {
            question: 'How do you access a CSS custom property named --brand-color?',
            options: ['$--brand-color', 'var(--brand-color)', 'calc(--brand-color)', '@brand-color'],
            correctIndex: 1,
            explanation: 'var(--variable-name, fallback) is the standard CSS function to retrieve custom property values.'
          }
        },
        {
          id: 'fs-w1-d4-t6',
          topicNumber: 6,
          title: 'The Utility-First Philosophy of Tailwind CSS',
          explanation: [
            'Traditional CSS requires creating arbitrary semantic class names (`.author-card-avatar-wrapper-inner`) and constantly context-switching between HTML and CSS files.',
            'Tailwind CSS provides low-level atomic utility classes (`flex`, `p-4`, `text-center`, `rounded-xl`) that compose directly in markup, eliminating dead CSS files and naming fatigue.'
          ],
          codeSnippet: {
            id: 'fs-t4-c6',
            title: 'Composing a Profile Card with Tailwind Utilities',
            description: 'Atomic utility styling with zero custom CSS files.',
            language: 'html',
            code: `<div class="p-6 max-w-sm mx-auto bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 flex items-center gap-4">
  <div class="shrink-0 w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
    DL
  </div>
  <div>
    <div class="text-xl font-bold text-slate-900 dark:text-white">Devon Lane</div>
    <p class="text-sm text-slate-500 dark:text-slate-400">Staff Architect</p>
  </div>
</div>`,
            expectedOutput: 'Clean, responsive profile card with automatic dark-mode support'
          },
          pitfall: 'Do not recreate inline styles with arbitrary brackets `[#123456]` everywhere; leverage Tailwind standard curated color and spacing scales for design consistency.',
          quickCheck: {
            question: 'What is a key benefit of Tailwind utility-first styling over large monolithic CSS stylesheets?',
            options: [
              'No context-switching, consistent design constraints, and no unbounded CSS file growth',
              'Tailwind replaces JavaScript',
              'Tailwind only works with WordPress',
              'It disables CSS cascade'
            ],
            correctIndex: 0,
            explanation: 'Tailwind utilities keep styling co-located with markup, enforce design system tokens, and prune unused CSS.'
          }
        },
        {
          id: 'fs-w1-d4-t7',
          topicNumber: 7,
          title: 'State & Responsive Variants in Tailwind (hover:, focus:, md:)',
          explanation: [
            'Tailwind uses prefix variants to apply styles conditionally: states (`hover:`, `focus:`, `active:`, `disabled:`), breakpoints (`sm:`, `md:`, `lg:`), and themes (`dark:`).',
            'Multiple variants can be chained together (e.g., `dark:hover:bg-slate-800`).'
          ],
          codeSnippet: {
            id: 'fs-t4-c7',
            title: 'Chained State and Responsive Variants',
            description: 'Interactive button with responsive sizing and dark mode.',
            language: 'html',
            code: `<button class="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800">
  Deploy to Production
</button>`,
            expectedOutput: 'Full-width on mobile, auto-width on desktop with smooth hover state'
          },
          pitfall: 'Remember that responsive variants in Tailwind (e.g., `md:`) are mobile-first (`@media (min-width: 768px)`), not desktop-down.',
          quickCheck: {
            question: 'In Tailwind CSS, what does the prefix md: mean?',
            options: [
              'Applies styles on screens narrower than 768px',
              'Applies styles on screens 768px wide or greater (mobile-first min-width)',
              'Medium font size',
              'Medium animation speed'
            ],
            correctIndex: 1,
            explanation: 'Tailwind breakpoints are mobile-first: md: activates on screens with width >= 768px.'
          }
        },
        {
          id: 'fs-w1-d4-t8',
          topicNumber: 8,
          title: 'Color Contrast & High-Readability Light/Dark Theming',
          explanation: [
            'A common pitfall in theme switching is text disappearing into identical background shades (e.g., light text on white or dark text on dark).',
            'Always pair background and text colors explicitly: in light mode use dark text (`text-slate-900`) on bright backgrounds (`bg-white` or `bg-slate-50`); in dark mode use crisp light text (`dark:text-slate-100`) on dark backgrounds (`dark:bg-slate-900`).'
          ],
          codeSnippet: {
            id: 'fs-t4-c8',
            title: 'High-Contrast Theme-Safe Surface Card',
            description: 'Bulletproof paired colors guaranteeing WCAG AAA readability in both modes.',
            language: 'html',
            code: `<div class="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm">
  <h3 class="text-slate-900 dark:text-white font-semibold">Contrast Verified</h3>
  <p class="text-slate-600 dark:text-slate-400 mt-2">
    This secondary text maintains 5.8:1 contrast in light mode and 7.2:1 in dark mode.
  </p>
</div>`,
            expectedOutput: 'Crisp readability in both light and dark themes'
          },
          pitfall: 'Never write a bare `text-white` without a dark background or without a light mode counterpart like `text-slate-900 dark:text-white`.',
          quickCheck: {
            question: 'When implementing a light/dark mode card, what is the best practice to prevent text invisibility?',
            options: [
              'Hardcode text-white everywhere',
              'Explicitly pair background and text variants (e.g., bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100)',
              'Disable text in dark mode',
              'Use opacity-10'
            ],
            correctIndex: 1,
            explanation: 'Explicitly pairing background and text variants ensures high-contrast readability regardless of the active theme.'
          }
        }
      ],
      practiceChallenge: {
        title: 'Build a Theme-Aware Responsive 3-Column Card Grid',
        instructions: [
          'Create a container using grid with repeat(auto-fit, minmax(260px, 1fr)).',
          'Include 3 feature cards with high-contrast light and dark styling.',
          'Ensure borders, backgrounds, and text have both light and dark variants.'
        ],
        starterCode: `<div class="cards-grid">
  <!-- Build 3 theme-aware cards here -->
</div>`,
        solutionCode: `<div class="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6 p-6 bg-slate-50 dark:bg-slate-950">
  <article class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:border-indigo-500 transition-colors">
    <div class="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">01</div>
    <h3 class="mt-4 text-lg font-bold text-slate-900 dark:text-white">Full Stack Core</h3>
    <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">Foundational web protocols, HTML5 semantics, and CSS architecture.</p>
  </article>
  <article class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:border-indigo-500 transition-colors">
    <div class="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">02</div>
    <h3 class="mt-4 text-lg font-bold text-slate-900 dark:text-white">React Ecosystem</h3>
    <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">Declarative components, custom hooks, and state management.</p>
  </article>
  <article class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:border-indigo-500 transition-colors">
    <div class="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">03</div>
    <h3 class="mt-4 text-lg font-bold text-slate-900 dark:text-white">Cloud Production</h3>
    <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">Automated CI/CD pipelines, Docker containers, and live deployment.</p>
  </article>
</div>`,
        hints: [
          'Use repeat(auto-fit, minmax(260px, 1fr)) for media-query-free responsiveness.',
          'Always specify both bg-white and dark:bg-slate-900 alongside text-slate-900 and dark:text-white.'
        ]
      },
      keyTakeaways: [
        'CSS Grid provides native 2D layout capabilities unmatched by 1D flexbox.',
        'repeat(auto-fit, minmax(min, 1fr)) is the ultimate responsive card grid formula.',
        'CSS Custom Properties enable dynamic runtime theming, while Tailwind utilities enforce high design velocity.'
      ]
    },
    {
      id: 'fs-w1-d5',
      dayNumber: 5,
      weekNumber: 1,
      title: 'JavaScript Core Fundamentals from Scratch',
      subtitle: 'Data types, memory models, let/const, coercion, and operators',
      durationMinutes: 55,
      overview:
        'Begin programming in JavaScript from the absolute ground up. Understand primitives vs references, variable declaration scopes, truthiness, strict equality, and control flow.',
      topics: [
        {
          id: 'fs-w1-d5-t1',
          topicNumber: 1,
          title: 'JavaScript Primitive Data Types vs Objects',
          explanation: [
            'JavaScript has 7 primitive types: `string`, `number`, `boolean`, `null`, `undefined`, `symbol`, and `bigint`.',
            'Primitives are immutable and passed by value. Everything else is an `object` (arrays, functions, plain objects, dates), which are mutable and passed by reference.'
          ],
          codeSnippet: {
            id: 'fs-t5-c1',
            title: 'Value vs Reference in JavaScript',
            description: 'Demonstrating how primitives copy by value while objects copy references.',
            language: 'javascript',
            code: `// 1. Primitive: Pass by Value
let a = 42;
let b = a;
b = 99;
console.log('a is:', a); // Still 42!

// 2. Object: Pass by Reference
let user1 = { name: 'Sarah', role: 'Dev' };
let user2 = user1; // Both point to the exact same heap memory address!
user2.role = 'Tech Lead';
console.log('user1 role is:', user1.role); // Mutated to 'Tech Lead'!`,
            expectedOutput: 'a is: 42\nuser1 role is: Tech Lead'
          },
          pitfall: 'Assigning an object to a new variable does not clone it; modifying `user2` mutates `user1`. Use `{ ...user1 }` or `structuredClone(user1)` for copies.',
          quickCheck: {
            question: 'Which of the following is NOT a JavaScript primitive data type?',
            options: ['boolean', 'number', 'array', 'string'],
            correctIndex: 2,
            explanation: 'Arrays are objects (instances of Array.prototype) in JavaScript; string, number, and boolean are primitives.'
          }
        },
        {
          id: 'fs-w1-d5-t2',
          topicNumber: 2,
          title: 'Variable Declarations: const vs let vs var',
          explanation: [
            '`const` declares block-scoped variables that cannot be reassigned (prefer this by default).',
            '`let` declares block-scoped variables that can be reassigned (e.g. loop counters).',
            '`var` is function-scoped, hoisted with `undefined`, and can be re-declared; avoid `var` in modern JavaScript.'
          ],
          codeSnippet: {
            id: 'fs-t5-c2',
            title: 'Block Scope with const and let',
            description: 'Demonstrating temporal dead zone and block scoping.',
            language: 'javascript',
            code: `const MAX_RETRIES = 3;
// MAX_RETRIES = 5; // TypeError: Assignment to constant variable!

let counter = 0;
counter += 1;

if (true) {
  let blockScoped = 'Hidden inside block';
  const innerConst = 100;
}
// console.log(blockScoped); // ReferenceError: blockScoped is not defined

console.log('Counter is:', counter);`,
            expectedOutput: 'Counter is: 1'
          },
          pitfall: '`const` prevents variable reassignment, but does NOT make object properties immutable. Properties inside a `const obj = {}` can still be modified.',
          quickCheck: {
            question: 'What happens when you declare a variable with const obj = { age: 20 } and then run obj.age = 21?',
            options: [
              'Throws a TypeError',
              'The mutation succeeds because const protects the reference, not the object properties',
              'obj becomes undefined',
              'JavaScript creates a clone'
            ],
            correctIndex: 1,
            explanation: 'const binds the reference; mutating internal properties of an object or array is completely legal unless Object.freeze() is used.'
          }
        },
        {
          id: 'fs-w1-d5-t3',
          topicNumber: 3,
          title: 'Strict Equality (===) vs Loose Equality (==) & Type Coercion',
          explanation: [
            '`===` (strict equality) checks both value and type without coercion.',
            '`==` (loose equality) attempts implicit type conversion before comparison, leading to notorious bugs like `0 == false` (true) and `"" == 0` (true).',
            'Always use `===` and `!==` in professional code.'
          ],
          codeSnippet: {
            id: 'fs-t5-c3',
            title: 'Strict vs Loose Equality Comparison',
            description: 'Comparing type coercion behavior.',
            language: 'javascript',
            code: `console.log('5' == 5);   // true (Loose: coerced string to number)
console.log('5' === 5);  // false (Strict: string is not number)

console.log(null == undefined);  // true
console.log(null === undefined); // false

console.log(0 === false);        // false`,
            expectedOutput: 'true\nfalse\ntrue\nfalse\nfalse'
          },
          pitfall: 'Using loose equality `==` can cause security flaws in authentication checks (e.g. comparing string tokens to empty arrays or numbers).',
          quickCheck: {
            question: 'What is the result of expression ("42" === 42)?',
            options: ['true', 'false', 'undefined', 'NaN'],
            correctIndex: 1,
            explanation: 'Strict equality requires both the value and the type to match. A string never strictly equals a number.'
          }
        },
        {
          id: 'fs-w1-d5-t4',
          topicNumber: 4,
          title: 'Truthiness, Falsiness & The 8 Falsy Values',
          explanation: [
            'In JavaScript conditions (`if`, ternary), values are coerced to booleans.',
            'There are exactly 8 falsy values in JavaScript: `false`, `0`, `-0`, `0n`, `""` (empty string), `null`, `undefined`, and `NaN`. Everything else is truthy (including empty arrays `[]` and empty objects `{}`!).'
          ],
          codeSnippet: {
            id: 'fs-t5-c4',
            title: 'Testing Truthiness of Common Values',
            description: 'Checking boolean conversion of empty structures and falsy values.',
            language: 'javascript',
            code: `const checkTruth = (val) => Boolean(val);

console.log('"" is:', checkTruth(""));         // false (empty string is falsy)
console.log('0 is:', checkTruth(0));           // false
console.log('null is:', checkTruth(null));     // false
console.log('[] is:', checkTruth([]));         // true! (Empty array is truthy)
console.log('{} is:', checkTruth({}));         // true! (Empty object is truthy)`,
            expectedOutput: '"" is: false\n0 is: false\nnull is: false\n[] is: true\n{} is: true'
          },
          pitfall: 'Checking `if (items)` to see if an array has elements fails because `[]` is truthy! Check `if (items.length > 0)` instead.',
          quickCheck: {
            question: 'Is an empty array [] in JavaScript truthy or falsy?',
            options: ['Truthy', 'Falsy', 'Throws a TypeError', 'undefined'],
            correctIndex: 0,
            explanation: 'All objects in JavaScript (including empty arrays [] and empty objects {}) evaluate to truthy.'
          }
        },
        {
          id: 'fs-w1-d5-t5',
          topicNumber: 5,
          title: 'Logical Operators: Short-Circuiting (&&, ||, and ??)',
          explanation: [
            '`&&` returns the first falsy operand, or the last operand if all are truthy.',
            '`||` returns the first truthy operand, or the last operand if all are falsy.',
            '`??` (Nullish Coalescing) returns the right-hand operand ONLY if left is `null` or `undefined` (unlike `||`, it does NOT replace `0` or `""`).'
          ],
          codeSnippet: {
            id: 'fs-t5-c5',
            title: 'Comparing || (OR) with ?? (Nullish Coalescing)',
            description: 'Handling zero and empty string default values safely.',
            language: 'javascript',
            code: `const score = 0; // A valid zero score

// || treats 0 as falsy and accidentally replaces it!
const displayScoreOR = score || 10;
console.log('Using ||:', displayScoreOR); // 10 (Bug!)

// ?? only replaces null or undefined
const displayScoreNullish = score ?? 10;
console.log('Using ??:', displayScoreNullish); // 0 (Correct!)`,
            expectedOutput: 'Using ||: 10\nUsing ??: 0'
          },
          pitfall: 'Using `||` for default settings replaces valid inputs like `0`, `false`, or `""`. Always prefer `??` for default configurations.',
          quickCheck: {
            question: 'What does expression (false ?? true) evaluate to?',
            options: ['true', 'false', 'null', 'undefined'],
            correctIndex: 1,
            explanation: 'The nullish coalescing operator ?? only triggers for null and undefined. false is defined, so false is returned.'
          }
        },
        {
          id: 'fs-w1-d5-t6',
          topicNumber: 6,
          title: 'Control Flow: if-else, switch, and Ternary Operator',
          explanation: [
            'Control flow structures direct code execution based on boolean conditions.',
            'The ternary operator `condition ? exprIfTrue : exprIfFalse` provides an inline expression ideal for returning UI states in React or template strings.'
          ],
          codeSnippet: {
            id: 'fs-t5-c6',
            title: 'Ternary Expressions vs Switch Statements',
            description: 'Clean concise conditional evaluation.',
            language: 'javascript',
            code: `const userRole = 'admin';

// Ternary expression
const badge = userRole === 'admin' ? '🛡️ Administrator' : '👤 Member';
console.log('Badge:', badge);

// Switch statement for discrete enum states
let accessLevel;
switch (userRole) {
  case 'admin':
    accessLevel = 3;
    break;
  case 'editor':
    accessLevel = 2;
    break;
  default:
    accessLevel = 1;
}
console.log('Access level:', accessLevel);`,
            expectedOutput: 'Badge: 🛡️ Administrator\nAccess level: 3'
          },
          pitfall: 'Never nest multiple ternary operators deeper than 2 levels; it damages code readability. Use a function with early returns instead.',
          quickCheck: {
            question: 'What is the main advantage of the ternary operator over an if statement?',
            options: [
              'It is faster on the CPU',
              'It is an expression that yields a value and can be embedded inline',
              'It does not require a condition',
              'It prevents errors'
            ],
            correctIndex: 1,
            explanation: 'Ternaries are expressions, meaning they evaluate directly to a value that can be assigned to a variable or returned from a function.'
          }
        },
        {
          id: 'fs-w1-d5-t7',
          topicNumber: 7,
          title: 'Loops: for, for...of, and while',
          explanation: [
            'Use standard `for (let i = 0; i < n; i++)` when you need numeric indices.',
            'Use `for (const item of array)` for clean iteration over iterable values (arrays, sets, maps).',
            'Use `for...in` ONLY for iterating over object keys (not arrays).'
          ],
          codeSnippet: {
            id: 'fs-t5-c7',
            title: 'Iterating Collections with for...of',
            description: 'Modern clean iteration over an array of student records.',
            language: 'javascript',
            code: `const skills = ['HTML5', 'CSS3', 'JavaScript', 'Node.js'];

// Clean modern iteration with for...of
for (const skill of skills) {
  console.log('Learned skill:', skill);
}`,
            expectedOutput: 'Learned skill: HTML5\nLearned skill: CSS3\nLearned skill: JavaScript\nLearned skill: Node.js'
          },
          pitfall: 'Do not use `for...in` on arrays; it iterates over property keys (as strings) and may enumerate non-numeric prototype properties.',
          quickCheck: {
            question: 'Which loop construct is recommended for cleanly iterating directly over array values?',
            options: ['for...in', 'for...of', 'do...while', 'goto'],
            correctIndex: 1,
            explanation: 'for...of iterates over iterable values (elements of an array) directly.'
          }
        },
        {
          id: 'fs-w1-d5-t8',
          topicNumber: 8,
          title: 'Functions: Declarations vs Expressions vs Arrow Functions',
          explanation: [
            'Function declarations `function fn() {}` are hoisted with their complete implementation.',
            'Arrow functions `const fn = () => {}` do not bind their own `this`, `arguments`, or `super`, making them the modern standard for callbacks, closures, and React components.'
          ],
          codeSnippet: {
            id: 'fs-t5-c8',
            title: 'Arrow Functions and Concise Bodies',
            description: 'Implicit returns and lexical this scoping.',
            language: 'javascript',
            code: `// Function declaration (Hoisted)
function calculateTax(subtotal, rate = 0.08) {
  return subtotal * rate;
}

// Arrow function with concise body (implicit return)
const add = (a, b) => a + b;
const double = x => x * 2;

console.log('Tax on $100:', calculateTax(100));
console.log('Add 5 + 7:', add(5, 7));
console.log('Double 21:', double(21));`,
            expectedOutput: 'Tax on $100: 8\nAdd 5 + 7: 12\nDouble 21: 42'
          },
          pitfall: 'Arrow functions do not have their own `this` keyword; do not use them as object methods when you need `this` to refer to the host object.',
          quickCheck: {
            question: 'What happens to this inside an arrow function?',
            options: [
              'It refers to the global window object always',
              'It is lexically bound from the surrounding enclosing scope',
              'It creates a new this object',
              'It throws an error'
            ],
            correctIndex: 1,
            explanation: 'Arrow functions capture this lexically from the scope in which they were defined.'
          }
        }
      ],
      practiceChallenge: {
        title: 'Build a Safe Shopping Cart Tax & Total Calculator',
        instructions: [
          'Declare a cart array containing items with name and price.',
          'Calculate total price using a loop or reduce.',
          'Apply nullish coalescing to support optional discount codes.',
          'Format and return the final receipt string.'
        ],
        starterCode: `function calculateCartTotal(cart, discountPercent) {
  // Compute total, apply discount if provided, return summary
}`,
        solutionCode: `function calculateCartTotal(cart, discountPercent) {
  let subtotal = 0;
  for (const item of cart) {
    subtotal += item.price;
  }
  const discount = discountPercent ?? 0;
  const discountAmount = subtotal * (discount / 100);
  const total = subtotal - discountAmount;
  return {
    subtotal,
    discountPercent: discount,
    total
  };
}

const myCart = [
  { name: 'Laptop Stand', price: 40 },
  { name: 'USB-C Cable', price: 15 }
];
console.log(calculateCartTotal(myCart, 10));`,
        hints: [
          'Use discountPercent ?? 0 so that if discountPercent is undefined, it safely defaults to 0.',
          'Sum up item.price for each item in the cart.'
        ]
      },
      keyTakeaways: [
        'Primitives copy by value; objects and arrays copy by memory reference.',
        'Always use const by default and let when reassignment is needed; avoid var.',
        'Use strict equality === and nullish coalescing ?? to avoid coercion bugs.'
      ]
    },
    {
      id: 'fs-w1-d6',
      dayNumber: 6,
      weekNumber: 1,
      title: 'Modern JavaScript ES6+, Arrays, Async & Promises',
      subtitle: 'Destructuring, rest/spread, map/filter/reduce, Promises, and async/await',
      durationMinutes: 55,
      overview:
        'Master the idioms of modern JavaScript: destructuring arrays and objects, spread/rest operators, functional array transformations (map, filter, reduce), and asynchronous programming with Promises and async/await.',
      topics: [
        {
          id: 'fs-w1-d6-t1',
          topicNumber: 1,
          title: 'Object & Array Destructuring',
          explanation: [
            'Destructuring unpacks values from arrays or properties from objects into distinct variables in a single expressive line.',
            'Supports default values, renaming aliases, and nested object extraction.'
          ],
          codeSnippet: {
            id: 'fs-t6-c1',
            title: 'Object and Array Destructuring in Action',
            description: 'Extracting data with defaults and property aliases.',
            language: 'javascript',
            code: `const user = {
  id: 101,
  username: 'johndoe',
  profile: { role: 'Full Stack Engineer' }
};

// Object destructuring with nested extraction and renaming
const { username, profile: { role }, status = 'active' } = user;
console.log(username, 'is a', role, 'with status', status);

// Array destructuring
const coords = [37.7749, -122.4194];
const [latitude, longitude] = coords;
console.log('Coords:', latitude, longitude);`,
            expectedOutput: 'johndoe is a Full Stack Engineer with status active\nCoords: 37.7749 -122.4194'
          },
          pitfall: 'Destructuring properties from `null` or `undefined` throws an immediate TypeError. Use optional chaining `user?.profile` when data may be absent.',
          quickCheck: {
            question: 'How do you rename a property key while destructuring const user = { first: "Jane" }?',
            options: [
              'const { first as firstName } = user',
              'const { first: firstName } = user',
              'const { first -> firstName } = user',
              'const { firstName = first } = user'
            ],
            correctIndex: 1,
            explanation: 'The colon syntax { originalKey: newVariableName } extracts and renames the property in JavaScript destructuring.'
          }
        },
        {
          id: 'fs-w1-d6-t2',
          topicNumber: 2,
          title: 'Spread (...) and Rest (...) Operators',
          explanation: [
            'The Spread operator (`...`) expands an iterable into individual elements (used for shallow-cloning objects, merging arrays, passing arguments).',
            'The Rest parameter (`...args`) gathers multiple remaining function arguments into an array.'
          ],
          codeSnippet: {
            id: 'fs-t6-c2',
            title: 'Cloning and Merging with Spread',
            description: 'Immutable object updates and rest parameter gathering.',
            language: 'javascript',
            code: `// 1. Immutable Object Update
const originalUser = { id: 1, name: 'Alice', theme: 'light' };
const updatedUser = { ...originalUser, theme: 'dark', lastLogin: '2026-10-24' };
console.log('Original theme:', originalUser.theme); // light
console.log('Updated theme:', updatedUser.theme);   // dark

// 2. Rest Parameter in Functions
const sumAll = (...numbers) => numbers.reduce((acc, n) => acc + n, 0);
console.log('Sum:', sumAll(10, 20, 30, 40));`,
            expectedOutput: 'Original theme: light\nUpdated theme: dark\nSum: 100'
          },
          pitfall: 'Spread performs a SHALLOW copy; nested objects still share memory references. Mutating `updatedUser.nested.prop` will mutate `originalUser.nested.prop`.',
          quickCheck: {
            question: 'What is the key difference between spread and rest operators?',
            options: [
              'Spread unpacks elements; rest collects multiple elements into a single array',
              'Spread is for numbers only; rest is for strings only',
              'They are completely identical',
              'Rest cannot be used in functions'
            ],
            correctIndex: 0,
            explanation: 'Spread expands elements outward; rest collects incoming arguments into an array.'
          }
        },
        {
          id: 'fs-w1-d6-t3',
          topicNumber: 3,
          title: 'Array Transformations: map() and filter()',
          explanation: [
            '`map()` creates a new array populated with the results of calling a provided function on every element in the calling array.',
            '`filter()` creates a shallow copy of a portion of an array containing only elements that pass the predicate test.',
            'Both are pure functions that do not mutate the original array.'
          ],
          codeSnippet: {
            id: 'fs-t6-c3',
            title: 'Chaining filter() and map()',
            description: 'Filtering active students and formatting names.',
            language: 'javascript',
            code: `const students = [
  { id: 1, name: 'Alex', active: true, score: 92 },
  { id: 2, name: 'Morgan', active: false, score: 68 },
  { id: 3, name: 'Taylor', active: true, score: 88 }
];

// Chain filter and map immutably
const honorRollNames = students
  .filter(s => s.active && s.score >= 80)
  .map(s => s.name.toUpperCase());

console.log('Honor Roll:', honorRollNames);`,
            expectedOutput: 'Honor Roll: [ \'ALEX\', \'TAYLOR\' ]'
          },
          pitfall: 'Do not use `map()` when you do not intend to use the returned array; use `forEach()` or `for...of` for side effects.',
          quickCheck: {
            question: 'Does array.filter() mutate the source array in place?',
            options: [
              'Yes, it deletes non-matching items',
              'No, it returns a new array containing only matching elements',
              'Only if wrapped in a function',
              'Depends on array length'
            ],
            correctIndex: 1,
            explanation: 'filter() is immutable and returns a new array, leaving the original array intact.'
          }
        },
        {
          id: 'fs-w1-d6-t4',
          topicNumber: 4,
          title: 'The Swiss Army Knife: Array.prototype.reduce()',
          explanation: [
            '`reduce()` executes a user-supplied reducer callback function on each element of the array, passing the return value from the calculation on the preceding element.',
            'Can compute sums, build lookup dictionaries/maps, flatten structures, and count frequencies in a single pass.'
          ],
          codeSnippet: {
            id: 'fs-t6-c4',
            title: 'Building a Lookup Dictionary with reduce()',
            description: 'Transforming an array of records into an indexed O(1) object lookup.',
            language: 'javascript',
            code: `const products = [
  { id: 'p1', name: 'Keyboard', price: 99 },
  { id: 'p2', name: 'Mouse', price: 49 },
  { id: 'p3', name: 'Monitor', price: 299 }
];

// Group by ID for O(1) dictionary lookup
const productMap = products.reduce((acc, product) => {
  acc[product.id] = product;
  return acc;
}, {});

console.log('Product p2 is:', productMap['p2'].name);`,
            expectedOutput: 'Product p2 is: Mouse'
          },
          pitfall: 'Always provide an explicit initial value to `reduce(callback, initialValue)`; omitting it causes the first element to become the initial accumulator, leading to bugs on empty arrays.',
          quickCheck: {
            question: 'What happens if you call array.reduce() without an initialValue on an empty array []?',
            options: [
              'Returns 0',
              'Returns undefined',
              'Throws a TypeError: Reduce of empty array with no initial value',
              'Returns null'
            ],
            correctIndex: 2,
            explanation: 'Calling reduce on an empty array without an initialValue throws a fatal TypeError.'
          }
        },
        {
          id: 'fs-w1-d6-t5',
          topicNumber: 5,
          title: 'Understanding Promises: Pending, Fulfilled & Rejected',
          explanation: [
            'A `Promise` is an object representing the eventual completion or failure of an asynchronous operation and its resulting value.',
            'A promise exists in one of three states: `pending` (initial), `fulfilled` (resolved with value), or `rejected` (failed with reason).',
            'Handle promises with `.then()`, `.catch()`, and `.finally()`.'
          ],
          codeSnippet: {
            id: 'fs-t6-c5',
            title: 'Creating and Consuming a Promise',
            description: 'Simulating an asynchronous database query.',
            language: 'javascript',
            code: `const fetchUserData = (userId) => {
  return new Promise((resolve, reject) => {
    if (userId <= 0) {
      reject(new Error('Invalid user ID'));
    } else {
      setTimeout(() => {
        resolve({ id: userId, name: 'Jordan', status: 'verified' });
      }, 50);
    }
  });
};

fetchUserData(1)
  .then(user => console.log('Fetched user:', user.name))
  .catch(err => console.error('Fetch error:', err.message));`,
            expectedOutput: 'Fetched user: Jordan'
          },
          pitfall: 'Uncaught promise rejections crash Node.js processes and log noisy warnings in browsers. Always attach `.catch()` or use `try/catch`.',
          quickCheck: {
            question: 'Once a Promise transitions from pending to fulfilled, can it be changed to rejected?',
            options: [
              'Yes, anytime',
              'No, a promise settles only once and becomes immutable thereafter',
              'Only if clearPromise() is invoked',
              'Yes, after 1 second'
            ],
            correctIndex: 1,
            explanation: 'Promises are immutable once settled; they cannot transition from fulfilled to rejected or vice versa.'
          }
        },
        {
          id: 'fs-w1-d6-t6',
          topicNumber: 6,
          title: 'Modern Async / Await Syntax & Error Handling',
          explanation: [
            '`async/await` is syntactic sugar over Promises that allows writing asynchronous code with clean synchronous structure.',
            'Any function marked `async` automatically returns a Promise. The `await` keyword pauses execution of the async function until the Promise settles.'
          ],
          codeSnippet: {
            id: 'fs-t6-c6',
            title: 'Clean Asynchronous Workflow with try/catch',
            description: 'Fetching and handling errors with async/await.',
            language: 'javascript',
            code: `async function loadDashboardMetrics() {
  try {
    console.log('Loading metrics...');
    // Simulated async fetch
    const metrics = await new Promise((res) => {
      setTimeout(() => res({ activeUsers: 1420, uptime: '99.98%' }), 30);
    });
    console.log('Metrics loaded successfully:', metrics.activeUsers);
    return metrics;
  } catch (error) {
    console.error('Failed to load metrics:', error.message);
  } finally {
    console.log('Metrics loading sequence completed.');
  }
}

loadDashboardMetrics();`,
            expectedOutput: 'Loading metrics...\nMetrics loaded successfully: 1420\nMetrics loading sequence completed.'
          },
          pitfall: 'Forgetting `await` before a promise causes the variable to store the Promise object itself instead of the resolved data value.',
          quickCheck: {
            question: 'What does a function prefixed with the async keyword always return?',
            options: ['A callback', 'A Promise', 'An Iterator', 'void'],
            correctIndex: 1,
            explanation: 'Every async function automatically wraps its return value in a resolved Promise.'
          }
        },
        {
          id: 'fs-w1-d6-t7',
          topicNumber: 7,
          title: 'Concurrent Async Operations: Promise.all() vs Promise.allSettled()',
          explanation: [
            'Running independent asynchronous requests sequentially with `await req1; await req2;` causes an unnecessary network waterfall.',
            '`Promise.all([p1, p2])` executes requests concurrently and fails fast if any reject. `Promise.allSettled([p1, p2])` waits for all to finish, returning an array of statuses.'
          ],
          codeSnippet: {
            id: 'fs-t6-c7',
            title: 'Concurrent Execution with Promise.all',
            description: 'Executing multiple network requests in parallel.',
            language: 'javascript',
            code: `async function fetchCourseData() {
  const fetchUsers = Promise.resolve(['Alice', 'Bob']);
  const fetchStats = Promise.resolve({ totalLessons: 28 });

  // Execute concurrently in parallel!
  const [users, stats] = await Promise.all([fetchUsers, fetchStats]);
  
  console.log('Concurrent results:', users.length, 'students,', stats.totalLessons, 'lessons');
}

fetchCourseData();`,
            expectedOutput: 'Concurrent results: 2 students, 28 lessons'
          },
          pitfall: 'If one promise in `Promise.all()` rejects, the entire batch rejects immediately, discarding results from all successful promises. Use `Promise.allSettled()` if partial success is acceptable.',
          quickCheck: {
            question: 'When should you choose Promise.allSettled() over Promise.all()?',
            options: [
              'When you need one rejection to cancel everything',
              'When you want all promises to finish and inspect both fulfilled and rejected results individually',
              'When you only have one promise',
              'For synchronous code'
            ],
            correctIndex: 1,
            explanation: 'Promise.allSettled never rejects early; it waits for all promises to resolve or reject and returns detailed status objects.'
          }
        },
        {
          id: 'fs-w1-d6-t8',
          topicNumber: 8,
          title: 'DOM Querying, Event Listeners & Event Delegation',
          explanation: [
            'Use `document.querySelector()` and `document.querySelectorAll()` to locate elements using modern CSS selectors.',
            'Event Delegation attaches a single listener to a parent container to manage events from hundreds of dynamic child elements using `event.target`, optimizing memory usage.'
          ],
          codeSnippet: {
            id: 'fs-t6-c8',
            title: 'High-Performance Event Delegation',
            description: 'Listening for clicks on a list of buttons with a single parent handler.',
            language: 'javascript',
            code: `// Simulating DOM structure
const container = {
  addEventListener: (event, handler) => {
    // Simulating child button click
    const mockEvent = {
      target: { matches: (sel) => sel === 'button.delete-btn', dataset: { id: '42' } }
    };
    handler(mockEvent);
  }
};

// Single event listener on parent delegates to children
container.addEventListener('click', (e) => {
  if (e.target.matches('button.delete-btn')) {
    console.log('Deleted record ID:', e.target.dataset.id);
  }
});`,
            expectedOutput: 'Deleted record ID: 42'
          },
          pitfall: 'Attaching individual event listeners to 1,000 table rows consumes huge memory and causes memory leaks when rows are re-rendered; always delegate.',
          quickCheck: {
            question: 'What is the primary memory advantage of event delegation?',
            options: [
              'It speeds up CSS loading',
              'It attaches one listener to a common ancestor instead of hundreds of listeners on child nodes',
              'It disables event bubbling',
              'It runs on the GPU'
            ],
            correctIndex: 1,
            explanation: 'Event delegation leverages event bubbling to handle actions on multiple children with a single parent listener.'
          }
        }
      ],
      practiceChallenge: {
        title: 'Build an Async Data Pipeline with Filter and Map',
        instructions: [
          'Create an async function processOrders(ordersPromise) that awaits an array of orders.',
          'Filter out orders with status !== "completed".',
          'Calculate total revenue and extract an array of customer emails.'
        ],
        starterCode: `async function processOrders(ordersPromise) {
  // Await orders, filter completed, compute revenue
}`,
        solutionCode: `async function processOrders(ordersPromise) {
  const orders = await ordersPromise;
  const completed = orders.filter(o => o.status === 'completed');
  const totalRevenue = completed.reduce((sum, o) => sum + o.amount, 0);
  const emails = completed.map(o => o.customerEmail);

  return {
    count: completed.length,
    totalRevenue,
    emails
  };
}

const mockOrders = Promise.resolve([
  { id: 1, amount: 150, status: 'completed', customerEmail: 'alex@example.com' },
  { id: 2, amount: 80, status: 'pending', customerEmail: 'sarah@example.com' },
  { id: 3, amount: 220, status: 'completed', customerEmail: 'jordan@example.com' }
]);

processOrders(mockOrders).then(res => console.log(res));`,
        hints: [
          'Use await ordersPromise to resolve the promise first.',
          'Use reduce to sum the order amounts.'
        ]
      },
      keyTakeaways: [
        'Destructuring and spread syntax write concise, immutable, readable transformations.',
        'Array methods map, filter, and reduce are pure functions that avoid mutation side effects.',
        'async/await provides clean synchronous appearance with full non-blocking asynchronous power.'
      ]
    },
    {
      id: 'fs-w1-d7',
      dayNumber: 7,
      weekNumber: 1,
      title: 'Git & GitHub from Scratch: Init, Staging, Commit & Push',
      subtitle: 'Version control models, repository initialization, branching, remotes, and pull requests',
      durationMinutes: 50,
      overview:
        'Master Git and GitHub from the absolute basics: how distributed version control works, initializing repositories, staging areas, atomic commits, branching, merging, and pushing to remote GitHub repositories.',
      topics: [
        {
          id: 'fs-w1-d7-t1',
          topicNumber: 1,
          title: 'What is Version Control & The Three Trees of Git',
          explanation: [
            'Git is a distributed version control system that tracks snapshots of your files over time, allowing you to restore history, branch off experiments, and collaborate securely.',
            'Git organizes local work into Three Trees (states): 1) Working Directory (untracked/modified files), 2) Staging Area / Index (prepared for commit), 3) Git Repository (.git folder with permanent immutable commit snapshots).'
          ],
          codeSnippet: {
            id: 'fs-t7-c1',
            title: 'Checking Git Working Tree Status',
            description: 'Inspecting working directory vs staging index.',
            language: 'bash',
            code: `# Check the current status of working directory & staging area
git status

# Inspect differences between working directory and staging index
git diff`,
            expectedOutput: 'On branch main\nChanges not staged for commit: ...'
          },
          pitfall: 'Do not confuse Git (the local CLI version control tool) with GitHub (the cloud-hosted collaboration platform). You can use Git entirely offline without GitHub.',
          quickCheck: {
            question: 'What are the three local states/trees of Git?',
            options: [
              'HTML, CSS, and JavaScript',
              'Working Directory, Staging Area (Index), and Repository (.git history)',
              'Development, Staging, and Production server',
              'Local, Remote, and Cloud'
            ],
            correctIndex: 1,
            explanation: 'Git tracks changes across the Working Directory, Staging Area (Index), and the permanent commit Repository.'
          }
        },
        {
          id: 'fs-w1-d7-t2',
          topicNumber: 2,
          title: 'Initializing a Repository & Global User Configuration',
          explanation: [
            'Before committing, Git must know your identity for commit attribution.',
            '`git config --global user.name "Your Name"` and `git config --global user.email "you@example.com"` set this identity.',
            '`git init` creates a hidden `.git` directory in the project root, turning the folder into a Git repository.'
          ],
          codeSnippet: {
            id: 'fs-t7-c2',
            title: 'Configuring Git and Initializing a Repo',
            description: 'First-time setup commands on any new developer machine.',
            language: 'bash',
            code: `# 1. Set global identity (used in all future commits)
git config --global user.name "Alex Rivera"
git config --global user.email "alex@developer.io"

# 2. Set default branch name to 'main'
git config --global init.defaultBranch main

# 3. Initialize a new local repository in current folder
git init`,
            expectedOutput: 'Initialized empty Git repository in /project/.git/'
          },
          pitfall: 'Never run `git init` inside your home directory `~` or an existing parent Git repository; only run it in project root directories.',
          quickCheck: {
            question: 'What hidden folder does git init create in your project root?',
            options: ['.github', '.git', '.cache', '.env'],
            correctIndex: 1,
            explanation: 'git init creates the .git directory containing all commit objects, branch references, and version history.'
          }
        },
        {
          id: 'fs-w1-d7-t3',
          topicNumber: 3,
          title: 'The .gitignore File: Protecting Secrets and Node Modules',
          explanation: [
            'The `.gitignore` file tells Git which files or directories to ignore and never track.',
            'Crucially, you must NEVER commit sensitive credentials (`.env`), API keys, build artifacts (`/dist`, `/build`), or heavy package dependencies (`node_modules/`).'
          ],
          codeSnippet: {
            id: 'fs-t7-c3',
            title: 'Essential .gitignore for Web Projects',
            description: 'Standard rules safeguarding secrets and vendor packages.',
            language: 'bash',
            code: `# Dependency packages (rebuilt via npm install)
node_modules/

# Environment secrets and API keys (CRITICAL)
.env
.env.local
*.pem

# Build output directories
dist/
build/
.next/

# OS metadata
.DS_Store
Thumbs.db`,
            expectedOutput: 'Protected files are automatically ignored by git status'
          },
          pitfall: 'If you accidentally commit a `.env` file with secret keys and push it to GitHub, changing the file in a new commit does NOT delete it from Git history! The secret is compromised and must be revoked immediately.',
          quickCheck: {
            question: 'Why should node_modules/ and .env always be listed in .gitignore?',
            options: [
              'Git crashes if node_modules exists',
              'node_modules is massive and easily re-installed, while .env contains secret credentials that should never be public',
              'npm will delete them automatically',
              'GitHub bans node_modules'
            ],
            correctIndex: 1,
            explanation: 'node_modules contains thousands of vendor files, and .env contains private API keys that must never be exposed.'
          }
        },
        {
          id: 'fs-w1-d7-t4',
          topicNumber: 4,
          title: 'Staging & Atomic Commits: git add & git commit',
          explanation: [
            '`git add <file>` moves changes from the working directory into the staging area.',
            '`git commit -m "message"` captures an immutable snapshot of all currently staged files.',
            'Write atomic commits: each commit should accomplish one logical, cohesive unit of work with a descriptive imperative message (e.g. "feat: add user login form validation").'
          ],
          codeSnippet: {
            id: 'fs-t7-c4',
            title: 'Staging Files and Creating Commits',
            description: 'Moving changes through staging to permanent history.',
            language: 'bash',
            code: `# Stage a single file
git add src/App.tsx

# Stage all modified and new files
git add .

# Create a conventional atomic commit
git commit -m "feat: add responsive navbar with theme toggle"

# View commit history
git log --oneline -n 5`,
            expectedOutput: '[main 9a4e21c] feat: add responsive navbar with theme toggle'
          },
          pitfall: 'Avoid vague commit messages like "fix stuff" or "update". Follow Conventional Commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`.',
          quickCheck: {
            question: 'What does git add . do?',
            options: [
              'Commits all files directly to GitHub',
              'Stages all modified and new files in the current directory and subdirectories',
              'Deletes unstaged files',
              'Initializes a new repo'
            ],
            correctIndex: 1,
            explanation: 'git add . stages all modified, untracked, and deleted files in the current workspace into the staging area.'
          }
        },
        {
          id: 'fs-w1-d7-t5',
          topicNumber: 5,
          title: 'Git Branching: Feature Isolation & git checkout / switch',
          explanation: [
            'Branches are lightweight movable pointers to commits. They allow you to develop features in complete isolation without breaking the stable `main` branch.',
            'Use `git switch -c <branch-name>` (or `git checkout -b <branch-name>`) to create and switch to a new branch.'
          ],
          codeSnippet: {
            id: 'fs-t7-c5',
            title: 'Creating and Switching Branches',
            description: 'Isolating feature development on a dedicated branch.',
            language: 'bash',
            code: `# Create and switch to a new feature branch
git switch -c feature/user-authentication

# List all local branches (active branch marked with *)
git branch

# Work, stage, and commit on the feature branch
git add src/auth/
git commit -m "feat(auth): implement jwt token generation"

# Switch back to the main branch
git switch main`,
            expectedOutput: 'Switched to a new branch \'feature/user-authentication\''
          },
          pitfall: 'Never build complex experimental features directly on `main`; always branch off so unfinished code does not compromise production.',
          quickCheck: {
            question: 'What modern Git command creates a new branch and immediately switches to it?',
            options: ['git branch new-name', 'git switch -c new-name', 'git push -b new-name', 'git merge new-name'],
            correctIndex: 1,
            explanation: 'git switch -c <name> (or git checkout -b <name>) creates the branch and checks it out in one step.'
          }
        },
        {
          id: 'fs-w1-d7-t6',
          topicNumber: 6,
          title: 'Merging Branches & Resolving Merge Conflicts',
          explanation: [
            '`git merge <branch>` integrates changes from the specified branch into your current active branch.',
            'A Fast-Forward merge occurs if `main` has no new commits. If both branches modified the same lines of code, Git pauses and marks a Merge Conflict with `<<<<<<<`, `=======`, and `>>>>>>>` for manual resolution.'
          ],
          codeSnippet: {
            id: 'fs-t7-c6',
            title: 'Merging a Feature Branch into Main',
            description: 'Standard merge sequence from main branch.',
            language: 'bash',
            code: `# 1. Switch to the target branch (main)
git switch main

# 2. Merge the completed feature branch
git merge feature/user-authentication

# 3. Clean up the merged branch after success
git branch -d feature/user-authentication`,
            expectedOutput: 'Updating 3c8e102..9a4e21c\nFast-forward\n src/auth.ts | 48 ++++++++++'
          },
          pitfall: 'When resolving merge conflicts, never leave Git conflict markers (`<<<<<<< HEAD`, `=======`) inside your source code; delete the markers after picking the correct code.',
          quickCheck: {
            question: 'What happens when two branches have modified the exact same line of code and are merged?',
            options: [
              'Git deletes the file',
              'Git flags a merge conflict and requests manual resolution of the conflicting lines',
              'Git picks the first commit automatically',
              'The terminal crashes'
            ],
            correctIndex: 1,
            explanation: 'Git cannot guess which change is correct, so it halts the merge and inserts conflict markers for the developer to resolve.'
          }
        },
        {
          id: 'fs-w1-d7-t7',
          topicNumber: 7,
          title: 'Remote Repositories: Connecting to GitHub & git push',
          explanation: [
            'A remote is a common repository hosted on the internet (such as GitHub, GitLab, or Bitbucket).',
            '`git remote add origin <url>` connects your local repo to the remote.',
            '`git push -u origin main` pushes your local commits to GitHub and sets up upstream tracking.'
          ],
          codeSnippet: {
            id: 'fs-t7-c7',
            title: 'Connecting Local Repo to GitHub Remote',
            description: 'Publishing local commits to remote GitHub repository.',
            language: 'bash',
            code: `# 1. Add remote alias named 'origin'
git remote add origin https://github.com/developer/fullstack-academy.git

# 2. Verify configured remotes
git remote -v

# 3. Push commits to GitHub and link upstream (-u)
git push -u origin main

# Subsequent pushes simply require:
git push`,
            expectedOutput: 'Branch \'main\' set up to track remote branch \'main\' from \'origin\'.'
          },
          pitfall: 'Never use `git push --force` on shared team branches like `main` or `develop`; it overwrites commit history on the server and breaks teammates working copies.',
          quickCheck: {
            question: 'What does the -u flag do in git push -u origin main?',
            options: [
              'Unlocks the repository',
              'Sets upstream tracking so future git push and git pull commands do not require typing origin main',
              'Upgrades Git to latest version',
              'Deletes local branches'
            ],
            correctIndex: 1,
            explanation: '-u sets the default upstream remote and branch for the current branch, enabling bare "git push" thereafter.'
          }
        },
        {
          id: 'fs-w1-d7-t8',
          topicNumber: 8,
          title: 'Pull Requests (PRs), Code Reviews & GitHub Collaboration Workflow',
          explanation: [
            'In professional software teams, developers never push directly to `main`.',
            'Instead, you push your feature branch to GitHub (`git push -u origin feature/my-feature`), open a Pull Request (PR), solicit peer code reviews, pass automated CI checks, and merge via GitHub.'
          ],
          codeSnippet: {
            id: 'fs-t7-c8',
            title: 'The Professional Team Git Workflow',
            description: 'Step-by-step summary of the industry standard GitHub workflow.',
            language: 'bash',
            code: `# 1. Ensure local main is synchronized
git switch main
git pull origin main

# 2. Create isolated feature branch
git switch -c feat/checkout-api

# 3. Make changes, stage, and commit
git add .
git commit -m "feat(api): implement stripe payment intent handler"

# 4. Push feature branch to GitHub
git push -u origin feat/checkout-api

# 5. Open Pull Request on GitHub UI -> Review -> Merge!`,
            expectedOutput: 'Total 5 (delta 2), reused 0 (delta 0)\nTo https://github.com/developer/app.git\n * [new branch] feat/checkout-api -> feat/checkout-api'
          },
          pitfall: 'Always run `git pull origin main` before creating or finalizing a feature branch to ensure you are building on the latest code.',
          quickCheck: {
            question: 'What is the purpose of a GitHub Pull Request (PR)?',
            options: [
              'To download files to your computer',
              'To propose code changes from a feature branch, review diffs, run tests, and merge into main',
              'To reset Git password',
              'To delete a repository'
            ],
            correctIndex: 1,
            explanation: 'A Pull Request is a collaborative discussion and review process for proposing changes before merging into production.'
          }
        }
      ],
      practiceChallenge: {
        title: 'Execute a Complete Git Feature Workflow',
        instructions: [
          'Initialize a Git repository and configure a .gitignore ignoring node_modules/ and .env.',
          'Create an initial commit on branch main.',
          'Create a feature branch named feature/login-page.',
          'Make changes, stage, commit, and prepare the branch for remote push.'
        ],
        starterCode: `# Write bash commands to execute feature workflow
git init
# Add .gitignore, commit, branch, and push`,
        solutionCode: `git init
echo "node_modules/" >> .gitignore
echo ".env" >> .gitignore
git add .gitignore
git commit -m "chore: initialize project with .gitignore"

# Create feature branch
git switch -c feature/login-page
echo "export const Login = () => <div>Login</div>;" >> Login.tsx
git add Login.tsx
git commit -m "feat: scaffold basic login component"

# Check log
git log --oneline`,
        hints: [
          'Remember to add .gitignore before committing project files.',
          'Use git switch -c to create and check out feature/login-page.'
        ]
      },
      keyTakeaways: [
        'Git tracks changes locally across Working Directory, Staging Index, and Git Repository history.',
        'Always protect secrets and heavy dependencies by configuring .gitignore before initial commit.',
        'Professional teams isolate work in feature branches and merge through reviewed Pull Requests.'
      ]
    }
  ],
  quiz: {
    id: 'fs-quiz-w1',
    weekNumber: 1,
    title: 'Module 1 Assessment: Web Foundations, CSS, JavaScript & Git',
    description:
      'Test your mastery of browser networking, semantic HTML5, CSS layout engines, core JavaScript data models, and Git version control.',
    passingScorePercent: 80,
    questions: [
      {
        id: 'fs-q1-1',
        question: 'What is the primary role of the Domain Name System (DNS) on the web?',
        options: [
          'Encrypting passwords using TLS certificates',
          'Translating human-readable domain names into machine IP addresses',
          'Rendering CSS animations on the GPU',
          'Storing cookies on the client browser'
        ],
        correctIndex: 1,
        explanation: 'DNS maps domain names (e.g., example.com) to their corresponding IP addresses.'
      },
      {
        id: 'fs-q1-2',
        question: 'Why should box-sizing: border-box be applied universally in modern web development?',
        options: [
          'It forces all images to be circular',
          'It includes padding and border within the declared width and height, preventing layout breakage',
          'It enables CSS Grid automatically',
          'It speeds up JavaScript execution'
        ],
        correctIndex: 1,
        explanation: 'border-box incorporates padding and border within width calculations, making layouts predictable.'
      },
      {
        id: 'fs-q1-3',
        question: 'Which CSS Flexbox property aligns items along the Cross Axis?',
        options: ['justify-content', 'align-items', 'flex-direction', 'flex-grow'],
        correctIndex: 1,
        explanation: 'align-items controls cross-axis alignment, while justify-content controls main-axis alignment.'
      },
      {
        id: 'fs-q1-4',
        question: 'In JavaScript, what will the expression (0 || "default") evaluate to, and why?',
        options: [
          '0, because 0 is a number',
          '"default", because 0 is falsy and || returns the first truthy operand',
          'undefined',
          'Throws an error'
        ],
        correctIndex: 1,
        explanation: '0 is one of the 8 falsy values in JavaScript; || skips falsy values and returns "default".'
      },
      {
        id: 'fs-q1-5',
        question: 'What is the key difference between const and let in JavaScript?',
        options: [
          'let is function scoped; const is globally scoped',
          'const variables cannot be reassigned; let variables can be reassigned',
          'const can only store numbers',
          'let does not support objects'
        ],
        correctIndex: 1,
        explanation: 'const creates a read-only reference that prevents reassignment; let allows reassignment.'
      },
      {
        id: 'fs-q1-6',
        question: 'Why is it critical to list .env in .gitignore before making your first Git commit?',
        options: [
          '.env slows down Git commands',
          '.env contains private secrets and API keys that would become exposed in public commit history',
          'Git cannot parse files starting with a dot',
          'GitHub will reject the entire repository'
        ],
        correctIndex: 1,
        explanation: 'Committing .env files exposes secret credentials to all collaborators and commit history.'
      }
    ]
  }
};
