const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'nebula-bg': '#080318',
        'nebula-deep': '#13042c',
        'nebula-purple': '#7c3aed',
        'nebula-magenta': '#e11d74',
        'nebula-cyan': '#38bdf8',
        'nebula-gold': '#fbbf24',
        'nebula-ice': '#c7d2fe',
      },
      fontFamily: {
        sans: ['"Poppins"', ...defaultTheme.fontFamily.sans],
        heading: ['"Space Grotesk"', '"Poppins"', ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        'glow-sm': '0 12px 36px -18px rgba(124, 58, 237, 0.6)',
        'glow-md': '0 24px 70px -30px rgba(59, 130, 246, 0.55)',
        'glow-lg': '0 40px 110px -45px rgba(236, 72, 153, 0.7)',
      },
      dropShadow: {
        glow: '0 0 25px rgba(236, 72, 153, 0.45)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 5s ease-in-out infinite',
        'spin-slow': 'spin 18s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.35, transform: 'scale(1)' },
          '50%': { opacity: 0.75, transform: 'scale(1.05)' },
        },
      },
      backdropBlur: {
        xl: '28px',
      },
      spacing: {
        18: '4.5rem',
      },
    },
  },
  plugins: [],
}
