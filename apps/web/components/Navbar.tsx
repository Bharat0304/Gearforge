"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 300,
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
        background: scrolled ? "rgba(0,0,0,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        transition: "all 0.3s ease",
      }}
    >
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
        <div style={{
          width: 26, height: 26,
          background: "linear-gradient(135deg, #ff4422, #ffaa00)",
          clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
        }} />
        <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", color: "#fff" }}>
          Gearforge
        </span>
      </Link>

      <div style={{ display: "flex", gap: 28 }}>
        {["Features", "Pricing", "Docs", "Enterprise"].map((l) => (
          <a key={l} href="#" style={{ color: "var(--text3)", fontSize: 12, fontWeight: 500, letterSpacing: ".04em", textDecoration: "none", transition: "color .15s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text3)")}
          >{l}</a>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Link href="/signin" style={{
          background: "transparent", color: "var(--text2)", fontSize: 12, fontWeight: 600,
          padding: "8px 16px", border: "1px solid rgba(255,255,255,0.12)", textDecoration: "none",
          transition: "all .18s",
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#fff"; (e.currentTarget as HTMLAnchorElement).style.color = "#000"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; (e.currentTarget as HTMLAnchorElement).style.color = "var(--text2)"; }}
        >Sign In</Link>
        <Link href="/signup" style={{
          background: "var(--red)", color: "#fff", fontSize: 11, fontWeight: 700,
          padding: "9px 20px", textDecoration: "none", letterSpacing: ".08em", textTransform: "uppercase",
          transition: "all .18s",
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#ff6644"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--red)"; }}
        >Try Free →</Link>
      </div>
    </nav>
  );
}
