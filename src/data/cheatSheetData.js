export const HOOK_DECISION_TREE = [
  {
    id: 'decision-1',
    goal: 'I need to store and update a piece of data that should trigger a visual re-render when it changes.',
    recommendation: 'useState',
    secondary: 'useReducer (if complex state with multiple sub-values)',
    codeSnippet: `const [count, setCount] = useState(0);
// Update UI on change:
setCount(prev => prev + 1);`,
    rule: 'Use for local UI state: form inputs, toggles, active tabs, modal visibility.'
  },
  {
    id: 'decision-2',
    goal: 'I need to store a mutable value that persists across renders WITHOUT triggering a re-render when modified.',
    recommendation: 'useRef',
    secondary: 'DOM reference storage',
    codeSnippet: `const timerId = useRef(null);
timerId.current = setTimeout(...); // No re-render triggered!`,
    rule: 'Use for interval IDs, previous state references, or direct DOM node measurements.'
  },
  {
    id: 'decision-3',
    goal: 'I need to connect with an external API, setup subscriptions, or synchronize with browser APIs after rendering.',
    recommendation: 'useEffect',
    secondary: 'useLayoutEffect (only if synchronous DOM layout measurement is required before paint)',
    codeSnippet: `useEffect(() => {
  const ws = new WebSocket(url);
  return () => ws.close(); // Clean up!
}, [url]);`,
    rule: 'Never use for calculating derived state that could be computed during render.'
  },
  {
    id: 'decision-4',
    goal: 'I have an expensive calculation (e.g. filtering 5,000 items) that is slowing down renders.',
    recommendation: 'useMemo',
    secondary: 'React Compiler in React 19 (may automate this)',
    codeSnippet: `const filteredList = useMemo(() => {
  return items.filter(item => item.name.includes(query));
}, [items, query]);`,
    rule: 'Only use for proven computational bottlenecks or to stabilize object references for React.memo.'
  },
  {
    id: 'decision-5',
    goal: 'I am passing a callback function to a memoized child component and it keeps re-rendering unnecessarily.',
    recommendation: 'useCallback',
    secondary: 'React.memo on child',
    codeSnippet: `const handleSelect = useCallback((id) => {
  setSelected(id);
}, []); // Stable function reference`,
    rule: 'useCallback is only beneficial when the receiving child component is wrapped in React.memo.'
  },
  {
    id: 'decision-6',
    goal: 'I have complex state with multiple actions (e.g. shopping cart, multi-step checkout form).',
    recommendation: 'useReducer',
    secondary: 'useContext for passing dispatch down',
    codeSnippet: `const [state, dispatch] = useReducer(cartReducer, initialState);
dispatch({ type: 'ADD_ITEM', payload: product });`,
    rule: 'Keeps state transitions predictable and separates update logic from UI components.'
  },
  {
    id: 'decision-7',
    goal: 'I need to show instant UI feedback before a server request completes (React 19).',
    recommendation: 'useOptimistic',
    secondary: 'useTransition or <form action>',
    codeSnippet: `const [optimisticLikes, setOptimisticLikes] = useOptimistic(
  likes,
  (current, count) => current + count
);`,
    rule: 'Must be triggered inside a React Transition or Action.'
  },
  {
    id: 'decision-8',
    goal: 'I need to handle a form submission with pending, error, and optimistic state automatically (React 19).',
    recommendation: 'useActionState',
    secondary: 'useFormStatus for nested button',
    codeSnippet: `const [state, formAction, isPending] = useActionState(submitProfile, null);
<form action={formAction}>
  <button disabled={isPending}>Save</button>
</form>`,
    rule: 'Eliminates manual onSubmit preventDefault and try/catch loading states.'
  }
];

export const ANTI_PATTERNS = [
  {
    id: 'ap-1',
    title: 'Mutating State Directly',
    category: 'State Management',
    severity: 'Critical Bug',
    description: 'Modifying state variables directly in place breaks React shallow equality diffing, causing components to silently fail to re-render.',
    badCode: `// ❌ DIRECT MUTATION
const [user, setUser] = useState({ name: 'Alex', age: 24 });

const handleBirthday = () => {
  user.age = 25; // Same object reference!
  setUser(user); // React checks Object.is(user, user) -> skips render!
};`,
    goodCode: `// ✅ IMMUTABLE UPDATE (New Object Reference)
const [user, setUser] = useState({ name: 'Alex', age: 24 });

const handleBirthday = () => {
  setUser(prev => ({
    ...prev,
    age: prev.age + 1
  }));
};`,
    why: 'React relies on reference changes to know when to re-render. Always treat state objects and arrays as immutable snapshots.'
  },
  {
    id: 'ap-2',
    title: 'Using useEffect for Derived State',
    category: 'Performance & Flow',
    severity: 'High Waste',
    description: 'Using useEffect to update state whenever another state changes causes an extra redundant re-render cycle.',
    badCode: `// ❌ REDUNDANT STATE & EXTRA RENDER
const [items, setItems] = useState([]);
const [totalPrice, setTotalPrice] = useState(0);

useEffect(() => {
  const sum = items.reduce((acc, i) => acc + i.price, 0);
  setTotalPrice(sum); // Triggers a second render cycle on every items update!
}, [items]);`,
    goodCode: `// ✅ DERIVE VALUE ON-THE-FLY DURING RENDER
const [items, setItems] = useState([]);

// Computed synchronously in render; 0 extra renders!
const totalPrice = items.reduce((acc, i) => acc + i.price, 0);`,
    why: 'If a value can be computed from existing props or state, compute it directly during rendering. You do not need a second state variable or useEffect.'
  },
  {
    id: 'ap-3',
    title: 'Array Index as Key in Dynamic Lists',
    category: 'Virtual DOM & Diffing',
    severity: 'Subtle UI Corruption',
    description: 'Using index as key when items can be inserted, sorted, or removed causes form inputs to hold wrong data and breaks CSS transitions.',
    badCode: `// ❌ INDEX AS KEY
{todos.map((todo, index) => (
  <TodoItem key={index} todo={todo} />
))}
// Deleting item 0 causes item 1 to take key=0. React re-uses the wrong DOM input!`,
    goodCode: `// ✅ UNIQUE STABLE ID AS KEY
{todos.map((todo) => (
  <TodoItem key={todo.id} todo={todo} />
))}`,
    why: 'Keys provide stable element identities. Only use index as a key if the list is strictly static with zero deletions, insertions, or sorting.'
  },
  {
    id: 'ap-4',
    title: 'Stale Closures in Asynchronous Handlers',
    category: 'Closures & Hooks',
    severity: 'Logical Inconsistency',
    description: 'Reading state variables inside timeouts or async callbacks reads the frozen value captured at the moment the callback was created.',
    badCode: `// ❌ STALE CLOSURE
const [count, setCount] = useState(0);

const handleDelayedLog = () => {
  setTimeout(() => {
    // If count was updated from 0 to 5 during the 3 seconds,
    // this still logs 0!
    console.log("Count was:", count);
  }, 3000);
};`,
    goodCode: `// ✅ USE A REF TO TRACK THE LATEST VALUE
const [count, setCount] = useState(0);
const countRef = useRef(count);
countRef.current = count; // Always mirrors freshest state

const handleDelayedLog = () => {
  setTimeout(() => {
    console.log("Freshest count:", countRef.current);
  }, 3000);
};`,
    why: 'JavaScript functions capture variables from the scope in which they were created. Refs allow reading the latest synchronous value without re-binding.'
  },
  {
    id: 'ap-5',
    title: 'Missing Cleanup in useEffect',
    category: 'Memory & Leakage',
    severity: 'Memory Leak & Race Conditions',
    description: 'Setting up timers, subscriptions, or network requests without cleanup functions leads to memory leaks and zombie state updates on unmounted components.',
    badCode: `// ❌ NO CLEANUP
useEffect(() => {
  window.addEventListener('resize', handleResize);
  // When component unmounts, event listener stays in memory forever!
}, []);`,
    goodCode: `// ✅ RETURN CLEANUP FUNCTION
useEffect(() => {
  window.addEventListener('resize', handleResize);
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);`,
    why: 'Always mirror setup operations with corresponding teardown logic inside the return statement of useEffect.'
  }
];

export const REACT19_CHEATSHEET = [
  {
    feature: 'useActionState',
    status: '✨ New in React 19',
    description: 'Replaces manual form submission state management. Coordinates async transitions, isPending, and errors automatically.',
    before: 'useState(loading) + useState(error) + onSubmit(e.preventDefault)',
    now: 'const [state, formAction, isPending] = useActionState(fn, init)'
  },
  {
    feature: 'useOptimistic',
    status: '✨ New in React 19',
    description: 'Instantly reflects prospective changes on the UI while an action executes, rolling back automatically on failure.',
    before: 'Manual state mutation + manual try/catch reversal array manipulation',
    now: 'const [optimistic, setOptimistic] = useOptimistic(realState, updateFn)'
  },
  {
    feature: 'The use() Hook',
    status: '✨ New in React 19',
    description: 'Reads promises and context directly during render. Can be placed inside conditionals and loops!',
    before: 'useEffect data fetching + useState + useContext (strictly top-level)',
    now: 'const data = use(dataPromise); // Suspends natively'
  },
  {
    feature: 'Ref as a Prop',
    status: '✨ Simplified in React 19',
    description: 'forwardRef is deprecated! Function components can now accept "ref" as a standard prop like any other prop.',
    before: 'const MyInput = forwardRef((props, ref) => <input ref={ref} />);',
    now: 'function MyInput({ ref, ...props }) { return <input ref={ref} />; }'
  },
  {
    feature: '<Context> as Provider',
    status: '✨ Simplified in React 19',
    description: 'You can now render <MyContext value={val}> directly instead of writing <MyContext.Provider value={val}>.',
    before: '<ThemeContext.Provider value={theme}>',
    now: '<ThemeContext value={theme}>'
  },
  {
    feature: 'Document Metadata in JSX',
    status: '✨ New in React 19',
    description: 'Native support for rendering <title>, <meta>, and <link rel="stylesheet"> anywhere inside your component tree.',
    before: 'react-helmet or manual document.title in useEffect',
    now: '<title>Profile - MyApp</title> in component JSX'
  }
];
