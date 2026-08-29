export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        canvas: '#F6F4EC',
        surface: '#FFFFFF',
        ink: {
          DEFAULT: '#16241C',
          muted: '#5A6B60',
          faint: '#8B9992',
        },
        line: {
          DEFAULT: '#E4E1D5',
          strong: '#CDC9B8',
        },
        leaf: {
          50: '#EFF6F1',
          100: '#D9EBDF',
          200: '#B0D5BC',
          400: '#4A9E6E',
          500: '#2E8B57',
          600: '#1F7345',
          700: '#175C37',
          900: '#0D3A23',
        },
        clay: {
          50: '#FCF3E9',
          100: '#F5E2CD',
          500: '#C2703A',
          600: '#A55A29',
          700: '#87481F',
        },
        rise: '#1F7345',
        fall: '#B3261E',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Inter Tight"', 'Inter', 'ui-sans-serif', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(22, 36, 28, 0.04), 0 8px 24px -16px rgba(22, 36, 28, 0.18)',
        panel: '0 24px 60px -24px rgba(22, 36, 28, 0.35)',
      },
      transitionTimingFunction: {
        swift: 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
    },
  },
  plugins: [],
}
