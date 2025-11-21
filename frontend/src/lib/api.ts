import { useAuth } from "../context/AuthContext";

export function useApi() {
  const { accessToken } = useAuth();
  const API = import.meta.env.VITE_API_URL;

  async function apiFetch(path: string, options: RequestInit = {}) {
    const headers = new Headers(options.headers);

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    const res = await fetch(`${API}${path}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "API Error");
    }

    // Allow empty responses (204)
    if (res.status === 204) return null;

    return res.json();
  }

  return { apiFetch };
}
