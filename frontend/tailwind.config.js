/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: {
          50: "#f0fafa",
          100: "#ccf0ee",
          200: "#99e2dd",
          300: "#5dcdc6",
          400: "#2ab3ae",
          500: "#0e9a98",
          600: "#0a7f7e",
          700: "#086564",
          800: "#074f4f",
          900: "#063f3f"
        }
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15, 23, 42, 0.06), 0 12px 30px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};

