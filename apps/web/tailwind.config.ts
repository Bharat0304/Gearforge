import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Syne", "sans-serif"],
        serif: ["Instrument Serif", "serif"],
        mono: ["DM Mono", "monospace"],
      },
      colors: {
        black: "#000000",
        gf: {
          bg: "#000000",
          bg2: "#0a0a0a",
          bg3: "#111111",
          surf: "#141414",
          surf2: "#1a1a1a",
          surf3: "#222222",
          border: "rgba(255,255,255,0.06)",
          border2: "rgba(255,255,255,0.10)",
          border3: "rgba(255,255,255,0.18)",
          text: "#ffffff",
          text2: "#a0a0a0",
          text3: "#555555",
          red: "#ff4422",
          amber: "#ffaa00",
          green: "#22c55e",
        },
      },
      animation: {
        marquee: "marquee 22s linear infinite",
        float: "float 3.5s ease infinite",
        fadeUp: "fadeUp 0.4s ease both",
        shimmer: "shimmer 4s linear infinite",
        spin: "spin 0.7s linear infinite",
        blink: "blink 1s ease infinite",
        "prog-load": "prog-anim 3s ease forwards",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        blink: {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0.25" },
        },
        "prog-anim": {
          "0%": { width: "5%" },
          "70%": { width: "82%" },
          "100%": { width: "96%" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
