/** @type {import('tailwindcss').Config} */
export default {
  // Tailwind CSS v4 uses CSS-first configuration by default
  // This file is optional but provides additional customization options

  // Content paths for purging unused styles
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],

  // Dark mode configuration
  darkMode: ['class', '[data-theme="dark"]'],

  // Theme extensions (complementing CSS @theme)
  theme: {
    extend: {
      // Custom animations
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-up': 'slide-up 0.2s ease-out',
        'slide-down': 'slide-down 0.2s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        }
      },

      // Custom font families
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', 'monospace']
      },

      // Custom spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem'
      },

      // Custom max-widths
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem'
      },

      // Custom z-index
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100'
      },

      // Custom backdrop blur
      backdropBlur: {
        xs: '2px'
      },

      // Custom transitions
      transitionDuration: {
        '400': '400ms'
      },

      // Custom border radius
      borderRadius: {
        '4xl': '2rem'
      }
    }
  },

  // Plugins
  plugins: [
    // Typography plugin for rich text content
    require('@tailwindcss/typography')
  ],

  // Future flags for forward compatibility
  future: {
    hoverOnlyWhenSupported: true
  }
}
