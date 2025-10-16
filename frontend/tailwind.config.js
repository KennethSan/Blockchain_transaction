/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'blockchain-blue': '#3b82f6',
        'blockchain-green': '#10b981',
        'blockchain-red': '#ef4444',
      }
    },
  },
  plugins: [],
}
