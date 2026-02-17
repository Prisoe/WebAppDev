import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";

export default function Navbar({ variant = "public" }) {
  const [open, setOpen] = useState(false);

  const navLinkStyle = ({ isActive }) => ({
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid transparent",
    color: isActive ? "var(--accent)" : "var(--text)",
    background: isActive ? "rgba(255,0,79,0.10)" : "transparent",
  });

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        background: "rgba(8,8,8,0.72)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 0",
          gap: 14,
        }}
      >
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Replace with your logo later */}
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: "rgba(255,0,79,0.18)",
              border: "1px solid rgba(255,0,79,0.35)",
            }}
          />
          <div style={{ fontWeight: 700 }}>Prosper Alabi</div>
        </Link>

        {/* Desktop nav */}
        <nav
          style={{
            display: "none",
            gap: 6,
          }}
          className="nav-desktop"
        >
          <NavLink to="/" style={navLinkStyle}>
            Home
          </NavLink>
          <NavLink to="/about" style={navLinkStyle}>
            About
          </NavLink>
          <NavLink to="/services" style={navLinkStyle}>
            Services
          </NavLink>
          <NavLink to="/projects" style={navLinkStyle}>
            Projects
          </NavLink>
          <NavLink to="/contact" style={navLinkStyle}>
            Contact
          </NavLink>

          {variant === "public" && (
            <NavLink to="/admin/login" style={navLinkStyle}>
              Admin
            </NavLink>
          )}
        </nav>

        {/* Mobile toggle */}
        <button className="btn" onClick={() => setOpen((v) => !v)}>
          Menu
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          className="container"
          style={{
            paddingBottom: 14,
            display: "grid",
            gap: 10,
          }}
        >
          <NavLink onClick={() => setOpen(false)} to="/" style={navLinkStyle}>
            Home
          </NavLink>
          <NavLink
            onClick={() => setOpen(false)}
            to="/about"
            style={navLinkStyle}
          >
            About
          </NavLink>
          <NavLink
            onClick={() => setOpen(false)}
            to="/services"
            style={navLinkStyle}
          >
            Services
          </NavLink>
          <NavLink
            onClick={() => setOpen(false)}
            to="/projects"
            style={navLinkStyle}
          >
            Projects
          </NavLink>
          <NavLink
            onClick={() => setOpen(false)}
            to="/contact"
            style={navLinkStyle}
          >
            Contact
          </NavLink>
          <NavLink
            onClick={() => setOpen(false)}
            to="/admin/login"
            style={navLinkStyle}
          >
            Admin
          </NavLink>
        </div>
      )}

      {/* Quick CSS to show desktop nav on wide screens */}
      <style>{`
        @media (min-width: 900px) {
          .nav-desktop { display: flex !important; }
          header button.btn { display: none; }
        }
      `}</style>
    </header>
  );
}
