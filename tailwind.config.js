/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}",],
  theme: {
    extend: {
      boxShadow: {
        'purple-glow': '0 0 20px 0 rgba(186, 118, 255, 0.6)'
      },
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
        'figmaBlack': '1e1e1e',
        'figmaGrey': '#2C2C2C',
        'figmaBorder': '#444444',
        'textWhite': 'rgba(255, 255, 255, 0.8)',
        'textGrey': '#b2b2b2',
        'stratusPurple': '#ff71cf',
        'stratusPurpleActive': 'rgb(126, 34, 206)',
        'scrollbarGrey': 'rgba(128, 128, 128, 0.1)',
      },
    },
  },
  plugins: [
    require('daisyui'),
    require('tailwind-scrollbar')
  ],
}

