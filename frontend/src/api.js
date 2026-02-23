export const API_URL = import.meta.env.VITE_API_URL;

// Helpers
function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

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

export const api = {
  // Health
  health() {
    return request("/health", { method: "GET" });
  },

  // Auth
  register(payload) {
    return request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  login(payload) {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // Products
  productsList(token) {
    return request("/products", {
      method: "GET",
      headers: authHeaders(token),
    });
  },

  productsCreate(token, payload) {
    return request("/products", {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(payload),
    });
  },
};


