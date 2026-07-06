// Vite exposes public frontend variables through import.meta.env.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// This helper handles JSON API calls and turns server errors into readable messages.
export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "The request failed. Please try again.");
  }

  return data;
}
