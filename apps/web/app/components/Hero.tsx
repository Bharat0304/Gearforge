"use client";
import { useEffect, useRef } from "react";
import HeroCanvas from "./HeroCanvas";

const STATS = [
  { value: "80K+", label: "Creators" },
  { value: "4.2M", label: "Assets Made" },
  { value: "< 8s", label: "Avg Gen Time" },
  { value: "99.7%", label: "Uptime" },
];

export default function Hero() {
  const headRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = headRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(40px)";
    setTimeout(() => {
      el.style.transition = "opacity 1s ease, transform 1s ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, 100);
  }, []);

  return (
    <section style={{
      position: "relative",
      minHeight: "100vh",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      alignItems: "center",
      padding: "100px 64px 80px",
      overflow: "hidden",
      background: "var(--bg)",
      gap: "40px",
    }}>
      {/* BG noise texture */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
        backgroundSize: "200px 200px",
        opacity: 0.6,
      }} />

      {/* Accent corner bracket top-right */}
      <div style={{
        position: "absolute", top: "80px", right: "64px",
        width: "80px", height: "80px",
        borderTop: "1px solid var(--accent)",
        borderRight: "1px solid var(--accent)",
        opacity: 0.4, zIndex: 1,
      }} />
      <div style={{
        position: "absolute", bottom: "80px", left: "64px",
        width: "60px", height: "60px",
        borderBottom: "1px solid var(--accent-2)",
        borderLeft: "1px solid var(--accent-2)",
        opacity: 0.3, zIndex: 1,
      }} />

      {/* LEFT: Text content */}
      <div style={{ position: "relative", zIndex: 2, maxWidth: "580px" }}>
        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          padding: "6px 14px 6px 10px",
          background: "var(--surface)",
          border: "1px solid var(--border-2)",
          borderRadius: "6px",
          fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase",
          color: "var(--accent-2)",
          marginBottom: "36px",
          fontFamily: "var(--font-mono)",
          animation: "fadeUp 0.7s ease 0.2s both",
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "var(--accent)",
            boxShadow: "0 0 8px var(--accent)",
            animation: "pulse 2s ease infinite",
          }} />
          V2.0 · Sketch-to-3D Pipeline
        </div>

        {/* Title — editorial style with serif mix */}
        <h1 ref={headRef} style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(60px, 8.5vw, 112px)",
          lineHeight: "0.88",
          letterSpacing: "-0.02em",
          marginBottom: "32px",
          position: "relative",
          color: "var(--text)",
        }}>
          <span style={{ display: "block", fontWeight: 800 }}>Forge</span>
          <span style={{
            display: "block",
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "0.95em",
            background: "linear-gradient(90deg, var(--accent), var(--accent-2), var(--accent))",
            backgroundSize: "200% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "shimmer 5s linear infinite",
          }}>Worlds</span>
          <span style={{ display: "block", fontWeight: 800 }}>in&nbsp;3D</span>
        </h1>

        {/* Sub */}
        <p style={{
          fontSize: "clamp(15px, 1.6vw, 18px)",
          color: "var(--text-2)",
          maxWidth: "440px",
          marginBottom: "44px",
          fontWeight: 400,
          lineHeight: 1.7,
          fontFamily: "var(--font-display)",
          animation: "fadeUp 0.7s ease 0.5s both",
        }}>
          From text, image, or sketch — production-ready 3D assets in seconds. The AI workspace built for speed and precision.
        </p>

        {/* CTAs */}
        <div style={{
          display: "flex", alignItems: "center", gap: "12px",
          flexWrap: "wrap",
          animation: "fadeUp 0.7s ease 0.7s both",
        }}>
          <button style={{
            padding: "16px 36px",
            background: "var(--accent)",
            color: "#fff",
            border: "none", borderRadius: "10px",
            fontSize: "13px", fontWeight: 700,
            cursor: "pointer", letterSpacing: "0.06em",
            textTransform: "uppercase",
            fontFamily: "var(--font-display)",
            transition: "all 0.25s ease",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-3px)";
            e.currentTarget.style.boxShadow = "0 16px 40px var(--accent-glow)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
          >Start Building Free</button>

          <button style={{
            padding: "16px 28px",
            background: "var(--surface)",
            color: "var(--text-2)",
            border: "1px solid var(--border-2)",
            borderRadius: "10px",
            fontSize: "13px", fontWeight: 600,
            cursor: "pointer", letterSpacing: "0.04em",
            fontFamily: "var(--font-display)",
            transition: "all 0.25s ease",
            display: "flex", alignItems: "center", gap: "8px",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = "var(--accent-2)";
            e.currentTarget.style.color = "var(--accent-2)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "var(--border-2)";
            e.currentTarget.style.color = "var(--text-2)";
          }}
          >
            <span style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: "22px", height: "22px",
              background: "var(--accent-glow-2)",
              borderRadius: "50%",
              fontSize: "10px",
            }}>▶</span>
            Watch Demo
          </button>
        </div>

        {/* Stats */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "0",
          marginTop: "64px",
          background: "var(--surface)",
          border: "1px solid var(--border-2)",
          borderRadius: "12px",
          overflow: "hidden",
          animation: "fadeUp 0.7s ease 0.9s both",
        }}>
          {STATS.map((s, i) => (
            <div key={i} style={{
              padding: "20px 16px",
              borderRight: i < STATS.length - 1 ? "1px solid var(--border)" : "none",
              textAlign: "center",
            }}>
              <div style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(22px, 2.2vw, 28px)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: "var(--accent-2)",
                lineHeight: 1,
              }}>{s.value}</div>
              <div style={{
                fontSize: "10px", color: "var(--text-3)",
                letterSpacing: "0.1em", textTransform: "uppercase",
                marginTop: "6px", fontFamily: "var(--font-mono)",
              }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: Three.js canvas */}
      <div style={{
        position: "relative", zIndex: 2,
        height: "clamp(400px, 55vh, 680px)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <HeroCanvas />
        {/* Floating label cards */}
        <div style={{
          position: "absolute", top: "15%", right: "-8px",
          background: "var(--surface)",
          border: "1px solid var(--border-2)",
          borderRadius: "10px",
          padding: "12px 16px",
          animation: "float 3.5s ease infinite",
          zIndex: 3,
        }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--accent)", letterSpacing: "0.1em" }}>GEN TIME</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 800, color: "var(--text)", lineHeight: 1.2 }}>7.2s</div>
        </div>
        <div style={{
          position: "absolute", bottom: "20%", left: "-8px",
          background: "var(--surface)",
          border: "1px solid var(--border-2)",
          borderRadius: "10px",
          padding: "12px 16px",
          animation: "float 4s ease infinite 0.8s",
          zIndex: 3,
        }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--accent-2)", letterSpacing: "0.1em" }}>QUALITY</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 800, color: "var(--text)", lineHeight: 1.2 }}>4K PBR</div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute", bottom: "32px", left: "50%",
        transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
        opacity: 0.4, zIndex: 2,
        animation: "float 2.5s ease infinite",
      }}>
        <div style={{ width: 1, height: 32, background: "linear-gradient(to bottom, transparent, var(--accent))" }} />
        <div style={{ fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "var(--font-mono)", color: "var(--text-3)" }}>Scroll</div>
      </div>
    </section>
  );
}
