import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1e3a5f",
          light: "#2d5a8e",
        },
        accent: "#0891b2",
        success: "#059669",
        warning: "#d97706",
        danger: "#dc2626",
        surface: "#ffffff",
        background: "#f8fafc",
        "text-primary": "#0f172a",
        "text-secondary": "#64748b",
        border: "#e2e8f0",
      },
    },
  },
  plugins: [],
};
export default config;
