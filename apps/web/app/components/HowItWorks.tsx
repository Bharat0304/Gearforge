"use client";
import { useEffect, useRef } from "react";

const STEPS = [
  { n: "01", title: "Describe", desc: "Write a prompt, upload a reference image, or draw a rough sketch. Any input works.", tag: "Input" },
  { n: "02", title: "Generate", desc: "Our multi-modal AI interprets intent, topology, material properties, and scale constraints.", tag: "Process" },
  { n: "03", title: "Refine", desc: "Adjust geometry, swap materials, apply physics — all in the browser, no plugins required.", tag: "Sculpt" },
  { n: "04", title: "Export", desc: "Download in any format. Clean mesh, UV maps included. Drops straight into any DCC or CAD tool.", tag: "Output" },
];

export default function HowItWorks() {
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
    <section style={{ padding: "120px 64px", background: "var(--bg-2)", position: "relative", overflow: "hidden" }}>
      {/* Diagonal accent line */}
      <div style={{
        position: "absolute", top: 0, bottom: 0, left: "calc(50% - 1px)",
        width: "1px",
        background: "linear-gradient(to bottom, transparent, var(--border-2), transparent)",
        pointerEvents: "none",
      }} />

      <div ref={ref} style={{
        maxWidth: "1240px", margin: "0 auto",
        opacity: 0, transform: "translateY(20px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}>
        <div style={{ marginBottom: "80px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--accent)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "16px" }}>— How It Works</div>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(44px, 5.5vw, 72px)",
            lineHeight: "0.92", fontWeight: 800,
            letterSpacing: "-0.02em", color: "var(--text)",
          }}>Four Steps.<br />
          <span style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic", fontWeight: 400,
            background: "linear-gradient(90deg, var(--accent), var(--accent-2))",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>Zero Friction.</span>
          </h2>
        </div>

        {/* Steps — editorial staggered layout */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", position: "relative", marginBottom: "80px" }}>
          {/* Connecting line */}
          <div style={{
            position: "absolute", top: "32px",
            left: "calc(12.5%)", right: "calc(12.5%)",
            height: "1px",
            background: "linear-gradient(to right, var(--accent), var(--accent-2))",
            opacity: 0.25,
          }} />

          {STEPS.map((s, i) => (
            <div key={i} style={{
              paddingTop: i % 2 === 1 ? "40px" : "0",
            }}>
              {/* Node */}
              <div style={{
                width: "44px", height: "44px",
                border: "1.5px solid var(--accent)",
                borderRadius: "10px",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "28px",
                background: "var(--bg-2)",
                position: "relative", zIndex: 1,
                boxShadow: `0 0 16px var(--accent-glow)`,
              }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--accent)", fontWeight: 500 }}>{s.n}</span>
              </div>
              <div style={{ fontSize: "9px", letterSpacing: "0.18em", color: "var(--accent-2)", fontFamily: "var(--font-mono)", marginBottom: "10px", textTransform: "uppercase" }}>{s.tag}</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 800, letterSpacing: "-0.01em", color: "var(--text)", marginBottom: "12px" }}>{s.title}</h3>
              <p style={{ color: "var(--text-3)", fontSize: "14px", lineHeight: 1.7 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Terminal block */}
        <div style={{
          background: "var(--bg)",
          border: "1px solid var(--border-2)",
          borderRadius: "14px",
          overflow: "hidden",
          boxShadow: `0 24px 80px rgba(0,0,0,0.08)`,
        }}>
          <div style={{
            padding: "14px 20px",
            borderBottom: "1px solid var(--border)",
            display: "flex", alignItems: "center", gap: "8px",
            background: "var(--bg-2)",
          }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-3)", marginLeft: "10px" }}>gearforge-sdk v2.0.1</span>
          </div>
          <div style={{ padding: "28px 32px", fontFamily: "var(--font-mono)", fontSize: "13px", lineHeight: 2, overflowX: "auto" }}>
            <div><span style={{ color: "var(--text-3)" }}>// Generate a 3D asset from text</span></div>
            <div><span style={{ color: "var(--accent-2)" }}>import</span> <span style={{ color: "var(--text)" }}>{`{ Gearforge }`}</span> <span style={{ color: "var(--accent-2)" }}>from</span> <span style={{ color: "var(--accent)" }}>&apos;@gearforge/sdk&apos;</span></div>
            <div style={{ marginTop: "8px" }}><span style={{ color: "var(--accent-2)" }}>const</span> <span style={{ color: "var(--text)" }}>gf</span> <span style={{ color: "var(--text-3)" }}>=</span> <span style={{ color: "var(--accent-2)" }}>new</span> <span style={{ color: "var(--accent-3)" }}>Gearforge</span><span style={{ color: "var(--text-3)" }}>({"{"}</span> <span style={{ color: "var(--text)" }}>apiKey</span><span style={{ color: "var(--text-3)" }}>:</span> <span style={{ color: "var(--accent)" }}>process.env.GF_KEY</span> <span style={{ color: "var(--text-3)" }}>{"}"}</span>)</div>
            <div style={{ marginTop: "8px" }}><span style={{ color: "var(--accent-2)" }}>const</span> <span style={{ color: "var(--text)" }}>asset</span> <span style={{ color: "var(--text-3)" }}>=</span> <span style={{ color: "var(--accent-2)" }}>await</span> <span style={{ color: "var(--text)" }}>gf</span><span style={{ color: "var(--text-3)" }}>.</span><span style={{ color: "var(--accent-3)" }}>generate</span><span style={{ color: "var(--text-3)" }}>({"{"}</span></div>
            <div style={{ paddingLeft: "24px" }}><span style={{ color: "var(--text)" }}>prompt</span><span style={{ color: "var(--text-3)" }}>:</span> <span style={{ color: "var(--accent)" }}>&apos;A futuristic alloy helmet with visor cracks&apos;</span><span style={{ color: "var(--text-3)" }}>,</span></div>
            <div style={{ paddingLeft: "24px" }}><span style={{ color: "var(--text)" }}>format</span><span style={{ color: "var(--text-3)" }}>:</span> <span style={{ color: "var(--accent)" }}>&apos;gltf&apos;</span><span style={{ color: "var(--text-3)" }}>,</span> <span style={{ color: "var(--text)" }}>textures</span><span style={{ color: "var(--text-3)" }}>:</span> <span style={{ color: "var(--accent-2)" }}>&apos;pbr-4k&apos;</span><span style={{ color: "var(--text-3)" }}>,</span></div>
            <div><span style={{ color: "var(--text-3)" }}>{"}"}</span>)</div>
            <div style={{ marginTop: "12px", color: "#28c840" }}>// ✓ Asset ready in 7.2s → asset.downloadUrl</div>
          </div>
        </div>
      </div>
    </section>
  );
}
