"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !pass) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/v1/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid credentials");
      } else if (data.token) {
        // Save the JWT token securely
        Cookies.set("auth_token", data.token, { expires: 1 }); // expires in 1 day
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError("Failed to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr" }}>
      {/* LEFT — dark brand panel */}
      <div style={{
        background: "#000",
        padding: 48,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}>
        {/* Grid dots */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "24px 24px", pointerEvents: "none" }} />
        {/* Red glow */}
        <div style={{ position: "absolute", bottom: -200, left: -200, width: 600, height: 600, background: "radial-gradient(circle, rgba(255,68,34,0.1) 0%, transparent 60%)", borderRadius: "50%", pointerEvents: "none" }} />

        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", position: "relative", zIndex: 1 }}>
          <div style={{ width: 28, height: 28, background: "linear-gradient(135deg,#ff4422,#ffaa00)", clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)" }} />
          <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", color: "#fff" }}>Gearforge</span>
        </Link>

        <div style={{ position: "relative", zIndex: 1 }}>
          <blockquote style={{ fontFamily: "var(--fs)", fontStyle: "italic", fontSize: 22, lineHeight: 1.6, color: "rgba(255,255,255,0.55)", marginBottom: 20 }}>
            "Gearforge cut our asset pipeline from weeks to hours. The quality is production-ready."
          </blockquote>
          <cite style={{ fontFamily: "var(--fm)", fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: ".12em", textTransform: "uppercase", fontStyle: "normal" }}>
            — Alex Chen · 3D Artist, Riot Games
          </cite>
        </div>
      </div>

      {/* RIGHT — form */}
      <div style={{ background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: 48 }}>
        <form onSubmit={handleSignIn} style={{ width: "100%", maxWidth: 380, animation: "fadeUp 0.35s ease both" }}>
          <div style={{ fontFamily: "var(--fm)", fontSize: 10, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--red)", marginBottom: 14 }}>Welcome back</div>
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-.025em", marginBottom: 6 }}>Sign in to Gearforge</h1>
          <p style={{ fontSize: 13, color: "var(--text3)", marginBottom: 32 }}>Enter your credentials to continue</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
            {[
              { label: "Google", icon: "G" },
              { label: "GitHub", icon: "⌥" },
            ].map((s) => (
              <button key={s.label} type="button" style={{
                padding: 10, background: "var(--surf)", border: "1px solid rgba(255,255,255,0.1)",
                color: "var(--text2)", cursor: "pointer", fontFamily: "var(--fn)", fontSize: 12, fontWeight: 600,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "all .15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--surf2)"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "var(--surf)"; e.currentTarget.style.color = "var(--text2)"; }}
              >
                <span>{s.icon}</span> {s.label}
              </button>
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

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontFamily: "var(--fm)", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--text3)", marginBottom: 6 }}>Email</label>
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ width: "100%", padding: "11px 14px", background: "var(--surf)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontFamily: "var(--fn)", fontSize: 14, outline: "none", transition: "border-color .15s" }}
              onFocus={e => (e.target.style.borderColor = "rgba(255,255,255,0.3)")}
              onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <label style={{ fontFamily: "var(--fm)", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--text3)" }}>Password</label>
              <a href="#" style={{ fontFamily: "var(--fm)", fontSize: 10, color: "var(--amber)", textDecoration: "none" }}>Forgot password?</a>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              value={pass}
              onChange={e => setPass(e.target.value)}
              style={{ width: "100%", padding: "11px 14px", background: "var(--surf)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontFamily: "var(--fn)", fontSize: 14, outline: "none", transition: "border-color .15s" }}
              onFocus={e => (e.target.style.borderColor = "rgba(255,255,255,0.3)")}
              onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>

          <button type="submit" disabled={loading} style={{
            display: "block", width: "100%", padding: 13, border: "none", cursor: loading ? "not-allowed" : "pointer",
            background: "var(--red)", color: "#fff", textAlign: "center",
            fontSize: 14, fontWeight: 700, letterSpacing: ".04em", textDecoration: "none",
            transition: "background .18s", opacity: loading ? 0.7 : 1
          }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#ff6644"; }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "var(--red)"; }}
          >{loading ? "Signing in..." : "Sign In →"}</button>

          <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "var(--text3)" }}>
            Don&apos;t have an account?{" "}
            <Link href="/signup" style={{ color: "#fff", fontWeight: 700, textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.3)" }}>Create one free</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
