import "./App.css";
import RemoteApp from "remoteApp/App";
import { useAtom } from "jotai";
import { countAtom } from "remoteApp/count";
import { userAtom, loginAtom, logoutAtom } from "./stores/user";

function App() {
  const [count, setCount] = useAtom(countAtom);
  const [user] = useAtom(userAtom);
  const [, login] = useAtom(loginAtom);
  const [, logout] = useAtom(logoutAtom);

  const handleLogin = () => {
    login({
      name: "Host User",
      email: "host@example.com",
    });
  };

  return (
    <div>
      <div>
        <h1>Host App</h1>
        <div>
          <button onClick={() => setCount(count + 1)}>Increment Count</button>
          <p>Count: {count}</p>
        </div>
        <div>
          <h2>User Info (Host Store)</h2>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Status: {user.isLoggedIn ? "Logged In" : "Not Logged In"}</p>
          {!user.isLoggedIn ? (
            <button onClick={handleLogin}>Login</button>
          ) : (
            <button onClick={logout}>Logout</button>
          )}
        </div>
      </div>
      <RemoteApp />
    </div>
  );
}

export default App;
