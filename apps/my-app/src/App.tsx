import {
  Component,
  lazy,
  Suspense,
  useState,
  type PropsWithChildren,
} from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { sum, capitalize } from "@repo/utils";

const RemoteApp = lazy(() => import("remoteApp/App"));

interface RemoteAppBoundaryState {
  error: Error | null;
}

class RemoteAppBoundary extends Component<
  PropsWithChildren,
  RemoteAppBoundaryState
> {
  state: RemoteAppBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): RemoteAppBoundaryState {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <p role="alert" data-test="remote-app-error">
          Failed to load the remote app.
        </p>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [count, setCount] = useState(0);
  const a = 10;
  const b = 20;
  const result = sum(a, b);
  const appName = "my-app";

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>{capitalize(appName)}</h1>
      <h2>10 + 20 = {result}</h2>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <section data-test="remote-app-host">
        <h2>Federated remote</h2>
        <RemoteAppBoundary>
          <Suspense fallback={<p role="status">Loading remote app...</p>}>
            <RemoteApp />
          </Suspense>
        </RemoteAppBoundary>
      </section>
    </>
  );
}

export default App;
