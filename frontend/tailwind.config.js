/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1a1a2e', // глубокий синий
        stone: '#e7eaf6', // светлый голубой
        accent: '#ff6f61', // яркий коралловый
        highlight: '#3f72af', // насыщенный синий
        bgMusic: '#f9f7f7', // светлый фон
        cardMusic: '#dbe2ef', // карточки
        gold: '#ffd700', // акцент
      }
    }
  },
  plugins: []
};
