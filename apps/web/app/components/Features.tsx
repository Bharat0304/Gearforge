"use client";
import { useEffect, useRef } from "react";

const FEATURES = [
  { id: "01", title: "Text to 3D", desc: "Type a description and watch Gearforge sculpt a fully-textured, mesh-optimized model in under 10 seconds. Natural language, production output.", icon: "✦", accent: "var(--accent)" },
  { id: "02", title: "Image to 3D", desc: "Drop any reference image — photo, sketch, or concept art — and get a clean 3D asset with UV-unwrapped PBR materials ready for your pipeline.", icon: "◈", accent: "var(--accent-2)" },
  { id: "03", title: "Sketch to 3D", desc: "Draw rough outlines and Gearforge interprets your intent. Perfect for early ideation where precision matters less than creative velocity.", icon: "◆", accent: "var(--accent-3)" },
  { id: "04", title: "Physics Engine", desc: "Run real-time rigid body, cloth, and fluid simulations on your generated assets. Validate mechanical behavior before export.", icon: "⬡", accent: "var(--accent)" },
  { id: "05", title: "CAD Export", desc: "OBJ, FBX, GLTF, USDZ, and STEP formats. Clean topology, proper normals, LOD variants. Drop straight into Blender, Maya, or your engineering stack.", icon: "◇", accent: "var(--accent-2)" },
  { id: "06", title: "API + SDK", desc: "Pipe Gearforge directly into your creative or manufacturing workflow. Webhooks, batch processing, and an OpenAPI-documented REST interface.", icon: "◉", accent: "var(--accent-3)" },
];

function FeatureCard({ f, i }: { f: typeof FEATURES[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const isLarge = i === 0;

  return (
    <div ref={ref} style={{
      opacity: 0,
      transform: "translateY(32px)",
      transition: `opacity 0.6s ease ${i * 0.09}s, transform 0.6s ease ${i * 0.09}s`,
      padding: isLarge ? "48px" : "36px",
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "16px",
      position: "relative",
      overflow: "hidden",
      cursor: "default",
      gridColumn: isLarge ? "span 2" : "span 1",
      display: "flex",
      flexDirection: isLarge ? "row" : "column",
      gap: isLarge ? "48px" : "0",
      alignItems: isLarge ? "center" : "flex-start",
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLElement).style.borderColor = "var(--border-2)";
      (e.currentTarget as HTMLElement).style.background = "var(--surface-2)";
      (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
      (e.currentTarget as HTMLElement).style.background = "var(--surface)";
      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
    }}
    >
      {/* Background accent gradient */}
      <div style={{
        position: "absolute", top: "-40px", right: "-40px",
        width: "160px", height: "160px",
        borderRadius: "50%",
        background: `radial-gradient(circle, ${f.accent.replace("var(--accent)", "#ff6235").replace("var(--accent-2)", "#ffaa00").replace("var(--accent-3)", "#ffd166")}18 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {isLarge ? (
        <>
          <div style={{ flex: "0 0 auto" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: f.accent, letterSpacing: "0.1em", marginBottom: "20px", opacity: 0.8 }}>{f.id} /</div>
            <div style={{ fontSize: "40px", marginBottom: "20px", lineHeight: 1 }}>{f.icon}</div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "36px", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text)", marginBottom: "0", lineHeight: 0.95 }}>{f.title}</h3>
          </div>
          <div>
            <p style={{ color: "var(--text-2)", fontSize: "16px", lineHeight: 1.75, fontWeight: 400, marginBottom: "24px" }}>{f.desc}</p>
            <span style={{ fontSize: "12px", color: f.accent, letterSpacing: "0.06em", fontFamily: "var(--font-mono)" }}>Explore feature →</span>
          </div>
        </>
      ) : (
        <>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: f.accent, letterSpacing: "0.1em", marginBottom: "20px", opacity: 0.8 }}>{f.id} /</div>
          <div style={{ fontSize: "28px", marginBottom: "16px", lineHeight: 1 }}>{f.icon}</div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 800, letterSpacing: "-0.01em", color: "var(--text)", marginBottom: "12px" }}>{f.title}</h3>
          <p style={{ color: "var(--text-2)", fontSize: "14px", lineHeight: 1.7, fontWeight: 400, flex: 1 }}>{f.desc}</p>
          <div style={{ marginTop: "24px", fontSize: "11px", color: f.accent, letterSpacing: "0.06em", fontFamily: "var(--font-mono)" }}>Learn more →</div>
        </>
      )}
    </div>
  );
}

export default function Features() {
  const headRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = headRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) { el.style.opacity = "1"; el.style.transform = "translateY(0)"; }
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section style={{ padding: "120px 64px", background: "var(--bg)", position: "relative" }}>
      <div style={{
        position: "absolute", top: 0, left: "64px", right: "64px",
        height: "1px",
        background: "linear-gradient(to right, transparent, var(--border-2), transparent)",
      }} />

      <div ref={headRef} style={{
        maxWidth: "1240px", margin: "0 auto",
        opacity: 0, transform: "translateY(20px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}>
        {/* Section header — editorial layout */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "56px", gap: "24px", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--accent)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "16px" }}>— Capabilities</div>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(44px, 5.5vw, 72px)",
              lineHeight: "0.92",
              letterSpacing: "-0.02em",
              fontWeight: 800,
              color: "var(--text)",
            }}>
              Everything<br />
              <span style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontWeight: 400,
                background: "linear-gradient(90deg, var(--accent), var(--accent-2))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>You Need</span>
            </h2>
          </div>
          <p style={{ maxWidth: "320px", color: "var(--text-2)", fontSize: "15px", lineHeight: 1.7 }}>
            A complete creative and engineering pipeline — from first idea to exportable production asset.
          </p>
        </div>

        {/* Asymmetric grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "12px",
        }}>
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.id} f={f} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
