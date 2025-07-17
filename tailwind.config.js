/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        premium: {
          dark: '#0a0a0a',           // Main dark background
          'dark-gray': '#1a1a1a',    // Secondary dark
          'medium-gray': '#333333',  // Borders/accents
          gold: '#FFD700',           // Primary gold accent
          'gold-dark': '#b39700',    // Darker gold variant
          platinum: '#E5E4E2',       // Platinum accent
          diamond: '#b9f2ff',        // Diamond blue accent
          'light-gray': '#d1d5db',   // Light text/icons
          'lighter-gray': '#f5f5f5', // Light mode background
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'gradient': 'gradient 3s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px var(--color-primary-glow)' },
          '100%': { boxShadow: '0 0 30px var(--color-primary-glow-strong)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundImage: {
        'gold-diamond-gradient': 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))',
        'premium-decorative-gradient': 'linear-gradient(to bottom right, rgba(255, 215, 0, 0.1), rgba(255, 215, 0, 0.2), rgba(229, 228, 226, 0.1), rgba(185, 242, 255, 0.2))',
        'gold-progress-gradient': 'linear-gradient(to right, #b39700, var(--color-primary))',
      },
      boxShadow: {
        'gold-glow': '0 0 15px rgba(255, 215, 0, 0.3), 0 0 25px rgba(255, 215, 0, 0.2)',
        'gold-glow-lg': '0 0 30px rgba(255, 215, 0, 0.4), 0 0 50px rgba(255, 215, 0, 0.3)',
        'soft': '0 2px 15px rgba(0, 0, 0, 0.1)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
};