import { apiGet, apiPost } from "./api";

export async function authMe() {
  const data = await apiGet("/api/auth/me");
  return data?.user || null;
}

export async function authLogin({ username, password }) {
  const data = await apiPost("/api/auth/login", { username, password });
  return data?.user || null;
}

export async function authLogout() {
  await apiPost("/api/auth/logout");
  return true;
}
