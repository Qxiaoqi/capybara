/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        junhe: {
          brown: "#ac9455",
          red: "#a51e41",
        },
      },
    },
  },
  plugins: [require("daisyui")],
}
