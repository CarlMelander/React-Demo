import { useState, useEffect, useReducer, useRef, useCallback, createContext, forwardRef } from "react";
import "./App.css";

/* Global State */
const AppContext = createContext<{ theme: string; toggleTheme: () => void } | null>(null);

function App(): JSX.Element {
  const [theme, setTheme] = useState<'theme-light' | 'theme-dark'>('theme-light');

  const toggleTheme = () => {
    setTheme(prevTheme => 
      prevTheme === 'theme-light' ? 'theme-dark' : 'theme-light'
    );
  };

  /*  useState Example: Counter */
  const [count, setCount] = useState<number>(0);

  /* useReducer Example: Complex State Management */
  const reducer = (state: number, action: 
    | { type: "increment" | "decrement" | "reset" }
    | { type: "set" | "multiply", payload: number }
  ): number => {
    switch (action.type) {
      case "increment":
        return state + 1;
      case "decrement":
        return state - 1;
      case "reset":
        return 0;
      case "set":
        return action.payload;
      case "multiply":
        return state * action.payload;
      default:
        return state;
    }
  };
  const [reducerCount, dispatch] = useReducer(reducer, 0);

  /* useEffect Example: Calculation with Loading State */
  const [calculationData, setCalculationData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [calculationTime, setCalculationTime] = useState<number>(0);

  const sieveOfEratosthenes = async (limit: number): Promise<number[]> => {
    return new Promise((resolve) => {
      const numWorkers = navigator.hardwareConcurrency || 4; // Use available CPU cores
      const workers: Worker[] = [];
      const results: boolean[][] = new Array(numWorkers);
      let completedWorkers = 0;

      // Create workers
      for (let i = 0; i < numWorkers; i++) {
        const worker = new Worker(new URL('./primeWorker.js', import.meta.url));
        workers.push(worker);

        worker.onmessage = (e) => {
          results[e.data.workerNumber] = e.data.sieve;
          completedWorkers++;

          if (completedWorkers === numWorkers) {
            // Merge results from all workers
            const finalSieve = results[0];
            for (let i = 1; i < numWorkers; i++) {
              for (let j = 0; j < finalSieve.length; j++) {
                finalSieve[j] = finalSieve[j] && results[i][j];
              }
            }

            // Convert sieve to array of prime numbers
            const primes = finalSieve
              .map((isPrime, idx) => (isPrime ? idx : 0))
              .filter((num) => num > 0);

            // Cleanup workers
            workers.forEach(worker => worker.terminate());
            
            resolve(primes);
          }
        };

        // Start each worker with its portion of the work
        worker.postMessage({
          limit,
          workerNumber: i,
          totalWorkers: numWorkers
        });
      }
    });
  };
  
  
  

  useEffect(() => {
    const calculatePrimes = async () => {
      setIsLoading(true);
      const startTime = performance.now();
      try {
        const primes = await sieveOfEratosthenes(reducerCount);
        const endTime = performance.now();
        setCalculationTime(endTime - startTime);
        setCalculationData(`Found ${primes.length} prime numbers.`);
      } catch (error) {
        setCalculationData("Error calculating primes");
      } finally {
        setIsLoading(false);
      }
    };
  
    calculatePrimes();
  }, [reducerCount]);
  

  /*  useCallback Example: Function Memoization */
  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    const emojis = ['✨', '🚀', '💫', '⭐', '🌟', '💥'];
    const burstCount = 15;
    let mouseX = event.clientX;
    let mouseY = event.clientY;

    // Track mouse movement
    const mouseMoveHandler = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    document.addEventListener('mousemove', mouseMoveHandler);
    
    for (let i = 0; i < burstCount; i++) {
      const popDelay = (i * 0.05) + (Math.random() * 0.05);
      const floatDuration = 1 + Math.random() * 4;
      const randomSpread = (Math.random() - 0.5) * 300;

      setTimeout(() => {
        const emoji = document.createElement('div');
        emoji.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        
        emoji.style.cssText = `
          position: fixed;
          left: ${mouseX}px;
          top: ${mouseY}px;
          pointer-events: none;
          font-size: 1.5rem;
          transform: translate(-50%, -50%);
          animation: float-away ${floatDuration}s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
          opacity: 0;
          animation-delay: ${popDelay}s;
          --spread: ${randomSpread}px;
          --speed: ${floatDuration}s;
          z-index: 9999;
        `;

        document.body.appendChild(emoji);
        setTimeout(() => emoji.remove(), floatDuration * 1000 + (popDelay * 1000));
      }, popDelay * 1000);
    }

    // Cleanup mouse tracking after all emojis are generated
    setTimeout(() => {
      document.removeEventListener('mousemove', mouseMoveHandler);
    }, (burstCount * 0.05 + 1) * 1000);
  }, []);

  /*  useRef Example: DOM Access */
  const inputRef = useRef<HTMLInputElement>(null);
  const customInputRef = useRef<HTMLInputElement>(null);

  /*  ForwardRef Example: Passing Refs */
  const CustomInput = forwardRef<HTMLInputElement, { label?: string; placeholder?: string }>((props, ref) => (
    <div>
      {props.label && <label>{props.label}</label>}
      <input ref={ref} type="text" placeholder={props.placeholder} />
    </div>
  ));

  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');

  const handleCustomInputDemo = () => {
    if (customInputRef.current) {
      customInputRef.current.focus();
      setModalMessage(customInputRef.current.value);
      setShowModal(true);
    }
  };

  /* Render */
  return (
    <div id={theme} className="app-container">

      <AppContext.Provider value={{ theme, toggleTheme }}>
        <div className="app-container" id={`theme-${theme}`}>
          <header className="header">
            <h1 className="title">React Demo</h1>
          </header>
          <main className="main-content">
            {/* Context */}
            <section className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Context Example: Theme Toggle</h2>
                <button onClick={toggleTheme}>Toggle Theme</button>
              </div>
              <p>Shares global state (theme) across components with Context API.</p>
              <p>Current Theme: {theme}</p>
            </section>

            {/* useState */}
            <section className="card">
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>useState Example: Counter</h2>
                <div style={{ display: 'flex' }}>
                  <button onClick={() => setCount(count + 1)}>Increment</button>
                  <button onClick={() => setCount(count - 1)}>Decrement</button>
                </div>
              </div>

             
              <p>A basic counter that increments or decrements a number using useState.</p>
              <p>Count: {count}</p>

            </section>

            {/* useReducer */}
            <section className="card">
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20rem'
              }}>
                {/*  Text */}
                <div>
                  <h2>useReducer Example: Counter</h2>
                  <p>Manages state with a reducer function, ideal for complex logic.</p>
                  <p>Reducer Count: {reducerCount}</p>
                </div>

                {/* Buttons Grid */}
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.5rem',
                  alignContent: 'start'
                }}>
                  {/* Row 1 */}
                  <button onClick={() => dispatch({ type: "increment" })}>Increment</button>
                  <button onClick={() => dispatch({ type: "decrement" })}>Decrement</button>
                  
                  {/* Row 2 */}
                  <button onClick={() => dispatch({ type: "set", payload: 100 })}>Set to 100</button>
                  <button onClick={() => dispatch({ type: "multiply", payload: 2 })}>Double</button>
                  
                  {/* Row 3 */}
                  <button 
                    onClick={() => dispatch({ type: "reset" })}
                    style={{ 
                      gridColumn: 'span 2',
                      marginRight: '10px'
                    }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </section>

            {/* useEffect */}
            <section className="card">
              <h2>useEffect Example: Prime Number Calculation</h2>
              <p>Demonstrates real-time calculation based on reducer value.</p>
              {isLoading ? (
                <p>Calculating prime numbers...</p>
              ) : (
                <>
                  <p>{calculationData}</p>
                  <p>Calculation time: {calculationTime.toFixed(2)}ms</p>
                </>
              )}
              <p className="note">Try changing the reducer value above to recalculate primes!</p>
            </section>

            {/* useCallback */}
            <section className="card">

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>useCallback Example: Memoized Function</h2>
                  <div style={{ display: 'flex' }}>
                    <button onClick={handleClick}>Click Me</button>
                  </div>
                </div>
              <p>Prevents unnecessary re-creation of functions with useCallback.</p>
              
            </section>

            {/* useRef */}
            <section className="card">

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>useRef Example: Input Focus</h2>
                  <div style={{ display: 'flex' }}>
                    <button onClick={() => inputRef.current?.focus()}>Focus Input</button>
                  </div>
                </div>
                <p>Accesses the DOM directly to focus on an input field programmatically.</p>
              
              
              
              <input ref={inputRef} type="text" placeholder="Type something..." />
              
            </section>

            {/* ForwardRef */}
            <section className="card">

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2>ForwardRef Example: Custom Input</h2>
                  <div style={{ display: 'flex' }}>
                   <button onClick={handleCustomInputDemo} style={{ marginTop: '10px' }}>Focus and Show Value</button>
                  </div>
                </div>

              
              <p>Passes refs to child components for greater control of nested inputs.</p>
              <CustomInput ref={customInputRef} placeholder="Type something..." />
              
            </section>
          </main>
          <footer className="footer">
            <p>... synthesized by semi-serious space snakes ...</p>
          </footer>
        </div>
      </AppContext.Provider>

      {showModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
          onClick={() => setShowModal(false)}
        >
          <div 
            style={{
              backgroundColor: theme === 'theme-light' ? 'white' : '#333',
              color: theme === 'theme-light' ? 'black' : 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center'
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3>Input Value</h3>
            <p>{modalMessage}</p>
            <button 
              onClick={() => setShowModal(false)}
              style={{
                marginTop: '15px',
                padding: '8px 16px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: '#007bff',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
