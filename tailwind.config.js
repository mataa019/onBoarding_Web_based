/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '375px',  // iPhone SE, small phones
        'sm': '640px',  // Large phones, small tablets
        'md': '768px',  // Tablets
        'lg': '1024px', // Laptops
        'xl': '1280px', // Desktops
        '2xl': '1536px' // Large desktops
      },
    },
  },
  plugins: [],
}

