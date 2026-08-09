module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        bg: '#EEF1F4',
        surface: '#FFFFFF',
        ink: '#0C2340',
        'ink-muted': '#5A6B7D',
        primary: { DEFAULT: '#0C2340', soft: '#D8E4F0', strong: '#071628' },
        sea: { DEFAULT: '#2F8F8C', soft: '#D4EDEC', strong: '#247370' },
        coral: { DEFAULT: '#E07A5F', soft: '#F8E4DD' },
        border: '#D0D8E0',
      },
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        sans: ['Nunito Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
