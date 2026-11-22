/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          950: '#172554', // Primary Navy
          900: '#1e3a8a',
          800: '#1e40af',
          500: '#3b82f6',
          50: '#eff6ff',
        },
        slate: {
          850: '#151e2e',
        }
      }
    },
  },
  plugins: [],
}
