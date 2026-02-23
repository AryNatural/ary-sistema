import { useEffect, useState } from "react";
import { api } from "./api";

export default function App() {
  // Tabs
  const [tab, setTab] = useState("auth"); // "auth" | "products"

  // Health
  const [health, setHealth] = useState("Cargando...");

  // Register
  const [rName, setRName] = useState("");
  const [rEmail, setREmail] = useState("");
  const [rPass, setRPass] = useState("");

  // Login
  const [lEmail, setLEmail] = useState("");
  const [lPass, setLPass] = useState("");

  // Result
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("ary_token") || "");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  // Products
  const [products, setProducts] = useState([]);
  const [pSku, setPSku] = useState("");
  const [pNombre, setPNombre] = useState("");
  const [pCategoria, setPCategoria] = useState("General");
  const [pMl, setPMl] = useState("");
  const [pCosto, setPCosto] = useState("");
  const [pPrecio, setPPrecio] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await api.health();
        setHealth(data?.ok ? "OK ✅" : JSON.stringify(data));
      } catch (e) {
        setHealth("Failed to fetch");
      }
    })();
  }, []);

  // helpers
  function clearAlerts() {
    setMsg("");
    setError("");
  }

  async function onRegister(e) {
    e.preventDefault();
    clearAlerts();
    try {
      const data = await api.register({ name: rName, email: rEmail, password: rPass });
      // backend debería devolver token + user (como ya te sale)
      if (data?.token) {
        localStorage.setItem("ary_token", data.token);
        setToken(data.token);
      }
      if (data?.user) setUser(data.user);

      setMsg("✅ Registro exitoso. Token guardado.");
      setTab("products");
      await loadProducts(data?.token || token || localStorage.getItem("ary_token"));
    } catch (e) {
      setError(e.message || "Error registrando");
    }
  }

  async function onLogin(e) {
    e.preventDefault();
    clearAlerts();
    try {
      const data = await api.login({ email: lEmail, password: lPass });
      if (data?.token) {
        localStorage.setItem("ary_token", data.token);
        setToken(data.token);
      }
      if (data?.user) setUser(data.user);

      setMsg("✅ Login exitoso. Token guardado.");
      setTab("products");
      await loadProducts(data?.token || token || localStorage.getItem("ary_token"));
    } catch (e) {
      setError(e.message || "Error login");
    }
  }

  function onLogout() {
    clearAlerts();
    localStorage.removeItem("ary_token");
    setToken("");
    setUser(null);
    setProducts([]);
    setTab("auth");
    setMsg("✅ Sesión cerrada.");
  }

  async function loadProducts(t = token) {
    clearAlerts();
    if (!t) {
      setError("Primero inicia sesión (token faltante).");
      return;
    }
    try {
      const data = await api.productsList(t);
      setProducts(data?.products || []);
    } catch (e) {
      setError(e.message || "Error listando productos");
    }
  }

  async function createProduct(e) {
    e.preventDefault();
    clearAlerts();
    if (!token) {
      setError("Primero inicia sesión (token faltante).");
      return;
    }
    try {
      const payload = {
        sku: pSku.trim(),
        nombre: pNombre.trim(),
        categoria: pCategoria.trim() || "General",
        presentacion_ml: pMl ? Number(pMl) : null,
        costo: pCosto ? Number(pCosto) : 0,
        precio: pPrecio ? Number(pPrecio) : 0,
      };
      const data = await api.productsCreate(token, payload);
      setMsg("✅ Producto creado.");
      // reset
      setPSku("");
      setPNombre("");
      setPCategoria("General");
      setPMl("");
      setPCosto("");
      setPPrecio("");

      // refresh list
      await loadProducts(token);
    } catch (e) {
      setError(e.message || "Error creando producto");
    }
  }

  async function deleteProduct(id) {
    clearAlerts();
    if (!token) {
      setError("Primero inicia sesión (token faltante).");
      return;
    }
    try {
      await api.productsDelete(token, id);
      setMsg("🗑️ Producto eliminado.");
      await loadProducts(token);
    } catch (e) {
      setError(e.message || "Error eliminando producto");
    }
  }

  // UI
  return (
    <div style={{ maxWidth: 980, margin: "30px auto", padding: 16, fontFamily: "Arial" }}>
      <h1 style={{ marginBottom: 6 }}>ARY Sistema — Panel</h1>
      <div style={{ marginBottom: 16 }}>
        <strong>/health:</strong> {health}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <button
          onClick={() => setTab("auth")}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #ddd",
            background: tab === "auth" ? "#111" : "#f4f4f4",
            color: tab === "auth" ? "white" : "black",
            cursor: "pointer",
          }}
        >
          Auth
        </button>
        <button
          onClick={async () => {
            setTab("products");
            await loadProducts(token);
          }}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #ddd",
            background: tab === "products" ? "#111" : "#f4f4f4",
            color: tab === "products" ? "white" : "black",
            cursor: "pointer",
          }}
        >
          Productos
        </button>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          <small style={{ color: "#555" }}>
            Token: {token ? "✅" : "—"}{" "}
            {user?.email ? `| ${user.email}` : ""}
          </small>
          <button
            onClick={onLogout}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #ddd",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div style={{ background: "#ffe5e5", border: "1px solid #ffb3b3", padding: 12, borderRadius: 10, marginBottom: 14 }}>
          ❌ {error}
        </div>
      )}
      {msg && (
        <div style={{ background: "#e7ffe7", border: "1px solid #b7f5b7", padding: 12, borderRadius: 10, marginBottom: 14 }}>
          ✅ {msg}
        </div>
      )}

      {tab === "auth" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <div style={{ border: "1px solid #e6e6e6", padding: 16, borderRadius: 12 }}>
            <h2>Registrar usuario</h2>
            <form onSubmit={onRegister}>
              <input value={rName} onChange={(e) => setRName(e.target.value)} placeholder="Nombre" style={inputStyle} />
              <input value={rEmail} onChange={(e) => setREmail(e.target.value)} placeholder="Email" style={inputStyle} />
              <input value={rPass} onChange={(e) => setRPass(e.target.value)} placeholder="Password" type="password" style={inputStyle} />
              <button style={btnStyle}>Crear cuenta</button>
            </form>
          </div>

          <div style={{ border: "1px solid #e6e6e6", padding: 16, borderRadius: 12 }}>
            <h2>Login</h2>
            <form onSubmit={onLogin}>
              <input value={lEmail} onChange={(e) => setLEmail(e.target.value)} placeholder="Email" style={inputStyle} />
              <input value={lPass} onChange={(e) => setLPass(e.target.value)} placeholder="Password" type="password" style={inputStyle} />
              <button style={btnStyle}>Entrar</button>
            </form>
          </div>

          <div style={{ gridColumn: "1 / -1", border: "1px solid #e6e6e6", padding: 16, borderRadius: 12 }}>
            <h2>Resultado</h2>
            <div style={{ marginBottom: 10 }}>
              <strong>Usuario:</strong>
              <pre style={preStyle}>{JSON.stringify(user, null, 2)}</pre>
            </div>
            <div>
              <strong>Token:</strong>
              <pre style={preStyle}>{token || "(vacío)"}</pre>
            </div>
            <small style={{ color: "#666" }}>Nota: el token se guarda en localStorage como <code>ary_token</code>.</small>
          </div>
        </div>
      )}

      {tab === "products" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <div style={{ border: "1px solid #e6e6e6", padding: 16, borderRadius: 12 }}>
            <h2>Crear producto</h2>
            <form onSubmit={createProduct}>
              <input value={pSku} onChange={(e) => setPSku(e.target.value)} placeholder="SKU (único) ej: ARY-ONE-250" style={inputStyle} />
              <input value={pNombre} onChange={(e) => setPNombre(e.target.value)} placeholder="Nombre" style={inputStyle} />
              <input value={pCategoria} onChange={(e) => setPCategoria(e.target.value)} placeholder="Categoría (ej: Shampoo)" style={inputStyle} />
              <input value={pMl} onChange={(e) => setPMl(e.target.value)} placeholder="Presentación ML (opcional)" style={inputStyle} />
              <input value={pCosto} onChange={(e) => setPCosto(e.target.value)} placeholder="Costo (₡) ej: 2500" style={inputStyle} />
              <input value={pPrecio} onChange={(e) => setPPrecio(e.target.value)} placeholder="Precio (₡) ej: 8500" style={inputStyle} />
              <button style={btnStyle}>Guardar producto</button>
            </form>
          </div>

          <div style={{ border: "1px solid #e6e6e6", padding: 16, borderRadius: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ margin: 0 }}>Lista de productos</h2>
              <button
                onClick={() => loadProducts(token)}
                style={{ ...btnStyle, width: "auto", padding: "10px 12px" }}
              >
                Refrescar
              </button>
            </div>

            <div style={{ marginTop: 12 }}>
              {products.length === 0 ? (
                <div style={{ color: "#666" }}>No hay productos aún.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {products.map((p) => (
                    <div key={p.id} style={{ border: "1px solid #eee", borderRadius: 10, padding: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                        <div>
                          <div style={{ fontWeight: 700 }}>{p.nombre}</div>
                          <div style={{ color: "#666", fontSize: 13 }}>
                            SKU: {p.sku} | {p.categoria} | {p.presentacion_ml ? `${p.presentacion_ml}ml` : "—"}
                          </div>
                          <div style={{ color: "#333", fontSize: 13 }}>
                            Costo: {p.costo} | Precio: {p.precio}
                          </div>
                        </div>

                        <button
                          onClick={() => deleteProduct(p.id)}
                          style={{
                            border: "1px solid #ddd",
                            background: "#fff",
                            borderRadius: 8,
                            padding: "10px 12px",
                            cursor: "pointer",
                            height: 40,
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ gridColumn: "1 / -1", color: "#666", fontSize: 13 }}>
            * Productos requiere token. Si te da error 401, ve a <b>Auth</b> y haz login.
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px 12px",
  borderRadius: 10,
  border: "1px solid #ddd",
  marginTop: 10,
  boxSizing: "border-box",
};

const btnStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid #ddd",
  marginTop: 12,
  cursor: "pointer",
  background: "#f3f3f3",
};

const preStyle = {
  background: "#f6f6f6",
  padding: 12,
  borderRadius: 10,
  overflowX: "auto",
};
