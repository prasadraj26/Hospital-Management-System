/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#F0F5FA',
          100: '#EAF1F8',
          200: '#D5E3F0',
          300: '#AAC7E1',
          400: '#6896C3',
          500: '#2E6BA4',
          600: '#14395E',
          700: '#0B2A4A',
          800: '#081F38',
          900: '#051527',
          950: '#030C17',
        },
        surface: '#EAF1F8',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-navy': 'linear-gradient(135deg, #0B2A4A 0%, #14395E 100%)',
        'gradient-navy-dark': 'linear-gradient(135deg, #081F38 0%, #0B2A4A 100%)',
      }
    },
  },
  plugins: [],
}