/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}",],
  theme: {
    extend: {
      fontFamily: {
        'custom': ['Montserrat Regular', ...defaultTheme.fontFamily.sans],
        'customlight': ['Montserrat Light', ...defaultTheme.fontFamily.sans],
        'logo': ['RedRose Bold', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'bgblack': '#212020',
        'spurple': '#BA76FF',
        'blockgrey': '#2A2A2A',
        'bordergrey': '#434343',
      },
    },
  },
  plugins: [],
}

