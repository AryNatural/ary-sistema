import { useEffect, useState } from "react";
import { api } from "./api";

export default function App() {
  const [health, setHealth] = useState(null);

  // Register
  const [rName, setRName] = useState("");
  const [rEmail, setREmail] = useState("");
  const [rPass, setRPass] = useState("");

  // Login
  const [lEmail, setLEmail] = useState("");
  const [lPass, setLPass] = useState("");

  // Result
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api("/health")
      .then((d) => setHealth(d))
      .catch((e) => setError(e.message));
  }, []);

  function clearAlerts() {
    setMsg("");
    setError("");
  }

  async function register(e) {
    e.preventDefault();
    clearAlerts();

    try {
      const data = await api("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: rName,
          email: rEmail,
          password: rPass,
        }),
      });

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("ary_token", data.token);
      setMsg("✅ Registro exitoso. Token guardado.");
    } catch (e) {
      setError(e.message);
    }
  }

  async function login(e) {
    e.preventDefault();
    clearAlerts();

    try {
      const data = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: lEmail,
          password: lPass,
        }),
      });

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("ary_token", data.token);
      setMsg("✅ Login exitoso. Token guardado.");
    } catch (e) {
      setError(e.message);
    }
  }

  function logout() {
    localStorage.removeItem("ary_token");
    setUser(null);
    setToken("");
    setMsg("✅ Sesión cerrada.");
    setError("");
  }

  return (
    <div style={{ fontFamily: "system-ui", padding: 20, maxWidth: 980, margin: "0 auto" }}>
      <h1>ARY Sistema — Prueba de Auth</h1>

      <div style={{ marginBottom: 12 }}>
        <b>/health:</b>{" "}
        {health ? (
          <span style={{ color: "green" }}>OK ✅</span>
        ) : (
          <span style={{ opacity: 0.8 }}>Cargando...</span>
        )}
      </div>

      {msg && (
        <div style={{ padding: 10, background: "#eaffea", border: "1px solid #b7f5b7", borderRadius: 8 }}>
          {msg}
        </div>
      )}
      {error && (
        <div style={{ padding: 10, background: "#ffecec", border: "1px solid #ffbdbd", borderRadius: 8 }}>
          ❌ {error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
        {/* REGISTER */}
        <section style={{ padding: 16, border: "1px solid #ddd", borderRadius: 12 }}>
          <h2 style={{ marginTop: 0 }}>Registrar usuario</h2>

          <form onSubmit={register} style={{ display: "grid", gap: 10 }}>
            <input
              value={rName}
              onChange={(e) => setRName(e.target.value)}
              placeholder="Nombre"
              style={{ padding: 10 }}
              required
            />
            <input
              value={rEmail}
              onChange={(e) => setREmail(e.target.value)}
              placeholder="Email"
              type="email"
              style={{ padding: 10 }}
              required
            />
            <input
              value={rPass}
              onChange={(e) => setRPass(e.target.value)}
              placeholder="Password"
              type="password"
              style={{ padding: 10 }}
              required
            />
            <button style={{ padding: 10, cursor: "pointer" }}>Crear cuenta</button>
          </form>
        </section>

        {/* LOGIN */}
        <section style={{ padding: 16, border: "1px solid #ddd", borderRadius: 12 }}>
          <h2 style={{ marginTop: 0 }}>Login</h2>

          <form onSubmit={login} style={{ display: "grid", gap: 10 }}>
            <input
              value={lEmail}
              onChange={(e) => setLEmail(e.target.value)}
              placeholder="Email"
              type="email"
              style={{ padding: 10 }}
              required
            />
            <input
              value={lPass}
              onChange={(e) => setLPass(e.target.value)}
              placeholder="Password"
              type="password"
              style={{ padding: 10 }}
              required
            />
            <button style={{ padding: 10, cursor: "pointer" }}>Entrar</button>
          </form>
        </section>
      </div>

      {/* RESULT */}
      <section style={{ marginTop: 16, padding: 16, border: "1px solid #ddd", borderRadius: 12 }}>
        <h2 style={{ marginTop: 0 }}>Resultado</h2>

        <div style={{ display: "grid", gap: 10 }}>
          <div>
            <b>Usuario:</b>
            <pre style={{ background: "#f7f7f7", padding: 10, borderRadius: 8 }}>
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>

          <div>
            <b>Token:</b>
            <pre style={{ background: "#f7f7f7", padding: 10, borderRadius: 8, whiteSpace: "pre-wrap" }}>
              {token || "(vacío)"}
            </pre>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={logout} style={{ padding: 10, cursor: "pointer" }}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </section>

      <p style={{ marginTop: 12, opacity: 0.75 }}>
        Nota: el token se guarda en <code>localStorage</code> como <code>ary_token</code>.
      </p>
    </div>
  );
}
