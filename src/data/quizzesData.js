export const QUIZ_QUESTIONS = [
  // BEGINNER
  {
    id: 'q-b1',
    level: 'beginner',
    category: 'Virtual DOM',
    question: 'What is JSX compiled into before running in the browser?',
    options: [
      'Pure HTML strings injected with innerHTML',
      'React.createElement() or modern _jsx() calls returning plain JavaScript objects',
      'Direct binary bytecode executed by the V8 engine',
      'WebAssembly modules'
    ],
    correctIndex: 1,
    explanation: 'JSX is syntax sugar. A transpiler converts JSX into function calls that return lightweight JavaScript objects representing Virtual DOM nodes.'
  },
  {
    id: 'q-b2',
    level: 'beginner',
    category: 'State & Reactivity',
    question: 'Consider this code: setCount(count + 1); setCount(count + 1); setCount(count + 1); where count starts at 0. What is count on the next render?',
    codeSnippet: `const [count, setCount] = useState(0);
const handleClick = () => {
  setCount(count + 1);
  setCount(count + 1);
  setCount(count + 1);
};`,
    options: [
      '3',
      '1',
      '0',
      'Throws an unhandled state mutation error'
    ],
    correctIndex: 1,
    explanation: 'State behaves like a snapshot! In the current render closure, "count" is 0. All three calls evaluate to setCount(0 + 1). To get 3, use functional updates: setCount(c => c + 1).'
  },
  {
    id: 'q-b3',
    level: 'beginner',
    category: 'Lists & Keys',
    question: 'Why should you NOT use Math.random() as a key for list items in React?',
    options: [
      'Math.random() is deprecated in modern ECMAScript',
      'Every render produces new keys, forcing React to destroy and recreate every DOM element from scratch',
      'React throws a compile error if a key is not an integer',
      'It causes an infinite loop in the reconciler'
    ],
    correctIndex: 1,
    explanation: 'Because keys change on every render, React believes every single item has been deleted and replaced with a new one. This wipes all internal state, loses input focus, and destroys performance.'
  },
  {
    id: 'q-b4',
    level: 'beginner',
    category: 'Components & Props',
    question: 'Which of the following statements about Props in React is TRUE?',
    options: [
      'Child components can directly mutate props received from parent components',
      'Props are read-only and must be treated as immutable by the receiving component',
      'Props can only be passed as strings or numbers',
      'Props are identical to component internal state'
    ],
    correctIndex: 1,
    explanation: 'React adheres to pure function rules for components: props are strictly read-only inputs passed top-to-bottom.'
  },
  {
    id: 'q-b5',
    level: 'beginner',
    category: 'Events',
    question: 'How do you prevent a form submit from reloading the browser page in React?',
    codeSnippet: `const handleSubmit = (e) => {
  // What goes here?
};`,
    options: [
      'e.stopPropagation()',
      'e.preventDefault()',
      'return false',
      'e.cancelBubble = true'
    ],
    correctIndex: 1,
    explanation: 'e.preventDefault() cancels the browser default action of submitting the form and refreshing the entire webpage.'
  },

  // INTERMEDIATE
  {
    id: 'q-i1',
    level: 'intermediate',
    category: 'useEffect Lifecycle',
    question: 'When does the cleanup function returned from a useEffect hook execute?',
    codeSnippet: `useEffect(() => {
  // Setup logic
  return () => {
    // When does this run?
  };
}, [dependency]);`,
    options: [
      'Only once when the entire application is closed by the user',
      'Immediately before the effect re-runs on an update, and when the component unmounts',
      'Synchronously before the component mounts for the first time',
      'Every time any other component on the page re-renders'
    ],
    correctIndex: 1,
    explanation: 'React runs the cleanup function to clean up the previous effect execution before running the effect anew with updated dependencies, as well as on component unmount.'
  },
  {
    id: 'q-i2',
    level: 'intermediate',
    category: 'useRef vs useState',
    question: 'What happens to the component UI when you update myRef.current?',
    codeSnippet: `const myRef = useRef(0);
const handleClick = () => {
  myRef.current += 1;
};`,
    options: [
      'The component immediately triggers a re-render and updates the screen',
      'The component queues a microtask re-render at the end of the event loop',
      'Nothing visually changes; modifying ref.current does NOT trigger a re-render',
      'React throws an error because refs are immutable'
    ],
    correctIndex: 2,
    explanation: 'useRef creates a mutable container whose identity and current property persist across renders without notifying React to re-render.'
  },
  {
    id: 'q-i3',
    level: 'intermediate',
    category: 'Rules of Hooks',
    question: 'Why is it strictly forbidden to call a Hook inside an "if" condition or loop?',
    options: [
      'JavaScript syntax engines do not allow function calls inside conditional blocks',
      'React tracks hook state by the deterministic sequential order in which they are invoked on every render',
      'Conditional hooks cause CSS animation glitches',
      'Hooks require asynchronous execution context'
    ],
    correctIndex: 1,
    explanation: 'React maintains an internal linked list of hooks per component. It relies on hooks running in the exact same index order on every render to pair state with the correct hook variable.'
  },
  {
    id: 'q-i4',
    level: 'intermediate',
    category: 'Context API',
    question: 'What is a known performance drawback of React Context when used for high-frequency updates?',
    options: [
      'Context causes memory leaks in modern browsers',
      'Every component consuming the context re-renders whenever the context value changes, even if it only uses an unchanged slice',
      'Context can only be used once per application',
      'Context cannot transmit objects or arrays'
    ],
    correctIndex: 1,
    explanation: 'By default, any component using useContext(Context) re-renders when the Provider value changes reference equality. Frequent updates like mouse tracking will trigger cascades of re-renders.'
  },
  {
    id: 'q-i5',
    level: 'intermediate',
    category: 'Custom Hooks',
    question: 'If ComponentA and ComponentB both invoke useCounter(), do they share the same counter value?',
    options: [
      'Yes, custom hooks create a global singleton state',
      'No, each component invocation gets its own completely isolated state tree',
      'Only if they are siblings in the component tree',
      'Yes, unless you pass an isolation flag'
    ],
    correctIndex: 1,
    explanation: 'Custom hooks share reusable stateful logic, not state itself. Each component calling a custom hook gets an independent set of state variables.'
  },

  // ADVANCED
  {
    id: 'q-a1',
    level: 'advanced',
    category: 'Re-render Mechanics',
    question: 'By default, what triggers a React child component to re-render if it is NOT wrapped in React.memo?',
    options: [
      'Only when its props have changed by value equality',
      'Whenever its parent component re-renders, regardless of whether its own props changed',
      'Only when local storage updates',
      'Whenever window.scroll occurs'
    ],
    correctIndex: 1,
    explanation: 'In React, whenever a parent component re-renders, all child components in its JSX tree re-render recursively by default, unless wrapped in React.memo or bailout mechanisms.'
  },
  {
    id: 'q-a2',
    level: 'advanced',
    category: 'useCallback & React.memo',
    question: 'When is wrapping a callback function in useCallback actually beneficial?',
    options: [
      'On every single function written in every component without exception',
      'When the function is passed as a prop to a child component wrapped in React.memo or used in an effect dependency array',
      'Only inside class components',
      'To make the function execute asynchronously in a background web worker'
    ],
    correctIndex: 1,
    explanation: 'useCallback preserves referential identity. If the receiving component is not memoized, it will re-render anyway, rendering useCallback useless overhead.'
  },
  {
    id: 'q-a3',
    level: 'advanced',
    category: 'useReducer',
    question: 'Why must the reducer function passed to useReducer be a pure function?',
    options: [
      'Pure functions run faster in WebAssembly',
      'React may invoke reducers multiple times during concurrent rendering; side effects would run redundantly and cause bugs',
      'Reducers cannot accept parameters unless pure',
      'It is an arbitrary stylistic convention'
    ],
    correctIndex: 1,
    explanation: 'During Concurrent React rendering, React may re-run the render phase or discard incomplete work. Impure reducers with side effects would cause duplicate API calls or corrupted external state.'
  },
  {
    id: 'q-a4',
    level: 'advanced',
    category: 'Portals',
    question: 'What is unique about React Portals created via createPortal?',
    options: [
      'They render outside the parent DOM node, yet React events still bubble through the React component tree',
      'They do not support CSS styling',
      'They completely sever connection with React Context',
      'They can only be rendered inside an iframe'
    ],
    correctIndex: 0,
    explanation: 'A portal allows rendering children into an arbitrary DOM node (like document.body) while preserving the natural React tree hierarchy for Context and event bubbling.'
  },

  // REACT 19
  {
    id: 'q-r1',
    level: 'react19',
    category: 'React 19 Actions',
    question: 'What major benefit does the new React 19 useActionState hook provide?',
    options: [
      'It converts React components into native iOS and Android widgets',
      'It automatically manages pending transition state, errors, and optimistic updates for form submissions',
      'It replaces CSS flexbox with a virtual grid system',
      'It forces all network requests to run over HTTP/3'
    ],
    correctIndex: 1,
    explanation: 'useActionState coordinates asynchronous transitions, automatically giving you [state, formAction, isPending] and eliminating manual loading and error booleans.'
  },
  {
    id: 'q-r2',
    level: 'react19',
    category: 'React 19 useOptimistic',
    question: 'What occurs automatically if an asynchronous action fails while useOptimistic is showing prospective state?',
    options: [
      'The user browser tab is terminated',
      'React automatically rolls back the UI to the actual underlying state when the transition finishes',
      'The developer must manually dispatch an undo action to reset the array',
      'The application throws an unrecoverable fatal error'
    ],
    correctIndex: 1,
    explanation: 'useOptimistic binds temporary state to the life of the async transition. When the transition concludes (even with error), React discards the optimistic value and renders the real state.'
  },
  {
    id: 'q-r3',
    level: 'react19',
    category: 'The use() Hook',
    question: 'How is the React 19 "use()" hook fundamentally different from previous hooks?',
    options: [
      'It must only be used in node.js backend scripts',
      'It can be called conditionally inside if-statements and loops',
      'It is only allowed in Class components',
      'It cannot read Context values'
    ],
    correctIndex: 1,
    explanation: 'Unlike traditional hooks that must execute unconditionally in the exact same order at the top level, use() can be invoked inside if-conditions and loops.'
  },
  {
    id: 'q-r4',
    level: 'react19',
    category: 'React 19 Refs',
    question: 'What happened to forwardRef in React 19?',
    options: [
      'It became mandatory for every single function component',
      'It is deprecated because function components can now accept "ref" as a standard prop directly',
      'It was replaced with createRef',
      'It was renamed to useDomRef'
    ],
    correctIndex: 1,
    explanation: 'In React 19, forwardRef is no longer needed. You can simply declare "ref" in your component props: function MyButton({ ref, children }) { ... }.'
  }
];
