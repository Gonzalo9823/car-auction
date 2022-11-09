/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    spinner: () => ({
      default: {
        color: '#dae1e7',
        size: '1.5em',
        border: '2px',
        speed: '500ms',
      },
      gray: {
        color: '#1F2937',
        size: '1.5em',
        border: '2px',
        speed: '500ms',
      },
    }),
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-spinner')({ className: 'spinner', themeKey: 'spinner' })
  ],
}
