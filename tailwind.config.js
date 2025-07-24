/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2C3E50',
        'primary-hover': '#1B2A38',
        secondary: '#00A896',
        'secondary-hover': '#008B7A',
        alert: '#F76C5E',
        success: '#00D084',
        'text-primary': '#2C3E50',
        'text-secondary': '#636E72',
        'bg-light': '#F1F2F6',
        'border-color': '#D1D5DB',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'nunito': ['Nunito', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-in-out',
        'pulse-slow': 'pulse 2s infinite',
      }
    },
  },
  plugins: [],
};