/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Современная молодежная палитра
        primary: '#6366f1', // индиго
        secondary: '#8b5cf6', // фиолетовый
        accent: '#ec4899', // розовый
        dark: '#1e293b', // темный
        light: '#f8fafc', // светлый
        gray: '#64748b', // серый
        success: '#10b981', // зеленый
        warning: '#f59e0b', // желтый
        error: '#ef4444', // красный
        // Градиенты
        gradient: {
          start: '#6366f1',
          end: '#8b5cf6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    }
  },
  plugins: []
};
