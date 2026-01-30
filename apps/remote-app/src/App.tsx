import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: "20px", border: "2px solid #4CAF50", borderRadius: "8px", margin: "10px" }}>
      <h1>🚀 Remote App (Vite)</h1>
      <p>This component is loaded from Vite remote app via Module Federation</p>
      <div style={{ marginTop: "16px" }}>
        <button
          onClick={() => setCount(count + 1)}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Increment Count
        </button>
        <p style={{ fontSize: "24px", fontWeight: "bold" }}>Count: {count}</p>
      </div>
    </div>
  );
}

export default App;
