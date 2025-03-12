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
          DEFAULT: '#e85231',
          hover: '#d43e1d',
          light: '#fa9236',
        },
        secondary: {
          DEFAULT: '#22091b',
          light: '#3a1530',
        },
        background: {
          light: '#f8f9fa',
          DEFAULT: '#dadada',
          dark: '#c8c8c8',
        }
      },
      boxShadow: {
        'custom': '0 4px 15px rgba(0, 0, 0, 0.15)',
        'card': '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

