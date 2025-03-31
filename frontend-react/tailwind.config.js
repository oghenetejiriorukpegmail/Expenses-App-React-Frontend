/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Tells Tailwind where to look for classes
  ],
  theme: {
    extend: {
      // Custom theme extensions can be added here later
      // based on the styles from frontend/style.css
    },
  },
  plugins: [],
}