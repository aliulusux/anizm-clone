/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      boxShadow: {
        glass: "0 10px 30px rgba(0,0,0,.12)"
      },
      backdropBlur: { xs: '2px' }
    }
  },
  plugins: []
};
