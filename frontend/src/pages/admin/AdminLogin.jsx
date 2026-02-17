import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authLogin } from "../../lib/auth";

export default function AdminLogin() {
  const nav = useNavigate();
  const loc = useLocation();
  const from = loc.state?.from || "/admin";

  const [form, setForm] = useState({ username: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const user = await authLogin(form);
      if (!user) throw new Error("Login failed");

      if (user.role !== "admin") {
        throw new Error("This account is not an admin.");
      }

      nav(from, { replace: true });
    } catch (e2) {
      setErr(e2?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ paddingTop: 40 }}>
      <div className="card" style={{ padding: 18, maxWidth: 520, margin: "0 auto" }}>
        <div className="kicker">Admin</div>
        <h1 className="h1" style={{ marginTop: 8 }}>Login</h1>
        <p className="p">Only admins can access the dashboard.</p>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, marginTop: 14 }}>
          <input
            value={form.username}
            onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
            placeholder="Username"
            required
            style={inputStyle}
          />
          <input
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            placeholder="Password"
            type="password"
            required
            style={inputStyle}
          />

          <button className="btn primary" disabled={loading} type="submit">
            {loading ? "Logging in…" : "Login"}
          </button>

          {err ? (
            <div className="card" style={{ padding: 12, borderColor: "rgba(255,0,79,0.35)" }}>
              <div style={{ fontWeight: 900, marginBottom: 4 }}>Error</div>
              <div className="p">{err}</div>
            </div>
          ) : null}
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "12px 12px",
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "rgba(255,255,255,0.03)",
  color: "var(--text)",
  outline: "none",
};
