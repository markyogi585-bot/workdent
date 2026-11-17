/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#054bce",
        obsidian: "#0d0d1a",
        ivory: "#F8F6F1",
        canvas: "#f0f2f5",
        navy: "#0a0a14",
        emerald: "#16a34a",
        border: "#e5e7eb",
        foreground: "#0d0d1a",
        "muted-foreground": "#6b7280",
      },
      fontFamily: {
        display: ["Outfit", "sans-serif"],
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
