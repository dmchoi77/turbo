import { useAtom } from "jotai";
import { countAtom } from "./stores/count";

function App() {
  const [count, setCount] = useAtom(countAtom);

  return (
    <div>
      <h1>Remote App</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <p>Count: {count}</p>
    </div>
  );
}

export default App;
