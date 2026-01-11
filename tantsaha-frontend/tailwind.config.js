 /** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // 1. On définit les mouvements 🎬
      keyframes: {
        fall: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        drift: {
          '0%': { transform: 'translateX(-20%)' },
          '100%': { transform: 'translateX(120%)' },
        }
      },
      // 2. On crée les noms de classes utilisables 🚀
      animation: {
        rain: 'fall 0.8s linear infinite',
        cloud: 'drift 30s linear infinite',
      }
    },
  },
  plugins: [],
}