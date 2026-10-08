import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        arena: {
          dark: "#F8FAFC",
          card: "#FFFFFF",
          border: "#E2E8F0",
          accent: "#0F172A",
          glow: "#3B82F6",
          speaking: "#10B981",
          warning: "#F59E0B",
          danger: "#EF4444",
          muted: "#64748B",
        },
      },
      boxShadow: {
        "subtle": "0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)",
        "card": "0 10px 30px -5px rgba(0, 0, 0, 0.08), 0 4px 10px -2px rgba(0, 0, 0, 0.03)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "sound-wave": "soundWave 1.2s ease-in-out infinite",
        "glow-speaking": "glowSpeaking 2s ease-in-out infinite",
      },
      keyframes: {
        soundWave: {
          "0%, 100%": { height: "4px" },
          "50%": { height: "24px" },
        },
        glowSpeaking: {
          "0%, 100%": { boxShadow: "0 0 15px rgba(16, 185, 129, 0.3)" },
          "50%": { boxShadow: "0 0 25px rgba(16, 185, 129, 0.6)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
