import { useEffect, useMemo, useState } from "react";
import { api } from "./api";

export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    sku: "",
    price: 0,
    stock: 0,
    active: true,
  });

  const [editingId, setEditingId] = useState(null);

  const title = useMemo(() => (editingId ? "Editar producto" : "Crear producto"), [editingId]);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await api("/products");
      setItems(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function resetForm() {
    setEditingId(null);
    setForm({ name: "", sku: "", price: 0, stock: 0, active: true });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    setError("");

    try {
      if (!form.name || form.name.trim().length < 2) {
        setError("El nombre es requerido (mín 2 caracteres)");
        return;
      }

      if (editingId) {
        await api(`/products/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
        setMsg("Producto actualizado ✅");
      } else {
        await api("/products", {
          method: "POST",
          body: JSON.stringify(form),
        });
        setMsg("Producto creado ✅");
      }

      resetForm();
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  function startEdit(p) {
    setMsg("");
    setError("");
    setEditingId(p.id);
    setForm({
      name: p.name ?? "",
      sku: p.sku ?? "",
      price: Number(p.price ?? 0),
      stock: Number(p.stock ?? 0),
      active: Boolean(p.active),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function remove(id) {
    const ok = confirm("¿Eliminar este producto?");
    if (!ok) return;

    setMsg("");
    setError("");
    try {
      await api(`/products/${id}`, { method: "DELETE" });
      setMsg("Producto eliminado ✅");
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div style={{ fontFamily: "system-ui", padding: 20, maxWidth: 1000, margin: "0 auto" }}>
      <h1>Ary Sistema — Productos</h1>

      <div style={{ margin: "12px 0" }}>
        {msg && <div style={{ padding: 10, background: "#eaffea", border: "1px solid #b7f5b7" }}>{msg}</div>}
        {error && <div style={{ padding: 10, background: "#ffecec", border: "1px solid #ffbdbd" }}>{error}</div>}
      </div>

      <section style={{ padding: 16, border: "1px solid #ddd", borderRadius: 12 }}>
        <h2 style={{ marginTop: 0 }}>{title}</h2>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(4, 1fr)" }}>
          <div style={{ gridColumn: "span 2" }}>
            <label>Nombre</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Ej: ARY-ONE 250ml"
              style={{ width: "100%", padding: 10 }}
            />
          </div>

          <div>
            <label>SKU</label>
            <input
              value={form.sku}
              onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
              placeholder="Ej: ARYONE250"
              style={{ width: "100%", padding: 10 }}
            />
          </div>

          <div>
            <label>Activo</label>
            <select
              value={form.active ? "true" : "false"}
              onChange={(e) => setForm((f) => ({ ...f, active: e.target.value === "true" }))}
              style={{ width: "100%", padding: 10 }}
            >
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>
          </div>

          <div>
            <label>Precio</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
              style={{ width: "100%", padding: 10 }}
            />
          </div>

          <div>
            <label>Stock</label>
            <input
              type="number"
              value={form.stock}
              onChange={(e) => setForm((f) => ({ ...f, stock: Number(e.target.value) }))}
              style={{ width: "100%", padding: 10 }}
            />
          </div>

          <div style={{ gridColumn: "span 2", display: "flex", gap: 10, alignItems: "end" }}>
            <button type="submit" style={{ padding: "10px 14px", cursor: "pointer" }}>
              {editingId ? "Guardar cambios" : "Crear"}
            </button>
            <button type="button" onClick={resetForm} style={{ padding: "10px 14px", cursor: "pointer" }}>
              Limpiar
            </button>
            <button type="button" onClick={load} style={{ padding: "10px 14px", cursor: "pointer" }}>
              Recargar
            </button>
          </div>
        </form>
      </section>

      <section style={{ marginTop: 18 }}>
        <h2>Listado</h2>

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Nombre", "SKU", "Precio", "Stock", "Activo", "Acciones"].map((h) => (
                    <th key={h} style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 10 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id}>
                    <td style={{ padding: 10, borderBottom: "1px solid #f0f0f0" }}>{p.name}</td>
                    <td style={{ padding: 10, borderBottom: "1px solid #f0f0f0" }}>{p.sku ?? "-"}</td>
                    <td style={{ padding: 10, borderBottom: "1px solid #f0f0f0" }}>{Number(p.price ?? 0)}</td>
                    <td style={{ padding: 10, borderBottom: "1px solid #f0f0f0" }}>{Number(p.stock ?? 0)}</td>
                    <td style={{ padding: 10, borderBottom: "1px solid #f0f0f0" }}>{p.active ? "Sí" : "No"}</td>
                    <td style={{ padding: 10, borderBottom: "1px solid #f0f0f0", display: "flex", gap: 10 }}>
                      <button onClick={() => startEdit(p)} style={{ cursor: "pointer" }}>
                        Editar
                      </button>
                      <button onClick={() => remove(p.id)} style={{ cursor: "pointer" }}>
                        Borrar
                      </button>
                    </td>
                  </tr>
                ))}

                {items.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: 14 }}>
                      No hay productos todavía.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}



