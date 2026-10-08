import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        arena: {
          dark: "#090D16",
          card: "#121826",
          border: "#1F293D",
          accent: "#3B82F6",
          glow: "#60A5FA",
          speaking: "#10B981",
          warning: "#F59E0B",
          danger: "#EF4444",
          muted: "#94A3B8",
        },
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
          "0%, 100%": { boxShadow: "0 0 15px rgba(16, 185, 129, 0.4)" },
          "50%": { boxShadow: "0 0 30px rgba(16, 185, 129, 0.8)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
