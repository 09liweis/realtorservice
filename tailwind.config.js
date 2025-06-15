/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#0d7377',
        'primary-hover': '#085c5f'
      }
    }
  },
  plugins: []
}