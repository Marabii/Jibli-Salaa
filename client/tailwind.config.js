/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#B88E2F",
        secondary: "#FAF3EA",
        customBeige: "#FFF3E3",
        customPink: "#E97171",
        customGrey: "#9F9F9F",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      size: {
        defaultIconSize: "28px",
      },
    },
  },
  plugins: [],
};
