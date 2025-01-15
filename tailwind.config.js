/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7F3DFF',
          50: '#F6F3FF',
          100: '#EDE6FF',
          200: '#D3C3FF',
          300: '#B69CFF',
          400: '#9A75FF',
          500: '#7F3DFF',
          600: '#6E35E0',
          700: '#5C2EBD',
          800: '#4B269A',
          900: '#3A1F77',
        }
      }
    },
  },
  plugins: [],
}

