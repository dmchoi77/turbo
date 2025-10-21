import { useAtom } from "jotai";
import { countAtom } from "./stores/count";
import { userAtom, loginAtom, logoutAtom } from "hostApp/user";

function App() {
  const [count, setCount] = useAtom(countAtom);
  const [user] = useAtom(userAtom);
  const [, login] = useAtom(loginAtom);
  const [, logout] = useAtom(logoutAtom);

  const handleLogin = () => {
    login({
      name: "Remote User",
      email: "remote@example.com",
    });
  };

  return (
    <div>
      <h1>Remote App</h1>
      <div>
        <button onClick={() => setCount(count + 1)}>Increment Count</button>
        <p>Count: {count}</p>
      </div>
      <div>
        <h2>User Info (from Host App)</h2>
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
  );
}

export default App;
