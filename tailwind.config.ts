import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Hire-a-Pestie brand: lime-green ring, orange character, charcoal wordmark
        cream: {
          50:  "#F8FBF0",
          100: "#F0F7E0",
          200: "#E1EFC3",
          300: "#CFE3A0",
        },
        violet: {            // primary = brand green
          50:  "#F3F9E6",
          100: "#DCEEB5",
          400: "#8CC63F",
          500: "#6FA82A",
          600: "#5A8F1C",
          700: "#44700F",
          900: "#223A07",
        },
        accent: {            // secondary = brand orange
          50:  "#FFF3E3",
          100: "#FFDDB0",
          400: "#FFA033",
          500: "#F58A1F",
          600: "#D9720E",
          700: "#A9570A",
          900: "#5C2F05",
        },
        navy: {               // overalls blue
          700: "#2E3A7A",
          800: "#232B5C",
          900: "#1A2046",
        },
        ink: {               // charcoal from the wordmark
          900: "#1E2328",
          700: "#363D44",
          500: "#646D75",
          300: "#A0A8AE",
          100: "#DADFE2",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Fredoka", "Montserrat", "sans-serif"],
      },
      boxShadow: {
        card: "4px 4px 0 0 #1E2328",
        "card-lg": "6px 6px 0 0 #1E2328",
        violet: "4px 4px 0 0 #1E2328",
      },
    },
  },
  plugins: [],
};

export default config;
