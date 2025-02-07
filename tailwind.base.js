/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: [
        'Poppins',
        'ui-sans-serif',
        'system-ui',
        'sans-serif',
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
        'Noto Color Emoji',
      ],
      mono: [
        'ui-monospace',
        'SFMono-Regular',
        'Menlo',
        'Monaco',
        'Consolas',
        'Liberation Mono',
        'Courier New',
        'monospace',
      ],
    },
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
