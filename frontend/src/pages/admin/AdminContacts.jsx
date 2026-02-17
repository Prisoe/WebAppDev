import React, { useEffect, useMemo, useState } from "react";
import { apiDelete, apiGet } from "../../lib/api";

export default function AdminContacts() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [contacts, setContacts] = useState([]);
  const [q, setQ] = useState("");

  async function refresh() {
    const data = await apiGet("/api/admin/contacts");
    setContacts(Array.isArray(data?.contacts) ? data.contacts : []);
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        await refresh();
      } catch (e) {
        if (mounted) setErr(e?.message || "Failed to load contacts");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return contacts.filter((c) => {
      const blob = `${c.username || ""} ${c.email || ""} ${c.contactNumber || ""}`.toLowerCase();
      return term ? blob.includes(term) : true;
    });
  }, [contacts, q]);

  async function onDelete(id) {
    if (!confirm("Delete this contact?")) return;
    try {
      await apiDelete(`/api/admin/contacts/${id}`);
      await refresh();
    } catch (e) {
      setErr(e?.message || "Delete failed");
    }
  }

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div className="kicker">Admin</div>
      <h1 className="h1">Contacts</h1>

      <div className="card" style={{ padding: 14, display: "grid", gap: 10 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search contacts…"
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
        <div style={{ fontWeight: 900, marginBottom: 10 }}>Contact list</div>

        <div style={{ display: "grid", gap: 10 }}>
          {filtered.map((c) => (
            <div key={c._id} className="card" style={{ padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 900 }}>{c.username}</div>
                  <div className="p">{c.email}</div>
                  <div className="p">{c.contactNumber}</div>
                </div>
                <button className="btn" onClick={() => onDelete(c._id)}>Delete</button>
              </div>
            </div>
          ))}

          {!loading && filtered.length === 0 ? <p className="p">No contacts found.</p> : null}
        </div>
      </div>
    </div>
  );
}
