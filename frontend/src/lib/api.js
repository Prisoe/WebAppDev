const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

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

  const res = await fetch(`${API_BASE}${path}`, opts);

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
  try {
    const data = await res.json();
    return data?.error || data?.message || JSON.stringify(data);
  } catch {
    return `${res.status} ${res.statusText}`;
  }
}
