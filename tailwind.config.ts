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
        brand: {
          dark: "#7A561E",     // Deep gold/bronze for hover
          forest: "#A37835",   // Primary logo gold ("HOLSTEIN" text & emblem)
          primary: "#B88E4C",  // Core logo gold
          green: "#9E742E",    // Medium gold/bronze
          leaf: "#C39A57",     // Vibrant crescent gold
          light: "#FDFBF7",    // Off-white warm tint
          surface: "#FAF6ED",  // Soft champagne gold card surface
          border: "#E8D7B8",   // Warm gold border
          deep: "#2D210E",     // Dark rich bronze for hero/banners
          gold: "#C39A57",     // Original logo gold
          goldDark: "#8C6324", // Deep rich gold
          goldLight: "#FAF5EB",
          goldDeep: "#261C0D",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      keyframes: {
        "marquee-right": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
        "marquee-left": {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "marquee-right": "marquee-right 40s linear infinite",
        "marquee-left": "marquee-left 40s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
