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
          50:  "#F5FAF7",
          100: "#EBF4EE",
          200: "#D5E8DC",
          300: "#BDD9C6",
        },
        violet: {
          50:  "#EDF8F2",
          100: "#C4E8D4",
          400: "#3BAB6D",
          500: "#22894F",
          600: "#1A6B3C",
          700: "#125230",
          900: "#082B18",
        },
        accent: {
          50:  "#E4F8FB",
          100: "#B0EDF6",
          400: "#26C2D8",
          500: "#18AEC8",
          600: "#1294AB",
          700: "#0D778B",
          900: "#063D4A",
        },
        ink: {
          900: "#0D1A12",
          700: "#2D3A31",
          500: "#5A6E60",
          300: "#98AA9E",
          100: "#D4DED6",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Montserrat", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 16px 0 rgba(13,13,26,0.08)",
        "card-lg": "0 8px 40px 0 rgba(13,13,26,0.12)",
        violet: "0 4px 24px 0 rgba(26,107,60,0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
