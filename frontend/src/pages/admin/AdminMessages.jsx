import React, { useEffect, useMemo, useState } from "react";
import { apiGet, apiPut } from "../../lib/api";

export default function AdminMessages() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [messages, setMessages] = useState([]);
  const [q, setQ] = useState("");

  async function refresh() {
    const data = await apiGet("/api/admin/messages");
    setMessages(Array.isArray(data?.messages) ? data.messages : []);
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        await refresh();
      } catch (e) {
        if (mounted) setErr(e?.message || "Failed to load messages");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return messages.filter((m) => {
      const blob = `${m.name || ""} ${m.email || ""} ${m.message || ""}`.toLowerCase();
      return term ? blob.includes(term) : true;
    });
  }, [messages, q]);

  async function markRead(id) {
    try {
      await apiPut(`/api/admin/messages/${id}/read`, {});
      await refresh();
    } catch (e) {
      setErr(e?.message || "Failed to mark as read");
    }
  }

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div className="kicker">Admin</div>
      <h1 className="h1">Messages</h1>

      <div className="card" style={{ padding: 14, display: "grid", gap: 10 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search messages…"
          style={{
            padding: "12px 12px",
            borderRadius: 12,
            border: "1px solid var(--border)",
            background: "rgba(255,255,255,0.03)",
            color: "var(--text)",
            outline: "none",
          }}
        />
      </div>

      {loading ? <p className="p">Loading…</p> : null}

      {err ? (
        <div className="card" style={{ padding: 12, borderColor: "rgba(255,0,79,0.35)" }}>
          <div style={{ fontWeight: 900 }}>Error</div>
          <div className="p">{err}</div>
        </div>
      ) : null}

      <div className="card" style={{ padding: 14 }}>
        <div style={{ fontWeight: 900, marginBottom: 10 }}>Inbox</div>

        <div style={{ display: "grid", gap: 10 }}>
          {filtered.map((m) => (
            <div
              key={m._id}
              className="card"
              style={{
                padding: 12,
                borderColor: m.isRead ? "var(--border)" : "rgba(255,0,79,0.45)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 950 }}>
                    {m.name} {!m.isRead ? <span style={{ color: "var(--accent)" }}>• New</span> : null}
                  </div>
                  <div className="p">{m.email}</div>
                  <div className="p" style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>
                    {m.message}
                  </div>
                </div>

                {!m.isRead ? (
                  <button className="btn primary" onClick={() => markRead(m._id)}>
                    Mark read
                  </button>
                ) : null}
              </div>
            </div>
          ))}

          {!loading && filtered.length === 0 ? <p className="p">No messages.</p> : null}
        </div>
      </div>
    </div>
  );
}
