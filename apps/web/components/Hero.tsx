"use client";
import { useRef, useEffect } from "react";
import Hero3DScene from "./Hero3DScene";

const STATS = [
  { v: "80K+", l: "Creators" },
  { v: "4.2M", l: "Assets Made" },
  { v: "< 8s", l: "Avg Gen Time" },
  { v: "99.7%", l: "Uptime" },
];

export default function Hero() {
  const h1Ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = h1Ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(40px)";
    setTimeout(() => {
      el.style.transition = "opacity 0.9s ease, transform 0.9s ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, 100);
  }, []);

  return (
    <section style={{
      position: "relative",
      minHeight: "100vh",
      padding: "100px 40px 80px",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      alignItems: "center",
      gap: 40,
      overflow: "hidden",
    }}>
      {/* Grid background */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)",
        backgroundSize: "64px 64px",
      }} />
      {/* Red glow top-left */}
      <div style={{
        position: "absolute", top: -200, left: -200, width: 600, height: 600,
        background: "radial-gradient(circle, rgba(255,68,34,0.08) 0%, transparent 70%)",
        borderRadius: "50%", pointerEvents: "none",
      }} />

      {/* Corner accents */}
      <div style={{ position: "absolute", top: 80, right: 40, width: 40, height: 40, borderTop: "1px solid rgba(255,68,34,0.4)", borderRight: "1px solid rgba(255,68,34,0.4)" }} />
      <div style={{ position: "absolute", bottom: 80, left: 40, width: 32, height: 32, borderBottom: "1px solid rgba(255,170,0,0.3)", borderLeft: "1px solid rgba(255,170,0,0.3)" }} />

      {/* LEFT */}
      <div style={{ position: "relative", zIndex: 2, maxWidth: 580 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "5px 12px", border: "1px solid rgba(255,68,34,0.3)",
          fontFamily: "var(--fm)", fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase",
          color: "var(--red)", marginBottom: 32,
        }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--red)", display: "inline-block" }} />
          V2.0 · Sketch-to-3D Pipeline
        </div>

        <h1 ref={h1Ref} style={{
          fontSize: "clamp(72px,10vw,140px)",
          lineHeight: 0.86,
          letterSpacing: "-.025em",
          fontWeight: 800,
          marginBottom: 0,
        }}>
          <span style={{ display: "block" }}>Forge</span>
          <span style={{
            display: "block",
            fontFamily: "var(--fs)",
            fontStyle: "italic",
            fontWeight: 400,
            background: "linear-gradient(90deg, var(--red), var(--amber), var(--red))",
            backgroundSize: "200% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "shimmer 4s linear infinite",
          }}>Worlds</span>
          <span style={{ display: "block" }}>in&nbsp;3D</span>
        </h1>

        <p style={{
          fontSize: "clamp(14px,1.4vw,16px)",
          color: "var(--text2)", maxWidth: 440, lineHeight: 1.7,
          margin: "32px 0 40px", fontWeight: 400,
        }}>
          From text, image, or sketch — production-ready 3D assets in seconds. The AI workspace built for speed and precision.
        </p>

        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <a href="/signup" style={{
            padding: "14px 32px", background: "var(--red)", color: "#fff",
            fontSize: 13, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase",
            textDecoration: "none", transition: "all .2s",
          }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = "#ff6644"; el.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = "var(--red)"; el.style.transform = "translateY(0)"; }}
          >Start Building Free</a>
          <button style={{
            padding: "13px 28px", background: "transparent", color: "var(--text2)",
            border: "1px solid rgba(255,255,255,0.15)", fontSize: 13, fontWeight: 600,
            cursor: "pointer", fontFamily: "var(--fn)", display: "flex", alignItems: "center", gap: 8,
            transition: "all .2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "var(--text2)"; }}
          >
            <span style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 22, height: 22, background: "rgba(255,68,34,0.15)",
              fontSize: 10, borderRadius: "50%",
            }}>▶</span>
            Watch Demo
          </button>
        </div>

        {/* Stats */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4,1fr)",
          border: "1px solid rgba(255,255,255,0.08)", marginTop: 56,
          background: "var(--surf)",
        }}>
          {STATS.map((s, i) => (
            <div key={i} style={{
              padding: "18px 16px", textAlign: "center",
              borderRight: i < STATS.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
            }}>
              <div style={{ fontSize: "clamp(18px,2vw,24px)", fontWeight: 800, letterSpacing: "-.02em", color: "var(--red)" }}>{s.v}</div>
              <div style={{ fontSize: 9, color: "var(--text3)", letterSpacing: ".12em", textTransform: "uppercase", fontFamily: "var(--fm)", marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT — Real 3D SVG Scene */}
      <div style={{
        position: "relative", zIndex: 2,
        height: "clamp(380px,55vh,640px)",
      }}>
        {/* Floating metadata badges */}
        <div style={{
          position: "absolute", top: "8%", right: -16, zIndex: 10,
          background: "var(--surf2)", border: "1px solid rgba(255,255,255,0.1)",
          padding: "10px 14px",
          animation: "droneFloat 3.5s ease-in-out infinite",
        }}>
          <div style={{ fontFamily: "var(--fm)", fontSize: 9, color: "var(--red)", letterSpacing: ".1em" }}>GEN TIME</div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>7.2s</div>
        </div>
        <div style={{
          position: "absolute", bottom: "18%", left: -16, zIndex: 10,
          background: "var(--surf2)", border: "1px solid rgba(255,255,255,0.1)",
          padding: "10px 14px",
          animation: "droneFloat 4s ease-in-out 0.8s infinite",
        }}>
          <div style={{ fontFamily: "var(--fm)", fontSize: 9, color: "var(--amber)", letterSpacing: ".1em" }}>QUALITY</div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>4K PBR</div>
        </div>

        {/* Status badge */}
        <div style={{
          position: "absolute", top: "8%", left: "50%", transform: "translateX(-50%)", zIndex: 10,
          display: "flex", alignItems: "center", gap: 6,
          background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)",
          padding: "5px 12px",
          fontFamily: "var(--fm)", fontSize: 9, color: "#22c55e", letterSpacing: ".1em",
        }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
          RENDER COMPLETE
        </div>

        <Hero3DScene />

        <style>{`
          @keyframes droneFloat {
            0%,100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes shimmer {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
          }
        `}</style>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        opacity: 0.4,
      }}>
        <div style={{ width: 1, height: 28, background: "linear-gradient(to bottom, transparent, var(--red))" }} />
        <div style={{ fontSize: 9, letterSpacing: ".15em", textTransform: "uppercase", fontFamily: "var(--fm)", color: "var(--text3)" }}>Scroll</div>
      </div>
    </section>
  );
}
