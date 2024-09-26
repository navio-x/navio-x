 // tailwind.config.js
const plugin = require('tailwindcss/plugin');

module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    'node_modules/preline/dist/*.js',
    'node_modules/flowbite-vue/**/*.{js,jsx,ts,tsx}',
    'node_modules/flowbite/**/*.{js,jsx,ts,tsx}'      
    ],
    darkMode: 'class', // or 'media' or 'class'
    theme: {
      extend: {},
    },
    variants: {
      extend: {},
    },
    plugins: [
      require('@tailwindcss/forms'),
      require('flowbite/plugin'),
      plugin(function({ addVariant }) {
        addVariant('active', ['&:active', '&.router-link-active'])
      })
      ],
  }
