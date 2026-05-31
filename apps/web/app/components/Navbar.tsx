"use client";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("gf-theme") as "dark" | "light" | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    }
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("gf-theme", next);
  };

  const NAV_LINKS = ["Products", "Features", "Pricing", "Docs", "Enterprise"];

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        padding: "0 40px", height: "60px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "var(--bg)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border-2)" : "1px solid transparent",
        transition: "all 0.4s ease",
      }}>
        {/* Logo */}
        <a href="#" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", color: "var(--text)" }}>
          <div style={{
            width: 28, height: 28, position: "relative",
            background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          }} />
          <span style={{
            fontFamily: "var(--font-display)", fontSize: "17px",
            fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase",
            color: "var(--text)",
          }}>GEARFORGE</span>
        </a>

        {/* Center links */}
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          {NAV_LINKS.map(link => (
            <a key={link} href="#" style={{
              color: "var(--text-3)", textDecoration: "none",
              fontSize: "13px", fontWeight: 500, letterSpacing: "0.04em",
              transition: "color 0.2s", fontFamily: "var(--font-display)",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-3)")}
            >{link}</a>
          ))}
        </div>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Theme toggle */}
          <button onClick={toggleTheme} aria-label="Toggle theme" style={{
            width: "36px", height: "36px",
            background: "var(--surface)",
            border: "1px solid var(--border-2)",
            borderRadius: "8px",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", fontSize: "16px",
            transition: "all 0.2s",
            color: "var(--text-2)",
          }}>
            {theme === "dark" ? "☀" : "◑"}
          </button>

          <button style={{
            background: "transparent", border: "none", color: "var(--text-3)",
            fontSize: "13px", fontWeight: 500, cursor: "pointer", letterSpacing: "0.03em",
            fontFamily: "var(--font-display)", padding: "0 4px",
            transition: "color 0.2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--text-3)")}
          >Sign In</button>

          <button style={{
            padding: "9px 20px",
            background: "var(--accent)",
            color: "#fff",
            border: "none", borderRadius: "8px",
            fontSize: "12px", fontWeight: 700, cursor: "pointer",
            letterSpacing: "0.08em", textTransform: "uppercase",
            fontFamily: "var(--font-display)", transition: "all 0.2s ease",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = `0 8px 24px var(--accent-glow)`;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
          >Try Free →</button>
        </div>
      </nav>
    </>
  );
}
