"use client";
import { useEffect, useRef, useState } from "react";

const PLANS = [
  {
    name: "Starter",
    price: { monthly: "0", yearly: "0" },
    period: "Free forever",
    accentColor: "var(--text-3)",
    features: ["50 generations/month", "Text + Image input", "OBJ & GLTF export", "512px textures", "Community support"],
    cta: "Get Started Free",
    featured: false,
  },
  {
    name: "Pro",
    price: { monthly: "49", yearly: "39" },
    period: "per month",
    accentColor: "var(--accent)",
    features: ["1,000 generations/month", "All input modes + Sketch", "All formats incl. STEP", "4K PBR textures", "Physics simulation", "Priority queue", "API access"],
    cta: "Start Pro Trial",
    featured: true,
  },
  {
    name: "Enterprise",
    price: { monthly: "Custom", yearly: "Custom" },
    period: "Volume pricing",
    accentColor: "var(--accent-2)",
    features: ["Unlimited generations", "Private model fine-tuning", "On-premise deployment", "SSO & audit logs", "Dedicated Slack support", "SLA guarantee"],
    cta: "Talk to Sales",
    featured: false,
  },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(false);
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
    <section style={{ padding: "120px 64px", background: "var(--bg-2)", position: "relative" }}>
      <div style={{
        position: "absolute", top: 0, left: "64px", right: "64px",
        height: "1px",
        background: "linear-gradient(to right, transparent, var(--border-2), transparent)",
      }} />

      <div ref={ref} style={{
        maxWidth: "1240px", margin: "0 auto",
        opacity: 0, transform: "translateY(20px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--accent)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "16px" }}>— Pricing</div>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(44px, 5.5vw, 72px)",
            lineHeight: "0.92", fontWeight: 800,
            letterSpacing: "-0.02em", color: "var(--text)",
            marginBottom: "20px",
          }}>Start Free.<br />
          <span style={{
            fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400,
            background: "linear-gradient(90deg, var(--accent), var(--accent-2))",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>Scale Fast.</span>
          </h2>
          <p style={{ color: "var(--text-2)", fontSize: "15px", maxWidth: "380px", margin: "0 auto 32px", lineHeight: 1.7 }}>
            No seat fees. No surprise bills. Transparent usage-based pricing.
          </p>

          {/* Toggle */}
          <div style={{
            display: "inline-flex",
            background: "var(--surface)",
            border: "1px solid var(--border-2)",
            borderRadius: "10px",
            padding: "4px",
            gap: "4px",
          }}>
            {["Monthly", "Yearly"].map((t, i) => (
              <button key={t} onClick={() => setYearly(i === 1)} style={{
                padding: "8px 20px",
                background: (i === 1) === yearly ? "var(--accent)" : "transparent",
                color: (i === 1) === yearly ? "#fff" : "var(--text-2)",
                border: "none", borderRadius: "7px",
                fontSize: "12px", fontWeight: 600, cursor: "pointer",
                fontFamily: "var(--font-display)", letterSpacing: "0.04em",
                transition: "all 0.2s",
              }}>{t}{i === 1 && " (–20%)"}</button>
            ))}
          </div>
        </div>

        {/* Plans */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {PLANS.map((plan, i) => (
            <div key={i} style={{
              padding: "44px 36px",
              background: plan.featured ? "var(--surface-2)" : "var(--surface)",
              border: plan.featured ? `2px solid var(--accent)` : "1px solid var(--border)",
              borderRadius: "16px",
              position: "relative",
              overflow: "hidden",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={e => {
              if (!plan.featured) (e.currentTarget as HTMLElement).style.borderColor = "var(--border-2)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
            }}
            onMouseLeave={e => {
              if (!plan.featured) (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
            >
              {plan.featured && (
                <div style={{
                  position: "absolute", top: "20px", right: "20px",
                  padding: "4px 10px",
                  background: "var(--accent)",
                  color: "#fff",
                  fontSize: "9px", fontWeight: 700,
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  fontFamily: "var(--font-mono)",
                  borderRadius: "6px",
                }}>Most Popular</div>
              )}

              <div style={{
                fontFamily: "var(--font-display)", fontSize: "18px",
                fontWeight: 800, letterSpacing: "0.04em",
                color: plan.accentColor, marginBottom: "24px",
                textTransform: "uppercase",
              }}>{plan.name}</div>

              <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "4px" }}>
                {plan.price.monthly !== "Custom" && <span style={{ color: "var(--text-3)", fontSize: "18px" }}>$</span>}
                <span style={{
                  fontFamily: "var(--font-display)",
                  fontSize: plan.price.monthly === "Custom" ? "30px" : "52px",
                  fontWeight: 800, letterSpacing: "-0.02em",
                  color: "var(--text)", lineHeight: 1,
                  transition: "all 0.3s ease",
                }}>{yearly ? plan.price.yearly : plan.price.monthly}</span>
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-3)", letterSpacing: "0.08em", marginBottom: "32px" }}>{plan.period}</div>

              <div style={{ height: "1px", background: "var(--border)", marginBottom: "28px" }} />

              <div style={{ display: "flex", flexDirection: "column", gap: "13px", marginBottom: "36px" }}>
                {plan.features.map((f, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                      width: "18px", height: "18px", flexShrink: 0,
                      border: `1.5px solid ${plan.accentColor}`,
                      borderRadius: "5px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                        <polyline points="1,3.5 3.5,6 8,1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span style={{ fontSize: "13px", color: "var(--text-2)", lineHeight: 1.4 }}>{f}</span>
                  </div>
                ))}
              </div>

              <button style={{
                width: "100%", padding: "14px 0",
                background: plan.featured ? "var(--accent)" : "transparent",
                color: plan.featured ? "#fff" : plan.accentColor,
                border: plan.featured ? "none" : `1.5px solid var(--border-2)`,
                borderRadius: "10px",
                fontSize: "13px", fontWeight: 700,
                cursor: "pointer", letterSpacing: "0.06em",
                textTransform: "uppercase",
                fontFamily: "var(--font-display)",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => {
                if (plan.featured) {
                  e.currentTarget.style.background = "var(--accent-2)";
                } else {
                  e.currentTarget.style.background = "var(--surface-2)";
                  e.currentTarget.style.borderColor = plan.accentColor;
                }
              }}
              onMouseLeave={e => {
                if (plan.featured) {
                  e.currentTarget.style.background = "var(--accent)";
                } else {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "var(--border-2)";
                }
              }}
              >{plan.cta}</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
