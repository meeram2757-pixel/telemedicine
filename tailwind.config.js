/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          red: "#C62C33",
          dark: "#1f2937",
        },
        secondary: {
          gray: "#475569",
        }
      },
      backgroundImage: {
        'medical': 'url(/src/assets/doctor-bulk-billing-doctors-chapel-hill-health-care-medical-3\ 1.png)',
      }
    },
  },
  plugins: [],
}
