/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gov: {
          saffron: '#FF9933',
          'saffron-dark': '#E67300',
          'saffron-light': '#FFF5EB',
          navy: '#0B2545',
          'navy-dark': '#061629',
          'navy-light': '#133B6B',
          blue: '#0D47A1',
          'blue-light': '#E3F2FD',
          green: '#138808',
          'green-light': '#E8F5E9',
          'green-dark': '#0E6606',
          red: '#C62828',
          'red-light': '#FFEBEE',
          amber: '#F57C00',
          'amber-light': '#FFF8E1',
          gray: '#F4F6F9',
          border: '#D1D5DB'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans', 'Segoe UI', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}