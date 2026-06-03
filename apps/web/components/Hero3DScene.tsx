"use client";

export default function Hero3DScene() {
  return (
    <div style={{
      width: "100%",
      height: "100%",
      position: "relative",
      overflow: "hidden",
      background: "#0a0a0a",
    }}>
      <svg
        viewBox="0 0 520 400"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <defs>
          {/* Grid perspective */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,68,34,0.08)" strokeWidth="0.5"/>
          </pattern>

          {/* Glow filters */}
          <filter id="glow-red" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="glow-amber" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="glow-soft" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>

          {/* Gradients */}
          <linearGradient id="body-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2a2a2a"/>
            <stop offset="100%" stopColor="#111"/>
          </linearGradient>
          <linearGradient id="arm-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#333"/>
            <stop offset="100%" stopColor="#1a1a1a"/>
          </linearGradient>
          <linearGradient id="prop-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,68,34,0.7)"/>
            <stop offset="50%" stopColor="rgba(255,68,34,0.2)"/>
            <stop offset="100%" stopColor="rgba(255,68,34,0.7)"/>
          </linearGradient>
          <linearGradient id="shadow-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,68,34,0.15)"/>
            <stop offset="100%" stopColor="transparent"/>
          </linearGradient>
          <linearGradient id="floor-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,68,34,0.06)"/>
            <stop offset="100%" stopColor="transparent"/>
          </linearGradient>
          <radialGradient id="ambient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,68,34,0.05)"/>
            <stop offset="100%" stopColor="transparent"/>
          </radialGradient>
          <radialGradient id="cam-lens" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#444"/>
            <stop offset="60%" stopColor="#111"/>
            <stop offset="100%" stopColor="#000"/>
          </radialGradient>
        </defs>

        {/* Background */}
        <rect width="520" height="400" fill="#050505"/>
        <rect width="520" height="400" fill="url(#ambient)"/>

        {/* Perspective grid floor */}
        <g opacity="0.6">
          {/* Horizontal lines converging to vanishing point at (260, 260) */}
          {[320, 340, 360, 380, 400].map((y, i) => (
            <line key={i}
              x1={260 - (y - 260) * 2.2}
              y1={y}
              x2={260 + (y - 260) * 2.2}
              y2={y}
              stroke="rgba(255,68,34,0.07)"
              strokeWidth="0.5"
            />
          ))}
          {/* Radiating lines */}
          {[-5,-4,-3,-2,-1,0,1,2,3,4,5].map((i) => (
            <line key={i}
              x1={260 + i * 52}
              y1={320}
              x2={260 + i * 10}
              y2={260}
              stroke="rgba(255,68,34,0.05)"
              strokeWidth="0.5"
            />
          ))}
        </g>

        {/* Ambient glow blob */}
        <ellipse cx="260" cy="320" rx="120" ry="30" fill="rgba(255,68,34,0.04)" filter="url(#glow-soft)"/>

        {/* DRONE — animated float */}
        <g style={{ animation: "droneFloat 3.5s ease-in-out infinite" }}>
          <style>{`
            @keyframes droneFloat {
              0%,100% { transform: translateY(0px); }
              50% { transform: translateY(-14px); }
            }
            @keyframes propSpin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes propSpinR {
              from { transform: rotate(0deg); }
              to { transform: rotate(-360deg); }
            }
            @keyframes ledBlink {
              0%,90%,100% { opacity: 1; }
              95% { opacity: 0.1; }
            }
            @keyframes camScan {
              0%,100% { transform: rotate(-8deg); }
              50% { transform: rotate(8deg); }
            }
          `}</style>

          {/* Drop shadow on floor */}
          <ellipse cx="260" cy="318" rx="55" ry="8" fill="rgba(0,0,0,0.5)"/>
          <ellipse cx="260" cy="316" rx="40" ry="5" fill="rgba(255,68,34,0.08)"/>

          {/* === DRONE BODY === */}
          {/* Main chassis — isometric 3D box feel */}
          <g>
            {/* Bottom face */}
            <ellipse cx="260" cy="218" rx="38" ry="12" fill="#0d0d0d" stroke="rgba(255,68,34,0.15)" strokeWidth="0.5"/>
            {/* Top face */}
            <ellipse cx="260" cy="200" rx="38" ry="12" fill="url(#body-grad)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
            {/* Front face */}
            <rect x="222" y="200" width="76" height="18" rx="2" fill="#1c1c1c" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
            {/* Side sheen */}
            <rect x="222" y="200" width="10" height="18" rx="1" fill="rgba(255,255,255,0.04)"/>
            {/* Top detail lines */}
            <line x1="232" y1="196" x2="288" y2="196" stroke="rgba(255,68,34,0.2)" strokeWidth="0.5"/>
            <line x1="235" y1="193" x2="285" y2="193" stroke="rgba(255,68,34,0.1)" strokeWidth="0.3"/>
            {/* Center logo mark */}
            <polygon points="260,194 264,200 256,200" fill="rgba(255,68,34,0.5)"/>
          </g>

          {/* === ARMS — 4 arms at 45° ===*/}
          {/* NW arm */}
          <rect x="204" y="198" width="48" height="5" rx="2"
            transform="rotate(-45 228 200)" fill="url(#arm-grad)" stroke="rgba(255,255,255,0.04)" strokeWidth="0.3"/>
          {/* NE arm */}
          <rect x="268" y="198" width="48" height="5" rx="2"
            transform="rotate(45 292 200)" fill="url(#arm-grad)" stroke="rgba(255,255,255,0.04)" strokeWidth="0.3"/>
          {/* SW arm */}
          <rect x="204" y="208" width="48" height="5" rx="2"
            transform="rotate(45 228 210)" fill="url(#arm-grad)" stroke="rgba(255,255,255,0.04)" strokeWidth="0.3"/>
          {/* SE arm */}
          <rect x="268" y="208" width="48" height="5" rx="2"
            transform="rotate(-45 292 210)" fill="url(#arm-grad)" stroke="rgba(255,255,255,0.04)" strokeWidth="0.3"/>

          {/* === MOTOR HUBS === */}
          {[
            { cx: 225, cy: 175 },
            { cx: 295, cy: 175 },
            { cx: 225, cy: 235 },
            { cx: 295, cy: 235 },
          ].map((m, i) => (
            <g key={i}>
              <circle cx={m.cx} cy={m.cy} r="7" fill="#1a1a1a" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
              <circle cx={m.cx} cy={m.cy} r="4" fill="#111" stroke="rgba(255,68,34,0.3)" strokeWidth="0.5"/>
              <circle cx={m.cx} cy={m.cy} r="1.5" fill="rgba(255,68,34,0.6)"/>
            </g>
          ))}

          {/* === PROPELLERS (spinning) === */}
          {/* Top-left prop */}
          <g style={{ transformOrigin: "225px 170px", animation: "propSpin 0.15s linear infinite" }}>
            <ellipse cx="225" cy="170" rx="22" ry="3" fill="url(#prop-grad)" opacity="0.7"/>
            <ellipse cx="225" cy="170" rx="3" ry="22" fill="url(#prop-grad)" opacity="0.7"/>
          </g>
          {/* Top-right prop — reverse */}
          <g style={{ transformOrigin: "295px 170px", animation: "propSpinR 0.15s linear infinite" }}>
            <ellipse cx="295" cy="170" rx="22" ry="3" fill="url(#prop-grad)" opacity="0.7"/>
            <ellipse cx="295" cy="170" rx="3" ry="22" fill="url(#prop-grad)" opacity="0.7"/>
          </g>
          {/* Bottom-left prop */}
          <g style={{ transformOrigin: "225px 240px", animation: "propSpinR 0.12s linear infinite" }}>
            <ellipse cx="225" cy="240" rx="22" ry="3" fill="url(#prop-grad)" opacity="0.7"/>
            <ellipse cx="225" cy="240" rx="3" ry="22" fill="url(#prop-grad)" opacity="0.7"/>
          </g>
          {/* Bottom-right prop */}
          <g style={{ transformOrigin: "295px 240px", animation: "propSpin 0.12s linear infinite" }}>
            <ellipse cx="295" cy="240" rx="22" ry="3" fill="url(#prop-grad)" opacity="0.7"/>
            <ellipse cx="295" cy="240" rx="3" ry="22" fill="url(#prop-grad)" opacity="0.7"/>
          </g>

          {/* === CAMERA GIMBAL === */}
          <g style={{ transformOrigin: "260px 225px", animation: "camScan 4s ease-in-out infinite" }}>
            {/* Gimbal arm */}
            <rect x="254" y="218" width="12" height="14" rx="2" fill="#151515" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"/>
            {/* Camera housing */}
            <rect x="248" y="228" width="24" height="16" rx="3" fill="#1a1a1a" stroke="rgba(255,170,0,0.2)" strokeWidth="0.5"/>
            {/* Lens */}
            <circle cx="260" cy="236" r="6" fill="url(#cam-lens)" stroke="rgba(255,170,0,0.3)" strokeWidth="0.5"/>
            <circle cx="260" cy="236" r="3" fill="#000" stroke="rgba(255,170,0,0.2)" strokeWidth="0.3"/>
            <circle cx="258" cy="234" r="1" fill="rgba(255,255,255,0.2)"/>
            {/* Status LED */}
            <circle cx="267" cy="229" r="1.5" fill="#22c55e" style={{ animation: "ledBlink 2s ease infinite" }} filter="url(#glow-amber)"/>
          </g>

          {/* === LANDING LEGS === */}
          <g fill="none" stroke="#222" strokeWidth="2">
            <line x1="240" y1="218" x2="232" y2="238"/>
            <line x1="232" y1="238" x2="216" y2="238"/>
            <line x1="216" y1="238" x2="214" y2="235"/>
            <line x1="280" y1="218" x2="288" y2="238"/>
            <line x1="288" y1="238" x2="304" y2="238"/>
            <line x1="304" y1="238" x2="306" y2="235"/>
          </g>

          {/* === STATUS LIGHTS === */}
          <circle cx="235" cy="204" r="2" fill="var(--red,#ff4422)" style={{ animation: "ledBlink 1.5s ease infinite" }} filter="url(#glow-red)"/>
          <circle cx="285" cy="204" r="2" fill="#22c55e" style={{ animation: "ledBlink 2.2s ease 0.5s infinite" }} filter="url(#glow-amber)"/>
        </g>

        {/* === UI OVERLAYS === */}
        {/* Crosshair / targeting reticle */}
        <g opacity="0.3" stroke="rgba(255,68,34,0.6)" strokeWidth="0.5" fill="none">
          <circle cx="260" cy="205" r="50"/>
          <line x1="260" y1="145" x2="260" y2="160"/>
          <line x1="260" y1="250" x2="260" y2="265"/>
          <line x1="200" y1="205" x2="215" y2="205"/>
          <line x1="305" y1="205" x2="320" y2="205"/>
          {/* Corner ticks */}
          <path d="M 220 165 L 220 175 L 230 175" opacity="0.8"/>
          <path d="M 300 165 L 300 175 L 290 175" opacity="0.8"/>
          <path d="M 220 245 L 220 235 L 230 235" opacity="0.8"/>
          <path d="M 300 245 L 300 235 L 290 235" opacity="0.8"/>
        </g>

        {/* Scan line */}
        <rect x="140" y="0" width="240" height="1" fill="rgba(255,68,34,0.15)">
          <animateTransform attributeName="transform" type="translate" from="0 140" to="0 280" dur="3s" repeatCount="indefinite"/>
        </rect>

        {/* Label bottom */}
        <text x="260" y="390" textAnchor="middle" fontFamily="'DM Mono',monospace" fontSize="9" fill="rgba(255,255,255,0.2)" letterSpacing="3">AI-GENERATED · BLENDER 4.1</text>

        {/* Corner brackets */}
        <g stroke="rgba(255,68,34,0.4)" strokeWidth="1" fill="none">
          <path d="M 12 12 L 12 28 M 12 12 L 28 12"/>
          <path d="M 508 12 L 508 28 M 508 12 L 492 12"/>
          <path d="M 12 388 L 12 372 M 12 388 L 28 388"/>
          <path d="M 508 388 L 508 372 M 508 388 L 492 388"/>
        </g>

        {/* Telemetry readout top-left */}
        <g fontFamily="'DM Mono',monospace" fontSize="8" fill="rgba(255,68,34,0.5)" letterSpacing="1">
          <text x="20" y="42">ALT: 42.3M</text>
          <text x="20" y="54">HDG: 047°</text>
          <text x="20" y="66">BAT: 87%</text>
        </g>

        {/* Poly count badge top-right */}
        <g>
          <rect x="390" y="32" width="110" height="24" fill="rgba(0,0,0,0.6)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" rx="2"/>
          <text x="445" y="48" textAnchor="middle" fontFamily="'DM Mono',monospace" fontSize="9" fill="rgba(255,255,255,0.4)" letterSpacing="1">24.3K POLYS</text>
        </g>
      </svg>
    </div>
  );
}
