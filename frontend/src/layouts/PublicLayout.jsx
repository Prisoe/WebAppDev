import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

export default function PublicLayout() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "calc(100vh - 120px)", paddingTop: 20, paddingBottom: 40 }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
