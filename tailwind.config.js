/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAFAFA',
        sidebar: {
          DEFAULT: '#374151',
          hover: '#4B5563',
          active: '#F3F4F6'
        },
        accent: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
        },
        card: '#FFFFFF',
        border: '#E5E7EB',
      }
    },
  },
  plugins: [],
}
