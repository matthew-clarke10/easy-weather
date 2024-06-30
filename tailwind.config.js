/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
        'loading': 'calc(100vh - 12rem)',
        'loading-preview': 'calc(100vh - 36rem)',
      },
    },
  },
  plugins: [],
}