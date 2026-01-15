const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export async function analyzeListing(inputText) {
  const response = await fetch(`${API_BASE}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ inputText })
  });

  if (!response.ok) {
    throw new Error("Failed to analyze listing");
  }

  return response.json();
}

export async function fetchHistory() {
  const response = await fetch(`${API_BASE}/api/history`);
  if (!response.ok) {
    throw new Error("Failed to load history");
  }
  return response.json();
}

export async function rerunAnalysis(id) {
  const response = await fetch(`${API_BASE}/api/rerun/${id}`, {
    method: "POST"
  });
  if (!response.ok) {
    throw new Error("Failed to rerun analysis");
  }
  return response.json();
}
