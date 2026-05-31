"use client";
import { useEffect, useRef } from "react";

const TESTIMONIALS = [
  {
    quote: "Cut our game asset pipeline from 3 weeks to a single afternoon. The topology quality is production-ready straight out of Gearforge.",
    author: "Jordan Kim",
    role: "Lead 3D Artist · Tencent Games",
    initials: "JK",
    accent: "var(--accent)",
  },
  {
    quote: "CAD export quality rivals tools costing 10× as much. Integrated directly into our engineering workflow for rapid prototyping.",
    author: "Sophie Laurent",
    role: "Head of Engineering · Bambu Lab",
    initials: "SL",
    accent: "var(--accent-2)",
  },
  {
    quote: "The sketch-to-3D pipeline is absurd. I sketch something rough on my iPad and Gearforge interprets the intent perfectly every time.",
    author: "Marcus Reyes",
    role: "Industrial Designer · Freelance",
    initials: "MR",
    accent: "var(--accent-3)",
  },
];

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting) { el.style.opacity = "1"; el.style.transform = "translateY(0)"; }
    }, { threshold: 0.08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section style={{ padding: "120px 64px", background: "var(--bg)" }}>
      <div ref={ref} style={{
        maxWidth: "1240px", margin: "0 auto",
        opacity: 0, transform: "translateY(20px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "56px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--accent)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "16px" }}>— Testimonials</div>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(44px, 5vw, 64px)",
              lineHeight: "0.92", fontWeight: 800,
              letterSpacing: "-0.02em", color: "var(--text)",
            }}>From the<br />
            <span style={{
              fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400,
              background: "linear-gradient(90deg, var(--accent), var(--accent-2))",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>Builders</span>
            </h2>
          </div>
          <div style={{
            padding: "6px 16px",
            background: "var(--surface)",
            border: "1px solid var(--border-2)",
            borderRadius: "8px",
            fontFamily: "var(--font-mono)", fontSize: "11px",
            color: "var(--text-3)", letterSpacing: "0.06em",
          }}>
            4.9/5 · 2,400+ reviews ★★★★★
          </div>
        </div>

        {/* Cards — staggered heights */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={{
              padding: "40px 32px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              position: "relative",
              overflow: "hidden",
              transition: "all 0.3s ease",
              marginTop: i === 1 ? "24px" : "0",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--border-2)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
              (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 60px rgba(0,0,0,0.08)`;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
            >
              {/* Large quote */}
              <div style={{
                fontFamily: "var(--font-serif)",
                fontSize: "100px", lineHeight: "0.6",
                color: t.accent, opacity: 0.15,
                marginBottom: "20px",
                pointerEvents: "none",
              }}>&ldquo;</div>

              {/* Stars */}
              <div style={{ display: "flex", gap: "3px", marginBottom: "20px" }}>
                {[...Array(5)].map((_, j) => (
                  <span key={j} style={{ color: "var(--accent-2)", fontSize: "13px" }}>★</span>
                ))}
              </div>

              <p style={{
                color: "var(--text)", fontSize: "15px",
                lineHeight: 1.75, fontWeight: 400,
                marginBottom: "32px",
                fontFamily: "var(--font-serif)", fontStyle: "italic",
              }}>{t.quote}</p>

              <div style={{ display: "flex", alignItems: "center", gap: "12px", borderTop: "1px solid var(--border)", paddingTop: "20px" }}>
                <div style={{
                  width: "40px", height: "40px",
                  background: `linear-gradient(135deg, var(--accent), var(--accent-2))`,
                  borderRadius: "10px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-mono)", fontSize: "12px", fontWeight: 600,
                  color: "#fff", flexShrink: 0,
                }}>{t.initials}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--text)", fontFamily: "var(--font-display)" }}>{t.author}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
