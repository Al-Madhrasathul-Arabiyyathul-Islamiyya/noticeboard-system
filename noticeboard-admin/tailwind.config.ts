import { type Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          green: '#189543',
          red: '#DA231C',
          accent: '#F5A623',
          DEFAULT: '#189543',
        },
        secondary: {
          green: '#E8F5E9',
          red: '#FFEBEE',
          gold: '#FFF3E0',
        },
        neutral: {
          bg: '#F8FAFC',
          surface: '#F1F5F9',
          text: '#0F172A',
        },
        dark: {
          primary: {
            green: '#1FB954',
            red: '#E53935',
            accent: '#FFB74D',
          },
          secondary: {
            green: '#1B5E20',
            red: '#B71C1C',
            gold: '#FF8F00',
          },
          neutral: {
            bg: '#121212',
            surface: '#1E1E1E',
            text: '#FFFFFF',
          },
        },
      },
      fontFamily: {
        sans: ['Inter var', ...fontFamily.sans],
      },
    },
  },
} satisfies Config
