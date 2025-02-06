// const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: '[tuiTheme="dark"]',
  theme: {
    extend: {
      colors: {
        negative: 'var(--tui-status-negative)',
        positive: 'var(--tui-status-positive)',
        warning: 'var(--tui-status-warning)',
        info: 'var(--tui-status-info)',
        warning: 'var(--tui-status-warning)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('tailwind-scrollbar'),
    require('tailwindcss-animate'),
    'prettier-plugin-tailwindcss',
  ],
};
