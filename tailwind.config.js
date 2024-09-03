import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          light: '#e4e4e7', // zinc-200
          dark: '#3f3f46', // zinc-700
          sideLight: '#f4f4f5',//zinc-100
          sideDark: '#71717a', //zinc-500
          chatLight: '#fafafa',//zinc-50
          chatDark: '#a1a1aa',//zinc-400

        },
        text: {
          light: '#000000',
          dark: '#ffffff',
        }
      },
      fontFamily: {
        sans: ['Arial', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};