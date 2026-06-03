"use client";
import Link from "next/link";

const PLANS = [
  {
    name: "Starter",
    price: "$0",
    period: "Free forever",
    desc: "Perfect for exploring and small projects.",
    feats: ["50 generations/month", "Standard quality", "OBJ + GLTF export", "Community support"],
    cta: "Start Free",
    href: "/signup",
    featured: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "per month",
    desc: "For serious creators and studios.",
    feats: ["1,000 generations/month", "4K PBR quality", "All formats + STEP", "Physics simulation", "Priority queue", "API access"],
    cta: "Start Pro Trial",
    href: "/signup",
    featured: true,
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "Volume pricing",
    desc: "Full-scale deployment for large teams.",
    feats: ["Unlimited everything", "Private model fine-tuning", "On-premise deployment", "SSO & audit logs", "SLA guarantee"],
    cta: "Talk to Sales",
    href: "#",
    featured: false,
  },
];

export default function Pricing() {
  return (
    <section style={{ padding: "100px 40px", background: "var(--bg2)" }}>
      <div style={{ fontFamily: "var(--fm)", fontSize: 10, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--red)", marginBottom: 20 }}>// Pricing</div>
      <h2 style={{ fontSize: "clamp(40px,5.5vw,72px)", fontWeight: 800, lineHeight: .88, letterSpacing: "-.025em" }}>
        Simple,<br /><em style={{ fontFamily: "var(--fs)", fontStyle: "italic", fontWeight: 400 }}>transparent</em> pricing.
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", border: "1px solid rgba(255,255,255,0.08)", marginTop: 56 }}>
        {PLANS.map((p, i) => (
          <div key={i} style={{
            padding: "44px 36px",
            borderRight: i < 2 ? "1px solid rgba(255,255,255,0.08)" : "none",
            background: "transparent",
            position: "relative",
          }}>
            {p.popular && (
              <span style={{ position: "absolute", top: 16, right: 16, background: "var(--red)", color: "#fff", fontFamily: "var(--fm)", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", padding: "4px 10px" }}>Most Popular</span>
            )}
            <div style={{ fontFamily: "var(--fm)", fontSize: 10, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--text3)", marginBottom: 12 }}>{p.name}</div>
            <div style={{ fontSize: 52, fontWeight: 800, letterSpacing: "-.03em", lineHeight: 1, color: "var(--text)", marginBottom: 6 }}>{p.price}</div>
            <div style={{ fontSize: 12, color: "var(--text3)", fontFamily: "var(--fm)", marginBottom: 16 }}>{p.period}</div>
            <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6, marginBottom: 28 }}>{p.desc}</div>
            <div style={{ marginBottom: 32 }}>
              {p.feats.map((f, j) => (
                <div key={j} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text2)", marginBottom: 8 }}>
                  <span style={{ color: "var(--red)" }}>✓</span> {f}
                </div>
              ))}
            </div>
            <Link href={p.href} style={{
              display: "block", width: "100%", padding: "12px", textAlign: "center",
              background: p.featured ? "var(--red)" : "transparent",
              color: p.featured ? "#fff" : "var(--text2)",
              border: p.featured ? "none" : "1px solid rgba(255,255,255,0.15)",
              fontSize: 12, fontWeight: 700, letterSpacing: ".04em", textDecoration: "none",
              transition: "all .18s",
            }}
              onMouseEnter={e => { if (!p.featured) { (e.currentTarget as HTMLAnchorElement).style.background = "#fff"; (e.currentTarget as HTMLAnchorElement).style.color = "#000"; } }}
              onMouseLeave={e => { if (!p.featured) { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; (e.currentTarget as HTMLAnchorElement).style.color = "var(--text2)"; } }}
            >{p.cta}</Link>
          </div>
        ))}
      </div>
    </section>
  );
}
