export const CURRICULUM_LEVELS = [
  {
    id: 'beginner',
    name: 'Beginner: Core Fundamentals',
    tag: 'Level 1',
    description: 'Master JSX, Components, Props, State, Events, and the Virtual DOM mental model.',
    color: '#38bdf8',
    gradient: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
    icon: 'Sparkles',
  },
  {
    id: 'intermediate',
    name: 'Intermediate: Hooks & Patterns',
    tag: 'Level 2',
    description: 'Harness useEffect lifecycle, useRef, custom hooks, context, and state lifting.',
    color: '#818cf8',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
    icon: 'Layers',
  },
  {
    id: 'advanced',
    name: 'Advanced: Performance & Architecture',
    tag: 'Level 3',
    description: 'Re-render optimization, useMemo/useCallback, useReducer machines, Portals, and Suspense.',
    color: '#c084fc',
    gradient: 'linear-gradient(135deg, #9333ea 0%, #c084fc 100%)',
    icon: 'Cpu',
  },
  {
    id: 'react19',
    name: 'React 19 & Next-Gen Patterns',
    tag: 'Level 4',
    description: 'Actions, useActionState, useOptimistic, use() hook, Server Components, and Fiber engine.',
    color: '#34d399',
    gradient: 'linear-gradient(135deg, #059669 0%, #34d399 100%)',
    icon: 'Zap',
  },
];

export const TOPICS = [
  // ==========================================
  // LEVEL 1: BEGINNER FUNDAMENTALS
  // ==========================================
  {
    id: 'b1-jsx-vdom',
    level: 'beginner',
    levelName: 'Beginner: Core Fundamentals',
    title: 'JSX & The Virtual DOM',
    badge: 'Foundation',
    time: '8 min read',
    summary: 'Understand how JSX compiles to JavaScript objects and how React uses the Virtual DOM to batch lightning-fast UI updates.',
    visualizerId: 'vdom',
    overview: `JSX (JavaScript XML) is a syntax extension for JavaScript that allows you to write HTML-like markup inside JS code.

Under the hood, JSX is not HTML. A transpiler like Babel or SWC converts JSX tags into \`React.createElement()\` calls (or the modern JSX runtime \`_jsx()\`).

These function calls return plain JavaScript objects called **Virtual DOM (VDOM) elements**. Instead of directly manipulating the slow browser DOM for every tiny change, React keeps this lightweight in-memory tree, compares it against the previous render (a process known as **Reconciliation / Diffing**), and calculates the minimal batch of real DOM mutations necessary.`,
    keyConcepts: [
      'JSX tags transform into React.createElement() object representations.',
      'JSX must return a single root element (or a <React.Fragment> / <>).</>',
      'Use className instead of class, and htmlFor instead of for because class & for are reserved JS keywords.',
      'Virtual DOM minimizes expensive browser reflows and repaints through smart batching.',
      'Curly braces { } allow you to embed any valid JavaScript expression inside JSX.'
    ],
    codeExample: {
      title: 'JSX vs What React Actually Sees',
      code: `// 1. What you write in JSX:
function Greeting({ name, isPremium }) {
  return (
    <div className="card">
      <h2>Welcome, {name}!</h2>
      {isPremium && <span className="badge">VIP Member</span>}
    </div>
  );
}

// 2. What it compiles into (Babel / JSX Runtime):
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";

function GreetingCompiled({ name, isPremium }) {
  return _jsxs("div", {
    className: "card",
    children: [
      _jsxs("h2", { children: ["Welcome, ", name, "!"] }),
      isPremium && _jsx("span", { className: "badge", children: "VIP Member" })
    ]
  });
  // Output is a plain JS Object: { type: 'div', props: { className: 'card', children: [...] } }
}`,
      explanation: 'Notice how JSX is just syntactic sugar for creating nested JavaScript objects. When state changes, React constructs a new JS object tree and computes the difference!'
    },
    antiPattern: {
      bad: `// ❌ Mutating the DOM directly inside React components
function BadComponent() {
  const handleClick = () => {
    document.getElementById("status").innerText = "Updated!"; // Violates React's declarative model!
  };
  return <button onClick={handleClick}>Click</button>;
}`,
      good: `// ✅ Declarative state updates through React
function GoodComponent() {
  const [status, setStatus] = useState("Idle");
  return (
    <div>
      <p>Status: {status}</p>
      <button onClick={() => setStatus("Updated!")}>Update</button>
    </div>
  );
}`,
      explanation: 'Direct DOM manipulation bypasses the Virtual DOM diffing process and leads to race conditions, hydration errors, and out-of-sync UI states.'
    },
    interviewQuestions: [
      {
        q: 'Why can JSX only return a single root element?',
        a: 'Because JSX compiles to a function call (React.createElement). A function in JavaScript can only return a single value/object. React.Fragment lets you group children without adding extra wrapper nodes to the DOM.'
      },
      {
        q: 'Does the Virtual DOM make React faster than vanilla JavaScript?',
        a: 'Not inherently faster than perfectly hand-optimized vanilla JS. However, it provides a predictable declarative programming model while guaranteeing sufficient speed by batching mutations and avoiding unnecessary DOM layout recalculations.'
      }
    ]
  },

  {
    id: 'b2-components-props',
    level: 'beginner',
    levelName: 'Beginner: Core Fundamentals',
    title: 'Components & Props Flow',
    badge: 'Architecture',
    time: '10 min read',
    summary: 'Learn how to build reusable UI bricks with functional components, children composition, and unidirectional data flow.',
    visualizerId: 'props-flow',
    overview: `React applications are structured as a tree of independent, composable **Components**.

Think of components like custom HTML tags or LEGO bricks. A component accepts inputs called **Props** (short for properties) and returns a React element describing what should appear on the screen.

In React, data follows a strict **Unidirectional (Top-to-Bottom) Data Flow**. Parents pass data down to children via props. Children can never directly modify their parent's props — props are strictly read-only (immutable)! To communicate upwards, parent components pass down callback functions.`,
    keyConcepts: [
      'Components must be named with PascalCase (e.g. UserCard, not userCard) so React distinguishes them from native HTML tags.',
      'Props are read-only: A component must act like a pure function with respect to its props.',
      'The children prop allows component composition (passing JSX inside <Parent>Here</Parent>).',
      'Use object destructuring in the component parameter list for clean, self-documenting code.',
      'Default props can be defined using standard JavaScript default parameters.'
    ],
    codeExample: {
      title: 'Children Composition & Prop Callbacks',
      code: `// 1. Reusable Card with 'children' slot
function Card({ title, variant = "default", children, onAction }) {
  return (
    <div className={\`card card-\${variant}\`}>
      <div className="card-header">
        <h3>{title}</h3>
      </div>
      <div className="card-body">
        {children} {/* Slot for nested JSX */}
      </div>
      {onAction && (
        <button onClick={onAction} className="btn-action">
          Take Action
        </button>
      )}
    </div>
  );
}

// 2. Parent composing the Card
export default function Dashboard() {
  const handleAlert = () => alert("Card clicked from parent!");

  return (
    <Card title="Storage Usage" variant="highlight" onAction={handleAlert}>
      <p>You have used <strong>45.2 GB</strong> of 100 GB.</p>
      <div className="progress-bar" style={{ width: '45%' }} />
    </Card>
  );
}`,
      explanation: 'Component composition using props.children avoids brittle "prop drilling" by letting the parent inject whatever content it wants.'
    },
    antiPattern: {
      bad: `// ❌ Modifying props directly inside a child component
function UserProfile(props) {
  props.user.age = 25; // NEVER mutate props! Breaks pure function guarantee!
  return <div>{props.user.name} ({props.user.age})</div>;
}`,
      good: `// ✅ Treat props as immutable; notify parent via callbacks
function UserProfile({ user, onAgeChange }) {
  return (
    <div>
      <span>{user.name} ({user.age})</span>
      <button onClick={() => onAgeChange(user.id, user.age + 1)}>
        Birthday!
      </button>
    </div>
  );
}`,
      explanation: 'Mutating props creates silent bugs where other components referencing the same object reflect changes unpredictably without re-rendering.'
    },
    interviewQuestions: [
      {
        q: 'What is "Prop Drilling" and how do you resolve it?',
        a: 'Prop drilling occurs when you pass props through several layers of intermediate components that do not need the data themselves just to reach a deeply nested child. Solutions include component composition (using children slots) or React Context / state management libraries.'
      },
      {
        q: 'Why must React component names start with a capital letter?',
        a: 'JSX compilers treat tags starting with lowercase (like <div> or <span>) as built-in HTML DOM elements. Tags starting with a capital letter (like <Button />) are treated as user-defined React component references.'
      }
    ]
  },

  {
    id: 'b3-state-usestate',
    level: 'beginner',
    levelName: 'Beginner: Core Fundamentals',
    title: 'State & useState Hook',
    badge: 'Core Reactivity',
    time: '12 min read',
    summary: 'Master the engine of React reactivity: useState, state snapshot mental models, updater functions, and immutability rules.',
    visualizerId: 'state-batching',
    overview: `While props pass data down from parents, **State** is a component's personal memory. It allows components to remember information (like input text, open/close drawer states, or shopping cart items) and update the screen when that information changes.

The \`useState\` hook takes an initial state value and returns an array with exactly two elements:
1. The **current state snapshot**
2. A **state setter function** that notifies React to schedule a re-render.

Crucial Mental Model: **State behaves like a snapshot!** Setting state does not immediately mutate the current variable in the middle of executing your handler; it requests a re-render for the NEXT render cycle with the updated value.`,
    keyConcepts: [
      'Never mutate state directly (e.g., state.count++). Always use the setter function.',
      'State updates are batched together automatically by React to ensure high performance.',
      'When the new state depends on the previous state, always pass an updater function: setCount(prev => prev + 1).',
      'For complex objects or arrays, always copy with the spread operator: setUser(prev => ({ ...prev, name: "Sam" })).',
      'Initial state can be computed lazily by passing a function: useState(() => computeExpensiveDefault()).'
    ],
    codeExample: {
      title: 'State Snapshot vs Functional Updater',
      code: `import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  // ⚠️ If you call setCount three times without updater:
  const brokenIncrementTriple = () => {
    // In this snapshot, 'count' is e.g. 0
    setCount(count + 1); // setCount(0 + 1)
    setCount(count + 1); // setCount(0 + 1)
    setCount(count + 1); // setCount(0 + 1)
    // Result on screen: count increases by only 1, not 3!
  };

  // ✅ Correct way using functional updater:
  const correctIncrementTriple = () => {
    // Queues pending updates in React's internal queue
    setCount(prev => prev + 1); // 0 -> 1
    setCount(prev => prev + 1); // 1 -> 2
    setCount(prev => prev + 1); // 2 -> 3
    // Result on screen: count increases by 3!
  };

  return (
    <div className="counter-box">
      <h3>Count: {count}</h3>
      <button onClick={correctIncrementTriple}>+3 Increment</button>
    </div>
  );
}`,
      explanation: 'Functional updaters ensure you always read from the freshest queued state value rather than the static snapshot captured in the closure.'
    },
    antiPattern: {
      bad: `// ❌ Direct array mutation
const [items, setItems] = useState(['Apple', 'Banana']);
const addItem = () => {
  items.push('Orange'); // MUTATION! Array reference does not change!
  setItems(items);      // React sees items === items and skips re-render!
};`,
      good: `// ✅ Creating a new array reference (Immutability)
const [items, setItems] = useState(['Apple', 'Banana']);
const addItem = () => {
  setItems(prev => [...prev, 'Orange']); // Fresh array reference created!
};`,
      explanation: 'React compares state updates using Object.is() shallow reference equality. If the reference is unchanged, React assumes nothing has altered.'
    },
    interviewQuestions: [
      {
        q: 'What is automatic batching in React?',
        a: 'Automatic batching groups multiple state updates triggered within event handlers, timeouts, promises, or async functions into a single re-render, preventing unnecessary intermediate UI paints.'
      },
      {
        q: 'Why does console.log(state) show the old value immediately after calling setState?',
        a: 'State updates are asynchronous and state behaves like a snapshot of the current render. The setter requests a new render for the future; it does not mutate the variable in the currently executing closure.'
      }
    ]
  },

  {
    id: 'b4-events-forms',
    level: 'beginner',
    levelName: 'Beginner: Core Fundamentals',
    title: 'Event Handling & Forms',
    badge: 'Interactivity',
    time: '9 min read',
    summary: 'Handle clicks, inputs, forms, and understand SyntheticEvents and Controlled vs Uncontrolled inputs.',
    visualizerId: 'events-forms',
    overview: `React wraps the browser's native events in a cross-browser wrapper called **SyntheticEvent**. This ensures identical event properties across Safari, Chrome, Firefox, and Edge.

In modern React web development, inputs are typically **Controlled Components**, meaning the input's current value is driven by React state and updated via an \`onChange\` handler. This gives you absolute control to validate, format, or disable inputs in real time.`,
    keyConcepts: [
      'Event names in React use camelCase (onClick, onChange, onSubmit) instead of lowercase (onclick).',
      'Pass event handler function references: onClick={handleClick}, NOT onClick={handleClick()} (which calls it immediately on render).',
      'Use e.preventDefault() to prevent full browser page reloads on <form onSubmit>.',
      'Controlled inputs have value={state} and onChange={e => setState(e.target.value)}.',
      'Uncontrolled inputs use useRef to read DOM values directly when state is not strictly required.'
    ],
    codeExample: {
      title: 'Controlled Form with Validation',
      code: `import { useState } from 'react';

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Stop page reload!
    if (!formData.email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    setError('');
    alert(\`Logged in as \${formData.email}\`);
  };

  return (
    <form onSubmit={handleSubmit} className="form-card">
      <input
        type="email"
        name="email"
        placeholder="Enter email"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Enter password"
        value={formData.password}
        onChange={handleChange}
      />
      {error && <p className="error-text">{error}</p>}
      <button type="submit">Log In</button>
    </form>
  );
}`,
      explanation: 'A single handleChange handler dynamically handles multiple input fields using computed property keys ([name]: value).'
    },
    antiPattern: {
      bad: `// ❌ Invoking function during render
<button onClick={alert("Welcome!")}>Click Me</button>
// Runs automatically every time the component renders, causing popups!`,
      good: `// ✅ Passing function reference or inline callback
<button onClick={() => alert("Welcome!")}>Click Me</button>`,
      explanation: 'Always pass a function reference or an arrow function wrapper so the event only fires upon user interaction.'
    },
    interviewQuestions: [
      {
        q: 'What is a SyntheticEvent in React?',
        a: 'A SyntheticEvent is a cross-browser wrapper around the native browser event. It has the same interface as the native event (including stopPropagation() and preventDefault()) but normalizes inconsistencies across different browsers.'
      },
      {
        q: 'What is the difference between controlled and uncontrolled inputs?',
        a: 'In a controlled input, form data is handled by React component state. In an uncontrolled input, form data is handled directly by the DOM itself and accessed via refs.'
      }
    ]
  },

  {
    id: 'b5-lists-keys',
    level: 'beginner',
    levelName: 'Beginner: Core Fundamentals',
    title: 'Lists, Rendering & The "Key" Rule',
    badge: 'Algorithms',
    time: '11 min read',
    summary: 'Master array transformation with map() and discover why unique keys prevent subtle UI corruption during list mutations.',
    visualizerId: 'lists-keys',
    overview: `In React, displaying lists of data is done using standard JavaScript array methods like \`.map()\` and \`.filter()\`.

However, whenever you render a list of elements, React mandates a special prop: **\`key\`**.

Keys give elements in an array a stable identity. During reconciliation, React matches keys between the old and new tree to determine whether an item was **inserted, deleted, or reordered**. Without stable keys, React defaults to matching by index, which can cause inputs to retain wrong values, broken animations, and massive re-render overhead!`,
    keyConcepts: [
      'Keys must be unique among siblings (not globally unique across the whole app).',
      'Keys must never change over time — never use Math.random() as a key!',
      'Avoid using array indexes as keys if the list can be filtered, sorted, or mutated.',
      'Use stable database IDs (like item.id or uuid) for keys.',
      'React strips the key prop from component props; you cannot read props.key inside a child component.'
    ],
    codeExample: {
      title: 'Dynamic Filtering & Rendering Lists',
      code: `import { useState } from 'react';

const USERS = [
  { id: 'usr-1', name: 'Alice Smith', role: 'Engineer' },
  { id: 'usr-2', name: 'Bob Jones', role: 'Designer' },
  { id: 'usr-3', name: 'Charlie Kim', role: 'Engineer' },
];

export default function UserList() {
  const [filter, setFilter] = useState('All');

  const filteredUsers = filter === 'All' 
    ? USERS 
    : USERS.filter(u => u.role === filter);

  return (
    <div>
      <div className="filter-tabs">
        {['All', 'Engineer', 'Designer'].map(r => (
          <button key={r} onClick={() => setFilter(r)} className={filter === r ? 'active' : ''}>
            {r}
          </button>
        ))}
      </div>

      <ul className="user-cards">
        {filteredUsers.map(user => (
          // ✅ Using unique, stable id as key
          <li key={user.id} className="user-item">
            <strong>{user.name}</strong> <span>({user.role})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
      explanation: 'By using user.id as key, React preserves component state and smoothly animates insertions and deletions when switching filters.'
    },
    antiPattern: {
      bad: `// ❌ Using array index as key when list can be reordered or deleted
{todos.map((todo, index) => (
  <TodoItem key={index} todo={todo} />
))}
// If you delete item 0, item 1 becomes index 0, causing wrong input state to persist!`,
      good: `// ✅ Using persistent unique ID
{todos.map((todo) => (
  <TodoItem key={todo.id} todo={todo} />
))}`,
      explanation: 'When an item is removed from the top, index-based keys make React believe all items changed and re-uses DOM nodes inappropriately.'
    },
    interviewQuestions: [
      {
        q: 'Why should you avoid Math.random() as a key?',
        a: 'Every time the component renders, Math.random() generates a brand new key. React concludes that every single element was destroyed and replaced with a new one, destroying all internal component state and causing terrible performance.'
      },
      {
        q: 'Can two siblings in different lists have the same key?',
        a: 'Yes. Keys only need to be unique among sibling elements in the same array, not globally across the entire application.'
      }
    ]
  },

  // ==========================================
  // LEVEL 2: INTERMEDIATE HOOKS & PATTERNS
  // ==========================================
  {
    id: 'i1-useeffect-lifecycle',
    level: 'intermediate',
    levelName: 'Intermediate: Hooks & Patterns',
    title: 'useEffect & Side Effect Lifecycles',
    badge: 'Crucial Hook',
    time: '14 min read',
    summary: 'Demystify the synchronization engine: dependencies, mounting, unmounting, cleanup functions, and avoiding infinite loops.',
    visualizerId: 'effect-timeline',
    overview: `\`useEffect\` allows you to synchronize your component with an external system (such as fetching data from an API, subscribing to WebSockets, setting timers, or interacting with third-party browser APIs).

Unlike class components with separate \`componentDidMount\`, \`componentDidUpdate\`, and \`componentWillUnmount\`, \`useEffect\` unifies all three into a single declarative API governed by its **Dependency Array**:
- No dependencies: Runs after EVERY single render.
- Empty array \`[]\`: Runs ONCE when the component mounts.
- Array with dependencies \`[a, b]\`: Runs on mount and whenever \`a\` or \`b\` change by reference equality (\`Object.is\`).

Crucially, you can return a **Cleanup Function** from your effect. This cleanup function runs right before the effect re-runs and when the component unmounts.`,
    keyConcepts: [
      'Effects run AFTER the browser paints the screen, preventing UI blocking.',
      'Always clean up subscriptions, event listeners, intervals, and abort ongoing network requests.',
      'In React StrictMode (development), React mounts, unmounts, and remounts components to test your cleanup logic.',
      'Do not use useEffect for data transformations that can be computed during render.',
      'Never omit reactive values that you use inside the effect from the dependency array.'
    ],
    codeExample: {
      title: 'Network Fetch with AbortController Cleanup',
      code: `import { useState, useEffect } from 'react';

export default function UserProfile({ userId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Create AbortController to cancel stale network requests
    const controller = new AbortController();
    setLoading(true);

    fetch(\`https://api.example.com/users/\${userId}\`, { signal: controller.signal })
      .then(res => res.json())
      .then(user => {
        setData(user);
        setLoading(false);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error(err);
          setLoading(false);
        }
      });

    // 2. Return Cleanup Function!
    return () => {
      // Cancels request if userId changes before response arrives or component unmounts
      controller.abort();
    };
  }, [userId]); // Only re-runs when userId changes

  if (loading) return <div className="spinner">Loading user...</div>;
  return <div>Welcome, {data?.name}</div>;
}`,
      explanation: 'The AbortController cleanup prevents race conditions where an earlier network request finishes after a later one, displaying outdated data.'
    },
    antiPattern: {
      bad: `// ❌ Setting state unconditionally without dependencies causes an infinite loop!
useEffect(() => {
  setCount(count + 1); // Triggers render -> triggers effect -> triggers render... BOOM!
});`,
      good: `// ✅ Controlled with proper dependencies or functional state
useEffect(() => {
  const timer = setInterval(() => {
    setCount(prev => prev + 1);
  }, 1000);
  return () => clearInterval(timer);
}, []); // Empty array: setup once on mount!`,
      explanation: 'An effect without a dependency array executes after every render. If it sets state, it forces an endless render loop.'
    },
    interviewQuestions: [
      {
        q: 'Why does React 18 & 19 run effects twice in development mode?',
        a: 'React StrictMode intentionally simulates an immediate unmount and remount in development to verify that your effect cleanup functions properly tear down subscriptions, intervals, and event listeners.'
      },
      {
        q: 'When does the cleanup function of an effect execute?',
        a: 'It runs immediately before the effect is executed again on an update, and when the component is unmounting from the DOM.'
      }
    ]
  },

  {
    id: 'i2-useref-dom',
    level: 'intermediate',
    levelName: 'Intermediate: Hooks & Patterns',
    title: 'useRef: DOM Access & Persistent Values',
    badge: 'Under the Hood',
    time: '9 min read',
    summary: 'Store mutable values across renders without triggering UI updates, and directly interact with DOM nodes.',
    visualizerId: 'ref-vs-state',
    overview: `\`useRef\` returns a mutable ref object whose \`.current\` property is initialized to the passed argument.

The key distinction between \`useRef\` and \`useState\`:
- Updating state triggers a component re-render.
- Modifying \`ref.current\` **DOES NOT trigger a re-render**!

This makes \`useRef\` perfect for two primary jobs:
1. **Holding DOM references** (e.g. focusing an input, scrolling to a section, measuring element dimensions).
2. **Storing mutable instance variables** that persist across renders without causing UI flicker (e.g. \`intervalId\`, previous props, or render counts).`,
    keyConcepts: [
      'Modifying ref.current is synchronous and instant.',
      'Never read or write ref.current during the render phase (JSX return); do it in effects or event handlers.',
      'Passing ref={myRef} to an HTML element attaches the real DOM node to myRef.current after mount.',
      'In React 19, you can pass ref directly as a standard prop without forwardRef()!'
    ],
    codeExample: {
      title: 'Stopwatch with useRef for Interval Storage',
      code: `import { useState, useRef } from 'react';

export default function Stopwatch() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  
  // Stored in ref so clearing timer does not trigger extra renders
  const timerRef = useRef(null);
  const inputRef = useRef(null);

  const start = () => {
    if (isRunning) return;
    setIsRunning(true);
    timerRef.current = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
  };

  const stop = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    // Focus an input using DOM ref
    inputRef.current?.focus();
  };

  return (
    <div>
      <h2>Elapsed: {seconds}s</h2>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
      <input ref={inputRef} placeholder="Add lap notes..." />
    </div>
  );
}`,
      explanation: 'timerRef holds the numeric interval ID. If this were in state, calling setTimerId would cause an unnecessary extra render!'
    },
    antiPattern: {
      bad: `// ❌ Writing to ref.current during rendering
function BadRef({ value }) {
  const countRef = useRef(0);
  countRef.current += 1; // SIDE EFFECT IN RENDER! Breaks concurrent rendering!
  return <div>{countRef.current}</div>;
}`,
      good: `// ✅ Write to refs inside useEffect or event handlers
function GoodRef({ value }) {
  const countRef = useRef(0);
  useEffect(() => {
    countRef.current += 1; // Pure and predictable
  });
  return <div>Rendered</div>;
}`,
      explanation: 'React render functions must be pure. Writing to refs during render causes unpredictable bugs during concurrent mode interruptions.'
    },
    interviewQuestions: [
      {
        q: 'What is the fundamental difference between useState and useRef?',
        a: 'useState triggers a re-render when its setter is called and produces an immutable snapshot for each render. useRef preserves a mutable reference (.current) that persists across renders without triggering a re-render.'
      },
      {
        q: 'How does React 19 simplify refs compared to earlier versions?',
        a: 'In React 19, forwardRef() is no longer required for function components! You can pass ref as a standard prop directly into your child components.'
      }
    ]
  },

  {
    id: 'i3-custom-hooks',
    level: 'intermediate',
    levelName: 'Intermediate: Hooks & Patterns',
    title: 'Custom Hooks Architecture',
    badge: 'Code Reusability',
    time: '13 min read',
    summary: 'Extract complex stateful logic into clean, testable, and reusable custom hooks adhering to the Rules of Hooks.',
    visualizerId: 'custom-hooks',
    overview: `Custom Hooks are JavaScript functions whose names start with \`use\` (e.g. \`useDebounce\`, \`useLocalStorage\`, \`useWindowSize\`) that can call other React hooks.

They are the primary mechanism in modern React for **sharing stateful logic** between components without duplicating code or creating messy Higher-Order Components (HOCs).

Crucial Insight: Each call to a custom hook has completely independent state! Two components calling \`useCounter()\` do not share the same counter value; they each receive their own isolated instance of the hook's internal \`useState\`.`,
    keyConcepts: [
      'Custom hook names MUST begin with "use" (e.g. useOnlineStatus) so ESLint can enforce Hook Rules.',
      'Custom hooks share stateful logic, NOT state itself. Each component gets an isolated state tree.',
      'Rules of Hooks: Only call hooks at the top level of your component or custom hook (never inside loops, conditions, or nested functions).',
      'Return either an object { data, loading, error } or a tuple [value, setValue] for clean ergonomics.'
    ],
    codeExample: {
      title: 'useDebounce & useLocalStorage Hooks',
      code: `import { useState, useEffect } from 'react';

// 1. useLocalStorage: Persistent State Hook
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (e) {
      console.error(e);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

// 2. useDebounce: Delay rapid value updates (e.g. search inputs)
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}`,
      explanation: 'useLocalStorage seamlessly syncs state with browser storage, while useDebounce prevents firing an API query on every single keystroke.'
    },
    antiPattern: {
      bad: `// ❌ Calling a hook conditionally
function BadSearch({ shouldSave }) {
  if (shouldSave) {
    const [saved, setSaved] = useState(false); // CRASH! Hook called conditionally!
  }
}`,
      good: `// ✅ Hooks always execute at top level in the exact same order
function GoodSearch({ shouldSave }) {
  const [saved, setSaved] = useState(false);
  // Apply condition in logic, not hook declaration
}`,
      explanation: 'React relies on the call order of hooks across renders to match up internal fiber linked lists. Conditional hooks break this index mapping.'
    },
    interviewQuestions: [
      {
        q: 'Do two components using the same custom hook share state?',
        a: 'No. Custom hooks share stateful logic, not the state itself. Every time you call a custom hook, an independent set of state variables and effects is allocated for that component.'
      },
      {
        q: 'Why must hooks only be called at the top level?',
        a: 'React keeps track of state by indexing the sequential order in which hooks are called during render. Calling hooks inside conditions or loops would disrupt this order across subsequent renders.'
      }
    ]
  },

  {
    id: 'i4-context-api',
    level: 'intermediate',
    levelName: 'Intermediate: Hooks & Patterns',
    title: 'Context API & Global State',
    badge: 'State Architecture',
    time: '11 min read',
    summary: 'Broadcast global data like themes, user authentication, and locale across the entire component tree without prop drilling.',
    visualizerId: 'context-demo',
    overview: `The React Context API solves the "prop drilling" problem by providing a way to share values between components without explicitly passing props through every level of the tree.

Context is created using \`createContext()\`, provided via \`<Context.Provider value={...}>\`, and consumed anywhere down the tree via the \`useContext()\` hook.

However, Context is best reserved for **infrequently updated global state** (like user auth, current theme, or localization). If you put high-frequency state (like keystrokes or mouse coordinates) into context, every component that consumes that context will re-render on every tick unless split strategically!`,
    keyConcepts: [
      'createContext(defaultValue) creates the context object.',
      'The Provider component accepts a "value" prop and wraps the subtree.',
      'Any component calling useContext(MyContext) automatically subscribes to changes.',
      'Split state and dispatch contexts to prevent consumers from re-rendering when only actions are needed.',
      'Do not overuse Context for local component communication; composition with children is often cleaner.'
    ],
    codeExample: {
      title: 'Theme Context with Custom Hook Provider',
      code: `import { createContext, useContext, useState, useMemo } from 'react';

// 1. Create Context
const ThemeContext = createContext(null);

// 2. Custom Provider Component
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Memoize value so consumers don't re-render on unrelated parent updates
  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. Ergonomic Consumer Hook
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}`,
      explanation: 'Exposing a custom useTheme() hook encapsulates validation and prevents accidental consumption outside the Provider.'
    },
    antiPattern: {
      bad: `// ❌ Passing a new object literal directly to Provider value without useMemo
<ThemeContext.Provider value={{ theme, toggleTheme }}>
  {/* Every time the parent re-renders, a new object reference is created,
      forcing ALL consuming children to re-render! */}
</ThemeContext.Provider>`,
      good: `// ✅ Memoize provider value object
const value = useMemo(() => ({ theme, toggleTheme }), [theme]);
<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>`,
      explanation: 'Object literals in value create a new memory address on every render, triggering re-render cascades down the consumer tree.'
    },
    interviewQuestions: [
      {
        q: 'Does React Context replace external state management libraries like Redux or Zustand?',
        a: 'Context is a dependency injection tool, not a full state management library. It lacks built-in selector optimizations, middleware, or granular subscription diffing for high-frequency state updates.'
      },
      {
        q: 'How do you prevent unnecessary re-renders when using Context?',
        a: 'Split unrelated contexts (e.g., AuthContext vs ThemeContext), separate State from Dispatch into two distinct contexts, and memoize provider values with useMemo.'
      }
    ]
  },

  // ==========================================
  // LEVEL 3: ADVANCED PERFORMANCE & ARCHITECTURE
  // ==========================================
  {
    id: 'a1-rerender-mechanics',
    level: 'advanced',
    levelName: 'Advanced: Performance & Architecture',
    title: 'Re-render Mechanics & Profiling',
    badge: 'Performance',
    time: '15 min read',
    summary: 'Discover the exact rules of why components re-render, how React re-renders cascading children, and how to eliminate wasted renders.',
    visualizerId: 'rerender-profiler',
    overview: `A common misconception is that components only re-render when their props change.

In reality, **a component re-renders when:**
1. Its own internal state changes (\`useState\` / \`useReducer\`).
2. Its consumed Context value updates.
3. **Its parent component re-renders!** By default, when a parent re-renders, React recursively re-renders all its children, regardless of whether their props changed!

React does this deliberately because checking props on every child can sometimes be more expensive than just executing lightweight JSX render functions. However, for heavy subtrees, we can opt into memoization via \`React.memo\`.`,
    keyConcepts: [
      'Parent re-renders trigger children re-renders by default.',
      'React.memo(Component) does a shallow comparison (Object.is) of incoming props.',
      'If you pass inline functions or object literals to a memoized component, shallow comparison fails because new references are generated every render.',
      'Moving state down to where it is needed often eliminates the need for complex memoization.'
    ],
    codeExample: {
      title: 'Fixing Broken React.memo with useCallback',
      code: `import React, { useState, useCallback } from 'react';

// 1. Memoized Child Component
const HeavyList = React.memo(function HeavyList({ onItemClick }) {
  console.log("HeavyList rendered! (Expensive calculation)");
  return (
    <div>
      <button onClick={() => onItemClick(1)}>Select Item 1</button>
    </div>
  );
});

export default function Parent() {
  const [count, setCount] = useState(0);
  const [selectedId, setSelectedId] = useState(null);

  // ⚠️ If passed inline: onItemClick={() => setSelectedId(id)}
  // A new function reference is created every time count increments,
  // causing HeavyList to re-render despite React.memo!

  // ✅ useCallback preserves the function reference between renders
  const handleClick = useCallback((id) => {
    setSelectedId(id);
  }, []);

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Counter: {count}</button>
      <HeavyList onItemClick={handleClick} />
    </div>
  );
}`,
      explanation: 'useCallback keeps the referential identity of handleClick stable, allowing React.memo to successfully bail out of re-rendering HeavyList.'
    },
    antiPattern: {
      bad: `// ❌ Prematurely wrapping every single component and function in memo/useCallback
const SimpleText = React.memo(({ text }) => <span>{text}</span>);
// The overhead of shallow prop comparison is more expensive than rendering a <span>!`,
      good: `// ✅ Memoize only when:
// 1. The component renders an expensive subtree or large list.
// 2. The component re-renders frequently with the same props.`,
      explanation: 'React.memo has a memory and computation cost for prop diffing. Profile your app with React DevTools before optimizing!'
    },
    interviewQuestions: [
      {
        q: 'What triggers a component re-render in React?',
        a: '1. State updates within the component. 2. Updates to a context consumed by the component. 3. Re-rendering of its parent component (unless wrapped in React.memo with unchanged props).'
      },
      {
        q: 'How does React.memo determine if props have changed?',
        a: 'By default, it performs a shallow comparison of previous and next props using Object.is. You can optionally supply a custom comparison function as the second argument: React.memo(Component, arePropsEqual).'
      }
    ]
  },

  {
    id: 'a2-usememo-usecallback',
    level: 'advanced',
    levelName: 'Advanced: Performance & Architecture',
    title: 'useMemo & useCallback Masterclass',
    badge: 'Optimization',
    time: '12 min read',
    summary: 'Cache expensive computations and stabilize callback references with rigorous benchmarks and the React Compiler future.',
    visualizerId: 'usememo-bench',
    overview: `\`useMemo\` and \`useCallback\` are caching hooks designed to optimize performance:
- \`useMemo(() => computeValue(a, b), [a, b])\` caches the **result of a calculation**.
- \`useCallback(fn, [deps])\` is equivalent to \`useMemo(() => fn, [deps])\` and caches a **function instance**.

Use \`useMemo\` when:
1. You have a genuinely expensive calculation (e.g. sorting/filtering thousands of records, complex math).
2. You need to pass an object or array to a memoized child component or an effect dependency array without breaking referential equality.`,
    keyConcepts: [
      'useMemo caches calculated values; useCallback caches function definitions.',
      'Both rely on a dependency array to invalidate their cache.',
      'In React 19, the React Compiler automatically memoizes components and values at build time, reducing the need for manual useMemo/useCallback!',
      'Never use useMemo for trivial operations like string concatenation or simple arithmetic.'
    ],
    codeExample: {
      title: 'Filtering 10,000 Records with useMemo',
      code: `import { useState, useMemo } from 'react';

export default function DataExplorer({ items }) {
  const [query, setQuery] = useState('');
  const [theme, setTheme] = useState('dark');

  // 🚀 Without useMemo, this heavy filter runs even when toggling 'theme'!
  const filteredItems = useMemo(() => {
    console.time("heavy-filter");
    const result = items.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase())
    );
    console.timeEnd("heavy-filter");
    return result;
  }, [items, query]); // Only recomputes when items or query change!

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>
        Toggle Theme: {theme}
      </button>
      <p>Found {filteredItems.length} records</p>
    </div>
  );
}`,
      explanation: 'Toggling the theme re-renders DataExplorer, but useMemo reuses the cached filteredItems without re-filtering 10,000 items.'
    },
    antiPattern: {
      bad: `// ❌ Memoizing primitive calculations
const total = useMemo(() => price * quantity, [price, quantity]);
// Allocation of useMemo hook is 100x slower than multiplying two numbers!`,
      good: `// ✅ Direct calculation for cheap operations
const total = price * quantity;`,
      explanation: 'Simple operations execute in nanoseconds; wrapping them in useMemo adds unnecessary overhead.'
    },
    interviewQuestions: [
      {
        q: 'What is the relationship between useMemo and useCallback?',
        a: 'useCallback(fn, deps) is syntactic sugar for useMemo(() => fn, deps). useCallback memoizes the function definition itself, while useMemo memoizes the returned result of executing a function.'
      },
      {
        q: 'How does the React Compiler affect useMemo and useCallback?',
        a: 'The React Compiler analyzes JavaScript semantics at build time and automatically applies fine-grained memoization to components, props, and values, eliminating the manual mental burden of dependency arrays.'
      }
    ]
  },

  {
    id: 'a3-usereducer-architecture',
    level: 'advanced',
    levelName: 'Advanced: Performance & Architecture',
    title: 'useReducer & State Machines',
    badge: 'Complex State',
    time: '14 min read',
    summary: 'Manage complex, multi-field state transitions with predictable reducer functions, actions, and finite state machine principles.',
    visualizerId: 'usereducer-bank',
    overview: `When component state involves multiple sub-values, complex interdependent validation, or predictable transition flows, \`useReducer\` is vastly superior to multiple disjointed \`useState\` calls.

Borrowing patterns from Redux and functional programming:
1. **State**: The single source of truth object.
2. **Action**: A plain JS object describing what happened (\`{ type: 'DEPOSIT', payload: 100 }\`).
3. **Reducer**: A pure function \`(state, action) => newState\` with zero side effects.
4. **Dispatch**: A stable function to fire actions.

Because \`dispatch\` never changes reference between renders, you can safely pass it down the tree without wrapping it in \`useCallback\`.`,
    keyConcepts: [
      'Reducers must be pure functions with no side effects (no API calls or timers inside the reducer).',
      'The dispatch function has a guaranteed stable identity across all renders.',
      'Great for modeling Finite State Machines (e.g. idle -> loading -> success / error).',
      'Pairs perfectly with useContext for global state architectures without third-party libraries.'
    ],
    codeExample: {
      title: 'Shopping Cart Reducer Machine',
      code: `import { useReducer } from 'react';

const initialState = { items: [], total: 0 };

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const exists = state.items.find(i => i.id === action.payload.id);
      const newItems = exists
        ? state.items.map(i => i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i)
        : [...state.items, { ...action.payload, qty: 1 }];
      return {
        ...state,
        items: newItems,
        total: state.total + action.payload.price
      };
    }
    case 'REMOVE_ITEM': {
      const item = state.items.find(i => i.id === action.payload);
      return {
        ...state,
        items: state.items.filter(i => i.id !== action.payload),
        total: state.total - (item ? item.price * item.qty : 0)
      };
    }
    case 'CLEAR':
      return initialState;
    default:
      throw new Error(\`Unhandled action type: \${action.type}\`);
  }
}

export default function Cart() {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  return (
    <div>
      <h3>Cart Total: \${state.total}</h3>
      <button onClick={() => dispatch({ type: 'ADD_ITEM', payload: { id: 1, name: 'Shoes', price: 80 } })}>
        Add Shoes ($80)
      </button>
      <button onClick={() => dispatch({ type: 'CLEAR' })}>Clear</button>
    </div>
  );
}`,
      explanation: 'All business logic and calculations reside in the pure cartReducer function, keeping the component JSX remarkably clean and testable.'
    },
    antiPattern: {
      bad: `// ❌ Placing side-effects (like fetch or localStorage) inside the reducer function
function badReducer(state, action) {
  localStorage.setItem("user", JSON.stringify(action.payload)); // Side effect in reducer!
  return { ...state, user: action.payload };
}`,
      good: `// ✅ Reducers must remain purely deterministic
function goodReducer(state, action) {
  return { ...state, user: action.payload };
}
// Perform side effects in event handlers or useEffect!`,
      explanation: 'React can call reducers multiple times during concurrent rendering. Impure reducers produce duplicate side effects and race conditions.'
    },
    interviewQuestions: [
      {
        q: 'When should you choose useReducer over useState?',
        a: 'When you have complex state logic involving multiple sub-values, when the next state depends heavily on the previous state, or when passing dispatch down deep component trees is preferred over passing multiple individual state setters.'
      },
      {
        q: 'Why is dispatch guaranteed to be stable across renders?',
        a: 'React guarantees that the dispatch function identity will remain unchanged throughout the entire lifetime of the component, meaning it does not need to be included in effect or callback dependency arrays.'
      }
    ]
  },

  {
    id: 'a4-portals-error-boundaries',
    level: 'advanced',
    levelName: 'Advanced: Performance & Architecture',
    title: 'Portals & Error Boundaries',
    badge: 'Resilience & DOM',
    time: '11 min read',
    summary: 'Render outside the parent DOM hierarchy for modals and tooltips with Portals, and guard against white-screen crashes with Error Boundaries.',
    visualizerId: 'portals-modal',
    overview: `**React Portals** provide a first-class way to render children into a DOM node that exists outside the DOM hierarchy of the parent component (e.g. appending a modal directly to \`document.body\`), while retaining full React event bubbling and context propagation.

**Error Boundaries** are React components that catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI instead of crashing the entire application into a blank white screen.`,
    keyConcepts: [
      'createPortal(children, domNode) renders JSX into any valid DOM container.',
      'Even though a portal renders elsewhere in the real DOM, events bubble up through the React component tree as normal.',
      'Error Boundaries catch errors in rendering, lifecycle methods, and constructors of children.',
      'Error Boundaries DO NOT catch errors in asynchronous code (setTimeout, fetch) or event handlers (use standard try/catch there).'
    ],
    codeExample: {
      title: 'Portal Modal & Error Boundary',
      code: `import { createPortal } from 'react-dom';
import React from 'react';

// 1. Portal for Modals (renders at document.body)
export function ModalPortal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body // Appended to body directly!
  );
}

// 2. Class-based Error Boundary
export class SafeBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("Crash caught by SafeBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h4>Something went wrong</h4>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false })}>Try Again</button>
        </div>
      );
    }
    return this.props.children;
  }
}`,
      explanation: 'createPortal escapes parent CSS constraints (such as overflow: hidden or z-index stacking contexts) while preserving React hierarchy.'
    },
    antiPattern: {
      bad: `// ❌ Relying on Error Boundaries to catch async fetch errors
useEffect(() => {
  fetch('/api/data').then(res => {
    throw new Error('API failed'); // ErrorBoundary will NOT catch this!
  });
}, []);`,
      good: `// ✅ Handle async errors explicitly in state
useEffect(() => {
  fetch('/api/data')
    .then(res => res.json())
    .catch(err => setError(err.message)); // Stored in component state
}, []);`,
      explanation: 'Error Boundaries only catch errors that occur during the synchronous rendering cycle of the React tree.'
    },
    interviewQuestions: [
      {
        q: 'Does event bubbling work normally across a React Portal?',
        a: 'Yes! Even though the portal renders into a completely different physical DOM node, React events bubble up according to the React Virtual DOM hierarchy, not the native DOM hierarchy.'
      },
      {
        q: 'Why are Error Boundaries still written as class components in React 18/19?',
        a: 'Because hooks like getDerivedStateFromError and componentDidCatch do not have functional hook equivalents yet in the core React library.'
      }
    ]
  },

  // ==========================================
  // LEVEL 4: REACT 19 & NEXT-GEN PATTERNS
  // ==========================================
  {
    id: 'r1-react19-actions',
    level: 'react19',
    levelName: 'React 19 & Next-Gen Patterns',
    title: 'React 19 Actions & useActionState',
    badge: 'React 19 Core',
    time: '12 min read',
    summary: 'Master the brand new React 19 Actions paradigm: asynchronous transitions, pending states, and automatic form resets.',
    visualizerId: 'react19-actions',
    overview: `React 19 introduces **Actions** — functions that use asynchronous transitions to handle form submissions and data mutations automatically.

Before React 19, handling a form required:
- Manual \`useState\` for loading states (\`isSubmitting\`).
- Manual \`useState\` for errors (\`error\`).
- Manual \`e.preventDefault()\`.
- Manual cleanup and synchronization.

With React 19's \`useActionState\` (previously \`useFormState\`), React manages the pending state, errors, optimistic updates, and sequential submission natively!`,
    keyConcepts: [
      'Actions automatically manage isPending state for you.',
      'Native <form action={actionFn}> support in React 19 handles progressive enhancement.',
      'useActionState(actionFn, initialValue) returns [state, formAction, isPending].',
      'Pairs with useFormStatus to query parent form state inside nested submit buttons.'
    ],
    codeExample: {
      title: 'React 19 useActionState Form Action',
      code: `import { useActionState } from 'react';

// 1. Asynchronous Action Function (server or client)
async function updateProfileName(previousState, formData) {
  const newName = formData.get('username');
  
  // Simulate API delay
  await new Promise(r => setTimeout(r, 1000));

  if (!newName || newName.length < 3) {
    return { error: 'Username must be at least 3 characters', name: previousState.name };
  }

  return { error: null, name: newName };
}

export default function ProfileEditor() {
  // 2. React 19 useActionState
  const [state, formAction, isPending] = useActionState(updateProfileName, {
    name: 'Ada Lovelace',
    error: null,
  });

  return (
    <form action={formAction} className="action-form">
      <h3>Current Name: {state.name}</h3>
      <input name="username" placeholder="New username..." disabled={isPending} />
      
      {state.error && <p className="error-banner">{state.error}</p>}

      <button type="submit" disabled={isPending}>
        {isPending ? 'Updating...' : 'Save Profile'}
      </button>
    </form>
  );
}`,
      explanation: 'useActionState eliminates boilerplate: no manual onSubmit preventDefault, no manual setIsPending(true/false) in try/catch/finally blocks!'
    },
    antiPattern: {
      bad: `// ❌ React 18 Boilerplate hell for every single form
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [data, setData] = useState(null);
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try { ... } catch (err) { setError(err); } finally { setLoading(false); }
};`,
      good: `// ✅ React 19 Declarative Action
const [state, formAction, isPending] = useActionState(updateItemAction, null);
<form action={formAction}>...</form>`,
      explanation: 'React 19 Actions automate pending state coordination, batching, and error resilience out of the box.'
    },
    interviewQuestions: [
      {
        q: 'What is an "Action" in React 19?',
        a: 'An Action is an asynchronous transition function passed to <form action> or useActionState. React automatically handles pending states, error boundaries, optimistic updates, and resets during the lifecycle of the action.'
      },
      {
        q: 'What does useActionState return?',
        a: 'It returns a tuple: [state, formAction, isPending], where state is the accumulated result, formAction is the trigger function to pass to form action/onSubmit, and isPending is a boolean indicating whether the async transition is in flight.'
      }
    ]
  },

  {
    id: 'r2-react19-optimistic',
    level: 'react19',
    levelName: 'React 19 & Next-Gen Patterns',
    title: 'useOptimistic: Instant UI Feedback',
    badge: 'React 19 Core',
    time: '11 min read',
    summary: 'Build ultra-snappy interfaces that update immediately before network roundtrips complete, with automatic error rollback.',
    visualizerId: 'react19-optimistic',
    overview: `Users expect interactions to feel instantaneous. When you click "Like" on Twitter or Instagram, the heart lights up immediately without waiting 500ms for the server to reply.

React 19 introduces **\`useOptimistic\`**, a hook that lets you show an optimistic state while an asynchronous action is underway.

If the action completes successfully, the actual server data replaces the optimistic state. If the action fails or rejects, React automatically reverts the UI back to the true state seamlessly!`,
    keyConcepts: [
      'useOptimistic(actualState, updateFn) calculates the current optimistic view.',
      'The optimistic state is displayed only while the associated Action is pending.',
      'If the network request errors, the UI automatically rolls back to the actual state.',
      'Provides a smooth, zero-latency user experience for likes, chat messages, and cart updates.'
    ],
    codeExample: {
      title: 'useOptimistic Chat Message Stream',
      code: `import { useOptimistic, useState, useTransition } from 'react';

export default function OptimisticChat() {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hey there! How is React 19?', sending: false }
  ]);
  const [, startTransition] = useTransition();

  // 1. React 19 useOptimistic Hook
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (currentMessages, newMessageText) => [
      ...currentMessages,
      { id: Date.now(), text: newMessageText, sending: true }
    ]
  );

  const sendMessageAction = async (formData) => {
    const text = formData.get('message');
    
    // Step A: Immediately show message optimistically!
    startTransition(async () => {
      addOptimisticMessage(text);
      
      // Step B: Send to server (mock 1s delay)
      await new Promise(r => setTimeout(r, 1000));
      
      // Step C: Confirm server state
      setMessages(prev => [...prev, { id: Date.now(), text, sending: false }]);
    });
  };

  return (
    <div>
      <ul className="chat-feed">
        {optimisticMessages.map(msg => (
          <li key={msg.id} className={msg.sending ? 'sending-optimistic' : ''}>
            {msg.text} {msg.sending && <small>(Sending...)</small>}
          </li>
        ))}
      </ul>
      <form action={sendMessageAction}>
        <input name="message" placeholder="Type a message..." required />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}`,
      explanation: 'The user sees their message in the feed in 0 milliseconds. If the server throws an error, the temporary message disappears without any manual rollback code!'
    },
    antiPattern: {
      bad: `// ❌ Manual optimistic rollback logic (complex and prone to desync)
setMessages(prev => [...prev, tempMsg]);
try {
  await api.send();
} catch (e) {
  // Manual rollback can fail if other messages were added in the meantime!
  setMessages(prev => prev.filter(m => m.id !== tempMsg.id));
}`,
      good: `// ✅ useOptimistic delegates rollback authority entirely to React transitions!
const [optimisticState, setOptimistic] = useOptimistic(realState, updateFn);`,
      explanation: 'useOptimistic links the temporary view directly to the transition lifecycle, guaranteeing zero desync bugs.'
    },
    interviewQuestions: [
      {
        q: 'What happens if an action errors while an optimistic update is displayed?',
        a: 'When the asynchronous action transition completes (either successfully or with an error), React stops displaying the optimistic state and re-renders with the true underlying actual state, automatically rolling back the UI.'
      },
      {
        q: 'Can useOptimistic be used outside of React Transitions or Actions?',
        a: 'No. useOptimistic must be paired with startTransition or an asynchronous form Action, because React needs a transition boundary to know when the optimistic phase begins and finishes.'
      }
    ]
  },

  {
    id: 'r3-react19-use-hook',
    level: 'react19',
    levelName: 'React 19 & Next-Gen Patterns',
    title: 'The "use()" Hook & Promises',
    badge: 'React 19 Core',
    time: '10 min read',
    summary: 'Read Promises and Context conditionally inside render functions without useEffect or useState boilerplate.',
    visualizerId: 'react19-use',
    overview: `In React 19, the new **\`use()\`** API allows you to read the value of a resource (like a Promise or a Context) directly inside your render function.

Unlike all other React hooks:
- **\`use()\` can be called inside conditions (\`if\`) and loops!**
- When called with a Promise, it integrates with **\`<Suspense>\`** and **\`<ErrorBoundary>\`**, pausing rendering until the promise resolves.

This replaces the traditional pattern of \`useEffect\` + \`useState\` + \`loading\` boolean for fetching data inside components!`,
    keyConcepts: [
      'use(promise) unwraps a promise directly during render and suspends until resolved.',
      'use(context) can be called conditionally inside if statements, unlike useContext.',
      'Must be wrapped in a <Suspense fallback={...}> boundary when reading Promises.',
      'Avoid creating new Promises inside the component render (they would restart every render). Pass cached promises or create them in an external store.'
    ],
    codeExample: {
      title: 'Reading Conditional Context & Promises with use()',
      code: `import { use, Suspense } from 'react';
import { ThemeContext } from './ThemeContext';

// 1. Reading Promise directly with use()
function UserDetails({ userPromise }) {
  // Suspends component until userPromise resolves!
  const user = use(userPromise);
  return <div>Hello, {user.name} ({user.email})</div>;
}

// 2. Reading Context conditionally!
function ConditionalWidget({ showTheme, ThemeContext }) {
  if (showTheme) {
    // ✅ Valid with use()! (Illegal with useContext())
    const theme = use(ThemeContext);
    return <div className={\`box \${theme}\`}>Theme enabled</div>;
  }
  return <div>Default widget</div>;
}

export default function App({ userPromise }) {
  return (
    <Suspense fallback={<div>Loading user profile...</div>}>
      <UserDetails userPromise={userPromise} />
    </Suspense>
  );
}`,
      explanation: 'use() is the only hook in React that can be placed inside if-statements, opening up powerful conditional context consumption.'
    },
    antiPattern: {
      bad: `// ❌ Creating a promise inside render and passing to use()
function BadComponent() {
  const promise = fetch('/api').then(r => r.json()); // Creates a NEW promise every render!
  const data = use(promise); // Infinite suspension loop!
}`,
      good: `// ✅ Pass a cached promise from a loader, cache, or external query store
function GoodComponent({ cachedDataPromise }) {
  const data = use(cachedDataPromise);
}`,
      explanation: 'Creating promises on each render causes infinite suspense loops because each render creates an unsettled new promise reference.'
    },
    interviewQuestions: [
      {
        q: 'How is the use() hook different from standard React hooks?',
        a: 'The use() hook can be called conditionally inside if-statements and loops, whereas standard hooks must always execute unconditionally at the top level.'
      },
      {
        q: 'What happens when use() is passed a pending Promise?',
        a: 'It suspends the rendering of the component, allowing the closest parent <Suspense> boundary to render its fallback UI until the promise resolves.'
      }
    ]
  },

  {
    id: 'r4-fiber-reconciliation',
    level: 'react19',
    levelName: 'React 19 & Next-Gen Patterns',
    title: 'Fiber Architecture & Reconciliation',
    badge: 'Under the Hood',
    time: '15 min read',
    summary: 'Explore the Fiber node engine, render vs commit phases, time-slicing, and how React achieves smooth 60fps concurrency.',
    visualizerId: 'fiber-reconciler',
    overview: `Prior to React 16, React used a synchronous recursive diffing algorithm (the "Stack Reconciler"). If your component tree was deep, reconciliation would block the main browser thread for dozens of milliseconds, causing dropped frames and laggy input responses.

React **Fiber** completely rewrote the internal engine. A Fiber is a plain JavaScript object representing a unit of work.

Key architectural concepts:
1. **Two-Phase Architecture**:
   - **Render Phase (Asynchronous & Interruptible)**: React traverses Fiber nodes, calculates diffs, and can pause work if high-priority user input arrives.
   - **Commit Phase (Synchronous & Uninterruptible)**: React applies the calculated mutations to the actual DOM in one swift batch.
2. **Double Buffering**: React maintains two trees simultaneously: \`current\` (what is on screen) and \`workInProgress\` (what is being built). When done, a single pointer swap displays the new UI!`,
    keyConcepts: [
      'Fiber transforms reconciliation from recursive stack to an interruptible singly-linked list.',
      'Render phase can be paused, aborted, or restarted based on priority.',
      'Commit phase is always fast and synchronous to avoid visual tearing.',
      'Concurrent React uses time-slicing to yield control back to the browser every 5ms.',
      'Double buffering enables smooth atomic swaps without intermediate broken frames.'
    ],
    codeExample: {
      title: 'Fiber Node Structure (Simplified Representation)',
      code: `// Conceptual model of a single Fiber node:
const fiberNode = {
  tag: 0,                   // Component type (Function, Class, HostRoot, etc.)
  key: 'user-list',         // Reconciliation identity
  elementType: MyComponent,// Component function or DOM tag
  stateNode: null,          // Real DOM node or class instance
  
  // Fiber Tree Pointers (Singly Linked List)
  return: parentFiber,      // Parent fiber
  child: firstChildFiber,   // First child fiber
  sibling: nextSiblingFiber,// Next sibling fiber
  
  // Work and State
  memoizedProps: { title: 'Hello' },
  memoizedState: { count: 0 },
  flags: 0b000000000000100, // Placement, Update, Deletion bitmask
  
  // Double Buffering pointer
  alternate: currentFiber,  // Points to corresponding node in current tree
};`,
      explanation: 'Using child, sibling, and return pointers, React traverses the component tree with a simple while loop rather than deep call-stack recursion!'
    },
    antiPattern: {
      bad: `// ❌ Thinking that React does synchronous DOM manipulation on every setState
// Assuming this synchronous code will measure the DOM immediately after setState:
setCount(c => c + 1);
const width = myDivRef.current.offsetWidth; // May NOT reflect new state yet!`,
      good: `// ✅ Use useLayoutEffect if you must measure synchronous DOM mutations before paint
useLayoutEffect(() => {
  const width = myDivRef.current.offsetWidth;
}, [count]);`,
      explanation: 'State setters schedule fiber work in the render queue. To synchronously measure after DOM mutations before browser paint, use useLayoutEffect.'
    },
    interviewQuestions: [
      {
        q: 'What is the difference between the Render Phase and Commit Phase in Fiber?',
        a: 'The Render phase builds the workInProgress tree, computes diffs, is interruptible, and has no side-effects on the real DOM. The Commit phase is synchronous, applies real DOM mutations, and runs layout/effect hooks.'
      },
      {
        q: 'What is Double Buffering in React Fiber?',
        a: 'React keeps two fiber trees: current (matching the screen) and workInProgress (being prepared in memory). Once the workInProgress tree is fully finished, React simply swaps the pointer in the commit phase, preventing partial or glitchy UI rendering.'
      }
    ]
  }
];
