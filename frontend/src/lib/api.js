// src/lib/api.js

// ✅ In production (Render), frontend is served by the same Express app,
// so API calls should be SAME-ORIGIN. Default to "" instead of localhost.
// For local dev you can set: VITE_API_BASE_URL=http://localhost:3000
const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

/**
 * Core request helper
 */
async function request(path, { method = "GET", body } = {}) {
  const opts = {
    method,
    credentials: "include", // REQUIRED for passport session cookies
    headers: {},
  };

  if (body !== undefined) {
    opts.headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(body);
  }

  // ✅ Ensure path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  const res = await fetch(`${API_BASE}${normalizedPath}`, opts);

  if (!res.ok) {
    throw new Error(await safeErr(res));
  }

  if (res.status === 204) return null;

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export function apiGet(path) {
  return request(path, { method: "GET" });
}

export function apiPost(path, body) {
  return request(path, { method: "POST", body });
}

export function apiPut(path, body) {
  return request(path, { method: "PUT", body });
}

export function apiDelete(path) {
  return request(path, { method: "DELETE" });
}

async function safeErr(res) {
  // Try JSON first
  try {
    const data = await res.json();
    return data?.error || data?.message || JSON.stringify(data);
  } catch {}

  // Fallback to text (often more useful than statusText)
  try {
    const t = await res.text();
    if (t) return t.slice(0, 500);
  } catch {}

  return `${res.status} ${res.statusText}`;
}
