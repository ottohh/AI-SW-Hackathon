import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      colors: {
        'text': '#021d06',
        'background': '#f6fef7',
        'primary': '#04580e',
        'secondary': '#75b5f5',
        'accent': '#6058f3',
        'white':"white"
       },
    },
  },

  plugins: [typography, forms]
} satisfies Config;
