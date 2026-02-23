export const API_URL = import.meta.env.VITE_API_URL;

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    const msg =
      typeof data === "object"
        ? data?.error || data?.message || "Error"
        : String(data);
    throw new Error(msg);
  }

  return data;
}

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // Health
  health() {
    return request("/health");
  },

  // Auth
  register(body) {
    return request("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  login(body) {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  // Products (estas rutas tienen que existir en tu backend)
  productsList(token) {
    return request("/products", {
      method: "GET",
      headers: authHeaders(token),
    });
  },

  productsCreate(token, body) {
    return request("/products", {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(body),
    });
  },

  productsDelete(token, id) {
    return request(`/products/${id}`, {
      method: "DELETE",
      headers: authHeaders(token),
    });
  },
};
