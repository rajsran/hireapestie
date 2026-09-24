import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50:  "#FDFBF8",
          100: "#F8F4EE",
          200: "#EEE9E2",
          300: "#E0D9CF",
        },
        violet: {
          50:  "#EEF0FA",
          100: "#D0D8F0",
          400: "#5B7BC4",
          500: "#3358A8",
          600: "#1B2D6E",
          700: "#142258",
          900: "#0C1435",
        },
        accent: {
          50:  "#F0F9EE",
          100: "#D4F0CF",
          400: "#72CC62",
          500: "#55C041",
          600: "#4DB53C",
          700: "#3A8C2C",
          900: "#1C4515",
        },
        ink: {
          900: "#0D0D1A",
          700: "#2D2D3A",
          500: "#5A5A6E",
          300: "#9898AA",
          100: "#D4D4DE",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Montserrat", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 16px 0 rgba(13,13,26,0.08)",
        "card-lg": "0 8px 40px 0 rgba(13,13,26,0.12)",
        violet: "0 4px 24px 0 rgba(27,45,110,0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
