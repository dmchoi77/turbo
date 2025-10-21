import "./App.css";
import RemoteApp from "remoteApp/App";
import { useAtom } from "jotai";
import { countAtom } from "remoteApp/count";

function App() {
  const [count, setCount] = useAtom(countAtom);

  return (
    <div>
      <div>
        <h1>Host App</h1>
        <button onClick={() => setCount(count + 1)}>Increment</button>
        <p>Count: {count}</p>
      </div>
      <RemoteApp />
    </div>
  );
}

export default App;
