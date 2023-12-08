const colors = require('tailwindcss/colors');
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./src/**/*.{html,svelte}', './node_modules/svelte-ux/**/*.{svelte,js}'],
  theme: {
    extend: {
      colors: {
        base: colors.gray[800],
        basetext: colors.gray[50],
        content: colors.gray[200],
        contenttext: colors.gray[800],
        primary: colors.grey,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('svelte-ux/plugins/tailwind.cjs')],
};