import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Kolory tła
        background: {
          light: '#e4e4e7', // zinc-200
          dark: '#3f3f46', // zinc-700
          sideLight: '#f4f4f5',//zinc-100
          sideDark: '#71717a', //zinc-500
          chatLight: '#fafafa',//zinc-50
          chatDark: '#a1a1aa',//zinc-400

        },
        // Kolory tekstu
        text: {
          light: '#000000', // Czarny
          dark: '#ffffff', // Biały
        },
        // Kolory przycisków
        button: {
          light: '#3b82f6', // Jasny niebieski
          dark: '#1d4ed8', // Ciemniejszy niebieski
        },
        // Kolory obramowania
        border: {
          light: '#e5e7eb', // Jasnoszary
          dark: '#374151', // Ciemniejszy szary
        }
      },
      fontFamily: {
        sans: ['Arial', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};