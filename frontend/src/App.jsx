import { useEffect, useState } from "react";
import { API_URL } from "./api";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function testHealth() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API_URL}/health`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        setData(json);
      } catch (e) {
        setError(e.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    }

    testHealth();
  }, []);

  return (
    <div style={{ fontFamily: "Arial", padding: 24 }}>
      <h1>ARY Sistema — Frontend</h1>

      <p><b>API_URL:</b> {API_URL}</p>

      {loading && <p>Probando conexión con backend...</p>}

      {!loading && error && (
        <div style={{ background: "#ffe5e5", padding: 12, borderRadius: 8 }}>
          <b>Error:</b> {error}
        </div>
      )}

      {!loading && data && (
        <div style={{ background: "#e8fff0", padding: 12, borderRadius: 8 }}>
          <b>Backend respondió:</b>
          <pre style={{ marginTop: 10 }}>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}


