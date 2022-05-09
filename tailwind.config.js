
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      sans: [
        'Atkinson Hyperlegible',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        '"Noto Sans"',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
        '"Noto Color Emoji"',
      ],
      serif: ['ui-serif', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
      mono: [
        'ui-monospace',
        'SFMono-Regular',
        'Menlo',
        'Monaco',
        'Consolas',
        '"Liberation Mono"',
        '"Courier New"',
        'monospace',
      ],
    },
    extend: {
      colors: {
        'grayish': {
          DEFAULT: '#757E8A',
          '50': '#D8DBDE',
          '100': '#CDD1D5',
          '200': '#B7BCC2',
          '300': '#A1A7AF',
          '400': '#8B939C',
          '500': '#757E8A',
          '600': '#596069',
          '700': '#3D4248',
          '800': '#212327',
          '900': '#050506'
        },
      }
    },
  },
  plugins: [],
};
