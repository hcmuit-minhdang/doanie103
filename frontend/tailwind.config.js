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
          50: '#fdf3f3',
          100: '#fbe4e4',
          200: '#f7cdcd',
          300: '#f1a8a8',
          400: '#e57777',
          500: '#d54d4d',
          600: '#c03333',
          700: '#8b2020', // Custom dark red
          800: '#6b1d1d', // Primary brand color
          900: '#5a1b1b',
          950: '#320b0b',
        },
        cream: {
          50: '#fffcf7',
          100: '#fff8f0', // Custom base background
          200: '#fdf6ec', // Custom card hover/alt background
          300: '#faecd8',
          400: '#f5dbb9',
          500: '#e9be8b',
          600: '#d99c5c',
          700: '#bf7636',
          800: '#9c5a27',
          900: '#7e4820',
          950: '#43230e',
        }
      },
      fontFamily: {
        serif: ['Noto Serif', 'Georgia', 'ui-serif', 'serif'],
        sans: ['Inter', 'Roboto', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 4px 20px -2px rgba(107, 29, 29, 0.05), 0 2px 10px -1px rgba(107, 29, 29, 0.03)',
        'premium-hover': '0 10px 30px -5px rgba(107, 29, 29, 0.1), 0 4px 15px -2px rgba(107, 29, 29, 0.05)',
      }
    },
  },
  plugins: [],
}
