/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        win95: {
          bg: '#c0c0c0',
          light: '#ffffff',
          dark: '#808080',
          shadow: '#404040',
          titlebar: '#000080',
          titlebar2: '#1084d0',
          inactive: '#808080',
        },
      },
      fontFamily: {
        sans: ['"MS Sans Serif"', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
        mono: ['Consolas', '"Courier New"', 'monospace'],
        accent: ['"Jersey 10"', 'monospace'],
      },
    },
  },
  plugins: [],
};
