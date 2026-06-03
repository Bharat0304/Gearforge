"use client";
const FEATS = [
  { icon: "⟡", n: "01 /", title: "Text-to-3D", desc: "Describe any object in plain English. Our Claude-powered pipeline generates production-ready geometry in under 8 seconds." },
  { icon: "◈", n: "02 /", title: "PBR Materials", desc: "Physically-based materials with metalness, roughness, and normal maps generated automatically from context." },
  { icon: "⬡", n: "03 /", title: "Blender Native", desc: "Every asset exports as a clean .blend file with proper hierarchy, named objects, and scene setup." },
  { icon: "⬡", n: "04 /", title: "Physics Engine", desc: "Run real-time rigid body, cloth, and fluid simulations on your generated assets before export." },
  { icon: "◇", n: "05 /", title: "CAD Export", desc: "OBJ, FBX, GLTF, USDZ, STEP. Clean topology, proper normals, LOD variants for any pipeline." },
  { icon: "◉", n: "06 /", title: "API + SDK", desc: "Pipe Gearforge into your workflow. Webhooks, batch processing, and a fully documented REST API." },
];

export default function Features() {
  return (
    <section style={{ padding: "100px 40px" }}>
      <div style={{ fontFamily: "var(--fm)", fontSize: 10, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--red)", marginBottom: 20 }}>// Platform</div>
      <h2 style={{ fontSize: "clamp(40px,5.5vw,72px)", fontWeight: 800, lineHeight: .88, letterSpacing: "-.025em" }}>
        Built for<br /><em style={{ fontFamily: "var(--fs)", fontStyle: "italic", fontWeight: 400 }}>creators.</em>
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", borderLeft: "1px solid rgba(255,255,255,0.06)", marginTop: 56 }}>
        {FEATS.map((f, i) => (
          <div key={i} style={{
            padding: "40px 32px",
            borderRight: "1px solid rgba(255,255,255,0.06)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            position: "relative", overflow: "hidden",
            transition: "background .2s", cursor: "default",
          }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--surf)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <span style={{ position: "absolute", top: 16, right: 20, fontFamily: "var(--fm)", fontSize: 11, color: "rgba(255,255,255,0.08)" }}>{f.n}</span>
            <span style={{ fontSize: 28, marginBottom: 20, display: "block" }}>{f.icon}</span>
            <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-.02em", marginBottom: 12 }}>{f.title}</div>
            <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.7 }}>{f.desc}</div>
            <div style={{ display: "inline-block", marginTop: 16, fontFamily: "var(--fm)", fontSize: 10, color: "var(--red)", letterSpacing: ".08em", textTransform: "uppercase" }}>Learn more →</div>
          </div>
        ))}
      </div>
    </section>
  );
}
