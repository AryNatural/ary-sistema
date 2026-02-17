export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";


export async function healthCheck() {
  const res = await fetch(`${API_URL}/health`);
  if (!res.ok) throw new Error(`Health falló: ${res.status}`);
  return res.json();
}