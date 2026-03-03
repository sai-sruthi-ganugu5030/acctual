# React Basics Guide for JavaScript Developers

Welcome to React! Since you know JavaScript, you're already halfway there. Let me explain how React works.

---

## 🗂️ Folder Structure Explained

### **PUBLIC Folder** - The Static Files
```
public/
├── index.html      ← The ONLY HTML file in your app (important!)
├── favicon.ico     ← Browser tab icon
├── logo192.png     ← App icons
└── manifest.json   ← PWA configuration
```

**What is the PUBLIC folder for?**
- Contains **static assets** that don't need processing
- Files here are served **as-is** without being bundled
- The `index.html` is the single HTML page that loads your React app

**Key Point in index.html:**
```html
<div id="root"></div>  ← React injects your entire app HERE!
```

**When to use PUBLIC folder:**
- Favicon, logos, robots.txt, manifest.json
- Files that need to be accessible by their direct path
- Files that should NOT be processed by webpack

---

### **SRC Folder** - Your React Code Lives Here
```
src/
├── index.js        ← Entry point (connects React to HTML)
├── App.js          ← Main component (your app starts here)
├── App.css         ← Styles for App component
├── index.css       ← Global styles
└── ...other files
```

**This is where you'll spend 99% of your time!**

---

## 🔗 How It All Connects

Here's the flow from start to finish:

### 1️⃣ **public/index.html** (The Foundation)
```html
<!DOCTYPE html>
<html>
  <body>
    <div id="root"></div>  ← Empty container
  </body>
</html>
```
Just a regular HTML file with an empty `div` where React will inject your app.

---

### 2️⃣ **src/index.js** (The Bridge)
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 1. Find the "root" div in index.html
const root = ReactDOM.createRoot(document.getElementById('root'));

// 2. Render your App component into it
root.render(<App />);
```

**What's happening:**
- `ReactDOM.createRoot()` grabs the `<div id="root">` from HTML
- `root.render()` injects your React app into that div
- You rarely need to touch this file

---

### 3️⃣ **src/App.js** (Your Main Component - START HERE!)
```javascript
function App() {
  return (
    <div className="App">
      <h1>Hello World!</h1>
    </div>
  );
}

export default App;
```

**This is where your app begins!** Everything you build starts here.

---

## 🎯 React Core Concepts (JavaScript → React)

### 1. **Components = JavaScript Functions**
In React, UI elements are just functions that return HTML-like code (JSX).

```javascript
// Old JavaScript way:
function createButton() {
  return '<button>Click me</button>';
}

// React way:
function Button() {
  return <button>Click me</button>;
}
```

### 2. **JSX = HTML in JavaScript**
JSX looks like HTML but it's actually JavaScript.

```javascript
function App() {
  const name = "John";
  const age = 25;
  
  return (
    <div>
      <h1>Hello {name}!</h1>           {/* Use {} for JS variables */}
      <p>You are {age} years old</p>
      <p>{age >= 18 ? "Adult" : "Minor"}</p>  {/* JS expressions work! */}
    </div>
  );
}
```

**Key Differences from HTML:**
- `class` → `className` (because `class` is a JS keyword)
- `for` → `htmlFor`
- Style uses objects: `style={{color: 'red', fontSize: '20px'}}`
- All tags must close: `<input />` not `<input>`

### 3. **State = Memory for Components**
State is how React remembers data that can change.

```javascript
import { useState } from 'react';

function Counter() {
  // [variable, function to update it] = useState(initial value)
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

**When state changes, React automatically re-renders the component!**

### 4. **Props = Passing Data Between Components**
Props are like function arguments for components.

```javascript
// Parent component
function App() {
  return <Greeting name="Alice" age={25} />;
}

// Child component
function Greeting(props) {
  return <h1>Hello {props.name}, you're {props.age}!</h1>;
}

// Or with destructuring (cleaner)
function Greeting({ name, age }) {
  return <h1>Hello {name}, you're {age}!</h1>;
}
```

### 5. **Event Handling**
Similar to JavaScript but with React conventions.

```javascript
function Button() {
  const handleClick = () => {
    alert('Button clicked!');
  };
  
  return <button onClick={handleClick}>Click me</button>;
}
```

**Note:** It's `onClick` (camelCase), not `onclick`

---

## 🚀 Getting Started - Your First Todo App

Let's modify your App.js to build a simple todo list:

```javascript
import { useState } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([...todos, inputValue]);
      setInputValue('');
    }
  };

  return (
    <div className="App">
      <h1>My Todo List</h1>
      
      <div>
        <input 
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter a todo"
        />
        <button onClick={addTodo}>Add</button>
      </div>

      <ul>
        {todos.map((todo, index) => (
          <li key={index}>{todo}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

---

## 🎨 Development Workflow

1. **Run the dev server:** `npm start`
2. **Edit files in `src/` folder** (App.js, etc.)
3. **Save** (auto-save is recommended!)
4. **Browser automatically refreshes** to show changes ✨
5. **Check browser console** for errors (F12)

---

## 📝 Quick Tips for Development

### Import/Export
```javascript
// Exporting a component
export default App;           // Default export (1 per file)
export function Button() {}   // Named export (multiple allowed)

// Importing
import App from './App';                    // Default import
import { Button, Header } from './components';  // Named imports
```

### Styling
```javascript
// Option 1: CSS file
import './App.css';

// Option 2: Inline styles
<div style={{backgroundColor: 'blue', padding: '20px'}}>

// Option 3: CSS Modules (prevents name conflicts)
import styles from './App.module.css';
<div className={styles.container}>
```

### Common Mistakes to Avoid
1. ❌ Forgetting to import `useState`: `import { useState } from 'react';`
2. ❌ Directly modifying state: `todos.push(newTodo)` ← Don't do this!
   ✅ Always use setState: `setTodos([...todos, newTodo])`
3. ❌ Forgetting `key` prop in lists: `<li key={index}>`
4. ❌ Using `class` instead of `className`

---

## 🔥 Next Steps

1. **Experiment with the starter app:** Change text, colors, add buttons
2. **Build the todo list example above**
3. **Learn about:**
   - `useEffect` hook (for side effects like API calls)
   - Creating reusable components
   - React Router (for multiple pages)
   - Calling APIs with `fetch`

---

## 📚 Useful Commands

```bash
npm start          # Start development server
npm run build      # Create production build (in 'build' folder)
npm test           # Run tests
```

---

## 🆘 Getting Help

- **React Docs:** https://react.dev
- **Error in browser console?** Press F12 and check Console tab
- **Error in terminal?** Read the error message carefully - React errors are quite helpful!

---

Happy coding! 🎉 Start by playing with `src/App.js` and see what happens!
