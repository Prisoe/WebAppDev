import React, { useEffect, useState } from "react";
import { apiGet } from "../../lib/api";

function Stat({ label, value }) {
  return (
    <div className="card" style={{ padding: 16 }}>
      <div className="p" style={{ marginBottom: 8 }}>{label}</div>
      <div style={{ fontWeight: 950, fontSize: 28 }}>{value}</div>
    </div>
  );
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [stats, setStats] = useState({ projects: 0, contacts: 0, messages: 0, unread: 0 });

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setErr("");

        const [p, c, m] = await Promise.all([
          apiGet("/api/admin/projects"),
          apiGet("/api/admin/contacts"),
          apiGet("/api/admin/messages"),
        ]);

        const projects = Array.isArray(p?.projects) ? p.projects : [];
        const contacts = Array.isArray(c?.contacts) ? c.contacts : [];
        const messages = Array.isArray(m?.messages) ? m.messages : [];

        const unread = messages.filter((x) => !x.isRead).length;

        if (!mounted) return;
        setStats({ projects: projects.length, contacts: contacts.length, messages: messages.length, unread });
      } catch (e) {
        if (mounted) setErr(e?.message || "Failed to load admin stats");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div className="kicker">Admin</div>
      <h1 className="h1">Dashboard</h1>

      {loading ? <p className="p">Loading…</p> : null}

      {err ? (
        <div className="card" style={{ padding: 14, borderColor: "rgba(255,0,79,0.35)" }}>
          <div style={{ fontWeight: 900 }}>Error</div>
          <div className="p">{err}</div>
        </div>
      ) : null}

      {!loading && !err ? (
        <div
          className="grid"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}
        >
          <Stat label="Projects" value={stats.projects} />
          <Stat label="Contacts" value={stats.contacts} />
          <Stat label="Messages" value={stats.messages} />
          <Stat label="Unread" value={stats.unread} />
        </div>
      ) : null}
    </div>
  );
}
