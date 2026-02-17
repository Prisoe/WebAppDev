import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { authLogout } from "../lib/auth";

function SideLink({ to, label }) {
  return (
    <NavLink
      to={to}
      end={to === "/admin"}
      className={({ isActive }) =>
        "btn" + (isActive ? " primary" : "")
      }
      style={{ justifyContent: "flex-start", width: "100%" }}
    >
      {label}
    </NavLink>
  );
}

export default function AdminLayout() {
  const navigate = useNavigate();

  async function onLogout() {
    try {
      await authLogout();
    } finally {
      navigate("/admin/login", { replace: true });
    }
  }

  return (
    <div className="container" style={{ paddingTop: 18 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: 16,
          alignItems: "start",
        }}
      >
        <aside className="card" style={{ padding: 14, position: "sticky", top: 18 }}>
          <div style={{ display: "grid", gap: 10 }}>
            <div style={{ fontWeight: 900, fontSize: 18 }}>Admin</div>
            <div className="p" style={{ marginTop: -4 }}>
              Manage projects, contacts, and messages.
            </div>

            <div style={{ display: "grid", gap: 10, marginTop: 6 }}>
              <SideLink to="/admin" label="Dashboard" />
              <SideLink to="/admin/projects" label="Projects" />
              <SideLink to="/admin/contacts" label="Contacts" />
              <SideLink to="/admin/messages" label="Messages" />
            </div>

            <div style={{ height: 1, background: "var(--border)", margin: "10px 0" }} />

            <button className="btn" onClick={onLogout} style={{ width: "100%" }}>
              Logout
            </button>
          </div>
        </aside>

        <section style={{ minWidth: 0 }}>
          <Outlet />
        </section>
      </div>
    </div>
  );
}
