"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const STEPS = ["Account", "Profile", "Plan"];

export default function SignUpPage() {
  const [step, setStep] = useState(0);
  const [strength, setStrength] = useState(0);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function calcStrength(v: string) {
    let s = 0;
    if (v.length >= 8) s++;
    if (/[A-Z]/.test(v)) s++;
    if (/[0-9]/.test(v)) s++;
    if (/[^a-zA-Z0-9]/.test(v)) s++;
    setStrength(s);
    setPassword(v);
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password || !firstName) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const name = `${firstName} ${lastName}`.trim();
      const res = await fetch("http://localhost:3000/api/v1/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to create account");
      } else {
        // Automatically redirect to sign in or sign them in
        router.push("/signin");
      }
    } catch (err) {
      setError("Failed to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const strengthColors = ["#ef4444", "#f97316", "#ffaa00", "#22c55e"];
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];

  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr" }}>
      {/* LEFT */}
      <div style={{
        background: "#000", padding: 48, display: "flex", flexDirection: "column", justifyContent: "space-between",
        position: "relative", overflow: "hidden", borderRight: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "24px 24px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: -200, right: -200, width: 600, height: 600, background: "radial-gradient(circle, rgba(255,170,0,0.08) 0%, transparent 60%)", borderRadius: "50%", pointerEvents: "none" }} />

        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", position: "relative", zIndex: 1 }}>
          <div style={{ width: 28, height: 28, background: "linear-gradient(135deg,#ff4422,#ffaa00)", clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)" }} />
          <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", color: "#fff" }}>Gearforge</span>
        </Link>

        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{ fontSize: "clamp(32px,4vw,52px)", fontWeight: 800, lineHeight: .88, letterSpacing: "-.025em", marginBottom: 24 }}>
            Start building<br />
            <em style={{ fontFamily: "var(--fs)", fontStyle: "italic", fontWeight: 400, color: "var(--amber)" }}>for free.</em>
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 32 }}>
            {["50 free generations per month", "No credit card required", "Export to OBJ, GLTF, FBX", "Community support"].map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "rgba(255,255,255,0.55)" }}>
                <span style={{ color: "var(--amber)", fontSize: 14 }}>✓</span> {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div style={{ background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: 48 }}>
        <form onSubmit={handleSignUp} style={{ width: "100%", maxWidth: 420, animation: "fadeUp 0.35s ease both" }}>
          {/* Step bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, flex: i < STEPS.length - 1 ? 1 : undefined }}>
                <div style={{
                  width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--fm)", fontSize: 11, fontWeight: 500,
                  background: i < step ? "#fff" : i === step ? "var(--red)" : "transparent",
                  color: i < step ? "#000" : "#fff",
                  border: i >= step ? "1px solid rgba(255,255,255,0.15)" : "none",
                  flexShrink: 0,
                }}>{i < step ? "✓" : i + 1}</div>
                {i < STEPS.length - 1 && <div style={{ flex: 1, height: 1, background: i < step ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.08)" }} />}
              </div>
            ))}
          </div>

          <div style={{ fontFamily: "var(--fm)", fontSize: 10, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--red)", marginBottom: 14 }}>Create account</div>
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-.025em", marginBottom: 6 }}>Join Gearforge</h1>
          <p style={{ fontSize: 13, color: "var(--text3)", marginBottom: 28 }}>Free forever. No credit card needed.</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
            {[{ label: "Google", icon: "G" }, { label: "GitHub", icon: "⌥" }].map((s) => (
              <button key={s.label} type="button" style={{
                padding: 10, background: "var(--surf)", border: "1px solid rgba(255,255,255,0.1)",
                color: "var(--text2)", cursor: "pointer", fontFamily: "var(--fn)", fontSize: 12, fontWeight: 600,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all .15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--surf2)"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "var(--surf)"; e.currentTarget.style.color = "var(--text2)"; }}
                onClick={() => {
                  if (s.label === "GitHub") {
                    window.location.href = "http://localhost:3000/api/v1/auth/github";
                  } else if (s.label === "Google") {
                    window.location.href = "http://localhost:3000/api/v1/auth/google";
                  }
                }}
              ><span>{s.icon}</span> {s.label}</button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
            <span style={{ fontFamily: "var(--fm)", fontSize: 10, color: "var(--text3)", letterSpacing: ".08em" }}>OR</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
          </div>

          {error && (
            <div style={{ marginBottom: 16, padding: "10px", background: "rgba(255, 68, 34, 0.1)", border: "1px solid var(--red)", borderRadius: 4, color: "var(--red)", fontSize: 13 }}>
              {error}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div>
              <label style={{ display: "block", fontFamily: "var(--fm)", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--text3)", marginBottom: 6 }}>First Name</label>
              <input type="text" placeholder="Alex" value={firstName} onChange={e => setFirstName(e.target.value)} style={{ width: "100%", padding: "11px 14px", background: "var(--surf)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontFamily: "var(--fn)", fontSize: 14, outline: "none" }}
                onFocus={e => (e.target.style.borderColor = "rgba(255,255,255,0.3)")}
                onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </div>
            <div>
              <label style={{ display: "block", fontFamily: "var(--fm)", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--text3)", marginBottom: 6 }}>Last Name</label>
              <input type="text" placeholder="Chen" value={lastName} onChange={e => setLastName(e.target.value)} style={{ width: "100%", padding: "11px 14px", background: "var(--surf)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontFamily: "var(--fn)", fontSize: 14, outline: "none" }}
                onFocus={e => (e.target.style.borderColor = "rgba(255,255,255,0.3)")}
                onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontFamily: "var(--fm)", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--text3)", marginBottom: 6 }}>Email</label>
            <input type="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%", padding: "11px 14px", background: "var(--surf)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontFamily: "var(--fn)", fontSize: 14, outline: "none" }}
              onFocus={e => (e.target.style.borderColor = "rgba(255,255,255,0.3)")}
              onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontFamily: "var(--fm)", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--text3)", marginBottom: 6 }}>Password</label>
            <input type="password" placeholder="Min. 8 characters"
              value={password}
              onChange={e => calcStrength(e.target.value)}
              style={{ width: "100%", padding: "11px 14px", background: "var(--surf)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontFamily: "var(--fn)", fontSize: 14, outline: "none" }}
              onFocus={e => (e.target.style.borderColor = "rgba(255,255,255,0.3)")}
              onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
            <div style={{ display: "flex", gap: 3, marginTop: 6 }}>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} style={{ flex: 1, height: 3, background: i < strength ? strengthColors[strength - 1] : "rgba(255,255,255,0.08)", transition: "background .3s" }} />
              ))}
            </div>
            {strength > 0 && <div style={{ fontSize: 10, fontFamily: "var(--fm)", color: strengthColors[strength - 1], marginTop: 4 }}>{strengthLabels[strength - 1]}</div>}
          </div>

          <button type="submit" disabled={loading} style={{
            display: "block", width: "100%", padding: 13, background: "var(--red)", color: "#fff",
            textAlign: "center", fontSize: 14, fontWeight: 700, letterSpacing: ".04em", textDecoration: "none", transition: "background .18s",
            border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1
          }}
            onMouseEnter={e => { if(!loading) e.currentTarget.style.background = "#ff6644"; }}
            onMouseLeave={e => { if(!loading) e.currentTarget.style.background = "var(--red)"; }}
          >{loading ? "Creating Account..." : "Create Account — It's Free →"}</button>

          <p style={{ fontSize: 10, color: "var(--text3)", textAlign: "center", marginTop: 12, lineHeight: 1.6 }}>
            By creating an account you agree to our{" "}
            <a href="#" style={{ color: "var(--amber)", textDecoration: "none" }}>Terms</a>{" "}and{" "}
            <a href="#" style={{ color: "var(--amber)", textDecoration: "none" }}>Privacy Policy</a>.
          </p>
          <p style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "var(--text3)" }}>
            Already have an account?{" "}
            <Link href="/signin" style={{ color: "#fff", fontWeight: 700, textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.3)" }}>Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
