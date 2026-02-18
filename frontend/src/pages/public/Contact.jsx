import React, { useState } from "react";
import { apiPost } from "../../lib/api";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "", phone: "" });
  const [status, setStatus] = useState({ type: "idle", msg: "" }); // idle | loading | ok | err

  function update(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setStatus({ type: "loading", msg: "" });

    try {
      // backend expects: { name, email, message }
      await apiPost("/api/contact", {
        name: form.name,
        email: form.email,
        message: form.message,
        phone: form.phone, // harmless if backend ignores; useful later if you store it
      });

      setStatus({ type: "ok", msg: "Message sent. I’ll get back to you." });
      setForm({ name: "", email: "", message: "", phone: "" });
    } catch (err) {
      setStatus({ type: "err", msg: err?.message || "Failed to send message" });
    }
  }

  return (
    <div className="container">
      <div style={{ display: "grid", gap: 14 }}>
        <div className="kicker">Contact</div>
        <h1 className="h1">Contact Me</h1>
        <p className="p" style={{ maxWidth: 850 }}>
          Fill out the form to send me a direct message and I'll get back to you, Thanks.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
          <div className="card" style={{ padding: 16 }}>
            <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
              <input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Your name"
                required
                style={inputStyle}
              />
              <input
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="Your email"
                type="email"
                required
                style={inputStyle}
              />
              <input
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="Phone (optional)"
                style={inputStyle}
              />
              <textarea
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                placeholder="Your message"
                rows={6}
                required
                style={{ ...inputStyle, resize: "vertical" }}
              />

              <button className="btn primary" disabled={status.type === "loading"} type="submit">
                {status.type === "loading" ? "Sending…" : "Send"}
              </button>

              {status.type === "ok" ? (
                <div className="card" style={{ padding: 12, borderColor: "rgba(0,255,120,0.25)" }}>
                  <div style={{ fontWeight: 800 }}>{status.msg}</div>
                </div>
              ) : null}

              {status.type === "err" ? (
                <div className="card" style={{ padding: 12, borderColor: "rgba(255,0,79,0.35)" }}>
                  <div style={{ fontWeight: 800 }}>Error</div>
                  <div className="p">{status.msg}</div>
                </div>
              ) : null}
            </form>
          </div>

          <div className="card" style={{ padding: 16 }}>
            <div style={{ fontWeight: 900, marginBottom: 8 }}>Direct</div>
            <div className="p">Email: prosperalabi7@gmail.com</div>
            <div className="p">GitHub: Prisoe</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
              <a className="btn" href="https://github.com/Prisoe" target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a className="btn" href="https://www.linkedin.com/in/prosperalabi/" target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
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
