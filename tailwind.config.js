/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: { 
          50: "#f0f5ff", 
          100: "#e0eaff", 
          200: "#c2d5ff", 
          300: "#93b4fd", 
          400: "#6090fa", 
          500: "#3b6cf5", 
          600: "#254bea", 
          700: "#1d39d7", 
          800: "#1e30ae", 
          900: "#1e2d89" 
        },
      },
      animation: { 
        "fade-in": "fadeIn 0.5s ease-in-out", 
        "slide-up": "slideUp 0.4s ease-out" 
      },
      keyframes: {
        fadeIn: { 
          "0%": { opacity: "0" }, 
          "100%": { opacity: "1" } 
        },
        slideUp: { 
          "0%": { opacity: "0", transform: "translateY(20px)" }, 
          "100%": { opacity: "1", transform: "translateY(0)" } 
        },
      },
    },
  },
  plugins: [],
}
