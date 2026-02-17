import React, { useEffect, useState } from "react";
import { API_URL, healthCheck } from "./api.js";


export default function App() {
  const [status, setStatus] = useState("probando...");
  const [details, setDetails] = useState(null);


  useEffect(() => {
    (async () => {
      try {
        const data = await healthCheck();
        setStatus("✅ Backend conectado");
        setDetails(data);
      } catch (e) {
        setStatus("❌ No pude conectar con el backend");
        setDetails({ error: String(e.message || e) });
      }
    })();
  }, []);


  return (
    <div className="page">
      <header className="header">
        <h1>ARY Sistema</h1>
        <p className="muted">Frontend (Vite + React) conectado a tu API</p>
      </header>


      <section className="card">
        <h2>Estado</h2>
        <p className="status">{status}</p>


        <div className="grid">
          <div className="box">
            <div className="label">API URL</div>
            <div className="value">{API_URL}</div>
          </div>


          <div className="box">
            <div className="label">Respuesta /health</div>
            <pre className="pre">{JSON.stringify(details, null, 2)}</pre>
          </div>
        </div>


        <p className="hint">
          Siguiente: aquí agregamos Login, Productos, Inventario, Ventas, etc.
        </p>
      </section>


      <footer className="footer">
        <span className="muted">Ary Natural Hair Line • Sistema</span>
      </footer>
    </div>
  );

}
import { useEffect, useState } from "react";
import { API_URL, apiGet } from "./api";

export default function App() {
  const [health, setHealth] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet("/health")
      .then(setHealth)
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div style={{ fontFamily: "system-ui", padding: 24 }}>
      <h1>Ary Sistema — Frontend</h1>
      <p><b>API:</b> {API_URL}</p>

      {!health && !error && <p>Cargando /health...</p>}
      {error && <pre style={{ color: "crimson" }}>{error}</pre>}
      {health && (
        <pre style={{ background: "#111", color: "#0f0", padding: 12, borderRadius: 8 }}>
          {JSON.stringify(health, null, 2)}
        </pre>
      )}
    </div>
  );
}
