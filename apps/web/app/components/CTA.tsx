"use client";
import { useEffect, useRef } from "react";

export default function CTA() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting) { el.style.opacity = "1"; el.style.transform = "translateY(0)"; }
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section style={{ padding: "120px 64px", background: "var(--bg)", position: "relative", overflow: "hidden" }}>
      {/* Large BG number */}
      <div style={{
        position: "absolute", top: "-40px", right: "-20px",
        fontFamily: "var(--font-display)", fontSize: "clamp(200px, 30vw, 400px)",
        fontWeight: 800, color: "var(--border)",
        lineHeight: 1, pointerEvents: "none",
        letterSpacing: "-0.06em", userSelect: "none",
      }}>3D</div>

      <div ref={ref} style={{
        maxWidth: "900px", margin: "0 auto",
        textAlign: "center",
        position: "relative", zIndex: 2,
        opacity: 0, transform: "translateY(24px)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
      }}>
        <div style={{
          display: "inline-block",
          border: "1px solid var(--border-2)",
          borderRadius: "8px",
          padding: "5px 16px",
          fontSize: "10px", fontFamily: "var(--font-mono)",
          letterSpacing: "0.16em", textTransform: "uppercase",
          color: "var(--accent-2)",
          marginBottom: "36px",
        }}>Start Building Today</div>

        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(52px, 8vw, 96px)",
          lineHeight: "0.9", fontWeight: 800,
          letterSpacing: "-0.03em", color: "var(--text)",
          marginBottom: "28px",
        }}>
          Build the Future<br />
          <span style={{
            fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400,
            background: "linear-gradient(90deg, var(--accent), var(--accent-2), var(--accent))",
            backgroundSize: "200% 100%",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            animation: "shimmer 5s linear infinite",
          }}>In Three Dimensions</span>
        </h2>

        <p style={{ color: "var(--text-2)", fontSize: "16px", maxWidth: "440px", margin: "0 auto 48px", lineHeight: 1.7 }}>
          Join 80,000+ designers, engineers, and developers who generate with Gearforge every day.
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <button style={{
            padding: "18px 44px",
            background: "var(--accent)", color: "#fff",
            border: "none", borderRadius: "12px",
            fontSize: "14px", fontWeight: 700,
            cursor: "pointer", letterSpacing: "0.06em",
            textTransform: "uppercase",
            fontFamily: "var(--font-display)",
            transition: "all 0.25s ease",
            boxShadow: "0 8px 32px var(--accent-glow)",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "0 20px 60px var(--accent-glow)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 8px 32px var(--accent-glow)";
          }}
          >Start Building Free →</button>

          <button style={{
            padding: "18px 32px",
            background: "var(--surface)", color: "var(--text-2)",
            border: "1px solid var(--border-2)",
            borderRadius: "12px",
            fontSize: "14px", fontWeight: 600,
            cursor: "pointer", letterSpacing: "0.04em",
            fontFamily: "var(--font-display)",
            transition: "all 0.25s ease",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = "var(--accent-2)";
            e.currentTarget.style.color = "var(--accent-2)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "var(--border-2)";
            e.currentTarget.style.color = "var(--text-2)";
          }}
          >View Documentation</button>
        </div>
      </div>
    </section>
  );
}
