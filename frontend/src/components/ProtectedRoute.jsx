import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authMe } from "../lib/auth";

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState("loading"); // loading | authed | unauth | forbidden
  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const user = await authMe();
        if (!mounted) return;

        if (!user) {
          setStatus("unauth");
          return;
        }

        if (user.role !== "admin") {
          setStatus("forbidden");
          return;
        }

        setStatus("authed");
      } catch {
        if (mounted) setStatus("unauth");
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (status === "loading") {
    return (
      <div className="container" style={{ paddingTop: 40 }}>
        <div className="card" style={{ padding: 16 }}>
          <div style={{ fontWeight: 800, marginBottom: 6 }}>Checking access…</div>
          <div className="p">Validating your admin session.</div>
        </div>
      </div>
    );
  }

  if (status === "forbidden") {
    return (
      <div className="container" style={{ paddingTop: 40 }}>
        <div className="card" style={{ padding: 16, borderColor: "rgba(255,0,79,0.35)" }}>
          <div style={{ fontWeight: 900, marginBottom: 8 }}>Admins only</div>
          <div className="p">
            You are logged in, but your account does not have admin privileges.
          </div>
        </div>
      </div>
    );
  }

  if (status === "unauth") {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
